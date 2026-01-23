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
import { mockDoadores, mockDoacoes } from "@/lib/mock-data"
import type { Doador } from "@/lib/types"
import { Plus, Pencil, Package, MapPin, Mail, Phone, FileText, MoreHorizontal, MessageSquare } from "lucide-react"
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
  const [tipoContato, setTipoContato] = useState("")
  const [canalContato, setCanalContato] = useState("")
  const { toast } = useToast()

  const filteredDoadores = mockDoadores.filter((doador) => {
    const query = searchQuery.toLowerCase()
    return (
      doador.nome.toLowerCase().includes(query) ||
      doador.email.toLowerCase().includes(query) ||
      doador.telefone?.toLowerCase().includes(query) ||
      doador.cep.includes(query) ||
      doador.id.toLowerCase().includes(query)
    )
  })

  const handleViewDetails = (doador: Doador) => {
    setSelectedDoador(doador)
    setIsDetailsOpen(true)
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

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    setIsContactOpen(false)
    toast({
      title: "Contato registrado",
      description: "O registro de contato foi salvo com sucesso.",
    })
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
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar novo doador
        </Button>
      </div>

      <KPICards variant="doadores" />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Doadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                              <DropdownMenuItem onClick={() => handleViewDetails(doador)}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Ver endereços
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewDetails(doador)}>
                                <Package className="mr-2 h-4 w-4" />
                                Ver doações
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewDetails(doador)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Fazer doação
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenContact(doador)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
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
          </div>
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
                <Package className="mr-2 h-4 w-4" />
                Criar nova doação para este doador
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Doador Dialog */}
      <Dialog open={isNewDoadorOpen} onOpenChange={setIsNewDoadorOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Doador</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo doador
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveNewDoador}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" placeholder="Nome do doador" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" />
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
                <div className="space-y-2">
                  <Label htmlFor="edit-cep">CEP *</Label>
                  <Input id="edit-cep" defaultValue={selectedDoador.cep} required />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="edit-rua">Rua *</Label>
                    <Input
                      id="edit-rua"
                      defaultValue={selectedDoador.endereco.rua}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-numero">Número *</Label>
                    <Input
                      id="edit-numero"
                      defaultValue={selectedDoador.endereco.numero}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-complemento">Complemento</Label>
                  <Input
                    id="edit-complemento"
                    defaultValue={selectedDoador.endereco.complemento || ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-bairro">Bairro *</Label>
                    <Input
                      id="edit-bairro"
                      defaultValue={selectedDoador.endereco.bairro}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cidade">Cidade/UF *</Label>
                    <Input
                      id="edit-cidade"
                      defaultValue={`${selectedDoador.endereco.cidade}/${selectedDoador.endereco.uf}`}
                      required
                    />
                  </div>
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
            <DialogTitle className="text-center text-2xl font-bold text-[#F5841F]">
              Registro de Contato
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveContact}>
            <div className="grid grid-cols-2 gap-4 py-6">
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
            <div className="flex justify-center pb-2">
              <Button
                type="submit"
                className="bg-[#F5841F] px-8 text-white hover:bg-[#E07318]"
                disabled={!tipoContato}
              >
                CONTINUAR
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
