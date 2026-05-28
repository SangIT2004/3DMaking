'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "sonner";
import { Wand2, Loader2 } from "lucide-react";

export function AIAssistPanel({ projectId }: { projectId: string }) {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [history, setHistory] = useState<string[]>([]);
  
  const roomId = useEditorStore(state => state.roomId);
  const addEntity = useEditorStore(state => state.addEntity);
  const updateEntity = useEditorStore(state => state.updateEntity);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    if (!roomId) {
      toast.error("Không tìm thấy phòng hiện tại.");
      return;
    }

    setStatus('loading');
    
    try {
      // Vì logic compile SCAD sang STL và hiển thị Mesh do AIGeneratedObject đảm nhiệm,
      // ở đây chúng ta chỉ cần gọi API lấy scad_code và thêm vào store.
      
      const res = await fetch('/api/generate-scad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error('Lỗi khi gọi AI API');
      }

      const { scadCode, usedModel } = await res.json();

      // Thêm vào store một entity trống trước
      const newId = addEntity('ai_generated');
      
      // Update entity với scadCode
      updateEntity(newId, {
        scad_code: scadCode,
        prompt: prompt,
        color: '#88aabb'
      });

      // (Tuỳ chọn) Lưu vào DB có thể được gọi ở đây hoặc thông qua cơ chế tự động save
      // Hiện tại Sidebar.tsx (khi click tạo hình thủ công) sẽ gọi `saveEntity`. 
      // Để đồng nhất, ta sẽ gọi `saveEntity` từ đây.
      
      const { saveEntity, saveAILog } = await import('@/app/editor/actions');
      const newEntity = useEditorStore.getState().entities.find(e => e.id === newId);
      if (newEntity) {
         await saveEntity(newEntity, roomId);
      }
      
      // Ghi log vào bảng ai_logs
      await saveAILog(projectId, prompt, scadCode);

      setHistory(h => [prompt, ...h]);
      setStatus('done');
      setPrompt('');
      toast.success(`Tạo thành công bằng ${usedModel === 'gemini' ? 'Gemini 2.0' : 'Grok 2'}`);
    } catch (err: any) {
      setStatus('error');
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-4 h-4 text-violet-400" />
        <h2 className="text-white/60 text-xs font-bold uppercase tracking-wider font-sans">
          Trợ lý AI (Bản thử nghiệm Beta)
        </h2>
      </div>

      {/* Beta Notice */}
      <div className="mb-4 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-200/80 leading-relaxed italic">
        Lưu ý: Tính năng Text-to-3D hiện đang trong giai đoạn phát triển (Beta). Một số mô hình có thể hiển thị không ổn định hoặc cần thời gian nạp lâu.
      </div>

      <div className="space-y-3">
        <textarea
          className="w-full bg-[#1A1D24] border border-white/5 rounded-md p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
          rows={3}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Mô tả đồ vật... (vd: cái bàn gỗ 4 chân vuông)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        <Button 
          className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          onClick={handleGenerate}
          disabled={status === 'loading' || !prompt.trim()}
        >
          {status === 'loading' ? (
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...</>
          ) : 'Tạo mô hình'}
        </Button>
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white/40 text-[10px] uppercase mb-2">Lịch sử</h3>
          <ul className="space-y-1.5">
            {history.slice(0, 3).map((h, i) => (
              <li key={i} className="text-xs text-white/70 bg-white/5 p-2 rounded truncate" title={h}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
