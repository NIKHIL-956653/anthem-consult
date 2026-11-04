/**
 * Formation functions for the Resonance Field.
 *
 * Each formation is a pure function of a column's position (world units and
 * normalized -1..1), the time and the active index. It writes a target height
 * and glow into `out`. The field eases every column toward these targets each
 * frame, so switching formation is an organic morph with no blending code.
 *
 * No three.js imports here: this file is shared with the DOM bundle.
 */

export type FormationName =
  | 'wave'
  | 'pillars'
  | 'steps'
  | 'grid'
  | 'ring'
  | 'timeline'
  | 'chart'
  | 'pin'
  | 'calm';

export const FIELD = {
  cols: 72,
  rows: 44,
  spacing: 1,
  /** Half extents of the field in world units. */
  halfX: 36,
  halfZ: 22,
  columnSize: 0.56,
  minHeight: 0.18,
} as const;

export const COLUMN_COUNT = FIELD.cols * FIELD.rows;

export interface FormationContext {
  /** Seconds. Frozen at 0 when the user prefers reduced motion. */
  t: number;
  /** Active index, or -1 when nothing is active. */
  active: number;
  /** Bitmask of indices that stay lit (used by `pillars` for the three offerings). */
  lit: number;
}

export interface FormationOut {
  h: number;
  g: number;
}

export type FormationFn = (
  out: FormationOut,
  wx: number,
  wz: number,
  nx: number,
  nz: number,
  ctx: FormationContext,
) => void;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const soft = (dist: number, radius: number, feather: number) =>
  1 - smoothstep(radius, radius + feather, dist);

/** Cycle an index with time when nothing is active. */
const cycling = (active: number, count: number, t: number, period: number) =>
  active >= 0 ? active : Math.floor((t / period) % count);

// ---------------------------------------------------------------------------
// wave — a rolling sound wave rising left to right like a growth curve.
// ---------------------------------------------------------------------------
const wave: FormationFn = (out, wx, wz, nx, nz, { t }) => {
  const growth = (nx + 1) * 0.5;
  const base = 0.4 + growth * growth * 4.2;
  const phase = nx * 5.2 - t * 0.9 + Math.sin(nz * 2.1 + t * 0.35) * 0.6;
  const s = Math.sin(phase);
  const carrier = (s + 1) * 0.5;
  const ripple = Math.sin(nx * 11 + nz * 7 - t * 1.6) * 0.18;
  const depthFade = 1 - Math.abs(nz) * 0.35;
  out.h = FIELD.minHeight + (base + carrier * (1.2 + growth * 2.4) + ripple) * depthFade;

  // Gold light runs along the crest.
  const crestLine = nz - Math.sin(nx * 2.4 - t * 0.5) * 0.22;
  const ridge = Math.exp(-crestLine * crestLine * 22);
  const crest = Math.pow(carrier, 6);
  out.g = ridge * (0.25 + crest * 0.75) + crest * 0.12 * growth;
};

// ---------------------------------------------------------------------------
// pillars — six tall pillars in a row; a ripple spreads from the active one.
// ---------------------------------------------------------------------------
const PILLAR_COUNT = 6;
const pillarX = (k: number) => -27 + k * 10.8;
const PILLAR_RADIUS = 2.3;

const pillars: FormationFn = (out, wx, wz, nx, nz, { t, active, lit }) => {
  const act = cycling(active, PILLAR_COUNT, t, 2.6);
  let h = 0.35 + 0.15 * Math.sin(nx * 3 + t * 0.4) * Math.cos(nz * 3 - t * 0.3);
  let g = 0.03;
  for (let k = 0; k < PILLAR_COUNT; k += 1) {
    const dx = wx - pillarX(k);
    const d = Math.sqrt(dx * dx + wz * wz);
    const isActive = k === act;
    const isLit = (lit & (1 << k)) !== 0;
    const mask = soft(d, PILLAR_RADIUS, 1.4);
    const height = isActive ? 11 : isLit ? 8.5 : 6.4;
    const breathe = 1 + 0.03 * Math.sin(t * 1.3 + k);
    h += mask * height * breathe;
    const glow = isActive ? 1 : isLit ? 0.62 : 0.14;
    g += mask * glow;
    if (isActive) {
      const r = d - PILLAR_RADIUS;
      if (r > 0) {
        const ring = Math.sin(r * 1.1 - t * 3.2);
        const decay = Math.exp(-r * 0.16);
        h += Math.max(0, ring) * 0.9 * decay;
        g += Math.max(0, ring) * 0.35 * decay;
      }
    }
  }
  out.h = Math.max(FIELD.minHeight, h);
  out.g = g;
};

