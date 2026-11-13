/* ============================================================
   Kaylee Xiao — Home page + 3 hero variants.
   ============================================================ */
(function () {
const Letters = window.KXLetters;
const { KXKicker, KXH3, KXP, KXHL, KXSection, KXBand, KXExploreCard, KXSiteButton, KX_IMG } = window;

const TAGLINE = "A student at NYU Steinhardt who loves to make things — video, music, graphic design, and anything creative.";

/* ---- typewriter line: types when scrolled into view, retypes on re-entry.
   The hidden ghost copy carries the real (translatable) text and reserves the
   final layout size; the visible overlay is typed character by character. */
function TypeLine({ lines }) {
  const srcRef = React.useRef(null);
  const outRef = React.useRef(null);
  React.useEffect(() => {
    const src = srcRef.current, out = outRef.current;
    if (!src || !out) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spans = Array.from(out.querySelectorAll('span'));
    const read = () => {
      const ls = [''];
      src.childNodes.forEach((n) => { if (n.nodeName === 'BR') ls.push(''); else ls[ls.length - 1] += n.textContent; });
      return ls;
    };
    let timer = null, visible = false;
    const fill = () => {
      const ls = read();
      spans.forEach((sp, i) => { sp.textContent = ls[i] || ''; sp.classList.remove('kx-caret-line'); });
      spans[spans.length - 1].classList.add('kx-caret-line');
    };
    const type = () => {
      clearInterval(timer);
      if (reduced) { fill(); return; }
      const ls = read();
      spans.forEach((sp) => { sp.textContent = ''; sp.classList.remove('kx-caret-line'); });
      let li = 0, ci = 0;
      spans[0].classList.add('kx-caret-line');
      timer = setInterval(() => {
        if (li >= ls.length || li >= spans.length) {
          clearInterval(timer);
          return;
        }
        ci++;
        spans[li].textContent = ls[li].slice(0, ci);
        if (ci >= ls[li].length) {
          li++;
          ci = 0;
          if (spans[li]) {
            spans[li - 1].classList.remove('kx-caret-line');
            spans[li].classList.add('kx-caret-line');
          }
        }
      }, 48);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !visible) { visible = true; type(); }
      else if (!e.isIntersecting && visible) {
        visible = false;
        clearInterval(timer);
        if (!reduced) spans.forEach((sp) => { sp.textContent = ''; sp.classList.remove('kx-caret-line'); });
      }
    }), { threshold: 0.4 });
    io.observe(src.parentElement);
    /* language switch rewrites the ghost — retype (or refill) with the new text */
    const mo = new MutationObserver(() => { if (visible) type(); });
    mo.observe(src, { childList: true, subtree: true, characterData: true });
    return () => { io.disconnect(); mo.disconnect(); clearInterval(timer); };
  }, []);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span ref={srcRef} style={{ visibility: 'hidden' }} aria-hidden="true">{lines.map((l, i) => <React.Fragment key={i}>{i > 0 ? <br /> : null}{l}</React.Fragment>)}</span>
      <span ref={outRef} className="kx-typewrite" data-no-i18n style={{ position: 'absolute', inset: 0 }}>{lines.map((l, i) => <React.Fragment key={i}>{i > 0 ? <br /> : null}<span></span></React.Fragment>)}</span>
    </span>
  );
}

