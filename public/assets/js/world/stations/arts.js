// ARTS — morphing noise blob (GPU simplex displacement, painterly coral/sun/violet gradient) + orbiting notes & ball.
// Trick: splash — displacement spike + paint droplets + colour shift.
import {
  Group, Mesh, IcosahedronGeometry, SphereGeometry, ShaderMaterial, Sprite, SpriteMaterial, MeshPhysicalMaterial, Vector3,
} from 'three';
import { Interactive, createBurst, pxOf, detail, ToneSwitch } from './_base.js';
import { addRim, textTexture, makeHalo, dotTexture } from '../fx/materials.js';
import { clamp } from '../fx/ease.js';

const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */`
uniform float uTime; uniform float uSplash; uniform float uAmp;
varying vec3 vN; varying vec3 vV; varying float vNz; varying vec3 vObj;
${NOISE}
float disp(vec3 p){
  float n = snoise(p * 0.8 + vec3(0.0, uTime * 0.22, uTime * 0.05)) * 0.34 * uAmp;
  n += snoise(p * 1.7 - vec3(uTime * 0.17)) * 0.035;
  n += uSplash * (snoise(p * 3.6 + vec3(uTime * 1.5)) * 0.45 + 0.12);
  return n;
}
void main(){
  vec3 p = position; float R = length(p); vec3 nrm = p / R;
  float d = disp(p);
  vec3 pos = p + nrm * d;
  vec3 up = abs(nrm.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 t = normalize(cross(nrm, up)); vec3 b = normalize(cross(nrm, t));
  float e = 0.015;
  vec3 q1 = normalize(p + t * e) * R; vec3 q2 = normalize(p + b * e) * R;
  q1 += normalize(q1) * disp(q1); q2 += normalize(q2) * disp(q2);
  vec3 n = normalize(cross(q1 - pos, q2 - pos));
  if (dot(n, nrm) < 0.0) n = -n;
  vNz = d;
  vObj = pos;
  vN = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */`
