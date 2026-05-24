import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md bg-card border-border shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">
            Welcome to 3D Room Studio
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your email to sign in or create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 focus-visible:ring-primary focus-visible:bg-white/8"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-white/5 border-white/10 focus-visible:ring-primary focus-visible:bg-white/8"
              />
            </div>
            
            {searchParams?.error && (
              <div className="text-sm font-medium text-destructive text-center bg-destructive/10 py-2 rounded-md">
                {searchParams.error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" formAction={login} className="w-full font-medium">
                Sign In
              </Button>
              <Button 
                type="submit"
                formAction={signup} 
                variant="secondary" 
                className="w-full font-medium bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
