/**
 * Fetches exercises from the free-exercise-db (open source, no API key needed)
 * and prints SQL INSERT statements ready to paste into Supabase SQL Editor.
 *
 * Usage: node scripts/seed-exercises.mjs > exercises_seed.sql
 */

const SOURCE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE   = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'

// Map primaryMuscles values → our MuscleGroup
const MUSCLE_MAP = {
  'chest':                  'chest',
  'middle chest':           'chest',
  'lower chest':            'chest',
  'upper chest':            'chest',
  'lats':                   'back',
  'middle back':            'back',
  'lower back':             'back',
  'traps':                  'back',
  'rhomboids':              'back',
  'quadriceps':             'legs',
  'hamstrings':             'legs',
  'calves':                 'legs',
  'adductors':              'legs',
  'abductors':              'legs',
  'glutes':                 'butt',
  'shoulders':              'shoulders',
  'front shoulders':        'shoulders',
  'side shoulders':         'shoulders',
  'rear shoulders':         'shoulders',
  'deltoids':               'shoulders',
  'biceps':                 'arms',
  'triceps':                'arms',
  'forearms':               'arms',
  'abdominals':             'abs',
  'obliques':               'abs',
}

const PER_GROUP = 14

const PRIORITY_KEYWORDS = [
  'barbell bench press','incline dumbbell','decline barbell','push-up','pushup',
  'cable crossover','dumbbell fly','chest dip','pec deck',
  'pull-up','pullup','chin-up','deadlift','barbell row','lat pulldown',
  'seated cable row','dumbbell row','face pull','hyperextension',
  'squat','leg press','romanian','leg curl','leg extension',
  'lunge','calf raise','goblet squat','hack squat',
  'overhead press','lateral raise','arnold press','front raise',
  'rear delt','shrug','upright row',
  'barbell curl','hammer curl','tricep pushdown','skull crusher',
  'preacher curl','close-grip','tricep dip',
  'crunch','plank','hanging leg raise','russian twist','ab wheel',
  'cable crunch','bicycle','leg raise',
]

function scoreExercise(ex) {
  const nameLower = ex.name.toLowerCase()
  const priorityIdx = PRIORITY_KEYWORDS.findIndex(p => nameLower.includes(p))
  let score = priorityIdx >= 0 ? 1000 - priorityIdx * 10 : 0
  // prefer strength/compound
  if (ex.category === 'strength') score += 30
  if (ex.mechanic === 'compound') score += 20
  if (ex.equipment === 'barbell') score += 15
  if (ex.equipment === 'dumbbell') score += 12
  if (ex.equipment === 'cable') score += 8
  return score
}

function escape(str) {
  return str.replace(/'/g, "''")
}

// Build image URL from the images array
function imgUrl(ex) {
  if (!ex.images || ex.images.length === 0) return null
  // images[0] is like "3_4_Sit-Up/0.jpg" or "Barbell_Squat/0.jpg"
  return `${IMG_BASE}/${ex.images[0]}`
}

async function main() {
  process.stderr.write('Fetching exercise database...\n')
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  const all = await res.json()
  process.stderr.write(`Fetched ${all.length} exercises\n`)

  // Group by our muscle groups
  const byGroup = {}
  for (const ex of all) {
    for (const muscle of (ex.primaryMuscles ?? [])) {
      const group = MUSCLE_MAP[muscle.toLowerCase()]
      if (!group) continue
      if (!byGroup[group]) byGroup[group] = []
      byGroup[group].push(ex)
    }
  }

  const rows = []
  const seenIds = new Set()

  for (const group of ['chest', 'back', 'legs', 'shoulders', 'arms', 'abs', 'butt']) {
    const exercises = byGroup[group] ?? []
    const unique = exercises.filter(e => !seenIds.has(e.id))
    const sorted = [...unique].sort((a, b) => scoreExercise(b) - scoreExercise(a))
    const picked = sorted.slice(0, PER_GROUP)
    for (const ex of picked) {
      seenIds.add(ex.id)
      rows.push({ name: ex.name, muscle_group: group, image_url: imgUrl(ex) })
    }
    process.stderr.write(`${group}: ${picked.length} exercises (pool: ${unique.length})\n`)
  }

  process.stderr.write(`\nTotal: ${rows.length} exercises\n`)

  console.log('-- Auto-generated exercise seed (free-exercise-db)')
  console.log('-- Generated:', new Date().toISOString())
  console.log(`-- Total: ${rows.length} exercises\n`)
  console.log(`-- Clear dependent data before deleting exercises
delete from set_completions
where workout_exercise_id in (
  select we.id from workout_exercises we
  join exercises e on e.id = we.exercise_id
  where e.created_by is null
);
delete from workout_exercises
where exercise_id in (select id from exercises where created_by is null);
delete from exercises where created_by is null;
`)

  console.log('insert into exercises (name, muscle_group, image_url) values')

  const lines = rows.map((r, i) => {
    const url = r.image_url ? `'${escape(r.image_url)}'` : 'null'
    return `  ('${escape(r.name)}', '${r.muscle_group}', ${url})${i < rows.length - 1 ? ',' : ';'}`
  })
  console.log(lines.join('\n'))
}

main().catch(e => { process.stderr.write(e.message + '\n'); process.exit(1) })
