-- ============================================================
-- Mind Citadel – Phase 9 Schema: Council, Oracle, Mirror
-- ============================================================

-- ============================================================
-- 1. TABLE: council_messages
-- ============================================================

create table if not exists public.council_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  advisor text not null check (advisor in ('patience', 'war', 'mirror', 'sage')),
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  tokens_used int,
  created_at timestamptz not null default now()
);

create index if not exists idx_council_user_advisor_created
  on public.council_messages(user_id, advisor, created_at desc);

alter table public.council_messages enable row level security;

drop policy if exists "council_select_own" on public.council_messages;  drop policy if exists "council_select_own" on public.council_messages;  create policy "council_select_own" on public.council_messages for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "council_insert_own" on public.council_messages;  drop policy if exists "council_insert_own" on public.council_messages;  create policy "council_insert_own" on public.council_messages for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "council_delete_own" on public.council_messages;  drop policy if exists "council_delete_own" on public.council_messages;  create policy "council_delete_own" on public.council_messages for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- 2. TABLE: oracle_predictions
-- ============================================================

create table if not exists public.oracle_predictions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  for_date date not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  risk_window text,
  reason text not null,
  suggestion text not null,
  generated_at timestamptz not null default now(),
  unique(user_id, for_date)
);

alter table public.oracle_predictions enable row level security;

drop policy if exists "oracle_select_own" on public.oracle_predictions;  drop policy if exists "oracle_select_own" on public.oracle_predictions;  create policy "oracle_select_own" on public.oracle_predictions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Insert only from edge function with service role

-- ============================================================
-- 3. TABLE: future_letters (optional)
-- ============================================================

create table if not exists public.future_letters (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  deliver_at timestamptz not null,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.future_letters enable row level security;

drop policy if exists "future_letters_select_own" on public.future_letters;  drop policy if exists "future_letters_select_own" on public.future_letters;  create policy "future_letters_select_own" on public.future_letters for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "future_letters_insert_own" on public.future_letters;  drop policy if exists "future_letters_insert_own" on public.future_letters;  create policy "future_letters_insert_own" on public.future_letters for insert
  to authenticated
  with check ((select auth.uid()) = user_id);





