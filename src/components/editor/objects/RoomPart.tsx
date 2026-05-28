"use client"

import * as THREE from 'three';
import { Entity } from '@/store/useEditorStore';

function getSize(entity: Entity, fallback: [number, number, number]): [number, number, number] {
  const metadata = entity.metadata || {};
  return [
    metadata.width ?? fallback[0],
    metadata.height ?? fallback[1],
    metadata.depth ?? fallback[2],
  ];
}

export function RoomPart({ entity }: { entity: Entity }) {
  const metadata = entity.metadata || {};
  const commonMaterial = <meshStandardMaterial color={entity.color} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />;

  switch (entity.type) {
    case 'wall': {
      const [width, height, depth] = getSize(entity, [3, 2.8, 0.12]);
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            {commonMaterial}
          </mesh>
        </group>
      );
    }
    case 'door': {
      const [width, height, depth] = getSize(entity, [0.9, 2.1, 0.08]);
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={entity.color} roughness={0.6} metalness={0.08} />
          </mesh>
          <mesh position={[width * 0.32, 0.05, depth / 2 + 0.015]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#d9c9a7" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      );
    }
    case 'floor': {
      const [width, thickness, depth] = getSize(entity, [6, 0.08, 6]);
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, thickness, depth]} />
            <meshStandardMaterial color={entity.color} roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
    }
    case 'roof': {
      const [width, thickness, depth] = getSize(entity, [6, 0.2, 6]);
      const slope = metadata.slope ?? 0.35;
      return (
        <group>
          <mesh castShadow receiveShadow rotation={[0, 0, -(Math.PI / 10) + slope * 0.15]}>
            <boxGeometry args={[width, thickness, depth]} />
            <meshStandardMaterial color={entity.color} roughness={0.9} metalness={0.04} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, thickness * 0.25, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[width * 0.75, thickness * 0.2, depth * 0.75]} />
            <meshStandardMaterial color={entity.color} roughness={0.95} metalness={0.02} transparent opacity={0.25} />
          </mesh>
        </group>
      );
    }
    default:
      return null;
  }
}
