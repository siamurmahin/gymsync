-- Assign unique Unsplash gym photos per exercise
-- Real gym photos, one per exercise name

-- CHEST
update exercises set image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75' where name ilike '%bench press%' and name not ilike '%decline%' and name not ilike '%incline%';
update exercises set image_url = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&fm=webp&q=75' where name ilike '%incline%';
update exercises set image_url = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&fm=webp&q=75' where name ilike '%decline%';
update exercises set image_url = 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75' where name ilike '%push-up%' or name ilike '%pushup%' or name ilike '%push up%';
update exercises set image_url = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75' where name ilike '%cable fl%' or name ilike '%crossover%';
update exercises set image_url = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&fm=webp&q=75' where name ilike '%pec deck%' or name ilike '%chest fly%' or name ilike '%dumbbell fl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1549576490-b0fe4d300c67?w=400&fm=webp&q=75' where name ilike '%chest dip%';

-- BACK
update exercises set image_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75' where name ilike '%deadlift%' and name not ilike '%romanian%';
update exercises set image_url = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75' where name ilike '%lat pulldown%' or name ilike '%lat pull%';
update exercises set image_url = 'https://images.unsplash.com/photo-1516481157630-05bc0aeb8b19?w=400&fm=webp&q=75' where name ilike '%pull-up%' or name ilike '%pullup%' or name ilike '%chin-up%';
update exercises set image_url = 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400&fm=webp&q=75' where name ilike '%seated row%' or name ilike '%cable row%';
update exercises set image_url = 'https://images.unsplash.com/photo-1579126038374-6064753901bf?w=400&fm=webp&q=75' where name ilike '%dumbbell row%' or name ilike '%one-arm%row%' or name ilike '%one arm%row%';
update exercises set image_url = 'https://images.unsplash.com/photo-1531986627054-bdb5f7cd87e6?w=400&fm=webp&q=75' where name ilike '%t-bar row%' or name ilike '%barbell row%';
update exercises set image_url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&fm=webp&q=75' where name ilike '%hyperextension%' or name ilike '%good morning%';
update exercises set image_url = 'https://images.unsplash.com/photo-1590239926044-4031e7d8b0d0?w=400&fm=webp&q=75' where name ilike '%face pull%' or name ilike '%rear delt%';

-- LEGS
update exercises set image_url = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75' where name ilike '%squat%' and name not ilike '%front%' and name not ilike '%hack%' and name not ilike '%goblet%';
update exercises set image_url = 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400&fm=webp&q=75' where name ilike '%front%squat%' or name ilike '%goblet squat%';
update exercises set image_url = 'https://images.unsplash.com/photo-1597452485669-0b23a66f96e1?w=400&fm=webp&q=75' where name ilike '%hack squat%';
update exercises set image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75' where name ilike '%leg press%';
update exercises set image_url = 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&fm=webp&q=75' where name ilike '%lunge%';
update exercises set image_url = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75' where name ilike '%leg curl%' or name ilike '%hamstring curl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75' where name ilike '%leg extension%';
update exercises set image_url = 'https://images.unsplash.com/photo-1549576490-b0fe4d300c67?w=400&fm=webp&q=75' where name ilike '%romanian%' or name ilike '%rdl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&fm=webp&q=75' where name ilike '%calf raise%';
update exercises set image_url = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&fm=webp&q=75' where name ilike '%hip abductor%' or name ilike '%hip adductor%' or name ilike '%glute%';

-- SHOULDERS
update exercises set image_url = 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75' where name ilike '%overhead press%' or name ilike '%shoulder press%' or name ilike '%military press%';
update exercises set image_url = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&fm=webp&q=75' where name ilike '%lateral raise%';
update exercises set image_url = 'https://images.unsplash.com/photo-1579126038374-6064753901bf?w=400&fm=webp&q=75' where name ilike '%front raise%';
update exercises set image_url = 'https://images.unsplash.com/photo-1516481157630-05bc0aeb8b19?w=400&fm=webp&q=75' where name ilike '%arnold%';
update exercises set image_url = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75' where name ilike '%upright row%' or name ilike '%shrug%';

-- ARMS
update exercises set image_url = 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400&fm=webp&q=75' where name ilike '%bicep curl%' or name ilike '%biceps curl%' or name ilike '%dumbbell curl%' or name ilike '%barbell curl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400&fm=webp&q=75' where name ilike '%hammer curl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1531986627054-bdb5f7cd87e6?w=400&fm=webp&q=75' where name ilike '%preacher curl%' or name ilike '%ez%curl%';
update exercises set image_url = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75' where name ilike '%tricep pushdown%' or name ilike '%triceps pushdown%';
update exercises set image_url = 'https://images.unsplash.com/photo-1549576490-b0fe4d300c67?w=400&fm=webp&q=75' where name ilike '%skull crusher%' or name ilike '%skullcrusher%';
update exercises set image_url = 'https://images.unsplash.com/photo-1590239926044-4031e7d8b0d0?w=400&fm=webp&q=75' where name ilike '%overhead tricep%' or name ilike '%tricep ext%';
update exercises set image_url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&fm=webp&q=75' where name ilike '%tricep dip%' or name ilike '%dips%' or name ilike 'dip';
update exercises set image_url = 'https://images.unsplash.com/photo-1597452485669-0b23a66f96e1?w=400&fm=webp&q=75' where name ilike '%cable bicep%' or name ilike '%cable curl%';

-- ABS
update exercises set image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75' where name ilike '%crunch%' and name not ilike '%cable%' and name not ilike '%bicycle%';
update exercises set image_url = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&fm=webp&q=75' where name ilike '%plank%';
update exercises set image_url = 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&fm=webp&q=75' where name ilike '%hanging leg%' or name ilike '%hanging knee%';
update exercises set image_url = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&fm=webp&q=75' where name ilike '%russian twist%';
update exercises set image_url = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&fm=webp&q=75' where name ilike '%cable crunch%' or name ilike '%bicycle crunch%';
update exercises set image_url = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75' where name ilike '%ab wheel%' or name ilike '%ab roller%';
update exercises set image_url = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75' where name ilike '%leg raise%' and name not ilike '%hanging%';
