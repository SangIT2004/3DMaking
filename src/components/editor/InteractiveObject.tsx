'use client'

import { useRef, useState, useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { useEditorStore, Entity } from "@/store/useEditorStore";
import { Box } from "./objects/Box";
import { Table } from "./objects/Table";
import { Chair } from "./objects/Chair";
import { Shelf } from "./objects/Shelf";
import { Lamp } from "./objects/Lamp";
import { AssetObject } from "./objects/AssetObject";
import { Group, Mesh } from "three";
import { saveEntity } from "@/app/editor/actions";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";

export function InteractiveObject({ entity }: { entity: Entity }) {
  const groupRef = useRef<Group>(null);
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const transformMode = useEditorStore((state) => state.transformMode);
  const roomId = useEditorStore((state) => state.roomId);
  
  const isSelected = selectedId === entity.id;

  const debouncedSave = useDebouncedCallback(async (updatedEntity, rid) => {
    const res = await saveEntity(updatedEntity, rid);
    if (res.error) toast.error("Lỗi khi đồng bộ vị trí");
  }, 500);

  const renderObject = () => {
    switch (entity.type) {
      case 'box': return <Box color={entity.color} />;
      case 'table': return <Table color={entity.color} />;
      case 'chair': return <Chair color={entity.color} />;
      case 'shelf': return <Shelf color={entity.color} />;
      case 'lamp': return <Lamp color={entity.color} />;
      case 'asset': return entity.modelUrl ? <AssetObject url={entity.modelUrl} /> : <Box color={entity.color} />;
      default: return <Box color={entity.color} />;
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={entity.position}
        rotation={entity.rotation}
        scale={entity.scale}
        onClick={(e: any) => {
          e.stopPropagation();
          selectEntity(entity.id);
        }}
      >
        {renderObject()}
        
        {isSelected && (
          <mesh>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.3} />
          </mesh>
        )}
      </group>

      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          onMouseUp={() => {
            if (groupRef.current && roomId) {
              const { position, rotation, scale } = groupRef.current;
              const updatedData = {
                position: [position.x, position.y, position.z] as [number, number, number],
                rotation: [rotation.x, rotation.y, rotation.z] as [number, number, number],
                scale: [scale.x, scale.y, scale.z] as [number, number, number],
              };
              updateEntity(entity.id, updatedData);
              debouncedSave({ ...entity, ...updatedData }, roomId);
            }
          }}
        />
      )}
    </>
  );
}
