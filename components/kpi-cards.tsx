"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, Truck, AlertTriangle, Clock, Users, UserCheck } from "lucide-react"

interface KPICardsProps {
  variant: "doadores" | "doacoes" | "calendario" | "acompanhamento" | "baixa"
}

const kpiData = {
  doadores: [
    { label: "Total de Doadores", value: 156, icon: Users, color: "text-primary" },
    { label: "Doadores Ativos", value: 142, icon: UserCheck, color: "text-success" },
    { label: "Novas este mês", value: 12, icon: Users, color: "text-accent" },
    { label: "Doações no mês", value: 47, icon: Package, color: "text-info" },
  ],
  doacoes: [
    { label: "Total no mês", value: 47, icon: Package, color: "text-primary" },
    { label: "Pendentes", value: 8, icon: Clock, color: "text-warning" },
    { label: "Confirmadas", value: 15, icon: Package, color: "text-success" },
    { label: "Coletas agendadas", value: 12, icon: Truck, color: "text-info" },
  ],
  calendario: [
    { label: "Coletas hoje", value: 3, icon: Truck, color: "text-primary" },
    { label: "Esta semana", value: 12, icon: Package, color: "text-info" },
    { label: "Atrasadas", value: 1, icon: AlertTriangle, color: "text-destructive" },
    { label: "Pendentes", value: 5, icon: Clock, color: "text-warning" },
  ],
  acompanhamento: [
    { label: "Romaneio do dia", value: 3, icon: Truck, color: "text-primary" },
    { label: "Pendentes", value: 5, icon: Clock, color: "text-warning" },
    { label: "Em rota", value: 1, icon: Truck, color: "text-info" },
    { label: "Atrasadas", value: 1, icon: AlertTriangle, color: "text-destructive" },
  ],
  baixa: [
    { label: "Baixas hoje", value: 2, icon: Package, color: "text-success" },
    { label: "Esta semana", value: 8, icon: Package, color: "text-primary" },
    { label: "Pendentes baixa", value: 3, icon: Clock, color: "text-warning" },
    { label: "Total no mês", value: 35, icon: Truck, color: "text-info" },
  ],
}

export function KPICards({ variant }: KPICardsProps) {
  const data = kpiData[variant]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((kpi) => (
        <Card key={kpi.label} className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2.5 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
