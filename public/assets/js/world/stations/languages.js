// LANGUAGES — open book (page block, rounded spine, hard cover, soft contact shadow) + floating Scrabble-like letter
// tiles (Kazakh Cyrillic + Latin/Cyrillic). All tiles share one InstancedMesh and all glyphs one atlas InstancedMesh.
// Trick: a page flips, the tiles scatter and "KEREMET" rises out of the book, then everything settles back.
import {
  Group, Mesh, PlaneGeometry, CylinderGeometry, BufferGeometry, Float32BufferAttribute, InstancedMesh,
  InstancedBufferAttribute, MeshBasicMaterial, MeshStandardMaterial, MeshPhysicalMaterial, CanvasTexture,
  SRGBColorSpace, DoubleSide, RepeatWrapping, Vector3, Matrix4, Quaternion, Euler, Color, LinearMipmapLinearFilter,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Interactive, detail } from './_base.js';
import { whenFont, glowTexture, addInkEdge } from '../fx/materials.js';
import { clamp, easeOutBack, easeInOutCubic, easeOutCubic, rng } from '../fx/ease.js';

// SPEC §2: Ә Ғ Қ Ң Ө Ұ Ү Һ І А Z Я
const FLOAT = ['Ә', 'Ғ', 'Қ', 'Ң', 'Ө', 'Ұ', 'Ү', 'Һ', 'І', 'А', 'Z', 'Я'];
const WORD = ['K', 'E', 'R', 'E', 'M', 'E', 'T'];
const BURGUNDY = '#B0263E', NAVY = '#1D3557', INK = '#2A1A1F', IVORY = '#FFF4E0', CREAM = '#FFF8EC';
const CELL = 192, COLS = 6;
const PAGE_W = 1.45, PAGE_H = 1.95, BLOCK_BOTTOM = -0.06, BOOK_SCALE_DESKTOP = 1.3;
const TILE_D = 0.2; // tile depth (unit tile)

function atlasTexture(glyphs) {
  const rows = Math.ceil(glyphs.length / COLS);
  const c = document.createElement('canvas');
  c.width = COLS * CELL; c.height = rows * CELL;
  const g = c.getContext('2d');
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.anisotropy = 4;
  const draw = () => {
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `600 ${Math.round(CELL * 0.7)}px Lora, "Noto Serif", Georgia, "Times New Roman", serif`;
    glyphs.forEach((ch, i) => {
      const x = (i % COLS) * CELL + CELL / 2, y = Math.floor(i / COLS) * CELL + CELL / 2 + CELL * 0.03;
      g.fillText(ch, x, y);
    });
    tex.needsUpdate = true;
  };
  draw();
  return { tex, rows, redraw: draw };
}

