/* ============================================================
   Corkboard decoration — photos, stickers and paper pinned
   around the keyrings. Purely visual: the whole layer ignores
   the pointer, so only the charms are interactive.
   Positions are % of the cork face; sizes scale with it (cqw).
   ============================================================ */
(function () {

const DECO_CSS = `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
.kx-cb-cork>.kx-deco{position:absolute;inset:0;pointer-events:none;container-type:inline-size;z-index:0;user-select:none}
.kx-deco *{pointer-events:none}
.kx-d{position:absolute;transform:rotate(var(--r,0deg));filter:drop-shadow(0 .35cqw .4cqw rgba(50,34,20,.32))}
.kx-d img{display:block;width:100%;height:100%;object-fit:cover}
/* pins + tape + clip */
.kx-d-pin{position:absolute;left:50%;top:.4cqw;width:1.5cqw;height:1.5cqw;margin-left:-.75cqw;border-radius:50%;z-index:3;background:radial-gradient(circle at 32% 28%,#fff 0 10%,var(--pc,#b8574f) 45%,color-mix(in srgb,var(--pc,#b8574f) 60%,#000));box-shadow:.2cqw .35cqw .3cqw rgba(0,0,0,.35)}
.kx-d-tape{position:absolute;left:50%;top:-1.1cqw;width:7cqw;height:2.2cqw;margin-left:-3.5cqw;z-index:3;background:color-mix(in srgb,var(--tc,var(--site-container)) 78%,transparent);transform:rotate(var(--tr,-3deg));clip-path:polygon(2% 0,98% 6%,100% 30%,97% 55%,100% 80%,98% 100%,3% 94%,0 70%,3% 45%,0 18%);box-shadow:inset 0 0 0 100vmax rgba(255,255,255,.12)}
.kx-d-tape.dots{background-image:radial-gradient(circle,rgba(255,255,255,.6) 18%,transparent 22%);background-size:.9cqw .9cqw}
.kx-d-clip{position:absolute;left:50%;top:-1.6cqw;width:4.4cqw;height:3cqw;margin-left:-2.2cqw;z-index:3;border-radius:.4cqw .4cqw .2cqw .2cqw;background:linear-gradient(#5a4b42,#3d322c);box-shadow:inset 0 .25cqw 0 rgba(255,255,255,.2)}
.kx-d-clip::before{content:'';position:absolute;left:.6cqw;right:.6cqw;top:-1.8cqw;height:2.2cqw;border:.35cqw solid #b9bcc4;border-bottom:0;border-radius:1cqw 1cqw 0 0}
/* felt pennant: fibre noise + a soft sag across the cloth, clipped to the cut-out */
.kx-d-pennant{filter:drop-shadow(0 .5cqw .6cqw rgba(50,34,20,.35))}
.kx-d-pennant img{filter:saturate(.92) contrast(.96)}
.kx-d-pennant .felt{position:absolute;inset:0;-webkit-mask:url(assets/nyu-pennant.png) 0 0/100% 100% no-repeat;mask:url(assets/nyu-pennant.png) 0 0/100% 100% no-repeat;background:linear-gradient(176deg,rgba(255,255,255,.14) 0 18%,rgba(0,0,0,0) 34%,rgba(0,0,0,.16) 58%,rgba(255,255,255,.06) 72%,rgba(0,0,0,.18) 100%),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E") 0 0/12cqw 12cqw;mix-blend-mode:soft-light}
/* polaroid */
.kx-d-pol{background:#fbf8f1;padding:.7cqw .7cqw 2.6cqw}
.kx-d-pol .ph{aspect-ratio:1/1;background:#d9cebd;overflow:hidden}
.kx-d-pol .ph img{filter:saturate(.88) contrast(1.02)}
.kx-d-inst img{height:auto;aspect-ratio:var(--ar,.63);object-fit:cover}
/* photo-booth strip */
.kx-d-booth{background:#2c2622;padding:.55cqw .55cqw 1.6cqw;display:flex;flex-direction:column;gap:.5cqw}
.kx-d-booth .ph{aspect-ratio:4/3.3;overflow:hidden}
.kx-d-booth .ph img{filter:grayscale(1) contrast(1.08) brightness(1.04);object-position:50% 30%}
.kx-d-booth .logo{aspect-ratio:4/3.3;display:flex;align-items:flex-end;justify-content:center;margin-bottom:-.6cqw;padding-bottom:0}
.kx-d-booth .logo span{font-family:var(--site-nav);font-size:.85cqw;letter-spacing:.12em;text-transform:uppercase;color:#efe8de;text-align:center;line-height:1.1}
/* plain print */
.kx-d-print{background:#fbf8f1;padding:.5cqw}
/* sticky note */
.kx-d-note{aspect-ratio:1/1;background:#f4d974;padding:2.7cqw 1cqw .4cqw;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;font-family:var(--site-heading);color:#4c4039;font-size:2.05cqw;line-height:1.15;text-wrap:balance;clip-path:polygon(0 0,100% 0,100% 88%,88% 100%,0 100%)}
.kx-d-note b{display:block;font-family:var(--site-body);font-weight:900;font-size:.45cqw;line-height:1;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
.kx-d-note i{font-style:normal;font-size:2.3cqw;line-height:1}
.kx-d-note span:not(.kx-d-pin){font-family:'Caveat','Bradley Hand','Segoe Print',cursive;font-weight:700;font-size:2.6cqw;line-height:.9}
/* ticket stub */
.kx-d-ticket{display:grid;grid-template-columns:1fr auto;background:color-mix(in srgb,var(--site-selected) 30%,#fbf3e6);color:#4c4039;font-family:var(--site-body);font-weight:900;text-transform:uppercase;letter-spacing:.12em;-webkit-mask:radial-gradient(circle at 0 50%,transparent .7cqw,#000 .75cqw) left/51% 100% no-repeat,radial-gradient(circle at 100% 50%,transparent .7cqw,#000 .75cqw) right/51% 100% no-repeat}
.kx-d-ticket .m{padding:.9cqw 1.1cqw .9cqw 1.5cqw;display:flex;flex-direction:column;gap:.3cqw;border-right:.18cqw dashed rgba(76,64,57,.45)}
.kx-d-ticket .a{font-family:var(--site-heading);font-size:2cqw;letter-spacing:.02em;text-transform:none;line-height:1}
.kx-d-ticket .s{font-size:.8cqw;opacity:.7}
.kx-d-ticket .n{writing-mode:vertical-rl;font-size:.8cqw;padding:.6cqw .9cqw .6cqw .5cqw;opacity:.75}
/* name-tag sticker */
.kx-d-name{border-radius:1cqw;overflow:hidden;background:#fbf8f1;box-shadow:inset 0 0 0 .5cqw var(--site-selected);text-align:center;color:#4c4039}
.kx-d-name .h{background:var(--site-selected);color:#fbf8f1;padding:.6cqw 0 .5cqw;font-family:var(--site-body);font-weight:900}
.kx-d-name .h span{display:block;line-height:1}.kx-d-name .h .h1{font-size:2cqw;letter-spacing:.08em}
.kx-d-name .h .h2{font-size:.85cqw;letter-spacing:.05em;margin-top:.25cqw}
.kx-d-name .v{font-family:var(--site-heading);font-size:2.3cqw;padding:1cqw 0 1.3cqw;line-height:1}
/* calendar page */
.kx-d-cal{background:#fbf8f1;padding:2cqw 1.2cqw 1.2cqw;color:#4c4039;font-family:var(--site-body)}
.kx-d-cal .t{display:flex;justify-content:space-between;align-items:baseline;border-bottom:.15cqw solid #4c4039;padding-bottom:.5cqw;margin-bottom:.6cqw}
.kx-d-cal .t{gap:.6cqw}.kx-d-cal .t b{font-family:var(--site-heading);font-weight:400;font-size:1.75cqw;line-height:1}
.kx-d-cal .t span{font-weight:900;font-size:.95cqw;letter-spacing:.14em}
.kx-d-cal .g{display:grid;grid-template-columns:repeat(7,1fr);gap:.25cqw;font-size:.78cqw;font-weight:700;text-align:center}
.kx-d-cal .g .w{opacity:.55;font-weight:900}
.kx-d-cal .g .on{background:var(--site-selected);color:#fbf8f1;border-radius:50%}
/* travel tags */
.kx-d-tag{aspect-ratio:9/16;background:var(--tg,#f1e8d6);color:#2a2530;clip-path:polygon(22% 0,78% 0,100% 9%,100% 100%,0 100%,0 9%);display:flex;flex-direction:column;align-items:stretch;padding:2.2cqw .55cqw .5cqw;gap:.25cqw;font-family:"Courier New",monospace;filter:drop-shadow(0 .35cqw .35cqw rgba(50,34,20,.3));background-image:radial-gradient(rgba(80,60,30,.08) 1px,transparent 1.4px);background-size:.6cqw .6cqw}
.kx-d-tag::before{content:"";position:absolute;left:50%;top:.75cqw;width:.9cqw;height:.9cqw;margin-left:-.45cqw;border-radius:50%;background:#c49a6c;box-shadow:0 0 0 .32cqw #fbf8f1,inset 0 .1cqw .15cqw rgba(0,0,0,.4)}
.kx-d-tag::after{content:"";position:absolute;left:0;right:0;top:62%;height:.5cqw;background:radial-gradient(circle at 0 50%,rgba(0,0,0,.35) .22cqw,transparent .25cqw) 0 0/.7cqw .5cqw repeat-x;opacity:.5}
.kx-d-tag .al{font:900 .62cqw/1 var(--site-body,Helvetica),sans-serif;letter-spacing:.12em;text-transform:uppercase;display:flex;justify-content:space-between}
.kx-d-tag .band{background:var(--tb,#9cc6dc);color:#fbf8f1;text-align:center;padding:.3cqw 0 .25cqw;display:flex;flex-direction:column;gap:.1cqw}
.kx-d-tag .band small{font:800 .5cqw/1 var(--site-body,Helvetica),sans-serif;letter-spacing:.08em}
.kx-d-tag .code{font:400 2.5cqw/0.9 var(--site-heading,Georgia),serif;letter-spacing:.02em}
.kx-d-tag .row{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.3cqw;border-top:.08cqw solid rgba(42,37,48,.35);padding-top:.2cqw}
.kx-d-tag .row small{font:800 .42cqw/1.1 var(--site-body,Helvetica),sans-serif;text-transform:uppercase;letter-spacing:.06em;opacity:.7}
.kx-d-tag .num{color:#c2413a;font-size:.95cqw;font-weight:700;letter-spacing:.04em}
.kx-d-tag .hand{font:400 1cqw/1 "Bradley Hand","Segoe Print","Comic Sans MS",cursive;color:#2f3f86}
.kx-d-tag .to{margin-top:auto;font:800 .6cqw/1.1 var(--site-body,Helvetica),sans-serif;text-transform:uppercase;letter-spacing:.06em;text-align:center}
.kx-d-tag2{aspect-ratio:9/16;background:#f3c7cf;color:#2f3f86;border-radius:.35cqw;padding:2cqw .5cqw .45cqw;display:flex;flex-direction:column;gap:.22cqw;font-family:var(--site-body,Helvetica),sans-serif;filter:drop-shadow(0 .35cqw .35cqw rgba(50,34,20,.3));-webkit-mask:radial-gradient(circle at 50% 1.1cqw,transparent .45cqw,#000 .5cqw);mask:radial-gradient(circle at 50% 1.1cqw,transparent .45cqw,#000 .5cqw)}
.kx-d-tag2::before{content:"";position:absolute;left:50%;top:1.1cqw;width:1.5cqw;height:1.5cqw;margin:-.75cqw 0 0 -.75cqw;border-radius:50%;box-shadow:0 0 0 .2cqw #fbf8f1}
.kx-d-tag2 .hd{display:flex;justify-content:space-between;align-items:flex-start;font-weight:800;font-size:.62cqw;line-height:1.05;font-weight:800}
.kx-d-tag2 .hd small{font-size:.42cqw;font-weight:600;opacity:.8}.kx-d-tag2 .hd b{font:900 1.9cqw/0.8 var(--site-heading,Georgia),serif}
.kx-d-tag2 .hand{font:400 1cqw/1 "Bradley Hand","Segoe Print","Comic Sans MS",cursive;color:#3a3550}.kx-d-tag2 .big{font-size:1.15cqw;border-bottom:.08cqw solid #2f3f86;padding-bottom:.15cqw}
.kx-d-tag2 .grid{display:grid;grid-template-columns:repeat(3,1fr);border:.08cqw solid #2f3f86}.kx-d-tag2 .grid.two{grid-template-columns:1fr 1fr}
.kx-d-tag2 .grid span{display:flex;flex-direction:column;padding:.12cqw .18cqw;gap:.08cqw}.kx-d-tag2 .grid span+span{border-left:.08cqw solid #2f3f86}
.kx-d-tag2 .grid small{font-size:.38cqw;font-weight:700;text-transform:uppercase}.kx-d-tag2 .grid i{font-style:normal;font-size:.85cqw}
.kx-d-tag2 .code{font:900 1.35cqw/1 var(--site-body,Helvetica),sans-serif;letter-spacing:.06em;text-align:center}
.kx-d-tag2 .perf{border-top:.1cqw dashed #2f3f86;margin:.05cqw -.5cqw}
.kx-d-tag2 .stripes{height:.45cqw;margin-top:auto;background:repeating-linear-gradient(-55deg,#2f3f86 0 .35cqw,transparent .35cqw .7cqw)}
.kx-d-tag2 .no{font:700 .55cqw/1 "Courier New",monospace;text-align:right;letter-spacing:.08em}
.kx-d-tag3{aspect-ratio:10/16;background:#f2a93b;color:#2a2530;border-radius:.7cqw;padding:1.9cqw .6cqw .6cqw;display:flex;flex-direction:column;align-items:center;gap:.25cqw;font-family:var(--site-body,Helvetica),sans-serif;filter:drop-shadow(0 .35cqw .35cqw rgba(50,34,20,.3));background-image:radial-gradient(rgba(255,255,255,.18) 1px,transparent 1.5px),radial-gradient(rgba(90,40,0,.12) 1px,transparent 1.5px);background-size:.5cqw .5cqw,.8cqw .8cqw}
.kx-d-tag3::before{content:"";position:absolute;left:50%;top:.75cqw;width:.7cqw;height:.7cqw;margin-left:-.35cqw;border-radius:50%;background:#7a4a1c;box-shadow:0 0 0 .22cqw #e9e2d2}
.kx-d-tag3 .hd{font-weight:900;font-size:.72cqw;line-height:1;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:.02em;text-align:center;border-bottom:.12cqw solid #2a2530;padding-bottom:.12cqw;width:100%;display:flex;flex-direction:column;gap:.06cqw}
.kx-d-tag3 .hd small{font-size:.36cqw;font-weight:700;letter-spacing:.08em}
.kx-d-tag3 .big{font:900 2.8cqw/0.9 var(--site-body,Helvetica),sans-serif;color:#fbf3e4}
.kx-d-tag3 .lbl{font-weight:800;font-size:.52cqw;line-height:1;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
.kx-d-tag3 .field{width:100%;background:#fbf3e4;border-radius:.25cqw;display:flex;align-items:center;gap:.3cqw;padding:.2cqw .3cqw}
.kx-d-tag3 .field small{font-size:.38cqw;font-weight:800;text-transform:uppercase}.kx-d-tag3 .hand{font:400 1.05cqw/1 "Bradley Hand","Segoe Print","Comic Sans MS",cursive;color:#3a3550}
.kx-d-tag3 .city{font-weight:900;font-size:.95cqw;line-height:1;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-top:auto}
.kx-d-tag3 .seat{background:#fbf3e4;border-radius:.3cqw;padding:.15cqw .5cqw;font:900 .95cqw/1 "Courier New",monospace;color:#2f3f86;display:flex;flex-direction:column;align-items:center}
.kx-d-tag3 .seat small{font:800 .34cqw/1 var(--site-body,Helvetica),sans-serif;color:#2a2530;text-transform:uppercase}
.kx-d-tag4{aspect-ratio:2.25/1;background:#6fa7a3;color:#21364a;border-radius:.6cqw;display:grid;grid-template-columns:1.25fr 1fr;font-family:var(--site-body,Helvetica),sans-serif;filter:drop-shadow(0 .35cqw .35cqw rgba(50,34,20,.3));-webkit-mask:linear-gradient(#000,#000) 0 0/calc(100% - .35cqw) 100% no-repeat,radial-gradient(circle at 100% 50%,transparent .18cqw,#000 .2cqw) 100% 0/.35cqw .55cqw repeat-y;mask:linear-gradient(#000,#000) 0 0/calc(100% - .35cqw) 100% no-repeat,radial-gradient(circle at 100% 50%,transparent .18cqw,#000 .2cqw) 100% 0/.35cqw .55cqw repeat-y;background-image:radial-gradient(rgba(255,255,255,.15) 1px,transparent 1.5px);background-size:.5cqw .5cqw}
.kx-d-tag4 .eye{position:absolute;left:.9cqw;top:50%;width:1.5cqw;height:1.5cqw;margin-top:-.75cqw;border-radius:50%;background:#e9d9a8;box-shadow:inset 0 0 0 .38cqw #d4c08a}.kx-d-tag4 .eye::after{content:"";position:absolute;inset:.42cqw;border-radius:50%;background:#c9a77a}
.kx-d-tag4 .main{display:flex;flex-direction:column;align-items:center;justify-content:center;padding-left:2.2cqw;gap:.1cqw}
.kx-d-tag4 .main small{font-weight:800;font-size:.62cqw}.kx-d-tag4 .main b{font:400 3.3cqw/.85 var(--site-heading,Georgia),serif;letter-spacing:-.02em}
.kx-d-tag4 .side{border-left:.12cqw solid #21364a;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr auto;margin:.45cqw .6cqw .45cqw 0}
.kx-d-tag4 .cell{display:flex;flex-direction:column;gap:.2cqw;padding:.2cqw .35cqw;border-bottom:.12cqw solid #21364a}.kx-d-tag4 .cell+.cell{border-left:.12cqw solid #21364a}
.kx-d-tag4 .cell small{font-weight:900;font-size:.46cqw;text-transform:uppercase}.kx-d-tag4 .hand{font:400 .95cqw/1 "Bradley Hand","Segoe Print","Comic Sans MS",cursive;color:#2b3550}
.kx-d-tag4 .no{grid-column:1/-1;font-weight:900;font-size:1.45cqw;letter-spacing:.04em;text-align:center;padding-top:.2cqw}
.kx-d-tag5{aspect-ratio:1/1.08;background:#eee4cf;color:#2a2530;font-family:var(--site-body,Helvetica),sans-serif;filter:drop-shadow(0 .35cqw .35cqw rgba(50,34,20,.3));border-radius:.4cqw .4cqw 0 0;display:flex;flex-direction:column;-webkit-mask:linear-gradient(#000,#000) 0 0/100% calc(100% - .35cqw) no-repeat,conic-gradient(from 135deg at 50% 0,#000 90deg,transparent 0) 0 100%/.55cqw .35cqw repeat-x;mask:linear-gradient(#000,#000) 0 0/100% calc(100% - .35cqw) no-repeat,conic-gradient(from 135deg at 50% 0,#000 90deg,transparent 0) 0 100%/.55cqw .35cqw repeat-x}
.kx-d-tag5::before{content:"";position:absolute;left:28%;top:.55cqw;width:.7cqw;height:.7cqw;margin-left:-.35cqw;border-radius:50%;background:#7b6a55;box-shadow:0 0 0 .2cqw #f7f1e4;z-index:1}
.kx-d-tag5 .hd{background:#2e4a5c;color:#f3ead8;height:34%;display:flex;align-items:flex-end;justify-content:space-between;padding:0 .5cqw .3cqw;border-radius:.4cqw .4cqw 0 0}
.kx-d-tag5 .hd span{font:italic 400 .95cqw/1 var(--site-heading,Georgia),serif;letter-spacing:.06em;text-transform:uppercase}
.kx-d-tag5 .hd i{font-style:normal;background:#f3ead8;color:#2e4a5c;display:flex;flex-direction:column;align-items:center;padding:.05cqw .22cqw;border-radius:.15cqw;margin-bottom:.05cqw}.kx-d-tag5 .hd small{font-size:.32cqw;font-weight:800;text-transform:uppercase}
.kx-d-tag5 .hd em{font-style:normal;font-size:.75cqw}.kx-d-tag5 .hand{font:400 .9cqw/1 "Bradley Hand","Segoe Print","Comic Sans MS",cursive}
.kx-d-tag5 .body{flex:1;display:flex;flex-direction:column;padding:.35cqw .5cqw .6cqw;gap:.06cqw}
.kx-d-tag5 .body small{font-size:.36cqw;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.kx-d-tag5 .body b{font-family:"Arial Narrow","Helvetica Neue Condensed",var(--site-body,Helvetica),sans-serif;font-stretch:condensed;font-weight:900;font-size:1.2cqw;line-height:1;text-transform:uppercase;letter-spacing:.02em;border-bottom:.1cqw solid rgba(42,37,48,.35);padding-bottom:.12cqw;margin-bottom:.12cqw}
.kx-d-tag5 .no{margin-top:auto;font:400 .82cqw/1 "Courier New",monospace;font-weight:700;letter-spacing:.06em;text-align:center;opacity:.8}
.kx-d-vinyl{aspect-ratio:1/1;filter:drop-shadow(0 .45cqw .5cqw rgba(50,34,20,.35))}.kx-d-vinyl img{width:100%;height:100%;display:block}.kx-d-vinyl .kx-d-pin{left:50%;top:50%;margin:-.55cqw 0 0 -.45cqw}
.kx-d-cass{aspect-ratio:881/558;filter:drop-shadow(0 .4cqw .45cqw rgba(50,34,20,.32))}.kx-d-cass img{width:100%;height:100%;display:block}
/* stickers */
.kx-d-stk{filter:drop-shadow(.22cqw 0 0 #fff) drop-shadow(-.22cqw 0 0 #fff) drop-shadow(0 .22cqw 0 #fff) drop-shadow(0 -.22cqw 0 #fff) drop-shadow(0 .4cqw .4cqw rgba(50,34,20,.3))}
.kx-d-stk img,.kx-d-sp img{object-fit:contain}
.kx-d-spark{aspect-ratio:1/1;background:var(--sc,var(--site-selected));-webkit-mask:var(--sm) center/contain no-repeat;mask:var(--sm) center/contain no-repeat;filter:drop-shadow(0 .2cqw .2cqw rgba(50,34,20,.25))}
.kx-d-stamp{background:#fbf8f1;padding:.55cqw;-webkit-mask:radial-gradient(circle,transparent .28cqw,#000 .3cqw) -.35cqw -.35cqw/.95cqw .95cqw,linear-gradient(#000,#000) .45cqw .45cqw/calc(100% - .9cqw) calc(100% - .9cqw) no-repeat}
.kx-d-stamp .ph{aspect-ratio:4/5;overflow:hidden}
.kx-d-stamp .ph img{filter:sepia(.25) saturate(.9)}
.kx-d-stamp em{position:absolute;right:.9cqw;bottom:.8cqw;font-style:normal;font-family:var(--site-heading);font-size:1.4cqw;color:#fbf8f1;text-shadow:0 .1cqw .3cqw rgba(0,0,0,.5)}
/* charm-prominence tweaks (data attrs on <html>) */
[data-cb-mute="on"] .kx-deco>.kx-d:not(.kx-d-note):not(.kx-d-arrow):not(.kx-d-stk){opacity:.78;filter:saturate(.25) drop-shadow(0 .35cqw .4cqw rgba(50,34,20,.22))!important}
[data-cb-mute="on"] .kx-deco>.kx-d-stk{opacity:.85;filter:saturate(.25) drop-shadow(.22cqw 0 0 #fff) drop-shadow(-.22cqw 0 0 #fff) drop-shadow(0 .22cqw 0 #fff) drop-shadow(0 -.22cqw 0 #fff) drop-shadow(0 .4cqw .4cqw rgba(50,34,20,.22))!important}
[data-cb-clear="on"] .kx-d-cz{display:none}
.kx-d-arrow{display:none;filter:none;overflow:visible}
[data-cb-arrow="on"] .kx-d-arrow{display:block}
.kx-d-arrow path{fill:none;stroke:#4c4039;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.kx-d-arrow .ln{stroke-dasharray:5 6}
.kx-cb-cork>.kx-deco-m{display:none}
@media (max-width:860px){.kx-cb-cork>.kx-deco{display:none}.kx-cb-cork>.kx-deco-m{display:block}}
`;

const at = (x, y, w, r, extra) => ({ left: x + '%', top: y + '%', width: w + '%', '--r': r + 'deg', ...extra });
const Pin = ({ c }) => <span className="kx-d-pin" style={c ? { '--pc': c } : null}></span>;
const Tape = ({ c, r, dots, style }) => <span className={'kx-d-tape' + (dots ? ' dots' : '')} style={{ '--tc': c, '--tr': (r || -3) + 'deg', ...style }}></span>;

function Calendar() {
  /* fixed: Kaylee's birthday */
  const now = new Date(2006, 8, 27);
  const y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(<span key={'b' + i}></span>);
  for (let d = 1; d <= days; d++) cells.push(<span key={d} className={d === now.getDate() ? 'on' : null}>{d}</span>);
  const name = now.toLocaleString('en-US', { month: 'long' });
  return (
    <div className="kx-d kx-d-cal" style={at(35.6, 2.5, 13, 0)}>
      <span className="kx-d-clip"></span>
      <div className="t"><b>{name}</b><span>{y}</span></div>
      <div className="g">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={'w' + i} className="w">{d}</span>)}
        {cells}
      </div>
    </div>
  );
}

