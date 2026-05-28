
'use client'

import { OrbitControls, Grid } from "@react-three/drei";

import { useEditorStore } from "@/store/useEditorStore";
import { RoomShell } from "./RoomShell";

export function RoomEnvironment() {
  const envSettings = useEditorStore((state) => state.environmentSettings);

  return (
    <>
      {/* Controls */}
      <OrbitControls 
        makeDefault 
      />

      {/* Lighting */}
      <ambientLight intensity={envSettings.lightIntensity * 0.3} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={envSettings.lightIntensity * 0.95}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 0.1, 30]} />
      </directionalLight>

      <directionalLight position={[-4, 6, -5]} intensity={envSettings.lightIntensity * 0.35} color="#7c8db8" />

      {/* Room Shell */}
      <RoomShell />

      {/* Grid Floor */}
      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionColor="#334155"
        cellColor="#1e293b"
      />

      {/* Invisible floor plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
