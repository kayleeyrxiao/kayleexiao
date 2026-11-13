/* ============================================================
   Kaylee Xiao — portfolio site, shared chrome + helpers.
   Built on the Kaylee Xiao Design System components.
   Exports building blocks to window for the pages + app files.
   ============================================================ */

const DS = window.KayleeXiaoDesignSystem_fb95c0;
const { SiteButton, Field, ThemeToggle, Icon } = DS;

const IMG = 'assets/images/';
const ILL = 'assets/illustrations/';

const NAV = ['About', 'Education', 'Experiences', 'Portfolio', 'Contact'];

/* ---------- typographic helpers ---------- */
const Kicker = ({ children }) =>
<div className="kx-kicker" style={{
  fontFamily: 'var(--site-nav)', fontSize: 18, letterSpacing: '.18em',
  textTransform: 'uppercase', color: 'var(--site-selected)', marginBottom: 14
}}>{children}</div>;

const H3 = ({ children, style }) =>
<h3 style={{ margin: '0 0 .35em', fontFamily: 'var(--site-heading)', fontSize: 'clamp(30px,4.4vw,46px)',
  lineHeight: 1.05, color: 'var(--site-text)', ...style }}>{children}</h3>;

const H4 = ({ children, style }) =>
<h4 style={{ margin: '1em 0 .2em', fontFamily: 'var(--site-body)', fontWeight: 900,
  fontSize: 22, color: 'var(--site-text)', ...style }}>{children}</h4>;

const P = ({ children, style }) =>
<p style={{ fontFamily: 'var(--site-body)', fontSize: 19, lineHeight: 1.6,
  color: 'var(--site-text)', maxWidth: 560, margin: '0 0 .8em', textWrap: 'pretty', ...style }}>{children}</p>;

const U = ({ children, plain }) =>
<span style={{ textDecoration: 'underline', textDecorationColor: 'var(--site-selected)',
  textDecorationThickness: 2, textUnderlineOffset: 3, fontWeight: 'inherit' }}>{children}</span>;

/* project write-ups mark emphasis inline: ==highlight== and __underline__.
   Portfolio copy carries emphasis at body weight — the mark alone does the work. */
const EMPH_RE = /(==[^=]+==|__[^_]+__)/g;
const renderEmph = (text) => {
  if (typeof text !== 'string' || !(text.includes('==') || text.includes('__'))) return text;
  return text.split(EMPH_RE).filter((s) => s !== '').map((s, i) => {
    if (s.startsWith('==') && s.endsWith('==')) return <HL key={i} plain>{s.slice(2, -2)}</HL>;
    if (s.startsWith('__') && s.endsWith('__')) return <U key={i} plain>{s.slice(2, -2)}</U>;
    return s;
  });
};
const HL = ({ children, plain }) =>
<span style={{ background: 'var(--site-highlight)', fontWeight: 'inherit', padding: '0 .15em',
  borderRadius: 2, color: '#3a2f29' }}>{children}</span>;


/* ---------- header / nav (menu top-right) ---------- */
function Header({ page, setPage, open, setOpen }) {
  const ref = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [lang, setLang] = React.useState(() => window.KXGetLang ? window.KXGetLang() : 'en');
  React.useEffect(() => {
    const on = (e) => setLang(e.detail);
    window.addEventListener('kx-lang-change', on);
    return () => window.removeEventListener('kx-lang-change', on);
  }, []);
  const openRef = React.useRef(open);
  openRef.current = open;
  React.useEffect(() => {
    const el = ref.current;if (!el) return;
    /* --kx-header-h is read by page layout, so writing it inside the observer
       callback mutates layout during delivery and the resulting resize is
       reported undelivered. Measure in the callback, write on the next frame. */
    let last = -1, raf = 0;
    const set = () => {
      /* the open menu overlays the page; its own negative margin tracks the live
         height, but the page-layout variable keeps the closed height */
      const h = el.offsetHeight;
      el.style.setProperty('--kx-header-live', h + 'px');
      if (openRef.current) return;
      if (h === last) return;
      last = h;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        document.documentElement.style.setProperty('--kx-header-h', last + 'px');
      });
    };
    set();
    const ro = new ResizeObserver(set);ro.observe(el);
    window.addEventListener('resize', set);
    return () => {if (raf) cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener('resize', set);};
  }, []);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const bar = scrolled || open;
  return (
    <header ref={ref} className="kx-header" style={{
      position: 'sticky', top: 0, zIndex: 30,
      marginBottom: 'calc(-1 * var(--kx-header-live, var(--kx-header-h, 64px)))',
      backgroundColor: scrolled || open ? 'color-mix(in srgb, var(--site-cover-bg) 80%, transparent)' : 'transparent',
      backdropFilter: scrolled || open ? 'saturate(1.1) blur(10px)' : 'none',
      WebkitBackdropFilter: scrolled || open ? 'saturate(1.1) blur(10px)' : 'none',
      boxShadow: scrolled ? '0 4px 18px rgba(0,0,0,.10)' : 'none',
      borderBottom: bar ? '1px solid color-mix(in srgb, var(--site-text) 12%, transparent)' :
      '1px solid transparent',
      transition: 'background-color .3s ease, box-shadow .3s ease, border-color .3s ease',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 30px'
    }}>
      <button onClick={() => setOpen(!open)} className="kx-burger" aria-label="Menu" style={{
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--site-icon)', display: 'none' }}>
        <Icon name={open ? 'close' : 'menu'} size={30} />
      </button>

      <a onClick={() => {setPage('Home');setOpen(false);}} style={{
        cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--site-wordmark)',
        fontSize: 30, color: 'var(--site-text)', letterSpacing: '.01em', lineHeight: 1 }}>Kaylee Xiao</a>

      <nav className="kx-nav" data-open={open} style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {NAV.map((n) =>
        <a key={n} data-active={n === page ? 'true' : 'false'} onClick={() => {setPage(n);setOpen(false);}} style={{
          cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--site-nav)', fontSize: 20,
          padding: '6px 4px', color: n === page ? 'var(--site-selected)' : 'var(--site-text)',
          borderBottom: n === page ? '2px solid var(--site-selected)' : '2px solid transparent'
        }}
        onMouseOver={(e) => {if (n !== page) e.currentTarget.style.color = 'var(--site-link)';}}
        onMouseOut={(e) => {if (n !== page) e.currentTarget.style.color = 'var(--site-text)';}}>
          {n}</a>
        )}
      </nav>
    </header>);

}

/* ---------- hero image that eases in once loaded ---------- */
function HeroImg({ src, alt, className, baseTransform, style }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    setShown(false);
    const el = ref.current;
    if (el && el.complete && el.naturalWidth) {const r = requestAnimationFrame(() => setShown(true));return () => cancelAnimationFrame(r);}
  }, [src]);
  return (
    <img ref={ref} src={src} alt={alt} className={className} decoding="async" fetchpriority="high"
    onLoad={() => setShown(true)}
    style={{ ...style, opacity: shown ? 1 : 0,
      transform: (baseTransform || '').trim() || undefined,
      transition: 'opacity .75s cubic-bezier(.22,.61,.36,1)' }} />);

}

/* ---------- subpage cover band ----------
   layered:  portrait overlaps the big title (home-style hero)
   slotId:   render a user-fillable <image-slot> instead of a fixed <img> */
/* split a title into hoverable letters — each one sharpens on hover */
function Letters({ text }) {
  return String(text).split('\n').map((line, li) => (
    <React.Fragment key={li}>
      {li > 0 ? <br/> : null}
      {Array.prototype.map.call(line, (ch, i) => (
        ch === ' ' ? <span key={i}>{'\u00a0'}</span>
          : <span key={i} className="kx-ltr" onMouseEnter={() => window.KXLetterSound && window.KXLetterSound(i)}>{ch}</span>
      ))}
    </React.Fragment>
  ));
}

