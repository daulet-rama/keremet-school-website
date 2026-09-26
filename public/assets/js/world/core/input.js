// Pointer input: hover ray, drag-with-inertia, tap = trick, mouse parallax. Never blocks vertical page scroll.
import { Vector2, Raycaster } from 'three';

const DRAG_PX = 6;          // movement before a press becomes a drag
const TAP_MS = 450;
const TOUCH_DECIDE_PX = 10; // touch: movement before deciding drag (horizontal) vs page scroll

export class Input {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{hitTest:(ndc:Vector2)=>boolean, onTap:()=>void, onDrag:(dx:number,dy:number)=>void, onDragEnd:()=>void, onChange:()=>void}} h
   */
  constructor(canvas, h) {
    this.canvas = canvas;
    this.h = h;
    this.ndc = new Vector2(9, 9);       // pointer in NDC (9 = none)
    this.inside = false;
    this.hover = false;
    this.parallax = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };     // radians / s (inertia)
    this.dragging = false;
    this.raycaster = new Raycaster();
    this.press = null;
    this._bind();
  }

  _toNdc(e) {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  _bind() {
    const c = this.canvas;
    this.onMove = (e) => {
      this._toNdc(e);
      this.inside = true;
      const p = this.press;
      if (p && p.scroll) {
        // diagonal touch swipe the browser did not take as a pan: scroll the page ourselves
        const now = performance.now();
        const dy = e.clientY - p.ly;
        window.scrollBy(0, -dy);
        const dt = Math.max(8, now - p.lt) / 1000;
        p.vy = p.vy * 0.3 + (-dy / dt) * 0.7;
        p.ly = e.clientY; p.lx = e.clientX; p.lt = now;
        return;
      }
      if (p) {
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        const touch = e.pointerType !== 'mouse';
        if (!this.dragging && Math.hypot(dx, dy) > (touch ? TOUCH_DECIDE_PX : DRAG_PX)) {
          // touch: only clearly horizontal drags are ours; anything else scrolls the page
          if (touch && Math.abs(dx) <= Math.abs(dy) * 1.6) {
            p.scroll = true; p.vy = 0; p.ly = e.clientY; p.lt = performance.now();
            window.scrollBy(0, -dy);
            return;
          }
          this.dragging = true;
          try { c.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
          c.style.cursor = this._cursor = 'grabbing';
        }
        if (this.dragging) {
          const now = performance.now();
          const mx = e.clientX - this.press.lx, my = e.clientY - this.press.ly;
          const dt = Math.max(8, now - this.press.lt) / 1000;
          const s = 0.0085; // px → rad
          const rx = mx * s, ry = (e.pointerType === 'mouse' ? my : my * 0.4) * s;
          this.h.onDrag(rx, ry);
          this.velocity.x = this.velocity.x * 0.3 + (rx / dt) * 0.7;
          this.velocity.y = this.velocity.y * 0.3 + (ry / dt) * 0.7;
          this.press.lx = e.clientX; this.press.ly = e.clientY; this.press.lt = now;
          if (e.cancelable && e.pointerType !== 'mouse') e.preventDefault();
        }
      } else {
        this._updateHover();
      }
      this.h.onChange();
    };
    this.onDown = (e) => {
      if (e.button !== undefined && e.button > 0) return;
      this._toNdc(e);
      if (!this.h.hitTest(this.ndc)) return;
      const now = performance.now();
      this.press = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: now, lt: now, id: e.pointerId };
      this.velocity.x = this.velocity.y = 0;
    };
    this.onUp = (e) => this._release(e, true);
    this.onCancel = (e) => this._release(e, false);
    this.onLeave = () => {
      if (this.dragging) return;
      this.inside = false;
      this.ndc.set(9, 9);
      this._updateHover();
      this.h.onChange();
    };
    this.onWinMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      this.parallax.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.parallax.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    c.addEventListener('pointermove', this.onMove);
    c.addEventListener('pointerdown', this.onDown);
    c.addEventListener('pointerup', this.onUp);
    c.addEventListener('pointercancel', this.onCancel);
    c.addEventListener('pointerleave', this.onLeave);
    window.addEventListener('pointermove', this.onWinMove, { passive: true });
  }

  _release(e, allowTap) {
    const p = this.press;
    if (!p) return;
    const wasDrag = this.dragging;
    this.press = null;
    if (p.scroll) {
      // emulated scroll: short momentum fling
      if (allowTap && performance.now() - p.lt < 90 && Math.abs(p.vy) > 60) this._fling(p.vy);
      this.dragging = false;
      this.h.onChange();
      return;
    }
    this.dragging = false;
    try { if (this.canvas.hasPointerCapture && this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    if (wasDrag) {
      // stale velocity (pointer held still before release) → no fling
      if (performance.now() - p.lt > 90) { this.velocity.x = this.velocity.y = 0; }
      this.h.onDragEnd();
    } else if (allowTap && performance.now() - p.t < TAP_MS) {
      this._toNdc(e);
      if (this.h.hitTest(this.ndc)) this.h.onTap();
    }
    this._updateHover();
    this.h.onChange();
  }

  _fling(v) {
    cancelAnimationFrame(this._flingRaf);
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      window.scrollBy(0, v * dt);
      v *= Math.exp(-3.5 * dt);
      if (Math.abs(v) > 20 && !this.press) this._flingRaf = requestAnimationFrame(step);
    };
    this._flingRaf = requestAnimationFrame(step);
  }

  _updateHover() {
    const hit = this.inside && this.h.hitTest(this.ndc);
    if (hit !== this.hover) this.hover = hit;
    const cur = this.dragging ? 'grabbing' : hit ? 'grab' : '';
    if (cur !== this._cursor) { this._cursor = cur; this.canvas.style.cursor = cur; }
  }

  /** Re-evaluate hover (e.g. camera moved under a still pointer). */
  refresh() { if (this.inside && !this.press) this._updateHover(); }

  /** Inertia step — returns rotation deltas (radians) for this frame. */
  inertia(dt) {
    if (this.dragging) return null;
    const v = this.velocity;
    if (Math.abs(v.x) < 0.002 && Math.abs(v.y) < 0.002) { v.x = v.y = 0; return null; }
    const out = { x: v.x * dt, y: v.y * dt };
    const k = Math.exp(-3.2 * dt);
    v.x *= k; v.y *= k;
    return out;
  }

  dispose() {
    const c = this.canvas;
    c.removeEventListener('pointermove', this.onMove);
    c.removeEventListener('pointerdown', this.onDown);
    c.removeEventListener('pointerup', this.onUp);
    c.removeEventListener('pointercancel', this.onCancel);
    c.removeEventListener('pointerleave', this.onLeave);
    window.removeEventListener('pointermove', this.onWinMove);
    c.style.cursor = '';
    cancelAnimationFrame(this._flingRaf);
  }
}
