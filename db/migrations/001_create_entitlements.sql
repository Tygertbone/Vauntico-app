-- Creates entitlements table for SSO/Vault mapping
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique,
  email text unique,
  tier text not null check (tier in ('Practitioner','Guild','Oracle')),
  status text not null check (status in ('active','inactive')),
  updated_at timestamptz not null default now()
);

create index if not exists entitlements_clerk_user_id_idx on public.entitlements (clerk_user_id);
create index if not exists entitlements_email_idx on public.entitlements (email);
