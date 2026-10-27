// Photo wallpaper manager: picks a city + time-of-day slot and crossfades between images.
window.Wallpaper = (function () {
  var layers, cur = 0, enabled = true, failed = false, cfg, photos;

  function init(c, p) {
    cfg = c; photos = p;
    layers = [document.getElementById("wp-a"), document.getElementById("wp-b")];
    layers.forEach(function (im) {
      im.addEventListener("error", function () {
        failed = true;
        document.getElementById("wallpaper").style.opacity = 0;
      });
    });
  }

  // Map the current time to a slot using real sun phases when available.
  function slotFor(now, sun) {
    if (sun && sun.dawn && sun.sunriseEnd && sun.sunsetStart && sun.dusk) {
      if (now < sun.dawn || now >= sun.dusk) return "night";
      if (now < sun.sunriseEnd) return "dawn";
      if (now < sun.sunsetStart) return "day";
      return "dusk";
    }
    var h = now.getHours();
    return h < 6 ? "night" : h < 8 ? "dawn" : h < 17 ? "day" : h < 19 ? "dusk" : "night";
  }

  function set(cityKey, slot) {
    if (!enabled) return;
    var city = photos[cityKey]; if (!city) return;
    var entry = city.slots[slot] || city.slots.day; if (!entry) return;
    var next = layers[1 - cur], show = layers[cur];
    next.onload = function () {
      next.classList.add("show");
      show.classList.remove("show");
      cur = 1 - cur; failed = false;
      document.getElementById("wallpaper").style.opacity = 1;
    };
    next.src = entry.url;
    var label = document.getElementById("city-label");
    if (label) label.textContent = city.name + " · " + city.country;
  }

  function hasFailed() { return failed; }
  function setEnabled(v) {
    enabled = v;
    document.getElementById("wallpaper").style.opacity = v ? 1 : 0;
  }

  return { init: init, slotFor: slotFor, set: set, hasFailed: hasFailed, setEnabled: setEnabled };
})();
