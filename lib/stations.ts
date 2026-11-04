/**
 * Camera stations per page, in scroll order.
 *
 * Each `[data-station]` section on a page is one station. The id here must
 * match the `data-station` attribute; sections are read in DOM order, so a
 * page may use a subset of its list.
 *
 * pos / look are world units (the field spans x ±36, z ±22, columns up to ~13 high).
 * sx is a horizontal frame shift (fraction of the viewport width): positive
 * pushes the field to the right so it sits beside left-aligned copy. It is
 * ignored on phones.
 */

import type { Station } from './sceneStore';

const PIN_CLOSING: Omit<Station, 'id' | 'label'> = {
  formation: 'pin',
  pos: [0, 27, 36],
  look: [0, 2.5, 0],
  fov: 44,
  sx: 0,
};

export const stationsByRoute: Record<string, Station[]> = {
  '/': [
    { id: 'hero', label: 'Growth', formation: 'wave', pos: [-14, 16, 46], look: [6, 3, -2], fov: 40, sx: 0.2 },
    { id: 'services', label: 'Services', formation: 'pillars', pos: [0, 34, 74], look: [0, 3, 0], fov: 42, sx: -0.2 },
    { id: 'recruit', label: 'How we recruit', formation: 'steps', pos: [-32, 21, 34], look: [4, 3, 0], fov: 42, sx: -0.18 },
    { id: 'industries', label: 'Industries', formation: 'ring', pos: [-4, 34, 38], look: [0, 1, 0], fov: 42, sx: 0.2 },
    { id: 'figures', label: 'Key figures', formation: 'chart', pos: [12, 20, 54], look: [0, 5, 0], fov: 40, sx: -0.18 },
    { id: 'closing', label: 'Get a consultation', ...PIN_CLOSING },
  ],
  '/about': [
    { id: 'hero', label: 'Welcome', formation: 'timeline', pos: [-22, 15, 40], look: [0, 3, 0], fov: 42, sx: 0.2 },
    { id: 'vision', label: 'Vision', formation: 'wave', pos: [12, 18, 44], look: [0, 3, 0], fov: 40, sx: -0.18 },
    { id: 'mission', label: 'Mission', formation: 'calm', pos: [0, 30, 40], look: [0, 0, -4], fov: 42, sx: 0.18 },
    { id: 'timeline', label: 'History', formation: 'timeline', pos: [0, 13, 42], look: [0, 4, 0], fov: 40, sx: 0 },
    { id: 'principle', label: 'Principle', ...PIN_CLOSING },
  ],
  '/services': [
    { id: 'hero', label: 'Six practices', formation: 'pillars', pos: [0, 34, 74], look: [0, 3, 0], fov: 42, sx: 0.2 },
    { id: 'software-development', label: 'Software Development', formation: 'pillars', pos: [-32, 14, 34], look: [-20, 5, 0], fov: 40, sx: 0.2, active: 0 },
    { id: 'web-design-development', label: 'Web Design & Development', formation: 'pillars', pos: [-8, 16, 36], look: [-14, 5, 0], fov: 40, sx: -0.18, active: 1 },
    { id: 'outsourcing', label: 'Outsourcing', formation: 'steps', pos: [-28, 20, 36], look: [2, 3, 0], fov: 42, sx: 0.2 },
    { id: 'business-services', label: 'Business Services', formation: 'grid', pos: [0, 54, 50], look: [0, 0, -4], fov: 42, sx: -0.18 },
    { id: 'online-trainings', label: 'Online Trainings', formation: 'pillars', pos: [8, 16, 36], look: [16, 5, 0], fov: 40, sx: 0.2, active: 4 },
    { id: 'corporate-training-services', label: 'Corporate Training', formation: 'pillars', pos: [34, 14, 34], look: [22, 5, 0], fov: 40, sx: -0.18, active: 5 },
    { id: 'closing', label: 'Get a consultation', ...PIN_CLOSING },
  ],
  '/industries': [
    { id: 'hero', label: 'Industries', formation: 'ring', pos: [0, 30, 44], look: [0, 1, 0], fov: 42, sx: 0.2 },
    { id: 'ring', label: 'Twelve industries', formation: 'ring', pos: [-24, 24, 34], look: [0, 2, 0], fov: 42, sx: -0.18 },
    { id: 'offerings', label: 'Three offerings', formation: 'pillars', pos: [0, 32, 72], look: [0, 4, 0], fov: 42, sx: 0.12, lit: [0, 2, 4] },
    { id: 'closing', label: 'Success stories', ...PIN_CLOSING },
  ],
  '/contact': [
    { id: 'hero', label: 'Get in touch', formation: 'pin', pos: [-6, 24, 38], look: [0, 3, 0], fov: 42, sx: 0 },
  ],
};

export const fallbackStation: Station = {
  id: 'fallback',
  label: 'Field',
  formation: 'calm',
  pos: [0, 24, 44],
  look: [0, 2, 0],
  fov: 42,
  sx: 0,
};

export function stationsForRoute(route: string): Station[] {
  return stationsByRoute[route] ?? [fallbackStation];
}

/** How much the lens widens on narrow screens (degrees). */
export const NARROW_FOV_BOOST = 14;
