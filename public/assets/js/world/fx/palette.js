// Shared palettes — mirror SPEC §2 theme table (keep in sync with base.css tokens).
import { Color } from 'three';

export const THEMES = {
  hero:        { bg: '#070A1F', ink: '#EEF1FF', accent: '#FFB627', accent2: '#00B4D8', tone: 'dark' },
  math:        { bg: '#F5F1E6', ink: '#1B2A6B', accent: '#3D5AFE', accent2: '#FF5A5F', tone: 'light' },
  physics:     { bg: '#0A2A5E', ink: '#E8F1FF', accent: '#5CD2FF', accent2: '#FFB627', tone: 'dark' },
  chemistry:   { bg: '#07231F', ink: '#E6FFF7', accent: '#21D19F', accent2: '#FF6FB5', tone: 'dark' },
  biology:     { bg: '#0E3B26', ink: '#F0FFE9', accent: '#B6F36A', accent2: '#FFD166', tone: 'dark' },
  geography:   { bg: '#F2E6CC', ink: '#3B2A14', accent: '#0A7BBF', accent2: '#D1495B', tone: 'light' },
  languages:   { bg: '#FBF6EC', ink: '#2A1A1F', accent: '#B0263E', accent2: '#1D3557', tone: 'light' },
  informatics: { bg: '#04060A', ink: '#D7FFE9', accent: '#39FF88', accent2: '#00E5FF', tone: 'dark' },
  arts:        { bg: '#1A0B2E', ink: '#FFF3F8', accent: '#FF5A5F', accent2: '#FFB627', tone: 'dark' },
  day:         { bg: '#0B0F2B', ink: '#EEF1FF', accent: '#FFB627', accent2: '#00B4D8', tone: 'mixed' },
  paper:       { bg: '#F7F3EA', ink: '#0B0F2B', accent: '#6C5CE7', accent2: '#FFB627', tone: 'light' },
};

export const CORE = {
  ink: '#0B0F2B', ink2: '#151B45', paper: '#F7F3EA', sun: '#FFB627', sky: '#00B4D8',
  coral: '#FF5A5F', mint: '#21D19F', violet: '#6C5CE7',
};

/** 0 = dark background, 1 = light background. `day` depends on --day-progress (0 dawn … 1 night). */
export function themeTone(theme, dayProgress = 0) {
  const t = THEMES[theme];
  if (!t) return 0;
  if (t.tone === 'light') return 1;
  if (t.tone === 'dark') return 0;
  // day: dawn → noon light, sunset → night dark
  const p = dayProgress;
  return 1 - smooth(0.55, 0.82, p);
}

/** Sky tint for the "day" station (ambient light colour), dawn → noon → dusk → night. */
const DAY_STOPS = [
  [0.0, '#FFB38A'], [0.25, '#FFF4D6'], [0.5, '#FFFFFF'], [0.7, '#FF9F6B'], [0.85, '#7A6CFF'], [1.0, '#3A4A9F'],
];
const _a = new Color(), _b = new Color();
export function dayTint(p, out = new Color()) {
  p = Math.min(1, Math.max(0, p));
  for (let i = 1; i < DAY_STOPS.length; i++) {
    if (p <= DAY_STOPS[i][0]) {
      const [p0, c0] = DAY_STOPS[i - 1], [p1, c1] = DAY_STOPS[i];
      return out.copy(_a.set(c0)).lerp(_b.set(c1), (p - p0) / (p1 - p0));
    }
  }
  return out.set(DAY_STOPS[DAY_STOPS.length - 1][1]);
}

export function smooth(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export const col = (hex) => new Color(hex);
