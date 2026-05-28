'use client'

export function Bed({ color }: { color: string }) {
  return (
    <group>
      {/* Khung giường */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.3, 2.0]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Nệm */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 1.9]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      
      {/* Gối trái */}
      <mesh position={[-0.35, 0.55, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Gối phải */}
      <mesh position={[0.35, 0.55, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Mền (Chăn) */}
      <mesh position={[0, 0.45, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.15, 1.3]} />
        <meshStandardMaterial color={color} opacity={0.9} transparent />
      </mesh>
      
      {/* Đầu giường */}
      <mesh position={[0, 0.6, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.8, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
