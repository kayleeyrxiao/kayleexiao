import * as THREE from 'three';

/* Kx metal charm — the About fob, rendered from the same 3D model as the
   standalone viewer (identical geometry, materials, lighting and tone
   mapping), then flattened once to a PNG sprite the corkboard hangs from its
   hook so the swing physics stay pure DOM.
   Contract: window.KXMetalCharm = { url, w, h, top }. */

const PX_PER_MM = 1.85;   /* same sprite scale as the acrylic fob beside it */

/**
 * buildKxCharm(THREE, printUrl) -> Promise<THREE.Group>
 *
 * Metallic Kx key charm. The charm outline is traced from the print PNG's
 * alpha channel and extruded, with the (lightened) print mapped onto its
 * faces; plus a soldered bail, a four-link chain, a split key ring, and a
 * blank horizontal tag on its own chain. Modelled in metres, y-up, base at
 * y = 0. Every mesh and material is named so OBJ/GLB exports stay readable.
 */
async function buildKxCharm(THREE, printUrl = 'uploads/icon-kx.png') {
  const printImg = await new THREE.ImageLoader().loadAsync(printUrl);
  // lighten the print's baked chrome so the charm reads as light purple
  const lc = document.createElement('canvas');
  lc.width = printImg.width;
  lc.height = printImg.height;
  const lctx = lc.getContext('2d');
  lctx.drawImage(printImg, 0, 0);
  const ld = lctx.getImageData(0, 0, lc.width, lc.height);
  for (let i = 0; i < ld.data.length; i += 4) {
    for (let k = 0; k < 3; k++) {
      const v = ld.data[i + k] / 255;
      ld.data[i + k] = Math.round(255 * (0.47 + 0.51 * (1 - Math.pow(1 - v, 2.6))));
    }
  }
  lctx.putImageData(ld, 0, 0);
  const printTex = new THREE.CanvasTexture(lc);
  printTex.colorSpace = THREE.SRGBColorSpace;
  printTex.anisotropy = 8;
  printTex.needsUpdate = true;

  // ---- trace the print's silhouette from its alpha channel --------------
  // The raster is padded with an empty margin and kept aspect-correct:
  // artwork that runs to the edge of its own file would otherwise produce a
  // contour that leaves the grid and never closes, and an unclosed contour is
  // no shape at all — the charm then falls back to a rectangular slab.
  const G = 400, PAD = 3;
  const GW = G, GH = Math.max(8, Math.round((G * printImg.height) / printImg.width));
  const RW = GW + PAD * 2, RH = GH + PAD * 2;
  const tc = document.createElement('canvas');
  tc.width = RW;
  tc.height = RH;
  const tctx = tc.getContext('2d');
  tctx.drawImage(printImg, PAD, PAD, GW, GH);
  const data = tctx.getImageData(0, 0, RW, RH).data;
  const alpha = new Float32Array(RW * RH);
  for (let i = 0; i < RW * RH; i++) alpha[i] = data[i * 4 + 3] / 255;

  // Marching squares emitting ORIENTED segments (solid on the left), chained
  // start-point to end-point. Orientation is what keeps contours separable:
  // each crossing has exactly one segment in and one out, so touching
  // outlines can never fuse and fill the gaps between the letters.
  function traceLoops(a, W, H, thr) {
    const at = (x, y) => a[y * W + x];
    const pts = new Map();
    const outSeg = new Map();
    const lerp = (p0, p1) => {
      const d = p1 - p0;
      if (Math.abs(d) < 1e-9) return 0.5;
      return Math.min(1, Math.max(0, (thr - p0) / d));
    };
    const put = (k, p) => { if (!pts.has(k)) pts.set(k, p); return k; };
    const T = (x, y) => put('h' + x + '_' + y, [x + lerp(at(x, y), at(x + 1, y)), y]);
    const B = (x, y) => put('h' + x + '_' + (y + 1),
      [x + lerp(at(x, y + 1), at(x + 1, y + 1)), y + 1]);
    const L = (x, y) => put('v' + x + '_' + y, [x, y + lerp(at(x, y), at(x, y + 1))]);
    const R = (x, y) => put('v' + (x + 1) + '_' + y,
      [x + 1, y + lerp(at(x + 1, y), at(x + 1, y + 1))]);
    const seg = (from, to) => {
      if (from === to) return;
      if (!outSeg.has(from)) outSeg.set(from, []);
      outSeg.get(from).push(to);
    };
    for (let y = 0; y < H - 1; y++) {
      for (let x = 0; x < W - 1; x++) {
        const tl = at(x, y) >= thr, tr = at(x + 1, y) >= thr;
        const br = at(x + 1, y + 1) >= thr, bl = at(x, y + 1) >= thr;
        const c = (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
        if (c === 0 || c === 15) continue;
        // saddles are the only cells where the two readings differ; resolve
        // them by the cell's own average
        const mid = () => (at(x, y) + at(x + 1, y) + at(x + 1, y + 1) + at(x, y + 1)) / 4;
        switch (c) {
          case 1: seg(L(x, y), T(x, y)); break;
          case 2: seg(T(x, y), R(x, y)); break;
          case 3: seg(L(x, y), R(x, y)); break;
          case 4: seg(R(x, y), B(x, y)); break;
          case 6: seg(T(x, y), B(x, y)); break;
          case 7: seg(L(x, y), B(x, y)); break;
          case 8: seg(B(x, y), L(x, y)); break;
          case 9: seg(B(x, y), T(x, y)); break;
          case 11: seg(B(x, y), R(x, y)); break;
          case 12: seg(R(x, y), L(x, y)); break;
          case 13: seg(R(x, y), T(x, y)); break;
          case 14: seg(T(x, y), L(x, y)); break;
          case 5:
            if (mid() >= thr) { seg(R(x, y), T(x, y)); seg(L(x, y), B(x, y)); }
            else { seg(L(x, y), T(x, y)); seg(R(x, y), B(x, y)); }
            break;
          case 10:
            if (mid() >= thr) { seg(T(x, y), L(x, y)); seg(B(x, y), R(x, y)); }
            else { seg(T(x, y), R(x, y)); seg(B(x, y), L(x, y)); }
            break;
        }
      }
    }
    // close a loop the moment the walk revisits any point it already passed,
    // so a saddle crossing into a neighbouring contour still yields both
    const loops = [];
    for (const first of [...outSeg.keys()]) {
      while ((outSeg.get(first) || []).length) {
        const path = [], seen = new Map();
        let cur = first;
        while (true) {
          if (seen.has(cur)) {
            const cycle = path.slice(seen.get(cur));
            if (cycle.length > 8) loops.push(cycle);
            break;
          }
          const outs = outSeg.get(cur);
          if (!outs || !outs.length) break;
          seen.set(cur, path.length);
          path.push(pts.get(cur));
          cur = outs.shift();
        }
      }
    }
    return loops;
  }

  function area(loop) {
    let s = 0;
    for (let i = 0, n = loop.length; i < n; i++) {
      const p = loop[i], q = loop[(i + 1) % n];
      s += p[0] * q[1] - q[0] * p[1];
    }
    return s / 2;
  }

  function simplify(loop, eps) {
    let pts = loop.slice();
    for (let pass = 0; pass < 8 && pts.length > 16; pass++) {
      const keep = [];
      let removed = 0;
      for (let i = 0; i < pts.length; i++) {
        const prev = keep.length ? keep[keep.length - 1] : pts[(i - 1 + pts.length) % pts.length];
        const next = pts[(i + 1) % pts.length];
        const dx = next[0] - prev[0], dy = next[1] - prev[1];
        const len = Math.hypot(dx, dy);
        const d = len < 1e-9
          ? Math.hypot(pts[i][0] - prev[0], pts[i][1] - prev[1])
          : Math.abs((pts[i][0] - prev[0]) * dy - (pts[i][1] - prev[1]) * dx) / len;
        if (d < eps && keep.length && pts.length - removed > 16) { removed++; continue; }
        keep.push(pts[i]);
      }
      if (!removed) break;
      pts = keep;
    }
    return pts;
  }

  function inside(pt, loop) {
    let hit = false;
    for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
      const [xi, yi] = loop[i], [xj, yj] = loop[j];
      if ((yi > pt[1]) !== (yj > pt[1]) &&
          pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi + 1e-12) + xi) hit = !hit;
    }
    return hit;
  }

  let loops = traceLoops(alpha, RW, RH, 0.16)
    .map((l) => simplify(l, 0.05))
    .filter((l) => Math.abs(area(l)) > 60);
  loops.sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)));

  // flip Y (image space is y-down) and classify outer shapes vs. holes
  const flipped = loops.map((l) => l.map(([x, y]) => [x, RH - y]));
  const shapes = [];
  const holesFor = new Map();
  flipped.forEach((loop, i) => {
    let parent = -1, parentArea = Infinity;
    flipped.forEach((other, j) => {
      if (i === j) return;
      const oa = Math.abs(area(other));
      if (oa > Math.abs(area(loop)) && inside(loop[0], other) && oa < parentArea) {
        parentArea = oa; parent = j;
      }
    });
    if (parent === -1) shapes.push(i);
    else {
      if (!holesFor.has(parent)) holesFor.set(parent, []);
      holesFor.get(parent).push(i);
    }
  });

  const toPath = (loop, Ctor) => {
    const p = new Ctor();
    p.moveTo(loop[0][0], loop[0][1]);
    for (let i = 1; i < loop.length; i++) p.lineTo(loop[i][0], loop[i][1]);
    p.closePath();
    return p;
  };
  const threeShapes = shapes.map((i) => {
    const s = toPath(flipped[i], THREE.Shape);
    (holesFor.get(i) || []).forEach((h) => s.holes.push(toPath(flipped[h], THREE.Path)));
    return s;
  });

  // ---- materials -------------------------------------------------------
  const kxChrome = new THREE.MeshStandardMaterial({
    name: 'kxChrome', color: 0xf2e6f8, map: printTex, bumpMap: printTex,
    bumpScale: 0.0016, metalness: 0.55, roughness: 0.14,
  });
  const edgeChrome = new THREE.MeshStandardMaterial({
    name: 'edgeChrome', color: 0xd8bfe8, metalness: 1.0, roughness: 0.11,
  });
  const brushedSilver = new THREE.MeshStandardMaterial({
    name: 'brushedSilver', color: 0xd6d7dd, metalness: 0.9, roughness: 0.34,
  });
  const hardware = new THREE.MeshStandardMaterial({
    name: 'hardware', color: 0xc7c9d0, metalness: 1.0, roughness: 0.16,
  });

  // ---- helpers ---------------------------------------------------------
  function ring(radius, tube, mat, name) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 64), mat);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  function roundedRectShape(w, h, r) {
    const x = -w / 2, y = -h / 2, s = new THREE.Shape();
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  }

  // ---- the Kx charm ----------------------------------------------------
  const charm = new THREE.Group();
  charm.name = 'charm';

  const CHARM_W = 0.062;
  const box = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  flipped.forEach((l) => l.forEach(([x, y]) => {
    box.minX = Math.min(box.minX, x); box.maxX = Math.max(box.maxX, x);
    box.minY = Math.min(box.minY, y); box.maxY = Math.max(box.maxY, y);
  }));
  const scale = CHARM_W / (box.maxX - box.minX);
  const depthG = 0.009 / scale;
  const bevelG = 0.0022 / scale;

  const kxGeo = new THREE.ExtrudeGeometry(threeShapes, {
    depth: depthG, curveSegments: 4, bevelEnabled: true,
    bevelThickness: bevelG, bevelSize: bevelG, bevelSegments: 5,
  });
  // planar UVs in image space, then convert grid units to metres
  {
    const pos = kxGeo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - PAD) / GW;
      uv[i * 2 + 1] = (pos.getY(i) - PAD) / GH;
    }
    kxGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    kxGeo.scale(scale, scale, scale);
    kxGeo.translate(
      -((box.minX + box.maxX) / 2) * scale,
      -box.minY * scale + 0.0022,
      -(depthG * scale) / 2
    );
    kxGeo.computeVertexNormals();
  }
  const kxMesh = new THREE.Mesh(kxGeo, [kxChrome, edgeChrome]);
  kxMesh.name = 'kxCharm';
  kxMesh.castShadow = true;
  kxMesh.receiveShadow = true;
  charm.add(kxMesh);

  const charmTopY = (box.maxY - box.minY) * scale + 0.0044;

  // topmost point of the silhouette (where the bail is soldered)
  let topX = 0, topY = -Infinity;
  flipped.forEach((l) => l.forEach(([x, y]) => { if (y > topY) { topY = y; topX = x; } }));
  const bailX = (topX - (box.minX + box.maxX) / 2) * scale;

  // ---- bail, long chain, split key ring -------------------------------
  const bailR = 0.0055;
  const bail = ring(bailR, 0.0016, hardware, 'bail');
  bail.rotation.y = Math.PI / 2;
  bail.position.set(bailX, charmTopY + bailR - 0.0018, 0);
  charm.add(bail);

  const chainLinkR = 0.0045, chainTube = 0.0012;
  const chainBase = bail.position.y + bailR;
  const CHAIN_N = 4;
  for (let i = 0; i < CHAIN_N; i++) {
    const link = ring(chainLinkR, chainTube, hardware, 'chainLink' + (i + 1));
    link.position.set(bailX, chainBase + chainLinkR - 0.0012 + i * (chainLinkR * 2 - 0.0024), 0);
    if (i % 2 === 1) link.rotation.y = Math.PI / 2;
    charm.add(link);
  }
  const chainTop = chainBase + chainLinkR - 0.0012 +
    (CHAIN_N - 1) * (chainLinkR * 2 - 0.0024) + chainLinkR;

  const keyRingR = 0.018;
  const ringY = chainTop + keyRingR - 0.0012;
  for (let i = 0; i < 2; i++) {
    const coil = ring(keyRingR, 0.0014, hardware, 'keyRingCoil' + (i + 1));
    coil.position.set(bailX, ringY, (i === 0 ? -1 : 1) * 0.0014);
    coil.rotation.z = i * 0.12;
    charm.add(coil);
  }

  // ---- small tag on its own chain -------------------------------------
  const tagFrom = new THREE.Vector2(bailX + keyRingR - 0.001, ringY - 0.002);
  const tagTo = new THREE.Vector2(bailX + keyRingR + 0.028, ringY - 0.033);
  const tagAng = Math.atan2(tagTo.y - tagFrom.y, tagTo.x - tagFrom.x);
  [0.16, 0.39, 0.62, 0.85].forEach((t, i) => {
    const link = ring(0.0038, 0.001, hardware, 'tagChainLink' + (i + 1));
    link.position.set(
      tagFrom.x + (tagTo.x - tagFrom.x) * t,
      tagFrom.y + (tagTo.y - tagFrom.y) * t,
      0
    );
    link.rotation.z = tagAng;
    if (i % 2 === 0) link.rotateX(Math.PI / 2);
    charm.add(link);
  });

  const TW = 0.038, TH = 0.025, TD = 0.0032;
  const tagGroup = new THREE.Group();
  tagGroup.name = 'tagAssembly';
  tagGroup.position.set(tagTo.x, tagTo.y, 0);
  tagGroup.rotation.z = -0.24;
  charm.add(tagGroup);

  const tagHoleY = TH / 2 - 0.0037;
  const tagShape = roundedRectShape(TW, TH, 0.0105);
  const tagHole = new THREE.Path();
  tagHole.absarc(0, tagHoleY, 0.0022, 0, Math.PI * 2, true);
  tagShape.holes.push(tagHole);
  const tagGeo = new THREE.ExtrudeGeometry(tagShape, {
    depth: TD, curveSegments: 32, bevelEnabled: true,
    bevelThickness: 0.0008, bevelSize: 0.0008, bevelSegments: 4,
  });
  tagGeo.translate(0, 0, -TD / 2);
  tagGeo.computeVertexNormals();
  const tagMesh = new THREE.Mesh(tagGeo, brushedSilver);
  tagMesh.name = 'tag';
  tagMesh.castShadow = true;
  tagMesh.receiveShadow = true;
  tagMesh.position.y = -tagHoleY;
  tagGroup.add(tagMesh);

  const tagRing = ring(0.0034, 0.001, hardware, 'tagJumpRing');
  tagRing.rotation.y = Math.PI / 2;
  tagGroup.add(tagRing);


  return charm;
}