uniform float uHue; uniform float uHover; uniform float uTime;
varying vec3 vN; varying vec3 vV; varying float vNz; varying vec3 vObj;
vec3 pal(float t){
  t = fract(t);
  vec3 c0 = vec3(0.424, 0.361, 0.906); // violet
  vec3 c1 = vec3(1.0, 0.353, 0.373);   // coral
  vec3 c2 = vec3(1.0, 0.714, 0.153);   // sun
  vec3 c3 = vec3(1.0, 0.44, 0.71);     // pink
  float s = t * 4.0;
  if (s < 1.0) return mix(c0, c1, smoothstep(0.0, 1.0, s));
  if (s < 2.0) return mix(c1, c2, smoothstep(0.0, 1.0, s - 1.0));
  if (s < 3.0) return mix(c2, c3, smoothstep(0.0, 1.0, s - 2.0));
  return mix(c3, c0, smoothstep(0.0, 1.0, s - 3.0));
}
void main(){
  vec3 n = normalize(vN); vec3 v = normalize(vV);
  float band = vNz * 1.6 + vObj.y * 0.18 + vObj.x * 0.08 + uHue;
  vec3 base = pal(band * 0.55 + 0.1);
  vec3 L = normalize(vec3(0.5, 0.8, 0.6));
  float dif = clamp(dot(n, L), 0.0, 1.0);
  vec3 H = normalize(L + v);
  float spec = pow(clamp(dot(n, H), 0.0, 1.0), 60.0);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);
  vec3 col = base * (0.5 + 0.62 * dif);
  col += vec3(1.0, 0.95, 0.9) * spec * 0.6;
  col += mix(vec3(1.0, 0.6, 0.85), vec3(1.0, 0.85, 0.5), 0.5 + 0.5 * sin(uTime * 0.7)) * fres * (0.55 + uHover * 0.4);
  // subtle painterly striation
  col *= 0.97 + 0.03 * sin(vObj.y * 18.0 + vObj.x * 7.0 + vNz * 20.0);
  gl_FragColor = vec4(col, 1.0);
}`;

export default function createArts(ctx) {
  const low = ctx.quality === 'low';
  const base = new Interactive({ tilt: 0.8 });
  const { group, spin } = base;

  const geo = new IcosahedronGeometry(1.25, low ? 22 : 56);
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uTime: { value: 0 }, uSplash: { value: 0 }, uAmp: { value: 1 }, uHue: { value: 0 }, uHover: { value: 0 } },
  });
  const blob = new Mesh(geo, mat);
  spin.add(blob);
  const halo = makeHalo('#FF5A5F', 7.5, 0.22, true);
  halo.position.z = -1.6;
  group.add(halo);
  const halo2 = makeHalo('#6C5CE7', 6, 0.25, true);
  halo2.position.set(-1.2, 0.8, -2);
  group.add(halo2);

  // notes
  const glyphs = [['♪', '#FFB627'], ['♫', '#FFF3F8'], ['♩', '#FF8FB1'], ['♬', '#FFB627'], ['♪', '#B9A8FF'], ['♫', '#FF8FB1']];
  const notes = glyphs.map(([g, col], i) => {
    const tt = textTexture(g, { font: '"Segoe UI Symbol", "Noto Music", "DejaVu Sans", serif', weight: 400, px: 120, color: col, pad: 0.12 });
    const s = new Sprite(new SpriteMaterial({ map: tt.texture, transparent: true, depthWrite: false }));
    s.userData = { tt, r: 1.95 + (i % 3) * 0.3, a: (i / glyphs.length) * Math.PI * 2, sp: 0.35 + (i % 2) * 0.18, y: Math.sin(i * 1.7) * 0.9, tilt: 0.3 + i * 0.1 };
    spin.add(s);
    return s;
  });

  // ball
  const ballGeo = new SphereGeometry(0.26, 32, 24);
  const ballMat = new MeshPhysicalMaterial({ color: '#FFB627', roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.3 });
  addRim(ballMat, { color: '#FFE3A1', power: 2, strength: 0.4 });
  const ball = new Mesh(ballGeo, ballMat);
  spin.add(ball);

  // splash droplets
  const drops = createBurst({
    count: low ? 50 : 110, map: dotTexture(), colors: ['#FF5A5F', '#FFB627', '#6C5CE7', '#FF8FB1', '#FFF3F8'], size: 1.3,
    speed: [1.6, 3.6], duration: 1.9, gravity: 0.9, additive: false, seed: 12,
    start: (i, out, r) => { const u = r() * 2 - 1, th = r() * 6.283, s = Math.sqrt(1 - u * u); out[0] = s * Math.cos(th) * 1.2; out[1] = u * 1.2; out[2] = s * Math.sin(th) * 1.2; },
    dir: (i, out, r) => { const u = r() * 2 - 1, th = r() * 6.283, s = Math.sqrt(1 - u * u); out[0] = s * Math.cos(th); out[1] = u * 0.8 + 0.35; out[2] = s * Math.sin(th); },
  });
  spin.add(drops.points);

  const tk = new ToneSwitch();
  tk.add(halo.material, {});
  tk.add(halo2.material, { opacity: 0.6 });
  tk.add(notes[1].material, { color: '#5B3A6E' });   // the pale note would vanish on paper
  let trickT = -1, hue = 0, hueTarget = 0;
  const tmp = new Vector3();
  // decorative parts skipped in low-quality wide shots (draw-call budget)
  detail(...notes, halo2);
  return {
    group,
    focus: ctx.anchor.clone(),
    radius: 2.4,
    update(time, dt, focusAmount, opts = {}) {
      base.tick(dt);
      tk.apply(opts.tone || 0);
      const u = mat.uniforms;
      u.uTime.value = time;
      u.uHover.value = base.hover;
      u.uAmp.value = 1 + base.hover * 0.35;
      let burstR = 0;
      if (trickT >= 0) {
        trickT += dt;
        const t = trickT;
        u.uSplash.value = Math.exp(-t * 2.2) * Math.cos(t * 9) * 0.7 * clamp(t / 0.08);
        burstR = Math.exp(-t * 1.8) * Math.sin(Math.min(t * 5, Math.PI / 2)) * 1.4;
        if (t > 2.4) { trickT = -1; u.uSplash.value = 0; }
      }
      hue += (hueTarget - hue) * clamp(dt * 1.8);
      u.uHue.value = hue + Math.sin(time * 0.15) * 0.15;
      blob.rotation.y = time * 0.15;
      notes.forEach((s, i) => {
        const d = s.userData;
        const a = d.a + time * d.sp;
        const r = d.r + burstR;
        tmp.set(Math.cos(a) * r, d.y + Math.sin(time * 1.1 + i) * 0.18, Math.sin(a) * r * 0.7);
        s.position.copy(tmp);
        const sc = 0.44 * (1 + burstR * 0.3);
        s.scale.set(sc * d.tt.aspect, sc, 1);
        s.material.rotation = Math.sin(time * 1.3 + i) * 0.25;
      });
      const ba = time * 0.8;
      ball.position.set(Math.cos(ba) * 2.1, Math.sin(ba * 1.3) * 0.9 + 0.2, Math.sin(ba) * 1.2);
      ball.scale.setScalar(1 + burstR * 0.25);
      halo.material.opacity = (0.2 + base.hover * 0.12 + burstR * 0.1) * tk.k;
      drops.update(dt, pxOf(ctx));
    },
    setHover(b) { base.setHover(b); },
    drag(dx, dy) { base.drag(dx, dy); },
    trick() { trickT = 0; hueTarget += 0.33; drops.fire(); },
    busy() { return trickT >= 0 || drops.active; },
    dispose() {
      geo.dispose(); mat.dispose(); halo.material.dispose(); halo2.material.dispose();
      notes.forEach((s) => { s.userData.tt.texture.dispose(); s.material.dispose(); });
      ballGeo.dispose(); ballMat.dispose(); drops.points.geometry.dispose(); drops.points.material.dispose();
    },
  };
}
