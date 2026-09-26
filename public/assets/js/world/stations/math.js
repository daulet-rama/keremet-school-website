// MATH — ink-drawn Platonic solids (glassy faces, tube edges, dot vertices) orbiting a glossy torus knot.
// Light graph-paper theme → ink-blue lines + blue/coral accents, no glow. Trick: elastic slot swap + formula pop-out.
import {
  Group, Mesh, InstancedMesh, IcosahedronGeometry, DodecahedronGeometry, OctahedronGeometry, TetrahedronGeometry,
  TorusKnotGeometry, CylinderGeometry, SphereGeometry, EdgesGeometry, MeshPhysicalMaterial, MeshStandardMaterial,
  Vector3, Quaternion, Matrix4, DoubleSide, Sprite, SpriteMaterial, BufferGeometry, Float32BufferAttribute, Line,
  LineDashedMaterial, ConeGeometry,
} from 'three';
import { Interactive, detail, ToneSwitch } from './_base.js';
import { addRim, textTexture, whenFont } from '../fx/materials.js';
import { clamp, easeOutElastic, easeOutBack, easeInOutCubic, bump } from '../fx/ease.js';

const INK = '#1B2A6B', BLUE = '#3D5AFE', CORAL = '#FF5A5F';
const Y = new Vector3(0, 1, 0);

function wireSolid(geo, { faceColor, edgeColor, dotColor, radius = 0.028, low }) {
  const g = new Group();
  const face = new Mesh(geo, new MeshPhysicalMaterial({
    color: faceColor, transparent: true, opacity: 0.26, roughness: 0.12, metalness: 0, clearcoat: 1,
    side: DoubleSide, depthWrite: false, envMapIntensity: 1.4,
  }));
  face.renderOrder = 2;
  g.add(face);
  const edges = new EdgesGeometry(geo, 1);
  const p = edges.attributes.position;
  const n = p.count / 2;
  const cyl = new CylinderGeometry(radius, radius, 1, low ? 5 : 8, 1, true);
  const edgeMat = new MeshStandardMaterial({ color: edgeColor, roughness: 0.55, metalness: 0.1 });
  const em = new InstancedMesh(cyl, edgeMat, n);
  const a = new Vector3(), b = new Vector3(), mid = new Vector3(), dir = new Vector3(), q = new Quaternion(), m = new Matrix4(), s = new Vector3();
  for (let i = 0; i < n; i++) {
    a.fromBufferAttribute(p, i * 2); b.fromBufferAttribute(p, i * 2 + 1);
    mid.addVectors(a, b).multiplyScalar(0.5);
    dir.subVectors(b, a);
    const len = dir.length();
    q.setFromUnitVectors(Y, dir.normalize());
    s.set(1, len, 1);
    m.compose(mid, q, s);
    em.setMatrixAt(i, m);
  }
  g.add(em);
  // unique vertices → dots
  const verts = [];
  for (let i = 0; i < p.count; i++) {
    a.fromBufferAttribute(p, i);
    if (!verts.some((v) => v.distanceToSquared(a) < 1e-6)) verts.push(a.clone());
  }
  const dot = new SphereGeometry(radius * 2.3, 10, 8);
  const dm = new InstancedMesh(dot, new MeshStandardMaterial({ color: dotColor, roughness: 0.4 }), verts.length);
  verts.forEach((v, i) => { m.makeTranslation(v.x, v.y, v.z); dm.setMatrixAt(i, m); });
  g.add(dm);
  edges.dispose();
  return g;
}

function axisLine(to, color) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute([-to.x, -to.y, -to.z, to.x, to.y, to.z], 3));
  const l = new Line(g, new LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0.55 }));
  l.computeLineDistances();
  return l;
}

