// Material helpers: shader patching (rim / fresnel, custom emissive), shared sprite textures, canvas text.
import {
  CanvasTexture, Color, SRGBColorSpace, SpriteMaterial, Sprite, AdditiveBlending, NormalBlending,
  LinearMipmapLinearFilter, LinearFilter,
} from 'three';

let patchId = 0;

/**
 * Patch a built-in lit material (Standard/Physical) with extra GLSL.
 *  - uniforms: {name: {value}} (also exposed as material.userData.u)
 *  - vertexPars / vertexMain (after <begin_vertex>; `transformed` = local position)
 *  - fragPars / fragMain (before <opaque_fragment>; `outgoingLight`, `normal` (view), `vViewPosition` available)
 */
export function patchMaterial(material, { uniforms = {}, vertexPars = '', vertexMain = '', fragPars = '', fragMain = '' }) {
  const key = 'kp' + (++patchId);
  material.userData.u = Object.assign(material.userData.u || {}, uniforms);
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, r) => {
    if (prev) prev(shader, r);
    Object.assign(shader.uniforms, material.userData.u);
    if (vertexPars || vertexMain) {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\n' + vertexPars)
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + vertexMain);
    }
    if (fragPars || fragMain) {
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\n' + fragPars)
        .replace('#include <opaque_fragment>', fragMain + '\n#include <opaque_fragment>');
    }
  };
  const prevKey = material.customProgramCacheKey ? material.customProgramCacheKey.bind(material) : () => '';
  material.customProgramCacheKey = () => prevKey() + key;
  return material.userData.u;
}

/** Fresnel rim light. Returns the uniforms ({uRimColor, uRimPower, uRimStrength}) for animation (hover glow). */
export function addRim(material, { color = '#ffffff', power = 2.5, strength = 0.8 } = {}) {
  return patchMaterial(material, {
    uniforms: {
      uRimColor: { value: new Color(color) },
      uRimPower: { value: power },
      uRimStrength: { value: strength },
    },
    fragPars: 'uniform vec3 uRimColor; uniform float uRimPower; uniform float uRimStrength;',
    fragMain: `{
      float rimF = pow(1.0 - saturate(abs(dot(normalize(normal), normalize(vViewPosition)))), uRimPower);
      outgoingLight += uRimColor * rimF * uRimStrength;
    }`,
  });
}

// ---------------------------------------------------------------- shared textures
const shared = new Map();
function cached(key, make) {
  if (!shared.has(key)) shared.set(key, make());
  return shared.get(key);
}
export function disposeSharedTextures() {
  for (const t of shared.values()) t.dispose && t.dispose();
  shared.clear();
}

/** Soft radial glow (white, alpha falloff). */
export function glowTexture() {
  return cached('glow', () => {
    const s = 128, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.18, 'rgba(255,255,255,0.72)');
    grd.addColorStop(0.45, 'rgba(255,255,255,0.18)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  });
}

/** Crisp round dot with soft edge (for point sprites). */
export function dotTexture() {
  return cached('dot', () => {
    const s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.55, 'rgba(255,255,255,1)');
    grd.addColorStop(0.8, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  });
}

/** Additive (dark themes) or normal (light themes) halo sprite. */
export function makeHalo(color, size = 1, opacity = 0.6, additive = true) {
  const m = new SpriteMaterial({
    map: glowTexture(), color: new Color(color), transparent: true, opacity,
    depthWrite: false, blending: additive ? AdditiveBlending : NormalBlending, toneMapped: false,
  });
  const s = new Sprite(m);
  s.scale.setScalar(size);
  s.renderOrder = 2;
  return s;
}

// ---------------------------------------------------------------- fonts & canvas text
const fontWaits = new Map();
/** Resolve (true) when `spec` (e.g. "600 120px Lora") has loaded — even late — so textures can be redrawn. Never rejects. */
export function whenFont(spec) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve(false);
  if (!fontWaits.has(spec)) {
    fontWaits.set(spec, document.fonts.load(spec).then((f) => f.length > 0).catch(() => false));
  }
  return fontWaits.get(spec);
}

/**
 * Draw text into a canvas texture. Returns {texture, aspect, redraw()}.
 * opts: font (CSS family list), weight, px, color, stroke, strokeWidth, shadow, pad, bg
 */
export function textTexture(text, opts = {}) {
  const o = Object.assign({ font: 'Onest, system-ui, sans-serif', weight: 600, px: 96, color: '#fff', pad: 0.25 }, opts);
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = 4;
  const res = { texture, aspect: 1, canvas: c };
  const draw = () => {
    const fontStr = `${o.italic ? 'italic ' : ''}${o.weight} ${o.px}px ${o.font}`;
    g.font = fontStr;
    const m = g.measureText(text);
    const pad = Math.round(o.px * o.pad);
    const w = Math.ceil(m.width + pad * 2);
    const h = Math.ceil(o.px * 1.35 + pad * 2);
    // size may change once the web font arrives: free the (immutable) GPU storage so it is re-allocated
    if ((c.width !== w || c.height !== h) && texture.version > 0) texture.dispose();
    c.width = w; c.height = h;
    g.font = fontStr;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    if (o.bg) { g.fillStyle = o.bg; roundRect(g, 0, 0, w, h, Math.min(w, h) * 0.3); g.fill(); }
    if (o.shadow) { g.shadowColor = o.shadow; g.shadowBlur = o.px * 0.18; }
    if (o.stroke) { g.lineWidth = o.strokeWidth || o.px * 0.08; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(text, w / 2, h / 2 + o.px * 0.04); }
    g.fillStyle = o.color;
    g.fillText(text, w / 2, h / 2 + o.px * 0.04);
    res.aspect = w / h;
    texture.needsUpdate = true;
  };
  draw();
  res.redraw = draw;
  return res;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Dispose every geometry/material/texture below `root` (skips shared textures). */
export function disposeTree(root) {
  const sharedSet = new Set(shared.values());
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      for (const k in m) {
        const v = m[k];
        if (v && v.isTexture && !sharedSet.has(v)) v.dispose();
      }
      if (m.uniforms) {
        for (const k in m.uniforms) {
          const v = m.uniforms[k] && m.uniforms[k].value;
          if (v && v.isTexture && !sharedSet.has(v)) v.dispose();
        }
      }
      m.dispose();
    }
  });
}

/**
 * Ink edge: darkens grazing-angle fragments (and slightly the whole surface) towards `color` by `uInkAmt` —
 * outlines pale objects (paper pages) on pale backgrounds. Returns the uniforms ({uInk, uInkAmt}).
 */
export function addInkEdge(material, { color = '#2A1A1F', power = 1.6, tint = 0.14 } = {}) {
  return patchMaterial(material, {
    uniforms: { uInk: { value: new Color(color) }, uInkAmt: { value: 0 } },
    fragPars: 'uniform vec3 uInk; uniform float uInkAmt;',
    fragMain: `{
      float inkF = pow(1.0 - saturate(abs(dot(normalize(normal), normalize(vViewPosition)))), ${power.toFixed(2)});
      outgoingLight = mix(outgoingLight, uInk, clamp(uInkAmt * (${tint.toFixed(2)} + 0.85 * inkF), 0.0, 1.0));
    }`,
  });
}
