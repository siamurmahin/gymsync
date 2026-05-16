/**
 * Generates supabase/expand_muscle_groups.sql
 * - Drops old 6-group check constraint
 * - Adds new 10-group constraint
 * - Updates ALL exercises to correct specific muscle group using free-exercise-db data
 *
 * Run: node scripts/gen-muscle-migration.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const EXERCISES_JSON_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

// New specific muscle map — 10 groups allowed in DB
const MUSCLE_MAP = {
  abdominals:    'abs',
  abductors:     'legs',
  adductors:     'legs',
  biceps:        'biceps',
  calves:        'calves',
  chest:         'chest',
  forearms:      'forearms',
  glutes:        'glutes',
  hamstrings:    'legs',
  lats:          'back',
  'lower back':  'back',
  'middle back': 'back',
  traps:         'shoulders',
  neck:          'shoulders',
  quadriceps:    'legs',
  shoulders:     'shoulders',
  triceps:       'triceps',
  'hip flexors': 'legs',
  brachialis:    'biceps',
  'inner thighs':'legs',
  'it band':     'legs',
};

function mapMuscle(primaryMuscles) {
  if (!primaryMuscles?.length) return 'abs';
  const m = primaryMuscles[0].toLowerCase();
  return MUSCLE_MAP[m] || 'abs';
}

function escape(str) {
  return str.replace(/'/g, "''");
}

async function main() {
  console.log('Fetching exercise list...');
  const res = await fetch(EXERCISES_JSON_URL);
  const exercises = await res.json();
  console.log(`Fetched ${exercises.length} exercises`);

  // Build name → muscleGroup map
  const nameToGroup = new Map();
  for (const ex of exercises) {
    nameToGroup.set(ex.name.toLowerCase(), mapMuscle(ex.primaryMuscles));
  }

  // Generate UPDATE statements grouped by muscle group
  // Group exercises by their target muscle group for batch UPDATEs
  const byGroup = {};
  for (const [name, group] of nameToGroup) {
    if (!byGroup[group]) byGroup[group] = [];
    byGroup[group].push(name);
  }

  const updateBlocks = Object.entries(byGroup).map(([group, names]) => {
    const inList = names.map(n => `'${escape(n)}'`).join(',\n    ');
    return `update exercises set muscle_group = '${group}'
where lower(name) in (
    ${inList}
);`;
  }).join('\n\n');

  const sql = `-- Expand muscle groups from 6 to 10 specific groups
-- Generated: ${new Date().toISOString()}
--
-- Old groups: chest | back | legs | shoulders | arms | abs
-- New groups: chest | back | legs | shoulders | biceps | triceps | forearms | abs | glutes | calves
--
-- Steps:
--   1. Drop old check constraint
--   2. Update all exercises to specific muscle groups (using free-exercise-db data)
--   3. Set unmapped exercises default (abs)
--   4. Add new check constraint

-- Step 1: Drop old constraint
alter table exercises
  drop constraint if exists exercises_muscle_group_check;

-- Step 2: Update exercises by name using free-exercise-db muscle data
${updateBlocks}

-- Step 3: Fix any remaining old broad values not caught by name matching
update exercises set muscle_group = 'biceps'   where muscle_group = 'arms';
update exercises set muscle_group = 'chest'    where muscle_group = 'cardio';
update exercises set muscle_group = 'glutes'   where muscle_group = 'butt';

-- Step 4: Safety net — catch anything still not in the new allowed list
update exercises set muscle_group = 'abs'
where muscle_group not in ('chest','back','legs','shoulders','biceps','triceps','forearms','abs','glutes','calves');

-- Step 5: Add new constraint
alter table exercises
  add constraint exercises_muscle_group_check
  check (muscle_group in ('chest','back','legs','shoulders','biceps','triceps','forearms','abs','glutes','calves'));
`;

  const out = path.join(ROOT, 'supabase', 'expand_muscle_groups.sql');
  fs.writeFileSync(out, sql, 'utf8');
  console.log(`Generated: ${out}`);

  // Summary
  for (const [g, names] of Object.entries(byGroup).sort((a,b) => b[1].length - a[1].length)) {
    console.log(`  ${g.padEnd(12)} ${names.length}`);
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
