import * as THREE from 'three';
import { addCableFlag, flagFont } from './site-cable-flag.js';

/* Folder key charm — drop-in sprite for the personal website.
   Renders the same 3D model as the standalone viewer (identical geometry,
   materials, environment, lighting and tone mapping), flattens it once to a
   transparent PNG, and publishes it so the page can hang it from a hook and
   keep any swing physics in pure DOM.

   Usage:
     <script type="module" src="site-folder-charm-3d.js"></script>
     window.addEventListener('kx-folder-charm-ready', () => {
       const c = window.KXFolderCharm;      // null if WebGL is unavailable
       if (!c) return;
       img.src = c.url;                     // transparent PNG data URL
       img.style.width = c.w + 'px';        // c.h is the matching height
       img.style.marginTop = c.top + 'px';  // puts the hook inside the ring
     });

   Needs an import map entry for 'three' (r160+), e.g.
     <script type="importmap">
     {"imports":{"three":"https://unpkg.com/three@0.164.0/build/three.module.js"}}
     </script>

   No external assets: the charm carries no artwork, so this one file is the
   whole dependency. */

const PX_PER_MM = 1.85;   /* same sprite scale as the other fobs on the board */

/**
 * buildFolderCharm(THREE, opts) -> THREE.Group
 *
 * File-folder key charm: two enamel leaves on a folded spine, the back one
 * carrying the tab, the front one sitting a little proud of it so the piece
 * reads as a folder rather than a flat plaque. A hole is drilled through the
 * tab; a jump ring, chain, split ring and a small blank tag hang off it.
 *
 * Modelled in metres, y-up, base at y = 0. Every mesh and material is named
 * so OBJ/GLB exports stay readable. Needs `scene.environment` set — the
 * enamel's sheen and the hardware are both read through reflections.
 */
