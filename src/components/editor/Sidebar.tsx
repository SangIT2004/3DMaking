'use client'

import { useEditorStore, EntityType } from "@/store/useEditorStore";
import { Move, RotateCcw, Maximize, Square, Lamp, Sofa, Table as TableIcon, LayoutPanelLeft, Package, Search, Sparkles, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { saveEntity } from "@/app/editor/actions";
import { toast } from "sonner";
import { ASSET_LIBRARY, Asset } from "@/lib/assets";
import { useState, useEffect } from "react";

const TOOLS: { type: EntityType; icon: any; label: string }[] = [
  { type: 'box', icon: Square, label: 'Khối hộp' },
  { type: 'table', icon: TableIcon, label: 'Bàn' },
  { type: 'chair', icon: Sofa, label: 'Ghế' },
  { type: 'shelf', icon: LayoutPanelLeft, label: 'Tủ kệ' },
  { type: 'lamp', icon: Lamp, label: 'Đèn' },
];

export function Sidebar({ projectId }: { projectId: string }) {
  const addEntity = useEditorStore((state) => state.addEntity);
  const entities = useEditorStore((state) => state.entities);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const roomId = useEditorStore((state) => state.roomId);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);

  // Assistant State
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  const handleAdd = async (type: EntityType, modelUrl?: string, name?: string) => {
    const id = addEntity(type, modelUrl, name);
    const newEntity = useEditorStore.getState().entities.find(e => e.id === id);
    if (newEntity && roomId) {
      const res = await saveEntity(newEntity, roomId);
      if (res.error) toast.error("Không thể lưu vật thể mới");
    }
  };

  const handleAddAsset = (asset: any) => {
    handleAdd('asset', asset.model_url || asset.modelUrl, asset.name);
    toast.success(`Đã thêm ${asset.name}`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return setSearchResults([]);
    setIsSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(data.assets || []);
    } catch (err: any) {
      toast.error("Lỗi tìm kiếm: " + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAiAssistant = async () => {
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiMessage("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        body: JSON.stringify({ 
          sceneState: entities, 
          userMessage: userMsg 
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChatHistory(prev => [...prev, { role: 'ai', text: data.message }]);
    } catch (err: any) {
      toast.error("AI Assistant Error: " + err.message);
    } finally {
      setIsAiLoading(false);
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

      {/* Smart Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-3 w-3 text-violet-400" />
          <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold font-sans">Tìm kiếm thông minh</h2>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Tìm 'ghế sofa hiện đại'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-9 bg-white/5 border-white/10 text-xs text-white placeholder:text-white/20"
          />
          <Button size="icon" className="h-9 w-9 shrink-0 bg-violet-600" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {searchResults.map((asset: any) => (
              <button
                key={asset.id}
                onClick={() => handleAddAsset(asset)}
                className="group relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all"
              >
                <img src={asset.thumbnail_url} className="w-full h-full object-contain p-2" alt={asset.name} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2 text-[10px] text-white text-center">
                  {asset.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <h2 className="text-violet-200 text-[10px] font-bold uppercase tracking-wider">AI Stylist Assistant</h2>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 text-[11px] font-sans custom-scrollbar">
          {chatHistory.map((chat, i) => (
            <div key={i} className={cn("p-2 rounded-lg", chat.role === 'user' ? "bg-white/5 text-gray-300 ml-4" : "bg-violet-500/20 text-violet-200 mr-4")}>
              {chat.text}
            </div>
          ))}
          {isAiLoading && <Loader2 className="h-3 w-3 animate-spin text-violet-400 mx-auto" />}
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Làm phòng này ấm cúng hơn..."
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiAssistant()}
            className="h-8 bg-black/40 border-white/5 text-[10px]"
          />
          <Button size="icon" className="h-8 w-8 shrink-0 bg-violet-600" onClick={handleAiAssistant}>
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Asset Library */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-3 w-3 text-violet-400" />
          <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold font-sans">Thư viện Asset</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ASSET_LIBRARY.map((asset) => (
            <button
              key={asset.id}
              onClick={() => handleAddAsset(asset)}
              className="group relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all active:scale-95"
            >
              <img 
                src={asset.thumbnail} 
                alt={asset.name}
                className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[10px] text-white font-medium truncate">{asset.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Library */}
      <div>
        <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-3 font-sans">Hình khối cơ bản</h2>
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
    </div>
  );
}
