import * as THREE from 'three';

/* Cork board in a natural maple frame — all maps generated on <canvas> at
   load; no texture files. Scene units = inches. Rendered head-on with an
   orthographic camera so the board maps 1:1 onto its container rect (the
   DOM keyring layer sits on top, inset to clear the moulding).

   Two things set this cork apart from the earlier oak-framed panel: it is
   pale and fine-grained rather than orange and chunky, and the frame face
   slopes inward toward the cork instead of sitting flat. */

const BOARD_W = 36;      /* board is 36in wide; height follows the container */
const FRAME_W = 0.92;    /* face width of the moulding */
const DEPTH = 0.55;
const SLOPE = 0.20;      /* how far the face drops from outer edge to cork */
const PAD = FRAME_W + 0.3;   /* keyring layer keeps clear of the moulding */

const rand = (a, b) => a + Math.random() * (b - a);
const TONE = 'light';

/* ------------------ cork colour, solved at runtime ------------------
   The albedo that produces a given on-screen colour depends on the tone
   curve, the exposure and the output encoding. Baking fixed hexes means
   the cork is only correct in the pipeline they were solved for — drop
   the board into a page whose renderer is set up differently and it
   renders raw orange. So the inversion runs here, against whatever this
   renderer is actually doing.

   Targets are on-screen colours, sampled from the reference photo (mean
   #cba786) and scaled in luminance for the other two. */
const TONE_TARGETS = {
  light: [234, 193, 154],
  reference: [203, 167, 134],
  deep: [183, 150, 121]
};
/* luminance of the photo's granule percentiles, relative to its mean */
const PCT = [0.9357, 0.9644, 0.9822, 1.0, 1.0224, 1.0397, 1.0626];
/* Per-channel irradiance, measured off rendered patches in this scene. The
   flat cork face and the sloped frame face see different amounts of light,
   and the fill light is bluish, so a single scalar left the frame both dark
   and drained of its warmth. */
/* IRR_FRAME is not a guess — it was closed against pixels read back from the
   rendered frame face. The sloped face catches a lot of the bluish studio
   env as specular, which is nearly albedo-independent, so the effective
   irradiance is much cooler than the light rig alone suggests. Assuming a
   warm irradiance here is what made the frame render olive: the solver held
   red back and let blue through. */
const IRR_CORK = [0.95, 0.95, 0.95];
const IRR_FRAME = [0.667, 0.817, 0.949];
const SPREAD = 1.6;               /* granule contrast, in multiples of the
                                     photo's own percentile spread */
/* Exposure sits above 1 to keep headroom: at 1.0 the pale cork's red channel
   solved past albedo 1.0, which flattened granule contrast and slid the
   brightest granules yellow. */
const EXPOSURE = 1.55;

const M_IN = [[0.59719, 0.35458, 0.04823], [0.076, 0.90834, 0.01566], [0.0284, 0.13383, 0.83777]];
const M_OUT = [[1.60475, -0.53108, -0.07367], [-0.10208, 1.10813, -0.00605], [-0.00327, -0.07276, 1.07602]];
const mul3 = (m, v) => m.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const s2l = s => s.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const l2s = l => l.map(v => {
  v = Math.min(1, Math.max(0, v));
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
});
const toHex = lin => '#' + l2s(lin).map(v =>
  Math.round(Math.min(255, Math.max(0, v * 255))).toString(16).padStart(2, '0')).join('');

