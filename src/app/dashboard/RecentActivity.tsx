'use client'

import { Edit3, Sparkles, FolderOpen, Clock } from 'lucide-react'

const ACTIVITIES = [
  { action: "Chỉnh sửa", project: "Phòng khách hiện đại", detail: "Thêm ghế sofa màu xanh", time: "2 giờ trước", icon: Edit3, color: "text-blue-400" },
  { action: "AI sinh mô hình", project: "Căn hộ studio", detail: "\"Tủ gỗ oak cánh kính\"", time: "Hôm qua", icon: Sparkles, color: "text-violet-400" },
  { action: "Lưu dự án", project: "Phòng ngủ master", detail: "12 entities saved", time: "3 ngày trước", icon: FolderOpen, color: "text-emerald-400" },
]

export function RecentActivity() {
  return (
    <div className="mt-12">
      <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Hoạt động gần đây</h2>
      <div className="space-y-2">
        {ACTIVITIES.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className={`p-1.5 rounded-lg bg-white/5 ${item.color} group-hover:bg-white/10 transition-colors`}>
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-300 font-medium">{item.project}</span>
              <span className="text-gray-600 mx-1.5">·</span>
              <span className="text-sm text-gray-500">{item.detail}</span>
            </div>
            <span className="text-xs text-gray-600 shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
