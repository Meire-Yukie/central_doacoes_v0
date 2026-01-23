"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
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

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, e-mail, telefone, CEP ou ID..."
            className="h-9 w-full bg-muted/50 pl-9 text-sm"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}
