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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  MoreHorizontal,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [doacaoToCancel, setDoacaoToCancel] = useState<Doacao | null>(null)
  const { toast } = useToast()

  // Filtros
  const [filtroId, setFiltroId] = useState("")
  const [filtroNome, setFiltroNome] = useState("")
  const [filtroTelefone, setFiltroTelefone] = useState("")
  const [filtroEmail, setFiltroEmail] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [modalidadeFilter, setModalidadeFilter] = useState<string>("todos")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [filtroAtendente, setFiltroAtendente] = useState("")
  const [filtroDataInicio, setFiltroDataInicio] = useState("")
  const [filtroDataFinal, setFiltroDataFinal] = useState("")

  const filteredDoacoes = mockDoacoes.filter((doacao) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      doacao.id.toLowerCase().includes(query) ||
      doacao.doador.nome.toLowerCase().includes(query) ||
      doacao.doador.email.toLowerCase().includes(query)

    const matchId = !filtroId || doacao.id.toLowerCase().includes(filtroId.toLowerCase())
    const matchNome = !filtroNome || doacao.doador.nome.toLowerCase().includes(filtroNome.toLowerCase())
    const matchTelefone = !filtroTelefone || doacao.doador.telefone?.toLowerCase().includes(filtroTelefone.toLowerCase())
    const matchEmail = !filtroEmail || doacao.doador.email.toLowerCase().includes(filtroEmail.toLowerCase())
    const matchStatus = !filtroStatus || filtroStatus === "todos" || doacao.status === filtroStatus
    const matchAtendente = !filtroAtendente || filtroAtendente === "todos" || (doacao.atendente && doacao.atendente.toLowerCase().includes(filtroAtendente.toLowerCase()))
    
    // Filtro por data
    const dataColeta = doacao.agendamento?.data ? new Date(doacao.agendamento.data) : null
    const dataInicio = filtroDataInicio ? new Date(filtroDataInicio) : null
    const dataFinal = filtroDataFinal ? new Date(filtroDataFinal) : null
    
    const matchDataInicio = !dataInicio || (dataColeta && dataColeta >= dataInicio)
    const matchDataFinal = !dataFinal || (dataColeta && dataColeta <= dataFinal)

    return matchesSearch && matchId && matchNome && matchTelefone && matchEmail && matchStatus && matchAtendente && matchDataInicio && matchDataFinal
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

  const handleLimparFiltros = () => {
    setFiltroId("")
    setFiltroNome("")
    setFiltroTelefone("")
    setFiltroEmail("")
    setFiltroStatus("")
    setFiltroAtendente("")
    setFiltroDataInicio("")
    setFiltroDataFinal("")
  }

  const handleBaixarDados = () => {
    toast({
      title: "Download iniciado",
      description: "O relatorio da Lista de Doacoes esta sendo gerado.",
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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-6 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">ID Doacao</Label>
              <Input
                id="filtro-id"
                placeholder="Buscar"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Nome</Label>
              <Input
                id="filtro-nome"
                placeholder="Buscar"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Telefone</Label>
              <Input
                id="filtro-telefone"
                placeholder="Buscar"
                value={filtroTelefone}
                onChange={(e) => setFiltroTelefone(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                id="filtro-email"
                placeholder="Buscar"
                value={filtroEmail}
                onChange={(e) => setFiltroEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Status da doacao</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Cadastrada">Cadastrada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Pendente - Quantidade de Itens Atípica">Pendente - Quantidade de Itens Atípica</SelectItem>
                  <SelectItem value="Pré-Cadastrada">Pré-Cadastrada</SelectItem>
                  <SelectItem value="Pré-cadastro Cancelado">Pré-cadastro Cancelado</SelectItem>
                  <SelectItem value="Pré-cadastro Expirado">Pré-cadastro Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Atendente</Label>
              <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o atendente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ana Paula Silva">Ana Paula Silva</SelectItem>
                  <SelectItem value="Carlos Eduardo Santos">Carlos Eduardo Santos</SelectItem>
                  <SelectItem value="Mariana Oliveira">Mariana Oliveira</SelectItem>
                  <SelectItem value="Joao Pedro Costa">Joao Pedro Costa</SelectItem>
                  <SelectItem value="Fernanda Lima">Fernanda Lima</SelectItem>
                  <SelectItem value="Ricardo Mendes">Ricardo Mendes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Data Inicio</Label>
              <Input
                id="filtro-data-inicio"
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Data Final</Label>
              <Input
                id="filtro-data-final"
                type="date"
                value={filtroDataFinal}
                onChange={(e) => setFiltroDataFinal(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={handleLimparFiltros}>
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Doacoes</CardTitle>
            <Button variant="outline" onClick={handleBaixarDados}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Dados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Doacao</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead className="hidden md:table-cell">Endereco</TableHead>
                  <TableHead className="hidden lg:table-cell">Data da Coleta</TableHead>
                  <TableHead>Status da Doacao</TableHead>
                  <TableHead className="hidden md:table-cell">Qtd. Itens</TableHead>
                  <TableHead className="hidden lg:table-cell">Self-Service</TableHead>
                  <TableHead className="hidden lg:table-cell">Atendente</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
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
                  filteredDoacoes.map((doacao) => {
                    // Determina o tipo do doador (PF ou PJ) baseado no doadorId
                    const tipoDoador = doacao.doadorId?.startsWith("DOA003") || doacao.doadorId?.startsWith("DOA005") ? "PJ" : "PF"
                    
                    // Formata o endereco
                    const enderecoFormatado = doacao.endereco 
                      ? `${doacao.endereco.rua}, ${doacao.endereco.numero} - ${doacao.endereco.bairro}, ${doacao.endereco.cidade}/${doacao.endereco.uf}`
                      : "-"
                    
                    // Data da coleta
                    const dataColeta = doacao.agendamento?.data 
                      ? new Date(doacao.agendamento.data).toLocaleDateString("pt-BR")
                      : "-"
                    
                    // Self-service (baseado na modalidade)
                    const selfService = doacao.modalidade === "Ponto de coleta" ? "Sim" : "Nao"
                    
                    return (
                      <TableRow key={doacao.id}>
                        <TableCell className="font-mono text-sm">{doacao.id}</TableCell>
                        <TableCell>
                          <span className={`rounded px-2 py-1 text-xs font-medium ${
                            tipoDoador === "PF" 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {tipoDoador}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{doacao.doador.nome}</p>
                            <p className="text-xs text-muted-foreground">{doacao.doador.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate" title={enderecoFormatado}>
                          {enderecoFormatado}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {dataColeta}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={doacao.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center">
                          {doacao.quantidade || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center">
                          {selfService}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {doacao.atendente || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mais opcoes</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              {doacao.status !== "Cancelada" && doacao.status !== "Coletada" && doacao.status !== "Concluida" && (
                                <>
                                  <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Reagendar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelClick(doacao)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                  </DropdownMenuItem>
                                </>
                              )}
                              {doacao.status === "Coletada" && (
                                <DropdownMenuItem>
                                  <Check className="mr-2 h-4 w-4" />
                                  Finalizar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Doacao</DialogTitle>
            <DialogDescription>
              {selectedDoacao?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedDoacao && (
            <div className="space-y-6 py-4">
              {/* Dados do Doador */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Dados do Doador</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome do Doador:</span>
                    <p className="font-medium">{selectedDoacao.doador.nome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID Doador:</span>
                    <p className="font-medium">{selectedDoacao.doadorId || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{selectedDoacao.doador.telefone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedDoacao.doador.email}</p>
                  </div>
                </div>
              </div>

              {/* Dados da Doacao */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Dados da Doacao</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID da Doacao:</span>
                    <p className="font-medium">{selectedDoacao.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className={`font-medium ${
                      selectedDoacao.status === "Coletada" || selectedDoacao.status === "Concluida"
                        ? "text-green-600" 
                        : selectedDoacao.status === "Cancelada"
                        ? "text-red-600"
                        : selectedDoacao.status === "Agendada"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}>{selectedDoacao.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo de Coleta:</span>
                    <p className="font-medium">{selectedDoacao.modalidade || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Porte da Doacao:</span>
                    <p className="font-medium">{selectedDoacao.volume || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data da Coleta:</span>
                    <p className="font-medium">
                      {selectedDoacao.agendamento?.data 
                        ? new Date(selectedDoacao.agendamento.data).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Baixa Realizada:</span>
                    <p className="font-medium">{selectedDoacao.status === "Coletada" || selectedDoacao.status === "Concluida" ? "Sim" : "Nao"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-muted-foreground">Endereco:</span>
                    <p className="font-medium">
                      {selectedDoacao.endereco 
                        ? `${selectedDoacao.endereco.rua}, ${selectedDoacao.endereco.numero}${selectedDoacao.endereco.complemento ? `, ${selectedDoacao.endereco.complemento}` : ""} - ${selectedDoacao.endereco.bairro}, ${selectedDoacao.endereco.cidade}/${selectedDoacao.endereco.uf} - CEP: ${selectedDoacao.endereco.cep}`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data da Solicitacao:</span>
                    <p className="font-medium">
                      {new Date(selectedDoacao.dataCreated).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsavel pela Coleta:</span>
                    <p className="font-medium">{selectedDoacao.atendente || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modificado por:</span>
                    <p className="font-medium">{selectedDoacao.atendente || "-"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-muted-foreground">Observacoes:</span>
                    <p className="font-medium">{selectedDoacao.observacoes || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
