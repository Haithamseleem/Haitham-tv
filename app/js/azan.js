/* Haitham TV - full-screen azan takeover. Upgrades #azan-banner in place.
 * Plain ES2017, CSS animation (transform/opacity) only.
 *
 *   AzanTakeover.show({ prayer: 'maghrib', time: '18:02', audio: '', timeoutSec: 120 });
 *   AzanTakeover.hide();
 * OK/Enter (13) or Back (10009 on Tizen, Escape/Backspace in a browser) dismisses.
 */
(function (global) {
  'use strict';

  var NAMES = {
    fajr: ['الفجر', 'Fajr'],
    dhuhr: ['الظهر', 'Dhuhr'],
    asr: ['العصر', 'Asr'],
    maghrib: ['المغرب', 'Maghrib'],
    isha: ['العشاء', 'Isha']
  };

  // Dua after the adhan (Sahih al-Bukhari 614), shortened.
  var DUA_AR = 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ';
  var DUA_EN = 'O Allah, Lord of this perfect call and the prayer to be established, grant Muhammad al-Wasilah and virtue.';

  var KEY_OK = 13, KEY_BACK = 10009;

  // 8-point star made of two overlapping squares.
  var STAR_SVG =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#f0c878" stroke-width="0.8">' +
    '<rect x="20" y="20" width="60" height="60"/>' +
    '<rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)"/>' +
    '<circle cx="50" cy="50" r="14"/></svg>';

  var el = null, timer = 0, audioEl = null, onKey = null, onHide = null;

  function ensure() {
    el = document.getElementById('azan-banner');
    if (!el) { el = document.createElement('div'); el.id = 'azan-banner'; document.body.appendChild(el); }
    el.className = 'az-takeover';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'assertive');
    el.innerHTML =
      '<div class="az-hint">OK / Back to close</div>' +
      '<div class="az-stage">' +
        '<div class="az-ring"></div><div class="az-ring"></div><div class="az-ring"></div>' +
        '<div class="az-star">' + STAR_SVG + '</div>' +
        '<div class="az-star az-inner">' + STAR_SVG + '</div>' +
        '<div class="az-text">' +
          '<div class="az-label">Time for prayer</div>' +
          '<div class="az-ar"></div><div class="az-en"></div><div class="az-time"></div>' +
        '</div>' +
      '</div>' +
      '<div class="az-dua"><div class="az-dua-ar"></div><div class="az-dua-en"></div></div>' +
      '<div class="az-timer"></div>';
    return el;
  }

  function show(opts) {
    opts = opts || {};
    var n = NAMES[String(opts.prayer || '').toLowerCase()] || ['الصلاة', 'Prayer'];
    ensure();
    el.querySelector('.az-ar').textContent = n[0];
    el.querySelector('.az-en').textContent = n[1];
    el.querySelector('.az-time').textContent = opts.time || '';
    el.querySelector('.az-dua-ar').textContent = opts.duaAr || DUA_AR;
    el.querySelector('.az-dua-en').textContent = opts.duaEn || DUA_EN;
    onHide = opts.onHide || null;

    var secs = opts.timeoutSec > 0 ? opts.timeoutSec : 120;
    var bar = el.querySelector('.az-timer');
    bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)';

    void el.offsetWidth; // restart CSS animations
    el.classList.add('az-show');
    requestAnimationFrame(function () {
      bar.style.transition = 'transform ' + secs + 's linear';
      bar.style.transform = 'scaleX(0)';
    });

    clearTimeout(timer);
    timer = setTimeout(hide, secs * 1000);

    if (opts.audio) {
      try {
        audioEl = audioEl || new Audio();
        audioEl.src = opts.audio;
        var p = audioEl.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) { /* audio is optional */ }
    }

    if (!onKey) {
      onKey = function (e) {
        var k = e.keyCode;
        if (k === KEY_OK || k === KEY_BACK || e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault(); e.stopPropagation();
          hide();
        }
      };
      document.addEventListener('keydown', onKey, true);
    }
  }

  function hide() {
    clearTimeout(timer);
    if (audioEl) { try { audioEl.pause(); } catch (e) {} }
    if (onKey) { document.removeEventListener('keydown', onKey, true); onKey = null; }
    if (el) el.classList.remove('az-show');
    if (onHide) { var f = onHide; onHide = null; f(); }
  }

  global.AzanTakeover = {
    show: show, hide: hide,
    isOpen: function () { return !!(el && el.classList.contains('az-show')); },
    NAMES: NAMES
  };
})(window);
