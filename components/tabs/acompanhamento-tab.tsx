"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { KPICards } from "@/components/kpi-cards"
import { StatusBadge } from "@/components/status-badge"
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
  Clock,
  User,
  Phone,
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

  // Filter coletas for today (mock - using the dates from mock data)
  const today = "2026-01-22" // Mock today
  const romaneioColetas = mockColetas.filter(
    (c) => c.dataAgendada === today && c.status !== "Coletada"
  )
  const pendentesColetas = mockColetas.filter((c) => c.status === "Pendente")
  const atrasadasColetas = mockColetas.filter((c) => c.status === "Atrasada")

  const filteredRomaneio = romaneioColetas.filter((coleta) => {
    const query = searchQuery.toLowerCase()
    return (
      coleta.doadorNome.toLowerCase().includes(query) ||
      coleta.endereco.toLowerCase().includes(query) ||
      coleta.id.toLowerCase().includes(query)
    )
  })

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
            Operação do dia: acompanhe o status das coletas
          </p>
        </div>
      </div>

      <KPICards variant="acompanhamento" />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Romaneio do Dia */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Romaneio do Dia</CardTitle>
                <CardDescription>Coletas agendadas para hoje</CardDescription>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {filteredRomaneio.length} coletas
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRomaneio.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <Package className="h-8 w-8" />
                <span>Nenhuma coleta pendente hoje</span>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRomaneio.map((coleta) => (
                  <div
                    key={coleta.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {coleta.ordemRota && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                              {coleta.ordemRota}
                            </span>
                          )}
                          <span className="truncate font-medium">{coleta.doadorNome}</span>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {coleta.enderecoCompleto.bairro}, {coleta.enderecoCompleto.cidade}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {coleta.volume} / {coleta.veiculo}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {coleta.periodo}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={coleta.status} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewDetails(coleta)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gf-gradient text-white"
                        onClick={() => handleDarBaixa(coleta)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Dar baixa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coletas Pendentes */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Coletas Pendentes</CardTitle>
                <CardDescription>Todas as coletas aguardando</CardDescription>
              </div>
              <span className="rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium text-warning-foreground">
                {pendentesColetas.length} pendentes
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {pendentesColetas.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <Clock className="h-8 w-8" />
                <span>Nenhuma coleta pendente</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendentesColetas.map((coleta) => (
                  <div
                    key={coleta.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{coleta.doadorNome}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(coleta.dataAgendada).toLocaleDateString("pt-BR")} -{" "}
                          {coleta.periodo}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {coleta.enderecoCompleto.bairro}, {coleta.enderecoCompleto.cidade}
                        </p>
                        <span className="mt-1 inline-block text-xs text-muted-foreground">
                          {coleta.volume}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewDetails(coleta)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gf-gradient text-white"
                        onClick={() => handleDarBaixa(coleta)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Dar baixa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coletas Atrasadas */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Coletas Atrasadas</CardTitle>
                <CardDescription>Coletas que precisam de atenção</CardDescription>
              </div>
              <span className="rounded-full bg-destructive/20 px-2.5 py-1 text-xs font-medium text-destructive">
                {atrasadasColetas.length} atrasadas
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {atrasadasColetas.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 text-success" />
                <span>Nenhuma coleta atrasada</span>
              </div>
            ) : (
              <div className="space-y-3">
                {atrasadasColetas.map((coleta) => (
                  <div
                    key={coleta.id}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="truncate font-medium">{coleta.doadorNome}</span>
                        </div>
                        <p className="mt-1 text-sm text-destructive">
                          {coleta.diasAtrasado} dia(s) de atraso
                        </p>
                        {coleta.motivoAtraso && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Motivo: {coleta.motivoAtraso}
                          </p>
                        )}
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {coleta.enderecoCompleto.bairro}, {coleta.enderecoCompleto.cidade}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleReschedule(coleta)}
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        Reagendar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gf-gradient text-white"
                        onClick={() => handleDarBaixa(coleta)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Dar baixa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-xl">Coleta {selectedColeta?.id}</SheetTitle>
            <SheetDescription>Detalhes da coleta</SheetDescription>
          </SheetHeader>

          {selectedColeta && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedColeta.status} />
                {selectedColeta.ordemRota && (
                  <span className="text-sm text-muted-foreground">
                    Ordem na rota: {selectedColeta.ordemRota}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Doador</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedColeta.doadorNome}</span>
                  </div>
                  {selectedColeta.doadorTelefone && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{selectedColeta.doadorTelefone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Endereço</h3>
                <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p>
                      {selectedColeta.enderecoCompleto.rua},{" "}
                      {selectedColeta.enderecoCompleto.numero}
                      {selectedColeta.enderecoCompleto.complemento &&
                        `, ${selectedColeta.enderecoCompleto.complemento}`}
                    </p>
                    <p>
                      {selectedColeta.enderecoCompleto.bairro} -{" "}
                      {selectedColeta.enderecoCompleto.cidade}/
                      {selectedColeta.enderecoCompleto.uf}
                    </p>
                    <p>CEP: {selectedColeta.enderecoCompleto.cep}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Itens e Volume</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-sm">{selectedColeta.itens}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      {selectedColeta.volume}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      <Truck className="mr-1 inline-block h-3 w-3" />
                      {selectedColeta.veiculo}
                    </span>
                  </div>
                </div>
              </div>

              {selectedColeta.observacoes && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Observações</h3>
                  <p className="text-sm text-muted-foreground">{selectedColeta.observacoes}</p>
                </div>
              )}

              <Button
                onClick={() => {
                  handleDarBaixa(selectedColeta)
                  setIsDetailsOpen(false)
                }}
                className="w-full gf-gradient text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Dar baixa
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
                <Label htmlFor="new-period">Período</Label>
                <select
                  id="new-period"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do reagendamento</Label>
                <Input id="reason" placeholder="Ex: Doador não estava em casa" />
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
