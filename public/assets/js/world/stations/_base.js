// Shared station plumbing: drag rotation with springy tilt, hover amount, particle bursts, sprite atlases.
import {
  Group, BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color, AdditiveBlending, NormalBlending,
  CanvasTexture, SRGBColorSpace,
} from 'three';
import { clamp, damp, rng } from '../fx/ease.js';

export class Interactive {
  constructor({ tilt = 0.75, spring = 1.4 } = {}) {
    this.group = new Group();
    this.spin = new Group();
    this.group.add(this.spin);
    this.hover = 0;
    this.hoverTarget = 0;
    this.userY = 0;
    this.userX = 0;
    this.tiltLimit = tilt;
    this.spring = spring;
  }
  drag(dx, dy) {
    this.userY += dx;
    this.userX = clamp(this.userX + dy, -this.tiltLimit, this.tiltLimit);
  }
  setHover(b) { this.hoverTarget = b ? 1 : 0; }
  tick(dt) {
    this.hover += (this.hoverTarget - this.hover) * damp(8, dt || 1);
    this.userX += (0 - this.userX) * damp(this.spring, dt);
    this.spin.rotation.set(this.userX, this.userY, 0);
    this.group.scale.setScalar(1 + 0.045 * this.hover);
  }
}

const BURST_VERT = /* glsl */`
  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aDelay;
  attribute float aSpin;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uT;
  uniform float uDur;
  uniform float uPx;
  uniform float uGravity;
  varying float vA;
  varying float vRot;
  varying vec3 vColor;
  void main() {
    float t = max(0.0, uT - aDelay);
    float life = clamp(t / (uDur - aDelay), 0.0, 1.0);
    vec3 p = position + aDir * aSpeed * (1.0 - exp(-2.6 * t)) + vec3(0.0, -uGravity * t * t, 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.55, 1.0, life)) * step(0.0001, t);
    vRot = aSpin * t;
    vColor = aColor;
    gl_PointSize = aSize * uPx * (90.0 / max(0.5, -mv.z)) * (0.6 + 0.4 * (1.0 - life));
  }
`;
const BURST_FRAG = /* glsl */`
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying float vA;
  varying float vRot;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float s = sin(vRot), co = cos(vRot);
    c = mat2(co, -s, s, co) * c + 0.5;
    vec4 tex = texture2D(uMap, c);
    float a = tex.a * vA * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * tex.rgb, a);
  }
`;

/**
 * Particle burst (single draw call). `start(i, out[3])` gives start positions, `dir(i, out[3])` the directions.
 */
export function createBurst({ count, map, colors, size = 1, speed = [1, 3], duration = 2.2, gravity = 0, additive = true, seed = 3, start, dir }) {
  const r = rng(seed);
  const pos = new Float32Array(count * 3), d = new Float32Array(count * 3), sp = new Float32Array(count),
    del = new Float32Array(count), spin = new Float32Array(count), sz = new Float32Array(count), col = new Float32Array(count * 3);
  const tmp = [0, 0, 0], c = new Color();
  for (let i = 0; i < count; i++) {
    start(i, tmp, r); pos.set(tmp, i * 3);
    dir(i, tmp, r); d.set(tmp, i * 3);
    sp[i] = speed[0] + r() * (speed[1] - speed[0]);
    del[i] = r() * 0.25;
    spin[i] = (r() - 0.5) * 6;
    sz[i] = size * (0.6 + r() * 0.8);
    c.set(colors[Math.floor(r() * colors.length)]);
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('aDir', new Float32BufferAttribute(d, 3));
  g.setAttribute('aSpeed', new Float32BufferAttribute(sp, 1));
  g.setAttribute('aDelay', new Float32BufferAttribute(del, 1));
  g.setAttribute('aSpin', new Float32BufferAttribute(spin, 1));
  g.setAttribute('aSize', new Float32BufferAttribute(sz, 1));
  g.setAttribute('aColor', new Float32BufferAttribute(col, 3));
  const mat = new ShaderMaterial({
    vertexShader: BURST_VERT, fragmentShader: BURST_FRAG, transparent: true, depthWrite: false,
    blending: additive ? AdditiveBlending : NormalBlending,
    uniforms: {
      uT: { value: 0 }, uDur: { value: duration }, uPx: { value: 1 }, uGravity: { value: gravity },
      uMap: { value: map }, uOpacity: { value: 1 },
    },
  });
  const points = new Points(g, mat);
  points.frustumCulled = false;
  points.visible = false;
  points.renderOrder = 3;
  let t = -1;
  return {
    points,
    fire() { t = 0; points.visible = true; },
    get active() { return t >= 0; },
    update(dt, pxRatio = 1) {
      if (t < 0) return;
      t += dt;
      mat.uniforms.uT.value = t;
      mat.uniforms.uPx.value = pxRatio;
      if (t > duration) { t = -1; points.visible = false; }
    },
  };
}

/** Canvas sprite with a drawing callback (size px square). */
export function spriteTexture(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Device pixel ratio of the renderer for point sizes. */
export const pxOf = (ctx) => (ctx.renderer ? ctx.renderer.getPixelRatio() : 1);

/** Camera layer for decorative detail that is skipped in low-quality wide shots (draw-call budget on phones). */
export const DETAIL_LAYER = 1;
/** Mark objects (and their children) as decorative detail. */
export function detail(...objs) {
  objs.forEach((o) => o && o.traverse((c) => c.layers.set(DETAIL_LAYER)));
}

/**
 * Light / dark background variants for a station's glow materials. Additive glows vanish on the light paper/theme
 * backgrounds, so above tone 0.5 registered materials switch to normal blending (and optional darker colours / lower
 * opacity). Switching blending is render state only — no shader recompiles.
 */
export class ToneSwitch {
  constructor() { this.items = []; this.light = null; }
  /**
   * @param {import('three').Material} mat
   * @param {{color?:string, opacity?:number, blending?:number, onChange?:(light:boolean)=>void}} light
   *   opacity: multiplier applied once for materials whose opacity is not rewritten every frame
   */
  add(mat, light = {}) {
    this.items.push({ mat, light, dark: mat ? { color: mat.color ? mat.color.clone() : null, blending: mat.blending, opacity: mat.opacity } : null });
    return mat;
  }
  /** Opacity multiplier for glows whose opacity a station rewrites every frame. */
  get k() { return this.light ? 0.6 : 1; }
  /** @returns {boolean} light */
  apply(tone) {
    const light = tone > 0.5;
    if (light === this.light) return light;
    this.light = light;
    for (const it of this.items) {
      const m = it.mat, L = it.light;
      if (!m) { if (L.onChange) L.onChange(light); continue; }
      if (light) {
        if (L.color && m.color) m.color.set(L.color);
        m.blending = L.blending !== undefined ? L.blending : NormalBlending;
        if (L.opacity != null) m.opacity = it.dark.opacity * L.opacity;
      } else {
        if (it.dark.color && m.color) m.color.copy(it.dark.color);
        m.blending = it.dark.blending;
        if (L.opacity != null) m.opacity = it.dark.opacity;
      }
      if (L.onChange) L.onChange(light);
    }
    return light;
  }
}
