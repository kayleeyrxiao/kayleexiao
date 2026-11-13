/* ============================================================
   Kaylee Xiao — sparkling cursor trail + magnetic hover.
   1. CursorFX: a trail of tiny white/low-saturation star sparkles
      that pop as the pointer moves and fade away.
   2. Magnetic: wraps a button/card so it gently pulls toward the
      pointer on hover — desktop/pointer-fine only, no-op elsewhere.
   ============================================================ */
(function () {
const { useRef, useEffect, useState } = React;

const STAR_PATH = "M12 0c.3 4.6 1.8 8 3.4 9.6C17 11.2 20.4 12.7 24 13c-3.6.3-7 1.8-8.6 3.4C13.8 18 12.3 21.4 12 25" +
  "c-.3-3.6-1.8-7-3.4-8.6C7 14.8 3.6 13.3 0 13c3.6-.3 7-1.8 8.6-3.4C10.2 8 11.7 4.6 12 0z";
const SPARK_COLORS = ['#FFFFFF', '#F5F2FA', '#E8E4EF', '#EDE6F2'];

/* one trail character everywhere: the star sparkle */
const TRAILS = { Home: { path: STAR_PATH, colors: SPARK_COLORS } };

let idSeq = 0;

function CursorFX({ page }) {
  const raf = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const lastSpawn = useRef(0);
  const [sparks, setSparks] = useState([]);
  const trail = TRAILS[page] || TRAILS.Home;
  const trailRef = useRef(trail);
  trailRef.current = trail;
  const fine = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  useEffect(() => {
    if (!fine) return;
    const move = e => {
      target.current = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      if (now - lastSpawn.current > 55) {
        lastSpawn.current = now;
        const id = ++idSeq;
        const tr = trailRef.current;
        const spark = {
          id,
          path: tr.path,
          x: e.clientX + (Math.random() * 18 - 9),
          y: e.clientY + (Math.random() * 18 - 9),
          size: 8 + Math.random() * 10,
          rotate: Math.random() * 360,
          color: tr.colors[Math.floor(Math.random() * tr.colors.length)],
          drift: (Math.random() * 24 - 12),
        };
        setSparks(s => (s.length > 22 ? s.slice(-22) : s).concat(spark));
        setTimeout(() => setSparks(s => s.filter(p => p.id !== id)), 700);
      }
    };
    document.addEventListener('mousemove', move, { passive: true });
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22;
      current.current.y += (target.current.y - current.current.y) * 0.22;
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <style>{`
        @keyframes kx-spark-pop {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(.2) rotate(var(--kx-rot)); }
          25%  { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(var(--kx-rot)); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--kx-drift)),-160%) scale(.5) rotate(var(--kx-rot)); }
        }
      `}</style>
      {sparks.map(s => (
        <svg key={s.id} width={s.size} height={s.size} viewBox="0 0 24 24" aria-hidden="true" style={{
          position: 'fixed', top: s.y, left: s.x, zIndex: 9998, pointerEvents: 'none',
          '--kx-rot': `${s.rotate}deg`, '--kx-drift': `${s.drift}px`,
          animation: 'kx-spark-pop .7s ease-out forwards',
          filter: `drop-shadow(0 0 3px ${s.color})` }}>
          <path d={s.path || STAR_PATH} fill={s.color} />
        </svg>
      ))}
    </>
  );
}

/* click burst: sparkles fly out from where you clicked a button/link */
function ClickBurst() {
  const [bursts, setBursts] = useState([]);
  useEffect(() => {
    const onClick = e => {
      const hit = e.target.closest('button, a, [role="button"]');
      if (!hit) return;
      const id = ++idSeq;
      const parts = Array.from({ length: 9 }, (_, i) => {
        const ang = (Math.PI * 2 * i) / 9 + Math.random() * .5;
        const dist = 34 + Math.random() * 34;
        return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist,
          size: 7 + Math.random() * 9, rotate: Math.random() * 360,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)] };
      });
      setBursts(b => b.concat({ id, x: e.clientX, y: e.clientY, parts }));
      setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 700);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
    <>
      <style>{`@keyframes kx-burst{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(var(--kx-rot))}20%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(var(--kx-rot))}100%{opacity:0;transform:translate(calc(-50% + var(--kx-dx)),calc(-50% + var(--kx-dy))) scale(.35) rotate(var(--kx-rot))}}
      button,[role="button"]{transition:transform .12s cubic-bezier(.22,.61,.36,1)}
      button:active,[role="button"]:active{transform:scale(.94)}`}</style>
      {bursts.map(b => b.parts.map((p, i) => (
        <svg key={b.id + '-' + i} width={p.size} height={p.size} viewBox="0 0 24 24" aria-hidden="true" style={{
          position: 'fixed', top: b.y, left: b.x, zIndex: 9999, pointerEvents: 'none',
          '--kx-rot': `${p.rotate}deg`, '--kx-dx': `${p.dx}px`, '--kx-dy': `${p.dy}px`,
          animation: 'kx-burst .65s cubic-bezier(.22,.61,.36,1) forwards',
          filter: `drop-shadow(0 0 3px ${p.color})` }}>
          <path d={STAR_PATH} fill={p.color} />
        </svg>
      )))}
    </>
  );
}

/* wraps children in a div that nudges toward the pointer on hover */
function Magnetic({ children, strength = 16, style }) {
  const ref = useRef(null);
  const fine = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const onMove = e => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ref.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div ref={ref} className="kx-magnetic" onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display: 'inline-block', transition: 'transform .35s cubic-bezier(.22,.61,.36,1)', ...style }}>
      {children}
    </div>
  );
}

Object.assign(window, { KXCursorFX: CursorFX, KXMagnetic: Magnetic, KXClickBurst: ClickBurst });
})();
