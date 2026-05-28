'use client'

import { Canvas, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "./RoomEnvironment";
import { InteractiveObject } from "./InteractiveObject";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Vector3 } from "three";
import { Group } from "three";
import { TransformControls } from "@react-three/drei";

type MarqueeState = {
  active: boolean;
  finished: boolean;
  start: [number, number];
  current: [number, number];
};

function screenToLocal(event: { clientX: number; clientY: number }, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top] as [number, number];
}

function MarqueeSelectionController({ marquee, onComplete }: { marquee: MarqueeState | null; onComplete: () => void }) {
  const { camera, size } = useThree();
  const entities = useEditorStore((state) => state.entities);
  const setSelectedIds = useEditorStore((state) => state.setSelectedIds);
  const clearSelection = useEditorStore((state) => state.clearSelection);

  useEffect(() => {
    if (!marquee?.active || !marquee.finished) return;

    const minX = Math.min(marquee.start[0], marquee.current[0]);
    const maxX = Math.max(marquee.start[0], marquee.current[0]);
    const minY = Math.min(marquee.start[1], marquee.current[1]);
    const maxY = Math.max(marquee.start[1], marquee.current[1]);
    const projector = new Vector3();

    const selectedIds = entities.filter((entity) => {
      projector.set(entity.position[0], entity.position[1], entity.position[2]).project(camera);
      const screenX = ((projector.x + 1) / 2) * size.width;
      const screenY = ((1 - projector.y) / 2) * size.height;
      return screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY;
    }).map((entity) => entity.id);

    if (selectedIds.length > 0) {
      setSelectedIds(selectedIds);
    } else {
      clearSelection();
    }

    onComplete();
  }, [camera, clearSelection, entities, marquee, onComplete, setSelectedIds, size.height, size.width]);

  return null;
}

function ControlsLock({ locked }: { locked: boolean }) {
  const controls = useThree((state: any) => state.controls);

  useEffect(() => {
    if (!controls) return;
    const prev = (controls as any).enabled;
    (controls as any).enabled = !locked;
    return () => {
      (controls as any).enabled = prev;
    };
  }, [controls, locked]);

  return null;
}

function MultiSelectionTransform() {
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const selectedId = useEditorStore((state) => state.selectedId);
  const entities = useEditorStore((state) => state.entities);
  const moveSelected = useEditorStore((state) => state.moveSelected);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const transformMode = useEditorStore((state) => state.transformMode);
  const [pivotNode, setPivotNode] = useState<Group | null>(null);
  const [isReady, setIsReady] = useState(false);
  const lastPivot = useRef<[number, number, number] | null>(null);

  const activeIds = selectedIds.length > 1 ? selectedIds : [];

  const centroid = useMemo(() => {
    if (activeIds.length === 0) return [0, 0, 0] as [number, number, number];
    const points = entities.filter((entity) => activeIds.includes(entity.id));
    const total = points.reduce<[number, number, number]>((acc, entity) => [
      acc[0] + entity.position[0],
      acc[1] + entity.position[1],
      acc[2] + entity.position[2],
    ], [0, 0, 0]);
    return [total[0] / points.length, total[1] / points.length, total[2] / points.length] as [number, number, number];
  }, [activeIds, entities]);

  useEffect(() => {
    setIsReady(false);
    if (activeIds.length > 0) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [activeIds.length]);

  if (activeIds.length === 0 || selectedId === null) return null;

  return (
    <>
      <group ref={setPivotNode} position={centroid} />
      {isReady && pivotNode && (
        <TransformControls
          object={pivotNode}
          mode={transformMode}
          onMouseDown={() => {
            lastPivot.current = centroid;
          }}
          onObjectChange={() => {
            if (!pivotNode || activeIds.length === 0 || transformMode !== 'translate') return;
            const currentPivot = [pivotNode.position.x, pivotNode.position.y, pivotNode.position.z] as [number, number, number];
            const previousPivot = lastPivot.current ?? currentPivot;
            const delta: [number, number, number] = [
              currentPivot[0] - previousPivot[0],
              currentPivot[1] - previousPivot[1],
              currentPivot[2] - previousPivot[2],
            ];

            if (delta[0] || delta[1] || delta[2]) {
              moveSelected(delta);
              activeIds.forEach((id) => {
                const entity = entities.find((item) => item.id === id);
                if (!entity) return;
                const updatedPosition = [
                  entity.position[0] + delta[0],
                  entity.position[1] + delta[1],
                  entity.position[2] + delta[2],
                ] as [number, number, number];
                updateEntity(id, { position: updatedPosition });
              });
            }

            lastPivot.current = currentPivot;
          }}
        />
      )}
    </>
  );
}

export function Scene() {
  const entities = useEditorStore((state) => state.entities);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const envSettings = useEditorStore((state) => state.environmentSettings);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const sceneWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!marquee?.active) return;

    const handleMove = (event: MouseEvent) => {
      if (!sceneWrapRef.current) return;
      const local = screenToLocal(event, sceneWrapRef.current);
      setMarquee((current) => current ? { ...current, current: local } : current);
    };

    const handleUp = () => {
      setMarquee((current) => current ? { ...current, finished: true } : current);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [marquee?.active]);

  const marqueeStyle = useMemo(() => {
    if (!marquee?.active) return null;

    const left = Math.min(marquee.start[0], marquee.current[0]);
    const top = Math.min(marquee.start[1], marquee.current[1]);
    const width = Math.abs(marquee.start[0] - marquee.current[0]);
    const height = Math.abs(marquee.start[1] - marquee.current[1]);

    return { left, top, width, height };
  }, [marquee]);

  return (
    <div ref={sceneWrapRef} className="relative w-full h-full overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 40 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onPointerMissed={() => {
          if (!marquee?.active) {
            selectEntity(null);
          }
        }}
        onPointerDown={(event) => {
          if (event.shiftKey && event.button === 0) {
            event.stopPropagation();
            if (sceneWrapRef.current) {
              const local = screenToLocal(event, sceneWrapRef.current);
              (event.target as any)?.setPointerCapture?.(event.pointerId);
              setMarquee({
                active: true,
                finished: false,
                start: local,
                current: local,
              });
              return;
            }
            setMarquee({
              active: true,
              finished: false,
              start: [event.clientX, event.clientY],
              current: [event.clientX, event.clientY],
            });
          }
        }}
      >
        <color attach="background" args={[envSettings.backgroundColor]} />
        
        <Suspense fallback={null}>
          <ControlsLock locked={!!marquee?.active} />
          <RoomEnvironment />
          <MarqueeSelectionController
            marquee={marquee}
            onComplete={() => setMarquee(null)}
          />
          <MultiSelectionTransform />
          
          {entities.map((entity) => (
            <InteractiveObject key={entity.id} entity={entity} />
          ))}
        </Suspense>
      </Canvas>

      {marqueeStyle && (
        <div
          className="pointer-events-none absolute border border-violet-400/80 bg-violet-500/15 backdrop-blur-[1px]"
          style={{
            left: marqueeStyle.left,
            top: marqueeStyle.top,
            width: marqueeStyle.width,
            height: marqueeStyle.height,
          }}
        />
      )}
    </div>
  );
}
