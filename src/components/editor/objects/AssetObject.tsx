'use client'

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { Mesh } from "three";

export function AssetObject({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Configure shadows for all meshes in the model
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
