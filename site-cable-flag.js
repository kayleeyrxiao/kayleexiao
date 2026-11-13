/* Cable-flag label for an acrylic charm: a white vinyl strip wrapped round the
   chain whose two ends are pressed together into a printed flag, the way
   network cables are tagged. Replaces the model's metal tag + tag chain. */
export function addCableFlag(THREE, charm, text, font) {
  const drop = [];
  charm.traverse((o) => { if (/^tagChainLink|^tagAssembly$/.test(o.name)) drop.push(o); });
  drop.forEach((o) => o.parent && o.parent.remove(o));

  const coil = charm.getObjectByName('keyRingCoil1');
  if (!coil) return;
  const ringR = coil.geometry.parameters.radius;

  const vinyl = new THREE.MeshStandardMaterial({ name: 'labelVinyl', color: 0xf3f2ee, roughness: 0.62, metalness: 0, side: THREE.DoubleSide });
  const wrapR = 0.0042, bandH = 0.0095, neckL = 0.0065, sheet = 0.0007;
  const FD = 0.0009;
  /* fixed type size on every label (the size "About" prints at); longer
     titles get a longer flag instead of smaller letters */
  const K = 1.35, SIZE = Math.round(250 * K), CH = Math.round(470 * K), PXM = 1024 / (0.036 * 0.94);
  const mc = document.createElement('canvas').getContext('2d');
  mc.font = '700 ' + SIZE + 'px ' + font;
  const CW = Math.max(Math.round(1024 * K), Math.ceil(mc.measureText(text).width + 164 * K));
  const FW = CW / PXM / 0.94;
  const FH = CH / PXM + 0.001;

  /* group sits at the ring's centre turned to the wrap point: local +x points
     outward along the radius, local +y runs along the ring wire there */
  const g = new THREE.Group();
  g.name = 'cableFlag';
  g.position.set(coil.position.x, coil.position.y, 0);
  g.rotation.z = CW > 1150 * K ? -0.74 : CW > 1024 * K ? -0.58 : -0.46;
  charm.add(g);

  const wrap = new THREE.Mesh(new THREE.CylinderGeometry(wrapR, wrapR, bandH, 40, 1, true), vinyl);
  wrap.name = 'labelWrap';
  wrap.position.x = ringR;
  g.add(wrap);

  const neck = new THREE.Mesh(new THREE.BoxGeometry(neckL + 0.001, bandH, sheet * 2), vinyl);
  neck.name = 'labelNeck';
  neck.position.x = ringR + wrapR + neckL / 2 - 0.0005;
  g.add(neck);

  const r = 0.0022, x = -FW / 2, y = -FH / 2, s = new THREE.Shape();
  s.moveTo(x + r, y); s.lineTo(x + FW - r, y); s.absarc(x + FW - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + FW, y + FH - r); s.absarc(x + FW - r, y + FH - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + FH); s.absarc(x + r, y + FH - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const fg = new THREE.ExtrudeGeometry(s, { depth: FD, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.0002, bevelSize: 0.0002, bevelSegments: 2 });
  fg.translate(0, 0, -FD / 2);
  fg.computeVertexNormals();
  const flag = new THREE.Mesh(fg, vinyl);
  flag.name = 'labelFlag';
  const fx = ringR + wrapR + neckL + FW / 2 - 0.0008;
  flag.position.x = fx;
  g.add(flag);

  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const ctx = c.getContext('2d');
  ctx.font = '700 ' + SIZE + 'px ' + font;
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, CW / 2, CH * 0.52);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const ink = new THREE.MeshStandardMaterial({ name: 'labelPrint', map: tex, transparent: true, alphaTest: 0.35, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const plane = new THREE.PlaneGeometry(FW * 0.94, FW * 0.94 * (CH / CW));
  for (const side of [1, -1]) {
    const p = new THREE.Mesh(plane, ink);
    p.name = side > 0 ? 'labelPrintFront' : 'labelPrintBack';
    p.position.set(fx, 0, side * (FD / 2 + 0.00025));
    if (side < 0) p.rotation.y = Math.PI;
    g.add(p);
  }
}

/* label typeface: the site's body sans, with a CJK sans ahead of it for zh */
export function flagFont(text) {
  const body = getComputedStyle(document.documentElement).getPropertyValue('--site-body').trim() || 'Helvetica, Arial, sans-serif';
  return /[\u3400-\u9fff]/.test(text) ? '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", ' + body : body;
}
