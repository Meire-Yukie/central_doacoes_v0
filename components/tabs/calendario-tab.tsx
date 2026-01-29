"use client"

import { useState, useMemo } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"
import { mockColetas } from "@/lib/mock-data"
import type { Coleta } from "@/lib/types"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Package,
  Truck,
  Clock,
  User,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface CalendarioTabProps {
  searchQuery: string
}

function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = []
  const dayOfWeek = baseDate.getDay()
  const startOfWeek = new Date(baseDate)
  startOfWeek.setDate(baseDate.getDate() - dayOfWeek)

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    dates.push(date)
  }

  return dates
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0]
}

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function CalendarioTab({ searchQuery }: CalendarioTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedColeta, setSelectedColeta] = useState<Coleta | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [tipoColetaFilter, setTipoColetaFilter] = useState<string>("todos")
  const [consultaCep, setConsultaCep] = useState("")
  const [consultaTipoColeta, setConsultaTipoColeta] = useState("")
  const [consultaDataColeta, setConsultaDataColeta] = useState("")
  const { toast } = useToast()

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

  const filteredColetas = mockColetas.filter((coleta) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      coleta.doadorNome.toLowerCase().includes(query) ||
      coleta.endereco.toLowerCase().includes(query) ||
      coleta.id.toLowerCase().includes(query)

    // Mapeia o veiculo para o tipo de coleta
    const tipoColeta = coleta.veiculo === "Van" || coleta.veiculo === "Utilitario" 
      ? "Caminhao - Retirada no endereco" 
      : coleta.veiculo === "Carro" 
        ? "Carro - Retirada no endereco" 
        : "Ponto de Coleta"
    
    const matchesTipoColeta = tipoColetaFilter === "todos" || tipoColeta === tipoColetaFilter

    return matchesSearch && matchesTipoColeta
  })

  const coletasByDate = useMemo(() => {
    const map: Record<string, Coleta[]> = {}
    for (const coleta of filteredColetas) {
      const dateKey = coleta.dataAgendada
      if (!map[dateKey]) {
        map[dateKey] = []
      }
      map[dateKey].push(coleta)
    }
    return map
  }, [filteredColetas])

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleColetaClick = (coleta: Coleta) => {
    setSelectedColeta(coleta)
    setIsDetailsOpen(true)
  }

  const handleMarkAsCollected = () => {
    setIsDetailsOpen(false)
    toast({
      title: "Coleta finalizada",
      description: `A coleta ${selectedColeta?.id} foi marcada como coletada.`,
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDateKey(date) === formatDateKey(today)
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendario Semanal de Coletas</h1>
          <p className="text-sm text-muted-foreground">
            Visualize todas as coletas agendadas por semana
          </p>
        </div>
      </div>

      {/* Consulta Calendarizacao */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Consulta Calendarizacao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consulta-cep">CEP</Label>
              <Input 
                id="consulta-cep" 
                placeholder="00000-000" 
                value={consultaCep}
                onChange={(e) => setConsultaCep(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consulta-tipo-coleta">Tipo de Coleta</Label>
              <Select value={consultaTipoColeta} onValueChange={setConsultaTipoColeta}>
                <SelectTrigger id="consulta-tipo-coleta" className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Caminhao - Retirada no endereco">Caminhao - Retirada no endereco</SelectItem>
                  <SelectItem value="Carro - Retirada no endereco">Carro - Retirada no endereco</SelectItem>
                  <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consulta-data-coleta">Data de Coleta</Label>
              <Input 
                id="consulta-data-coleta" 
                type="date" 
                value={consultaDataColeta}
                onChange={(e) => setConsultaDataColeta(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Tipo de coleta:</span>
            <Select value={tipoColetaFilter} onValueChange={setTipoColetaFilter}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Caminhao - Retirada no endereco">Caminhao - Retirada no endereco</SelectItem>
                <SelectItem value="Carro - Retirada no endereco">Carro - Retirada no endereco</SelectItem>
                <SelectItem value="Ponto de Coleta">Ponto de Coleta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Week Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Semana de{" "}
              {weekDates[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} a{" "}
              {weekDates[6].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dateKey = formatDateKey(date)
              const dayColetas = coletasByDate[dateKey] || []
              const today = isToday(date)

              return (
                <div
                  key={dateKey}
                  className={`min-h-[200px] rounded-lg border p-2 ${
                    today ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="mb-2 text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {dayNames[index]}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        today ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {date.getDate()}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {dayColetas.map((coleta) => {
                      // Determina o tipo de coleta baseado no veiculo
                      const tipoColeta = coleta.veiculo === "Van" || coleta.veiculo === "Utilitario" 
                        ? "Caminhao" 
                        : coleta.veiculo === "Carro" 
                          ? "Carro" 
                          : "Ponto de Coleta"
                      
                      // Filtra sabado (2026-01-31) para mostrar apenas Ponto de Coleta
                      const isSabado = coleta.dataAgendada === "2026-01-31"
                      if (isSabado && tipoColeta !== "Ponto de Coleta") {
                        return null
                      }
                      
                      return (
                        <button
                          key={coleta.id}
                          onClick={() => handleColetaClick(coleta)}
                          className={`w-full rounded-md border p-2 text-left text-xs transition-colors hover:bg-muted/50 ${
                            coleta.status === "Atrasada"
                              ? "border-destructive/30 bg-destructive/5"
                              : coleta.status === "Coletada"
                                ? "border-success/30 bg-success/5"
                                : "border-border bg-card"
                          }`}
                        >
                          <p className="truncate">
                            <span className="text-muted-foreground">ID: </span>
                            <span className="font-medium text-primary">{coleta.id}</span>
                          </p>
                          <p className="mt-1 truncate">
                            <span className="text-muted-foreground">Tipo: </span>
                            <span className="font-medium">{tipoColeta}</span>
                          </p>
                        </button>
                      )
                    })}

                    {dayColetas.length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">
                        Sem coletas
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Coleta Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-xl">Coleta {selectedColeta?.id}</SheetTitle>
            <SheetDescription>Detalhes da coleta agendada</SheetDescription>
          </SheetHeader>

          {selectedColeta && (
            <div className="mt-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedColeta.status} />
                {selectedColeta.status === "Atrasada" && selectedColeta.diasAtrasado && (
                  <span className="text-sm text-destructive">
                    {selectedColeta.diasAtrasado} dia(s) de atraso
                  </span>
                )}
              </div>

              {/* Donor Info */}
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

              {/* Address */}
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

              {/* Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Itens</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedColeta.itens}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      Volume: {selectedColeta.volume}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                      <Truck className="mr-1 inline-block h-3 w-3" />
                      {selectedColeta.veiculo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Agendamento</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedColeta.dataAgendada).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      - {selectedColeta.periodo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedColeta.observacoes && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Observações</h3>
                  <p className="text-sm text-muted-foreground">{selectedColeta.observacoes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedColeta.status !== "Coletada" && (
                <Button
                  onClick={handleMarkAsCollected}
                  className="w-full gf-gradient text-white"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como coletada (dar baixa)
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
