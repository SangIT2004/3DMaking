'use client'

import { Canvas } from "@react-three/fiber";
import { RoomEnvironment } from "./RoomEnvironment";
import { InteractiveObject } from "./InteractiveObject";
import { Suspense } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export function Scene() {
  const entities = useEditorStore((state) => state.entities);
  const selectEntity = useEditorStore((state) => state.selectEntity);

  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 8], fov: 40 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
      onPointerMissed={() => selectEntity(null)}
    >
      <color attach="background" args={["#0F1117"]} />
      
      <Suspense fallback={null}>
        <RoomEnvironment />
        
        {entities.map((entity) => (
          <InteractiveObject key={entity.id} entity={entity} />
        ))}
      </Suspense>
    </Canvas>
  );
}
