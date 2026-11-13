/* ============================================================
   Experience reel — a View-Master style die-cut disc that spins
   with a record's weight. Twelve windows, four of them live; the
   window that lands at 3 o'clock is the one the panel reads out.
   Only the right half of the reel is on the page — the rest runs
   off the left edge, the way a reel sits in a viewer.
   ============================================================ */
(function () {
const { useState, useRef, useEffect } = React;
const Tag = (props) => React.createElement(window.KXTag, props);

const N = 8, STEP = 360 / N;
/* wedge geometry, in the card's own 200-unit box: each window is a straight-edged
   trapezoid running from R1 out to R2, HALF degrees either side of its spoke */
const R1 = 42, R2 = 88, HALF = 15;
const wrap = (d) => ((d % 360) + 540) % 360 - 180;

const REEL_CSS = `
/* full-bleed row: the band's centred column would clip the disc 40px inside the
   page, so the row breaks out to the viewport and the reel runs off the edge.
   Clipping moves up to the section itself, so the disc is only ever cut by the
   section's own top, bottom and left edges — never by a box inside it. */
.kx-fullscreen-sec:has(.kx-reel){overflow:hidden}
.kx-reel{--reel-d:clamp(620px,116vh,1240px);width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);padding-right:clamp(24px,5vw,80px);box-sizing:border-box;display:grid;grid-template-columns:calc(var(--reel-d)*.5) minmax(300px,1fr);gap:clamp(20px,2.4vw,44px);align-items:center}
.kx-reel-half{position:relative;height:min(58vh,calc(var(--reel-d)*.58))}
.kx-reel-stage{position:absolute;top:50%;left:calc(var(--reel-d)*-.5);margin-top:calc(var(--reel-d)*-.5);width:var(--reel-d);height:var(--reel-d);touch-action:none;cursor:grab;outline:none}
.kx-reel-stage:active{cursor:grabbing}
.kx-reel-spin{position:absolute;inset:0;will-change:transform}
.kx-reel-card{position:absolute;inset:0;pointer-events:none;filter:drop-shadow(0 12px 16px rgba(62,50,40,.24)) drop-shadow(0 2px 4px rgba(62,50,40,.14))}
.kx-reel-frame{position:absolute;left:50%;top:50%;width:calc(var(--reel-d)*0.2300);height:calc(var(--reel-d)*0.2278);padding:0;border:0;background:#d9cebd;cursor:pointer;overflow:hidden;appearance:none;clip-path:polygon(0% 26.14%,100% 0%,100% 100%,0% 73.86%);transition:filter .45s ease;filter:blur(1.6px) saturate(.78) brightness(.92)}
.kx-reel-frame image-slot{width:100%;height:100%;display:block}
.kx-reel-frame::after{content:'';position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 calc(var(--reel-d)*.03) rgba(38,28,20,.4);background:radial-gradient(120% 120% at 50% 40%,transparent 42%,rgba(38,28,20,.24));transition:opacity .45s ease}
.kx-reel-frame.on{filter:none}
.kx-reel-frame.on image-slot{animation:kxReelFrameIn .7s cubic-bezier(.2,.9,.25,1) both}
@keyframes kxReelFrameIn{from{opacity:.35;transform:scale(1.06)}to{opacity:1;transform:none}}
.kx-reel-frame.on::after{opacity:0}
.kx-reel-stage:focus-visible .kx-reel-frame.on{outline:2.5px solid var(--site-selected);outline-offset:3px}
/* the reading gate: fixed at 3 o'clock, does not turn with the reel */
.kx-reel-gate{position:absolute;left:82.5%;top:50%;width:calc(var(--reel-d)*0.2750);height:calc(var(--reel-d)*0.2728);transform:translate(-50%,-50%);pointer-events:none}
.kx-reel-gate i{position:absolute;width:calc(var(--reel-d)*.03);height:calc(var(--reel-d)*.03);border:2px solid var(--site-selected);opacity:.9}
.kx-reel-gate i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0}
.kx-reel-gate i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0}
.kx-reel-gate i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0}
.kx-reel-gate i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0}
/* panel */
.kx-reel-panel{max-width:620px}
.kx-reel:not(.kx-seen) .kx-reel-panel>*,.kx-reel:not(.kx-seen) .kx-reel-panel li{animation-play-state:paused}
.kx-reel-half{transform-origin:0 50%;transition:opacity 1s ease,transform 1.1s cubic-bezier(.16,.84,.3,1)}
.kx-reel:not(.kx-seen) .kx-reel-half{opacity:0;transform:translateX(-60px) rotate(-8deg)}
.kx-reel-panel>:not(ul){animation:kxReelLine .75s cubic-bezier(.16,.84,.3,1) both}
.kx-reel-panel>.kx-reel-count{animation-delay:0ms}.kx-reel-panel>.kx-reel-dates{animation-delay:70ms}.kx-reel-panel>.kx-reel-loc{animation-delay:120ms}.kx-reel-panel>.kx-reel-role{animation-delay:170ms}.kx-reel-panel>.kx-reel-org{animation-delay:240ms}.kx-reel-panel>.kx-reel-tags,.kx-reel-panel>.kx-reel-hint{animation-delay:var(--tail,700ms)}
.kx-reel-count{font-family:ui-monospace,"SFMono-Regular","Courier New",monospace;font-size:12px;letter-spacing:.14em;color:color-mix(in srgb,var(--site-text) 52%,transparent)}
.kx-reel-dates{font-family:var(--site-body);font-weight:900;font-size:17px;color:var(--site-selected);margin-top:14px}
.kx-reel-loc{font-family:var(--site-body);font-size:15px;color:var(--site-link);margin-top:3px}
.kx-reel-role{margin:12px 0 0;font-family:var(--site-heading);font-size:clamp(26px,3vw,40px);line-height:1.06;color:var(--site-text)}
.kx-reel-org{font-family:var(--site-body);font-weight:900;font-size:18px;color:var(--site-text);opacity:.8;margin-top:7px}
.kx-reel-panel ul{margin:22px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:10px}
.kx-reel-panel li{font-family:var(--site-body);font-size:17px;line-height:1.55;color:var(--site-text);text-wrap:pretty;opacity:0;animation:kxReelLine .75s cubic-bezier(.16,.84,.3,1) both}
@keyframes kxReelLine{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}
@keyframes kxReelFade{from{opacity:0}to{opacity:1}}
.kx-reel-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.kx-reel-hint{font-family:var(--site-body);font-size:13px;color:var(--site-link);margin-top:22px}
@media (max-width:920px){
  .kx-reel{--reel-d:min(170vw,700px);grid-template-columns:1fr;gap:26px;padding-right:clamp(20px,6vw,40px);padding-left:clamp(20px,6vw,40px)}
  .kx-reel-half{height:calc(var(--reel-d)*.5)}
  .kx-reel-stage{left:calc(var(--reel-d)*-.5);top:50%;margin-top:calc(var(--reel-d)*-.5)}
}
@media (prefers-reduced-motion:reduce){
  .kx-reel-panel li,.kx-reel-panel>:not(ul){animation-name:kxReelFade;animation-duration:.5s}
  .kx-reel-frame.on image-slot{animation-duration:.01ms}
  .kx-reel-frame{filter:none}
}`;

/* the reel body: one circle with the windows, notches and hub punched out of
   it, so an empty die-cut really shows the page behind */
function ReelCard({ live }) {
  const cut = [];
  /* the hole runs a hair inside the photo behind it, so no seam shows */
  const wedge = (r1, r2, half) => {
    const t = (r, d) => {
      const a = d * Math.PI / 180;
      return r * Math.cos(a) + ' ' + r * Math.sin(a);
    };
    return 'M' + t(r1, -half) + ' L' + t(r2, -half) + ' L' + t(r2, half) + ' L' + t(r1, half) + ' Z';
  };
  for (let i = 0; i < N; i++) {
    cut.push(<path key={'w' + i} d={wedge(R1 + 1, R2 - 1, HALF - 0.55)}
      transform={'rotate(' + i * STEP + ')'} fill="#000" />);
    cut.push(<rect key={'n' + i} x="-4.5" y="-2.6" width="9" height="5.2" rx="1.5"
      transform={'rotate(' + (i * STEP + STEP / 2) + ') translate(94,0)'} fill="#000" />);
  }
  return (
    <svg className="kx-reel-card" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <mask id="kxReelMask">
          <circle cx="0" cy="0" r="100" fill="#fff" />
          {cut}
          <circle cx="0" cy="0" r="5.4" fill="#000" />
        </mask>
        <filter id="kxReelGrain">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <radialGradient id="kxReelShade" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".5" />
          <stop offset="58%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2e24" stopOpacity=".3" />
        </radialGradient>
      </defs>
      <g mask="url(#kxReelMask)">
        <circle cx="0" cy="0" r="100" fill="color-mix(in srgb, var(--site-container) 78%, #fff)" />
        <circle cx="0" cy="0" r="100" fill="url(#kxReelShade)" />
        <circle cx="0" cy="0" r="100" filter="url(#kxReelGrain)" opacity=".2" style={{ mixBlendMode: 'multiply' }} />
        <circle cx="0" cy="0" r="93" fill="none" stroke="rgba(74,58,44,.16)" strokeWidth=".7" />
        <circle cx="0" cy="0" r="37" fill="none" stroke="rgba(74,58,44,.13)" strokeWidth=".7" />
        <circle cx="0" cy="0" r="10.5" fill="none" stroke="rgba(74,58,44,.22)" strokeWidth="1.1" />
        {live.map((s) =>
        <text key={s.slot} x="0" y="0" textAnchor="middle" fontSize="6.4" fill="rgba(74,58,44,.5)"
          fontFamily="ui-monospace, monospace" letterSpacing="1.4"
          transform={'rotate(' + s.slot * STEP + ') translate(28,2.2)'}>{s.no}</text>
        )}
      </g>
    </svg>);

}

function ExperienceReel({ items }) {
  const live = items.map((it, i) => ({ item: it, slot: Math.round(i * N / items.length),
    no: String(i + 1).padStart(2, '0') }));
  const [active, setActive] = useState(0);
  const stage = useRef(null), spin = useRef(null), activeRef = useRef(0);
  const rot = useRef(0), vel = useRef(0), target = useRef(null), slow = useRef(false);
  const drag = useRef(null), touched = useRef(performance.now());

  const angleOf = (i) => live[i].slot * STEP;
  const nearest = (r) => {
    let best = 0, bd = 1e9;
    live.forEach((l, i) => {const d = Math.abs(wrap(r + l.slot * STEP));if (d < bd) {bd = d;best = i;}});
    return best;
  };
  const aim = (i, gentle) => {
    const base = -angleOf(i);
    target.current = base + Math.round((rot.current - base) / 360) * 360;
    slow.current = !!gentle;
    vel.current = 0;
  };
  const step = (dir) => {
    touched.current = performance.now();
    aim((activeRef.current + dir + live.length) % live.length, false);
  };

  useEffect(() => {
    let raf, prev = performance.now();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = (now) => {
      const dt = Math.min(50, now - prev);prev = now;
      if (!drag.current) {
        if (target.current == null) {
          /* free spin: the reel carries its own weight, then settles */
          vel.current *= Math.pow(0.955, dt / 16.7);
          rot.current += vel.current * (dt / 16.7);
          if (Math.abs(vel.current) < 0.09) aim(nearest(rot.current), false);
        } else {
          const k = 1 - Math.pow(slow.current ? 0.985 : 0.87, dt / 16.7);
          rot.current += (target.current - rot.current) * k;
          if (Math.abs(target.current - rot.current) < 0.04) {
            rot.current = target.current;target.current = null;slow.current = false;
          }
        }
        /* idle: after a pause it turns on by itself, slowly */
        if (!reduce && target.current == null && now - touched.current > 9000) {
          touched.current = now;
          aim((activeRef.current + 1) % live.length, true);
        }
      }
      const a = nearest(rot.current);
      if (a !== activeRef.current) {
        activeRef.current = a;setActive(a);
        if (window.KXPolaroidSound) window.KXPolaroidSound('clack', 0.5);
      }
      /* a heavy disc never runs perfectly true */
      const sway = reduce ? 0 : Math.sin(now / 1500) * 0.45;
      const wob = reduce ? 1 : 1 - 0.0035 * (1 + Math.sin(now / 1900));
      if (spin.current) spin.current.style.transform =
      'rotate(' + (rot.current + sway) + 'deg) scaleY(' + wob + ')';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  const angleAt = (e) => {
    const r = stage.current.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  const onDown = (e) => {
    if (e.button) return;
    stage.current.setPointerCapture(e.pointerId);
    drag.current = { a: angleAt(e), moved: 0 };
    target.current = null;vel.current = 0;touched.current = performance.now();
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const a = angleAt(e), d = wrap(a - drag.current.a);
    drag.current.a = a;drag.current.moved += Math.abs(d);
    rot.current += d;
    vel.current = vel.current * 0.55 + d * 0.45;
  };
  const onUp = (e) => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;touched.current = performance.now();
    try {stage.current.releasePointerCapture(e.pointerId);} catch (err) {}
    if (moved < 3) {vel.current = 0;aim(nearest(rot.current), false);}
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {e.preventDefault();step(1);}
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {e.preventDefault();step(-1);}
  };
  const cur = live[active].item;
  const root = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || !window.IntersectionObserver) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setSeen(true); touched.current = performance.now(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <style>{REEL_CSS}</style>
      <div className={'kx-reel' + (seen ? ' kx-seen' : '')} ref={root}>
        <div className="kx-reel-half">
          <div className="kx-reel-stage" ref={stage} tabIndex="0" role="listbox"
            aria-label="Experience reel — drag to turn"
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}>
            <div className="kx-reel-spin" ref={spin}>
              {live.map((l, i) =>
              <button key={l.item.id} className={'kx-reel-frame' + (i === active ? ' on' : '')}
                role="option" aria-selected={i === active} title={l.item.role}
                style={{ transform: 'translate(-50%,-50%) rotate(' + l.slot * STEP +
                  'deg) translateX(calc(var(--reel-d) * 0.3250))' }}
                onClick={() => {touched.current = performance.now();aim(i, false);}}>
                <image-slot id={'exp-' + l.item.id} shape="rect" placeholder="Drop a photo"></image-slot>
              </button>
              )}
              <ReelCard live={live} />
            </div>
            <div className="kx-reel-gate" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
        <div className="kx-reel-panel" key={cur.id} style={{ '--tail': 340 + cur.points.length * 140 + 'ms' }}>
          <div className="kx-reel-count">{live[active].no} / {String(live.length).padStart(2, '0')}</div>
          <div className="kx-reel-dates">{cur.dates}</div>
          {cur.location && <div className="kx-reel-loc">{cur.location}</div>}
          <h4 className="kx-reel-role">{cur.role}</h4>
          <div className="kx-reel-org">{cur.org}</div>
          <ul>
            {cur.points.map((pt, i) =>
            <li key={i} style={{ animationDelay: 320 + i * 140 + 'ms' }}>{pt}</li>
            )}
          </ul>
          {cur.tags && <div className="kx-reel-tags">{cur.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
          <div className="kx-reel-hint">Drag the reel, or click a window to bring it into the gate.</div>
        </div>
      </div>
    </>);

}

Object.assign(window, { KXExperienceReel: ExperienceReel });
})();
