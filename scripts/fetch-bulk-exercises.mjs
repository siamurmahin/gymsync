/**
 * Fetches all exercises from free-exercise-db and generates:
 *   supabase/bulk_exercises.sql         — INSERT new exercises only
 *   supabase/bulk_exercises_rollback.sql — DELETE those same exercises (undo)
 *
 * Run: node scripts/fetch-bulk-exercises.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const EXERCISES_JSON_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

// Map free-exercise-db primaryMuscles → our muscle_group values
// Allowed values in DB: chest | back | legs | shoulders | arms | abs
const MUSCLE_MAP = {
  abdominals:    'abs',
  abductors:     'legs',
  adductors:     'legs',
  biceps:        'arms',
  calves:        'legs',
  chest:         'chest',
  forearms:      'arms',
  glutes:        'legs',
  hamstrings:    'legs',
  lats:          'back',
  'lower back':  'back',
  'middle back': 'back',
  traps:         'shoulders',
  neck:          'shoulders',
  quadriceps:    'legs',
  shoulders:     'shoulders',
  triceps:       'arms',
  'hip flexors': 'legs',
  brachialis:    'arms',
  'inner thighs':'legs',
  'it band':     'legs',
};

function mapMuscle(primaryMuscles) {
  if (!primaryMuscles?.length) return 'abs';
  const m = primaryMuscles[0].toLowerCase();
  return MUSCLE_MAP[m] || 'abs';
}

function exerciseIdFromName(name) {
  // free-exercise-db uses underscores in folder names
  return name.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function escape(str) {
  return str.replace(/'/g, "''");
}

// Collect existing exercise names from seed files
function getExistingNames() {
  const names = new Set();
  const seedFiles = ['exercises_seed.sql', 'more_exercises.sql', 'supabase/restore_github_images.sql'];
  for (const f of seedFiles) {
    const fp = path.join(ROOT, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    // Extract names from insert lines
    const matches = content.matchAll(/'\s*((?:[^']|'')+?)\s*',\s*'[^']+',\s*'https:/g);
    for (const m of matches) {
      names.add(m[1].toLowerCase().replace(/''/g, "'"));
    }
  }
  return names;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  console.log('Fetching exercise list from free-exercise-db...');
  const allExercises = await fetchJson(EXERCISES_JSON_URL);
  console.log(`Total in free-exercise-db: ${allExercises.length}`);

  const existingNames = getExistingNames();
  console.log(`Existing in our DB: ~${existingNames.size}`);

  // Filter out already-existing exercises
  const newExercises = allExercises.filter(ex => {
    const nameLower = ex.name.toLowerCase();
    return !existingNames.has(nameLower);
  });

  console.log(`New exercises to add: ${newExercises.length}`);

  if (newExercises.length === 0) {
    console.log('Nothing to add — all exercises already exist.');
    return;
  }

  // Generate INSERT SQL
  const now = new Date().toISOString();
  const insertLines = newExercises.map(ex => {
    const id = ex.id || exerciseIdFromName(ex.name);
    const imageUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${id}/0.jpg`;
    const muscleGroup = mapMuscle(ex.primaryMuscles);
    return `  ('${escape(ex.name)}', '${muscleGroup}', '${imageUrl}')`;
  });

  const insertSql = `-- Bulk import from free-exercise-db
-- Generated: ${now}
-- New exercises: ${newExercises.length}
-- To UNDO this import, run: supabase/bulk_exercises_rollback.sql

insert into exercises (name, muscle_group, image_url)
select v.name, v.muscle_group, v.image_url
from (values
${insertLines.join(',\n')}
) as v(name, muscle_group, image_url)
where not exists (
  select 1 from exercises e where lower(e.name) = lower(v.name)
);
`;

  // Generate ROLLBACK SQL
  const rollbackNames = newExercises.map(ex => `'${escape(ex.name)}'`).join(',\n  ');
  const rollbackSql = `-- Rollback bulk import — deletes only the bulk-imported exercises
-- Generated: ${now}
-- Exercises to remove: ${newExercises.length}
--
-- WARNING: Also removes any workout_exercises referencing these exercises.
-- Run this only if you want to undo the bulk import.

delete from set_completions
where workout_exercise_id in (
  select we.id from workout_exercises we
  join exercises e on e.id = we.exercise_id
  where e.name in (
  ${rollbackNames}
  )
);

delete from workout_exercises
where exercise_id in (
  select id from exercises where name in (
  ${rollbackNames}
  )
);

delete from exercises
where name in (
  ${rollbackNames}
);
`;

  const outInsert = path.join(ROOT, 'supabase', 'bulk_exercises.sql');
  const outRollback = path.join(ROOT, 'supabase', 'bulk_exercises_rollback.sql');

  fs.writeFileSync(outInsert, insertSql, 'utf8');
  fs.writeFileSync(outRollback, rollbackSql, 'utf8');

  console.log(`\nGenerated:`);
  console.log(`  ${outInsert}`);
  console.log(`  ${outRollback}`);
  console.log(`\nTo add exercises:   run supabase/bulk_exercises.sql in Supabase SQL editor`);
  console.log(`To undo:            run supabase/bulk_exercises_rollback.sql`);

  // Print breakdown by muscle group
  const byGroup = {};
  for (const ex of newExercises) {
    const g = mapMuscle(ex.primaryMuscles);
    byGroup[g] = (byGroup[g] || 0) + 1;
  }
  console.log('\nBreakdown by muscle group:');
  for (const [g, count] of Object.entries(byGroup).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${g.padEnd(12)} ${count}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
