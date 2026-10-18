/* Burgundy Peony theme — decor only. Door, app.js, Firebase untouched. */
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = '../shared/css/theme-peony.css';
  document.head.appendChild(l);

  function petal(L, w) {
    return 'M0 0C' + -w * .9 + ' ' + -L * .15 + ' ' + -w * 1.1 + ' ' + -L * .75 + ' ' + -w * .4 + ' ' + -L * .97 +
      'Q' + -w * .2 + ' ' + -L * 1.06 + ' 0 ' + -L * .98 + 'Q' + w * .2 + ' ' + -L * 1.06 + ' ' + w * .4 + ' ' + -L * .97 +
      'C' + w * 1.1 + ' ' + -L * .75 + ' ' + w * .9 + ' ' + -L * .15 + ' 0 0Z';
  }
  function flower(id, a, b, c) {
    var g = '';
    [[9, 88, 40], [8, 72, 35], [7, 56, 29], [6, 41, 23], [5, 26, 16]].forEach(function (r, i) {
      for (var k = 0; k < r[0]; k++) {
        g += '<g transform="rotate(' + (360 / r[0] * k + i * 23 + (k % 2) * 4) + ')"><path d="' + petal(r[1], r[2]) +
          '" fill="url(#' + id + 'g)" stroke="' + c + '" stroke-opacity=".55"/><path d="M0 -' + r[1] * .12 + 'Q' +
          (k % 2 ? 4 : -4) + ' -' + r[1] * .5 + ' 0 -' + r[1] * .78 + '" fill="none" stroke="#000" stroke-opacity=".13" stroke-width="2"/></g>';
      }
    });
    return '<radialGradient id="' + id + 'g" cx=".5" cy="1.05" r="1.1"><stop offset="0" stop-color="' + c + '"/><stop offset=".55" stop-color="' + a +
      '"/><stop offset="1" stop-color="' + b + '"/></radialGradient><symbol id="' + id + '" viewBox="-100 -100 200 200" overflow="visible">' + g + '<circle r="7" fill="' + c + '"/></symbol>';
  }
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    flower('pR', '#b3122f', '#d9304f', '#4a0010') + flower('pC', '#f6eed8', '#fffdf7', '#c9b274') +
    '<symbol id="pL" viewBox="0 0 60 24"><path d="M0 12C14 0 40 0 60 12C40 24 14 24 0 12Z" fill="#3f6b32"/><path d="M2 12H56" stroke="#a9c986" stroke-opacity=".5"/></symbol></defs></svg>';

  function garland() {
    var s = '<svg class="garland" viewBox="0 0 720 350" aria-hidden="true">';
    [[40, 170, 90, -40], [250, 120, 90, -70], [430, 110, 100, -110], [570, 140, 100, -145], [700, 170, 80, -160], [330, 250, 110, 8]].forEach(function (a) {
      s += '<use href="#pL" transform="translate(' + a[0] + ' ' + a[1] + ') rotate(' + a[3] + ')" x="0" y="' + -a[2] * .2 + '" width="' + a[2] + '" height="' + a[2] * .4 + '"/>';
    });
    [['pR', 38, 270, 70, 15], ['pC', 130, 220, 95, 40], ['pR', 265, 240, 105, 100], ['pC', 445, 228, 110, 10],
     ['pR', 610, 228, 115, 70], ['pC', 705, 300, 48, 0], ['pC', 200, 138, 30, 0], ['pR', 530, 128, 28, 20]].forEach(function (f) {
      s += '<use href="#' + f[0] + '" transform="rotate(' + f[4] + ' ' + f[1] + ' ' + f[2] + ')" x="' + (f[1] - f[3]) + '" y="' + (f[2] - f[3]) + '" width="' + f[3] * 2 + '" height="' + f[3] * 2 + '"/>';
    });
    return s + '</svg>';
  }
  function bridge(flip) {
    var d = document.createElement('div');
    d.className = 'bridge' + (flip ? ' flip' : ''); d.innerHTML = garland(); return d;
  }

  function init() {
    var m = document.getElementById('main-content'); if (!m) return;
    document.body.insertAdjacentHTML('afterbegin', sprite);

    var hero = m.querySelector('.hero'), badge = document.getElementById('hero-badge');
    if (hero) hero.after(bridge(false));
    if (badge) {
      var dt = document.createElement('p'); dt.className = 'hero-date'; badge.after(dt);
      var src = document.getElementById('scratch-date-text');
      var upd = function () {
        var d = src && new Date(src.textContent), p = function (n) { return ('0' + n).slice(-2); };
        if (d && !isNaN(d)) dt.textContent = p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + String(d.getFullYear()).slice(2);
      };
      upd(); if (src) new MutationObserver(upd).observe(src, { childList: true, characterData: true, subtree: true });
    }

    var els = [].slice.call(m.children).filter(function (e) {
      return /(^|\s)(section|names-section|scratch-section|countdown-section|footer-section)(\s|$)/.test(e.className);
    });
    els.forEach(function (e, i) {
      var foot = e.classList.contains('footer-section'), msg = e.querySelector('#msg-name');
      e.classList.add('band', foot ? 'wine' : (i % 2 ? 'ivory' : 'wine'));
      if (!i || foot || msg) e.classList.add('noedge');
      if (msg) e.before(bridge(true));
    });

    var tl = document.getElementById('timeline-list');
    if (tl) {
      var card = tl.parentNode, f = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      f.setAttribute('class', 'tl-flower'); f.setAttribute('viewBox', '-100 -100 200 200');
      f.innerHTML = '<use href="#pC" x="-100" y="-100" width="200" height="200"/>'; card.appendChild(f);
      var mv = function () {
        var r = card.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .55 - r.top) / r.height));
        f.style.top = p * Math.max(0, r.height - 54) + 'px';
      };
      addEventListener('scroll', mv, { passive: true }); mv(); setTimeout(mv, 1200);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
