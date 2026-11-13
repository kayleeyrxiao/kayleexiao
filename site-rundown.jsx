/* Experiences — broadcast rundown: a gantt overview of every role, then one row per role with an ON AIR tally */
(function () {
const { useState, useRef, useEffect } = React;
const Tag = (props) => React.createElement(window.KXTag, props);
const SPAN = { luxhammer: [2026.67, 2026.96], hunantv: [2026.42, 2026.67], szmg: [2025.33, 2025.67], council: [2022.33, 2024.37], magazine: [2021.67, 2024.37], vlog: [2018, 2026.8] };
const GROUP = { luxhammer: 'Industry', hunantv: 'Industry', szmg: 'Industry', council: 'Campus & creator', magazine: 'Campus & creator', vlog: 'Campus & creator' };
const Y0 = 2018, Y1 = 2027, pct = (y) => (y - Y0) / (Y1 - Y0) * 100;
const RD_CSS = `
.kx-rd{--rd-mono:ui-monospace,"SFMono-Regular","Courier New",monospace;display:flex;flex-direction:column;gap:clamp(40px,6vw,72px)}
.kx-rd-ov{border:1.5px solid var(--site-text);border-radius:14px;padding:clamp(18px,2.6vw,30px);background:color-mix(in srgb,var(--site-container) 60%,#fff)}
.kx-rd-ovh{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;font-family:var(--rd-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--site-text);white-space:nowrap}
.kx-rd-axis{position:relative;height:22px;margin-top:18px;border-bottom:1px solid color-mix(in srgb,var(--site-text) 30%,transparent)}
.kx-rd-axis span{position:absolute;bottom:5px;transform:translateX(-50%);font-family:var(--rd-mono);font-size:11px;color:var(--site-text)}
.kx-rd-lanes{position:relative;display:flex;flex-direction:column;gap:8px;padding-top:12px}
.kx-rd-grid{position:absolute;inset:0;pointer-events:none}
.kx-rd-grid i{position:absolute;top:0;bottom:0;border-left:1px dashed color-mix(in srgb,var(--site-text) 14%,transparent)}
.kx-rd-lane{position:relative;height:34px;appearance:none;border:0;background:none;padding:0;cursor:pointer;text-align:left}
.kx-rd-bar{position:absolute;top:5px;bottom:5px;min-width:12px;border-radius:5px;background:var(--c);box-sizing:border-box;border:1.5px solid var(--site-text);transform-origin:left;transform:scaleX(0);transition:transform .9s cubic-bezier(.2,.8,.2,1) var(--d),filter .2s}
.kx-rd.seen .kx-rd-bar{transform:none}
.kx-rd-lane:hover .kx-rd-bar,.kx-rd-lane.on .kx-rd-bar{filter:brightness(1.12);box-shadow:0 0 0 2px var(--site-text)}
.kx-rd-lbl{position:absolute;top:50%;transform:translateY(-50%);font-family:var(--site-body);font-size:14px;font-weight:900;color:var(--site-text);white-space:nowrap;opacity:0;transition:opacity .4s calc(var(--d) + .5s)}
.kx-rd.seen .kx-rd-lbl{opacity:1}
.kx-rd-lbl.in{color:var(--site-text);left:calc(var(--x) + 12px)}
.kx-rd-lbl.l{right:calc(100% - var(--x) + 10px)}
.kx-rd-lbl.r{left:calc(var(--x) + var(--w) + 10px)}
.kx-rd-key{display:flex;gap:18px;flex-wrap:wrap;margin-top:16px;font-family:var(--site-body);font-size:13px;color:var(--site-text)}
.kx-rd-key>span{display:flex;align-items:center;gap:7px}
.kx-rd-key>span::before{content:"";width:14px;height:8px;border-radius:3px;background:var(--c);border:1.5px solid var(--site-text);box-sizing:border-box}
.kx-rd-group{font-family:var(--rd-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--site-text);display:flex;align-items:center;gap:14px}
.kx-rd-group::after{content:"";flex:1;height:1px;background:color-mix(in srgb,var(--site-text) 30%,transparent)}
.kx-rd-list{display:flex;flex-direction:column;gap:clamp(28px,4vw,44px)}
.kx-rd-row{display:grid;grid-template-columns:minmax(120px,170px) minmax(0,1fr) minmax(200px,300px);gap:clamp(18px,3vw,40px);align-items:start;padding-top:22px;border-top:1.5px solid var(--site-text);scroll-margin-top:120px}
.kx-rd-meta{display:flex;flex-direction:column;gap:8px;position:sticky;top:110px}
.kx-rd-no{font-family:var(--site-heading);font-size:clamp(40px,5vw,64px);line-height:.9;color:var(--site-text)}
.kx-rd-tally{display:flex;align-items:center;gap:7px;font-family:var(--rd-mono);font-size:11px;letter-spacing:.14em;color:color-mix(in srgb,var(--site-text) 55%,transparent)}
.kx-rd-tally::before{content:"";width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--site-text) 25%,transparent);transition:background .3s,box-shadow .3s}
.kx-rd-row.on .kx-rd-tally{color:#d8402c}
.kx-rd-row.on .kx-rd-tally::before{background:#ff4a32;box-shadow:0 0 8px #ff4a32}
.kx-rd-dates{font-family:var(--site-body);font-weight:900;font-size:15px;color:var(--site-selected)}
.kx-rd-loc{font-family:var(--site-body);font-size:14px;color:var(--site-link)}
.kx-rd-role{margin:0;font-family:var(--site-heading);font-size:clamp(24px,2.6vw,34px);line-height:1.08;color:var(--site-text);text-wrap:balance}
.kx-rd-org{font-family:var(--site-body);font-weight:900;font-size:17px;color:var(--site-text);opacity:.8;margin-top:6px}
.kx-rd-body ul{margin:16px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.kx-rd-body li{font-family:var(--site-body);font-size:16px;line-height:1.55;color:var(--site-text);text-wrap:pretty}
.kx-stat{font-family:var(--site-heading);font-weight:900;font-size:1.3em;line-height:1;letter-spacing:-.01em}
.kx-rd-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.kx-rd-ph{aspect-ratio:4/3;border-radius:10px;overflow:hidden;border:1.5px solid var(--site-text);background:#d9cebd}
.kx-rd-ph image-slot{width:100%;height:100%;display:block}
@media (max-width:980px){.kx-rd-row{grid-template-columns:minmax(110px,140px) minmax(0,1fr)}.kx-rd-ph{grid-column:2;max-width:300px}}
@media (max-width:640px){.kx-rd-row{grid-template-columns:minmax(0,1fr)}.kx-rd-ph{grid-column:auto}.kx-rd-meta{position:static;flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:6px 14px}.kx-rd-ph{max-width:420px}}
@media (prefers-reduced-motion:reduce){.kx-rd-bar,.kx-rd-lbl{transition:none}}`;

function ExperienceRundown({ items }) {
  const root = useRef(null), ov = useRef(null), rows = useRef({});
  const [seen, setSeen] = useState(false), [on, setOn] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: .3 });
    io.observe(ov.current);
    let raf = 0;
    const pick = () => {
      raf = 0; const mid = window.innerHeight * .45; let best = null, bd = 1e9;
      Object.entries(rows.current).forEach(([id, el]) => {
        if (!el) return; const r = el.getBoundingClientRect();
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (d < bd) { bd = d; best = id; }
      });
      setOn(bd < window.innerHeight * .35 ? best : null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); pick();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [items]);
  /* labels beside a bar flip to the other side if they would cross the panel edge */
  useEffect(() => {
    const fit = () => {
      const box = ov.current; if (!box) return;
      const lanes = box.querySelector('.kx-rd-lanes'); if (!lanes) return;
      const L = lanes.getBoundingClientRect();
      lanes.querySelectorAll('.kx-rd-lbl').forEach((el) => {
        const def = el.dataset.side; if (def === 'in') return;
        el.classList.remove('l', 'r'); el.classList.add(def);
        const r = el.getBoundingClientRect();
        if (def === 'r' && r.right > L.right) { el.classList.replace('r', 'l'); }
        else if (def === 'l' && r.left < L.left) { el.classList.replace('l', 'r'); }
      });
    };
    fit(); const t = setTimeout(fit, 600);
    window.addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);
    return () => { clearTimeout(t); window.removeEventListener('resize', fit); };
  }, [items]);
  const jump = (id) => { const el = rows.current[id]; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' }); };
  const color = (id) => GROUP[id] === 'Industry' ? 'var(--site-text)' : 'transparent';
  const years = []; for (let y = Y0; y <= Y1; y++) years.push(y);
  const groups = [...new Set(items.map((it) => GROUP[it.id]))];
  let n = 0;
  return (
    <>
      <style>{RD_CSS}</style>
      <div className={'kx-rd' + (seen ? ' seen' : '')} ref={root}>
        <div className="kx-rd-ov" ref={ov}>
          <div className="kx-rd-ovh"><span>{`Rundown · ${items.length} roles`}</span><span>2018 — now</span></div>
          <div className="kx-rd-axis">{years.map((y) => <span key={y} style={{ left: pct(y) + '%' }}>{"'" + String(y).slice(2)}</span>)}</div>
          <div className="kx-rd-lanes">
            <div className="kx-rd-grid">{years.map((y) => <i key={y} style={{ left: pct(y) + '%' }}></i>)}</div>
            {items.map((it, i) => {
              const [a, b] = SPAN[it.id] || [Y0, Y1], x = pct(a), w = pct(b) - x;
              const side = w > 40 ? 'in' : x > 55 ? 'l' : 'r';
              return <button key={it.id} className={'kx-rd-lane' + (on === it.id ? ' on' : '')} onClick={() => jump(it.id)} title={it.role}
                style={{ '--x': x + '%', '--w': w + '%', '--c': color(it.id), '--d': (i * .12) + 's' }}>
                <span className="kx-rd-bar" style={{ left: x + '%', width: w + '%' }}></span>
                <span className={'kx-rd-lbl ' + side} data-side={side}>{it.org}</span>
              </button>;
            })}
          </div>
          <div className="kx-rd-key"><span style={{ '--c': 'var(--site-text)' }}>Industry</span><span style={{ '--c': 'transparent' }}>Campus & creator</span></div>
        </div>
        {groups.map((g) =>
          <div key={g} className="kx-rd-list">
            <div className="kx-rd-group">{g}</div>
            {items.filter((it) => GROUP[it.id] === g).map((it) => {
              n++;
              return <article key={it.id} data-id={it.id} ref={(el) => (rows.current[it.id] = el)} className={'kx-rd-row' + (on === it.id ? ' on' : '')}>
                <div className="kx-rd-meta">
                  <div className="kx-rd-no">{String(n).padStart(2, '0')}</div>
                  <div className="kx-rd-tally">{on === it.id ? 'ON AIR' : 'STANDBY'}</div>
                  <div className="kx-rd-dates">{it.dates}</div>
                  {it.location && <div className="kx-rd-loc">{it.location}</div>}
                </div>
                <div className="kx-rd-body">
                  <h4 className="kx-rd-role">{it.role}</h4>
                  <div className="kx-rd-org">{it.org}</div>
                  <ul>{it.points.map((pt, i) => <li key={i}>{pt}</li>)}</ul>
                  {it.tags && <div className="kx-rd-tags">{it.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
                </div>
                <div className="kx-rd-ph">{it.img ? <img src={it.img} alt={it.org} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}></img> : <image-slot id={'exp-' + it.id} shape="rect" placeholder="Drop a photo"></image-slot>}</div>
              </article>;
            })}
          </div>
        )}
      </div>
    </>);
}
Object.assign(window, { KXExperienceRundown: ExperienceRundown });
})();
