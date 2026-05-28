'use client'

import { useRef, useState, useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { useEditorStore, Entity } from "@/store/useEditorStore";
import { Box } from "./objects/Box";
import { Table } from "./objects/Table";
import { Chair } from "./objects/Chair";
import { Shelf } from "./objects/Shelf";
import { Lamp } from "./objects/Lamp";
import { AIGeneratedObject } from "./objects/AIGeneratedObject";
import { Refrigerator } from "./objects/Refrigerator";
import { Bed } from "./objects/Bed";
import { ComputerDesk } from "./objects/ComputerDesk";
import { Plant } from "./objects/Plant";
import { ParametricObject } from "./objects/ParametricObject";
import { RoomPart } from "./objects/RoomPart";
import { Group } from "three";
import { saveEntity } from "@/app/editor/actions";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";

export function InteractiveObject({ entity }: { entity: Entity }) {
  const groupRef = useRef<Group>(null);
  const [isReady, setIsReady] = useState(false);
  const metadata = entity.metadata || {};
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const transformMode = useEditorStore((state) => state.transformMode);
  const roomId = useEditorStore((state) => state.roomId);
  
  const isSelected = selectedIds.includes(entity.id);
  const isPrimarySelected = selectedId === entity.id && selectedIds.length === 1;

  useEffect(() => {
    // Đảm bảo object đã hoàn toàn mount vào scene graph của Three.js
    const timer = setTimeout(() => {
      if (groupRef.current) setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [entity.id]);

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
      case 'bed': return <Bed color={entity.color} />;
      case 'computer_desk': return <ComputerDesk color={entity.color} />;
      case 'plant': return <Plant color={entity.color} />;
      case 'refrigerator': return <Refrigerator color={entity.color} />;
      case 'wall':
      case 'door':
      case 'floor':
      case 'roof':
        return <RoomPart entity={entity} />;
      case 'ai_generated': return <AIGeneratedObject scadCode={entity.scad_code} color={entity.color} />;
      case 'custom': return <ParametricObject color={entity.color} metadata={entity.metadata} />;
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
          selectEntity(entity.id, e.shiftKey || e.metaKey || e.ctrlKey);
        }}
      >
        {renderObject()}
        
        {isSelected && (
          <mesh
            scale={
              entity.type === 'wall'
                ? [1.06, 1.06, 1.06]
                : entity.type === 'door'
                ? [1.08, 1.08, 1.08]
                : entity.type === 'floor'
                ? [1.06, 1.06, 1.06]
                : entity.type === 'roof'
                ? [1.08, 1.08, 1.08]
                : [1.1, 1.1, 1.1]
            }
          >
            <boxGeometry
              args={
                entity.type === 'wall'
                  ? [metadata.width ?? 3, metadata.height ?? 2.8, metadata.depth ?? metadata.thickness ?? 0.12]
                  : entity.type === 'door'
                  ? [metadata.width ?? 0.9, metadata.height ?? 2.1, metadata.depth ?? metadata.thickness ?? 0.08]
                  : entity.type === 'floor'
                  ? [metadata.width ?? 6, metadata.height ?? metadata.thickness ?? 0.08, metadata.depth ?? 6]
                  : entity.type === 'roof'
                  ? [metadata.width ?? 6, metadata.height ?? metadata.thickness ?? 0.2, metadata.depth ?? 6]
                  : [1, 1, 1]
              }
            />
            <meshBasicMaterial color={isPrimarySelected ? "#8B5CF6" : "#22C55E"} wireframe transparent opacity={0.28} />
          </mesh>
        )}
      </group>

      {isPrimarySelected && isReady && groupRef.current && (
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
