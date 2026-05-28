export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 shadow-2xl backdrop-blur-md">
        <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-medium text-white">Đang tải 3D Room Studio</p>
          <p className="mt-1 text-xs text-gray-500">Khởi tạo giao diện và dữ liệu…</p>
        </div>
      </div>
    </div>
  );
}
