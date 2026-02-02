import { cn } from "@/lib/utils"

type StatusType =
  | "Ativo"
  | "Inativo"
  | "Pendente"
  | "Em validação manual"
  | "Confirmada"
  | "Coleta agendada"
  | "Coletada"
  | "Cancelada"
  | "Em rota"
  | "Atrasada"
  | "Não coletada"
  | "Bom"
  | "Não confirmado"
  | "Precisa triagem"
  | "Agendamento Pendente - Doacao de Moveis"
  | "Agendamento Pendente - Porte Alterado"
  | "Agendamento Pendente - Quantidade de Itens Atipica"
  | "Coleta Concluida"
  | "Coleta Nao Realizada"
  | "Coleta Pendente - Nao Realizada"
  | "Coleta Pendente - Parcial"
  | "Reagendamento em Aberto"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  Ativo: "bg-success/15 text-success border-success/30",
  Inativo: "bg-muted text-muted-foreground border-border",
  Pendente: "bg-warning/15 text-warning-foreground border-warning/30",
  "Em validação manual": "bg-info/15 text-info border-info/30",
  Confirmada: "bg-success/15 text-success border-success/30",
  "Coleta agendada": "bg-primary/15 text-primary border-primary/30",
  Coletada: "bg-success/15 text-success border-success/30",
  Cancelada: "bg-destructive/15 text-destructive border-destructive/30",
  "Em rota": "bg-info/15 text-info border-info/30",
  Atrasada: "bg-destructive/15 text-destructive border-destructive/30",
  "Não coletada": "bg-destructive/15 text-destructive border-destructive/30",
  Bom: "bg-success/15 text-success border-success/30",
  "Não confirmado": "bg-warning/15 text-warning-foreground border-warning/30",
  "Precisa triagem": "bg-info/15 text-info border-info/30",
  "Agendamento Pendente - Doacao de Moveis": "bg-warning/15 text-warning-foreground border-warning/30",
  "Agendamento Pendente - Porte Alterado": "bg-warning/15 text-warning-foreground border-warning/30",
  "Agendamento Pendente - Quantidade de Itens Atipica": "bg-warning/15 text-warning-foreground border-warning/30",
  "Coleta Concluida": "bg-success/15 text-success border-success/30",
  "Coleta Nao Realizada": "bg-destructive/15 text-destructive border-destructive/30",
  "Coleta Pendente - Nao Realizada": "bg-destructive/15 text-destructive border-destructive/30",
  "Coleta Pendente - Parcial": "bg-warning/15 text-warning-foreground border-warning/30",
  "Reagendamento em Aberto": "bg-info/15 text-info border-info/30",
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {status}
    </span>
  )
}
