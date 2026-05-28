import { createClient } from '@/utils/supabase/server'
import { Sidebar } from './Sidebar'
import { CreateProjectButton } from './CreateProjectButton'
import { redirect } from 'next/navigation'
import { Box } from 'lucide-react'
import { DashboardClient } from './DashboardClient'
import { LogoutButton } from './LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, thumbnail_url, created_at, is_favorite')
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
          <button className="px-3 py-1.5 rounded-md text-sm transition-colors bg-white/10 text-white">
            Projects
          </button>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <CreateProjectButton />

          <div className="flex items-center gap-3 ml-2 border-l border-white/8 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user.email?.substring(0, 2)}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DashboardClient initialProjects={projects || []} />
      </div>
    </div>
  )
}
