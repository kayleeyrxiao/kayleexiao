import * as THREE from 'three';
import { buildHangTag } from './site-hang-tag-3d.js';

/* NYU acrylic keyring — the Education fob. Clear acrylic blank die-cut to the
   logo silhouette, with the logo engraved into the front face, on a chain and
   split ring. Rendered once offscreen into a sprite the corkboard hangs from
   its hook, so the swing physics stays pure DOM.

   Acrylic is not moulded rubber: there is no opaque colour standing proud.
   An engraving reads because the cut surface is frosted while the rest stays
   polished, so the artwork appears as scattered white against a mirror. The
   relief is real displaced geometry and the frost is a roughness change
   riding in the same recesses. Scene units = millimetres. */

const LOGO_SRC = 'data:image/png;base64,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';
const PX_PER_MM = 1.85;   /* sprite scale: puts the split ring near the 52px
                             of the CSS keyrings it sits beside */

function build(img) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(2);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const HAS_COLORSPACE = 'outputColorSpace' in renderer;
  if (HAS_COLORSPACE) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  const markSRGB = t => {
    if (HAS_COLORSPACE) t.colorSpace = THREE.SRGBColorSpace;
    else t.encoding = THREE.sRGBEncoding;
    return t;
  };
  const texFrom = (canvas, srgb) => {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (srgb) markSRGB(t);
    return t;
  };

  const scene = new THREE.Scene();

  /* ---------------- colour, solved against this pipeline ---------------- */
  const PURPLE_TARGET = [97, 38, 122];   /* sampled from the NYU logo file */
  const IRRADIANCE = 1.55;
  const M_IN = [[0.59719, 0.35458, 0.04823], [0.076, 0.90834, 0.01566], [0.0284, 0.13383, 0.83777]];
  const M_OUT = [[1.60475, -0.53108, -0.07367], [-0.10208, 1.10813, -0.00605], [-0.00327, -0.07276, 1.07602]];
  const mul3 = (m, v) => m.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const s2l = s => s.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const l2s = l => l.map(v => {
    v = Math.min(1, Math.max(0, v));
    return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  });
  function toneCurve(lin) {
    const e = renderer.toneMappingExposure;
    let c = mul3(M_IN, lin.map(v => v * e / 0.6));
    c = c.map(v => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081));
    return mul3(M_OUT, c).map(v => Math.min(1, Math.max(0, v)));
  }
  function solveAlbedo(target255) {
    const tgt = target255.map(v => v / 255);
    let alb = s2l(tgt);
    for (let i = 0; i < 120; i++) {
      const out = l2s(toneCurve(alb.map(v => v * IRRADIANCE)));
      alb = alb.map((v, j) => Math.min(1, Math.max(0, v * (tgt[j] / Math.max(out[j], 1e-6)))));
    }
    return '#' + l2s(alb).map(v =>
      Math.round(Math.min(255, Math.max(0, v * 255))).toString(16).padStart(2, '0')).join('');
  }
  const PURPLE = solveAlbedo(PURPLE_TARGET);
  const WHITE = solveAlbedo([236, 234, 236]);

  /* ---------------------- studio environment ----------------------
     Clear acrylic is almost entirely reflection and edge highlight, so the
     room does more work here than it does on the metal parts. */
  function studioEnv() {
    const w = 1024, h = 512;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, h * 0.58);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f2f0ec'); g.addColorStop(1, '#cbc6bd');
    x.fillStyle = g; x.fillRect(0, 0, w, h * 0.58);
    const f = x.createLinearGradient(0, h * 0.58, 0, h);
    f.addColorStop(0, '#4a453d'); f.addColorStop(0.45, '#2a261f'); f.addColorStop(1, '#141210');
    x.fillStyle = f; x.fillRect(0, h * 0.58, w, h * 0.42);
    if ('filter' in x) x.filter = 'blur(7px)';
    x.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
      const bw = w * 0.15, gap = w * 0.035;
      x.globalAlpha = i === 1 ? 1 : 0.82;
      x.fillRect(i * (bw + gap) + w * 0.02, h * 0.05, bw, h * 0.2);
    }
    x.globalAlpha = 0.9; x.fillRect(0, 0, w, h * 0.03);
    x.globalAlpha = 0.55; x.fillStyle = '#b8b4ad';
    x.fillRect(w * 0.3, h * 0.3, w * 0.14, h * 0.18);
    x.fillRect(w * 0.63, h * 0.32, w * 0.11, h * 0.16);
    x.globalAlpha = 0.85; x.fillStyle = '#ffffff';
    x.fillRect(w * 0.03, h * 0.4, w * 0.05, h * 0.07);
    x.fillRect(w * 0.9, h * 0.44, w * 0.04, h * 0.06);
    if ('filter' in x) x.filter = 'blur(2px)';
    x.globalAlpha = 0.75; x.fillStyle = '#fffaf0';
    x.fillRect(0, h * 0.565, w, h * 0.012);
    if ('filter' in x) x.filter = 'none';
    x.globalAlpha = 1;
    const t = texFrom(c, true);
    t.mapping = THREE.EquirectangularReflectionMapping;
    const p = new THREE.PMREMGenerator(renderer);
    p.compileEquirectangularShader();
    const env = p.fromEquirectangular(t).texture;
    t.dispose(); p.dispose();
    return env;
  }
  scene.environment = studioEnv();

  /* --------------------------- die-cut layout ---------------------------
     Proportions measured off the logo file — square and wordmark share a
     width, the wordmark is 0.340 of the square's height, gap 0.098 — so
     geometry and artwork placement stay locked together. */
  const SQ = 38.0, SQ_H = SQ * 0.99, GAP = SQ * 0.098, WM_H = SQ * 0.34;
  const BORDER = 2.6;   /* clear margin around the artwork */
  const T = 3.6;        /* acrylic blank thickness */
  const SQ_Y = 4.55;
  const WM_Y = SQ_Y - SQ_H / 2 - GAP - WM_H / 2;
  const LOBE_W = SQ + BORDER * 2;
  const TAB_W = 13, TAB_H = 10.5;
  const TAB_Y = SQ_Y + (SQ_H / 2 + BORDER) + 2.0;
  const HOLE_Y = TAB_Y + 1.0, HOLE_R = 2.5;
  const PART_W = LOBE_W;
  const PART_TOP = TAB_Y + TAB_H / 2;
  const PART_BOT = WM_Y - WM_H / 2 - BORDER;
  const PART_H = PART_TOP - PART_BOT;
  const PART_CY = (PART_TOP + PART_BOT) / 2;
  const LOBES = [
    [0, TAB_Y, TAB_W, TAB_H, 3.2],
    [0, SQ_Y, LOBE_W, SQ_H + BORDER * 2, 3.4],
    [0, WM_Y, LOBE_W, WM_H + BORDER * 2, 3.0]
  ];
  /* Printed-on artwork, not engraved: the logo sits a hair proud of a
     polished face and the blank stays a solid piece of clear acrylic. */
  const DEPTH = 0;

  function roundedRectShape(cx, cy, w, h, r) {
    const s = new THREE.Shape();
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    r = Math.min(r, w / 2, h / 2);
    s.moveTo(x0 + r, y0);
    s.lineTo(x1 - r, y0); s.quadraticCurveTo(x1, y0, x1, y0 + r);
    s.lineTo(x1, y1 - r); s.quadraticCurveTo(x1, y1, x1 - r, y1);
    s.lineTo(x0 + r, y1); s.quadraticCurveTo(x0, y1, x0, y1 - r);
    s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0);
    return s;
  }
  function ctxRoundRect(x, cx, cy, w, h, r, toPx) {
    const p = toPx(cx - w / 2, cy + h / 2);
    const W = w * toPx.s, H = h * toPx.s, R = Math.min(r * toPx.s, W / 2, H / 2);
    x.beginPath();
    x.moveTo(p.x + R, p.y);
    x.lineTo(p.x + W - R, p.y); x.quadraticCurveTo(p.x + W, p.y, p.x + W, p.y + R);
    x.lineTo(p.x + W, p.y + H - R); x.quadraticCurveTo(p.x + W, p.y + H, p.x + W - R, p.y + H);
    x.lineTo(p.x + R, p.y + H); x.quadraticCurveTo(p.x, p.y + H, p.x, p.y + H - R);
    x.lineTo(p.x, p.y + R); x.quadraticCurveTo(p.x, p.y, p.x + R, p.y);
    x.closePath();
  }

  /* --------------------------- engraving maps ---------------------------
     height — logo luminance: the ink sits low, the untouched face stays
              high, biased so the polished surface is zero and the artwork
              cuts into the blank.
     frost  — the inverse: opaque only inside the cut, where the
              scattered-white finish lives.
     mask   — die-cut silhouette, eroded so the blank's polished edge roll
              stays visible around the engraved face. */
  const PPM = 16;
  function faceMaps() {
    const W = Math.round(PART_W * PPM), H = Math.round(PART_H * PPM);
    const toPx = (mmx, mmy) => ({ x: (mmx + PART_W / 2) * PPM, y: (PART_TOP - mmy) * PPM });
    toPx.s = PPM;

    const art = document.createElement('canvas'); art.width = W; art.height = H;
    const a = art.getContext('2d');
    a.fillStyle = '#ffffff'; a.fillRect(0, 0, W, H);
    const logoW = SQ * PPM, logoH = logoW * (img.height / img.width);
    const lp = toPx(-SQ / 2, SQ_Y + SQ_H / 2);
    a.drawImage(img, lp.x, lp.y, logoW, logoH);

    const hgt = document.createElement('canvas'); hgt.width = W; hgt.height = H;
    const hc = hgt.getContext('2d');
    hc.drawImage(art, 0, 0);
    const hid = hc.getImageData(0, 0, W, H), hd = hid.data;
    for (let i = 0; i < hd.length; i += 4) {
      const lum = (0.299 * hd[i] + 0.587 * hd[i + 1] + 0.114 * hd[i + 2]) / 255;
      const v = Math.round(255 * Math.min(1, Math.max(0, (lum - 0.28) / 0.42)));
      hd[i] = hd[i + 1] = hd[i + 2] = v; hd[i + 3] = 255;
    }
    hc.putImageData(hid, 0, 0);
    if ('filter' in hc) {                  /* a cut wall is never a knife edge */
      const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
      tmp.getContext('2d').drawImage(hgt, 0, 0);
      hc.clearRect(0, 0, W, H);
      hc.filter = 'blur(2px)'; hc.drawImage(tmp, 0, 0); hc.filter = 'none';
    }

    const frost = document.createElement('canvas'); frost.width = W; frost.height = H;
    const fc = frost.getContext('2d');
    fc.drawImage(hgt, 0, 0);
    const fid = fc.getImageData(0, 0, W, H), fd = fid.data;
    for (let i = 0; i < fd.length; i += 4) {
      const v = 255 - fd[i];
      fd[i] = fd[i + 1] = fd[i + 2] = v; fd[i + 3] = 255;
    }
    fc.putImageData(fid, 0, 0);

    const rough = document.createElement('canvas'); rough.width = W; rough.height = H;
    rough.getContext('2d').drawImage(frost, 0, 0);   /* rough inside the cut */

    const msk = document.createElement('canvas'); msk.width = W; msk.height = H;
    const m = msk.getContext('2d');
    m.fillStyle = '#000000'; m.fillRect(0, 0, W, H);
    m.fillStyle = '#ffffff';
    LOBES.forEach(([cx, cy, w, h, r]) => {
      ctxRoundRect(m, cx, cy, w - 1.5, h - 1.5, Math.max(0.5, r - 0.7), toPx); m.fill();
    });
    m.globalCompositeOperation = 'destination-out';
    const hp = toPx(0, HOLE_Y);
    m.beginPath(); m.arc(hp.x, hp.y, (HOLE_R + 0.6) * PPM, 0, 7); m.fill();
    m.globalCompositeOperation = 'source-over';

    const col = document.createElement('canvas'); col.width = W; col.height = H;
    const cc = col.getContext('2d');
    cc.drawImage(art, 0, 0);
    const cid = cc.getImageData(0, 0, W, H), cd = cid.data;
    const pr = parseInt(PURPLE.slice(1, 3), 16), pg = parseInt(PURPLE.slice(3, 5), 16), pb = parseInt(PURPLE.slice(5, 7), 16);
    const wr = parseInt(WHITE.slice(1, 3), 16), wg = parseInt(WHITE.slice(3, 5), 16), wb = parseInt(WHITE.slice(5, 7), 16);
    for (let i = 0; i < cd.length; i += 4) {
      const lum = (0.299 * cd[i] + 0.587 * cd[i + 1] + 0.114 * cd[i + 2]) / 255;
      const k = Math.min(1, Math.max(0, (lum - 0.3) / 0.45));
      cd[i] = pr + (wr - pr) * k;
      cd[i + 1] = pg + (wg - pg) * k;
      cd[i + 2] = pb + (wb - pb) * k;
    }
    cc.putImageData(cid, 0, 0);

    return {
      color: texFrom(col, true), height: texFrom(hgt, false),
      frost: texFrom(frost, false), rough: texFrom(rough, false), mask: texFrom(msk, false)
    };
  }

  /* ---------------------- one-piece outline ----------------------
     The part is a single piece of acrylic, so it needs a single outline.
     Extruding the three lobes separately leaves their interior walls inside
     the solid — visible through clear material as seams, which is what makes
     a charm look assembled rather than cut. So the lobes are rasterised,
     blurred and thresholded (the blur adds the fillets a real cutter leaves
     where two curves meet), then traced back out as one closed contour and
     extruded once. */
  function traceContour(inside, W, H) {
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? false : inside(x, y);
    let sx = -1, sy = -1;
    outer:
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y)) { sx = x; sy = y; break outer; }
    if (sx < 0) return [];
    const N = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
    const idxOf = (dx, dy) => N.findIndex(n => n[0] === dx && n[1] === dy);
    const pts = [[sx, sy]];
    let cx = sx, cy = sy, bx = sx - 1, by = sy;
    const MAX = W * H * 8;
    for (let step = 0; step < MAX; step++) {
      const start = idxOf(bx - cx, by - cy);
      let found = false;
      for (let k = 1; k <= 8; k++) {
        const i = (start + k) % 8;
        const nx = cx + N[i][0], ny = cy + N[i][1];
        if (at(nx, ny)) {
          const prev = (i - 1 + 8) % 8;
          bx = cx + N[prev][0]; by = cy + N[prev][1];
          cx = nx; cy = ny; found = true; break;
        }
      }
      if (!found) break;
      if (cx === sx && cy === sy) break;
      pts.push([cx, cy]);
    }
    return pts;
  }
  function rdp(pts, eps) {
    if (pts.length < 3) return pts;
    const d2 = (p, a, b) => {
      const vx = b[0] - a[0], vy = b[1] - a[1], wx = p[0] - a[0], wy = p[1] - a[1];
      const L = vx * vx + vy * vy;
      const t = L ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / L)) : 0;
      const cx = a[0] + t * vx - p[0], cy = a[1] + t * vy - p[1];
      return cx * cx + cy * cy;
    };
    const keep = new Array(pts.length).fill(false);
    keep[0] = keep[pts.length - 1] = true;
    const st = [[0, pts.length - 1]];
    while (st.length) {
      const [a, b] = st.pop();
      let idx = -1, max = 0;
      for (let i = a + 1; i < b; i++) { const d = d2(pts[i], pts[a], pts[b]); if (d > max) { max = d; idx = i; } }
      if (max > eps * eps) { keep[idx] = true; st.push([a, idx], [idx, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  }
  const OPPM = 12;   /* outline raster resolution, px per mm */
  function outlineShape() {
    const W = Math.round(PART_W * OPPM) + 40, H = Math.round(PART_H * OPPM) + 40;
    const off = 20;
    const toPx = (mmx, mmy) => ({ x: (mmx + PART_W / 2) * OPPM + off, y: (PART_TOP - mmy) * OPPM + off });
    toPx.s = OPPM;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    if ('filter' in x) x.filter = 'blur(' + (0.9 * OPPM).toFixed(1) + 'px)';
    x.fillStyle = '#fff';
    LOBES.forEach(([cx, cy, w, h, r]) => { ctxRoundRect(x, cx, cy, w, h, r, toPx); x.fill(); });
    if ('filter' in x) x.filter = 'none';
    const d = x.getImageData(0, 0, W, H).data;
    const inside = (px, py) => d[(py * W + px) * 4] > 127;   /* threshold the blur */
    let pts = traceContour(inside, W, H);
    if (pts.length < 8) return null;       /* tracer found nothing usable */
    pts = rdp(pts, 0.9);
    const shape = new THREE.Shape();
    pts.forEach(([px, py], i) => {
      const mmx = (px - off) / OPPM - PART_W / 2;
      const mmy = PART_TOP - (py - off) / OPPM;
      i === 0 ? shape.moveTo(mmx, mmy) : shape.lineTo(mmx, mmy);
    });
    shape.closePath();
    const hole = new THREE.Path();          /* punched, exact */
    hole.absarc(0, HOLE_Y, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return shape;
  }

  /* ---------------------------- materials ----------------------------
     Solid cast acrylic. A single closed piece can write depth, so it sorts
     against itself correctly and reads with real thickness. */
  const acrylic = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02,
    transparent: true, opacity: 0.62,
    clearcoat: 1.0, clearcoatRoughness: 0.015,
    envMapIntensity: 1.9, depthWrite: true
  });
  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xf2f3f5, metalness: 1.0, roughness: 0.06, envMapIntensity: 1.9
  });

  /* ------------------------------ the part ------------------------------ */
  const rig = new THREE.Group();
  scene.add(rig);
  const part = new THREE.Group(), hardware = new THREE.Group();
  rig.add(part); rig.add(hardware);
  part.position.y = -HOLE_Y;   /* the punched hole is the hanging point */

  const maps = faceMaps();
  const bev = 0.5;
  const outline = outlineShape();
  const shapes = outline ? [outline] : LOBES.map(([cx, cy, w, h, r], i) => {
    const sh = roundedRectShape(cx, cy, w, h, r);   /* fallback path */
    if (i === 0) {
      const hole = new THREE.Path();
      hole.absarc(0, HOLE_Y, HOLE_R, 0, Math.PI * 2, true);
      sh.holes.push(hole);
    }
    return sh;
  });
  shapes.forEach(shape => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: T - bev * 2, bevelEnabled: true,
      bevelThickness: bev, bevelSize: bev, bevelSegments: 4,
      curveSegments: 6
    });
    g.translate(0, 0, -T / 2 + bev);
    const mesh = new THREE.Mesh(g, acrylic);
    mesh.renderOrder = 1;
    part.add(mesh);
  });

  const segX = Math.round(PART_W * 3.5), segY = Math.round(PART_H * 3.5);
  const geo = new THREE.PlaneGeometry(PART_W, PART_H, segX, segY);

  /* Front face, polished all over: no frost, because nothing is cut. */
  const faceMesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02,
    displacementMap: maps.height, displacementScale: DEPTH, displacementBias: -DEPTH,
    alphaMap: maps.mask, transparent: true, alphaTest: 0.5,
    clearcoat: 1.0, clearcoatRoughness: 0.02,
    opacity: 0.68, envMapIntensity: 1.9, depthWrite: true
  }));
  faceMesh.position.set(0, PART_CY, T / 2 - 0.3);
  faceMesh.renderOrder = 2;
  part.add(faceMesh);

  /* printed artwork. Alpha follows the ink, not the die-cut: the white field
     of the logo drops out entirely and the acrylic shows through it. */
  const fillMesh = new THREE.Mesh(geo.clone(), new THREE.MeshStandardMaterial({
    map: maps.color, color: 0xffffff, roughness: 0.46, metalness: 0,
    alphaMap: maps.frost, transparent: true, alphaTest: 0.42,
    opacity: 1.0, depthWrite: true,
    bumpMap: maps.frost, bumpScale: 0.045,   /* ink has thickness */
    displacementMap: maps.height, displacementScale: DEPTH, displacementBias: -DEPTH,
    envMapIntensity: 0.7,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  }));
  fillMesh.position.set(0, PART_CY, T / 2 + 0.03);
  fillMesh.renderOrder = 3;
  part.add(fillMesh);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(PART_W, PART_H, 1, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.02, metalness: 0,
      alphaMap: maps.mask, transparent: true, alphaTest: 0.5,
      opacity: 0.62, clearcoat: 1.0, side: THREE.BackSide,
      envMapIntensity: 1.7, depthWrite: true
    }));
  back.position.set(0, PART_CY, -T / 2 + 0.02);
  back.renderOrder = 1;
  part.add(back);

  /* ---------------------------- hardware ---------------------------- */
  const ovalLink = (r, tube, stretch) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 18, 80), chrome);
    m.scale.y = stretch;
    return m;
  };
  const jump = ovalLink(3.0, 0.55, 1.0);
  jump.rotation.y = Math.PI / 2;          /* threaded through the punched hole */
  hardware.add(jump);
  let y = 3.0;
  for (let i = 0; i < 4; i++) {
    const r = 2.6, tube = 0.52, stretch = 1.6;
    const link = ovalLink(r, tube, stretch);
    link.rotation.y = (i % 2) ? 0 : Math.PI / 2;
    y += r * stretch * 0.8;
    link.position.y = y;
    hardware.add(link);
    y += r * stretch * 0.8 - tube * 1.6;
  }
  const SPLIT_R = 12.5, SPLIT_TUBE = 0.62;
  const split = new THREE.Group();
  [-0.62, 0.62].forEach(z => {            /* a split ring is a coil, two turns */
    const t = new THREE.Mesh(new THREE.TorusGeometry(SPLIT_R, SPLIT_TUBE, 18, 110), chrome);
    t.position.z = z;
    split.add(t);
  });
  const SPLIT_Y = y + 12.0;
  split.position.y = SPLIT_Y;
  hardware.add(split);

  /* the paper tag, tied to the split ring in the same scene */
  rig.add(buildHangTag(THREE, {
    texFrom, chrome, ringR: SPLIT_R, ringY: SPLIT_Y,
    label: 'Education',
    partHalfW: PART_W / 2,
    font: getComputedStyle(document.documentElement).getPropertyValue('--site-heading').trim() || 'Georgia, serif'
  }));

  /* ----------------------------- lighting ----------------------------- */
  const key = new THREE.DirectionalLight(0xfff6ea, 1.0);
  key.position.set(-60, 80, 90); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8eeff, 0.34);
  fill.position.set(70, 20, 50); scene.add(fill);
  const glint = new THREE.DirectionalLight(0xffffff, 0.45);
  glint.position.set(10, 60, 80); scene.add(glint);
  scene.add(new THREE.AmbientLight(0xffffff, 0.12));

  /* --------------------------- frame and render ---------------------------
     Head-on orthographic, so the sprite can be scaled and swung in the DOM
     without the perspective ever contradicting the board's own camera. */
  const box = new THREE.Box3().setFromObject(rig);
  const pad = 1.2;
  /* framed symmetrically about the ring's axis, so the sprite's horizontal
     centre stays the hanging point even with the tag off to one side */
  const half = Math.max(Math.abs(box.min.x), Math.abs(box.max.x)) + pad;
  const x0 = -half, x1 = half;
  const y0 = box.min.y - pad, y1 = box.max.y + pad;
  const bw = x1 - x0, bh = y1 - y0;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const wpx = Math.round(bw * PX_PER_MM), hpx = Math.round(bh * PX_PER_MM);
  renderer.setSize(wpx, hpx, false);
  const camera = new THREE.OrthographicCamera(-bw / 2, bw / 2, bh / 2, -bh / 2, 1, 1000);
  camera.position.set(cx, cy, 400);
  camera.lookAt(cx, cy, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');

  /* where the ring sits on the pin: the inner top of the split ring, which is
     the pixel the DOM has to line up with the hook */
  const holeTop = SPLIT_Y + SPLIT_R - SPLIT_TUBE;
  const offsetTop = Math.round(-2 - (y1 - holeTop) * PX_PER_MM);

  renderer.dispose();
  return { url, w: wpx, h: hpx, top: offsetTop };
}

const img = new Image();
img.onload = () => {
  const go = () => {
  try {
    window.KXNyuKeyring = build(img);
  } catch (err) {
    window.KXNyuKeyring = null;   /* no WebGL: the CSS fob stays */
  }
  window.dispatchEvent(new Event('kx-nyu-ready'));
  };
  /* the tag's wording is drawn into a canvas, so the face has to be loaded */
  document.fonts ? document.fonts.ready.then(go) : go();
};
img.onerror = () => {
  window.KXNyuKeyring = null;
  window.dispatchEvent(new Event('kx-nyu-ready'));
};
img.src = LOGO_SRC;
