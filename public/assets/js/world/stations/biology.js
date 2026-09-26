// BIOLOGY — DNA double helix: bead-chain backbones (lime / sun), base-pair rungs coloured by pair, drifting cells.
// Trick: a zipper front unzips the strands top→bottom, then re-zips.
import {
  Group, Mesh, InstancedMesh, SphereGeometry, CylinderGeometry, Vector3, Matrix4, Quaternion, Color,
  MeshPhysicalMaterial,
} from 'three';
import { Interactive, detail, ToneSwitch } from './_base.js';
import { addRim, makeHalo } from '../fx/materials.js';
import { clamp, smoothstep, rng } from '../fx/ease.js';

const PAIRS = { A: '#FF7A59', T: '#FFD166', G: '#5FD4FF', C: '#B6F36A' };
// light backgrounds (paper wide shots): saturated, darker strands and bases so the helix does not wash out on cream
const PAIRS_LIGHT = { A: '#E0482A', T: '#D98A00', G: '#1B8FCF', C: '#3E8E1E' };
const STRAND = ['#B6F36A', '#FFD166'], STRAND_LIGHT = ['#3E8E1E', '#D98A00'];
const MATE = { A: 'T', T: 'A', G: 'C', C: 'G' };
const Y = new Vector3(0, 1, 0);

