import { Loader2, Cuboid } from "lucide-react";

export default function EditorLoading() {
  return (
    <div className="w-screen h-screen bg-[#0F1117] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
        <div className="w-20 h-20 rounded-3xl bg-[#161822] border border-white/10 flex items-center justify-center shadow-2xl shadow-violet-500/20 relative">
          <Cuboid className="w-10 h-10 text-violet-500 animate-pulse" />
          <div className="absolute inset-0 rounded-3xl border border-violet-500/50 animate-ping" />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-white font-medium text-xl tracking-wide uppercase">3D Room Studio</h2>
          <div className="flex items-center gap-2 text-violet-400/80 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium tracking-wide">Đang khởi tạo trình chỉnh sửa...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
