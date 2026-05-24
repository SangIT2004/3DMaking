'use client'

import { 
  LayoutGrid, 
  Star, 
  Clock, 
  Trash2, 
  Sparkles 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Tất cả dự án", active: true, count: 5 },
  { icon: Star, label: "Đã đánh dấu", active: false, count: 2 },
  { icon: Clock, label: "Gần đây", active: false, count: null },
  { icon: Trash2, label: "Thùng rác", active: false, count: null },
]

const FILTERS = ["Phòng khách", "Phòng ngủ", "Văn phòng"]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/8 p-3 flex flex-col gap-1 bg-[#0F1117] hidden lg:flex h-[calc(100vh-3.5rem)] sticky top-14">
      {NAV_ITEMS.map(({ icon: Icon, label, active, count }) => (
        <button
          key={label}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            active
              ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="flex-1">{label}</span>
          {count !== null && (
            <span className="text-xs text-gray-500 bg-white/8 px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </button>
      ))}

      <div className="mt-4 pt-4 border-t border-white/8">
        <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider font-medium">Bộ lọc</p>
        {FILTERS.map((tag) => (
          <button
            key={tag}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 w-full text-left transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-violet-500/50" />
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/8">
        <div className="bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-violet-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-violet-300 font-medium">AI Credits</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
            <div className="h-full w-3/5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-gray-500">60 / 100 credits</p>
        </div>
      </div>
    </aside>
  )
}
