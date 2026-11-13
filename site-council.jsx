/* Student Council photo layouts — switchable from Tweaks (Education → Council photos) */
const KX_COUNCIL = [
  { src: 'assets/studentcouncil.webp', label: 'Student Council', fav: true },
  { src: 'assets/council-choir.jpg', label: 'Choir', fav: true },
  { src: 'assets/council-thanksgiving.jpg', label: 'Thanksgiving Week' },
  { slot: 'council-4', label: 'WeChat content' },
  { slot: 'council-5', label: 'Choir' }].slice(0, 3);

const councilCss = `
.kc-ph{width:100%;height:100%;display:block;object-fit:cover}
/* 1 clipboard */
.kc-clip{position:relative;max-width:440px;margin:0 auto;padding:46px 22px 24px;border-radius:14px;background:#a9845c;background-image:radial-gradient(rgba(0,0,0,.06) 1px,transparent 1px);background-size:5px 5px;box-shadow:0 18px 34px -16px rgba(50,30,15,.6),inset 0 0 0 2px rgba(255,255,255,.12)}
.kc-clip-metal{position:absolute;top:-14px;left:50%;width:150px;height:46px;margin-left:-75px;border-radius:10px 10px 6px 6px;background:linear-gradient(#e4e2de,#a7a39d);box-shadow:0 4px 8px rgba(0,0,0,.3),inset 0 1px 0 #fff;z-index:3}
.kc-clip-metal::before{content:'';position:absolute;top:8px;left:50%;width:36px;height:12px;margin-left:-18px;border-radius:8px;background:#8d8983;box-shadow:inset 0 2px 3px rgba(0,0,0,.4)}
.kc-clip-paper{position:relative;background:#fbf8f1;border-radius:3px;padding:20px 18px 16px;box-shadow:0 2px 0 #eee6d6,0 4px 0 #e2d8c4}
.kc-clip-stack{position:relative;aspect-ratio:4/3;margin-bottom:30px}
.kc-clip-stack>div{position:absolute;inset:0;background:#fff;padding:6px;box-shadow:0 4px 10px rgba(0,0,0,.15);transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .3s}
.kc-clip-hd{display:flex;justify-content:space-between;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8a7f72;border-bottom:1.5px solid #3a2f29;padding-bottom:6px;margin-bottom:4px}
.kc-clip-li{display:grid;grid-template-columns:22px 1fr auto;align-items:center;gap:8px;padding:7px 4px;border-bottom:1px dashed rgba(62,50,40,.2);font-family:var(--site-body);font-size:14px;color:var(--site-text);cursor:pointer;transition:background .2s}
.kc-clip-li:hover,.kc-clip-li.on{background:color-mix(in srgb,var(--site-selected) 14%,transparent)}
.kc-clip-li i{font-style:normal;font-family:ui-monospace,monospace;font-size:11px;color:#8a7f72}
.kc-clip-box{width:14px;height:14px;border:1.5px solid #3a2f29;border-radius:2px;position:relative}
.kc-clip-li.on .kc-clip-box::after{content:'';position:absolute;left:3px;top:-3px;width:5px;height:10px;border:solid var(--site-selected);border-width:0 2.5px 2.5px 0;transform:rotate(40deg)}
/* 2 poster wall */
.kc-wall{position:relative;max-width:460px;margin:0 auto;aspect-ratio:4/4.6}
.kc-post{position:absolute;inset:6% 8% 8% 8%;background:#f7f1e3;padding:12px 12px 30px;box-shadow:0 10px 24px -8px rgba(40,25,15,.45);cursor:pointer;clip-path:polygon(0 0,100% 0,100% 96%,94% 99%,86% 96%,77% 100%,68% 97%,58% 100%,49% 96%,40% 99%,31% 96%,22% 100%,13% 97%,5% 100%,0 96%);transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.kc-post .ph{width:100%;height:100%;overflow:hidden}
.kc-post:not(:first-child) b{visibility:hidden}.kc-post b{position:absolute;left:14px;bottom:8px;font-family:var(--site-heading);font-weight:400;font-size:17px;letter-spacing:.04em;text-transform:uppercase;color:#3a2f29}
.kc-post::before,.kc-post::after{content:'';position:absolute;top:5px;width:14px;height:4px;background:linear-gradient(#ddd,#999);border-radius:1px;box-shadow:0 1px 1px rgba(0,0,0,.3)}
.kc-post::before{left:12px;transform:rotate(-8deg)}.kc-post::after{right:12px;transform:rotate(6deg)}
.kc-post.rip{animation:kcRip .55s cubic-bezier(.5,0,.75,0) forwards}
@keyframes kcRip{0%{transform:var(--t)}35%{transform:var(--t) rotate(-4deg) translateY(-8px)}100%{transform:translate(-30%,110%) rotate(-28deg);opacity:0}}
.kc-wall-hint{position:absolute;left:0;right:0;bottom:-26px;text-align:center;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8a7f72}
/* 3 contact sheet */
.kc-sheet{position:relative;max-width:460px;margin:0 auto;background:#1d1a18;padding:16px 14px 14px;border-radius:3px;box-shadow:0 16px 30px -14px rgba(0,0,0,.6);cursor:none}
.kc-sheet-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 8px}
.kc-fr{position:relative}
.kc-fr .ph{aspect-ratio:3/2;overflow:hidden;filter:saturate(.85)}
.kc-fr small{display:flex;justify-content:space-between;margin-top:4px;font-family:ui-monospace,monospace;font-size:8.5px;letter-spacing:.12em;color:#e8b04a}
.kc-fr.fav::after{content:'';position:absolute;inset:-7px -6px 8px -6px;border:2.5px solid #e2412f;border-radius:50% 46% 52% 44%/48% 55% 45% 52%;transform:rotate(-4deg);opacity:.9;pointer-events:none}
.kc-sheet-note{grid-column:span 1;display:flex;align-items:center;justify-content:center;font-family:'Caveat','Bradley Hand',cursive;font-size:22px;color:#e2412f;transform:rotate(-6deg)}
.kc-loupe{position:absolute;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;overflow:hidden;pointer-events:none;border:6px solid #2b2724;box-shadow:0 0 0 2px #6d665f,0 14px 26px rgba(0,0,0,.5),inset 0 0 20px rgba(0,0,0,.35);background:#111;transition:opacity .2s,transform .2s;z-index:5}
.kc-loupe .ph{position:absolute;inset:0}
.kc-loupe::after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 40%)}
/* 4 ballot box */
.kc-ballot{position:relative;max-width:460px;margin:0 auto;height:470px}
.kc-bal{position:absolute;left:50%;bottom:118px;width:146px;margin-left:-73px;background:#fdfbf6;padding:8px 8px 10px;box-shadow:0 6px 16px -6px rgba(0,0,0,.35);transform:translateY(80px) scale(.9);opacity:0;transition:transform .8s cubic-bezier(.2,.9,.3,1.15),opacity .3s;z-index:1;cursor:pointer}
.kc-ballot.in .kc-bal{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r))}
.kc-ballot.in .kc-bal:hover{transform:translate(var(--x),calc(var(--y) - 12px)) rotate(0deg) scale(1.08);z-index:4}
.kc-bal .ph{aspect-ratio:4/3;overflow:hidden}
.kc-bal div.ln{display:flex;align-items:center;gap:6px;margin-top:7px;font-family:ui-monospace,monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#3a2f29}
.kc-bal div.ln span{width:11px;height:11px;border:1.3px solid #3a2f29;display:flex;align-items:center;justify-content:center;font-size:10px;line-height:1;color:var(--site-selected);font-weight:700}
.kc-box{position:absolute;left:50%;bottom:0;width:260px;margin-left:-130px;height:150px;z-index:3}
.kc-box-top{position:absolute;left:-14px;right:-14px;top:0;height:22px;background:#2f4a5c;border-radius:4px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.2)}
.kc-box-top::after{content:'';position:absolute;left:50%;top:7px;width:180px;height:7px;margin-left:-90px;background:#0f1b22;border-radius:4px}
.kc-box-front{position:absolute;inset:22px 0 0;background:linear-gradient(#3e6278,#2f4a5c);border-radius:0 0 6px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#f3ecdc;box-shadow:0 18px 26px -14px rgba(0,0,0,.5)}
.kc-box-front b{font-family:var(--site-heading);font-weight:400;font-size:28px;letter-spacing:.2em}
.kc-box-front small{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.25em;text-transform:uppercase;opacity:.85}
/* 6 strip reel */
.kc-reel{position:relative;max-width:520px;margin:0 auto;overflow:hidden;padding:18px 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.kc-reel-track{display:flex;gap:22px;width:max-content;animation:kcReel 38s linear infinite}
.kc-reel:hover .kc-reel-track{animation-play-state:paused}
@keyframes kcReel{to{transform:translateX(-50%)}}
.kc-strip{width:128px;flex:0 0 auto;background:#fdfbf6;padding:8px 8px 26px;display:flex;flex-direction:column;gap:6px;box-shadow:0 10px 20px -8px rgba(0,0,0,.35);transform:rotate(var(--r));position:relative;transition:transform .3s}
.kc-strip:hover{transform:rotate(0) translateY(-6px)}
.kc-strip .ph{aspect-ratio:1/1;overflow:hidden;filter:grayscale(.15) contrast(1.03)}
.kc-strip small{position:absolute;left:0;right:0;bottom:7px;text-align:center;font-family:'Caveat','Bradley Hand',cursive;font-size:16px;color:#3a2f29}
@media (prefers-reduced-motion:reduce){.kc-reel-track{animation:none}}
/* 7 tri-fold flyer */
.kc-tri{position:relative;max-width:480px;margin:0 auto;perspective:1700px;cursor:pointer}
.kc-tri-row{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));transform-style:preserve-3d}
.kc-tri-p{position:relative;transform-style:preserve-3d;transition:transform 1s cubic-bezier(.6,.05,.25,1)}
.kc-tri-p.l{transform-origin:100% 50%;transform:rotateY(179.6deg);z-index:3}
.kc-tri-p.r{transform-origin:0 50%;transform:rotateY(-179.2deg);z-index:2}
.kc-tri.open .kc-tri-p.l{transform:rotateY(0)}
.kc-tri.open .kc-tri-p.r{transform:rotateY(0);transition-delay:.55s}
.kc-tri:not(.open) .kc-tri-p.l{transition-delay:.5s}
.kc-tri-f{background:#fbf8f1;padding:10px 9px 14px;display:flex;flex-direction:column;gap:9px;-webkit-backface-visibility:hidden;backface-visibility:hidden;height:100%;box-sizing:border-box;box-shadow:0 14px 22px -12px rgba(50,30,15,.35)}
.kc-tri-p.l .kc-tri-f{background-image:linear-gradient(270deg,rgba(62,50,40,.1),transparent 14%)}
.kc-tri-p.r .kc-tri-f{background-image:linear-gradient(90deg,rgba(62,50,40,.1),transparent 14%)}
.kc-tri-f .ph{aspect-ratio:3/4.3;overflow:hidden}
.kc-tri-f b{font-family:var(--site-heading);font-weight:400;font-size:12.5px;line-height:1.15;letter-spacing:0;overflow-wrap:anywhere;text-transform:uppercase;color:#3a2f29;text-wrap:balance}
.kc-tri-f i{font-style:normal;font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.2em;color:#8a7f72}
.kc-tri-b{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden;box-shadow:0 14px 22px -12px rgba(50,30,15,.35);transform:rotateY(180deg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:16px;box-sizing:border-box}
.kc-tri-p.l .kc-tri-b{background:var(--site-selected);color:#fbf8f1}
.kc-tri-p.l .kc-tri-b b{font-family:var(--site-heading);font-weight:400;font-size:24px;line-height:1;letter-spacing:.06em;text-transform:uppercase}
.kc-tri-p.l .kc-tri-b small{font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.24em;text-transform:uppercase}
.kc-tri-seal{width:46px;height:46px;border-radius:50%;border:1.5px solid currentColor;display:flex;align-items:center;justify-content:center;font-family:var(--site-heading);font-size:20px}
.kc-tri-p.r .kc-tri-b{background:#f1ebde;background-image:repeating-linear-gradient(transparent 0 15px,rgba(62,50,40,.09) 15px 16px)}
.kc-tri-hint{margin-top:16px;text-align:center;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8a7f72}
@media (prefers-reduced-motion:reduce){.kc-tri-p{transition:none}}
.kc-tvs{position:relative;width:100%;max-width:480px;margin:0 auto;aspect-ratio:1}
.kc-tvs::after{content:"";position:absolute;left:-4%;right:-4%;bottom:-3%;height:6%;border-radius:50%;background:radial-gradient(closest-side,rgba(40,24,16,.35),transparent);z-index:0}
.kc-tv{position:absolute;z-index:1;box-sizing:border-box;border-radius:7px;background:var(--b);box-shadow:inset 0 2px 0 rgba(255,255,255,.14),inset 0 -5px 0 rgba(0,0,0,.25),0 8px 14px -8px rgba(30,18,10,.6);display:flex;gap:6px;padding:7px 7px 11px;transform:rotate(var(--r))}
.kc-tv.g-l{flex-direction:row-reverse}
.kc-tv-scr{position:relative;flex:1;border-radius:16%/20%;overflow:hidden;background:#141110;box-shadow:0 0 0 3px rgba(0,0,0,.45),inset 0 0 12px rgba(0,0,0,.9)}
.kc-tv-side{width:12%;display:flex;flex-direction:column;gap:5px;padding-top:2px}
.kc-tv-side i{display:block;flex:1;background:repeating-linear-gradient(90deg,rgba(0,0,0,.4) 0 1.5px,transparent 1.5px 3.5px);border-radius:2px}
.kc-tv-side b{display:block;width:70%;aspect-ratio:1;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 35% 35%,#7a7069,#211c19);box-shadow:0 1px 1px rgba(0,0,0,.5)}
.kc-tv-led{position:absolute;right:6%;bottom:3.5%;width:4px;height:4px;border-radius:50%;background:#3a1a14;transition:background .2s,box-shadow .2s}
.kc-tvs.on .kc-tv-led{background:#ff6a4a;box-shadow:0 0 5px #ff6a4a;transition-delay:var(--d)}
.kc-tv-img{position:absolute;inset:0;transform:scale(0,.004);opacity:0;background:#d9ddd7}
.kc-tvs.on .kc-tv-img{animation:kcTvOn .9s cubic-bezier(.2,.7,.2,1) var(--d) forwards}
.kc-tv-img.blank{background:linear-gradient(transparent 0 42%,rgba(255,255,255,.7) 47%,rgba(30,30,30,.35) 53%,transparent 58%) 0 0/100% 300% no-repeat,#c9ccc8;box-shadow:inset 0 0 26px rgba(40,50,48,.6)}
.kc-tvs.on .kc-tv-img.blank{animation:kcTvOn .9s cubic-bezier(.2,.7,.2,1) var(--d) forwards,kcTvBand var(--bt,3s) linear infinite,kcTvJit .22s steps(2) infinite}
@keyframes kcTvBand{from{background-position:0 120%,0 0}to{background-position:0 -20%,0 0}}
@keyframes kcTvJit{0%{filter:brightness(1.05) contrast(1.3)}50%{filter:brightness(.88) contrast(1.15)}}
.kc-tv-img.blank::before{content:"";position:absolute;inset:-50%;opacity:.9;mix-blend-mode:multiply;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .2 0 0 0 0 .2 0 0 0 0 .2 0 0 0 1.6 -.3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");animation:kcTvSnow .55s steps(5) infinite}
.kc-tv-img::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(rgba(0,0,0,.14) 0 1px,transparent 1px 3px),radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(0,0,0,.35));mix-blend-mode:multiply}
.kc-tv-glass{position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(150deg,rgba(255,255,255,.2),transparent 38%)}
.kc-tv-osd{position:absolute;left:8%;top:7%;z-index:2;font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.12em;color:#b8ffc4;text-shadow:0 0 4px rgba(120,255,150,.8);opacity:0;pointer-events:none;text-transform:uppercase;white-space:nowrap}
.kc-tvs.on .kc-tv-osd{animation:kcTvOsd 2.6s steps(1) calc(var(--d) + .7s) forwards}
.kc-tv.ph-tv:hover .kc-tv-osd{animation:none;opacity:1}
.kc-tv.ph-tv .kc-tv-osd b{display:none;font-weight:400}
.kc-tv.ph-tv:hover .kc-tv-osd b{display:inline}
@keyframes kcTvOn{0%{transform:scale(0,.004);opacity:1;filter:brightness(4)}35%{transform:scale(1,.004);filter:brightness(4)}62%{transform:scale(1,1);filter:brightness(2.2)}78%{filter:brightness(.8)}88%{filter:brightness(1.3)}100%{transform:none;opacity:1;filter:none}}
@keyframes kcTvSnow{0%{transform:translate(0,0)}25%{transform:translate(-12%,8%)}50%{transform:translate(9%,-14%)}75%{transform:translate(-6%,-4%)}100%{transform:translate(4%,12%)}}
@keyframes kcTvOsd{0%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.kc-tvs.on .kc-tv-img{animation:none;transform:none;opacity:1}.kc-tv-img.blank::before{animation:none}}
`;

