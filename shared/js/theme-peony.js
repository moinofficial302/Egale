/* Burgundy Peony theme — decor only. Door, app.js, Firebase untouched. */
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = '../shared/css/theme-peony.css';
  document.head.appendChild(l);

  /* ---- Realistic roses & leaf, painted with canvas (no image files) ---- */
  function makeRose(S, P, seed) {
    var c = document.createElement('canvas'); c.width = c.height = S; var x = c.getContext('2d'), s = seed;
    function rnd() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
    var cx = S / 2, cy = S / 2, R = S * .36, N = 46, GA = 2.39996;
    function path(r, w) {
      var j = function () { return (rnd() - .5) * .07; };
      x.beginPath(); x.moveTo(0, 0);
      x.bezierCurveTo(r * .18, -w * .42, r * .6, -w * .8, r * (.95 + j()), -w * .52);
      x.bezierCurveTo(r * (1.08 + j()), -w * .32, r * (1.1 + j()), w * .32, r * (.95 + j()), w * .52);
      x.bezierCurveTo(r * .6, w * .8, r * .18, w * .42, 0, 0); x.closePath();
    }
    x.fillStyle = P.d; x.beginPath(); x.arc(cx, cy, R * .14, 0, 6.283); x.fill();
    for (var i = 0; i < N; i++) {
      var t = 1 - i / (N - 1), r = R * (.09 + .91 * Math.pow(t, 1.05)) * (.95 + .1 * rnd()), w = r * (1.0 + .3 * rnd()), a = i * GA + (rnd() - .5) * .3;
      x.save(); x.translate(cx + Math.cos(a) * r * .2, cy + Math.sin(a) * r * .2); x.rotate(a);
      path(r, w);
      var g = x.createRadialGradient(r * .02, 0, r * .04, r * .6, 0, r * 1.08);
      g.addColorStop(0, P.d); g.addColorStop(.45, P.m); g.addColorStop(.85, P.l); g.addColorStop(1, P.h);
      x.shadowColor = 'rgba(15,0,4,.6)'; x.shadowBlur = r * .13; x.shadowOffsetX = r * .03; x.shadowOffsetY = r * .05;
      x.fillStyle = g; x.fill();
      x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetX = x.shadowOffsetY = 0;
      x.save(); x.clip();
      for (var k = -7; k <= 7; k++) {
        x.beginPath(); x.moveTo(r * .1, 0); x.quadraticCurveTo(r * .5, k * w * .05, r * .98, k * w * .068);
        x.strokeStyle = k % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.07)'; x.lineWidth = Math.max(.6, r * .012); x.stroke();
      }
      var rg = x.createLinearGradient(r * .62, 0, r * 1.08, 0); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(1, 'rgba(255,255,255,.22)');
      x.fillStyle = rg; x.fillRect(0, -w, r * 1.2, w * 2);
      x.restore();
      path(r, w); x.lineWidth = Math.max(1, r * .018); x.strokeStyle = 'rgba(255,255,255,.2)'; x.shadowColor = P.h; x.shadowBlur = r * .03; x.stroke();
      x.restore();
    }
    x.globalCompositeOperation = 'source-atop';
    var cg = x.createRadialGradient(cx, cy, 0, cx, cy, R * .5); cg.addColorStop(0, 'rgba(10,0,3,.5)'); cg.addColorStop(1, 'rgba(10,0,3,0)'); x.fillStyle = cg; x.fillRect(0, 0, S, S);
    var lg = x.createRadialGradient(cx - R * .35, cy - R * .4, 0, cx - R * .35, cy - R * .4, R * 1.2); lg.addColorStop(0, 'rgba(255,255,255,.09)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = lg; x.fillRect(0, 0, S, S);
    var dg = x.createRadialGradient(cx + R * .5, cy + R * .6, R * .3, cx + R * .3, cy + R * .4, R * 1.3); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, 'rgba(8,0,3,.22)'); x.fillStyle = dg; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
    for (var d = 0; d < 9; d++) {
      var ang = rnd() * 6.283, rr = R * (.35 + .5 * rnd()), px = cx + Math.cos(ang) * rr, py = cy + Math.sin(ang) * rr, q = S * (.008 + .009 * rnd());
      x.fillStyle = 'rgba(10,0,3,.35)'; x.beginPath(); x.ellipse(px + q * .35, py + q * .5, q * 1.05, q * .9, 0, 0, 6.283); x.fill();
      var dg2 = x.createRadialGradient(px, py, q * .2, px, py, q); dg2.addColorStop(0, 'rgba(255,255,255,.08)'); dg2.addColorStop(.8, 'rgba(255,255,255,.28)'); dg2.addColorStop(1, 'rgba(255,255,255,.55)');
      x.fillStyle = dg2; x.beginPath(); x.arc(px, py, q, 0, 6.283); x.fill();
      x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(px - q * .35, py - q * .4, q * .28, 0, 6.283); x.fill();
    }
    return c.toDataURL('image/png');
  }
  function makeLeaf() {
    var W = 320, H = 130, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'), n = 30, m = H / 2;
    x.beginPath(); x.moveTo(6, m);
    for (var i = 1; i <= n; i++) { var t = i / n; x.lineTo(6 + t * 308, m - Math.sin(Math.PI * Math.pow(t, .78)) * H * .44 + (i % 2 ? 0 : -2.4)); }
    for (i = n; i >= 0; i--) { t = i / n; x.lineTo(6 + t * 308, m + Math.sin(Math.PI * Math.pow(t, .78)) * H * .44 - (i % 2 ? 0 : -2.4)); }
    x.closePath();
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5b9a45'); g.addColorStop(.5, '#2f6a2a'); g.addColorStop(1, '#1b441a');
    x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 6; x.shadowOffsetY = 3; x.fillStyle = g; x.fill(); x.shadowColor = 'transparent';
    x.save(); x.clip();
    for (var k = 1; k < 10; k++) { var vx = 20 + k * 28; [-1, 1].forEach(function (sg) { x.beginPath(); x.moveTo(vx, m); x.quadraticCurveTo(vx + 14, m + sg * 18, vx + 38, m + sg * 46); x.strokeStyle = 'rgba(200,235,170,.22)'; x.lineWidth = 1.2; x.stroke(); }); }
    x.beginPath(); x.moveTo(6, m); x.lineTo(312, m); x.strokeStyle = 'rgba(215,240,185,.55)'; x.lineWidth = 2.4; x.stroke();
    var sh = x.createLinearGradient(0, 0, 0, m); sh.addColorStop(0, 'rgba(255,255,255,.22)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = sh; x.fillRect(0, 0, W, m);
    x.restore(); return c.toDataURL('image/png');
  }
  
  var PAL = {
    r1: { d: '#0e0003', m: '#66051a', l: '#b3162f', h: '#ff6a7c' },
    r2: { d: '#180005', m: '#7a0a20', l: '#c8203c', h: '#ff7d8c' },
    iv: { d: '#c2a37f', m: '#f8ebd6', l: '#fffbf2', h: '#ffffff' }
  };
  function buildSprite() {
    var s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>';
    [['pR', PAL.r1, 7], ['pR2', PAL.r2, 31], ['pC', PAL.iv, 5]].forEach(function (a) {
      var u = makeRose(400, a[1], a[2]);
      s += '<symbol id="' + a[0] + '" viewBox="-100 -100 200 200"><image href="' + u + '" x="-100" y="-100" width="200" height="200"/></symbol>';
    });
    s += '<symbol id="pL" viewBox="0 0 320 130"><image href="' + makeLeaf() + '" width="320" height="130"/></symbol></defs></svg>';
    document.body.insertAdjacentHTML('afterbegin', s);
  }
  function rz(sym, x, y, r, rot) {
    return '<use href="#' + sym + '" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')" x="' + -r + '" y="' + -r + '" width="' + r * 2 + '" height="' + r * 2 + '"/>';
  }

  function garland() {
    var s = '<svg class="garland" viewBox="0 0 720 350" aria-hidden="true">';
    [[40, 170, 90, -40], [250, 120, 90, -70], [430, 110, 100, -110], [570, 140, 100, -145], [700, 170, 80, -160], [330, 250, 110, 8]].forEach(function (a) {
      s += '<use href="#pL" transform="translate(' + a[0] + ' ' + a[1] + ') rotate(' + a[3] + ')" x="0" y="' + -a[2] * .2 + '" width="' + a[2] + '" height="' + a[2] * .4 + '"/>';
    });
    [['pR', 45, 262, 66, 10], ['pC', 150, 225, 86, 50], ['pR2', 285, 248, 92, 100], ['pC', 430, 226, 98, 20], ['pR', 575, 246, 90, 70], ['pC', 680, 282, 62, 30], ['pR2', 215, 150, 40, 0], ['pC', 520, 140, 36, 0]].forEach(function (f) { s += rz(f[0], f[1], f[2], f[3], f[4]); });
    return s + '</svg>';
  }
  function bridge(flip) {
    var d = document.createElement('div');
    d.className = 'bridge' + (flip ? ' flip' : ''); d.innerHTML = garland(); return d;
  }

  function init() {
    var m = document.getElementById('main-content'); if (!m) return;
    buildSprite();

    var hero = m.querySelector('.hero'), badge = document.getElementById('hero-badge');
    if (hero) hero.after(bridge(false));
    if (badge) {
      var dt = document.createElement('p'); dt.className = 'hero-date'; badge.after(dt);
      var src = document.getElementById('scratch-date-text');
      var upd = function () {
        var d = src && new Date(src.textContent), p = function (n) { return ('0' + n).slice(-2); };
        if (d && !isNaN(d)) dt.textContent = p(d.getDate()) + ' · ' + p(d.getMonth() + 1) + ' · ' + d.getFullYear();
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
      var tk = false; addEventListener('scroll', function () { if (tk) return; tk = true; requestAnimationFrame(function () { tk = false; mv(); }); }, { passive: true }); mv(); setTimeout(mv, 1200);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Door decor: roses on ivory doors, couple names, seal initials, falling petals */
(function(){function rz(sym,x,y,r,rot){return '<use href="#'+sym+'" transform="translate('+x+' '+y+') rotate('+rot+')" x="'+-r+'" y="'+-r+'" width="'+r*2+'" height="'+r*2+'"/>'}
function go(){var c=document.getElementById('envelope-cover');if(!c)return;
var s='<svg class="door-flora" viewBox="0 0 200 430" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
[[100,70,85,-25],[150,100,70,-80],[-5,150,70,60],[0,300,70,-40],[60,330,80,-70],[110,360,70,-20]].forEach(function(a){s+='<use href="#pL" transform="translate('+a[0]+' '+a[1]+') rotate('+a[3]+')" x="0" y="'+-a[2]*.2+'" width="'+a[2]+'" height="'+a[2]*.4+'"/>'});
[['pC',130,30,38,10],['pR',172,58,50,0],['pR2',184,128,30,40],['pR',18,150,30,70],['pC',12,236,26,10],['pR',38,392,60,20],['pC',108,404,50,60],['pR2',160,420,32,90]].forEach(function(f){s+=rz(f[0],f[1],f[2],f[3],f[4])});
s+='</svg>';['.door-left','.door-right'].forEach(function(q){var d=c.querySelector(q);if(d)d.insertAdjacentHTML('beforeend',s)});
for(var i=1;i<=6;i++){var p=document.createElement('span');p.className='petal p'+i;c.appendChild(p)}
var card=c.querySelector('.env-card'),lab=c.querySelector('.env-label'),W=c.querySelector('.w-letter');
if(card&&lab){var n=document.createElement('div');n.className='door-names';lab.before(n);
var up=function(){var g=document.getElementById('hero-groom-name'),b=document.getElementById('hero-bride-name');
if(g&&b&&g.textContent.trim()){n.textContent=g.textContent.trim()+' & '+b.textContent.trim();if(W)W.textContent=g.textContent.trim()[0]+'&'+b.textContent.trim()[0]}};
up();setTimeout(up,800);setTimeout(up,2500);['hero-groom-name','hero-bride-name'].forEach(function(id){var e=document.getElementById(id);if(e)new MutationObserver(up).observe(e,{childList:true,characterData:true,subtree:true})})}
var f=document.createElement('div');f.className='fall';for(var j=0;j<6;j++){var q=document.createElement('span'),z=9+Math.random()*8;q.className='fp';
q.style.cssText='left:'+(Math.random()*96)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+(15+Math.random()*10)+'s;animation-delay:'+(-Math.random()*20)+'s;background:linear-gradient(135deg,'+(j%3?'#d9304f,#8a1230':'#fffdf7,#d7c28a')+')';f.appendChild(q)}document.body.appendChild(f);var pg=document.createElement('div');pg.className='prog';document.body.appendChild(pg);var H=0,tk=false,calc=function(){H=document.documentElement.scrollHeight-innerHeight};calc();addEventListener('resize',calc);addEventListener('load',calc);setTimeout(calc,2500);setTimeout(calc,6000);addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;pg.style.transform='scaleX('+(H>0?Math.min(1,scrollY/H):0)+')'})},{passive:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();

/* Music: reliable start on door tap + icon always in sync */
(function () {
  function go() {
    var a = document.getElementById('bg-music'), t = document.getElementById('music-toggle'); if (!a) return;
    var off = false, armed = false, EV = ['touchstart', 'click', 'scroll', 'keydown'];
    a.preload = 'auto'; try { a.load(); } catch (e) {}
    function icon() { if (t) { t.textContent = a.paused ? '🔇' : '🔊'; t.classList.toggle('muted', a.paused); } }
    ['play', 'playing', 'pause', 'ended'].forEach(function (e) { a.addEventListener(e, icon); }); icon();
    function arm() {
      if (armed) return; armed = true;
      var h = function () { EV.forEach(function (e) { removeEventListener(e, h, true); }); armed = false; start(); };
      EV.forEach(function (e) { addEventListener(e, h, true); });
    }
    function start() { if (off || !a.paused) return; var p = a.play(); if (p && p.catch) p.catch(arm); }
    window.toggleMusic = function () { if (a.paused) { off = false; start(); } else { off = true; a.pause(); } };
    var oe = window.openEnvelope;
    window.openEnvelope = function () {
      start();
      var r = oe && oe.apply(this, arguments);
      [700, 1800, 3500].forEach(function (ms) { setTimeout(start, ms); });
      return r;
    };
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !off && document.getElementById('main-content') && document.getElementById('main-content').classList.contains('visible')) start(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
