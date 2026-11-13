/* ---------- star hover chime: a tiny struck-bell twinkle ---------- */
(function () {
  var ctx = null, last = 0;
  var SCALE = [1046.5, 1244.5, 1396.9, 1567.98, 1864.66, 2093, 2489, 2793.8];
  window.KXStarChime = function (i) {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var now = Date.now();
      if (now - last < 90) return;                      // don't machine-gun on fast sweeps
      last = now;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;
      var f = SCALE[(i || 0) % SCALE.length];
      var out = ctx.createGain(); out.gain.value = 0.06; out.connect(ctx.destination);
      [[1, 1, 0.9], [2.76, 0.34, 0.55], [5.4, 0.14, 0.32]].forEach(function (p) {
        var osc = ctx.createOscillator(); osc.type = 'sine';
        osc.frequency.setValueAtTime(f * p[0], t);
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(p[1], t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
        osc.connect(g).connect(out);
        osc.start(t); osc.stop(t + p[2] + 0.05);
      });
    } catch (e) {}
  };
})();

/* ---------- intro name letters: soft pentatonic notes, several timbres ---------- */
(function () {
  var ctx = null, last = 0;
  var NOTES = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function env(c, t, peak, att, dur) { var g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); g.connect(c.destination); return g; }
  function osc(c, t, type, f, dest, dur, gain) { var o = c.createOscillator(); o.type = type; o.frequency.value = f; var g = c.createGain(); g.gain.value = gain == null ? 1 : gain; o.connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.05); return o; }
  var V = {
    /* felt piano: triangle + detuned sine, closing lowpass, little hammer thump */
    felt: function (c, t, f) {
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.5);
      lp.connect(env(c, t, 0.09, 0.012, 0.7));
      osc(c, t, 'triangle', f, lp, 0.7); osc(c, t, 'sine', f * 1.003, lp, 0.7, 0.6);
      var th = c.createOscillator(); th.frequency.setValueAtTime(140, t); th.frequency.exponentialRampToValueAtTime(70, t + 0.05);
      th.connect(env(c, t, 0.05, 0.002, 0.06)); th.start(t); th.stop(t + 0.08);
    },
    /* breath: noise through a narrow band at the note — a whispered pitch */
    breath: function (c, t, f) {
      var len = Math.floor(c.sampleRate * 0.45), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(); src.buffer = buf;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 18;
      src.connect(bp).connect(env(c, t, 0.35, 0.06, 0.42)); src.start(t);
    },
    /* swell: pure sine with a slow attack, like a rubbed wine glass */
    swell: function (c, t, f) { osc(c, t, 'sine', f * 2, env(c, t, 0.045, 0.07, 0.55), 0.55); },
    /* hum: low warm sine, rounded both ends */
    hum: function (c, t, f) { var g = env(c, t, 0.07, 0.04, 0.4); osc(c, t, 'sine', f / 2, g, 0.4); osc(c, t, 'sine', f, g, 0.4, 0.25); },
    /* rhodes: soft electric-piano tine with gentle tremolo */
    rhodes: function (c, t, f) {
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = f * 3; var g = env(c, t, 0.06, 0.008, 0.9); lp.connect(g);
      var trem = c.createGain(); trem.gain.value = 0.8; trem.connect(lp);
      var lfo = c.createOscillator(); lfo.frequency.value = 5; var lg = c.createGain(); lg.gain.value = 0.2; lfo.connect(lg).connect(trem.gain); lfo.start(t); lfo.stop(t + 0.95);
      osc(c, t, 'sine', f, trem, 0.9); osc(c, t, 'sine', f * 4, trem, 0.15, 0.08);
    },
    /* tick: barely-there pitched tap, almost no tail */
    tick: function (c, t, f) { var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800; lp.connect(env(c, t, 0.05, 0.003, 0.07)); osc(c, t, 'triangle', f * 2, lp, 0.07); }
  };
  window.KXIntroLetterVariants = ['felt', 'breath', 'swell', 'hum', 'rhodes', 'tick'];
  var stored = null; try { stored = localStorage.getItem('kx-intro-letter'); } catch (e) {}
  window.KXIntroLetterVariant = V[stored] ? stored : 'felt';
  window.KXIntroLetter = function (i, name) {
    try {
      var now = Date.now(); if (!name && now - last < 70) return; last = now;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      (V[name || window.KXIntroLetterVariant] || V.felt)(ctx, ctx.currentTime, NOTES[(i || 0) % NOTES.length]);
    } catch (e) {}
  };
})();

/* ---------- letter hover: a small underwater bubble-pop ---------- */
(function () {
  var ctx = null, last = 0;
  var BASE = [180, 200, 220, 240, 265, 290, 320, 350];
  window.KXLetterSound = function (i) {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var now = Date.now();
      if (now - last < 60) return;                      // sweeping across a word stays gentle
      last = now;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;
      var f = BASE[(i || 0) % BASE.length] * (0.94 + Math.random() * 0.12);
      var dur = 0.2 + Math.random() * 0.08;
      /* a bubble is a sine whose pitch bends UP as the bubble shrinks and collapses */
      var osc = ctx.createOscillator(); osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.9, t + dur);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.07, t + 0.022);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      /* muffled, as if heard through water */
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 550; lp.Q.value = 0.8;
      osc.connect(g).connect(lp).connect(ctx.destination);
      osc.start(t); osc.stop(t + dur + 0.05);
    } catch (e) {}
  };
})();