function KCPh({ p }) {
  return p.src ? <img className="kc-ph" src={p.src} alt={p.label}></img> :
    <image-slot id={p.slot} shape="rect" radius="0" placeholder={p.label} style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>;
}

function KCClipboard({ ps }) {
  const [a, setA] = React.useState(0);
  return (
    <div className="kc-clip"><span className="kc-clip-metal"></span>
      <div className="kc-clip-paper">
        <div className="kc-clip-stack">
          {ps.map((p, i) => {
            const d = (i - a + ps.length) % ps.length;
            return <div key={i} style={{ zIndex: ps.length - d, transform: d ? 'rotate(' + (d % 2 ? 3 : -3) * Math.min(d, 2) + 'deg) translate(' + d * 4 + 'px,' + d * 3 + 'px)' : 'none', opacity: d > 2 ? 0 : 1 }}><KCPh p={p}></KCPh></div>;
          })}
        </div>
        <div className="kc-clip-hd"><span>Agenda</span><span>2022 – 2024</span></div>
        {ps.map((p, i) => (
          <div key={i} className={'kc-clip-li' + (i === a ? ' on' : '')} onPointerEnter={() => setA(i)} onClick={() => setA(i)}>
            <span className="kc-clip-box"></span><span>{p.label}</span><i>{String(i + 1).padStart(2, '0')}</i>
          </div>))}
      </div>
    </div>);
}

