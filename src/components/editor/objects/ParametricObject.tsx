'use client'

import { useMemo } from 'react';
import * as THREE from 'three';
import { CustomEntityMetadata } from '@/store/useEditorStore';

type ParametricObjectProps = {
  color: string;
  metadata?: CustomEntityMetadata;
};

type MaterialPreset = 'wood' | 'metal' | 'plastic' | 'glass' | 'stone';

const PRESET_STYLES: Record<MaterialPreset, { roughness: number; metalness: number; opacity?: number; transparent?: boolean }> = {
  wood: { roughness: 0.85, metalness: 0.05 },
  metal: { roughness: 0.28, metalness: 0.85 },
  plastic: { roughness: 0.5, metalness: 0.08 },
  glass: { roughness: 0.06, metalness: 0.0, opacity: 0.45, transparent: true },
  stone: { roughness: 1.0, metalness: 0.0 },
};

function applyDeform(geometry: THREE.BufferGeometry, metadata: CustomEntityMetadata) {
  const position = geometry.attributes.position;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return geometry;

  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const minY = box.min.y;
  const height = Math.max(size.y, 0.0001);

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index) - center.x;
    const y = position.getY(index);
    const z = position.getZ(index) - center.z;
    const progress = THREE.MathUtils.clamp((y - minY) / height, 0, 1);
    const taper = metadata.taper ?? 0;
    const skewX = metadata.skewX ?? 0;
    const skewZ = metadata.skewZ ?? 0;

    const nextX = x * (1 + taper * progress) + skewX * progress;
    const nextZ = z * (1 + taper * progress) + skewZ * progress;

    position.setXYZ(index, nextX, y, nextZ);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function buildGeometry(metadata: CustomEntityMetadata) {
  const primitive = metadata.primitive ?? 'box';
  const segments = metadata.segments ?? 24;

  switch (primitive) {
    case 'sphere':
      return new THREE.SphereGeometry(metadata.radius ?? 0.7, segments, Math.max(12, Math.floor(segments / 2)));
    case 'cylinder':
      return new THREE.CylinderGeometry(metadata.radius ?? 0.55, metadata.radius ?? 0.55, metadata.height ?? 1.5, segments);
    case 'cone':
      return new THREE.ConeGeometry(metadata.radius ?? 0.7, metadata.height ?? 1.5, segments);
    case 'arch':
      return new THREE.BoxGeometry(metadata.width ?? 1.5, metadata.height ?? 1.5, metadata.depth ?? 0.6);
    case 'box':
    default:
      return new THREE.BoxGeometry(metadata.width ?? 1.5, metadata.height ?? 1.5, metadata.depth ?? 1.5);
  }
}

export function ParametricObject({ color, metadata = {} }: ParametricObjectProps) {
  const primitive = metadata.primitive ?? 'box';
  const materialPreset = (metadata.materialPreset ?? 'plastic') as MaterialPreset;
  const materialStyle = PRESET_STYLES[materialPreset] ?? PRESET_STYLES.plastic;

  const geometry = useMemo(() => {
    const nextGeometry = buildGeometry(metadata);

    if (primitive !== 'arch') {
      applyDeform(nextGeometry, metadata);
      nextGeometry.computeBoundingBox();
      if (nextGeometry.boundingBox) {
        const box = nextGeometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        nextGeometry.translate(-center.x, -box.min.y, -center.z);
      }
    }

    return nextGeometry;
  }, [metadata, primitive]);

  if (primitive === 'arch') {
    const width = metadata.width ?? 1.5;
    const height = metadata.height ?? 1.5;
    const depth = metadata.depth ?? 0.6;
    const columnWidth = Math.max(width * 0.16, 0.12);
    const topHeight = Math.max(height * 0.18, 0.16);
    return (
      <group>
        <mesh position={[-width * 0.32, height * 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[columnWidth, height * 0.72, depth]} />
          <meshStandardMaterial color={color} roughness={materialStyle.roughness} metalness={materialStyle.metalness} />
        </mesh>
        <mesh position={[width * 0.32, height * 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[columnWidth, height * 0.72, depth]} />
          <meshStandardMaterial color={color} roughness={materialStyle.roughness} metalness={materialStyle.metalness} />
        </mesh>
        <mesh position={[0, height * 0.56, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, topHeight, depth]} />
          <meshStandardMaterial color={color} roughness={materialStyle.roughness} metalness={materialStyle.metalness} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={materialStyle.roughness}
        metalness={materialStyle.metalness}
        transparent={materialStyle.transparent}
        opacity={materialStyle.opacity ?? 1}
      />
    </mesh>
  );
}