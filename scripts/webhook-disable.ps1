# PowerShell helper to simulate Paystack disable/failure webhook securely
Param(
  [string]$Url = "https://www.vauntino.com/api/paystack/webhook",
  [string]$Event = "subscription.disable", # or invoice.payment_failed
  [string]$Plan = "seekers-spark",
  [string]$Email = "adept@example.com"
)

if (-not $env:PAYSTACK_TEST_SECRET -and -not $env:PAYSTACK_SECRET_KEY) {
  Write-Host "Enter PAYSTACK_TEST_SECRET (input hidden):" -ForegroundColor Yellow
  $sec = Read-Host -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
  $env:PAYSTACK_TEST_SECRET = $plain
}

node scripts/simulate-paystack-disable.mjs --url $Url --event $Event --plan $Plan --email $Email