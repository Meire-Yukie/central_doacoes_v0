"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import { FiltersSection } from "@/components/filters-section"
import { mockColetas } from "@/lib/mock-data"
import type { Coleta } from "@/lib/types"
import {
  Eye,
  CheckCircle,
  Calendar,
  MapPin,
  Truck,
  Package,
  AlertTriangle,
  User,
  Phone,
  Download,
  MoreHorizontal,
  Pencil,
  X,
  Mail,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface AcompanhamentoTabProps {
  searchQuery: string
}

export function AcompanhamentoTab({ searchQuery }: AcompanhamentoTabProps) {
  const [selectedColeta, setSelectedColeta] = useState<Coleta | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [coletaToReschedule, setColetaToReschedule] = useState<Coleta | null>(null)
  const { toast } = useToast()

  // Agendar Coleta Modal State
  const [isAgendarColetaOpen, setIsAgendarColetaOpen] = useState(false)
  const [coletaToAgendar, setColetaToAgendar] = useState<Coleta | null>(null)
  const [agendarResponsavel, setAgendarResponsavel] = useState("")
  const [agendarMotivoReagendamento, setAgendarMotivoReagendamento] = useState("")
  const [agendarComentarios, setAgendarComentarios] = useState("")
  const [agendarReagendamentoAberto, setAgendarReagendamentoAberto] = useState("")
  const [agendarModalidadeColeta, setAgendarModalidadeColeta] = useState("")
  const [agendarNovaDataColeta, setAgendarNovaDataColeta] = useState("")
  const [agendarObservacao, setAgendarObservacao] = useState("")

  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<"romaneio" | "atrasadas" | "pendentes">("romaneio")

  // Filtros Romaneio
  const [filtroRomaneioTipoColeta, setFiltroRomaneioTipoColeta] = useState("")
  const [filtroRomaneioStatusDoacao, setFiltroRomaneioStatusDoacao] = useState("")
  const [filtroRomaneioDataInicio, setFiltroRomaneioDataInicio] = useState("")
  const [filtroRomaneioDataFinal, setFiltroRomaneioDataFinal] = useState("")
  const [filtroRomaneioIdDoador, setFiltroRomaneioIdDoador] = useState("")
  const [filtroRomaneioIdDoacao, setFiltroRomaneioIdDoacao] = useState("")

  // Filtros Atrasadas
  const [filtroAtrasadasTipoColeta, setFiltroAtrasadasTipoColeta] = useState("")
  const [filtroAtrasadasDataInicio, setFiltroAtrasadasDataInicio] = useState("")
  const [filtroAtrasadasDataFinal, setFiltroAtrasadasDataFinal] = useState("")
  const [filtroAtrasadasNome, setFiltroAtrasadasNome] = useState("")
  const [filtroAtrasadasEmail, setFiltroAtrasadasEmail] = useState("")
  const [filtroAtrasadasTelefone, setFiltroAtrasadasTelefone] = useState("")
  const [filtroAtrasadasIdDoacao, setFiltroAtrasadasIdDoacao] = useState("")
  const [filtroAtrasadasPrioridade, setFiltroAtrasadasPrioridade] = useState("")

  // Filtros Pendentes
  const [filtroPendentesTipoColeta, setFiltroPendentesTipoColeta] = useState("")
  const [filtroPendentesDataInicio, setFiltroPendentesDataInicio] = useState("")
  const [filtroPendentesDataFinal, setFiltroPendentesDataFinal] = useState("")
  const [filtroPendentesNome, setFiltroPendentesNome] = useState("")
  const [filtroPendentesEmail, setFiltroPendentesEmail] = useState("")
  const [filtroPendentesIdDoacao, setFiltroPendentesIdDoacao] = useState("")
  const [filtroPendentesStatusColeta, setFiltroPendentesStatusColeta] = useState("")
  const [filtroPendentesPrioridade, setFiltroPendentesPrioridade] = useState("")

  const handleLimparFiltrosRomaneio = () => {
    setFiltroRomaneioTipoColeta("")
    setFiltroRomaneioStatusDoacao("")
    setFiltroRomaneioDataInicio("")
    setFiltroRomaneioDataFinal("")
    setFiltroRomaneioIdDoador("")
    setFiltroRomaneioIdDoacao("")
  }

  const handleLimparFiltrosAtrasadas = () => {
    setFiltroAtrasadasTipoColeta("")
    setFiltroAtrasadasDataInicio("")
    setFiltroAtrasadasDataFinal("")
    setFiltroAtrasadasNome("")
    setFiltroAtrasadasEmail("")
    setFiltroAtrasadasTelefone("")
    setFiltroAtrasadasIdDoacao("")
    setFiltroAtrasadasPrioridade("")
  }

  const handleLimparFiltrosPendentes = () => {
    setFiltroPendentesTipoColeta("")
    setFiltroPendentesDataInicio("")
    setFiltroPendentesDataFinal("")
    setFiltroPendentesNome("")
    setFiltroPendentesEmail("")
    setFiltroPendentesIdDoacao("")
    setFiltroPendentesStatusColeta("")
    setFiltroPendentesPrioridade("")
  }

  const handleBaixarDados = (tipo: string) => {
    toast({
      title: "Download iniciado",
      description: `O relatorio de ${tipo} esta sendo gerado.`,
    })
  }

  // Mock data para as tabelas
  const mockRomaneioData = mockColetas.map((coleta, index) => ({
    ...coleta,
    tipoColeta: coleta.veiculo === "Van" || coleta.veiculo === "Utilitario" 
      ? "Caminhao - Retirada no endereco" 
      : coleta.veiculo === "Carro" 
        ? "Carro - Retirada no endereco" 
        : "Ponto de Coleta",
    statusDoacao: index % 4 === 0 ? "Cadastrada" : index % 4 === 1 ? "Concluida" : index % 4 === 2 ? "Cancelada" : "Pre-Cadastro Cancelado",
    selfService: index % 2 === 0 ? "Sim" : "Nao",
    prioridade: String((index % 4) + 1),
    email: `doador${index}@email.com`,
    qtdItens: Math.floor(Math.random() * 15) + 1,
  }))

  const filteredRomaneio = mockRomaneioData.filter((item) => {
    const matchTipoColeta = !filtroRomaneioTipoColeta || filtroRomaneioTipoColeta === "todos" || item.tipoColeta === filtroRomaneioTipoColeta
    const matchStatusDoacao = !filtroRomaneioStatusDoacao || filtroRomaneioStatusDoacao === "todos" || item.statusDoacao === filtroRomaneioStatusDoacao
    const matchIdDoador = !filtroRomaneioIdDoador || item.doacaoId.toLowerCase().includes(filtroRomaneioIdDoador.toLowerCase())
    const matchIdDoacao = !filtroRomaneioIdDoacao || item.id.toLowerCase().includes(filtroRomaneioIdDoacao.toLowerCase())
    
    const dataColeta = new Date(item.dataAgendada)
    const dataInicio = filtroRomaneioDataInicio ? new Date(filtroRomaneioDataInicio) : null
    const dataFinal = filtroRomaneioDataFinal ? new Date(filtroRomaneioDataFinal) : null
    
    const matchDataInicio = !dataInicio || dataColeta >= dataInicio
    const matchDataFinal = !dataFinal || dataColeta <= dataFinal
    
    return matchTipoColeta && matchStatusDoacao && matchIdDoador && matchIdDoacao && matchDataInicio && matchDataFinal
  })

  const filteredAtrasadas = mockRomaneioData.filter((item) => {
    const matchTipoColeta = !filtroAtrasadasTipoColeta || filtroAtrasadasTipoColeta === "todos" || item.tipoColeta === filtroAtrasadasTipoColeta
    const matchNome = !filtroAtrasadasNome || item.doadorNome.toLowerCase().includes(filtroAtrasadasNome.toLowerCase())
    const matchEmail = !filtroAtrasadasEmail || item.email.toLowerCase().includes(filtroAtrasadasEmail.toLowerCase())
    const matchTelefone = !filtroAtrasadasTelefone || (item.doadorTelefone && item.doadorTelefone.includes(filtroAtrasadasTelefone))
    const matchIdDoacao = !filtroAtrasadasIdDoacao || item.id.toLowerCase().includes(filtroAtrasadasIdDoacao.toLowerCase())
    const matchPrioridade = !filtroAtrasadasPrioridade || filtroAtrasadasPrioridade === "todos" || item.prioridade === filtroAtrasadasPrioridade
    
    const dataColeta = new Date(item.dataAgendada)
    const dataInicio = filtroAtrasadasDataInicio ? new Date(filtroAtrasadasDataInicio) : null
    const dataFinal = filtroAtrasadasDataFinal ? new Date(filtroAtrasadasDataFinal) : null
    
    const matchDataInicio = !dataInicio || dataColeta >= dataInicio
    const matchDataFinal = !dataFinal || dataColeta <= dataFinal
    
    return matchTipoColeta && matchNome && matchEmail && matchTelefone && matchIdDoacao && matchPrioridade && matchDataInicio && matchDataFinal
  }).slice(0, 10)

  const filteredPendentes = mockRomaneioData.filter((item) => {
    const matchTipoColeta = !filtroPendentesTipoColeta || filtroPendentesTipoColeta === "todos" || item.tipoColeta === filtroPendentesTipoColeta
    const matchNome = !filtroPendentesNome || item.doadorNome.toLowerCase().includes(filtroPendentesNome.toLowerCase())
    const matchEmail = !filtroPendentesEmail || item.email.toLowerCase().includes(filtroPendentesEmail.toLowerCase())
    const matchIdDoacao = !filtroPendentesIdDoacao || item.id.toLowerCase().includes(filtroPendentesIdDoacao.toLowerCase())
    const matchStatusColeta = !filtroPendentesStatusColeta || filtroPendentesStatusColeta === "todos" || item.status === filtroPendentesStatusColeta
    const matchPrioridade = !filtroPendentesPrioridade || filtroPendentesPrioridade === "todos" || item.prioridade === filtroPendentesPrioridade
    
    const dataColeta = new Date(item.dataAgendada)
    const dataInicio = filtroPendentesDataInicio ? new Date(filtroPendentesDataInicio) : null
    const dataFinal = filtroPendentesDataFinal ? new Date(filtroPendentesDataFinal) : null
    
    const matchDataInicio = !dataInicio || dataColeta >= dataInicio
    const matchDataFinal = !dataFinal || dataColeta <= dataFinal
    
    return matchTipoColeta && matchNome && matchEmail && matchIdDoacao && matchStatusColeta && matchPrioridade && matchDataInicio && matchDataFinal
  }).slice(0, 15)

  const handleViewDetails = (coleta: Coleta) => {
    setSelectedColeta(coleta)
    setIsDetailsOpen(true)
  }

  const handleDarBaixa = (coleta: Coleta) => {
    toast({
      title: "Baixa registrada",
      description: `A coleta ${coleta.id} foi marcada como coletada.`,
    })
  }

  const handleReschedule = (coleta: Coleta) => {
    setColetaToReschedule(coleta)
    setIsRescheduleOpen(true)
  }

  const handleAgendarColeta = (coleta: Coleta) => {
    setColetaToAgendar(coleta)
    setAgendarResponsavel("")
    setAgendarMotivoReagendamento("")
    setAgendarComentarios("")
    setAgendarReagendamentoAberto("")
    setAgendarModalidadeColeta("")
    setAgendarNovaDataColeta("")
    setAgendarObservacao("")
    setIsAgendarColetaOpen(true)
  }

  const handleSaveAgendarColeta = () => {
    setIsAgendarColetaOpen(false)
    setColetaToAgendar(null)
    toast({
      title: "Coleta agendada",
      description: `A coleta ${coletaToAgendar?.id} foi agendada com sucesso.`,
    })
  }

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault()
    setIsRescheduleOpen(false)
    toast({
      title: "Coleta reagendada",
      description: `A coleta ${coletaToReschedule?.id} foi reagendada com sucesso.`,
    })
    setColetaToReschedule(null)
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Acompanhamento de Coletas</h1>
          <p className="text-sm text-muted-foreground">
            Operacao do dia: acompanhe o status das coletas
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSubTab("romaneio")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "romaneio"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Romaneio de Transporte
        </button>
        <button
          onClick={() => setActiveSubTab("atrasadas")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "atrasadas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Coletas Atrasadas
        </button>
        <button
          onClick={() => setActiveSubTab("pendentes")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "pendentes"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Coletas Pendentes
        </button>
      </div>

      {/* Romaneio de Transporte */}
      {activeSubTab === "romaneio" && (
        <>
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Coleta</Label>
                <Select value={filtroRomaneioTipoColeta} onValueChange={setFiltroRomaneioTipoColeta}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Caminhao - Retirada no endereco">Caminhao - Retirada no endereco</SelectItem>
                    <SelectItem value="Carro - Retirada no endereco">Carro - Retirada no endereco</SelectItem>
                    <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
                    <SelectItem value="Correios">Correios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Status Doacao</Label>
                <Select value={filtroRomaneioStatusDoacao} onValueChange={setFiltroRomaneioStatusDoacao}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Cadastrada">Cadastrada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                    <SelectItem value="Concluida">Concluida</SelectItem>
                    <SelectItem value="Pre-Cadastro Cancelado">Pre-Cadastro Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Inicial</Label>
                <Input
                  type="date"
                  value={filtroRomaneioDataInicio}
                  onChange={(e) => setFiltroRomaneioDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Final</Label>
                <Input
                  type="date"
                  value={filtroRomaneioDataFinal}
                  onChange={(e) => setFiltroRomaneioDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID do Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroRomaneioIdDoador}
                  onChange={(e) => setFiltroRomaneioIdDoador(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID da Doacao</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroRomaneioIdDoacao}
                  onChange={(e) => setFiltroRomaneioIdDoacao(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex items-end">
                <Button variant="outline" onClick={handleLimparFiltrosRomaneio}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Romaneio de Transporte</CardTitle>
                <Button variant="outline" onClick={() => handleBaixarDados("Romaneio de Transporte")}>
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
                      <TableHead>Tipo de Coleta</TableHead>
                      <TableHead>Data da Coleta</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Nome Doador</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden lg:table-cell">Endereco</TableHead>
                      <TableHead className="hidden lg:table-cell">Observacoes</TableHead>
                      <TableHead>Status Doacao</TableHead>
                      <TableHead>Self-Service</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRomaneio.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Package className="h-8 w-8" />
                            <span>Nenhum registro encontrado</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRomaneio.slice(0, 20).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell className="text-sm">{item.tipoColeta}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.dataAgendada).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.qtdItens}
                          </TableCell>
                          <TableCell className="font-medium">{item.doadorNome}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {item.doadorTelefone || "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate" title={item.endereco}>
                            {item.endereco}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[150px] truncate" title={item.observacoes || "-"}>
                            {item.observacoes || "-"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={item.statusDoacao} />
                          </TableCell>
                          <TableCell className="text-center">{item.selfService}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
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

      {/* Coletas Atrasadas */}
      {activeSubTab === "atrasadas" && (
        <>
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Coleta</Label>
                <Select value={filtroAtrasadasTipoColeta} onValueChange={setFiltroAtrasadasTipoColeta}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Caminhao - Retirada no endereco">Caminhao - Retirada no endereco</SelectItem>
                    <SelectItem value="Carro - Retirada no endereco">Carro - Retirada no endereco</SelectItem>
                    <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
                    <SelectItem value="Correios">Correios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Inicial</Label>
                <Input
                  type="date"
                  value={filtroAtrasadasDataInicio}
                  onChange={(e) => setFiltroAtrasadasDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Final</Label>
                <Input
                  type="date"
                  value={filtroAtrasadasDataFinal}
                  onChange={(e) => setFiltroAtrasadasDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Nome do Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroAtrasadasNome}
                  onChange={(e) => setFiltroAtrasadasNome(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroAtrasadasEmail}
                  onChange={(e) => setFiltroAtrasadasEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Telefone</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroAtrasadasTelefone}
                  onChange={(e) => setFiltroAtrasadasTelefone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID da Doacao</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroAtrasadasIdDoacao}
                  onChange={(e) => setFiltroAtrasadasIdDoacao(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Prioridade</Label>
                <Select value={filtroAtrasadasPrioridade} onValueChange={setFiltroAtrasadasPrioridade}>
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
                <Button variant="outline" onClick={handleLimparFiltrosAtrasadas}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Coletas Atrasadas</CardTitle>
                <Button variant="outline" onClick={() => handleBaixarDados("Coletas Atrasadas")}>
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
                      <TableHead>Tipo de Coleta</TableHead>
                      <TableHead>Data da Coleta</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Nome Doador</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden lg:table-cell">Endereco</TableHead>
                      <TableHead className="hidden lg:table-cell">Observacoes</TableHead>
                      <TableHead>Self-Service</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAtrasadas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-8 w-8" />
                            <span>Nenhuma coleta atrasada encontrada</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAtrasadas.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell className="text-sm">{item.tipoColeta}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.dataAgendada).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.qtdItens}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.prioridade === "1" ? "bg-red-100 text-red-700" :
                              item.prioridade === "2" ? "bg-orange-100 text-orange-700" :
                              item.prioridade === "3" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {item.prioridade}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{item.doadorNome}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {item.doadorTelefone || "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate" title={item.endereco}>
                            {item.endereco}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[150px] truncate" title={item.observacoes || "-"}>
                            {item.observacoes || "-"}
                          </TableCell>
                          <TableCell className="text-center">{item.selfService}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
<DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
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
      
      {/* Coletas Pendentes */}
      {activeSubTab === "pendentes" && (
        <>
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Coleta</Label>
                <Select value={filtroPendentesTipoColeta} onValueChange={setFiltroPendentesTipoColeta}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Caminhao - Retirada no endereco">Caminhao - Retirada no endereco</SelectItem>
                    <SelectItem value="Carro - Retirada no endereco">Carro - Retirada no endereco</SelectItem>
                    <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
                    <SelectItem value="Correios">Correios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Inicial</Label>
                <Input
                  type="date"
                  value={filtroPendentesDataInicio}
                  onChange={(e) => setFiltroPendentesDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Final</Label>
                <Input
                  type="date"
                  value={filtroPendentesDataFinal}
                  onChange={(e) => setFiltroPendentesDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Nome do Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPendentesNome}
                  onChange={(e) => setFiltroPendentesNome(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPendentesEmail}
                  onChange={(e) => setFiltroPendentesEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID da Doacao</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroPendentesIdDoacao}
                  onChange={(e) => setFiltroPendentesIdDoacao(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Status da Coleta</Label>
                <Select value={filtroPendentesStatusColeta} onValueChange={setFiltroPendentesStatusColeta}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em rota">Em rota</SelectItem>
                    <SelectItem value="Atrasada">Atrasada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Prioridade</Label>
                <Select value={filtroPendentesPrioridade} onValueChange={setFiltroPendentesPrioridade}>
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
                <Button variant="outline" onClick={handleLimparFiltrosPendentes}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Coletas Pendentes</CardTitle>
                <Button variant="outline" onClick={() => handleBaixarDados("Coletas Pendentes")}>
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
                      <TableHead>Tipo de Coleta</TableHead>
                      <TableHead>Data da Coleta</TableHead>
                      <TableHead>Status da Coleta</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Nome Doador</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden lg:table-cell">Endereco</TableHead>
                      <TableHead>Self-Service</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendentes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Package className="h-8 w-8" />
                            <span>Nenhuma coleta pendente encontrada</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendentes.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell className="text-sm">{item.tipoColeta}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(item.dataAgendada).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="text-center">
                            {item.qtdItens}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.prioridade === "1" ? "bg-red-100 text-red-700" :
                              item.prioridade === "2" ? "bg-orange-100 text-orange-700" :
                              item.prioridade === "3" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {item.prioridade}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{item.doadorNome}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {item.doadorTelefone || "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate" title={item.endereco}>
                            {item.endereco}
                          </TableCell>
                          <TableCell className="text-center">{item.selfService}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAgendarColeta(item)}>
                                  <Calendar className="h-4 w-4" />
                                  Agendar Coleta
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

      {/* Agendar Coleta Modal */}
      <Dialog open={isAgendarColetaOpen} onOpenChange={setIsAgendarColetaOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendar Coleta</DialogTitle>
            <DialogDescription>
              {coletaToAgendar?.doadorNome} - {coletaToAgendar?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Endereco */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Endereco</Label>
              <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {coletaToAgendar?.enderecoCompleto 
                    ? `${coletaToAgendar.enderecoCompleto.rua}, ${coletaToAgendar.enderecoCompleto.numero}${coletaToAgendar.enderecoCompleto.complemento ? `, ${coletaToAgendar.enderecoCompleto.complemento}` : ""} - ${coletaToAgendar.enderecoCompleto.bairro}, ${coletaToAgendar.enderecoCompleto.cidade}/${coletaToAgendar.enderecoCompleto.uf} - CEP: ${coletaToAgendar.enderecoCompleto.cep}`
                    : coletaToAgendar?.endereco || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Responsavel pela Coleta */}
              <div className="space-y-2">
                <Label htmlFor="agendar-responsavel">Responsavel pela Coleta *</Label>
                <Select value={agendarResponsavel} onValueChange={setAgendarResponsavel}>
                  <SelectTrigger id="agendar-responsavel">
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
              <div className="space-y-2">
                <Label htmlFor="agendar-motivo">Motivo Reagendamento *</Label>
                <Select value={agendarMotivoReagendamento} onValueChange={setAgendarMotivoReagendamento}>
                  <SelectTrigger id="agendar-motivo">
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
            <div className="space-y-2">
              <Label htmlFor="agendar-comentarios">Comentarios</Label>
              <Input 
                id="agendar-comentarios"
                placeholder="Digite seus comentarios..."
                value={agendarComentarios}
                onChange={(e) => setAgendarComentarios(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Reagendamento em aberto */}
              <div className="space-y-2">
                <Label htmlFor="agendar-reagendamento-aberto">Reagendamento em aberto?</Label>
                <Select value={agendarReagendamentoAberto} onValueChange={setAgendarReagendamentoAberto}>
                  <SelectTrigger id="agendar-reagendamento-aberto">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Nao">Nao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Modalidade de coleta */}
              <div className="space-y-2">
                <Label htmlFor="agendar-modalidade">Modalidade de coleta *</Label>
                <Select value={agendarModalidadeColeta} onValueChange={setAgendarModalidadeColeta}>
                  <SelectTrigger id="agendar-modalidade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coleta Domiciliar">Coleta Domiciliar</SelectItem>
                    <SelectItem value="Ponto de Entrega">Ponto de Entrega</SelectItem>
                    <SelectItem value="Coleta Expressa">Coleta Expressa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Data da Coleta Anterior */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data da Coleta Anterior</Label>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {coletaToAgendar?.dataAgendada 
                      ? new Date(coletaToAgendar.dataAgendada).toLocaleDateString("pt-BR")
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Nova Data de Coleta */}
              <div className="space-y-2">
                <Label htmlFor="agendar-nova-data">Nova Data de Coleta *</Label>
                <Input 
                  id="agendar-nova-data"
                  type="date"
                  value={agendarNovaDataColeta}
                  onChange={(e) => setAgendarNovaDataColeta(e.target.value)}
                />
              </div>
            </div>

            {/* Observacao */}
            <div className="space-y-2">
              <Label htmlFor="agendar-observacao">Observacao</Label>
              <Input 
                id="agendar-observacao"
                placeholder="Digite uma observacao..."
                value={agendarObservacao}
                onChange={(e) => setAgendarObservacao(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAgendarColetaOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gf-gradient text-white"
              onClick={handleSaveAgendarColeta}
              disabled={!agendarResponsavel || !agendarMotivoReagendamento || !agendarModalidadeColeta || !agendarNovaDataColeta}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Doacao</DialogTitle>
            <DialogDescription>
              {selectedColeta?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end -mt-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                toast({
                  title: "Download iniciado",
                  description: "Os dados da doacao estao sendo baixados.",
                })
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Dados
            </Button>
          </div>
          {selectedColeta && (
            <div className="space-y-6 py-4">
              {/* Dados do Doador */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Dados do Doador</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome do Doador:</span>
                    <p className="font-medium">{selectedColeta.doadorNome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID Doador:</span>
                    <p className="font-medium">{selectedColeta.doacaoId || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{selectedColeta.doadorTelefone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{(selectedColeta as typeof mockRomaneioData[0]).email || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Dados da Doacao */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Dados da Doacao</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID da Doacao:</span>
                    <p className="font-medium">{selectedColeta.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className={`font-medium ${
                      selectedColeta.status === "Coletada" || selectedColeta.status === "Concluida"
                        ? "text-green-600" 
                        : selectedColeta.status === "Cancelada"
                        ? "text-red-600"
                        : selectedColeta.status === "Agendada"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}>{selectedColeta.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo de Coleta:</span>
                    <p className="font-medium">{(selectedColeta as typeof mockRomaneioData[0]).tipoColeta || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Porte da Doacao:</span>
                    <p className="font-medium">{selectedColeta.volume || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data da Coleta:</span>
                    <p className="font-medium">
                      {selectedColeta.dataAgendada 
                        ? new Date(selectedColeta.dataAgendada).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Baixa Realizada:</span>
                    <p className="font-medium">{selectedColeta.status === "Coletada" || selectedColeta.status === "Concluida" ? "Sim" : "Nao"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-muted-foreground">Endereco:</span>
                    <p className="font-medium">
                      {selectedColeta.enderecoCompleto 
                        ? `${selectedColeta.enderecoCompleto.rua}, ${selectedColeta.enderecoCompleto.numero}${selectedColeta.enderecoCompleto.complemento ? `, ${selectedColeta.enderecoCompleto.complemento}` : ""} - ${selectedColeta.enderecoCompleto.bairro}, ${selectedColeta.enderecoCompleto.cidade}/${selectedColeta.enderecoCompleto.uf} - CEP: ${selectedColeta.enderecoCompleto.cep}`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data da Solicitacao:</span>
                    <p className="font-medium">
                      {new Date(selectedColeta.dataAgendada).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsavel pela Coleta:</span>
                    <p className="font-medium">{selectedColeta.motorista || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modificado por:</span>
                    <p className="font-medium">{selectedColeta.motorista || "-"}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-muted-foreground">Observacoes:</span>
                    <p className="font-medium">{selectedColeta.observacoes || "-"}</p>
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
                        <td className="p-3">{selectedColeta.itens || "-"}</td>
                        <td className="text-center p-3">{(selectedColeta as typeof mockRomaneioData[0]).qtdItens || "-"}</td>
                        <td className="text-center p-3">{selectedColeta.volume || "-"}</td>
                        <td className="p-3">{selectedColeta.observacoes || "-"}</td>
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

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Coleta</DialogTitle>
            <DialogDescription>
              Defina uma nova data para a coleta {coletaToReschedule?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmReschedule}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">Nova data</Label>
                <Input id="new-date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-period">Periodo</Label>
                <select
                  id="new-period"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Manha">Manha</option>
                  <option value="Tarde">Tarde</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do reagendamento</Label>
                <Input id="reason" placeholder="Ex: Doador nao estava em casa" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRescheduleOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white">
                Confirmar reagendamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