const spark = (n) => 'url(assets/sparkles/sparkle-' + String(n).padStart(2, '0') + '.svg)';

const TagLAX = ({ pos }) => (
  <div className="kx-d kx-d-tag" style={at(...pos, { '--tg': '#f1e8d6', '--tb': '#8fbfd9' })}>
    <div className="al"><span>Airlines</span><span>#72</span></div>
    <div className="band"><small>Los Angeles, CA</small><span className="code">LAX</span></div>
    <div className="row"><small>Strap<br />check</small><span className="num">148467</span></div>
    <div className="row"><small>Flight</small><span className="hand">AA 605</span></div>
    <div className="to">To: Los Angeles</div>
  </div>
);
const TagJFK = ({ pos }) => (
  <div className="kx-d kx-d-tag4" style={at(...pos)}>
    <span className="eye"></span>
    <div className="main"><small>New York City</small><b>NYC</b></div>
    <div className="side">
      <div className="cell"><small>Flight</small><span className="hand">DL 830</span></div>
      <div className="cell"><small>Date</small><span className="hand">04·12</span></div>
      <div className="no">97-750</div>
    </div>
  </div>
);
const TagSZX = ({ pos }) => (
  <div className="kx-d kx-d-tag5" style={at(...pos)}>
    <div className="hd"><span>The</span><i><small>Weight</small><em className="hand">23</em></i></div>
    <div className="body">
      <small>Checked to:</small><b>Shenzhen</b>
      <small>Train / flight:</small><b>Express</b>
      <div className="no">CZ 451 - 609</div>
    </div>
  </div>
);

