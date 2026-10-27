// Sahil TV — boot and wiring.
(function () {
  var cfg = window.SAHIL_CONFIG, photos = window.SAHIL_PHOTOS;
  Scene.init(document.getElementById("scene"));
  Wallpaper.init(cfg, photos);

  var usePhotos = cfg.theme === "photos";
  Wallpaper.setEnabled(usePhotos);

  var cities = (cfg.cityRotation && cfg.cityRotation.length) ? cfg.cityRotation : Object.keys(photos);
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
  function renderClock(now) {
    var h = now.getHours(), m = now.getMinutes();
    document.getElementById("clock").textContent = cfg.clock24h ? two(h) + ":" + two(m) : (h % 12 || 12) + ":" + two(m);
    document.getElementById("date").textContent =
      now.toLocaleDateString(cfg.language === "ar" ? "ar" : "en-US", { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("location").textContent = cfg.location.name;
  }
  function renderPrayers(now) {
    if (typeof adhan === "undefined") return;
    if (now.getDate() !== prayerDay) { prayer = Prayer.compute(cfg, now); prayerDay = now.getDate(); }
    if (!prayer) return;
    var order = ["fajr", "dhuhr", "asr", "maghrib", "isha"], html = "";
    order.forEach(function (k) {
      var isNext = prayer.next && prayer.next.key === k;
      html += '<li class="' + (isNext ? "next" : "") + '"><span class="pname">' + PN[k] +
              '</span><span class="ptime">' + fmtTime(prayer.times[k]) + "</span></li>";
    });
    document.getElementById("prayers").innerHTML = html;
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
  function updateWallpaper(now, sun) {
    var slot = Wallpaper.slotFor(now, sun), city = cities[ci];
    if (slot !== lastSlot || city !== lastCity) { Wallpaper.set(city, slot); lastSlot = slot; lastCity = city; }
  }
  function tick() {
    var now = new Date(), sun = sunTimes(now);
    renderClock(now); renderPrayers(now);
    Scene.draw(now, sun);
    if (usePhotos && !Wallpaper.hasFailed()) updateWallpaper(now, sun);
  }

  function nextCity(d) { ci = (ci + d + cities.length) % cities.length; lastSlot = ""; }
  setInterval(function () { if (usePhotos) nextCity(1); }, (cfg.rotateMinutes || 15) * 60000);

  window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 37: case 65: nextCity(-1); break;   // Left / a
      case 39: case 68: nextCity(1); break;    // Right / d
      case 80: usePhotos = !usePhotos; Wallpaper.setEnabled(usePhotos); lastSlot = ""; break; // p
      case 10009: try { tizen.application.getCurrentApplication().exit(); } catch (_) {} break; // TV back
    }
  });

  tick();
  setInterval(tick, 1000);
})();
