// Camera rig: continuous station index from section rects → damped → CatmullRom flight + view-offset placement.
import { CatmullRomCurve3, Vector3, MathUtils } from 'three';
import { buildKeys, UNIVERSE } from './layout.js';
import { damp, smoothstep, clamp, bump } from '../fx/ease.js';

const _p = new Vector3(), _t = new Vector3(), _right = new Vector3(), _up = new Vector3(), _fwd = new Vector3();
const Y = new Vector3(0, 1, 0);
const LOOK_AHEAD = 0.3; // mid-flight the camera already turns towards the incoming station

export class CameraRig {
  /**
   * @param {import('three').PerspectiveCamera} camera
   * @param {HTMLElement[]} sections  ordered landing sections
   * @param {string[]} ids            station id per section
   */
  constructor(camera, sections, ids) {
    this.camera = camera;
    this.sections = sections;
    this.ids = ids;
    this.n = ids.length;
    this.target = 0;       // raw float from scroll
    this.float = 0;        // damped float
    this.parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    this.dayProgress = 0;
    this.orbit = 0;        // extra slow orbit time for wide shots
    this.width = 1; this.height = 1;
    this.lookAt = new Vector3();
    this.first = true;
    this.geo = null;
  }

  resize(width, height) {
    this.width = width; this.height = height;
    const heroStage = width < 900 ? this.heroStage(height) : null;
    this.heroCy = heroStage ? heroStage.cy : null;
    this.keys = buildKeys(this.ids, { width, height, heroStage });
    const n = this.keys.length;
    if (n === 1) {
      this.posCurve = null;
    } else {
      this.posCurve = new CatmullRomCurve3(this.keys.map((k) => k.pos), false, 'centripetal', 0.5);
      this.tgtCurve = new CatmullRomCurve3(this.keys.map((k) => k.target), false, 'centripetal', 0.5);
    }
  }

  /** Phones: hero stage strip at the top of the page (document coords → fractions of the viewport height). */
  heroStage(height) {
    const i = this.ids.indexOf('hero');
    const st = i >= 0 && this.sections[i].querySelector('.st__stage');
    if (!st) return null;
    const r = st.getBoundingClientRect();
    if (!(r.height > 0)) return null;
    const y = window.scrollY || window.pageYOffset || 0;
    return { cy: (r.top + y + r.height / 2) / height, h: r.height / height };
  }

  /** Viewport changed but the framing keys stay (e.g. mobile URL bar collapsing). */
  setViewport(width, height) { this.width = width; this.height = height; }

  /** Finale ring descriptor (where the subject worlds gather), or null. */
  get ring() {
    const k = this.keys && this.keys.find((x) => x.ring);
    return k ? k.ring : null;
  }

  /** Settled on-screen position (px) of the station key's focus point. */
  screenPos(i) {
    const k = this.keys[clamp(i, 0, this.n - 1)];
    return { x: Math.round(k.px * this.width), y: Math.round(k.py * this.height) };
  }

  /** Forget the cached section geometry (resize, content height change, pin set-up). */
  invalidate() { this.geo = null; }

  /**
   * Document-space top/height of every section, measured once and reused on every frame: reading
   * getBoundingClientRect() inside the render loop forced a full style + layout pass whenever the page had written
   * anything that frame (day-section vars, pin transforms) — the main source of scroll jank. A pinned section is
   * measured through its GSAP pin-spacer (same hold interval: spacer top ≤ 0 … spacer bottom ≥ viewport).
   */
  geometry() {
    if (this.geo) return this.geo;
    const y = window.scrollY || window.pageYOffset || 0;
    this.geo = this.sections.map((s) => {
      const box = s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s;
      const r = box.getBoundingClientRect();
      const st = s.querySelector('.st__stage');
      const sr = st ? st.getBoundingClientRect() : null;
      return { top: r.top + y, height: r.height, stage: sr && sr.height > 0 ? sr.top + y + sr.height / 2 : null };
    });
    return this.geo;
  }

  /** Continuous index from section rects: holds on a station while its section covers the viewport centre. */
  measure() {
    const vh = window.innerHeight || this.height;
    const vc = vh * 0.5;
    const n = this.n;
    const geo = this.geometry();
    const sy = window.scrollY || window.pageYOffset || 0;
    let prevB = null, prevI = 0;
    let result = null;
    for (let i = 0; i < n; i++) {
      const g = geo[i];
      const r = { top: g.top - sy, bottom: g.top - sy + g.height };
      const h = g.height;
      const half = Math.min(h, vh) * 0.5;
      // phones: arrive while the incoming section's stage rises into view (its top at ~45 % of the screen) — not only
      // once it has reached the top — so the object is already there, riding up with its stage (see stagePy)
      const a = this.width < 900 && i > 0 ? r.top + Math.min(half, vh * 0.05) : r.top + half;
      const b = r.bottom - half; // hold interval (viewport coords)
      if (i === 0 && vc <= b) { result = 0; break; }
      if (vc >= a && vc <= b) { result = i; break; }
      if (prevB !== null && vc > prevB && vc < a) {
        const f = (vc - prevB) / Math.max(1, a - prevB);
        result = prevI + f;
        break;
      }
      prevB = b; prevI = i;
    }
    if (result === null) result = n - 1;
    this.target = clamp(result, 0, n - 1);
    return this.target;
  }

  /** Advance damped progress. snap=true → jump (paused / reduced motion). */
  step(dt, snap) {
    if (snap || this.first) {
      this.float = snap ? Math.round(this.target) : this.target;
      this.first = false;
    } else {
      // critically-damped glide; faster when far away so big jumps (anchor links) do not take forever
      const gap = Math.abs(this.target - this.float);
      const k = 3.2 + Math.min(gap, 4) * 1.2;
      this.float += (this.target - this.float) * damp(k, dt);
      if (Math.abs(this.target - this.float) < 1e-4) this.float = this.target;
    }
    return this.float;
  }

