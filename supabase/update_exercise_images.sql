-- Exercise image updates — wger.de exercise-specific images
-- Generated: 2026-05-15
-- Replaces generic Unsplash photos with proper exercise demonstration images
-- Run this in Supabase dashboard → SQL Editor

-- ── CHEST ────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/192/Bench-press-1.png'
  where name ilike '%bench press%' and name not ilike '%decline%' and name not ilike '%incline%';

update exercises set image_url = 'https://wger.de/media/exercise-images/100/Decline-bench-press-1.png'
  where name ilike '%decline%bench press%' or name ilike '%decline barbell bench%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1277/9f3c7817-3e3d-417d-8b08-2c0a1aa5fe03.jpg'
  where name ilike '%incline%press%' or name ilike '%incline dumbbell%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1551/a6a9e561-3965-45c6-9f2b-ee671e1a3a45.png'
  where name ilike 'push-up%' or name ilike 'push up%' or name ilike 'pushup%';

-- Dumbbell Flyes — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg'
  where name ilike '%dumbbell fl%' or name ilike '%db fl%';

-- Cable Crossover — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg'
  where name ilike '%cable crossover%' or name ilike '%cable cross%';

-- Pec Deck
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pec_Deck_Fly/0.jpg'
  where name ilike '%pec deck%';

-- Chest Dip
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Dip/0.jpg'
  where name ilike '%chest dip%';

-- ── BACK ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/475/b0554016-16fd-4dbe-be47-a2a17d16ae0e.jpg'
  where name ilike '%pull-up%' or name ilike '%pullup%' or name ilike '%pull up%' or name ilike '%chin-up%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1635/b8c34e3a-7474-41ea-99e3-8d7fdb1e12d6.png'
  where name ilike '%lat pulldown%' or name ilike '%lat pull%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1117/e74255c0-67a0-4309-b78d-2d79e6ff8c11.png'
  where name ilike '%seated cable row%' or name ilike '%seated row%' or name ilike '%cable row%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1186/1987a039-cf35-437e-bbdc-40c53dd7d053.jpg'
  where name ilike '%one-arm%row%' or name ilike '%one arm%row%' or name ilike '%single arm%row%' or name ilike '%dumbbell row%';

update exercises set image_url = 'https://wger.de/media/exercise-images/693/05c91bd2-7814-40b6-b2d1-51ae942b8321.png'
  where name ilike '%t-bar row%' or name ilike '%t bar row%';

update exercises set image_url = 'https://wger.de/media/exercise-images/161/Dead-lifts-2.png'
  where name ilike '%deadlift%' and name not ilike '%romanian%' and name not ilike '%sumo%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1639/8927346e-f5ca-4795-bdf1-5ac9309401e7.webp'
  where name ilike '%face pull%';

update exercises set image_url = 'https://wger.de/media/exercise-images/128/Hyperextensions-1.png'
  where name ilike '%hyperextension%';

update exercises set image_url = 'https://wger.de/media/exercise-images/116/Good-mornings-2.png'
  where name ilike '%good morning%';

-- ── LEGS ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/1801/60043328-1cfb-4289-9865-aaf64d5aaa28.jpg'
  where name ilike '%barbell squat%' or name = 'Squat' or name ilike 'Back Squat';

update exercises set image_url = 'https://wger.de/media/exercise-images/1640/bdea82f1-15ef-4649-8b5a-1303cfc178e7.webp'
  where name ilike '%front%squat%';

update exercises set image_url = 'https://wger.de/media/exercise-images/203/1c052351-2af0-4227-aeb0-244008e4b0a8.jpeg'
  where name ilike '%goblet squat%';

update exercises set image_url = 'https://wger.de/media/exercise-images/456/3b681e59-377b-40db-9113-ca5873ce084b.jpg'
  where name ilike '%hack squat%';

update exercises set image_url = 'https://wger.de/media/exercise-images/371/d2136f96-3a43-4d4c-9944-1919c4ca1ce1.webp'
  where name ilike '%leg press%';

update exercises set image_url = 'https://wger.de/media/exercise-images/113/Walking-lunges-1.png'
  where name ilike '%lunge%';

update exercises set image_url = 'https://wger.de/media/exercise-images/364/b318dde9-f5f2-489f-940a-cd864affb9e3.png'
  where name ilike '%leg curl%' or name ilike '%hamstring curl%';

