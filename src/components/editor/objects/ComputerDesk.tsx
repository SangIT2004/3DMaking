'use client'

export function ComputerDesk({ color }: { color: string }) {
  return (
    <group>
      {/* Mặt bàn */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.05, 0.7]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Chân bàn trái trước */}
      <mesh position={[-0.65, 0.375, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Chân bàn phải trước */}
      <mesh position={[0.65, 0.375, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Chân bàn trái sau */}
      <mesh position={[-0.65, 0.375, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Chân bàn phải sau */}
      <mesh position={[0.65, 0.375, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Màn hình máy tính */}
      <group position={[0, 0.775, -0.15]}>
        {/* Chân đế màn hình */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Cổ màn hình */}
        <mesh position={[0, 0.15, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.2, 0.02]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Viền màn hình */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.35, 0.03]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Màn hình phát sáng */}
        <mesh position={[0, 0.25, 0.016]}>
          <boxGeometry args={[0.58, 0.33, 0.01]} />
          <meshStandardMaterial color="#bae6fd" emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Thùng máy PC */}
      <mesh position={[0.5, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.45, 0.45]} />
        <meshStandardMaterial color="#030712" />
      </mesh>

      {/* Bàn phím */}
      <mesh position={[0, 0.785, 0.15]} castShadow receiveShadow rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Chuột */}
      <mesh position={[0.3, 0.785, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.02, 0.1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}
