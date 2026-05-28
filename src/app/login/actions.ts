'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup error:', error.message)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string

  // Note: Vercel/Next.js might run this on a different port in dev, so we dynamically construct the origin or assume localhost:3000
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/dashboard/reset-password`,
  })

  if (error) {
    console.error('Reset password error:', error.message)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/login?message=${encodeURIComponent('Vui lòng kiểm tra email của bạn để lấy liên kết đặt lại mật khẩu.')}`)
}

export async function signInWithProvider(provider: 'google' | 'github') {
  const supabase = createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) {
    console.error('OAuth error:', error.message)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }
}
