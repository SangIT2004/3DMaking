'use client'

import { useState } from 'react'
import { login, signup, resetPassword, signInWithProvider } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Code2, ArrowLeft } from 'lucide-react'

export default function LoginForm({ error, message }: { error?: string, message?: string }) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: (data: FormData) => Promise<void>) => {
    e.preventDefault()
    
    if (activeTab === 'signup' && password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('email', email)
    if (activeTab !== 'forgot') {
      formData.append('password', password)
    }
    
    try {
      await action(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo & Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 mb-4 mx-auto shadow-lg">
          <span className="text-xl font-bold text-white">3D</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">3D Room Studio</h1>
        <p className="text-muted-foreground text-sm">Thiết kế không gian 3D dễ dàng</p>
      </div>

      {/* Tab Switcher */}
      {activeTab !== 'forgot' && (
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
              activeTab === 'signin'
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
              activeTab === 'signup'
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đăng ký
          </button>
        </div>
      )}

      {/* Error & Message */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => handleSubmit(e, activeTab === 'signin' ? login : activeTab === 'signup' ? signup : resetPassword)}
        className="space-y-4"
      >
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground block">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white/5 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 focus-visible:bg-white/8 transition-all"
          />
        </div>

        {/* Password */}
        {activeTab !== 'forgot' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">
                Mật khẩu
              </label>
              {activeTab === 'signin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 focus-visible:bg-white/8 transition-all"
            />
          </div>
        )}

        {/* Confirm Password (Sign Up only) */}
        {activeTab === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground block">
              Xác nhận mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/5 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 focus-visible:bg-white/8 transition-all"
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 transition-all shadow-lg hover:shadow-violet-500/50"
        >
          {isLoading ? 'Đang xử lý...' : activeTab === 'signin' ? 'Đăng nhập' : activeTab === 'signup' ? 'Tạo tài khoản' : 'Gửi link khôi phục'}
        </Button>
        
        {activeTab === 'forgot' && (
          <Button
            type="button"
            variant="ghost"
            className="w-full mt-2 text-muted-foreground hover:text-white"
            onClick={() => setActiveTab('signin')}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Button>
        )}
      </form>

      {/* Divider */}
      {activeTab !== 'forgot' && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-[#0a0c10] text-muted-foreground font-medium">Hoặc</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <form action={() => signInWithProvider('google')}>
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading}
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                Google
              </Button>
            </form>
            <form action={() => signInWithProvider('github')}>
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading}
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all"
              >
                <Code2 className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </form>
          </div>
        </>
      )}

      {/* Terms */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Bằng cách tiếp tục, bạn đồng ý với{' '}
        <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
          Điều khoản dịch vụ
        </a>{' '}
        và{' '}
        <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
          Chính sách bảo mật
        </a>
      </p>
    </div>
  )
}
