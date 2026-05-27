import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type EntityType = 'box' | 'table' | 'chair' | 'shelf' | 'lamp';

export interface Entity {
  id: string;
  type: EntityType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
}

export type TransformMode = 'translate' | 'rotate' | 'scale';

interface EditorState {
  entities: Entity[];
  selectedId: string | null;
  transformMode: TransformMode;
  
  // Actions
  addEntity: (type: EntityType) => void;
  removeEntity: (id: string) => void;
  updateEntity: (id: string, updates: Partial<Omit<Entity, 'id'>>) => void;
  selectEntity: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  entities: [],
  selectedId: null,
  transformMode: 'translate',

  addEntity: (type) => set((state) => {
    const newEntity: Entity = {
      id: uuidv4(),
      type,
      position: [0, 0, 0], // Sẽ cần offset nếu có nhiều đồ vật
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#4B5563',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${state.entities.length + 1}`,
    };
    return { 
      entities: [...state.entities, newEntity],
      selectedId: newEntity.id 
    };
  }),

  removeEntity: (id) => set((state) => ({
    entities: state.entities.filter((e) => e.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),

  updateEntity: (id, updates) => set((state) => ({
    entities: state.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)),
  })),

  selectEntity: (id) => set({ selectedId: id }),
  
  setTransformMode: (mode) => set({ transformMode: mode }),
}));
