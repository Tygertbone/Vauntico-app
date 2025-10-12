param(
  [string]$TargetDrive = "D"
)

# Ensure commands run in the module directory
Push-Location (Join-Path $PSScriptRoot "..")

Write-Host "Bootstrapping Dream Mover (Windows)..."
npm install
npm run build

Write-Host "Scanning C:..."
npm run scan -- --drive C --output logs/report.json

Write-Host "Simulating plan..."
npm run simulate -- --plan plans/vauntico.sample.yml --report logs/report.json --out logs/manifest.json

Write-Host "Ready to migrate to $TargetDrive:. Review simulation above."

Pop-Location
