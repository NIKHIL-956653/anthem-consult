'use client';

import { useSyncExternalStore } from 'react';
import { sceneStore, type SceneState } from './sceneStore';

const getServerVersion = () => 0;

/**
 * Subscribe a component to the reactive part of the scene store.
 * The selector runs on every notification; keep it cheap.
 */
export function useSceneStore<T>(selector: (state: SceneState) => T): T {
  useSyncExternalStore(sceneStore.subscribe, sceneStore.getVersion, getServerVersion);
  return selector(sceneStore.state);
}
