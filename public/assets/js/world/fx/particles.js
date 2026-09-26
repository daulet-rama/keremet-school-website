// Global particle fields: far star shell + near dust tube along the journey path. One draw call each.
import {
  BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color, NormalBlending, Vector3, Matrix4, Vector2,
} from 'three';
import { rng } from './ease.js';

const VERT = /* glsl */`
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uAtten;
  uniform float uTone;
  uniform mat4 uPrevVP;
  uniform vec2 uRes;
  uniform float uWarp;
  varying float vTw;
  varying float vSeed;
  varying vec2 vDir;
  varying float vHalf;
  varying float vWid;
  varying float vNear;
  void main() {
    vec3 p = position;
    // slow drift for dust
    p += uAtten * vec3(sin(uTime * 0.11 + aSeed * 31.0), cos(uTime * 0.09 + aSeed * 17.0), sin(uTime * 0.07 + aSeed * 7.0)) * 0.6;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    vTw = 0.55 + 0.45 * sin(uTime * (0.5 + aSeed * 1.9) + aSeed * 40.0);
    vSeed = aSeed;
    float s = aSize * uPx * mix(1.0, 26.0 / max(0.5, -mv.z), uAtten);
    s *= mix(1.0, 0.8, uTone);
    s = clamp(s, 0.0, 40.0);
    // motion streaks: screen-space travel since the previous frame (camera flights) stretches dust into warp lines
    vec2 vel = vec2(0.0);
    if (uWarp > 0.0) {
      vec4 pr = uPrevVP * wp;
      if (pr.w > 0.1 && gl_Position.w > 0.1) vel = (gl_Position.xy / gl_Position.w - pr.xy / pr.w) * 0.5 * uRes * uWarp;
    }
    float len = clamp(length(vel) - 1.5, 0.0, 3.0 * max(s, 6.0));
    vDir = len > 0.0 ? normalize(vel) : vec2(1.0, 0.0);
    float S = s + len;
    vHalf = 0.5 * len / max(S, 1e-3);
    vWid = 0.5 * s / max(S, 1e-3);
    // no big soft bokeh right in front of the lens
    vNear = mix(1.0, smoothstep(1.5, 6.0, -mv.z), uAtten) * mix(1.0, 0.75, clamp(len / max(s, 1.0) * 0.3, 0.0, 1.0));
    gl_PointSize = min(S, 64.0);
  }
`;
const FRAG = /* glsl */`
  uniform float uTone;
  uniform float uOpacity;
  uniform vec3 uDark1;
  uniform vec3 uDark2;
  uniform vec3 uDark3;
  uniform vec3 uLight;
  varying float vTw;
  varying float vSeed;
  varying vec2 vDir;
  varying float vHalf;
  varying float vWid;
  varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    vec2 dir = vec2(vDir.x, -vDir.y);           // point coords run downwards
    float along = dot(c, dir), across = dot(c, vec2(-dir.y, dir.x));
    float d = length(vec2(max(abs(along) - vHalf, 0.0), across)) / max(vWid, 1e-3); // capsule distance (1 = edge)
    float a = smoothstep(1.0, 0.16, d);
    vec3 dark = vSeed < 0.8 ? uDark1 : (vSeed < 0.9 ? uDark2 : uDark3);
    vec3 col = mix(dark, uLight, uTone);
    float alpha = a * vTw * uOpacity * mix(1.0, 0.32, uTone) * vNear;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function makeMaterial(atten) {
  return new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: 1 },
      uAtten: { value: atten },
      uTone: { value: 0 },
      uOpacity: { value: 1 },
      uDark1: { value: new Color('#EEF1FF') },
      uDark2: { value: new Color('#FFD27A') },
      uDark3: { value: new Color('#7FE3FF') },
      uLight: { value: new Color('#1B2A6B') },
      uPrevVP: { value: new Matrix4() },
      uRes: { value: new Vector2(1, 1) },
      uWarp: { value: 0 },
    },
  });
}

/**
 * @param {object} o
 * @param {Vector3} o.center  centre of the universe
 * @param {import('three').Curve} o.path  journey curve (for dust)
 * @param {number} o.stars    star count
 * @param {number} o.dust     dust count
 */
export function createParticles({ center, path, stars, dust }) {
  const rand = rng(7);
  // --- stars: spherical shell
  const sp = new Float32Array(stars * 3), ss = new Float32Array(stars), sd = new Float32Array(stars);
  const v = new Vector3();
  for (let i = 0; i < stars; i++) {
    const u = rand() * 2 - 1, th = rand() * Math.PI * 2, r = 380 + rand() * 420;
    const s = Math.sqrt(1 - u * u);
    v.set(s * Math.cos(th), u, s * Math.sin(th)).multiplyScalar(r).add(center);
    sp.set([v.x, v.y, v.z], i * 3);
    const big = rand();
    ss[i] = big > 0.97 ? 3.4 : big > 0.85 ? 2.3 : 1.35;
    sd[i] = rand();
  }
  const sg = new BufferGeometry();
  sg.setAttribute('position', new Float32BufferAttribute(sp, 3));
  sg.setAttribute('aSize', new Float32BufferAttribute(ss, 1));
  sg.setAttribute('aSeed', new Float32BufferAttribute(sd, 1));
  const starPts = new Points(sg, makeMaterial(0));
  starPts.frustumCulled = false;
  starPts.renderOrder = -2;

  // --- dust: tube around the journey path
  const dp = new Float32Array(dust * 3), ds = new Float32Array(dust), dd = new Float32Array(dust);
  const p = new Vector3();
  for (let i = 0; i < dust; i++) {
    path.getPoint(rand(), p);
    const r = 3 + Math.pow(rand(), 0.7) * 26;
    const a = rand() * Math.PI * 2, b = rand() * 2 - 1;
    const s = Math.sqrt(1 - b * b);
    v.set(s * Math.cos(a), b, s * Math.sin(a)).multiplyScalar(r).add(p);
    dp.set([v.x, v.y, v.z], i * 3);
    ds[i] = 0.6 + rand() * 1.6;
    dd[i] = rand();
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new Float32BufferAttribute(dp, 3));
  dg.setAttribute('aSize', new Float32BufferAttribute(ds, 1));
  dg.setAttribute('aSeed', new Float32BufferAttribute(dd, 1));
  const dustPts = new Points(dg, makeMaterial(1));
  dustPts.frustumCulled = false;
  dustPts.renderOrder = -1;

  return {
    objects: [starPts, dustPts],
    /**
     * @param {object} o  {pxScale, tone, starFade, prevVP (view-projection of the previous frame | null), width, height (css px), dpr, warp}
     */
    update(time, { pxScale, tone, starFade = 1, prevVP = null, width = 1, height = 1, dpr = 1, warp = 0 }) {
      for (const o of [starPts, dustPts]) {
        const u = o.material.uniforms;
        u.uTime.value = time;
        u.uPx.value = pxScale;
        u.uTone.value = tone;
      }
      starPts.material.uniforms.uOpacity.value = starFade;
      const du = dustPts.material.uniforms;
      du.uOpacity.value = 0.85;
      du.uWarp.value = prevVP ? warp : 0;
      if (prevVP) du.uPrevVP.value.copy(prevVP);
      du.uRes.value.set(width * dpr, height * dpr);
    },
    /** fraction 0..1 of particles to draw (adaptive quality) */
    setDensity(f) {
      sg.setDrawRange(0, Math.floor(stars * f));
      dg.setDrawRange(0, Math.floor(dust * f));
    },
    dispose() {
      sg.dispose(); dg.dispose();
      starPts.material.dispose(); dustPts.material.dispose();
    },
  };
}

