-- ============================================================
-- Mind Citadel – Phase 3 Schema: Territories & Tiles
-- ============================================================

-- ============================================================
-- 1. TABLE: territories
-- ============================================================

create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  shape_seed text not null,
  capital_tile_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.territories enable row level security;

create policy "Users can view own territory"
  on public.territories for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own territory"
  on public.territories for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own territory"
  on public.territories for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================
-- 2. TABLE: tiles
-- ============================================================

create table if not exists public.tiles (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  territory_id uuid not null references public.territories(id) on delete cascade,
  tile_index int not null check (tile_index between 0 and 179),
  tile_type text not null check (tile_type in ('city', 'province', 'state')),
  name text not null,
  name_meaning text,
  status text not null default 'locked' check (status in ('locked', 'fighting', 'freed')),
  freed_at timestamptz,
  freed_cycle int,
  journal_entry text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, tile_index)
);

alter table public.tiles enable row level security;

create policy "Users can view own tiles"
  on public.tiles for select
  using ((select auth.uid()) = user_id);

create policy "Users can update own tiles"
  on public.tiles for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================
-- 3. TRIGGER: touch_updated_at for territories
-- ============================================================

create or replace function public.touch_territory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists territories_touch_updated_at on public.territories;
create trigger territories_touch_updated_at
  before update on public.territories
  for each row
  execute function public.touch_territory_updated_at();

-- ============================================================
-- 4. TRIGGER: touch_updated_at for tiles
-- ============================================================

create or replace function public.touch_tile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tiles_touch_updated_at on public.tiles;
create trigger tiles_touch_updated_at
  before update on public.tiles
  for each row
  execute function public.touch_tile_updated_at();

-- ============================================================
-- 5. REWRITE: handle_new_user (Phase 1 + Phase 3)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_territory_id uuid;
begin
  -- Create profile (Phase 1)
  insert into public.profiles (id, callsign, crest_seed)
  values (
    new.id,
    'Commander-' || upper(substr(replace(new.id::text, '-', ''), 1, 6)),
    encode(gen_random_bytes(8), 'hex')
  );

  -- Create territory (Phase 3)
  insert into public.territories (user_id, shape_seed)
  values (new.id, encode(gen_random_bytes(8), 'hex'))
  returning id into v_territory_id;

  -- Create 180 tiles (Phase 3)
  insert into public.tiles (user_id, territory_id, tile_index, tile_type, name)
  select
    new.id,
    v_territory_id,
    gs,
    case
      when gs % 30 = 0 then 'state'
      when gs % 7 = 0 then 'province'
      else 'city'
    end,
    'شهر ' || gs
  from generate_series(0, 179) as gs;

  return new;
end;
$$;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================
-- 6. MIGRATION: For existing users (run once)
-- ============================================================
-- This script creates territories and tiles for users who signed up
-- before Phase 3 schema was applied.

-- Uncomment and run this block if you have existing users:
/*
do $$
declare
  v_user record;
  v_territory_id uuid;
begin
  for v_user in select id from auth.users
  loop
    -- Check if territory already exists
    if not exists (select 1 from public.territories where user_id = v_user.id) then
      -- Create territory
      insert into public.territories (user_id, shape_seed)
      values (v_user.id, encode(gen_random_bytes(8), 'hex'))
      returning id into v_territory_id;

      -- Create 180 tiles
      insert into public.tiles (user_id, territory_id, tile_index, tile_type, name)
      select
        v_user.id,
        v_territory_id,
        gs,
        case
          when gs % 30 = 0 then 'state'
          when gs % 7 = 0 then 'province'
          else 'city'
        end,
        'شهر ' || gs
      from generate_series(0, 179) as gs;
    end if;
  end loop;
end $$;
*/
