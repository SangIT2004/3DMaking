"use client"

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/useEditorStore';
import { DoorOpen, House, PanelsTopLeft, LayoutPanelTop } from 'lucide-react';
import { saveEntity } from '@/app/editor/actions';
import { toast } from 'sonner';

export function RoomEditorPanel() {
  const addEntity = useEditorStore((s) => s.addEntity);
  const roomId = useEditorStore((s) => s.roomId);

  const handleAdd = async (type: 'wall' | 'door' | 'floor' | 'roof') => {
    if (!roomId) {
      toast.error('Không tìm thấy phòng hiện tại');
      return;
    }

    const id = addEntity(type);
    const entity = useEditorStore.getState().entities.find((item) => item.id === id);
    if (!entity) return;

    const res = await saveEntity(entity, roomId);
    if (res.error) {
      toast.error('Không thể lưu vật thể phòng');
    } else {
      toast.success(`Đã tạo ${type === 'wall' ? 'tường' : type === 'door' ? 'cửa' : type === 'floor' ? 'sàn' : 'mái'}`);
    }
  };

  return (
    <div className="space-y-3 p-3 rounded-md bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-200">Room Pieces</h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">entity mode</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" onClick={() => handleAdd('wall')} className="flex items-center gap-2 justify-start">
          <PanelsTopLeft className="h-3.5 w-3.5" />
          <span>Tường</span>
        </Button>
        <Button size="sm" onClick={() => handleAdd('door')} className="flex items-center gap-2 justify-start">
          <DoorOpen className="h-3.5 w-3.5" />
          <span>Cửa</span>
        </Button>
        <Button size="sm" onClick={() => handleAdd('floor')} className="flex items-center gap-2 justify-start">
          <LayoutPanelTop className="h-3.5 w-3.5" />
          <span>Sàn</span>
        </Button>
        <Button size="sm" onClick={() => handleAdd('roof')} className="flex items-center gap-2 justify-start">
          <House className="h-3.5 w-3.5" />
          <span>Mái</span>
        </Button>
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed">
        Các phần này được tạo như entity thật, có thể click, kéo di chuyển, xoay và scale như vật thể khác.
      </p>
    </div>
  );
}
