"use client"

import { cn } from "@/lib/utils"
import { Users, Package, Calendar, Truck, ClipboardCheck } from "lucide-react"

export type TabType = "doadores" | "doacoes" | "calendario" | "acompanhamento" | "baixa"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: "doadores" as const, label: "Doadores", icon: Users },
  { id: "doacoes" as const, label: "Doações", icon: Package },
  { id: "calendario" as const, label: "Calendário", icon: Calendar },
  { id: "acompanhamento" as const, label: "Acompanhamento", icon: Truck },
  { id: "baixa" as const, label: "Baixa de Coletas", icon: ClipboardCheck },
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "group flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <tab.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
