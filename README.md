# Haitham TV

An Apple TV-style home screen for a Samsung BU8000 (Tizen 6.5), launched through TizenBrew.
Plain ES2017 with no build step and no frameworks. It animates only transforms and opacity, so it stays smooth on the TV.

## Features

- **Top Shelf:** a full-screen real city photo, kept clean. The only per-prayer change is a soft colour grade: dawn at Fajr, bright at Dhuhr, gold at Asr, sunset at Maghrib, night at Isha. Photos rotate with a crossfade.
- **Clock card:** big clock, Gregorian and Hijri (Umm al-Qura) dates, and the city.
- **Next-prayer card:** Arabic and English name, the time, and a progress ring showing the time elapsed since the previous prayer.
- **App row:** rounded tvOS-style tiles that scale up with a sheen when focused (YouTube, Netflix, Shahid, Prime, Disney+, Live TV, Today, Weekly, Qibla).
- **Rows below:** Today's prayers (sunrise included), a 7-day timetable, the Qibla compass with its distance to Makkah, the Hijri date, and the city switcher.
- **Azan takeover:** a full-screen card at each prayer time with the name, time, a rotating star and rings, and the dua after the adhan. Audio plays only if `azanAudio` is set. OK or Back closes it, and it closes on its own after `azanTimeoutSec`.
- **Final-minutes glow:** during the last `glowMinutes` before a prayer, the screen slowly warms and dims and the ring turns orange.
- **Aerial screensaver:** after `screensaverMinutes` idle, a slow Ken Burns pan over the city photos with the time and city.
- **Drawn fallback:** if no photo is set or a photo fails to load, a 2D-canvas scene for the current prayer is shown instead: Fajr dawn glow, Dhuhr sun with rays, Asr light with dust motes, Maghrib sunset over the Gulf, or Isha stars, moon and an occasional shooting star, all behind a Gulf skyline. It renders at 0.5 scale and is throttled to 30 fps. It uses no WebGL.

## Remote

| Key | Action |
|---|---|
| Left / Right | Move along a row |
| Up / Down | Move between rows. Up from the app row shows the clean Top Shelf |
| OK | Open the app or row, or change city on the City tile |
| Back | Return to the app row, then the Top Shelf. Closes the azan card |
| Red | Start the screensaver |
| Green | Next city |

Keyboard arrows, Enter and Esc work the same in the browser preview.

## Settings: `app/config.js`

Cities and calculation methods, real photo URLs (one list per city, optionally per prayer), apps and Tizen app IDs, 12/24-hour clock, azan audio and timeout, glow minutes, screensaver delay, scene fps and scale, and debug.

**Photos:** paste your city photo URLs into `photos`, for example `photos: { 'Dubai': ['https://…/1.jpg', 'https://…/2.jpg'] }`.
If you have the old `app/js/photos.js`, copy its URLs from there.

**App IDs to verify on the TV:** YouTube `111299001912`, Netflix `3201907018807`, Prime `3201910019365`, Disney+ `3201901017640`, Shahid `3201703012079`, Live TV `org.tizen.tv-viewer`. If a tile shows "Could not open", that ID is wrong for your TV model. Fix it in `config.js`.

## Debug and testing

Open `app/index.html?debug=1`, or set `debug: true`. You can also fake the clock with `?time=2026-10-28T17:40`.

| Key | Action |
|---|---|
| 1–5 | Force the Fajr / Dhuhr / Asr / Maghrib / Isha scene |
| N | Jump to 1 minute before the next prayer (the azan fires a minute later) |
| G | Jump to 10 minutes before the next prayer (glow test) |
| A | Show the azan card now |
| S | Start the screensaver |
| C | Next city |
| 0 | Back to the real clock |

Run the preview locally with `python -m http.server 8766 --directory app`, then open <http://127.0.0.1:8766/?debug=1>.

## Install with TizenBrew

1. On the TV, open **TizenBrew** and press the **green** button to open the module manager.
2. Delete the old home-screen module (the one under the previous repo name) if it is still listed.
3. Choose **Add GitHub module** and enter `Haithamseleem/haitham-tv`.
4. Open **Haitham TV** from the TizenBrew list. To make it start automatically, set it as the autolaunch module in TizenBrew settings if your version has that option.

Haitham TV runs as a full-screen app. It cannot replace Samsung's own system home bar.