/* -------------------- studio, matching the 3D viewer -------------------- */
function studioEnv(THREE, renderer) {
  const ec = document.createElement('canvas');
  ec.width = 1024;
  ec.height = 512;
  const ectx = ec.getContext('2d');
  const grad = ectx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#d7d4dd');
  grad.addColorStop(0.5, '#4a444f');
  grad.addColorStop(0.54, '#7c757f');
  grad.addColorStop(1, '#1b191d');
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, 1024, 512);
  ectx.fillStyle = '#ffffff';
  ectx.fillRect(110, 50, 250, 130);
  ectx.fillRect(660, 30, 150, 90);
  ectx.fillStyle = 'rgba(255,255,255,0.4)';
  ectx.fillRect(380, 290, 320, 50);
  const envTex = new THREE.CanvasTexture(ec);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(envTex).texture;
  pmrem.dispose();
  envTex.dispose();
  return env;
}

/* "About" struck into the tag face: dark ink in the recess plus the same
   art as a negative bump, so the letters catch the light like a stamping. */

/* Georgia has no CJK glyphs; the Chinese tags fall back to a system serif so the
   struck wording keeps the same weight as the English. */
const tagFace = (text) => {
  const face = getComputedStyle(document.documentElement)
    .getPropertyValue('--site-heading').trim() || 'Georgia, "Times New Roman", serif';
  return /[\u3400-\u9fff]/.test(text)
    ? '"Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "SimSun", ' + face
    : face;
};
const tagText = (en) => (window.KXTagLabel ? window.KXTagLabel(en) : en);

