// CHEMISTRY — ball-and-stick caffeine (C8H10N4O2): glossy CPK-ish atoms tuned to mint/pink, cylinder bonds.
// Trick: the molecule vibrates (normal-mode wobble), bonds pulse with light, and it flips over.
import {
  Group, Mesh, InstancedMesh, SphereGeometry, CylinderGeometry, TorusGeometry, Vector3, Matrix4, Quaternion, Color,
  MeshPhysicalMaterial, MeshBasicMaterial, AdditiveBlending, Euler,
} from 'three';
import { Interactive, detail, ToneSwitch } from './_base.js';
import { addRim, patchMaterial, makeHalo } from '../fx/materials.js';
import { clamp, easeInOutCubic, rng, smoothstep } from '../fx/ease.js';

const EL = {
  C: { color: '#8FA3A8', r: 0.3 },
  N: { color: '#3E9BFF', r: 0.3 },
  O: { color: '#FF6FB5', r: 0.32 },
  H: { color: '#F3FFFB', r: 0.18 },
};
const Y = new Vector3(0, 1, 0);

function caffeine() {
  const atoms = [], bonds = [];
  const add = (el, x, y, z = 0) => { atoms.push({ el, p: new Vector3(x, y, z) }); return atoms.length - 1; };
  const bond = (a, b, order = 1) => bonds.push({ a, b, order });
  const s = 1.0; // ring bond length
  const hex = (deg) => new Vector3(Math.cos((deg * Math.PI) / 180) * s, Math.sin((deg * Math.PI) / 180) * s, 0);
  // six-ring: N1(150°) C2(-150°) N3(-90°) C4(-30°) C5(30°) C6(90°)
  const P = { N1: hex(150), C2: hex(-150), N3: hex(-90), C4: hex(-30), C5: hex(30), C6: hex(90) };
  const iN1 = add('N', P.N1.x, P.N1.y), iC2 = add('C', P.C2.x, P.C2.y), iN3 = add('N', P.N3.x, P.N3.y);
  const iC4 = add('C', P.C4.x, P.C4.y), iC5 = add('C', P.C5.x, P.C5.y), iC6 = add('C', P.C6.x, P.C6.y);
  // five-ring fused on C4–C5
  const M = new Vector3(Math.cos(Math.PI / 6) * s, 0, 0);
  const apo = s / (2 * Math.tan(Math.PI / 5)), R5 = s / (2 * Math.sin(Math.PI / 5));
  const Pc = M.clone().add(new Vector3(apo, 0, 0));
  const pent = (deg) => Pc.clone().add(new Vector3(Math.cos((deg * Math.PI) / 180) * R5, Math.sin((deg * Math.PI) / 180) * R5, 0));
  const N7 = pent(72), C8 = pent(0), N9 = pent(-72);
  const iN7 = add('N', N7.x, N7.y), iC8 = add('C', C8.x, C8.y), iN9 = add('N', N9.x, N9.y);
  bond(iN1, iC2); bond(iC2, iN3); bond(iN3, iC4); bond(iC4, iC5, 2); bond(iC5, iC6); bond(iC6, iN1);
  bond(iC5, iN7); bond(iN7, iC8); bond(iC8, iN9, 2); bond(iN9, iC4);
  const out = (from, center, len) => from.clone().sub(center).setZ(0).normalize().multiplyScalar(len).add(from);
  const O6 = out(P.C6, new Vector3(), 1.02), O2 = out(P.C2, new Vector3(), 1.02);
  bond(iC6, add('O', O6.x, O6.y), 2);
  bond(iC2, add('O', O2.x, O2.y), 2);
  const H8 = out(C8, Pc, 0.78);
  bond(iC8, add('H', H8.x, H8.y));
  const methyl = (iN, from, center) => {
    const d = from.clone().sub(center).setZ(0).normalize();
    const cp = d.clone().multiplyScalar(1.08).add(from);
    const ic = add('C', cp.x, cp.y);
    bond(iN, ic);
    const perp1 = new Vector3(-d.y, d.x, 0), perp2 = new Vector3(0, 0, 1);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.4;
      const dir = d.clone().multiplyScalar(0.34).addScaledVector(perp1, Math.cos(a) * 0.94).addScaledVector(perp2, Math.sin(a) * 0.94).normalize();
      const hp = cp.clone().addScaledVector(dir, 0.72);
      bond(ic, add('H', hp.x, hp.y, hp.z));
    }
  };
  methyl(iN1, P.N1, new Vector3()); methyl(iN3, P.N3, new Vector3()); methyl(iN7, N7, Pc);
  // centre the molecule
  const cen = new Vector3();
  atoms.forEach((a) => cen.add(a.p));
  cen.multiplyScalar(1 / atoms.length);
  atoms.forEach((a) => a.p.sub(cen));
  return { atoms, bonds };
}

