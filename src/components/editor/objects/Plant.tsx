'use client'

export function Plant({ color }: { color: string }) {
  return (
    <group>
      {/* Chậu cây */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.15, 0.4, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Đất */}
      <mesh position={[0, 0.38, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      
      {/* Tán lá giữa */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
      
      {/* Tán lá trái */}
      <mesh position={[-0.2, 0.55, 0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
      
      {/* Tán lá phải */}
      <mesh position={[0.2, 0.55, -0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      
      {/* Thân cây */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}
