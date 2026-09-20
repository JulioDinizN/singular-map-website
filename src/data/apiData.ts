/**
 * Rotas Acessíveis · Respostas Hard-Coded da API (ORDS rotas.v1)
 * 
 * Todos os dados e respostas da API disponibilizados de forma estática
 * para importação direta no front-end React, sem necessidade de servidor HTTP.
 */

import type { AccessibilityProfileId } from './eventData';

// 1. GET /eventos
export const API_EVENTOS = [
  {
    codigo: 'NEXT26',
    nome: 'FIAP NEXT 2026',
    descricao: 'Festival de Inovação, Tecnologia e Empreendedorismo FIAP',
    local: 'Pavilhão Principal (São Paulo Expo)',
    largura_px: 1200,
    altura_px: 800,
    escala_m_px: 0.1,
    largura_corredor_m: 4.0,
    origem_padrao: 'entrance-main',
    total_areas: 18,
    total_pontos: 35,
    total_trechos: 42,
    total_programacao: 10,
    evacuacao_ativa: false,
  },
  {
    codigo: 'EXPO26',
    nome: 'Expo Inclusão 2026',
    descricao: 'Feira Internacional de Tecnologias Assistivas, Mobilidade e Inclusão',
    local: 'Pavilhão Expo',
    largura_px: 1000,
    altura_px: 700,
    escala_m_px: 0.12,
    largura_corredor_m: 4.5,
    origem_padrao: 'entrance-main',
    total_areas: 11,
    total_pontos: 27,
    total_trechos: 34,
    total_programacao: 0,
    evacuacao_ativa: false,
  },
] as const;

// 2. GET /eventos/NEXT26/comparar?origem=poi_oracle&destino=poi_quiet_room
export const API_COMPARACAO_EXEMPLO = {
  origem: 'Stand Oracle Autonomous 26ai',
  origemId: 'booth-oracle',
  destino: 'Sala de Acolhimento Sensorial',
  destinoId: 'poi-quiet-room',
  comparacoes: [
    {
      perfil: 'PADRAO' as AccessibilityProfileId,
      nome: 'Perfil Padrão',
      distancia_m: 84.0,
      tempo_min: 1.2,
      custo_ponderado: 92.4,
      multidao_m: 18.0,
      ruido_max: 4,
      evita_escada: false,
      caminho: ['booth-oracle', 'wp_corredor_400', 'wp_stairs_f1', 'poi_quiet_room'],
      diferencial: 'Rota mais curta e direta, utilizando escadaria convencional.',
    },
    {
      perfil: 'CADEIRANTE' as AccessibilityProfileId,
      nome: 'Pessoa em Cadeira de Rodas',
      distancia_m: 152.0,
      tempo_min: 2.8,
      custo_ponderado: 214.6,
      multidao_m: 0.0,
      ruido_max: 2,
      evita_escada: true,
      caminho: ['booth-oracle', 'wp_corredor_400', 'wp_lobby_center', 'wp_elevator_f1', 'poi_quiet_room'],
      diferencial: '100% livre de degraus. Desvia de multidões e utiliza elevador acessível (+68m).',
    },
    {
      perfil: 'MOBILIDADE' as AccessibilityProfileId,
      nome: 'Mobilidade Reduzida',
      distancia_m: 84.0,
      tempo_min: 1.7,
      custo_ponderado: 105.0,
      multidao_m: 0.0,
      ruido_max: 3,
      evita_escada: true,
      caminho: ['booth-oracle', 'wp_corredor_400', 'wp_elevator_f1', 'poi_quiet_room'],
      diferencial: 'Sem escadas, minimizando esforço físico e distância viável.',
    },
    {
      perfil: 'NEURODIVERGENTE' as AccessibilityProfileId,
      nome: 'Neurodivergente & Sensorial',
      distancia_m: 112.0,
      tempo_min: 1.7,
      custo_ponderado: 168.0,
      multidao_m: 0.0,
      ruido_max: 2,
      evita_escada: false,
      caminho: ['booth-oracle', 'wp_corredor_400', 'wp_ramp_1', 'poi_quiet_room'],
      diferencial: 'Desvia ativamente de ruído alto (nível >= 3) e aglomerações, priorizando corredor tranquilo e rampa suave.',
    },
  ],
};

