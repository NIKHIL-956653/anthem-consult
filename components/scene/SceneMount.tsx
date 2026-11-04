'use client';

import dynamic from 'next/dynamic';

/**
 * The persistent WebGL scene. Loaded on the client only, after the page shell,
 * so three.js never enters the server bundle or blocks first paint.
 */
const SceneCanvas = dynamic(() => import('./SceneCanvas'), { ssr: false, loading: () => null });

export function SceneMount() {
  return <SceneCanvas />;
}