function KCPosters({ ps }) {
  const [order, setOrder] = React.useState(ps.map((_, i) => i));
  const [rip, setRip] = React.useState(false);
  const tf = ['rotate(-2deg)', 'rotate(3deg) translate(10px,-6px)', 'rotate(-4deg) translate(-12px,8px)', 'rotate(2deg) translate(8px,12px)', 'rotate(-1deg) translate(-6px,-10px)'];
  const tear = () => { if (rip) return; setRip(true); window.KXPaperFlick && window.KXPaperFlick(); setTimeout(() => { setOrder((o) => [...o.slice(1), o[0]]); setRip(false); }, 550); };
  return (
    <div className="kc-wall">
      {order.map((pi, k) => {
        const p = ps[pi], t = tf[pi % tf.length];
        return <div key={pi} className={'kc-post' + (k === 0 && rip ? ' rip' : '')} onClick={k === 0 ? tear : undefined}
          style={{ zIndex: ps.length - k, transform: t, '--t': t }}><div className="ph"><KCPh p={p}></KCPh></div><b>{p.label}</b></div>;
      })}
      <div className="kc-wall-hint">Click to tear away</div>
    </div>);
}

function KCSheet({ ps }) {
  const ref = React.useRef(null);
  const [lp, setLp] = React.useState(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const fr = e.target.closest && e.target.closest('.kc-fr');
    if (!fr) { setLp(null); return; }
    const f = fr.querySelector('.ph').getBoundingClientRect();
    setLp({ x: e.clientX - r.left, y: e.clientY - r.top, i: +fr.dataset.i, fx: (e.clientX - f.left) / f.width, fy: (e.clientY - f.top) / f.height, fw: f.width, fh: f.height });
  };
  const Z = 2.6;
  return (
    <div className="kc-sheet" ref={ref} onPointerMove={move} onPointerLeave={() => setLp(null)}>
      <div className="kc-sheet-grid">
        {ps.map((p, i) => (
          <div key={i} className={'kc-fr' + (p.fav ? ' fav' : '')} data-i={i}>
            <div className="ph"><KCPh p={p}></KCPh></div><small><span>{String(i + 1).padStart(2, '0')}A</span><span>{p.label}</span></small>
          </div>))}
        <div className="kc-sheet-note">keepers ✓</div>
      </div>
      <div className="kc-loupe" style={{ left: lp ? lp.x : 0, top: lp ? lp.y : 0, opacity: lp ? 1 : 0, transform: lp ? 'scale(1)' : 'scale(.6)' }}>
        {lp ? <div className="ph" style={{ inset: 'auto', width: lp.fw * Z, height: lp.fh * Z, left: 75 - 6 - lp.fx * lp.fw * Z, top: 75 - 6 - lp.fy * lp.fh * Z }}><KCPh p={ps[lp.i]}></KCPh></div> : null}
      </div>
    </div>);
}

