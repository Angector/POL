-- ============================================================
-- Mind Citadel – Phase 1 Schema
-- ============================================================
-- This schema sets up:
--   1. invite_codes table (one-time invite codes)
--   2. profiles table (user profiles linked to auth.users)
--   3. public_profiles view (safe public read access)
--   4. Triggers: handle_new_user, touch_updated_at, lock_oath
--   5. RPC function: consume_invite_code
-- ============================================================

-- ============================================================
-- 1. TABLE: invite_codes
-- ============================================================

create table if not exists public.invite_codes (
  id bigint generated always as identity primary key,
  code text not null unique,
  issued_by text,
  note text,
  is_active boolean not null default true,
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint invite_codes_code_format check (code ~ '^[0-9]{6}$')
);

-- Enable RLS on invite_codes
alter table public.invite_codes enable row level security;

-- No public policies – only service_role can manage invite_codes directly.
-- Client access is through the consume_invite_code RPC function.

-- ============================================================
-- 2. TABLE: profiles
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  callsign text not null default '',
  territory_name text,
  rank text not null default 'Soldier',
  streak_days int not null default 0,
  willpower int not null default 0,
  morale int not null default 100,
  total_points int not null default 0,
  crest_seed text,
  season_id int,
  is_anonymous boolean not null default false,
  oath_signed_at timestamptz,
  oath_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- SELECT: only the owner can read their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

-- UPDATE: only the owner can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================
-- 3. VIEW: public_profiles (safe public read)
-- ============================================================

create or replace view public.public_profiles as
  select
    id,
    callsign,
    territory_name,
    rank,
    total_points,
    crest_seed,
    is_anonymous
  from public.profiles;

-- ============================================================
-- 4. TRIGGER: handle_new_user
-- ============================================================
-- Creates a profile record when a new user signs up.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, callsign, crest_seed)
  values (
    new.id,
    'Commander-' || upper(substr(replace(new.id::text, '-', ''), 1, 6)),
    encode(gen_random_bytes(8), 'hex')
  );
  return new;
end;
$$;

-- Create trigger (drop first to avoid conflicts on re-run)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================
-- 5. TRIGGER: touch_updated_at
-- ============================================================
-- Automatically updates updated_at on every profile update.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row
  execute function public.touch_updated_at();

-- ============================================================
-- 6. TRIGGER: lock_oath
-- ============================================================
-- Prevents changing oath_signed_at once it has been set.

create or replace function public.lock_oath()
returns trigger
language plpgsql
as $$
begin
  if old.oath_signed_at is not null
     and new.oath_signed_at is distinct from old.oath_signed_at then
    raise exception 'سوگند قابل تغییر نیست';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_lock_oath on public.profiles;
create trigger profiles_lock_oath
  before update on public.profiles
  for each row
  execute function public.lock_oath();

-- ============================================================
-- 7. FUNCTION: consume_invite_code
-- ============================================================
-- Validates and consumes a one-time invite code.
-- Called from client via supabase.rpc('consume_invite_code', { p_code, p_user_id })

create or replace function public.consume_invite_code(
  p_code text,
  p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record record;
begin
  -- Normalize code
  p_code := trim(p_code);

  -- Validate format
  if p_code !~ '^[0-9]{6}$' then
    raise exception 'کد دعوت باید ۶ رقم باشد';
  end if;

  -- Find the code
  select * into v_record
  from public.invite_codes
  where code = p_code;

  -- Check existence
  if not found then
    raise exception 'کد دعوت نامعتبر است';
  end if;

  -- Check active
  if not v_record.is_active then
    raise exception 'کد دعوت غیرفعال شده است';
  end if;

  -- Check if already used
  if v_record.used_by is not null then
    raise exception 'این کد قبلاً استفاده شده است';
  end if;

  -- Consume the code
  update public.invite_codes
  set used_by = p_user_id, used_at = now()
  where id = v_record.id;

  return true;
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.consume_invite_code(text, uuid) to authenticated;