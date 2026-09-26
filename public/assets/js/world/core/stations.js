// Station manager: lazy module loading + creation, visibility window, appear animation, hover/drag/trick routing.
import { Group, Sphere, Vector3 } from 'three';
import { ANCHORS, RADIUS, OBJECT_STATIONS, WIDE_GROW, WIDE_GROW_HERO } from './layout.js';
import { clamp, easeOutCubic, easeInOutCubic, smoothstep } from '../fx/ease.js';

const LOADERS = {
  hero: () => import('../stations/hero.js'),
  math: () => import('../stations/math.js'),
  physics: () => import('../stations/physics.js'),
  chemistry: () => import('../stations/chemistry.js'),
  biology: () => import('../stations/biology.js'),
  geography: () => import('../stations/geography.js'),
  languages: () => import('../stations/languages.js'),
  informatics: () => import('../stations/informatics.js'),
  arts: () => import('../stations/arts.js'),
};

const _sphere = new Sphere();
const RING_ORDER = OBJECT_STATIONS.filter((id) => id !== 'hero');

export class StationManager {
  constructor({ scene, ids, ctx, onReady }) {
    this.scene = scene;
    this.ids = ids;              // section order
    this.ctx = ctx;              // shared context passed to factories
    this.onReady = onReady;
    this.slots = new Map();      // id → {index, holder, inst, status, appear}
    this.destroyed = false;
    OBJECT_STATIONS.forEach((id) => {
      const index = ids.indexOf(id);
      if (index < 0) return;
      const holder = new Group();
      holder.name = 'station:' + id;
      holder.position.copy(ANCHORS[id]);
      holder.visible = false;
      scene.add(holder);
      this.slots.set(id, { id, index, holder, inst: null, status: 'idle', appear: 0, pendingTrick: false, hover: false, t: 0 });
    });
  }

  /** Load + create a station (async). Safe to call repeatedly. */
  ensure(id) {
    const s = this.slots.get(id);
    if (!s || s.status !== 'idle') return s ? s.ready : Promise.resolve();
    s.status = 'loading';
    s.ready = LOADERS[id]().then((mod) => {
      if (this.destroyed) return;
      const inst = mod.default(Object.assign({}, this.ctx, { anchor: ANCHORS[id].clone(), radius: RADIUS[id], id }));
      inst.radius = inst.radius || RADIUS[id];
      inst.focus = inst.focus || ANCHORS[id].clone();
      s.inst = inst;
      s.holder.add(inst.group);
      // pre-compile shaders off the critical path (KHR_parallel_shader_compile) so the first fly-by does not hitch
      const r = this.ctx.renderer;
      if (r && r.compileAsync && this.ctx.camera) {
        const was = s.holder.visible;
        s.holder.visible = true;
        const p = r.compileAsync(s.holder, this.ctx.camera, this.scene).catch(() => {});
        s.holder.visible = was;
        return p.then(() => { if (!this.destroyed) this._activate(s, inst); });
      }
      this._activate(s, inst);
    }).catch((err) => {
      s.status = 'error';
      console.warn('[world] station failed:', id, err);
    });
    return s.ready;
  }

  _activate(s, inst) {
    s.status = 'ready';
    if (s.pendingTrick) { s.pendingTrick = false; inst.trick(); }
    if (this.onReady) this.onReady(s.id);
  }

