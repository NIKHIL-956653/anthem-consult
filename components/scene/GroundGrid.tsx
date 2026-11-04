'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uCell;
  uniform float uFade;
  varying vec3 vWorld;

  void main() {
    vec2 coord = vWorld.xz / uCell;
    vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dist = distance(vWorld, cameraPosition);
    float fade = exp(-dist * uFade);
    gl_FragColor = vec4(uColor, line * fade * 0.32);
  }
`;

/** A faint gold grid on the ground plane that fades with distance. */
export function GroundGrid() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#E3B65A') },
          uCell: { value: 4 },
          uFade: { value: 0.026 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <group>
      {/* Dark base plane: catches the lights and takes the fog. */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.04}>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial color="#070A12" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01} material={material}>
        <planeGeometry args={[420, 420]} />
      </mesh>
    </group>
  );
}