function CorkDeco() {
  return (
    <div className="kx-deco" aria-hidden="true">
      <style>{DECO_CSS}</style>

      <div className="kx-d kx-d-pennant" style={at(1.5, 1.5, 33, 0)}>
        <span className="kx-d-pin" style={{ '--pc': '#5a5f8c', left: '1.4cqw', top: '1.2cqw' }}></span>
        <span className="kx-d-pin" style={{ '--pc': '#5a5f8c', left: '1.4cqw', top: 'auto', bottom: '1.2cqw' }}></span>
        <img src="assets/nyu-pennant.png" alt="" style={{ height: 'auto', aspectRatio: '467/177' }} />
        <span className="felt"></span>
      </div>

      <div className="kx-d kx-d-note" style={at(52.6, -4.5, 10.5, 0)}>
        <Pin c="#4f7d78" />
        <span>pick a charm</span>
      </div>

      <svg className="kx-d kx-d-arrow" style={at(60.8, 10, 5.4, 0)} viewBox="0 0 60 110"><path className="ln" d="M4 4C30 8 50 30 45 60C42 78 44 90 50 100"></path><path d="M38 93L50.5 101.5L54 86"></path></svg>

      <div className="kx-d kx-d-pol" style={at(1.5, 31, 10.5, 0)}>
        <Pin />
        <div className="ph"><img src="assets/bday/cake-portrait-film.png" alt="" /></div>
      </div>

      <div className="kx-d kx-d-vinyl" style={at(42.4, 31, 12.2, 0)}>
        <img src="assets/vinyl-dynamite.png" alt="" />
      </div>

      <div className="kx-d kx-d-cz" style={{ ...at(74.2, 44.3, 8.2, 0), aspectRatio: '1/1', filter: 'drop-shadow(0 .35cqw .4cqw rgba(50,34,20,.32))' }}>
        <img src="assets/cd-loveyourself.png" alt="" />
      </div>

      <div className="kx-d kx-d-cass" style={at(23.6, 66, 18, 0)}>
        <img src="assets/cassette-mots7.png" alt="" />
      </div>

      <Calendar />

      <div className="kx-d kx-d-booth" style={at(15, 31, 6, 0)}>
        <Tape c="var(--site-container)" r={0.001} style={{ width: '6cqw', marginLeft: '-3cqw' }} />
        {['assets/booth/booth-1.jpg', 'assets/booth/booth-2.jpg', 'assets/booth/booth-3.jpg'].map((s, i) =>
          <div className="ph" key={s}><img src={s} alt="" style={i === 2 ? { transform: 'scale(1.25)', transformOrigin: '50% 30%' } : undefined} /></div>)}
        <div className="logo"><span>kaylee<br />xiao</span></div>
      </div>

            {[[32.6, 31, 8.5, 0, 1, 'pin']].map(([x, y, w, r, n, k]) =>
        <div key={n} className="kx-d kx-d-inst" style={at(x, y, w, r)}>
          {k === 'pin' ? <Pin c={n % 2 ? '#d9a441' : '#5a5f8c'} /> : <Tape c="#e8c9c3" r={n % 2 ? 5 : -6} style={{ width: '4.5cqw', marginLeft: '-2.25cqw' }} />}
          <img src={'assets/bday/bday-' + n + '.png'} alt="" />
        </div>)}

      <div className="kx-d kx-d-stk" style={at(10.9, 62, 4.2, -5)}>
        <img src="assets/stickers/fig-1.png" alt="" style={{ height: 'auto', aspectRatio: '214/354' }} />
      </div>
      <div className="kx-d kx-d-sp" style={at(56, 22.5, 4.6, 0)}>
        <img src="assets/stickers/stamp-run.png" alt="" style={{ height: 'auto', aspectRatio: '170/194' }} />
      </div>
      <div className="kx-d kx-d-sp" style={at(56, 34.2, 4.6, 0)}>
        <img src="assets/stickers/stamp-springday.png" alt="" style={{ height: 'auto', aspectRatio: '170/190' }} />
      </div>
      <div className="kx-d kx-d-sp" style={at(56.2, 46, 4.2, 0)}>
        <img src="assets/stickers/stamp-boyinluv.png" alt="" style={{ height: 'auto', aspectRatio: '314/390' }} />
      </div>
      <div className="kx-d kx-d-stk kx-d-cz" style={at(75, 27, 4.4, 4)}>
        <img src="assets/stickers/fig-2.png" alt="" style={{ height: 'auto', aspectRatio: '242/356' }} />
      </div>
      <div className="kx-d kx-d-stk" style={at(53.2, 89, 4.2, -8)}>
        <img src="assets/stickers/bt21-tata.png" alt="" style={{ height: 'auto', aspectRatio: '445/340' }} />
      </div>
      <div className="kx-d kx-d-stk kx-d-cz" style={at(92.5, 80, 4.2, 7)}>
        <img src="assets/stickers/bt21-cooky.png" alt="" style={{ height: 'auto', aspectRatio: '418/445' }} />
      </div>
      <div className="kx-d kx-d-stk" style={at(52.6, 77, 6, -4)}>
        <img src="assets/stickers/nyc-metrocard.png" alt="" style={{ height: 'auto', aspectRatio: '542/349' }} />
      </div>
      <div className="kx-d kx-d-stk" style={at(59.5, 62.5, 4, -8)}>
        <img src="assets/stickers/nyc-coffee.png" alt="" style={{ height: 'auto', aspectRatio: '191/202' }} />
      </div>
      <div className="kx-d kx-d-stk kx-d-cz" style={at(95, 44, 4.2, -3)}>
        <img src="assets/stickers/nyc-arch.png" alt="" style={{ height: 'auto', aspectRatio: '229/253' }} />
      </div>
      <div className="kx-d" style={{ ...at(23.6, 31, 7.5, 0), filter: 'drop-shadow(0 .4cqw .45cqw rgba(50,34,20,.32))' }}>
        <Pin c="#7a6fb8" />
        <img src="assets/stickers/ytc-ticket.png" alt="" style={{ width: '100%', height: 'auto', aspectRatio: '620/1331', display: 'block' }} />
      </div>
      <div className="kx-d kx-d-stk kx-d-cz" style={at(73, 2, 3.6, 6)}>
        <img src="assets/stickers/nyc-bagel.png" alt="" style={{ height: 'auto', aspectRatio: '252/251' }} />
      </div>


      <div className="kx-d" style={{ ...at(11.4, 79.5, 11.2, 0), filter: 'drop-shadow(0 .4cqw .45cqw rgba(50,34,20,.32))' }}>
        <img src="assets/polaroid-now-v2.png" alt="" style={{ width: '100%', height: 'auto', aspectRatio: '429/373', display: 'block' }} />
      </div>

      <TagLAX pos={[1.5, 61, 6.8, 0]} />
      <TagJFK pos={[43.1, 60, 15, 0]} />
      <TagSZX pos={[43.1, 76, 8, 0]} />

      <span className="kx-d kx-d-spark" style={at(3, 92, 2.6, 0, { '--sm': spark(14), '--sc': '#d9a441' })}></span>
    </div>
  );
}

