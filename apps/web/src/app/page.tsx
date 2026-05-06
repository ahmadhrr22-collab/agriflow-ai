export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{background: '#166534'}}>
          <span className="text-white font-medium text-lg">AG</span>
        </div>
        <h1 className="text-2xl font-medium">AgriFlow AI</h1>
        <p className="text-sm" style={{color: 'var(--muted-foreground)'}}>
          Food Supply Chain Intelligence Platform
        </p>
        <div className="flex gap-2 justify-center">
          <a href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{background: '#166534'}}>
            Dashboard
          </a>
          <a href="/login" className="px-4 py-2 rounded-lg text-sm" style={{border: '1px solid var(--border)'}}>
            Login
          </a>
        </div>
      </div>
    </main>
  );
}