function engraveTag(charm, text) {
  const tagGroup = charm.getObjectByName('tagAssembly');
  const tag = charm.getObjectByName('tag');
  if (!tagGroup || !tag) return;
  const b = new THREE.Box3().setFromObject(tag);
  const w = b.max.x - b.min.x, d = b.max.z - b.min.z;

  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const x = c.getContext('2d');
  const face = tagFace(text);
  x.fillStyle = '#2a2530';
  let size = 128;
  x.font = '700 ' + size + 'px ' + face;
  const fit = (c.width - 40) / x.measureText(text).width;
  if (fit < 1) { size = Math.floor(size * fit); x.font = '700 ' + size + 'px ' + face; }
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, 256, 168);
  if (/[\u3400-\u9fff]/.test(text)) {
    /* faux bold: system CJK serifs ship a single weight, so the strike is
       thickened by stroking the same glyphs */
    x.lineJoin = 'round';
    x.lineWidth = size * 0.06;
    x.strokeStyle = x.fillStyle;
    x.strokeText(text, 256, 168);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const lw = w * 0.74;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(lw, lw * (320 / 512)),
    new THREE.MeshStandardMaterial({
      name: 'engraving', map: tex, bumpMap: tex, bumpScale: -0.0004,
      transparent: true, alphaTest: 0.3, metalness: 0.25, roughness: 0.45,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
    })
  );
  label.name = 'tagEngraving';
  label.renderOrder = 4;
  label.position.set(0, tag.position.y - 0.0008, d / 2 + 0.0002);
  tagGroup.add(label);
}

