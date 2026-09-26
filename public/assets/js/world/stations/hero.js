// HERO — golden Shanyrak (yurt crown): rim ring + 2×3 crossed күлдіреуіш arcs + уық poles, dust, sky glow.
// Trick: a light wave runs from the apex along the arcs to the poles + ornament burst.
import {
  Group, Mesh, InstancedMesh, TorusGeometry, TubeGeometry, SphereGeometry, CylinderGeometry, CatmullRomCurve3,
  Vector3, Object3D, MeshPhysicalMaterial, BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial,
  AdditiveBlending, Color,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Interactive, createBurst, spriteTexture, pxOf, detail, ToneSwitch } from './_base.js';
import { addRim, patchMaterial, makeHalo, dotTexture } from '../fx/materials.js';
import { clamp, rng, easeOutCubic, smoothstep, lerp } from '../fx/ease.js';

const R = 2.0;

function arcCurve(offset, h, rotY) {
  const L = Math.sqrt(R * R - offset * offset);
  const hh = h * (0.55 + 0.45 * (L / R));
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const s = -1 + (2 * i) / 16;
    const y = hh * Math.pow(Math.max(0, 1 - s * s), 0.75);
    const p = new Vector3(s * L * 0.985, y + 0.02, offset);
    p.applyAxisAngle(new Vector3(0, 1, 0), rotY);
    pts.push(p);
  }
  return new CatmullRomCurve3(pts);
}

function ornamentTexture() {
  // қошқар мүйіз (ram-horn) curl — two mirrored spirals
  return spriteTexture(96, (g, s) => {
    g.translate(s / 2, s / 2);
    g.strokeStyle = '#fff';
    g.lineWidth = s * 0.075;
    g.lineCap = 'round';
    const horn = (dir) => {
      g.beginPath();
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const a = t * Math.PI * 2.1;
        const r = s * 0.32 * (1 - t * 0.78);
        const x = dir * (s * 0.05 + r * Math.sin(a));
        const y = -s * 0.02 + r * -Math.cos(a) * 0.9 + s * 0.12;
        if (i === 0) g.moveTo(dir * s * 0.02, s * 0.36); else g.lineTo(x, y);
      }
      g.stroke();
    };
    horn(1); horn(-1);
    g.beginPath(); g.moveTo(0, s * 0.42); g.lineTo(0, s * 0.1); g.stroke();
  });
}

