import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type EntityType = 'box' | 'table' | 'chair' | 'shelf' | 'lamp' | 'wall' | 'door' | 'floor' | 'roof' | 'ai_generated' | 'custom' | 'bed' | 'computer_desk' | 'plant' | 'refrigerator';

export type CustomPrimitiveType = 'box' | 'cylinder' | 'sphere' | 'cone' | 'arch';

export interface CustomEntityMetadata {
  primitive?: CustomPrimitiveType;
  width?: number;
  height?: number;
  depth?: number;
  thickness?: number;
  slope?: number;
  radius?: number;
  segments?: number;
  taper?: number;
  skewX?: number;
  skewZ?: number;
  roughness?: number;
  metalness?: number;
  materialPreset?: 'wood' | 'metal' | 'plastic' | 'glass' | 'stone';
  layer?: number;
  name?: string;
  [key: string]: any;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  metadata?: CustomEntityMetadata;
  scad_code?: string;
  prompt?: string;
}

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface EnvironmentSettings {
  backgroundColor: string;
  lightIntensity: number;
}

export interface Door {
  id: string;
  position: number; // distance from wall start
  width: number;
  height: number;
}

export interface Wall {
  id: string;
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
  doors?: Door[];
  material?: string;
}

export interface RoomData {
  width?: number;
  depth?: number;
  walls: Wall[];
}

interface EditorState {
  entities: Entity[];
  selectedId: string | null;
  selectedIds: string[];
  transformMode: TransformMode;
  roomId: string | null;
  isSidebarOpen: boolean;
  isPropertiesOpen: boolean;
  environmentSettings: EnvironmentSettings;
  room?: RoomData;
  
  // Actions
  setRoomId: (id: string) => void;
  setEntities: (entities: Entity[]) => void;
  addEntity: (type: EntityType) => string; 
  addCustomEntity: (entity: Partial<Entity> & { metadata?: CustomEntityMetadata }) => string;
  removeEntity: (id: string) => void;
  updateEntity: (id: string, updates: Partial<Omit<Entity, 'id'>>) => void;
  moveSelected: (delta: [number, number, number]) => void;
  duplicateSelected: () => string[];
  deleteSelected: () => string[];
  reorderEntity: (id: string, direction: 'forward' | 'backward') => void;
  selectEntity: (id: string | null, additive?: boolean) => void;
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;
  setTransformMode: (mode: TransformMode) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsPropertiesOpen: (isOpen: boolean) => void;
  setEnvironmentSettings: (settings: Partial<EnvironmentSettings>) => void;
  setRoomData: (room: RoomData) => void;
  addWall: (wall?: Partial<Wall>) => string;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  removeWall: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  entities: [],
  selectedId: null,
  selectedIds: [],
  transformMode: 'translate',
  roomId: null,
  isSidebarOpen: true,
  isPropertiesOpen: true,
  environmentSettings: {
    backgroundColor: '#0F1117',
    lightIntensity: 1.5,
  },

  setRoomId: (id) => set({ roomId: id }),
  setEntities: (entities) => set({ entities, selectedId: null, selectedIds: [] }),
  room: undefined,

  addEntity: (type) => {
    const id = uuidv4();
    set((state) => {
      const roomPiecePresets: Partial<Record<EntityType, Partial<Entity>>> = {
        wall: {
          name: `Wall ${state.entities.length + 1}`,
          color: '#394353',
          metadata: { width: 3, height: 2.8, depth: 0.12, thickness: 0.12, primitive: 'box' },
        },
        door: {
          name: `Door ${state.entities.length + 1}`,
          color: '#9A6B43',
          metadata: { width: 0.9, height: 2.1, depth: 0.08, thickness: 0.08, primitive: 'box' },
        },
        floor: {
          name: `Floor ${state.entities.length + 1}`,
          color: '#232838',
          metadata: { width: 6, height: 0.08, depth: 6, thickness: 0.08, primitive: 'box' },
        },
        roof: {
          name: `Roof ${state.entities.length + 1}`,
          color: '#4B5563',
          metadata: { width: 6, height: 0.2, depth: 6, thickness: 0.2, slope: 0.35, primitive: 'box' },
        },
      };

      const roomPiece = roomPiecePresets[type];
      const newEntity: Entity = {
        id,
        type,
        name: roomPiece?.name ?? `${type.charAt(0).toUpperCase() + type.slice(1)} ${state.entities.length + 1}`,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: roomPiece?.color ?? '#4B5563',
        metadata: { layer: state.entities.length, primitive: type === 'box' ? 'box' : undefined, ...(roomPiece?.metadata ?? {}) },
      };
      return { 
        entities: [...state.entities, newEntity],
        selectedId: id,
        selectedIds: [id],
      };
    });
    return id;
  },

