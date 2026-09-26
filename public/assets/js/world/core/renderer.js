// Renderer, resize, DPR caps and adaptive quality (FPS sampling → downgrade).
import {
  WebGLRenderer, SRGBColorSpace, NeutralToneMapping, PMREMGenerator,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createRenderer(canvas, { isMobile, quality }) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !(isMobile && quality === 'low'),
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    preserveDrawingBuffer: false,
  });
  // the canvas may carry a context from a previous (destroyed) world: reset unpack state three does not track
  const gl = renderer.getContext();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  renderer.resetState();
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  // shader validation costs sync GL round-trips (and logs harmless ANGLE warnings); enable with ?debug
  renderer.debug.checkShaderErrors = /[?&]debug/.test(location.search);
  return renderer;
}

/** Neutral studio reflections for glossy materials (generated once, ~5ms). */
export function createEnvironment(renderer) {
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const rt = pmrem.fromScene(room, 0.04);
  room.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pmrem.dispose();
  return rt;
}

/**
 * DPR + adaptive quality controller (two-way).
 * Levels: 0 = full, 1 = reduced DPR, 2 = DPR floor + half particles, 3 = DPR floor + minimum particles.
 * DPR never drops below 1 on desktop / min(devicePixelRatio, 1) on phones — the lowest levels cut particles instead.
 * Only frames rendered while the page is settled (no scroll, camera arrived) are sampled, so page-side work
 * (clip-path wipes, ScrollTrigger, Lenis) does not count against the world. 3 good windows (≥55fps) → one level up.
 */
export class Quality {
  constructor({ isMobile, quality, onChange }) {
    this.isMobile = isMobile;
    this.base = quality;
    this.level = 0;
    this.onChange = onChange;
    this.fps = 0;
    this.bad = 0;
    this.good = 0;
    this.upPenalty = 0;      // grows when an upgrade had to be undone (hysteresis)
    this.lastUp = -1e9;
    this._clear();
    this.cooldown = 1.5;     // seconds before first sample (shader warm-up)
  }
  _clear() { this.frames = 0; this.acc = 0; this.wall = 0; this.hitches = 0; }
  get dpr() {
    const d = window.devicePixelRatio || 1;
    const floor = this.isMobile ? Math.min(d, 1) : 1;
    const caps = this.isMobile ? [1.25, 1.1, 1, 1] : [1.75, 1.5, 1.25, 1];
    return Math.max(floor, Math.min(d, caps[this.level]));
  }
  get particleDensity() { return this.level >= 3 ? 0.35 : this.level >= 2 ? 0.55 : 1; }
  get low() { return this.base === 'low' || this.level >= 2; }
  /**
   * Call once per rendered animation frame with real dt (s).
   * @param {boolean} settled  false while the page scrolls / the camera travels → frame is ignored
   */
  sample(dt, settled = true) {
    if (dt <= 0 || dt > 1) return;              // tab switch
    if (!settled) { this._clear(); return; }    // a window must be one continuous settled stretch
    if (this.cooldown > 0) { this.cooldown -= dt; return; }
    this.wall += dt;
    if (dt > 0.12) this.hitches++;               // isolated hitches (GC, screenshots) are not GPU load…
    else { this.frames++; this.acc += dt; }
    if (this.wall < 2) return;
    this.fps = this.acc > 0 ? this.frames / this.acc : 0;
    const slow = this.fps < 40 || this.hitches > 6; // …unless they are the norm
    const fast = this.fps >= 55 && this.hitches === 0;
    this._clear();
    this.bad = slow ? this.bad + 1 : 0;
    this.good = fast ? this.good + 1 : 0;
    const now = performance.now();
    if (this.bad >= 2 && this.level < 3) {          // two consecutive slow windows → downgrade
      if (now - this.lastUp < 12000) this.upPenalty = Math.min(4, this.upPenalty + 1);
      this._set(this.level + 1);
    } else if (this.good >= 3 * (1 + this.upPenalty) && this.level > 0) {  // sustained headroom → upgrade
      this.lastUp = now;
      this._set(this.level - 1);
    }
  }
  _set(level) {
    this.level = level;
    this.bad = 0; this.good = 0;
    this.cooldown = 2;
    this._clear();
    this.onChange && this.onChange(this.level, this.fps);
  }
  reset() { this._clear(); this.bad = 0; this.good = 0; this.cooldown = 1; }
}