async function buildSprite() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(2);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  scene.environment = studioEnv(THREE, renderer);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe6e0d4, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.9);
  key.position.set(4, 7, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff4e6, 0.9);
  fill.position.set(-5, 3, -4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.7);
  rim.position.set(0, 2, 9);
  scene.add(rim);

  const charm = await buildKxCharm(THREE, window.KX_CHARM_ART || 'uploads/icon-kx.png');
  engraveTag(charm, tagText('About'));
  scene.add(charm);

  /* the corkboard hangs the sprite from its horizontal centre, so put the
     split ring's axis on x = 0 */
  const coil = charm.getObjectByName('keyRingCoil1');
  const coilBox = new THREE.Box3().setFromObject(coil);
  const axisX = (coilBox.min.x + coilBox.max.x) / 2;
  charm.position.x -= axisX;

  const MM = 1000;   /* the model is in metres */
  const bb = new THREE.Box3().setFromObject(charm);
  const pad = 0.0012;
  const half = Math.max(Math.abs(bb.min.x), Math.abs(bb.max.x)) + pad;
  const y0 = bb.min.y - pad, y1 = bb.max.y + pad;
  const bw = half * 2, bh = y1 - y0;
  const cy = (y0 + y1) / 2;
  const wpx = Math.round(bw * MM * PX_PER_MM), hpx = Math.round(bh * MM * PX_PER_MM);
  renderer.setSize(wpx, hpx, false);

  const camera = new THREE.OrthographicCamera(-bw / 2, bw / 2, bh / 2, -bh / 2, 0.01, 20);
  camera.position.set(0, cy, 5);
  camera.lookAt(0, cy, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');

  /* the hook sits inside the top of the split ring */
  const holeTop = coilBox.max.y - 0.0048;
  const top = Math.round(-2 - (y1 - holeTop) * MM * PX_PER_MM);

  renderer.dispose();
  renderer.forceContextLoss();
  return { url, w: wpx, h: hpx, top };
}

/* the engraved tag is language-dependent, so the sprite is rendered once per
   language and kept — a toggle back costs no second WebGL context */
const READY = 'kx-charm-ready';
const cache = {};

const go = async () => {
  const lang = window.KXGetLang ? window.KXGetLang() : 'en';
  if (cache[lang]) { window.KXMetalCharm = cache[lang]; window.dispatchEvent(new Event(READY)); return; }
  try {
    window.KXMetalCharm = await buildSprite();
    cache[lang] = window.KXMetalCharm;
  } catch (err) {
    window.KXMetalCharm = null;   /* no WebGL, or art missing: CSS fob stays */
  }
  window.dispatchEvent(new Event(READY));
};
/* the tag's wording is drawn into a canvas, so the face has to be loaded */
if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
else go();
window.addEventListener('kx-lang-change', go);
