/* Burgundy Peony theme — decor only. Door, app.js, Firebase untouched. */
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = '../shared/css/theme-peony.css';
  document.head.appendChild(l);

  var IMG = '../shared/images/rose.png';
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="pR" viewBox="-100 -100 200 200"><image href="' + IMG + '" x="-100" y="-85" width="200" height="170"/></symbol>' +
    '<linearGradient id="lgG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1d4420"/><stop offset="1" stop-color="#5a9040"/></linearGradient>' +
    '<symbol id="pL" viewBox="0 0 60 24"><path d="M0 12C14 0 40 0 60 12C40 24 14 24 0 12Z" fill="url(#lgG)"/><path d="M2 12H56" stroke="#b8d9a0" stroke-opacity=".55"/></symbol></defs></svg>';
  function rz(c, x, y, r, rot, fl) {
    return '<use href="#pR" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + (fl ? -1 : 1) + ' 1)" x="' + -r + '" y="' + -r + '" width="' + r * 2 + '" height="' + r * 2 + '"/>';
  }

  function garland() {
    var s = '<svg class="garland" viewBox="0 0 720 350" aria-hidden="true">';
    [[40, 170, 90, -40], [250, 120, 90, -70], [430, 110, 100, -110], [570, 140, 100, -145], [700, 170, 80, -160], [330, 250, 110, 8]].forEach(function (a) {
      s += '<use href="#pL" transform="translate(' + a[0] + ' ' + a[1] + ') rotate(' + a[3] + ')" x="0" y="' + -a[2] * .2 + '" width="' + a[2] + '" height="' + a[2] * .4 + '"/>';
    });
    [[45, 262, 66, -8, 0], [150, 225, 86, 10, 1], [285, 248, 92, -6, 0], [430, 226, 98, 8, 1], [575, 246, 90, -10, 0], [680, 282, 62, 12, 1], [215, 150, 40, -12, 0], [520, 140, 36, 10, 1]].forEach(function (f) { s += rz(0, f[0], f[1], f[2], f[3], f[4]); });
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
      f.innerHTML = '<use href="#pR" x="-100" y="-100" width="200" height="200"/>'; card.appendChild(f);
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
(function(){function rz(c,x,y,r,rot,fl){return '<use href="#pR" transform="translate('+x+' '+y+') rotate('+rot+') scale('+(fl?-1:1)+' 1)" x="'+-r+'" y="'+-r+'" width="'+r*2+'" height="'+r*2+'"/>'}
function go(){var c=document.getElementById('envelope-cover');if(!c)return;
var s='<svg class="door-flora" viewBox="0 0 200 430" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
[[100,70,85,-25],[150,100,70,-80],[-5,150,70,60],[0,300,70,-40],[60,330,80,-70],[110,360,70,-20]].forEach(function(a){s+='<use href="#pL" transform="translate('+a[0]+' '+a[1]+') rotate('+a[3]+')" x="0" y="'+-a[2]*.2+'" width="'+a[2]+'" height="'+a[2]*.4+'"/>'});
[[130,30,38,-10,0],[172,58,52,8,1],[184,128,32,-6,0],[18,150,30,10,1],[14,236,26,-8,0],[38,386,62,-6,0],[108,402,50,10,1],[160,418,32,-8,0]].forEach(function(f){s+=rz(0,f[0],f[1],f[2],f[3],f[4])});
s+='</svg>';['.door-left','.door-right'].forEach(function(q){var d=c.querySelector(q);if(d)d.insertAdjacentHTML('beforeend',s)});
for(var i=1;i<=6;i++){var p=document.createElement('span');p.className='petal p'+i;c.appendChild(p)}
var card=c.querySelector('.env-card'),lab=c.querySelector('.env-label'),W=c.querySelector('.w-letter');
if(card&&lab){var n=document.createElement('div');n.className='door-names';lab.before(n);
var up=function(){var g=document.getElementById('hero-groom-name'),b=document.getElementById('hero-bride-name');
if(g&&b&&g.textContent.trim()){n.textContent=g.textContent.trim()+' & '+b.textContent.trim();if(W)W.textContent=g.textContent.trim()[0]+'&'+b.textContent.trim()[0]}};
up();setTimeout(up,800);setTimeout(up,2500);['hero-groom-name','hero-bride-name'].forEach(function(id){var e=document.getElementById(id);if(e)new MutationObserver(up).observe(e,{childList:true,characterData:true,subtree:true})})}
var f=document.createElement('div');f.className='fall';for(var j=0;j<9;j++){var q=document.createElement('span'),z=9+Math.random()*8;q.className='fp';
q.style.cssText='left:'+(Math.random()*96)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+(15+Math.random()*10)+'s;animation-delay:'+(-Math.random()*20)+'s;background:linear-gradient(135deg,'+(j%3?'#d9304f,#8a1230':'#fffdf7,#d7c28a')+')';f.appendChild(q)}document.body.appendChild(f);var pg=document.createElement('div');pg.className='prog';document.body.appendChild(pg);addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;pg.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'},{passive:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();
