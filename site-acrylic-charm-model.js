/**
 * buildAcrylicCharm(THREE, printUrl, opts) -> Promise<THREE.Group>
 *
 * Clear-acrylic key charm. The blank is the print's own silhouette DILATED by
 * a border — the way a real acrylic charm is cut — so separate parts of the
 * artwork (a mark and the letters under it) are carried by one piece of
 * resin with a clear margin around them. The artwork is laminated at
 * mid-thickness so it reads from both sides, a hole is drilled through the
 * blank, and a jump ring, chain, split ring and small blank tag hang off it.
 *
 * Modelled in metres, y-up, base at y = 0. Every mesh and material is named
 * so OBJ/GLB exports stay readable.
 */
export async function buildAcrylicCharm(THREE, printUrl, opts = {}) {
  const {
    maxSize = 0.072,     // longest edge of the blank
    borderRatio = 0.105, // clear margin, as a fraction of the artwork's size
    thickness = 0.0075,  // resin thickness
    tint = 0xffffff,     // resin tint
  } = opts;

  const printImg = await new THREE.ImageLoader().loadAsync(printUrl);

  /* ---- dilated silhouette ------------------------------------------------
     The border is produced by stamping the artwork's alpha around a circle
     rather than by a distance transform: 96 stamps at two radii is a close
     enough approximation of a round dilation, and it costs one canvas pass
     instead of a full EDT over the grid. Its radius is set from the ARTWORK's
     own extent, not the file's — a logo usually sits in a much larger
     transparent canvas, so a margin measured against the file would collapse
     to nothing. */
  const G = 420;
  const AR = printImg.height / printImg.width;
  const GW = G, GH = Math.max(8, Math.round(G * AR));

  const probe = document.createElement('canvas');
  probe.width = GW;
  probe.height = GH;
  const pctx = probe.getContext('2d');
  pctx.drawImage(printImg, 0, 0, GW, GH);
  const pData = pctx.getImageData(0, 0, GW, GH).data;
  const a0 = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (pData[(y * GW + x) * 4 + 3] < 90) continue;
      if (x < a0.minX) a0.minX = x;
      if (x > a0.maxX) a0.maxX = x;
      if (y < a0.minY) a0.minY = y;
      if (y > a0.maxY) a0.maxY = y;
    }
  }
  if (a0.minX === Infinity) throw new Error('print has no opaque pixels');

  const rGrid = borderRatio * Math.max(a0.maxX - a0.minX, a0.maxY - a0.minY);
  const PAD = Math.ceil(rGrid) + 8;
  const RW = GW + PAD * 2, RH = GH + PAD * 2;

  const dc = document.createElement('canvas');
  dc.width = RW;
  dc.height = RH;
  const dctx = dc.getContext('2d');
  for (let band = 1; band <= 2; band++) {
    const rr = rGrid * (band === 1 ? 0.55 : 1);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      dctx.drawImage(printImg, PAD + Math.cos(a) * rr, PAD + Math.sin(a) * rr, GW, GH);
    }
  }
  dctx.drawImage(printImg, PAD, PAD, GW, GH);

  /* Blur-then-threshold closes the notches the per-letter dilations leave
     between adjacent glyphs, so the cut line reads as one deliberate
     silhouette instead of a row of scallops. */
  const sc = document.createElement('canvas');
  sc.width = RW;
  sc.height = RH;
  const sctx = sc.getContext('2d');
  if ('filter' in sctx) sctx.filter = 'blur(' + (rGrid * 0.55).toFixed(2) + 'px)';
  sctx.drawImage(dc, 0, 0);
  const dData = sctx.getImageData(0, 0, RW, RH).data;
  const alpha = new Float32Array(RW * RH);
  for (let i = 0; i < RW * RH; i++) alpha[i] = dData[i * 4 + 3] / 255;

  const art = {
    minX: a0.minX + PAD, maxX: a0.maxX + PAD,
    minY: a0.minY + PAD, maxY: a0.maxY + PAD,
  };

  /* ---- marching squares, oriented ---------------------------------------
     Segments are emitted with solid on the left and chained start-to-end, so
     every crossing has exactly one segment in and one out. Orientation is
     what keeps touching contours separable; an unoriented walk fuses them
     and fills concave gaps with straight chords. */
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
        const c = (at(x, y) >= thr ? 1 : 0) | (at(x + 1, y) >= thr ? 2 : 0) |
                  (at(x + 1, y + 1) >= thr ? 4 : 0) | (at(x, y + 1) >= thr ? 8 : 0);
        if (c === 0 || c === 15) continue;
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
    // close a loop on the first revisited point, so a saddle that crosses
    // into a neighbouring contour still yields both cycles
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

  // collapse near-collinear runs; a split-and-recurse simplifier can cut a
  // chord straight across a concave feature
  function simplify(loop, eps) {
    let pts = loop.slice();
    for (let pass = 0; pass < 8 && pts.length > 20; pass++) {
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
        if (d < eps && keep.length && pts.length - removed > 20) { removed++; continue; }
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

  const loops = traceLoops(alpha, RW, RH, 0.5)
    .map((l) => simplify(l, 0.06))
    .filter((l) => Math.abs(area(l)) > 200)
    .sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)))
    .map((l) => l.map(([x, y]) => [x, RH - y]));   // image space is y-down
  if (!loops.length) throw new Error('acrylic outline trace failed');

  const outerIdx = [], holesFor = new Map();
  loops.forEach((loop, i) => {
    let parent = -1, parentArea = Infinity;
    loops.forEach((other, j) => {
      if (i === j) return;
      const oa = Math.abs(area(other));
      if (oa > Math.abs(area(loop)) && inside(loop[0], other) && oa < parentArea) {
        parentArea = oa; parent = j;
      }
    });
    if (parent === -1) outerIdx.push(i);
    else {
      if (!holesFor.has(parent)) holesFor.set(parent, []);
      holesFor.get(parent).push(i);
    }
  });

  // ---- grid -> metres ---------------------------------------------------
  const box = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  loops.forEach((l) => l.forEach(([x, y]) => {
    box.minX = Math.min(box.minX, x); box.maxX = Math.max(box.maxX, x);
    box.minY = Math.min(box.minY, y); box.maxY = Math.max(box.maxY, y);
  }));
  const gw = box.maxX - box.minX, gh = box.maxY - box.minY;
  const scale = maxSize / Math.max(gw, gh);
  const cxG = (box.minX + box.maxX) / 2;
  const BASE_Y = 0.0022;
  const toM = ([x, y]) => [(x - cxG) * scale, (y - box.minY) * scale + BASE_Y];

  const charm = new THREE.Group();
  charm.name = 'charm';

  // ---- drilled hole -----------------------------------------------------
  // Sit it in the widest solid run a little below the top edge, so the wall
  // around it has resin on every side.
  const holeInsetG = rGrid * 0.62;
  const rowY = Math.round(RH - (box.maxY - holeInsetG));   // back to image space
  let runStart = -1, bestA = 0, bestB = 0;
  for (let x = 0; x <= RW; x++) {
    const solid = x < RW && alpha[rowY * RW + x] >= 0.5;
    if (solid && runStart < 0) runStart = x;
    if (!solid && runStart >= 0) {
      if (x - runStart > bestB - bestA) { bestA = runStart; bestB = x; }
      runStart = -1;
    }
  }
  const holeXG = (bestA + bestB) / 2 || cxG;
  const holeM = toM([holeXG, box.maxY - holeInsetG]);
  const HOLE_R = 0.0021;

  const shapes = outerIdx.map((i) => {
    const path = (loop, Ctor) => {
      const p = new Ctor();
      const q = loop.map(toM);
      p.moveTo(q[0][0], q[0][1]);
      for (let k = 1; k < q.length; k++) p.lineTo(q[k][0], q[k][1]);
      p.closePath();
      return p;
    };
    const s = path(loops[i], THREE.Shape);
    /* interior gaps in the artwork are filled with resin, as a cut blank would
       be — and hole loops that graze the outline stall the triangulator */
    if (opts.keepHoles) (holesFor.get(i) || []).forEach((h) => s.holes.push(path(loops[h], THREE.Path)));
    if (inside([holeXG, box.maxY - holeInsetG], loops[i])) {
      const drill = new THREE.Path();
      drill.absarc(holeM[0], holeM[1], HOLE_R, 0, Math.PI * 2, true);
      s.holes.push(drill);
    }
    return s;
  });

  // ---- materials --------------------------------------------------------
  // Clear acrylic is read through what shows THROUGH it plus the bright line
  // along its cut edge. A transmissive material needs the renderer's
  // transmission pass and a strong environment to look like anything; a
  // low-opacity dielectric with a full clearcoat reads the same here and
  // never turns milky, so the resin is layered over the print instead:
  // depthWrite off, drawn last.
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

  /* The print is baked rather than used raw. A logo file is often thousands
     of pixels wide and lands on a charm barely a hundred pixels tall, so the
     texture is minified through several mip levels — and mip averaging mixes
     the RGB of the artwork's TRANSPARENT surround (usually pure white) into
     the ink. With alphaTest keeping those averaged pixels, thin letters wash
     out into a pale slab. Cropping to the ink, downsampling once, and then
     bleeding the ink's own colour outwards into the clear pixels leaves
     nothing white for the filter to find. */
  const printTex = (() => {
    const cropW = art.maxX - art.minX, cropH = art.maxY - art.minY;
    const TEX_MAX = 1024;
    const k = Math.min(1, TEX_MAX / Math.max(cropW, cropH) / (printImg.width / GW));
    const tw = Math.max(8, Math.round(cropW * (printImg.width / GW) * k));
    const thh = Math.max(8, Math.round(cropH * (printImg.height / GH) * k));

    const bc = document.createElement('canvas');
    bc.width = tw;
    bc.height = thh;
    const bctx = bc.getContext('2d');
    bctx.drawImage(
      printImg,
      ((art.minX - PAD) / GW) * printImg.width,
      ((art.minY - PAD) / GH) * printImg.height,
      (cropW / GW) * printImg.width,
      (cropH / GH) * printImg.height,
      0, 0, tw, thh
    );

    const id = bctx.getImageData(0, 0, tw, thh);
    const px = id.data;
    const solid = new Uint8Array(tw * thh);
    for (let i = 0; i < tw * thh; i++) solid[i] = px[i * 4 + 3] > 8 ? 1 : 0;
    for (let pass = 0; pass < 6; pass++) {
      const grew = solid.slice();
      for (let y = 0; y < thh; y++) {
        for (let x = 0; x < tw; x++) {
          const i = y * tw + x;
          if (solid[i]) continue;
          let r = 0, g = 0, b = 0, n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= tw || ny >= thh) continue;
              const j = ny * tw + nx;
              if (!solid[j]) continue;
              r += px[j * 4]; g += px[j * 4 + 1]; b += px[j * 4 + 2]; n++;
            }
          }
          if (!n) continue;
          px[i * 4] = r / n; px[i * 4 + 1] = g / n; px[i * 4 + 2] = b / n;
          grew[i] = 1;
        }
      }
      solid.set(grew);
    }
    /* whatever the bleed did not reach is filled with the ink's mean colour:
       a leftover black surround would fringe the letters dark exactly the way
       a white one fringed them pale */
    let mr = 0, mg = 0, mb = 0, mn = 0;
    for (let i = 0; i < tw * thh; i++) {
      if (px[i * 4 + 3] <= 8) continue;
      mr += px[i * 4]; mg += px[i * 4 + 1]; mb += px[i * 4 + 2]; mn++;
    }
    if (mn) {
      mr = Math.round(mr / mn); mg = Math.round(mg / mn); mb = Math.round(mb / mn);
      for (let i = 0; i < tw * thh; i++) {
        if (solid[i]) continue;
        px[i * 4] = mr; px[i * 4 + 1] = mg; px[i * 4 + 2] = mb;
      }
    }
    bctx.putImageData(id, 0, 0);

    const t = new THREE.CanvasTexture(bc);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  })();
  const printMat = new THREE.MeshPhysicalMaterial({
    name: 'laminatedPrint', map: printTex, transparent: true, alphaTest: 0.5,
    roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.14,
    envMapIntensity: 0.55,
  });

  const hardware = new THREE.MeshStandardMaterial({
    name: 'hardware', color: 0xc9cbd2, metalness: 1.0, roughness: 0.16,
  });
  const brushedSilver = new THREE.MeshStandardMaterial({
    name: 'brushedSilver', color: 0xd6d7dd, metalness: 0.9, roughness: 0.34,
  });

  // ---- the blank --------------------------------------------------------
  const blankGeo = new THREE.ExtrudeGeometry(shapes, {
    depth: thickness, curveSegments: 8, bevelEnabled: true,
    bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 3,
  });
  blankGeo.translate(0, 0, -thickness / 2);
  blankGeo.computeVertexNormals();
  const blank = new THREE.Mesh(blankGeo, [resin, resinEdge]);
  blank.name = 'acrylicBlank';
  blank.renderOrder = 6;
  blank.castShadow = true;
  blank.receiveShadow = true;
  charm.add(blank);

  // ---- laminated artwork, at mid-thickness ------------------------------
  // cropped to the ink, and given the matching UV window on the plane; a
  // second mirrored copy faces the back, the way a double-sided charm prints
  const artW = (art.maxX - art.minX) * scale;
  const artH = (art.maxY - art.minY) * scale;
  const artCx = ((art.minX + art.maxX) / 2 - cxG) * scale;
  const artCy = (RH - (art.minY + art.maxY) / 2 - box.minY) * scale + BASE_Y;
  const artGeo = new THREE.PlaneGeometry(artW, artH);
  const print = new THREE.Mesh(artGeo, printMat);
  print.name = 'laminatedArt';
  print.position.set(artCx, artCy, 0.0004);
  print.renderOrder = 1;
  charm.add(print);

  const printBack = new THREE.Mesh(artGeo, printMat);
  printBack.name = 'laminatedArtBack';
  printBack.position.set(artCx, artCy, -0.0004);
  printBack.rotation.y = Math.PI;
  printBack.renderOrder = 1;
  charm.add(printBack);

  // ---- hardware ---------------------------------------------------------
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

  // jump ring through the drilled hole
  const jumpR = 0.0046;
  const jump = ring(jumpR, 0.0013, hardware, 'jumpRing');
  jump.rotation.y = Math.PI / 2;
  jump.position.set(holeM[0], holeM[1] + jumpR - HOLE_R * 0.6, 0);
  charm.add(jump);

  const linkR = 0.0045, linkTube = 0.0012, pitch = linkR * 2 - linkTube * 2;
  const chainBase = jump.position.y + jumpR - linkTube;
  const CHAIN_N = 4;
  for (let i = 0; i < CHAIN_N; i++) {
    const link = ring(linkR, linkTube, hardware, 'chainLink' + (i + 1));
    link.position.set(holeM[0], chainBase + linkR + i * pitch, 0);
    if (i % 2 === 1) link.rotation.y = Math.PI / 2;
    charm.add(link);
  }
  const chainTop = chainBase + linkR + (CHAIN_N - 1) * pitch + linkR - linkTube;

  const keyRingR = 0.018;
  const ringY = chainTop + keyRingR - 0.0012;
  for (let i = 0; i < 2; i++) {
    const coil = ring(keyRingR, 0.0012, hardware, 'keyRingCoil' + (i + 1));
    coil.position.set(holeM[0], ringY, (i === 0 ? -1 : 1) * 0.0023);
    coil.rotation.z = i * 0.12;
    charm.add(coil);
  }

  // ---- small blank tag on its own chain --------------------------------
  // The chain leaves the split ring nearly sideways, so a larger tag clears
  // the blank instead of swinging across it.
  const dir = new THREE.Vector2(0.90, -0.44).normalize();
  const tagLinkR = 0.0034, tagLinkTube = 0.00092;
  const tagPitch = tagLinkR * 2 - tagLinkTube * 2;
  const tagStart = new THREE.Vector2(holeM[0], ringY)
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

  const TW = 0.052, TH = 0.028, TD = 0.0030;
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
