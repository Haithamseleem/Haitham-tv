// Sahil TV — user settings. Copy to config.local.js to override without touching git.
window.SAHIL_CONFIG = {
  // Your location drives both the sunrise/sunset wallpaper and the prayer times.
  location: { lat: 25.2048, lon: 55.2708, name: "Dubai, UAE" },

  // Prayer calculation method (adhan.js):
  // Dubai | UmmAlQura | MuslimWorldLeague | Egyptian | Kuwait | Qatar | Karachi | NorthAmerica | Turkey | Singapore | Tehran
  prayerMethod: "Dubai",
  madhab: "Shafi",          // Shafi | Hanafi  — affects Asr time

  theme: "photos",          // "photos" = real city photos, "scene" = illustrated beach
  cityRotation: ["dubai", "abudhabi", "mecca", "medina", "jerusalem", "doha"],
  rotateMinutes: 15,        // switch to the next city every N minutes

  clock24h: false,
  language: "en",           // en | ar

  sound: false,             // play an adhan sound at prayer time
  azanSound: ""             // URL/path to an adhan audio file (optional)
};
