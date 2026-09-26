// World layout: where every station's object lives, how the camera frames it, and where it sits on screen.
import { Vector3 } from 'three';

export const ORDER = [
  'hero', 'about', 'math', 'physics', 'chemistry', 'biology', 'geography', 'languages', 'informatics', 'arts',
  'day', 'levels', 'admission', 'news', 'contacts', 'finale',
];

/** Stations that own a 3D object (module in ../stations/<id>.js). */
export const OBJECT_STATIONS = ['hero', 'math', 'physics', 'chemistry', 'biology', 'geography', 'languages', 'informatics', 'arts'];

/** Desktop screen side of the object (SPEC §3 placement table). */
export const SIDE = {
  hero: 'right', about: 'center', math: 'right', physics: 'left', chemistry: 'right', biology: 'left',
  geography: 'right', languages: 'left', informatics: 'right', arts: 'left',
};

/** Bounding radius used for framing + hit testing (object local units). */
export const RADIUS = {
  hero: 2.7, math: 2.9, physics: 2.7, chemistry: 2.7, biology: 2.9, geography: 2.3, languages: 3.3, informatics: 2.5, arts: 2.4,
};

/** Fraction of viewport height the object's diameter should cover (desktop). */
const FILL = { hero: 0.62, math: 0.64, physics: 0.66, chemistry: 0.56, biology: 0.5, geography: 0.6, languages: 0.66, informatics: 0.5, arts: 0.56 };
/** Phones: extra shrink for objects that reach down into the text card (globe, open book, tall helix). */
const FILL_MOBILE = { geography: 0.85, languages: 0.85, biology: 0.85 };
/** Desktop horizontal placement per side (math/physics sit a little further out: they are drawn bigger). */
const PX = { hero: 0.68, math: 0.715, physics: 0.285 };

/** Object scale in wide shots (constellation of little worlds) — the shanyrak is the home: always the biggest. */
export const WIDE_GROW = 1.8;          // subject objects: × (1 + WIDE_GROW)
export const WIDE_GROW_HERO = 1.05;    // shanyrak: × (1 + WIDE_GROW_HERO) ≈ ×2

// ------------------------------------------------------------------ anchors: a slowly widening spiral beyond the shanyrak
// Seen from behind the shanyrak the eight subject worlds form a ring around the page's centre column (wide shots), while
// neighbouring stations stay close enough (≈ 26 units) that a flight never crosses empty space for long.
export const HELIX = { r: 14, y: 22, step: 0.72, th0: 3.5, cone: 0.1, z0: -16, dz: 24 };
export const ANCHORS = {};
ANCHORS.hero = new Vector3(0, 0, 0);
OBJECT_STATIONS.slice(1).forEach((id, i) => {
  const k = i + 1, h = HELIX;
  const th = h.th0 + k * h.step;
  const cf = 1 + h.cone * (k - 1);
  ANCHORS[id] = new Vector3(Math.sin(th) * h.r * cf, h.y + Math.cos(th) * h.r * cf, h.z0 - (k - 1) * h.dz);
});

/** Centre + radius of the whole constellation (for wide shots). */
export const UNIVERSE = (() => {
  const c = new Vector3();
  const ids = OBJECT_STATIONS;
  ids.forEach((id) => c.add(ANCHORS[id]));
  c.multiplyScalar(1 / ids.length);
  let r = 0;
  ids.forEach((id) => { r = Math.max(r, ANCHORS[id].distanceTo(c)); });
  return { center: c, radius: r };
})();

// camera approach direction (from object towards camera), per object station
const DIR = {
  hero: new Vector3(0.12, -0.3, 1),
  math: new Vector3(0.28, 0.22, 1),
  physics: new Vector3(-0.3, 0.12, 1),
  chemistry: new Vector3(0.26, 0.28, 1),
  biology: new Vector3(-0.22, 0.08, 1),
  geography: new Vector3(0.18, 0.2, 1),
  languages: new Vector3(-0.28, 0.36, 1),
  informatics: new Vector3(0.34, 0.3, 1),
  arts: new Vector3(-0.2, 0.1, 1),
};
for (const k in DIR) DIR[k].normalize();

