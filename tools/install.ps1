# Package and install Haitham TV onto a Samsung Tizen TV.
# Prereqs: Tizen Studio CLI on PATH, a Samsung certificate profile, Developer Mode on the TV.
#   Usage:  ./tools/install.ps1 -Tv 192.168.1.182 -CertProfile haitham
param(
  [string]$Tv = "192.168.1.182",
  [string]$CertProfile = "haitham"
)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

sdb connect $Tv
$device = (sdb devices | Select-String "device`t" | ForEach-Object { ($_ -split "\s+")[0] } | Select-Object -First 1)
if (-not $device) { throw "No TV connected. Check Developer Mode + host IP on the TV." }

tizen package -t wgt -s $CertProfile -- .
$wgt = Get-ChildItem -Path $root -Filter *.wgt | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $wgt) { throw "No .wgt produced — check the certificate profile name." }

tizen install -n $wgt.Name -t $device
Write-Host "Installed $($wgt.Name) to $device" -ForegroundColor Green
