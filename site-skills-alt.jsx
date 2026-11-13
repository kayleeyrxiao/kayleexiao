/* Alternate Skills & tools layouts: contact sheet, tracklist, editing timeline, pantry jars. */
(function () {
const ALT_CSS = `
/* ---- 1 film contact sheet ---- */
.kx-cs{display:flex;flex-direction:column;gap:26px}
.kx-cs-edge{font-family:ui-monospace,"SFMono-Regular","Courier New",monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c9772f;margin:0 0 6px 2px}
.kx-cs-edge b{font-family:var(--site-heading);font-weight:400;font-size:22px;letter-spacing:0;text-transform:none;color:var(--site-text);margin-right:12px}
.kx-cs-strip{display:flex;flex-wrap:wrap;gap:0}
.kx-cs-frame{position:relative;flex:0 0 auto;width:164px;padding:20px 7px;background:#2b2420;
  background-image:repeating-linear-gradient(90deg,transparent 0 7px,#efe6d6 7px 17px,transparent 17px 27px),repeating-linear-gradient(90deg,transparent 0 7px,#efe6d6 7px 17px,transparent 17px 27px);
  background-size:100% 9px,100% 9px;background-position:0 6px,0 calc(100% - 6px);background-repeat:repeat-x}
.kx-cs-pic{position:relative;height:96px;display:flex;align-items:flex-end;padding:9px 10px;box-sizing:border-box;border-radius:3px;
  background:linear-gradient(160deg,color-mix(in srgb,var(--ft) 55%,#fff) ,var(--ft));color:#fff;font-family:var(--site-body);font-weight:900;font-size:12px;letter-spacing:.06em;text-transform:uppercase;line-height:1.25;text-wrap:balance;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.kx-cs-no{position:absolute;right:16px;top:28px;font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.12em;color:rgba(255,255,255,.75)}
.kx-cs-pic::after{content:'';position:absolute;inset:-9px -6px;border:2.5px solid #d2453b;border-radius:50% 46% 52% 48%/48% 54% 46% 52%;transform:rotate(-4deg) scale(.86);opacity:0;transition:opacity .2s,transform .25s}
.kx-cs-frame:hover .kx-cs-pic::after{opacity:1;transform:rotate(-4deg) scale(1)}
/* ---- 3 tracklist / J-cards ---- */
.kx-tl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-items:start}
.kx-tl-card{background:var(--site-bg);border-radius:6px;padding:0 0 18px;box-shadow:0 10px 22px -14px rgba(62,50,40,.45);overflow:hidden}
.kx-tl-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:58px;box-sizing:border-box;padding:12px 16px;background:var(--ft);color:#fff}
.kx-tl-hd small{white-space:nowrap;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
.kx-tl-hd b{font-family:var(--site-heading);font-weight:400;font-size:20px;line-height:1.05}
.kx-tl-lead{padding:10px 16px 0;font-family:'Caveat','Bradley Hand',cursive;font-weight:700;font-size:20px;color:color-mix(in srgb,var(--site-text) 75%,transparent)}
.kx-tl ol{list-style:none;margin:8px 0 0;padding:0 16px;display:flex;flex-direction:column}
.kx-tl li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:baseline;gap:8px;padding:7px 0;border-bottom:1px dashed color-mix(in srgb,var(--site-text) 20%,transparent);font-family:var(--site-body);font-size:14px;color:var(--site-text);transition:padding .2s}
.kx-tl li:hover{padding-left:6px}
.kx-tl li span:first-child,.kx-tl li span:last-child{font-family:ui-monospace,monospace;font-size:11.5px;letter-spacing:.06em;color:color-mix(in srgb,var(--site-text) 55%,transparent)}
/* ---- 4 editing timeline ---- */
.kx-ed{background:#262120;border-radius:12px;padding:14px 14px 18px;color:#efe6d6;box-shadow:0 18px 32px -20px rgba(0,0,0,.5);position:relative;overflow:hidden}
.kx-ed-bar{display:flex;justify-content:space-between;align-items:center;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a99c8e;margin-bottom:10px}
.kx-ed-bar i{font-style:normal;color:#e26a5a}
.kx-ed-ruler{margin-left:158px;height:18px;border-bottom:1px solid #4a413c;background:repeating-linear-gradient(90deg,#5a4f48 0 1px,transparent 1px 10%),repeating-linear-gradient(90deg,#4a413c 0 1px,transparent 1px 2%);background-size:100% 100%,100% 6px;background-repeat:no-repeat,repeat-x;background-position:0 0,0 100%;display:grid;grid-template-columns:repeat(10,1fr);font-family:ui-monospace,monospace;font-size:9px;color:#8d8075}
.kx-ed-ruler span{padding-left:3px}
.kx-ed-tracks{position:relative;display:flex;flex-direction:column;gap:6px;margin-top:8px}
.kx-ed-row{display:grid;grid-template-columns:150px minmax(0,1fr);gap:8px;align-items:stretch}
.kx-ed-name{display:flex;align-items:center;gap:8px;padding:0 10px;line-height:1.15;background:#322b28;border-radius:5px;font-family:var(--site-body);font-weight:900;font-size:12px;letter-spacing:.06em;text-transform:uppercase;min-height:44px}
.kx-ed-name b{font-family:ui-monospace,monospace;font-weight:400;color:var(--ft2)}
.kx-ed-lane{display:flex;flex-wrap:wrap;gap:4px;padding:4px;background:#1d1918;border-radius:5px}
.kx-ed-clip{flex:1 1 auto;min-height:36px;display:flex;align-items:flex-end;padding:5px 9px;box-sizing:border-box;border-radius:4px;background:var(--ft);border-top:3px solid var(--ft2);font-family:var(--site-body);font-weight:700;font-size:12.5px;color:#fff;white-space:nowrap;cursor:default;transition:filter .2s}
.kx-ed-clip:hover{filter:brightness(1.15)}
.kx-ed-row.audio .kx-ed-clip{background:var(--ft) repeating-linear-gradient(90deg,rgba(255,255,255,.25) 0 2px,transparent 2px 5px) center/100% 46% no-repeat;align-items:center}
.kx-ed-head{position:absolute;top:-30px;bottom:0;left:158px;width:2px;background:#e26a5a;animation:kxEdHead 14s linear infinite;pointer-events:none}
.kx-ed-head::before{content:'';position:absolute;top:0;left:-6px;border:7px solid transparent;border-top:9px solid #e26a5a}
@keyframes kxEdHead{from{left:158px}to{left:100%}}
@media (prefers-reduced-motion:reduce){.kx-ed-head{animation:none;left:40%}}
@media (max-width:600px){.kx-ed-row{grid-template-columns:1fr}.kx-ed-ruler,.kx-ed-head{display:none}}
/* ---- 5 passport ---- */
.kx-pp{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;max-width:1000px;border-radius:10px;overflow:hidden;box-shadow:0 18px 32px -18px rgba(62,50,40,.5)}
.kx-pp-page{position:relative;min-height:0;padding:16px 20px 18px;background:#f3ecdc;
  background-image:repeating-radial-gradient(circle at 50% 120%,transparent 0 9px,rgba(120,140,130,.08) 9px 10px),linear-gradient(90deg,transparent 92%,rgba(62,50,40,.08));display:flex;flex-direction:column;gap:10px}
.kx-pp-page.is-l{grid-column:1;grid-row:1 / span 3}.kx-pp-page.is-r{grid-column:2}
.kx-pp-page.is-r{background-image:repeating-radial-gradient(circle at 50% 120%,transparent 0 9px,rgba(120,140,130,.08) 9px 10px),linear-gradient(270deg,transparent 92%,rgba(62,50,40,.08))}
.kx-pp-page.is-r+.kx-pp-page.is-r{border-top:1px dashed rgba(62,50,40,.18)}
.kx-pp-hd{display:flex;justify-content:space-between;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#7b8a83}
.kx-pp-hd b{font-family:var(--site-heading);font-weight:400;font-size:22px;letter-spacing:0;text-transform:none;color:var(--site-text)}
.kx-pp-stamps{display:flex;flex-wrap:wrap;align-items:center}
.kx-pp-stamps{flex:1;justify-content:space-evenly;align-content:space-evenly;gap:6px 4px}
.kx-pp-stamp:nth-child(4n+2),.kx-pp-stamp:nth-child(5n){padding:5px 9px}.kx-pp-stamp:nth-child(4n+2) b,.kx-pp-stamp:nth-child(5n) b{font-size:11.5px}
.kx-pp-stamp{position:relative;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-sizing:border-box;padding:6px 11px;color:var(--ink);text-align:center;line-height:1.05;transform:rotate(var(--sr));opacity:.92;mix-blend-mode:multiply;filter:url(#kxInk);transition:transform .2s,opacity .2s}
.kx-pp-stamp .fr{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.kx-pp-stamp .fr *{fill:none;stroke:currentColor;vector-effect:non-scaling-stroke}
.kx-pp-stamp .fr text,.kx-pp-stamp .fr .f{fill:currentColor;stroke:none}
.kx-pp-stamp .fr text{font-family:ui-monospace,monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase}
.kx-pp-stamp b{position:relative;max-width:140px;font-family:var(--site-heading);font-weight:400;font-size:13.5px;letter-spacing:.03em;text-transform:uppercase;text-wrap:balance}
.kx-pp-stamp:nth-child(3n+1) b{font-family:var(--site-body);font-weight:900;font-size:11.5px;letter-spacing:.1em}
.kx-pp-stamp em{position:relative;font-family:'Caveat','Bradley Hand',cursive;font-style:normal;font-weight:700;font-size:16px;line-height:.9}
.kx-pp-stamp .tp,.kx-pp-stamp .bt{position:relative;font-family:ui-monospace,monospace;font-size:6.5px;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
.kx-pp-stamp .bt{padding-top:2px;border-top:1px solid currentColor;align-self:stretch}
.sh-oval{padding:8px 20px}
.sh-octagon{padding:8px 16px}
.sh-house{padding:16px 13px 6px}
.sh-scallop{padding:10px 20px}
.sh-hex{padding:6px 20px}
.sh-ticket{padding:7px 15px}
.sh-round .bt,.sh-oval .bt,.sh-scallop .bt{border-top:0}
.sh-circle{width:76px;height:76px;padding:0}
.sh-circle b{max-width:50px;font-size:12px}
.sh-band{min-width:76px;height:76px;padding:0}
.sh-band .fr{left:50%;width:76px;margin-left:-38px}
.sh-band b{padding:3px 9px 2px;border:1.5px solid currentColor;background:#f3ecdc;max-width:170px}
.sh-band .tp,.sh-band .bt{border:0;align-self:center}
.kx-pp-stamp:hover{transform:rotate(0deg) scale(1.06);opacity:1}
@media (max-width:720px){.kx-pp{grid-template-columns:1fr}.kx-pp-page.is-l,.kx-pp-page.is-r{grid-column:auto;grid-row:auto}.kx-pp-page:nth-child(n+2){border-top:1px dashed rgba(62,50,40,.18)}}
/* passport opening: a closed booklet sits centred; on scroll the cover leaf swings open on its spine
   (rAF-driven so it eases continuously), the booklet glides to centre the open spread, the leaf carries
   the left-hand pages on its back, light falls across it as it turns, then the stamps thunk in */
.kx-pp-wrap{position:relative;max-width:1000px;perspective:2400px;perspective-origin:50% 40%}
.kx-pp-book{position:relative;will-change:transform}
.kx-pp-leaf{position:absolute;top:0;bottom:0;left:50%;width:50%;z-index:3;transform-origin:0 50%;will-change:transform;pointer-events:none}
.kx-pp-face{position:absolute;inset:0;overflow:hidden}
.kx-pp-front{border-radius:3px 12px 12px 3px;background:color-mix(in srgb,var(--site-selected) 30%,#3a1f24);box-shadow:inset 6px 0 10px -4px rgba(0,0,0,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;color:#d9b46a;text-align:center;
  background-image:radial-gradient(circle at 30% 20%,rgba(255,255,255,.08),transparent 60%)}
.kx-pp-front b{font-family:var(--site-heading);font-weight:400;font-size:30px;letter-spacing:.18em}
.kx-pp-front small{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.3em;text-transform:uppercase;opacity:.85}
.kx-pp-globe{width:84px;height:84px;border-radius:50%;border:2px solid #d9b46a;position:relative;background:repeating-linear-gradient(transparent 0 16px,rgba(217,180,106,.7) 16px 17.5px)}
.kx-pp-globe::before{content:'';position:absolute;inset:-2px 22px;border-radius:50%;border:2px solid #d9b46a}
.kx-pp-globe::after{content:'';position:absolute;top:-2px;bottom:-2px;left:50%;width:2px;margin-left:-1px;background:#d9b46a}
.kx-pp-back{transform:scaleX(-1);border-radius:10px 0 0 10px;display:grid}
.kx-pp-back .kx-pp-page{min-height:0;background-image:repeating-radial-gradient(circle at 50% 120%,transparent 0 9px,rgba(120,140,130,.08) 9px 10px),linear-gradient(90deg,transparent 92%,rgba(62,50,40,.08))}
.kx-pp-back .kx-pp-page+.kx-pp-page{border-top:1px dashed rgba(62,50,40,.18)}
.kx-pp-shade{position:absolute;inset:0;pointer-events:none;background:#1e1210;opacity:0}
.kx-pp-cast{position:absolute;top:0;bottom:0;left:50%;width:50%;z-index:2;pointer-events:none;background:linear-gradient(90deg,rgba(40,24,16,.55),rgba(40,24,16,0) 70%);opacity:0}
.kx-pp{box-shadow:0 22px 34px -18px rgba(40,20,20,.55)}
.kx-pp-wrap .kx-pp{position:relative;z-index:1}
.kx-pp-wrap.is-closed .kx-pp,.kx-pp-wrap.is-turning .kx-pp{background:transparent}
.kx-pp-wrap.is-closed .kx-pp,.kx-pp-wrap.is-turning .kx-pp{box-shadow:none}
.kx-pp-drop{position:absolute;top:0;bottom:0;right:0;width:50%;z-index:0;border-radius:10px;pointer-events:none;box-shadow:0 22px 34px -18px rgba(40,20,20,.55)}
.kx-pp-wrap.is-closed .kx-pp>.kx-pp-page.is-l,.kx-pp-wrap.is-turning .kx-pp>.kx-pp-page.is-l{visibility:hidden}
.kx-pp-wrap .kx-pp-stamp{opacity:0;transform:rotate(var(--sr)) scale(1.7)}
.kx-pp-wrap.is-open .kx-pp-stamp{opacity:.88;transform:rotate(var(--sr));animation:kxStampIn .38s cubic-bezier(.3,1.5,.5,1) var(--sd) backwards}
@keyframes kxStampIn{0%{opacity:0;transform:rotate(var(--sr)) scale(1.7)}60%{opacity:.95}100%{opacity:.88;transform:rotate(var(--sr)) scale(1)}}
.kx-pp-wrap.is-open .kx-pp-stamp:hover{opacity:1;transform:rotate(0deg) scale(1.06)}
@media (prefers-reduced-motion:reduce){.kx-pp-wrap .kx-pp-stamp{opacity:.88;transform:rotate(var(--sr));animation:none!important}}
/* ---- 6 pantry jars ---- */
.kx-jar-shelf{position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:34px 0;align-items:end}
.kx-jar-shelf>.kx-jar-cell{position:relative;display:flex;justify-content:center;padding:0 11px 20px}
.kx-jar-shelf>.kx-jar-cell::after{content:'';position:absolute;left:-1px;right:-1px;bottom:0;height:20px;border-radius:0;border-radius:4px;background:linear-gradient(#b48a62,#8e6744);box-shadow:0 10px 16px -8px rgba(62,40,20,.5),inset 0 2px 0 rgba(255,255,255,.25)}
.kx-jar{position:relative;width:100%;display:flex;flex-direction:column;align-items:center;z-index:1;transition:transform .25s}
.kx-jar:hover{transform:translateY(-4px) rotate(-1deg)}
.kx-jar-lid{width:72%;height:22px;border-radius:6px 6px 3px 3px;background:var(--ft);box-shadow:inset 0 -4px 0 rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.25)}
.kx-jar-neck{width:66%;height:8px;background:rgba(255,255,255,.35);border-left:1.5px solid rgba(62,50,40,.15);border-right:1.5px solid rgba(62,50,40,.15)}
.kx-jar-body{position:relative;width:100%;box-sizing:border-box;padding:18px 14px 20px;border-radius:22px 22px 18px 18px;background:linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.22) 30%,rgba(255,255,255,.14) 70%,rgba(255,255,255,.4));border:1.5px solid rgba(62,50,40,.15);box-shadow:inset 0 -10px 18px rgba(255,255,255,.3);display:flex;flex-direction:column;align-items:center;gap:12px;overflow:hidden}
.kx-jar-body::before{content:'';position:absolute;left:10px;top:16px;bottom:18px;width:8px;border-radius:8px;background:rgba(255,255,255,.7)}
.kx-jar-label{position:relative;padding:8px 16px 7px;background:#fbf6ea;border:1px solid rgba(62,50,40,.18);border-radius:3px;text-align:center;box-shadow:0 2px 4px rgba(62,50,40,.12)}
.kx-jar-label b{display:block;font-family:var(--site-heading);font-weight:400;font-size:20px;line-height:1.05;color:var(--site-text)}
.kx-jar-label small{display:block;font-family:'Caveat','Bradley Hand',cursive;font-weight:700;font-size:16px;color:color-mix(in srgb,var(--site-text) 70%,transparent)}
.kx-jar-items{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:7px 6px}
.kx-jar-stk{padding:5px 10px;border-radius:999px;background:var(--ft);color:#fff;font-family:var(--site-body);font-weight:900;font-size:11px;letter-spacing:.05em;text-transform:uppercase;line-height:1.2;text-align:center;box-shadow:0 0 0 2px #fff,0 2px 4px rgba(62,50,40,.22);transform:rotate(var(--sr));transition:transform .2s}
.kx-jar-stk:nth-child(3n+2){border-radius:5px}
.kx-jar-stk:hover{transform:rotate(0deg) scale(1.08)}
`;
const TONE = {
  ink: ['color-mix(in srgb,var(--site-text) 88%,#000)', 'color-mix(in srgb,var(--site-text) 45%,#fff)'],
  rose: ['color-mix(in srgb,var(--site-selected) 80%,var(--site-text))', 'color-mix(in srgb,var(--site-selected) 60%,#fff)'],
  link: ['color-mix(in srgb,var(--site-link) 55%,var(--site-text))', 'color-mix(in srgb,var(--site-link) 55%,#fff)'],
  paper: ['color-mix(in srgb,var(--site-text) 55%,var(--site-bg))', 'color-mix(in srgb,var(--site-text) 25%,#fff)'],
};
const SIDES = ['A', 'B', 'C', 'D'];
const time = (s, j) => { const n = 120 + ((s.length * 37 + j * 53) % 180); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); };

function ContactSheet({ shelves }) {
  let f = 0;
  return (
    <div className="kx-cs">
      {shelves.map((s) => (
        <div key={s.no} style={{ '--ft': TONE[s.tone][0] }}>
          <div className="kx-cs-edge"><b>{s.name}</b>{s.lead ? s.lead + ' · ' : ''}Roll {s.no}</div>
          <div className="kx-cs-strip">
            {s.items.map((t) => { f++; return (
              <div className="kx-cs-frame" key={t}>
                <div className="kx-cs-pic">{t}</div>
                <span className="kx-cs-no">{String(f).padStart(2, '0')}A</span>
              </div>); })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tracklist({ shelves }) {
  return (
    <div className="kx-tl">
      {shelves.map((s, i) => (
        <div className="kx-tl-card" key={s.no} style={{ '--ft': TONE[s.tone][0] }}>
          <div className="kx-tl-hd"><b>{s.name}</b><small>Side {SIDES[i]}</small></div>
          {s.lead ? <div className="kx-tl-lead">{s.lead}</div> : null}
          <ol>{s.items.map((t, j) => <li key={t}><span>{SIDES[i]}{j + 1}</span><span>{t}</span><span>{time(t, j)}</span></li>)}</ol>
        </div>
      ))}
    </div>
  );
}

function Timeline({ shelves }) {
  const ids = ['V1', 'V2', 'A1', 'A2'];
  return (
    <div className="kx-ed">
      <div className="kx-ed-bar"><span>kaylee_skills_final_v3.prproj</span><i>● REC 00:00:24:12</i></div>
      <div className="kx-ed-ruler">{Array.from({ length: 10 }, (_, i) => <span key={i}>00:{String(i * 6).padStart(2, '0')}</span>)}</div>
      <div className="kx-ed-tracks">
        <div className="kx-ed-head" aria-hidden="true"></div>
        {shelves.map((s, i) => (
          <div className={'kx-ed-row' + (ids[i][0] === 'A' ? ' audio' : '')} key={s.no} style={{ '--ft': TONE[s.tone][0], '--ft2': TONE[s.tone][1] }}>
            <div className="kx-ed-name"><b>{ids[i]}</b>{s.name}</div>
            <div className="kx-ed-lane">{s.items.map((t) => <span className="kx-ed-clip" key={t} style={{ flexGrow: t.length }}>{t}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Jars({ shelves }) {
  return (
    <div className="kx-jar-shelf">
      {shelves.map((s, i) => (
        <div className="kx-jar-cell" key={s.no}><div className="kx-jar" style={{ '--ft': TONE[s.tone][0] }}>
          <div className="kx-jar-lid"></div>
          <div className="kx-jar-neck"></div>
          <div className="kx-jar-body">
            <div className="kx-jar-label"><b>{s.name}</b>{s.lead ? <small>{s.lead}</small> : null}</div>
            <div className="kx-jar-items">
              {s.items.map((t, j) => <span key={t} className="kx-jar-stk" style={{ '--sr': (((i * 3 + j * 7) % 7) - 3) * 1.5 + 'deg' }}>{t}</span>)}
            </div>
          </div>
        </div></div>
      ))}
    </div>
  );
}

const PP_MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const PP_SHAPES = ['oval', 'ticket', 'circle', 'octagon', 'band', 'scallop', 'hex', 'house', 'round'];
const PP_INKS = ['color-mix(in srgb,var(--site-selected) 85%,var(--site-text))', 'color-mix(in srgb,var(--site-link) 80%,var(--site-text))', 'var(--site-text)', 'color-mix(in srgb,var(--site-selected) 45%,var(--site-text))'];
const PP_TOP = ['Arrival', 'Entry permit', 'Visa granted', 'Admitted', 'Welcome to', 'Departure'];
const PP_SCALLOP = (() => { let d = ''; const N = 26, M = N * 6; for (let k = 0; k <= M; k++) { const th = k / M * 2 * Math.PI, r = 1 - 0.05 * (1 - Math.cos(N * th)); d += (k ? 'L' : 'M') + (100 + 98 * r * Math.cos(th)).toFixed(1) + ',' + (50 + 48 * r * Math.sin(th)).toFixed(1); } return d + 'Z'; })();
function ppShapes(items, i) {
  let p = i * 2;
  return items.map((t) => {
    const L = t.split(' — ')[0].length;
    for (let g = 0; g < PP_SHAPES.length; g++) {
      const sh = PP_SHAPES[(p + g) % PP_SHAPES.length];
      const ok = sh === 'circle' ? L <= 8 : (L > 15 ? ['ticket', 'band', 'hex', 'round', 'octagon'].includes(sh) : true);
      if (ok) { p += g + 1; return sh; }
    }
    return 'round';
  });
}
function PPFrame({ sh, id, top, bot }) {
  const box = { viewBox: '0 0 200 100', preserveAspectRatio: 'none', className: 'fr', 'aria-hidden': 'true' };
  if (sh === 'circle' || sh === 'band') return (
    <svg className="fr" viewBox="0 0 100 100" aria-hidden="true">
      <defs><path id={id + 't'} d="M14,50 a36,36 0 0,1 72,0"></path><path id={id + 'b'} d="M10,50 a40,40 0 0,0 80,0"></path></defs>
      <circle cx="50" cy="50" r="48" strokeWidth="2.5"></circle><circle cx="50" cy="50" r="44" strokeWidth="1"></circle>
      {sh === 'circle' ? <><circle cx="50" cy="50" r="29" strokeWidth="1"></circle>
        <text><textPath href={'#' + id + 't'} startOffset="50%" textAnchor="middle">{top}</textPath></text>
        <text><textPath href={'#' + id + 'b'} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">{bot}</textPath></text></> : null}
    </svg>
  );
  if (sh === 'oval') return <svg {...box}><ellipse cx="100" cy="50" rx="98" ry="48" strokeWidth="2.5"></ellipse><ellipse cx="100" cy="50" rx="92" ry="42" strokeWidth="1" strokeDasharray="2 3"></ellipse></svg>;
  if (sh === 'ticket') return <svg {...box}><path d="M12,2 H188 A10,10 0 0 0 198,12 V88 A10,10 0 0 0 188,98 H12 A10,10 0 0 0 2,88 V12 A10,10 0 0 0 12,2 Z" strokeWidth="2.5"></path><rect x="9" y="9" width="182" height="82" strokeWidth="1" strokeDasharray="4 3"></rect></svg>;
  if (sh === 'octagon') return <svg {...box}><polygon points="26,2 174,2 198,26 198,74 174,98 26,98 2,74 2,26" strokeWidth="2.5"></polygon><polygon points="29,8 171,8 192,29 192,71 171,92 29,92 8,71 8,29" strokeWidth="1"></polygon></svg>;
  if (sh === 'house') return <svg {...box}><polygon points="2,30 100,2 198,30 198,98 2,98" strokeWidth="2.5"></polygon><polyline points="8,36 192,36" strokeWidth="1"></polyline><polygon points="8,34 100,8 192,34 192,92 8,92" strokeWidth="1"></polygon></svg>;
  if (sh === 'scallop') return <svg {...box}><path d={PP_SCALLOP} strokeWidth="2.5"></path><ellipse cx="100" cy="50" rx="86" ry="38" strokeWidth="1"></ellipse></svg>;
  if (sh === 'hex') return <svg {...box}><polygon points="20,2 180,2 198,50 180,98 20,98 2,50" strokeWidth="2.5"></polygon><polygon points="23,8 177,8 192,50 177,92 23,92 8,50" strokeWidth="1"></polygon></svg>;
  return <svg {...box}><rect x="1" y="1" width="198" height="98" rx="12" strokeWidth="2.5"></rect><rect x="7" y="7" width="186" height="86" rx="8" strokeWidth="1"></rect></svg>;
}
function PPStamp({ t, sh, i, j, yr, d, cat }) {
  const h = i * 7 + j * 3;
  const [name, sub] = t.split(' — ');
  const rot = ((h % 9) - 4) * (sh === 'circle' || sh === 'band' ? 2.4 : 1.4);
  const style = { '--sr': rot + 'deg', '--sd': d, '--ink': PP_INKS[(i + j * 3) % PP_INKS.length] };
  const date = String(1 + h * 11 % 28).padStart(2, '0') + ' ' + PP_MON[h % 12] + ' ' + yr;
  const top = PP_TOP[(i + j) % PP_TOP.length];
  if (sh === 'circle') return <span className={'kx-pp-stamp sh-circle'} style={style}><PPFrame sh={sh} id={'kxs' + i + '-' + j} top={cat} bot={date}></PPFrame><b>{name}</b>{sub ? <em>{sub}</em> : null}</span>;
  if (sh === 'band') return <span className={'kx-pp-stamp sh-band'} style={style}><PPFrame sh={sh} id={'kxs' + i + '-' + j}></PPFrame><span className="tp">★ ★ ★</span><b>{name}</b><span className="bt">{sub || date}</span></span>;
  return (
    <span className={'kx-pp-stamp sh-' + sh} style={style}>
      <PPFrame sh={sh}></PPFrame>
      <span className="tp">{sh === 'ticket' || sh === 'hex' ? '✈ ' + top + ' ✈' : top}</span>
      <b>{name}</b>
      {sub ? <em>{sub}</em> : null}
      <span className="bt">{sh === 'house' ? 'No. ' + String(100 + h * 37 % 899) : date}</span>
    </span>
  );
}

function Passport({ shelves }) {
  const yrs = ['2022', '2023', '2024', '2025', '2026'];
  const wrapRef = React.useRef(null), bookRef = React.useRef(null), leafRef = React.useRef(null);
  const frontRef = React.useRef(null), backRef = React.useRef(null), fShade = React.useRef(null), bShade = React.useRef(null), castRef = React.useRef(null);
  const ppRef = React.useRef(null), dropRef = React.useRef(null);
  const [phase, setPhase] = React.useState('closed');   // closed → turning → open
  const [rows, setRows] = React.useState(null);
  const animated = React.useRef(true);

  React.useEffect(() => {
    const narrow = window.matchMedia('(max-width:720px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (narrow || reduce) { animated.current = false; setPhase('open'); return; }
    const el = wrapRef.current;
    let fired = false;
    const check = () => {
      if (fired) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.65 && r.bottom > 0) { fired = true; cleanup(); start(); }
    };
    const cleanup = () => { removeEventListener('scroll', check, true); removeEventListener('resize', check); };
    addEventListener('scroll', check, { passive: true, capture: true });
    addEventListener('resize', check);
    pose(0);
    setTimeout(check, 50);
    return cleanup;
  }, []);

  function measure() {
    const pages = ppRef.current ? ppRef.current.children : [];
    if (pages.length >= 3) setRows([pages[0].offsetHeight, pages[2].offsetHeight]);
  }
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function pose(t) {
    const e = ease(t), ang = 180 * e, rad = ang * Math.PI / 180;
    if (bookRef.current) bookRef.current.style.transform = 'translateX(' + (-25 * (1 - e)).toFixed(3) + '%)';
    /* a touch of lift mid-turn so the leaf reads as a stiff board, not a card */
    if (leafRef.current) leafRef.current.style.transform = 'rotateY(' + (-ang).toFixed(2) + 'deg) translateZ(' + (Math.sin(rad) * 6).toFixed(2) + 'px)';
    if (dropRef.current) dropRef.current.style.width = (50 + 50 * Math.max(0, -Math.cos(rad))).toFixed(2) + '%';
    const past = ang > 90;
    if (frontRef.current) frontRef.current.style.visibility = past ? 'hidden' : 'visible';
    if (backRef.current) backRef.current.style.visibility = past ? 'visible' : 'hidden';
    if (fShade.current) fShade.current.style.opacity = (Math.min(1, ang / 90) * 0.55).toFixed(3);
    if (bShade.current) bShade.current.style.opacity = (past ? (1 - (ang - 90) / 90) * 0.45 : 0).toFixed(3);
    if (castRef.current) castRef.current.style.opacity = (Math.sin(rad) * 0.9 * (1 - e * 0.4)).toFixed(3);
  }
  function start() {
    measure();
    setPhase('turning');
    try { const a = new Audio('assets/passport-flip.mp3?v=2'); a.volume = 0.8; a.play().catch(() => {}); } catch (e) {}
    const D = 1500; let t0 = 0;
    const step = (now) => {
      if (!t0) t0 = now;
      const t = Math.min(1, (now - t0) / D);
      pose(t);
      if (t < 1) requestAnimationFrame(step); else setPhase('open');
    };
    requestAnimationFrame(step);
  }

  const page = (s, i, ghost) => (
    <div className={'kx-pp-page ' + (i === 0 ? 'is-l' : 'is-r')} key={s.no + (ghost ? 'g' : '')} style={{ '--ft': TONE[s.tone][0] }}>
      <div className="kx-pp-hd"><b>{s.name}</b><span>Visas · {s.no}</span></div>
      {ghost ? null : <div className="kx-pp-stamps">
        {(() => { const shp = ppShapes(s.items, i); return s.items.map((t, j) => (
          <PPStamp key={t} t={t} sh={shp[j]} cat={s.name} i={i} j={j} yr={yrs[(i + j) % yrs.length]} d={(0.1 + (n++) * 0.08).toFixed(2) + 's'} />
        )); })()}
      </div>}
    </div>
  );
  let n = 0;
  return (
    <div ref={wrapRef} className={'kx-pp-wrap is-' + phase}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><filter id="kxInk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"></feTurbulence><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.7" result="m"></feColorMatrix><feComposite in="SourceGraphic" in2="m" operator="in" result="c"></feComposite><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9" result="w"></feTurbulence><feDisplacementMap in="c" in2="w" scale="2.2" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter></svg>
      <div ref={bookRef} className="kx-pp-book">
        {phase !== 'open' && animated.current ? <>
          <div ref={dropRef} className="kx-pp-drop" aria-hidden="true"></div>
          <div ref={castRef} className="kx-pp-cast" aria-hidden="true"></div>
          <div ref={leafRef} className="kx-pp-leaf" aria-hidden="true">
            <div ref={frontRef} className="kx-pp-face kx-pp-front"><small>Skills & tools</small><span className="kx-pp-globe"></span><b>PASSPORT</b><small>Kaylee Xiao</small><span ref={fShade} className="kx-pp-shade"></span></div>
            <div ref={backRef} className="kx-pp-face kx-pp-back" style={{ visibility: 'hidden', gridTemplateRows: '1fr' }}>
              {page(shelves[0], 0, true)}
              <span ref={bShade} className="kx-pp-shade"></span>
            </div>
          </div>
        </> : null}
        <div ref={ppRef} className="kx-pp">{shelves.map((s, i) => page(s, i, false))}</div>
      </div>
    </div>
  );
}

function SkillsAlt({ kind, shelves }) {
  const C = { sheet: ContactSheet, tracks: Tracklist, timeline: Timeline, passport: Passport, jars: Jars }[kind];
  if (!C) return null;
  return <><style>{ALT_CSS}</style><C shelves={shelves} /></>;
}
window.KXSkillsAlt = SkillsAlt;
})();