/**
 * Wide shots: camera azimuth / elevation (deg, around the look-at point), roll (deg), look-at point
 * (universe centre → shanyrak by `tau`), telephoto fov. The distance is fitted at runtime so every world stays inside
 * 6–94 % of the viewport. Chosen offline (scratchpad wsearch.mjs): the worlds ring the centre column, the shanyrak sits
 * low, near the centre (contacts: centre-bottom, the other worlds arcing above it).
 */
const WIDE = {
  desktop: {
    day: { az: 24, el: -5, roll: 0, tau: 0.4, fov: 18, margin: 0.1 },
    levels: { az: 18, el: -5, roll: 0, tau: 0.4, fov: 18 },
    admission: { az: 15, el: -10, roll: 5, tau: 0.4, fov: 18 },
    news: { az: 21, el: -5, roll: -5, tau: 0.4, fov: 18 },
    contacts: { az: 3, el: -5, roll: 20, tau: 0.2, fov: 18 },
  },
  mobile: {
    day: { az: -12, el: 5, roll: -20, tau: 0.4, fov: 30, margin: 0.1 },
    levels: { az: -12, el: 10, roll: -25, tau: 0.4, fov: 28 },
    admission: { az: -9, el: 15, roll: -15, tau: 0.4, fov: 28 },
    news: { az: -15, el: 10, roll: -30, tau: 0.4, fov: 28 },
    contacts: { az: -6, el: 15, roll: -10, tau: 0.4, fov: 28 },
  },
};

const Y = new Vector3(0, 1, 0);
const _f = new Vector3(), _r = new Vector3(), _u = new Vector3(), _rel = new Vector3(), _c = new Vector3();

/** Camera basis for a camera looking along `fwd` with the world up rolled by `rollDeg`. */
function basis(fwd, rollDeg, outRight, outUp) {
  outRight.crossVectors(fwd, Y).normalize();
  outUp.crossVectors(outRight, fwd).normalize();
  if (rollDeg) {
    const a = (rollDeg * Math.PI) / 180;
    outRight.applyAxisAngle(fwd, a);
    outUp.applyAxisAngle(fwd, a);
  }
}

/** Do all worlds (spheres) fit inside [m, 1-m] of the screen for a camera at `pos`? */
function fitsAt(pos, fwd, right, up, spheres, { tanH, aspect, px, py, m }) {
  for (const s of spheres) {
    _rel.copy(s.c).sub(pos);
    const z = _rel.dot(fwd);
    if (z < 4) return false;
    const kx = 1 / (z * tanH * aspect * 2), ky = 1 / (z * tanH * 2);
    const sx = px + _rel.dot(right) * kx, sy = py - _rel.dot(up) * ky;
    const rx = s.r * kx, ry = s.r * ky;
    if (sx - rx < m || sx + rx > 1 - m || sy - ry < m || sy + ry > 1 - m) return false;
  }
  return true;
}

/** Wide-shot spheres: every object at its anchor with its wide-shot size. */
function wideSpheres() {
  return OBJECT_STATIONS.map((id) => ({
    c: ANCHORS[id],
    r: RADIUS[id] * (1 + (id === 'hero' ? WIDE_GROW_HERO : WIDE_GROW)),
  }));
}

/**
 * Build camera keys for the given ordered station ids.
 * @returns {{pos:Vector3, target:Vector3, px:number, py:number, wide:number, solo:number, fov:number, up:Vector3}[]}
 */
