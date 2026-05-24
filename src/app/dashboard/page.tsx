import { createClient } from '@/utils/supabase/server'
import { Sidebar } from './Sidebar'
import { ProjectCard } from './ProjectCard'
import { RecentActivity } from './RecentActivity'
import { CreateProjectButton } from './CreateProjectButton'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'
import { redirect } from 'next/navigation'
import { 
  Box, 
  Search, 
  LayoutGrid, 
  Grid3x3
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-white/8 flex items-center px-6 gap-4 bg-[#0F1117] sticky top-0 z-30">
        <div className="flex items-center gap-2.5 mr-4">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-sm">3D Room Studio</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {["Projects", "Templates", "Explore"].map((item, i) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                i === 0
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300">
            <Search className="w-3.5 h-3.5" />
            <span className="text-gray-500">Tìm kiếm...</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-500 font-mono">⌘K</kbd>
          </div>

          <CreateProjectButton />

          <div className="flex items-center gap-3 ml-2 border-l border-white/8 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user.email?.substring(0, 2)}
            </div>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" className="text-gray-500 hover:text-white h-8 px-2">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Dự án của tôi</h1>
              <p className="text-sm text-gray-500">{projects?.length || 0} dự án · Cập nhật gần đây</p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/8">
              <button className="p-1.5 rounded-md bg-white/10 text-white transition-colors">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md text-gray-600 hover:text-gray-400 transition-colors">
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* New project skeleton button */}
            <CreateProjectButton isHero />

            {projects && projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <RecentActivity />
        </main>
      </div>
    </div>
  )
}
