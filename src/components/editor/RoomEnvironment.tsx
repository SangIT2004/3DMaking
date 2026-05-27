'use client'

import { OrbitControls, Grid, SoftShadows } from "@react-three/drei";

export function RoomEnvironment() {
  return (
    <>
      {/* Controls */}
      <OrbitControls 
        makeDefault 
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 20]} />
      </directionalLight>

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

      {/* Basic Floor Plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