update exercises set image_url = 'https://wger.de/media/exercise-images/369/78c915d1-e46d-4d30-8124-65d68664c3ef.png'
  where name ilike '%leg extension%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1652/0306c8c0-70cc-45d4-92de-6fa72ceaa834.webp'
  where name ilike '%romanian%' or name ilike '%rdl%';

update exercises set image_url = 'https://wger.de/media/exercise-images/622/9a429bd0-afd3-4ad0-8043-e9beec901c81.jpeg'
  where name ilike '%calf raise%' or name ilike '%calf raises%';

-- ── SHOULDERS ────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png'
  where name ilike '%overhead press%' or name ilike '%shoulder press%' or name ilike '%military press%';

update exercises set image_url = 'https://wger.de/media/exercise-images/148/lateral-dumbbell-raises-large-2.png'
  where name ilike '%lateral raise%';

update exercises set image_url = 'https://wger.de/media/exercise-images/256/b7def5bc-2352-499b-b9e5-fff741003831.png'
  where name ilike '%front raise%';

-- Arnold Press — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg'
  where name ilike '%arnold%';

update exercises set image_url = 'https://wger.de/media/exercise-images/822/74affc0d-03b6-4f33-b5f4-a822a2615f68.png'
  where name ilike '%rear delt%';

-- ── ARMS ─────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/51/f1730f56-7aca-4566-8338-3e42b1bee6e1.webp'
  where name ilike '%barbell curl%' or name ilike '%ez%curl%';

-- Dumbbell Curl — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Dumbbell_Curl/0.jpg'
  where (name ilike '%dumbbell curl%' or name ilike '%bicep curl%' or name ilike '%bicep curls%')
    and name not ilike '%hammer%' and name not ilike '%preacher%' and name not ilike '%incline%';

update exercises set image_url = 'https://wger.de/media/exercise-images/86/Bicep-hammer-curl-1.png'
  where name ilike '%hammer curl%';

update exercises set image_url = 'https://wger.de/media/exercise-images/193/Preacher-curl-3-1.png'
  where name ilike '%preacher curl%';

update exercises set image_url = 'https://wger.de/media/exercise-images/805/7a437824-e2cc-46e1-804a-674f0ea31d25.png'
  where name ilike '%tricep pushdown%' or name ilike '%triceps pushdown%';

-- Skull Crusher — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Skullcrusher/0.jpg'
  where name ilike '%skull crusher%' or name ilike '%skullcrusher%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1519/fab7f641-27d4-40b5-8edd-1a0a137bfd94.gif'
  where name ilike '%overhead tricep%' or name ilike '%overhead triceps%' or name ilike '%tricep ext%';

-- Tricep Dip — corrected (free-exercise-db)
update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/0.jpg'
  where name ilike '%tricep dip%' or name ilike '%triceps dip%';

update exercises set image_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips/0.jpg'
  where name ilike 'dips' or name ilike 'dip';

-- ── ABS ──────────────────────────────────────────────────────────────────────
update exercises set image_url = 'https://wger.de/media/exercise-images/91/Crunches-1.png'
  where name ilike '%crunch%' and name not ilike '%cable%' and name not ilike '%bicycle%' and name not ilike '%decline%';

update exercises set image_url = 'https://wger.de/media/exercise-images/458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png'
  where name ilike '%plank%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1243/53d4fabe-c994-4907-873f-8d82813a9832.png'
  where name ilike '%hanging leg raise%' or name ilike '%hanging knee%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1193/70ca5d80-3847-4a8c-8882-c6e9e485e29e.png'
  where name ilike '%russian twist%';

update exercises set image_url = 'https://wger.de/media/exercise-images/176/Cross-body-crunch-1.png'
  where name ilike '%cable crunch%' or name ilike '%bicycle crunch%';

update exercises set image_url = 'https://wger.de/media/exercise-images/1573/a9ab402b-61ef-4d60-b91a-df52bf7f41a9.jpg'
  where name ilike '%ab wheel%' or name ilike '%ab roller%';

update exercises set image_url = 'https://wger.de/media/exercise-images/125/Leg-raises-2.png'
  where name ilike '%leg raise%' and name not ilike '%hanging%';
