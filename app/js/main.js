// Haitham TV — boot and wiring.
(function () {
  var cfg = window.HAITHAM_CONFIG, photos = window.HAITHAM_PHOTOS;
  Scene.init(document.getElementById("scene"));
  Wallpaper.init(cfg, photos);

  var usePhotos = cfg.theme !== "scene";
  Wallpaper.setEnabled(usePhotos);

  var liveOk = Live.init(document.getElementById("live"));
  var cities = (cfg.cityRotation && cfg.cityRotation.length) ? cfg.cityRotation.slice() : Object.keys(photos);
  if (!liveOk) cities = cities.filter(function (c) { return c !== "live"; });
  if (!cities.length) cities = ["dubai"];
  var ci = 0, lastSlot = "", lastCity = "";
  var PN = { fajr: "Fajr", sunrise: "Shuruq", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" };
  var prayer = null, prayerDay = -1, lastAzan = "";

  function two(n) { return (n < 10 ? "0" : "") + n; }
  function sunTimes(now) {
    try { return SunCalc.getTimes(now, cfg.location.lat, cfg.location.lon); } catch (e) { return null; }
  }
  function fmtTime(d) {
    if (!(d instanceof Date) || isNaN(d)) return "--:--";
    var h = d.getHours(), m = d.getMinutes();
    if (cfg.clock24h) return two(h) + ":" + two(m);
    return (h % 12 || 12) + ":" + two(m) + " " + (h < 12 ? "AM" : "PM");
  }
  function fmtDur(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + "m " + ss + "s";
    return ss + "s";
  }
  function renderClock(now) {
    var h = now.getHours(), m = now.getMinutes();
    document.getElementById("clock").textContent = cfg.clock24h ? two(h) + ":" + two(m) : (h % 12 || 12) + ":" + two(m);
    document.getElementById("date").textContent =
      now.toLocaleDateString(cfg.language === "ar" ? "ar" : "en-US", { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("location").textContent = cfg.location.name;
  }
  function renderPrayers(now) {
    if (typeof adhan === "undefined") return;
    if (!prayer || now.getDate() !== prayerDay || (prayer.next && now >= prayer.next.date)) {
      prayer = Prayer.compute(cfg, now); prayerDay = now.getDate();
    }
    if (!prayer) return;
    var order = ["fajr", "dhuhr", "asr", "maghrib", "isha"], html = "";
    order.forEach(function (k) {
      var isNext = prayer.next && prayer.next.key === k;
      html += '<li class="' + (isNext ? "next" : "") + '"><span class="pname">' + PN[k] +
              '</span><span class="ptime">' + fmtTime(prayer.times[k]) + "</span></li>";
    });
    document.getElementById("prayers").innerHTML = html;

    var cd = document.getElementById("countdown");
    if (cd && prayer.next) {
      cd.innerHTML = '<span class="cd-label">' + PN[prayer.next.key] + ' in </span>' +
                     '<span class="cd-time">' + fmtDur(prayer.next.date - now) + '</span>';
    }

    order.forEach(function (k) {
      var d = prayer.times[k];
      if (d && Math.abs(d - now) < 1000 && lastAzan !== k + now.toDateString()) {
        lastAzan = k + now.toDateString();
        azan(PN[k]);
      }
    });
  }
  var azanTimer = null;
  function azan(name) {
    var b = document.getElementById("azan-banner");
    document.getElementById("azan-text").textContent = "Time for " + name + " prayer";
    b.hidden = false;
    if (azanTimer) clearTimeout(azanTimer);
    azanTimer = setTimeout(function () { b.hidden = true; }, 90000);
    try { if (cfg.sound && cfg.azanSound) new Audio(cfg.azanSound).play(); } catch (e) {}
  }
  function setLabel(txt) { var l = document.getElementById("city-label"); if (l) l.textContent = txt; }
  function updateWallpaper(now, sun) {
    var city = cities[ci];
    if (city === "live") {
      if (lastCity !== "live") { Wallpaper.setEnabled(false); Live.start(); setLabel("Live"); lastCity = "live"; lastSlot = ""; }
      return;
    }
    if (lastCity === "live") { Live.stop(); Wallpaper.setEnabled(true); }
    if (Wallpaper.hasFailed()) Scene.draw(now, sun);
    var slot = Wallpaper.slotFor(now, sun);
    if (slot !== lastSlot || city !== lastCity) { Wallpaper.set(city, slot); lastSlot = slot; lastCity = city; }
  }
  function tick() {
    var now = new Date(), sun = sunTimes(now);
    renderClock(now); renderPrayers(now);
    if (usePhotos) updateWallpaper(now, sun);
    else Scene.draw(now, sun);
  }

  function nextCity(d) { ci = (ci + d + cities.length) % cities.length; lastSlot = ""; }
  setInterval(function () { if (usePhotos) nextCity(1); }, (cfg.rotateMinutes || 15) * 60000);

  window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 37: case 65: case 403: nextCity(-1); break;   // Left / a / Red
      case 39: case 68: case 404: nextCity(1); break;    // Right / d / Green
      case 80: case 405: usePhotos = !usePhotos; lastSlot = ""; lastCity = ""; if (!usePhotos) { Live.stop(); Wallpaper.setEnabled(false); } else { Wallpaper.setEnabled(true); } break; // p / Yellow
      case 10009: try { tizen.application.getCurrentApplication().exit(); } catch (_) {} break; // TV back
    }
  });

  tick();
  setInterval(tick, 1000);
})();
