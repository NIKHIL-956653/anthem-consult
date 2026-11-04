'use client';

import { useCallback, useMemo } from 'react';
import { sceneStore } from '@/lib/sceneStore';

/**
 * Handlers that light the matching pillar / tower / tile while an item is
 * hovered or focused. Pass the item's index.
 */
export function useHoverIndex() {
  const enter = useCallback((index: number) => sceneStore.setHover(index), []);
  const leave = useCallback(() => sceneStore.setHover(-1), []);

  return useMemo(
    () => ({
      bind: (index: number) => ({
        onMouseEnter: () => enter(index),
        onMouseLeave: leave,
        onFocus: () => enter(index),
        onBlur: leave,
      }),
      enter,
      leave,
    }),
    [enter, leave],
  );
}
