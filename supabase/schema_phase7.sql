-- ============================================================
-- Mind Citadel – Phase 7 Schema: SOS Mini-Game, Truce, Rise Buff, Patterns
-- ============================================================

-- ============================================================
-- 1. TABLE: truce_periods
-- ============================================================

create table if not exists public.truce_periods (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('travel', 'illness', 'family_crisis', 'exam', 'other')),
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.truce_periods enable row level security;

create policy "truce_select_own"
  on public.truce_periods for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "truce_insert_own"
  on public.truce_periods for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "truce_update_own"
  on public.truce_periods for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================
-- 2. FUNCTION: start_truce
-- ============================================================

create or replace function public.start_truce(p_reason text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_truce_id bigint;
  v_active_truce record;
begin
  v_user_id := (select auth.uid());
  
  -- Check if active truce exists
  select * into v_active_truce
  from public.truce_periods
  where user_id = v_user_id
    and ends_at > now()
    and cancelled_at is null;
  
  if found then
    raise exception 'آتش‌بس فعال دیگری داری';
  end if;
  
  -- Insert new truce (3 days)
  insert into public.truce_periods (user_id, reason, ends_at)
  values (v_user_id, p_reason, now() + interval '3 days')
  returning id into v_truce_id;
  
  return v_truce_id;
end;
$$;

grant execute on function public.start_truce(text) to authenticated;

-- ============================================================
-- 3. FUNCTION: cancel_truce
-- ============================================================

create or replace function public.cancel_truce(p_truce_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.truce_periods
  set cancelled_at = now()
  where id = p_truce_id
    and user_id = (select auth.uid());
end;
$$;

grant execute on function public.cancel_truce(bigint) to authenticated;

-- ============================================================
-- 4. FUNCTION: get_active_truce
-- ============================================================

create or replace function public.get_active_truce()
returns table (
  id bigint,
  reason text,
  started_at timestamptz,
  ends_at timestamptz,
  days_remaining int
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id,
    reason,
    started_at,
    ends_at,
    ceil(extract(epoch from (ends_at - now())) / 86400)::int as days_remaining
  from public.truce_periods
  where user_id = (select auth.uid())
    and ends_at > now()
    and cancelled_at is null
  limit 1;
$$;

grant execute on function public.get_active_truce() to authenticated;

-- ============================================================
-- 5. FUNCTION: resist_urge_with_sos
-- ============================================================

create or replace function public.resist_urge_with_sos(
  p_intensity int,
  p_trigger text,
  p_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_callsign text;
begin
  v_user_id := (select auth.uid());
  
  -- Insert urge with +15 willpower, +10 points
  insert into public.urges (user_id, intensity, trigger_context, resisted, private_note)
  values (v_user_id, p_intensity, p_trigger, true, p_note);
  
  update public.profiles
  set
    willpower = willpower + 15,
    total_points = total_points + 10
  where id = v_user_id;
  
  -- Get callsign for letter
  select callsign into v_callsign
  from public.profiles
  where id = v_user_id;
  
  -- Create letter from system (council)
  insert into public.letters (from_user_id, to_user_id, type, subject, body, from_system)
  values (
    null,
    v_user_id,
    'rise',
    'پیام از شورای مشاوران',
    'فرمانده ' || v_callsign || '،

تو ایستادی. در تاریک‌ترین لحظه، سلاحت را برداشتی و جنگیدی. اراده‌ات تقویت شد. +۱۵ اراده. امروز یک قدم به آزادی نزدیک‌تری.

— شورای مشاوران',
    true
  );
end;
$$;

grant execute on function public.resist_urge_with_sos(int, text, text) to authenticated;

-- ============================================================
-- 6. ALTER letters: make from_user_id nullable, add from_system
-- ============================================================

alter table public.letters alter column from_user_id drop not null;
alter table public.letters add column if not exists from_system boolean default false;

-- ============================================================
-- 7. UPDATE toggle_habit with Rise Buff
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
  v_points_earned int;
  v_rise_buff_until timestamptz;
begin
  v_user_id := (select auth.uid());
  
  -- Get habit
  select * into v_habit
  from public.habits
  where id = p_habit_id and user_id = v_user_id;
  
  if not found then
    raise exception 'عادت یافت نشد';
  end if;
  
  -- Check rise buff
  select rise_buff_until into v_rise_buff_until
  from public.profiles
  where id = v_user_id;
  
  -- Calculate points with buff
  if v_rise_buff_until > now() and v_habit.category = 'external' then
    v_points_earned := round(v_habit.points * 1.1);
  else
    v_points_earned := v_habit.points;
  end if;
  
  -- Check if log exists
  select * into v_log
  from public.habit_logs
  where habit_id = p_habit_id and log_date = p_date;
  
  if found then
    -- Delete log
    delete from public.habit_logs where id = v_log.id;
    
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
    -- Insert log
    insert into public.habit_logs (habit_id, user_id, log_date, completed, points_earned)
    values (p_habit_id, v_user_id, p_date, true, v_points_earned);
    
    update public.profiles
    set
      willpower = willpower + v_points_earned,
      total_points = total_points + v_points_earned
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

-- ============================================================
-- 8. UPDATE add_goal_progress with Rise Buff
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
  v_rise_buff_until timestamptz;
  v_points_to_add int;
begin
  v_user_id := (select auth.uid());
  
  select * into v_goal
  from public.goals
  where id = p_goal_id and user_id = v_user_id;
  
  if not found then
    raise exception 'هدف یافت نشد';
  end if;
  
  v_new_value := least(v_goal.current_value + p_delta, v_goal.target_value);
  v_progress_pct := (v_new_value / v_goal.target_value) * 100;
  
  update public.goals
  set current_value = v_new_value
  where id = p_goal_id;
  
  insert into public.goal_updates (goal_id, user_id, delta, note)
  values (p_goal_id, v_user_id, p_delta, p_note);
  
  -- Check rise buff
  select rise_buff_until into v_rise_buff_until
  from public.profiles
  where id = v_user_id;
  
  if v_rise_buff_until > now() and p_delta > 0 then
    v_points_to_add := round(p_delta * 1.1);
  else
    v_points_to_add := round(p_delta);
  end if;
  
  update public.profiles
  set
    willpower = willpower + v_points_to_add,
    total_points = total_points + v_points_to_add
  where id = v_user_id;
  
  return jsonb_build_object(
    'current_value', v_new_value,
    'progress_pct', v_progress_pct
  );
end;
$$;
