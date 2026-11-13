/* ============================================================
   Corkboard "Where to next?" — keyrings hanging on hooks.
   Each ring is a pendulum: drag to swing, release to let it
   settle. Board tilts in 3D with the pointer (parallax).
   ============================================================ */
(function () {

const ITEMS = [
  { label: 'About', blurb: 'Who I am beyond the résumé.', page: 'About', fob: '#b9a48c', pin: '#b8574f', art: 'charm', left: 67, drop: 2, tilt: -7, nLeft: 27, nDrop: 1 },
  { label: 'Education', blurb: 'NYU Steinhardt, and where it started.', page: 'Education', fob: '#9aa89c', pin: '#4f7d78', art: 'nyu', left: 88.5, drop: 2, tilt: 5, nLeft: 73, nDrop: 4 },
  { label: 'Experiences', blurb: 'Internships, leadership, creative work.', page: 'Experiences', fob: '#c0968f', pin: '#c8973f', art: 'card', left: 67, drop: 50, tilt: -4, nLeft: 27, nDrop: 50 },
  { label: 'Portfolio', blurb: 'Documentaries, design, and code.', page: 'Portfolio', fob: '#9d9bb0', pin: '#5a5f8c', art: 'folder', left: 88.5, drop: 50, tilt: 8, nLeft: 73, nDrop: 58 }
];

const RING = 52;      /* outer ring diameter */
const ARM = 140;      /* pivot -> centre of mass, drives pendulum period */

/* the gold pin is one offscreen 3D render, reused by every hook */
function usePinSprite() {
  const [url, setUrl] = React.useState(() => window.KXPinSprite || null);
  React.useEffect(() => {
    if (url) return;
    const on = () => setUrl(window.KXPinSprite || null);
    window.addEventListener('kx-pin-ready', on);
    return () => window.removeEventListener('kx-pin-ready', on);
  }, [url]);
  return url;
}

/* the NYU acrylic fob is its own offscreen render, hung on the Education hook */
function useNyuSprite() {
  const [art, setArt] = React.useState(() => window.KXAcrylicCharm || null);
  React.useEffect(() => {
    const on = () => setArt(window.KXAcrylicCharm || null);
    window.addEventListener('kx-acrylic-charm-ready', on);
    return () => window.removeEventListener('kx-acrylic-charm-ready', on);
  }, [art]);
  return art;
}

/* the same offscreen-sprite arrangement for the stamped metal About charm */
function useSprite(key, event) {
  const [art, setArt] = React.useState(() => window[key] || null);
  React.useEffect(() => {
    /* stays subscribed: the charms re-render their engraved tag on a language
       switch and fire the same ready event again */
    const on = () => setArt(window[key] || null);
    window.addEventListener(event, on);
    return () => window.removeEventListener(event, on);
  }, [key, event]);
  return art;
}

function Keyring({ idx, item, narrow, onOpen, reduce, pinUrl, nyu, charm, folder, card }) {
  const swingRef = React.useRef(null);
  const stateRef = React.useRef({ a: item.tilt, v: 0, drag: false, lastX: 0, moved: 0, seed: Math.random() * 6.28, nudgeAt: 0 });
  const [hover, setHover] = React.useState(false);
  const art = item.art === 'nyu' ? nyu : item.art === 'charm' ? charm : item.art === 'folder' ? folder : item.art === 'card' ? card : null;

  React.useEffect(() => {
    if (reduce) {
      if (swingRef.current) swingRef.current.style.transform = `rotate(${item.tilt}deg)`;
      return;
    }
    let raf = 0, prev = performance.now();
    const s = stateRef.current;
    const tick = (now) => {
      const dt = Math.min(0.032, (now - prev) / 1e3); prev = now;
      if (!s.drag) {
        /* pendulum + faint ambient air */
        const g = 1500 / ARM;
        const breeze = Math.sin(now / 1000 + s.seed) * 0.9 + Math.sin(now / 2300 + s.seed * 2) * 0.5;
        const acc = -g * Math.sin(s.a * Math.PI / 180) * 57.3 - s.v * 1.35 + breeze;
        s.v += acc * dt;
        s.a += s.v * dt;
        /* tweak: staggered nudge so each charm swings in turn and reads as touchable */
        if (document.documentElement.dataset.cbSwing === 'on' && !hover) {
          if (!s.nudgeAt) s.nudgeAt = now + 3000 + idx * 4000;
          if (now >= s.nudgeAt) { s.v += 34; s.nudgeAt = now + 16000; }
        } else s.nudgeAt = 0;
      }
      const el = swingRef.current;
      if (el) {
        const lift = hover ? (document.documentElement.dataset.cbHover === 'on' ? -9 : -3) : 0;
        el.style.transform = `translateY(${lift}px) rotate(${s.a.toFixed(3)}deg) rotateY(${(s.v * 0.09).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover, reduce, item.tilt]);

  /* Drag maps horizontal pointer travel straight onto the swing angle: right
     drag = positive rotation, always. The earlier pivot-bearing version got
     its origin from mixed transformed/untransformed coordinates, so on some
     fobs the sign flipped and the charm swung away from the hand. */
  const onDown = (e) => {
    const s = stateRef.current;
    s.drag = true; s.moved = 0; s.lastX = e.clientX; s.v = 0;
    s.startX = e.clientX; s.startA = s.a;
    s.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    const s = stateRef.current;
    if (!s.drag) return;
    s.moved += Math.abs(e.clientX - s.lastX); s.lastX = e.clientX;
    /* origin is at the hook and the fob hangs below it, so a positive CSS
       rotation carries the fob LEFT — invert the pointer delta */
    const next = Math.max(-46, Math.min(46, s.startA + (s.startX - e.clientX) * 0.3));
    const now = performance.now();
    const dt = Math.max(0.008, (now - s.lastT) / 1e3); s.lastT = now;
    s.v = (next - s.a) / dt * 0.4;     /* carries into the release swing */
    s.a = next;
  };
  const onUp = (e) => {
    const s = stateRef.current;
    if (!s.drag) return;
    s.drag = false;
    if (s.moved < 5) { s.v += 26; onOpen(); }
    try {e.currentTarget.releasePointerCapture(e.pointerId);} catch (err) {/* already released */}
  };

  return (
    <div className="kx-cb-item" style={{ left: (narrow ? item.nLeft : item.left) + '%', top: (narrow ? item.nDrop : item.drop) + '%' }}>
      <div className={'kx-cb-pin' + (pinUrl ? ' is-3d' : '')} aria-hidden="true"
        style={pinUrl ? { backgroundImage: `url(${pinUrl})` } : { '--pin': item.pin }}></div>
      {art ? <span className="kx-cb-glow" aria-hidden="true" style={{ left: `calc(50% - ${art.w * 0.8}px)`, top: 14 + art.top - art.h * 0.15 + 'px', width: art.w * 1.6 + 'px', height: art.h * 1.3 + 'px' }}></span> : null}
      <div ref={swingRef} className={'kx-cb-swing' + (hover ? ' is-hover' : '')}
        role="button" tabIndex={0} aria-label={item.label}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onMouseEnter={() => { setHover(true); if (window.KXKeyJingle) window.KXKeyJingle(); }} onMouseLeave={() => setHover(false)}
        onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); onOpen();}}}
        style={{ transform: `rotate(${item.tilt}deg)` }}>
        {art ? (
          <span className="kx-cb-art" aria-hidden="true"
            style={{ left: -art.w / 2 + 'px', top: art.top + 'px', width: art.w + 'px', height: art.h + 'px',
              backgroundImage: `url(${art.url})` }}></span>
        ) : (
          <React.Fragment>
            <span className="kx-cb-ring" aria-hidden="true"></span>
            <span className="kx-cb-link" aria-hidden="true"></span>
            <span className="kx-cb-fob" style={{ '--fob': item.fob }}>
              <span className="kx-cb-hole" aria-hidden="true"></span>
              <span className="kx-cb-label">{item.label}</span>
              <span className="kx-cb-blurb">{item.blurb}</span>
            </span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function Corkboard({ setPage }) {
  const boardRef = React.useRef(null);
  const glRef = React.useRef(null);
  /* the wood-framed cork board is a real 3D render, locked head-on so it maps
     1:1 onto its frame — nothing about it is interactive */
  React.useEffect(() => {
    let stop = false;
    const go = () => {
      if (stop || !glRef.current || glRef.current.childElementCount) return;
      if (typeof window.KXCork3D !== 'function') return;
      try {window.KXCork3D(glRef.current);} catch (err) {/* WebGL unavailable: CSS fallback shows */}
    };
    go();
    window.addEventListener('kx-cork3d-ready', go);
    return () => {stop = true; window.removeEventListener('kx-cork3d-ready', go);};
  }, []);
  const [narrow, setNarrow] = React.useState(
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width:860px)').matches : false);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(max-width:860px)');
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const reduce = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pinUrl = usePinSprite();
  const nyu = useNyuSprite();
  const charm = useSprite('KXMemojiCharm', 'kx-memoji-charm-ready');
  const folder = useSprite('KXClapperCharm', 'kx-clapper-charm-ready');
  const card = useSprite('KXCameraCharm', 'kx-camera-charm-ready');

  return (
    <div className="kx-cb-stage">
      <div ref={boardRef} className="kx-cb-board">
        <div ref={glRef} className="kx-cb-3d" aria-hidden="true"></div>
        <div className="kx-cb-cork">
          {window.KXCorkDeco ? React.createElement(window.KXCorkDeco) : null}
          {ITEMS.map((it, i) => (
            <Keyring key={it.page} idx={i} item={it} narrow={narrow} reduce={reduce} pinUrl={pinUrl} nyu={nyu} charm={charm} folder={folder} card={card} onOpen={() => setPage(it.page)} />
          ))}
        </div>
      </div>
    </div>
  );
}

window.KXCorkboard = Corkboard;
})();