export function buildKeys(ids, { width, height, heroStage = null }) {
  const aspect = width / Math.max(1, height);
  const desktop = width >= 900;
  const fov = aspect < 0.8 ? 50 : 40;
  const tanH = Math.tan((fov * Math.PI) / 360);
  const keys = [];
  const U = UNIVERSE;
  const spheres = wideSpheres();

  const objectKey = (id) => {
    const r = RADIUS[id];
    let fill = FILL[id];
    if (!desktop) fill = Math.min(fill * 0.66, 0.78 * aspect) * (FILL_MOBILE[id] || 1);
    // desktop side placement: keep the object's visible edge clear of a ~45 % text column on narrower screens
    else if (SIDE[id] === 'left' || SIDE[id] === 'right') fill = Math.min(fill, 0.4 * aspect);
    // phones: the shanyrak fits the hero's own stage strip (between the header and the headline), never the header
    if (!desktop && id === 'hero' && heroStage) fill = Math.min(fill, Math.max(0.16, heroStage.h * 0.98));
    const d = r / (fill * tanH);
    const pos = ANCHORS[id].clone().addScaledVector(DIR[id], d);
    const side = SIDE[id];
    let px = 0.5, py = 0.5;
    if (desktop) {
      px = PX[id] || (side === 'right' ? 0.7 : side === 'left' ? 0.3 : 0.5);
      py = 0.52;
    } else {
      px = 0.5; py = id === 'hero' ? (heroStage ? Math.min(0.45, Math.max(0.2, heroStage.cy)) : 0.3) : 0.24;
    }
    return { pos, target: ANCHORS[id].clone(), px, py, wide: 0, solo: 0, fov, up: Y.clone() };
  };

  for (const id of ids) {
    if (OBJECT_STATIONS.includes(id)) { keys.push(objectKey(id)); continue; }
    if (id === 'about') {
      // camera sits just under the crown, looking up through the lattice towards the sky of stations
      keys.push({
        pos: new Vector3(0.3, -2.4, 0.7),
        target: new Vector3(0.05, 6, -2.6),
        px: 0.5, py: desktop ? 0.5 : 0.4, wide: 0, solo: 0, fov: desktop ? 60 : 72, up: Y.clone(),
      });
      continue;
    }
    if (id === 'finale') { keys.push(finaleKey({ desktop, aspect, fov, tanH, width, height })); continue; }
    const cfg = (desktop ? WIDE.desktop : WIDE.mobile)[id] || (desktop ? WIDE.desktop.levels : WIDE.mobile.levels);
    const wfov = cfg.fov;
    const wtan = Math.tan((wfov * Math.PI) / 360);
    const az = (cfg.az * Math.PI) / 180, el = (cfg.el * Math.PI) / 180;
    const dir = new Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    const target = U.center.clone().lerp(ANCHORS.hero, cfg.tau);
    const fwd = dir.clone().negate();
    const right = new Vector3(), up = new Vector3();
    basis(fwd, cfg.roll, right, up);
    const px = 0.5, py = desktop ? 0.5 : 0.45;
    const opt = { tanH: wtan, aspect, px, py, m: cfg.margin || 0.065 };
    // fit: the closest distance at which every world is inside the safe frame
    let lo = 20, hi = 4000;
    const pos = new Vector3();
    for (let i = 0; i < 36; i++) {
      const mid = (lo + hi) / 2;
      pos.copy(target).addScaledVector(dir, mid);
      if (fitsAt(pos, fwd, right, up, spheres, opt)) hi = mid; else lo = mid;
    }
    pos.copy(target).addScaledVector(dir, hi);
    keys.push({ pos, target, px, py, wide: 1, solo: 0, fov: wfov, up });
  }
  // flights that must keep the constellation in frame: pull back first, then push in (quadratic via-point)
  const fi = ids.indexOf('finale');
  if (fi > 0 && keys[fi - 1].wide > 0.5) {
    const a = keys[fi - 1], b = keys[fi];
    const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5);
    const out = mid.clone().sub(U.center).normalize();
    b.via = U.center.clone().addScaledVector(out, a.pos.distanceTo(U.center) * 1.05);
  }
  return keys;
}

