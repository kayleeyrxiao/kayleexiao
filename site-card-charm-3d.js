import * as THREE from 'three';
import { addCableFlag, flagFont } from './site-cable-flag.js';

/* Business-card acrylic key charm — drop-in sprite for the personal website.
   Renders the same 3D model as the standalone viewer, flattens it once to a
   transparent PNG, and publishes it so the page can hang it from a hook and
   keep any swing physics in pure DOM.

   Usage:
     <script type="module" src="site-card-charm-3d.js"></script>
     window.addEventListener('kx-card-charm-ready', () => {
       const c = window.KXCardCharm;       // null if WebGL is unavailable
       if (!c) return;
       img.src = c.url;                    // transparent PNG data URL
       img.style.width = c.w + 'px';       // c.h is the matching height
       img.style.marginTop = c.top + 'px'; // puts the hook inside the ring
     });

   Card copy can be overridden before the module loads:
     window.CARD_CHARM_OPTS = { name: '…', role: '…', lines: ['…','…'] };

   Needs an import map entry for 'three' (r160+), e.g.
     <script type="importmap">
     {"imports":{"three":"https://unpkg.com/three@0.164.0/build/three.module.js"}}
     </script>

   No external assets: the card face is drawn on a canvas, so this one file is
   the whole dependency. */

const PX_PER_MM = 1.85;   /* same sprite scale as the other fobs on the board */

/**
 * buildCardCharm(THREE, opts) -> THREE.Group
 *
 * Clear-acrylic key charm shaped like a business card. The blank is a rounded
 * rectangle a little larger than a 3.5 x 2 in card, with a clear band across
 * the top for the drilled hole — so the card face stays uninterrupted and the
 * resin shows for what it is. The card art is laminated at mid-thickness and
 * reads from both sides. Hardware (jump ring, chain, split ring, chain and
 * blank tag) is identical to the other acrylic charm.
 *
 * Modelled in metres, y-up, base at y = 0. Every mesh and material is named
 * so OBJ/GLB exports stay readable.
 */
