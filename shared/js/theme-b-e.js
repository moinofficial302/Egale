/* BOTANICAL ESTATE — Theme 03 (theme-b-e.js)
   Decoration + small progressive enhancements only. app.js (door timing, countdown,
   scratch, slideshow, form, music) is NOT replaced. Everything degrades gracefully. */
(function () {
  'use strict';
  var V = '20261022', root = document.documentElement, body = document.body;
  function $(id) { return document.getElementById(id); }
  function txt(id) { var e = $(id); return e ? e.textContent.trim() : ''; }

  /* 0. Theme hooks (class on <body>, stylesheet, status-bar colour) */
  root.classList.add('be-js'); body.classList.add('theme-botanical-estate');
  if (!document.querySelector('link[href*="theme-b-e.css"]')) {
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '../shared/css/theme-b-e.css?v=' + V; document.head.appendChild(l);
  }
  var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute('content', '#173D32');

  /* Date from the scratch-card date (same dynamic data the project already uses) */
  function fmtDate() {
    var d = new Date(txt('scratch-date-text'));
    if (isNaN(d)) return '';
    return d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'long' }).toUpperCase() + ' ' + d.getFullYear();
  }

  /* 1. Botanical line-art for the gate panels (drawn with stroke-dashoffset in CSS) */
  function leaf(x, y, s) {
    var a = s * 21, b = Math.abs(s) * 9;
    return 'M' + x + ' ' + y + 'C' + (x + a * .35) + ' ' + (y - b * 1.6) + ' ' + (x + a * .8) + ' ' + (y - b * 1.7) + ' ' + (x + a) + ' ' + (y - b * .9) +
      'C' + (x + a * .75) + ' ' + (y + b * .1) + ' ' + (x + a * .35) + ' ' + (y + b * .5) + ' ' + x + ' ' + y + 'Z';
  }
  function flora() {
    var s = '<svg class="be-flora" viewBox="0 0 200 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<path pathLength="1" style="--i:0" d="M62 440C54 340 74 260 58 160S72 40 62 -10"/>';
    for (var k = 0; k < 9; k++) {
      var y = 412 - k * 42, x = 62 + Math.sin(k * .9) * 5, sg = (k % 2 ? -1 : 1);
      s += '<path pathLength="1" style="--i:' + (k * 2 + 1) + '" d="' + leaf(x, y, sg * (1 - k * .04)) + '"/>';
      s += '<path pathLength="1" style="--i:' + (k * 2 + 2) + '" d="' + leaf(x, y - 20, -sg * .7) + '"/>';
    }
    return s + '</svg>';
  }

  /* 2. Opening screen */
  function opening() {
    var c = $('envelope-cover'); if (!c) return;
    ['.door-left', '.door-right'].forEach(function (q) { var d = c.querySelector(q); if (d) d.insertAdjacentHTML('beforeend', flora()); });
    var lab = c.querySelector('.env-label'); if (lab) lab.textContent = 'A celebration of love';
    var tt = c.querySelector('.tap-text span'); if (tt) tt.textContent = 'Enter the celebration';
    var names = document.createElement('p'), date = document.createElement('p');
    names.className = 'be-door-names'; date.className = 'be-door-date';
    if (lab) { lab.after(names); names.after(date); }
    function sync() {
      var g = txt('hero-groom-name'), b = txt('hero-bride-name');
      if (g && b) {
        names.textContent = ''; var i = document.createElement('i'); i.textContent = '&';
        names.append(document.createTextNode(g), i, document.createTextNode(b));
      }
      var f = fmtDate(); date.textContent = f; date.style.display = f ? '' : 'none';
    }
    sync(); [600, 1800, 4000].forEach(function (ms) { setTimeout(sync, ms); });
    ['hero-groom-name', 'hero-bride-name', 'scratch-date-text'].forEach(function (id) {
      var e = $(id); if (e && window.MutationObserver) new MutationObserver(sync).observe(e, { childList: true, characterData: true, subtree: true });
    });
    /* keyboard access: the whole cover is the "enter" control */
    c.setAttribute('role', 'button'); c.setAttribute('aria-label', 'Open the invitation'); c.tabIndex = 0;
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (typeof window.openEnvelope === 'function') window.openEnvelope(); }
    });
    c.addEventListener('click', function () {
      setTimeout(function () { var m = $('main-content'); if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: true }); } }, 1450);
    });
  }

  /* 3. Hero text structure + 4. section bands */
  function hero() {
    var ov = document.querySelector('.hero-overlay'), nm = ov && ov.querySelector('.hero-name'); if (!nm) return;
    function p(cls, t) { var e = document.createElement('p'); e.className = cls; e.textContent = t; return e; }
    var tog = p('be-together', 'Together with their families'), inv = p('be-invite', 'Invite you to celebrate'), hd = p('be-hero-date', '');
    var btn = document.createElement('a'); btn.className = 'be-hero-btn'; btn.href = '#be-invitation'; btn.textContent = 'View invitation';
    btn.addEventListener('click', function (e) { var t = $('be-invitation'); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    nm.before(tog); nm.after(inv, hd, btn);
    var fd = p('be-foot-date', ''), fn = $('footer-couple-names'); if (fn) fn.after(fd);
    function sync() { var f = fmtDate(); hd.textContent = f; hd.style.display = f ? '' : 'none'; fd.textContent = f; fd.style.display = f ? '' : 'none'; }
    sync(); [600, 1800, 4000].forEach(function (ms) { setTimeout(sync, ms); });
    var e = $('scratch-date-text'); if (e && window.MutationObserver) new MutationObserver(sync).observe(e, { childList: true, characterData: true, subtree: true });
  }
  function bands() {
    var m = $('main-content'); if (!m) return;
    var seq = ['be-light', 'be-green', 'be-light', 'be-sage', 'be-green', 'be-light', 'be-sage', 'be-light', 'be-sage'];
    var els = [].slice.call(m.children).filter(function (e) { return /(^|\s)(section|names-section|scratch-section|countdown-section|footer-section)(\s|$)/.test(e.className); });
    els.forEach(function (e, i) {
      e.classList.add('be-band', e.classList.contains('footer-section') ? 'be-deep' : (seq[i] || 'be-light'));
      if (!i) { e.classList.add('be-first'); e.id = 'be-invitation'; }
    });
    var cl = document.querySelector('.creator-link');
    if (cl) { cl.setAttribute('role', 'link'); cl.tabIndex = 0; cl.addEventListener('keydown', function (e) { if (e.key === 'Enter') cl.click(); }); }
  }

  /* 5. Scroll reveal: backup observer + failsafe (content can never stay hidden) */
  function reveal() {
    var t = [].slice.call(document.querySelectorAll('.reveal-on-scroll'));
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
      t.forEach(function (x) { io.observe(x); });
    }
    var n = 0, iv = setInterval(function () {
      var m = $('main-content'), vis = m && m.classList.contains('visible');
      if (vis && !document.querySelector('.reveal-on-scroll.revealed')) root.classList.add('be-reveal-all');
      if (++n > 10) clearInterval(iv);
    }, 2000);
  }

  function init() { opening(); hero(); bands(); reveal(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
