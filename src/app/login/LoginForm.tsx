'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Code2 } from 'lucide-react'

export default function LoginForm({ error }: { error?: string }) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: (data: FormData) => Promise<void>) => {
    e.preventDefault()
    
    // Validate password match for signup
    if (activeTab === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-violet-500 to-violet-700 mb-4 mx-auto shadow-lg">
          <span className="text-xl font-bold text-white">3D</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">3D Room Studio</h1>
        <p className="text-muted-foreground text-sm">Design stunning 3D room layouts with ease</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => setActiveTab('signin')}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            activeTab === 'signin'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            activeTab === 'signup'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => handleSubmit(e, activeTab === 'signin' ? login : signup)}
        className="space-y-4"
      >
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground block">
            Email Address
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground block">
              Password
            </label>
            {activeTab === 'signin' && (
              <a
                href="#"
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Forgot?
              </a>
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

        {/* Confirm Password (Sign Up only) */}
        {activeTab === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground block">
              Confirm Password
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
          {isLoading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-card text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all"
        >
          <Mail className="w-4 h-4 mr-2" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all"
        >
           <Code2 className="w-4 h-4 mr-2" />
          GitHub
        </Button>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        By continuing, you agree to our{' '}
        <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}