// 3. GET /eventos/NEXT26/saida?perfil=CADEIRANTE&origem=arena-keynote
export const API_SAIDAS_EMERGENCIA = {
  saida_sugerida: {
    ponto_id: 'saida-oeste-meio',
    nome: 'Saída de Emergência Oeste (Central)',
    distancia_m: 35.0,
    tempo_estimado_min: 0.6,
    acessivel_cadeirante: true,
    tem_rampa: true,
    caminho: ['arena-keynote', 'wp_corredor_100', 'saida-oeste-meio'],
    instrucoes: [
      { passo: 1, texto: 'Siga em direção à lateral esquerda (Rua 100).', distancia_m: 20.0 },
      { passo: 2, texto: 'Acesse a Saída de Emergência Oeste com rampa de declive suave e barra antipânico.', distancia_m: 15.0 },
    ],
  },
  alternativas: [
    {
      ponto_id: 'saida-sul',
      nome: 'Saída de Emergência Sul (Lobby)',
      distancia_m: 48.0,
      acessivel_cadeirante: true,
      bloqueada: false,
    },
    {
      ponto_id: 'saida-leste-meio',
      nome: 'Saída de Emergência Leste (Praça de Alimentação)',
      distancia_m: 54.0,
      acessivel_cadeirante: true,
      bloqueada: false,
    },
  ],
  saidas_indisponiveis: [
    {
      ponto_id: 'saida-norte',
      nome: 'Saída Norte (Avenida dos Palcos)',
      motivo: 'Apenas escada metálica de emergência sem rampa NBR 9050.',
    },
  ],
};

// 4. POST /eventos/NEXT26/conversa (Base de Conhecimento e Respostas do Chat)
export interface FaqItem {
  id: number;
  keywords: string[];
  intencao: string;
  resposta: string;
  acao?: {
    tipo: 'TRACAR_ROTA' | 'SAIDA';
    destino?: string;
    automatica: boolean;
  };
  sugestoes: string[];
}

export const API_CONVERSA_FAQS: FaqItem[] = [
  {
    id: 101,
    keywords: ['acolhimento', 'sensorial', 'silencio', 'calmo', 'barulho', 'crise', 'autism', 'abafador', 'descans', 'sobrecarga'],
    intencao: 'LOCALIZAR_ACOLHIMENTO',
    resposta: 'A Sala de Acolhimento Sensorial fica no Pavilhão Principal (Rua Sul, próximo ao Stand da Oracle e Banheiro Adaptado). É um ambiente com isolamento acústico, iluminação suave, fones abafadores e suporte especializado.',
    acao: {
      tipo: 'TRACAR_ROTA',
      destino: 'poi-quiet-room',
      automatica: false,
    },
    sugestoes: [
      'Como chego lá sem escadas?',
      'Onde retiro fones abafadores de som?',
      'Tem água e local para sentar?',
    ],
  },
  {
    id: 102,
    keywords: ['saida', 'emergencia', 'fogo', 'incendio', 'evacua', 'socorro', 'perigo', 'alarme', 'fugir'],
    intencao: 'EVACUACAO_EMERGENCIA',
    resposta: '🚨 Modo de Emergência: Por favor, mantenha a calma e dirija-se à saída de emergência indicada pelas luzes verdes no mapa.',
    acao: {
      tipo: 'SAIDA',
      automatica: true,
    },
    sugestoes: [
      'Qual a saída com rampa mais próxima?',
      'Onde está a brigada de incêndio?',
    ],
  },
  {
    id: 103,
    keywords: ['banheiro', 'sanitario', 'toalete', 'wc', 'pcd', 'adaptado'],
    intencao: 'LOCALIZAR_BANHEIRO_PCD',
    resposta: 'Os sanitários acessíveis NBR 9050 estão disponíveis no Pavilhão Principal (Rua Sul / Av. B, ao lado da Sala de Acolhimento).',
    acao: {
      tipo: 'TRACAR_ROTA',
      destino: 'lobby-reception',
      automatica: false,
    },
    sugestoes: [
      'Traçar rota até o sanitário mais próximo',
      'Possui trocador adulto?',
    ],
  },
  {
    id: 104,
    keywords: ['oracle', 'autonomous', 'banco', '26ai', 'vector', 'embedding'],
    intencao: 'LOCALIZAR_STAND_ORACLE',
    resposta: 'O Stand da Oracle Autonomous 26ai fica na Alameda 400 (Dados & IA), com demonstrações práticas de AI Vector Search in-database.',
    acao: {
      tipo: 'TRACAR_ROTA',
      destino: 'booth-oracle',
      automatica: false,
    },
    sugestoes: [
      'Quais palestras a Oracle vai apresentar?',
      'Traçar caminho livre de multidão',
    ],
  },
  {
    id: 105,
    keywords: ['palco', 'keynote', 'abertura', 'arena', 'palestra', 'principal'],
    intencao: 'LOCALIZAR_PALCO_PRINCIPAL',
    resposta: 'A Arena Principal de Keynotes fica ao Norte do pavilhão, com tradução simultânea em Libras e legendagem em tempo real.',
    acao: {
      tipo: 'TRACAR_ROTA',
      destino: 'arena-keynote',
      automatica: false,
    },
    sugestoes: [
      'Qual a programação ao vivo agora?',
      'Onde sentam os participantes em cadeira de rodas?',
    ],
  },
  {
    id: 106,
    keywords: ['libras', 'interprete', 'surdo', 'lingua de sinais', 'acessibilidade'],
    intencao: 'SOLICITAR_LIBRAS',
    resposta: 'O balcão de Credenciamento & Central de Acessibilidade no Lobby conta com equipe presencial de intérpretes de Libras para acompanhamento.',
    sugestoes: [
      'Como chegar ao balcão de acessibilidade?',
      'As palestras têm tradução em Libras?',
    ],
  },
  {
    id: 107,
    keywords: ['fome', 'comida', 'almoco', 'lanche', 'cafe', 'alimentacao', 'food'],
    intencao: 'LOCALIZAR_ALIMENTACAO',
    resposta: 'A Praça Gastronômica & Cafeteria Brasil fica na lateral Leste, com opções sem glúten, veganas e mesas com altura regulável.',
    acao: {
      tipo: 'TRACAR_ROTA',
      destino: 'food-court',
      automatica: false,
    },
    sugestoes: [
      'Traçar rota até o food court',
      'Quais são os horários de funcionamento?',
    ],
  },
];