  /** Eased parameter so the camera lingers at stations and travels between them. */
  shaped(f) {
    const i = Math.floor(f), fr = f - i;
    const e = fr * fr * (3 - 2 * fr);
    return i + MathUtils.lerp(fr, e, 0.55);
  }

  /**
   * Phones: vertical placement follows the station's stage while it is still below its resting spot (the object
   * rises with its section instead of waiting hidden behind the previous card), then rests at the key's py while the
   * text card scrolls over it.
   */
  stagePy(f) {
    const i = Math.floor(f), fr = f - i;
    const H = this.height, sy = window.scrollY || window.pageYOffset || 0;
    const geo = this.geo;
    const at = (k) => {
      const key = this.keys[clamp(k, 0, this.n - 1)];
      const g = geo && geo[clamp(k, 0, this.n - 1)];
      if (!g || g.stage == null || k <= 0 || key.wide > 0.5) return key.py;
      return Math.min(1.1, Math.max(key.py, (g.stage - sy) / H));
    };
    return MathUtils.lerp(at(i), at(i + 1), smoothstep(0, 1, fr));
  }

  /** Blend of per-key scalar */
  keyScalar(f, name) {
    const i = Math.floor(f), fr = f - i;
    const a = this.keys[clamp(i, 0, this.n - 1)][name];
    const b = this.keys[clamp(i + 1, 0, this.n - 1)][name];
    return MathUtils.lerp(a, b, smoothstep(0, 1, fr));
  }

  apply(time, dt, { animate }) {
    const cam = this.camera;
    const f = this.float;
    const s = this.shaped(f);
    const u = this.n > 1 ? s / (this.n - 1) : 0;
    if (this.posCurve) {
      this.posCurve.getPoint(u, _p);
      this.tgtCurve.getPoint(u, _t);
    } else {
      _p.copy(this.keys[0].pos); _t.copy(this.keys[0].target);
    }
    // segments with a via-point (pull back, then push in): quadratic Bézier + late target swing
    const si = Math.floor(s), sfr = s - si;
    const ka = this.keys[clamp(si, 0, this.n - 1)], kb = this.keys[si + 1];
    if (kb && kb.via && sfr > 0) {
      const a = (1 - sfr) * (1 - sfr), b = 2 * sfr * (1 - sfr), c = sfr * sfr;
      _p.set(0, 0, 0).addScaledVector(ka.pos, a).addScaledVector(kb.via, b).addScaledVector(kb.pos, c);
      _t.copy(ka.target).lerp(kb.target, smoothstep(0.3, 0.95, sfr));
    } else if (kb && sfr > 0 && !(ka.wide > 0.5 && kb.wide > 0.5)) {
      // look ahead: bias the aim towards the incoming station so the next world enters the frame early
      _t.lerp(kb.target, LOOK_AHEAD * bump(Math.min(1, sfr * 1.15)));
    }

    // wide shots: slow orbit around the universe; the day section adds a day-progress driven swing
    const wide = this.keyScalar(f, 'wide');
    const solo = this.keyScalar(f, 'solo');
    const dayIdx = this.ids.indexOf('day');
    if (wide > 0.001) {
      let ang = 0;
      if (animate) this.orbit += dt * 0.035;
      ang += Math.sin(this.orbit) * 0.07 * wide * (1 - 0.7 * solo);
      if (dayIdx >= 0) {
        const wd = clamp(1 - Math.abs(f - dayIdx));
        ang += (this.dayProgress - 0.5) * 0.5 * wd;
      }
      if (ang) {
        _p.sub(_t).applyAxisAngle(Y, ang).add(_t);
      }
    }

    // mouse parallax (camera-space shift)
    const px = this.parallax;
    const k = animate ? damp(3, dt) : 1;
    px.x += (px.tx - px.x) * k;
    px.y += (px.ty - px.y) * k;
    _fwd.copy(_t).sub(_p);
    const dist = _fwd.length();
    _fwd.normalize();
    _right.crossVectors(_fwd, Y).normalize();
    _up.crossVectors(_right, _fwd).normalize();
    const amp = Math.min(0.9, 0.045 * dist) * (1 - 0.6 * wide);
    _p.addScaledVector(_right, px.x * amp).addScaledVector(_up, -px.y * amp * 0.7);
    // idle breathing
    if (animate) _p.y += Math.sin(time * 0.6) * 0.05 * (1 - wide);

    cam.position.copy(_p);
    {
      const i = Math.floor(f), fr = f - i;
      const ua = this.keys[clamp(i, 0, this.n - 1)].up, ub = this.keys[clamp(i + 1, 0, this.n - 1)].up;
      cam.up.copy(ua).lerp(ub, smoothstep(0, 1, fr)).normalize();
    }
    cam.lookAt(_t);
    this.lookAt.copy(_t);

    const fov = this.keyScalar(f, 'fov');
    if (Math.abs(cam.fov - fov) > 1e-3) cam.fov = fov;

    // screen placement via view offset
    const pxs = this.keyScalar(f, 'px'), pys = this.width < 900 ? this.stagePy(f) : this.keyScalar(f, 'py');
    const W = this.width, H = this.height;
    cam.aspect = W / H;
    cam.setViewOffset(W, H, -(pxs - 0.5) * W, -(pys - 0.5) * H, W, H);
    cam.updateProjectionMatrix();
    return { wide, solo };
  }

  get universe() { return UNIVERSE; }
}
