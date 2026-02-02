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
import { FiltersSection } from "@/components/filters-section"
import { TablePagination } from "@/components/table-pagination"
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
  Upload,
  Trash2,
  Image as ImageIcon,
  Phone,
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

  // Edit Items Modal State
  const [isEditItemsOpen, setIsEditItemsOpen] = useState(false)
  const [doacaoToEdit, setDoacaoToEdit] = useState<Doacao | null>(null)
  const [editItemDoacao, setEditItemDoacao] = useState("")
  const [editQuantidadeItem, setEditQuantidadeItem] = useState("")
  const [editDescricaoItem, setEditDescricaoItem] = useState("")
  const [editImagemPreview, setEditImagemPreview] = useState<string | null>(null)
  const [editItensDoacao, setEditItensDoacao] = useState<Array<{
    item: string
    quantidade: string
    descricao: string
    imagem: string | null
  }>>([])

  // Reagendamento Modal State
  const [isReagendamentoOpen, setIsReagendamentoOpen] = useState(false)
  const [doacaoToReagendar, setDoacaoToReagendar] = useState<Doacao | null>(null)
  const [reagendamentoTipoContato, setReagendamentoTipoContato] = useState("")
  const [reagendamentoCanal, setReagendamentoCanal] = useState("")
  const [reagendamentoFonteContato, setReagendamentoFonteContato] = useState("")
  const [reagendamentoStep, setReagendamentoStep] = useState(1)
  // Reagendamento Step 2 fields (same as Agendar Coleta)
  const [reagendamentoResponsavel, setReagendamentoResponsavel] = useState("")
  const [reagendamentoMotivoReagendamento, setReagendamentoMotivoReagendamento] = useState("")
  const [reagendamentoComentarios, setReagendamentoComentarios] = useState("")
  const [reagendamentoReagendamentoAberto, setReagendamentoReagendamentoAberto] = useState("")
  const [reagendamentoTipoColeta, setReagendamentoTipoColeta] = useState("")
  const [reagendamentoNovaDataColeta, setReagendamentoNovaDataColeta] = useState("")
  const [reagendamentoObservacao, setReagendamentoObservacao] = useState("")

  // Efetivar Doacao Modal State
  const [isEfetivarOpen, setIsEfetivarOpen] = useState(false)
  const [doacaoToEfetivar, setDoacaoToEfetivar] = useState<Doacao | null>(null)
  const [efetivarComoConheceu, setEfetivarComoConheceu] = useState("")
  const [efetivarMotivoDoacao, setEfetivarMotivoDoacao] = useState("")
  const [efetivarCampanhaDoacao, setEfetivarCampanhaDoacao] = useState("")
  const [efetivarItemDoacao, setEfetivarItemDoacao] = useState("")
  const [efetivarQuantidadeItem, setEfetivarQuantidadeItem] = useState("")
  const [efetivarDescricaoItem, setEfetivarDescricaoItem] = useState("")
  const [efetivarImagemPreview, setEfetivarImagemPreview] = useState<string | null>(null)
  const [efetivarItensDoacao, setEfetivarItensDoacao] = useState<Array<{
    item: string
    quantidade: string
    descricao: string
    imagem: string | null
  }>>([])


  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<"doacoes" | "pre-cadastradas">("doacoes")

  // Filtros Lista de Doacoes
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

  // Filtros Pre-Cadastradas
  const [filtroPreDataInicio, setFiltroPreDataInicio] = useState("")
  const [filtroPreDataFinal, setFiltroPreDataFinal] = useState("")
  const [filtroPreNome, setFiltroPreNome] = useState("")
  const [filtroPreEmail, setFiltroPreEmail] = useState("")
  const [filtroPreTelefone, setFiltroPreTelefone] = useState("")
  const [filtroPreId, setFiltroPreId] = useState("")
  const [filtroPrePrioridade, setFiltroPrePrioridade] = useState("")

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

  // Edit Items Modal Handlers
  const handleEditItemsClick = (doacao: Doacao) => {
    setDoacaoToEdit(doacao)
    // Initialize with existing items if any
    const existingItems = doacao.itens?.map(item => ({
      item: item.tipo || "",
      quantidade: String(item.quantidade || ""),
      descricao: item.descricao || "",
      imagem: null
    })) || []
    setEditItensDoacao(existingItems)
    setIsEditItemsOpen(true)
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEditImagemPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditRemoveImage = () => {
    setEditImagemPreview(null)
  }

  const handleEditSalvarItem = () => {
    if (editItemDoacao && editQuantidadeItem) {
      setEditItensDoacao(prev => [...prev, {
        item: editItemDoacao,
        quantidade: editQuantidadeItem,
        descricao: editDescricaoItem,
        imagem: editImagemPreview
      }])
      setEditItemDoacao("")
      setEditQuantidadeItem("")
      setEditDescricaoItem("")
      setEditImagemPreview(null)
      toast({
        title: "Item adicionado",
        description: "O item foi adicionado a lista.",
      })
    }
  }

  const handleEditRemoverItem = (index: number) => {
    setEditItensDoacao(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveEditedItems = () => {
    setIsEditItemsOpen(false)
    setDoacaoToEdit(null)
    setEditItemDoacao("")
    setEditQuantidadeItem("")
    setEditDescricaoItem("")
    setEditImagemPreview(null)
    toast({
      title: "Itens atualizados",
      description: "Os itens da doacao foram atualizados com sucesso.",
    })
  }

  // Reagendamento Modal Handlers
  const handleReagendamentoClick = (doacao: Doacao) => {
    setDoacaoToReagendar(doacao)
    setReagendamentoTipoContato("")
    setReagendamentoCanal("")
    setReagendamentoFonteContato("")
    setReagendamentoStep(1)
    // Reset step 2 fields
    setReagendamentoResponsavel("")
    setReagendamentoMotivoReagendamento("")
    setReagendamentoComentarios("")
    setReagendamentoReagendamentoAberto("")
    setReagendamentoTipoColeta("")
    setReagendamentoNovaDataColeta("")
    setReagendamentoObservacao("")
    setIsReagendamentoOpen(true)
  }

  const handleReagendamentoNextStep = () => {
    setReagendamentoStep(2)
  }

  const handleReagendamentoPrevStep = () => {
    setReagendamentoStep(1)
  }

  const handleSaveReagendamento = () => {
    setIsReagendamentoOpen(false)
    setDoacaoToReagendar(null)
    setReagendamentoTipoContato("")
    setReagendamentoCanal("")
    setReagendamentoFonteContato("")
    setReagendamentoStep(1)
    // Reset step 2 fields
    setReagendamentoResponsavel("")
    setReagendamentoMotivoReagendamento("")
    setReagendamentoComentarios("")
    setReagendamentoReagendamentoAberto("")
    setReagendamentoTipoColeta("")
    setReagendamentoNovaDataColeta("")
    setReagendamentoObservacao("")
    toast({
      title: "Reagendamento registrado",
      description: "O reagendamento foi salvo com sucesso.",
    })
  }

  // Efetivar Doacao Modal Handlers
  const handleEfetivarClick = (doacao: Doacao) => {
    setDoacaoToEfetivar(doacao)
    // Initialize with existing items if any
    const existingItems = doacao.itens?.map(item => ({
      item: item.tipo || "",
      quantidade: String(item.quantidade || ""),
      descricao: item.descricao || "",
      imagem: null
    })) || []
    setEfetivarItensDoacao(existingItems)
    setEfetivarComoConheceu("")
    setEfetivarMotivoDoacao("")
    setEfetivarCampanhaDoacao("")
    setIsEfetivarOpen(true)
  }

  const handleEfetivarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEfetivarImagemPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEfetivarRemoveImage = () => {
    setEfetivarImagemPreview(null)
  }

  const handleEfetivarSalvarItem = () => {
    if (efetivarItemDoacao && efetivarQuantidadeItem) {
      setEfetivarItensDoacao(prev => [...prev, {
        item: efetivarItemDoacao,
        quantidade: efetivarQuantidadeItem,
        descricao: efetivarDescricaoItem,
        imagem: efetivarImagemPreview
      }])
      setEfetivarItemDoacao("")
      setEfetivarQuantidadeItem("")
      setEfetivarDescricaoItem("")
      setEfetivarImagemPreview(null)
      toast({
        title: "Item adicionado",
        description: "O item foi adicionado a lista.",
      })
    }
  }

  const handleEfetivarRemoverItem = (index: number) => {
    setEfetivarItensDoacao(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveEfetivar = () => {
    setIsEfetivarOpen(false)
    setDoacaoToEfetivar(null)
    setEfetivarComoConheceu("")
    setEfetivarMotivoDoacao("")
    setEfetivarCampanhaDoacao("")
    setEfetivarItemDoacao("")
    setEfetivarQuantidadeItem("")
    setEfetivarDescricaoItem("")
    setEfetivarImagemPreview(null)
    toast({
      title: "Doacao efetivada",
      description: "A doacao foi efetivada com sucesso.",
    })
  }

  // Efetivar Doacao from Pre-Cadastradas Handler
  const handleEfetivarPreCadastradaClick = (item: typeof preCadastradas[0]) => {
    // Convert pre-cadastrada item to Doacao-like structure for the modal
    const doacaoLike: Doacao = {
      id: item.id,
      doador: {
        nome: item.nomeDoador,
        email: item.emailDoador,
        telefone: item.telefone,
      },
      doadorId: "",
      status: item.status,
      dataCreated: item.data,
      modalidade: "",
      volume: "",
      observacoes: "",
      atendente: "",
    }
    setDoacaoToEfetivar(doacaoLike)
    setEfetivarItensDoacao([])
    setEfetivarComoConheceu("")
    setEfetivarMotivoDoacao("")
    setEfetivarCampanhaDoacao("")
    setIsEfetivarOpen(true)
  }

  // Download data handler
  const handleDownloadData = () => {
    if (!selectedDoacao) return
    
    const data = {
      id: selectedDoacao.id,
      doador: selectedDoacao.doador,
      status: selectedDoacao.status,
      modalidade: selectedDoacao.modalidade,
      volume: selectedDoacao.volume,
      endereco: selectedDoacao.endereco,
      dataCreated: selectedDoacao.dataCreated,
      observacoes: selectedDoacao.observacoes,
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `doacao-${selectedDoacao.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download iniciado",
      description: "Os dados da doacao foram baixados.",
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

  const handleLimparFiltrosPre = () => {
    setFiltroPreDataInicio("")
    setFiltroPreDataFinal("")
    setFiltroPreNome("")
    setFiltroPreEmail("")
    setFiltroPreTelefone("")
    setFiltroPreId("")
    setFiltroPrePrioridade("")
  }

  // Mock data para pre-cadastradas
  const mockPreCadastradas = [
    { id: "PRE001", nomeDoador: "Maria Santos", endereco: "Rua das Flores, 123 - Jardins, SP", emailDoador: "maria@email.com", telefone: "(11) 99999-1111", optIn: true, data: "2026-01-25", status: "Pre-Cadastrada", prioridade: "1", selfService: "Sim" },
    { id: "PRE002", nomeDoador: "Joao Silva", endereco: "Av. Paulista, 1000 - Bela Vista, SP", emailDoador: "joao@email.com", telefone: "(11) 99999-2222", optIn: false, data: "2026-01-26", status: "Pre-Cadastrada", prioridade: "2", selfService: "Nao" },
    { id: "PRE003", nomeDoador: "Ana Oliveira", endereco: "Rua Augusta, 500 - Consolacao, SP", emailDoador: "ana@email.com", telefone: "(11) 99999-3333", optIn: true, data: "2026-01-27", status: "Pre-Cadastrada", prioridade: "3", selfService: "Sim" },
    { id: "PRE004", nomeDoador: "Carlos Mendes", endereco: "Alameda Santos, 200 - Jardim Paulista, SP", emailDoador: "carlos@email.com", telefone: "(11) 99999-4444", optIn: true, data: "2026-01-28", status: "Pre-Cadastrada", prioridade: "1", selfService: "Nao" },
    { id: "PRE005", nomeDoador: "Fernanda Lima", endereco: "Rua Oscar Freire, 800 - Pinheiros, SP", emailDoador: "fernanda@email.com", telefone: "(11) 99999-5555", optIn: false, data: "2026-01-29", status: "Pre-Cadastrada", prioridade: "4", selfService: "Sim" },
  ]

  const filteredPreCadastradas = mockPreCadastradas.filter((item) => {
    const matchId = !filtroPreId || item.id.toLowerCase().includes(filtroPreId.toLowerCase())
    const matchNome = !filtroPreNome || item.nomeDoador.toLowerCase().includes(filtroPreNome.toLowerCase())
    const matchEmail = !filtroPreEmail || item.emailDoador.toLowerCase().includes(filtroPreEmail.toLowerCase())
    const matchTelefone = !filtroPreTelefone || item.telefone.includes(filtroPreTelefone)
    const matchPrioridade = !filtroPrePrioridade || filtroPrePrioridade === "todos" || item.prioridade === filtroPrePrioridade
    
    const dataItem = new Date(item.data)
    const dataInicio = filtroPreDataInicio ? new Date(filtroPreDataInicio) : null
    const dataFinal = filtroPreDataFinal ? new Date(filtroPreDataFinal) : null
    
    const matchDataInicio = !dataInicio || dataItem >= dataInicio
    const matchDataFinal = !dataFinal || dataItem <= dataFinal
    
    return matchId && matchNome && matchEmail && matchTelefone && matchPrioridade && matchDataInicio && matchDataFinal
  })

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
          <h1 className="text-2xl font-bold text-foreground">Doacoes</h1>
          <p className="text-sm text-muted-foreground">
            Historico e gerenciamento de todas as doacoes recebidas
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSubTab("doacoes")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "doacoes"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Doacoes
        </button>
        <button
          onClick={() => setActiveSubTab("pre-cadastradas")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "pre-cadastradas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Doacoes Pre-Cadastradas
        </button>
      </div>

      {activeSubTab === "doacoes" && (
        <>
          <KPICards variant="doacoes" />

      {/* Filtros */}
      <FiltersSection>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Cadastrada">Cadastrada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
                <SelectItem value="Concluida">Concluida</SelectItem>
                <SelectItem value="Pendente - Quantidade de Itens Atipica">Pendente - Quantidade de Itens Atipica</SelectItem>
                <SelectItem value="Pre-Cadastrada">Pre-Cadastrada</SelectItem>
                <SelectItem value="Pre-cadastro Cancelado">Pre-cadastro Cancelado</SelectItem>
                <SelectItem value="Pre-cadastro Expirado">Pre-cadastro Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Atendente</Label>
            <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
              <SelectTrigger className="w-full">
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
      </FiltersSection>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Doacoes</CardTitle>
            <Button variant="outline" onClick={handleBaixarDados}>
              <Download className="h-4 w-4" />
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
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                              {/* Concluida ou Cancelada - apenas Ver detalhes */}
                              {(doacao.status === "Concluida" || doacao.status === "Cancelada") && (
                                <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
                                </DropdownMenuItem>
                              )}

                              {/* Cadastrada - Ver Detalhes, Editar Itens, Reagendamento, Cancelamento */}
                              {doacao.status === "Cadastrada" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                    <Eye className="h-4 w-4" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditItemsClick(doacao)}>
                                    <Pencil className="h-4 w-4" />
                                    Editar Itens
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReagendamentoClick(doacao)}>
                                    <Calendar className="h-4 w-4" />
                                    Reagendamento
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelClick(doacao)}
                                  >
                                    <X className="h-4 w-4" />
                                    Cancelamento
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Pendente - Quantidade de Itens Atipica */}
                              {doacao.status === "Pendente - Quantidade de Itens Atipica" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                    <Eye className="h-4 w-4" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditItemsClick(doacao)}>
                                    <Pencil className="h-4 w-4" />
                                    Editar Itens
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEfetivarClick(doacao)}>
                                    <Check className="h-4 w-4" />
                                    Efetivar Doacao
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelClick(doacao)}
                                  >
                                    <X className="h-4 w-4" />
                                    Cancelar Doacao
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Pre-Cadastrada */}
                              {doacao.status === "Pre-Cadastrada" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                    <Eye className="h-4 w-4" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEfetivarClick(doacao)}>
                                    <Check className="h-4 w-4" />
                                    Efetivar Doacao
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelClick(doacao)}
                                  >
                                    <X className="h-4 w-4" />
                                    Cancelar Doacao
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Pre-Cadastro Cancelado - nenhuma acao */}
                              {doacao.status === "Pre-cadastro Cancelado" && (
                                <DropdownMenuItem disabled className="text-muted-foreground">
                                  Nenhuma acao disponivel
                                </DropdownMenuItem>
                              )}

                              {/* Pre-Cadastro Expirado */}
                              {doacao.status === "Pre-cadastro Expirado" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleViewDetails(doacao)}>
                                    <Eye className="h-4 w-4" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEfetivarClick(doacao)}>
                                    <Check className="h-4 w-4" />
                                    Efetivar Doacao
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleCancelClick(doacao)}
                                  >
                                    <X className="h-4 w-4" />
                                    Cancelar Doacao
                                  </DropdownMenuItem>
                                </>
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
        </>
      )}

      {activeSubTab === "pre-cadastradas" && (
        <>
          {/* Filtros Pre-Cadastradas */}
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Solicitacao Inicial</Label>
                <Input
                  type="date"
                  value={filtroPreDataInicio}
                  onChange={(e) => setFiltroPreDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Solicitacao Final</Label>
                <Input
                  type="date"
                  value={filtroPreDataFinal}
                  onChange={(e) => setFiltroPreDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Nome do Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPreNome}
                  onChange={(e) => setFiltroPreNome(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPreEmail}
                  onChange={(e) => setFiltroPreEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Telefone</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPreTelefone}
                  onChange={(e) => setFiltroPreTelefone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID da Doacao</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPreId}
                  onChange={(e) => setFiltroPreId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Prioridade</Label>
                <Select value={filtroPrePrioridade} onValueChange={setFiltroPrePrioridade}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={handleLimparFiltrosPre}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

{/* Tabela Pre-Cadastradas */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Doacoes Pre-Cadastradas</CardTitle>
                  <Button variant="outline" onClick={() => {
                    toast({
                      title: "Download iniciado",
                      description: "O relatorio de Doacoes Pre-Cadastradas esta sendo gerado.",
                    })
                  }}>
                    <Download className="h-4 w-4" />
                    Baixar Dados
                  </Button>
                </div>
              </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Doacao</TableHead>
                      <TableHead>Nome Doador</TableHead>
                      <TableHead className="hidden md:table-cell">Endereco</TableHead>
                      <TableHead className="hidden lg:table-cell">Email Doador</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead>Opt-in</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Self-Service</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPreCadastradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="h-8 w-8" />
                            <span>Nenhuma doacao pre-cadastrada encontrada</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPreCadastradas.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell className="font-medium">{item.nomeDoador}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate" title={item.endereco}>
                            {item.endereco}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {item.emailDoador}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {item.telefone}
                          </TableCell>
                          <TableCell>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.optIn 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {item.optIn ? "Sim" : "Nao"}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.data).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.prioridade === "1" ? "bg-red-100 text-red-700" :
                              item.prioridade === "2" ? "bg-orange-100 text-orange-700" :
                              item.prioridade === "3" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {item.prioridade}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.selfService}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEfetivarPreCadastradaClick(item)}>
                                  <Check className="h-4 w-4" />
                                  Efetivar Doacao
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => {
                                    toast({
                                      title: "Doacao cancelada",
                                      description: `A doacao ${item.id} foi cancelada com sucesso.`,
                                      variant: "destructive",
                                    })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  Cancelar Doacao
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Doacao</DialogTitle>
            <DialogDescription>
              {selectedDoacao?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end -mt-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Dados
            </Button>
          </div>
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

              {/* Tabela de Itens */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Itens da Doacao</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="gf-gradient text-white text-sm">
                        <th className="text-left p-3 font-medium rounded-l-lg">Itens</th>
                        <th className="text-center p-3 font-medium">Total de Itens</th>
                        <th className="text-center p-3 font-medium">Tamanho</th>
                        <th className="text-left p-3 font-medium rounded-r-lg">Descricao</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b text-sm">
                        <td className="p-3">{selectedDoacao.tipoItem || "-"}</td>
                        <td className="text-center p-3">{selectedDoacao.quantidade || "-"}</td>
                        <td className="text-center p-3">{selectedDoacao.volume || "-"}</td>
                        <td className="p-3">{selectedDoacao.itensDeclarados || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
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

      {/* Edit Items Modal */}
      <Dialog open={isEditItemsOpen} onOpenChange={setIsEditItemsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Itens da Doacao</DialogTitle>
            <DialogDescription>
              Gerencie os itens da doacao
            </DialogDescription>
          </DialogHeader>

          {/* Dados do Doador */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm border-b pb-2">Dados do Doador</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ID da Doacao</Label>
                <p className="text-sm font-medium">{doacaoToEdit?.id || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nome do Doador</Label>
                <p className="text-sm font-medium">{doacaoToEdit?.doador.nome || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Telefone</Label>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {doacaoToEdit?.doador.telefone || "-"}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {doacaoToEdit?.doador.email || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Cadastro de novos itens */}
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium text-sm mb-4">Cadastro de novos itens</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-doacao">Item *</Label>
                <Select value={editItemDoacao} onValueChange={setEditItemDoacao}>
                  <SelectTrigger id="edit-item-doacao" className="w-full">
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roupas, calcados e acessorios">Roupas, calcados e acessorios</SelectItem>
                    <SelectItem value="Utensilios domesticos">Utensilios domesticos</SelectItem>
                    <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                    <SelectItem value="Objetos de decoracao">Objetos de decoracao</SelectItem>
                    <SelectItem value="Papelaria e material escolar">Papelaria e material escolar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantidade-item">Quantidade *</Label>
                <Input 
                  id="edit-quantidade-item" 
                  type="number" 
                  placeholder="0" 
                  value={editQuantidadeItem}
                  onChange={(e) => setEditQuantidadeItem(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-descricao-item">Descricao do item</Label>
              <Textarea 
                id="edit-descricao-item" 
                placeholder="Descreva o item..." 
                value={editDescricaoItem}
                onChange={(e) => setEditDescricaoItem(e.target.value)}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label>Imagem do item (opcional)</Label>
              {editImagemPreview ? (
                <div className="relative w-32 h-32 rounded-lg border overflow-hidden">
                  <img 
                    src={editImagemPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleEditRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label 
                  htmlFor="edit-imagem-item" 
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Fazer upload</span>
                  <input
                    id="edit-imagem-item"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditImageUpload}
                  />
                </label>
              )}
            </div>

            <div className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleEditSalvarItem}
                disabled={!editItemDoacao || !editQuantidadeItem}
              >
                Salvar item
              </Button>
            </div>
          </div>

          {/* Lista de Itens Cadastrados */}
          {editItensDoacao.length > 0 && (
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium text-sm mb-4">Itens cadastrados ({editItensDoacao.length})</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {editItensDoacao.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 gap-3">
                    {item.imagem ? (
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <img src={item.imagem} alt={item.item} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.item}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {item.quantidade} {item.descricao && `- ${item.descricao}`}</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditRemoverItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditItemsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gf-gradient text-white"
              onClick={handleSaveEditedItems}
            >
              Salvar alteracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reagendamento Modal */}
      <Dialog open={isReagendamentoOpen} onOpenChange={(open) => {
        if (!open) {
          setReagendamentoStep(1)
        }
        setIsReagendamentoOpen(open)
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reagendamentoStep === 1 ? "Registro de Contato para Reagendamento" : "Agendar Coleta"}
            </DialogTitle>
            <DialogDescription>
              {doacaoToReagendar?.doador.nome} - Etapa {reagendamentoStep} de 2
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Tipo de Contato e Canal */}
          {reagendamentoStep === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reagendamento-tipo-contato">Tipo de contato *</Label>
                  <Select value={reagendamentoTipoContato} onValueChange={(value) => {
                    setReagendamentoTipoContato(value)
                    if (value !== "Ativo") {
                      setReagendamentoFonteContato("")
                    }
                  }}>
                    <SelectTrigger id="reagendamento-tipo-contato" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Receptivo">Receptivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reagendamento-canal">Canal *</Label>
                  <Select value={reagendamentoCanal} onValueChange={setReagendamentoCanal}>
                    <SelectTrigger id="reagendamento-canal" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Whatsapp">Whatsapp</SelectItem>
                      <SelectItem value="Ligacao Telefonica">Ligacao Telefonica</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {reagendamentoTipoContato === "Ativo" && (
                <div className="space-y-2">
                  <Label htmlFor="reagendamento-fonte-contato">Fonte do contato *</Label>
                  <Select value={reagendamentoFonteContato} onValueChange={setReagendamentoFonteContato}>
                    <SelectTrigger id="reagendamento-fonte-contato" className="w-full h-10">
                      <SelectValue placeholder="Selecione a fonte do contato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leads Planilha">Leads Planilha</SelectItem>
                      <SelectItem value="Leads Rede de Mobilizacao">Leads Rede de Mobilizacao</SelectItem>
                      <SelectItem value="Leads Rede Mobilizacao - Influenciadores">Leads Rede Mobilizacao - Influenciadores</SelectItem>
                      <SelectItem value="Leads Salesforce">Leads Salesforce</SelectItem>
                      <SelectItem value="Leads Doare">Leads Doare</SelectItem>
                      <SelectItem value="Retorno de ligacao abandonada">Retorno de ligacao abandonada</SelectItem>
                      <SelectItem value="Cliente loja">Cliente loja</SelectItem>
                      <SelectItem value="Doador recorrente">Doador recorrente</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Agendar Coleta fields */}
          {reagendamentoStep === 2 && (
            <div className="grid gap-4 py-4">
              {/* Endereco */}
              <div className="space-y-2 w-full">
                <Label>Endereco</Label>
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 h-10 w-full">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">
                    {doacaoToReagendar?.endereco 
                      ? `${doacaoToReagendar.endereco.rua}, ${doacaoToReagendar.endereco.numero}${doacaoToReagendar.endereco.complemento ? `, ${doacaoToReagendar.endereco.complemento}` : ""} - ${doacaoToReagendar.endereco.bairro}, ${doacaoToReagendar.endereco.cidade}/${doacaoToReagendar.endereco.uf} - CEP: ${doacaoToReagendar.endereco.cep}`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Responsavel pela Coleta */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="reagendamento-responsavel">Responsavel pela Coleta *</Label>
                  <Select value={reagendamentoResponsavel} onValueChange={setReagendamentoResponsavel}>
                    <SelectTrigger id="reagendamento-responsavel" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
                      <SelectItem value="Joao Santos">Joao Santos</SelectItem>
                      <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
                      <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Motivo Reagendamento */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="reagendamento-motivo">Motivo Reagendamento *</Label>
                  <Select value={reagendamentoMotivoReagendamento} onValueChange={setReagendamentoMotivoReagendamento}>
                    <SelectTrigger id="reagendamento-motivo" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Necessidade Logistica">Necessidade Logistica</SelectItem>
                      <SelectItem value="Necessidade do Doador">Necessidade do Doador</SelectItem>
                      <SelectItem value="Remanejamento de Coleta">Remanejamento de Coleta</SelectItem>
                      <SelectItem value="Falha da Central">Falha da Central</SelectItem>
                      <SelectItem value="Falha do Prestador">Falha do Prestador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-2 w-full">
                <Label htmlFor="reagendamento-comentarios">Comentarios</Label>
                <Input 
                  id="reagendamento-comentarios"
                  className="w-full h-10"
                  placeholder="Digite seus comentarios..."
                  value={reagendamentoComentarios}
                  onChange={(e) => setReagendamentoComentarios(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Reagendamento em aberto */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="reagendamento-aberto">Reagendamento em aberto?</Label>
                  <Select value={reagendamentoReagendamentoAberto} onValueChange={setReagendamentoReagendamentoAberto}>
                    <SelectTrigger id="reagendamento-aberto" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Nao">Nao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Coleta */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="reagendamento-tipo-coleta">Tipo de Coleta *</Label>
                  <Select value={reagendamentoTipoColeta} onValueChange={setReagendamentoTipoColeta}>
                    <SelectTrigger id="reagendamento-tipo-coleta" className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Caminhao - Retirada no Endereco">Caminhao - Retirada no Endereco</SelectItem>
                      <SelectItem value="Carro - Retirada no Endereco">Carro - Retirada no Endereco</SelectItem>
                      <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data da Coleta Anterior */}
                <div className="space-y-2 w-full">
                  <Label>Data da Coleta Anterior</Label>
                  <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 h-10 w-full">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">
                      {doacaoToReagendar?.agendamento?.data 
                        ? new Date(doacaoToReagendar.agendamento.data).toLocaleDateString("pt-BR")
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Nova Data de Coleta */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="reagendamento-nova-data">Nova Data de Coleta *</Label>
                  <Input 
                    id="reagendamento-nova-data"
                    type="date"
                    className="w-full h-10"
                    value={reagendamentoNovaDataColeta}
                    onChange={(e) => setReagendamentoNovaDataColeta(e.target.value)}
                  />
                </div>
              </div>

              {/* Observacao */}
              <div className="space-y-2 w-full">
                <Label htmlFor="reagendamento-observacao">Observacao</Label>
                <Input 
                  id="reagendamento-observacao"
                  className="w-full h-10"
                  placeholder="Digite uma observacao..."
                  value={reagendamentoObservacao}
                  onChange={(e) => setReagendamentoObservacao(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {reagendamentoStep === 1 ? (
              <>
                <Button variant="outline" onClick={() => setIsReagendamentoOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="gf-gradient text-white"
                  disabled={!reagendamentoTipoContato || !reagendamentoCanal || (reagendamentoTipoContato === "Ativo" && !reagendamentoFonteContato)}
                  onClick={handleReagendamentoNextStep}
                >
                  Proximo
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleReagendamentoPrevStep}>
                  Voltar
                </Button>
                <Button 
                  className="gf-gradient text-white"
                  disabled={!reagendamentoResponsavel || !reagendamentoMotivoReagendamento || !reagendamentoTipoColeta || !reagendamentoNovaDataColeta}
                  onClick={handleSaveReagendamento}
                >
                  Salvar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Efetivar Doacao Modal */}
      <Dialog open={isEfetivarOpen} onOpenChange={setIsEfetivarOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Efetivar Doacao</DialogTitle>
            <DialogDescription>
              {doacaoToEfetivar?.doador.nome} - {doacaoToEfetivar?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Secao de Registro de Doacao */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm border-b pb-2">Registro de doacao</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="efetivar-como-conheceu">Como o doador conheceu o bazar? *</Label>
                  <Select value={efetivarComoConheceu} onValueChange={setEfetivarComoConheceu}>
                    <SelectTrigger id="efetivar-como-conheceu" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Campanha Corona no Paredao">Campanha Corona no Paredao</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Indicacao">Indicacao</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Parceria com empresas">Parceria com empresas</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="TV">TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efetivar-motivo-doacao">Motivo da doacao *</Label>
                  <Select value={efetivarMotivoDoacao} onValueChange={setEfetivarMotivoDoacao}>
                    <SelectTrigger id="efetivar-motivo-doacao" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mudanca de casa">Mudanca de casa</SelectItem>
                      <SelectItem value="Produto quebrado">Produto quebrado</SelectItem>
                      <SelectItem value="Limpeza na casa">Limpeza na casa</SelectItem>
                      <SelectItem value="Trocando tudo">Trocando tudo</SelectItem>
                      <SelectItem value="Falecimento na familia">Falecimento na familia</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="efetivar-campanha-doacao">Campanha da Doacao (opcional)</Label>
                <Input 
                  id="efetivar-campanha-doacao" 
                  placeholder="Nome da campanha" 
                  value={efetivarCampanhaDoacao}
                  onChange={(e) => setEfetivarCampanhaDoacao(e.target.value)}
                />
              </div>
            </div>

            {/* Secao de Cadastro de Itens */}
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium text-sm mb-4">Cadastro de novos itens</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="efetivar-item-doacao">Item *</Label>
                  <Select value={efetivarItemDoacao} onValueChange={setEfetivarItemDoacao}>
                    <SelectTrigger id="efetivar-item-doacao" className="w-full">
                      <SelectValue placeholder="Selecione o item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roupas, calcados e acessorios">Roupas, calcados e acessorios</SelectItem>
                      <SelectItem value="Utensilios domesticos">Utensilios domesticos</SelectItem>
                      <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                      <SelectItem value="Objetos de decoracao">Objetos de decoracao</SelectItem>
                      <SelectItem value="Papelaria e material escolar">Papelaria e material escolar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efetivar-quantidade-item">Quantidade *</Label>
                  <Input 
                    id="efetivar-quantidade-item" 
                    type="number" 
                    placeholder="0" 
                    value={efetivarQuantidadeItem}
                    onChange={(e) => setEfetivarQuantidadeItem(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="efetivar-descricao-item">Descricao do item</Label>
                <Textarea 
                  id="efetivar-descricao-item" 
                  placeholder="Descreva o item..." 
                  value={efetivarDescricaoItem}
                  onChange={(e) => setEfetivarDescricaoItem(e.target.value)}
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label>Imagem do item (opcional)</Label>
                {efetivarImagemPreview ? (
                  <div className="relative w-32 h-32 rounded-lg border overflow-hidden">
                    <img 
                      src={efetivarImagemPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={handleEfetivarRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="efetivar-imagem-item" 
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Fazer upload</span>
                    <input
                      id="efetivar-imagem-item"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEfetivarImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleEfetivarSalvarItem}
                  disabled={!efetivarItemDoacao || !efetivarQuantidadeItem}
                >
                  Salvar item
                </Button>
              </div>
            </div>

            {/* Lista de Itens Cadastrados */}
            {efetivarItensDoacao.length > 0 && (
              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium text-sm mb-4">Itens cadastrados ({efetivarItensDoacao.length})</h4>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {efetivarItensDoacao.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 gap-3">
                      {item.imagem ? (
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <img src={item.imagem} alt={item.item} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.item}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantidade} {item.descricao && `- ${item.descricao}`}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEfetivarRemoverItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEfetivarOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gf-gradient text-white"
              onClick={handleSaveEfetivar}
              disabled={!efetivarComoConheceu || !efetivarMotivoDoacao}
            >
              Efetivar Doacao
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
