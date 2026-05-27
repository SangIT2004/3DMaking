'use client'

import { Canvas } from "@react-three/fiber";
import { RoomEnvironment } from "./RoomEnvironment";
import { PlaceholderObject } from "./PlaceholderObject";
import { Suspense } from "react";

export function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 8], fov: 40 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0F1117"]} />
      
      <Suspense fallback={null}>
        <RoomEnvironment />
        <PlaceholderObject position={[0, 0.5, 0]} />
        <PlaceholderObject position={[2, 0.5, -2]} />
      </Suspense>
    </Canvas>
  );
}
