-- ============================================================
-- Mind Citadel – Phase 8 Schema: Generals, Relics, Skills
-- ============================================================

-- ============================================================
-- 1. TABLE: generals
-- ============================================================

create table if not exists public.generals (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  rank_earned text not null,
  portrait_seed text not null,
  experience_archive jsonb not null default '{}'::jsonb,
  status text not null default 'home' check (status in ('home', 'dispatched', 'received')),
  sent_to_user_id uuid references auth.users(id) on delete set null,
  received_from_user_id uuid references auth.users(id) on delete set null,
  original_general_id bigint references public.generals(id) on delete set null,
  sent_at timestamptz,
  received_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.generals enable row level security;

create policy "generals_select_own"
  on public.generals for select
  to authenticated
  using ((select auth.uid()) = user_id or (select auth.uid()) = sent_to_user_id);

create policy "generals_insert_own"
  on public.generals for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "generals_update_own"
  on public.generals for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================
-- 2. TABLE: relic_definitions (read-only)
-- ============================================================

create table if not exists public.relic_definitions (
  key text primary key,
  name text not null,
  description text not null,
  icon text not null,
  condition_type text not null,
  condition_value int
);

alter table public.relic_definitions enable row level security;

create policy "relic_defs_select_all"
  on public.relic_definitions for select
  to authenticated
  using (true);

-- Insert all 19 relic definitions
insert into public.relic_definitions (key, name, description, icon, condition_type, condition_value) values
  ('first_freed_city', 'اولین فتح', 'اولین شهر آزاد شده', '🏰', 'freed_cities', 1),
  ('streak_7', 'هفته‌ی پایداری', '۷ روز پایداری متوالی', '🔥', 'streak_days', 7),
  ('streak_30', 'ماه‌ی پایداری', '۳۰ روز پایداری متوالی', '🌟', 'streak_days', 30),
  ('streak_100', 'صد روز', '۱۰۰ روز پایداری متوالی', '💎', 'streak_days', 100),
  ('first_general', 'اولین ژنرال', 'اولین ژنرال متولد شد', '🎖', 'generals_count', 1),
  ('five_generals', 'پنج ژنرال', 'پنج ژنرال متولد شدند', '🏆', 'generals_count', 5),
  ('first_alliance', 'اولین پیمان', 'اولین پیمان بسته شد', '🤝', 'alliances_count', 1),
  ('first_letter_received', 'اولین نامه', 'اولین نامه دریافت شد', '✉️', 'letters_received', 1),
  ('resisted_10', 'دفاع‌کار', '۱۰ حمله دفع شده', '🛡', 'resisted_urges', 10),
  ('resisted_50', 'جنگجوی سخت‌جان', '۵۰ حمله دفع شده', '⚔️', 'resisted_urges', 50),
  ('resisted_100', 'افسانه', '۱۰۰ حمله دفع شده', '👑', 'resisted_urges', 100),
  ('first_goal_completed', 'اولین هدف', 'اولین هدف تکمیل شد', '🎯', 'completed_goals', 1),
  ('three_goals', 'سه هدف', 'سه هدف تکمیل شد', '🏅', 'completed_goals', 3),
  ('first_sos', 'اولین SOS', 'اولین SOS موفق', '🆘', 'sos_count', 1),
  ('sos_master', 'استاد SOS', '۱۰ SOS موفق', '🚨', 'sos_count', 10),
  ('rank_corporal', 'گروهبان', 'رسیدن به رتبه گروهبان', '⭐', 'total_points', 500),
  ('rank_captain', 'سروان', 'رسیدن به رتبه سروان', '⭐⭐', 'total_points', 1500),
  ('rank_general', 'ژنرال', 'رسیدن به رتبه ژنرال', '⭐⭐⭐', 'total_points', 12000),
  ('rank_king', 'پادشاه', 'رسیدن به رتبه پادشاه', '👑', 'total_points', 35000);

-- ============================================================
-- 3. TABLE: relics
-- ============================================================

create table if not exists public.relics (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  relic_key text not null references public.relic_definitions(key),
  unlocked_at timestamptz not null default now(),
  unique(user_id, relic_key)
);

alter table public.relics enable row level security;

create policy "relics_select_own"
  on public.relics for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 4. TABLE: skills
-- ============================================================

create table if not exists public.skills (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  branch text not null check (branch in ('order', 'courage', 'wisdom', 'steadfastness')),
  node_key text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, node_key)
);

alter table public.skills enable row level security;

create policy "skills_select_own"
  on public.skills for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 5. FUNCTION: create_general_for_rank
-- ============================================================

