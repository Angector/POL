-- ============================================================
-- Mind Citadel – Phase 6 Schema: World, Letters, Alliances, Realtime
-- ============================================================

-- ============================================================
-- 1. TABLE: letters
-- ============================================================

create table if not exists public.letters (
  id bigint generated always as identity primary key,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('help', 'resource', 'general', 'congrats', 'rise')),
  subject text,
  body text not null,
  accepted boolean,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.letters enable row level security;

drop policy if exists "letters_select_own" on public.letters;  drop policy if exists "letters_select_own" on public.letters;  create policy "letters_select_own" on public.letters for select
  to authenticated
  using ((select auth.uid()) = from_user_id or (select auth.uid()) = to_user_id);

drop policy if exists "letters_insert_own" on public.letters;  drop policy if exists "letters_insert_own" on public.letters;  create policy "letters_insert_own" on public.letters for insert
  to authenticated
  with check ((select auth.uid()) = from_user_id);

drop policy if exists "letters_update_recipient" on public.letters;  drop policy if exists "letters_update_recipient" on public.letters;  create policy "letters_update_recipient" on public.letters for update
  to authenticated
  using ((select auth.uid()) = to_user_id)
  with check ((select auth.uid()) = to_user_id);

-- ============================================================
-- 2. TABLE: alliances
-- ============================================================

create table if not exists public.alliances (
  id bigint generated always as identity primary key,
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('truce', 'alliance')),
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(requester_id, recipient_id)
);

alter table public.alliances enable row level security;

drop policy if exists "alliances_select_own" on public.alliances;  drop policy if exists "alliances_select_own" on public.alliances;  create policy "alliances_select_own" on public.alliances for select
  to authenticated
  using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

drop policy if exists "alliances_insert_own" on public.alliances;  drop policy if exists "alliances_insert_own" on public.alliances;  create policy "alliances_insert_own" on public.alliances for insert
  to authenticated
  with check ((select auth.uid()) = requester_id);

drop policy if exists "alliances_update_both" on public.alliances;  drop policy if exists "alliances_update_both" on public.alliances;  create policy "alliances_update_both" on public.alliances for update
  to authenticated
  using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id)
  with check ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

-- ============================================================
-- 3. FUNCTION: create_alliance_request
-- ============================================================

create or replace function public.create_alliance_request(
  p_recipient uuid,
  p_type text,
  p_message text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requester uuid;
  v_alliance_id bigint;
  v_callsign text;
begin
  v_requester := (select auth.uid());
  
  -- Check: can't request with self
  if v_requester = p_recipient then
    raise exception 'نمی‌توانید با خودتان پیمان ببندید';
  end if;
  
  -- Check: no existing accepted alliance
  if exists (
    select 1 from public.alliances
    where (requester_id = v_requester and recipient_id = p_recipient)
       or (requester_id = p_recipient and recipient_id = v_requester)
    and status = 'accepted'
  ) then
    raise exception 'قبلاً پیمانی بین شما برقرار شده است';
  end if;
  
  -- Check: no pending request
  if exists (
    select 1 from public.alliances
    where requester_id = v_requester and recipient_id = p_recipient
    and status = 'pending'
  ) then
    raise exception 'قبلاً درخواستی ارسال کرده‌اید';
  end if;
  
  -- Insert alliance
  insert into public.alliances (requester_id, recipient_id, type, message)
  values (v_requester, p_recipient, p_type, p_message)
  returning id into v_alliance_id;
  
  -- Get requester callsign
  select callsign into v_callsign
  from public.profiles
  where id = v_requester;
  
  -- Create notification
  insert into public.notifications (user_id, type, payload)
  values (
    p_recipient,
    'alliance_request',
    jsonb_build_object(
      'from_callsign', v_callsign,
      'alliance_id', v_alliance_id,
      'alliance_type', p_type
    )
  );
  
  return v_alliance_id;
end;
$$;

grant execute on function public.create_alliance_request(uuid, text, text) to authenticated;

-- ============================================================
-- 4. FUNCTION: respond_alliance
-- ============================================================

create or replace function public.respond_alliance(
  p_alliance_id bigint,
  p_accept boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alliance record;
  v_callsign text;
begin
  -- Get alliance
  select * into v_alliance
  from public.alliances
  where id = p_alliance_id;
  
  if not found then
    raise exception 'پیمان یافت نشد';
  end if;
  
  -- Check: only recipient can respond
  if (select auth.uid()) != v_alliance.recipient_id then
    raise exception 'فقط گیرنده می‌تواند پاسخ دهد';
  end if;
  
  -- Update alliance
  update public.alliances
  set
    status = case when p_accept then 'accepted' else 'rejected' end,
    responded_at = now()
  where id = p_alliance_id;
  
  -- If accepted, notify requester
  if p_accept then
    select callsign into v_callsign
    from public.profiles
    where id = v_alliance.recipient_id;
    
    insert into public.notifications (user_id, type, payload)
    values (
      v_alliance.requester_id,
      'alliance_accepted',
      jsonb_build_object(
        'from_callsign', v_callsign,
        'alliance_id', p_alliance_id
      )
    );
  end if;
end;
$$;

grant execute on function public.respond_alliance(bigint, boolean) to authenticated;

-- ============================================================
-- 5. FUNCTION: send_letter
-- ============================================================

create or replace function public.send_letter(
  p_to uuid,
  p_type text,
  p_subject text,
  p_body text
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from uuid;
  v_letter_id bigint;
  v_callsign text;
begin
  v_from := (select auth.uid());
  
  -- Insert letter
  insert into public.letters (from_user_id, to_user_id, type, subject, body)
  values (v_from, p_to, p_type, p_subject, p_body)
  returning id into v_letter_id;
  
  -- Get sender callsign
  select callsign into v_callsign
  from public.profiles
  where id = v_from;
  
  -- Create notification
  insert into public.notifications (user_id, type, payload)
  values (
    p_to,
    'letter_new',
    jsonb_build_object(
      'from_callsign', v_callsign,
      'letter_type', p_type,
      'letter_id', v_letter_id
    )
  );
  
  return v_letter_id;
end;
$$;

grant execute on function public.send_letter(uuid, text, text, text) to authenticated;

-- ============================================================
-- 6. VIEW: public_profiles (enhanced)
-- ============================================================

drop view if exists public.public_profiles cascade;
create or replace view public.public_profiles as
select
  p.id,
  p.callsign,
  p.territory_name,
  p.rank,
  p.total_points,
  p.crest_seed,
  p.streak_days,
  p.is_anonymous,
  p.created_at,
  (select count(*) from public.tiles t where t.user_id = p.id and t.status = 'freed')::int as freed_count
from public.profiles p;

grant select on public.public_profiles to authenticated;

-- ============================================================
-- 7. ALTER notifications: add read_at if not exists
-- ============================================================

-- -- DO $ BEGIN IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN -- -- alter table public.notifications ADD COLUMN IF NOT EXISTS read_at timestamptz; END IF; END $;;

-- ============================================================
-- 8. TRIGGER: letter notification (backup - function already does this)
-- ============================================================

-- The send_letter function already creates notifications, so no trigger needed

-- ============================================================
-- 9. REALTIME: Add tables to publication
-- ============================================================

-- Note: Run these in Supabase Dashboard or with proper permissions
-- alter publication supabase_realtime add table public.notifications;
-- alter publication supabase_realtime add table public.letters;
-- alter publication supabase_realtime add table public.alliances;








