// Small easing / math helpers shared by stations (no allocations).
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOutCubic = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOutBack = (t, s = 1.7) => { t = clamp(t) - 1; return 1 + (s + 1) * t * t * t + s * t * t; };
export const easeOutElastic = (t) => {
  t = clamp(t);
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
};
/** frame-rate independent damping factor */
export const damp = (k, dt) => 1 - Math.exp(-k * dt);
/** 0→1→0 bump over [0,1] */
export const bump = (t) => (t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t));
/** Deterministic PRNG (mulberry32) so layouts are stable between reloads. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A one-shot timeline helper for tricks: start() then read .t (seconds since start) and .p (0..1 over duration).
 * `active` is true while running.
 */
export class Pulse {
  constructor(duration) { this.duration = duration; this.t = 0; this.active = false; }
  start() { this.t = 0; this.active = true; }
  tick(dt) { if (!this.active) return; this.t += dt; if (this.t >= this.duration) { this.t = this.duration; this.active = false; } }
  get p() { return clamp(this.t / this.duration); }
}
