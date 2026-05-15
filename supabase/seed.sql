-- Seed exercise library
insert into exercises (name, muscle_group, image_url) values
  -- Chest
  ('Bench Press',        'chest',     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Incline DB Press',   'chest',     'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Cable Flys',         'chest',     'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Push-ups',           'chest',     'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  -- Back
  ('Lat Pulldowns',      'back',      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('Seated Rows',        'back',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Pull-ups',           'back',      'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  ('Deadlifts',          'back',      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  -- Legs
  ('Squats',             'legs',      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  ('Leg Press',          'legs',      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Leg Extension',      'legs',      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('Hamstring Curls',    'legs',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  -- Shoulders
  ('Overhead Press',     'shoulders', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Lateral Raises',     'shoulders', 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  ('Face Pulls',         'shoulders', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  -- Arms
  ('Bicep Curls',        'arms',      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Tricep Pushdowns',   'arms',      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('Hammer Curls',       'arms',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Dips',               'arms',      'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  -- Abs
  ('Planks',             'abs',       'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  ('Hanging Leg Raises', 'abs',       'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Russian Twists',     'abs',       'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Crunches',           'abs',       'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  -- Chest (machine)
  ('Pec Deck Machine',   'chest',     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Chest Press Machine','chest',     'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Cable Crossover',    'chest',     'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  -- Back (machine)
  ('Cable Row Machine',  'back',      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('T-Bar Row',          'back',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Assisted Pull-up',   'back',      'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  -- Legs (machine)
  ('Hack Squat Machine', 'legs',      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  ('Calf Raises',        'legs',      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Hip Abductor',       'legs',      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('Glute Kickback',     'legs',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  -- Shoulders (machine)
  ('Machine Shoulder Press','shoulders','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Cable Lateral Raise','shoulders', 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  ('Rear Delt Fly Machine','shoulders','https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  -- Arms (machine)
  ('Cable Bicep Curl',   'arms',      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75'),
  ('Preacher Curl Machine','arms',    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&fm=webp&q=75'),
  ('Tricep Machine',     'arms',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&fm=webp&q=75'),
  ('Overhead Tricep Ext','arms',      'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&fm=webp&q=75'),
  -- Abs (machine)
  ('Cable Crunch',       'abs',       'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&fm=webp&q=75'),
  ('Ab Machine',         'abs',       'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fm=webp&q=75'),
  ('Decline Crunch',     'abs',       'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fm=webp&q=75');
