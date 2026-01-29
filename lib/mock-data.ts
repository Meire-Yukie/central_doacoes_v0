import type { Doador, Doacao, Coleta, BaixaColeta } from "./types"

export const mockDoadores: Doador[] = [
  {
    id: "DOA001",
    tipo: "PF",
    nome: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    cep: "01310-100",
    endereco: {
      rua: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
    },
    prioridade: "Alta",
    totalDoacoes: 5,
    ultimaDoacao: "2026-01-15",
    status: "Ativo",
    observacoes: "Doadora frequente, sempre disponível no período da manhã.",
    createdAt: "2025-06-10",
  },
  {
    id: "DOA002",
    tipo: "PF",
    nome: "João Pedro Oliveira",
    email: "joao.oliveira@email.com",
    telefone: "(11) 91234-5678",
    cep: "04538-132",
    endereco: {
      rua: "Rua Funchal",
      numero: "500",
      bairro: "Vila Olímpia",
      cidade: "São Paulo",
      uf: "SP",
    },
    prioridade: "Média",
    totalDoacoes: 3,
    ultimaDoacao: "2026-01-10",
    status: "Ativo",
    createdAt: "2025-08-22",
  },
  {
    id: "DOA003",
    tipo: "PJ",
    nome: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    cep: "22041-080",
    endereco: {
      rua: "Rua Visconde de Pirajá",
      numero: "330",
      complemento: "Sala 201",
      bairro: "Ipanema",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    prioridade: "Alta",
    totalDoacoes: 8,
    ultimaDoacao: "2026-01-18",
    status: "Ativo",
    observacoes: "Prefere coletas às sextas-feiras.",
    createdAt: "2025-03-15",
  },
  {
    id: "DOA004",
    tipo: "PF",
    nome: "Carlos Eduardo Mendes",
    email: "carlos.mendes@email.com",
    telefone: "(21) 99876-5432",
    cep: "30130-000",
    endereco: {
      rua: "Praça Sete de Setembro",
      numero: "100",
      bairro: "Centro",
      cidade: "Belo Horizonte",
      uf: "MG",
    },
    prioridade: "Baixa",
    totalDoacoes: 1,
    ultimaDoacao: "2025-12-05",
    status: "Inativo",
    createdAt: "2025-11-20",
  },
  {
    id: "DOA005",
    tipo: "PJ",
    nome: "Instituto Solidário",
    email: "contato@institutosolidario.org",
    telefone: "(11) 95555-1234",
    cep: "01414-001",
    endereco: {
      rua: "Rua Oscar Freire",
      numero: "200",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
    },
    prioridade: "Alta",
    totalDoacoes: 12,
    ultimaDoacao: "2026-01-20",
    status: "Ativo",
    observacoes: "Top doadora! Sempre com itens em ótimo estado.",
    createdAt: "2024-09-01",
  },
]

export const mockDoacoes: Doacao[] = [
  {
    id: "DON001",
    dataCreated: "2026-01-20",
    doadorId: "DOA005",
    doador: {
      nome: "Fernanda Lima Costa",
      email: "fernanda.costa@email.com",
    },
    tipoItem: "Roupas",
    condicaoItem: "Bom",
    modalidade: "Retirada",
    volume: "Médio",
    veiculoSugerido: "Carro",
    status: "Coleta agendada",
    endereco: {
      rua: "Rua Oscar Freire",
      numero: "200",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01414-001",
    },
    itensDeclarados: "15 peças de roupa feminina, 10 peças infantis",
    quantidade: 25,
    agendamento: {
      data: "2026-01-22",
      periodo: "Manhã",
    },
    observacoes: "Interfone 201",
    atendente: "Ana Paula Silva",
  },
  {
    id: "DON002",
    dataCreated: "2026-01-19",
    doadorId: "DOA003",
    doador: {
      nome: "Ana Carolina Ferreira",
      email: "ana.ferreira@email.com",
    },
    tipoItem: "Livros",
    condicaoItem: "Bom",
    modalidade: "Ponto de coleta",
    volume: "Pequeno",
    veiculoSugerido: "Carro",
    status: "Confirmada",
    itensDeclarados: "30 livros infantis e didáticos",
    quantidade: 30,
    atendente: "Carlos Eduardo Santos",
  },
  {
    id: "DON003",
    dataCreated: "2026-01-18",
    doadorId: "DOA001",
    doador: {
      nome: "Maria Silva Santos",
      email: "maria.silva@email.com",
    },
    tipoItem: "Móveis",
    condicaoItem: "Não confirmado",
    modalidade: "Retirada",
    volume: "Muito grande",
    veiculoSugerido: "Van",
    status: "Em validação manual",
    endereco: {
      rua: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-100",
    },
    itensDeclarados: "Sofá 3 lugares, mesa de jantar com 4 cadeiras",
    observacoes: "Moveis pesados, necessario equipe de 2 pessoas",
    atendente: "Mariana Oliveira",
  },
  {
    id: "DON004",
    dataCreated: "2026-01-17",
    doadorId: "DOA002",
    doador: {
      nome: "João Pedro Oliveira",
      email: "joao.oliveira@email.com",
    },
    tipoItem: "Eletrodomésticos",
    condicaoItem: "Precisa triagem",
    modalidade: "Retirada",
    volume: "Grande",
    veiculoSugerido: "Utilitário",
    status: "Coleta agendada",
    endereco: {
      rua: "Rua Funchal",
      numero: "500",
      bairro: "Vila Olímpia",
      cidade: "São Paulo",
      uf: "SP",
      cep: "04538-132",
    },
    itensDeclarados: "Geladeira, micro-ondas, liquidificador",
    agendamento: {
      data: "2026-01-23",
      periodo: "Tarde",
    },
    atendente: "Joao Pedro Costa",
  },
  {
    id: "DON005",
    dataCreated: "2026-01-15",
    doadorId: "DOA001",
    doador: {
      nome: "Maria Silva Santos",
      email: "maria.silva@email.com",
    },
    tipoItem: "Brinquedos",
    condicaoItem: "Bom",
    modalidade: "Retirada",
    volume: "Pequeno",
    veiculoSugerido: "Carro",
    status: "Coletada",
    endereco: {
      rua: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-100",
    },
    itensDeclarados: "20 brinquedos variados, jogos de tabuleiro",
    quantidade: 20,
    agendamento: {
      data: "2026-01-16",
      periodo: "Manha",
    },
    atendente: "Fernanda Lima",
  },
  {
    id: "DON006",
    dataCreated: "2026-01-14",
    doadorId: "DOA004",
    doador: {
      nome: "Carlos Eduardo Mendes",
      email: "carlos.mendes@email.com",
    },
    tipoItem: "Outros",
    condicaoItem: "Bom",
    modalidade: "Ponto de coleta",
    volume: "Pequeno",
    veiculoSugerido: "Carro",
    status: "Cancelada",
    itensDeclarados: "Artigos de cozinha variados",
    observacoes: "Doador cancelou por motivos pessoais",
    atendente: "Ricardo Mendes",
  },
  {
    id: "DON007",
    dataCreated: "2026-01-21",
    doadorId: "DOA005",
    doador: {
      nome: "Fernanda Lima Costa",
      email: "fernanda.costa@email.com",
    },
    tipoItem: "Roupas",
    condicaoItem: "Bom",
    modalidade: "Retirada",
    volume: "Grande",
    veiculoSugerido: "Utilitário",
    status: "Pendente",
    endereco: {
      rua: "Rua Oscar Freire",
      numero: "200",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01414-001",
    },
    itensDeclarados: "50 peças de roupa masculina e feminina",
    quantidade: 50,
    atendente: "Ana Paula Silva",
  },
]

// Funcao auxiliar para gerar coletas em massa
function generateColetas(): Coleta[] {
  const coletas: Coleta[] = []
  const bairros = ["Jardins", "Vila Olimpia", "Bela Vista", "Consolacao", "Pinheiros", "Moema", "Itaim Bibi", "Morumbi", "Perdizes", "Lapa"]
  const nomes = ["Ana Silva", "Bruno Costa", "Carla Mendes", "Diego Oliveira", "Elena Santos", "Felipe Almeida", "Gabriela Lima", "Henrique Souza", "Isabela Ferreira", "Joao Pereira", "Karen Ribeiro", "Lucas Martins", "Marina Rocha", "Nicolas Dias", "Olivia Nascimento", "Pedro Gomes", "Quiteria Carvalho", "Rafael Andrade", "Sofia Barbosa", "Thiago Vieira"]
  const periodos: ("Manha" | "Tarde")[] = ["Manha", "Tarde"]
  const statusList: ("Pendente" | "Em rota" | "Coletada" | "Atrasada")[] = ["Pendente", "Pendente", "Pendente", "Em rota"]
  
  // Datas da semana atual (26 a 01 de fevereiro de 2026)
  const datas = ["2026-01-26", "2026-01-27", "2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31", "2026-02-01"]
  
  let coletaId = 1
  
  datas.forEach((data) => {
    // 20 coletas de Carro por dia
    for (let i = 0; i < 20; i++) {
      const bairro = bairros[Math.floor(Math.random() * bairros.length)]
      const nome = nomes[Math.floor(Math.random() * nomes.length)]
      coletas.push({
        id: `COL${String(coletaId).padStart(3, "0")}`,
        doacaoId: `DON${String(coletaId).padStart(3, "0")}`,
        doadorNome: nome,
        doadorTelefone: `(11) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        endereco: `Rua ${bairro}, ${Math.floor(Math.random() * 1000 + 100)} - ${bairro}, Sao Paulo/SP`,
        enderecoCompleto: {
          rua: `Rua ${bairro}`,
          numero: String(Math.floor(Math.random() * 1000 + 100)),
          bairro: bairro,
          cidade: "Sao Paulo",
          uf: "SP",
          cep: `0${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 900 + 100)}`,
        },
        volume: "Pequeno",
        veiculo: "Carro",
        dataAgendada: data,
        periodo: periodos[Math.floor(Math.random() * periodos.length)],
        status: statusList[Math.floor(Math.random() * statusList.length)],
        ordemRota: i + 1,
        itens: "Roupas e acessorios diversos",
      })
      coletaId++
    }
    
    // 26 coletas de Caminhao (Van/Utilitario) por dia
    for (let i = 0; i < 26; i++) {
      const bairro = bairros[Math.floor(Math.random() * bairros.length)]
      const nome = nomes[Math.floor(Math.random() * nomes.length)]
      const veiculo = Math.random() > 0.5 ? "Van" : "Utilitario"
      coletas.push({
        id: `COL${String(coletaId).padStart(3, "0")}`,
        doacaoId: `DON${String(coletaId).padStart(3, "0")}`,
        doadorNome: nome,
        doadorTelefone: `(11) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        endereco: `Avenida ${bairro}, ${Math.floor(Math.random() * 1000 + 100)} - ${bairro}, Sao Paulo/SP`,
        enderecoCompleto: {
          rua: `Avenida ${bairro}`,
          numero: String(Math.floor(Math.random() * 1000 + 100)),
          bairro: bairro,
          cidade: "Sao Paulo",
          uf: "SP",
          cep: `0${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 900 + 100)}`,
        },
        volume: "Grande",
        veiculo: veiculo,
        dataAgendada: data,
        periodo: periodos[Math.floor(Math.random() * periodos.length)],
        status: statusList[Math.floor(Math.random() * statusList.length)],
        ordemRota: i + 21,
        itens: "Moveis e eletrodomesticos",
      })
      coletaId++
    }
  })
  
  return coletas
}

