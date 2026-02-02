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
  | "Coleta Agendada"
  | "Coleta Reagendada"
  | "Coleta Completa"

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
  "Agendamento Pendente - Doacao de Moveis": "bg-muted text-muted-foreground border-border",
  "Agendamento Pendente - Porte Alterado": "bg-muted text-muted-foreground border-border",
  "Agendamento Pendente - Quantidade de Itens Atipica": "bg-muted text-muted-foreground border-border",
  "Coleta Concluida": "bg-muted text-muted-foreground border-border",
  "Coleta Nao Realizada": "bg-muted text-muted-foreground border-border",
  "Coleta Pendente - Nao Realizada": "bg-muted text-muted-foreground border-border",
  "Coleta Pendente - Parcial": "bg-muted text-muted-foreground border-border",
  "Reagendamento em Aberto": "bg-muted text-muted-foreground border-border",
  "Coleta Agendada": "bg-muted text-muted-foreground border-border",
  "Coleta Reagendada": "bg-muted text-muted-foreground border-border",
  "Coleta Completa": "bg-muted text-muted-foreground border-border",
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
