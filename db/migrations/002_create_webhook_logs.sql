-- Creates webhook_logs for Paystack audit/debug
create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  email text,
  amount_zar int,
  tier text,
  status text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists webhook_logs_event_type_idx on public.webhook_logs (event_type);
create index if not exists webhook_logs_email_idx on public.webhook_logs (email);