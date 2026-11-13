import * as THREE from 'three';

/* Gold push pin, rendered once offscreen into a sprite the corkboard reuses
   for every keyring. The body is a single lathed profile so dome, grip and
   flange stay one continuous turned surface. Metal needs something to
   reflect, so the studio room is generated on canvas. Units ~= mm.
   The needle is omitted: it lives inside the cork. The model origin is the
   point where the pin enters the board and it projects to the exact centre
   of the sprite, which is how the DOM lines the pin up with each hook. */

const rand = (a, b) => a + Math.random() * (b - a);
const SIZE = 320;      /* sprite is square; css scales it down */
const HALF = 13.5;     /* mm visible either side of the entry point */

function build() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(2);
  renderer.setSize(SIZE, SIZE, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  /* ---- studio environment: a mirror is only as good as its room ---- */
  const w = 1024, h = 512;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, h * 0.72);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f5f2ed'); g.addColorStop(1, '#d8d2c8');
  x.fillStyle = g; x.fillRect(0, 0, w, h * 0.72);
  const f = x.createLinearGradient(0, h * 0.72, 0, h);
  f.addColorStop(0, '#cbb99e'); f.addColorStop(0.4, '#8d7a5e'); f.addColorStop(1, '#4b4133');
  x.fillStyle = f; x.fillRect(0, h * 0.72, w, h * 0.28);
  if ('filter' in x) x.filter = 'blur(3px)';
  x.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i++) {
    const bw = w * 0.15, gap = w * 0.035;
    x.globalAlpha = i === 1 ? 1 : 0.82;
    x.fillRect(i * (bw + gap) + w * 0.02, h * 0.05, bw, h * 0.2);
  }
  x.globalAlpha = 0.9; x.fillRect(0, 0, w, h * 0.03);
  x.globalAlpha = 0.55; x.fillStyle = '#b8b4ad';
  x.fillRect(w * 0.3, h * 0.34, w * 0.14, h * 0.16);
  x.fillRect(w * 0.63, h * 0.36, w * 0.11, h * 0.14);
  x.globalAlpha = 0.85; x.fillStyle = '#ffffff';
  x.fillRect(w * 0.03, h * 0.46, w * 0.05, h * 0.07);
  x.fillRect(w * 0.9, h * 0.5, w * 0.04, h * 0.06);
  if ('filter' in x) x.filter = 'blur(2px)';
  x.globalAlpha = 0.7; x.fillStyle = '#fffaf0';
  x.fillRect(0, h * 0.706, w, h * 0.012);
  if ('filter' in x) x.filter = 'none';
  x.globalAlpha = 1;
  const envSrc = new THREE.CanvasTexture(c);
  envSrc.colorSpace = THREE.SRGBColorSpace;
  envSrc.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromEquirectangular(envSrc).texture;
  envSrc.dispose(); pmrem.dispose();

  /* ---- plating: tumbler marks and pits, carried in the roughness map ---- */
  const rc = document.createElement('canvas'); rc.width = rc.height = 1024;
  const bc = document.createElement('canvas'); bc.width = bc.height = 1024;
  const r = rc.getContext('2d'), b = bc.getContext('2d');
  r.fillStyle = '#050505'; r.fillRect(0, 0, 1024, 1024);
  b.fillStyle = '#808080'; b.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 1400; i++) {
    const y = Math.random() * 1024;
    r.globalAlpha = rand(0.02, 0.13) * 0.22;
    r.strokeStyle = Math.random() < 0.5 ? '#8a8a8a' : '#000000';
    r.lineWidth = rand(0.5, 2.2);
    r.beginPath(); r.moveTo(rand(0, 614), y); r.lineTo(rand(410, 1024), y + rand(-3, 3)); r.stroke();
  }
  for (let i = 0; i < 2600; i++) {
    const px = Math.random() * 1024, py = Math.random() * 1024, rr = rand(0.5, 3.4);
    r.globalAlpha = rand(0.1, 0.55) * 0.22; r.fillStyle = '#c8c8c8';
    r.beginPath(); r.arc(px, py, rr, 0, 7); r.fill();
    b.globalAlpha = rand(0.1, 0.4) * 0.22; b.fillStyle = Math.random() < 0.5 ? '#3a3a3a' : '#c0c0c0';
    b.beginPath(); b.arc(px, py, rr, 0, 7); b.fill();
  }
  r.globalAlpha = 1; b.globalAlpha = 1;

  const brass = new THREE.MeshPhysicalMaterial({
    color: 0xd7a542, metalness: 1, roughness: 0.11,
    roughnessMap: new THREE.CanvasTexture(rc),
    bumpMap: new THREE.CanvasTexture(bc), bumpScale: 0.002,
    envMapIntensity: 1.9, clearcoat: 0
  });

  /* ---- profile in the XY half-plane, revolved about Y ---- */
  const profile = [];
  const P = (rr, y) => profile.push(new THREE.Vector2(rr, y));
  P(0.00, 0.00); P(1.10, 0.00); P(2.20, 0.00); P(3.10, 0.00); P(3.80, 0.00); P(4.18, 0.00);
  P(4.30, 0.05); P(4.34, 0.13); P(4.36, 0.24);
  const DOME_R = 4.36, DOME_Y = 0.24, DOME_H = 4.30, GRIP_R = 1.34;
  const aMax = Math.acos(GRIP_R / DOME_R);
  for (let i = 1; i <= 30; i++) {
    const a = (i / 30) * aMax;
    P(DOME_R * Math.cos(a), DOME_Y + DOME_H * Math.sin(a));
  }
  P(1.28, 4.62); P(1.23, 4.86); P(1.22, 5.16); P(1.22, 8.95); P(1.24, 9.35);
  P(1.62, 9.48); P(2.16, 9.64); P(2.58, 9.82); P(2.76, 10.04);
  P(2.80, 10.30); P(2.74, 10.58); P(2.50, 10.76);
  P(1.80, 10.87); P(0.90, 10.94); P(0.00, 10.98);

  const pin = new THREE.Mesh(new THREE.LatheGeometry(profile, 180), brass);
  pin.castShadow = true;
  pin.receiveShadow = true;   /* the flange shades the dome, so the turned steps read head-on */
  const rig = new THREE.Group();
  rig.add(pin);
  /* dead-on: a board at eye level shows the pin head-first, grip toward you */
  rig.rotation.x = Math.PI / 2;
  rig.rotation.z = 0;
  scene.add(rig);

  /* No shadow-catching plane: the pin's shadow on the cork is a CSS
     drop-shadow on the sprite instead (see .kx-cb-pin.is-3d), which follows
     the dome silhouette and shares the keyrings' light direction.
     The pin still casts onto itself, so the flange step under the dome reads. */

  const key = new THREE.DirectionalLight(0xfff6ea, 1.5);
  key.position.set(-20, 26, 30);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 120;
  key.shadow.camera.left = -18; key.shadow.camera.right = 18;
  key.shadow.camera.top = 18; key.shadow.camera.bottom = -18;
  key.shadow.bias = -0.0012;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8eeff, 0.4); fill.position.set(28, 6, 20); scene.add(fill);
  const glint = new THREE.DirectionalLight(0xffffff, 1.6); glint.position.set(-6, 18, 30); scene.add(glint);
  scene.add(new THREE.AmbientLight(0xffffff, 0.08));

  const fov = 26;
  const dist = HALF / Math.tan(fov * Math.PI / 360);
  const camera = new THREE.PerspectiveCamera(fov, 1, 1, 400);
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);   /* entry point lands dead centre of the sprite */

  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');

  renderer.dispose();
  brass.dispose(); pin.geometry.dispose();
  return url;
}

try {
  window.KXPinSprite = build();
} catch (err) {
  window.KXPinSprite = null;   /* no WebGL: the CSS pin stays */
}
window.dispatchEvent(new Event('kx-pin-ready'));