export const mockColetas: Coleta[] = generateColetas()

export const mockBaixas: BaixaColeta[] = [
  {
    id: "BAI001",
    coletaId: "COL003",
    doacaoId: "DON005",
    doadorNome: "Maria Silva Santos",
    dataColetaAgendada: "2026-01-16",
    dataBaixa: "2026-01-16T10:30:00",
    responsavel: "Carlos Operador",
    statusFinal: "Coletada",
    observacao: "Coleta realizada sem problemas",
    veiculo: "Carro",
  },
  {
    id: "BAI002",
    coletaId: "COL010",
    doacaoId: "DON010",
    doadorNome: "Lucas Martins",
    dataColetaAgendada: "2026-01-15",
    dataBaixa: "2026-01-15T15:45:00",
    responsavel: "Ana Operadora",
    statusFinal: "Coletada",
    veiculo: "Utilitário",
  },
  {
    id: "BAI003",
    coletaId: "COL011",
    doacaoId: "DON011",
    doadorNome: "Juliana Campos",
    dataColetaAgendada: "2026-01-14",
    dataBaixa: "2026-01-14T11:20:00",
    responsavel: "Carlos Operador",
    statusFinal: "Não coletada",
    observacao: "Endereço não localizado, doador não atendeu ligações",
    veiculo: "Carro",
  },
]

// KPI data
export const mockKPIs = {
  totalDoacoesMes: 47,
  coletasHoje: 3,
  coletasAtrasadas: 1,
  coletasPendentes: 5,
  totalDoadores: 156,
  doadoresAtivos: 142,
}
