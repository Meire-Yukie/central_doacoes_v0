"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Eye, MoreHorizontal, FileText } from "lucide-react"
import { FiltersSection } from "@/components/filters-section"

interface ContatosTabProps {
  searchQuery: string
}

export function ContatosTab({ searchQuery }: ContatosTabProps) {
  const { toast } = useToast()
  
  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<"registro" | "lista">("registro")

  // Registro de Contato states
  const [tipoContato, setTipoContato] = useState("")
  const [canal, setCanal] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [fonteContato, setFonteContato] = useState("")
  const [motivoContato, setMotivoContato] = useState("")

  // Lista de Contato filter states
  const [filtroIdDoador, setFiltroIdDoador] = useState("")
  const [filtroIdContato, setFiltroIdContato] = useState("")
  const [filtroDataInicial, setFiltroDataInicial] = useState("")
  const [filtroDataFinal, setFiltroDataFinal] = useState("")
  const [filtroAtendente, setFiltroAtendente] = useState("")
  const [filtroCanal, setFiltroCanal] = useState("")
  const [filtroTipoContato, setFiltroTipoContato] = useState("")
  const [filtroMotivoContato, setFiltroMotivoContato] = useState("")
  const [filtroFonteContato, setFiltroFonteContato] = useState("")

  // Modal states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedContato, setSelectedContato] = useState<any>(null)

  // Mock data para lista de contatos
  const mockContatos = [
    { 
      id: "CNT001", 
      idDoador: "DOA001", 
      idOperacao: "OP001",
      nomeAtendente: "Ana Paula Silva", 
      dataContato: "2026-01-28", 
      canal: "Whatsapp", 
      tipoContato: "Ativo", 
      motivoContato: "Doacao/Prospeccao de doacao", 
      status: "Finalizado", 
      fonteContato: "Leads Planilha", 
      observacoes: "Cliente interessado em doar moveis" 
    },
    { 
      id: "CNT002", 
      idDoador: "DOA002", 
      idOperacao: "OP002",
      nomeAtendente: "Carlos Eduardo Santos", 
      dataContato: "2026-01-27", 
      canal: "Ligacao Telefonica", 
      tipoContato: "Receptivo", 
      motivoContato: "Reagendamento de coletas", 
      status: "Finalizado", 
      fonteContato: "-", 
      observacoes: "Solicitou reagendamento para proxima semana" 
    },
    { 
      id: "CNT003", 
      idDoador: "DOA003", 
      idOperacao: "OP003",
      nomeAtendente: "Mariana Oliveira", 
      dataContato: "2026-01-26", 
      canal: "Email", 
      tipoContato: "Ativo", 
      motivoContato: "Informacao ou duvida", 
      status: "Em andamento", 
      fonteContato: "Leads Salesforce", 
      observacoes: "Aguardando retorno do cliente" 
    },
    { 
      id: "CNT004", 
      idDoador: "DOA004", 
      idOperacao: "OP004",
      nomeAtendente: "Joao Pedro Costa", 
      dataContato: "2026-01-25", 
      canal: "Site", 
      tipoContato: "Receptivo", 
      motivoContato: "Cancelamento de coleta", 
      status: "Finalizado", 
      fonteContato: "-", 
      observacoes: "Cliente cancelou por motivos pessoais" 
    },
    { 
      id: "CNT005", 
      idDoador: "DOA005", 
      idOperacao: "OP005",
      nomeAtendente: "Fernanda Lima", 
      dataContato: "2026-01-24", 
      canal: "Whatsapp", 
      tipoContato: "Ativo", 
      motivoContato: "Elogio", 
      status: "Finalizado", 
      fonteContato: "Doador recorrente", 
      observacoes: "Elogiou o atendimento da equipe" 
    },
  ]

  // Filter logic
  const filteredContatos = mockContatos.filter((contato) => {
    const matchIdDoador = !filtroIdDoador || contato.idDoador.toLowerCase().includes(filtroIdDoador.toLowerCase())
    const matchIdContato = !filtroIdContato || contato.id.toLowerCase().includes(filtroIdContato.toLowerCase())
    const matchAtendente = !filtroAtendente || filtroAtendente === "todos" || contato.nomeAtendente === filtroAtendente
    const matchCanal = !filtroCanal || filtroCanal === "todos" || contato.canal === filtroCanal
    const matchTipoContato = !filtroTipoContato || filtroTipoContato === "todos" || contato.tipoContato === filtroTipoContato
    const matchMotivoContato = !filtroMotivoContato || filtroMotivoContato === "todos" || contato.motivoContato === filtroMotivoContato
    const matchFonteContato = !filtroFonteContato || filtroFonteContato === "todos" || contato.fonteContato === filtroFonteContato

    const dataContato = new Date(contato.dataContato)
    const dataInicial = filtroDataInicial ? new Date(filtroDataInicial) : null
    const dataFinal = filtroDataFinal ? new Date(filtroDataFinal) : null
    const matchDataInicial = !dataInicial || dataContato >= dataInicial
    const matchDataFinal = !dataFinal || dataContato <= dataFinal

    return matchIdDoador && matchIdContato && matchAtendente && matchCanal && matchTipoContato && matchMotivoContato && matchFonteContato && matchDataInicial && matchDataFinal
  })

  const handleLimparFiltros = () => {
    setFiltroIdDoador("")
    setFiltroIdContato("")
    setFiltroDataInicial("")
    setFiltroDataFinal("")
    setFiltroAtendente("")
    setFiltroCanal("")
    setFiltroTipoContato("")
    setFiltroMotivoContato("")
    setFiltroFonteContato("")
  }

  const handleRegistrar = () => {
    if (!tipoContato || !canal) {
      toast({
        title: "Campos obrigatorios",
        description: "Por favor, preencha o Tipo de Contato e o Canal.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Contato registrado",
      description: "O registro de contato foi salvo com sucesso.",
    })

    // Reset form
    setTipoContato("")
    setCanal("")
    setObservacoes("")
    setFonteContato("")
    setMotivoContato("")
  }

  const handleViewDetails = (contato: any) => {
    setSelectedContato(contato)
    setIsDetailsOpen(true)
  }

  const motivosContato = [
    "Doacao/Prospeccao de doacao",
    "Reagendamento de coletas",
    "Edicao de itens",
    "Cancelamento de coleta",
    "Elogio",
    "Indefinido (contato sem sucesso/nao finalizado)",
    "Informacao ou duvida",
    "Reclamacao",
    "Solicitacoes nao relacionadas ao Bazar"
  ]

  const fontesContato = [
    "Leads Planilha",
    "Leads Rede de Mobilizacao",
    "Leads Rede Mobilizacao - Influenciadores",
    "Leads Salesforce",
    "Leads Doare",
    "Retorno de ligacao abandonada",
    "Cliente loja",
    "Doador recorrente",
    "Outros"
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie registros de contatos e visualize o historico
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSubTab("registro")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "registro"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Registro de Contato Avulso
        </button>
        <button
          onClick={() => setActiveSubTab("lista")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSubTab === "lista"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Lista de Contato
        </button>
      </div>

      {activeSubTab === "registro" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Registro de Contato Avulso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Contato</Label>
                <Select value={tipoContato} onValueChange={setTipoContato}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Receptivo">Receptivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Canal</Label>
                <Select value={canal} onValueChange={setCanal}>
                  <SelectTrigger className="w-full">
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
              <div className="space-y-2">
                <Label>Observacoes</Label>
                <Textarea 
                  placeholder="Digite as observacoes..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="min-h-[40px]"
                />
              </div>
            </div>

            {/* Campos condicionais */}
            {tipoContato === "Ativo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Fonte de Contato</Label>
                  <Select value={fonteContato} onValueChange={setFonteContato}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontesContato.map((fonte) => (
                        <SelectItem key={fonte} value={fonte}>{fonte}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Motivo do Contato</Label>
                  <Select value={motivoContato} onValueChange={setMotivoContato}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivosContato.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>{motivo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {tipoContato === "Receptivo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Motivo do Contato</Label>
                  <Select value={motivoContato} onValueChange={setMotivoContato}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivosContato.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>{motivo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button className="gf-gradient text-white" onClick={handleRegistrar}>
                Registrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSubTab === "lista" && (
        <>
          {/* Filtros */}
          <FiltersSection>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID Doador</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroIdDoador}
                  onChange={(e) => setFiltroIdDoador(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">ID do Contato</Label>
                <Input
                  placeholder="Buscar"
                  value={filtroIdContato}
                  onChange={(e) => setFiltroIdContato(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Inicial</Label>
                <Input
                  type="date"
                  value={filtroDataInicial}
                  onChange={(e) => setFiltroDataInicial(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Data Final</Label>
                <Input
                  type="date"
                  value={filtroDataFinal}
                  onChange={(e) => setFiltroDataFinal(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Nome da Atendente</Label>
                <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ana Paula Silva">Ana Paula Silva</SelectItem>
                    <SelectItem value="Carlos Eduardo Santos">Carlos Eduardo Santos</SelectItem>
                    <SelectItem value="Mariana Oliveira">Mariana Oliveira</SelectItem>
                    <SelectItem value="Joao Pedro Costa">Joao Pedro Costa</SelectItem>
                    <SelectItem value="Fernanda Lima">Fernanda Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Canal</Label>
                <Select value={filtroCanal} onValueChange={setFiltroCanal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Whatsapp">Whatsapp</SelectItem>
                    <SelectItem value="Ligacao Telefonica">Ligacao Telefonica</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Site">Site</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tipo de Contato</Label>
                <Select value={filtroTipoContato} onValueChange={setFiltroTipoContato}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Receptivo">Receptivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Motivo do Contato</Label>
                <Select value={filtroMotivoContato} onValueChange={setFiltroMotivoContato}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {motivosContato.map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>{motivo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Fonte do Contato</Label>
                <Select value={filtroFonteContato} onValueChange={setFiltroFonteContato}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {fontesContato.map((fonte) => (
                      <SelectItem key={fonte} value={fonte}>{fonte}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={handleLimparFiltros}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </FiltersSection>

          {/* Tabela */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lista de Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Contato</TableHead>
                      <TableHead>ID Doador</TableHead>
                      <TableHead>Nome Atendente</TableHead>
                      <TableHead>Data do Contato</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Tipo de Contato</TableHead>
                      <TableHead className="hidden lg:table-cell">Motivo do Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Fonte do Contato</TableHead>
                      <TableHead className="hidden xl:table-cell">Observacoes</TableHead>
                      <TableHead>Acao</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContatos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="h-8 w-8" />
                            <span>Nenhum contato encontrado</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContatos.map((contato) => (
                        <TableRow key={contato.id}>
                          <TableCell className="font-mono text-sm">{contato.id}</TableCell>
                          <TableCell className="font-mono text-sm">{contato.idDoador}</TableCell>
                          <TableCell className="font-medium">{contato.nomeAtendente}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(contato.dataContato).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{contato.canal}</TableCell>
                          <TableCell>
                            <span className={`rounded px-2 py-1 text-xs font-medium ${
                              contato.tipoContato === "Ativo" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-purple-100 text-purple-700"
                            }`}>
                              {contato.tipoContato}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm max-w-[150px] truncate" title={contato.motivoContato}>
                            {contato.motivoContato}
                          </TableCell>
                          <TableCell>
                            <span className={`rounded px-2 py-1 text-xs font-medium ${
                              contato.status === "Finalizado" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {contato.status}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {contato.fonteContato}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm text-muted-foreground max-w-[150px] truncate" title={contato.observacoes}>
                            {contato.observacoes}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(contato)}>
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

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
            <DialogDescription>
              {selectedContato?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedContato && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID Contato:</span>
                  <p className="font-medium">{selectedContato.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ID Doador:</span>
                  <p className="font-medium">{selectedContato.idDoador}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ID Operacao:</span>
                  <p className="font-medium">{selectedContato.idOperacao}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nome Atendente:</span>
                  <p className="font-medium">{selectedContato.nomeAtendente}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data do Contato:</span>
                  <p className="font-medium">{new Date(selectedContato.dataContato).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Canal:</span>
                  <p className="font-medium">{selectedContato.canal}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo de Contato:</span>
                  <p className="font-medium">{selectedContato.tipoContato}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Motivo do Contato:</span>
                  <p className="font-medium">{selectedContato.motivoContato}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">{selectedContato.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fonte do Contato:</span>
                  <p className="font-medium">{selectedContato.fonteContato}</p>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <span className="text-muted-foreground">Observacoes:</span>
                  <p className="font-medium">{selectedContato.observacoes || "-"}</p>
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
    </div>
  )
}
