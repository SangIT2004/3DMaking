'use client'

import * as THREE from 'three';

type RoomShellProps = {
  width?: number;
  depth?: number;
  height?: number;
};

export function RoomShell({ width = 10, depth = 10, height = 3 }: RoomShellProps) {
  const wallColor = '#1D2330';
  const trimColor = '#2B3344';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#11151d" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[0, height / 2, -depth / 2]} receiveShadow castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={trimColor} roughness={0.9} metalness={0.05} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, height + 0.02, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={trimColor} roughness={0.9} metalness={0.05} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]} receiveShadow castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}