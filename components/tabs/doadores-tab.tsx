"use client"

import React from "react"
import { Eye } from "lucide-react" // Import the Eye component

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { KPICards } from "@/components/kpi-cards"
import { StatusBadge } from "@/components/status-badge"
import { FiltersSection } from "@/components/filters-section"
import { ScrollableTable } from "@/components/scrollable-table"
import { mockDoadores, mockDoacoes } from "@/lib/mock-data"
import type { Doador } from "@/lib/types"
import { Plus, Pencil, Package, MapPin, Mail, Phone, FileText, MoreHorizontal, MessageSquare, Trash2, Download, Upload, ImageIcon, X } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface DoadoresTabProps {
  searchQuery: string
}

export function DoadoresTab({ searchQuery }: DoadoresTabProps) {
  const [selectedDoador, setSelectedDoador] = useState<Doador | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewDoadorOpen, setIsNewDoadorOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(false)
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false)
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false)
  const [isDeleteAddressOpen, setIsDeleteAddressOpen] = useState(false)
  const [selectedEndereco, setSelectedEndereco] = useState<{
    id: string
    tipo: string
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
    principal: boolean
  } | null>(null)
  const [isDoacoesOpen, setIsDoacoesOpen] = useState(false)
  const [doacoesView, setDoacoesView] = useState<"lista" | "detalhes">("lista")
  const [selectedDoacao, setSelectedDoacao] = useState<string | null>(null)
  const [tipoContato, setTipoContato] = useState("")
  const [canalContato, setCanalContato] = useState("")
  const [tipoNovoDoador, setTipoNovoDoador] = useState<"PF" | "PJ">("PF")
  const [isFazerDoacaoOpen, setIsFazerDoacaoOpen] = useState(false)
  const [fazerDoacaoStep, setFazerDoacaoStep] = useState<1 | 2>(1)
  const [tipoContatoDoacao, setTipoContatoDoacao] = useState("")
  const [canalDoacao, setCanalDoacao] = useState("")
  const [fonteContatoDoacao, setFonteContatoDoacao] = useState("")
  const [comoConheceu, setComoConheceu] = useState("")
  const [motivoDoacao, setMotivoDoacao] = useState("")
  const [campanhaDoacao, setCampanhaDoacao] = useState("")
  const [itemDoacao, setItemDoacao] = useState("")
  const [quantidadeItem, setQuantidadeItem] = useState("")
  const [descricaoItem, setDescricaoItem] = useState("")
  const [imagemItem, setImagemItem] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [itensDoacao, setItensDoacao] = useState<Array<{ item: string; quantidade: string; descricao: string; imagem?: string }>>([])
  const { toast } = useToast()

  // Dados mockados de endereços por doador (um doador pode ter múltiplos endereços)
  const mockEnderecos: Record<string, Array<{
    id: string
    tipo: string
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
    principal: boolean
  }>> = {
    "DOA001": [
      { id: "END001", tipo: "Apartamento", rua: "Avenida Paulista", numero: "1000", complemento: "Apto 123", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP", cep: "01310-100", principal: true },
      { id: "END002", tipo: "Estabelecimento comercial", rua: "Rua Augusta", numero: "500", bairro: "Consolação", cidade: "São Paulo", uf: "SP", cep: "01304-000", principal: false },
    ],
    "DOA002": [
      { id: "END003", tipo: "Casa", rua: "Rua das Flores", numero: "250", bairro: "Centro", cidade: "Rio de Janeiro", uf: "RJ", cep: "20040-020", principal: true },
    ],
    "DOA003": [
      { id: "END004", tipo: "Casa", rua: "Avenida Brasil", numero: "1500", complemento: "Casa 2", bairro: "Jardins", cidade: "São Paulo", uf: "SP", cep: "01430-000", principal: true },
      { id: "END005", tipo: "Outro", rua: "Rua da Praia", numero: "100", bairro: "Centro", cidade: "Guarujá", uf: "SP", cep: "11410-000", principal: false },
      { id: "END006", tipo: "Outro", rua: "Estrada do Campo", numero: "S/N", bairro: "Zona Rural", cidade: "Ibiúna", uf: "SP", cep: "18150-000", principal: false },
    ],
  }

  // Dados mockados de doações por doador
  const mockDoacoesPorDoador: Record<string, Array<{
    id: string
    dataColeta: string
    dataSolicitacao: string
    tipoColeta: string
    porteLitros: number
    status: string
    baixaRealizada: boolean
    endereco: string
    responsavelColeta: string
    observacoes: string
    modificadoPor: string
    itens: Array<{
      nome: string
      quantidade: number
      totalItens: number
      tamanho: string
      descricao: string
      estado: string
      fotografia: boolean
      altoValor: boolean
    }>
  }>> = {
    "DOA001": [
      { 
        id: "DON001", 
        dataColeta: "19/01/2026", 
        dataSolicitacao: "15/01/2026",
        tipoColeta: "Retirada", 
        porteLitros: 200,
        status: "Concluída", 
        baixaRealizada: true,
        endereco: "Avenida Paulista, 1000 - Bela Vista, São Paulo/SP",
        responsavelColeta: "Carlos Eduardo Santos",
        observacoes: "Coleta realizada sem intercorrências.",
        modificadoPor: "Ana Paula Silva",
        itens: [
          { nome: "Camisetas", quantidade: 10, totalItens: 10, tamanho: "M", descricao: "Camisetas em bom estado", estado: "Bom", fotografia: true, altoValor: false },
          { nome: "Calças jeans", quantidade: 5, totalItens: 5, tamanho: "42", descricao: "Calças seminovas", estado: "Ótimo", fotografia: true, altoValor: false },
        ]
      },
      { 
        id: "DON005", 
        dataColeta: "10/01/2026", 
        dataSolicitacao: "05/01/2026",
        tipoColeta: "Ponto de coleta", 
        porteLitros: 100,
        status: "Cadastrada", 
        baixaRealizada: false,
        endereco: "Ponto de Coleta Centro - Rua Augusta, 500, São Paulo/SP",
        responsavelColeta: "Mariana Oliveira",
        observacoes: "Aguardando confirmação do doador.",
        modificadoPor: "João Pedro Costa",
        itens: [
          { nome: "Livros didáticos", quantidade: 20, totalItens: 20, tamanho: "-", descricao: "Livros de ensino médio", estado: "Bom", fotografia: false, altoValor: false },
          { nome: "Livros de literatura", quantidade: 10, totalItens: 10, tamanho: "-", descricao: "Romances e ficção", estado: "Regular", fotografia: false, altoValor: false },
        ]
      },
    ],
    "DOA002": [
      { 
        id: "DON002", 
        dataColeta: "18/01/2026", 
        dataSolicitacao: "12/01/2026",
        tipoColeta: "Retirada", 
        porteLitros: 500,
        status: "Pendente - Quantidade de Itens Atípica", 
        baixaRealizada: false,
        endereco: "Rua das Flores, 250 - Centro, Rio de Janeiro/RJ",
        responsavelColeta: "Ricardo Mendes",
        observacoes: "Quantidade de itens acima do padrão. Necessita validação.",
        modificadoPor: "Fernanda Lima",
        itens: [
          { nome: "Geladeira", quantidade: 1, totalItens: 1, tamanho: "Grande", descricao: "Geladeira frost free 400L", estado: "Bom", fotografia: true, altoValor: true },
          { nome: "Micro-ondas", quantidade: 2, totalItens: 2, tamanho: "Médio", descricao: "Micro-ondas 30L", estado: "Ótimo", fotografia: true, altoValor: false },
        ]
      },
    ],
    "DOA003": [
      { 
        id: "DON003", 
        dataColeta: "17/01/2026", 
        dataSolicitacao: "10/01/2026",
        tipoColeta: "Retirada", 
        porteLitros: 800,
        status: "Pré-Cadastrada", 
        baixaRealizada: false,
        endereco: "Avenida Brasil, 1500 - Jardins, São Paulo/SP",
        responsavelColeta: "Ana Paula Silva",
        observacoes: "Doador solicita coleta no período da tarde.",
        modificadoPor: "Carlos Eduardo Santos",
        itens: [
          { nome: "Sofá", quantidade: 1, totalItens: 1, tamanho: "3 lugares", descricao: "Sofá de couro sintético", estado: "Bom", fotografia: true, altoValor: true },
          { nome: "Mesa de jantar", quantidade: 1, totalItens: 1, tamanho: "6 lugares", descricao: "Mesa de madeira com cadeiras", estado: "Regular", fotografia: true, altoValor: false },
          { nome: "Cadeira de escritório", quantidade: 3, totalItens: 3, tamanho: "XG", descricao: "Cadeiras ergonômicas", estado: "Ótimo", fotografia: false, altoValor: false },
        ]
      },
      { 
        id: "DON006", 
        dataColeta: "05/01/2026", 
        dataSolicitacao: "28/12/2025",
        tipoColeta: "Ponto de coleta", 
        porteLitros: 150,
        status: "Concluída", 
        baixaRealizada: true,
        endereco: "Ponto de Coleta Shopping - Av. Faria Lima, 1000, São Paulo/SP",
        responsavelColeta: "João Pedro Costa",
        observacoes: "Coleta realizada com sucesso.",
        modificadoPor: "Mariana Oliveira",
        itens: [
          { nome: "Brinquedos educativos", quantidade: 15, totalItens: 15, tamanho: "-", descricao: "Jogos e quebra-cabeças", estado: "Ótimo", fotografia: true, altoValor: false },
          { nome: "Bonecas", quantidade: 5, totalItens: 5, tamanho: "-", descricao: "Bonecas diversas", estado: "Bom", fotografia: false, altoValor: false },
        ]
      },
      { 
        id: "DON007", 
        dataColeta: "28/12/2025", 
        dataSolicitacao: "20/12/2025",
        tipoColeta: "Retirada", 
        porteLitros: 300,
        status: "Concluída", 
        baixaRealizada: true,
        endereco: "Rua da Praia, 100 - Centro, Guarujá/SP",
        responsavelColeta: "Fernanda Lima",
        observacoes: "Doação de fim de ano.",
        modificadoPor: "Ricardo Mendes",
        itens: [
          { nome: "Roupas de inverno", quantidade: 25, totalItens: 25, tamanho: "Variados", descricao: "Casacos e blusas de frio", estado: "Bom", fotografia: true, altoValor: false },
          { nome: "Roupas infantis", quantidade: 15, totalItens: 15, tamanho: "2-8 anos", descricao: "Roupas para crianças", estado: "Ótimo", fotografia: false, altoValor: false },
        ]
      },
    ],
  }

  // Filtros
  const [filtroId, setFiltroId] = useState("")
  const [filtroNome, setFiltroNome] = useState("")
  const [filtroEmail, setFiltroEmail] = useState("")
  const [filtroTelefone, setFiltroTelefone] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [filtroPrioridade, setFiltroPrioridade] = useState("")

  const filteredDoadores = mockDoadores.filter((doador) => {
    const query = searchQuery.toLowerCase()
    const matchSearch = 
      doador.nome.toLowerCase().includes(query) ||
      doador.email.toLowerCase().includes(query) ||
      doador.telefone?.toLowerCase().includes(query) ||
      doador.cep.includes(query) ||
      doador.id.toLowerCase().includes(query)

    const matchId = !filtroId || doador.id.toLowerCase().includes(filtroId.toLowerCase())
    const matchNome = !filtroNome || doador.nome.toLowerCase().includes(filtroNome.toLowerCase())
    const matchEmail = !filtroEmail || doador.email.toLowerCase().includes(filtroEmail.toLowerCase())
    const matchTelefone = !filtroTelefone || doador.telefone?.toLowerCase().includes(filtroTelefone.toLowerCase())
    const matchTipo = !filtroTipo || filtroTipo === "todos" || doador.tipo === filtroTipo
    const matchPrioridade = !filtroPrioridade || filtroPrioridade === "todos" || doador.prioridade === filtroPrioridade

    return matchSearch && matchId && matchNome && matchEmail && matchTelefone && matchTipo && matchPrioridade
  })

  const handleViewDetails = (doador: Doador) => {
    setSelectedDoador(doador)
    setIsDetailsOpen(true)
  }

  const handleOpenFazerDoacao = (doador: Doador) => {
    setSelectedDoador(doador)
    setFazerDoacaoStep(1)
    setTipoContatoDoacao("")
    setCanalDoacao("")
    setFonteContatoDoacao("")
    setComoConheceu("")
    setMotivoDoacao("")
    setCampanhaDoacao("")
setItemDoacao("")
  setQuantidadeItem("")
  setDescricaoItem("")
  setImagemItem(null)
  setImagemPreview(null)
  setItensDoacao([])
  setIsFazerDoacaoOpen(true)
  }

const handleSalvarItem = () => {
  if (itemDoacao && quantidadeItem) {
  setItensDoacao([...itensDoacao, { item: itemDoacao, quantidade: quantidadeItem, descricao: descricaoItem, imagem: imagemPreview || undefined }])
  setItemDoacao("")
  setQuantidadeItem("")
  setDescricaoItem("")
  setImagemItem(null)
  setImagemPreview(null)
  }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagemItem(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagemItem(null)
    setImagemPreview(null)
  }

  const handleRemoverItem = (index: number) => {
    setItensDoacao(itensDoacao.filter((_, i) => i !== index))
  }

  const handleAgendarDoacao = () => {
    setIsFazerDoacaoOpen(false)
    toast({
      title: "Doacao agendada",
      description: "A doacao foi agendada com sucesso.",
    })
  }

  const handleEdit = (doador: Doador) => {
    setSelectedDoador(doador)
    setIsEditOpen(true)
  }

  const handleSaveNewDoador = (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewDoadorOpen(false)
    toast({
      title: "Doador cadastrado",
      description: "O novo doador foi cadastrado com sucesso.",
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditOpen(false)
    toast({
      title: "Doador atualizado",
      description: "Os dados do doador foram atualizados com sucesso.",
    })
  }

  const handleOpenContact = (doador: Doador) => {
    setSelectedDoador(doador)
    setTipoContato("")
    setCanalContato("")
    setIsContactOpen(true)
  }

  const handleOpenAddress = (doador: Doador) => {
    setSelectedDoador(doador)
    setIsAddressOpen(true)
  }

  const handleOpenDoacoes = (doador: Doador) => {
    setSelectedDoador(doador)
    setIsDoacoesOpen(true)
  }

  const handleNewAddress = () => {
    setSelectedEndereco(null)
    setIsNewAddressOpen(true)
  }

  const handleEditAddress = (endereco: typeof selectedEndereco) => {
    setSelectedEndereco(endereco)
    setIsEditAddressOpen(true)
  }

  const handleDeleteAddress = (endereco: typeof selectedEndereco) => {
    setSelectedEndereco(endereco)
    setIsDeleteAddressOpen(true)
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewAddressOpen(false)
    toast({
      title: "Endereço cadastrado",
      description: "O novo endereço foi cadastrado com sucesso.",
    })
  }

  const handleSaveEditAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditAddressOpen(false)
    toast({
      title: "Endereço atualizado",
      description: "O endereço foi atualizado com sucesso.",
    })
  }

  const handleConfirmDeleteAddress = () => {
    setIsDeleteAddressOpen(false)
    setSelectedEndereco(null)
    toast({
      title: "Endereço excluído",
      description: "O endereço foi excluído com sucesso.",
      variant: "destructive",
    })
  }

const handleOpenDetalhesDoacao = (doacaoId: string) => {
  setSelectedDoacao(doacaoId)
  setDoacoesView("detalhes")
  }
  
  const handleVoltarListaDoacoes = () => {
  setSelectedDoacao(null)
  setDoacoesView("lista")
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    setIsContactOpen(false)
    toast({
      title: "Contato registrado",
      description: "O registro de contato foi salvo com sucesso.",
    })
  }

  const handleLimparFiltros = () => {
    setFiltroId("")
    setFiltroNome("")
    setFiltroEmail("")
    setFiltroTelefone("")
    setFiltroTipo("")
    setFiltroPrioridade("")
  }

  const doadorDoacoes = selectedDoador
    ? mockDoacoes.filter((d) => d.doadorId === selectedDoador.id)
    : []

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doadores</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os doadores cadastrados na plataforma
          </p>
        </div>
        <Button onClick={() => setIsNewDoadorOpen(true)} className="gf-gradient text-white">
          <Plus className="h-4 w-4" />
          Cadastrar novo doador
        </Button>
      </div>

      <KPICards variant="doadores" />

      {/* Filtros */}
      <FiltersSection>
        <div className="grid grid-cols-6 gap-4">
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">ID Doador</Label>
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
            <Label className="text-sm text-muted-foreground">E-mail</Label>
            <Input
              id="filtro-email"
              placeholder="Buscar"
              value={filtroEmail}
              onChange={(e) => setFiltroEmail(e.target.value)}
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
            <Label className="text-sm text-muted-foreground">Tipo de doador</Label>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="PF">Pessoa Fisica</SelectItem>
                <SelectItem value="PJ">Pessoa Juridica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Prioridade</Label>
            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Doadores</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollableTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Doador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Prioridade</TableHead>
                  <TableHead className="text-center">Doações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoadores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <span>Nenhum doador encontrado</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoadores.map((doador) => (
                    <TableRow key={doador.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {doador.id}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            doador.tipo === "PJ"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {doador.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{doador.nome}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {doador.email}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {doador.telefone || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            doador.prioridade === "Alta"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : doador.prioridade === "Média"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {doador.prioridade}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {doador.totalDoacoes}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(doador)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mais opções</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenAddress(doador)}>
                                <MapPin className="h-4 w-4" />
                                Ver endereços
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenDoacoes(doador)}>
                                <Package className="h-4 w-4" />
                                Ver doações
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenFazerDoacao(doador)}>
                                <Plus className="h-4 w-4" />
                                Fazer doação
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenContact(doador)}>
                                <MessageSquare className="h-4 w-4" />
                                Registrar contato
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollableTable>
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-xl">{selectedDoador?.nome}</SheetTitle>
            <SheetDescription>Detalhes do doador e histórico de doações</SheetDescription>
          </SheetHeader>

          {selectedDoador && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Dados Cadastrais</h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedDoador.email}</span>
                  </div>
                  {selectedDoador.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDoador.telefone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>
                        {selectedDoador.endereco.rua}, {selectedDoador.endereco.numero}
                        {selectedDoador.endereco.complemento &&
                          `, ${selectedDoador.endereco.complemento}`}
                      </p>
                      <p>
                        {selectedDoador.endereco.bairro} - {selectedDoador.endereco.cidade}/
                        {selectedDoador.endereco.uf}
                      </p>
                      <p>CEP: {selectedDoador.cep}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Observações</h3>
                <Textarea
                  defaultValue={selectedDoador.observacoes || ""}
                  placeholder="Adicione observações sobre este doador..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Histórico de Doações ({doadorDoacoes.length})
                  </h3>
                </div>
                {doadorDoacoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Este doador ainda não possui doações registradas.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {doadorDoacoes.map((doacao) => (
                      <div
                        key={doacao.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{doacao.tipoItem}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doacao.dataCreated).toLocaleDateString("pt-BR")} -{" "}
                            {doacao.volume}
                          </p>
                        </div>
                        <StatusBadge status={doacao.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="w-full gf-gradient text-white">
                <Package className="h-4 w-4" />
                Criar nova doação para este doador
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Doador Dialog */}
      <Dialog open={isNewDoadorOpen} onOpenChange={(open) => {
        setIsNewDoadorOpen(open)
        if (!open) setTipoNovoDoador("PF")
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Doador</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo doador
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveNewDoador}>
            <div className="grid gap-4 py-4">
              {/* Tipo de Doador */}
              <div className="space-y-2">
                <Label htmlFor="tipo-doador">Tipo de Doador *</Label>
                <Select value={tipoNovoDoador} onValueChange={(value: "PF" | "PJ") => setTipoNovoDoador(value)}>
                  <SelectTrigger id="tipo-doador">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PF">Pessoa Física</SelectItem>
                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos de Doador - Pessoa Física */}
              {tipoNovoDoador === "PF" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" placeholder="Nome do doador" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirma-email">Confirme o e-mail *</Label>
                    <Input id="confirma-email" type="email" placeholder="Confirme o e-mail" required />
                  </div>
                </>
              )}

              {/* Campos de Doador - Pessoa Jurídica */}
              {tipoNovoDoador === "PJ" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="razao-social">Razão Social *</Label>
                    <Input id="razao-social" placeholder="Razão Social da empresa" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome-responsavel">Nome do Responsável *</Label>
                    <Input id="nome-responsavel" placeholder="Nome do responsável" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirma-email">Confirme o e-mail *</Label>
                    <Input id="confirma-email" type="email" placeholder="Confirme o e-mail" required />
                  </div>
                </>
              )}

              {/* Separador de Endereço */}
              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Endereço</h4>
              </div>

              {/* Campos de Endereço */}
              <div className="space-y-2">
                <Label htmlFor="tipo-endereco">Tipo *</Label>
                <Select defaultValue="Casa">
                  <SelectTrigger id="tipo-endereco">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Estabelecimento comercial">Estabelecimento comercial</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input id="cep" placeholder="00000-000" required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input id="rua" placeholder="Nome da rua" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" placeholder="Nº" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" placeholder="Apto, bloco, etc." />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" placeholder="Bairro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade/UF *</Label>
                  <Input id="cidade" placeholder="Cidade/UF" required />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsNewDoadorOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Doador Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Doador</DialogTitle>
            <DialogDescription>
              Atualize os dados do doador
            </DialogDescription>
          </DialogHeader>
          {selectedDoador && (
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-id">ID Doador</Label>
                  <Input id="edit-id" value={selectedDoador.id} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tipo">Tipo *</Label>
                  <Select defaultValue={selectedDoador.tipo}>
                    <SelectTrigger id="edit-tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PF">Pessoa Física</SelectItem>
                      <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nome">Nome completo *</Label>
                  <Input id="edit-nome" defaultValue={selectedDoador.nome} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedDoador.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input id="edit-telefone" defaultValue={selectedDoador.telefone || ""} />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gf-gradient text-white">
                  Salvar alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Registration Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registro de Contato</DialogTitle>
            <DialogDescription>
              Registre um novo contato com o doador
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveContact}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipo-contato">Tipo de contato *</Label>
                <Select value={tipoContato} onValueChange={setTipoContato} required>
                  <SelectTrigger id="tipo-contato">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="receptivo">Receptivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canal-contato">Canal *</Label>
                <Select value={canalContato} onValueChange={setCanalContato} required>
                  <SelectTrigger id="canal-contato">
                    <SelectValue placeholder="WhatsApp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="ligacao">Ligação Telefônica</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsContactOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white" disabled={!tipoContato}>
                Continuar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Endereços do Doador</DialogTitle>
            <DialogDescription>
              {selectedDoador?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {selectedDoador && mockEnderecos[selectedDoador.id] ? (
              mockEnderecos[selectedDoador.id].map((endereco) => (
                <div
                  key={endereco.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{endereco.tipo}</span>
                      {endereco.principal && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditAddress(endereco)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAddress(endereco)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endereco.rua}, {endereco.numero}
                    {endereco.complemento && ` - ${endereco.complemento}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {endereco.bairro} - {endereco.cidade}/{endereco.uf}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {endereco.cep}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Nenhum endereço cadastrado para este doador.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddressOpen(false)}>
              Fechar
            </Button>
            <Button className="gf-gradient text-white" onClick={handleNewAddress}>
              <Plus className="h-4 w-4" />
              Novo Endereco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Address Dialog */}
      <Dialog open={isNewAddressOpen} onOpenChange={setIsNewAddressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Endereço</DialogTitle>
            <DialogDescription>
              Cadastre um novo endereço para {selectedDoador?.nome}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveNewAddress}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-tipo">Tipo *</Label>
                  <Select defaultValue="Casa">
                    <SelectTrigger id="new-tipo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Estabelecimento comercial">Estabelecimento comercial</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-cep">CEP *</Label>
                  <Input id="new-cep" placeholder="00000-000" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="new-rua">Rua *</Label>
                  <Input id="new-rua" placeholder="Nome da rua" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-numero">Número *</Label>
                  <Input id="new-numero" placeholder="Nº" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-complemento">Complemento</Label>
                <Input id="new-complemento" placeholder="Apto, Bloco, etc." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-bairro">Bairro *</Label>
                  <Input id="new-bairro" placeholder="Bairro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-cidade">Cidade *</Label>
                  <Input id="new-cidade" placeholder="Cidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-uf">UF *</Label>
                  <Select>
                    <SelectTrigger id="new-uf">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="ES">ES</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="new-principal" className="rounded border-gray-300" />
                <Label htmlFor="new-principal" className="text-sm font-normal">Definir como endereço principal</Label>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsNewAddressOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditAddressOpen} onOpenChange={setIsEditAddressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Endereço</DialogTitle>
            <DialogDescription>
              Atualize os dados do endereço
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEditAddress}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tipo">Tipo *</Label>
                  <Select defaultValue={selectedEndereco?.tipo || "Casa"}>
                    <SelectTrigger id="edit-tipo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Estabelecimento comercial">Estabelecimento comercial</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cep">CEP *</Label>
                  <Input id="edit-cep" defaultValue={selectedEndereco?.cep} placeholder="00000-000" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="edit-rua">Rua *</Label>
                  <Input id="edit-rua" defaultValue={selectedEndereco?.rua} placeholder="Nome da rua" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-numero">Número *</Label>
                  <Input id="edit-numero" defaultValue={selectedEndereco?.numero} placeholder="Nº" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-complemento">Complemento</Label>
                <Input id="edit-complemento" defaultValue={selectedEndereco?.complemento} placeholder="Apto, Bloco, etc." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bairro">Bairro *</Label>
                  <Input id="edit-bairro" defaultValue={selectedEndereco?.bairro} placeholder="Bairro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cidade">Cidade *</Label>
                  <Input id="edit-cidade" defaultValue={selectedEndereco?.cidade} placeholder="Cidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-uf">UF *</Label>
                  <Select defaultValue={selectedEndereco?.uf}>
                    <SelectTrigger id="edit-uf">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="ES">ES</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="edit-principal" defaultChecked={selectedEndereco?.principal} className="rounded border-gray-300" />
                <Label htmlFor="edit-principal" className="text-sm font-normal">Definir como endereço principal</Label>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditAddressOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white">
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteAddressOpen} onOpenChange={setIsDeleteAddressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Endereço</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este endereço?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEndereco && (
              <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                <p className="font-medium text-sm">{selectedEndereco.tipo}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEndereco.rua}, {selectedEndereco.numero}
                  {selectedEndereco.complemento && ` - ${selectedEndereco.complemento}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedEndereco.bairro} - {selectedEndereco.cidade}/{selectedEndereco.uf}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {selectedEndereco.cep}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteAddressOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteAddress}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donations Dialog - Single modal with navigation */}
      <Dialog open={isDoacoesOpen} onOpenChange={(open) => {
        setIsDoacoesOpen(open)
        if (!open) {
          setDoacoesView("lista")
          setSelectedDoacao(null)
        }
      }}>
        <DialogContent className={doacoesView === "lista" ? "sm:max-w-lg" : "sm:max-w-3xl max-h-[90vh] overflow-y-auto"}>
          {doacoesView === "lista" ? (
            <>
              <DialogHeader>
                <DialogTitle>Doacoes do Doador</DialogTitle>
                <DialogDescription className="space-y-1">
                  <span className="block">{selectedDoador?.nome}</span>
                  <span className="block text-xs">{selectedDoador?.email}</span>
                  <span className="block text-xs">{selectedDoador?.telefone}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
                {selectedDoador && mockDoacoesPorDoador[selectedDoador.id] ? (
                  mockDoacoesPorDoador[selectedDoador.id].map((doacao) => (
                    <div
                      key={doacao.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{doacao.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doacao.status === "Concluida" 
                            ? "bg-green-100 text-green-700" 
                            : doacao.status === "Cadastrada"
                            ? "bg-blue-100 text-blue-700"
                            : doacao.status === "Pre-Cadastrada"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {doacao.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p><span className="font-medium">Data da coleta:</span> {doacao.dataColeta}</p>
                        <p><span className="font-medium">Tipo de coleta:</span> {doacao.tipoColeta}</p>
                        <p><span className="font-medium">Porte:</span> {doacao.porteLitros}L</p>
                        <p><span className="font-medium">Baixa realizada:</span> {doacao.baixaRealizada ? "Sim" : "Nao"}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Endereco:</span> {doacao.endereco}
                      </p>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-transparent"
                          onClick={() => handleOpenDetalhesDoacao(doacao.id)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma doacao cadastrada para este doador.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDoacoesOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Doacao</DialogTitle>
                <DialogDescription>
                  {selectedDoacao}
                </DialogDescription>
              </DialogHeader>
              {(() => {
                const doacao = selectedDoador && mockDoacoesPorDoador[selectedDoador.id]?.find(d => d.id === selectedDoacao)
                if (!doacao) return null
                
                const totalItens = doacao.itens.reduce((acc, item) => acc + item.totalItens, 0)
                
                return (
                  <div className="space-y-6 py-4">
                    {/* Dados do Doador */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm border-b pb-2">Dados do Doador</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nome do Doador:</span>
                          <p className="font-medium">{selectedDoador?.nome}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID Doador:</span>
                          <p className="font-medium">{selectedDoador?.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Telefone:</span>
                          <p className="font-medium">{selectedDoador?.telefone}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{selectedDoador?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dados da Doacao */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm border-b pb-2">Dados da Doacao</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">ID da Doacao:</span>
                          <p className="font-medium">{doacao.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <p className={`font-medium ${
                            doacao.status === "Concluida" 
                              ? "text-green-600" 
                              : doacao.status === "Cadastrada"
                              ? "text-blue-600"
                              : doacao.status === "Pre-Cadastrada"
                              ? "text-yellow-600"
                              : "text-orange-600"
                          }`}>{doacao.status}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo de coleta:</span>
                          <p className="font-medium">{doacao.tipoColeta}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Porte da Doacao:</span>
                          <p className="font-medium">{doacao.porteLitros} Litros</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data da Coleta:</span>
                          <p className="font-medium">{doacao.dataColeta}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Baixa realizada?</span>
                          <p className="font-medium">{doacao.baixaRealizada ? "Sim" : "Nao"}</p>
                        </div>
                        <div className="col-span-2 md:col-span-3">
                          <span className="text-muted-foreground">Endereco:</span>
                          <p className="font-medium">{doacao.endereco}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data da Solicitacao:</span>
                          <p className="font-medium">{doacao.dataSolicitacao}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Responsavel pela coleta:</span>
                          <p className="font-medium">{doacao.responsavelColeta}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Modificado por:</span>
                          <p className="font-medium">{doacao.modificadoPor}</p>
                        </div>
                        <div className="col-span-2 md:col-span-3">
                          <span className="text-muted-foreground">Observacoes:</span>
                          <p className="font-medium">{doacao.observacoes}</p>
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
                              <th className="text-center p-3 font-medium">#</th>
                              <th className="text-center p-3 font-medium">Total de Itens</th>
                              <th className="text-center p-3 font-medium">Tamanho</th>
                              <th className="text-center p-3 font-medium">Descricao</th>
                              <th className="text-center p-3 font-medium">Estado</th>
                              <th className="text-center p-3 font-medium">Fotografia</th>
                              <th className="text-center p-3 font-medium rounded-r-lg">Alto Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doacao.itens.map((item, index) => (
                              <tr key={index} className="border-b text-sm">
                                <td className="p-3">{item.nome}</td>
                                <td className="text-center p-3">{item.quantidade}</td>
                                <td className="text-center p-3">{item.totalItens}</td>
                                <td className="text-center p-3">{item.tamanho}</td>
                                <td className="text-center p-3">{item.descricao}</td>
                                <td className="text-center p-3">{item.estado}</td>
                                <td className="text-center p-3">{item.fotografia ? "Sim" : "Nao"}</td>
                                <td className="text-center p-3">{item.altoValor ? "Sim" : "Nao"}</td>
                              </tr>
                            ))}
                            <tr className="font-semibold text-sm">
                              <td className="p-3">TOTAL</td>
                              <td className="text-center p-3"></td>
                              <td className="text-center p-3">{totalItens}</td>
                              <td className="text-center p-3"></td>
                              <td className="text-center p-3"></td>
                              <td className="text-center p-3"></td>
                              <td className="text-center p-3"></td>
                              <td className="text-center p-3"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              })()}
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleVoltarListaDoacoes}>
                  Voltar
                </Button>
                <Button variant="outline" onClick={() => setIsDoacoesOpen(false)}>
                  Fechar
                </Button>
                <Button className="gf-gradient text-white">
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fazer Doacao Dialog */}
      <Dialog open={isFazerDoacaoOpen} onOpenChange={(open) => {
        setIsFazerDoacaoOpen(open)
        if (!open) setFazerDoacaoStep(1)
      }}>
        <DialogContent className={fazerDoacaoStep === 1 ? "sm:max-w-lg" : "sm:max-w-2xl max-h-[90vh] overflow-y-auto"}>
          {fazerDoacaoStep === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Registro de Contato para Doacao/Reagendamento</DialogTitle>
                <DialogDescription>
                  {selectedDoador?.nome}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-contato-doacao">Tipo de contato *</Label>
                    <Select value={tipoContatoDoacao} onValueChange={(value) => {
                      setTipoContatoDoacao(value)
                      if (value !== "Ativo") {
                        setFonteContatoDoacao("")
                      }
                    }}>
                      <SelectTrigger id="tipo-contato-doacao" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Receptivo">Receptivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canal-doacao">Canal *</Label>
                    <Select value={canalDoacao} onValueChange={setCanalDoacao}>
                      <SelectTrigger id="canal-doacao" className="w-full">
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

                {tipoContatoDoacao === "Ativo" && (
                  <div className="space-y-2">
                    <Label htmlFor="fonte-contato-doacao">Fonte do contato *</Label>
                    <Select value={fonteContatoDoacao} onValueChange={setFonteContatoDoacao}>
                      <SelectTrigger id="fonte-contato-doacao">
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
              <DialogFooter>
                <Button 
                  className="gf-gradient text-white w-full"
                  disabled={!tipoContatoDoacao || !canalDoacao || (tipoContatoDoacao === "Ativo" && !fonteContatoDoacao)}
                  onClick={() => setFazerDoacaoStep(2)}
                >
                  Continuar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Registro de doacao</DialogTitle>
                <DialogDescription>
                  {selectedDoador?.nome}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Secao de Registro */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="como-conheceu">Como o doador conheceu o bazar? *</Label>
                    <Select value={comoConheceu} onValueChange={setComoConheceu}>
                      <SelectTrigger id="como-conheceu" className="w-full">
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
                    <Label htmlFor="motivo-doacao">Motivo da doacao *</Label>
                    <Select value={motivoDoacao} onValueChange={setMotivoDoacao}>
                      <SelectTrigger id="motivo-doacao" className="w-full">
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
                  <Label htmlFor="campanha-doacao">Campanha da Doacao (opcional)</Label>
                  <Input 
                    id="campanha-doacao" 
                    placeholder="Nome da campanha" 
                    value={campanhaDoacao}
                    onChange={(e) => setCampanhaDoacao(e.target.value)}
                  />
                </div>

                {/* Secao de Cadastro de Itens */}
                <div className="border-t pt-4 mt-2">
                  <h4 className="font-medium text-sm mb-4">Cadastro de novos itens</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-doacao">Item *</Label>
                      <Select value={itemDoacao} onValueChange={setItemDoacao}>
                        <SelectTrigger id="item-doacao" className="w-full">
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
                      <Label htmlFor="quantidade-item">Quantidade *</Label>
                      <Input 
                        id="quantidade-item" 
                        type="number" 
                        placeholder="0" 
                        value={quantidadeItem}
                        onChange={(e) => setQuantidadeItem(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="descricao-item">Descricao do item doado</Label>
                    <Textarea 
                      id="descricao-item" 
                      placeholder="Descreva o item..." 
                      value={descricaoItem}
                      onChange={(e) => setDescricaoItem(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Imagem do item (opcional)</Label>
                    {imagemPreview ? (
                      <div className="relative w-32 h-32 rounded-lg border overflow-hidden">
                        <img 
                          src={imagemPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label 
                        htmlFor="imagem-item" 
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Fazer upload</span>
                        <input
                          id="imagem-item"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSalvarItem}
                      disabled={!itemDoacao || !quantidadeItem}
                    >
                      Salvar item
                    </Button>
                  </div>
                </div>

                {/* Lista de Itens Cadastrados */}
                {itensDoacao.length > 0 && (
                  <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium text-sm mb-4">Itens cadastrados ({itensDoacao.length})</h4>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {itensDoacao.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 gap-3">
                          {item.imagem && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <img src={item.imagem} alt={item.item} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {!item.imagem && (
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
                            onClick={() => handleRemoverItem(index)}
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
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setFazerDoacaoStep(1)}>
                  Voltar
                </Button>
                <Button 
                  className="gf-gradient text-white"
                  disabled={!comoConheceu || !motivoDoacao || itensDoacao.length === 0}
                  onClick={handleAgendarDoacao}
                >
                  Agendar doacao
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
