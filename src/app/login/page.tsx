import LoginForm from './LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient layers */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-950/20 via-background to-blue-950/20" />
        
        {/* Glow elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl transform -translate-x-1/2" />
      </div>

      {/* Card container */}
      <div className="relative w-full max-w-md p-8 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl shadow-violet-500/10 hover:shadow-violet-500/20 transition-shadow">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-violet-500/0 via-violet-500/0 to-blue-500/0 hover:from-violet-500/5 hover:via-violet-500/5 hover:to-blue-500/5 pointer-events-none transition-all" />
        
        {/* Content */}
        <div className="relative z-10">
          <LoginForm error={searchParams?.error} />
        </div>
      </div>
    </div>
  )
}
