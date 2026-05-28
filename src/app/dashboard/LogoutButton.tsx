'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'
import { Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-500 hover:text-white h-8 px-2"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {isLoggingOut ? 'Đang thoát...' : 'Đăng xuất'}
    </Button>
  )
}
