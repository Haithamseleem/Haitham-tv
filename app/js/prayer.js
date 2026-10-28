/* Haitham TV - prayer times, Hijri date and Qibla. No dependencies, ES2017.
 * Astronomical method after PrayTimes.org (Hamid Zarrabi-Zadeh), single refinement pass.
 * Times are computed in UTC and returned as real Date objects; display uses the city's IANA zone.
 */
(function (global) {
  'use strict';

  var METHODS = {
    uae:    { fajr: 18.2, isha: 18.2 },
    egypt:  { fajr: 19.5, isha: 17.5 },
    mwl:    { fajr: 18,   isha: 17 },
    makkah: { fajr: 18.5, ishaMin: 90 }
  };

  var D2R = Math.PI / 180;
  function dsin(d) { return Math.sin(d * D2R); }
  function dcos(d) { return Math.cos(d * D2R); }
  function dtan(d) { return Math.tan(d * D2R); }
  function darcsin(x) { return Math.asin(x) / D2R; }
  function darccos(x) { return Math.acos(Math.max(-1, Math.min(1, x))) / D2R; }
  function darctan2(y, x) { return Math.atan2(y, x) / D2R; }
  function darccot(x) { return Math.atan(1 / x) / D2R; }
  function fix(a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; }

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  function sunPosition(jd) {
    var D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360);
    var q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = fix(darctan2(dcos(e) * dsin(L), dcos(L)) / 15, 24);
    return { decl: darcsin(dsin(e) * dsin(L)), eqt: q / 15 - RA };
  }

  // Returns { fajr, sunrise, dhuhr, asr, maghrib, isha } as Date for the city's local date y-m-d.
  function compute(city, y, m, d) {
    var method = METHODS[city.method] || METHODS.uae;
    var lat = city.lat, lng = city.lng;
    var jDate = julian(y, m, d) - lng / (15 * 24);

    function midDay(t) { return fix(12 - sunPosition(jDate + t).eqt, 24); }
    function angleTime(angle, t, ccw) {
      var decl = sunPosition(jDate + t).decl, noon = midDay(t);
      var T = darccos((-dsin(angle) - dsin(decl) * dsin(lat)) / (dcos(decl) * dcos(lat))) / 15;
      return noon + (ccw ? -T : T);
    }
    function asrTime(factor, t) {
      var decl = sunPosition(jDate + t).decl;
      return angleTime(-darccot(factor + dtan(Math.abs(lat - decl))), t);
    }

    function pass(t) {
      return {
        fajr: angleTime(method.fajr, t.fajr / 24, true),
        sunrise: angleTime(0.833, t.sunrise / 24, true),
        dhuhr: midDay(t.dhuhr / 24),
        asr: asrTime(1, t.asr / 24),
        maghrib: angleTime(0.833, t.maghrib / 24),
        isha: method.isha ? angleTime(method.isha, t.isha / 24) : 0
      };
    }
    var t = pass({ fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 });
    t = pass(t);
    if (!method.isha) t.isha = t.maghrib + method.ishaMin / 60;

    var base = Date.UTC(y, m - 1, d);
    var out = {}, offs = city.offsets || {};
    Object.keys(t).forEach(function (k) {
      var utcHours = t[k] - lng / 15;           // local solar -> UTC
      var mins = Math.round(utcHours * 60) + (offs[k] || 0);
      out[k] = new Date(base + mins * 60000);
    });
    return out;
  }

  // Local y/m/d in a time zone.
  function localYMD(date, timeZone) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
      var o = {};
      parts.forEach(function (p) { o[p.type] = parseInt(p.value, 10); });
      return { y: o.year, m: o.month, d: o.day };
    } catch (e) {
      return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() };
    }
  }

  function addDays(ymd, n) {
    var dt = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d + n));
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }

  function forDay(city, date, dayOffset) {
    var ymd = addDays(localYMD(date, city.timeZone), dayOffset || 0);
    var times = compute(city, ymd.y, ymd.m, ymd.d);
    times.ymd = ymd;
    return times;
  }

  var ORDER = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // Previous and next prayer around `now` (sunrise excluded).
  function around(city, now) {
    var list = [];
    [-1, 0, 1].forEach(function (off) {
      var t = forDay(city, now, off);
      ORDER.forEach(function (k) { list.push({ key: k, time: t[k] }); });
    });
    for (var i = 0; i < list.length; i++) {
      if (list[i].time > now) return { prev: list[i - 1], next: list[i] };
    }
    return { prev: list[list.length - 2], next: list[list.length - 1] };
  }

  function fmtTime(date, timeZone, h24) {
    try {
      return new Intl.DateTimeFormat('en-GB', { timeZone: timeZone, hour: '2-digit', minute: '2-digit', hour12: !h24 })
        .format(date).replace(/\s?[ap]m$/i, function (m) { return ' ' + m.trim().toUpperCase(); });
    } catch (e) {
      return date.toTimeString().slice(0, 5);
    }
  }

  function hijri(date, timeZone, lang) {
    var cal = 'islamic-umalqura';
    try {
      var f = new Intl.DateTimeFormat((lang === 'ar' ? 'ar-SA' : 'en-US') + '-u-ca-' + cal, { timeZone: timeZone, day: 'numeric', month: 'long', year: 'numeric' });
      var s = f.format(date);
      if (/\d{4}/.test(s) && s.indexOf('AH') === -1 && lang !== 'ar') s += ' AH';
      // Some old engines silently ignore the calendar and return Gregorian; detect that.
      if (lang !== 'ar' && /January|February|March|April|May|June|July|August|September|October|November|December/.test(s)) return '';
      return s;
    } catch (e) { return ''; }
  }

  // Great-circle initial bearing to the Kaaba, degrees from true north.
  function qibla(lat, lng) {
    var kLat = 21.4225, kLng = 39.8262;
    var dL = (kLng - lng) * D2R, p1 = lat * D2R, p2 = kLat * D2R;
    var b = Math.atan2(Math.sin(dL), Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dL));
    return fix(b / D2R, 360);
  }

  function distanceKm(lat, lng) {
    var kLat = 21.4225 * D2R, kLng = 39.8262 * D2R, a = lat * D2R, b = lng * D2R;
    var h = Math.pow(Math.sin((kLat - a) / 2), 2) + Math.cos(a) * Math.cos(kLat) * Math.pow(Math.sin((kLng - b) / 2), 2);
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }

  global.HaithamPrayer = {
    ORDER: ORDER, METHODS: METHODS,
    NAMES: { fajr: ['الفجر', 'Fajr'], sunrise: ['الشروق', 'Sunrise'], dhuhr: ['الظهر', 'Dhuhr'], asr: ['العصر', 'Asr'], maghrib: ['المغرب', 'Maghrib'], isha: ['العشاء', 'Isha'] },
    compute: compute, forDay: forDay, around: around, localYMD: localYMD,
    fmtTime: fmtTime, hijri: hijri, qibla: qibla, distanceKm: distanceKm
  };
})(window);
