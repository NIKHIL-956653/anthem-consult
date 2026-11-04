'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { Field } from './Field';
import { Dust } from './Dust';
import { GroundGrid } from './GroundGrid';
import { CameraRig } from './CameraRig';
import { sceneStore } from '@/lib/sceneStore';
import { useSceneStore } from '@/lib/useSceneStore';

const BACKGROUND = '#070A12';

function Lights() {
  return (
    <>
      <hemisphereLight args={['#2B3654', '#05070C', 1.1]} />
      <directionalLight position={[26, 42, 14]} intensity={1.5} color="#D9E2FF" />
      <directionalLight position={[-34, 12, 30]} intensity={0.45} color="#E3B65A" />
      <pointLight position={[0, 16, 0]} intensity={0.35} color="#F5D38A" distance={70} decay={1.4} />
    </>
  );
}

/** Keeps the store's telemetry current and, in reduced-motion mode, renders on demand. */
function Telemetry() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const frames = useRef({ count: 0, last: 0 });

  useEffect(() => sceneStore.subscribe(() => invalidate()), [invalidate]);

  useFrame((state) => {
    const f = frames.current;
    f.count += 1;
    const t = state.clock.elapsedTime;
    if (t - f.last >= 1) {
      sceneStore.setTelemetry({
        fps: Math.round(f.count / (t - f.last)),
        dpr: gl.getPixelRatio(),
        drawCalls: gl.info.render.calls,
      });
      f.count = 0;
      f.last = t;
    }
  });
  return null;
}

export default function SceneCanvas() {
  const reducedMotion = useSceneStore((s) => s.reducedMotion);
  const isNarrow = useSceneStore((s) => s.isNarrow);
  const [dpr, setDpr] = useState<number>(() =>
    typeof window === 'undefined' ? 1 : Math.min(2, window.devicePixelRatio || 1),
  );

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
        camera={{ fov: 42, near: 0.5, far: 320, position: [0, 24, 44] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor(BACKGROUND, 1);
        }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <fogExp2 attach="fog" args={[BACKGROUND, 0.0135]} />
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio || 1))}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />
        <Lights />
        <GroundGrid />
        <Field />
        <Dust count={isNarrow ? 260 : 640} />
        <CameraRig />
        <Telemetry />
      </Canvas>
    </div>
  );
}
