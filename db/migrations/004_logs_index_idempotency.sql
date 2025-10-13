-- Add index on created_at and support idempotency with data_reference
alter table if exists public.webhook_logs add column if not exists data_reference text;

create index if not exists idx_webhook_logs_created_at on public.webhook_logs (created_at);

-- Unique per (event_type, data_reference) if data_reference is provided
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'webhook_logs_unique_event_ref'
  ) then
    alter table public.webhook_logs add constraint webhook_logs_unique_event_ref unique (event_type, data_reference);
  end if;
end$$;
