-- Enable RLS and add admin read policies for entitlements and webhook_logs
-- Assumes Clerk-injected JWT includes a role claim (role=admin) or public_metadata.role=admin

-- entitlements
alter table if exists public.entitlements enable row level security;

create policy if not exists entitlements_admin_read
on public.entitlements
for select
using (
  (
    coalesce((auth.jwt() ->> 'role'), (auth.jwt() -> 'public_metadata' ->> 'role')) = 'admin'
  )
);

-- webhook_logs
alter table if exists public.webhook_logs enable row level security;

create policy if not exists webhook_logs_admin_read
on public.webhook_logs
for select
using (
  (
    coalesce((auth.jwt() ->> 'role'), (auth.jwt() -> 'public_metadata' ->> 'role')) = 'admin'
  )
);