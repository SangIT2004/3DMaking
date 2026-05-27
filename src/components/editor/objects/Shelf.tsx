'use client'

export function Shelf({ color }: { color: string }) {
  return (
    <group>
      {/* Frame Sides */}
      <mesh position={[-0.45, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 2, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.45, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 2, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Shelves */}
      {[0.1, 0.6, 1.1, 1.6, 1.95].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.05, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* Back panel */}
      <mesh position={[0, 1, -0.28]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2, 0.02]} />
        <meshStandardMaterial color={color} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}
