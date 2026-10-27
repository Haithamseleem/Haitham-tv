// Wallpaper manifest. Each city has 4 time-of-day slots: dawn / day / dusk / night.
//
// The URLs below are PLACEHOLDERS (random landscapes) so the mechanics work out of the box.
// Replace each slot's `url` + `credit` with a properly licensed photo:
//   - Unsplash / Pexels (free license, bundling OK) or Wikimedia Commons (CC — needs attribution)
//   - Never use random web/Google images in a published repo.
// Then record the attribution in CREDITS.md. You can also drop a curated set into
// app/js/curated-photos.js (git-ignored) to override during development.
(function () {
  var CITIES = [
    ["dubai",      "Dubai",       "UAE"],
    ["abudhabi",   "Abu Dhabi",   "UAE"],
    ["mecca",      "Mecca",       "Saudi Arabia"],
    ["medina",     "Medina",      "Saudi Arabia"],
    ["jerusalem",  "Jerusalem",   "Palestine"],
    ["doha",       "Doha",        "Qatar"],
    ["riyadh",     "Riyadh",      "Saudi Arabia"],
    ["kuwait",     "Kuwait City", "Kuwait"],
    ["manama",     "Manama",      "Bahrain"],
    ["muscat",     "Muscat",      "Oman"],
    ["cairo",      "Cairo",       "Egypt"],
    ["petra",      "Petra",       "Jordan"],
    ["beirut",     "Beirut",      "Lebanon"],
    ["casablanca", "Casablanca",  "Morocco"],
    ["marrakech",  "Marrakech",   "Morocco"]
  ];
  var SLOTS = ["dawn", "day", "dusk", "night"];
  var manifest = {};
  CITIES.forEach(function (c) {
    var slots = {};
    SLOTS.forEach(function (s) {
      slots[s] = {
        url: "https://picsum.photos/seed/" + c[0] + "-" + s + "/1920/1080",
        credit: "PLACEHOLDER — replace with a licensed photo + attribution"
      };
    });
    manifest[c[0]] = { name: c[1], country: c[2], slots: slots };
  });
  // Optional dev override (git-ignored): window.SAHIL_PHOTOS_CURATED = { dubai: {...} }
  if (window.SAHIL_PHOTOS_CURATED) {
    Object.keys(window.SAHIL_PHOTOS_CURATED).forEach(function (k) {
      manifest[k] = window.SAHIL_PHOTOS_CURATED[k];
    });
  }
  window.SAHIL_PHOTOS = manifest;
})();
