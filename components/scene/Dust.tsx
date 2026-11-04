'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneStore } from '@/lib/sceneStore';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float s = aSeed * 6.2831853;
    p.x += sin(uTime * 0.12 + s) * 2.2;
    p.y += sin(uTime * 0.18 + s * 1.7) * 1.3;
    p.z += cos(uTime * 0.10 + s * 0.6) * 2.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = aSize * uPixelRatio * (64.0 / max(dist, 1.0));

    float twinkle = 0.5 + 0.5 * sin(uTime * 0.7 + s * 3.0);
    vAlpha = (0.3 + 0.7 * twinkle) * smoothstep(130.0, 30.0, dist);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(uColor, a * vAlpha * 0.55);
  }
`;

interface DustProps {
  count: number;
}

/** Slow gold dust drifting above the field. */
export function Dust({ count }: DustProps) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = 1 + Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      seeds[i] = Math.random();
      sizes[i] = 1.2 + Math.random() * 2.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color('#F5D38A') },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    sceneStore.setTelemetry({ dust: count });
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, count]);

  useFrame((state) => {
    material.uniforms.uTime.value = sceneStore.state.reducedMotion ? 0 : state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
