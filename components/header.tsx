export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="gf-gradient flex h-9 w-9 items-center justify-center rounded-lg">
            <span className="text-lg font-bold text-white">GF</span>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="gf-gradient-text text-lg font-bold leading-tight">
              Gerando Falcões
            </span>
            <span className="text-xs text-muted-foreground">Admin Doações</span>
          </div>
        </div>
      </div>
    </header>
  )
}
