/* Intro: a spinning CD with the name orbiting it. Letters dodge the cursor; scrolling (or swiping) spins
   the disc up and flies the camera through its centre hole, which opens into the site. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = matchMedia('(hover:none)').matches;
  var css = '' +
    '#kx-intro{position:fixed;inset:0;z-index:9998;background:var(--site-cover-bg);overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;--h:0px;' +
    '-webkit-mask:radial-gradient(circle at var(--ex,50%) var(--ey,50%),transparent var(--h),#000 calc(var(--h) + 1px));mask:radial-gradient(circle at var(--ex,50%) var(--ey,50%),transparent var(--h),#000 calc(var(--h) + 1px));transition:opacity .5s}' +
    '#kx-intro.out{opacity:0;pointer-events:none}' +
    '.kxi-disc{--d:min(58vmin,460px);position:absolute;left:50%;top:50%;width:var(--d);height:var(--d);margin:calc(var(--d) / -2) 0 0 calc(var(--d) / -2);border-radius:50%;will-change:transform;' +
    'box-shadow:0 30px 60px -30px rgba(40,24,16,.55),0 0 0 1px rgba(62,50,40,.12);' +
    '-webkit-mask:radial-gradient(circle,transparent 7.4%,#000 7.6%);mask:radial-gradient(circle,transparent 7.4%,#000 7.6%)}' +
    '.kxi-spin{position:absolute;inset:0;border-radius:50%;will-change:transform;' +
    'background:radial-gradient(circle,transparent 0 7.5%,rgba(255,255,255,.55) 7.5% 15%,rgba(62,50,40,.18) 15% 15.6%,transparent 15.6% 34%,rgba(62,50,40,.2) 34% 34.4%,transparent 34.4%),' +
    'repeating-radial-gradient(circle,rgba(255,255,255,0) 0 2px,rgba(255,255,255,.16) 2px 3px),' +
    'linear-gradient(#dcd6cf,#cfc8c0)}' +
    '.kxi-label{position:absolute;inset:16%;border-radius:50%;background:var(--site-selected);color:var(--site-cover-bg);' +
    '-webkit-mask:radial-gradient(circle,transparent 25%,#000 25.5%);mask:radial-gradient(circle,transparent 25%,#000 25.5%)}' +
    '.kxi-label svg{position:absolute;inset:0;width:100%;height:100%}' +
    '.kxi-label text{font-family:var(--site-nav);font-size:13px;letter-spacing:.2em;fill:currentColor}' +
    '.kxi-label .big{font-family:var(--site-wordmark);font-size:21px;letter-spacing:.04em}' +
    '.kxi-sheen{position:absolute;inset:0;border-radius:50%;pointer-events:none;mix-blend-mode:soft-light;opacity:.95;' +
    'background:conic-gradient(from var(--a,0deg),#f6d6c8,#cfe3d9 12%,#fff 18%,#c9d3ea 30%,#f0e3b8 42%,#fff 50%,#f6d6c8 62%,#cfe3d9 74%,#fff 80%,#c9d3ea 90%,#f6d6c8)}' +
    '.kxi-glint{position:absolute;inset:0;border-radius:50%;pointer-events:none;background:conic-gradient(from var(--a,0deg),rgba(255,255,255,.55),transparent 7%,transparent 43%,rgba(255,255,255,.45) 50%,transparent 57%,transparent 93%,rgba(255,255,255,.55));' +
    '-webkit-mask:radial-gradient(circle,transparent 34.5%,#000 35%);mask:radial-gradient(circle,transparent 34.5%,#000 35%)}' +
    '.kxi-ch{position:absolute;left:0;top:0;height:clamp(40px,8.6vmin,88px);aspect-ratio:var(--ar);background:var(--site-text);-webkit-mask:var(--m) center/100% 100% no-repeat;mask:var(--m) center/100% 100% no-repeat;will-change:transform;pointer-events:none}' +
    '.kxi-hint{position:absolute;left:0;right:0;bottom:clamp(22px,6vh,56px);display:flex;flex-direction:column;align-items:center;gap:10px;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--site-text)}' +
    '.kxi-hint i{display:block;width:1.5px;height:34px;background:linear-gradient(var(--site-text) 50%,transparent 50%);background-size:100% 200%;animation:kxiDrip 1.6s cubic-bezier(.6,0,.3,1) infinite}' +
    '@keyframes kxiDrip{from{background-position:0 100%}to{background-position:0 -100%}}' +
    '.kxi-time{position:absolute;top:clamp(20px,5vh,44px);left:0;right:0;display:flex;justify-content:center;gap:18px;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.2em;color:var(--site-text);opacity:.7}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = document.createElement('div'); el.id = 'kx-intro';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Intro — scroll or press Enter to enter the site');
  el.tabIndex = -1;
  el.innerHTML =
    '<div class="kxi-time"><span>TRACK 01</span><span class="kxi-clock">0:00 / 3:14</span></div>' +
    '<div class="kxi-disc"><div class="kxi-spin"><div class="kxi-label"><svg viewBox="0 0 200 200" aria-hidden="true">' +
    '<defs><path id="kxiArc" d="M100,28 a72,72 0 1,1 -0.01,0"></path></defs>' +
    '<text><textPath href="#kxiArc" textLength="448" lengthAdjust="spacing">MUSIC · PORTFOLIO · DESIGN · FILM · </textPath></text>' +
    '<text class="big" x="100" y="160" text-anchor="middle">KX</text></svg></div></div>' +
    '<div class="kxi-sheen"></div><div class="kxi-glint"></div></div>' +
    '<div class="kxi-hint"><span>' + (touch ? 'Swipe up to play' : 'Scroll to play') + '</span><i></i></div>';
  document.body.appendChild(el);
  var html = document.documentElement, prevOv = html.style.overflow;
  html.style.overflow = 'hidden';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  scrollTo(0, 0);

  var disc = el.querySelector('.kxi-disc'), spin = el.querySelector('.kxi-spin'), hint = el.querySelector('.kxi-hint'),
    time = el.querySelector('.kxi-time'), clock = el.querySelector('.kxi-clock');
  var NAME = 'KAYLEE XIAO', chars = [], PLATE_AR = { A: '40/84', K: '54/90', Y: '48/92', L: '52/98', E: '46/90', X: '50/92', I: '44/90', O: '48/98' };
  for (var i = 0; i < NAME.length; i++) {
    if (NAME[i] === ' ') { chars.push(null); continue; }
    var c = document.createElement('span'); c.className = 'kxi-ch'; c.setAttribute('aria-hidden', 'true');
    c.style.setProperty('--m', 'url(assets/plate/' + NAME[i] + '.png)'); c.style.setProperty('--ar', PLATE_AR[NAME[i]]); el.appendChild(c);
    chars.push({ el: c, x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0 });
  }
  function measure() { chars.forEach(function (c) { if (c) { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; } }); }
  measure(); if (document.fonts) document.fonts.ready.then(measure);

  /* sound: a disc-drive whirr (filtered noise + motor hum) that follows spin speed, plus a soft tick per scroll notch */
  var AC = window.AudioContext || window.webkitAudioContext, ac = null, nG, nF, hO, hG, master, lastTick = 0;
  function audio() {
    if (!AC) return null;
    if (!ac) {
      ac = new AC(); master = ac.createGain(); master.gain.value = .9; master.connect(ac.destination);
      var len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0), b = 0;
      for (var q = 0; q < len; q++) { b = .97 * b + .03 * (Math.random() * 2 - 1); d[q] = b * 6 + (Math.random() * 2 - 1) * .08; }
      var src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
      nF = ac.createBiquadFilter(); nF.type = 'bandpass'; nF.frequency.value = 500; nF.Q.value = .9;
      nG = ac.createGain(); nG.gain.value = 0; src.connect(nF); nF.connect(nG); nG.connect(master); src.start();
      hO = ac.createOscillator(); hO.type = 'triangle'; hO.frequency.value = 90;
      var hF = ac.createBiquadFilter(); hF.type = 'lowpass'; hF.frequency.value = 600;
      hG = ac.createGain(); hG.gain.value = 0; hO.connect(hF); hF.connect(hG); hG.connect(master); hO.start();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tick() {
    var c = audio(); if (!c || c.state !== 'running') return;
    var now = c.currentTime; if (now - lastTick < .045) return; lastTick = now;
    var o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    o.type = 'square'; o.frequency.value = 1800 + Math.random() * 500; f.type = 'highpass'; f.frequency.value = 1200;
    g.gain.setValueAtTime(.05, now); g.gain.exponentialRampToValueAtTime(.0001, now + .025);
    o.connect(f); f.connect(g); g.connect(master); o.start(now); o.stop(now + .03);
  }
  function hum(level, sp) {
    if (!ac || ac.state !== 'running') return;
    var t = ac.currentTime;
    nG.gain.setTargetAtTime(level * .22, t, .08); nF.frequency.setTargetAtTime(380 + sp * 260, t, .1);
    hG.gain.setTargetAtTime(level * .05, t, .1); hO.frequency.setTargetAtTime(70 + sp * 22, t, .1);
  }
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) { addEventListener(ev, function () { if (!done) audio(); }, { passive: true }); });

  var target = 0, p = 0, ang = 0, orbit = 0, mx = -9999, my = -9999, sheenA = 0, done = false, t0 = performance.now();
  function push(d) { if (done) return; if (d > 0) tick(); target = Math.max(0, Math.min(1, target + d)); }
  el.addEventListener('wheel', function (e) { e.preventDefault(); push(e.deltaY / (e.deltaMode ? 12 : 1400)); }, { passive: false });
  var ty = null;
  el.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; mx = e.touches[0].clientX; my = ty; }, { passive: true });
  el.addEventListener('touchmove', function (e) { e.preventDefault(); var y = e.touches[0].clientY; push((ty - y) / (innerHeight * .9)); ty = y; mx = e.touches[0].clientX; my = y; }, { passive: false });
  el.addEventListener('touchend', function () { mx = my = -9999; });
  el.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { mx = e.clientX; my = e.clientY; } });
  el.addEventListener('pointerleave', function () { mx = my = -9999; });
  addEventListener('keydown', function (e) {
    if (done) return;
    if (['ArrowDown', 'PageDown', ' ', 'Enter'].indexOf(e.key) > -1) { e.preventDefault(); push(e.key === 'Enter' ? 1 : .18); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); push(-.18); }
  });
  setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) {} }, 50);

  function finish() {
    done = true; el.classList.add('out'); html.style.overflow = prevOv;
    if (ac && ac.state === 'running') { var t = ac.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(.0001, t + 1); setTimeout(function () { ac.close(); }, 1300); }
    setTimeout(function () { el.remove(); st.remove(); }, 520);
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(48, now - last) / 16.67; last = now;
    if (target > .9 && !done) target = 1;
    p += (target - p) * Math.min(1, .085 * dt);
    if (target === 1 && p > .995 && !done) { p = 1; finish(); }
    var D = disc.offsetWidth, cx = innerWidth / 2, cy = innerHeight / 2;
    var e = p * p * (3 - 2 * p);
    /* the hole flies onto the portrait's eye (51% across, 30.8% down the cutout) wherever the layout puts it */
    var por = document.querySelector('.kx-hero-portrait'), hx = cx, hy = cy;
    if (por) { var pr = por.getBoundingClientRect(); if (pr.height > 0 && pr.width > 0) { if (scrollY !== 0 && !done) scrollTo(0, 0); var ee = innerWidth <= 1180 ? 1 : e; hx = cx + (pr.left + pr.width * .51 - cx) * ee; hy = cy + (pr.top + pr.height * .308 - cy) * ee; } }
    disc.style.left = hx + 'px'; disc.style.top = hy + 'px';
    el.style.setProperty('--ex', hx.toFixed(1) + 'px'); el.style.setProperty('--ey', hy.toFixed(1) + 'px');
    var scale = Math.exp(Math.log(46) * Math.pow(p, 1.6));
    var speed = reduce ? 0 : (0.35 + p * 9);
    ang += speed * dt;
    hum(Math.min(1, Math.abs(target - p) * 9) > .02 || p > .01 ? .5 * (p < .3 ? 1 : Math.max(0, 1 - (p - .3) / .45)) : 0, 1); orbit -= (reduce ? 0 : 0.06) * dt;
    spin.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)';
    var tilt = mx > -999 && !touch ? { x: (my - cy) / innerHeight * -14, y: (mx - cx) / innerWidth * 14 } : { x: 0, y: 0 };
    disc.style.transform = 'perspective(900px) rotateX(' + (tilt.x * (1 - e)).toFixed(2) + 'deg) rotateY(' + (tilt.y * (1 - e)).toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
    sheenA += ((mx > -999 ? (mx - cx) / innerWidth * 120 : Math.sin((now - t0) / 2400) * 30) - sheenA) * .06 * dt;
    disc.style.setProperty('--a', sheenA.toFixed(1) + 'deg');
    el.style.setProperty('--h', (D * .075 * scale).toFixed(1) + 'px');
    hint.style.opacity = time.style.opacity = Math.max(0, 1 - p * 4).toFixed(3);
    var secs = Math.round(p * 194); clock.textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0') + ' / 3:14';
    /* name rides the top arc of the disc, slowly orbiting; letters dodge the pointer and spring home */
    var R = D / 2 + (chars[0] ? chars[0].h * .78 : 50) + e * innerWidth * .6, n = NAME.length, span = Math.min(150, 13 * n);
    for (var k = 0; k < n; k++) {
      var c = chars[k]; if (!c) continue;
      var th = (-90 - span / 2 + span * (k + .5) / n + orbit * (1 - e)) * Math.PI / 180;
      var bx = hx + Math.cos(th) * R, by = hy + Math.sin(th) * R;
      var dx = bx + c.x - mx, dy = by + c.y - my, dd = Math.sqrt(dx * dx + dy * dy), rad = 150;
      if (dd < rad && dd > .1) { var f = (rad - dd) / rad * 3.2 * dt; c.vx += dx / dd * f; c.vy += dy / dd * f; }
      var near = dd < 70; if (near && !c.hov && window.KXIntroLetter) window.KXIntroLetter(k); c.hov = near;
      c.vx += -c.x * .045 * dt; c.vy += -c.y * .045 * dt; c.vx *= Math.pow(.86, dt); c.vy *= Math.pow(.86, dt);
      c.x += c.vx * dt; c.y += c.vy * dt;
      var rot = th * 180 / Math.PI + 90 + c.vx * 1.4;
      c.el.style.transform = 'translate(' + (bx + c.x - c.w / 2).toFixed(1) + 'px,' + (by + c.y - c.h / 2).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
      c.el.style.opacity = Math.max(0, 1 - e * 2.2).toFixed(3);
    }
    if (!done || el.isConnected) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
