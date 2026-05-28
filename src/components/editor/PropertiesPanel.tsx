'use client'

import { useEditorStore } from "@/store/useEditorStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, X, Copy, ArrowUp, ArrowDown, Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteEntity, saveEntity, updateRoomEnvironment } from "@/app/editor/actions";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { AxisVectorSection } from "./properties/AxisVectorSection";
import { PanelCard } from "./properties/PanelCard";

export function PropertiesPanel() {
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const entities = useEditorStore((state) => state.entities);
  const selectEntity = useEditorStore((state) => state.selectEntity);
  const updateEntity = useEditorStore((state) => state.updateEntity);
  const removeEntity = useEditorStore((state) => state.removeEntity);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const reorderEntity = useEditorStore((state) => state.reorderEntity);
  const roomId = useEditorStore((state) => state.roomId);
  const envSettings = useEditorStore((state) => state.environmentSettings);
  const setEnvSettings = useEditorStore((state) => state.setEnvironmentSettings);

  const selectedEntity = entities.find((e) => e.id === selectedId);
  const selectedEntities = entities.filter((entity) => selectedIds.includes(entity.id));

  const debouncedSave = useDebouncedCallback(async (entity, rid) => {
    const res = await saveEntity(entity, rid);
    if (res.error) toast.error("Lỗi khi lưu thay đổi");
  }, 500);

  const debouncedSaveEnv = useDebouncedCallback(async (settings, rid) => {
    const res = await updateRoomEnvironment(rid, settings);
    if (res.error) toast.error("Lỗi khi lưu môi trường");
  }, 500);

  const handleEnvUpdate = (settings: any) => {
    setEnvSettings(settings);
    if (roomId) {
      debouncedSaveEnv({ ...envSettings, ...settings }, roomId);
    }
  };

  if (selectedIds.length > 1) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between whitespace-nowrap">
          <h2 className="text-white font-medium text-sm">Chọn nhiều vật thể</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white" onClick={() => selectEntity(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-sm text-white/80 font-medium">{selectedIds.length} vật thể đã được chọn</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">Batch actions</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" className="h-10 gap-2 bg-white/[0.03] hover:bg-white/[0.06]" onClick={() => duplicateSelected()}>
              <Copy className="h-4 w-4" />
              Nhân bản
            </Button>
            <Button variant="ghost" className="h-10 gap-2 bg-white/[0.03] hover:bg-white/[0.06]" onClick={() => deleteSelected()}>
              <Trash2 className="h-4 w-4" />
              Xóa nhóm
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" className="h-10 gap-2 bg-white/[0.03] hover:bg-white/[0.06]" onClick={() => selectedId && reorderEntity(selectedId, 'backward')}>
              <ArrowDown className="h-4 w-4" />
              Lùi lớp
            </Button>
            <Button variant="ghost" className="h-10 gap-2 bg-white/[0.03] hover:bg-white/[0.06]" onClick={() => selectedId && reorderEntity(selectedId, 'forward')}>
              <ArrowUp className="h-4 w-4" />
              Đưa lên
            </Button>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-2">
              <Layers3 className="h-3.5 w-3.5" />
              Danh sách chọn
            </div>
            <div className="space-y-1">
              {selectedEntities.map((entity) => (
                <button
                  key={entity.id}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2 text-sm border transition-colors",
                    entity.id === selectedId
                      ? "bg-violet-500/15 text-violet-100 border-violet-500/20"
                      : "bg-black/10 text-gray-300 border-white/5 hover:bg-white/[0.04]"
                  )}
                  onClick={() => selectEntity(entity.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{entity.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">{entity.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 italic border-t border-white/5 pt-4">
            Mẹo: giữ Shift và kéo trên canvas để chọn thêm nhiều vật thể.
          </div>
        </div>
      </div>
    );
  }

  if (!selectedId || !selectedEntity) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between whitespace-nowrap">
          <h2 className="text-white font-medium text-sm">Cài đặt Môi trường</h2>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
          <PanelCard title="Màu nền">
            <div className="flex gap-2">
              <Input
                type="color"
                value={envSettings.backgroundColor}
                onChange={(e) => handleEnvUpdate({ backgroundColor: e.target.value })}
                className="h-9 w-12 p-1 bg-black/20 border-white/10"
              />
              <Input
                value={envSettings.backgroundColor}
                onChange={(e) => handleEnvUpdate({ backgroundColor: e.target.value })}
                className="h-9 flex-1 bg-black/20 border-white/10 text-gray-200 uppercase"
              />
            </div>
          </PanelCard>

          <PanelCard title="Độ sáng (Light Intensity)">
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={envSettings.lightIntensity}
                onChange={(e) => handleEnvUpdate({ lightIntensity: parseFloat(e.target.value) })}
                className="flex-1 accent-violet-500"
              />
              <span className="text-xs text-gray-300 w-8 text-right">{envSettings.lightIntensity.toFixed(1)}</span>
            </div>
          </PanelCard>

          <div className="text-xs text-gray-500 italic mt-6 border-t border-white/5 pt-4">
            Mẹo: Bấm vào bất kỳ vật thể nào trên khung hình 3D để chỉnh sửa thuộc tính của nó.
          </div>
        </div>
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

        <AxisVectorSection title="Vị trí" values={selectedEntity.position} onChange={(axis, value) => handleUpdate('position', axis, value)} />
        <AxisVectorSection title="Xoay (Rad)" values={selectedEntity.rotation} onChange={(axis, value) => handleUpdate('rotation', axis, value)} />
        <AxisVectorSection title="Tỉ lệ" values={selectedEntity.scale} onChange={(axis, value) => handleUpdate('scale', axis, value)} />

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