function buildCardCharm(THREE, opts = {}) {
  const {
    cardW = 0.072,        // printed card width; height follows 3.5:2
    thickness = 0.0075,   // resin thickness
    tint = 0xffffff,      // resin tint
    paper = '#8f3b41',
    ink = '#fbeae6',
    accent = '#e6a9a0',
    name = 'Kaylee Xiao',
    role = 'Designer & Content Creator',
    monogram = 'KX',
    lines = ['kittyxiao1146-create.github.io', 'kayleexiao0806@gmail.com'],
  } = opts;

  const cardH = cardW * (2 / 3.5);
  const MARGIN = 0.0024;             // clear resin around the print
  const BAND = 0.0080;               // clear strip at the top, holds the hole
  const blankW = cardW + MARGIN * 2;
  const blankH = cardH + MARGIN * 2 + BAND;
  const RADIUS = 0.0034;
  const HOLE_R = 0.0021;

  /* ---- card face --------------------------------------------------------
     Drawn rather than loaded: type on a card is the whole design, and canvas
     text stays crisp at any charm size where an imported bitmap would not.
     The rounded clip matches the blank's corners so the print never overruns
     the cut line. */
  const cardTex = (() => {
    const W = 1750, H = Math.round(W * (cardH / cardW));
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');

    const r = (RADIUS - MARGIN * 0.4) / cardW * W;
    g.beginPath();
    g.moveTo(r, 0);
    g.arcTo(W, 0, W, H, r);
    g.arcTo(W, H, 0, H, r);
    g.arcTo(0, H, 0, 0, r);
    g.arcTo(0, 0, W, 0, r);
    g.closePath();
    g.clip();

    g.fillStyle = paper;
    g.fillRect(0, 0, W, H);

    const PAD = 128;
    g.textBaseline = 'alphabetic';

    g.fillStyle = ink;
    g.font = '400 150px Georgia, "Times New Roman", serif';
    g.fillText(name, PAD, PAD + 118);

    g.strokeStyle = accent;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(PAD, PAD + 186);
    g.lineTo(PAD + 250, PAD + 186);
    g.stroke();

    g.fillStyle = accent;
    g.font = '600 52px "Helvetica Neue", Helvetica, Arial, sans-serif';
    let lx = PAD;
    for (const ch of role.toUpperCase()) {
      g.fillText(ch, lx, PAD + 274);
      lx += g.measureText(ch).width + 7;
    }

    g.fillStyle = ink;
    g.font = '400 56px "Helvetica Neue", Helvetica, Arial, sans-serif';
    lines.forEach((ln, i) => {
      g.fillText(ln, PAD, H - PAD - (lines.length - 1 - i) * 82);
    });

    const box = 168;
    g.strokeStyle = ink;
    g.lineWidth = 5;
    g.strokeRect(W - PAD - box, H - PAD - box + 22, box, box);
    g.fillStyle = ink;
    g.font = '400 78px Georgia, "Times New Roman", serif';
    g.textAlign = 'center';
    g.fillText(monogram, W - PAD - box / 2, H - PAD - box / 2 + 52);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  })();

  /* ---- materials --------------------------------------------------------
     Same reading as the other acrylic charm: a low-opacity dielectric with a
     full clearcoat over the print, rather than a transmissive material that
     needs the transmission pass and turns milky at this thickness. */
  const resin = new THREE.MeshPhysicalMaterial({
    name: 'clearAcrylic', color: tint, metalness: 0, roughness: 0.04,
    ior: 1.49, clearcoat: 1, clearcoatRoughness: 0.03,
    envMapIntensity: 1.5, specularIntensity: 1,
    transparent: true, opacity: 0.26, depthWrite: false,
  });
  const resinEdge = new THREE.MeshPhysicalMaterial({
    name: 'acrylicEdge', color: tint, metalness: 0, roughness: 0.13,
    ior: 1.49, clearcoat: 1, clearcoatRoughness: 0.09,
    envMapIntensity: 1.9, transparent: true, opacity: 0.62,
  });
  const printMat = new THREE.MeshPhysicalMaterial({
    name: 'laminatedCard', map: cardTex, transparent: true, alphaTest: 0.5,
    roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.14,
    envMapIntensity: 0.55,
  });
  const hardware = new THREE.MeshStandardMaterial({
    name: 'hardware', color: 0xc9cbd2, metalness: 1.0, roughness: 0.16,
  });
  const brushedSilver = new THREE.MeshStandardMaterial({
    name: 'brushedSilver', color: 0xd6d7dd, metalness: 0.9, roughness: 0.34,
  });

  const charm = new THREE.Group();
  charm.name = 'charm';

  function roundedRectShape(w, h, r, y0 = -h / 2) {
    const x = -w / 2, y = y0, s = new THREE.Shape();
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

  // ---- the blank --------------------------------------------------------
  const holeY = blankH - BAND / 2 - 0.0006;
  const blankShape = roundedRectShape(blankW, blankH, RADIUS, 0);
  const drill = new THREE.Path();
  drill.absarc(0, holeY, HOLE_R, 0, Math.PI * 2, true);
  blankShape.holes.push(drill);

  const blankGeo = new THREE.ExtrudeGeometry(blankShape, {
    depth: thickness, curveSegments: 24, bevelEnabled: true,
    bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 3,
  });
  blankGeo.translate(0, 0, -thickness / 2);
  blankGeo.computeVertexNormals();
  const blank = new THREE.Mesh(blankGeo, [resin, resinEdge]);
  blank.name = 'acrylicCardBlank';
  blank.renderOrder = 6;
  blank.castShadow = true;
  blank.receiveShadow = true;
  charm.add(blank);

  // ---- laminated card, at mid-thickness, readable from both sides -------
  const cardCy = MARGIN + cardH / 2;
  const cardGeo = new THREE.PlaneGeometry(cardW, cardH);
  const face = new THREE.Mesh(cardGeo, printMat);
  face.name = 'cardFace';
  face.position.set(0, cardCy, 0.0004);
  face.renderOrder = 1;
  charm.add(face);

  const back = new THREE.Mesh(cardGeo, printMat);
  back.name = 'cardFaceBack';
  back.position.set(0, cardCy, -0.0004);
  back.rotation.y = Math.PI;
  back.renderOrder = 1;
  charm.add(back);

  // ---- hardware ---------------------------------------------------------
  function ring(radius, tube, mat, nm) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 64), mat);
    m.name = nm;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  const jumpR = 0.0046;
  const jump = ring(jumpR, 0.0013, hardware, 'jumpRing');
  jump.rotation.y = Math.PI / 2;
  jump.position.set(0, holeY + jumpR - HOLE_R * 0.6, 0);
  charm.add(jump);

  const linkR = 0.0045, linkTube = 0.0012, pitch = linkR * 2 - linkTube * 2;
  const chainBase = jump.position.y + jumpR - linkTube;
  const CHAIN_N = 5;
  for (let i = 0; i < CHAIN_N; i++) {
    const link = ring(linkR, linkTube, hardware, 'chainLink' + (i + 1));
    link.position.set(0, chainBase + linkR + i * pitch, 0);
    if (i % 2 === 1) link.rotation.y = Math.PI / 2;
    charm.add(link);
  }
  const chainTop = chainBase + linkR + (CHAIN_N - 1) * pitch + linkR - linkTube;

  const keyRingR = 0.018;
  const ringY = chainTop + keyRingR - 0.0012;
  for (let i = 0; i < 2; i++) {
    const coil = ring(keyRingR, 0.0012, hardware, 'keyRingCoil' + (i + 1));
    coil.position.set(0, ringY, (i === 0 ? -1 : 1) * 0.0023);
    coil.rotation.z = i * 0.12;
    charm.add(coil);
  }

  // ---- small blank tag on its own chain --------------------------------
  const dir = new THREE.Vector2(1.04, -0.66).normalize();
  const tagLinkR = 0.0034, tagLinkTube = 0.00092;
  const tagPitch = tagLinkR * 2 - tagLinkTube * 2;
  const tagStart = new THREE.Vector2(0, ringY)
    .add(dir.clone().multiplyScalar(keyRingR - 0.0006));
  const tagAng = Math.atan2(dir.y, dir.x);
  const TAG_CHAIN_N = 6;
  for (let i = 0; i < TAG_CHAIN_N; i++) {
    const link = ring(tagLinkR, tagLinkTube, hardware, 'tagChainLink' + (i + 1));
    const p = tagStart.clone().add(dir.clone().multiplyScalar(tagPitch * i));
    link.position.set(p.x, p.y, 0);
    link.rotation.z = tagAng;
    if (i % 2 === 0) link.rotateX(Math.PI / 2);
    charm.add(link);
  }
  const tagTo = tagStart.clone().add(dir.clone().multiplyScalar(tagPitch * TAG_CHAIN_N));

  const TW = 0.062, TH = 0.028, TD = 0.0030;
  const tagGroup = new THREE.Group();
  tagGroup.name = 'tagAssembly';
  tagGroup.position.set(tagTo.x, tagTo.y, 0);
  tagGroup.rotation.z = -0.14;
  charm.add(tagGroup);

  const tagHoleY = TH / 2 - 0.0043;
  const tagShape = roundedRectShape(TW, TH, 0.0115);
  const tagHole = new THREE.Path();
  tagHole.absarc(0, tagHoleY, 0.0019, 0, Math.PI * 2, true);
  tagShape.holes.push(tagHole);
  const tagGeo = new THREE.ExtrudeGeometry(tagShape, {
    depth: TD, curveSegments: 28, bevelEnabled: true,
    bevelThickness: 0.0007, bevelSize: 0.0007, bevelSegments: 3,
  });
  tagGeo.translate(0, 0, -TD / 2);
  tagGeo.computeVertexNormals();
  const tagMesh = new THREE.Mesh(tagGeo, brushedSilver);
  tagMesh.name = 'tag';
  tagMesh.castShadow = true;
  tagMesh.receiveShadow = true;
  tagMesh.position.y = -tagHoleY;
  tagGroup.add(tagMesh);

  const tagRing = ring(0.0031, 0.00092, hardware, 'tagJumpRing');
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

