'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createProject } from './actions'

export function CreateProjectButton({ isHero = false }: { isHero?: boolean }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await createProject(name)
      if (res.error) {
        toast.error('Lỗi khi tạo dự án: ' + res.error)
      } else {
        toast.success('Đã tạo dự án mới')
        setOpen(false)
        setName('')
      }
    } catch (e) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (isHero) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-300 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-violet-500/20 border border-white/10 group-hover:border-violet-500/40 flex items-center justify-center transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Dự án mới</span>
        </button>
        <ProjectDialog open={open} setOpen={setOpen} name={name} setName={setName} handleCreate={handleCreate} loading={loading} />
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors h-9 px-4">
        <Plus className="w-4 h-4 mr-2" />
        Dự án mới
      </Button>
      <ProjectDialog open={open} setOpen={setOpen} name={name} setName={setName} handleCreate={handleCreate} loading={loading} />
    </>
  )
}

function ProjectDialog({ open, setOpen, name, setName, handleCreate, loading }: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-[#14161E] border-white/10 rounded-2xl text-foreground shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Tạo dự án 3D mới</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Tên không gian</label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Phòng khách hiện đại..." 
            className="bg-white/5 border-white/10 focus-visible:ring-primary focus-visible:bg-white/8 rounded-xl h-11"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
            }}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5">
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={loading || !name.trim()} className="bg-violet-600 hover:bg-violet-500">
            {loading ? 'Đang tạo...' : 'Bắt đầu thiết kế'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
