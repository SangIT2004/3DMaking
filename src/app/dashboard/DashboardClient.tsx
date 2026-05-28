'use client'

import { useState, useMemo } from 'react'
import { ProjectCard } from './ProjectCard'
import { CreateProjectButton } from './CreateProjectButton'
import { LayoutGrid, Grid3x3, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'

type Project = {
  id: string
  name: string
  thumbnail_url?: string
  created_at: string
  is_favorite?: boolean
}

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const filteredProjects = useMemo(() => {
    let result = initialProjects
    
    // Filter by favorite status if needed
    if (filter === 'favorites') {
      result = result.filter(p => p.is_favorite)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery))
    }
    
    return result
  }, [initialProjects, searchQuery, filter])

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      <Sidebar 
        totalProjects={initialProjects.length} 
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                {filter === 'all' ? 'Dự án của tôi' : 'Đã đánh dấu'}
              </h1>
              <p className="text-sm text-gray-500">
                {filteredProjects.length} dự án
                {filter === 'favorites' && ' yêu thích'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm dự án..." 
                  className="bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 w-48 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/8 shrink-0">
                <button 
                  className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400")}
                  onClick={() => setViewMode('grid')}
                  title="Dạng lưới"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400")}
                  onClick={() => setViewMode('list')}
                  title="Dạng danh sách"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
              : "flex flex-col space-y-2"
          )}>
            {viewMode === 'grid' && filter === 'all' && <CreateProjectButton isHero />}

            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                Không tìm thấy dự án nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