function pageTexture(side) {
  const w = 384, h = 512;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#FFFCF4'; g.fillRect(0, 0, w, h);
  // gutter shadow
  const gr = side < 0 ? g.createLinearGradient(w, 0, w - 70, 0) : g.createLinearGradient(0, 0, 70, 0);
  gr.addColorStop(0, 'rgba(42,26,31,0.26)'); gr.addColorStop(1, 'rgba(42,26,31,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(29,53,87,0.2)'; g.lineWidth = 2;
  for (let y = 70; y < h - 20; y += 26) { g.beginPath(); g.moveTo(14, y); g.lineTo(w - 14, y); g.stroke(); }
  g.strokeStyle = 'rgba(176,38,62,0.55)'; g.lineWidth = 2.5;
  const mx = side < 0 ? 46 : w - 46;
  g.beginPath(); g.moveTo(mx, 0); g.lineTo(mx, h); g.stroke();
  // "handwriting" strokes
  const r = rng(side < 0 ? 5 : 9);
  g.strokeStyle = 'rgba(42,26,31,0.55)'; g.lineWidth = 3; g.lineCap = 'round';
  const x0 = side < 0 ? 60 : 30, x1 = side < 0 ? w - 30 : w - 60;
  for (let y = 70 + 26 * (side < 0 ? 0 : 5); y < h - 60; y += 26) {
    let x = x0 + (y === 70 ? 40 : 0);
    const end = x1 - r() * 90;
    g.beginPath();
    g.moveTo(x, y - 7);
    while (x < end) { const nx = x + 6 + r() * 10; g.quadraticCurveTo((x + nx) / 2, y - 7 - r() * 10, nx, y - 7 + r() * 2); x = nx; }
    g.stroke();
  }
  if (side > 0) {
    g.fillStyle = BURGUNDY;
    g.font = 'italic 600 120px Lora, Georgia, serif';
    g.textBaseline = 'alphabetic';
    g.fillText('Ә', 40, 160);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return { tex: t, canvas: c };
}

/** Page-edge texture: fine stacked-paper lines. */
function edgeTexture() {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#F4EBD8'; g.fillRect(0, 0, 8, 64);
  g.fillStyle = 'rgba(120,96,70,0.28)';
  for (let y = 0; y < 64; y += 4) g.fillRect(0, y, 8, 1);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/** Height of the page surface over the cover at fraction t (0 = spine … 1 = outer edge). */
const pageZ = (t) => 0.34 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.5) * (1 - 0.45 * t);

/** Curved single page: x from spine (0) outwards to `side`·W (used for the flipping page). */
function pageGeometry(side, W = PAGE_W, H = PAGE_H, lift = 0) {
  const g = new PlaneGeometry(W, H, 28, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + W / 2;
    p.setXYZ(i, side * x, p.getY(i), pageZ(x / W) + lift);
  }
  g.computeVertexNormals();
  return g;
}

/**
 * Solid half page-block: curved top (group 0, page texture), front/back/outer paper edges (group 1).
 * Built indexed per face so the top stays smooth and the edges stay crisp.
 */
function blockGeometry(side, N = 28) {
  const W = PAGE_W, H = PAGE_H;
  const pos = [], uv = [], idx = [];
  const quad = (a, b, c, d) => { if (side > 0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c); };
  // top
  const top0 = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = side * t * W, z = pageZ(t);
    pos.push(x, -H / 2, z, x, H / 2, z);
    const u = side > 0 ? t : 1 - t;
    uv.push(u, 0, u, 1);
  }
  for (let i = 0; i < N; i++) quad(top0 + i * 2, top0 + (i + 1) * 2, top0 + (i + 1) * 2 + 1, top0 + i * 2 + 1);
  const topCount = idx.length;
  // front (y = -H/2) and back (y = +H/2) strips
  for (const [y, flip] of [[-H / 2, false], [H / 2, true]]) {
    const b0 = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const t = i / N, x = side * t * W, z = pageZ(t);
      pos.push(x, y, BLOCK_BOTTOM, x, y, z);
      uv.push(t, 0, t, (z - BLOCK_BOTTOM) * 12);
    }
    for (let i = 0; i < N; i++) {
      const a = b0 + i * 2, b = b0 + (i + 1) * 2;
      if (!flip) quad(a, b, b + 1, a + 1); else quad(a, a + 1, b + 1, b);
    }
  }
  // outer edge (x = ±W)
  {
    const b0 = pos.length / 3, z = pageZ(1), x = side * W;
    pos.push(x, -H / 2, BLOCK_BOTTOM, x, H / 2, BLOCK_BOTTOM, x, H / 2, z, x, -H / 2, z);
    uv.push(0, 0, 1, 0, 1, (z - BLOCK_BOTTOM) * 12, 0, (z - BLOCK_BOTTOM) * 12);
    quad(b0, b0 + 1, b0 + 2, b0 + 3);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.addGroup(0, topCount, 0);
  g.addGroup(topCount, idx.length - topCount, 1);
  g.computeVertexNormals();
  return g;
}

export default function createLanguages(ctx) {
  const low = ctx.quality === 'low';
  // phones: bigger letter tiles (readable at ~390 css px) on a slightly smaller book
  const BOOK_SCALE = ctx.isMobile ? 1.1 : BOOK_SCALE_DESKTOP;
  const TILE_K = ctx.isMobile ? 1.25 : 1;
  const base = new Interactive({ tilt: 0.55 });
  const { group, spin } = base;

  // ---------------------------------------------------------------- book
  const book = new Group();
  book.position.set(0, -0.95, 0.2);
  book.rotation.set(-1.0, 0, 0.08);
  book.scale.setScalar(BOOK_SCALE);
  spin.add(book);
  const pl = pageTexture(-1), pr = pageTexture(1), et = edgeTexture();
  const pageMatL = new MeshStandardMaterial({ map: pl.tex, roughness: 0.9, side: DoubleSide });
  const pageMatR = new MeshStandardMaterial({ map: pr.tex, roughness: 0.9, side: DoubleSide });
  const edgeMat = new MeshStandardMaterial({ map: et, roughness: 1, side: DoubleSide });
  const gL = blockGeometry(-1, low ? 18 : 28), gR = blockGeometry(1, low ? 18 : 28);
  book.add(new Mesh(gL, [pageMatL, edgeMat]), new Mesh(gR, [pageMatR, edgeMat]));
  // light wide shots: cream pages on a cream background get an ink outline so the book keeps its shape
  const inks = [pageMatL, pageMatR, edgeMat].map((m) => addInkEdge(m, { color: '#3A2A2F' }));
  // hard cover boards + rounded spine (one merged mesh)
  const coverParts = [];
  for (const s of [-1, 1]) {
    const b = new RoundedBoxGeometry(PAGE_W + 0.1, PAGE_H + 0.16, 0.06, 2, 0.025);
    b.translate(s * (PAGE_W / 2 + 0.03), 0, BLOCK_BOTTOM - 0.03);
    coverParts.push(b);
  }
  const spine = new CylinderGeometry(0.1, 0.1, PAGE_H + 0.16, low ? 10 : 16, 1, true, Math.PI / 2, Math.PI);
  spine.translate(0, 0, BLOCK_BOTTOM - 0.02);
  coverParts.push(spine);
  // RoundedBoxGeometry is non-indexed → merge everything non-indexed
  const flat = coverParts.map((g) => (g.index ? g.toNonIndexed() : g));
  const coverGeo = mergeGeometries(flat);
  new Set([...coverParts, ...flat]).forEach((g) => g.dispose());
  const coverMat = new MeshPhysicalMaterial({ color: '#8E1B30', roughness: 0.5, metalness: 0.05, clearcoat: 0.35, side: DoubleSide });
  book.add(new Mesh(coverGeo, coverMat));
  // soft contact shadow (radial gradient, lies under the cover)
  const shadowGeo = new PlaneGeometry(PAGE_W * 3.2, PAGE_H * 1.55);
  const shadowMat = new MeshBasicMaterial({ map: glowTexture(), color: '#2A1A1F', transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false });
  const shadow = new Mesh(shadowGeo, shadowMat);
  shadow.position.z = BLOCK_BOTTOM - 0.12;
  shadow.renderOrder = -1;
  book.add(shadow);
  // flipping page
  const flipPivot = new Group();
  book.add(flipPivot);
  const flipGeo = pageGeometry(1, PAGE_W - 0.01, PAGE_H - 0.01, 0.006);
  const flipMat = new MeshStandardMaterial({ color: '#FFFCF4', roughness: 0.9, side: DoubleSide });
  const flip = new Mesh(flipGeo, flipMat);
  flipPivot.add(flip);
  flipPivot.visible = false;

  // ---------------------------------------------------------------- letter tiles
  const uniq = [...new Set(WORD)];
  const atlas = atlasTexture([...FLOAT, ...uniq]);
  whenFont('600 120px Lora').then(() => atlas.redraw());
  const COUNT = FLOAT.length + WORD.length;
  const tileGeo = new RoundedBoxGeometry(1, 1, TILE_D, low ? 1 : 2, 0.09);
  const tileMat = new MeshPhysicalMaterial({ roughness: 0.32, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.2, envMapIntensity: 0.9 });
  const tiles = new InstancedMesh(tileGeo, tileMat, COUNT);
  const glyphGeo = new PlaneGeometry(0.84, 0.84);
  const cells = new Float32Array(COUNT);
  glyphGeo.setAttribute('aCell', new InstancedBufferAttribute(cells, 1));
  // smooth glyph edges: alpha-blended over the tile (no hard alpha-test stair steps); the glyph quad floats just above
  // the tile face and is drawn after it, so blending needs no sorting beyond three's transparent pass
  const glyphMat = new MeshBasicMaterial({
    map: atlas.tex, transparent: true, alphaTest: 0.02, depthWrite: false, toneMapped: false,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2,
  });
  glyphMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aCell;')
      .replace('#include <uv_vertex>', `#include <uv_vertex>
        #if defined(USE_MAP) && defined(USE_INSTANCING)
          vMapUv = vec2((mod(aCell, ${COLS}.0) + uv.x) / ${COLS}.0, 1.0 - (floor(aCell / ${COLS}.0) + 1.0 - uv.y) / ${atlas.rows}.0);
        #endif`);
  };
  glyphMat.customProgramCacheKey = () => 'kr-glyph-atlas';
  const glyphs = new InstancedMesh(glyphGeo, glyphMat, COUNT);
  spin.add(tiles, glyphs);

  // styles: navy tile / cream letter, burgundy tile / cream letter, ivory tile / burgundy letter
  const STY = [[NAVY, CREAM], [BURGUNDY, CREAM], [IVORY, BURGUNDY], [IVORY, INK]];
  const c = new Color();
  const setStyle = (i, [tile, glyph]) => { tiles.setColorAt(i, c.set(tile)); glyphs.setColorAt(i, c.set(glyph)); };

  const rand = rng(77);
  const bookInv = new Matrix4();
  book.updateMatrix();
  bookInv.copy(book.matrix).invert();
  const _l = new Vector3();
  /** Keep a tile of bounding radius r above the pages (never cut by the page plane). */
  function aboveBook(p, r) {
    _l.copy(p).applyMatrix4(bookInv);
    const rl = r / BOOK_SCALE;
    if (Math.abs(_l.x) < PAGE_W + 0.1 + rl && Math.abs(_l.y) < PAGE_H / 2 + 0.1 + rl) {
      const top = pageZ(clamp(Math.abs(_l.x) / PAGE_W)) + rl + 0.04;
      if (_l.z < top && _l.z > BLOCK_BOTTOM - 0.6 - rl) { _l.z = top; p.copy(_l).applyMatrix4(book.matrix); }
    }
    return p;
  }

  const floaters = FLOAT.map((ch, i) => {
    const size = (0.56 + rand() * 0.18) * TILE_K;
    const a = Math.PI * 1.1 - (i / (FLOAT.length - 1)) * Math.PI * 1.2 + (rand() - 0.5) * 0.12;
    const r = 2.05 + (i % 2) * 0.5 + rand() * 0.2;
    const home = new Vector3(Math.cos(a) * r * 1.18, 0.25 + Math.sin(a) * r * 0.78, ((i % 3) - 1) * 0.45 - 0.1);
    cells[i] = i;
    setStyle(i, STY[i % STY.length]);
    return { i, size, rad: size * 0.72, home, ph: rand() * 6.28, rot: new Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.35), scat: new Vector3() };
  });
  // camera approach direction for this station (core/layout.js DIR.languages)
  const VIEW = new Vector3(-0.28, 0.36, 1).normalize();
  // relax: minimum spacing between tiles + always above the book
  for (let it = 0; it < 60; it++) {
    for (let a = 0; a < floaters.length; a++) {
      for (let b = a + 1; b < floaters.length; b++) {
        const A = floaters[a], B = floaters[b];
        // spacing measured in the view plane: depth separation does not stop tiles overlapping on screen
        const dmin = (A.size + B.size) * 0.5 * 1.7;
        _l.subVectors(B.home, A.home); _l.addScaledVector(VIEW, -_l.dot(VIEW));
        const d = _l.length();
        if (d < dmin && d > 1e-5) { _l.multiplyScalar((dmin - d) / d * 0.5); B.home.add(_l); A.home.sub(_l); }
      }
    }
    floaters.forEach((f) => aboveBook(f.home, f.rad + 0.12));
  }
  const bookC = new Vector3(0, -0.95, 0.2);
  floaters.forEach((f) => {
    f.scat.subVectors(f.home, bookC).normalize().multiplyScalar(1.3 + rand() * 0.9).add(f.home);
  });
  const word = WORD.map((ch, i) => {
    const k = FLOAT.length + i;
    cells[k] = FLOAT.length + uniq.indexOf(ch);
    setStyle(k, i % 2 ? [IVORY, BURGUNDY] : [BURGUNDY, CREAM]);
    return { k, target: new Vector3((i - (WORD.length - 1) / 2) * 0.68, 1.05, 1.0) };
  });
  glyphGeo.attributes.aCell.needsUpdate = true;

  const m = new Matrix4(), mg = new Matrix4(), q = new Quaternion(), e = new Euler(), sc = new Vector3(), p = new Vector3();
  const glyphOff = new Matrix4().makeTranslation(0, 0, TILE_D / 2 + 0.004);
  function place(i, pos, rx, ry, rz, s) {
    q.setFromEuler(e.set(rx, ry, rz));
    m.compose(pos, q, sc.setScalar(Math.max(1e-4, s)));
    tiles.setMatrixAt(i, m);
    mg.multiplyMatrices(m, glyphOff);
    glyphs.setMatrixAt(i, mg);
  }

  let trickT = -1;
  const from = new Vector3(0, -0.8, 0.3);
  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(shadow);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 3.0,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      const inkAmt = (opts.tone || 0) * (0.2 + 0.8 * (opts.wide || 0));
      inks.forEach((u) => { u.uInkAmt.value = inkAmt; });
      spin.rotation.y += Math.sin(time * 0.25) * 0.12; // gentle sway on top of drag
      let T = trickT;
      if (T >= 0) { trickT += dt; T = trickT; if (T > 3.4) { trickT = -1; T = -1; } }
      floaters.forEach((f) => {
        const bob = Math.sin(time * 0.9 + f.ph) * 0.08;
        let s = 1, k = 0;
        if (T >= 0) {
          const out = easeOutCubic(clamp(T / 0.55));
          const back = easeOutBack(clamp((T - 2.55) / 0.7), 1.6);
          k = out * (1 - clamp((T - 2.55) / 0.7));
          s = T < 2.55 ? 1 - clamp((T - 0.2) / 0.4) : back;
        }
        p.copy(f.home).lerp(f.scat, k);
        p.y += bob;
        aboveBook(p, f.rad * Math.max(0.3, s));
        place(f.i, p, Math.sin(time * 0.5 + f.ph) * f.rot.x, Math.sin(time * 0.4 + f.ph) * f.rot.y + k * 3, f.rot.z,
          s * f.size * (1 + base.hover * 0.06));
      });
      word.forEach((w, i) => {
        if (T < 0) { place(w.k, from, 0, 0, 0, 0); return; }
        const tin = clamp((T - 0.45 - i * 0.07) / 0.6);
        const tout = clamp((T - 2.25 - i * 0.03) / 0.45);
        const pp = easeOutBack(tin, 1.4);
        const s = tin > 0 && tout < 1 ? pp * (1 - tout) * 0.6 : 0;
        p.copy(from).lerp(w.target, easeInOutCubic(tin)).lerp(from, easeInOutCubic(tout));
        p.y += Math.sin(time * 3 + i) * 0.03 * (1 - tout);
        aboveBook(p, 0.45 * Math.max(0.2, s / 0.6));
        place(w.k, p, 0, (1 - tin) * 2.5, 0, s);
      });
      tiles.instanceMatrix.needsUpdate = true;
      glyphs.instanceMatrix.needsUpdate = true;
      // page flip
      if (T >= 0 && T < 1.3) {
        flipPivot.visible = true;
        flipPivot.rotation.y = -easeInOutCubic(clamp(T / 1.1)) * Math.PI * 0.98;
      } else flipPivot.visible = false;
      shadowMat.opacity = 0.3 + base.hover * 0.06;
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { if (trickT < 0 || trickT > 2.8) trickT = 0; },
    busy() { return trickT >= 0; },
    dispose() {
      pl.tex.dispose(); pr.tex.dispose(); et.dispose(); pageMatL.dispose(); pageMatR.dispose(); edgeMat.dispose();
      gL.dispose(); gR.dispose(); coverGeo.dispose(); coverMat.dispose(); shadowGeo.dispose(); shadowMat.dispose();
      flipGeo.dispose(); flipMat.dispose();
      atlas.tex.dispose(); tileGeo.dispose(); tileMat.dispose(); tiles.dispose(); glyphGeo.dispose(); glyphMat.dispose(); glyphs.dispose();
    },
  };
}
