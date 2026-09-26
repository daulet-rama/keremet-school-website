// PHYSICS — Atom: glossy nucleus cluster + 3 tilted orbits with glowing electrons and comet trails.
// Pointer proximity attracts electrons. Trick: electrons jump to higher orbits (quantum leap) then relax.
import {
  Group, Mesh, InstancedMesh, SphereGeometry, TubeGeometry, Curve, Vector3, Matrix4, Color, MeshPhysicalMaterial,
  MeshBasicMaterial, AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Quaternion,
  Euler, Ray,
} from 'three';
import { Interactive, pxOf, detail, ToneSwitch } from './_base.js';
import { addRim, makeHalo, dotTexture } from '../fx/materials.js';
import { clamp, easeOutElastic, rng } from '../fx/ease.js';

const ORBIT_R = 2.05;
const TRAIL = 40;
// orbit planes are near edge-on to the view axis (Z) → classic 3-petal atom icon (ellipse ratio ≈ 0.3)
const ORBIT_TILT = 0.3;

class CircleCurve extends Curve {
  constructor(r) { super(); this.r = r; }
  getPoint(t, out = new Vector3()) { const a = t * Math.PI * 2; return out.set(Math.cos(a) * this.r, 0, Math.sin(a) * this.r); }
}

export default function createPhysics(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.8 });
  const { group, spin } = base;
  const atom = new Group();
  atom.rotation.set(0.25, 0, 0.12);
  spin.add(atom);

  // ---- nucleus: packed protons (warm) + neutrons (cool)
  const rand = rng(21);
  const nucleons = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    nucleons.push(new Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(0.3 + rand() * 0.06));
  }
  nucleons.push(new Vector3(0, 0, 0));
  const nGeo = new SphereGeometry(0.19, low ? 16 : 28, low ? 12 : 20);
  const nMat = new MeshPhysicalMaterial({ roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 });
  const nRim = addRim(nMat, { color: '#BDEBFF', power: 2.2, strength: 0.5 });
  const nucleus = new InstancedMesh(nGeo, nMat, nucleons.length);
  const m = new Matrix4(), c = new Color();
  nucleons.forEach((p, i) => {
    m.makeTranslation(p.x, p.y, p.z);
    nucleus.setMatrixAt(i, m);
    nucleus.setColorAt(i, c.set(i % 2 ? '#FF7A2E' : '#2EC5FF'));
  });
  atom.add(nucleus);
  const coreGlow = makeHalo('#5CD2FF', 3.6, 0.55, true);
  const warmGlow = makeHalo('#FFB627', 1.8, 0.45, true);
  atom.add(coreGlow, warmGlow);

  // ---- orbits: circles in tilted planes → classic atom silhouette
  const orbits = [];
  const orbitGeo = new TubeGeometry(new CircleCurve(ORBIT_R), low ? 96 : 160, 0.022, 6, true);
  const orbitMat = new MeshBasicMaterial({ color: '#7FDBFF', transparent: true, opacity: 0.8, blending: AdditiveBlending, depthWrite: false, toneMapped: false });
  for (let i = 0; i < 3; i++) {
    const pivot = new Group();
    pivot.rotation.set(0, 0, (i * Math.PI) / 3);
    const plane = new Group();
    plane.rotation.set(ORBIT_TILT, 0, 0);
    pivot.add(plane);
    const ring = new Mesh(orbitGeo, orbitMat);
    plane.add(ring);
    atom.add(pivot);
    orbits.push({ pivot, plane, ring, phase: i * 2.1, speed: 1.25 + i * 0.28, scale: 1 });
  }

  // ---- electrons + halos
  const eGeo = new SphereGeometry(0.1, 16, 12);
  const eMat = new MeshBasicMaterial({ color: '#E9FBFF', toneMapped: false });
  const electrons = orbits.map((o, i) => {
    const mesh = new Mesh(eGeo, eMat);
    const halo = makeHalo(i === 1 ? '#FFD27A' : '#5CD2FF', 0.95, 0.9, true);
    atom.add(mesh, halo);
    return { mesh, halo, pos: new Vector3(), pull: new Vector3() };
  });

  // ---- trails (points, CPU-updated, 3 × TRAIL)
  const tPos = new Float32Array(3 * TRAIL * 3), tA = new Float32Array(3 * TRAIL), tC = new Float32Array(3 * TRAIL * 3);
  for (let e = 0; e < 3; e++) {
    c.set(e === 1 ? '#FFC65A' : '#6FDCFF');
    for (let k = 0; k < TRAIL; k++) { tA[e * TRAIL + k] = 1 - k / TRAIL; tC.set([c.r, c.g, c.b], (e * TRAIL + k) * 3); }
  }
  const tg = new BufferGeometry();
  tg.setAttribute('position', new Float32BufferAttribute(tPos, 3));
  tg.setAttribute('aA', new Float32BufferAttribute(tA, 1));
  tg.setAttribute('aC', new Float32BufferAttribute(tC, 3));
  const tMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uPx: { value: 1 }, uW: { value: ctx.isMobile ? 1.4 : 1 }, uMap: { value: dotTexture() }, uLight: { value: 0 } },
    vertexShader: `attribute float aA; attribute vec3 aC; uniform float uPx; uniform float uW; varying float vA; varying vec3 vC;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv; vA = aA; vC = aC;
      gl_PointSize = uPx * uW * (1.6 + aA * 6.5) * (20.0 / max(0.5, -mv.z)); }`,
    fragmentShader: `uniform sampler2D uMap; uniform float uLight; varying float vA; varying vec3 vC;
      void main(){ float a = texture2D(uMap, gl_PointCoord).a * pow(vA, 1.4) * mix(1.0, 0.75, uLight); if (a < 0.01) discard;
        vec3 c = mix(mix(vC, vec3(1.0), vA * vA * 0.5), vC * 0.55, uLight); gl_FragColor = vec4(c, a); }`,
  });
  const trails = new Points(tg, tMat);
  trails.frustumCulled = false;
  atom.add(trails);

  // ---- state
  let trickT = -1;
  const localRay = new Ray();
  let hasPointer = false;
  const inv = new Matrix4();
  const tmp = new Vector3(), tmp2 = new Vector3();
  const q = new Quaternion(), eul = new Euler();

  function orbitPoint(o, angle, scale, out) {
    out.set(Math.cos(angle) * ORBIT_R * scale, 0, Math.sin(angle) * ORBIT_R * scale);
    // plane then pivot rotation
    eul.set(ORBIT_TILT, 0, 0); q.setFromEuler(eul); out.applyQuaternion(q);
    eul.set(0, 0, o.pivot.rotation.z); q.setFromEuler(eul); out.applyQuaternion(q);
    return out;
  }

  // light backgrounds: deep-blue ink orbits, normal-blended glows and trails (additive light vanishes on paper)
  const tk = new ToneSwitch();
  tk.add(orbitMat, { color: '#1B6FA8', opacity: 1.1 });
  tk.add(coreGlow.material, { color: '#1B6FA8' });
  tk.add(warmGlow.material, { color: '#D98A00', opacity: 0.6 });
  electrons.forEach((e, i) => tk.add(e.halo.material, { color: i === 1 ? '#D98A00' : '#1B6FA8', opacity: 0.5 }));
  tk.add(eMat, { color: '#0B4F86' });
  tk.add(tMat, { onChange: (l) => { tMat.uniforms.uLight.value = l ? 1 : 0; } });

  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(warmGlow, ...electrons.map((e) => e.halo));
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.6,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      const light = tk.apply(opts.tone || 0);
      // spin around the orbits' 3-fold symmetry axis (atom Z) so the three-petal silhouette always faces the camera
      atom.rotation.set(0.25 + Math.sin(time * 0.23) * 0.12, Math.sin(time * 0.17) * 0.28, 0.12 + time * 0.22);
      let jump = 0; // 0..1 orbit expansion
      if (trickT >= 0) {
        trickT += dt;
        const up = clamp(trickT / 0.35);
        const relax = clamp((trickT - 0.9) / 1.6);
        jump = up * (1 - easeOutElastic(relax));
        if (trickT > 2.6) trickT = -1;
      }
      const speedBoost = 1 + jump * 2.2;
      nRim.uRimStrength.value = 0.5 + base.hover * 0.5 + jump * 0.8;
      coreGlow.material.opacity = (0.45 + 0.1 * Math.sin(time * 2.1) + jump * 0.5 + base.hover * 0.2) * (light ? 0.35 : 1);
      coreGlow.scale.setScalar(3.6 + jump * 1.6);
      nucleus.rotation.y = time * 0.5;
      nucleus.rotation.x = time * 0.23;
      const px = pxOf(ctx);
      tMat.uniforms.uPx.value = px;

      orbits.forEach((o, i) => {
        o.phase += dt * o.speed * speedBoost;
        const scale = 1 + jump * (0.35 + i * 0.12);
        o.ring.scale.setScalar(scale);
        const e = electrons[i];
        orbitPoint(o, o.phase, scale, e.pos);
        // pointer attraction (in atom space)
        if (hasPointer) {
          localRay.closestPointToPoint(e.pos, tmp);
          const d = tmp.distanceTo(e.pos);
          const k = clamp(1 - d / 1.6) * 0.55;
          tmp2.subVectors(tmp, e.pos).multiplyScalar(k);
          e.pull.lerp(tmp2, clamp(dt * 6));
        } else e.pull.multiplyScalar(Math.max(0, 1 - dt * 4));
        e.mesh.position.copy(e.pos).add(e.pull);
        e.halo.position.copy(e.mesh.position);
        e.halo.scale.setScalar(0.95 + jump * 0.8 + Math.sin(time * 6 + i) * 0.06);
        // trail behind
        for (let k = 0; k < TRAIL; k++) {
          orbitPoint(o, o.phase - k * 0.062 * (1 + jump * 0.5), scale, tmp);
          const fall = 1 - k / TRAIL;
          tmp.addScaledVector(e.pull, fall);
          tPos[(i * TRAIL + k) * 3] = tmp.x; tPos[(i * TRAIL + k) * 3 + 1] = tmp.y; tPos[(i * TRAIL + k) * 3 + 2] = tmp.z;
        }
      });
      tg.attributes.position.needsUpdate = true;
    },
    pointer(ray) {
      if (!ray) { hasPointer = false; return; }
      atom.updateWorldMatrix(true, false);
      inv.copy(atom.matrixWorld).invert();
      localRay.copy(ray).applyMatrix4(inv);
      hasPointer = true;
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { trickT = 0; },
    busy() { return trickT >= 0; },
    dispose() {
      nGeo.dispose(); nMat.dispose(); nucleus.dispose(); orbitGeo.dispose(); orbitMat.dispose(); eGeo.dispose(); eMat.dispose();
      tg.dispose(); tMat.dispose();
      [coreGlow, warmGlow, ...electrons.map((e) => e.halo)].forEach((s) => s.material.dispose());
    },
  };
}
