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
export function buildFolderCharm(THREE, opts = {}) {
  const {
    width = 0.056,        // folder width
    height = 0.040,       // folder height, tab excluded
    tabWidth = 0.026,
    tabHeight = 0.009,
    leaf = 0.0024,        // thickness of one leaf
    gap = 0.0011,         // air between the leaves
    enamel = 0xd6e0f0,    // slate-blue metal (a metal takes its brightness from
                          //   the environment, so the base colour runs light)
    liner = 0xf0f3fa,     // paler inside face
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

  const keyRingR = 0.0165;
  const ringY = chainTop + keyRingR - 0.0011;
  for (let i = 0; i < 2; i++) {
    const coil = ring(keyRingR, 0.0013, hardware, 'keyRingCoil' + (i + 1));
    coil.position.set(holeX, ringY, (i === 0 ? -1 : 1) * 0.0013);
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