/**
 * Finale: back home — the shanyrak glows in the upper part of the screen, seen slightly from below, and the subject
 * worlds gather around it on explicit, non-overlapping screen slots (StationManager flies them there, see `ring`).
 * Desktop: two wings of four on a gentle arc left/right of the crown. Phones: two rows of four under the crown.
 */
function finaleKey({ desktop, aspect, fov, tanH, width, height }) {
  const U = UNIVERSE;
  const toU = U.center.clone().sub(ANCHORS.hero).normalize();
  const D = desktop ? 17 : 27;
  const pos = ANCHORS.hero.clone().addScaledVector(toU, -D).add(new Vector3(0, desktop ? -1.2 : -1.6, 0));
  const target = ANCHORS.hero.clone();
  const fwd = target.clone().sub(pos).normalize();
  const right = new Vector3(), up = new Vector3();
  basis(fwd, 0, right, up);
  const px = 0.5, py = desktop ? 0.28 : 0.165;
  const depth = target.clone().sub(pos).dot(fwd);
  // shanyrak screen radius (fraction of height) incl. the roof poles
  const heroR = (RADIUS.hero * 1.2) / (depth * tanH * 2);
  const slots = [];
  // screen slot (sx, sy as fractions; r = radius as fraction of height) → world position + world radius at depth z
  const put = (sx, sy, r, dz) => {
    const z = depth + dz;
    const x = (sx - px) * 2 * z * tanH * aspect;
    const y = (py - sy) * 2 * z * tanH;
    slots.push({ pos: pos.clone().addScaledVector(fwd, z).addScaledVector(right, x).addScaledVector(up, y), r: r * 2 * z * tanH });
  };
  if (desktop) {
    // offsets from the crown centre in units of viewport height; squeezed on narrower screens. Two staggered rows per
    // wing, all above ~43 % of the screen: the KEREMET wordmark (home.css .finale__word, top at 44svh when the section
    // reaches the top of the viewport) and the CTA card below it never sit on a world.
    const ARC = [[0.40, -0.12], [0.62, -0.08], [0.50, 0.06], [0.72, 0.07]];
    const r = 0.082;
    const maxX = 0.5 * aspect - r - 0.05;
    const kx = Math.min(1, maxX / 0.72);
    const cy = py;
    // right wing (first four worlds), then left wing — alternate depth by ±1 so neighbours never occlude
    for (const side of [1, -1]) {
      ARC.forEach(([dx, dy], j) => {
        const sx = 0.5 + (side * dx * kx) / aspect;
        put(sx, cy + dy, r, j % 2 ? 1 : -1);
      });
    }
  } else {
    // everything above the giant wordmark (it starts at ~42 % of the screen when the finale arrives): two worlds on
    // each side of the crown, four in a row under it. The wordmark + CTA card then scroll up over a finished picture.
    const r = Math.min(0.04 * aspect / 0.46, 0.046);
    const rx = r / aspect;                               // radius as a fraction of the width
    const sideX = Math.min(0.13, 0.02 + rx);
    const sideY = [py - 0.005, py + 0.11];
    [[sideX, sideY[0]], [1 - sideX, sideY[0]], [sideX + 0.02, sideY[1]], [1 - sideX - 0.02, sideY[1]]]
      .forEach(([sx, sy], j) => put(sx, sy, r, j % 2 ? 1 : -1));
    const rowY = Math.min(py + heroR * 0.9 + r + 0.035, 0.405 - r);
    [0.16, 0.39, 0.61, 0.84].forEach((sx, j) => put(sx, rowY, r, j % 2 ? -1 : 1));
  }
  const ring = { slots, heroR };
  return { pos, target, px, py, wide: 1, solo: 1, fov, up: Y.clone(), ring };
}