/* "Experiences" struck into the tag face, in the same face and at the same struck
   size as the About and Education tags: --site-heading, 700 128px, mapped into
   the model at the metal fob's scale — its label is 0.74 × a 0.0396 m tag drawn
   on a 512px canvas, i.e. WORLD_PER_PX metres of model per canvas pixel. Since
   all three fobs render at the same PX_PER_MM, matching that ratio makes the
   letters come out the same height on the corkboard. */
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

  /* wider canvas than the folder tag's: 'Experiences' is a longer word and the
     struck size is fixed, so the canvas grows instead of the letters shrinking
     — that keeps the letter height identical across all four fobs. */
  const c = document.createElement('canvas');
  c.width = 880;
  c.height = 320;
  const x = c.getContext('2d');
  const face = tagFace(text);
  let size = 128;
  x.font = '700 ' + size + 'px ' + face;
  const fit = (c.width - 60) / x.measureText(text).width;
  if (fit < 1) { size = Math.floor(size * fit); x.font = '700 ' + size + 'px ' + face; }
  /* the other tags ink at #2a2530 under exposure 1.06; this studio runs at 1.24
     for the chrome leaves, so the ink is pre-darkened by that ratio to strike
     the same depth of grey after tone mapping */
  x.fillStyle = '#241f29';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, c.width / 2, 168);
  if (/[\u3400-\u9fff]/.test(text)) {
    /* faux bold: system CJK serifs ship a single weight, so the strike is
       thickened by stroking the same glyphs */
    x.lineJoin = 'round';
    x.lineWidth = size * 0.06;
    x.strokeStyle = x.fillStyle;
    x.strokeText(text, c.width / 2, 168);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const lw = c.width * WORLD_PER_PX;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(lw, lw * (c.height / c.width)),
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

  const charm = buildCardCharm(THREE, window.CARD_CHARM_OPTS || {});
  { const label = tagText('Experiences'); addCableFlag(THREE, charm, label, flagFont(label)); }
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

  /* A narrow perspective, not an orthographic camera: under ortho a flat face
     reflects one direction only, so the resin edge and hardware flatten out.
     The fov is tight enough that the split ring still reads as a circle. */
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
const READY = 'kx-card-charm-ready';
const cache = {};

const go = () => {
  const lang = window.KXGetLang ? window.KXGetLang() : 'en';
  if (cache[lang]) { window.KXCardCharm = cache[lang]; window.dispatchEvent(new Event(READY)); return; }
  try {
    window.KXCardCharm = buildSprite();
    cache[lang] = window.KXCardCharm;
  } catch (err) {
    window.KXCardCharm = null;   /* no WebGL: the CSS fob stays */
  }
  window.dispatchEvent(new Event(READY));
};
if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
else go();
window.addEventListener('kx-lang-change', go);

export { buildCardCharm };
