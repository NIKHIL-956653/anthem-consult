'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLUMN_COUNT, FIELD, formations, litMask, type FormationContext, type FormationOut } from '@/lib/formations';
import { sceneStore } from '@/lib/sceneStore';

const GOLD = '#E3B65A';
const NAVY = '#0E1527';
const MAX_GLOW = 1.35;

/** Patch MeshStandardMaterial so each instance can emit gold from an `aGlow` attribute. */
function createFieldMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(NAVY),
    roughness: 0.58,
    metalness: 0.32,
    emissive: new THREE.Color('#000000'),
    fog: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGold = { value: new THREE.Color(GOLD) };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        [
          '#include <common>',
          'attribute float aGlow;',
          'varying float vGlow;',
          'varying float vTop;',
          'varying vec3 vNrm;',
          'varying vec3 vViewDir;',
        ].join('\n'),
      )
      .replace(
        '#include <begin_vertex>',
        ['#include <begin_vertex>', 'vGlow = aGlow;', 'vTop = step(0.5, normal.y);'].join('\n'),
      )
      .replace(
        '#include <project_vertex>',
        [
          '#include <project_vertex>',
          'vNrm = normalize(transformedNormal);',
          'vViewDir = normalize(-mvPosition.xyz);',
        ].join('\n'),
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        [
          '#include <common>',
          'uniform vec3 uGold;',
          'varying float vGlow;',
          'varying float vTop;',
          'varying vec3 vNrm;',
          'varying vec3 vViewDir;',
        ].join('\n'),
      )
      .replace(
        '#include <emissivemap_fragment>',
        [
          '#include <emissivemap_fragment>',
          'float fieldFresnel = pow(1.0 - clamp(dot(normalize(vNrm), normalize(vViewDir)), 0.0, 1.0), 3.0);',
          'totalEmissiveRadiance += uGold * vGlow * mix(0.35, 1.0, vTop);',
          'totalEmissiveRadiance += uGold * fieldFresnel * (0.045 + 0.22 * vGlow);',
        ].join('\n'),
      );
  };

  // The patched shader must not share a program with an unpatched standard material.
  material.customProgramCacheKey = () => 'anthem-field';
  return material;
}

export function Field() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  const resources = useMemo(() => {
    const geometry = new THREE.BoxGeometry(FIELD.columnSize, 1, FIELD.columnSize);
    geometry.translate(0, 0.5, 0);

    const glowArray = new Float32Array(COLUMN_COUNT);
    const glowAttr = new THREE.InstancedBufferAttribute(glowArray, 1);
    glowAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('aGlow', glowAttr);

    // Per column: world x, world z, normalized x, normalized z.
    const coords = new Float32Array(COLUMN_COUNT * 4);
    for (let j = 0; j < FIELD.rows; j += 1) {
      for (let i = 0; i < FIELD.cols; i += 1) {
        const idx = j * FIELD.cols + i;
        const wx = (i - (FIELD.cols - 1) / 2) * FIELD.spacing;
        const wz = (j - (FIELD.rows - 1) / 2) * FIELD.spacing;
        coords[idx * 4] = wx;
        coords[idx * 4 + 1] = wz;
        coords[idx * 4 + 2] = wx / FIELD.halfX;
        coords[idx * 4 + 3] = wz / FIELD.halfZ;
      }
    }

    const heights = new Float32Array(COLUMN_COUNT).fill(FIELD.minHeight);
    const material = createFieldMaterial();
    const ctx: FormationContext = { t: 0, active: -1, lit: 0 };
    const out: FormationOut = { h: 0, g: 0 };

    return { geometry, glowAttr, glowArray, coords, heights, material, ctx, out };
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const arr = mesh.instanceMatrix.array as Float32Array;
    const { coords, heights } = resources;
    for (let i = 0; i < COLUMN_COUNT; i += 1) {
      const o = i * 16;
      arr[o] = 1;
      arr[o + 5] = heights[i];
      arr[o + 10] = 1;
      arr[o + 12] = coords[i * 4];
      arr[o + 13] = 0;
      arr[o + 14] = coords[i * 4 + 1];
      arr[o + 15] = 1;
    }
    mesh.instanceMatrix.needsUpdate = true;
    sceneStore.setTelemetry({ columns: COLUMN_COUNT });

    return () => {
      resources.geometry.dispose();
      resources.material.dispose();
    };
  }, [resources]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const s = sceneStore.state;
    const dt = Math.min(delta, 0.05);
    if (!s.reducedMotion) timeRef.current += dt;

    const station = s.stations[s.stationIndex];
    const fn = formations[station?.formation ?? 'calm'];
    const { ctx, out, coords, heights, glowArray, glowAttr } = resources;
    ctx.t = timeRef.current;
    ctx.active = sceneStore.resolveActive();
    ctx.lit = litMask(station?.lit);

    // Organic morph: every column eases toward its target each frame.
    const k = s.reducedMotion ? 1 : 1 - Math.exp(-3.5 * dt);
    const arr = mesh.instanceMatrix.array as Float32Array;

    for (let i = 0; i < COLUMN_COUNT; i += 1) {
      const c = i * 4;
      fn(out, coords[c], coords[c + 1], coords[c + 2], coords[c + 3], ctx);
      const targetG = out.g < 0 ? 0 : out.g > MAX_GLOW ? MAX_GLOW : out.g;
      heights[i] += (out.h - heights[i]) * k;
      glowArray[i] += (targetG - glowArray[i]) * k;
      arr[i * 16 + 5] = heights[i];
    }

    mesh.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[resources.geometry, resources.material, COLUMN_COUNT]}
      frustumCulled={false}
    />
  );
}
