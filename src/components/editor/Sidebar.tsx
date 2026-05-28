'use client'

import { useEditorStore, EntityType } from "@/store/useEditorStore";
import { Move, RotateCcw, Maximize, Square, Lamp, Sofa, Table as TableIcon, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveEntity } from "@/app/editor/actions";
import { toast } from "sonner";

import { AIAssistPanel } from "./AIAssistPanel";

const TOOLS: { type: EntityType; icon: any; label: string }[] = [
  { type: 'box', icon: Square, label: 'Khối hộp' },
  { type: 'table', icon: TableIcon, label: 'Bàn' },
  { type: 'chair', icon: Sofa, label: 'Ghế' },
  { type: 'shelf', icon: LayoutPanelLeft, label: 'Tủ kệ' },
  { type: 'lamp', icon: Lamp, label: 'Đèn' },
];

export function Sidebar({ projectId }: { projectId: string }) {
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
    <div className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar">
      {/* Transformation Tools */}
      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3 font-sans">Công cụ chỉnh sửa</h2>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full rounded-lg", transformMode === 'translate' && "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]")}
            onClick={() => setTransformMode('translate')}
            title="Di chuyển (T)"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full rounded-lg", transformMode === 'rotate' && "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]")}
            onClick={() => setTransformMode('rotate')}
            title="Xoay (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-10 w-full rounded-lg", transformMode === 'scale' && "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]")}
            onClick={() => setTransformMode('scale')}
            title="Phóng to (S)"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Library */}
      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3 font-sans">Thư viện vật thể</h2>
        <div className="space-y-2">
          {TOOLS.map((tool) => (
            <Button
              key={tool.type}
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg group"
              onClick={() => handleAdd(tool.type)}
            >
              <tool.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="text-sm font-normal">{tool.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <AIAssistPanel projectId={projectId} />
    </div>
  );
}
