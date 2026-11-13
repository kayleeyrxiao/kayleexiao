/* ============================================================
   Interactive lanyard ID badge — ported from the Framer component
   (InteractiveLanyardBadge). Framer runtime removed: useIsStaticRenderer
   and framer-motion's useInView are replaced by an IntersectionObserver,
   and the property controls become plain props with the same defaults.
   Spring constants, tilt limits and drag clamps are kept verbatim so the
   motion feel matches the Framer preview exactly.
   ============================================================ */

const KX_BADGE_IMG = 'https://framerusercontent.com/images/MqWZJ6cj6Kf379YJL6LSP06WA.webp?width=1000&height=1333';

function LanyardBadge({
  strapColor = '#F8F2E4',
  sceneHeight = 720,
  enableInteraction = true,
  textColor = '#000000',
  name = 'KAYLEE XIAO',
  nameFont = { fontSize: '16px', letterSpacing: '.12em', lineHeight: '1.1em', textAlign: 'left' },
  badgeImage = { src: KX_BADGE_IMG, alt: 'Portrait on Kaylee Xiao’s badge' },
  style
}) {
  const stageRef = React.useRef(null);
  const badgeRef = React.useRef(null);
  const strapRef = React.useRef(null);
  const strapHighlightRef = React.useRef(null);
  const hardwareRef = React.useRef(null);
  const targetRef = React.useRef({ x: 0, y: 0, dragY: 0, hasPointer: false });
  const motionRef = React.useRef({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, t: 0 });
  const dragRef = React.useRef({ isPressing: false, isDragging: false, startY: 0, pointerId: -1 });
  const rafRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  /* first-reveal drop: badge starts lifted (strap slack) and falls into the strap,
     stretching it past rest and springing back — the drag spring does the work */
  const hasDroppedRef = React.useRef(false);
  const dropUntilRef = React.useRef(0);

  /* stand in for framer-motion useInView({margin:'120px', amount:.2}) */
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { rootMargin: '120px', threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldAnimate = inView && enableInteraction;
  /* strap travel base is measured from the rendered stage, so sceneHeight may be
     a CSS length ('100%') as well as a number */
  const strapBaseRef = React.useRef(typeof sceneHeight === 'number' ? sceneHeight * 0.15 : 108);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => { strapBaseRef.current = el.offsetHeight * 0.15; });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setTargetFromEvent = React.useCallback((clientX, clientY) => {
    const badge = badgeRef.current;
    if (!badge) return;
    const rect = badge.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width - 0.5;
    const ny = (clientY - rect.top) / rect.height - 0.5;
    const maxTiltY = 26, maxTiltX = 21;
    targetRef.current.x = Math.max(-1, Math.min(1, ny)) * -maxTiltX;
    targetRef.current.y = Math.max(-1, Math.min(1, nx)) * maxTiltY;
    targetRef.current.hasPointer = true;
  }, []);

  const endDrag = React.useCallback(() => {
    dragRef.current.isPressing = false;
    dragRef.current.isDragging = false;
    dragRef.current.pointerId = -1;
    targetRef.current.dragY = 0;
  }, []);

  const lastFlickRef = React.useRef(0);
  const handlePointerEnter = React.useCallback(() => {
    const now = Date.now();
    if (now - lastFlickRef.current < 260) return;
    lastFlickRef.current = now;
    if (window.KXPolaroidSound) window.KXPolaroidSound('pageflick', 1);
  }, []);

  const handlePointerMove = React.useCallback((event) => {
    if (!enableInteraction) return;
    if (dragRef.current.isPressing && !dragRef.current.isDragging) {
      if (event.clientY - dragRef.current.startY > 4) dragRef.current.isDragging = true;
      else { setTargetFromEvent(event.clientX, event.clientY); return; }
    }
    if (dragRef.current.isDragging) {
      targetRef.current.dragY = Math.max(0, Math.min(44, event.clientY - dragRef.current.startY));
      return;
    }
    setTargetFromEvent(event.clientX, event.clientY);
  }, [enableInteraction, setTargetFromEvent]);

  const handlePointerDown = React.useCallback((event) => {
    if (!enableInteraction) return;
    dragRef.current.isPressing = true;
    dragRef.current.isDragging = false;
    dragRef.current.startY = event.clientY;
    dragRef.current.pointerId = event.pointerId;
    targetRef.current.dragY = 0;
    setTargetFromEvent(event.clientX, event.clientY);
    if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId);
  }, [enableInteraction, setTargetFromEvent]);

  const handlePointerUp = React.useCallback((event) => {
    if (!enableInteraction) return;
    endDrag();
    setTargetFromEvent(event.clientX, event.clientY);
  }, [enableInteraction, endDrag, setTargetFromEvent]);

  const handlePointerLeave = React.useCallback(() => {
    endDrag();
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    targetRef.current.hasPointer = false;
  }, [endDrag]);

  const handleTouchMove = React.useCallback((event) => {
    if (!enableInteraction || event.touches.length === 0) return;
    const touch = event.touches[0];
    if (dragRef.current.isPressing && !dragRef.current.isDragging) {
      if (touch.clientY - dragRef.current.startY > 4) dragRef.current.isDragging = true;
      else { setTargetFromEvent(touch.clientX, touch.clientY); return; }
    }
    if (dragRef.current.isDragging) {
      targetRef.current.dragY = Math.max(0, Math.min(44, touch.clientY - dragRef.current.startY));
      event.preventDefault();
      return;
    }
    setTargetFromEvent(touch.clientX, touch.clientY);
  }, [enableInteraction, setTargetFromEvent]);

  const handleTouchStart = React.useCallback((event) => {
    if (!enableInteraction || event.touches.length === 0) return;
    const touch = event.touches[0];
    dragRef.current.isPressing = true;
    dragRef.current.isDragging = false;
    dragRef.current.startY = touch.clientY;
    targetRef.current.dragY = 0;
    setTargetFromEvent(touch.clientX, touch.clientY);
  }, [enableInteraction, setTargetFromEvent]);

  const handleTouchEnd = React.useCallback(() => {
    endDrag();
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    targetRef.current.hasPointer = false;
  }, [endDrag]);

  React.useEffect(() => {
    if (!shouldAnimate) {
      const badge = badgeRef.current, strap = strapRef.current;
      const hl = strapHighlightRef.current, hw = hardwareRef.current;
      const pre = hasDroppedRef.current ? 0 : -strapBaseRef.current * 0.86;
      const preScale = Math.max(0.06, 1 + pre / strapBaseRef.current);
      if (badge) badge.style.transform = `translateX(-50%) rotateX(6deg) rotateY(-4deg) translateY(${pre.toFixed(2)}px) translateZ(0px)`;
      if (strap) strap.style.transform = `translateX(-50%) scaleY(${preScale.toFixed(4)})`;
      if (hl) hl.style.transform = `translateX(-50%) scaleY(${preScale.toFixed(4)})`;
      if (hw) hw.style.transform = `translate(-50%, -50%) translateY(${pre.toFixed(2)}px)`;
      return;
    }
    let previous = window.performance.now();
    motionRef.current.t = previous;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasDroppedRef.current) {
      hasDroppedRef.current = true;
      if (!reduce) {
        motionRef.current.z = -strapBaseRef.current * 0.86;
        motionRef.current.vz = 0;
        motionRef.current.vy = 52; /* slight swing as it falls */
        dropUntilRef.current = previous + 1800;
      }
    }
    const animate = (now) => {
      const badge = badgeRef.current, strap = strapRef.current;
      const hl = strapHighlightRef.current, hw = hardwareRef.current;
      if (!badge) return;
      const dt = Math.min(0.033, (now - previous) / 1e3);
      previous = now;
      const m = motionRef.current, t = targetRef.current;
      const dropping = now < dropUntilRef.current && !t.hasPointer;
      const spring = 130, damping = 18;
      const dragSpring = dropping ? 96 : 170, dragDamping = dropping ? 7.4 : 20;
      const ax = (t.x - m.x) * spring - m.vx * damping;
      const ay = (t.y - m.y) * spring - m.vy * damping;
      const az = (t.dragY - m.z) * dragSpring - m.vz * dragDamping;
      m.vx += ax * dt; m.vy += ay * dt; m.vz += az * dt;
      m.x += m.vx * dt; m.y += m.vy * dt; m.z += m.vz * dt;
      const dragVisual = Math.max(-strapBaseRef.current * 0.94, m.z);
      /* negative = badge lifted and strap slack; positive = strap stretched by the drag */
      const strapScale = 1 + dragVisual / strapBaseRef.current;
      const hardwareY = dragVisual;
      badge.style.transform = `translateX(-50%) rotateX(${m.x.toFixed(3)}deg) rotateY(${m.y.toFixed(3)}deg) translateY(${dragVisual.toFixed(3)}px) translateZ(0px)`;
      if (strap) strap.style.transform = `translateX(-50%) scaleY(${strapScale.toFixed(4)})`;
      if (hl) hl.style.transform = `translateX(-50%) scaleY(${strapScale.toFixed(4)})`;
      if (hw) hw.style.transform = `translate(-50%, -50%) translateY(${hardwareY.toFixed(3)}px)`;
      rafRef.current = window.requestAnimationFrame(animate);
    };
    rafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [enableInteraction, shouldAnimate]);

  const responsiveNameSize = typeof nameFont.fontSize === 'number' ? `${nameFont.fontSize}px` : (nameFont.fontSize ?? '16px');
  const metal = 'url(#kxMetalA)';

  return (
    <section ref={stageRef} role="img" aria-label="Interactive lanyard ID badge" style={{
      position: 'relative', width: '100%', height: sceneHeight, background: 'transparent',
      overflow: 'visible', clipPath: 'inset(0 -100vw -100vh -100vw)', perspective: 860, touchAction: 'auto', userSelect: 'none',
      WebkitUserSelect: 'none', ...style
    }}>
      <div className="kx-lanyard-drop"
        style={{ position: 'absolute', inset: 0, perspective: 860 }}>
      <div ref={strapRef} aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', transformOrigin: '50% 0%',
        width: 'min(25vw, 143px)', height: '15%', borderRadius: 10,
        background: `linear-gradient(180deg, rgba(255,252,243,0.98) 0%, ${strapColor} 18%, rgba(250,245,232,0.98) 46%, ${strapColor} 74%, rgba(235,228,211,0.95) 100%)`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -3px 8px rgba(0,0,0,0.15), 0 18px 24px rgba(0,0,0,0.18)',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.26) 0px, rgba(255,255,255,0.26) 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 3px)', mixBlendMode: 'multiply' }}></div>
      </div>
      <div ref={strapHighlightRef} aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '1.4%', transform: 'translateX(-50%)', transformOrigin: '50% 0%',
        width: 'min(22vw, 126px)', height: '12.5%', borderRadius: 8,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none'
      }}></div>
      <div ref={hardwareRef} aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '13.8%', transform: 'translate(-50%, -50%)',
        width: 96, height: 112, filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.22))'
      }}>
        <svg viewBox="0 0 96 112" width="96" height="112">
          <defs>
            <linearGradient id="kxMetalA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8f8f8"></stop>
              <stop offset="35%" stopColor="#c8c8c8"></stop>
              <stop offset="68%" stopColor="#f3f3f3"></stop>
              <stop offset="100%" stopColor="#9f9f9f"></stop>
            </linearGradient>
            <linearGradient id="kxMetalB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)"></stop>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"></stop>
            </linearGradient>
          </defs>
          <rect x="35" y="4" width="26" height="12" rx="6" fill={metal} opacity="0.88"></rect>
          <path d="M48 20 C36 20 26 30 26 42 C26 54 36 64 48 64 C60 64 70 54 70 42 C70 30 60 20 48 20 Z M48 28 C55 28 62 35 62 42 C62 49 55 56 48 56 C41 56 34 49 34 42 C34 35 41 28 48 28 Z" fill={metal} fillRule="evenodd"></path>
          <rect x="44" y="61" width="8" height="22" rx="4" fill={metal}></rect>
          <path d="M48 83 C58 83 66 88 66 96 C66 104 58 109 48 109 C38 109 30 104 30 96 C30 88 38 83 48 83 Z M48 88 C41.6 88 36.5 91.4 36.5 96 C36.5 100.6 41.6 104 48 104 C54.4 104 59.5 100.6 59.5 96 C59.5 91.4 54.4 88 48 88 Z" fill={metal} fillRule="evenodd"></path>
          <rect x="46.6" y="102" width="2.8" height="10" rx="1.4" fill={metal}></rect>
          <ellipse cx="43.5" cy="30" rx="9" ry="7" fill="url(#kxMetalB)"></ellipse>
        </svg>
      </div>
      <div ref={badgeRef}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerCancel={handlePointerLeave} onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}
        style={{
          position: 'absolute', left: '50%', top: '19%', height: 'min(66%, 575px)', width: 'auto', aspectRatio: '0.73',
          containerType: 'inline-size',
          transform: 'translateX(-50%) rotateX(6deg) rotateY(-4deg) translateZ(0px)', transformStyle: 'preserve-3d',
          cursor: 'grab'
        }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          background: 'linear-gradient(145deg, rgba(237,231,216,0.94) 0%, rgba(224,216,197,0.92) 48%, rgba(203,194,172,0.9) 100%)',
          transform: 'translate3d(6px, 10px, -16px)',
          boxShadow: '0 36px 44px rgba(0,0,0,0.33), 0 12px 20px rgba(0,0,0,0.2)'
        }}></div>
        <div aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: -10, width: '34%', height: 20, transform: 'translateX(-50%)',
          borderRadius: 10, background: 'linear-gradient(180deg, rgba(213,204,184,0.95), rgba(240,234,220,0.95))',
          boxShadow: '0 6px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(0,0,0,0.08)'
        }}></div>
        <article aria-label="ID badge content" style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          background: 'linear-gradient(156deg, rgba(255,253,246,1) 0%, rgba(251,246,234,1) 46%, rgba(243,236,220,1) 100%)',
          boxShadow: '0 30px 42px rgba(0,0,0,0.31), 0 12px 20px rgba(0,0,0,0.18), inset 0 2px 1px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(226,218,199,0.88)'
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 2, borderRadius: 22, background: 'linear-gradient(125deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0.08) 100%)', pointerEvents: 'none' }}></div>
          <div aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: 10, width: '30%', height: 12, transform: 'translateX(-50%)',
            borderRadius: 3, background: 'linear-gradient(180deg, rgba(20,20,20,0.28) 0%, rgba(0,0,0,0.16) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.24)'
          }}></div>
          <div style={{
            position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
            padding: 'clamp(16px, 3.2vw, 24px)', boxSizing: 'border-box', color: textColor
          }}>
            <h2 style={{
              margin: '12px 0 10px 0', fontSize: `clamp(10px, 6cqw, ${responsiveNameSize})`, fontWeight: 300,
              fontStyle: nameFont.fontStyle, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              letterSpacing: nameFont.letterSpacing, lineHeight: nameFont.lineHeight, textAlign: nameFont.textAlign,
              textTransform: 'uppercase'
            }}>{name}</h2>
            <div aria-hidden="true" style={{
              marginTop: 4, height: 'calc(100% - 56px)', borderRadius: 18, border: '1px solid rgba(0,0,0,0.11)',
              overflow: 'hidden', background: 'linear-gradient(145deg, rgba(250,245,233,0.95) 0%, rgba(238,231,213,0.8) 100%)',
              boxShadow: 'inset 0 2px 1px rgba(255,255,255,0.75), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 16px rgba(0,0,0,0.12)',
              position: 'relative'
            }}>
              <img src={badgeImage.src} srcSet={badgeImage.srcSet} alt={badgeImage.alt || 'Portrait image on badge'} draggable="false" onDragStart={(e) => e.preventDefault()} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none', WebkitUserDrag: 'none' }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 24%, rgba(0,0,0,0) 54%, rgba(0,0,0,0.1) 100%)', pointerEvents: 'none' }}></div>
            </div>
          </div>
        </article>
      </div>
      </div>
    </section>
  );
}

Object.assign(window, { KXLanyardBadge: LanyardBadge, KX_BADGE_IMG });
