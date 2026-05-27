'use client'

import { 
  LayoutGrid, 
  Star, 
  Trash2, 
  Sparkles 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar({ totalProjects }: { totalProjects: number }) {
  const NAV_ITEMS = [
    { icon: LayoutGrid, label: "Tất cả dự án", active: true, count: totalProjects },
    { icon: Star, label: "Đã đánh dấu", active: false, count: null },
    { icon: Trash2, label: "Thùng rác", active: false, count: null },
  ]

  return (
    <aside className="w-64 border-r border-white/8 p-3 flex flex-col gap-1 bg-[#0F1117] hidden lg:flex h-[calc(100vh-3.5rem)] sticky top-14">
      {NAV_ITEMS.map(({ icon: Icon, label, active, count }) => (
        <button
          key={label}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            active
              ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5 opacity-50 cursor-not-allowed"
          )}
          disabled={!active}
          title={!active ? "Tính năng đang phát triển" : ""}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="flex-1">{label}</span>
          {count !== null && (
            <span className="text-xs text-gray-500 bg-white/8 px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </button>
      ))}

      {/* Placeholder for future tags/filters */}
      <div className="mt-4 pt-4 border-t border-white/8 opacity-50">
        <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider font-medium flex items-center justify-between">
          <span>Bộ lọc (Sắp ra mắt)</span>
        </p>
      </div>

      {/* AI Credits Placeholder connected to Phase 6 */}
      <div className="mt-auto pt-4 border-t border-white/8 opacity-50" title="Sẽ khả dụng ở Phase 6: AI Integration">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400 font-medium">AI Studio</span>
          </div>
          <p className="text-xs text-gray-600">Tính năng đang phát triển</p>
        </div>
      </div>
    </aside>
  )
}