function KCBallot({ ps }) {
  const ref = React.useRef(null);
  const [inV, setIn] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { threshold: .35 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  const n = ps.length;
  return (
    <div className={'kc-ballot' + (inV ? ' in' : '')} ref={ref}>
      {ps.map((p, i) => {
        const u = n > 1 ? i / (n - 1) - .5 : 0;
        return <div key={i} className="kc-bal" style={{ '--x': (u * 230).toFixed(0) + 'px', '--y': (-20 - (1 - Math.abs(u) * 2) * 90).toFixed(0) + 'px', '--r': (u * 30).toFixed(1) + 'deg', transitionDelay: (i * .14) + 's', zIndex: i === Math.floor(n / 2) ? 2 : 1 }}>
          <div className="ph"><KCPh p={p}></KCPh></div><div className="ln"><span>✓</span>{p.label}</div></div>;
      })}
      <div className="kc-box"><div className="kc-box-top"></div><div className="kc-box-front"><b>VOTE</b><small>Student Council</small></div></div>
    </div>);
}

function KCReel({ ps }) {
  const strips = [];
  for (let s = 0; s < ps.length; s++) strips.push([0, 1, 2, 3].map((k) => ps[(s + k) % ps.length]));
  const all = [...strips, ...strips];
  return (
    <div className="kc-reel"><div className="kc-reel-track">
      {all.map((st, i) => (
        <div key={i} className="kc-strip" style={{ '--r': (i % 2 ? 2 : -2) + 'deg' }}>
          {st.map((p, k) => <div key={k} className="ph"><KCPh p={p}></KCPh></div>)}
          <small>{st[0].label}</small>
        </div>))}
    </div></div>);
}

function KCTrifold({ ps }) {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setOpen(true), 250); io.disconnect(); } }, { threshold: .5 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  const toggle = () => { setOpen((o) => !o); window.KXPaperFlick && window.KXPaperFlick(); };
  const side = ['l', 'm', 'r'];
  return (
    <div className={'kc-tri' + (open ? ' open' : '')} ref={ref} onClick={toggle}>
      <div className="kc-tri-row">
        {ps.slice(0, 3).map((p, i) => (
          <div key={i} className={'kc-tri-p ' + side[i]}>
            <div className="kc-tri-f"><div className="ph"><KCPh p={p}></KCPh></div><i>{String(i + 1).padStart(2, '0')} / 03</i><b>{p.label}</b></div>
            {i !== 1 ? <div className="kc-tri-b">{i === 0 ? <><span className="kc-tri-seal">VMA</span><b>Student Council</b><small>2022 – 2024</small></> : null}</div> : null}
          </div>))}
      </div>
      <div className="kc-tri-hint">{open ? 'Click to fold' : 'Click to unfold'}</div>
    </div>);
}

