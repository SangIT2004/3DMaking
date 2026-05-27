'use client'

export function Chair({ color }: { color: string }) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.08, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      {[[-0.25, 0.1, -0.25], [0.25, 0.1, -0.25], [-0.25, 0.1, 0.25], [0.25, 0.1, 0.25]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
