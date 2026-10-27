# Make Haitham TV the TV's Home. Backs up the current values first so rollback-home.ps1
# can restore them. Run this AFTER both .wgt packages are signed and installed
# (see HOME-TAKEOVER.md). Requires Tizen Studio's sdb on PATH and Developer Mode on the TV.
#   Usage:  ./set-home.ps1 -Tv 192.168.1.182
param(
  [string]$Tv = "192.168.1.182",
  [string]$Launcher = "HaithamTV001.HaithamTV",   # the real Haitham TV app
  [string]$Wrapper  = "HaithamHome1.HaithamHome"  # the home-key wrapper
)
$ErrorActionPreference = "Stop"
$sdb = "sdb"

& $sdb connect "$Tv`:26101"

# 1) Back up the current home keys (critical — this is how you undo it)
$backup = Join-Path $PSScriptRoot "home-backup.txt"
"# Haitham TV home-takeover backup  $(Get-Date -Format o)" | Out-File $backup -Encoding utf8
foreach ($k in "db/appfw/home_appid", "db/appfw/startup_appid") {
  $val = (& $sdb shell "vconftool get $k") 2>$null
  "$k :: $val" | Out-File $backup -Append -Encoding utf8
}
Write-Host "Backed up current home keys -> $backup" -ForegroundColor Cyan
Get-Content $backup

# 2) Point the TV's Home at Haitham TV (no root; relies on the dev-mode allowlisted shell)
& $sdb shell "vconftool set -t string -f db/appfw/home_appid $Wrapper"
& $sdb shell "vconftool set -t string -f db/appfw/startup_appid $Launcher"

Write-Host "`nDone. Press Home on the remote to test." -ForegroundColor Green
Write-Host "To undo: ./rollback-home.ps1  (reads the original values from home-backup.txt)"