const KC_TVS = [
  [33, 1, 33, 29, '#a89f93', 1.5, 'l'],
  [14, 31, 36, 34, '#36302c', -.5, 'r', 0], [50, 31, 36, 34, '#2f2a27', .5, 'r', 1],
  [0, 66, 30, 34, '#221e1c', -.5], [30, 66, 38, 34, '#2b2624', 0, 'r', 2], [68, 66, 32, 34, '#9b9286', .5, 'l']];

function KCTVs({ ps }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); try { const a = new Audio('assets/tv-on.mp3?v=2'); a.volume = 0.6; a.play().catch(() => {}); } catch (err) {} } }, { threshold: .4 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  const order = [2, 1, 4, 0, 3, 5];
  return (
    <div className={'kc-tvs' + (on ? ' on' : '')} ref={ref}>
      {KC_TVS.map(([x, y, w, h, b, r, g, pi], i) => {
        const p = pi != null ? ps[pi] : null;
        return <div key={i} className={'kc-tv' + (g === 'l' ? ' g-l' : '') + (p ? ' ph-tv' : '')}
          style={{ left: x + '%', top: y + '%', width: w + '%', height: h + '%', '--b': b, '--r': r + 'deg', '--d': (order.indexOf(i) * .14).toFixed(2) + 's', '--bt': (3.6 + (i * 1.3) % 2).toFixed(1) + 's' }}>
          <div className="kc-tv-scr">
            <div className={'kc-tv-img' + (p ? '' : ' blank')}>{p ? <KCPh p={p}></KCPh> : null}</div>
            {p ? <span className="kc-tv-osd">CH {String(pi + 1).padStart(2, '0')}<b> · {p.label}</b></span> : null}
            <div className="kc-tv-glass"></div>
          </div>
          <div className="kc-tv-side"><i></i><b></b><b></b></div><span className="kc-tv-led"></span>
        </div>;
      })}
    </div>);
}

function CouncilPhotos({ layout }) {
  const ps = KX_COUNCIL;
  const V = { clipboard: KCClipboard, posters: KCPosters, sheet: KCSheet, ballot: KCBallot, reel: KCReel, trifold: KCTrifold, tvs: KCTVs }[layout];
  if (!V) return null;
  return <><style>{councilCss}</style><V ps={ps}></V></>;
}

Object.assign(window, { KXCouncilPhotos: CouncilPhotos });
