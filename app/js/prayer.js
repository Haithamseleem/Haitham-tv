// Prayer times via adhan.js (MIT). Returns today's times + the next upcoming prayer.
window.Prayer = (function () {
  function methodFor(key) {
    var M = adhan.CalculationMethod;
    var map = {
      Dubai: M.Dubai, UmmAlQura: M.UmmAlQura, MuslimWorldLeague: M.MuslimWorldLeague,
      Egyptian: M.Egyptian, Kuwait: M.Kuwait, Qatar: M.Qatar, Karachi: M.Karachi,
      NorthAmerica: M.NorthAmerica, Turkey: M.Turkey, Singapore: M.Singapore, Tehran: M.Tehran
    };
    return (map[key] || M.Dubai)();
  }

  function compute(cfg, date) {
    date = date || new Date();
    var coords = new adhan.Coordinates(cfg.location.lat, cfg.location.lon);
    var params = methodFor(cfg.prayerMethod);
    params.madhab = (cfg.madhab === "Hanafi") ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;

    var pt = new adhan.PrayerTimes(coords, date, params);
    var names = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
    var times = {};
    names.forEach(function (n) { times[n] = pt[n]; });

    var nextKey = pt.nextPrayer();
    var next;
    if (nextKey && nextKey !== adhan.Prayer.None) {
      next = { key: nextKey, date: pt.timeForPrayer(nextKey) };
    } else {
      // Past Isha — next prayer is tomorrow's Fajr.
      var tmr = new adhan.PrayerTimes(coords, new Date(date.getTime() + 86400000), params);
      next = { key: "fajr", date: tmr.fajr };
    }
    return { times: times, next: next, raw: pt };
  }

  return { compute: compute };
})();