create or replace function public.create_general_for_rank(p_user_id uuid, p_rank text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_general_id bigint;
  v_callsign text;
  v_last_general_time timestamptz;
  v_resisted int;
  v_defeated int;
  v_freed int;
  v_habits int;
  v_goals int;
  v_streak int;
  v_points int;
  v_narrative text;
  v_name text;
  v_portrait_seed text;
  v_names text[] := array[
    'آرش', 'کاوه', 'رستم', 'سهراب', 'اسفندیار', 'گردآفرید', 'بابک', 'مازیار',
    'کوروش', 'داریوش', 'خشایار', 'اردشیر', 'شاپور', 'خسرو', 'بهرام',
    'نادر', 'عباس', 'کریم', 'یعقوب', 'سام', 'زال', 'سیاوش', 'افراسیاب',
    'گیو', 'توس', 'بهمن', 'فرامرز', 'گودرز', 'پیران', 'بژن'
  ];
begin
  -- Get callsign
  select callsign, streak_days, total_points into v_callsign, v_streak, v_points
  from public.profiles
  where id = p_user_id;
  
  -- Get last general creation time (avoid recursion by not using profiles field)
  select max(created_at) into v_last_general_time
  from public.generals
  where user_id = p_user_id;
  
  if v_last_general_time is null then
    v_last_general_time := (select created_at from public.profiles where id = p_user_id);
  end if;
  
  -- Calculate stats for the period
  select count(*) into v_resisted
  from public.urges
  where user_id = p_user_id
    and resisted = true
    and occurred_at > v_last_general_time;
  
  select count(*) into v_defeated
  from public.urges
  where user_id = p_user_id
    and resisted = false
    and occurred_at > v_last_general_time;
  
  select count(*) into v_freed
  from public.tiles
  where user_id = p_user_id
    and status = 'freed'
    and freed_at > v_last_general_time;
  
  select count(*) into v_habits
  from public.habit_logs
  where user_id = p_user_id
    and completed = true
    and created_at > v_last_general_time;
  
  select count(*) into v_goals
  from public.goals
  where user_id = p_user_id
    and current_value >= target_value
    and updated_at > v_last_general_time;
  
  -- Generate narrative
  v_narrative := 'در دوران ' || p_rank || 'ی، ' || v_resisted || ' حمله را دفع کردی، ' ||
                 v_defeated || ' بار لغزیدی، و ' || v_freed || ' شهر را آزاد کردی. ' ||
                 v_habits || ' عادت را تکمیل کردی و ' || v_goals || ' هدف را به سرانجام رساندی.';
  
  -- Generate name and portrait
  v_name := 'ژنرال ' || v_names[(floor(random() * array_length(v_names, 1)) + 1)::int];
  v_portrait_seed := encode(gen_random_bytes(8), 'hex');
  
  -- Insert general
  insert into public.generals (
    user_id, name, rank_earned, portrait_seed, experience_archive, status
  ) values (
    p_user_id,
    v_name,
    p_rank,
    v_portrait_seed,
    jsonb_build_object(
      'streak_days', v_streak,
      'total_points', v_points,
      'resisted_urges', v_resisted,
      'defeated_urges', v_defeated,
      'freed_cities', v_freed,
      'completed_habits', v_habits,
      'completed_goals', v_goals,
      'narrative', v_narrative
    ),
    'home'
  ) returning id into v_general_id;
  
  -- Create notification
  insert into public.notifications (user_id, type, payload)
  values (
    p_user_id,
    'general_created',
    jsonb_build_object(
      'general_name', v_name,
      'rank', p_rank,
      'general_id', v_general_id
    )
  );
  
  return v_general_id;
end;
$$;

grant execute on function public.create_general_for_rank(uuid, text) to authenticated;

-- ============================================================
-- 6. TRIGGER: on_profile_rank_change
-- ============================================================

create or replace function public.handle_rank_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.rank is distinct from new.rank then
    perform public.create_general_for_rank(new.id, new.rank);
  end if;
  return new;
end;
$$;

drop trigger if exists on_rank_change on public.profiles;
create trigger on_rank_change
  after update on public.profiles
  for each row
  when (old.rank is distinct from new.rank)
  execute function public.handle_rank_change();

-- ============================================================
-- 7. FUNCTION: check_relic_unlocks
-- ============================================================

create or replace function public.check_relic_unlocks(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_streak int;
  v_points int;
  v_generals int;
  v_alliances int;
  v_letters int;
  v_resisted int;
  v_goals int;
  v_sos int;
  v_freed int;
begin
  -- Get current stats
  select streak_days, total_points into v_streak, v_points
  from public.profiles where id = p_user_id;
  
  select count(*) into v_generals from public.generals where user_id = p_user_id;
  select count(*) into v_alliances from public.alliances where (requester_id = p_user_id or recipient_id = p_user_id) and status = 'accepted';
  select count(*) into v_letters from public.letters where to_user_id = p_user_id;
  select count(*) into v_resisted from public.urges where user_id = p_user_id and resisted = true;
  select count(*) into v_goals from public.goals where user_id = p_user_id and current_value >= target_value;
  select count(*) into v_sos from public.urges where user_id = p_user_id and resisted = true and private_note is not null;
  select count(*) into v_freed from public.tiles where user_id = p_user_id and status = 'freed';
  
  -- Check each relic
  -- first_freed_city
  if v_freed >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_freed_city') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_freed_city');
  end if;
  
  -- streak_7
  if v_streak >= 7 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'streak_7') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'streak_7');
  end if;
  
  -- streak_30
  if v_streak >= 30 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'streak_30') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'streak_30');
  end if;
  
  -- streak_100
  if v_streak >= 100 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'streak_100') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'streak_100');
  end if;
  
  -- first_general
  if v_generals >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_general') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_general');
  end if;
  
  -- five_generals
  if v_generals >= 5 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'five_generals') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'five_generals');
  end if;
  
  -- first_alliance
  if v_alliances >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_alliance') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_alliance');
  end if;
  
  -- first_letter_received
  if v_letters >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_letter_received') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_letter_received');
  end if;
  
  -- resisted_10
  if v_resisted >= 10 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'resisted_10') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'resisted_10');
  end if;
  
  -- resisted_50
  if v_resisted >= 50 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'resisted_50') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'resisted_50');
  end if;
  
  -- resisted_100
  if v_resisted >= 100 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'resisted_100') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'resisted_100');
  end if;
  
  -- first_goal_completed
  if v_goals >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_goal_completed') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_goal_completed');
  end if;
  
  -- three_goals
  if v_goals >= 3 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'three_goals') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'three_goals');
  end if;
  
  -- first_sos
  if v_sos >= 1 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'first_sos') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'first_sos');
  end if;
  
  -- sos_master
  if v_sos >= 10 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'sos_master') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'sos_master');
  end if;
  
  -- rank_corporal
  if v_points >= 500 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'rank_corporal') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'rank_corporal');
  end if;
  
  -- rank_captain
  if v_points >= 1500 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'rank_captain') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'rank_captain');
  end if;
  
  -- rank_general
  if v_points >= 12000 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'rank_general') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'rank_general');
  end if;
  
  -- rank_king
  if v_points >= 35000 and not exists (select 1 from public.relics where user_id = p_user_id and relic_key = 'rank_king') then
    insert into public.relics (user_id, relic_key) values (p_user_id, 'rank_king');
  end if;
