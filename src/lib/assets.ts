export interface Asset {
  id: string;
  name: string;
  category: 'furniture' | 'decor' | 'lighting' | 'electronics';
  thumbnail: string;
  modelUrl: string;
  scale?: [number, number, number];
}

export const ASSET_LIBRARY: Asset[] = [
  {
    id: 'sofa_01',
    name: 'Modern Sofa',
    category: 'furniture',
    thumbnail: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/thumbnail.png',
    modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf',
    scale: [1, 1, 1]
  },
  {
    id: 'plant_01',
    name: 'Potted Plant',
    category: 'decor',
    thumbnail: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-tree/thumbnail.png',
    modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-tree/model.gltf',
    scale: [0.5, 0.5, 0.5]
  },
  {
    id: 'lamp_01',
    name: 'Floor Lamp',
    category: 'lighting',
    thumbnail: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/floor-lamp/thumbnail.png',
    modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/floor-lamp/model.gltf',
    scale: [1, 1, 1]
  },
  {
    id: 'table_01',
    name: 'Coffee Table',
    category: 'furniture',
    thumbnail: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coffee-table/thumbnail.png',
    modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coffee-table/model.gltf',
    scale: [1, 1, 1]
  }
];
