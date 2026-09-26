// INFORMATICS — 6×6×6 voxel cube (rounded boxes, neon green→cyan edges, scan beam) + orbiting data bits.
// Trick: voxels explode into a cloud, assemble into a pixel-art "K", then rebuild the cube.
import {
  Group, InstancedMesh, MeshStandardMaterial, Object3D, Vector3, Color, Mesh, PlaneGeometry, MeshBasicMaterial,
  AdditiveBlending, DoubleSide,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Interactive, detail, ToneSwitch } from './_base.js';
import { patchMaterial, makeHalo, glowTexture } from '../fx/materials.js';
import { clamp, easeInOutCubic, easeOutCubic, rng } from '../fx/ease.js';

const N = 6, S = 0.36, GAP = 0.05;
const K_ART = [
  'XX....XX',
  'XX...XX.',
  'XX..XX..',
  'XX.XX...',
  'XXXX....',
  'XX.XX...',
  'XX..XX..',
  'XX...XX.',
  'XX....XX',
];

export default function createInformatics(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.8 });
  const { group, spin } = base;
  const cube = new Group();
  cube.rotation.set(0.55, 0.7, 0);
  spin.add(cube);

  const count = N * N * N;
  const geo = new RoundedBoxGeometry(S, S, S, low ? 1 : 2, 0.045);
  const mat = new MeshStandardMaterial({ color: '#0A1A14', roughness: 0.32, metalness: 0.6, envMapIntensity: 0.9 });
  const u = patchMaterial(mat, {
    uniforms: { uScan: { value: 0 }, uGlow: { value: 1 }, uTime: { value: 0 } },
    vertexPars: 'varying vec3 vBox; varying float vScan; uniform float uScan;',
    vertexMain: `vBox = position / ${(S / 2).toFixed(3)};
      #ifdef USE_INSTANCING
        vScan = exp(-pow((instanceMatrix[3].y - uScan) * 3.2, 2.0));
      #else
        vScan = 0.0;
      #endif`,
    fragPars: 'varying vec3 vBox; varying float vScan; uniform float uGlow; uniform float uTime;',
    fragMain: `{
      vec3 a = abs(vBox);
      float mx = max(a.x, max(a.y, a.z));
      float mn = min(a.x, min(a.y, a.z));
      float mid = a.x + a.y + a.z - mx - mn;
      float edge = smoothstep(0.72, 0.9, mid);
      vec3 tint = vColor.rgb;
      outgoingLight = outgoingLight * 0.9 + tint * (edge * (0.9 + 0.6 * vScan) * uGlow + vScan * 0.35);
    }`,
  });
  const mesh = new InstancedMesh(geo, mat, count);
  const c = new Color(), cg = new Color('#39FF88'), cc = new Color('#00E5FF');
  const home = [], cloud = [], kpos = [], cur = [];
  const rand = rng(99);
  const span = (N - 1) * (S + GAP);
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const i = home.length;
    home.push(new Vector3(x * (S + GAP) - span / 2, y * (S + GAP) - span / 2, z * (S + GAP) - span / 2));
    const dir = new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    cloud.push(dir.multiplyScalar(2.2 + rand() * 1.8));
    cur.push(new Vector3());
    c.copy(cg).lerp(cc, y / (N - 1) * 0.8 + rand() * 0.2);
    if (rand() > 0.9) c.set('#EAFFF3');
    mesh.setColorAt(i, c);
  }
  // K targets (front layer of voxels), leftovers form an orbit ring
  const kCells = [];
  K_ART.forEach((row, r) => [...row].forEach((ch, col) => { if (ch === 'X') kCells.push([col, r]); }));
  const depth = 3;
  const pitch = S + 0.02;
  const order = home.map((_, i) => i).sort(() => rand() - 0.5);
  order.forEach((idx, j) => {
    if (j < kCells.length * depth) {
      const [col, r] = kCells[j % kCells.length];
      const d = Math.floor(j / kCells.length);
      kpos[idx] = new Vector3((col - 3.5) * pitch, (4 - r) * pitch, (d - 1) * pitch);
    } else {
      const a = (j / (count - kCells.length * depth)) * Math.PI * 2;
      kpos[idx] = new Vector3(Math.cos(a) * 2.9, Math.sin(a * 3) * 0.2, Math.sin(a) * 2.9);
    }
  });
  const delays = home.map((p) => (p.y + span / 2) / span * 0.25 + rand() * 0.15);
  cube.add(mesh);

  // scan plane
  // scan beam: a soft radial glow disc (no hard edges; never reads as a floating dark square)
  const scanGeo = new PlaneGeometry((span + 0.9) * 1.5, (span + 0.9) * 1.5);
  scanGeo.rotateX(-Math.PI / 2);
  const scanMat = new MeshBasicMaterial({ map: glowTexture(), color: '#39FF88', transparent: true, opacity: 0.1, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, toneMapped: false });
  const scan = new Mesh(scanGeo, scanMat);
  cube.add(scan);
  const halo = makeHalo('#00E5FF', 7, 0.1, true);
  halo.position.z = -1.5;
  group.add(halo);

  // orbiting data bits
  const bitsN = low ? 18 : 36;
  const bitGeo = new RoundedBoxGeometry(0.1, 0.1, 0.1, 1, 0.02);
  const bitMat = new MeshBasicMaterial({ color: '#39FF88', toneMapped: false });
  const bits = new InstancedMesh(bitGeo, bitMat, bitsN);
  const bitData = Array.from({ length: bitsN }, (_, i) => ({ r: 2.2 + rand() * 0.9, a: rand() * 6.28, s: 0.3 + rand() * 0.5, y: (rand() - 0.5) * 2.6, tilt: rand() * 0.6 }));
  bitData.forEach((b, i) => bits.setColorAt(i, c.set(i % 3 ? '#39FF88' : '#00E5FF')));
  spin.add(bits);

  const o = new Object3D();
  function layout(p, time) {
    // p: phase object {explode, toK, back}
    for (let i = 0; i < count; i++) {
      const dl = delays[i];
      const e = easeOutCubic(clamp((p.explode - dl * 0.5) / 0.7));
      const k = easeInOutCubic(clamp((p.toK - dl) / 0.75));
      const b = easeInOutCubic(clamp((p.back - dl) / 0.8));
      const v = cur[i].copy(home[i]).lerp(cloud[i], e).lerp(kpos[i], k).lerp(home[i], b);
      o.position.copy(v);
      const spinA = (e * (1 - k) + (k * (1 - b)) * 0) * 3 + (e - b) * 1.5;
      o.rotation.set(spinA * 0.7, spinA, 0);
      o.scale.setScalar(1 - 0.35 * e * (1 - k));
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  layout({ explode: 0, toK: 0, back: 0 }, 0);

  const tk = new ToneSwitch();
  tk.add(scanMat, { color: '#0E9F55' });
  tk.add(halo.material, { color: '#00A3B8' });
  tk.add(bitMat, { color: '#7FD9A6' });
  let trickT = -1;
  let kFacing = 0;
  let lastIdleY = 0.7;
  let kY = 0;
  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(bits, scan, halo);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.5,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      tk.apply(opts.tone || 0);
      u.uTime.value = time;
      u.uScan.value = Math.sin(time * 0.9) * (span / 2 + 0.3);
      scan.position.y = u.uScan.value;
      scanMat.opacity = 0.09 + 0.05 * Math.sin(time * 3);
      u.uGlow.value = 1 + base.hover * 0.6;
      if (trickT >= 0) {
        trickT += dt;
        const t = trickT;
        // 0–0.8 explode · 0.7–1.8 assemble K · hold · 2.9–4.0 rebuild
        layout({ explode: t, toK: clamp((t - 0.7) / 1.1) * 1.4, back: clamp((t - 2.9) / 1.1) * 1.4 }, time);
        // turn the K to face the viewer, then release
        kFacing = clamp((t - 0.6) / 0.6) * (1 - clamp((t - 2.9) / 0.8));
        if (t > 4.3) { trickT = -1; layout({ explode: 0, toK: 0, back: 0 }, time); kFacing = 0; }
      }
      const idleX = 0.55 + Math.sin(time * 0.4) * 0.1, idleY = 0.7 + time * 0.3;
      cube.rotation.x = idleX * (1 - kFacing);
      lastIdleY = idleY;
      cube.rotation.y = idleY * (1 - kFacing) + kFacing * kY;
      scan.visible = kFacing < 0.1;
      bitData.forEach((b, i) => {
        const a = b.a + time * b.s;
        o.position.set(Math.cos(a) * b.r, b.y + Math.sin(a * 2) * 0.2, Math.sin(a) * b.r);
        o.rotation.set(a, a * 1.3, 0);
        o.scale.setScalar(1);
        o.updateMatrix();
        bits.setMatrixAt(i, o.matrix);
      });
      bits.instanceMatrix.needsUpdate = true;
      halo.material.opacity = (0.08 + base.hover * 0.08 + kFacing * 0.1) * tk.k;
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() {
      if (trickT >= 0 && trickT <= 3.6) return;
      trickT = 0;
      kY = Math.ceil(lastIdleY / (Math.PI * 2)) * Math.PI * 2;
    },
    busy() { return trickT >= 0; },
    dispose() {
      geo.dispose(); mat.dispose(); mesh.dispose(); scanGeo.dispose(); scanMat.dispose(); halo.material.dispose();
      bitGeo.dispose(); bitMat.dispose(); bits.dispose();
    },
  };
}