/* ---------- synthesised paper-tear sound (no audio files) ----------
   A granular crackle whose grain density and brightness climb as the tear travels. */
window.KXTearSound = function (opts) {
  var o = opts || {};
  var tearDur = o.tearDur || 1.5;   // seconds of ripping
  var slideAt = o.slideAt || 1.5;   // when the stub starts sliding away
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    var sr = ctx.sampleRate;

    /* --- rip: grain density follows the curl's own velocity, so the crackle
       is fastest at the start of the roll and eases off exactly as the
       animation does (p = 1 - (1-t)^2.1  ->  v = (1-t)^1.1) --- */
    var len = Math.floor(sr * tearDur);
    var buf = ctx.createBuffer(1, len, sr);
    var d = buf.getChannelData(0);
    var i = 0;
    while (i < len) {
      var prog = i / len;
      var v = Math.pow(1 - prog, 1.1);
      var gap = Math.floor(sr * (0.004 + 0.026 * (1 - v)) * (0.4 + Math.random()));
      var glen = Math.floor(sr * (0.0008 + Math.random() * 0.0035));
      var amp = 0.3 + Math.random() * 0.7;
      for (var j = 0; j < glen && i + j < len; j++) {
        d[i + j] += (Math.random() * 2 - 1) * amp * (1 - j / glen);
      }
      i += Math.max(gap, 24);
    }
    for (var k = 0; k < len; k++) {
      var t = k / len;
      var vv = Math.pow(1 - t, 1.1);
      d[k] *= (0.34 + 0.66 * vv) * Math.min(1, t * 40) * (t > 0.9 ? (1 - t) / 0.1 : 1);
    }
    var rip = ctx.createBufferSource(); rip.buffer = buf;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(3600, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + tearDur);
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800;
    var rg = ctx.createGain(); rg.gain.value = 0.15;
    rip.connect(bp).connect(hp).connect(rg).connect(ctx.destination);
    rip.start();

    /* --- the freed roll dropping away: a short filtered whoosh --- */
    var wl = Math.floor(sr * 0.7);
    var wbuf = ctx.createBuffer(1, wl, sr);
    var wd = wbuf.getChannelData(0);
    for (var n = 0; n < wl; n++) {
      var wt = n / wl;
      wd[n] = (Math.random() * 2 - 1) * Math.sin(Math.PI * wt) * 0.5;
    }
    var wsrc = ctx.createBufferSource(); wsrc.buffer = wbuf;
    var wf = ctx.createBiquadFilter(); wf.type = 'lowpass';
    wf.frequency.setValueAtTime(2600, ctx.currentTime + slideAt);
    wf.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + slideAt + 0.7);
    var wg = ctx.createGain(); wg.gain.value = 0.07;
    wsrc.connect(wf).connect(wg).connect(ctx.destination);
    wsrc.start(ctx.currentTime + slideAt);

    setTimeout(function () { try { ctx.close(); } catch (e) {} }, (slideAt + 1.6) * 1000);
  } catch (e) { /* audio unavailable — the animation still plays */ }
};

/* ---------- polaroid hover: a sheet pulled from a pack ----------
   Modelled on the "Paper, Handle, Sheet, Remove From Pack" reference (synthesised,
   not sampled): a short dry friction slide with fine fibre grain that eases off,
   then a small release at the end as the sheet clears. */