/* phone: the board is too small for the full collage, so a few stickers
   tuck in behind the charms, peeking out from their edges */
const Stk = ({ src, ar, pos }) => (
  <div className="kx-d kx-d-stk" style={at(...pos)}>
    <img src={'assets/stickers/' + src} alt="" style={{ height: 'auto', aspectRatio: ar }} />
  </div>
);
function CorkDecoPhone() {
  return (
    <div className="kx-deco kx-deco-m" aria-hidden="true">
      <Stk src="bt21-tata.png" ar="445/340" pos={[1.5, 46, 13, -10]} />
      <Stk src="nyc-coffee.png" ar="191/202" pos={[44.5, 1.5, 11, 8]} />
      <Stk src="fig-2.png" ar="242/356" pos={[89, 40, 9, 10]} />
      <Stk src="nyc-metrocard.png" ar="542/349" pos={[3, 89, 18, -6]} />
      <Stk src="bt21-cooky.png" ar="418/445" pos={[44, 88, 11, 6]} />
      <span className="kx-d kx-d-spark" style={at(47, 47, 6, 0, { '--sm': spark(14), '--sc': '#d9a441' })}></span>
    </div>
  );
}

function CorkDecoAll() {
  return <React.Fragment><CorkDeco /><CorkDecoPhone /></React.Fragment>;
}

window.KXCorkDeco = CorkDecoAll;
})();
