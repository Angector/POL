-- ============================================================
-- Mind Citadel – Phase 4 Schema: Streak, Urges, City Liberation
-- ============================================================

-- ============================================================
-- 1. ALTER profiles: Add cycle tracking fields
-- ============================================================

alter table public.profiles
  add column if not exists cycle_started_at timestamptz default now(),
  add column if not exists current_cycle int default 1,
  add column if not exists rise_buff_until timestamptz;

-- ============================================================
-- 2. TABLE: urges
-- ============================================================

create table if not exists public.urges (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  intensity int not null check (intensity between 1 and 10),
  trigger_context text not null check (trigger_context in ('stress', 'boredom', 'loneliness', 'late_night', 'anger', 'tiredness', 'other')),
  resisted boolean not null,
  private_note text,
  created_at timestamptz not null default now()
);

alter table public.urges enable row level security;

create policy "Users can view own urges"
  on public.urges for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own urges"
  on public.urges for insert
  with check ((select auth.uid()) = user_id);

-- No update/delete policies - urges are immutable

-- ============================================================
-- 3. FUNCTION: resist_urge
-- ============================================================

create or replace function public.resist_urge(
  p_user_id uuid,
  p_intensity int,
  p_trigger text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert urge record
  insert into public.urges (user_id, intensity, trigger_context, resisted)
  values (p_user_id, p_intensity, p_trigger, true);

  -- Update profile: willpower += 10
  update public.profiles
  set willpower = willpower + 10
  where id = p_user_id;
end;
$$;

grant execute on function public.resist_urge(uuid, int, text) to authenticated;

-- ============================================================
-- 4. FUNCTION: defeat_citadel
-- ============================================================

create or replace function public.defeat_citadel(
  p_user_id uuid,
  p_intensity int,
  p_trigger text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_cycle int;
begin
  -- Get current cycle
  select current_cycle into v_current_cycle
  from public.profiles
  where id = p_user_id;

  -- Insert urge record
  insert into public.urges (user_id, intensity, trigger_context, resisted)
  values (p_user_id, p_intensity, p_trigger, false);

  -- Reset streak and cycle
  update public.profiles
  set
    streak_days = 0,
    cycle_started_at = now(),
    current_cycle = current_cycle + 1,
    morale = greatest(morale - 30, 20),
    rise_buff_until = now() + interval '3 days'
  where id = p_user_id;

  -- Reset tiles from current cycle to locked
  update public.tiles
  set
    status = 'locked',
    freed_at = null
  where user_id = p_user_id
    and status = 'freed'
    and freed_cycle = v_current_cycle;
end;
$$;

grant execute on function public.defeat_citadel(uuid, int, text) to authenticated;

-- ============================================================
-- 5. FUNCTION: liberate_next_city
-- ============================================================

create or replace function public.liberate_next_city(
  p_user_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tile_id bigint;
  v_cycle_started timestamptz;
begin
  -- Check if 24 hours have passed
  select cycle_started_at into v_cycle_started
  from public.profiles
  where id = p_user_id;

  if now() - v_cycle_started < interval '24 hours' then
    raise exception 'هنوز زمان فتح نرسیده';
  end if;

  -- Find next locked tile (lowest tile_index)
  select id into v_tile_id
  from public.tiles
  where user_id = p_user_id
    and status = 'locked'
  order by tile_index asc
  limit 1;

  if v_tile_id is null then
    raise exception 'همه‌ی شهرها آزاد شده‌اند';
  end if;

  -- Liberate the tile
  update public.tiles
  set
    status = 'freed',
    freed_at = now(),
    freed_cycle = (select current_cycle from public.profiles where id = p_user_id)
  where id = v_tile_id;

  -- Update profile stats
  update public.profiles
  set
    streak_days = streak_days + 1,
    willpower = willpower + 25,
    total_points = total_points + 50,
    morale = least(morale + 5, 100),
    cycle_started_at = now(),
    current_cycle = current_cycle + 1
  where id = p_user_id;

  return v_tile_id;
end;
$$;

grant execute on function public.liberate_next_city(uuid) to authenticated;

-- ============================================================
-- 6. TRIGGER: touch_cycle (optional, already have touch_updated_at)
-- ============================================================

-- The existing touch_updated_at trigger handles this

-- ============================================================
-- 7. RESTRICT tiles UPDATE policy
-- ============================================================

-- Drop the old policy that allowed direct updates
drop policy if exists "Users can update own tiles" on public.tiles;

-- Now tiles can only be updated through RPC functions (security definer)
