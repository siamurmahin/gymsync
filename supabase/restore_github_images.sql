-- Restore all exercises to free-exercise-db github URLs
-- This re-enables the 2-frame cycling animation (0.jpg ↔ 1.jpg)
-- Run in Supabase dashboard → SQL Editor

-- ── CHEST ────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg' where name = 'Barbell Bench Press - Medium Grip';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg' where name = 'Decline Barbell Bench Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Barbell_Bench_Press/0.jpg' where name = 'Wide-Grip Barbell Bench Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Decline_Barbell_Bench_Press/0.jpg' where name = 'Wide-Grip Decline Barbell Bench Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Bench_With_Palms_Facing_In/0.jpg' where name = 'Incline Dumbbell Bench With Palms Facing In';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/0.jpg' where name = 'Incline Dumbbell Flyes';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes_-_With_A_Twist/0.jpg' where name = 'Incline Dumbbell Flyes - With A Twist';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg' where name = 'Incline Dumbbell Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Decline_Barbell_Pullover/0.jpg' where name = 'Wide-Grip Decline Barbell Pullover';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clock_Push-Up/0.jpg' where name = 'Clock Push-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Push-Up/0.jpg' where name = 'Decline Push-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up/0.jpg' where name = 'Incline Push-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Medium/0.jpg' where name = 'Incline Push-Up Medium';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Reverse_Grip/0.jpg' where name = 'Incline Push-Up Reverse Grip';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up/0.jpg' where name = 'Push-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg' where name = 'Dumbbell Flyes';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg' where name = 'Cable Crossover';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg' where name = 'Dumbbell Bench Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Dip/0.jpg' where name = 'Chest Dip';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pec_Deck_Fly/0.jpg' where name = 'Pec Deck Fly';

-- ── BACK ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Assisted_Pull-Up/0.jpg' where name = 'Band Assisted Pull-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rocky_Pull-Ups_Pulldowns/0.jpg' where name = 'Rocky Pull-Ups/Pulldowns';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Rear_Pull-Up/0.jpg' where name = 'Wide-Grip Rear Pull-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg' where name = 'Pullups';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pullup/0.jpg' where name = 'V-Bar Pullup';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg' where name = 'Barbell Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin-Up/0.jpg' where name = 'Chin-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Chin-Up/0.jpg' where name = 'One Arm Chin-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Scapular_Pull-Up/0.jpg' where name = 'Scapular Pull-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg' where name = 'Bent Over Barbell Row';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg' where name = 'Close-Grip Front Lat Pulldown';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/0.jpg' where name = 'Full Range-Of-Motion Lat Pulldown';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Lat_Pulldown/0.jpg' where name = 'One Arm Lat Pulldown';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg' where name = 'Wide-Grip Lat Pulldown';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Row/0.jpg' where name = 'Seated Cable Row';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg' where name = 'One-Arm Dumbbell Row';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row/0.jpg' where name = 'T-Bar Row';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg' where name = 'Barbell Shrug';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Good_Morning/0.jpg' where name = 'Good Morning';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/0.jpg' where name = 'Hyperextensions (Back Extensions)';

