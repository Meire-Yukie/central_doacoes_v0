"use client"

import React from "react"
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
import { TablePagination } from "@/components/table-pagination"
import { mockColetas } from "@/lib/mock-data"
import { Download, FileText, MoreHorizontal, Eye, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface BaixaTabProps {
  searchQuery: string
}

export function BaixaTab({ searchQuery }: BaixaTabProps) {
  const { toast } = useToast()

  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<"cadastro" | "relatorio">("cadastro")

  // Cadastro de Baixas
  const [cadastroIdDoacao, setCadastroIdDoacao] = useState("")
  const [cadastroIdColeta, setCadastroIdColeta] = useState("")

  // Filtros Relatorio
  const [filtroRelatorioTipoColeta, setFiltroRelatorioTipoColeta] = useState("")
  const [filtroRelatorioIdDoacao, setFiltroRelatorioIdDoacao] = useState("")
  const [filtroRelatorioIdColeta, setFiltroRelatorioIdColeta] = useState("")
  const [filtroRelatorioDataInicio, setFiltroRelatorioDataInicio] = useState("")
  const [filtroRelatorioDataFinal, setFiltroRelatorioDataFinal] = useState("")
  const [filtroRelatorioNomeDoador, setFiltroRelatorioNomeDoador] = useState("")
  const [filtroRelatorioTipoBaixa, setFiltroRelatorioTipoBaixa] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Modal states
  const [isDetalhesBaixaOpen, setIsDetalhesBaixaOpen] = useState(false)
  const [isRegistrarBaixaOpen, setIsRegistrarBaixaOpen] = useState(false)
  const [selectedBaixa, setSelectedBaixa] = useState<typeof mockRelatorioBaixas[0] | null>(null)
  const [registrarStatusColeta, setRegistrarStatusColeta] = useState("")
  const [registrarObservacoes, setRegistrarObservacoes] = useState("")
  const [detalheObservacoes, setDetalheObservacoes] = useState("")

  const handleLimparFiltrosRelatorio = () => {
    setFiltroRelatorioTipoColeta("")
    setFiltroRelatorioIdDoacao("")
    setFiltroRelatorioIdColeta("")
    setFiltroRelatorioDataInicio("")
    setFiltroRelatorioDataFinal("")
    setFiltroRelatorioNomeDoador("")
    setFiltroRelatorioTipoBaixa("")
    setCurrentPage(1)
  }

  const handleEnviarCadastro = () => {
    if (!cadastroIdDoacao || !cadastroIdColeta) {
      toast({
        title: "Campos obrigatorios",
        description: "Preencha o ID da Doacao e o ID da Coleta.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Baixa cadastrada",
      description: `Baixa registrada para Doacao ${cadastroIdDoacao} e Coleta ${cadastroIdColeta}.`,
    })
    setCadastroIdDoacao("")
    setCadastroIdColeta("")
  }

  const handleBaixarDados = () => {
    toast({
      title: "Download iniciado",
      description: "O relatorio de baixas esta sendo gerado.",
    })
  }

  const handleDetalhesBaixa = (item: typeof mockRelatorioBaixas[0]) => {
    setSelectedBaixa(item)
    setDetalheObservacoes("")
    setIsDetalhesBaixaOpen(true)
  }

  const handleRegistrarBaixa = (item: typeof mockRelatorioBaixas[0]) => {
    setSelectedBaixa(item)
    setRegistrarStatusColeta("")
    setRegistrarObservacoes("")
    setIsRegistrarBaixaOpen(true)
  }

  const handleSaveRegistrarBaixa = () => {
    setIsRegistrarBaixaOpen(false)
    setSelectedBaixa(null)
    toast({
      title: "Baixa registrada",
      description: `A baixa foi registrada com sucesso.`,
    })
  }

  // Status options for Status da Coleta
  const statusColetaOptions = [
    "Coleta Concluida",
    "Coleta Agendada",
    "Reagendamento em Aberto",
    "Coleta Reagendada",
    "Coleta Nao Realizada",
    "Coleta Pendente - Parcial"
  ]

  // Status options for Status da Baixa
  const statusBaixaOptions = ["Coleta Completa", "Coleta Nao Realizada"]

  // Mock data para relatorio de baixas
  const mockRelatorioBaixas = mockColetas.slice(0, 15).map((coleta, index) => ({
    id: coleta.id,
    idDoacao: `DON${String(index + 1).padStart(3, "0")}`,
    idColeta: coleta.id,
    nomeDoador: coleta.doadorNome,
    selfService: index % 2 === 0 ? "Sim" : "Nao",
    statusColeta: statusColetaOptions[index % statusColetaOptions.length],
    tipoColeta: coleta.veiculo === "Van" || coleta.veiculo === "Utilitario" 
      ? "Caminhao - Retirada no endereco" 
      : coleta.veiculo === "Carro" 
        ? "Carro - Retirada no endereco" 
        : "Ponto de Coleta",
    tipoBaixa: index % 3 === 0 ? "Baixa no CD" : index % 3 === 1 ? "Baixa no Doador" : "Baixa no Ponto de Coleta",
    dataColeta: coleta.dataAgendada,
    statusBaixa: statusBaixaOptions[index % statusBaixaOptions.length],
    baixaCD: index % 2 === 0,
    endereco: coleta.enderecoCompleto 
      ? `${coleta.enderecoCompleto.rua}, ${coleta.enderecoCompleto.numero}${coleta.enderecoCompleto.complemento ? `, ${coleta.enderecoCompleto.complemento}` : ""} - ${coleta.enderecoCompleto.bairro}, ${coleta.enderecoCompleto.cidade}/${coleta.enderecoCompleto.uf} - CEP: ${coleta.enderecoCompleto.cep}`
      : coleta.endereco,
  }))

  const filteredRelatorioBaixas = mockRelatorioBaixas.filter((item) => {
    const matchTipoColeta = !filtroRelatorioTipoColeta || filtroRelatorioTipoColeta === "todos" || item.tipoColeta === filtroRelatorioTipoColeta
    const matchIdDoacao = !filtroRelatorioIdDoacao || item.idDoacao.toLowerCase().includes(filtroRelatorioIdDoacao.toLowerCase())
    const matchIdColeta = !filtroRelatorioIdColeta || item.idColeta.toLowerCase().includes(filtroRelatorioIdColeta.toLowerCase())
    const matchNomeDoador = !filtroRelatorioNomeDoador || item.nomeDoador.toLowerCase().includes(filtroRelatorioNomeDoador.toLowerCase())
    const matchTipoBaixa = !filtroRelatorioTipoBaixa || filtroRelatorioTipoBaixa === "todos" || item.tipoBaixa === filtroRelatorioTipoBaixa

    const dataColeta = new Date(item.dataColeta)
    const dataInicio = filtroRelatorioDataInicio ? new Date(filtroRelatorioDataInicio) : null
    const dataFinal = filtroRelatorioDataFinal ? new Date(filtroRelatorioDataFinal) : null

    const matchDataInicio = !dataInicio || dataColeta >= dataInicio
    const matchDataFinal = !dataFinal || dataColeta <= dataFinal

    return matchTipoColeta && matchIdDoacao && matchIdColeta && matchNomeDoador && matchTipoBaixa && matchDataInicio && matchDataFinal
  })

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Baixa de Coletas</h1>
          <p className="text-sm text-muted-foreground">
            Registre baixas e gere relatorios de coletas
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSubTab("cadastro")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "cadastro"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Cadastro de Baixas
        </button>
        <button
          onClick={() => setActiveSubTab("relatorio")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "relatorio"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Relatorio de Baixas
        </button>
      </div>

      {/* Cadastro de Baixas */}
      {activeSubTab === "cadastro" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cadastro de Baixas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="cadastro-id-doacao">ID da Doacao</Label>
                <Input
                  id="cadastro-id-doacao"
                  placeholder="Ex: DON001"
                  value={cadastroIdDoacao}
                  onChange={(e) => setCadastroIdDoacao(e.target.value)}
                  className="w-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cadastro-id-coleta">ID da Coleta</Label>
                <Input
                  id="cadastro-id-coleta"
                  placeholder="Ex: COL001"
                  value={cadastroIdColeta}
                  onChange={(e) => setCadastroIdColeta(e.target.value)}
                  className="w-[200px]"
                />
              </div>
              <Button className="gf-gradient text-white" onClick={handleEnviarCadastro}>
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatorio de Baixas */}
      {activeSubTab === "relatorio" && (
        <>
          {/* Filtros */}
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Coleta</Label>
                <Select value={filtroRelatorioTipoColeta} onValueChange={setFiltroRelatorioTipoColeta}>
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
                <Label className="text-sm text-muted-foreground">ID Doacao</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroRelatorioIdDoacao}
                  onChange={(e) => setFiltroRelatorioIdDoacao(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID Coleta</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroRelatorioIdColeta}
                  onChange={(e) => setFiltroRelatorioIdColeta(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Inicial</Label>
                <Input
                  type="date"
                  value={filtroRelatorioDataInicio}
                  onChange={(e) => setFiltroRelatorioDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Coleta - Final</Label>
                <Input
                  type="date"
                  value={filtroRelatorioDataFinal}
                  onChange={(e) => setFiltroRelatorioDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Nome do Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroRelatorioNomeDoador}
                  onChange={(e) => setFiltroRelatorioNomeDoador(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Baixa</Label>
                <Select value={filtroRelatorioTipoBaixa} onValueChange={setFiltroRelatorioTipoBaixa}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Baixa no CD">Baixa no CD</SelectItem>
                    <SelectItem value="Baixa no Doador">Baixa no Doador</SelectItem>
                    <SelectItem value="Baixa no Ponto de Coleta">Baixa no Ponto de Coleta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={handleLimparFiltrosRelatorio}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

          {/* Tabela Relatorio */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Relatorio de Baixas</CardTitle>
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
                      <TableHead>Baixa CD</TableHead>
                      <TableHead>ID Doacao</TableHead>
                      <TableHead>ID Coleta</TableHead>
                      <TableHead>Nome Doador</TableHead>
                      <TableHead>Self-Service</TableHead>
                      <TableHead>Status da Coleta</TableHead>
                      <TableHead className="hidden md:table-cell">Tipo de Coleta</TableHead>
                      <TableHead className="hidden lg:table-cell">Tipo de Baixa</TableHead>
                      <TableHead className="hidden md:table-cell">Data da Coleta</TableHead>
                      <TableHead>Status da Baixa</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRelatorioBaixas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="h-8 w-8" />
                            <span>Nenhuma baixa encontrada</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRelatorioBaixas
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.baixaCD 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {item.baixaCD ? "Sim" : "Nao"}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.idDoacao}</TableCell>
                          <TableCell className="font-mono text-sm">{item.idColeta}</TableCell>
                          <TableCell className="font-medium">{item.nomeDoador}</TableCell>
                          <TableCell className="text-center">{item.selfService}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.statusColeta} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {item.tipoColeta}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {item.tipoBaixa}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {new Date(item.dataColeta).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={item.statusBaixa} />
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
                                {item.baixaCD ? (
                                  <DropdownMenuItem onClick={() => handleDetalhesBaixa(item)}>
                                    <Eye className="h-4 w-4" />
                                    Detalhes da Baixa
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleRegistrarBaixa(item)}>
                                    <Eye className="h-4 w-4" />
                                    Registrar Baixa
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredRelatorioBaixas.length / itemsPerPage)}
                totalItems={filteredRelatorioBaixas.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Detalhes da Baixa Modal */}
      <Dialog open={isDetalhesBaixaOpen} onOpenChange={setIsDetalhesBaixaOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Baixa</DialogTitle>
            <DialogDescription>
              Informacoes da baixa registrada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">ID da Doacao</Label>
                <p className="font-medium">{selectedBaixa?.idDoacao}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Nome do Doador</Label>
                <p className="font-medium">{selectedBaixa?.nomeDoador}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Endereco</Label>
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 h-10 w-full">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{selectedBaixa?.endereco || "-"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Status da Coleta</Label>
              <div className="flex items-center h-10">
                {selectedBaixa && <StatusBadge status={selectedBaixa.statusColeta as any} />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalhe-observacoes">Observacoes</Label>
              <Textarea
                id="detalhe-observacoes"
                placeholder="Observacoes..."
                value={detalheObservacoes}
                onChange={(e) => setDetalheObservacoes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetalhesBaixaOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registrar Baixa Modal */}
      <Dialog open={isRegistrarBaixaOpen} onOpenChange={setIsRegistrarBaixaOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Baixa</DialogTitle>
            <DialogDescription>
              Registre a baixa da coleta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">ID da Doacao</Label>
                <p className="font-medium">{selectedBaixa?.idDoacao}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Nome do Doador</Label>
                <p className="font-medium">{selectedBaixa?.nomeDoador}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrar-status-coleta">Status da Coleta *</Label>
              <Select value={registrarStatusColeta} onValueChange={setRegistrarStatusColeta}>
                <SelectTrigger id="registrar-status-coleta" className="w-full h-10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coleta Completa">Coleta Completa</SelectItem>
                  <SelectItem value="Coleta Parcial">Coleta Parcial</SelectItem>
                  <SelectItem value="Coleta Nao Realizada">Coleta Nao Realizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrar-observacoes">Observacoes</Label>
              <Textarea
                id="registrar-observacoes"
                placeholder="Observacoes..."
                value={registrarObservacoes}
                onChange={(e) => setRegistrarObservacoes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegistrarBaixaOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gf-gradient text-white"
              onClick={handleSaveRegistrarBaixa}
              disabled={!registrarStatusColeta}
            >
              Registrar Baixa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