function buildFolderCharm(THREE, opts = {}) {
  const {
    width = 0.056,        // folder width
    height = 0.040,       // folder height, tab excluded
    tabWidth = 0.026,
    tabHeight = 0.009,
    leaf = 0.0024,        // thickness of one leaf
    gap = 0.0011,         // air between the leaves
    enamel = 0x9fc4fb,    // slate-blue metal (a metal takes its brightness from
                          //   the environment, so the base colour runs light)
    liner = 0xcadffe,     // paler inside face
  } = opts;

  /* Corners are rounded by pulling each vertex in along both of its edges and
     bridging with a quadratic: it keeps the outline a single closed path, so
     the extruder's bevel stays continuous around the tab's step. */
  function roundedPoly(points, radius) {
    const s = new THREE.Shape();
    const n = points.length;
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const seg = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let i = 0; i < n; i++) {
      const prev = points[(i - 1 + n) % n], cur = points[i], next = points[(i + 1) % n];
      const rIn = Math.min(radius, seg(prev, cur) * 0.45);
      const rOut = Math.min(radius, seg(cur, next) * 0.45);
      const from = lerp(cur, prev, rIn / seg(prev, cur));
      const to = lerp(cur, next, rOut / seg(cur, next));
      if (i === 0) s.moveTo(from[0], from[1]);
      else s.lineTo(from[0], from[1]);
      s.quadraticCurveTo(cur[0], cur[1], to[0], to[1]);
    }
    s.closePath();
    return s;
  }

  const hw = width / 2;
  const tabL = -hw + width * 0.045;
  const tabR = tabL + tabWidth;
  const tabTopL = tabL + tabHeight * 0.42;      // the tab's cut runs on a slant
  const tabTopR = tabR - tabHeight * 0.28;

  const backShape = roundedPoly([
    [-hw, 0], [hw, 0], [hw, height],
    [tabR, height], [tabTopR, height + tabHeight], [tabTopL, height + tabHeight],
    [tabL, height], [-hw, height],
  ], 0.0028);

  // drilled through the tab
  const holeX = (tabTopL + tabTopR) / 2;
  const holeY = height + tabHeight * 0.5;
  const HOLE_R = 0.0021;
  const drill = new THREE.Path();
  drill.absarc(holeX, holeY, HOLE_R, 0, Math.PI * 2, true);
  backShape.holes.push(drill);

  const frontShape = roundedPoly([
    [-hw + 0.0012, 0.0006], [hw - 0.0012, 0.0006],
    [hw - 0.0012, height - 0.0105], [-hw + 0.0012, height - 0.0105],
  ], 0.0026);

  const charm = new THREE.Group();
  charm.name = 'folderCharm';

  // ---- materials --------------------------------------------------------
  // Metal, so the leaves are read through reflection rather than through a
  // body colour: a fully metallic surface takes almost all of its brightness
  // from the environment, which is why the defaults above are light.
  const enamelMat = new THREE.MeshPhysicalMaterial({
    name: 'folderMetal', color: enamel, metalness: 1, roughness: 0.17,
    clearcoat: 0.5, clearcoatRoughness: 0.1, envMapIntensity: 3.1,
  });
  const enamelEdge = new THREE.MeshPhysicalMaterial({
    name: 'folderMetalEdge', color: enamel, metalness: 1, roughness: 0.28,
    envMapIntensity: 2.8,
  });
  const linerMat = new THREE.MeshPhysicalMaterial({
    name: 'liner', color: liner, metalness: 1, roughness: 0.34,
    envMapIntensity: 4.0,
  });
  const hardware = new THREE.MeshStandardMaterial({
    name: 'hardware', color: 0xc9cbd2, metalness: 1.0, roughness: 0.16,
  });
  const brushedSilver = new THREE.MeshStandardMaterial({
    name: 'brushedSilver', color: 0xd6d7dd, metalness: 0.9, roughness: 0.34,
  });

  const extrude = (shape, depth, curveSegments = 12) => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth, curveSegments, bevelEnabled: true,
      bevelThickness: 0.0004, bevelSize: 0.0004, bevelSegments: 3,
    });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  };

  // ---- leaves and spine -------------------------------------------------
  const back = new THREE.Mesh(extrude(backShape, leaf), [enamelMat, enamelEdge]);
  back.name = 'backLeaf';
  back.position.z = -(gap + leaf) / 2;
  back.castShadow = true;
  back.receiveShadow = true;
  charm.add(back);

  const front = new THREE.Mesh(extrude(frontShape, leaf), [enamelMat, enamelEdge]);
  front.name = 'frontLeaf';
  front.position.z = (gap + leaf) / 2;
  front.castShadow = true;
  front.receiveShadow = true;
  charm.add(front);

  // the fold, closing the gap along the bottom
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.0024, 0.0016, gap + leaf * 2),
    linerMat
  );
  spine.name = 'spine';
  spine.position.set(0, 0.0008, 0);
  spine.castShadow = true;
  spine.receiveShadow = true;
  charm.add(spine);

  // a sliver of paler stock visible in the mouth of the folder
  const stockH = height - 0.0058;
  const contents = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.006, stockH, gap * 0.8),
    linerMat
  );
  contents.name = 'contents';
  contents.position.set(0, stockH / 2 + 0.0016, 0);
  contents.castShadow = true;
  charm.add(contents);

  /* a second sheet, offset, so the mouth reads as a stack rather than a slab */
  const contents2 = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.011, stockH - 0.0028, gap * 0.5),
    linerMat
  );
  contents2.name = 'contents2';
  contents2.position.set(width * 0.045, (stockH - 0.0028) / 2 + 0.0016, gap * 0.18);
  charm.add(contents2);

  // ---- hardware ---------------------------------------------------------
  const ring = (radius, tube, mat, name) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 64), mat);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const jumpR = 0.0044;
  const jump = ring(jumpR, 0.0012, hardware, 'jumpRing');
  jump.rotation.y = Math.PI / 2;
  jump.position.set(holeX, holeY + jumpR - HOLE_R * 0.6, 0);
  charm.add(jump);

  const linkR = 0.0044, linkTube = 0.0011, pitch = linkR * 2 - linkTube * 2;
  const chainBase = jump.position.y + jumpR - linkTube;
  const CHAIN_N = 6;
  for (let i = 0; i < CHAIN_N; i++) {
    const link = ring(linkR, linkTube, hardware, 'chainLink' + (i + 1));
    link.position.set(holeX, chainBase + linkR + i * pitch, 0);
    if (i % 2 === 1) link.rotation.y = Math.PI / 2;
    charm.add(link);
  }
  const chainTop = chainBase + linkR + (CHAIN_N - 1) * pitch + linkR - linkTube;

  const keyRingR = 0.018;
  const ringY = chainTop + keyRingR - 0.0011;
  for (let i = 0; i < 2; i++) {
    const coil = ring(keyRingR, 0.0014, hardware, 'keyRingCoil' + (i + 1));
    coil.position.set(holeX, ringY, (i === 0 ? -1 : 1) * 0.0014);
    coil.rotation.z = i * 0.12;
    charm.add(coil);
  }

  // ---- small blank tag on its own chain --------------------------------
  // It leaves the split ring almost sideways so it hangs clear of the folder.
  const dir = new THREE.Vector2(0.70, -0.71).normalize();
  const tagLinkR = 0.0032, tagLinkTube = 0.0009;
  const tagPitch = tagLinkR * 2 - tagLinkTube * 2;
  const tagStart = new THREE.Vector2(holeX, ringY)
    .add(dir.clone().multiplyScalar(keyRingR - 0.0006));
  const tagAng = Math.atan2(dir.y, dir.x);
  const TAG_CHAIN_N = 8;
  for (let i = 0; i < TAG_CHAIN_N; i++) {
    const link = ring(tagLinkR, tagLinkTube, hardware, 'tagChainLink' + (i + 1));
    const p = tagStart.clone().add(dir.clone().multiplyScalar(tagPitch * i));
    link.position.set(p.x, p.y, 0);
    link.rotation.z = tagAng;
    if (i % 2 === 0) link.rotateX(Math.PI / 2);
    charm.add(link);
  }
  const tagTo = tagStart.clone().add(dir.clone().multiplyScalar(tagPitch * TAG_CHAIN_N));

  const TW = 0.042, TH = 0.023, TD = 0.0030;
  const tagGroup = new THREE.Group();
  tagGroup.name = 'tagAssembly';
  tagGroup.position.set(tagTo.x, tagTo.y, 0);
  tagGroup.rotation.z = -0.16;
  charm.add(tagGroup);

  const tagHoleY = TH / 2 - 0.0033;
  const tagShape = roundedPoly([
    [-TW / 2, -TH / 2], [TW / 2, -TH / 2], [TW / 2, TH / 2], [-TW / 2, TH / 2],
  ], 0.0085);
  const tagHole = new THREE.Path();
  tagHole.absarc(0, tagHoleY, 0.0019, 0, Math.PI * 2, true);
  tagShape.holes.push(tagHole);
  const tagMesh = new THREE.Mesh(extrude(tagShape, TD, 28), brushedSilver);
  tagMesh.name = 'tag';
  tagMesh.position.y = -tagHoleY;
  tagMesh.castShadow = true;
  tagMesh.receiveShadow = true;
  tagGroup.add(tagMesh);

  const tagRing = ring(0.0030, 0.0009, hardware, 'tagJumpRing');
  tagRing.rotation.y = Math.PI / 2;
  tagGroup.add(tagRing);

  return charm;
}