-- ── LEGS ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Side_Deadlift/0.jpg' where name = 'One-Arm Side Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg' where name = 'Romanian Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Barbell_Deadlift/0.jpg' where name = 'Stiff-Legged Barbell Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/0.jpg' where name = 'Stiff-Legged Dumbbell Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Deadlifts/0.jpg' where name = 'Cable Deadlifts';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_One-Legged_Deadlift/0.jpg' where name = 'Kettlebell One-Legged Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Deadlift/0.jpg' where name = 'Leverage Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Stiff-Legged_Deadlift/0.jpg' where name = 'Smith Machine Stiff-Legged Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Trap_Bar_Deadlift/0.jpg' where name = 'Trap Bar Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_Deadlift/0.jpg' where name = 'Clean Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Sumo_Deadlift/0.jpg' where name = 'Reverse Band Sumo Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift_from_Deficit/0.jpg' where name = 'Romanian Deadlift from Deficit';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_Deadlift/0.jpg' where name = 'Snatch Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Deadlift/0.jpg' where name = 'Sumo Deadlift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg' where name = 'Barbell Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/0.jpg' where name = 'Front Barbell Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg' where name = 'Goblet Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/0.jpg' where name = 'Hack Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg' where name = 'Leg Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunge/0.jpg' where name = 'Dumbbell Lunge';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Lunge/0.jpg' where name = 'Barbell Lunge';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curl/0.jpg' where name = 'Lying Leg Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg' where name = 'Leg Extensions';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg' where name = 'Standing Calf Raises';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg' where name = 'Seated Calf Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bulgarian_Split_Squat/0.jpg' where name = 'Bulgarian Split Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Step-up/0.jpg' where name = 'Step-up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wall_Squat/0.jpg' where name = 'Wall Squat';

-- ── SHOULDERS ────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Incline_Dumbbell_Raise/0.jpg' where name = 'Front Incline Dumbbell Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Handstand_Push-Ups/0.jpg' where name = 'Handstand Push-Ups';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/0.jpg' where name = 'Upright Barbell Row';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg' where name = 'Face Pull';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Turkish_Get-Up_Squat_style/0.jpg' where name = 'Kettlebell Turkish Get-Up (Squat style)';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Turkish_Get-Up_Lunge_style/0.jpg' where name = 'Kettlebell Turkish Get-Up (Lunge style)';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_One-Arm_Rear_Lateral_Raise/0.jpg' where name = 'Dumbbell Lying One-Arm Rear Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/0.jpg' where name = 'Dumbbell Lying Rear Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_One-Arm_Lateral_Raise/0.jpg' where name = 'Lying One-Arm Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise/0.jpg' where name = 'One-Arm Incline Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Side_Lateral_Raise/0.jpg' where name = 'Seated Side Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg' where name = 'Side Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Arnold_Press/0.jpg' where name = 'Kettlebell Arnold Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg' where name = 'Cable Seated Lateral Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg' where name = 'Barbell Shoulder Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg' where name = 'Dumbbell Shoulder Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg' where name = 'Arnold Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg' where name = 'Front Dumbbell Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/0.jpg' where name = 'Seated Barbell Military Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rear_Delt_Fly/0.jpg' where name = 'Rear Delt Fly';

-- ── ARMS ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg' where name = 'Close-Grip Barbell Bench Press';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Incline_Dumbbell_Curl/0.jpg' where name = 'Alternate Incline Dumbbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flexor_Incline_Dumbbell_Curls/0.jpg' where name = 'Flexor Incline Dumbbell Curls';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg' where name = 'Incline Dumbbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Push-Up_off_of_a_Dumbbell/0.jpg' where name = 'Close-Grip Push-Up off of a Dumbbell';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Close-Grip/0.jpg' where name = 'Incline Push-Up Close-Grip';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_-_Close_Triceps_Position/0.jpg' where name = 'Push-Ups - Close Triceps Position';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg' where name = 'Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curls_Lying_Against_An_Incline/0.jpg' where name = 'Barbell Curls Lying Against An Incline';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Standing_Barbell_Curl/0.jpg' where name = 'Close-Grip Standing Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_High_Bench_Barbell_Curl/0.jpg' where name = 'Lying High Bench Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Barbell_Curl/0.jpg' where name = 'Reverse Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Close-Grip_Concentration_Barbell_Curl/0.jpg' where name = 'Seated Close-Grip Concentration Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Standing_Barbell_Curl/0.jpg' where name = 'Wide-Grip Standing Barbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Dumbbell_Curl/0.jpg' where name = 'Dumbbell Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curl/0.jpg' where name = 'Hammer Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg' where name = 'Preacher Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Triceps_Pushdown/0.jpg' where name = 'Cable Triceps Pushdown';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Skullcrusher/0.jpg' where name = 'Skull Crusher';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips/0.jpg' where name = 'Tricep Dip';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curl/0.jpg' where name = 'Concentration Curl';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Dumbbell_Tricep_Extension/0.jpg' where name = 'Overhead Dumbbell Tricep Extension';

