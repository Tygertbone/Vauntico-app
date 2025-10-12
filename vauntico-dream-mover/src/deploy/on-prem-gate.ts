export function envCheck() {
  const onprem = process.env.DM_ON_PREM === 'true'
  return {
    onprem,
    cloudPaymentsEnabled: !onprem,
    localVaultEnabled: onprem
  }
}