function Cover({ title, img, sub, layered, slotId, slotPlaceholder, big, imgHeight, imgLeft, imgAnchor }) {
  const pH = imgHeight || '92%',pL = imgLeft || '50%',pT = 'translateX(-' + (imgAnchor || 50) + '%)';
  if (layered) {
    const media = slotId ?
    <image-slot id={slotId} src={img} shape="rect" className="kx-hero-portrait"
    placeholder={slotPlaceholder || 'Drop your photo here'}
    style={{ position: 'absolute', bottom: 0, left: pL, transform: pT,
      zIndex: 2, display: 'block', height: pH, width: 'auto', maxWidth: '96vw' }}></image-slot> :
    <HeroImg src={img} alt={title} className="kx-hero-portrait" baseTransform={pT}
    style={{ position: 'absolute', bottom: 0, left: pL,
      zIndex: 2, height: pH, width: 'auto', maxWidth: 'none',
      objectFit: 'contain', objectPosition: 'bottom' }} />;
    return (
      <React.Fragment>
      <div className="kx-stack-sec" style={{ position: 'sticky', top: 0,
          height: '100dvh',
          minHeight: 460, background: 'var(--site-cover-bg)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Stars />
        <h2 data-no-i18n className="kx-hero-name" style={{ position: 'absolute', zIndex: 1, margin: 0, fontFamily: 'var(--site-display)',
            fontSize: 'clamp(64px,15vw,180px)', letterSpacing: '.05em', color: 'var(--site-text)',
            textAlign: 'center', lineHeight: .9, top: '50%', transform: 'translateY(-50%)', width: '100%' }}><Letters text={title} /></h2>
        {img && media}
        {sub && <p style={{ position: 'absolute', bottom: 24, zIndex: 3, fontFamily: 'var(--site-body)',
            fontSize: 18, color: 'var(--site-text)', maxWidth: 600, textAlign: 'center',
            padding: '0 20px' }}>{sub}</p>}
      </div>
      <Marquee label={title} />
      </React.Fragment>);

  }
  return (
    <div style={{ position: 'relative', minHeight: 360, background: 'var(--site-cover-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '60px 20px' }}>
      <Stars />
      <h2 data-no-i18n style={{ position: 'relative', zIndex: 1, margin: 0, fontFamily: 'var(--site-display)',
        fontSize: 'clamp(56px,11vw,120px)', letterSpacing: '.05em', color: 'var(--site-text)',
        textAlign: 'center', lineHeight: .92 }}><Letters text={title} /></h2>
      {img && <HeroImg src={img} alt={title} style={{ position: 'relative', zIndex: 2,
        maxHeight: 300, maxWidth: '94vw', width: 'auto', marginTop: 10 }} />}
      {sub && <p style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--site-body)', fontSize: 20,
        color: 'var(--site-text)', maxWidth: 600, textAlign: 'center', marginTop: 18 }}>{sub}</p>}
    </div>);

}

/* ---------- decorative sparkle field for hero sections ----------
   A handful of ink-drawn stars scattered around the edges of a hero: filled
   four-points, outline four-points, small crosses. Deterministic per page so
   the arrangement is stable across renders, purely decorative. */

const STAR_KINDS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18'];
const BIG_KINDS = {};

/* Scatter a handful of stars along the left and right margins of a hero, never
   across the middle where the title and portrait sit. Count, shapes, sizes,
   rotations and positions are all drawn fresh on every page load — one hero may
   be two crosses and a burst, the next a sunburst, a cluster and a spike — so
   the arrangement is new each visit but holds still while you are on the page. */
function makeStars() {
  const pick = (a, b) => a + Math.random() * (b - a);
  const any = (a) => a[Math.floor(Math.random() * a.length)];
  const total = 5 + Math.floor(Math.random() * 3);          // 5–7 stars
  const bands = [[6, 26], [34, 56], [64, 88]];
  /* build the available slots (3 bands x 2 sides), then use only some of them */
  const slots = [];
  [0, 1].forEach((side) => bands.forEach((b) => slots.push({ side: side, band: b })));
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = slots[i]; slots[i] = slots[j]; slots[j] = t;
  }
  const out = [];
  for (let i = 0; i < total; i++) {
    const slot = slots[i % slots.length];
    const kind = any(STAR_KINDS);                            // repeats allowed
    const big = BIG_KINDS[kind];
    out.push({
      x: slot.side ? pick(78, 96) : pick(4, 22),
      y: pick(slot.band[0], slot.band[1]),
      /* mixed scale: mostly mid-size with the odd tiny fleck and a big feature
         sparkle, so the field reads hand-scattered rather than uniform */
      s: (function () {
        const roll = Math.random();
        return roll < .3 ? pick(36, 46) : roll < .8 ? pick(48, 62) : pick(66, 88);
      })(),
      r: pick(-16, 16),
      k: kind,
    });
  }
  return out;
}

