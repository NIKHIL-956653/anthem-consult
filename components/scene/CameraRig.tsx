'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneStore, type Station } from '@/lib/sceneStore';
import { fallbackStation, NARROW_FOV_BOOST } from '@/lib/stations';

const ROUTE_TRANSITION_SECONDS = 1.6;
const FALLBACK = [fallbackStation];

interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
  sx: number;
}

function makePose(): Pose {
  return { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 42, sx: 0 };
}

function copyPose(target: Pose, source: Pose) {
  target.pos.copy(source.pos);
  target.look.copy(source.look);
  target.fov = source.fov;
  target.sx = source.sx;
}

function lerpPose(target: Pose, a: Pose, b: Pose, w: number) {
  target.pos.lerpVectors(a.pos, b.pos, w);
  target.look.lerpVectors(a.look, b.look, w);
  target.fov = a.fov + (b.fov - a.fov) * w;
  target.sx = a.sx + (b.sx - a.sx) * w;
}

const smoothstep = (x: number) => {
  const v = x < 0 ? 0 : x > 1 ? 1 : x;
  return v * v * (3 - 2 * v);
};

/**
 * Moves the camera along a Catmull-Rom curve through the page's stations,
 * driven by the scrubbed progress value, with a 1.6 s ease between pages.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  const rig = useMemo(
    () => ({
      stations: null as Station[] | null,
      posCurve: null as THREE.CatmullRomCurve3 | null,
      lookCurve: null as THREE.CatmullRomCurve3 | null,
      pose: makePose(),
      target: makePose(),
      from: makePose(),
      transitioning: false,
      transitionStart: 0,
      initialized: false,
    }),
    [],
  );
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useFrame((state, delta) => {
    const s = sceneStore.state;
    const stations = s.stations.length > 0 ? s.stations : FALLBACK;
    const now = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (rig.stations !== stations) {
      const posPoints = stations.map((st) => new THREE.Vector3(...st.pos));
      const lookPoints = stations.map((st) => new THREE.Vector3(...st.look));
      rig.posCurve = posPoints.length > 1 ? new THREE.CatmullRomCurve3(posPoints, false, 'centripetal') : null;
      rig.lookCurve = lookPoints.length > 1 ? new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal') : null;
      if (rig.initialized && !s.reducedMotion) {
        copyPose(rig.from, rig.pose);
        rig.transitioning = true;
        rig.transitionStart = now;
      }
      rig.stations = stations;
    }

    // Target pose along the curve.
    const n = stations.length;
    const p = Math.max(0, Math.min(n - 1, s.progress));
    const i0 = Math.floor(p);
    const i1 = Math.min(n - 1, i0 + 1);
    const w = p - i0;
    const a = stations[i0];
    const b = stations[i1];
    const { target } = rig;

    if (n > 1 && rig.posCurve && rig.lookCurve) {
      const u = p / (n - 1);
      rig.posCurve.getPoint(u, target.pos);
      rig.lookCurve.getPoint(u, target.look);
    } else {
      target.pos.set(...a.pos);
      target.look.set(...a.look);
    }
    target.fov = a.fov + (b.fov - a.fov) * w;
    target.sx = a.sx + (b.sx - a.sx) * w;

    if (s.isNarrow) {
      target.fov += NARROW_FOV_BOOST;
      target.sx = 0;
    }

    // Ease from the previous page's last pose to this page's first station.
    if (rig.transitioning) {
      const e = (now - rig.transitionStart) / ROUTE_TRANSITION_SECONDS;
      if (e >= 1) {
        rig.transitioning = false;
      } else {
        lerpPose(target, rig.from, target, smoothstep(e));
      }
    }

    const { pose } = rig;
    if (!rig.initialized || s.reducedMotion) {
      copyPose(pose, target);
      rig.initialized = true;
    } else {
      const k = 1 - Math.exp(-6 * dt);
      lerpPose(pose, pose, target, k);
    }

    camera.position.copy(pose.pos);
    camera.lookAt(pose.look);
    camera.fov = pose.fov;
    const { width, height } = sizeRef.current;
    if (Math.abs(pose.sx) > 0.0005) {
      camera.setViewOffset(width, height, -pose.sx * width, 0, width, height);
    } else if (camera.view?.enabled) {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  });

  return null;
}
