/**
 * A small mutable store shared by the DOM and the Three.js scene.
 *
 * Frame-rate values (scroll, camera progress) are written directly and read by
 * the scene each frame without notifications. "Reactive" values (route, active
 * station, hover index, reduced motion) notify subscribers so React chrome such
 * as the status bar can re-render through useSyncExternalStore.
 */

import type { FormationName } from './formations';

export interface Station {
  /** Matches the `data-station` attribute of a section on the page. */
  id: string;
  /** Human label for the status-bar breadcrumb. */
  label: string;
  formation: FormationName;
  /** Camera position in world units. */
  pos: [number, number, number];
  /** Camera look-at target in world units. */
  look: [number, number, number];
  fov: number;
  /** Horizontal frame shift (fraction of viewport width); positive moves the field right. */
  sx: number;
  /** Index that this station lights by default (for example, the service shown in that section). */
  active?: number;
  /** Set of indices that stay lit while the station is held. */
  lit?: number[];
}

export interface StationHold {
  /** Scroll position at which the section's top crosses 20 % of the viewport. */
  start: number;
  /** Scroll position after which the section no longer fills the viewport. */
  end: number;
}

export interface Telemetry {
  fps: number;
  dpr: number;
  columns: number;
  dust: number;
  drawCalls: number;
}

export interface SceneState {
  route: string;
  /** Stations for the current page, in scroll order. */
  stations: Station[];
  holds: StationHold[];
  /** Crisp station index from raw scroll (what the DOM shows). */
  stationIndex: number;
  /** Smoothed (scrubbed) continuous camera progress across stations, 0..stations.length-1. */
  progress: number;
  /** Raw page scroll 0..1. */
  scrollProgress: number;
  /** Index lit by hover (-1 when nothing is hovered). */
  hoverIndex: number;
  /** Index lit by scroll position within a section (for staircase / timeline). */
  scrollActive: number;
  reducedMotion: boolean;
  isNarrow: boolean;
  /** Set when a page transition is in flight so the camera eases to the new first station. */
  transitionToken: number;
  telemetry: Telemetry;
}

type Listener = () => void;

const state: SceneState = {
  route: '/',
  stations: [],
  holds: [],
  stationIndex: 0,
  progress: 0,
  scrollProgress: 0,
  hoverIndex: -1,
  scrollActive: -1,
  reducedMotion: false,
  isNarrow: false,
  transitionToken: 0,
  telemetry: { fps: 0, dpr: 1, columns: 0, dust: 0, drawCalls: 0 },
};

const listeners = new Set<Listener>();
let snapshotVersion = 0;

function notify() {
  snapshotVersion += 1;
  listeners.forEach((l) => l());
}

export const sceneStore = {
  state,

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** A monotonically increasing number used as the useSyncExternalStore snapshot. */
  getVersion() {
    return snapshotVersion;
  },

  setRoute(route: string) {
    if (state.route === route) return;
    state.route = route;
    state.hoverIndex = -1;
    state.scrollActive = -1;
    notify();
  },

  setStations(stations: Station[], holds: StationHold[]) {
    state.stations = stations;
    state.holds = holds;
    state.transitionToken += 1;
    if (state.stationIndex >= stations.length) state.stationIndex = 0;
    notify();
  },

  setHolds(holds: StationHold[]) {
    state.holds = holds;
  },

  setStationIndex(index: number) {
    if (state.stationIndex === index) return;
    state.stationIndex = index;
    notify();
  },

  setHover(index: number) {
    if (state.hoverIndex === index) return;
    state.hoverIndex = index;
    notify();
  },

  setScrollActive(index: number) {
    if (state.scrollActive === index) return;
    state.scrollActive = index;
    notify();
  },

  setReducedMotion(value: boolean) {
    if (state.reducedMotion === value) return;
    state.reducedMotion = value;
    notify();
  },

  setNarrow(value: boolean) {
    if (state.isNarrow === value) return;
    state.isNarrow = value;
    notify();
  },

  /** Frame-rate writes: no notification. */
  setProgress(progress: number) {
    state.progress = progress;
  },
  setScrollProgress(value: number) {
    state.scrollProgress = value;
  },
  setTelemetry(partial: Partial<Telemetry>) {
    Object.assign(state.telemetry, partial);
  },

  /** The index a formation should light right now. */
  resolveActive(): number {
    if (state.hoverIndex >= 0) return state.hoverIndex;
    if (state.scrollActive >= 0) return state.scrollActive;
    const station = state.stations[state.stationIndex];
    if (station && typeof station.active === 'number') return station.active;
    return -1;
  },

  currentStation(): Station | undefined {
    return state.stations[state.stationIndex];
  },
};

/**
 * Continuous camera progress for a scroll position, given the station holds.
 * Returns an index-space value: 2.0 means "held at station 2", 2.5 means halfway to station 3.
 */
export function progressForScroll(y: number, holds: StationHold[]): number {
  const n = holds.length;
  if (n === 0) return 0;
  if (y <= holds[0].end) return 0;
  for (let k = 0; k < n - 1; k += 1) {
    const a = holds[k];
    const b = holds[k + 1];
    if (y <= a.end) return k;
    if (y < b.start) {
      const span = Math.max(1, b.start - a.end);
      return k + (y - a.end) / span;
    }
  }
  return n - 1;
}

/** Crisp station index: the last station whose start has been crossed. */
export function stationIndexForScroll(y: number, holds: StationHold[]): number {
  let idx = 0;
  for (let k = 0; k < holds.length; k += 1) {
    if (y >= holds[k].start) idx = k;
  }
  return idx;
}