function Stars() {
  const list = React.useMemo(makeStars, []);
  const wrapRef = React.useRef(null);
  const fellRef = React.useRef(false);
  /* first real scroll knocks the stars loose: each one drops with gravity,
     lands on the hero's bottom edge (the marquee floor), bounces once and
     settles tipped over — like ornaments shaken off a shelf */
  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* once landed, the stars sit ON the marquee: as it rides up over the hero
       the floor line rises with it and carries the fallen stars along */
    const landed = [];
    let marquee = null;
    const floorLift = () => {
      const wrap = wrapRef.current;
      if (!wrap) return 0;
      if (!marquee) {
        const wr0 = wrap.getBoundingClientRect();
        marquee = Array.from(document.querySelectorAll('.kx-marquee'))
          .find((m) => m.getBoundingClientRect().top >= wr0.top) || null;
        if (!marquee) return 0;
      }
      const wr = wrap.getBoundingClientRect();
      return Math.max(0, wr.bottom - marquee.getBoundingClientRect().top);
    };
    const ride = () => {
      if (!landed.length) return;
      const lift = floorLift();
      landed.forEach((s) => {
        s.el.style.transform = `translate(-50%,-50%) translate(${s.dx}px,${((s.d - lift) + (s.dy || 0)).toFixed(1)}px) rotate(${s.rot}deg)`;
      });
    };
    /* landed stars can be picked up and dragged anywhere; on release gravity
       takes over again and they drop back onto the marquee edge */
    const makeDraggable = (s) => {
      const el = s.el;
      el.style.cursor = 'grab';
      el.style.touchAction = 'none';
      s.dy = 0;
      let dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0, dropRaf = null;
      el.addEventListener('pointerdown', (e) => {
        if (dropRaf !== null) { cancelAnimationFrame(dropRaf); dropRaf = null; }
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        baseX = parseFloat(s.dx);
        baseY = s.dy;
        if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
        el.style.cursor = 'grabbing';
        e.preventDefault();
      });
      el.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const wrap = wrapRef.current;
        if (!wrap) return;
        const wr = wrap.getBoundingClientRect();
        const cx = (parseFloat(el.style.left) / 100) * wr.width;
        const half = el.offsetWidth / 2;
        s.dx = Math.max(half - cx, Math.min(wr.width - half - cx, baseX + e.clientX - startX)).toFixed(1);
        /* free vertical drag, but never below the floor (dy > 0) and not above the hero top */
        const restY = (parseFloat(el.style.top) / 100) * wr.height + (s.d - floorLift());
        s.dy = Math.max(half - restY, Math.min(0, baseY + e.clientY - startY));
        ride();
      });
      const drop = () => {
        let v = 0, prev = performance.now();
        const step = (now) => {
          const dt = Math.min(0.033, (now - prev) / 1000);
          prev = now;
          v += 2600 * dt;
          s.dy += v * dt;
          if (s.dy >= 0) { s.dy = 0; dropRaf = null; } else dropRaf = requestAnimationFrame(step);
          ride();
        };
        dropRaf = requestAnimationFrame(step);
      };
      const stop = () => {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = 'grab';
        if (s.dy < 0 && dropRaf === null) drop();
      };
      el.addEventListener('pointerup', stop);
      el.addEventListener('pointercancel', stop);
    };
    const fall = () => {
      if (fellRef.current) return;
      fellRef.current = true;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      /* fallen stars sit above the section scrim so they don't fade as the
         next panel slides up — they belong to the marquee floor now */
      wrap.classList.add('kx-fallen');
      /* per-frame gravity simulation instead of a fixed keyframe animation:
         the floor line (marquee top edge) is re-read every frame, so a star
         always stops exactly on it even while the user keeps scrolling */
      const sims = [];
      wrap.querySelectorAll('.kx-star').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const rot0 = parseFloat(el.dataset.rot || '0');
        sims.push({ el, y: 0, v: 0, t: 0, done: false,
          dx: Math.random() * 44 - 22,
          rot0, rot1: rot0 + (Math.random() < 0.5 ? -1 : 1) * (55 + Math.random() * 65),
          b0: Math.max(0, wr.bottom - r.bottom - 2 - Math.random() * 6),
          delay: i * 0.07 + Math.random() * 0.22 });
      });
      const G = 2600;
      let prev = performance.now();
      const step = (now) => {
        const dt = Math.min(0.033, (now - prev) / 1000);
        prev = now;
        const lift = floorLift();
        let active = false;
        sims.forEach((s) => {
          if (s.done) return;
          s.t += dt;
          if (s.t < s.delay) { active = true; return; }
          s.v += G * dt;
          s.y += s.v * dt;
          const yMax = Math.max(0, s.b0 - lift);
          if (s.y >= yMax) { s.y = yMax; s.done = true; } else active = true;
          const p = s.b0 > 0 ? Math.min(1, s.y / s.b0) : 1;
          const rot = s.rot0 + (s.rot1 - s.rot0) * p;
          s.el.style.transform = `translate(-50%,-50%) translate(${(s.dx * p).toFixed(1)}px,${s.y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
          if (s.done) {
            const entry = { el: s.el, dx: (s.dx * p).toFixed(1), d: Math.min(s.b0, s.y + lift), rot: rot.toFixed(1) };
            landed.push(entry);
            makeDraggable(entry);
          }
        });
        if (active) rafId = requestAnimationFrame(step);
        else { rafId = null; ride(); }
      };
      rafId = requestAnimationFrame(step);
    };
    /* only a MANUAL scroll gesture knocks the stars loose — programmatic
       scrolls (back-to-top, restored positions) leave them in place */
    let manual = false;
    let rafId = null;
    const mark = () => { manual = true; };
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].indexOf(e.key) !== -1) manual = true;
    };
    const onScroll = () => {
      if (manual && window.scrollY > 30) fall();
      ride();
    };
    window.addEventListener('wheel', mark, { passive: true });
    window.addEventListener('touchmove', mark, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', mark);
      window.removeEventListener('touchmove', mark);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="kx-stars" aria-hidden="true" ref={wrapRef}>
      {list.map((st, i) => (
        <span key={i} className="kx-star" data-rot={st.r.toFixed(1)}
          onMouseEnter={() => window.KXStarChime && window.KXStarChime(i)}
          style={{ left: st.x.toFixed(1) + '%', top: st.y.toFixed(1) + '%',
            width: Math.round(st.s), height: Math.round(st.s),
            transform: 'translate(-50%,-50%) rotate(' + st.r.toFixed(1) + 'deg)',
            animationDelay: (i * 0.9).toFixed(1) + 's' }}>
          <span className="kx-star-ink"
            style={{ WebkitMaskImage: 'url(assets/sparkles/sparkle-' + st.k + '.svg)',
              maskImage: 'url(assets/sparkles/sparkle-' + st.k + '.svg)' }}></span>
        </span>
      ))}
    </div>);
}

/* ---------- floating polaroids: native port of the Framer module ----------
   two overlapping polaroid photos that flick on hover, pinned by static wooden clips */
const POLAROID_ART = {
  left: 'assets/polaroid-left.png',
  right: 'assets/polaroid-right.png',
  clip: 'https://framerusercontent.com/images/8tCz6Rx17O7tuYqsrZ0wqb5m8s.png?width=342&height=345' };
function FloatingPolaroids({ hoverIntensity = 1, leftRotation = -6, rightRotation = 4 }) {
  const root = React.useRef(null);
  const [box, setBox] = React.useState({ w: 520, h: 480 });
  const [hover, setHover] = React.useState(null);
  React.useEffect(() => {
    const el = root.current; if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); if (r.width) setBox(p => (p.w === r.width && p.h === r.height) ? p : { w: r.width, h: r.height }); };
    measure();
    let ro; if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); }
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, []);
  const w = box.w, H = box.h;
  const clipSize = Math.max(83, w < 520 ? 95 : 107);
  /* card geometry verbatim from the Framer module (clamp resolved in px so the
     scene-fixed clips can be positioned over the cards' resting pose) */
  const cardW = Math.max(216, Math.min(0.47 * (typeof window !== 'undefined' ? window.innerWidth : 1200), 416));
  const cardT = (id) => {
    const shift = id === 'left' ? 'translateX(-72%)' : 'translateX(-26%)';
    const base = id === 'left' ? leftRotation : rightRotation;
    if (hover !== id) return `${shift} rotate(${base}deg)`;
    const flick = id === 'left' ? 3.5 * hoverIntensity : -3.5 * hoverIntensity;
    return `${shift} rotate(${base + flick}deg)`;
  };
  /* scene-fixed clip position: the clip's resting anchor on the card's visible top
     edge, rotated with the card's BASE pose — it never follows the hover flick */
  const clipGeo = (id) => {
    const b = id === 'left' ? { x: 7, y: 81, w: 77, h: 260 } : { x: 211, y: 3, w: 127, h: 258 };
    const ch = clipSize * 1.2, cw = ch * b.w / b.h;
    const rad = (id === 'left' ? leftRotation : rightRotation) * Math.PI / 180;
    const cardH = cardW * (id === 'left' ? 1 : 1424 / 1224);
    const cardX = 0.5 * w - (id === 'left' ? 0.72 : 0.26) * cardW;
    const cardY = (id === 'left' ? 0.08 : 0.17) * H;
    const ax = (id === 'left' ? 0.30 : 0.60) * cardW + cw / 2;
    const ay = (id === 'left' ? 0.208 : 0.107) * cardH + ch * 0.05;
    const cx = cardW / 2, cy = cardH / 2, dx = ax - cx, dy = ay - cy;
    const rx = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = cy + dx * Math.sin(rad) + dy * Math.cos(rad);
    return { b, ch, cw, x: cardX + rx - cw / 2, y: cardY + ry - ch / 2 };
  };
  return (
    <div ref={root} role="img"
      aria-label="Two overlapping polaroid photos pinned by wooden clips"
      style={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none' }}>
      {['left', 'right'].map((id, i) =>
        <div key={id} onMouseEnter={() => { setHover(id); if (window.KXPaperFlick) window.KXPaperFlick(); }} onMouseLeave={() => setHover(null)}
          style={{ position: 'absolute', top: id === 'left' ? '8%' : '17%', left: '50%', width: cardW, zIndex: id === 'left' ? 3 : 2,
            transform: cardT(id), willChange: 'transform',
            transition: 'transform 320ms cubic-bezier(.34,1.8,.5,1)' }}>
          <img src={POLAROID_ART[id]} alt={id === 'left' ? 'Polaroid photo' : ''} draggable="false"
            style={{ display: 'block', width: '100%', height: 'auto', pointerEvents: 'none',
              filter: 'drop-shadow(0 10px 16px rgba(58,47,41,.20)) drop-shadow(0 2px 4px rgba(58,47,41,.14))' }} />
        </div>
      )}
      {/* clips: fixed to the scene, painted above both cards — they never react to hover */}
      {['left', 'right'].map((id, i) => {
        const g = clipGeo(id);
        return <div key={'c' + id} aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none',
          width: g.cw, height: g.ch, left: g.x, top: g.y, zIndex: 10 + i,
          transform: `rotate(${id === 'left' ? -14 : 14}deg)`,
          filter: 'drop-shadow(0 5px 7px rgba(58,47,41,.28))',
          backgroundImage: `url(${POLAROID_ART.clip})`,
          backgroundSize: `${342 / g.b.w * 100}% ${345 / g.b.h * 100}%`,
          backgroundPosition: `${g.b.x / (342 - g.b.w) * 100}% ${g.b.y / (345 - g.b.h) * 100}%` }}></div>;
      })}
    </div>
  );
}

/* ---------- scaled site embed: renders a live page at desktop width inside a fixed frame ----------
   bare: multiply-blends the page's white backdrop away.
   zoom: magnifies the rendered page; the page is centered in the frame, so the frame's
   aspect crops the page's empty margins (and its bottom-anchored Framer badge). */
function ScaledEmbed({ src, title, baseW = 1280, baseH = 1600, bare, zoom = 1, ratio = 1.15, fit }) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({ w: 460, h: 529 });
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); if (r.width) setBox(p => (p.w === r.width && p.h === r.height) ? p : { w: r.width, h: r.height }); };
    measure();
    let ro; if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); }
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, []);
  /* frame is as wide as the space allows and no taller than it — magnification stays tied to
     the available width, so a height cap crops rather than shrinks the polaroid */
  const w = box.w, frameH = fit && box.h ? Math.min(w * ratio, box.h) : w * ratio;
  const scale = (w / baseW) * zoom;
  return (
    <div ref={ref} style={{ width: '100%', height: fit ? '100%' : undefined, maxWidth: bare ? 'none' : 460,
      margin: fit ? 0 : '0 auto', display: 'flex', alignItems: 'center', justifyContent: fit ? 'flex-start' : 'center' }}>
      <div style={{ position: 'relative', width: w, height: frameH, overflow: 'hidden',
        borderRadius: bare ? 0 : 10, background: bare ? 'transparent' : 'var(--site-container2)',
        boxShadow: bare ? 'none' : '0 10px 30px rgba(0,0,0,.14)' }}>
        <iframe src={src} title={title} loading="lazy" scrolling="no"
          style={{ position: 'absolute', width: baseW, height: baseH, border: 'none',
            left: (w - baseW * scale) / 2, top: (frameH - baseH * scale) / 2,
            mixBlendMode: bare ? 'multiply' : 'normal',
            transform: `scale(${scale})`, transformOrigin: 'top left' }}></iframe>
      </div>
    </div>
  );
}

/* ---------- two-column content section ----------
   media: a custom element (e.g. the lanyard badge) that spans the section's
   full height, anchored to its top edge — the strap hangs from the section top
   embed: a live page URL shown in the media column; embedBare floats it free of any
   container — transparent, blended, spanning the section's left half */
function KXWin({ win, style, z, onFront }) {
  const bar = { height: 24, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
    background: '#f1f0ee', borderBottom: '1px solid rgba(0,0,0,.08)', fontSize: 10.5,
    color: '#8a8784', fontFamily: 'var(--font-body, system-ui)', letterSpacing: '.02em' };
  const dot = { width: 8, height: 8, borderRadius: '50%', background: '#d6d4d1' };
  const [hov, setHov] = React.useState(false);
  const front = z === 3;
  return (
    <div onPointerDown={onFront} onPointerEnter={() => setHov(true)} onPointerLeave={() => setHov(false)}
      style={{ position: 'absolute', zIndex: z, background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
      transition: 'box-shadow .3s cubic-bezier(.2,.8,.2,1), transform .3s cubic-bezier(.2,.8,.2,1)',
      transform: front ? 'scale(1.015)' : hov ? 'translateY(-3px)' : 'none',
      boxShadow: hov && !front ? '0 18px 38px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.06)' : '0 14px 34px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06)', ...style }}>
      <div style={bar}>
        <span style={{ ...dot, transition: 'background .2s', background: front ? '#ec6b5e' : dot.background }}></span><span style={{ ...dot, transition: 'background .2s', background: front ? '#f4bf4f' : dot.background }}></span><span style={{ ...dot, transition: 'background .2s', background: front ? '#61c554' : dot.background }}></span>
        <span style={{ flex: 1, textAlign: 'center', marginRight: 34 }}>{win.title}</span>
      </div>
      <div style={{ aspectRatio: win.ratio || '4 / 3', background: '#eceae7' }}>
        {win.src ?
        <img src={win.src} alt={win.alt || win.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: win.pos || 'center' }} /> :
        <image-slot id={win.slot} shape="rect" radius="0" placeholder={win.placeholder || 'Drop a photo'} style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>}
      </div>
      {win.title === 'Photo Booth' ?
      <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f0ee', borderTop: '1px solid rgba(0,0,0,.08)' }}>
        <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #b9b6b2', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="11" viewBox="0 0 14 11"><path d="M1 3h3l1.2-2h3.6L10 3h3v7H1z" fill="#6f6c69"></path><circle cx="7" cy="6.3" r="2.2" fill="#fff"></circle><circle cx="7" cy="6.3" r="1.3" fill="#6f6c69"></circle></svg>
        </span>
      </div> : null}
    </div>);
}

/* three overlapping photo windows */
function WindowStack({ wins }) {
  const pos = [
    { left: '-11%', top: 0, width: '68%' },
    { right: 0, top: '20%', width: '66%' },
    { left: '5%', top: '48%', width: '58%' }];
  const [order, setOrder] = React.useState([1, 2, 0]);
  return (
    <div className="kx-winstack" style={{ position: 'relative', width: '100%', maxWidth: 560, aspectRatio: '1 / 1.12', margin: '0 auto' }}>
      {wins.slice(0, 3).map((w, i) => <KXWin key={i} win={w} style={pos[i]} z={order.indexOf(i) + 1}
        onFront={() => { try { const a = new Audio('assets/window-click.mp3?v=2'); a.volume = 0.5; a.play().catch(() => {}); } catch (e) {} setOrder(o => [...o.filter(x => x !== i), i]); }} />)}
    </div>);
}

function Section({ img, alt, children, bg, reverse, media, embed, embedBare, topBar, windows, gallery }) {
  const floatEmbed = embed && embedBare;
  return (
    <div className="kx-fullscreen-sec" style={{ background: bg }}>
      {/* topBar rides inside the panel so it travels with it instead of
          scrolling away as a separate strip */}
      {topBar ? <div className="kx-sec-topbar" style={{ flex: '0 0 auto', position: 'relative', zIndex: 4 }}>{topBar}</div> : null}
      {media ?
      <div className="kx-sec-media" style={{ position: 'absolute', top: 0, bottom: 0,
        [reverse ? 'right' : 'left']: 0, width: '50%', zIndex: 1 }}>{media}</div> : null}
      {floatEmbed ?
      <div className="kx-sec-media" style={{ position: 'absolute', top: 0, bottom: 0,
        [reverse ? 'right' : 'left']: 0, width: '50%', zIndex: 1, overflow: 'visible' }}>
        <FloatingPolaroids />
      </div> : null}
      <div className="kx-two-col" data-reverse={reverse ? 'true' : 'false'}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
        maxWidth: 1060, margin: 'auto', padding: '64px 40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ order: reverse ? 2 : 1, justifySelf: 'center', width: '100%' }}>
          {media || floatEmbed ? null : gallery ? gallery : windows ? <WindowStack wins={windows} /> : embed ? <ScaledEmbed src={embed} title={alt} baseW={1200} baseH={1000} /> :
          <img src={img} alt={alt} style={{ width: '100%', maxWidth: 460, borderRadius: 10,
            display: 'block', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,.14)' }} />}
        </div>
        <div className="kx-section-text" style={{ order: reverse ? 1 : 2 }}>{children}</div>
      </div>
    </div>);

}

/* ---------- generic centered band ---------- */
function Band({ children, bg, narrow, id, topBar }) {
  return (
    <div className="kx-fullscreen-sec" id={id} style={{ background: bg, padding: topBar ? 0 : '64px 40px' }}>
      {topBar ? <div className="kx-sec-topbar" style={{ flex: '0 0 auto', position: 'relative', zIndex: 4 }}>{topBar}</div> : null}
      <div className="kx-band-inner" style={{ maxWidth: narrow ? 720 : 1060, margin: topBar ? 'auto' : '0 auto', width: '100%', boxSizing: 'border-box', padding: topBar ? '64px 40px' : 0 }}>{children}</div>
    </div>);

}

/* ---------- category folders (portfolio contents) ----------
   A folder per category: back panel + tab, the category's own project stills
   peeking out, and a front flap that tips open on hover. */
function FolderCard({ kicker, name, count, peeks, stickers, onOpen }) {
  return (
    <button type="button" className="kx-folder" onClick={onOpen}>
      <span className="kx-folder-stage" aria-hidden="true">
        <span className="kx-folder-back"></span>
        <span className="kx-folder-papers">
          {peeks.slice(0, 3).map((src, i) => <span key={i} className="kx-folder-paper"
            style={{ backgroundImage: 'url("' + src + '")' }}></span>)}
        </span>
        <span className="kx-folder-flap">
          <span className="kx-folder-front"></span>
          {(stickers || []).slice(0, 2).map((e, i) => <span key={i} data-e={e} className={'kx-folder-sticker kx-folder-sticker--' + (i ? 'b' : 'a')}>{e}</span>)}
          <span className="kx-folder-count">{count}</span>
        </span>
      </span>
      <span className="kx-folder-meta">
        <span className="kx-folder-name">{name}</span>
      </span>
    </button>);

}

/* the portfolio browses like a folder window on a desktop: a titlebar, a
   sidebar of folders, a path bar and a status line. Clicking a folder opens it
   in place; the works live inside. */
function FolderIndex({ folders }) {
  const [open, setOpen] = React.useState(null);
  const cur = folders.find(f => f.id === open) || null;
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    if (!cur) return undefined;
    const esc = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [cur]);
  /* keep the window's top in view when the contents swap heights —
     only after the user opens/closes a folder, never on first mount */
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = wrapRef.current;
    if (!el) return;
    const h = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--kx-header-h')) || 64;
    const top = el.getBoundingClientRect().top;
    if (top < h || top > window.innerHeight * 0.5) {
      window.scrollTo({ top: Math.max(0, window.scrollY + top - h - 24),
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [open]);
  const go = (id) => {
    setOpen(id);
  };
  const items = cur ? cur.count : folders.length + ' folders';
  return (
    <div ref={wrapRef} className="kx-fwin">
      <div className="kx-fwin-title">
        <span className="kx-fwin-lights" aria-hidden="true"><i></i><i></i><i></i></span>
        <span className="kx-fwin-name" data-no-i18n="true">{cur ? cur.name : 'Portfolio'}</span>
      </div>
      <div className="kx-fwin-tools">
        <span className="kx-fwin-nav">
          <button type="button" className="kx-fwin-arrow" onClick={() => setOpen(null)}
            disabled={!cur} aria-label="Back to all folders">‹</button>
          <button type="button" className="kx-fwin-arrow" disabled aria-label="Forward">›</button>
        </span>
        <span className="kx-fwin-crumbs" data-no-i18n="true">
          <button type="button" className="kx-fwin-crumb" onClick={() => setOpen(null)}>Portfolio</button>
          {cur && <React.Fragment>
            <span className="kx-fwin-sep" aria-hidden="true">›</span>
            <b>{cur.name}</b>
          </React.Fragment>}
        </span>
        <span className="kx-fwin-count">{items}</span>
      </div>
      <div className="kx-fwin-main">
        <div className="kx-fwin-content">
          {cur ?
            <div className="kx-fwin-body" key={cur.id}>
              <span className="kx-fwin-label">{cur.kicker}</span>
              {cur.content}
            </div> :
            <div className="kx-folder-grid">
              {folders.map(f => <div key={f.id} style={{ display: 'contents' }} onMouseEnter={() => window.KXFolderHover && window.KXFolderHover()}><FolderCard {...f} onOpen={() => go(f.id)} /></div>)}
            </div>}
        </div>
      </div>
      <div className="kx-fwin-status" aria-hidden="true"></div>
    </div>);

}

/* ---------- timeline entry (experiences / education) ---------- */
function Entry({ role, org, dates, location, points, tags }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28,
      padding: '30px 0', borderTop: '1px solid color-mix(in srgb, var(--site-text) 16%, transparent)' }}
    className="kx-entry">
      <div className="kx-entry-no" aria-hidden="true"></div>
      <div className="kx-entry-dates">
        <div style={{ fontFamily: 'var(--site-body)', fontWeight: 900, fontSize: 17,
          color: 'var(--site-selected)' }}>{dates}</div>
        {location && <div style={{ fontFamily: 'var(--site-body)', fontSize: 15,
          color: 'var(--site-link)', marginTop: 4 }}>{location}</div>}
      </div>
      <div>
        <h4 style={{ margin: 0, fontFamily: 'var(--site-heading)', fontSize: 26,
          color: 'var(--site-text)', lineHeight: 1.1 }}>{role}</h4>
        <div style={{ fontFamily: 'var(--site-body)', fontWeight: 900, fontSize: 18,
          color: 'var(--site-text)', opacity: .8, margin: '4px 0 14px' }}>{org}</div>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {points.map((pt, i) =>
          <li key={i} style={{ fontFamily: 'var(--site-body)', fontSize: 17, lineHeight: 1.55,
            color: 'var(--site-text)', textWrap: 'pretty' }}>{pt}</li>
          )}
        </ul>
        {tags && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>}
      </div>
      <div className="kx-entry-dur">{dates}{location && <span className="kx-entry-loc">{location}</span>}</div>
    </div>);

}

/* ---------- lightbox: click any image to view it full-size ----------
   openLightboxCount lets other Escape/keydown listeners (e.g. ProjectModal)
   know a lightbox is currently on top, so they can defer to it instead of
   both closing on the same keypress. */
let openLightboxCount = 0;
function Lightbox({ src, alt, onClose }) {
  React.useEffect(() => {
    if (!src) return;
    openLightboxCount++;
    const onKey = (e) => {if (e.key === 'Escape') {e.stopPropagation();onClose();}};
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;document.body.style.overflow = 'hidden';
    return () => {openLightboxCount--;document.removeEventListener('keydown', onKey);document.body.style.overflow = prev;};
  }, [src]);
  if (!src) return null;
  return (
    <div onClick={(e) => {e.stopPropagation();onClose();}} style={{ position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(20,16,14,.86)', backdropFilter: 'blur(6px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '5vh 5vw', cursor: 'zoom-out' }}>
      <img src={src} alt={alt || ''} onClick={(e) => e.stopPropagation()}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
        borderRadius: 6, boxShadow: '0 30px 80px rgba(0,0,0,.5)', cursor: 'default' }} />
      <button onClick={(e) => {e.stopPropagation();onClose();}} aria-label="Close" style={{ position: 'fixed', top: 20, right: 20,
        width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'rgba(0,0,0,.45)', color: '#fff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 91 }}>
        <Icon name="close" size={22} />
      </button>
    </div>);

}

/* ---------- zoomable image: click to open Lightbox ---------- */
function ZoomImg({ src, alt, style, imgStyle }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative', cursor: 'zoom-in', ...style }}
    onClick={() => setOpen(true)}>
      <img src={src} alt={alt || ''} style={{ display: 'block', width: '100%', ...imgStyle }} />
      {open && ReactDOM.createPortal(
        <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />,
        document.body)}
    </div>);

}

/* ---------- pill tag ---------- */
const Tag = ({ children }) =>
<span className="kx-tag" style={{ fontFamily: 'var(--site-body)', fontWeight: 900, fontSize: 14, letterSpacing: '.04em',
  textTransform: 'uppercase', padding: '6px 12px', borderRadius: 'var(--radius-pill-sm)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.2,
  background: 'color-mix(in srgb, var(--site-selected) 22%, transparent)', color: 'var(--site-text)' }}>{children}</span>;


/* ---------- explore card (home -> subpage) ---------- */
function ExploreCard({ label, blurb, onClick }) {
  return (
    <window.KXMagnetic strength={8} style={{ display: 'block' }}>
    <button onClick={onClick} style={{
        textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 'var(--radius-site-lg)',
        background: 'var(--site-cover-bg)', padding: '26px 26px', display: 'flex', flexDirection: 'column',
        gap: 8, boxShadow: '0 6px 18px rgba(0,0,0,.08)', transition: 'transform .25s var(--ease-standard), box-shadow .25s', width: '100%' }}
      onMouseOver={(e) => {e.currentTarget.style.transform = 'translateY(-5px)';e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,.16)';}}
      onMouseOut={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,.08)';}}>
      <span style={{ fontFamily: 'var(--site-heading)', fontSize: 26, color: 'var(--site-text)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--site-body)', fontSize: 16, lineHeight: 1.5, color: 'var(--site-text)', opacity: .8 }}>{blurb}</span>
      <span style={{ fontFamily: 'var(--site-nav)', fontSize: 15, letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'var(--site-selected)', marginTop: 6 }}>View →</span>
    </button>
    </window.KXMagnetic>);

}

/* ---------- horizontal project carousel (swipe / arrow nav) ---------- */
function Carousel({ children, cardWidth }) {
  const viewportRef = React.useRef(null);
  const [idx, setIdx] = React.useState(0);
  const [metrics, setMetrics] = React.useState({ viewportWidth: 0, contentWidth: 0 });
  const count = React.Children.count(children);
  const GAP = 22;
  const CARD = cardWidth || 320;
  const STEP = CARD + GAP;
  const reduce = typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* phones: no arrows — lay the cards out as a plain stacked strip, same as short folders */
  const [narrow, setNarrow] = React.useState(() => !!(window.matchMedia && window.matchMedia('(max-width:760px)').matches));
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(max-width:760px)');
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  React.useEffect(() => {
    const measure = () => {
      const el = viewportRef.current;if (!el) return;
      setMetrics({ viewportWidth: el.clientWidth - 56, contentWidth: count * CARD + Math.max(0, count - 1) * GAP });
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 200); // catch late image-driven reflow
    return () => {window.removeEventListener('resize', measure);clearTimeout(t);};
  }, [count, CARD]);

  const maxOffset = Math.max(0, metrics.contentWidth - metrics.viewportWidth);
  // A simple, deterministic slide offset per index — driven by CSS transform + transition rather
  // than native scrollLeft, so interrupting mid-animation (rapid clicks) can't race with scroll-queue
  // or scroll-snap timing quirks: the browser always resolves a transform transition correctly from
  // wherever it currently visually is.
  const offsetFor = (i) => Math.max(0, Math.min(maxOffset, i * STEP));
  const canLeft = idx > 0;
  const canRight = idx < count - 1;

  const goTo = (dir) => {
    let next = Math.max(0, Math.min(count - 1, idx + dir));
    // Trailing/leading cards can share the same clamped offset (maxOffset or 0) when the track can't
    // scroll far enough to give each its own spot — keep stepping until we reach a genuinely different
    // position, so every enabled click always produces visible movement.
    while (dir && Math.abs(offsetFor(next) - offsetFor(idx)) < 1 && kids_inRange(next + dir, count)) {
      next += dir;
    }
    if (Math.abs(offsetFor(next) - maxOffset) < 1) next = count - 1;else
    if (offsetFor(next) <= 0) next = 0;
    setIdx(next);
  };
  function kids_inRange(n, c) {return n >= 0 && n <= c - 1;}

  /* drag-to-explore: pointer drag pans the track, release snaps to nearest card */
  const drag = React.useRef({ active: false, startX: 0, startOffset: 0, moved: 0 });
  const [dragX, setDragX] = React.useState(null);
  const onPointerDown = (e) => {
    if (e.button === 1 || e.button === 2 || maxOffset <= 0) return;
    drag.current = { active: true, startX: e.clientX, startOffset: offsetFor(idx), moved: 0 };
    setDragX(offsetFor(idx));
  };
  const onPointerMove = (e) => {
    const d = drag.current;if (!d.active) return;
    const delta = e.clientX - d.startX;
    d.moved = Math.abs(delta);
    let next = d.startOffset - delta;
    if (next < 0) next = next * .35;
    if (next > maxOffset) next = maxOffset + (next - maxOffset) * .35;
    setDragX(next);
  };
  const endDrag = () => {
    const d = drag.current;if (!d.active) return;
    d.active = false;
    const landed = Math.max(0, Math.min(maxOffset, dragX == null ? offsetFor(idx) : dragX));
    let nearest = Math.round(landed / STEP);
    nearest = Math.max(0, Math.min(count - 1, nearest));
    if (Math.abs(offsetFor(count - 1) - landed) < STEP / 2) nearest = count - 1;
    setIdx(nearest);
    setDragX(null);
    if (d.moved > 6) {suppressClick.current = true;setTimeout(() => {suppressClick.current = false;}, 0);}
  };
  const suppressClick = React.useRef(false);
  const onClickCapture = (e) => {if (suppressClick.current) {e.preventDefault();e.stopPropagation();}};

  const navBtn = (dir) =>
  <button type="button" aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'} onClick={() => goTo(dir)}
  style={{ position: 'absolute', top: '38%', [dir < 0 ? 'left' : 'right']: -8, transform: 'translateY(-50%)',
    width: 46, height: 46, borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 5,
    background: 'var(--site-cover-bg)', color: 'var(--site-text)', boxShadow: '0 6px 18px rgba(0,0,0,.20)',
    display: (dir < 0 ? canLeft : canRight) ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
        <path d={dir < 0 ? 'M8 1L1 8l7 7' : 'M1 1l7 7-7 7'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>;

  if (narrow) return (
    <div className="kx-portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 22 }}>{children}</div>);
  return (
    <div style={{ position: 'relative' }}>
      {navBtn(-1)}
      <div ref={viewportRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={endDrag} onPointerLeave={endDrag} onPointerCancel={endDrag} onClickCapture={onClickCapture}
      style={{ overflow: 'hidden', position: 'relative', touchAction: 'pan-y',
        cursor: maxOffset > 0 ? drag.current.active ? 'grabbing' : 'grab' : 'default',
        padding: '26px 28px 64px', margin: '-26px -28px -64px',
        WebkitMaskImage: 'linear-gradient(90deg,transparent 0,#000 28px,#000 calc(100% - 28px),transparent 100%)',
        maskImage: 'linear-gradient(90deg,transparent 0,#000 28px,#000 calc(100% - 28px),transparent 100%)' }}>
        <div className="kx-portfolio-grid" style={{ display: 'flex', gap: GAP,
          transition: reduce || dragX != null ? 'none' : 'transform .42s cubic-bezier(.22,.61,.36,1)',
          transform: `translateX(${-(dragX != null ? dragX : offsetFor(idx))}px)` }}>
          {React.Children.map(children, (child) =>
          <div style={{ flex: `0 0 ${CARD}px`, display: 'flex', userSelect: 'none' }}>{child}</div>
          )}
        </div>
      </div>
      {navBtn(1)}
    </div>);

}

/* ---------- portfolio project card (clickable -> modal) ---------- */
function ProjectCard({ slotId, category, title, desc, accent, bodyBg, src, hoverSrc, hasVideo, onOpen, frame }) {
  const [hover, setHover] = React.useState(false);
  const fr = frame ? String(frame).padStart(2, '0') : null;
  return (
    <div role="button" tabIndex={0} onClick={onOpen} className="kx-pcard"
    onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();onOpen && onOpen();}}}
    style={{ cursor: 'pointer', borderRadius: 'var(--radius-site-lg)', overflow: 'hidden', width: '100%',
      background: 'var(--site-cover-bg)', boxShadow: '0 8px 22px rgba(0,0,0,.10)', display: 'flex',
      flexDirection: 'column', transition: 'transform .25s var(--ease-standard), box-shadow .25s' }}
    onMouseOver={(e) => {e.currentTarget.style.transform = 'translateY(-5px)';e.currentTarget.style.boxShadow = '0 16px 34px rgba(0,0,0,.18)';setHover(true);}}
    onMouseOut={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,0,0,.10)';setHover(false);}}>
      <div className="kx-pcard-media" style={{ position: 'relative', height: 220, background: accent || 'var(--site-container2)', overflow: 'hidden' }}>
        {src ?
        <React.Fragment>
              <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hover ? 'scale(1.06)' : 'scale(1)', opacity: hoverSrc && hover ? 0 : 1,
            transition: 'transform .6s var(--ease-standard), opacity .45s var(--ease-standard)' }} />
              {hoverSrc && <img src={hoverSrc} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hover ? 'scale(1.06)' : 'scale(1.12)', opacity: hover ? 1 : 0,
            transition: 'transform .6s var(--ease-standard), opacity .45s var(--ease-standard)' }} />}
            </React.Fragment> :
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'var(--site-display)', fontSize: 64,
          color: 'color-mix(in srgb, var(--site-text) 28%, transparent)' }}>{title.charAt(0)}</div>}
        {hasVideo &&
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.42)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="24" viewBox="0 0 22 24" fill="#fff"><path d="M0 0l22 12L0 24z" /></svg>
            </span>
          </div>
        }
        {fr && <span className="kx-pcard-frame" aria-hidden="true">{fr}A</span>}
        {fr && <span className="kx-pcard-take" aria-hidden="true">TAKE {fr}</span>}
      </div>
      <div style={{ padding: '20px 22px 22px', background: bodyBg || 'transparent',
        display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ alignSelf: 'flex-start' }}><Tag>{category}</Tag></span>
        <h4 style={{ margin: '12px 0 6px', fontFamily: 'var(--site-heading)', fontSize: 24,
          color: 'var(--site-text)', lineHeight: 1.1 }}>{title}</h4>
        <p style={{ margin: 0, fontFamily: 'var(--site-body)', fontSize: 16, lineHeight: 1.55,
          color: 'var(--site-text)', opacity: .82, textWrap: 'pretty', flex: 1 }}>{desc}</p>
        <span style={{ display: 'inline-block', marginTop: 14, fontFamily: 'var(--site-nav)', fontSize: 14,
          letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--site-selected)' }}>
          {hasVideo ? 'Watch & read →' : 'View details →'}</span>
      </div>
    </div>);

}

/* ---------- phone-framed media: auto-scales an iPhone bezel to fit its pane ----------
/* ---------- screen slider: a filmstrip of prototype pages ----------
   The active screen sits centre-stage at full size while its neighbours sit
   back, dimmed and slightly smaller. Auto-advances, pauses on hover, and any
   screen can be clicked or dragged into focus. Slots are user-fillable so the
   real exported frames drop straight in. */
function ScreenSlider({ screens, idPrefix }) {
  const [idx, setIdx] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const W = 148, GAP = 18;
  React.useEffect(() => {
    if (hover || screens.length < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % screens.length), 2800);
    return () => clearInterval(t);
  }, [hover, screens.length]);
  return (
    <div style={{ margin: '30px 0 6px' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ fontFamily: 'var(--site-nav)', fontSize: 12, letterSpacing: '.14em',
        textTransform: 'uppercase', color: 'var(--site-selected)', marginBottom: 14 }}>Screens</div>
      <div style={{ overflow: 'hidden', margin: '-30px -4px -36px', padding: '30px 4px 36px',
        WebkitMaskImage: 'linear-gradient(90deg,transparent 0,#000 18%,#000 82%,transparent 100%)',
        maskImage: 'linear-gradient(90deg,transparent 0,#000 18%,#000 82%,transparent 100%)' }}>
        <div style={{ display: 'flex', gap: GAP, alignItems: 'flex-start',
          transform: `translateX(calc(50% - ${W / 2}px - ${idx * (W + GAP)}px))`,
          transition: 'transform .62s cubic-bezier(.4,0,.2,1)' }}>
          {screens.map((s, i) => {
            const on = i === idx;
            return (
              <button key={s.id} type="button" onClick={() => setIdx(i)}
                aria-label={s.label} aria-current={on ? 'true' : 'false'}
                style={{ flex: `0 0 ${W}px`, border: 'none', background: 'none', padding: 0, cursor: 'pointer',
                  textAlign: 'center', opacity: on ? 1 : .42, filter: on ? 'none' : 'saturate(.7)',
                  transform: on ? 'scale(1)' : 'scale(.88)', transformOrigin: 'top center',
                  transition: 'opacity .5s ease, transform .55s cubic-bezier(.4,0,.2,1), filter .5s ease' }}>
                <div style={{ aspectRatio: '9 / 19.5', borderRadius: 20, overflow: 'hidden',
                  background: 'var(--site-container2)', border: '1px solid var(--site-container2)',
                  boxShadow: on ? '0 14px 30px rgba(0,0,0,.22)' : '0 6px 14px rgba(0,0,0,.12)',
                  transition: 'box-shadow .5s ease' }}>
                  <image-slot id={idPrefix + '-' + s.id} src={s.src} placeholder={s.label} shape="rect"
                    style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>
                </div>
                <div style={{ fontFamily: 'var(--site-body)', fontSize: 13, lineHeight: 1.4,
                  color: 'var(--site-text)', marginTop: 10, fontWeight: on ? 700 : 400 }}>{s.label}</div>
              </button>);
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 16 }}>
        {screens.map((s, i) =>
        <button key={s.id} type="button" onClick={() => setIdx(i)} aria-label={'Show ' + s.label}
          style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
            background: i === idx ? 'var(--site-text)' : 'var(--site-container2)',
            transition: 'width .4s cubic-bezier(.4,0,.2,1), background .4s ease' }}></button>
        )}
      </div>
    </div>);

}

/* ---------- realistic titanium iPhone shell with 3D tilt ----------
   SCREEN 402x874; frame adds a 13px polished rail on every side (428x900). */
const PHONE_SCREEN = { w: 402, h: 874 }, PHONE_RAIL = 13;
const PHONE_FRAME = { w: PHONE_SCREEN.w + PHONE_RAIL * 2, h: PHONE_SCREEN.h + PHONE_RAIL * 2 };
function Iphone3D({ children }) {
  const rail = 'linear-gradient(103deg, #4a4a50 0%, #b9b9c1 9%, #f4f4f7 17%, #8e8e96 27%, #55555b 38%, #d5d5dc 50%, #f7f7fa 56%, #8b8b93 66%, #4e4e54 78%, #c8c8d0 90%, #5a5a60 100%)';
  return (
    <div style={{ width: PHONE_FRAME.w, height: PHONE_FRAME.h }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* contact shadow */}
        <div style={{ position: 'absolute', left: '6%', right: '6%', bottom: -34, height: 60, borderRadius: '50%',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.34), rgba(0,0,0,0) 70%)', filter: 'blur(10px)' }}></div>
        {/* side buttons */}
        {[{ t: 168, h: 30 }, { t: 250, h: 62 }, { t: 326, h: 62 }].map((b, i) =>
          <div key={i} style={{ position: 'absolute', left: -3, top: b.t, width: 5, height: b.h, borderRadius: 3,
            background: rail, boxShadow: 'inset 0 0 2px rgba(0,0,0,.5)' }}></div>
        )}
        <div style={{ position: 'absolute', right: -3, top: 262, width: 5, height: 96, borderRadius: 3,
          background: rail, boxShadow: 'inset 0 0 2px rgba(0,0,0,.5)' }}></div>
        {/* polished rail */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 62, background: rail,
          boxShadow: '0 44px 90px rgba(0,0,0,.34), 0 6px 18px rgba(0,0,0,.22), inset 0 0 0 1px rgba(255,255,255,.5)' }}>
          {/* black glass edge under the rail */}
          <div style={{ position: 'absolute', inset: 5, borderRadius: 57, background: '#08080a',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.09), inset 0 2px 6px rgba(0,0,0,.9)' }}></div>
          {/* screen */}
          <div style={{ position: 'absolute', inset: PHONE_RAIL, borderRadius: 49, overflow: 'hidden', background: '#000',
            boxShadow: 'inset 0 0 14px rgba(0,0,0,.8)' }}>
            <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
            {/* dynamic island */}
            <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 126, height: 37,
              borderRadius: 24, background: '#000', zIndex: 50, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.05)' }}></div>
            {/* home indicator */}
            <div style={{ position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)', width: 139, height: 5,
              borderRadius: 100, background: 'rgba(255,255,255,.55)', zIndex: 60, pointerEvents: 'none' }}></div>
            {/* screen glare */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 70, borderRadius: 49,
              background: 'linear-gradient(122deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.05) 26%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 100%)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- phone-framed media: auto-scales an iPhone bezel to fit its pane ---------- */
function PhoneMedia({ children }) {
  const ref = React.useRef(null);
  const [scale, setScale] = React.useState(0.6);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setScale(Math.min((r.width - 52) / PHONE_FRAME.w, (r.height - 96) / PHONE_FRAME.h, 1));
    };
    const raf = requestAnimationFrame(measure);
    /* the modal panel animates in over .44s and RO callbacks may not fire here —
       re-measure a few times until layout settles */
    const timers = [100, 300, 600, 1000].map((ms) => setTimeout(measure, ms));
    window.addEventListener('resize', measure);
    let ro;
    if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); }
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center',
      justifyContent: 'center', overflow: 'hidden', padding: '14px 0 46px' }}>
      <div role="note" style={{ position: 'absolute', left: '50%', bottom: 12, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', borderRadius: 999, background: 'var(--site-text)', color: 'var(--site-container)', fontFamily: 'var(--site-body)',
        fontSize: 12.5, lineHeight: 1.3, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,.18)', animation: 'kxPageIn .5s .6s both' }}>
        <span>Tap the screen to interact, or press</span>
        <kbd style={{ fontFamily: 'inherit', fontSize: 11, padding: '1px 6px', borderRadius: 4, border: '1px solid currentColor' }}>→</kbd>
        <span>for the next page</span>
      </div>
      <div style={{ width: PHONE_FRAME.w * scale, height: PHONE_FRAME.h * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Iphone3D>{children}</Iphone3D>
        </div>
      </div>
    </div>
  );
}

/* ---------- project detail modal ----------
   media priority: videoFile (local <video>) > video (iframe embed URL) > src (cover image)
   phoneFrame: true wraps the iframe embed in an iPhone mockup */
function ProjectModal({ project, onClose }) {
  const [full, setFull] = React.useState(false);
  const [mini, setMini] = React.useState(false);
  /* phones: side-by-side projects stack — media on top, write-up below */
  const [narrowM, setNarrowM] = React.useState(() => !!(window.matchMedia && window.matchMedia('(max-width:760px)').matches));
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(max-width:760px)');
    const on = () => setNarrowM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  React.useEffect(() => {setFull(false); setMini(false);}, [project]);
  React.useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (openLightboxCount > 0) return; // let the lightbox's own handler close it first
        if (mini) {setMini(false);} else if (full) {setFull(false);} else {onClose();}
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;document.body.style.overflow = 'hidden';
    return () => {document.removeEventListener('keydown', onKey);document.body.style.overflow = prev;};
  }, [project, full, mini]);
  if (!project) return null;
  const p = project;
  const sideBySide = p.sideBySide && !(p.gallery || p.gallerySections);
  const stack = sideBySide && narrowM;
  let media;
  if (p.videoFile) {
    media = <video controls playsInline src={p.videoFile} poster={p.src}
    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />;
  } else if (p.video && p.phoneFrame) {
    /* fill the phone screen edge-to-edge so the prototype reads as a running app,
       not a web page — Figma UI hidden via hide-ui=1, letterbox blends into dark bezel */
    media = <PhoneMedia>
      <iframe src={p.video} title={p.title} allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block', background: '#000' }} />
    </PhoneMedia>;
  } else if (p.video) {
    media = <iframe src={p.video} title={p.title} allowFullScreen
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    style={{ width: '100%', height: '100%', border: 'none' }} />;
  } else if (p.src) {
    media = <ZoomImg src={p.src} alt={p.title} style={{ width: '100%', height: '100%' }}
    imgStyle={{ height: '100%', objectFit: 'contain' }} />;
  } else {
    media = <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--site-container2)', color: 'var(--site-text)',
      fontFamily: 'var(--site-body)', fontSize: 16, opacity: .7, textAlign: 'center', padding: 24 }}>
      Video / stills coming soon</div>;
  }
  const circleBtn = {
    zIndex: 2, width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(0,0,0,.45)', color: '#fff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 0 };
  return (
    <div onClick={onClose} className="kx-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(40,32,28,.55)', backdropFilter: 'blur(4px)', display: 'flex',
      alignItems: mini ? 'flex-end' : 'center', justifyContent: 'center',
      padding: mini ? '0 0 28px' : (full ? 0 : '4vh 4vw'),
      transition: 'padding .42s cubic-bezier(.4,0,.2,1)' }}>
      <div onClick={(e) => e.stopPropagation()} className={'kx-modal-panel' + (sideBySide ? ' kx-modal-side' : '') + (mini ? ' kx-modal-mini' : '')} style={{ position: 'relative', background: 'var(--site-bg)',
        borderRadius: full ? 0 : 16, overflow: 'hidden', isolation: 'isolate',
        maxWidth: mini ? 360 : (full ? '100vw' : 1140), width: '100%',
        height: mini ? 'auto' : (full ? '100vh' : 'auto'), maxHeight: mini ? 44 : (full ? '100vh' : '94vh'),
        borderRadius: mini ? 'var(--radius-site)' : undefined,
        display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,.4)',
        transition: 'max-width .42s cubic-bezier(.4,0,.2,1), max-height .42s cubic-bezier(.4,0,.2,1), border-radius .42s cubic-bezier(.4,0,.2,1)' }}>
        <div className="kx-fwin-title kx-modal-title" onDoubleClick={() => setMini((m) => !m)}
          style={mini ? { cursor: 'pointer' } : null}
          onClick={mini ? () => setMini(false) : undefined}>
          <span className={'kx-fwin-lights kx-modal-lights' + (full ? ' is-full' : '') + (mini ? ' is-mini' : '')}>
            <i role="button" tabIndex={0} title="Close" aria-label="Close" onClick={onClose}
            onKeyDown={(e) => e.key === 'Enter' && onClose()}></i>
            <i role="button" tabIndex={0} title={mini ? 'Restore' : 'Minimize'}
            aria-label={mini ? 'Restore' : 'Minimize'}
            onClick={(e) => {e.stopPropagation(); setMini((m) => !m);}}
            onKeyDown={(e) => e.key === 'Enter' && setMini((m) => !m)}></i>
            <i role="button" tabIndex={0} title={full ? 'Exit full screen' : 'View full screen'}
            aria-label={full ? 'Exit full screen' : 'View full screen'} onClick={() => setFull((f) => !f)}
            onKeyDown={(e) => e.key === 'Enter' && setFull((f) => !f)}></i>
          </span>
          <span className="kx-fwin-name" data-no-i18n="true">{p.title}</span>
        </div>
        <div className="kx-modal-body" style={{ display: mini ? 'none' : 'flex', flexDirection: sideBySide && !stack ? 'row' : 'column',
          minHeight: 0, flex: 1, overflowY: stack ? 'auto' : undefined }}>
        {sideBySide && <div style={{ ...(stack ? { flex: '0 0 auto', width: '100%', ...(p.phoneFrame ? { height: 'min(78vh, 690px)' } : { aspectRatio: '3 / 4', maxHeight: '72vh' }) } : { flex: '0 0 42%', alignSelf: 'stretch' }), background: p.phoneFrame ? 'var(--site-container2)' : '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: p.phoneFrame ? 'min(78vh, 690px)' : 0 }}>{media}</div>}
        {!sideBySide && (!(p.gallery || p.gallerySections) || p.video || p.videoFile) && <div style={{ width: '100%', aspectRatio: p.embedTall ? '3/4' : '16/9', maxHeight: full ? '56vh' : '72vh', background: '#000', flexShrink: 0, transition: 'max-height .42s cubic-bezier(.4,0,.2,1)' }}>{media}</div>}
        <div style={{ padding: '32px 44px 40px', overflowY: 'auto',
          width: '100%', boxSizing: 'border-box',
          maxWidth: 'none', margin: 0, ...(sideBySide && !stack ? { flex: 1, minWidth: 0 } : {}), ...(stack ? { flex: '0 0 auto', overflowY: 'visible', padding: '24px 20px 32px' } : {}) }}>
          <Tag>{p.category}</Tag>
          <h3 style={{ margin: '12px 0 14px', fontFamily: 'var(--site-heading)', fontSize: 38,
            color: 'var(--site-text)', lineHeight: 1.05 }}>{p.title}</h3>
          {(p.long || p.desc).split('\n').map((para, i) =>
          <p key={i} style={{ fontFamily: 'var(--site-body)', fontSize: 18, lineHeight: 1.7,
            color: 'var(--site-text)', margin: '0 0 .9em', maxWidth: full ? 'none' : 760, textWrap: 'pretty' }}>{renderEmph(para)}</p>
          )}
          {p.screens && p.screens.length > 0 &&
          <ScreenSlider screens={p.screens} idPrefix={'screens-' + p.id} />}
          {(p.gallery || p.gallerySections) && (() => {
            const renderFig = (g, i) =>
            <figure key={i} style={{ margin: 0 }}>
                {g.label && <div style={{ fontFamily: 'var(--site-nav)', fontSize: 12, letterSpacing: '.14em',
                textTransform: 'uppercase', color: 'var(--site-selected)', marginBottom: 10 }}>{g.label}</div>}
                <div style={{ background: g.bg || '#fff', borderRadius: 'var(--radius-site)', overflow: 'hidden',
                border: '1px solid var(--site-container2)', ...(g.aspect ? { aspectRatio: g.aspect } : {}) }}>
                  <ZoomImg src={g.src} alt={g.caption || p.title} style={{ height: g.aspect ? '100%' : 'auto' }}
                imgStyle={g.aspect ? { height: '100%', objectFit: 'cover' } : {}} />
                </div>
                {g.caption && <figcaption style={{ fontFamily: 'var(--site-body)', fontSize: 15, lineHeight: 1.55,
                color: 'var(--site-selected)', marginTop: 10, maxWidth: full ? 'none' : 720, textWrap: 'pretty' }}>{g.caption}</figcaption>}
              </figure>;

            const sections = p.gallerySections || (!p.galleryColumns && p.gallery ? [{ items: p.gallery, columns: 2 }] : null);
            if (sections) {
              let n = 0;
              const num = () => String(++n).padStart(2, '0');
              const plate = (g, no) =>
              <figure className="kx-ed-fig" style={{ margin: 0 }}>
                  <div className="kx-ed-plate" style={{ background: g.bg || '#fff', aspectRatio: '4 / 3' }}>
                    <ZoomImg src={g.src} alt={g.caption || p.title} style={{ height: '100%' }}
                    imgStyle={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <figcaption className="kx-ed-cap">
                    <span className="kx-ed-no">{no}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      {g.label && <span className="kx-ed-label">{g.label}</span>}
                      {g.caption && <span className="kx-ed-text">{g.caption}</span>}
                    </span>
                  </figcaption>
                </figure>;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 48, margin: '30px 0 30px' }}>
                  {sections.map((sec, si) => {
                    const rest = sec.items;
                    const cols = Math.min(sec.columns || 2, 3);
                    return <section key={si} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      {sec.heading && <div className="kx-ed-head"><span>{sec.heading}</span><span>{sec.items.length} plates</span></div>}
                      {rest.length > 0 && <div className="kx-gallery-cols kx-ed-grid" style={{ display: 'grid',
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '34px 26px', alignItems: 'start' }}>
                        {rest.map((g, i) => <div key={i}>{plate(g, num())}</div>)}
                      </div>}
                    </section>;
                  })}
                </div>);
            }
            if (p.galleryColumns) {
              return (
                <div className="kx-gallery-cols" style={{ display: 'grid',
                  gridTemplateColumns: `repeat(${p.galleryColumns}, 1fr)`, gap: 30, margin: '24px 0 30px', alignItems: 'start' }}>
                  {Array.from({ length: p.galleryColumns }, (_, c) =>
                  <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                      {p.gallery.map((g, i) => [g, i]).filter(([g]) => (g.col || 1) === c + 1).map(([g, i]) => renderFig(g, i))}
                    </div>
                  )}
                </div>);

            }
            return <div style={{ display: 'flex', flexDirection: 'column', gap: 30, margin: '24px 0 30px' }}>
              {p.gallery.map(renderFig)}
            </div>;
          })()}
          {p.meta && p.meta.length > 0 &&
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 34px', margin: '18px 0 4px' }}>
              {p.meta.map(([k, v]) =>
            <div key={k}>
                  <div style={{ fontFamily: 'var(--site-nav)', fontSize: 12, letterSpacing: '.14em',
                textTransform: 'uppercase', color: 'var(--site-selected)', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontFamily: 'var(--site-body)', fontSize: 16, fontWeight: 700,
                color: 'var(--site-text)' }}>{v}</div>
                </div>
            )}
            </div>
          }
          {p.tags && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {p.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>}
          {(p.links || (p.link ? [p.link] : [])).length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
            {(p.links || [p.link]).map((lk, i) =>
            <a key={i} href={lk.href} target="_blank" rel="noopener" style={{ display: 'inline-flex',
              alignItems: 'center', gap: 8, fontFamily: 'var(--site-body)', fontWeight: 900, fontSize: 16,
              color: i === 0 ? '#fff' : 'var(--site-text)', background: i === 0 ? 'var(--site-accent)' : 'transparent',
              border: i === 0 ? 'none' : '2px solid var(--site-accent)', padding: '.7em 1.4em',
              borderRadius: 'var(--radius-site)', textDecoration: 'none' }}>{lk.label} →</a>
            )}
          </div>}
        </div>
        </div>
      </div>
    </div>);

}

/* ---------- floating language switch (lower-left) ---------- */
function LangSwitch() {
  const [lang, setLang] = React.useState(() => window.KXGetLang ? window.KXGetLang() : 'en');
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    const on = (e) => setLang(e.detail);
    window.addEventListener('kx-lang-change', on);
    return () => window.removeEventListener('kx-lang-change', on);
  }, []);
  const part = (active) => ({ fontFamily: 'var(--site-nav)', fontSize: 15, letterSpacing: '.04em',
    color: active ? 'var(--site-selected)' : 'color-mix(in srgb, var(--site-text) 55%, transparent)',
    fontWeight: active ? 700 : 400, transition: 'color .2s' });
  return (
    <button data-no-i18n className="kx-glassbar kx-langpill" onClick={() => window.KXSetLang(lang === 'zh' ? 'en' : 'zh')}
    aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{ position: 'fixed', left: 26, bottom: 26, zIndex: 40, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999,
      color: 'var(--site-text)',
      transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      transition: 'transform .22s cubic-bezier(.22,.61,.36,1), box-shadow .22s' }}>
      <span style={part(lang === 'zh')}>中</span>
      <span style={{ fontFamily: 'var(--site-nav)', fontSize: 14, color: 'color-mix(in srgb, var(--site-text) 30%, transparent)' }}>/</span>
      <span style={part(lang !== 'zh')}>Eng</span>
    </button>);

}

/* ---------- floating back-to-top button ---------- */
function BackToTop() {
  const [show, setShow] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className="kx-glassbar" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top"
    onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => {setPress(false);setHover(false);}}
    style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 40, width: 52, height: 52, borderRadius: '50%',
      cursor: 'pointer', color: 'var(--site-text)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: show ? 1 : 0,
      transform: show ? `translateY(${hover && !press ? -4 : 0}px) scale(${press ? .88 : hover ? 1.08 : 1})` : 'translateY(14px) scale(.85)',
      pointerEvents: show ? 'auto' : 'none',
      transition: 'opacity .3s var(--ease-standard), transform .22s cubic-bezier(.22,.61,.36,1), box-shadow .22s' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: hover ? 'translateY(-2px)' : 'translateY(0)', transition: 'transform .22s cubic-bezier(.22,.61,.36,1)' }}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>);

}

/* ---------- footer ---------- */
function Marquee({ label }) {
  const pair = (k) =>
  <React.Fragment key={k}>
      <span className="kx-marquee-name" data-no-i18n>Kaylee Xiao</span>
      <span className="kx-marquee-sep" aria-hidden="true">◆</span>
      <span className="kx-marquee-title" data-no-i18n>{label}</span>
      <span className="kx-marquee-sep" aria-hidden="true">◆</span>
    </React.Fragment>;

  const run = (key) =>
  <span className="kx-marquee-run" key={key}>
      <span className="kx-marquee-now" data-no-i18n>Now Showing</span>
      <span className="kx-marquee-sep" aria-hidden="true">◆</span>
      {[0, 1, 2, 3, 4, 5].map(pair)}
    </span>;

  return (
    <div className="kx-marquee" aria-hidden="true">
      <div className="kx-marquee-track">{run('a')}{run('b')}</div>
    </div>);

}

/* ---------- ticket silhouette (real SVG geometry) ----------
   Two pieces: the main card and the stub. Each measures its host element so the
   punch bites stay perfectly circular at any size; together the two concave
   bites form the round perforation holes at the ends of the tear line. */
function TicketPiece({ side }) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (!host) return;
    const read = () => setBox(p => {
      const w = host.clientWidth, h = host.clientHeight;
      return (p.w === w && p.h === h) ? p : { w, h };
    });
    read();
    if (typeof ResizeObserver !== 'function') return;
    const ro = new ResizeObserver(read);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);
  const { w, h } = box;
  const R = 12,c = 10;
  // dotted perforation: real holes carved along the tear line (evenodd subpaths)
  const holes = () => {
    const r = 2.2,gap = 9.5,x = w - 1;
    let s = '';
    for (let y = R + gap; y < h - R; y += gap) {
      s += ` M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
    }
    return s;
  };
  // outline at inset t — t=0 is the silhouette itself, t>0 the stitch line
  const outline = (t) => {
    const r = R - t,q = c - t,x0 = t,y0 = t,x1 = w - t,y1 = h - t;
    return side === 'stub' ?
    ['M', x0 + r, y0, 'A', r, r, 0, 0, 1, x0, y0 + r, 'V', y1 - r,
    'A', r, r, 0, 0, 1, x0 + r, y1, 'H', x1 - q, 'Q', x1, y1, x1, y1 - q,
    'V', y0 + q, 'Q', x1, y0, x1 - q, y0, 'Z'].join(' ') :
    ['M', x0 + q, y0, 'H', x1 - r, 'A', r, r, 0, 0, 0, x1, y0 + r, 'V', y1 - r,
    'A', r, r, 0, 0, 0, x1 - r, y1, 'H', x0 + q, 'Q', x0, y1, x0, y1 - q,
    'V', y0 + q, 'Q', x0, y0, x0 + q, y0, 'Z'].join(' ');
  };
  // stitching skips the torn edge (open path, no perforation side)
  const stitchLine = (t) => {
    const r = R - t,q = c - t,x0 = t,y0 = t,x1 = w - t,y1 = h - t;
    return side === 'stub' ?
    ['M', x0 + r, y0, 'H', x1 - q, 'Q', x1, y0, x1, y0 + q, 'V', y1 - q,
    'Q', x1, y1, x1 - q, y1, 'H', x0 + r].join(' ') :
    ['M', x1 - r, y0, 'H', x0 + q, 'Q', x0, y0, x0, y0 + q, 'V', y1 - q,
    'Q', x0, y1, x0 + q, y1, 'H', x1 - r].join(' ');
  };
  let d = '',stitch = '';
  if (w > 2 * R && h > 2 * R) {
    d = outline(0) + (side === 'stub' ? '' : holes());
    stitch = outline(6);
  }
  return (
    <svg ref={ref} className={'kx-ticket-svg kx-ticket-svg--' + side} aria-hidden="true" width="100%" height="100%"
    viewBox={w && h ? `0 0 ${w} ${h}` : '0 0 1 1'} preserveAspectRatio="none">
      <path d={d} fillRule="evenodd" />
      <path className="kx-ticket-stitch" d={stitch} fill="none" />
    </svg>);

}

