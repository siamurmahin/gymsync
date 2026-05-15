-- Supplemental exercises — run after exercises_seed.sql
-- Adds missing staples: squats, lunges, presses, curls, etc.

insert into exercises (name, muscle_group, image_url) values

  -- CHEST (missing staples)
  ('Push-Up', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up/0.jpg'),
  ('Dumbbell Flyes', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg'),
  ('Cable Crossover', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg'),
  ('Dumbbell Bench Press', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg'),
  ('Chest Dip', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Dip/0.jpg'),
  ('Pec Deck Fly', 'chest', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pec_Deck_Fly/0.jpg'),

  -- BACK (missing staples)
  ('Seated Cable Row', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Row/0.jpg'),
  ('One-Arm Dumbbell Row', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg'),
  ('T-Bar Row', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row/0.jpg'),
  ('Barbell Shrug', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg'),
  ('Good Morning', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Good_Morning/0.jpg'),
  ('Hyperextensions (Back Extensions)', 'back', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/0.jpg'),

  -- LEGS (biggest gap — only deadlifts existed)
  ('Barbell Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg'),
  ('Front Barbell Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/0.jpg'),
  ('Goblet Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg'),
  ('Hack Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/0.jpg'),
  ('Leg Press', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg'),
  ('Dumbbell Lunge', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunge/0.jpg'),
  ('Barbell Lunge', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Lunge/0.jpg'),
  ('Lying Leg Curl', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curl/0.jpg'),
  ('Leg Extensions', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg'),
  ('Standing Calf Raises', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg'),
  ('Seated Calf Raise', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg'),
  ('Bulgarian Split Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bulgarian_Split_Squat/0.jpg'),
  ('Step-up', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Step-up/0.jpg'),
  ('Wall Squat', 'legs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wall_Squat/0.jpg'),

  -- SHOULDERS (missing overhead presses)
  ('Barbell Shoulder Press', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg'),
  ('Dumbbell Shoulder Press', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg'),
  ('Arnold Press', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Press/0.jpg'),
  ('Front Dumbbell Raise', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg'),
  ('Seated Barbell Military Press', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/0.jpg'),
  ('Rear Delt Fly', 'shoulders', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rear_Delt_Fly/0.jpg'),

  -- ARMS (missing triceps + key biceps)
  ('Dumbbell Curl', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Curl/0.jpg'),
  ('Hammer Curl', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curl/0.jpg'),
  ('Preacher Curl', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg'),
  ('Cable Triceps Pushdown', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Triceps_Pushdown/0.jpg'),
  ('Skull Crusher', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Skull_Crusher/0.jpg'),
  ('Tricep Dip', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dip/0.jpg'),
  ('Concentration Curl', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curl/0.jpg'),
  ('Overhead Dumbbell Tricep Extension', 'arms', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Dumbbell_Tricep_Extension/0.jpg'),

  -- ABS (missing fundamentals)
  ('Plank', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg'),
  ('Hanging Leg Raise', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg'),
  ('Russian Twist', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/0.jpg'),
  ('Bicycle Crunch', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycle_Crunch/0.jpg'),
  ('Leg Raise', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Raise/0.jpg'),
  ('Ab Wheel Rollout', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Wheel_Rollout/0.jpg'),
  ('Mountain Climbers', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/0.jpg'),
  ('Sit-Up', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit-Up/0.jpg'),
  ('V-Up', 'abs', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Up/0.jpg'),

  -- BUTT / GLUTES (missing key movements)
  ('Barbell Full Squat', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg'),
  ('Single Leg Hip Thrust', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Hip_Thrust/0.jpg'),
  ('Sumo Squat', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Squat/0.jpg'),
  ('Donkey Kicks', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Donkey_Kicks/0.jpg'),
  ('Fire Hydrant', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Fire_Hydrant/0.jpg'),
  ('Clamshell Exercise', 'butt', 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clamshell_Exercise/0.jpg');
