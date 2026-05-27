'use client'

import { useState } from "react";
import { Mesh } from "three";

interface PlaceholderObjectProps {
  position?: [number, number, number];
}

export function PlaceholderObject({ position = [0, 0, 0] }: PlaceholderObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <mesh
      position={position}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={clicked ? "#8B5CF6" : hovered ? "#A78BFA" : "#4B5563"} 
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}
