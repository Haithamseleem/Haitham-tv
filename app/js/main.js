/* Haitham TV - Apple TV-style home: Top Shelf, app row, prayer rows, screensaver,
 * azan takeover, final-minutes glow, remote navigation and debug tools. ES2017, no build.
 */
(function () {
  'use strict';

  var C = window.HAITHAM_CONFIG, P = window.HaithamPrayer;
  var $ = function (s) { return document.querySelector(s); };
  var params = parseQuery(location.search);

  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, OK: 13, BACK: 10009, ESC: 27, BKSP: 8, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406 };
  var ROWS = 4;

  var state = {
    row: 0, shelf: false, col: [0, 0, 0, 0],
    city: loadCity(),
    forced: null,                 // debug: forced prayer scene
    clockOffset: 0,
    lastAzanKey: '', lastDay: '', lastInput: Date.now(), saver: false,
    photo: null, photoIdx: 0, photoAt: 0
  };

  var debug = C.debug || params.debug === '1';
  if (params.time) setFakeTime(params.time);

  // ---------- helpers ----------

  function parseQuery(q) {
    var o = {};
    q.replace(/^\?/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      o[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1));
    });
    return o;
  }
  function now() { return new Date(Date.now() + state.clockOffset); }
  function city() { return C.cities[state.city] || C.cities[0]; }
  function loadCity() {
    var v = -1;
    try { v = parseInt(localStorage.getItem('htv.city'), 10); } catch (e) {}
    return v >= 0 && v < C.cities.length ? v : (C.defaultCity || 0);
  }
  function saveCity() { try { localStorage.setItem('htv.city', String(state.city)); } catch (e) {} }
  function setFakeTime(s) {
    var t = new Date(s).getTime();
    if (!isNaN(t)) state.clockOffset = t - Date.now();
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(d) { return P.fmtTime(d, city().timeZone, C.clock24h); }
  var toastTimer = 0;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 3000);
  }

  // ---------- scenes / photos ----------

  var scenes = HaithamScenes.mount($('#bg'), { fps: C.sceneFps, scale: C.sceneScale, fadeMs: C.crossfadeMs });

  function photoList(period) {
    var p = (C.photos || {})[city().name];
    if (!p) return [];
    if (Array.isArray(p)) return p;
    return p[period] || p.all || [];
  }

  function updatePhoto(period, force) {
    var list = photoList(period);
    if (!list.length) { if (state.photo) { state.photo = null; scenes.setPhoto(null); } return; }
    var t = Date.now();
    if (force || !state.photo || t - state.photoAt > C.photoRotateMinutes * 60000 || list.indexOf(state.photo) < 0) {
      state.photoIdx = (state.photoIdx + (state.photo ? 1 : 0)) % list.length;
      state.photo = list[state.photoIdx];
      state.photoAt = t;
      scenes.setPhoto(state.photo);
    }
  }

  // ---------- rendering ----------

  function renderApps() {
    var box = $('#apps'); box.innerHTML = '';
    C.apps.forEach(function (a) {
      var t = el('div', 'tile app');
      var face = el('div', 'tile-face');
      face.style.background = a.color || '#333';
      var g = el('div', 'app-glyph' + (String(a.glyph || '').length > 2 ? ' small' : ''), esc(a.glyph || a.name.charAt(0)));
      if (a.glyphColor) g.style.color = a.glyphColor;
      face.appendChild(g);
      t.appendChild(face);
      t.appendChild(el('div', 'tile-label', esc(a.name)));
      box.appendChild(t);
    });
  }

  function renderToday() {
    var n = now(), c = city(), t = P.forDay(c, n, 0), nx = P.around(c, n).next;
    var box = $('#today'); box.innerHTML = '';
    ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function (k) {
      var cls = 'tile pcard' + (k === 'sunrise' ? ' minor' : '') + (t[k] <= n ? ' past' : '') +
        (nx && nx.key === k && nx.time.getTime() === t[k].getTime() ? ' next' : '');
      var card = el('div', cls);
      card.appendChild(el('div', 'tile-face',
        '<div><div class="p-ar">' + P.NAMES[k][0] + '</div><div class="p-en">' + P.NAMES[k][1] + '</div></div>' +
        '<div class="p-time">' + fmt(t[k]) + '</div>'));
      box.appendChild(card);
    });
  }

  function renderWeek() {
    var n = now(), c = city(), box = $('#week'); box.innerHTML = '';
    for (var i = 0; i < 7; i++) {
      var t = P.forDay(c, n, i);
      var d = new Date(Date.UTC(t.ymd.y, t.ymd.m - 1, t.ymd.d, 12));
      var head = i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
      var sub = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
      var rows = P.ORDER.map(function (k) { return '<div class="d-row"><span>' + P.NAMES[k][1] + '</span><span>' + fmt(t[k]).replace(/ [AP]M$/, '') + '</span></div>'; }).join('');
      var card = el('div', 'tile dcard' + (i === 0 ? ' today' : ''));
      card.appendChild(el('div', 'tile-face', '<div class="d-head">' + head + '</div><div class="d-sub">' + sub + '</div>' + rows));
      box.appendChild(card);
    }
  }

  function renderQibla() {
    var c = city(), n = now(), box = $('#qibla'); box.innerHTML = '';
    var deg = P.qibla(c.lat, c.lng), km = Math.round(P.distanceKm(c.lat, c.lng));

    var q = el('div', 'tile qcard');
    q.appendChild(el('div', 'tile-face',
      '<div class="compass"><div class="n">N</div><div class="needle" style="transform:rotate(' + deg.toFixed(1) + 'deg)"></div><div class="kaaba"></div></div>' +
      '<div class="q-text"><div class="q-ar">اتجاه القبلة</div><div class="q-big">' + Math.round(deg) + '°</div>' +
      '<div class="q-small">from true north · ' + km.toLocaleString('en') + ' km to Makkah</div></div>'));
    box.appendChild(q);

    var h = el('div', 'tile qcard');
    h.appendChild(el('div', 'tile-face',
      '<div class="q-text" style="margin-left:0"><div class="q-ar">' + esc(P.hijri(n, c.timeZone, 'ar') || '') + '</div>' +
      '<div class="q-big" style="font-size:3.6vh">' + esc(P.hijri(n, c.timeZone, 'en') || 'Hijri date') + '</div>' +
      '<div class="q-small">Umm al-Qura calendar</div></div>'));
    box.appendChild(h);

    var cc = el('div', 'tile qcard city-tile');
    cc.appendChild(el('div', 'tile-face',
      '<div class="q-text" style="margin-left:0"><div class="q-small">City · press OK to change</div>' +
      '<div class="q-big">' + esc(c.name) + '</div><div class="q-ar">' + esc(c.nameAr || '') + '</div></div>'));
    box.appendChild(cc);
  }

  function renderAll() {
    renderApps(); renderToday(); renderWeek(); renderQibla();
    applyFocus();
  }

  // ---------- focus / navigation ----------

  function rowItems(r) { return document.querySelectorAll('.row[data-row="' + r + '"] .tile'); }

  function applyFocus(dir) {
    document.body.classList.toggle('shelf', state.shelf);
    document.body.classList.toggle('deep', !state.shelf && state.row > 0);
    $('#track').style.transform = 'translateY(' + (-state.row * 34) + 'vh)';
    for (var r = 0; r < ROWS; r++) {
      var rowEl = document.querySelector('.row[data-row="' + r + '"]');
      rowEl.classList.toggle('active', r === state.row && !state.shelf);
      var items = rowItems(r);
      if (state.col[r] >= items.length) state.col[r] = Math.max(0, items.length - 1);
      for (var i = 0; i < items.length; i++) {
        var on = r === state.row && i === state.col[r] && !state.shelf;
        items[i].classList.toggle('focus', on);
        items[i].classList.remove('tilt-l', 'tilt-r');
        if (on && dir) items[i].classList.add(dir < 0 ? 'tilt-l' : 'tilt-r');
      }
      // keep focused tile on screen
      var f = items[state.col[r]], strip = rowEl.querySelector('.row-items');
      if (f) {
        var limit = window.innerWidth * 0.86;
        var shift = Math.max(0, f.offsetLeft + f.offsetWidth - limit + window.innerWidth * 0.02);
        strip.style.transform = 'translateX(' + (-shift) + 'px)';
      }
    }
  }

  function move(dx, dy) {
    if (state.shelf) {
      if (dy > 0) { state.shelf = false; applyFocus(); }
      return;
    }
    if (dy) {
      var nr = state.row + dy;
      if (nr < 0) { state.shelf = true; applyFocus(); return; }
      if (nr >= ROWS) return;
      state.row = nr; applyFocus(); return;
    }
    var n = rowItems(state.row).length;
    var nc = Math.max(0, Math.min(n - 1, state.col[state.row] + dx));
    if (nc !== state.col[state.row]) { state.col[state.row] = nc; applyFocus(dx); }
  }

  function ok() {
    if (state.shelf) { state.shelf = false; applyFocus(); return; }
    if (state.row === 0) return launch(C.apps[state.col[0]]);
    if (state.row === 3 && state.col[3] === 2) return nextCity(1);
  }

  function back() {
    if (state.shelf) return;
    if (state.row > 0) { state.row = 0; applyFocus(); return; }
    state.shelf = true; applyFocus();
  }

  function launch(app) {
    if (!app) return;
    if (app.action) {
      var map = { today: 1, week: 2, qibla: 3 };
      state.row = map[app.action] || 0; applyFocus(); return;
    }
    if (typeof tizen === 'undefined' || !tizen.application) { toast(app.name + ' opens on the TV (preview mode)'); return; }
    try {
      tizen.application.launch(app.appId, function () {}, function (err) {
        toast('Could not open ' + app.name + (err && err.name ? ' (' + err.name + ')' : ''));
      });
    } catch (e) { toast('Could not open ' + app.name); }
  }

  function nextCity(d) {
    state.city = (state.city + d + C.cities.length) % C.cities.length;
    saveCity();
    state.photo = null; state.lastDay = '';
    toast('City: ' + city().name);
    tick(true);
  }

  // ---------- screensaver ----------

  var saverTimer = 0, saverFlip = false;
  function saverStep() {
    var list = [];
    HaithamScenes.PRAYERS.forEach(function (p) {
      photoList(p).forEach(function (u) { if (list.indexOf(u) < 0) list.push(u); });
    });
    var a = $('#saver-a'), b = $('#saver-b');
    if (!list.length) { a.classList.remove('on'); b.classList.remove('on'); return; }  // drawn scene shows through
    var show = saverFlip ? a : b, hide = saverFlip ? b : a;
    saverFlip = !saverFlip;
    state.saverIdx = ((state.saverIdx || 0) + 1) % list.length;
    show.style.backgroundImage = 'url("' + list[state.saverIdx].replace(/"/g, '%22') + '")';
    show.classList.remove('kb1', 'kb2'); void show.offsetWidth;
    show.classList.add(saverFlip ? 'kb1' : 'kb2', 'on');
    hide.classList.remove('on');
  }
  function enterSaver() {
    if (state.saver || AzanTakeover.isOpen()) return;
    state.saver = true;
    document.body.classList.add('saver');
    saverStep();
    saverTimer = setInterval(saverStep, 22000);
  }
  function exitSaver() {
    state.saver = false;
    document.body.classList.remove('saver');
    clearInterval(saverTimer);
    state.lastInput = Date.now();
  }

  // ---------- clock tick ----------

  function currentPeriod() {
    if (state.forced) return state.forced;
    return HaithamScenes.periodFor(now(), P.forDay(city(), now(), 0));
  }

  var CIRC = 2 * Math.PI * 52;

  function tick(forceRender) {
    var n = now(), c = city();

    // Day / city change -> rebuild rows
    var ymd = P.localYMD(n, c.timeZone), dayKey = c.name + ymd.y + '-' + ymd.m + '-' + ymd.d;
    if (forceRender || dayKey !== state.lastDay) { state.lastDay = dayKey; renderAll(); }

    // Clock + dates
    var t = fmt(n), m = t.match(/^(.*?)(?: ([AP]M))?$/);
    $('#clock-time').textContent = m[1];
    $('#clock-ampm').textContent = m[2] || '';
    $('#date-line').textContent = n.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: c.timeZone });
    $('#hijri-line').textContent = P.hijri(n, c.timeZone, 'en');
    $('#city-line').textContent = c.name;
    $('#saver-time').textContent = m[1] + (m[2] ? ' ' + m[2] : '');
    $('#saver-city').textContent = c.name;

    // Next prayer + ring
    var ar = P.around(c, n), nx = ar.next, pv = ar.prev;
    $('#next-ar').textContent = P.NAMES[nx.key][0];
    $('#next-en').textContent = P.NAMES[nx.key][1];
    $('#next-time').textContent = fmt(nx.time);
    var total = nx.time - pv.time, left = nx.time - n;
    var prog = Math.max(0, Math.min(1, 1 - left / total));
    $('#ring-fill').style.strokeDashoffset = String(CIRC * (1 - prog));
    var mins = Math.floor(left / 60000), secs = Math.floor(left / 1000) % 60;
    $('#ring-left').textContent = mins >= 60 ? Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm'
      : mins >= 10 ? mins + ' min' : mins + ':' + (secs < 10 ? '0' : '') + secs;

    // Final-minutes glow
    var gm = C.glowMinutes || 0, lm = left / 60000;
    var glow = gm && lm <= gm ? (1 - lm / gm) * (C.glowMax || 0.75) : 0;
    scenes.setGlow(glow);
    document.body.classList.toggle('soon', glow > 0);

    // Scene + photo
    var period = currentPeriod();
    if (scenes.getPrayer() !== period) { scenes.setPrayer(period); updatePhoto(period, true); }
    else updatePhoto(period, false);

    // Azan: fire within 60 s after a prayer time, once
    var since = n - pv.time, key = c.name + pv.key + pv.time.getTime();
    if (C.azanTakeover && since >= 0 && since < 60000 && key !== state.lastAzanKey) {
      state.lastAzanKey = key;
      fireAzan(pv.key, pv.time);
    }

    // Prayer cards: re-mark past/next each minute
    if (n.getSeconds() === 0) { renderToday(); applyFocus(); }

    // Screensaver
    if (C.screensaverMinutes > 0 && !state.saver && Date.now() - state.lastInput > C.screensaverMinutes * 60000) enterSaver();

    if (debug) {
      $('#debug').textContent = 'DEBUG  ' + n.toISOString().replace('T', ' ').slice(0, 19) + 'Z  scene=' + period +
        (state.forced ? ' (forced)' : '') + '  next=' + nx.key + ' ' + fmt(nx.time) + '  glow=' + glow.toFixed(2) +
        '\n1-5 scene  N next prayer -1min  A azan  S saver  G glow test  0 real clock  C city';
    }
  }

  function fireAzan(key, time) {
    if (state.saver) exitSaver();
    AzanTakeover.show({
      prayer: key, time: fmt(time),
      audio: (key === 'fajr' && C.azanFajrAudio) ? C.azanFajrAudio : C.azanAudio,
      timeoutSec: C.azanTimeoutSec,
      onHide: function () { state.lastInput = Date.now(); }
    });
  }

  // ---------- keys ----------

  function registerKeys() {
    if (typeof tizen === 'undefined' || !tizen.tvinputdevice) return;
    ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue', 'MediaPlayPause'].forEach(function (k) {
      try { tizen.tvinputdevice.registerKey(k); } catch (e) {}
    });
  }

  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    state.lastInput = Date.now();
    if (state.saver) { e.preventDefault(); exitSaver(); return; }
    if (AzanTakeover.isOpen()) return;   // azan.js handles OK/Back

    if (debug && handleDebugKey(e)) { e.preventDefault(); return; }

    switch (k) {
      case KEY.LEFT: move(-1, 0); break;
      case KEY.RIGHT: move(1, 0); break;
      case KEY.UP: move(0, -1); break;
      case KEY.DOWN: move(0, 1); break;
      case KEY.OK: ok(); break;
      case KEY.BACK: case KEY.ESC: case KEY.BKSP: back(); break;
      case KEY.RED: enterSaver(); break;
      case KEY.GREEN: nextCity(1); break;
      default: return;
    }
    e.preventDefault();
  });

  function handleDebugKey(e) {
    var ch = (e.key || '').toLowerCase();
    if (ch >= '1' && ch <= '5') { state.forced = HaithamScenes.PRAYERS[+ch - 1]; tick(); return true; }
    if (ch === '0') { state.forced = null; state.clockOffset = 0; tick(true); return true; }
    if (ch === 'n') {
      state.forced = null;
      var nx = P.around(city(), now()).next;
      state.clockOffset += (nx.time - now()) - 60000;
      tick(true); toast('Clock: 1 min before ' + P.NAMES[nx.key][1]); return true;
    }
    if (ch === 'g') {
      var nx2 = P.around(city(), now()).next;
      state.clockOffset += (nx2.time - now()) - 10 * 60000;
      tick(true); toast('Clock: 10 min before ' + P.NAMES[nx2.key][1]); return true;
    }
    if (ch === 'a') { var pv = P.around(city(), now()).next; fireAzan(pv.key, pv.time); return true; }
    if (ch === 's') { enterSaver(); return true; }
    if (ch === 'c') { nextCity(1); return true; }
    return false;
  }

  // ---------- boot ----------

  document.body.classList.toggle('debug', debug);
  registerKeys();
  var p0 = currentPeriod();
  scenes.setPrayer(p0, true);
  updatePhoto(p0, true);
  tick(true);
  setInterval(tick, 1000);
  window.addEventListener('resize', function () { applyFocus(); });

  // Expose for the console / tests
  window.HaithamTV = { tick: tick, state: state, setFakeTime: function (s) { setFakeTime(s); tick(true); }, enterSaver: enterSaver, exitSaver: exitSaver };
})();
