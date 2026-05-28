'use client'

export function Refrigerator({ color }: { color: string }) {
  return (
    <group>
      {/* Khung chính tủ lạnh */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.8, 0.7]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Cửa ngăn đá (trên) */}
      <mesh position={[0, 1.45, 0.36]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.65, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Cửa ngăn mát (dưới) */}
      <mesh position={[0, 0.55, 0.36]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 1.05, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Tay nắm cửa ngăn đá */}
      <mesh position={[-0.3, 1.45, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.3, 0.04]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Tay nắm cửa ngăn mát */}
      <mesh position={[-0.3, 0.7, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.5, 0.04]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rãnh chia 2 cửa (Shadow detail) */}
      <mesh position={[0, 1.1, 0.36]}>
        <boxGeometry args={[0.8, 0.02, 0.06]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}
