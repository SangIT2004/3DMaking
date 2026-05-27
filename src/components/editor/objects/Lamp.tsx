'use client'

export function Lamp({ color }: { color: string }) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Pole */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Lamp Head */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.1, 0.4, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Point Light (Local) */}
      <pointLight position={[0, 1.5, 0]} intensity={0.5} distance={5} color={color} />
    </group>
  );
}
