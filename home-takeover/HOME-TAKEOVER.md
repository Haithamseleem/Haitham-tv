# Sahil TV — Samsung Home takeover (advanced, reversible)

Make your Samsung TV open **Sahil TV** when you press **Home** / power on, instead of
Samsung's own launcher. Based on the method in
[KSWORK2001/fresh-home](https://github.com/KSWORK2001/fresh-home).

> **Run this on a PERSONAL computer on the TV's home Wi-Fi — not a work/managed machine.**
> It installs the multi-GB Tizen Studio and changes a system setting on the TV.

## ⚠️ Read first
- **Reversible:** `set-home.ps1` backs up the current Home values to `home-backup.txt`, and
  `rollback-home.ps1` restores them. A firmware update also reverts the change.
- **Untested on the BU8000 specifically** (the method lists Tizen 2016+, but was field-tested
  on other models). There's a small risk it needs tweaking or doesn't stick — keep the backup.
- No rooting/jailbreak. It uses the Developer-Mode `sdb` shell only.

## What it does
Two apps are installed and signed, then two system keys are pointed at them:
- `db/appfw/home_appid`    → `SahilHome1.SahilHome` (the tiny wrapper in `wrapper/`)
- `db/appfw/startup_appid` → `SahilTV001.SahilTV` (the real app, repo root `config.xml`)

The wrapper exists because the TV relaunches Home with `__NO_RAISE_WINDOW`; it launches the
real app and exits so nothing stays hidden behind the loading screen.

## Prerequisites
1. A personal computer on the same Wi-Fi as the TV.
2. **Developer Mode** on the TV (Apps → `12345` → On → Host PC IP = this computer → reboot).
3. **Tizen Studio** (with IDE) + the **TV Extensions** — <https://developer.tizen.org/development/tizen-studio/download>
4. A **Samsung certificate**: in Tizen Studio → **Certificate Manager**, create a Samsung
   profile (author cert + a **DUID-bound distributor cert** — connect the TV first so it reads the DUID).
5. Add a `icon.png` (512×512) to the repo root **and** to `home-takeover/wrapper/` (packaging needs one).

## Steps
From this computer, with `sdb` and `tizen` (Tizen Studio `tools/` and `tools/ide/bin`) on PATH:

```bash
# 1) Connect
sdb connect 192.168.1.182:26101
sdb devices                     # TV should show as "device"

# 2) Build + sign the real app (run in the repo root)
tizen build-web -out .buildResult
tizen package -t wgt -s <your-cert-profile> -- .buildResult
#   -> produces SahilTV001.SahilTV.wgt (or similar)

# 3) Build + sign the wrapper (run in home-takeover/wrapper)
tizen build-web -out .buildResult
tizen package -t wgt -s <your-cert-profile> -- .buildResult
#   -> produces SahilHome1.SahilHome.wgt

# 4) Install both
sdb install <path-to>/SahilTV001.SahilTV.wgt
sdb install <path-to>/SahilHome1.SahilHome.wgt

# 5) Point Home at Sahil TV (backs up originals first)
powershell -File home-takeover/set-home.ps1 -Tv 192.168.1.182
```

Press **Home** on the remote — Sahil TV should open.

## Undo
```bash
powershell -File home-takeover/rollback-home.ps1 -Tv 192.168.1.182
```
It restores the original `home_appid` / `startup_appid` from `home-backup.txt`.
(If the file is gone, read the originals you noted and pass `-HomeAppid` / `-StartupAppid`.)

## Credit
Home-key / vconf technique from [fresh-home](https://github.com/KSWORK2001/fresh-home) (verify
its latest `platforms/samsung-tizen/` scripts if a firmware update changes behavior).