// 5. GET /eventos/NEXT26/painel (Métricas e Telemetria do Painel do Organizador)
export const API_PAINEL_ORGANIZADOR = {
  kpis: {
    total_rotas_calculadas: 1420,
    participantes_ativos: 380,
    reportes_ativos: 3,
    taxa_adesao_rotas_sugeridas: '89%',
    rotas_por_perfil: {
      PADRAO: 520,
      CADEIRANTE: 290,
      MOBILIDADE: 310,
      NEURODIVERGENTE: 300,
    },
  },
  corredores_criticos: [
    {
      trecho: 'Rua 200 • Robótica (em frente ao iFood)',
      lotacao: 4,
      ruido: 4,
      motivo: 'Demonstração dos robôs autônomos de entrega atraindo grande público.',
    },
    {
      trecho: 'Boulevard Central (saída da Arena Keynote)',
      lotacao: 5,
      ruido: 5,
      motivo: 'Encerramento de palestra magna com fluxo intenso de participantes.',
    },
  ],
  ultimos_reportes: [
    {
      id: 1084,
      local: 'Escadaria Central (Piso 1)',
      tipo: 'BLOQUEIO',
      hora: '14:48',
      status: 'ATIVO',
      descricao: 'Degrau interditado temporariamente para passagem de cabos.',
    },
    {
      id: 1083,
      local: 'Arena Principal Keynote',
      tipo: 'BARULHO',
      hora: '14:32',
      status: 'ATIVO',
      descricao: 'Nível de decibéis acima de 85dB na área frontal do palco.',
    },
    {
      id: 1082,
      local: 'Alameda 300 • Logística',
      tipo: 'CHEIO',
      hora: '14:15',
      status: 'ATIVO',
      descricao: 'Corredor engarrafado durante troca de workshops.',
    },
  ],
  curadoria_ia: {
    frases_nao_compreendidas: [
      {
        id: 401,
        texto: 'onde consigo tomada para recarregar a bateria da minha scooter eletrica?',
        sugestao_rotulo: 'FAQ_PONTO_ENERGIA',
      },
      {
        id: 402,
        texto: 'tem como ir por fora pra fugir do barulho do ar condicionado?',
        sugestao_rotulo: 'ROTA_EXTERNA',
      },
    ],
  },
};

// 6. GET /eventos/NEXT26/tarefas (Protocolo de Validação com Usuários)
export const API_TAREFAS_VALIDACAO = [
  {
    id: 1,
    codigo: 'T1_ROTA_SEM_ESCADA',
    titulo: 'Traçar rota da Entrada até a Sala de Acolhimento sem usar escadas',
    tempo_alvo_seg: 120,
    perfil_recomendado: 'CADEIRANTE',
  },
  {
    id: 2,
    codigo: 'T2_EVITAR_BARULHO',
    titulo: 'Chegar ao Stand TOTVS desviando da aglomeração e do som do Palco Principal',
    tempo_alvo_seg: 90,
    perfil_recomendado: 'NEURODIVERGENTE',
  },
  {
    id: 3,
    codigo: 'T3_ENCONTRAR_SAIDA',
    titulo: 'Localizar a saída de emergência acessível mais próxima a partir da Arena Keynote',
    tempo_alvo_seg: 60,
    perfil_recomendado: 'MOBILIDADE',
  },
];