end;
$$;

grant execute on function public.check_relic_unlocks(uuid) to authenticated;

-- ============================================================
-- 8. TRIGGER: on_profile_after_update (relic check)
-- ============================================================

create or replace function public.handle_relic_check()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.check_relic_unlocks(new.id);
  return new;
end;
$$;

drop trigger if exists on_relic_check on public.profiles;
create trigger on_relic_check
  after update on public.profiles
  for each row
  execute function public.handle_relic_check();

-- ============================================================
-- 9. FUNCTION: check_skill_unlocks
-- ============================================================

create or replace function public.check_skill_unlocks(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_points int;
begin
  select total_points into v_points
  from public.profiles where id = p_user_id;
  
  -- Order branch
  if v_points >= 100 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'order_1') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'order', 'order_1');
  end if;
  if v_points >= 500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'order_2') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'order', 'order_2');
  end if;
  if v_points >= 1500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'order_3') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'order', 'order_3');
  end if;
  if v_points >= 3500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'order_4') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'order', 'order_4');
  end if;
  if v_points >= 7000 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'order_5') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'order', 'order_5');
  end if;
  
  -- Courage branch
  if v_points >= 100 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'courage_1') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'courage', 'courage_1');
  end if;
  if v_points >= 500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'courage_2') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'courage', 'courage_2');
  end if;
  if v_points >= 1500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'courage_3') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'courage', 'courage_3');
  end if;
  if v_points >= 3500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'courage_4') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'courage', 'courage_4');
  end if;
  if v_points >= 7000 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'courage_5') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'courage', 'courage_5');
  end if;
  
  -- Wisdom branch
  if v_points >= 100 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'wisdom_1') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'wisdom', 'wisdom_1');
  end if;
  if v_points >= 500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'wisdom_2') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'wisdom', 'wisdom_2');
  end if;
  if v_points >= 1500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'wisdom_3') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'wisdom', 'wisdom_3');
  end if;
  if v_points >= 3500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'wisdom_4') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'wisdom', 'wisdom_4');
  end if;
  if v_points >= 7000 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'wisdom_5') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'wisdom', 'wisdom_5');
  end if;
  
  -- Steadfastness branch
  if v_points >= 100 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'steadfastness_1') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'steadfastness', 'steadfastness_1');
  end if;
  if v_points >= 500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'steadfastness_2') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'steadfastness', 'steadfastness_2');
  end if;
  if v_points >= 1500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'steadfastness_3') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'steadfastness', 'steadfastness_3');
  end if;
  if v_points >= 3500 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'steadfastness_4') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'steadfastness', 'steadfastness_4');
  end if;
  if v_points >= 7000 and not exists (select 1 from public.skills where user_id = p_user_id and node_key = 'steadfastness_5') then
    insert into public.skills (user_id, branch, node_key) values (p_user_id, 'steadfastness', 'steadfastness_5');
  end if;
end;
$$;

grant execute on function public.check_skill_unlocks(uuid) to authenticated;

-- ============================================================
-- 10. TRIGGER: on_skill_check
-- ============================================================

create or replace function public.handle_skill_check()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.check_skill_unlocks(new.id);
  return new;
end;
$$;

drop trigger if exists on_skill_check on public.profiles;
create trigger on_skill_check
  after update on public.profiles
  for each row
  execute function public.handle_skill_check();