export default function createMath(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.7 });
  const { group, spin } = base;

  // ---- torus knot
  const knotGeo = new TorusKnotGeometry(0.78, 0.23, low ? 140 : 260, low ? 14 : 24, 2, 3);
  const knotMat = new MeshPhysicalMaterial({ color: BLUE, roughness: 0.28, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.1, envMapIntensity: 0.55 });
  const knotRim = addRim(knotMat, { color: '#9DB0FF', power: 3, strength: 0.35 });
  const knot = new Mesh(knotGeo, knotMat);
  spin.add(knot);

  // ---- axes (like a sketch in the margin)
  const axes = new Group();
  const ax = [axisLine(new Vector3(3.0, 0, 0), INK), axisLine(new Vector3(0, 2.6, 0), INK), axisLine(new Vector3(0, 0, 3.0), INK)];
  ax.forEach((l) => axes.add(l));
  const coneGeo = new ConeGeometry(0.06, 0.2, 10);
  const coneMat = new MeshStandardMaterial({ color: INK, roughness: 0.6 });
  [[new Vector3(3.0, 0, 0), [0, 0, -Math.PI / 2]], [new Vector3(0, 2.6, 0), [0, 0, 0]], [new Vector3(0, 0, 3.0), [Math.PI / 2, 0, 0]]].forEach(([p, r]) => {
    const c = new Mesh(coneGeo, coneMat); c.position.copy(p); c.rotation.set(r[0], r[1], r[2]); axes.add(c);
  });
  axes.rotation.set(0.18, -0.5, 0);
  spin.add(axes);

  // ---- orbit ring (dashed ellipse)
  const orbit = new Group();
  orbit.rotation.set(0.42, 0, -0.18);
  spin.add(orbit);
  const ringPts = [];
  const ORB = 2.25;
  for (let i = 0; i <= 128; i++) { const t = (i / 128) * Math.PI * 2; ringPts.push(Math.cos(t) * ORB, 0, Math.sin(t) * ORB); }
  const ringGeo = new BufferGeometry();
  ringGeo.setAttribute('position', new Float32BufferAttribute(ringPts, 3));
  const ring = new Line(ringGeo, new LineDashedMaterial({ color: INK, dashSize: 0.09, gapSize: 0.07, transparent: true, opacity: 0.6 }));
  ring.computeLineDistances();
  orbit.add(ring);

  // ---- solids
  const defs = [
    { geo: new IcosahedronGeometry(0.52), face: BLUE, dot: CORAL },
    { geo: new DodecahedronGeometry(0.5), face: CORAL, dot: BLUE },
    { geo: new OctahedronGeometry(0.55), face: '#8FA2FF', dot: CORAL },
    { geo: new TetrahedronGeometry(0.58), face: '#FF9A9C', dot: INK },
  ];
  const solids = defs.map((d, i) => {
    const g = wireSolid(d.geo, { faceColor: d.face, edgeColor: INK, dotColor: d.dot, low });
    orbit.add(g);
    return { g, slot: i, from: i, to: i, spinAxis: new Vector3(Math.sin(i * 2.1), 1, Math.cos(i * 1.3)).normalize() };
  });

  // ---- formula sprites
  const glyphs = [['π', BLUE], ['∑', INK], ['√x', CORAL], ['x²', INK], ['∞', BLUE], ['∫', CORAL], ['Δ', INK]];
  const formulas = glyphs.map(([t, c], i) => {
    const tt = textTexture(t, { font: '"Caveat", "Segoe Print", "Comic Sans MS", cursive', weight: 700, px: 110, color: c, pad: 0.15 });
    const sp = new Sprite(new SpriteMaterial({ map: tt.texture, transparent: true, depthWrite: false, opacity: 0 }));
    sp.userData = { tt, dir: new Vector3(Math.cos(i * 0.9 + 0.3) * 2.6, 0.9 + Math.sin(i * 1.7) * 1.3, Math.sin(i * 0.9 + 0.3) * 1.2), delay: i * 0.07 };
    sp.visible = false;
    spin.add(sp);
    return sp;
  });
  whenFont('700 110px Caveat').then(() => formulas.forEach((s) => s.userData.tt.redraw()));

  // the sketch is drawn in ink for the graph-paper theme; on dark backgrounds (night wide shots) it switches to chalk
  const chalk = new ToneSwitch();
  const CHALK = '#C3CEFF';
  solids.forEach((s) => chalk.add(s.g.children[1].material, { color: CHALK }));
  ax.forEach((l) => chalk.add(l.material, { color: CHALK }));
  chalk.add(coneMat, { color: CHALK });
  chalk.add(ring.material, { color: CHALK });
  let angle = 0;
  let swapT = -1;
  const tmp = new Vector3();

  function place(s, slotF, lift) {
    const a = angle + (slotF / solids.length) * Math.PI * 2;
    s.g.position.set(Math.cos(a) * ORB, lift, Math.sin(a) * ORB);
  }

  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(axes, ring, ...solids.map((s) => s.g.children[2]));
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.9,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      chalk.apply(1 - (opts.tone ?? 1));
      angle += dt * 0.22;
      knot.rotation.set(time * 0.2, time * 0.27, 0);
      knotRim.uRimStrength.value = 0.35 + base.hover * 0.4;
      let sw = 1;
      if (swapT >= 0) { swapT += dt; sw = clamp(swapT / 1.6); if (swapT > 2.6) swapT = -1; }
      solids.forEach((s, i) => {
        const e = easeOutElastic(sw);
        const slotF = s.from + (s.to - s.from) * e;
        const lift = bump(clamp(sw * 1.4)) * (i % 2 ? 0.9 : -0.9);
        place(s, slotF, lift);
        const pulse = 1 + 0.35 * bump(clamp(sw * 1.25)) + base.hover * 0.06;
        s.g.scale.setScalar(pulse);
        s.g.rotateOnAxis(s.spinAxis, dt * (0.5 + 3 * bump(sw)));
      });
      formulas.forEach((sp) => {
        const u = sp.userData;
        if (swapT < 0) { sp.visible = false; return; }
        const t = clamp((swapT - u.delay) / 2.3);
        sp.visible = t > 0;
        const k = easeOutBack(clamp(t * 2.2), 2.2);
        tmp.copy(u.dir).multiplyScalar(0.25 + 0.75 * easeInOutCubic(clamp(t * 1.6)));
        tmp.y += t * 0.5;
        sp.position.copy(tmp);
        const sc = 0.62 * k;
        sp.scale.set(sc * u.tt.aspect, sc, 1);
        sp.material.opacity = clamp(t * 6) * (1 - clamp((t - 0.7) / 0.3));
      });
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() {
      if (swapT >= 0 && swapT < 1.2) return;
      solids.forEach((s) => { s.from = s.to; s.to = s.to + 1; });
      // keep numbers bounded
      if (solids[0].to > 400) solids.forEach((s) => { s.from -= 400; s.to -= 400; });
      swapT = 0;
    },
    busy() { return swapT >= 0; },
    dispose() {
      knotGeo.dispose(); knotMat.dispose(); coneGeo.dispose(); coneMat.dispose(); ringGeo.dispose(); ring.material.dispose();
      ax.forEach((l) => { l.geometry.dispose(); l.material.dispose(); });
      solids.forEach((s) => s.g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); if (o.isInstancedMesh) o.dispose(); }));
      defs.forEach((d) => d.geo.dispose());
      formulas.forEach((sp) => { sp.userData.tt.texture.dispose(); sp.material.dispose(); });
    },
  };
}