/* ---- HERO A · floating cutout (centered, typographic) ---- */
function HeroFloat({ setPage }) {
  return (
    <div className="kx-stack-sec" style={{ position: 'sticky', top: 0, background: 'var(--site-cover-bg)', overflow: 'hidden',
      height: '100dvh', minHeight: 460,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <window.KXStars />
      <h1 data-no-i18n className="kx-hero-name" style={{ position: 'absolute', zIndex: 1, margin: 0, fontFamily: 'var(--site-display)',
        fontSize: 'clamp(64px,15vw,180px)', letterSpacing: '.04em', color: 'var(--site-text)',
        textAlign: 'center', lineHeight: .9, top: '50%', transform: 'translateY(-50%)', width: '100%' }}>
        <Letters text={'Kaylee\nXiao'} />
      </h1>
      <window.KXHeroImg src={KX_IMG + 'hero-portrait.png'} alt="Kaylee Xiao" className="kx-hero-portrait"
        baseTransform="translateX(-50%)" style={{ position: 'absolute', bottom: 0,
        left: '50%', zIndex: 2, height: 'calc((100dvh - var(--kx-header-h, 64px)) * .78)', width: 'auto',
        objectFit: 'contain', objectPosition: 'bottom' }} />
      <div className="kx-hero-ctas" style={{ position: 'absolute', bottom: 26, zIndex: 3, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <window.KXMagnetic><KXSiteButton onClick={() => setPage('Portfolio')}>View Portfolio</KXSiteButton></window.KXMagnetic>
        <window.KXMagnetic><button onClick={() => setPage('Contact')} style={ghostBtn}>Get in touch</button></window.KXMagnetic>
      </div>
    </div>
  );
}

/* ---- HERO B · editorial split ---- */
function HeroSplit({ setPage }) {
  return (
    <div style={{ background: 'var(--site-cover-bg)' }}>
      <div className="kx-hero-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr',
        gap: 40, alignItems: 'center', maxWidth: 1100, margin: '0 auto', padding: '70px 40px' }}>
        <div>
          <KXKicker>Hello, I'm</KXKicker>
          <h1 data-no-i18n style={{ margin: '0 0 .25em', fontFamily: 'var(--site-display)',
            fontSize: 'clamp(56px,8.5vw,110px)', lineHeight: .9, letterSpacing: '.03em', color: 'var(--site-text)' }}>
            <Letters text={'Kaylee\nXiao'} />
          </h1>
          <KXP style={{ fontSize: 21, maxWidth: 460 }}>{TAGLINE}</KXP>
          <div className="kx-hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 22 }}>
            <window.KXMagnetic><KXSiteButton onClick={() => setPage('Portfolio')}>View Portfolio</KXSiteButton></window.KXMagnetic>
            <window.KXMagnetic><button onClick={() => setPage('Contact')} style={ghostBtn}>Get in touch</button></window.KXMagnetic>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--site-container2)', borderRadius: 'var(--radius-site-lg)',
            padding: 18, boxShadow: '0 16px 40px rgba(0,0,0,.16)', maxWidth: 420, width: '100%' }}>
            <window.KXHeroImg src={KX_IMG + 'welcome-1000.webp'} alt="Kaylee" style={{ width: '100%', display: 'block',
              borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- HERO C · minimal band + avatar ---- */
function HeroMinimal({ setPage }) {
  return (
    <div style={{ background: 'var(--site-cover-bg)', minHeight: 520, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
        <window.KXHeroImg src={KX_IMG + 'highschool-1000.webp'} alt="Kaylee Xiao" style={{ width: 168, height: 168,
          objectFit: 'cover', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,.18)',
          border: '4px solid var(--site-bg)' }} />
        <div style={{ fontFamily: 'var(--site-nav)', fontSize: 18, letterSpacing: '.22em',
          textTransform: 'uppercase', color: 'var(--site-selected)', marginTop: 16 }}>Portfolio & Resume</div>
        <h1 data-no-i18n style={{ margin: '.1em 0', fontFamily: 'var(--site-display)', fontSize: 'clamp(58px,11vw,140px)',
          letterSpacing: '.05em', lineHeight: .9, color: 'var(--site-text)' }}><Letters text={'Kaylee Xiao'} /></h1>
        <KXP style={{ fontSize: 20, maxWidth: 540, textAlign: 'center' }}>{TAGLINE}</KXP>
        <div className="kx-hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
          <window.KXMagnetic><KXSiteButton onClick={() => setPage('Portfolio')}>View Portfolio</KXSiteButton></window.KXMagnetic>
          <window.KXMagnetic><button onClick={() => setPage('Contact')} style={ghostBtn}>Get in touch</button></window.KXMagnetic>
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  appearance: 'none', cursor: 'pointer', padding: '0.8em 1.6em',
  background: 'transparent', color: 'var(--site-text)',
  border: '2px solid var(--site-accent)', borderRadius: 'var(--radius-site)',
  fontFamily: 'var(--site-body)', fontWeight: 900, fontSize: '1.05em', letterSpacing: '.02em',
};

const HEROES = { float: HeroFloat, split: HeroSplit, minimal: HeroMinimal };

/* ---- HOME ---- */
function Home({ setPage, hero }) {
  const Hero = HEROES[hero] || HeroFloat;
  return (
    <>
      <Hero setPage={setPage} />
      <window.KXMarquee label="Home" />
      <KXSection bg="var(--site-container)" media={
        <window.KXLanyardBadge sceneHeight="100%"
          badgeImage={{ src: KX_IMG + 'welcome-1000.webp', alt: 'Kaylee' }}
          nameFont={{ fontSize: '15px', letterSpacing: '.12em', lineHeight: '1.1em', textAlign: 'left' }} />
      }>
        <KXKicker>Welcome</KXKicker>
        <KXH3><TypeLine lines={["Hi, I'm Kaylee —", 'nice to meet you!']} /></KXH3>
        <KXP>I'm Kaylee (<KXHL>Yingrui Xiao</KXHL>), a student at <KXHL>NYU Steinhardt</KXHL> studying
          Media, Culture, and Communication. I love to make things: <KXHL>music</KXHL>, <KXHL>video</KXHL>,
          <KXHL> design</KXHL>, and anything creative. Outside of class, I film and edit vlogs about my life as an
          international student, which have grown to <KXHL>357k+ likes</KXHL>.</KXP>
        <KXP>This website is where my education, experiences, and creative work live. Take a look around!</KXP>
      </KXSection>
      <KXBand bg="var(--site-container2)">
        <KXKicker>Explore</KXKicker>
        <KXH3 style={{ marginBottom: 28 }}>Where to next?</KXH3>
        <window.KXCorkboard setPage={setPage} />
      </KXBand>
    </>
  );
}

window.KXHome = Home;
})();
