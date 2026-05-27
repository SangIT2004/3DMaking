'use client'

import { useEditorStore, EntityType } from "@/store/useEditorStore";
import { Move, RotateCcw, Maximize, Square, Lamp, Sofa, Table as TableIcon, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveEntity } from "@/app/editor/actions";
import { toast } from "sonner";

const TOOLS: { type: EntityType; icon: any; label: string }[] = [
  { type: 'box', icon: Square, label: 'Khối hộp' },
  { type: 'table', icon: TableIcon, label: 'Bàn' },
  { type: 'chair', icon: Sofa, label: 'Ghế' },
  { type: 'shelf', icon: LayoutPanelLeft, label: 'Tủ kệ' },
  { type: 'lamp', icon: Lamp, label: 'Đèn' },
];

export function Sidebar() {
  const addEntity = useEditorStore((state) => state.addEntity);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const roomId = useEditorStore((state) => state.roomId);

  const handleAdd = async (type: EntityType) => {
    const id = addEntity(type);
    const newEntity = useEditorStore.getState().entities.find(e => e.id === id);
    if (newEntity && roomId) {
      const res = await saveEntity(newEntity, roomId);
      if (res.error) toast.error("Không thể lưu vật thể mới");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto">
      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3">Công cụ chỉnh sửa</h2>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full", transformMode === 'translate' && "bg-violet-500/20 text-violet-400 border border-violet-500/30")}
            onClick={() => setTransformMode('translate')}
            title="Di chuyển (T)"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full", transformMode === 'rotate' && "bg-violet-500/20 text-violet-400 border border-violet-500/30")}
            onClick={() => setTransformMode('rotate')}
            title="Xoay (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full", transformMode === 'scale' && "bg-violet-500/20 text-violet-400 border border-violet-500/30")}
            onClick={() => setTransformMode('scale')}
            title="Phóng to (S)"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3">Thư viện vật thể</h2>
        <div className="space-y-2">
          {TOOLS.map((tool) => (
            <Button
              key={tool.type}
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              onClick={() => handleAdd(tool.type)}
            >
              <tool.icon className="h-4 w-4" />
              <span className="text-sm font-normal">{tool.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
        <p className="text-[10px] text-violet-300 leading-relaxed">
          <strong>Mẹo:</strong> Nhấn vào vật thể trong không gian để hiện công cụ điều chỉnh.
        </p>
      </div>
    </div>
  );
}
