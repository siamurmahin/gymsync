-- Fix profiles table: add missing columns + expand goal check constraint
-- Run this in Supabase SQL editor

-- 1. Add missing columns (safe — IF NOT EXISTS won't error if already there)
alter table profiles
  add column if not exists gender text check (gender in ('male', 'female', 'other')),
  add column if not exists age integer,
  add column if not exists height numeric,
  add column if not exists height_unit text not null default 'cm' check (height_unit in ('cm', 'ft')),
  add column if not exists desired_body text check (desired_body in ('slim', 'athletic', 'muscular', 'bulky')),
  add column if not exists focus_areas jsonb,
  add column if not exists build_goals jsonb,
  add column if not exists equipment text check (equipment in ('none', 'basic', 'all')),
  add column if not exists workout_duration text check (workout_duration in ('30', '45', '60+')),
  add column if not exists weekly_plan jsonb;

-- 2. Expand goal constraint on profiles (old: fat_loss | muscle_gain | strength)
alter table profiles drop constraint if exists profiles_goal_check;
alter table profiles
  add constraint profiles_goal_check
  check (goal in ('fat_loss', 'muscle_gain', 'strength', 'endurance', 'max_strength', 'toned'));

-- 3. Expand goal constraint on workout_sessions (same old constraint)
alter table workout_sessions drop constraint if exists workout_sessions_goal_check;
alter table workout_sessions
  add constraint workout_sessions_goal_check
  check (goal in ('fat_loss', 'muscle_gain', 'strength', 'endurance', 'max_strength', 'toned'));
