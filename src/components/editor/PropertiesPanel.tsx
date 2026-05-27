'use client'

import { useEditorStore } from "@/store/useEditorStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

export function PropertiesPanel() {
  const selectedId = useEditorStore((state) => state.selectedId);
  const entities = useEditorStore((state) => state.entities);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const removeEntity = useEditorStore((state) => state.removeEntity);

  const selectedEntity = entities.find((e) => e.id === selectedId);

  if (!selectedId || !selectedEntity) return null;

  const handleUpdate = (field: string, axis: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const current = (selectedEntity as any)[field] as [number, number, number];
    const next = [...current] as [number, number, number];
    next[axis] = numValue;
    updateEntity(selectedId, { [field]: next });
  };

  return (
    <div className="w-72 h-full bg-[#161822]/80 backdrop-blur-xl border-l border-white/5 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-white font-medium text-sm">Thuộc tính</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white" onClick={() => selectEntity(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Tên vật thể</label>
          <Input 
            value={selectedEntity.name} 
            onChange={(e) => updateEntity(selectedId, { name: e.target.value })}
            className="h-9 bg-black/20 border-white/10 text-gray-200"
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Màu sắc</label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={selectedEntity.color} 
              onChange={(e) => updateEntity(selectedId, { color: e.target.value })}
              className="h-9 w-12 p-1 bg-black/20 border-white/10"
            />
            <Input 
              value={selectedEntity.color} 
              onChange={(e) => updateEntity(selectedId, { color: e.target.value })}
              className="h-9 flex-1 bg-black/20 border-white/10 text-gray-200 uppercase"
            />
          </div>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Vị trí</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="space-y-1">
                <span className="text-[9px] text-gray-600 block text-center font-bold">{axis}</span>
                <Input 
                  type="number"
                  step="0.1"
                  value={selectedEntity.position[i].toFixed(2)}
                  onChange={(e) => handleUpdate('position', i, e.target.value)}
                  className="h-8 px-1 text-center bg-black/20 border-white/10 text-gray-200 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Xoay (Rad)</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="space-y-1">
                <span className="text-[9px] text-gray-600 block text-center font-bold">{axis}</span>
                <Input 
                  type="number"
                  step="0.1"
                  value={selectedEntity.rotation[i].toFixed(2)}
                  onChange={(e) => handleUpdate('rotation', i, e.target.value)}
                  className="h-8 px-1 text-center bg-black/20 border-white/10 text-gray-200 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Tỉ lệ</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} className="space-y-1">
                <span className="text-[9px] text-gray-600 block text-center font-bold">{axis}</span>
                <Input 
                  type="number"
                  step="0.1"
                  value={selectedEntity.scale[i].toFixed(2)}
                  onChange={(e) => handleUpdate('scale', i, e.target.value)}
                  className="h-8 px-1 text-center bg-black/20 border-white/10 text-gray-200 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-white/5">
          <Button 
            variant="destructive" 
            className="w-full gap-2 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
            onClick={() => removeEntity(selectedId)}
          >
            <Trash2 className="h-4 w-4" />
            Xóa vật thể
          </Button>
        </div>
      </div>
    </div>
  );
}
