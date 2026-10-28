/* Haitham TV - per-prayer canvas scenes.
 * Plain ES2017, 2D canvas only (no WebGL). Designed for the Samsung BU8000.
 *
 * Cost model:
 *  - The sky, sun/moon glow and skyline are painted ONCE per scene into a
 *    "base" canvas. Scene changes crossfade two base canvases with CSS opacity.
 *  - A single "fx" canvas carries the few moving things (clouds, stars, motes,
 *    water shimmer) at a throttled frame rate using pre-rendered sprites.
 *  - The final-minutes "warm glow" is a CSS opacity overlay, not canvas work.
 *
 * Usage:
 *   var scenes = HaithamScenes.mount(document.getElementById('scene'), { fps: 30 });
 *   scenes.setPrayer('maghrib');   // fajr | dhuhr | asr | maghrib | isha
 *   scenes.setGlow(0.6);           // 0..1 warm + dim for the last minutes
 *   scenes.destroy();
 */
(function (global) {
  'use strict';

  var PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // Palette and light per prayer. sky = vertical gradient stops (top -> horizon).
  var LOOKS = {
    fajr: {
      sky: [[0, '#141a3d'], [0.45, '#3b2f6b'], [0.75, '#b3678a'], [0.92, '#f2a77f'], [1, '#ffd3a1']],
      body: { kind: 'glow', x: 0.62, y: 0.86, r: 0.38, color: '255,196,150', alpha: 0.55 },
      ground: '#1d1838', groundTop: '#3a2c55', haze: '255,180,150',
      stars: 70, starAlpha: 0.45, clouds: 2, cloudColor: '240,170,170', cloudAlpha: 0.35,
      motes: 0, water: false
    },
    dhuhr: {
      sky: [[0, '#1c6fd1'], [0.5, '#4fa2ea'], [0.85, '#a9d6f7'], [1, '#e6f4ff']],
      body: { kind: 'sun', x: 0.7, y: 0.16, r: 0.05, color: '255,252,235', alpha: 1, halo: 0.32, rays: true },
      ground: '#c9a874', groundTop: '#e7cf9f', haze: '255,255,255',
      stars: 0, starAlpha: 0, clouds: 5, cloudColor: '255,255,255', cloudAlpha: 0.85,
      motes: 0, water: false
    },
    asr: {
      sky: [[0, '#3d78b8'], [0.45, '#8fb2c9'], [0.75, '#e8c486'], [1, '#f6d58f']],
      body: { kind: 'sun', x: 0.24, y: 0.42, r: 0.045, color: '255,236,180', alpha: 1, halo: 0.45, rays: false },
      ground: '#8a5d2c', groundTop: '#c48a44', haze: '255,200,120',
      stars: 0, starAlpha: 0, clouds: 3, cloudColor: '255,228,180', cloudAlpha: 0.6,
      motes: 40, water: false
    },
    maghrib: {
      sky: [[0, '#2a1d4f'], [0.35, '#7a2f63'], [0.62, '#e2564a'], [0.82, '#ff9a3c'], [1, '#ffd37a']],
      body: { kind: 'sun', x: 0.5, y: 0.765, r: 0.07, color: '255,170,80', alpha: 1, halo: 0.55, rays: false, setting: true },
      ground: '#2b1430', groundTop: '#4a1f3d', haze: '255,120,80',
      stars: 15, starAlpha: 0.3, clouds: 4, cloudColor: '255,140,120', cloudAlpha: 0.55,
      motes: 0, water: true
    },
    isha: {
      sky: [[0, '#03060f'], [0.5, '#0a1430'], [0.85, '#14254d'], [1, '#1e3263']],
      body: { kind: 'moon', x: 0.76, y: 0.2, r: 0.045, color: '240,240,225', alpha: 1, halo: 0.22 },
      ground: '#04070f', groundTop: '#0b1328', haze: '120,150,220',
      stars: 260, starAlpha: 1, clouds: 0, cloudColor: '120,140,190', cloudAlpha: 0.2,
      motes: 0, water: false, shooting: true
    }
  };

  var HORIZON = 0.78; // fraction of height where ground starts

  function rand(seed) {
    // Small deterministic PRNG so every scene looks the same each time.
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  // ---------- base layer (painted once per scene) ----------

  function paintSky(ctx, w, h, look) {
    var g = ctx.createLinearGradient(0, 0, 0, h * HORIZON);
    look.sky.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function paintBody(ctx, w, h, look) {
    var b = look.body;
    var cx = b.x * w, cy = b.y * h, r = b.r * h;
    if (b.kind === 'glow') {
      var gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r * w);
      gg.addColorStop(0, 'rgba(' + b.color + ',' + b.alpha + ')');
      gg.addColorStop(1, 'rgba(' + b.color + ',0)');
      ctx.fillStyle = gg;
      ctx.fillRect(0, 0, w, h);
      return;
    }
    // Halo
    var halo = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, b.halo * h * 2);
    halo.addColorStop(0, 'rgba(' + b.color + ',0.55)');
    halo.addColorStop(0.25, 'rgba(' + b.color + ',0.18)');
    halo.addColorStop(1, 'rgba(' + b.color + ',0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    if (b.kind === 'moon') {
      // Crescent: lit disc minus an offset sky-coloured disc, done on a sprite.
      var m = makeCanvas(Math.ceil(r * 2 + 4), Math.ceil(r * 2 + 4));
      var mc = m.getContext('2d');
      var mr = r, mx = m.width / 2, my = m.height / 2;
      var mg = mc.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, 0, mx, my, mr);
      mg.addColorStop(0, '#fffdf0'); mg.addColorStop(1, '#d9d6c4');
      mc.fillStyle = mg;
      mc.beginPath(); mc.arc(mx, my, mr, 0, Math.PI * 2); mc.fill();
      mc.globalCompositeOperation = 'destination-out';
      mc.beginPath(); mc.arc(mx + mr * 0.42, my - mr * 0.18, mr * 0.9, 0, Math.PI * 2); mc.fill();
      ctx.drawImage(m, cx - mx, cy - my);
      return;
    }

    // Sun disc (clipped at the horizon when setting)
    ctx.save();
    if (b.setting) {
      ctx.beginPath(); ctx.rect(0, 0, w, h * HORIZON); ctx.clip();
    }
    var d = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    d.addColorStop(0, 'rgba(255,255,245,1)');
    d.addColorStop(0.7, 'rgba(' + b.color + ',1)');
    d.addColorStop(1, 'rgba(' + b.color + ',0.85)');
    ctx.fillStyle = d;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function paintHaze(ctx, w, h, look) {
    // Atmospheric band just above the horizon.
    var y = h * HORIZON;
    var g = ctx.createLinearGradient(0, y - h * 0.18, 0, y);
    g.addColorStop(0, 'rgba(' + look.haze + ',0)');
    g.addColorStop(1, 'rgba(' + look.haze + ',0.35)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - h * 0.18, w, h * 0.18);
  }

  // Gulf skyline: dunes, a mosque with a dome and two minarets, low towers and palms.
  function paintSkyline(ctx, w, h, look) {
    var y0 = h * HORIZON;
    var r = rand(7);

    // Far dunes
    ctx.fillStyle = look.groundTop;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    for (var x = 0; x <= w; x += w / 12) {
      ctx.quadraticCurveTo(x + w / 24, y0 - h * (0.015 + r() * 0.02), x + w / 12, y0);
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();

    ctx.fillStyle = look.ground;

    // Low towers on the right
    var tx = w * 0.66;
    for (var i = 0; i < 9; i++) {
      var tw = w * (0.018 + r() * 0.02);
      var th = h * (0.05 + r() * 0.12);
      ctx.fillRect(tx, y0 - th, tw, th + 2);
      if (r() > 0.6) ctx.fillRect(tx + tw * 0.45, y0 - th - h * 0.02, tw * 0.1, h * 0.02); // antenna
      tx += tw + w * 0.004;
    }

    // Mosque, left of centre
    var mx = w * 0.3, mw = w * 0.12, mh = h * 0.06;
    ctx.fillRect(mx - mw / 2, y0 - mh, mw, mh + 2);
    // Main dome (onion-ish)
    var dr = mw * 0.26;
    ctx.beginPath();
    ctx.moveTo(mx - dr, y0 - mh);
    ctx.bezierCurveTo(mx - dr * 1.15, y0 - mh - dr * 1.1, mx - dr * 0.2, y0 - mh - dr * 1.5, mx, y0 - mh - dr * 1.85);
    ctx.bezierCurveTo(mx + dr * 0.2, y0 - mh - dr * 1.5, mx + dr * 1.15, y0 - mh - dr * 1.1, mx + dr, y0 - mh);
    ctx.fill();
    ctx.fillRect(mx - 1, y0 - mh - dr * 2.25, 2, dr * 0.45); // finial
    // Side domes
    [-1, 1].forEach(function (s) {
      ctx.beginPath();
      ctx.arc(mx + s * mw * 0.32, y0 - mh, mw * 0.09, Math.PI, 0);
      ctx.fill();
    });
    // Minarets
    [-1, 1].forEach(function (s) {
      var px = mx + s * mw * 0.62, pw = mw * 0.06, ph = h * 0.2;
      ctx.fillRect(px - pw / 2, y0 - ph, pw, ph + 2);
      ctx.fillRect(px - pw * 0.8, y0 - ph * 0.72, pw * 1.6, h * 0.006); // balcony
      ctx.fillRect(px - pw * 0.8, y0 - ph * 0.92, pw * 1.6, h * 0.005);
      ctx.beginPath(); // cone
      ctx.moveTo(px - pw * 0.6, y0 - ph);
      ctx.lineTo(px, y0 - ph - h * 0.035);
      ctx.lineTo(px + pw * 0.6, y0 - ph);
      ctx.fill();
    });

    // Palms
    [0.08, 0.14, 0.52, 0.94].forEach(function (fx, k) {
      paintPalm(ctx, w * fx, y0 + 2, h * (0.13 + (k % 2) * 0.04), look.ground);
    });

    // Foreground band
    ctx.fillRect(0, y0 + h * 0.01, w, h);
  }

  function paintPalm(ctx, x, y, hgt, color) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = Math.max(2, hgt * 0.04);
    ctx.lineCap = 'round';
    var topX = x + hgt * 0.12, topY = y - hgt;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + hgt * 0.02, y - hgt * 0.5, topX, topY);
    ctx.stroke();
    // Fronds arch up from the crown then droop; outer ones hang lower.
    for (var i = 0; i < 9; i++) {
      var u = i / 8 * 2 - 1;                     // -1..1 across the crown
      var len = hgt * (0.34 + (1 - Math.abs(u)) * 0.08);
      var ex = topX + u * len;
      var ey = topY + len * (0.1 + Math.abs(u) * 0.55);
      var cx = topX + u * len * 0.45, cy = topY - len * (0.35 - Math.abs(u) * 0.15);
      ctx.lineWidth = Math.max(1.5, hgt * 0.024);
      ctx.beginPath(); ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(cx, cy, ex, ey);
      ctx.stroke();
    }
    ctx.restore();
  }

  function paintWaterBase(ctx, w, h, look) {
    // Maghrib: the foreground becomes the Gulf with a sun path.
    var y0 = h * (HORIZON + 0.012);
    var g = ctx.createLinearGradient(0, y0, 0, h);
    g.addColorStop(0, '#5a2a4a'); g.addColorStop(1, '#1a0c22');
    ctx.fillStyle = g;
    ctx.fillRect(0, y0, w, h - y0);
  }

  // Photo grade per prayer: tint + blend mode over the real city photo.
  var GRADES = {
    fajr:    { top: '#3b2f6b', bottom: '#f2a77f', mode: 'multiply', alpha: 0.55, dim: 0.15 },
    dhuhr:   { top: '#bfe3ff', bottom: '#fff6e0', mode: 'soft-light', alpha: 0.5, dim: 0 },
    asr:     { top: '#ffd28a', bottom: '#ff9f40', mode: 'soft-light', alpha: 0.7, dim: 0 },
    maghrib: { top: '#7a2f63', bottom: '#ff8a3c', mode: 'multiply', alpha: 0.6, dim: 0.1 },
    isha:    { top: '#0a1430', bottom: '#1e3263', mode: 'multiply', alpha: 0.8, dim: 0.35 }
  };

  function paintPhoto(ctx, w, h, img, prayer) {
    // cover-fit
    var s = Math.max(w / img.width, h / img.height);
    var iw = img.width * s, ih = img.height * s;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    var gr = GRADES[prayer];
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, gr.top); g.addColorStop(1, gr.bottom);
    ctx.save();
    ctx.globalCompositeOperation = gr.mode;
    ctx.globalAlpha = gr.alpha;
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.restore();
    if (gr.dim) { ctx.fillStyle = 'rgba(0,0,10,' + gr.dim + ')'; ctx.fillRect(0, 0, w, h); }
  }

  function paintBase(canvas, prayer, photo) {
    var look = LOOKS[prayer];
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (photo) {
      // Clean photo: colour grade only, nothing drawn on top.
      paintPhoto(ctx, w, h, photo, prayer);
      paintVignette(ctx, w, h);
      return;
    }
    paintSky(ctx, w, h, look);
    paintBody(ctx, w, h, look);
    paintHaze(ctx, w, h, look);
    paintSkyline(ctx, w, h, look);
    if (look.water) paintWaterBase(ctx, w, h, look);
    paintVignette(ctx, w, h);
  }

  function paintVignette(ctx, w, h) {
    // Soft vignette keeps the clock/panels readable.
    var v = ctx.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h * 0.5, h);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  // ---------- fx layer (animated, sprite based) ----------

  function cloudSprite(wc, hc, color, seed) {
    var c = makeCanvas(wc, hc), ctx = c.getContext('2d'), r = rand(seed);
    for (var i = 0; i < 9; i++) {
      var px = wc * (0.15 + r() * 0.7), py = hc * (0.45 + r() * 0.25);
      var pr = hc * (0.22 + r() * 0.25);
      var g = ctx.createRadialGradient(px, py, 0, px, py, pr);
      g.addColorStop(0, 'rgba(' + color + ',0.9)');
      g.addColorStop(1, 'rgba(' + color + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
    }
    return c;
  }

  function starSprite(size) {
    var c = makeCanvas(size, size), ctx = c.getContext('2d'), m = size / 2;
    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(220,230,255,0.6)');
    g.addColorStop(1, 'rgba(200,210,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    return c;
  }

  function buildFx(w, h, prayer, photoMode) {
    var look = LOOKS[prayer], r = rand(PRAYERS.indexOf(prayer) * 97 + 11);
    var fx = { look: look, photo: !!photoMode, clouds: [], stars: [], motes: [], shoot: null, nextShoot: 4000 + r() * 8000 };
    // Over a photo, keep stars/clouds in the upper sky band and drop the drawn sea.
    var skyBand = photoMode ? 0.4 : HORIZON - 0.08;
    var i;
    for (i = 0; i < look.clouds; i++) {
      var cw = Math.round(w * (0.18 + r() * 0.16)), ch = Math.round(cw * 0.32);
      fx.clouds.push({
        img: cloudSprite(cw, ch, look.cloudColor, 31 + i * 13),
        x: r() * w, y: h * (0.05 + r() * (photoMode ? 0.22 : 0.4)), speed: w * (0.004 + r() * 0.006) // px per second
      });
    }
    var sp = starSprite(8);
    for (i = 0; i < look.stars; i++) {
      var big = r() > 0.92;
      fx.stars.push({
        img: sp, x: r() * w, y: Math.pow(r(), 1.4) * h * skyBand,
        s: big ? 7 : 3 + r() * 2.5, phase: r() * Math.PI * 2, rate: 0.6 + r() * 1.6, base: big ? 0.9 : 0.4 + r() * 0.4
      });
    }
    for (i = 0; i < look.motes; i++) {
      fx.motes.push({ x: r() * w, y: h * (0.3 + r() * 0.5), s: 1 + r() * 2, vx: w * (0.002 + r() * 0.006), ph: r() * 6.28 });
    }
    fx.starImg = sp;
    return fx;
  }

  function drawFx(ctx, w, h, fx, t, dt) {
    ctx.clearRect(0, 0, w, h);
    var look = fx.look, i;
    var sec = t / 1000;

    // Stars (twinkle via globalAlpha only)
    if (fx.stars.length) {
      for (i = 0; i < fx.stars.length; i++) {
        var s = fx.stars[i];
        ctx.globalAlpha = look.starAlpha * Math.max(0, s.base + 0.35 * Math.sin(sec * s.rate + s.phase));
        ctx.drawImage(s.img, s.x - s.s / 2, s.y - s.s / 2, s.s, s.s);
      }
    }

    // Shooting star (Isha only, rare)
    if (look.shooting) {
      fx.nextShoot -= dt;
      if (!fx.shoot && fx.nextShoot <= 0) {
        fx.shoot = { x: w * (0.1 + Math.random() * 0.5), y: h * (0.05 + Math.random() * 0.2), life: 0 };
        fx.nextShoot = 9000 + Math.random() * 14000;
      }
      if (fx.shoot) {
        var sh = fx.shoot; sh.life += dt;
        var p = sh.life / 900;
        if (p >= 1) { fx.shoot = null; } else {
          var hx = sh.x + p * w * 0.22, hy = sh.y + p * h * 0.1;
          var g = ctx.createLinearGradient(hx, hy, hx - w * 0.06, hy - h * 0.027);
          g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = Math.sin(p * Math.PI);
          ctx.strokeStyle = g; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - w * 0.06, hy - h * 0.027); ctx.stroke();
        }
      }
    }

    // Sun rays (Dhuhr): a slow, faint rotating fan.
    if (look.body.rays) {
      var b = look.body, cx = b.x * w, cy = b.y * h;
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(sec * 0.03);
      ctx.globalAlpha = 0.07 + 0.03 * Math.sin(sec * 0.5);
      ctx.fillStyle = '#ffffff';
      for (i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(h * 0.55, -h * 0.025); ctx.lineTo(h * 0.55, h * 0.025); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // Fajr: the horizon glow breathes slowly.
    if (look.body.kind === 'glow') {
      var gb = look.body, gx = gb.x * w, gy = gb.y * h, gr = gb.r * w;
      var gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 0.8);
      gg.addColorStop(0, 'rgba(' + gb.color + ',1)'); gg.addColorStop(1, 'rgba(' + gb.color + ',0)');
      ctx.globalAlpha = 0.12 + 0.08 * Math.sin(sec * 0.4);
      ctx.fillStyle = gg; ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
    }

    // Clouds drift
    for (i = 0; i < fx.clouds.length; i++) {
      var c = fx.clouds[i];
      c.x += c.speed * dt / 1000;
      if (c.x > w) c.x = -c.img.width;
      ctx.globalAlpha = look.cloudAlpha;
      ctx.drawImage(c.img, c.x, c.y);
    }

    // Asr dust motes
    if (fx.motes.length) {
      ctx.fillStyle = '#fff1c8';
      for (i = 0; i < fx.motes.length; i++) {
        var m = fx.motes[i];
        m.x += m.vx * dt / 1000; if (m.x > w) m.x = 0;
        ctx.globalAlpha = 0.25 + 0.25 * Math.sin(sec * 0.8 + m.ph);
        ctx.fillRect(m.x, m.y + Math.sin(sec * 0.6 + m.ph) * 6, m.s, m.s);
      }
    }

    // Maghrib water shimmer: short horizontal strokes along the sun path.
    if (look.water && !fx.photo) {
      var sx = look.body.x * w, y0 = h * (HORIZON + 0.015);
      ctx.fillStyle = 'rgb(' + look.body.color + ')';
      for (i = 0; i < 26; i++) {
        var row = i / 26;
        var yy = y0 + row * (h - y0);
        var spread = w * (0.03 + row * 0.12);
        var off = Math.sin(sec * 1.3 + i * 1.7) * spread * 0.5;
        ctx.globalAlpha = (1 - row) * (0.35 + 0.3 * Math.sin(sec * 2 + i));
        ctx.fillRect(sx + off - spread * 0.3, yy, spread * 0.6, Math.max(1, h * 0.003));
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---------- public mount ----------

  function mount(container, opts) {
    opts = opts || {};
    var fps = opts.fps || 30;
    var scale = opts.scale || 0.5;       // render at half res; CSS scales up (sky is soft anyway)
    var fade = opts.fadeMs || 2500;

    container.style.position = container.style.position || 'absolute';
    container.classList.add('hs-root');

    var bases = [makeCanvas(1, 1), makeCanvas(1, 1)];
    var fxCanvas = makeCanvas(1, 1);
    var glow = document.createElement('div');
    bases.forEach(function (c) {
      c.className = 'hs-layer hs-base';
      c.style.transition = 'opacity ' + fade + 'ms ease';
      c.style.opacity = '0';
      container.appendChild(c);
    });
    fxCanvas.className = 'hs-layer hs-fx';
    fxCanvas.style.transition = 'opacity ' + fade + 'ms ease';
    glow.className = 'hs-layer hs-glow';
    container.appendChild(fxCanvas);
    container.appendChild(glow);

    var state = { prayer: null, front: 0, fx: null, raf: 0, last: 0, prev: 0, w: 0, h: 0, alive: true, photo: null };

    function size() {
      var rect = container.getBoundingClientRect();
      var w = Math.max(320, Math.round((rect.width || window.innerWidth) * scale));
      var h = Math.max(180, Math.round((rect.height || window.innerHeight) * scale));
      if (w === state.w && h === state.h) return false;
      state.w = w; state.h = h;
      bases.concat([fxCanvas]).forEach(function (c) { c.width = w; c.height = h; });
      return true;
    }

    function setPrayer(prayer, instant) {
      prayer = String(prayer || '').toLowerCase();
      if (!LOOKS[prayer]) return;
      if (prayer === state.prayer && !instant) return;
      size();
      var back = 1 - state.front;
      paintBase(bases[back], prayer, state.photo);
      if (instant) {
        bases[back].style.transition = 'none'; bases[state.front].style.transition = 'none';
      }
      bases[back].style.opacity = '1';
      bases[state.front].style.opacity = '0';
      if (instant) {
        // force reflow then restore transitions
        void bases[back].offsetWidth;
        bases[back].style.transition = bases[state.front].style.transition = 'opacity ' + fade + 'ms ease';
      }
      state.front = back;
      state.prayer = prayer;
      // fx swaps with a quick dip so stars don't pop in over daylight
      fxCanvas.style.opacity = '0';
      setTimeout(function () {
        if (!state.alive) return;
        if (state.photo) { state.fx = null; return; }   // photos stay clean: no fx layer
        state.fx = buildFx(state.w, state.h, prayer, false);
        fxCanvas.style.opacity = '1';
      }, instant ? 0 : fade / 2);
    }

    function loop(now) {
      if (!state.alive) return;
      state.raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (now - state.last < 1000 / fps - 1) return;  // throttle
      var dt = state.prev ? Math.min(200, now - state.prev) : 16;
      state.prev = now; state.last = now;
      if (state.fx && !state.paused) drawFx(fxCanvas.getContext('2d'), state.w, state.h, state.fx, now, dt);
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && opts.animate !== false) state.raf = requestAnimationFrame(loop);

    function onResize() {
      if (size() && state.prayer) {
        paintBase(bases[state.front], state.prayer, state.photo);
        state.fx = state.photo ? null : buildFx(state.w, state.h, state.prayer, false);
      }
    }
    window.addEventListener('resize', onResize);

    // Use a real city photo as the base (from photos.js). Falls back to the
    // drawn scene if the image fails. Pass null to go back to the drawn scene.
    function setPhoto(url) {
      function apply(img) {
        if (!state.alive) return;
        state.photo = img;
        if (state.prayer) { var p = state.prayer; state.prayer = null; setPrayer(p); }
      }
      if (!url) { apply(null); return; }
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { apply(img); };
      img.onerror = function () { apply(null); };
      img.src = url;
    }
    if (opts.photo) setPhoto(opts.photo);

    return {
      setPrayer: setPrayer,
      setPhoto: setPhoto,
      // 0..1: warm + dim during the final minutes before the next prayer.
      setGlow: function (v) { glow.style.opacity = String(Math.max(0, Math.min(1, v || 0))); },
      getPrayer: function () { return state.prayer; },
      hasPhoto: function () { return !!state.photo; },
      pause: function (p) { state.paused = !!p; },
      destroy: function () {
        state.alive = false;
        cancelAnimationFrame(state.raf);
        window.removeEventListener('resize', onResize);
        bases.concat([fxCanvas, glow]).forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
      }
    };
  }

  // Map a time to a prayer period given today's times { fajr, sunrise?, dhuhr, asr, maghrib, isha } as Date.
  // Before Fajr counts as Isha (night). Sunrise..Dhuhr is treated as Dhuhr (daylight) for the scene.
  function periodFor(now, times) {
    var order = ['isha', 'maghrib', 'asr', 'dhuhr', 'fajr'];
    for (var i = 0; i < order.length; i++) {
      var t = times[order[i]];
      if (t && now >= t) {
        if (order[i] === 'fajr' && times.sunrise && now >= times.sunrise) return 'dhuhr';
        return order[i];
      }
    }
    return 'isha';
  }

  global.HaithamScenes = { mount: mount, periodFor: periodFor, PRAYERS: PRAYERS, LOOKS: LOOKS };
})(window);
