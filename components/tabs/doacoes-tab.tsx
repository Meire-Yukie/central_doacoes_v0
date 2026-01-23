"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { KPICards } from "@/components/kpi-cards"
import { StatusBadge } from "@/components/status-badge"
import { mockDoacoes } from "@/lib/mock-data"
import type { Doacao } from "@/lib/types"
import {
  Eye,
  Pencil,
  X,
  MapPin,
  Mail,
  Package,
  Calendar,
  Truck,
  FileText,
  AlertTriangle,
  Check,
  Clock,
  CircleDot,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface DoacoesTabProps {
  searchQuery: string
}

const statusSteps = [
  { status: "Criada", icon: CircleDot },
  { status: "Confirmada", icon: Check },
  { status: "Agendada", icon: Calendar },
  { status: "Em rota", icon: Truck },
  { status: "Coletada", icon: Package },
  { status: "Finalizada", icon: Check },
]

function getStatusStepIndex(status: string): number {
  switch (status) {
    case "Pendente":
      return 0
    case "Em validação manual":
      return 0
    case "Confirmada":
      return 1
    case "Coleta agendada":
      return 2
    case "Em rota":
      return 3
    case "Coletada":
      return 5
    case "Cancelada":
      return -1
    default:
      return 0
  }
}

export function DoacoesTab({ searchQuery }: DoacoesTabProps) {
  const [selectedDoacao, setSelectedDoacao] = useState<Doacao | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [modalidadeFilter, setModalidadeFilter] = useState<string>("todos")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [doacaoToCancel, setDoacaoToCancel] = useState<Doacao | null>(null)
  const { toast } = useToast()

  const filteredDoacoes = mockDoacoes.filter((doacao) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      doacao.id.toLowerCase().includes(query) ||
      doacao.doador.nome.toLowerCase().includes(query) ||
      doacao.doador.email.toLowerCase().includes(query)

    const matchesStatus = statusFilter === "todos" || doacao.status === statusFilter
    const matchesTipo = tipoFilter === "todos" || doacao.tipoItem === tipoFilter
    const matchesModalidade =
      modalidadeFilter === "todos" || doacao.modalidade === modalidadeFilter

    return matchesSearch && matchesStatus && matchesTipo && matchesModalidade
  })

  const handleViewDetails = (doacao: Doacao) => {
    setSelectedDoacao(doacao)
    setIsDetailsOpen(true)
  }

  const handleCancelClick = (doacao: Doacao) => {
    setDoacaoToCancel(doacao)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false)
    setDoacaoToCancel(null)
    toast({
      title: "Doação cancelada",
      description: "A doação foi cancelada com sucesso.",
      variant: "destructive",
    })
  }

  const currentStepIndex = selectedDoacao ? getStatusStepIndex(selectedDoacao.status) : 0

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doações</h1>
          <p className="text-sm text-muted-foreground">
            Histórico e gerenciamento de todas as doações recebidas
          </p>
        </div>
      </div>

      <KPICards variant="doacoes" />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em validação manual">Em validação manual</SelectItem>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Coleta agendada">Coleta agendada</SelectItem>
                  <SelectItem value="Coletada">Coletada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Roupas">Roupas</SelectItem>
                  <SelectItem value="Livros">Livros</SelectItem>
                  <SelectItem value="Eletrodomésticos">Eletrodomésticos</SelectItem>
                  <SelectItem value="Móveis">Móveis</SelectItem>
                  <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Modalidade:</span>
              <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Retirada">Retirada</SelectItem>
                  <SelectItem value="Ponto de coleta">Ponto de coleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Doações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">Condição</TableHead>
                  <TableHead className="hidden md:table-cell">Modalidade</TableHead>
                  <TableHead className="hidden lg:table-cell">Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <span>Nenhuma doação encontrada</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoacoes.map((doacao) => (
                    <TableRow key={doacao.id}>
                      <TableCell className="font-mono text-sm">{doacao.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(doacao.dataCreated).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doacao.doador.nome}</p>
                          <p className="text-xs text-muted-foreground">{doacao.doador.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {doacao.tipoItem === "Móveis" && (
                            <span className="rounded bg-warning/20 px-1.5 py-0.5 text-xs text-warning-foreground">
                              Validação manual
                            </span>
                          )}
                          <span>{doacao.tipoItem}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={doacao.condicaoItem} />
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {doacao.modalidade}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {doacao.volume}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={doacao.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(doacao)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalhes</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          {doacao.status !== "Cancelada" && doacao.status !== "Coletada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleCancelClick(doacao)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancelar</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-xl">Doação {selectedDoacao?.id}</SheetTitle>
            <SheetDescription>Detalhes completos da doação</SheetDescription>
          </SheetHeader>

          {selectedDoacao && (
            <div className="mt-6 space-y-6">
              {/* Status Timeline */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Status da Doação</h3>
                {selectedDoacao.status === "Cancelada" ? (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">Doação Cancelada</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            index <= currentStepIndex
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon className="h-4 w-4" />
                        </div>
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Donor Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Dados do Doador</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="font-medium">{selectedDoacao.doador.nome}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{selectedDoacao.doador.email}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selectedDoacao.endereco && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Endereço para Retirada</h3>
                  <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p>
                        {selectedDoacao.endereco.rua}, {selectedDoacao.endereco.numero}
                        {selectedDoacao.endereco.complemento &&
                          `, ${selectedDoacao.endereco.complemento}`}
                      </p>
                      <p>
                        {selectedDoacao.endereco.bairro} - {selectedDoacao.endereco.cidade}/
                        {selectedDoacao.endereco.uf}
                      </p>
                      <p>CEP: {selectedDoacao.endereco.cep}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Itens Declarados</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedDoacao.tipoItem}</span>
                    {selectedDoacao.tipoItem === "Móveis" && (
                      <span className="rounded bg-warning/20 px-1.5 py-0.5 text-xs text-warning-foreground">
                        Validação manual
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedDoacao.itensDeclarados}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      Volume: {selectedDoacao.volume}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      Veículo: {selectedDoacao.veiculoSugerido}
                    </span>
                    <StatusBadge status={selectedDoacao.condicaoItem} />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              {selectedDoacao.agendamento && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Agendamento</h3>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedDoacao.agendamento.data).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      - {selectedDoacao.agendamento.periodo}
                    </span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Observações Internas</h3>
                <Textarea
                  defaultValue={selectedDoacao.observacoes || ""}
                  placeholder="Adicione observações sobre esta doação..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar doação?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a doação {doacaoToCancel?.id}? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar doação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
