-- SoundWave MVP schema. Apply in Supabase SQL Editor.
create extension if not exists pgcrypto;
create type public.app_role as enum ('client','admin');
create type public.publication_status as enum ('queued','in_progress','completed');
create type public.payment_status as enum ('pending','paid','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  role public.app_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_name text not null,
  status text not null default 'active' check(status in ('active','expired','cancelled','pending')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint check(size_bytes >= 0),
  created_at timestamptz not null default now()
);
create table public.publications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  release_title text not null,
  platform text not null,
  publication_url text,
  scheduled_at timestamptz,
  status public.publication_status not null default 'queued',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check(provider in ('yookassa','stripe')),
  provider_payment_id text unique,
  amount numeric(12,2) not null check(amount >= 0),
  currency text not null default 'RUB',
  status public.payment_status not null default 'pending',
  description text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check(status in ('open','in_progress','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index materials_user_id_idx on public.materials(user_id);
create index publications_user_id_idx on public.publications(user_id);
create index publications_status_scheduled_idx on public.publications(status,scheduled_at);
create index payments_user_id_idx on public.payments(user_id);
create index support_tickets_user_id_idx on public.support_tickets(user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger publications_updated_at before update on public.publications for each row execute function public.set_updated_at();
create trigger support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin');
$$;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.materials enable row level security;
alter table public.publications enable row level security;
alter table public.payments enable row level security;
alter table public.support_tickets enable row level security;

create policy "profiles read self or admin" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "profiles update self or admin" on public.profiles for update to authenticated using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());
create policy "profiles insert self" on public.profiles for insert to authenticated with check (id=auth.uid() and role='client');
create policy "subscriptions read self or admin" on public.subscriptions for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "subscriptions admin manage" on public.subscriptions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "materials read self or admin" on public.materials for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "materials insert self or admin" on public.materials for insert to authenticated with check (user_id=auth.uid() or public.is_admin());
create policy "materials delete self or admin" on public.materials for delete to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "publications read self or admin" on public.publications for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "publications admin manage" on public.publications for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "payments read self or admin" on public.payments for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "payments admin manage" on public.payments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "tickets read self or admin" on public.support_tickets for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "tickets insert self" on public.support_tickets for insert to authenticated with check (user_id=auth.uid());
create policy "tickets admin manage" on public.support_tickets for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket and access rules for user-owned files. Create bucket via dashboard or uncomment:
-- insert into storage.buckets(id,name,public) values ('materials','materials',false) on conflict do nothing;
create policy "materials storage read own or admin" on storage.objects for select to authenticated using (bucket_id='materials' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
create policy "materials storage upload own" on storage.objects for insert to authenticated with check (bucket_id='materials' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "materials storage delete own or admin" on storage.objects for delete to authenticated using (bucket_id='materials' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));

-- Create profile records on signup. Role always defaults to client; admin promotion is a trusted server-side operation.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email,display_name,role) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'display_name',''),'client'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
