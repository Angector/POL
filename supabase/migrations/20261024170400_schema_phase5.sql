-- ============================================================
-- Mind Citadel – Phase 5 Schema: Habits & Goals
-- ============================================================

-- ============================================================
-- 1. TABLE: habits
-- ============================================================

create table if not exists public.habits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null check (category in ('internal', 'external')),
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
  points int not null default 3 check (points between 1 and 10),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "habits_select_own" on public.habits;  drop policy if exists "habits_select_own" on public.habits;  create policy "habits_select_own" on public.habits for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "habits_insert_own" on public.habits;  drop policy if exists "habits_insert_own" on public.habits;  create policy "habits_insert_own" on public.habits for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "habits_update_own" on public.habits;  drop policy if exists "habits_update_own" on public.habits;  create policy "habits_update_own" on public.habits for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "habits_delete_own" on public.habits;  drop policy if exists "habits_delete_own" on public.habits;  create policy "habits_delete_own" on public.habits for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 2. TABLE: habit_logs
-- ============================================================

create table if not exists public.habit_logs (
  id bigint generated always as identity primary key,
  habit_id bigint not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default true,
  points_earned int not null default 0,
  created_at timestamptz not null default now(),
  unique(habit_id, log_date)
);

alter table public.habit_logs enable row level security;

drop policy if exists "habit_logs_select_own" on public.habit_logs;  drop policy if exists "habit_logs_select_own" on public.habit_logs;  create policy "habit_logs_select_own" on public.habit_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "habit_logs_insert_own" on public.habit_logs;  drop policy if exists "habit_logs_insert_own" on public.habit_logs;  create policy "habit_logs_insert_own" on public.habit_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "habit_logs_delete_own" on public.habit_logs;  drop policy if exists "habit_logs_delete_own" on public.habit_logs;  create policy "habit_logs_delete_own" on public.habit_logs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- No update policy - logs are immutable

-- ============================================================
-- 3. TABLE: goals
-- ============================================================