(function () {
  var ctx = null, last = 0;
  function audio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function noiseBuf(c, dur, shape) {
    var sr = c.sampleRate, len = Math.floor(sr * dur), b = c.createBuffer(1, len, sr), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * shape(i / len);
    return b;
  }
  /* --- variant: soft shutter click — two dry mechanical ticks --- */
  function shutter(c, vol) {
    var t = c.currentTime;
    [[0, 1], [0.052, 0.62]].forEach(function (p) {
      var src = c.createBufferSource();
      src.buffer = noiseBuf(c, 0.05, function (x) { return Math.pow(1 - x, 6); });
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.1;
      var g = c.createGain(); g.gain.value = 0.16 * vol * p[1];
      src.connect(bp).connect(g).connect(c.destination);
      src.start(t + p[0]);
      /* a little body so it reads as a metal mechanism, not just hiss */
      var o = c.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(880, t + p[0]);
      var og = c.createGain();
      og.gain.setValueAtTime(0.0001, t + p[0]);
      og.gain.exponentialRampToValueAtTime(0.05 * vol * p[1], t + p[0] + 0.004);
      og.gain.exponentialRampToValueAtTime(0.0001, t + p[0] + 0.045);
      o.connect(og).connect(c.destination); o.start(t + p[0]); o.stop(t + p[0] + 0.06);
    });
  }
  /* --- variant: muted thud — card tapping down --- */
  function thud(c, vol) {
    var t = c.currentTime;
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(72, t + 0.13);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22 * vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.2);
    var src = c.createBufferSource();
    src.buffer = noiseBuf(c, 0.07, function (x) { return Math.pow(1 - x, 4); });
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    var ng = c.createGain(); ng.gain.value = 0.07 * vol;
    src.connect(lp).connect(ng).connect(c.destination); src.start(t);
  }
  /* --- variant: airy whoosh — light quick swipe --- */
  function whoosh(c, vol) {
    var t = c.currentTime, dur = 0.3;
    var src = c.createBufferSource();
    src.buffer = noiseBuf(c, dur, function (x) { return Math.sin(Math.PI * Math.pow(x, 0.7)); });
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.6;
    bp.frequency.setValueAtTime(700, t);
    bp.frequency.exponentialRampToValueAtTime(3200, t + dur * 0.7);
    bp.frequency.exponentialRampToValueAtTime(1200, t + dur);
    var g = c.createGain(); g.gain.value = 0.1 * vol;
    src.connect(bp).connect(g).connect(c.destination); src.start(t);
  }
  /* --- variant: warm wooden knock --- */
  function knock(c, vol) {
    var t = c.currentTime;
    [[420, 1, 0.11], [640, 0.5, 0.07], [1030, 0.25, 0.05]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(p[0] * (0.98 + Math.random() * 0.04), t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13 * vol * p[1], t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + p[2] + 0.03);
    });
    var src = c.createBufferSource();
    src.buffer = noiseBuf(c, 0.03, function (x) { return Math.pow(1 - x, 5); });
    var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
    var ng = c.createGain(); ng.gain.value = 0.05 * vol;
    src.connect(hp).connect(ng).connect(c.destination); src.start(t);
  }
  /* --- variant: page turn — a sheet lifting, sweeping over, and settling ---
     three overlapping layers: the lift (brief fibre rustle), the sweep (broad
     noise whose band rises then falls as the page passes the midpoint), and a
     soft flap as it lands. */
  function pageturn(c, vol) {
    var t = c.currentTime;
    /* lift: dry crinkle as the corner separates */
    var lift = c.createBufferSource();
    lift.buffer = noiseBuf(c, 0.09, function (x) {
      var crackle = Math.random() < 0.4 ? 1 : 0.25;
      return Math.min(1, x * 12) * Math.pow(1 - x, 2) * crackle;
    });
    var lbp = c.createBiquadFilter(); lbp.type = 'bandpass'; lbp.frequency.value = 3400; lbp.Q.value = 0.8;
    var lg = c.createGain(); lg.gain.value = 0.075 * vol;
    lift.connect(lbp).connect(lg).connect(c.destination); lift.start(t);

    /* sweep: the body of the turn — arcs up in level and brightness, then away */
    var sd = 0.34, s0 = t + 0.045;
    var sweep = c.createBufferSource();
    sweep.buffer = noiseBuf(c, sd, function (x) {
      return Math.sin(Math.PI * Math.pow(x, 0.85)) * (0.7 + 0.3 * Math.random());
    });
    var sbp = c.createBiquadFilter(); sbp.type = 'bandpass'; sbp.Q.value = 0.55;
    sbp.frequency.setValueAtTime(900, s0);
    sbp.frequency.exponentialRampToValueAtTime(2400, s0 + sd * 0.45);
    sbp.frequency.exponentialRampToValueAtTime(760, s0 + sd);
    var shp = c.createBiquadFilter(); shp.type = 'highpass'; shp.frequency.value = 420;
    var sg = c.createGain(); sg.gain.value = 0.115 * vol;
    sweep.connect(sbp).connect(shp).connect(sg).connect(c.destination); sweep.start(s0);

    /* flap: the page meeting the stack — short, low, soft */
    var f0 = s0 + sd * 0.86;
    var flap = c.createBufferSource();
    flap.buffer = noiseBuf(c, 0.08, function (x) { return Math.min(1, x * 20) * Math.pow(1 - x, 3); });
    var flp = c.createBiquadFilter(); flp.type = 'lowpass'; flp.frequency.value = 1500;
    var fg = c.createGain(); fg.gain.value = 0.085 * vol;
    flap.connect(flp).connect(fg).connect(c.destination); flap.start(f0);
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(190, f0);
    o.frequency.exponentialRampToValueAtTime(105, f0 + 0.09);
    var og = c.createGain();
    og.gain.setValueAtTime(0.0001, f0);
    og.gain.exponentialRampToValueAtTime(0.055 * vol, f0 + 0.007);
    og.gain.exponentialRampToValueAtTime(0.0001, f0 + 0.1);
    o.connect(og).connect(c.destination); o.start(f0); o.stop(f0 + 0.13);
  }
  /* --- variant: paper flick — one crisp snap as a stiff sheet springs past --- */
  function flick(c, vol) {
    var t = c.currentTime;
    var src = c.createBufferSource();
    src.buffer = noiseBuf(c, 0.13, function (x) {
      /* dense burst up front, fast decay: reads as a single snap, not a sweep */
      var burst = Math.random() < 0.75 ? 1 : 0.3;
      return Math.min(1, x * 40) * Math.pow(1 - x, 5.5) * burst;
    });
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(2800, t);
    bp.frequency.exponentialRampToValueAtTime(1400, t + 0.13);
    var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    var g = c.createGain(); g.gain.value = 0.13 * vol;
    src.connect(bp).connect(hp).connect(g).connect(c.destination); src.start(t);
  }
  /* --- variant: soft rustle — a sheet shifting against another, no snap --- */
  function rustle(c, vol) {
    var t = c.currentTime, dur = 0.28;
    var src = c.createBufferSource();
    var wob = 0;
    src.buffer = noiseBuf(c, dur, function (x) {
      wob += (Math.random() - 0.5) * 0.6; wob *= 0.82;
      return Math.min(1, x * 6) * Math.pow(1 - x, 1.8) * (0.45 + Math.abs(wob));
    });
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.5;
    bp.frequency.setValueAtTime(1500, t);
    bp.frequency.linearRampToValueAtTime(2300, t + dur);
    var g = c.createGain(); g.gain.value = 0.085 * vol;
    src.connect(bp).connect(g).connect(c.destination); src.start(t);
  }
  /* --- variant: riffle — a few pages fanning past the thumb --- */
  function riffle(c, vol) {
    var t = c.currentTime;
    /* 5–6 tiny ticks, accelerating slightly, each brighter than a rustle */
    var n = 5 + (Math.random() < 0.5 ? 0 : 1), at = 0;
    for (var i = 0; i < n; i++) {
      var src = c.createBufferSource();
      src.buffer = noiseBuf(c, 0.035, function (x) { return Math.min(1, x * 30) * Math.pow(1 - x, 4); });
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1;
      bp.frequency.value = 2200 + Math.random() * 1600;
      var g = c.createGain(); g.gain.value = 0.075 * vol * (1 - i / (n * 1.6));
      src.connect(bp).connect(g).connect(c.destination);
      src.start(t + at);
      at += 0.038 - i * 0.003 + Math.random() * 0.012;
    }
  }
  /* --- variant: cardstock flip — a thick polaroid turning: body + dry edge tick --- */
  function cardstock(c, vol) {
    var t = c.currentTime;
    var src = c.createBufferSource();
    src.buffer = noiseBuf(c, 0.18, function (x) {
      return Math.min(1, x * 14) * Math.pow(1 - x, 2.6) * (0.6 + 0.4 * Math.random());
    });
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(1100, t);
    bp.frequency.exponentialRampToValueAtTime(2000, t + 0.09);
    bp.frequency.exponentialRampToValueAtTime(900, t + 0.18);
    var g = c.createGain(); g.gain.value = 0.1 * vol;
    src.connect(bp).connect(g).connect(c.destination); src.start(t);
    /* the stiff edge landing — short, dry, slightly woody */
    var e0 = t + 0.125;
    var edge = c.createBufferSource();
    edge.buffer = noiseBuf(c, 0.05, function (x) { return Math.pow(1 - x, 5); });
    var elp = c.createBiquadFilter(); elp.type = 'lowpass'; elp.frequency.value = 2200;
    var eg = c.createGain(); eg.gain.value = 0.075 * vol;
    edge.connect(elp).connect(eg).connect(c.destination); edge.start(e0);
    var o = c.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(330, e0);
    var og = c.createGain();
    og.gain.setValueAtTime(0.0001, e0);
    og.gain.exponentialRampToValueAtTime(0.04 * vol, e0 + 0.005);
    og.gain.exponentialRampToValueAtTime(0.0001, e0 + 0.07);
    o.connect(og).connect(c.destination); o.start(e0); o.stop(e0 + 0.09);
  }
  /* ================= tonal set: no noise, no swish =================
     Every sound below is built from oscillators only — no filtered noise — so
     none of them can read as rustle or air. */

  /* pluck: a short muted string, soft attack, quick damp */
  function pluck(c, vol) {
    var t = c.currentTime, f = 392;
    var o = c.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(f, t);
    o.frequency.linearRampToValueAtTime(f * 0.985, t + 0.18);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
    o.connect(g).connect(lp).connect(c.destination); o.start(t); o.stop(t + 0.24);
  }
  /* marimba: wooden bar — fundamental + 4th partial, warm and round */
  function marimba(c, vol) {
    var t = c.currentTime, f = 523.25;
    [[1, 1, 0.34], [4.01, 0.22, 0.16], [9.6, 0.06, 0.08]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f * p[0], t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13 * vol * p[1], t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + p[2] + 0.04);
    });
  }
  /* woodblock: dry, pitched, almost no tail */
  function woodblock(c, vol) {
    var t = c.currentTime;
    [[1200, 1, 0.045], [1810, 0.4, 0.03]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'square';
      o.frequency.setValueAtTime(p[0], t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.075 * vol * p[1], t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
      o.connect(g).connect(lp).connect(c.destination); o.start(t); o.stop(t + p[2] + 0.03);
    });
  }
  /* droplet: pitch bends up fast — the classic water "plink" */
  function droplet(c, vol) {
    var t = c.currentTime, f = 620;
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.6, t + 0.09);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.13 * vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.14);
  }
  /* pop: hollow bottle-cork blip — pitch drops, resonant */
  function pop(c, vol) {
    var t = c.currentTime;
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(760, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.06);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.17 * vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 1.4;
    o.connect(g).connect(bp).connect(c.destination); o.start(t); o.stop(t + 0.1);
  }
  /* twochime: two-note rise — a small friendly interval, like a UI confirm */
  function twochime(c, vol) {
    var t = c.currentTime;
    [[783.99, 0], [1174.66, 0.075]].forEach(function (p, i) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(p[0], t + p[1]);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t + p[1]);
      g.gain.exponentialRampToValueAtTime(0.07 * vol * (i ? 0.8 : 1), t + p[1] + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[1] + 0.22);
      o.connect(g).connect(c.destination); o.start(t + p[1]); o.stop(t + p[1] + 0.26);
    });
  }
  /* music box: bright tine with a long shimmering tail */
  function musicbox(c, vol) {
    var t = c.currentTime, f = 1046.5;
    [[1, 1, 0.9], [2.03, 0.3, 0.55], [3.98, 0.12, 0.35]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f * p[0], t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055 * vol * p[1], t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + p[2] + 0.05);
    });
  }
  /* kalimba: metal tine — fundamental plus a slightly detuned twin, gentle */
  function kalimba(c, vol) {
    var t = c.currentTime, f = 659.25;
    [[1, 1], [1.004, 0.7], [3.0, 0.13]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f * p[0], t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.075 * vol * p[1], t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.56);
    });
  }
  /* glass: struck rim — high, thin, inharmonic partials */
  function glass(c, vol) {
    var t = c.currentTime, f = 1568;
    [[1, 1, 0.45], [2.41, 0.28, 0.3], [4.7, 0.1, 0.2]].forEach(function (p) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f * p[0], t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05 * vol * p[1], t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + p[2] + 0.04);
    });
  }
  /* keyjingle: two or three small metal rings tapping — clustered inharmonic pings */
  function keyjingle(c, vol) {
    var t = c.currentTime;
    [0, 0.045 + Math.random() * 0.02, 0.1 + Math.random() * 0.03].forEach(function (off, i) {
      var f = 2600 + Math.random() * 900 - i * 250;
      [[1, 1, 0.22], [1.47, 0.5, 0.16], [2.76, 0.25, 0.1]].forEach(function (p) {
        var o = c.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(f * p[0], t + off);
        var g = c.createGain();
        g.gain.setValueAtTime(0.0001, t + off);
        g.gain.exponentialRampToValueAtTime(0.035 * vol * p[1] * (1 - i * 0.25), t + off + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + off + p[2]);
        o.connect(g).connect(c.destination); o.start(t + off); o.stop(t + off + p[2] + 0.03);
      });
    });
  }
  /* bloop: soft rounded sub-blip, pitch rising — playful, very low fatigue */
  function bloop(c, vol) {
    var t = c.currentTime;
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(440, t + 0.12);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.15 * vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.18);
  }
  /* bubble: two tiny rising blips, like a bubble surfacing */
  function bubble(c, vol) {
    var t = c.currentTime;
    [[340, 720, 0], [520, 1040, 0.06]].forEach(function (p, i) {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(p[0], t + p[2]);
      o.frequency.exponentialRampToValueAtTime(p[1], t + p[2] + 0.07);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t + p[2]);
      g.gain.exponentialRampToValueAtTime((i ? 0.08 : 0.12) * vol, t + p[2] + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2] + 0.09);
      o.connect(g).connect(c.destination); o.start(t + p[2]); o.stop(t + p[2] + 0.11);
    });
  }
  /* softpop: muted mouth-pop, short downward blip */
  function softpop(c, vol) {
    var t = c.currentTime;
    var o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(260, t + 0.05);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.09);
  }
  /* mouseclick: crisp plastic click — tiny noise burst + high body, with a softer release tick */
  function mouseclick(c, vol) {
    var t = c.currentTime;
    [[0, 1], [0.07, 0.45]].forEach(function (p) {
      var len = Math.floor(c.sampleRate * 0.012), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      var s = c.createBufferSource(); s.buffer = b;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 1.4;
      var g = c.createGain(); g.gain.value = 0.5 * vol * p[1];
      s.connect(bp).connect(g).connect(c.destination); s.start(t + p[0]);
    });
  }
  /* sampled mouse double-click (uploaded wav) */
  var dcBuf = null, dcState = 'idle';
  function mousedbl(c, vol) {
    if (dcState === 'idle') {
      dcState = 'loading';
      fetch('uploads/mixkit-fast-double-click-on-mouse-275.wav').then(function (r) { return r.arrayBuffer(); })
        .then(function (a) { return c.decodeAudioData(a); })
        .then(function (b) { dcBuf = b; dcState = 'ready'; mousedbl(c, vol); })
        .catch(function () { dcState = 'idle'; });
      return;
    }
    if (!dcBuf) return;
    var s = c.createBufferSource(); s.buffer = dcBuf;
    var g = c.createGain(); g.gain.value = 0.8 * vol;
    s.connect(g).connect(c.destination); s.start();
  }
  /* sampled message pop (uploaded mp3) */
  var mpBuf = null, mpState = 'idle';
  function msgpop(c, vol) {
    if (mpState === 'idle') {
      mpState = 'loading';
      fetch('uploads/' + encodeURIComponent('mixkit-message-pop-alert-2354 (1).mp3')).then(function (r) { return r.arrayBuffer(); })
        .then(function (a) { return c.decodeAudioData(a); })
        .then(function (b) { mpBuf = b; mpState = 'ready'; msgpop(c, vol); })
        .catch(function () { mpState = 'idle'; });
      return;
    }
    if (!mpBuf) return;
    var s = c.createBufferSource(); s.buffer = mpBuf;
    var g = c.createGain(); g.gain.value = 0.6 * vol;
    s.connect(g); g.connect(c.destination); s.start();
  }
  /* boing: rubber-band wobble — pitch dives while vibrato widens */
  function boing(c, vol) {
    var t = c.currentTime;
    var o = c.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(560, t);
    o.frequency.exponentialRampToValueAtTime(200, t + 0.26);
    var lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 17;
    var lg = c.createGain();
    lg.gain.setValueAtTime(70, t);
    lg.gain.linearRampToValueAtTime(8, t + 0.26);
    lfo.connect(lg).connect(o.frequency);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.11 * vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(c.destination);
    o.start(t); lfo.start(t); o.stop(t + 0.31); lfo.stop(t + 0.31);
  }
  /* arp: three quick ascending notes — a tiny sparkle run */
  function arp(c, vol) {
    var t = c.currentTime;
    [880, 1108.73, 1318.51].forEach(function (f, i) {
      var at = t + i * 0.045;
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f, at);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.05 * vol, at + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
      o.connect(g).connect(c.destination); o.start(at); o.stop(at + 0.24);
    });
  }
  /* ---- dry tick family: woodblock character, shorter, damped, no ring ----
     All under 30ms of audible tail, low-passed so the upper partials that make
     the woodblock "ping" never sustain. */
  function dryTick(f, partial, dur, cut, gain) {
    return function (c, vol) {
      var t = c.currentTime;
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut;
      lp.connect(c.destination);
      [[f, 1, dur], [f * partial, 0.3, dur * 0.6]].forEach(function (p) {
        var o = c.createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime(p[0], t);
        /* linear ramp to silence: no exponential tail, so it stops dead */
        var g = c.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(gain * vol * p[1], t + 0.0015);
        g.gain.linearRampToValueAtTime(0, t + p[2]);
        o.connect(g).connect(lp); o.start(t); o.stop(t + p[2] + 0.005);
      });
    };
  }
  var tick  = dryTick(1500, 1.48, 0.018, 2600, 0.11);   /* crisp, small */
  var tock  = dryTick(760,  1.52, 0.024, 1700, 0.13);   /* lower, softer */
  var tap   = dryTick(2100, 1.35, 0.012, 3400, 0.09);   /* pencil-tap quick */
  var clack = dryTick(520,  2.05, 0.028, 1300, 0.14);   /* blunt, plastic-y */
  /* ---- short paper family: paper texture, but cut so short there is no sweep ----
     The earlier paper attempts read as rustle because they lasted 200–300ms. These
     are 12–35ms bursts — the ear hears a card being set down, not air moving. */
  function paperHit(dur, lo, hi, gain, body) {
    return function (c, vol) {
      var t = c.currentTime;
      var src = c.createBufferSource();
      /* dense burst, near-instant attack, straight-line decay to silence */
      src.buffer = noiseBuf(c, dur, function (x) { return Math.min(1, x * 60) * (1 - x) * (1 - x); });
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.6;
      bp.frequency.value = lo;
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = hi;
      var g = c.createGain(); g.gain.value = gain * vol;
      src.connect(bp).connect(lp).connect(g).connect(c.destination); src.start(t);
      /* a touch of pitched body so it lands as a surface, not a hiss */
      if (body) {
        var o = c.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(body, t);
        o.frequency.linearRampToValueAtTime(body * 0.72, t + dur);
        var og = c.createGain();
        og.gain.setValueAtTime(0, t);
        og.gain.linearRampToValueAtTime(0.06 * vol, t + 0.002);
        og.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(og).connect(c.destination); o.start(t); o.stop(t + dur + 0.01);
      }
    };
  }
  var papertap  = paperHit(0.028, 1100, 4200, 0.16, 210);  /* card set on card */
  var papersnap = paperHit(0.016, 2600, 7000, 0.15, 0);    /* crisp corner snap */
  var paperpat  = paperHit(0.035, 700,  2200, 0.15, 150);  /* soft, muffled pat */
  var pageflick = paperHit(0.012, 3800, 9000, 0.13, 0);    /* thin, quickest */
  /* close cousins of papersnap for the keyring hover */
  var snapsoft  = paperHit(0.018, 1900, 5200, 0.14, 0);    /* rounder, less bite */
  var snapcard  = paperHit(0.022, 2200, 6400, 0.15, 330);  /* stiffer card, faint body */
  var snaptiny  = paperHit(0.010, 3200, 8000, 0.12, 0);    /* smaller, lighter */
  var snapbright= paperHit(0.016, 3400, 10000, 0.13, 0);   /* airier top end */
  function snapdouble(c, vol) { papersnap(c, vol); setTimeout(function () { snaptiny(c, vol * 0.6); }, 38); }
  function snapflutter(c, vol) { [0, 26, 52].forEach(function (ms, i) { setTimeout(function () { snaptiny(c, vol * (1 - i * 0.28)); }, ms); }); }
  /* ---- book flip: comb-resonant paper, not smooth noise ----
     A real page flip is a stiff sheet buckling: irregular crackle transients
     ringing through the sheet's own short resonance (a comb delay of ~1–2ms),
     then a soft slap as it lands. Smooth filtered noise gives "air"; the comb
     is what makes the ear hear "paper". */
  function flipCore(c, vol, o) {
    var t = c.currentTime, sr = c.sampleRate;
    var dur = o.dur, len = Math.floor(sr * dur);
    var buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0);
    /* sparse, irregular impulses — the sheet catching and releasing */
    var i = 0;
    while (i < len) {
      var p = i / len;
      var amp = (0.4 + Math.random() * 0.6) * (1 - p * 0.55);
      var glen = Math.floor(sr * 0.0006 * (0.5 + Math.random()));
      for (var j = 0; j < glen && i + j < len; j++) d[i + j] += (Math.random() * 2 - 1) * amp;
      /* gaps shorten toward the middle of the flip: the buckle accelerates */
      var rate = o.rate * (0.55 + 0.9 * Math.sin(Math.PI * p));
      i += Math.max(Math.floor(sr / rate * (0.45 + Math.random())), 16);
    }
    var src = c.createBufferSource(); src.buffer = buf;
    /* comb: short feedback delay = the sheet's own resonance, tuned by size */
    var dly = c.createDelay(0.02); dly.delayTime.value = o.comb;
    var fb = c.createGain(); fb.gain.value = o.fb;
    var damp = c.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = o.damp;
    src.connect(dly); dly.connect(damp).connect(fb).connect(dly);
    var mix = c.createGain(); mix.gain.value = o.gain * vol;
    var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = o.hp;
    src.connect(mix); dly.connect(mix);
    mix.connect(hp).connect(c.destination);
    /* landing slap */
    if (o.slap) {
      var s0 = t + dur * 0.88;
      var sl = c.createBufferSource();
      sl.buffer = noiseBuf(c, 0.045, function (x) { return Math.min(1, x * 40) * (1 - x) * (1 - x); });
      var slp = c.createBiquadFilter(); slp.type = 'lowpass'; slp.frequency.value = 1600;
      var sg = c.createGain(); sg.gain.value = o.slap * vol;
      sl.connect(slp).connect(sg).connect(c.destination); sl.start(s0);
      var ob = c.createOscillator(); ob.type = 'sine';
      ob.frequency.setValueAtTime(180, s0);
      ob.frequency.linearRampToValueAtTime(120, s0 + 0.05);
      var og = c.createGain();
      og.gain.setValueAtTime(0, s0);
      og.gain.linearRampToValueAtTime(0.05 * vol, s0 + 0.003);
      og.gain.linearRampToValueAtTime(0, s0 + 0.055);
      ob.connect(og).connect(c.destination); ob.start(s0); ob.stop(s0 + 0.07);
    }
    src.start(t);
  }
  /* one page of a paperback turning over */
  function bookflip(c, vol) {
    flipCore(c, vol, { dur: 0.13, rate: 190, comb: 0.0014, fb: 0.72, damp: 5200, hp: 700, gain: 0.1, slap: 0.09 });
  }
  /* a thicker, larger page — lower resonance, a bit slower */
  function magflip(c, vol) {
    flipCore(c, vol, { dur: 0.17, rate: 140, comb: 0.0026, fb: 0.76, damp: 3600, hp: 450, gain: 0.11, slap: 0.11 });
  }
  /* thumbing three pages past in one motion */
  function thumbflip(c, vol) {
    [0, 0.055, 0.108].forEach(function (off) {
      setTimeout(function () {
        flipCore(c, vol * (off ? 0.75 : 1), { dur: 0.07, rate: 220, comb: 0.0012, fb: 0.7, damp: 6000, hp: 900, gain: 0.09, slap: 0 });
      }, off * 1000);
    });
  }
  /* ---- real recording: uploads/mixkit-page-turn-single-1104.wav ----
     Decoded once into a buffer so repeat hovers are instant and overlap cleanly.
     Falls back to an <audio> pool if decoding is unavailable. */
  var SAMPLE_URL = 'uploads/mixkit-page-turn-single-1104.wav';
  var sampleBuf = null, sampleState = 'idle', sampleTags = null;
  function loadSample(c) {
    if (sampleState !== 'idle') return;
    sampleState = 'loading';
    fetch(SAMPLE_URL).then(function (r) { return r.arrayBuffer(); })
      .then(function (ab) { return c.decodeAudioData(ab); })
      .then(function (b) { sampleBuf = b; sampleState = 'ready'; })
      .catch(function () {
        sampleState = 'fallback';
        sampleTags = [0, 1, 2].map(function () {
          var a = new Audio(SAMPLE_URL); a.preload = 'auto'; a.volume = 0.7; return a;
        });
      });
  }
  var tagIdx = 0;
  function sample(c, vol) {
    if (sampleState === 'idle' || sampleState === 'loading') { loadSample(c); }
    if (sampleBuf) {
      var src = c.createBufferSource(); src.buffer = sampleBuf;
      var g = c.createGain(); g.gain.value = 0.4 * vol;
      src.connect(g).connect(c.destination); src.start(c.currentTime);
      return;
    }
    if (sampleTags) {
      var a = sampleTags[tagIdx++ % sampleTags.length];
      try { a.currentTime = 0; a.volume = Math.min(1, 0.35 * vol); a.play(); } catch (e) {}
    }
  }
  var VARIANTS = { sample: sample,
                   bookflip: bookflip, magflip: magflip, thumbflip: thumbflip,
                   papertap: papertap, papersnap: papersnap, paperpat: paperpat, pageflick: pageflick,
                   snapsoft: snapsoft, snapcard: snapcard, snaptiny: snaptiny, snapbright: snapbright, snapdouble: snapdouble, snapflutter: snapflutter,
                   tick: tick, tock: tock, tap: tap, clack: clack,
                   pluck: pluck, marimba: marimba, woodblock: woodblock, droplet: droplet,
                   pop: pop, twochime: twochime,
                   musicbox: musicbox, kalimba: kalimba, glass: glass, bloop: bloop,
                   boing: boing, arp: arp, bubble: bubble, softpop: softpop, mouseclick: mouseclick, mousedbl: mousedbl, msgpop: msgpop, keyjingle: keyjingle,
                   flick: flick, rustle: rustle, riffle: riffle, cardstock: cardstock,
                   pageturn: pageturn, shutter: shutter, thud: thud, whoosh: whoosh, knock: knock };
  window.KXPolaroidSound = function (name, vol) {
    var c = audio(); if (!c) return;
    (VARIANTS[name] || marimba)(c, vol == null ? 1 : vol);
  };
  window.KXPolaroidVariants = ['sample', 'bookflip', 'magflip', 'thumbflip',
                              'papertap', 'papersnap', 'paperpat', 'pageflick',
                              'tick', 'tock', 'tap', 'clack', 'woodblock',
                              'marimba', 'pluck', 'droplet', 'pop', 'twochime',
                              'kalimba', 'musicbox', 'glass', 'bloop', 'boing', 'arp'];
  /* which one the polaroids use; a stored id from an earlier round may name a
     sound that is no longer offered, so validate against the current list */
  if (!window.KXPolaroidVariant) {
    var stored = null;
    try { stored = localStorage.getItem('kx-polaroid-sfx'); } catch (e) {}
    window.KXPolaroidVariant = window.KXPolaroidVariants.indexOf(stored) > -1 ? stored : 'sample';
  }
  /* warm the sample up on the first pointer move so the first hover isn't silent */
  window.addEventListener('pointerdown', function warm() {
    window.removeEventListener('pointerdown', warm);
    var c = audio(); if (c) { loadSample(c); if (mpState === 'idle') msgpop(c, 0); }
  }, { once: true });
  window.KXPaperFlick = function () {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var now = Date.now();
      if (now - last < 220) return;
      last = now;
      var variant = window.KXPolaroidVariant || 'sample';
      if (variant !== 'paper') { window.KXPolaroidSound(variant, 1); return; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime, sr = ctx.sampleRate, dur = 0.24;
      var len = Math.floor(sr * dur), buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      /* fibre grain: noise amplitude wobbles on a fast random walk so the slide has
         texture instead of reading as smooth air */
      var grain = 0;
      for (var i = 0; i < len; i++) {
        var p = i / len;
        grain += (Math.random() - 0.5) * 0.5;
        grain *= 0.86;
        var slide = Math.min(1, p * 9) * Math.pow(1 - p, 1.5);      // pull, then ease off
        var release = p > 0.78 ? Math.pow((p - 0.78) / 0.22, 2) * 0.5 : 0;  // sheet clears
        d[i] = (Math.random() * 2 - 1) * (0.55 + Math.abs(grain)) * (slide + release);
      }
      var src = ctx.createBufferSource(); src.buffer = buf;
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.75;
      bp.frequency.setValueAtTime(1900 * (0.95 + Math.random() * 0.1), t);
      bp.frequency.linearRampToValueAtTime(1250, t + dur);
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600;
      var g = ctx.createGain(); g.gain.value = 0.07;
      src.connect(bp).connect(hp).connect(g).connect(ctx.destination);
      src.start(t);
    } catch (e) {}
  };
})();

/* ---------- portfolio folder hover: sampled (assets/folder-hover.mp3) ---------- */
(function () {
  var last = 0, pool = null, pi = 0;
  window.KXFolderHover = function () {
    try {
      var now = Date.now(); if (now - last < 150) return; last = now;
      if (!pool) pool = [0, 1, 2].map(function () { var a = new Audio('assets/folder-hover.mp3'); a.preload = 'auto'; a.volume = 0.6; return a; });
      var a = pool[pi++ % pool.length]; a.currentTime = 0; var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
  };
})();

/* ---------- keyring hover: paper snap ----------
   Reuses the polaroid kit's 'papersnap' hit — a short broadband burst, no
   pitch centre — throttled so sweeping across the board stays quiet. */
(function () {
  var last = 0, pool = null, pi = 0;
  window.KXKeyJingle = function () {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var now = Date.now();
      if (now - last < 200) return;
      last = now;
      if (!pool) pool = [0, 1, 2].map(function () { var a = new Audio('assets/key-hover.mp3?v=2'); a.preload = 'auto'; a.volume = 0.55; return a; });
      var a = pool[pi++ % pool.length]; a.currentTime = 0; var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
    } catch (e) { /* audio unavailable */ }
  };
})();