function mount(container) {
  /* preserveDrawingBuffer lets the frame/cork colours be read back off the
     rendered pixels and checked against their targets — the board renders
     only on resize, so holding the buffer costs nothing here. */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  container.appendChild(renderer.domElement);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();

  /* Colour management moved names in three r152 and the old ones were removed
     in r165. Setting only one spelling fails silently on the other — the
     texture is then read as linear and the cork renders raw orange. */
  const HAS_COLORSPACE = 'outputColorSpace' in renderer;
  if (HAS_COLORSPACE) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  const SRGB_OUT = true;

  const mk = (cv, srgb) => {
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = maxAniso;
    if (srgb) {
      if (HAS_COLORSPACE) t.colorSpace = THREE.SRGBColorSpace;
      else t.encoding = THREE.sRGBEncoding;
    }
    return t;
  };

  function toneCurve(lin) {
    const e = renderer.toneMappingExposure;
    switch (renderer.toneMapping) {
      case THREE.ACESFilmicToneMapping: {
        let c = mul3(M_IN, lin.map(v => v * e / 0.6));
        c = c.map(v => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081));
        return mul3(M_OUT, c).map(v => Math.min(1, Math.max(0, v)));
      }
      case THREE.ReinhardToneMapping:
        return lin.map(v => Math.min(1, (v * e) / (1 + v * e)));
      case THREE.CineonToneMapping:
        return lin.map(v => {
          const x = Math.max(0, v * e - 0.004);
          return Math.min(1, (x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06));
        });
      case THREE.LinearToneMapping:
        return lin.map(v => Math.min(1, v * e));
      default:
        return lin.map(v => Math.min(1, v));
    }
  }
  const display = (alb, irr) => {
    const t = toneCurve(alb.map((v, i) => v * irr[i]));
    return SRGB_OUT ? l2s(t) : t;
  };
  function solveAlbedo(target255, irr = IRR_CORK) {
    const tgt = target255.map(v => v / 255);
    let alb = s2l(tgt);
    for (let i = 0; i < 120; i++) {
      const out = display(alb, irr);
      alb = alb.map((v, j) => Math.min(1, Math.max(0, v * (tgt[j] / Math.max(out[j], 1e-6)))));
    }
    return alb;
  }
  /* Granule spread is set by SPREAD, not by how much headroom the pipeline
     has left. Tying it to a clip test collapsed the pale tone to flat peach:
     a bright base sits near the ceiling, the spread bisected to nothing and
     every granule solved to the same hex. Colours clamp at the top end (that
     costs a little contrast in the lightest percentile only), while the bump
     map is driven straight off the percentiles so relief survives regardless
     of what the colour does. */
  function buildTone(target) {
    const base = solveAlbedo(target), bs = l2s(base);
    const baseLum = 0.299 * bs[0] + 0.587 * bs[1] + 0.114 * bs[2];
    return {
      base: toHex(base),
      pore: toHex(solveAlbedo(target.map(v => v * 0.82))),
      grain: PCT.map(p => toHex(solveAlbedo(target.map(v => Math.min(252, v * (1 + SPREAD * (p - 1))))))),
      grays: PCT.map(p => {
        const v = Math.max(40, Math.min(215, Math.round(128 + (p - 1) * SPREAD * baseLum * 420)));
        return `rgb(${v},${v},${v})`;
      })
    };
  }
  const TONES = {
    light: buildTone(TONE_TARGETS.light),
    reference: buildTone(TONE_TARGETS.reference),
    deep: buildTone(TONE_TARGETS.deep)
  };

  /* ------------------------- studio environment ------------------------- */
  function studioEnv() {
    const w = 1024, h = 512;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, h * 0.6);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f5f3ef'); g.addColorStop(1, '#d6d2ca');
    x.fillStyle = g; x.fillRect(0, 0, w, h * 0.6);
    const f = x.createLinearGradient(0, h * 0.6, 0, h);
    f.addColorStop(0, '#5c574e'); f.addColorStop(0.5, '#3a352d'); f.addColorStop(1, '#1d1a16');
    x.fillStyle = f; x.fillRect(0, h * 0.6, w, h * 0.4);
    if ('filter' in x) x.filter = 'blur(9px)';
    x.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
      const bw = w * 0.15, gap = w * 0.035;
      x.globalAlpha = i === 1 ? 1 : 0.8;
      x.fillRect(i * (bw + gap) + w * 0.02, h * 0.06, bw, h * 0.2);
    }
    x.globalAlpha = 0.85; x.fillRect(0, 0, w, h * 0.04);
    x.globalAlpha = 0.5; x.fillStyle = '#bdb9b1';
    x.fillRect(w * 0.32, h * 0.32, w * 0.13, h * 0.17);
    x.fillRect(w * 0.66, h * 0.34, w * 0.10, h * 0.15);
    if ('filter' in x) x.filter = 'none';
    x.globalAlpha = 1;
    const t = mk(c, true);
    t.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(t).texture;
    t.dispose(); pmrem.dispose();
    return env;
  }
  scene.environment = studioEnv();

  /* -------------------------------- cork -------------------------------- */
  /* Granules are smaller, drawn at lower opacity and sit in soft beige
     rather than orange-tan; pores are sparse, so the sheet reads almost
     even from a distance and only breaks into speckle up close. */
  function corkMaps(tone, size = 1400) {
    const T = TONES[tone];
    const col = document.createElement('canvas'); col.width = col.height = size;
    const bmp = document.createElement('canvas'); bmp.width = bmp.height = size;
    const c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = T.base; c.fillRect(0, 0, size, size);
    b.fillStyle = '#808080'; b.fillRect(0, 0, size, size);

    /* No large-scale tonal drift: soft light/dark patches at that scale read
       as mould, not cork. Pressed cork is even across the sheet and all of
       its variation lives at granule size.
       These albedos aren't picked by eye — the render pipeline (irradiance,
       ACES curve, sRGB encode) was inverted to land on the reference cork
       colour; painting that colour directly renders noticeably darker. */
    const grain = T.grain, grays = T.grays;
    const stamp = (x, y, r, ry, rot, i, aC, aB) => {
      c.globalAlpha = aC; c.fillStyle = grain[i];
      c.beginPath(); c.ellipse(x, y, r, ry, rot, 0, 7); c.fill();
      b.globalAlpha = aB; b.fillStyle = grays[i];
      b.beginPath(); b.ellipse(x, y, r, ry, rot, 0, 7); b.fill();
    };

    /* Jittered grid, not pure random: uniform random sampling clumps, and
       clumps of light granules beside clumps of dark ones is exactly the
       patchy look. One granule per cell with a random offset keeps coverage
       even while still looking unordered. */
    const cells = 250, step = size / cells;
    for (let gy = 0; gy < cells; gy++) {
      for (let gx = 0; gx < cells; gx++) {
        const x = (gx + Math.random()) * step, y = (gy + Math.random()) * step;
        const r = step * rand(0.6, 1.3), ry = r * rand(0.55, 1.05), rot = Math.random() * Math.PI;
        const i = (Math.random() * grain.length) | 0;
        const aC = rand(0.3, 0.62), aB = rand(0.14, 0.34);
        stamp(x, y, r, ry, rot, i, aC, aB);
        if (x < 10) stamp(x + size, y, r, ry, rot, i, aC, aB);      /* wrap the seams */
        if (x > size - 10) stamp(x - size, y, r, ry, rot, i, aC, aB);
        if (y < 10) stamp(x, y + size, r, ry, rot, i, aC, aB);
        if (y > size - 10) stamp(x, y - size, r, ry, rot, i, aC, aB);
      }
    }
    const fine = 420, fstep = size / fine;   /* finer fill between granules */
    for (let gy = 0; gy < fine; gy++) {
      for (let gx = 0; gx < fine; gx++) {
        const x = (gx + Math.random()) * fstep, y = (gy + Math.random()) * fstep;
        c.globalAlpha = rand(0.1, 0.3);
        c.fillStyle = grain[(Math.random() * grain.length) | 0];
        c.beginPath(); c.arc(x, y, fstep * rand(0.4, 0.9), 0, 7); c.fill();
      }
    }
    const pore = 90, pstep = size / pore;    /* pores, also gridded */
    for (let gy = 0; gy < pore; gy++) {
      for (let gx = 0; gx < pore; gx++) {
        const x = (gx + Math.random()) * pstep, y = (gy + Math.random()) * pstep, r = rand(0.5, 2);
        c.globalAlpha = rand(0.14, 0.36); c.fillStyle = T.pore;
        c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        b.globalAlpha = rand(0.25, 0.6); b.fillStyle = '#3a3a3a';
        b.beginPath(); b.arc(x, y, r, 0, 7); b.fill();
      }
    }
    c.globalAlpha = 1; b.globalAlpha = 1;
    return { map: mk(col, true), bump: mk(bmp, false) };
  }

  /* -------------------------------- maple -------------------------------- */
  /* Painted creamy white rather than clear-lacquered blonde. The figure is
     still there — fine close-spaced lines — but it only reads as a faint
     warm mottle through the paint. Colours run through the same solver as
     the cork so the frame lands on cream on screen instead of picking up
     the cool cast of the fill light. */
  /* Target level sits at the pipeline's ceiling for red, not above it. Asking
     for a brighter cream than this solves red albedo past 1.0, where it
     clips: red then can't rise, green catches up to it, and the frame reads
     olive no matter what the other channels do. So warmth here comes from
     holding green and blue down under a red that is already maxed. */
  const WOOD = {
    base: toHex(solveAlbedo([244, 227, 221], IRR_FRAME)),
    dark: toHex(solveAlbedo([233, 214, 204], IRR_FRAME)),
    light: toHex(solveAlbedo([250, 236, 228], IRR_FRAME)),
    warm: toHex(solveAlbedo([244, 220, 204], IRR_FRAME))
  };
  function mapleMaps(w = 2048, h = 256) {
    const col = document.createElement('canvas'); col.width = w; col.height = h;
    const bmp = document.createElement('canvas'); bmp.width = w; bmp.height = h;
    const c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = WOOD.base; c.fillRect(0, 0, w, h);
    b.fillStyle = '#8a8a8a'; b.fillRect(0, 0, w, h);
    const line = (ctx, y0, color, alpha, width, amp) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath();
      const p1 = rand(0.003, 0.014), p2 = rand(0.0008, 0.004), ph = Math.random() * 7;
      for (let x = 0; x <= w; x += 4) {
        const y = y0 + Math.sin(x * p1 + ph) * amp + Math.sin(x * p2 + ph * 2) * amp * 1.4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    for (let i = 0; i < 700; i++) {
      const y = Math.random() * h, dark = Math.random() < 0.5;
      line(c, y, dark ? WOOD.dark : WOOD.light, rand(0.03, 0.12), rand(0.5, 2.4), rand(1, 5));
      line(b, y, dark ? '#6e6e6e' : '#a8a8a8', rand(0.04, 0.14), rand(0.5, 2.2), rand(1, 5));
    }
    for (let i = 0; i < 10; i++) {           /* a few slightly warmer streaks */
      const y = Math.random() * h;
      line(c, y, WOOD.warm, rand(0.05, 0.1), rand(1.5, 4), rand(3, 8));
      line(b, y, '#5e5e5e', rand(0.06, 0.12), rand(1.5, 4), rand(3, 8));
    }
    c.globalAlpha = 1; b.globalAlpha = 1;
    const id = c.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 10;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    c.putImageData(id, 0, 0);
    const map = mk(col, true), bump = mk(bmp, false);
    map.repeat.set(1 / 30, 1 / 2.2);
    bump.repeat.set(1 / 30, 1 / 2.2);
    return { map, bump };
  }

  const cork = corkMaps(TONE), maple = mapleMaps();
  const corkMat = new THREE.MeshStandardMaterial({
    map: cork.map, bumpMap: cork.bump, bumpScale: 0.05,
    roughness: 0.97, metalness: 0, envMapIntensity: 0.4
  });
  const mapleMat = new THREE.MeshStandardMaterial({
    map: maple.map, bumpMap: maple.bump, bumpScale: 0.008,
    roughness: 0.42, metalness: 0, envMapIntensity: 0.4   /* satin lacquer */
  });
  const backMat = new THREE.MeshStandardMaterial({ color: 0x8a7a62, roughness: 0.9 });

  /* -------------------------------- board -------------------------------- */
  /* A mitred bar: plan-view trapezoid extruded through the depth, then the
     front face is tipped so it ramps down toward the cork — that inward
     slope is the whole character of this moulding. */
  function bar(len, wdt, depth) {
    const bev = 0.04, L = len - bev * 2, W = wdt - bev * 2;
    const s = new THREE.Shape();
    s.moveTo(-L / 2, 0); s.lineTo(L / 2, 0);
    s.lineTo(L / 2 - W, W); s.lineTo(-L / 2 + W, W);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: depth - bev * 2, bevelEnabled: true,
      bevelThickness: bev, bevelSize: bev, bevelOffset: 0, bevelSegments: 2
    });
    g.translate(0, bev, -depth / 2 + bev);
    const pos = g.attributes.position, frontZ = depth / 2;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) > frontZ - bev - 1e-4) {
        pos.setZ(i, pos.getZ(i) - SLOPE * Math.max(0, pos.getY(i)) / wdt);
      }
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }

  const board = new THREE.Group();
  scene.add(board);
  let parts = [];

  function buildBoard(W, H) {
    parts.forEach(m => { m.geometry.dispose(); board.remove(m); });
    parts = [];
    const add = (geo, mat) => {
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = true; m.receiveShadow = true;
      board.add(m); parts.push(m); return m;
    };
    const b = add(bar(W, FRAME_W, DEPTH), mapleMat); b.position.y = -H / 2;
    const t = add(bar(W, FRAME_W, DEPTH), mapleMat); t.rotation.z = Math.PI; t.position.y = H / 2;
    const l = add(bar(H, FRAME_W, DEPTH), mapleMat); l.rotation.z = -Math.PI / 2; l.position.x = -W / 2;
    const r = add(bar(H, FRAME_W, DEPTH), mapleMat); r.rotation.z = Math.PI / 2; r.position.x = W / 2;

    /* cork tiles at a constant physical scale regardless of board size */
    const cw = W - FRAME_W * 2 + 0.06, ch = H - FRAME_W * 2 + 0.06;
    cork.map.repeat.set(cw / 22, ch / 22);
    cork.bump.repeat.set(cw / 22, ch / 22);
    const sheet = add(new THREE.BoxGeometry(cw, ch, 0.14), corkMat);
    sheet.position.z = DEPTH / 2 - SLOPE - 0.16;

    const back = add(new THREE.BoxGeometry(W - 0.1, H - 0.1, 0.09), backMat);
    back.position.z = -DEPTH / 2 + 0.08;

    key.shadow.camera.left = -W; key.shadow.camera.right = W;
    key.shadow.camera.top = H; key.shadow.camera.bottom = -H;
    key.shadow.camera.updateProjectionMatrix();
  }

  /* ------------------------------- lighting ------------------------------- */
  /* Intensities here are not taste — the cork and frame albedos were solved
     against this exact rig (see IRR_CORK / IRR_FRAME). Change these and both
     surfaces drift off their target colours. */
  const key = new THREE.DirectionalLight(0xfff7ec, 0.95);
  key.position.set(-26, 32, 44);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 8; key.shadow.camera.far = 200;
  key.shadow.bias = -0.0007;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe9eeff, 0.28);
  fill.position.set(40, -8, 30); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.28);
  rim.position.set(8, 20, -34); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.14));

  const W = BOARD_W;
  let H = 19;
  const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 400);
  camera.position.set(0, 0, 120);
  buildBoard(W, H);

  let lastW = 0, lastH = 0;
  const resize = (force) => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    /* an unchanged measurement re-entering the observer is what produces the
       'loop completed with undelivered notifications' storm */
    if (!force && w === lastW && h === lastH) return;
    lastW = w; lastH = h;
    renderer.setSize(w, h, false);
    /* rebuild at the container's aspect so the board fills its frame exactly */
    const wantH = W * h / w;
    if (Math.abs(wantH - H) / H > 0.015) {H = wantH; buildBoard(W, H);}
    camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    const host = container.parentElement;
    if (host) {
      host.style.setProperty('--cb-ix', (PAD / W * 100).toFixed(3) + '%');
      host.style.setProperty('--cb-iy', (PAD / H * 100).toFixed(3) + '%');
    }
    renderer.render(scene, camera);
  };
  new ResizeObserver(() => resize(false)).observe(container);
  /* the board draws one frame and holds it, so a lost context would leave the
     cork blank until the next resize — repaint on restore instead */
  renderer.domElement.addEventListener('webglcontextrestored', () => resize(true));
  resize(true);
  return { renderer, scene, camera };
}

window.KXCork3D = mount;
window.dispatchEvent(new Event('kx-cork3d-ready'));