// ---------------------------------------------------------------------------
// steps — a ten-step staircase across the field.
// ---------------------------------------------------------------------------
const STEP_COUNT = 10;

const steps: FormationFn = (out, wx, wz, nx, nz, { t, active }) => {
  const act = cycling(active, STEP_COUNT, t, 1.4);
  const u = (nx + 1) * 0.5 * STEP_COUNT;
  let s = Math.floor(u);
  if (s < 0) s = 0;
  if (s > STEP_COUNT - 1) s = STEP_COUNT - 1;
  const band = soft(Math.abs(wz), 7.5, 4);
  const riser = 0.55 + s * 0.78;
  const edge = 1 - smoothstep(0.85, 1, u - s);
  const floor = 0.3 + 0.1 * Math.sin(nx * 4 + t * 0.3) * Math.cos(nz * 4);
  out.h = FIELD.minHeight + floor + band * (riser + edge * 0.08);
  const done = s < act ? 0.4 : 0.05;
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.4);
  const current = s === act ? pulse : done;
  out.g = band * current + (1 - band) * 0.02;
};

// ---------------------------------------------------------------------------
// grid — twelve raised tiles in a 4 × 3 grid.
// ---------------------------------------------------------------------------
const GRID_COLS = 4;
const GRID_ROWS = 3;
const TILE_W = 5.2;
const TILE_D = 4.6;
const tileX = (c: number) => -22.5 + c * 15;
const tileZ = (r: number) => -12 + r * 12;

const grid: FormationFn = (out, wx, wz, nx, nz, { t, active }) => {
  let h = 0.3 + 0.08 * Math.sin(nx * 6 + t * 0.5) * Math.cos(nz * 6);
  let g = 0.02;
  for (let r = 0; r < GRID_ROWS; r += 1) {
    const dz = Math.abs(wz - tileZ(r));
    if (dz > TILE_D + 2) continue;
    for (let c = 0; c < GRID_COLS; c += 1) {
      const dx = Math.abs(wx - tileX(c));
      if (dx > TILE_W + 2) continue;
      const k = r * GRID_COLS + c;
      const isActive = k === active;
      const inside = dx <= TILE_W && dz <= TILE_D ? 1 : 0;
      const edgeDist = Math.min(TILE_W - dx, TILE_D - dz);
      const rim = inside && edgeDist < 1.1 ? 1 : 0;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.9 + k * 0.7);
      h += inside * ((isActive ? 3.6 : 2.1) + rim * 0.35);
      g += inside * (isActive ? 1 : 0.16 + breathe * 0.1) + rim * (isActive ? 0.2 : 0.12);
    }
  }
  out.h = Math.max(FIELD.minHeight, h);
  out.g = g;
};

// ---------------------------------------------------------------------------
// ring — twelve towers on a circle around a low core, joined by a lit ring path.
// ---------------------------------------------------------------------------
const RING_COUNT = 12;
const RING_R = 15.5;
const TOWER_R = 1.9;
const CORE_R = 4.2;
const TWO_PI = Math.PI * 2;

const ring: FormationFn = (out, wx, wz, nx, nz, { t, active }) => {
  const d = Math.sqrt(wx * wx + wz * wz);
  let h = 0.3 + 0.1 * Math.sin(d * 0.6 - t * 0.8);
  let g = 0.02;

  // Low core.
  const core = soft(d, CORE_R, 1.5);
  h += core * 1.4;
  g += core * 0.12;

  // Ring path with light travelling around it.
  const pathMask = soft(Math.abs(d - RING_R), 0.9, 0.9);
  const angle = Math.atan2(wz, wx);
  const traveller = Math.pow(0.5 + 0.5 * Math.sin(angle * 3 - t * 1.8), 4);
  h += pathMask * 0.75;
  g += pathMask * (0.18 + traveller * 0.5);

  // Towers.
  for (let k = 0; k < RING_COUNT; k += 1) {
    const a = (k / RING_COUNT) * TWO_PI;
    const tx = Math.cos(a) * RING_R;
    const tz = Math.sin(a) * RING_R;
    const dx = wx - tx;
    const dz = wz - tz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > TOWER_R + 1.5) continue;
    const mask = soft(dist, TOWER_R, 1.2);
    const isActive = k === active;
    h += mask * (isActive ? 10.5 : 6.2 + 0.4 * Math.sin(t + k));
    g += mask * (isActive ? 1 : 0.3);
  }
  out.h = Math.max(FIELD.minHeight, h);
  out.g = g;
};

