'use client'

import { useState } from 'react'
import { Clock, Star, FolderOpen, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { toggleFavoriteProject, deleteProject } from './actions'
import { cn } from '@/lib/utils'

type Project = {
  id: string
  name: string
  thumbnail_url?: string
  created_at: string
  is_favorite?: boolean
}

export function ProjectCard({ project, viewMode = 'grid' }: { project: Project, viewMode?: 'grid' | 'list' }) {
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(!!project.is_favorite)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    const newState = !isFavorite
    setIsFavorite(newState) // Optimistic update
    
    const res = await toggleFavoriteProject(project.id, newState)
    if (res.error) {
      setIsFavorite(!newState) // Revert on error
      toast.error('Lỗi: ' + res.error)
    }
    setLoading(false)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return

    setLoading(true)
    const res = await deleteProject(project.id)
    if (res.error) {
      toast.error('Lỗi khi xóa dự án: ' + res.error)
    } else {
      toast.success('Đã xóa dự án')
    }
    setLoading(false)
  }

  const date = new Date(project.created_at)
  const timeAgo = date.toLocaleDateString('vi-VN')

  // Random placeholder colors for the SVG room
  const colors = [
    { bg: "#1E2A3A", accent: "#4A80C0", floor: "#2A3C50" },
    { bg: "#2A1E3A", accent: "#8050C0", floor: "#3A2A50" },
    { bg: "#1E3A2A", accent: "#3A9060", floor: "#2A5038" },
    { bg: "#3A2A1E", accent: "#C07040", floor: "#503A28" },
  ]
  const color = colors[Math.abs(project.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length]

  if (viewMode === 'list') {
    return (
      <a href={`/editor/${project.id}`} className="group block">
        <Card className="flex items-center gap-4 p-3 bg-[#161822] border-white/10 rounded-xl transition-all duration-150 hover:border-violet-500/40 cursor-pointer shadow-none">
          <div 
            className="w-16 h-16 shrink-0 relative flex items-center justify-center rounded-lg overflow-hidden"
            style={{ background: project.thumbnail_url ? 'transparent' : color.bg }}
          >
            {project.thumbnail_url ? (
              <img src={project.thumbnail_url} alt={project.name} className="object-cover w-full h-full" />
            ) : (
              <IsometricMiniRoom color={color.accent} floor={color.floor} className="scale-75" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">{project.name}</h3>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8 flex-shrink-0 transition-opacity", isFavorite ? "text-yellow-400" : "text-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10")}
              onClick={handleToggleFavorite}
              disabled={loading}
            >
              <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 flex-shrink-0 transition-opacity text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </a>
    )
  }

  return (
    <a href={`/editor/${project.id}`} className="group block h-full">
      <Card className="overflow-hidden bg-[#161822] border-white/10 rounded-xl transition-all duration-150 hover:border-violet-500/40 cursor-pointer shadow-none h-full flex flex-col">
        <div 
          className="aspect-[4/3] relative flex items-center justify-center overflow-hidden"
          style={{ background: project.thumbnail_url ? 'transparent' : color.bg }}
        >
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt={project.name} className="object-cover w-full h-full" />
          ) : (
            <IsometricMiniRoom color={color.accent} floor={color.floor} />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              Mở
            </div>
          </div>
        </div>
        
        <div className="p-3 flex items-start justify-between flex-1">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-white truncate" title={project.name}>{project.name}</h3>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{timeAgo}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8 flex-shrink-0 transition-opacity", isFavorite ? "text-yellow-400" : "text-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10")}
              onClick={handleToggleFavorite}
              disabled={loading}
            >
              <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 flex-shrink-0 transition-opacity text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </a>
  )
}

function IsometricMiniRoom({ color, floor, className }: { color: string; floor: string, className?: string }) {
  return (
    <svg width="120" height="90" viewBox="0 0 140 110" fill="none" className={cn("opacity-80", className)}>
      <polygon points="70,55 110,78 70,100 30,78" fill={floor} />
      <polygon points="30,78 70,55 70,15 30,38" fill={color + "55"} />
      <polygon points="70,55 110,78 110,38 70,15" fill={color + "33"} />
      <polygon points="50,72 65,80 65,68 50,60" fill={color + "88"} />
      <polygon points="50,60 65,68 65,55 50,47" fill={color + "aa"} />
      <polygon points="50,60 65,55 65,47 50,47" fill={color + "cc"} />
    </svg>
  )
}
