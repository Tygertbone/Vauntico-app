# PowerShell helper to simulate Paystack success webhook securely
Param(
  [string]$Url = "https://www.vauntino.com/api/paystack/webhook",
  [string]$Plan = "seekers-spark",
  [string]$Email = "adept@example.com",
  [int]$Amount = 199
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

node scripts/simulate-paystack-webhook.mjs --url $Url --plan $Plan --email $Email --amount $Amount