// ---------------------------------------------------------------------------
// timeline — a ridge with peaks at each year.
// ---------------------------------------------------------------------------
const PEAK_COUNT = 3;
const peakX = (k: number) => -20 + k * 20;

const timeline: FormationFn = (out, wx, wz, nx, nz, { t, active }) => {
  const act = active >= 0 ? active : PEAK_COUNT - 1;
  const ridge = Math.exp(-(wz * wz) * 0.045);
  let h = 0.3 + 0.08 * Math.sin(nx * 5 + t * 0.4) * Math.cos(nz * 5);
  let g = 0.02 + ridge * 0.16;
  // A slow climb from left to right.
  h += ridge * (1 + (nx + 1) * 0.9);
  for (let k = 0; k < PEAK_COUNT; k += 1) {
    const dx = wx - peakX(k);
    const peak = Math.exp(-dx * dx * 0.07);
    const isActive = k === act;
    const amp = isActive ? 8.5 : 5;
    h += ridge * peak * amp;
    g += ridge * peak * (isActive ? 1 : 0.35);
  }
  out.h = Math.max(FIELD.minHeight, h);
  out.g = g;
};

// ---------------------------------------------------------------------------
// chart — four big bars.
// ---------------------------------------------------------------------------
const BAR_HEIGHTS = [9, 6.5, 11.5, 7.5];
const barX = (k: number) => -21 + k * 14;
const BAR_W = 4.2;
const BAR_D = 6.5;

const chart: FormationFn = (out, wx, wz, nx, nz, { t, active }) => {
  let h = 0.3 + 0.1 * Math.sin(nx * 4 + t * 0.4) * Math.cos(nz * 4);
  let g = 0.02;
  const baseline = soft(Math.abs(wz), BAR_D + 1.2, 1.5) * 0.25;
  h += baseline;
  g += baseline * 0.2;
  for (let k = 0; k < 4; k += 1) {
    const dx = Math.abs(wx - barX(k));
    const dz = Math.abs(wz);
    if (dx > BAR_W || dz > BAR_D) continue;
    const isActive = k === active;
    const topBand = 1 - smoothstep(0.3, 1.2, BAR_W - dx) * smoothstep(0.3, 1.2, BAR_D - dz);
    h += BAR_HEIGHTS[k] * (1 + 0.02 * Math.sin(t * 1.5 + k));
    g += (isActive ? 1 : 0.4) * (0.55 + topBand * 0.45);
  }
  out.h = Math.max(FIELD.minHeight, h);
  out.g = g;
};

// ---------------------------------------------------------------------------
// pin — everything flat; one bright spike in the centre with rings pulsing out.
// ---------------------------------------------------------------------------
const pin: FormationFn = (out, wx, wz, nx, nz, { t }) => {
  const d = Math.sqrt(wx * wx + wz * wz);
  const spike = soft(d, 1.1, 0.9);
  const rings = Math.pow(0.5 + 0.5 * Math.sin(d * 0.95 - t * 2.6), 7) * Math.exp(-d * 0.06);
  out.h = FIELD.minHeight + 0.14 + spike * 13 + rings * 0.7;
  out.g = spike * 1.2 + rings * 0.6 + 0.02;
};

// ---------------------------------------------------------------------------
// calm — a low, slow ripple.
// ---------------------------------------------------------------------------
const calm: FormationFn = (out, wx, wz, nx, nz, { t }) => {
  const s = Math.sin(nx * 3.1 + t * 0.4) * Math.cos(nz * 2.7 - t * 0.3);
  const s2 = Math.sin(nx * 7 - nz * 5 + t * 0.6) * 0.3;
  out.h = FIELD.minHeight + 0.25 + ((s + 1) * 0.5) * 0.7 + s2 * 0.15;
  out.g = 0.03 + Math.pow((s + 1) * 0.5, 5) * 0.18;
};

export const formations: Record<FormationName, FormationFn> = {
  wave,
  pillars,
  steps,
  grid,
  ring,
  timeline,
  chart,
  pin,
  calm,
};

/** Build a bitmask from a list of indices. */
export function litMask(indices?: number[]): number {
  if (!indices) return 0;
  let mask = 0;
  for (const i of indices) mask |= 1 << i;
  return mask;
}
