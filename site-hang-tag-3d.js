/* Kraft hang tag on twisted linen twine, ported from the charm study so both
   fobs carry the same physical tag instead of a CSS card. The twine loops
   through the split ring (both legs return to the knot, so it reads as
   threaded rather than stopping at the wire), gathers in a knot, then runs
   down to the tag's eyelet with a little sag.

   Built into the same offscreen scene as the fob, so it renders as one sprite
   and swings with it. Scene units = millimetres. */

const TAG_W = 40, TAG_H = 62, TAG_T = 0.75;
const TAG_CUT = 10;          /* clipped top corners */
const TAG_HOLE_R = 2.6;

export function buildHangTag(THREE, opts) {
  const { texFrom, chrome, ringR, ringY, label, font } = opts;
  /* which way the tag hangs: the fobs sit toward the left of the cork, so the
     paper swings out to the right by default, where there's room */
  const S = opts.side === 'left' ? -1 : 1;
  const group = new THREE.Group();
  const V = (x, y, z) => new THREE.Vector3(-x * S, y, z);

  /* ------------------------------- paper -------------------------------
     Pressed pulp: mottle, linen fibre lying in two directions, and flecks
     of unbleached stock. The same canvas drives colour and bump. */
  function paperTexture() {
    const S = 1024;
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    x.fillStyle = '#e8dcc4'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 900; i++) {
      const px = Math.random() * S, py = Math.random() * S, r = 8 + Math.random() * 70;
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, Math.random() < 0.5 ? 'rgba(255,250,236,0.10)' : 'rgba(176,158,126,0.09)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    }
    for (let i = 0; i < 5200; i++) {
      const px = Math.random() * S, py = Math.random() * S;
      const a = (Math.random() < 0.5 ? 0 : Math.PI / 2) + (Math.random() - 0.5) * 1.1;
      const len = 4 + Math.random() * 22;
      x.globalAlpha = 0.05 + Math.random() * 0.14;
      x.strokeStyle = Math.random() < 0.55 ? '#bda880' : '#fff8e8';
      x.lineWidth = 0.4 + Math.random() * 1.1;
      x.beginPath(); x.moveTo(px, py);
      x.lineTo(px + Math.cos(a) * len, py + Math.sin(a) * len); x.stroke();
    }
    x.globalAlpha = 1;
    for (let i = 0; i < 420; i++) {
      const px = Math.random() * S, py = Math.random() * S;
      x.fillStyle = Math.random() < 0.5 ? 'rgba(140,116,78,0.5)' : 'rgba(96,78,52,0.35)';
      x.beginPath(); x.ellipse(px, py, 0.6 + Math.random() * 2.2, 0.5 + Math.random() * 1.2, Math.random() * 3, 0, 7); x.fill();
    }
    const t = texFrom(c, true);
    /* ExtrudeGeometry hands out shape coordinates as UVs, so the sheet is
       mapped by physical size rather than tiling per millimetre */
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / TAG_W, 1 / TAG_H);
    t.offset.set(0.5, 0.5);
    return t;
  }

  /* the wording, printed on the face. Label only: at this physical size a
     second line of body copy renders below legibility. */
  function inkTexture() {
    const W = 640, H = Math.round(W * TAG_H / TAG_W);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#33261a';
    let size = 120;
    x.font = '600 ' + size + 'px ' + font;
    while (x.measureText(label).width > W * 0.8 && size > 40) {
      size -= 4;
      x.font = '600 ' + size + 'px ' + font;
    }
    x.fillText(label, W / 2, H * 0.54);
    return texFrom(c, true);
  }

  function tagShape() {
    const w = TAG_W / 2, h = TAG_H / 2, k = TAG_CUT;
    const s = new THREE.Shape();
    s.moveTo(-w, -h + 1.5);
    s.quadraticCurveTo(-w, -h, -w + 1.5, -h);
    s.lineTo(w - 1.5, -h); s.quadraticCurveTo(w, -h, w, -h + 1.5);
    s.lineTo(w, h - k);
    s.lineTo(w - k * 0.72, h);
    s.lineTo(-w + k * 0.72, h);
    s.lineTo(-w, h - k);
    s.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, h - k * 0.62, TAG_HOLE_R, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return s;
  }

  /* ------------------------------- twine -------------------------------
     Jute: fibres run along the length at a slight lay angle, with slubs.
     The ply-to-ply twist lives in the geometry, so it stays out of the map. */
  function juteTexture() {
    const W = 512, H = 128;
    const col = document.createElement('canvas'); col.width = W; col.height = H;
    const bmp = document.createElement('canvas'); bmp.width = W; bmp.height = H;
    const c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = '#7e6850'; c.fillRect(0, 0, W, H);
    b.fillStyle = '#808080'; b.fillRect(0, 0, W, H);
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.00, 'rgba(40,28,16,0.55)');
    g.addColorStop(0.28, 'rgba(255,236,208,0.10)');
    g.addColorStop(0.50, 'rgba(0,0,0,0)');
    g.addColorStop(0.72, 'rgba(255,236,208,0.08)');
    g.addColorStop(1.00, 'rgba(40,28,16,0.55)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const tones = ['#604e37', '#6f5c45', '#7e6850', '#9b7f61', '#c0966f'];
    const fibre = (ctx, alpha, palette) => {
      for (let i = 0; i < 2600; i++) {
        const y = Math.random() * H, x = Math.random() * W;
        const len = 18 + Math.random() * 90;
        const tilt = (Math.random() - 0.5) * 0.32;
        ctx.globalAlpha = alpha();
        ctx.strokeStyle = palette();
        ctx.lineWidth = 0.4 + Math.random() * 1.5;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + len * 0.33, y + tilt * 10, x + len * 0.66, y - tilt * 8, x + len, y + tilt * 16);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    fibre(c, () => 0.10 + Math.random() * 0.34, () => tones[(Math.random() * tones.length) | 0]);
    fibre(b, () => 0.08 + Math.random() * 0.26, () => Math.random() < 0.5 ? '#ffffff' : '#3c3c3c');
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      c.globalAlpha = 0.18 + Math.random() * 0.3;
      c.fillStyle = Math.random() < 0.5 ? '#c0966f' : '#604e37';
      c.beginPath(); c.ellipse(x, y, 3 + Math.random() * 10, 1 + Math.random() * 2.5, (Math.random() - 0.5) * 0.4, 0, 7); c.fill();
      b.globalAlpha = 0.3 + Math.random() * 0.4; b.fillStyle = '#e8e8e8';
      b.beginPath(); b.ellipse(x, y, 3 + Math.random() * 10, 1 + Math.random() * 2.5, (Math.random() - 0.5) * 0.4, 0, 7); b.fill();
    }
    c.globalAlpha = 1; b.globalAlpha = 1;
    const map = texFrom(col, true), bump = texFrom(bmp, false);
    [map, bump].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
    return { map, bump };
  }
  const JUTE = juteTexture();
  const linenMat = new THREE.MeshStandardMaterial({
    map: JUTE.map, bumpMap: JUTE.bump, bumpScale: 0.045,
    roughness: 0.97, metalness: 0, envMapIntensity: 0.32
  });

  /* two plies wound helically along the path: a smooth tube reads as wire */
  function twine(points, radius, pitch) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35);
    const len = Math.max(curve.getLength(), 1);
    const turns = len / (pitch || 2.2);
    const N = Math.max(48, Math.min(360, Math.round(len * 3)));
    const frames = curve.computeFrenetFrames(N, false);
    const g = new THREE.Group();
    for (let ply = 0; ply < 2; ply++) {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const p = curve.getPointAt(Math.min(t, 1)).clone();
        const idx = Math.min(i, frames.normals.length - 1);
        const ang = t * turns * Math.PI * 2 + ply * Math.PI;
        p.add(frames.normals[idx].clone().multiplyScalar(Math.cos(ang) * radius * 0.55));
        p.add(frames.binormals[idx].clone().multiplyScalar(Math.sin(ang) * radius * 0.55));
        pts.push(p);
      }
      const c2 = new THREE.CatmullRomCurve3(pts, false);
      const mat = linenMat.clone();
      const tiles = Math.max(1, Math.round(len / 3.4));
      mat.map = JUTE.map.clone(); mat.map.repeat.set(tiles, 1); mat.map.needsUpdate = true;
      mat.bumpMap = JUTE.bump.clone(); mat.bumpMap.repeat.set(tiles, 1); mat.bumpMap.needsUpdate = true;
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c2, N, radius * 0.52, 10, false), mat));
    }
    return g;
  }

  const wireY = ringY - ringR;                 /* bottom of the split ring */
  const knot = V(-8, wireY - 11.5, 1.6);
  const rope = 1.05;      /* ~2 mm linen thread — fine cord, twist still reads */
  const loopY = wireY - 6.5;
  group.add(twine([
    knot,
    V(-5.4, loopY + 0.5, 3.1),
    V(-1.2, wireY + 0.1, 2.0),
    V(0.0, wireY + 2.0, 0.0),
    V(-1.2, wireY + 0.1, -2.0),
    V(-5.4, loopY + 0.5, -3.1),
    knot
  ], rope, 1.4));

  const dir = V(-14, -18, 5).normalize();  [0, 1.1].forEach((o, i) => {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.98 - i * 0.10, 0.31, 12, 30), linenMat);
    t.position.copy(knot).addScaledVector(dir, o);
    t.lookAt(knot.clone().addScaledVector(dir, o + 1));
    group.add(t);
  });

  /* the paper hangs clear of the part: the caller passes its own half-width,
     since the two fobs are different sizes */
  const clearX = (opts.partHalfW || 0) + TAG_W / 2 + 5;
  const holePt = V(-clearX, wireY - 46, 8.0);
  group.add(twine([
    knot.clone().addScaledVector(dir, 1.7),
    V(-clearX * 0.42, wireY - 24, 4.4),
    V(-clearX * 0.76, wireY - 35, 6.8),
    holePt
  ], rope, 1.6));

  const paper = paperTexture();
  const paperMat = new THREE.MeshStandardMaterial({
    map: paper, bumpMap: paper, bumpScale: 0.035,
    roughness: 0.96, metalness: 0, envMapIntensity: 0.45,
    side: THREE.DoubleSide
  });
  const geo = new THREE.ExtrudeGeometry(tagShape(), {
    depth: TAG_T, bevelEnabled: true,
    bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 1, curveSegments: 4
  });
  geo.translate(0, 0, -TAG_T / 2);
  const holeLocalY = TAG_H / 2 - TAG_CUT * 0.62;
  const card = new THREE.Group();
  const tag = new THREE.Mesh(geo, paperMat);
  tag.position.y = -holeLocalY;                /* hang the card from its hole */
  card.add(tag);

  const ink = new THREE.Mesh(new THREE.PlaneGeometry(TAG_W, TAG_H),
    new THREE.MeshStandardMaterial({
      map: inkTexture(), transparent: true, roughness: 0.9, metalness: 0,
      envMapIntensity: 0.3, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
    }));
  ink.position.set(0, -holeLocalY, TAG_T / 2 + 0.02);
  ink.renderOrder = 6;
  card.add(ink);

  card.position.copy(holePt);
  card.rotation.set(0.05, 0.22 * S, -0.09 * S);        /* paper never hangs square */
  group.add(card);

  const eye = new THREE.Mesh(new THREE.TorusGeometry(TAG_HOLE_R + 0.7, 0.55, 10, 28), chrome);
  eye.position.copy(holePt);
  eye.rotation.copy(card.rotation);
  group.add(eye);

  return group;
}