  /** Preload remaining stations one by one when the main thread is idle. */
  preloadIdle(order) {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(() => cb({ timeRemaining: () => 8 }), 120));
    const queue = order.filter((id) => this.slots.has(id));
    const next = () => {
      if (this.destroyed) return;
      const id = queue.shift();
      if (!id) return;
      const s = this.slots.get(id);
      if (s.status !== 'idle') { next(); return; }
      this._idleHandle = ric(() => { this.ensure(id).then(() => setTimeout(next, 60)); }, { timeout: 2500 });
    };
    next();
  }

  /** Station id whose object is in focus (camera near it), or null. */
  focused(float) {
    let best = null, bd = 0.42;
    for (const s of this.slots.values()) {
      const d = Math.abs(float - s.index);
      if (d < bd && s.status === 'ready') { bd = d; best = s; }
    }
    return best;
  }

  hitTest(ray, float) {
    const s = this.focused(float);
    if (!s) return false;
    _sphere.center.copy(s.inst.focus);
    _sphere.radius = s.inst.radius * 1.08 * s.holder.scale.x;
    return ray.intersectsSphere(_sphere);
  }

  trick(id) {
    const s = this.slots.get(id);
    if (!s) return false;
    if (s.status === 'ready') { s.inst.trick(); return true; }
    s.pendingTrick = true;
    this.ensure(id);
    return true;
  }

  /**
   * Per-frame update.
   * @param {number} dt      frame dt (0 = frozen)
   * @param {number} float   camera progress
   * @param {object} o       {wide, solo, animate, hoverId, low, ring, ringTime, burstId, tone}
   *   animate=false → static frame; only `burstId` (a trick / drag while paused) advances its own clock.
   */
  update(dt, float, o) {
    const { wide = 0, solo = 0, animate = true, hoverId = null, ring = null, ringTime = 0, burstId = null, tone = 0 } = o;
    const home = easeInOutCubic(solo);
    for (const s of this.slots.values()) {
      // distance in stations; a station also "owns" a following camera-only station (hero → about)
      const span = this.ids[s.index + 1] === 'about' ? 1 : 0;
      const d = float < s.index ? s.index - float : Math.max(0, float - s.index - span);
      // lazy creation when approaching (or when the whole universe is on screen)
      if (s.status === 'idle' && (d < 2.2 || wide > 0.3)) this.ensure(s.id);
      if (s.status !== 'ready') { s.holder.visible = false; continue; }
      // materialise while the camera approaches, dissolve after passing; wide shots show the whole universe
      const near = smoothstep(0.98, 0.5, d); // exactly 0 at a neighbouring settled station (no speck-sized neighbours)
      const wideVis = wide;
      const vis = Math.max(near, wideVis);
      s.holder.visible = vis > 0.004;
      if (!s.holder.visible) { if (s.hover) { s.hover = false; s.inst.setHover(false); } continue; }
      const run = animate || s.id === burstId;
      const sdt = run ? dt : 0;
      s.t += sdt;
      // appear (intro) animation
      if (animate) s.appear = Math.min(1, s.appear + dt / 1.4);
      else s.appear = 1;
      const ap = easeOutCubic(s.appear);
      let grow = 1;
      if (s.id === 'hero') {
        // the home symbol is the biggest world in every wide shot (the finale close-up frames it by itself)
        grow = 1 + WIDE_GROW_HERO * wideVis * (1 - home);
      } else {
        grow = 1 + WIDE_GROW * wideVis;
        // finale: the subject worlds come home and gather on explicit screen slots around the shanyrak
        const k = RING_ORDER.indexOf(s.id);
        const slot = ring && k >= 0 ? ring.slots[k] : null;
        if (slot && home > 0.001) {
          s.holder.position.copy(ANCHORS[s.id]).lerp(slot.pos, home);
          s.holder.position.y += Math.sin(ringTime * 0.5 + k * 1.7) * 0.06 * home; // gentle float
          const target = slot.r / RADIUS[s.id];
          grow = grow + (target - grow) * home;
        } else if (!s.holder.position.equals(ANCHORS[s.id])) {
          s.holder.position.copy(ANCHORS[s.id]);
        }
      }
      s.holder.scale.setScalar((0.72 + 0.28 * ap) * easeOutCubic(vis) * grow);
      const focusAmount = clamp(1 - d);
      const isHover = hoverId === s.id;
      if (isHover !== s.hover) { s.hover = isHover; s.inst.setHover(isHover); }
      s.inst.update(s.t, sdt, focusAmount, { wide, solo, float, appear: ap, animate: run, tone });
    }
  }

  /** Current world position of a station's object (moves in the finale). false when not on screen. */
  worldPosition(id, out) {
    const s = this.slots.get(id);
    if (!s) return false;
    out.copy(s.holder.position);
    return s.holder.visible;
  }

  drag(id, dx, dy) {
    const s = this.slots.get(id);
    if (s && s.status === 'ready') s.inst.drag(dx, dy);
  }

  pointer(id, ray) {
    for (const s of this.slots.values()) {
      if (s.status === 'ready' && s.inst.pointer) s.inst.pointer(s.id === id ? ray : null);
    }
  }

  anyBusy() {
    for (const s of this.slots.values()) if (s.status === 'ready' && s.inst.busy && s.inst.busy()) return true;
    return false;
  }

  dispose() {
    this.destroyed = true;
    if (this._idleHandle && window.cancelIdleCallback) window.cancelIdleCallback(this._idleHandle);
    for (const s of this.slots.values()) {
      if (s.inst) { try { s.inst.dispose(); } catch (e) { console.warn(e); } }
      this.scene.remove(s.holder);
    }
    this.slots.clear();
  }
}

