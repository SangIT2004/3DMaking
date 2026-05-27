'use client'

export function Table({ color }: { color: string }) {
  return (
    <group>
      {/* Table Top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Legs */}
      {[[-0.8, 0, -0.5], [0.8, 0, -0.5], [-0.8, 0, 0.5], [0.8, 0, 0.5]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.2, pos[2]]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
