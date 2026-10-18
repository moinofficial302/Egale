/* Burgundy Peony theme — decor only. Door, app.js, Firebase untouched. */
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = '../shared/css/theme-peony.css';
  document.head.appendChild(l);

  function petal(L, w) {
    return 'M0 0C' + -w + ' ' + -L * .25 + ' ' + -w * 1.05 + ' ' + -L * .85 + ' 0 ' + -L + 'C' + w * 1.05 + ' ' + -L * .85 + ' ' + w + ' ' + -L * .25 + ' 0 0Z';
  }
  function flower(id, a, b, c) { /* rose seen from above */
    var g = '';
    [[5, 92, 60, 0], [5, 72, 48, 36], [5, 54, 38, 12], [4, 38, 28, 50]].forEach(function (r) {
      for (var k = 0; k < r[0]; k++) {
        g += '<g transform="rotate(' + (360 / r[0] * k + r[3]) + ')"><path d="' + petal(r[1], r[2]) + '" fill="url(#' + id + 'g)" stroke="' + c +
          '" stroke-opacity=".6"/><path d="M' + -r[2] * .72 + ' ' + -r[1] * .72 + 'Q0 ' + -r[1] * 1.03 + ' ' + r[2] * .72 + ' ' + -r[1] * .72 +
          '" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.5"/></g>';
      }
    });
    g += '<path d="M-4 0a4 4 0 1 1 8 0a8 8 0 0 1 -16 0a12 12 0 0 1 24 0a16 16 0 0 1 -32 0" fill="none" stroke="' + c + '" stroke-width="2.4" stroke-opacity=".85"/>';
    return '<radialGradient id="' + id + 'g" cx=".5" cy="1.05" r="1.1"><stop offset="0" stop-color="' + c + '"/><stop offset=".5" stop-color="' + a +
      '"/><stop offset="1" stop-color="' + b + '"/></radialGradient><symbol id="' + id + '" viewBox="-100 -100 200 200" overflow="visible">' + g + '</symbol>';
  }
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    flower('pR', '#b0112e', '#e0405c', '#4d0010') + flower('pC', '#f3e6d0', '#fffaf0', '#bfa57a') +
    '<symbol id="pL" viewBox="0 0 60 24"><path d="M0 12C14 0 40 0 60 12C40 24 14 24 0 12Z" fill="#2f5a2b"/><path d="M2 12H56" stroke="#a9c986" stroke-opacity=".5"/></symbol></defs></svg>';

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

/* Door decor: roses on ivory doors, couple names, seal initials, falling petals */
(function(){function go(){var c=document.getElementById('envelope-cover');if(!c)return;
var s='<svg class="door-flora" viewBox="0 0 200 430" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
[[100,70,85,-25],[150,100,70,-80],[-5,150,70,60],[0,300,70,-40],[60,330,80,-70],[110,360,70,-20]].forEach(function(a){s+='<use href="#pL" transform="translate('+a[0]+' '+a[1]+') rotate('+a[3]+')" x="0" y="'+-a[2]*.2+'" width="'+a[2]+'" height="'+a[2]*.4+'"/>'});
[['pC',125,18,34,10],['pR',178,42,46,30],['pC',186,112,28,0],['pR',16,140,26,20],['pC',12,222,22,0],['pR',35,392,56,10],['pC',105,404,44,40],['pR',160,418,28,0]].forEach(function(f){s+='<use href="#'+f[0]+'" transform="rotate('+f[4]+' '+f[1]+' '+f[2]+')" x="'+(f[1]-f[3])+'" y="'+(f[2]-f[3])+'" width="'+f[3]*2+'" height="'+f[3]*2+'"/>'});
s+='</svg>';['.door-left','.door-right'].forEach(function(q){var d=c.querySelector(q);if(d)d.insertAdjacentHTML('beforeend',s)});
for(var i=1;i<=6;i++){var p=document.createElement('span');p.className='petal p'+i;c.appendChild(p)}
var card=c.querySelector('.env-card'),lab=c.querySelector('.env-label'),W=c.querySelector('.w-letter');
if(card&&lab){var n=document.createElement('div');n.className='door-names';lab.before(n);
var up=function(){var g=document.getElementById('hero-groom-name'),b=document.getElementById('hero-bride-name');
if(g&&b&&g.textContent.trim()){n.textContent=g.textContent.trim()+' & '+b.textContent.trim();if(W)W.textContent=g.textContent.trim()[0]+'&'+b.textContent.trim()[0]}};
up();setTimeout(up,800);setTimeout(up,2500);['hero-groom-name','hero-bride-name'].forEach(function(id){var e=document.getElementById(id);if(e)new MutationObserver(up).observe(e,{childList:true,characterData:true,subtree:true})})}
var f=document.createElement('div');f.className='fall';for(var j=0;j<9;j++){var q=document.createElement('span'),z=9+Math.random()*8;q.className='fp';
q.style.cssText='left:'+(Math.random()*96)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+(15+Math.random()*10)+'s;animation-delay:'+(-Math.random()*20)+'s;background:linear-gradient(135deg,'+(j%3?'#d9304f,#8a1230':'#fffdf7,#d7c28a')+')';f.appendChild(q)}document.body.appendChild(f)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();
