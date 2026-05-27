'use client'

import { Activity } from 'lucide-react'

// Placeholder for future implementation when we add an activity_logs table
type ActivityItem = {
  id: string
  action: string
  project: string
  detail: string
  time: string
  icon: any
  color: string
}

export function RecentActivity({ activities = [] }: { activities?: ActivityItem[] }) {
  if (!activities || activities.length === 0) {
    return null; // Hide the section completely if there's no activity to show
  }

  return (
    <div className="mt-12 border-t border-white/5 pt-8">
      <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Hoạt động gần đây</h2>
      <div className="space-y-2">
        {activities.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
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
