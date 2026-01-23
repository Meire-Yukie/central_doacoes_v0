"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { KPICards } from "@/components/kpi-cards"
import { StatusBadge } from "@/components/status-badge"
import { mockColetas, mockBaixas } from "@/lib/mock-data"
import type { Coleta } from "@/lib/types"
import { CheckCircle, Download, FileText, FileSpreadsheet, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface BaixaTabProps {
  searchQuery: string
}

export function BaixaTab({ searchQuery }: BaixaTabProps) {
  const [selectedColetas, setSelectedColetas] = useState<string[]>([])
  const [isBaixaDialogOpen, setIsBaixaDialogOpen] = useState(false)
  const [periodoFilter, setPeriodoFilter] = useState<string>("todos")
  const [responsavelFilter, setResponsavelFilter] = useState<string>("todos")
  const { toast } = useToast()

  // Filter coletas that are not yet collected
  const coletasParaBaixa = mockColetas.filter(
    (c) => c.status === "Pendente" || c.status === "Em rota"
  )

  const filteredColetasParaBaixa = coletasParaBaixa.filter((coleta) => {
    const query = searchQuery.toLowerCase()
    return (
      coleta.doadorNome.toLowerCase().includes(query) ||
      coleta.endereco.toLowerCase().includes(query) ||
      coleta.id.toLowerCase().includes(query)
    )
  })

  const filteredBaixas = mockBaixas.filter((baixa) => {
    const matchesPeriodo = periodoFilter === "todos" // Would filter by period
    const matchesResponsavel =
      responsavelFilter === "todos" || baixa.responsavel === responsavelFilter
    return matchesPeriodo && matchesResponsavel
  })

  const handleSelectColeta = (coletaId: string, checked: boolean) => {
    if (checked) {
      setSelectedColetas([...selectedColetas, coletaId])
    } else {
      setSelectedColetas(selectedColetas.filter((id) => id !== coletaId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedColetas(filteredColetasParaBaixa.map((c) => c.id))
    } else {
      setSelectedColetas([])
    }
  }

  const handleDarBaixaLote = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBaixaDialogOpen(false)
    toast({
      title: "Baixas registradas",
      description: `${selectedColetas.length} coleta(s) foram registradas com sucesso.`,
    })
    setSelectedColetas([])
  }

  const handleExportCSV = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo CSV está sendo gerado e será baixado em breve.",
    })
  }

  const handleExportPDF = () => {
    toast({
      title: "Exportação iniciada",
      description: "O relatório PDF está sendo gerado e será baixado em breve.",
    })
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Baixa de Coletas</h1>
          <p className="text-sm text-muted-foreground">
            Registre baixas e gere relatórios de coletas
          </p>
        </div>
      </div>

      <KPICards variant="baixa" />

      {/* Dar Baixa Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Coletas Aguardando Baixa</CardTitle>
              <CardDescription>
                Selecione as coletas para dar baixa em lote
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBaixaDialogOpen(true)}
                disabled={selectedColetas.length === 0}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Dar baixa ({selectedColetas.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredColetasParaBaixa.length > 0 &&
                        selectedColetas.length === filteredColetasParaBaixa.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead className="hidden md:table-cell">Endereço</TableHead>
                  <TableHead className="hidden lg:table-cell">Data Agendada</TableHead>
                  <TableHead className="hidden md:table-cell">Volume</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColetasParaBaixa.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 text-success" />
                        <span>Todas as coletas foram finalizadas</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColetasParaBaixa.map((coleta) => (
                    <TableRow key={coleta.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedColetas.includes(coleta.id)}
                          onCheckedChange={(checked) =>
                            handleSelectColeta(coleta.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{coleta.id}</TableCell>
                      <TableCell className="font-medium">{coleta.doadorNome}</TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                        {coleta.enderecoCompleto.bairro}, {coleta.enderecoCompleto.cidade}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {new Date(coleta.dataAgendada).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {coleta.volume}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={coleta.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Baixas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Histórico de Baixas</CardTitle>
              <CardDescription>Registro de todas as baixas realizadas</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Responsável:</span>
                <Select value={responsavelFilter} onValueChange={setResponsavelFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Carlos Operador">Carlos Operador</SelectItem>
                    <SelectItem value="Ana Operadora">Ana Operadora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead>Data Baixa</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead className="hidden md:table-cell">Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Observação</TableHead>
                  <TableHead className="hidden md:table-cell">Veículo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBaixas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <span>Nenhuma baixa registrada</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBaixas.map((baixa) => (
                    <TableRow key={baixa.id}>
                      <TableCell className="font-mono text-sm">{baixa.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(baixa.dataColetaAgendada).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(baixa.dataBaixa).toLocaleDateString("pt-BR")}{" "}
                        {new Date(baixa.dataBaixa).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{baixa.doadorNome}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{baixa.responsavel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={baixa.statusFinal} />
                      </TableCell>
                      <TableCell className="hidden max-w-[150px] truncate text-muted-foreground lg:table-cell">
                        {baixa.observacao || "-"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {baixa.veiculo}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Baixa em Lote Dialog */}
      <Dialog open={isBaixaDialogOpen} onOpenChange={setIsBaixaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Baixa em Lote</DialogTitle>
            <DialogDescription>
              Você está registrando baixa para {selectedColetas.length} coleta(s)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDarBaixaLote}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input id="responsavel" placeholder="Nome do operador" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-final">Status final</Label>
                <Select defaultValue="Coletada">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coletada">Coletada</SelectItem>
                    <SelectItem value="Não coletada">Não coletada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação (opcional)</Label>
                <Textarea
                  id="observacao"
                  placeholder="Adicione observações sobre as coletas..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBaixaDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="gf-gradient text-white">
                Confirmar baixas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