  addCustomEntity: (entity) => {
    const id = entity.id ?? uuidv4();
    set((state) => {
      const newEntity: Entity = {
        id,
        type: 'custom',
        name: entity.name ?? 'Custom Object',
        position: entity.position ?? [0, 0, 0],
        rotation: entity.rotation ?? [0, 0, 0],
        scale: entity.scale ?? [1, 1, 1],
        color: entity.color ?? '#8B5CF6',
        metadata: {
          primitive: entity.metadata?.primitive ?? 'box',
          width: 1.5,
          height: 1.5,
          depth: 1.5,
          radius: 0.7,
          segments: 24,
          taper: 0,
          skewX: 0,
          skewZ: 0,
          roughness: 0.5,
          metalness: 0.1,
          materialPreset: 'plastic',
          layer: state.entities.length,
          ...entity.metadata,
        },
        scad_code: entity.scad_code,
        prompt: entity.prompt,
      };

      return {
        entities: [...state.entities, newEntity],
        selectedId: id,
        selectedIds: [id],
      };
    });
    return id;
  },

  removeEntity: (id) => set((state) => ({
    entities: state.entities.filter((e) => e.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
    selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
  })),

  updateEntity: (id, updates) => set((state) => ({
    entities: state.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)),
  })),

  moveSelected: (delta) => set((state) => {
    const ids = state.selectedIds.length > 0 ? state.selectedIds : state.selectedId ? [state.selectedId] : [];
    if (ids.length === 0) return state;

    return {
      entities: state.entities.map((entity) => ids.includes(entity.id)
        ? {
            ...entity,
            position: [
              entity.position[0] + delta[0],
              entity.position[1] + delta[1],
              entity.position[2] + delta[2],
            ] as [number, number, number],
          }
        : entity),
    };
  }),

  duplicateSelected: () => {
    const { entities, selectedIds, selectedId } = get();
    const sourceIds = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
    if (sourceIds.length === 0) return [];

    const createdIds: string[] = [];
    set((state) => {
      const additions = state.entities
        .filter((entity) => sourceIds.includes(entity.id))
        .map((entity, index) => {
          const newId = uuidv4();
          createdIds.push(newId);
          return {
            ...entity,
            id: newId,
            name: `${entity.name} Copy ${index + 1}`,
            position: [entity.position[0] + 0.4, entity.position[1], entity.position[2] + 0.4] as [number, number, number],
            metadata: { ...entity.metadata, layer: state.entities.length + index },
          };
        });

      return {
        entities: [...state.entities, ...additions],
        selectedId: createdIds[0] ?? state.selectedId,
        selectedIds: createdIds,
      };
    });

    return createdIds;
  },

  deleteSelected: () => {
    const { selectedIds, selectedId, entities } = get();
    const sourceIds = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
    if (sourceIds.length === 0) return [];

    const removed = entities.filter((entity) => sourceIds.includes(entity.id)).map((entity) => entity.id);
    set((state) => ({
      entities: state.entities.filter((entity) => !sourceIds.includes(entity.id)),
      selectedId: null,
      selectedIds: [],
    }));

    return removed;
  },

  reorderEntity: (id, direction) => set((state) => {
    const index = state.entities.findIndex((entity) => entity.id === id);
    if (index < 0) return state;
    const nextIndex = direction === 'forward' ? Math.min(state.entities.length - 1, index + 1) : Math.max(0, index - 1);
    if (nextIndex === index) return state;
    const nextEntities = [...state.entities];
    const [item] = nextEntities.splice(index, 1);
    nextEntities.splice(nextIndex, 0, item);
    return { entities: nextEntities };
  }),

  selectEntity: (id, additive = false) => set((state) => {
    if (id === null) {
      return { selectedId: null, selectedIds: [] };
    }

    if (!additive) {
      return { selectedId: id, selectedIds: [id] };
    }

    const alreadySelected = state.selectedIds.includes(id);
    const selectedIds = alreadySelected
      ? state.selectedIds.filter((selectedId) => selectedId !== id)
      : [...state.selectedIds, id];

    return {
      selectedId: selectedIds[0] ?? null,
      selectedIds,
    };
  }),

  setSelectedIds: (ids) => set({ selectedIds: ids, selectedId: ids[0] ?? null }),

  clearSelection: () => set({ selectedId: null, selectedIds: [] }),
  
  setTransformMode: (mode) => set({ transformMode: mode }),

  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsPropertiesOpen: (isOpen) => set({ isPropertiesOpen: isOpen }),
  setEnvironmentSettings: (settings) => set((state) => ({
    environmentSettings: { ...state.environmentSettings, ...settings }
  })),
  setRoomData: (room) => set({ room }),
  addWall: (wall) => {
    const id = wall?.id ?? uuidv4();
    set((state) => ({
      room: {
        ...(state.room ?? { walls: [] }),
        walls: [
          ...(state.room?.walls ?? []),
          {
            id,
            start: wall?.start ?? [-2, -2],
            end: wall?.end ?? [2, -2],
            height: wall?.height ?? 3,
            thickness: wall?.thickness ?? 0.12,
            doors: wall?.doors ?? [],
            material: wall?.material ?? '#1D2330',
          },
        ],
      },
    }));
    return id;
  },
  updateWall: (id, updates) => set((state) => ({
    room: state.room ? { ...state.room, walls: state.room.walls.map((w) => w.id === id ? { ...w, ...updates } : w) } : state.room,
  })),
  removeWall: (id) => set((state) => ({
    room: state.room ? { ...state.room, walls: state.room.walls.filter((w) => w.id !== id) } : state.room,
  })),
}));