create table if not exists public.goals (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  target_value numeric not null default 100 check (target_value > 0),
  current_value numeric not null default 0 check (current_value >= 0),
  unit text not null default 'واحد',
  start_date date not null default current_date,
  deadline date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

drop policy if exists "goals_select_own" on public.goals;  drop policy if exists "goals_select_own" on public.goals;  create policy "goals_select_own" on public.goals for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "goals_insert_own" on public.goals;  drop policy if exists "goals_insert_own" on public.goals;  create policy "goals_insert_own" on public.goals for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "goals_update_own" on public.goals;  drop policy if exists "goals_update_own" on public.goals;  create policy "goals_update_own" on public.goals for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "goals_delete_own" on public.goals;  drop policy if exists "goals_delete_own" on public.goals;  create policy "goals_delete_own" on public.goals for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 4. TABLE: goal_updates
-- ============================================================

create table if not exists public.goal_updates (
  id bigint generated always as identity primary key,
  goal_id bigint not null references public.goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta numeric not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.goal_updates enable row level security;

drop policy if exists "goal_updates_select_own" on public.goal_updates;  drop policy if exists "goal_updates_select_own" on public.goal_updates;  create policy "goal_updates_select_own" on public.goal_updates for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "goal_updates_insert_own" on public.goal_updates;  drop policy if exists "goal_updates_insert_own" on public.goal_updates;  create policy "goal_updates_insert_own" on public.goal_updates for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "goal_updates_delete_own" on public.goal_updates;  drop policy if exists "goal_updates_delete_own" on public.goal_updates;  create policy "goal_updates_delete_own" on public.goal_updates for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 5. FUNCTION: toggle_habit
-- ============================================================

create or replace function public.toggle_habit(
  p_habit_id bigint,
  p_date date default current_date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_habit record;
  v_log record;
  v_willpower int;
  v_total_points int;
begin
  -- Get current user
  v_user_id := (select auth.uid());
  
  -- Get habit and verify ownership
  select * into v_habit
  from public.habits
  where id = p_habit_id and user_id = v_user_id;
  
  if not found then
    raise exception 'عادت یافت نشد';
  end if;
  
  -- Check if log exists for this date
  select * into v_log
  from public.habit_logs
  where habit_id = p_habit_id and log_date = p_date;
  
  if found then
    -- Log exists - delete it and subtract points
    delete from public.habit_logs
    where id = v_log.id;
    
    update public.profiles
    set
      willpower = willpower - v_log.points_earned,
      total_points = total_points - v_log.points_earned
    where id = v_user_id
    returning willpower, total_points into v_willpower, v_total_points;
    
    return jsonb_build_object(
      'completed', false,
      'willpower', v_willpower,
      'total_points', v_total_points
    );
  else
    -- Log doesn't exist - insert it and add points
    insert into public.habit_logs (habit_id, user_id, log_date, completed, points_earned)
    values (p_habit_id, v_user_id, p_date, true, v_habit.points);
    
    update public.profiles
    set
      willpower = willpower + v_habit.points,
      total_points = total_points + v_habit.points
    where id = v_user_id
    returning willpower, total_points into v_willpower, v_total_points;
    
    return jsonb_build_object(
      'completed', true,
      'willpower', v_willpower,
      'total_points', v_total_points
    );
  end if;
end;
$$;

grant execute on function public.toggle_habit(bigint, date) to authenticated;

-- ============================================================
-- 6. FUNCTION: add_goal_progress
-- ============================================================

create or replace function public.add_goal_progress(
  p_goal_id bigint,
  p_delta numeric,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_goal record;
  v_new_value numeric;
  v_progress_pct numeric;
begin
  -- Get current user
  v_user_id := (select auth.uid());
  
  -- Get goal and verify ownership
  select * into v_goal
  from public.goals
  where id = p_goal_id and user_id = v_user_id;
  
  if not found then
    raise exception 'هدف یافت نشد';
  end if;
  
  -- Calculate new value (clamp to target)
  v_new_value := least(v_goal.current_value + p_delta, v_goal.target_value);
  v_progress_pct := (v_new_value / v_goal.target_value) * 100;
  
  -- Update goal
  update public.goals
  set current_value = v_new_value
  where id = p_goal_id;
  
  -- Insert update record
  insert into public.goal_updates (goal_id, user_id, delta, note)
  values (p_goal_id, v_user_id, p_delta, p_note);
  
  -- Update profile stats
  update public.profiles
  set
    willpower = willpower + round(p_delta),
    total_points = total_points + round(p_delta)
  where id = v_user_id;
  
  return jsonb_build_object(
    'current_value', v_new_value,
    'progress_pct', v_progress_pct
  );
end;
$$;

grant execute on function public.add_goal_progress(bigint, numeric, text) to authenticated;

-- ============================================================
-- 7. FUNCTION: seed_default_habits
-- ============================================================

create or replace function public.seed_default_habits()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_count int;
begin
  v_user_id := (select auth.uid());
  
  -- Check if user already has habits
  select count(*) into v_count
  from public.habits
  where user_id = v_user_id;
  
  if v_count > 0 then
    return 0;
  end if;
  
  -- Insert 5 default habits
  insert into public.habits (user_id, title, category, frequency, points)
  values
    (v_user_id, 'پایداری در جنگ داخلی', 'internal', 'daily', 10),
    (v_user_id, '۳۰ دقیقه ورزش', 'external', 'daily', 5),
    (v_user_id, '۳۰ دقیقه مطالعه', 'external', 'daily', 5),
    (v_user_id, 'خواب پیش از ۲۳', 'external', 'daily', 3),
    (v_user_id, '۱۰ دقیقه مدیتیشن', 'external', 'daily', 3);
  
  return 5;
end;
$$;

grant execute on function public.seed_default_habits() to authenticated;

-- ============================================================
-- 8. TRIGGER: touch_updated_at for habits
-- ============================================================

create or replace function public.touch_habits_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists habits_touch_updated_at on public.habits;
create trigger habits_touch_updated_at
  before update on public.habits
  for each row
  execute function public.touch_habits_updated_at();

-- ============================================================
-- 9. TRIGGER: touch_updated_at for goals
-- ============================================================

drop trigger if exists goals_touch_updated_at on public.goals;
create trigger goals_touch_updated_at
  before update on public.goals
  for each row
  execute function public.touch_habits_updated_at();





