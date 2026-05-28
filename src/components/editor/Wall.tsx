"use client"

import { Mesh } from 'three';
import { useRef } from 'react';
import * as THREE from 'three';

type WallProps = {
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
  material?: string;
  doors?: { position: number; width: number; height: number; id?: string }[];
};

export function Wall({ start, end, height, thickness, material = '#1D2330', doors = [] }: WallProps) {
  const ref = useRef<Mesh | null>(null);

  // compute wall length and angle
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);

  return (
    <group position={[ (start[0] + end[0]) / 2, height / 2, (start[1] + end[1]) / 2 ]} rotation={[0, -angle, 0]}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness]} />
        <meshStandardMaterial color={material} roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      {doors.map((door) => (
        <mesh key={door.id ?? `${door.position}-${door.width}`} position={[ -length / 2 + door.position + door.width / 2, door.height / 2, 0.001 ]}>
          <boxGeometry args={[door.width, door.height, thickness + 0.01]} />
          <meshStandardMaterial color="#e6d5c8" roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
