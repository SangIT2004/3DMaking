import { Loader2, LayoutGrid } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
        <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-white/10 flex items-center justify-center shadow-xl shadow-violet-500/10">
          <LayoutGrid className="w-8 h-8 text-violet-500" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-white font-medium text-lg tracking-wide">Đang tải không gian làm việc</h2>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            <span className="text-sm">Vui lòng chờ trong giây lát...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
