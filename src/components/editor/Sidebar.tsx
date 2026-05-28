'use client'

import { useState } from "react";
import { useEditorStore, EntityType } from "@/store/useEditorStore";
import { Move, RotateCcw, Maximize, Square, Lamp, Sofa, Table as TableIcon, LayoutPanelLeft, LayoutPanelTop, SlidersHorizontal, ChevronDown, ChevronUp, DoorOpen, PanelsTopLeft, House, Settings, BedDouble, Monitor, TreePine, Refrigerator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { saveEntity } from "@/app/editor/actions";
import { toast } from "sonner";

import { AIAssistPanel } from "./AIAssistPanel";
import { RoomEditorPanel } from './RoomEditorPanel';
import { CustomPrimitiveType } from "@/store/useEditorStore";

const TOOLS: { type: EntityType; icon: any; label: string }[] = [
  { type: 'box', icon: Square, label: 'Khối hộp' },
  { type: 'table', icon: TableIcon, label: 'Bàn' },
  { type: 'chair', icon: Sofa, label: 'Ghế' },
  { type: 'bed', icon: BedDouble, label: 'Giường ngủ' },
  { type: 'computer_desk', icon: Monitor, label: 'Bàn máy tính' },
  { type: 'shelf', icon: LayoutPanelLeft, label: 'Tủ kệ' },
  { type: 'refrigerator', icon: Refrigerator, label: 'Tủ lạnh' },
  { type: 'plant', icon: TreePine, label: 'Chậu cây' },
  { type: 'lamp', icon: Lamp, label: 'Đèn' },
  { type: 'wall', icon: PanelsTopLeft, label: 'Tường' },
  { type: 'door', icon: DoorOpen, label: 'Cửa' },
  { type: 'floor', icon: LayoutPanelTop, label: 'Sàn' },
  { type: 'roof', icon: House, label: 'Mái' },
];

const MATERIAL_PRESETS = [
  { value: 'wood', label: 'Gỗ' },
  { value: 'metal', label: 'Kim loại' },
  { value: 'plastic', label: 'Nhựa' },
  { value: 'glass', label: 'Kính' },
  { value: 'stone', label: 'Đá' },
] as const;

export function Sidebar({ projectId }: { projectId: string }) {
  const addEntity = useEditorStore((state) => state.addEntity);
  const addCustomEntity = useEditorStore((state) => state.addCustomEntity);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const roomId = useEditorStore((state) => state.roomId);
  const [customName, setCustomName] = useState('Custom Object');
  const [primitive, setPrimitive] = useState<CustomPrimitiveType>('box');
  const [customColor, setCustomColor] = useState('#8B5CF6');
  const [materialPreset, setMaterialPreset] = useState<(typeof MATERIAL_PRESETS)[number]['value']>('plastic');
  const [width, setWidth] = useState('1.5');
  const [height, setHeight] = useState('1.5');
  const [depth, setDepth] = useState('1.5');
  const [radius, setRadius] = useState('0.75');
  const [segments, setSegments] = useState('24');
  const [taper, setTaper] = useState('0');
  const [skewX, setSkewX] = useState('0');
  const [skewZ, setSkewZ] = useState('0');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleAdd = async (type: EntityType) => {
    const id = addEntity(type);
    const newEntity = useEditorStore.getState().entities.find(e => e.id === id);
    if (newEntity && roomId) {
      const res = await saveEntity(newEntity, roomId);
      if (res.error) toast.error("Không thể lưu vật thể mới");
    }
  };

  const handleAddCustom = async () => {
    if (!roomId) {
      toast.error('Không tìm thấy phòng hiện tại');
      return;
    }

    const id = addCustomEntity({
      name: customName.trim() || 'Custom Object',
      color: customColor,
      metadata: {
        primitive,
        width: parseFloat(width) || 1.5,
        height: parseFloat(height) || 1.5,
        depth: parseFloat(depth) || 1.5,
        radius: parseFloat(radius) || 0.75,
        segments: Math.max(8, parseInt(segments, 10) || 24),
        taper: parseFloat(taper) || 0,
        skewX: parseFloat(skewX) || 0,
        skewZ: parseFloat(skewZ) || 0,
        materialPreset,
      },
    });

    const newEntity = useEditorStore.getState().entities.find((entity) => entity.id === id);
    if (newEntity) {
      const res = await saveEntity(newEntity, roomId);
      if (res.error) {
        toast.error('Không thể lưu vật thể tham số');
      } else {
        toast.success('Đã tạo vật thể tham số');
      }
    }
  };
  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      {/* Make the inner content area the scrollable region to ensure flex/shrink works correctly */}
      <div
        className="absolute inset-0 min-h-0 overflow-y-scroll custom-scrollbar px-4 py-4 gap-6 flex flex-col"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        onWheel={(e) => e.stopPropagation()}
      >
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
        <Button
          variant="ghost"
          className="w-full mt-2 h-10 gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent rounded-lg"
          onClick={() => clearSelection()}
          title="Bỏ chọn để hiện Cài đặt Môi trường"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Cài đặt Môi trường</span>
        </Button>
        <p className="mt-2 text-[10px] text-gray-500 leading-relaxed">
          Phím tắt: T/R/S đổi mode, Shift+drag để chọn nhiều, Ctrl/Cmd+D nhân bản, Delete xóa, mũi tên để nudge.
        </p>
      </div>

      {/* Library */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setLibraryOpen((value) => !value)}
        >
          <div>
            <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold font-sans">Thư viện vật thể</h2>
            <p className="text-[10px] text-gray-500 mt-1">Bấm để mở danh sách vật thể</p>
          </div>
          {libraryOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>

        {libraryOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Đồ vật</p>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.filter((tool) => ['box', 'table', 'chair', 'bed', 'computer_desk', 'shelf', 'refrigerator', 'plant', 'lamp'].includes(tool.type)).map((tool) => (
                  <Button
                    key={tool.type}
                    variant="ghost"
                    className="justify-start gap-2 h-10 text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg group"
                    onClick={() => handleAdd(tool.type)}
                  >
                    <tool.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-normal">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phòng</p>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.filter((tool) => ['wall', 'door', 'floor', 'roof'].includes(tool.type)).map((tool) => (
                  <Button
                    key={tool.type}
                    variant="ghost"
                    className="justify-start gap-2 h-10 text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg group"
                    onClick={() => handleAdd(tool.type)}
                  >
                    <tool.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-normal">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3 font-sans">Tự thiết kế vật thể</h2>
        <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <Input value={customName} onChange={(e) => setCustomName(e.target.value)} className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Tên vật thể" />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Kiểu hình</label>
              <select value={primitive} onChange={(e) => setPrimitive(e.target.value as CustomPrimitiveType)} className="h-9 w-full rounded-md bg-black/20 border border-white/10 px-2 text-sm text-gray-200 outline-none">
                <option value="box">Hộp</option>
                <option value="cylinder">Trụ</option>
                <option value="sphere">Cầu</option>
                <option value="cone">Nón</option>
                <option value="arch">Vòm</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Vật liệu</label>
              <select value={materialPreset} onChange={(e) => setMaterialPreset(e.target.value as typeof materialPreset)} className="h-9 w-full rounded-md bg-black/20 border border-white/10 px-2 text-sm text-gray-200 outline-none">
                {MATERIAL_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>{preset.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input value={width} onChange={(e) => setWidth(e.target.value)} type="number" step="0.1" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="W" />
            <Input value={height} onChange={(e) => setHeight(e.target.value)} type="number" step="0.1" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="H" />
            <Input value={depth} onChange={(e) => setDepth(e.target.value)} type="number" step="0.1" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="D" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input value={radius} onChange={(e) => setRadius(e.target.value)} type="number" step="0.1" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Radius" />
            <Input value={segments} onChange={(e) => setSegments(e.target.value)} type="number" step="1" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Segments" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input value={taper} onChange={(e) => setTaper(e.target.value)} type="number" step="0.05" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Taper" />
            <Input value={skewX} onChange={(e) => setSkewX(e.target.value)} type="number" step="0.05" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Skew X" />
            <Input value={skewZ} onChange={(e) => setSkewZ(e.target.value)} type="number" step="0.05" className="h-9 bg-black/20 border-white/10 text-gray-200" placeholder="Skew Z" />
          </div>

          <div className="flex items-center gap-2">
            <Input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="h-9 w-12 p-1 bg-black/20 border-white/10" />
            <Button onClick={handleAddCustom} className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700">
              <SlidersHorizontal className="h-4 w-4" />
              Tạo thủ công
            </Button>
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed">
            Đây là object tham số do bạn tự định nghĩa: nhập kích thước, vật liệu và deform để dựng theo ý thích mà không cần AI.
          </p>
        </div>
      </div>

        <AIAssistPanel projectId={projectId} />
        <div className="mt-4">
          <RoomEditorPanel />
        </div>
      </div>
    </div>
  );
}
