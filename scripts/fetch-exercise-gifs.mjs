/**
 * Fetches exercise-specific images from wger.de (free, no API key needed)
 * and prints SQL UPDATE statements to replace generic images.
 *
 * Usage:
 *   node scripts/fetch-exercise-gifs.mjs > supabase/update_exercise_images.sql
 */

const WGER = 'https://wger.de/api/v2'

// Our exercise names mapped to keywords for fuzzy matching
const OUR_EXERCISES = [
  // chest
  'Barbell Bench Press - Medium Grip', 'Decline Barbell Bench Press',
  'Wide-Grip Barbell Bench Press', 'Incline Dumbbell Press',
  'Push-Up', 'Dumbbell Bench Press', 'Cable Crossover',
  'Dumbbell Flyes', 'Pec Deck Fly', 'Chest Dip',
  // back
  'Pull-Up', 'Lat Pulldown', 'Seated Cable Row',
  'One-Arm Dumbbell Row', 'T-Bar Row', 'Deadlift',
  'Face Pull', 'Hyperextensions (Back Extensions)', 'Good Morning',
  // legs
  'Barbell Squat', 'Front Barbell Squat', 'Goblet Squat', 'Hack Squat',
  'Leg Press', 'Dumbbell Lunge', 'Barbell Lunge',
  'Lying Leg Curl', 'Leg Extension', 'Romanian Deadlift', 'Calf Raise',
  // shoulders
  'Barbell Overhead Press', 'Dumbbell Shoulder Press',
  'Lateral Raise', 'Front Raise', 'Arnold Press', 'Rear Delt Fly',
  // arms
  'Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl',
  'Tricep Pushdown', 'Skull Crusher', 'Overhead Tricep Extension', 'Tricep Dip',
  // abs
  'Crunch', 'Plank', 'Hanging Leg Raise', 'Russian Twist',
  'Cable Crunch', 'Ab Wheel Rollout', 'Bicycle Crunch', 'Leg Raise',
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function escape(s) { return s.replace(/'/g, "''") }

function normalize(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function similarity(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return 1
  if (na.includes(nb) || nb.includes(na)) return 0.9
  const wa = new Set(na.split(' '))
  const wb = new Set(nb.split(' '))
  const common = [...wa].filter(w => wb.has(w) && w.length > 2).length
  return common / Math.max(wa.size, wb.size)
}

async function fetchAllImages() {
  const all = []
  let url = `${WGER}/exerciseimage/?format=json&limit=100&is_main=true`
  while (url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    const data = await res.json()
    all.push(...(data.results ?? []))
    url = data.next
    if (url) await sleep(200)
  }
  return all
}

async function fetchExerciseInfo(id) {
  const res = await fetch(`${WGER}/exerciseinfo/${id}/?format=json`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

async function main() {
  process.stderr.write('Fetching all wger exercise images...\n')
  const images = await fetchAllImages()
  process.stderr.write(`Got ${images.length} images\n`)

  // Unique exercise IDs that have images
  const exerciseIds = [...new Set(images.map(img => img.exercise))]
  process.stderr.write(`${exerciseIds.length} unique exercises have images — fetching names...\n\n`)

  // Build map: exerciseId → { name, imageUrl }
  const exerciseMap = new Map()
  let done = 0

  // Batch requests: 5 at a time
  for (let i = 0; i < exerciseIds.length; i += 5) {
    const batch = exerciseIds.slice(i, i + 5)
    const results = await Promise.all(batch.map(id => fetchExerciseInfo(id)))
    for (const info of results) {
      if (!info) continue
      // Get English name from translations
      const enTrans = info.translations?.find(t => t.language === 2)
      if (!enTrans?.name) continue
      const img = images.find(img => img.exercise === info.id)
      if (img) {
        exerciseMap.set(info.id, { name: enTrans.name, imageUrl: img.image })
      }
    }
    done += batch.length
    if (done % 20 === 0) process.stderr.write(`  ${done}/${exerciseIds.length} done...\n`)
    await sleep(150)
  }

  process.stderr.write(`\nBuilt map of ${exerciseMap.size} named exercises with images\n\n`)

  const wgerList = [...exerciseMap.values()]
  const updates = []
  const notFound = []

  for (const ourName of OUR_EXERCISES) {
    const scored = wgerList
      .map(w => ({ ...w, score: similarity(ourName, w.name) }))
      .filter(w => w.score > 0.3)
      .sort((a, b) => b.score - a.score)

    const best = scored[0]
    if (best && best.score >= 0.4) {
      updates.push({ ourName, imageUrl: best.imageUrl, wgerName: best.name, score: best.score })
      process.stderr.write(`✓ "${ourName}" → "${best.name}" (${(best.score * 100).toFixed(0)}%)\n`)
    } else {
      notFound.push(ourName)
      process.stderr.write(`✗ "${ourName}"${best ? ` (best: "${best.name}" ${(best.score * 100).toFixed(0)}%)` : ''}\n`)
    }
  }

  process.stderr.write(`\nMatched: ${updates.length}/${OUR_EXERCISES.length}\n`)
  if (notFound.length > 0) {
    process.stderr.write(`Not found: ${notFound.join(', ')}\n`)
  }

  if (updates.length === 0) {
    process.stderr.write('No matches — something went wrong.\n')
    process.exit(1)
  }

  console.log('-- Exercise image updates from wger.de')
  console.log(`-- Generated: ${new Date().toISOString()}`)
  console.log(`-- Matched ${updates.length}/${OUR_EXERCISES.length} exercises\n`)

  for (const { ourName, imageUrl } of updates) {
    console.log(`update exercises set image_url = '${escape(imageUrl)}' where name ilike '${escape(ourName)}';`)
  }

  console.log('\n-- Done')
}

main().catch(e => { process.stderr.write(e.stack + '\n'); process.exit(1) })