-- ── ABS ──────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross-Body_Crunch/0.jpg' where name = 'Cross-Body Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Oblique_Crunch/0.jpg' where name = 'Decline Oblique Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Reverse_Crunch/0.jpg' where name = 'Decline Reverse Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Gorilla_Chin_Crunch/0.jpg' where name = 'Gorilla Chin/Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bosu_Ball_Cable_Crunch_With_Side_Bends/0.jpg' where name = 'Bosu Ball Cable Crunch With Side Bends';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/0.jpg' where name = 'Cable Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Reverse_Crunch/0.jpg' where name = 'Cable Reverse Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Crunch/0.jpg' where name = 'Cable Seated Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists/0.jpg' where name = 'Kneeling Cable Crunch With Alternating Oblique Twists';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Crunch/0.jpg' where name = 'Rope Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Rope_Crunch/0.jpg' where name = 'Standing Rope Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Crunch_Machine/0.jpg' where name = 'Ab Crunch Machine';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunch_-_Hands_Overhead/0.jpg' where name = 'Crunch - Hands Overhead';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunch_-_Legs_On_Exercise_Ball/0.jpg' where name = 'Crunch - Legs On Exercise Ball';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg' where name = 'Plank';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg' where name = 'Hanging Leg Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/0.jpg' where name = 'Russian Twist';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycle_Crunches/0.jpg' where name = 'Bicycle Crunch';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Raises/0.jpg' where name = 'Leg Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Wheel_Rollout/0.jpg' where name = 'Ab Wheel Rollout';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/0.jpg' where name = 'Mountain Climbers';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit-Up/0.jpg' where name = 'Sit-Up';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V_Up/0.jpg' where name = 'V-Up';

-- ── BUTT / GLUTES ────────────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Jump_Squat/0.jpg' where name = 'Kneeling Jump Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Squat/0.jpg' where name = 'Kneeling Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pull_Through/0.jpg' where name = 'Pull Through';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flutter_Kicks/0.jpg' where name = 'Flutter Kicks';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Kickback/0.jpg' where name = 'Glute Kickback';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Extension_with_Bands/0.jpg' where name = 'Hip Extension with Bands';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Physioball_Hip_Bridge/0.jpg' where name = 'Physioball Hip Bridge';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Step-up_with_Knee_Raise/0.jpg' where name = 'Step-up with Knee Raise';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Legged_Cable_Kickback/0.jpg' where name = 'One-Legged Cable Kickback';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Glute_Bridge/0.jpg' where name = 'Barbell Glute Bridge';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg' where name = 'Barbell Hip Thrust';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butt_Lift_Bridge/0.jpg' where name = 'Butt Lift (Bridge)';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Downward_Facing_Balance/0.jpg' where name = 'Downward Facing Balance';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Lift/0.jpg' where name = 'Leg Lift';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg' where name = 'Barbell Full Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Hip_Thrust/0.jpg' where name = 'Single Leg Hip Thrust';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Squat/0.jpg' where name = 'Sumo Squat';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Donkey_Kicks/0.jpg' where name = 'Donkey Kicks';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Fire_Hydrant/0.jpg' where name = 'Fire Hydrant';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clamshell_Exercise/0.jpg' where name = 'Clamshell Exercise';

-- ── CARDIO (if any exist) ────────────────────────────────────────────────────
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jogging_Treadmill/0.jpg' where name ilike '%treadmill%' or name ilike '%jogging%';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Burpee/0.jpg' where name ilike '%burpee%';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jumping_Jacks/0.jpg' where name ilike '%jumping jack%';
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jump_Rope/0.jpg' where name ilike '%jump rope%' or name ilike '%skipping%';
