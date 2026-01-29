export interface Doador {
  id: string
  tipo: "PF" | "PJ"
  nome: string
  email: string
  telefone?: string
  cep: string
  endereco: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
  }
  prioridade: "Alta" | "Média" | "Baixa"
  totalDoacoes: number
  ultimaDoacao?: string
  status: "Ativo" | "Inativo"
  observacoes?: string
  createdAt: string
}

export interface Doacao {
  id: string
  dataCreated: string
  doadorId: string
  doador: {
    nome: string
    email: string
  }
  tipoItem: "Roupas" | "Livros" | "Eletrodomésticos" | "Móveis" | "Brinquedos" | "Outros"
  condicaoItem: "Bom" | "Não confirmado" | "Precisa triagem"
  modalidade: "Retirada" | "Ponto de coleta"
  volume: "Pequeno" | "Médio" | "Grande" | "Muito grande"
  veiculoSugerido: "Carro" | "Utilitário" | "Van"
  status: "Pendente" | "Em validação manual" | "Confirmada" | "Coleta agendada" | "Coletada" | "Cancelada"
  endereco?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  itensDeclarados: string
  quantidade?: number
  agendamento?: {
    data: string
    periodo: "Manhã" | "Tarde"
  }
  observacoes?: string
  atendente?: string
}

export interface Coleta {
  id: string
  doacaoId: string
  doadorNome: string
  doadorTelefone?: string
  endereco: string
  enderecoCompleto: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  volume: "Pequeno" | "Médio" | "Grande" | "Muito grande"
  veiculo: "Carro" | "Utilitário" | "Van"
  dataAgendada: string
  periodo: "Manhã" | "Tarde"
  status: "Pendente" | "Em rota" | "Coletada" | "Atrasada" | "Cancelada"
  ordemRota?: number
  itens: string
  observacoes?: string
  diasAtrasado?: number
  motivoAtraso?: string
}

export interface BaixaColeta {
  id: string
  coletaId: string
  doacaoId: string
  doadorNome: string
  dataColetaAgendada: string
  dataBaixa: string
  responsavel: string
  statusFinal: "Coletada" | "Não coletada" | "Cancelada"
  observacao?: string
  veiculo: string
}
