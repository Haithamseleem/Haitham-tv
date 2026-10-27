# Haitham TV

A calm, ad-free home screen for Samsung Tizen TVs — a **time-of-day wallpaper** of Arab
cities (Dubai, Abu Dhabi, Mecca, Medina, and more) that shifts from dawn to night with your
real local sunrise/sunset, an Apple-TV-style **frosted-glass clock**, and **prayer times with
an azan reminder**.

> Status: early scaffold. The wallpaper photos are placeholders until licensed images are
> curated — see [Wallpapers & licensing](#wallpapers--licensing).

## Features

- **Dynamic time-of-day wallpaper** — each city has dawn / day / dusk / night photos; the app
  picks the one matching the real sun position for your location.
- **Prayer times + azan reminder** — computed offline with [adhan.js], method configurable
  (Dubai, Umm al-Qura, MWL, Egyptian, …).
- **Glass clock & date** — tvOS-style frosted panel over the wallpaper.
- **City rotation** — cycles through your chosen cities; arrow keys change city on the fly.
- **Illustrated fallback** — an animated beach scene (`theme: "scene"`) that also shows if a
  photo fails to load. No blank screens.

## Quick start (browser)

No TV needed to iterate on the look:

```bash
python dev-server.py      # serves app/ at http://localhost:8080
```

Then open <http://localhost:8080>. Press **← / →** (or **a / d**) to change city, **p** to
toggle photo vs. illustrated scene.

## Configure

Edit [`app/config.js`](app/config.js) (or copy it to `app/config.local.js` to keep changes out
of git):

| Setting | What it does |
|---|---|
| `location` | `{ lat, lon, name }` — drives sunrise/sunset **and** prayer times |
| `prayerMethod` / `madhab` | adhan.js calculation method and Asr rule |
| `theme` | `"photos"` or `"scene"` |
| `cityRotation` / `rotateMinutes` | which cities to cycle, and how often |
| `clock24h`, `language`, `sound`, `azanSound` | clock format, en/ar, azan audio |

## Install on a Samsung TV

1. On the TV: **Apps** → type `12345` → turn **Developer Mode** on → enter your PC's IP → reboot.
2. On your PC: install [Tizen Studio] + the TV extension, create a Samsung certificate.
3. Package & install:
   ```bash
   sdb connect <TV_IP>
   tizen package -t wgt -s <your-cert-profile> -- .
   tizen install -n HaithamTV.wgt -t <device>
   ```
   (`tools/install.ps1` wraps these steps.)

Self-signed apps expire after ~30–60 days — just re-run the install. A `icon.png` (512×512) is
required for packaging; add your own.

## Wallpapers & licensing

The photo URLs in [`app/js/photos.js`](app/js/photos.js) are **placeholders**. Before publishing,
replace each slot with a properly licensed image and record it in [CREDITS.md](CREDITS.md):

- **Unsplash / Pexels** — free to use and bundle, no permission needed.
- **Wikimedia Commons** — great for landmarks; most require attribution (CC BY / BY-SA).

Never ship random images pulled from the web.

## Credits

- Prayer times: [adhan.js] (MIT) · Sun position: [SunCalc] (BSD-2)
- Wallpaper photos: see [CREDITS.md](CREDITS.md)

## License

MIT — see [LICENSE](LICENSE). Bundled photos are licensed separately (CREDITS.md).

[adhan.js]: https://github.com/batoulapps/adhan-js
[SunCalc]: https://github.com/mourner/suncalc
[Tizen Studio]: https://developer.tizen.org/development/tizen-studio/download