export default function createHero(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.6 });
  const { group, spin } = base;
  const tube = low ? 6 : 10;

  // tilt the crown towards the viewer so the lattice reads from below-front
  // per-station tilt: hero shows the crown from above-front (the brand mark: circle + crossed arcs),
  // about looks up through it, finale sees it slightly from below against the sky
  const TILT_HERO = 0.95, TILT_ABOUT = 0.32, TILT_FINALE = -0.12;
  const crown = new Group();
  crown.rotation.x = TILT_HERO;
  spin.add(crown);

  // ---- gold parts, merged into one mesh
  const parts = [];
  const ring = new TorusGeometry(R, 0.13, low ? 10 : 16, low ? 72 : 128);
  ring.rotateX(Math.PI / 2);
  parts.push(ring);
  const ring2 = new TorusGeometry(R - 0.2, 0.045, 8, low ? 64 : 110);
  ring2.rotateX(Math.PI / 2); ring2.translate(0, -0.1, 0);
  parts.push(ring2);
  const ring3 = new TorusGeometry(R + 0.16, 0.035, 8, low ? 64 : 110);
  ring3.rotateX(Math.PI / 2); ring3.translate(0, -0.06, 0);
  parts.push(ring3);
  const offsets = [-0.95, 0, 0.95];
  const H = 1.25;
  for (const rot of [0, Math.PI / 2]) {
    for (const o of offsets) {
      parts.push(new TubeGeometry(arcCurve(o, H, rot), low ? 48 : 80, 0.07, tube, false));
    }
  }
  // beads where the arcs meet the ring + crossings
  const bead = new SphereGeometry(0.11, 12, 10);
  const beadPts = [];
  for (const rot of [0, Math.PI / 2]) {
    for (const o of offsets) {
      const L = Math.sqrt(R * R - o * o);
      for (const sgn of [-1, 1]) beadPts.push(new Vector3(sgn * L, 0.02, o).applyAxisAngle(new Vector3(0, 1, 0), rot));
    }
  }
  for (const a of offsets) for (const b of offsets) {
    const L = Math.sqrt(R * R - a * a);
    const hh = H * (0.55 + 0.45 * (L / R));
    const s = b / L;
    beadPts.push(new Vector3(b, hh * Math.pow(Math.max(0, 1 - s * s), 0.75) + 0.02, a));
  }
  beadPts.forEach((p) => { const g = bead.clone(); g.translate(p.x, p.y, p.z); parts.push(g); });
  const goldGeo = mergeGeometries(parts.map((g) => { g.deleteAttribute('uv'); return g; }));
  parts.forEach((g) => g.dispose()); bead.dispose();

  const gold = new MeshPhysicalMaterial({
    color: '#E9A23B', metalness: 1, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 1.0,
  });
  const rim = addRim(gold, { color: '#FFD27A', power: 2.2, strength: 0.55 });
  const wave = patchMaterial(gold, {
    uniforms: { uWave: { value: -1 }, uWaveAmp: { value: 0 }, uGlow: { value: 0.08 } },
    vertexPars: 'varying vec3 vLocal;',
    vertexMain: 'vLocal = position;',
    fragPars: 'varying vec3 vLocal; uniform float uWave; uniform float uWaveAmp; uniform float uGlow;',
    fragMain: `{
      float r = length(vLocal.xz) / ${R.toFixed(1)} - vLocal.y * 0.35;
      float w = exp(-pow((r - uWave) * 5.0, 2.0)) * uWaveAmp;
      outgoingLight += vec3(1.0, 0.72, 0.28) * (w * 3.2 + uGlow);
    }`,
  });
  const goldMesh = new Mesh(goldGeo, gold);
  crown.add(goldMesh);

  // ---- уық poles radiating outward/down (instanced, fading)
  const poleCount = low ? 24 : 36;
  const poleLen = 1.2;
  const poleGeo = new CylinderGeometry(0.034, 0.05, poleLen, 6, 1, true);
  poleGeo.translate(0, poleLen / 2, 0);
  const poleMat = new MeshPhysicalMaterial({ color: '#E9A93A', metalness: 0.9, roughness: 0.35, transparent: true, depthWrite: false });
  patchMaterial(poleMat, {
    uniforms: wave, // share the wave uniforms
    vertexPars: 'varying float vAlong;',
    vertexMain: `vAlong = position.y / ${poleLen.toFixed(1)};`,
    fragPars: 'varying float vAlong; uniform float uWave; uniform float uWaveAmp;',
    fragMain: `{
      float w = exp(-pow(((1.0 + vAlong * 1.2) - uWave) * 5.0, 2.0)) * uWaveAmp;
      outgoingLight += vec3(1.0, 0.72, 0.28) * w * 2.6;
      diffuseColor.a = (1.0 - smoothstep(0.0, 1.0, vAlong)) * 0.85;
    }`,
  });
  const poles = new InstancedMesh(poleGeo, poleMat, poleCount);
  const o = new Object3D();
  for (let i = 0; i < poleCount; i++) {
    const a = (i / poleCount) * Math.PI * 2;
    o.position.set(Math.cos(a) * (R + 0.1), -0.02, Math.sin(a) * (R + 0.1));
    // point outward & down (like roof poles of the yurt)
    o.rotation.set(0, 0, 0);
    o.lookAt(Math.cos(a) * 10, -3.2, Math.sin(a) * 10);
    o.rotateX(Math.PI / 2);
    o.updateMatrix();
    poles.setMatrixAt(i, o.matrix);
  }
  poles.instanceMatrix.needsUpdate = true;
  crown.add(poles);

  // ---- sky light through the crown + back halo
  const sky = makeHalo('#7FE3FF', 4.4, 0.28, true);
  sky.position.set(0, 0.6, 0);
  crown.add(sky);
  const halo = makeHalo('#FFB627', 9, 0.22, true);
  halo.position.set(0, 0.2, -0.6);
  halo.renderOrder = -1;
  group.add(halo);

  // ---- golden dust (orbiting motes)
  const dustN = low ? 140 : 320;
  const rand = rng(11);
  const dp = new Float32Array(dustN * 3), ds = new Float32Array(dustN);
  for (let i = 0; i < dustN; i++) {
    const a = rand() * Math.PI * 2, r = 1.2 + Math.pow(rand(), 0.6) * 3.8, y = (rand() - 0.5) * 3.6;
    dp.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
    ds[i] = rand();
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new Float32BufferAttribute(dp, 3));
  dg.setAttribute('aSeed', new Float32BufferAttribute(ds, 1));
  const dustMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uMap: { value: dotTexture() }, uColor: { value: new Color('#FFC75A') }, uBoost: { value: 0 } },
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uPx; uniform float uBoost; varying float vA;
      void main(){ vec3 p = position; float a = uTime * (0.05 + aSeed * 0.08) + aSeed * 6.28;
        p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz; p.y += sin(uTime * 0.5 + aSeed * 20.0) * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        vA = (0.35 + 0.65 * sin(uTime * 1.3 + aSeed * 50.0) * 0.5 + 0.5) * (1.0 + uBoost);
        gl_PointSize = uPx * (1.0 + aSeed * 2.4) * (14.0 / max(0.5, -mv.z)); }`,
    fragmentShader: `uniform sampler2D uMap; uniform vec3 uColor; varying float vA;
      void main(){ vec4 t = texture2D(uMap, gl_PointCoord); float a = t.a * vA * 0.55; if (a < 0.01) discard; gl_FragColor = vec4(uColor, a); }`,
  });
  const dust = new Points(dg, dustMat);
  dust.frustumCulled = false;
  group.add(dust);

  // ---- ornament burst
  const ornTex = ornamentTexture();
  const burst = createBurst({
    count: low ? 70 : 140, map: ornTex, colors: ['#FFD27A', '#FFB627', '#FFF1C9', '#7FE3FF'], size: 2.2,
    speed: [1.6, 4.2], duration: 2.6, gravity: 0.08, additive: true, seed: 5,
    start: (i, out, r) => { const a = r() * Math.PI * 2; out[0] = Math.cos(a) * R; out[1] = 0; out[2] = Math.sin(a) * R; },
    dir: (i, out, r) => {
      const a = r() * Math.PI * 2, up = r() * 0.9 + 0.1;
      out[0] = Math.cos(a) * (1 - up * 0.5); out[1] = up; out[2] = Math.sin(a) * (1 - up * 0.5);
    },
  });
  crown.add(burst.points);

  // ---- trick state
  let trickT = -1;
  let t0 = 0;
  const px = pxOf(ctx);

  // light backgrounds (paper wide shots): glows switch from additive to normal blending, darker gold
  const tk = new ToneSwitch();
  tk.add(sky.material, { color: '#F2B23A' });
  tk.add(halo.material, { color: '#F0A42C' });
  tk.add(dustMat, { onChange: (l) => dustMat.uniforms.uColor.value.set(l ? '#B8740E' : '#FFC75A') });
  tk.add(burst.points.material, {});

  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(sky);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.7,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      t0 += dt;
      crown.rotation.y = time * 0.12;
      const f = opts.float || 0;
      crown.rotation.x = lerp(lerp(TILT_HERO, TILT_ABOUT, smoothstep(0, 1, f)), TILT_FINALE, opts.solo || 0);
      crown.position.y = Math.sin(time * 0.8) * 0.06;
      dustMat.uniforms.uTime.value = time;
      dustMat.uniforms.uPx.value = pxOf(ctx) || px;
      rim.uRimStrength.value = 0.55 + base.hover * 0.6;
      const wide = opts.wide || 0;
      const light = tk.apply(opts.tone || 0);
      let glow = 0.06 + base.hover * 0.12 + wide * 0.34 * (1 - (opts.solo || 0) * 0.5);
      if (trickT >= 0) {
        trickT += dt;
        const p = trickT / 1.8;
        wave.uWave.value = -0.2 + p * 2.6;
        wave.uWaveAmp.value = clamp(1.4 - p * 0.6, 0, 1.2);
        dustMat.uniforms.uBoost.value = Math.max(0, 1 - p) * 1.5;
        if (trickT > 2.2) { trickT = -1; wave.uWaveAmp.value = 0; dustMat.uniforms.uBoost.value = 0; }
      } else {
        // gentle idle shimmer running around
        wave.uWave.value = 0.5 + 0.5 * Math.sin(time * 0.7);
        wave.uWaveAmp.value = 0.08 * focusAmount;
      }
      wave.uGlow.value = glow;
      sky.material.opacity = (0.2 + 0.1 * Math.sin(time * 0.9) + base.hover * 0.1) * (light ? 0.45 : 1);
      // wide shots: a strong golden aura marks home in the constellation
      const aura = wide * (1 - 0.5 * (opts.solo || 0));
      halo.material.opacity = (0.18 + 0.1 * focusAmount + aura * 0.42) * (light ? 0.5 : 1);
      halo.scale.setScalar(9 * (1 + 0.45 * aura));
      burst.update(dt, pxOf(ctx));
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { trickT = 0; burst.fire(); },
    busy() { return trickT >= 0 || burst.active; },
    dispose() {
      goldGeo.dispose(); gold.dispose(); poleGeo.dispose(); poleMat.dispose(); poles.dispose();
      dg.dispose(); dustMat.dispose(); ornTex.dispose();
      burst.points.geometry.dispose(); burst.points.material.dispose();
      sky.material.dispose(); halo.material.dispose();
    },
  };
}