export default function createChemistry(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.9 });
  const { group, spin } = base;
  const mol = new Group();
  mol.scale.setScalar(0.92);
  spin.add(mol);
  const { atoms, bonds } = caffeine();
  const rand = rng(33);
  const modes = atoms.map(() => ({ dir: new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(), f: 9 + rand() * 9, ph: rand() * 6.28 }));

  // atoms
  const aGeo = new SphereGeometry(1, low ? 20 : 32, low ? 14 : 24);
  const aMat = new MeshPhysicalMaterial({ roughness: 0.18, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25 });
  const aRim = addRim(aMat, { color: '#21D19F', power: 2.2, strength: 0.75 });
  const aMesh = new InstancedMesh(aGeo, aMat, atoms.length);
  const c = new Color();
  atoms.forEach((a, i) => aMesh.setColorAt(i, c.set(EL[a.el].color)));
  mol.add(aMesh);

  // bonds (double bonds → two thinner parallel sticks)
  const sticks = [];
  bonds.forEach((b, bi) => {
    if (b.order === 2) { sticks.push({ b, off: 0.09, r: 0.055, bi }); sticks.push({ b, off: -0.09, r: 0.055, bi }); }
    else sticks.push({ b, off: 0, r: 0.08, bi });
  });
  const bGeo = new CylinderGeometry(1, 1, 1, low ? 8 : 14, 1, true);
  const bMat = new MeshPhysicalMaterial({ color: '#CFEFE6', roughness: 0.3, metalness: 0.1, clearcoat: 0.6, envMapIntensity: 1 });
  const bU = patchMaterial(bMat, {
    uniforms: { uPulse: { value: 0 }, uPulseAmp: { value: 0 } },
    vertexPars: 'varying float vBondPhase;',
    vertexMain: '#ifdef USE_INSTANCING\n vBondPhase = instanceMatrix[3].x * 0.6 + instanceMatrix[3].y * 0.4;\n#else\n vBondPhase = 0.0;\n#endif',
    fragPars: 'varying float vBondPhase; uniform float uPulse; uniform float uPulseAmp;',
    fragMain: 'outgoingLight += vec3(0.13, 0.82, 0.62) * uPulseAmp * (0.4 + 0.6 * pow(0.5 + 0.5 * sin(vBondPhase * 3.0 - uPulse * 9.0), 3.0)) * 2.0;',
  });
  const bMesh = new InstancedMesh(bGeo, bMat, sticks.length);
  mol.add(bMesh);

  // decor: floating benzene hexagons + halo
  const hexGeo = new TorusGeometry(0.6, 0.022, 6, 6);
  const hexMatA = new MeshBasicMaterial({ color: '#21D19F', transparent: true, opacity: 0.55, toneMapped: false, blending: AdditiveBlending, depthWrite: false });
  const hexMatB = new MeshBasicMaterial({ color: '#FF6FB5', transparent: true, opacity: 0.45, toneMapped: false, blending: AdditiveBlending, depthWrite: false });
  const hexes = [];
  // keep the decorative hexagons outside the molecule's bounding circle (+10 %) so none reads as a stray part of it
  let molR = 0;
  atoms.forEach((a) => { molR = Math.max(molR, Math.hypot(a.p.x, a.p.y) + EL[a.el].r); });
  molR *= mol.scale.x;
  [[-2.5, 1.6, -1, 0.9, hexMatA], [2.6, -1.5, -0.6, 0.7, hexMatB], [2.1, 2.0, -1.8, 0.5, hexMatA], [-2.2, -1.9, -1.4, 0.55, hexMatB]].forEach(([x, y, z, s, mat], i) => {
    const h = new Mesh(hexGeo, mat);
    const hr = 0.62 * s, d = Math.hypot(x, y), need = molR * 1.1 + hr + 0.25;
    if (d < need) { x *= need / d; y *= need / d; }
    h.position.set(x, y, z); h.scale.setScalar(s); h.rotation.set(0, 0, i * 0.4); // always face the camera
    h.userData.base = h.position.clone();
    group.add(h); hexes.push(h); // not under `spin`: a drag never turns them edge-on
  });
  const halo = makeHalo('#21D19F', 7.5, 0.16, true);
  halo.position.z = -1.2;
  group.add(halo);

  const m = new Matrix4(), q = new Quaternion(), sc = new Vector3(), mid = new Vector3(), dir = new Vector3(), side = new Vector3();
  const pos = atoms.map((a) => a.p.clone());
  const Z = new Vector3(0, 0, 1);

  function layout(amp, time) {
    atoms.forEach((a, i) => {
      const md = modes[i];
      pos[i].copy(a.p);
      if (amp > 0) pos[i].addScaledVector(md.dir, Math.sin(time * md.f + md.ph) * amp * (a.el === 'H' ? 1.6 : 1));
      const r = EL[a.el].r;
      m.compose(pos[i], q.identity(), sc.set(r, r, r));
      aMesh.setMatrixAt(i, m);
    });
    sticks.forEach((s, i) => {
      const A = pos[s.b.a], B = pos[s.b.b];
      dir.subVectors(B, A);
      const len = dir.length();
      dir.normalize();
      side.crossVectors(dir, Z);
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
      side.normalize();
      mid.addVectors(A, B).multiplyScalar(0.5).addScaledVector(side, s.off);
      q.setFromUnitVectors(Y, dir);
      m.compose(mid, q, sc.set(s.r, len, s.r));
      bMesh.setMatrixAt(i, m);
    });
    aMesh.instanceMatrix.needsUpdate = true;
    bMesh.instanceMatrix.needsUpdate = true;
  }
  layout(0, 0);

  let trickT = -1, flipFrom = 0, flip = 0;
  // wide shots: the molecule turns its plane towards the (far) camera instead of showing a stick of beads edge-on
  const qRock = new Quaternion(), qFace = new Quaternion(), qTmp = new Quaternion(), eul = new Euler(), camL = new Vector3();
  const lookM = new Matrix4(), ORIGIN = new Vector3(), UP = new Vector3(0, 1, 0);
  const tk = new ToneSwitch();
  tk.add(hexMatA, { color: '#139E78', opacity: 1.1 });
  tk.add(hexMatB, { color: '#E0559A', opacity: 1.1 });
  tk.add(halo.material, { color: '#21D19F' });
  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(...hexes, halo);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.7,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      const light = tk.apply(opts.tone || 0);
      let amp = 0;
      if (trickT >= 0) {
        trickT += dt;
        const p = clamp(trickT / 2.4);
        amp = Math.sin(Math.min(1, trickT / 0.25) * Math.PI * 0.5) * (1 - p) * 0.16;
        bU.uPulse.value = trickT;
        bU.uPulseAmp.value = (1 - p) * 1.0;
        flip = flipFrom + easeInOutCubic(clamp((trickT - 0.2) / 1.6)) * Math.PI * 2;
        if (trickT > 2.4) { trickT = -1; bU.uPulseAmp.value = 0; layout(0, time); }
      }
      if (amp > 0) layout(amp, time);
      else if (base.hover > 0.01 || focusAmount > 0) {
        // idle breathing: subtle thermal jiggle only when close (cheap: 24 atoms)
        if (focusAmount > 0.5 && dt > 0) layout(0.012 + base.hover * 0.02, time * 0.5);
      }
      // rock (never edge-on) instead of spinning; the trick flip always ends face-on (whole turns)
      mol.rotation.set(Math.sin(time * 0.3) * 0.22, Math.sin(time * 0.25) * 0.5 + flip, Math.sin(time * 0.21) * 0.1);
      const wf = smoothstep(0.3, 0.8, opts.wide || 0);
      if (wf > 0 && ctx.camera) {
        qRock.copy(mol.quaternion);
        spin.updateWorldMatrix(true, false);
        camL.copy(ctx.camera.position);
        spin.worldToLocal(camL);
        // +Z (the molecule's plane normal) towards the camera, with a gentle residual rock
        qFace.setFromRotationMatrix(lookM.lookAt(camL, ORIGIN, UP));
        qTmp.setFromEuler(eul.set(Math.sin(time * 0.3) * 0.12, Math.sin(time * 0.25) * 0.18, Math.sin(time * 0.21) * 0.06));
        qFace.multiply(qTmp);
        mol.quaternion.slerpQuaternions(qRock, qFace, wf);
      }
      aRim.uRimStrength.value = 0.75 + base.hover * 0.5;
      hexes.forEach((h, i) => {
        h.rotation.z += dt * (0.2 + i * 0.05);
        h.position.y = h.userData.base.y + Math.sin(time * 0.6 + i) * 0.15;
      });
      halo.material.opacity = (0.14 + base.hover * 0.1 + (trickT >= 0 ? 0.12 : 0)) * (light ? 0.6 : 1);
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { if (trickT < 0) { flipFrom = Math.round(flip / (Math.PI * 2)) * Math.PI * 2; trickT = 0; } },
    busy() { return trickT >= 0; },
    dispose() {
      aGeo.dispose(); aMat.dispose(); aMesh.dispose(); bGeo.dispose(); bMat.dispose(); bMesh.dispose();
      hexGeo.dispose(); hexMatA.dispose(); hexMatB.dispose(); halo.material.dispose();
    },
  };
}
