import * as THREE from 'three';
import { buildAcrylicCharm } from './site-acrylic-charm-model.js';
import { addCableFlag } from './site-cable-flag.js';

/* Cinema-camera acrylic key charm — the Experiences fob (cloned from the About fob). Renders the shared 3D model
   (site-acrylic-charm-model.js, the same file the standalone viewer uses) once
   to a PNG sprite the corkboard hangs from its hook, so the swing physics stay
   pure DOM.

   Publishes: window.KXCameraCharm = { url, w, h, top } and fires
   'kx-acrylic-charm-ready'. Art path: window.KX_ACRYLIC_ART. */

const PX_PER_MM = 1.85;   /* same sprite scale as the metal fob beside it */

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

/* "Education" struck into the tag face: dark ink in the recess plus the same
   art as a negative bump, so the letters catch the light like a stamping.
   Matches the About charm's tag so the two keyrings read as a set. */

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
  c.width = 768;   /* wider canvas than the About tag: longer word, same cap height */
  c.height = 320;
  const x = c.getContext('2d');
  const face = tagFace(text);
  /* identical to the About tag: 128px type, and lw scaled so one canvas pixel
     is the same physical size on both tags. About: 0.74 x (38 + 1.4 bevel) mm
     over 512 px; this blank is (52 + 1.4) mm over 768 px */
  let size = 128;
  x.font = '700 ' + size + 'px ' + face;
  const fit = 736 / x.measureText(text).width;
  if (fit < 1) { size = Math.floor(size * fit); x.font = '700 ' + size + 'px ' + face; }
  x.fillStyle = '#2a2530';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, 384, 168);
  if (/[\u3400-\u9fff]/.test(text)) {
    /* faux bold: system CJK serifs ship a single weight, so the strike is
       thickened by stroking the same glyphs */
    x.lineJoin = 'round';
    x.lineWidth = size * 0.06;
    x.strokeStyle = x.fillStyle;
    x.strokeText(text, 384, 168);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const lw = w * 0.819;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(lw, lw * (320 / 768)),
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
  renderer.toneMappingExposure = 1.10;

  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe6e0d4, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(4, 7, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff4e6, 0.8);
  fill.position.set(-5, 3, -4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(0, 2, 9);
  scene.add(rim);

  const charm = await buildAcrylicCharm(THREE, 'assets/cinema-camera-print-sm.png');
  charm.traverse((o) => {
    for (const m of (o.material ? [].concat(o.material) : [])) {
      if (m.name === 'clearAcrylic') { m.opacity = 0.08; m.envMapIntensity = 1.0; }
      if (m.name === 'laminatedPrint') {
        /* unlit and outside tone mapping, so the print shows the file's own colours */
        m.userData.basic = m.userData.basic || new THREE.MeshBasicMaterial({ name: 'laminatedPrint', map: m.map, transparent: true, alphaTest: 0.5, toneMapped: false });
        o.material = m.userData.basic;
      }
    }
  });
  {
    const label = tagText('Experiences');
    const body = getComputedStyle(document.documentElement).getPropertyValue('--site-body').trim() || 'Helvetica, Arial, sans-serif';
    addCableFlag(THREE, charm, label, /[\u3400-\u9fff]/.test(label) ? '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", ' + body : body);
  }
  scene.add(charm);

  /* hang the sprite from the split ring's axis, so put that axis on x = 0 */
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
const READY = 'kx-camera-charm-ready';
const cache = {};

const go = async () => {
  const lang = window.KXGetLang ? window.KXGetLang() : 'en';
  if (cache[lang]) { window.KXCameraCharm = cache[lang]; window.dispatchEvent(new Event(READY)); return; }
  try {
    window.KXCameraCharm = await buildSprite();
    cache[lang] = window.KXCameraCharm;
  } catch (err) {
    window.KXCameraCharm = null;   /* no WebGL, or art missing */
  }
  window.dispatchEvent(new Event(READY));
};
/* staggered after the other fobs so the builds don't stack up on load */
const later = () => setTimeout(() => (window.requestIdleCallback || setTimeout)(go), 900);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
else later();
window.addEventListener('kx-lang-change', go);
