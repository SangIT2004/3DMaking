'use client'

import { useEditorStore } from "@/store/useEditorStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteEntity, saveEntity } from "@/app/editor/actions";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export function PropertiesPanel() {
  const selectedId = useEditorStore((state) => state.selectedId);
  const entities = useEditorStore((state) => state.entities);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const removeEntity = useEditorStore((state) => state.removeEntity);
  const roomId = useEditorStore((state) => state.roomId);

  const [materialPrompt, setMaterialPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedEntity = entities.find((e) => e.id === selectedId);

  const debouncedSave = useDebouncedCallback(async (entity, rid) => {
    const res = await saveEntity(entity, rid);
    if (res.error) toast.error("Lỗi khi lưu thay đổi");
  }, 500);

  if (!selectedId || !selectedEntity) {
    return (
      <div className="p-4 text-center mt-20 text-gray-500 text-xs overflow-hidden whitespace-nowrap">
        Chọn một vật thể để xem thuộc tính
      </div>
    );
  }

  const handleUpdate = (field: string, axis: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const current = (selectedEntity as any)[field] as [number, number, number];
    const next = [...current] as [number, number, number];
    next[axis] = numValue;
    
    const updates = { [field]: next };
    updateEntity(selectedId, updates);
    
    if (roomId) {
      debouncedSave({ ...selectedEntity, ...updates }, roomId);
    }
  };

  const handleUpdateSingle = (updates: any) => {
    updateEntity(selectedId, updates);
    if (roomId) {
      debouncedSave({ ...selectedEntity, ...updates }, roomId);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa vật thể này?")) return;
    const res = await deleteEntity(selectedId);
    if (res.error) {
      toast.error("Lỗi khi xóa: " + res.error);
    } else {
      removeEntity(selectedId);
      toast.success("Đã xóa vật thể");
    }
  };

  const handleGenerateMaterial = async () => {
    if (!materialPrompt.trim()) return toast.error("Nhập mô tả vật liệu");
    setIsGenerating(true);
    const toastId = toast.loading("Đang sinh vật liệu bằng AI...");

    try {
      const res = await fetch("/api/ai/material", {
        method: "POST",
        body: JSON.stringify({ prompt: materialPrompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Apply the generated texture (in a real app, you'd save this to the entity material property)
      toast.success("Đã sinh vật liệu thành công!", { id: toastId });
      setMaterialPrompt("");
    } catch (err: any) {
      toast.error("Lỗi AI Material: " + err.message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between whitespace-nowrap">
        <h2 className="text-white font-medium text-sm">Thuộc tính</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white" onClick={() => selectEntity(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Tên vật thể</label>
          <Input 
            value={selectedEntity.name} 
            onChange={(e) => handleUpdateSingle({ name: e.target.value })}
            className="h-9 bg-black/20 border-white/10 text-gray-200"
          />
        </div>

        {/* AI Material Studio */}
        <div className="p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <label className="text-violet-200 text-[10px] uppercase font-bold">AI Material Studio</label>
          </div>
          <Input 
            placeholder="VD: Gỗ sồi tối màu..."
            value={materialPrompt}
            onChange={(e) => setMaterialPrompt(e.target.value)}
            disabled={isGenerating}
            className="h-8 bg-black/40 border-white/5 text-[10px] text-white"
          />
          <Button 
            className="w-full h-8 bg-violet-600 hover:bg-violet-500 text-white gap-2 text-[10px] font-bold rounded-lg"
            onClick={handleGenerateMaterial}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Sinh vật liệu
          </Button>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Màu sắc</label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={selectedEntity.color} 
              onChange={(e) => handleUpdateSingle({ color: e.target.value })}
              className="h-9 w-12 p-1 bg-black/20 border-white/10"
            />
            <Input 
              value={selectedEntity.color} 
              onChange={(e) => handleUpdateSingle({ color: e.target.value })}
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
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Xóa vật thể
          </Button>
        </div>
      </div>
    </div>
  );
}