/* -------------------- studio, matching the 3D viewer -------------------- */
function studioEnv(renderer) {
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

/* one canvas pixel is the same physical size on every tag, so the struck
   letters come out the same height across the fobs on the board */
const WORLD_PER_PX = (0.74 * 0.0396) / 512;

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
  c.width = 640;
  c.height = 320;
  const x = c.getContext('2d');
  const face = tagFace(text);
  let size = 128;
  x.font = '700 ' + size + 'px ' + face;
  const fit = (c.width - 48) / x.measureText(text).width;
  if (fit < 1) { size = Math.floor(size * fit); x.font = '700 ' + size + 'px ' + face; }
  /* the other tags ink at #2a2530 under exposure 1.06; this studio runs at 1.24
     for the chrome leaves, so the ink is pre-darkened by that ratio to strike
     the same depth of grey after tone mapping */
  x.fillStyle = '#241f29';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, 320, 168);
  if (/[\u3400-\u9fff]/.test(text)) {
    /* faux bold: system CJK serifs ship a single weight, so the strike is
       thickened by stroking the same glyphs */
    x.lineJoin = 'round';
    x.lineWidth = size * 0.06;
    x.strokeStyle = x.fillStyle;
    x.strokeText(text, 320, 168);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const lw = c.width * WORLD_PER_PX;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(lw, lw * (320 / 640)),
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

function buildSprite() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(2);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;

  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
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

  const charm = buildFolderCharm(THREE, window.FOLDER_CHARM_OPTS || {});
  { const label = tagText('Portfolio'); addCableFlag(THREE, charm, label, flagFont(label)); }
  /* A dead-on orthographic view would let the flat leaves mirror the dark
     half of the studio; tipping them lets them catch the sky, which is what
     makes the finish read as chrome rather than as grey paint. Only the blank
     tips — the ring and chain stay square to camera so the split ring reads as
     a true circle, matching the other fobs on the board. The blank pivots
     about its own top edge so it stays hung off the chain. */
  const blank = new THREE.Group();
  charm.add(blank);
  ['backLeaf', 'frontLeaf', 'spine', 'contents', 'contents2'].forEach((n) => {
    const m = charm.getObjectByName(n);
    if (m) blank.add(m);
  });
  const blankTop = new THREE.Box3().setFromObject(blank).max.y;
  blank.position.y = blankTop;
  blank.children.forEach((c) => { c.position.y -= blankTop; });
  blank.rotation.x = -0.05;
  /* The studio above is the one the other fobs use, dark floor and all, so the
     ring and chain band light-to-dark exactly like theirs. */
  scene.add(charm);

  /* hang from the split ring's axis, so put that axis on x = 0 */
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

  /* A perspective camera, not an orthographic one. Under ortho every point on
     a flat leaf reflects the same direction, so a mirror-finish face can only
     be uniformly dark or uniformly blown out. A little perspective sweeps the
     reflection across the face and gives the graded chrome the other fobs get
     for free from their curved surfaces. The fov is narrow enough that the
     split ring stays a circle. */
  const FOV = 20;
  const dist = (bh / 2) / Math.tan((FOV * Math.PI) / 360);
  const camera = new THREE.PerspectiveCamera(FOV, bw / bh, dist * 0.5, dist * 2);
  camera.position.set(0, cy, dist);
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
const READY = 'kx-folder-charm-ready';
const cache = {};

const go = () => {
  const lang = window.KXGetLang ? window.KXGetLang() : 'en';
  if (cache[lang]) { window.KXFolderCharm = cache[lang]; window.dispatchEvent(new Event(READY)); return; }
  try {
    window.KXFolderCharm = buildSprite();
    cache[lang] = window.KXFolderCharm;
  } catch (err) {
    window.KXFolderCharm = null;   /* no WebGL: the CSS fob stays */
    console.warn('[folder charm] build failed:', err && (err.stack || err));
  }
  window.dispatchEvent(new Event(READY));
};
if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
else go();
window.addEventListener('kx-lang-change', go);

export { buildFolderCharm };