export default function createBiology(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.6 });
  const { group, spin } = base;
  const helix = new Group();
  helix.rotation.z = -0.42;
  spin.add(helix);

  const BASES = low ? 20 : 26;
  const RISE = 0.29, TWIST = (Math.PI * 2) / 10.5, RAD = 0.95, GROOVE = 2.35; // radians offset between strands
  const H = (BASES - 1) * RISE;
  const SUB = 4; // beads per base step
  const beadsPer = (BASES - 1) * SUB + 1;
  const rand = rng(44);
  const seq = Array.from({ length: BASES }, () => 'ATGC'[Math.floor(rand() * 4)]);

  const bGeo = new SphereGeometry(1, low ? 12 : 18, low ? 10 : 14);
  const bMat = new MeshPhysicalMaterial({ roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.15 });
  const bRim = addRim(bMat, { color: '#E8FFD0', power: 2.4, strength: 0.4 });
  const beads = new InstancedMesh(bGeo, bMat, beadsPer * 2);
  const c = new Color();
  helix.add(beads);

  const rGeo = new CylinderGeometry(1, 1, 1, low ? 8 : 12, 1, false);
  const rMat = new MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.5, envMapIntensity: 1 });
  const rungs = new InstancedMesh(rGeo, rMat, BASES * 2);
  function paint(light) {
    const st = light ? STRAND_LIGHT : STRAND, pr = light ? PAIRS_LIGHT : PAIRS;
    for (let s = 0; s < 2; s++) for (let i = 0; i < beadsPer; i++) beads.setColorAt(s * beadsPer + i, c.set(st[s]));
    seq.forEach((b, i) => { rungs.setColorAt(i * 2, c.set(pr[b])); rungs.setColorAt(i * 2 + 1, c.set(pr[MATE[b]])); });
    beads.instanceColor.needsUpdate = true;
    rungs.instanceColor.needsUpdate = true;
    bRim.uRimColor.value.set(light ? '#1E5A10' : '#E8FFD0');
  }
  paint(false);
  helix.add(rungs);

  // drifting cells (glassy bubbles)
  const cellGeo = new SphereGeometry(1, 24, 18);
  const cellMat = new MeshPhysicalMaterial({ color: '#B6F36A', transparent: true, opacity: 0.12, roughness: 0.1, clearcoat: 1, depthWrite: false, envMapIntensity: 0.8 });
  addRim(cellMat, { color: '#D9FF9E', power: 2.2, strength: 0.9 });
  const cells = [];
  [[-2.4, 1.4, -1.2, 0.55], [2.3, -1.2, -0.8, 0.42], [2.0, 2.2, -2.0, 0.34], [-1.9, -2.3, -1.5, 0.3], [0.2, 2.9, -2.5, 0.25]].forEach(([x, y, z, r], i) => {
    const m = new Mesh(cellGeo, cellMat);
    m.position.set(x, y, z); m.scale.setScalar(r); m.userData.base = m.position.clone(); m.renderOrder = 3;
    spin.add(m); cells.push(m);
  });
  const halo = makeHalo('#B6F36A', 7, 0.12, true);
  halo.position.z = -1.5;
  group.add(halo);

  const m4 = new Matrix4(), q = new Quaternion(), sc = new Vector3(), p = new Vector3(), a = new Vector3(), b = new Vector3(), d = new Vector3();
  const open = new Float32Array(BASES);

  function openAt(t) {
    const bi = clamp(Math.floor(t), 0, BASES - 1);
    const fr = clamp(t - bi);
    const a = open[bi], b = open[Math.min(BASES - 1, bi + 1)];
    return a + (b - a) * fr * fr * (3 - 2 * fr);
  }
  function strandPoint(strand, t, out) {
    // t in base units (0..BASES-1); an open stretch swings each strand outwards as one continuous curve
    const ang = t * TWIST + (strand ? GROOVE : 0);
    const o = openAt(t);
    const r = RAD + o * 0.7;
    const extra = o * (strand ? 0.42 : -0.42);
    return out.set(Math.cos(ang + extra) * r, t * RISE - H / 2, Math.sin(ang + extra) * r);
  }

  function layout() {
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < beadsPer; i++) {
        const t = i / SUB;
        strandPoint(s, t, p);
        const big = i % SUB === 0;
        const r = big ? 0.16 : 0.105;
        m4.compose(p, q.identity(), sc.set(r, r, r));
        beads.setMatrixAt(s * beadsPer + i, m4);
      }
    }
    for (let i = 0; i < BASES; i++) {
      strandPoint(0, i, a); strandPoint(1, i, b);
      const o = open[i];
      // each half goes from its backbone towards the (closed) midpoint, shrinking a little when open
      for (let h = 0; h < 2; h++) {
        const from = h ? b : a;
        const to = h ? a : b;
        d.subVectors(to, from);
        const full = d.length();
        d.normalize();
        // an unpaired base stays on its strand as a short stub that points back at its (departed) partner
        const len = Math.min(full * 0.5 - 0.03, (RAD * 2 * Math.sin(GROOVE / 2)) * 0.5 - 0.03) * (1 - o * 0.55);
        p.copy(from).addScaledVector(d, len * 0.5 + 0.05);
        q.setFromUnitVectors(Y, d);
        m4.compose(p, q, sc.set(0.07, len, 0.07));
        rungs.setMatrixAt(i * 2 + h, m4);
      }
    }
    beads.instanceMatrix.needsUpdate = true;
    rungs.instanceMatrix.needsUpdate = true;
  }
  layout();

  let trickT = -1;
  const tk = new ToneSwitch();
  tk.add(halo.material, { color: '#3E8E1E' });
  tk.add(null, { onChange: paint });
  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(...cells, halo);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.9,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      tk.apply(opts.tone || 0);
      helix.rotation.y = time * 0.35;
      bRim.uRimStrength.value = 0.4 + base.hover * 0.5;
      if (trickT >= 0) {
        trickT += dt;
        // zipper wave: an open "bubble" travels top → bottom — pairs part as the front passes and re-zip behind it
        const front = -2 + (trickT / 2.6) * (BASES + 14);
        for (let i = 0; i < BASES; i++) {
          const k = BASES - 1 - i; // distance from the top
          const behind = front - k;
          open[i] = smoothstep(0, 3.5, behind) * (1 - smoothstep(7, 11, behind));
        }
        layout();
        if (trickT > 2.7) { trickT = -1; open.fill(0); layout(); }
      }
      cells.forEach((cm, i) => {
        cm.position.y = cm.userData.base.y + Math.sin(time * 0.5 + i * 1.3) * 0.2;
        cm.position.x = cm.userData.base.x + Math.cos(time * 0.4 + i) * 0.12;
      });
      halo.material.opacity = (0.1 + base.hover * 0.08) * tk.k;
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { if (trickT < 0 || trickT > 2.2) trickT = 0; },
    busy() { return trickT >= 0; },
    dispose() {
      bGeo.dispose(); bMat.dispose(); beads.dispose(); rGeo.dispose(); rMat.dispose(); rungs.dispose();
      cellGeo.dispose(); cellMat.dispose(); halo.material.dispose();
    },
  };
}
