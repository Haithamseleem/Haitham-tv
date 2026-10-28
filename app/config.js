/* Haitham TV - settings. Edit this file to customise the TV. */
window.HAITHAM_CONFIG = {
  appName: 'Haitham TV',

  // Cities: Up/Down no longer switch cities; use the "City" tile in the bottom row.
  // method: 'uae' (Fajr/Isha 18.2), 'egypt' (19.5/17.5), 'mwl' (18/17), 'makkah' (18.5, Isha 90 min).
  // timeZone: IANA zone used to show times. offsets: per-prayer minute tweaks to match local mosques.
  cities: [
    { name: 'Dubai',     nameAr: 'دبي',       lat: 25.2048, lng: 55.2708, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Abu Dhabi', nameAr: 'أبوظبي',    lat: 24.4539, lng: 54.3773, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Sharjah',   nameAr: 'الشارقة',   lat: 25.3463, lng: 55.4209, timeZone: 'Asia/Dubai', method: 'uae', offsets: { dhuhr: 1, maghrib: 1 } },
    { name: 'Cairo',     nameAr: 'القاهرة',   lat: 30.0444, lng: 31.2357, timeZone: 'Africa/Cairo', method: 'egypt', offsets: {} },
    { name: 'Makkah',    nameAr: 'مكة',       lat: 21.4225, lng: 39.8262, timeZone: 'Asia/Riyadh', method: 'makkah', offsets: {} }
  ],
  defaultCity: 0,

  // Real city photos for the Top Shelf, keyed by city name. Any https image URL works.
  // Copy the URLs from the old app/js/photos.js here. With no photos, the drawn
  // per-prayer scene is used instead.
  // Optional per-prayer photos: { fajr: [...], dhuhr: [...], asr: [...], maghrib: [...], isha: [...] }
  photos: {
    // 'Dubai': ['https://.../dubai-1.jpg', 'https://.../dubai-2.jpg'],
  },
  photoRotateMinutes: 10,     // change photo every N minutes (crossfade)

  // Apple TV-style app row. appId = Tizen application id, launched with tizen.application.launch.
  // IDs are the ones commonly used on 2022 Samsung TVs; verify on your TV (see README).
  // action: 'today' | 'week' | 'qibla' jumps to that row instead of launching an app.
  apps: [
    { name: 'YouTube',   appId: '111299001912',  color: '#ff0033', glyph: '▶' },
    { name: 'Netflix',   appId: '3201907018807', color: '#000000', glyph: 'N', glyphColor: '#e50914' },
    { name: 'Shahid',    appId: '3201703012079', color: '#0f9d58', glyph: 'شاهد' },
    { name: 'Prime',     appId: '3201910019365', color: '#00a8e1', glyph: 'prime' },
    { name: 'Disney+',   appId: '3201901017640', color: '#0b1b5c', glyph: 'D+' },
    { name: 'Live TV',   appId: 'org.tizen.tv-viewer', color: '#334155', glyph: 'TV' },
    { name: 'Today',     action: 'today', color: '#b7791f', glyph: '☾' },
    { name: 'Weekly',    action: 'week',  color: '#6b46c1', glyph: '7' },
    { name: 'Qibla',     action: 'qibla', color: '#047857', glyph: '۞' }
  ],

  clock24h: false,

  // Azan takeover
  azanTakeover: true,
  azanAudio: '',              // e.g. 'https://example.com/azan.mp3' - empty = silent
  azanTimeoutSec: 120,
  azanFajrAudio: '',          // optional separate Fajr azan

  // Last-minutes warm glow before the next prayer
  glowMinutes: 15,
  glowMax: 0.75,

  // Aerial screensaver after N idle minutes (0 = off)
  screensaverMinutes: 5,

  // Scene rendering
  sceneFps: 30,
  sceneScale: 0.5,            // canvas resolution vs screen (sky is soft, 0.5 is plenty)
  crossfadeMs: 2500,

  // Debug: also enabled with ?debug=1. Fake clock with ?time=2026-10-28T17:55
  // Keys in debug: 1-5 force scene, N = 1 min before next prayer, A = azan now,
  // S = screensaver, G = glow test (10 min before next prayer), 0 = real clock.
  debug: false
};
