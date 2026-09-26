// "Universe of knowledge" constellation for wide shots: glowing nodes at every station + flowing dotted links.
import {
  BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color, Group, Vector3, NormalBlending,
} from 'three';
import { makeHalo } from './materials.js';
import { THEMES, smooth } from './palette.js';

const LINK_VERT = /* glsl */`
  attribute float aAlong;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  varying float vB;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float w = fract(aAlong * 0.035 - uTime * 0.18 + aSeed);
    vB = 0.35 + 0.65 * pow(smoothstep(0.75, 1.0, w), 2.0);
    gl_PointSize = uPx * (1.4 + vB * 1.6);
  }
`;
const LINK_FRAG = /* glsl */`
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform float uTone;
  uniform float uOpacity;
  varying float vB;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vB * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uDark, uLight, uTone), a * mix(0.9, 0.7, uTone));
  }
`;

export function createConstellation(anchors, order, { low = false, mobile = false } = {}) {
  const big = mobile ? 1.6 : 1;
  const group = new Group();
  group.name = 'constellation';
  const ids = order.filter((id) => anchors[id]);
  const nodes = [];
  ids.forEach((id) => {
    const th = THEMES[id] || THEMES.hero;
    const isHome = id === 'hero';
    const halo = makeHalo(th.accent, (isHome ? 30 : 26) * big, 0.5, false);
    const coreSize = (isHome ? 7 : 5) * (low ? 1.8 : 1) * big;
    const core = makeHalo(isHome ? '#FFE3A1' : th.accent, coreSize, 0.95, false);
    halo.position.copy(anchors[id]);
    core.position.copy(anchors[id]);
    group.add(halo, core);
    nodes.push({ id, halo, core, base: (isHome ? 30 : 26) * big, coreBase: coreSize, color: new Color(isHome ? '#FFE3A1' : th.accent) });
  });

  // links: the journey chain + a few cross links
  const pairs = [];
  for (let i = 0; i < ids.length - 1; i++) pairs.push([ids[i], ids[i + 1]]);
  const extra = [['math', 'chemistry'], ['physics', 'informatics'], ['biology', 'geography'], ['languages', 'arts'], ['hero', 'geography'], ['hero', 'arts']];
  extra.forEach(([a, b]) => { if (anchors[a] && anchors[b]) pairs.push([a, b]); });
  const pos = [], along = [], seed = [];
  const v = new Vector3();
  // every link point remembers its pair + fraction, so links follow the worlds when they move (finale gathering)
  const lpA = [], lpB = [], lpT = [];
  const nodeIndex = (id) => ids.indexOf(id);
  pairs.forEach(([a, b], pi) => {
    const A = anchors[a], B = anchors[b];
    const len = A.distanceTo(B);
    const n = Math.max(4, Math.floor(len / 1.6));
    for (let i = 1; i < n; i++) {
      v.lerpVectors(A, B, i / n);
      pos.push(v.x, v.y, v.z);
      along.push((i / n) * len);
      seed.push(pi * 0.173);
      lpA.push(nodeIndex(a)); lpB.push(nodeIndex(b)); lpT.push(i / n);
    }
  });
  const posArr = new Float32Array(pos);
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(posArr, 3));
  g.setAttribute('aAlong', new Float32BufferAttribute(along, 1));
  g.setAttribute('aSeed', new Float32BufferAttribute(seed, 1));
  const mat = new ShaderMaterial({
    vertexShader: LINK_VERT, fragmentShader: LINK_FRAG, transparent: true, depthWrite: false, blending: NormalBlending,
    uniforms: {
      uTime: { value: 0 }, uPx: { value: 1 }, uTone: { value: 0 }, uOpacity: { value: 0 },
      uDark: { value: new Color('#CFE6FF') }, uLight: { value: new Color('#1B2A6B') },
    },
  });
  const links = new Points(g, mat);
  links.frustumCulled = false;
  links.renderOrder = 1;
  group.add(links);
  group.visible = false;

  const posAttr = g.attributes.position;
  const cur = nodes.map((n) => n.halo.position.clone());
  const last = cur.map((p) => p.clone());
  const shown = nodes.map(() => true);

  return {
    group,
    /**
     * @param {number} time
     * @param {object} o  {wide, solo, tone, pxScale, pulse, camera, height, locate(id, out) → visible}
     */
    update(time, { wide, solo = 0, tone, pxScale, pulse = 0, camera, height = 900, locate = null }) {
      group.visible = wide > 0.01;
      if (!group.visible) return;
      // nodes sit on the worlds' CURRENT positions (they fly to the shanyrak in the finale)
      let moved = false;
      nodes.forEach((n, i) => {
        if (locate) shown[i] = locate(n.id, cur[i]) !== false;
        if (!cur[i].equals(last[i])) { moved = true; last[i].copy(cur[i]); }
        n.halo.position.copy(cur[i]);
        n.core.position.copy(cur[i]);
      });
      if (moved) {
        for (let k = 0; k < lpT.length; k++) {
          v.lerpVectors(cur[lpA[k]], cur[lpB[k]], lpT[k]);
          posArr[k * 3] = v.x; posArr[k * 3 + 1] = v.y; posArr[k * 3 + 2] = v.z;
        }
        posAttr.needsUpdate = true;
      }
      // finale: the worlds carry their own glow — the map (links, cores) dissolves as they gather
      const map = 1 - smooth(0.1, 0.5, solo);
      links.visible = map > 0.01;
      const u = mat.uniforms;
      u.uTime.value = time; u.uPx.value = pxScale; u.uTone.value = tone; u.uOpacity.value = wide * map;
      nodes.forEach((n, i) => {
        const tw = 1 + 0.08 * Math.sin(time * 1.3 + i * 1.7) + (n.id === 'hero' ? pulse * 0.6 : 0);
        // fade nodes the camera is close to (finale close-up of the shanyrak)
        const near = camera ? smooth(16, 70, camera.position.distanceTo(n.halo.position)) : 1;
        const on = shown[i] ? 1 : 0;
        n.halo.material.opacity = wide * (0.34 - tone * 0.1) * tw * near * on * (1 - 0.75 * smooth(0.1, 0.6, solo));
        n.core.material.opacity = wide * 0.95 * near * on * map;
        // cores: the world's own accent at full saturation (no dark ink smudges on the light paper theme)
        n.core.material.color.copy(n.color);
        // cap the on-screen size so nodes near the camera never become big bokeh blobs
        let hs = n.base * tw, cs = n.coreBase;
        if (camera) {
          const dist = camera.position.distanceTo(n.halo.position);
          const worldPerPx = (2 * dist * Math.tan((camera.fov * Math.PI) / 360)) / height;
          hs = Math.min(hs, height * (0.2 - 0.1 * solo) * worldPerPx);
          cs = Math.min(cs, height * 0.03 * worldPerPx);
        }
        n.halo.scale.setScalar(hs);
        n.core.scale.setScalar(cs);
        n.halo.visible = n.halo.material.opacity > 0.005; // skip fill-rate for faded sprites
        n.core.visible = n.core.material.opacity > 0.005;
      });
    },
    dispose() {
      g.dispose(); mat.dispose();
      nodes.forEach((n) => { n.halo.material.dispose(); n.core.material.dispose(); });
    },
  };
}