function Footer({ setPage }) {
  return (
    <footer style={{ background: 'var(--site-footer)', padding: '46px 30px 40px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <img src="assets/logos/icon.webp" alt="Kaylee Xiao — home" onClick={() => setPage('Home')}
        style={{ height: 84, width: 'auto', cursor: 'pointer' }} />
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {NAV.map((n) =>
          <a key={n} onClick={() => setPage(n)} style={{ cursor: 'pointer', fontFamily: 'var(--site-nav)',
            fontSize: 16, color: '#fff', opacity: .92, textDecoration: 'none' }}>{n}</a>
          )}
        </nav>
        <div style={{ fontFamily: 'var(--site-body)', fontSize: 14, color: '#fff', opacity: .85 }}>
          © {new Date().getFullYear()} Kaylee Xiao
        </div>
      </div>
    </footer>);

}

Object.assign(window, {
  KX_NAV: NAV, KX_IMG: IMG, KX_ILL: ILL,
  KXKicker: Kicker, KXH3: H3, KXH4: H4, KXP: P, KXHL: HL, KXU: U, KXTag: Tag,
  KXLetters: Letters, KXHeader: Header, KXHeroImg: HeroImg, KXCover: Cover, KXSection: Section, KXBand: Band,
  KXEntry: Entry, KXExploreCard: ExploreCard, KXBackToTop: BackToTop, KXLangSwitch: LangSwitch, KXProjectCard: ProjectCard, KXProjectModal: ProjectModal, KXFooter: Footer,
  KXTicketPiece: TicketPiece, KXMarquee: Marquee, KXStars: Stars, KXCarousel: Carousel, KXLightbox: Lightbox, KXZoomImg: ZoomImg,
  KXSiteButton: SiteButton, KXField: Field, KXThemeToggle: ThemeToggle, KXIcon: Icon,
  KXFolderIndex: FolderIndex
});