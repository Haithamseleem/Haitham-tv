# Restore the TV's stock Home. Reads the originals saved by set-home.ps1 in home-backup.txt,
# or pass them explicitly.  Usage:
#   ./rollback-home.ps1 -Tv 192.168.1.182
#   ./rollback-home.ps1 -HomeAppid <orig> -StartupAppid <orig>
param(
  [string]$Tv = "192.168.1.182",
  [string]$HomeAppid = "",
  [string]$StartupAppid = ""
)
$sdb = "sdb"
& $sdb connect "$Tv`:26101"

function Parse([string]$key) {
  $line = Get-Content (Join-Path $PSScriptRoot "home-backup.txt") -ErrorAction SilentlyContinue |
          Where-Object { $_ -match [regex]::Escape($key) } | Select-Object -First 1
  if ($line -and $line -match "value\s*=\s*(\S+)") { return $Matches[1] }
  return ""
}
if (-not $HomeAppid)    { $HomeAppid    = Parse "db/appfw/home_appid" }
if (-not $StartupAppid) { $StartupAppid = Parse "db/appfw/startup_appid" }

if (-not $HomeAppid -or -not $StartupAppid) {
  Write-Host "Could not read original values. Open home-takeover/home-backup.txt, then run:" -ForegroundColor Yellow
  Write-Host "  ./rollback-home.ps1 -HomeAppid <original> -StartupAppid <original>"
  exit 1
}
& $sdb shell "vconftool set -t string -f db/appfw/home_appid $HomeAppid"
& $sdb shell "vconftool set -t string -f db/appfw/startup_appid $StartupAppid"
Write-Host "Restored stock Home ($HomeAppid / startup $StartupAppid)." -ForegroundColor Green
