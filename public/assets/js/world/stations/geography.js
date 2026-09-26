// GEOGRAPHY — dotted paper globe (Natural Earth land mask), Kazakhstan highlighted, pulsing pin at Shymkent + label.
// Drag spins the globe. Trick: globe turns to face Shymkent and the pin pulses.
import {
  Group, Mesh, SphereGeometry, CylinderGeometry, RingGeometry, BufferGeometry, Float32BufferAttribute, Points,
  ShaderMaterial, MeshStandardMaterial, MeshBasicMaterial, LineSegments, LineBasicMaterial, Vector3, Color, Sprite,
  SpriteMaterial, DoubleSide,
} from 'three';
import { LAND, KZ } from '../fx/geo-mask.js';
import { Interactive, pxOf, detail } from './_base.js';
import { addRim, textTexture, whenFont, makeHalo } from '../fx/materials.js';
import { clamp, damp, easeInOutCubic } from '../fx/ease.js';

const R = 1.9;
const SHYM = { lat: 42.32, lon: 69.59 };
const DEG = Math.PI / 180;

function decode(mask) {
  const bin = atob(mask.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return (x, y) => {
    x = clamp(Math.floor(x), 0, mask.w - 1); y = clamp(Math.floor(y), 0, mask.h - 1);
    const idx = y * mask.w + x;
    return (bytes[idx >> 3] >> (7 - (idx & 7))) & 1;
  };
}

export function latLon(lat, lon, r, out = new Vector3()) {
  const la = lat * DEG, lo = lon * DEG;
  return out.set(Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r);
}

export default function createGeography(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.5 });
  const { group, spin } = base;
  const tilt = new Group();          // axial / viewing tilt
  tilt.rotation.set(0.42, 0, -0.18);
  spin.add(tilt);
  const globe = new Group();         // spins around its axis
  tilt.add(globe);

  // body
  const bodyGeo = new SphereGeometry(R * 0.992, low ? 40 : 64, low ? 28 : 48);
  const bodyMat = new MeshStandardMaterial({ color: '#FFF8EA', roughness: 0.85, metalness: 0, envMapIntensity: 0.6 });
  const bodyRim = addRim(bodyMat, { color: '#0A7BBF', power: 2.6, strength: 0.55 });
  globe.add(new Mesh(bodyGeo, bodyMat));

  // graticule — one LineSegments draw call
  const gratMat = new LineBasicMaterial({ color: '#3B2A14', transparent: true, opacity: 0.12 });
  const v = new Vector3(), v2 = new Vector3();
  const gp = [];
  const seg = (fn) => { for (let i = 0; i < 96; i++) { fn(i, v); fn((i + 1) % 96, v2); gp.push(v.x, v.y, v.z, v2.x, v2.y, v2.z); } };
  for (let lat = -60; lat <= 60; lat += 30) seg((i, o) => latLon(lat, (i / 96) * 360, R * 1.001, o));
  for (let lon = 0; lon < 180; lon += 30) seg((i, o) => latLon(-90 + (i / 96) * 360, lon, R * 1.001, o));
  const gratGeo = new BufferGeometry();
  gratGeo.setAttribute('position', new Float32BufferAttribute(gp, 3));
  globe.add(new LineSegments(gratGeo, gratMat));

  // dots
  const land = decode(LAND), kz = decode(KZ);
  const step = low ? 1.9 : 1.3;
  const pos = [], size = [], col = [];
  const cLand = new Color('#0A7BBF'), cKz = new Color('#D1495B');
  for (let lat = -58; lat <= 84; lat += step) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / step));
    const row = Math.round((lat + 58) / step);
    for (let j = 0; j < n; j++) {
      const lon = -180 + ((j + (row % 2) * 0.5) * 360) / n;
      const x = ((lon + 180) / 360) * LAND.w, y = ((90 - lat) / 180) * LAND.h;
      if (!land(x, y)) continue;
      let isKz = false;
      if (lon >= KZ.lon0 && lon <= KZ.lon1 && lat >= KZ.lat0 && lat <= KZ.lat1) {
        isKz = !!kz(((lon - KZ.lon0) / (KZ.lon1 - KZ.lon0)) * KZ.w, ((KZ.lat1 - lat) / (KZ.lat1 - KZ.lat0)) * KZ.h);
      }
      latLon(lat, lon, R * 1.004, v);
      pos.push(v.x, v.y, v.z);
      size.push(isKz ? 1.9 : 1.15);
      const c = isKz ? cKz : cLand;
      col.push(c.r, c.g, c.b);
    }
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  dg.setAttribute('aSize', new Float32BufferAttribute(size, 1));
  dg.setAttribute('aColor', new Float32BufferAttribute(col, 3));
  const dotMat = new ShaderMaterial({
    transparent: true,
    uniforms: { uPx: { value: 1 }, uScale: { value: low ? 1.35 : 1 }, uTime: { value: 0 }, uKzPulse: { value: 0 } },
    vertexShader: `attribute float aSize; attribute vec3 aColor; uniform float uPx; uniform float uScale; uniform float uTime; uniform float uKzPulse;
      varying vec3 vC; varying float vFace; varying float vKz;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        vec3 n = normalize(normalMatrix * normalize(position));
        vFace = clamp(dot(n, normalize(-mv.xyz)), 0.0, 1.0);
        vKz = step(1.5, aSize);
        vC = aColor;
        float s = aSize * (1.0 + vKz * (0.25 * sin(uTime * 3.0) + uKzPulse * 0.8));
        gl_PointSize = uPx * uScale * s * (26.0 / max(0.5, -mv.z)) * (0.55 + 0.45 * vFace);
      }`,
    fragmentShader: `varying vec3 vC; varying float vFace; varying float vKz;
      void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); float a = smoothstep(0.5, 0.36, d) * (0.35 + 0.65 * vFace);
        if (a < 0.02) discard; gl_FragColor = vec4(vC * (0.82 + 0.18 * vFace), a); }`,
  });
  const dots = new Points(dg, dotMat);
  globe.add(dots);

  // pin at Shymkent
  const pinGroup = new Group();
  const pinNormal = latLon(SHYM.lat, SHYM.lon, 1).normalize();
  pinGroup.position.copy(pinNormal).multiplyScalar(R);
  pinGroup.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), pinNormal);
  globe.add(pinGroup);
  const stemGeo = new CylinderGeometry(0.014, 0.014, 0.34, 8);
  stemGeo.translate(0, 0.17, 0);
  const pinMat = new MeshStandardMaterial({ color: '#D1495B', roughness: 0.35, metalness: 0.1, emissive: '#5a0d18', emissiveIntensity: 0.4 });
  const stem = new Mesh(stemGeo, pinMat);
  const headGeo = new SphereGeometry(0.075, 20, 16);
  const head = new Mesh(headGeo, pinMat);
  head.position.y = 0.36;
  pinGroup.add(stem, head);
  const ringGeo = new RingGeometry(0.06, 0.085, 40);
  ringGeo.rotateX(-Math.PI / 2);
  const rings = [0, 1, 2].map(() => {
    const m = new Mesh(ringGeo, new MeshBasicMaterial({ color: '#D1495B', transparent: true, opacity: 0, side: DoubleSide, depthWrite: false, toneMapped: false }));
    m.position.y = 0.01;
    pinGroup.add(m);
    return m;
  });
  const LABEL = /^en/i.test(document.documentElement.lang || '') ? 'Shymkent' : 'Шымкент';
  const label = textTexture(LABEL, { font: 'Onest, "Segoe UI", system-ui, sans-serif', weight: 600, px: 64, color: '#3B2A14', bg: 'rgba(255,255,255,0.92)', pad: 0.32 });
  whenFont('600 64px Onest').then(() => label.redraw());
  const labelSprite = new Sprite(new SpriteMaterial({ map: label.texture, transparent: true, depthTest: false, toneMapped: false }));
  labelSprite.renderOrder = 10;
  labelSprite.center.set(-0.12, 0.5); // label sits to the right of the pin head
  globe.add(labelSprite);
  const atmo = makeHalo('#0A7BBF', R * 3.1, 0.13, false);
  atmo.position.z = -0.5;
  group.add(atmo);

  // ---- spin state
  // idle: the globe swings gently around "Kazakhstan faces the viewer" instead of spinning away from it
  let center = null;                 // globe angle that faces Shymkent to the camera (computed lazily)
  let offset = 0;                    // user drag offset (eases back to 0 = Kazakhstan after 2.5s idle)
  let idleT = 99;                    // seconds since the last drag
  let swingT = 0;
  let angle = -SHYM.lon * DEG;
  // Kazakhstan faces the viewer ≈ 15° off-centre and swings ±20° around it (never towards the limb)
  const swing = () => 0.26 + Math.sin(swingT * 0.16) * 0.35;
  function facingAngle() {
    if (!ctx.camera) return -SHYM.lon * DEG;
    tilt.updateWorldMatrix(true, false);
    camLocal.copy(ctx.camera.position);
    tilt.worldToLocal(camLocal);
    return Math.atan2(camLocal.x, camLocal.z) - SHYM.lon * DEG;
  }
  let trick = null;
  const camLocal = new Vector3(), pinW = new Vector3(), toCam = new Vector3(), tmp = new Vector3();

  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(...rings, labelSprite, atmo);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.3,
    update(time, dt, focusAmount) {
      base.tick(dt);
      dotMat.uniforms.uTime.value = time;
      dotMat.uniforms.uPx.value = pxOf(ctx);
      bodyRim.uRimStrength.value = 0.55 + base.hover * 0.4;
      if (trick) {
        trick.t += dt;
        const p = easeInOutCubic(clamp(trick.t / 1.5));
        angle = trick.from + (trick.to - trick.from) * p;
        tilt.rotation.x = trick.tiltFrom + (trick.tiltTo - trick.tiltFrom) * p;
        const pulse = clamp((trick.t - 1.2) / 2.2);
        dotMat.uniforms.uKzPulse.value = Math.sin(pulse * Math.PI) * 0.5;
        if (trick.t > 3.6) { offset = trick.to - center - swing(); trick = null; }
      } else {
        if (center === null || focusAmount < 0.9) center = facingAngle();
        swingT += dt;
        idleT += dt;
        if (idleT > 2.5) {
          offset = Math.atan2(Math.sin(offset), Math.cos(offset)); // shortest way home
          offset += (0 - offset) * damp(1.6, dt);
        }
        angle = center + offset + swing();
        tilt.rotation.x += (0.42 - tilt.rotation.x) * damp(0.8, dt);
      }
      globe.rotation.y = angle;
      // pin rings
      const speed = trick && trick.t > 1.2 ? 2.2 : 1;
      rings.forEach((r, i) => {
        const ph = ((time * 0.7 * speed + i / 3) % 1);
        r.scale.setScalar(1 + ph * (trick && trick.t > 1.2 ? 4.5 : 3.2));
        r.material.opacity = (1 - ph) * 0.8;
      });
      head.scale.setScalar(1 + (trick && trick.t > 1.2 ? Math.max(0, Math.sin((trick.t - 1.2) * 6)) * 0.5 : 0));
      // label faces camera; fade when the pin turns away
      pinGroup.getWorldPosition(pinW);
      if (ctx.camera) {
        toCam.copy(ctx.camera.position).sub(pinW).normalize();
        tmp.copy(pinNormal).transformDirection(globe.matrixWorld);
        const facing = tmp.dot(toCam);
        labelSprite.material.opacity = clamp((facing - 0.15) * 4) * (0.4 + 0.6 * focusAmount);
      }
      labelSprite.position.copy(pinNormal).multiplyScalar(R + 0.36);
      const ls = ctx.isMobile ? 0.41 : 0.24; // phones: the label must stay readable (≈ 15 css px)
      labelSprite.scale.set(ls * label.aspect, ls, 1);
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) {
      if (trick) return;
      idleT = 0;
      offset += dx;
      tilt.rotation.x = clamp(tilt.rotation.x + dy, -0.2, 1.1);
    },
    trick() {
      if (trick) return;
      // camera azimuth in the tilt frame → angle that brings Shymkent to face the viewer
      if (center === null) center = facingAngle();
      let target = angle;
      let tiltTo = 0.5;
      if (ctx.camera) {
        tilt.updateWorldMatrix(true, false);
        camLocal.copy(ctx.camera.position);
        tilt.worldToLocal(camLocal);
        const az = Math.atan2(camLocal.x, camLocal.z);
        target = az - SHYM.lon * DEG;
        // shortest way + one extra flourish turn
        while (target - angle > Math.PI) target -= Math.PI * 2;
        while (target - angle < -Math.PI) target += Math.PI * 2;
        target += Math.PI * 2 * (target >= angle ? 1 : -1);
        const el = Math.atan2(camLocal.y, Math.hypot(camLocal.x, camLocal.z));
        tiltTo = clamp(tilt.rotation.x + (SHYM.lat * DEG - el) * 0.6, 0.1, 0.9);
      }
      trick = { t: 0, from: angle, to: target, tiltFrom: tilt.rotation.x, tiltTo };
    },
    busy() { return !!trick; },
    dispose() {
      bodyGeo.dispose(); bodyMat.dispose(); gratMat.dispose(); gratGeo.dispose();
      dg.dispose(); dotMat.dispose(); stemGeo.dispose(); headGeo.dispose(); pinMat.dispose(); ringGeo.dispose();
      rings.forEach((r) => r.material.dispose()); label.texture.dispose(); labelSprite.material.dispose(); atmo.material.dispose();
    },
  };
}

