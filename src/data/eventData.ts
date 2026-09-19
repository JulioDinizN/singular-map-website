export type PoiCategory = 'stage' | 'booth' | 'workshop' | 'food' | 'restroom' | 'info' | 'entrance' | 'quiet_room' | 'exit';

export type SponsorTier = 'diamond' | 'gold' | 'silver' | 'startup' | 'facility';

export type AccessibilityProfileId = 'PADRAO' | 'CADEIRANTE' | 'MOBILIDADE' | 'NEURODIVERGENTE';

export interface AccessibilityProfile {
  id: AccessibilityProfileId;
  name: string;
  shortName: string;
  description: string;
  evitaEscada: boolean;
  pesoRuido: number;
  pesoLotacao: number;
  limiteLotacao: number | null;
  limiteRuido: number | null;
  fatorExcesso: number;
  velocidadeMetersPerMin: number;
  color: string;
  accentColor: string;
}

export const ACCESSIBILITY_PROFILES: Record<AccessibilityProfileId, AccessibilityProfile> = {
  PADRAO: {
    id: 'PADRAO',
    name: 'Perfil Padrão',
    shortName: 'Padrão',
    description: 'Rota mais rápida e direta. Utiliza escadas e passagens convencionais.',
    evitaEscada: false,
    pesoRuido: 1,
    pesoLotacao: 1,
    limiteLotacao: null,
    limiteRuido: null,
    fatorExcesso: 2,
    velocidadeMetersPerMin: 72,
    color: '#38bdf8',
    accentColor: '#0284c7',
  },
  CADEIRANTE: {
    id: 'CADEIRANTE',
    name: 'Pessoa em Cadeira de Rodas',
    shortName: 'Cadeirante',
    description: '100% livre de degraus. Prioriza rampas, elevadores e corredores amplos livres de multidões.',
    evitaEscada: true,
    pesoRuido: 1,
    pesoLotacao: 4,
    limiteLotacao: 3,
    limiteRuido: null,
    fatorExcesso: 4,
    velocidadeMetersPerMin: 55,
    color: '#3b82f6',
    accentColor: '#1d4ed8',
  },
  MOBILIDADE: {
    id: 'MOBILIDADE',
    name: 'Mobilidade Reduzida',
    shortName: 'Mobilidade',
    description: 'Para quem usa bengala, muletas ou idosos. Sem degraus, priorizando o trajeto mais curto viável.',
    evitaEscada: true,
    pesoRuido: 1,
    pesoLotacao: 3,
    limiteLotacao: 3,
    limiteRuido: null,
    fatorExcesso: 3,
    velocidadeMetersPerMin: 50,
    color: '#10b981',
    accentColor: '#059669',
  },
  NEURODIVERGENTE: {
    id: 'NEURODIVERGENTE',
    name: 'Neurodivergente & Sensorial',
    shortName: 'Neurodivergente',
    description: 'Para pessoas no espectro autista ou com sobrecarga sensorial. Desvia de som alto e aglomerações.',
    evitaEscada: false,
    pesoRuido: 6,
    pesoLotacao: 5,
    limiteLotacao: 3,
    limiteRuido: 3,
    fatorExcesso: 4,
    velocidadeMetersPerMin: 65,
    color: '#a855f7',
    accentColor: '#7e22ce',
  },
};

export interface EventSession {
  id: string;
  title: string;
  speaker: string;
  time: string;
  isLiveNow?: boolean;
}

export interface POI {
  id: string;
  name: string;
  shortName?: string;
  category: PoiCategory;
  floor: 1 | 2;
  position: [number, number, number]; // [x, y, z]
  dimensions: [number, number, number]; // [width, height, depth]
  color: string;
  accentColor?: string;
  tier?: SponsorTier;
  zone: string;
  description: string;
  sessions?: EventSession[];
  boothNumber?: string;
  isAccessible?: boolean;
  isQuietZone?: boolean;
  isEmergencyExit?: boolean;
}

export interface WaypointNode {
  id: string;
  x: number;
  z: number;
  floor: 1 | 2;
  name?: string;
  isStairs?: boolean;
  isElevator?: boolean;
  isRamp?: boolean;
  isEmergencyExit?: boolean;
}

export interface WaypointEdge {
  from: string;
  to: string;
  ruido?: number; // 1 to 5
  lotacao?: number; // 1 to 5
  temEscada?: boolean;
  isElevador?: boolean;
  isRampa?: boolean;
  bloqueado?: boolean;
}

export const VENUE_FLOORS = [
  { id: 1, name: 'Piso 1 - Pavilhão Principal & Palcos', shortName: '1F' },
  { id: 2, name: 'Piso 2 - Mezanino de Workshops & VIP', shortName: '2F' },
] as const;

export const VENUE_ZONES = [
  { id: 'main-stage', name: 'Arena Principal Keynote (Palco Brasil)', color: '#8b5cf6', floor: 1 },
  { id: 'tech-stage', name: 'Palco DevBrasil & Engenharia', color: '#2563eb', floor: 1 },
  { id: 'ai-zone', name: 'Pavilhão de IA & Inovação', color: '#3b82f6', floor: 1 },
  { id: 'fintech-zone', name: 'Fintech & Open Finance Brasil', color: '#10b981', floor: 1 },
  { id: 'cloud-zone', name: 'Cloud, Dados & Infraestrutura', color: '#06b6d4', floor: 1 },
  { id: 'startup-alley', name: 'Alameda de Startups Brasil', color: '#f59e0b', floor: 1 },
  { id: 'food-court', name: 'Praça Gastronômica Brasil & Cafeteria', color: '#ea580c', floor: 1 },
  { id: 'quiet-zone', name: 'Sala de Acolhimento & Neurodiversidade (Espaço Girassol)', color: '#0d9488', floor: 1 },
  { id: 'workshops', name: 'Salas de Workshop & Imersão', color: '#6366f1', floor: 2 },
  { id: 'vip-lounge', name: 'Lounge VIP & Conexões Empresariais', color: '#ca8a04', floor: 2 },
];

export const POI_LIST: POI[] = [
  // ==========================================
  // --- PISO 1: FACILIDADES & EMERGÊNCIA ---
  // ==========================================
  {
    id: 'entrance-main',
    name: 'Entrada Principal & Credenciamento (São Paulo Expo)',
    shortName: 'Entrada Principal',
    category: 'entrance',
    tier: 'facility',
    floor: 1,
    position: [0, 0.5, 28.5],
    dimensions: [10, 1, 2.5],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Entrada & Credenciamento',
    isAccessible: true,
    description: 'Recepção, check-in digital, retirada de crachás e filas prioritárias NBR 9050 para pessoas com deficiência, idosos, gestantes e neurodivergentes.',
  },
  {
    id: 'saida-sul',
    name: 'Saída de Emergência Sul (Principal)',
    shortName: 'Saída Sul',
    category: 'exit',
    floor: 1,
    position: [0, 0.6, 30.5],
    dimensions: [8, 1.2, 1.5],
    color: '#16a34a',
    accentColor: '#4ade80',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída ampla no nível da rua com rampas suaves, portas automáticas e acesso direto à área externa e ponto de encontro seguro.',
  },
  {
    id: 'saida-acessivel-oeste',
    name: 'Saída de Emergência Oeste (100% Acessível NBR 9050)',
    shortName: 'Saída Acessível Oeste',
    category: 'exit',
    floor: 1,
    position: [-36, 0.6, 22.5],
    dimensions: [4, 1.2, 2],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Rota de fuga prioritária com piso tátil direcional e de alerta, sinalização sonoro-luminosa de emergência e rampa com inclinação suave conectada à Sala de Acolhimento.',
  },
  {
    id: 'saida-norte',
    name: 'Saída de Emergência Norte',
    shortName: 'Saída Norte',
    category: 'exit',
    floor: 1,
    position: [0, 0.6, -26],
    dimensions: [6, 1.2, 2],
    color: '#15803d',
    accentColor: '#86efac',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência aos fundos dos palcos com barras antipânico e sinalização fotoluminescente.',
  },
  {
    id: 'info-desk',
    name: 'Central de Acessibilidade, Libras & Informações',
    shortName: 'Central de Acessibilidade',
    category: 'info',
    tier: 'facility',
    floor: 1,
    position: [0, 0.9, 8.5],
    dimensions: [3.4, 1.8, 2.2],
    color: '#0284c7',
    accentColor: '#38bdf8',
    zone: 'Concurso Central',
    isAccessible: true,
    description: 'Central de suporte com intérpretes de Libras (Língua Brasileira de Sinais), empréstimo de cadeiras de rodas motorizadas, fones abafadores de ruído, cordões de girassol e guias videntes.',
  },

  // =======================================================
  // --- PISO 1: SALA DE ACOLHIMENTO (ESPAÇO GIRASSOL) ---
  // =======================================================
  {
    id: 'sala-acolhimento',
    name: 'Sala de Acolhimento & Neurodiversidade (Espaço Girassol)',
    shortName: 'Sala de Acolhimento',
    category: 'quiet_room',
    floor: 1,
    position: [-26, 1.2, 22.5],
    dimensions: [10, 2.4, 7],
    color: '#0d9488',
    accentColor: '#2dd4bf',
    zone: 'Espaço de Descompressão',
    isAccessible: true,
    isQuietZone: true,
    description: 'Espaço sensorialmente neutro com iluminação suave dimerizada, isolamento acústico, poltronas ergonômicas de repouso, abafadores sonoros e apoio psicológico para pessoas no espectro autista (TEA), TDAH ou com sobrecarga sensorial.',
  },

  // ==========================================
  // --- PISO 1: SANITÁRIOS (NBR 9050) ---
  // ==========================================
  {
    id: 'restroom-west',
    name: 'Sanitários Acessíveis & Bebedouros (Oeste)',
    shortName: 'Sanitários Oeste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [-30, 0.8, -6.5],
    dimensions: [4.5, 1.6, 5],
    color: '#64748b',
    zone: 'Alameda 200',
    isAccessible: true,
    description: 'Sanitários 100% adaptados conforme a NBR 9050, com barras de apoio em aço inox, botões de emergência, trocador acessível e bebedouro com acionamento duplo (alto e baixo).',
  },
  {
    id: 'restroom-east',
    name: 'Sanitários & Bebedouros (Leste)',
    shortName: 'Sanitários Leste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [30, 0.8, -6.5],
    dimensions: [4.5, 1.6, 5],
    color: '#64748b',
    zone: 'Alameda 400',
    isAccessible: true,
    description: 'Sanitários masculinos, femininos e cabine individual acessível com alarme sonoro de emergência e bebedouro refrigerado.',
  },

  // ==========================================
  // --- PISO 1: GRANDES ARENAS (PALCOS) ---
  // ==========================================
  {
    id: 'stage-main',
    name: 'Arena Principal Keynote (Palco Brasil)',
    shortName: 'Palco Brasil',
    category: 'stage',
    floor: 1,
    position: [-20, 1.5, -23],
    dimensions: [18, 3, 10],
    color: '#7c3aed',
    accentColor: '#a78bfa',
    zone: 'Concurso Norte • Grandes Arenas',
    isAccessible: true,
    description: 'Palco principal com tradução simultânea em Libras presencial, legendagem ao vivo (closed caption) nos telões, área reservada para cadeirantes na primeira fila com visão desobstruída e sistema de aro magnético para pessoas com deficiência auditiva. Capacidade: 1.500 pessoas.',
    sessions: [
      { id: 's1', title: 'Abertura: O Futuro da Tecnologia e IA no Brasil', speaker: 'Cristina Junqueira (Co-fundadora Nubank)', time: '09:30 - 10:45', isLiveNow: true },
      { id: 's2', title: 'Inteligência Artificial Aplicada e Inovação em Escala', speaker: 'Fabricio Bloisi (Presidente Prosus / iFood)', time: '11:15 - 12:30' },
      { id: 's3', title: 'Inclusão Digital e Diversidade no Ecossistema Tech', speaker: 'Nina Silva (Fundadora Movimento Black Money)', time: '14:00 - 15:15' },
    ],
  },
  {
    id: 'stage-tech',
    name: 'Palco DevBrasil & Engenharia',
    shortName: 'Palco DevBrasil',
    category: 'stage',
    floor: 1,
    position: [20, 1.2, -23],
    dimensions: [16, 2.4, 10],
    color: '#2563eb',
    accentColor: '#60a5fa',
    zone: 'Concurso Norte • Grandes Arenas',
    isAccessible: true,
    description: 'Palestras técnicas com especialistas em computação de alto desempenho, arquiteturas de sistemas distribuídos e inteligência artificial aberta com acessibilidade completa.',
    sessions: [
      { id: 's4', title: 'Arquiteturas Escaláveis de Nuvem e Open Finance', speaker: 'Silvio Meira (Cientista-Chefe TDS Company)', time: '10:00 - 10:45', isLiveNow: true },
      { id: 's5', title: 'Modelos de IA Abertos e Soberania de Dados Nacional', speaker: 'Dra. Bianca Zadrozny (Líder de Pesquisa em IA IBM Brasil)', time: '11:30 - 12:15' },
    ],
  },

  // =========================================================================
  // --- PISO 1: ESTANDES PRINCIPAIS (GRANDES EMPRESAS DE TECNOLOGIA) ---
  // =========================================================================
  {
    id: 'booth-nubank',
    name: 'Nubank • Inovação Financeira & Nu AI',
    shortName: 'Nubank',
    boothNumber: 'A101',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-18, 1.2, -6.5],
    dimensions: [6, 2.4, 6],
    color: '#820AD1',
    accentColor: '#a855f7',
    zone: 'Alameda 100 • Inovação & IA',
    isAccessible: true,
    description: 'Estande imersivo do Nubank apresentando as novas tecnologias de inteligência artificial generativa financeira, consultoria de carreira tech, bancadas rebaixadas acessíveis e distribuição do icônico NuCard comemorativo.',
    sessions: [
      { id: 'nb1', title: 'Arquitetura dos Agentes Autônomos no App Nubank', speaker: 'Engenharia Nu AI', time: '10:30 - 11:00', isLiveNow: true },
      { id: 'nb2', title: 'Carreiras Tech no Maior Neobanco do Ocidente', speaker: 'Time de Pessoas & Cultura', time: '13:30 - 14:15' },
    ],
  },
  {
    id: 'booth-mercadolivre',
    name: 'Mercado Livre & Mercado Pago',
    shortName: 'Mercado Livre',
    boothNumber: 'A102',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-18, 1.2, 8],
    dimensions: [6, 2.4, 6],
    color: '#FFE600',
    accentColor: '#2D3277',
    zone: 'Alameda 100 • Inovação & IA',
    isAccessible: true,
    description: 'Demonstrações de logística autônoma por IA, infraestrutura de pagamentos em tempo real e computação de baixa latência em toda a América Latina.',
    sessions: [
      { id: 'meli1', title: 'Logística Inteligente e Roteirização em Escala Continental', speaker: 'Meli Tech Labs', time: '11:00 - 11:45' },
      { id: 'meli2', title: 'Open Source e Soluções Financeiras Inclusivas', speaker: 'Equipe Mercado Pago', time: '14:30 - 15:15' },
    ],
  },
  {
    id: 'booth-ifood',
    name: 'iFood • Robótica & Inteligência Artificial',
    shortName: 'iFood Tech',
    boothNumber: 'A201',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [-30, 1.1, 8],
    dimensions: [6, 2.2, 6],
    color: '#EA1D2C',
    accentColor: '#ff5252',
    zone: 'Alameda 200 • Tecnologia Brasil',
    isAccessible: true,
    description: 'Exposição de robôs de entrega autônomos nacionais (Ada), inteligência artificial de previsão de demanda gastronômica e workshops de algoritmos de roteirização com bancadas adaptadas para PCDs.',
  },
  {
    id: 'booth-itau',
    name: 'Itaú BBA & Open Finance Brasil',
    shortName: 'Itaú BBA',
    boothNumber: 'B301',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [18, 1.2, -6.5],
    dimensions: [6, 2.4, 6],
    color: '#EC7000',
    accentColor: '#003399',
    zone: 'Alameda 300 • Fintech & Cloud',
    isAccessible: true,
    description: 'Inovações em Pix por aproximação, crédito inteligente com modelos preditivos e arquitetura de segurança zero-trust no ecossistema financeiro brasileiro.',
  },
  {
    id: 'booth-totvs',
    name: 'TOTVS • Tecnologia & ERP em Nuvem',
    shortName: 'TOTVS',
    boothNumber: 'B302',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [18, 1.2, 8],
    dimensions: [6, 2.4, 6],
    color: '#004F9F',
    accentColor: '#0080ff',
    zone: 'Alameda 300 • Fintech & Cloud',
    isAccessible: true,
    description: 'Soluções de software corporativo em nuvem, inteligência de negócios brasileira e aceleração digital para milhares de empresas nacionais.',
  },
  {
    id: 'booth-eve',
    name: 'Embraer Eve • Mobilidade Aérea Urbana (eVTOL)',
    shortName: 'Embraer Eve',
    boothNumber: 'B401',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [30, 1.1, 8],
    dimensions: [6, 2.2, 6],
    color: '#002776',
    accentColor: '#009B3A',
    zone: 'Alameda 400 • Mobilidade & Dados',
    isAccessible: true,
    description: 'Mockup interativo e simulador 3D do eVTOL (veículo elétrico de decolagem vertical) desenvolvido no Brasil, com software de controle de tráfego aéreo urbano sustentável.',
  },

  // ==================================================================
  // --- PISO 1: ALAMEDA DE STARTUPS BRASIL (DESTAQUES NACIONAIS) ---
  // ==================================================================
  {
    id: 'pod-startup-1',
    name: 'QuintoAndar (PropTech & Moradia)',
    shortName: 'QuintoAndar',
    boothNumber: 'S101',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-5.5, 0.8, 20],
    dimensions: [3, 1.6, 3],
    color: '#0041C2',
    accentColor: '#3b82f6',
    zone: 'Alameda de Startups Brasil',
    isAccessible: true,
    description: 'Plataforma líder em moradia na América Latina: precificação algorítmica imobiliária, vistorias 3D por visão computacional e contratos digitais desburocratizados.',
  },
  {
    id: 'pod-startup-2',
    name: 'Stone Pagamentos (Soluções para PMEs)',
    shortName: 'Stone',
    boothNumber: 'S102',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [5.5, 0.8, 20],
    dimensions: [3, 1.6, 3],
    color: '#00A868',
    accentColor: '#10b981',
    zone: 'Alameda de Startups Brasil',
    isAccessible: true,
    description: 'Ecossistema integrado de gestão financeira, maquininhas inteligentes e contas digitais para empreendedores de todo o Brasil.',
  },
  {
    id: 'pod-startup-3',
    name: 'Wellhub / Gympass (Saúde & Bem-Estar)',
    shortName: 'Wellhub',
    boothNumber: 'S103',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-5.5, 0.8, 25],
    dimensions: [3, 1.6, 3],
    color: '#f43f5e',
    accentColor: '#fb7185',
    zone: 'Alameda de Startups Brasil',
    isAccessible: true,
    description: 'Unicórnio brasileiro de bem-estar corporativo, com rede global de academias, saúde mental, mindfulness e telemedicina preventiva.',
  },
  {
    id: 'pod-startup-4',
    name: 'Asaas (Automação Financeira & Cobranças)',
    shortName: 'Asaas',
    boothNumber: 'S104',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [5.5, 0.8, 25],
    dimensions: [3, 1.6, 3],
    color: '#7c3aed',
    accentColor: '#a855f7',
    zone: 'Alameda de Startups Brasil',
    isAccessible: true,
    description: 'Fintech brasileira de automação de cobranças, gestão de assinaturas, split de pagamentos e APIs financeiras para negócios digitais.',
  },

  // =========================================================================
  // --- PISO 1: PRAÇA GASTRONÔMICA BRASIL & CAFETERIA (SUL LESTE) ---
  // =========================================================================
  {
    id: 'food-court-1',
    name: 'Cafeteria do Cerrado & Pão de Queijo Canastra',
    shortName: 'Café do Cerrado',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [26, 0.9, 20],
    dimensions: [8, 1.8, 4.5],
    color: '#ea580c',
    accentColor: '#fb923c',
    zone: 'Praça Gastronômica Brasil',
    isAccessible: true,
    description: 'Cafés especiais do Cerrado Mineiro, pão de queijo da Serra da Canastra artesanal, opções sem glúten, leites vegetais e mesas com altura acessível para cadeirantes.',
  },
  {
    id: 'food-court-2',
    name: 'Praça Gastronômica Brasil & Açaí Orgânico',
    shortName: 'Praça Gastronômica',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [26, 0.9, 26],
    dimensions: [8, 1.8, 4.5],
    color: '#db2777',
    accentColor: '#f472b6',
    zone: 'Praça Gastronômica Brasil',
    isAccessible: true,
    description: 'Cardápio variado com pratos típicos brasileiros, açaí orgânico do Pará, opções vegetarianas, veganas e balcões de atendimento rebaixados NBR 9050.',
  },

  // ===============================================================
  // --- PISO 2: WORKSHOPS & MEZANINO VIP ---
  // ===============================================================
  {
    id: 'workshop-room-a',
    name: 'Sala de Workshop A: IA Agêntica & LLMs no Brasil',
    shortName: 'Workshop A (IA)',
    category: 'workshop',
    floor: 2,
    position: [-16, 7.5, -8],
    dimensions: [12, 2.5, 8],
    color: '#4f46e5',
    accentColor: '#818cf8',
    zone: 'Salas de Workshop & Imersão',
    isAccessible: true,
    description: 'Laboratório prático de código com bancadas acessíveis, monitores de alto contraste, pontos de energia em altura adaptada e Wi-Fi dedicado de alta velocidade.',
    sessions: [
      { id: 'w1', title: 'Hands-on: Construindo Agentes de IA com Dados Brasileiros', speaker: 'Equipe Tech Brasil', time: '11:00 - 13:00', isLiveNow: true },
    ],
  },
  {
    id: 'workshop-room-b',
    name: 'Sala de Workshop B: Web3D & Engenharia Gráfica',
    shortName: 'Workshop B (Web3D)',
    category: 'workshop',
    floor: 2,
    position: [16, 7.5, -8],
    dimensions: [12, 2.5, 8],
    color: '#0891b2',
    accentColor: '#22d3ee',
    zone: 'Salas de Workshop & Imersão',
    isAccessible: true,
    description: 'Treinamento intensivo de gráficos interativos 3D com Three.js, React Three Fiber e WebGPU para mapas e interfaces imersivas.',
    sessions: [
      { id: 'w3', title: 'Visualização Espacial e WebGL para Grandes Eventos', speaker: 'Comunidade DevBrasil', time: '11:30 - 13:30' },
    ],
  },
  {
    id: 'vip-lounge',
    name: 'Lounge VIP & Conexões Empresariais',
    shortName: 'Lounge VIP',
    category: 'booth',
    tier: 'diamond',
    floor: 2,
    position: [0, 7.5, -14],
    dimensions: [12, 2.5, 6],
    color: '#ca8a04',
    accentColor: '#facc15',
    zone: 'Lounge VIP & Conexões Empresariais',
    isAccessible: true,
    description: 'Espaço exclusivo para oradores, líderes de tecnologia, imprensa e investidores, com catering regional e salas privativas de reuniões com total acessibilidade.',
  },
  {
    id: 'mezzanine-restroom',
    name: 'Sanitários Mezanino (Piso 2 Acessível)',
    shortName: 'Sanitários 2F',
    category: 'restroom',
    tier: 'facility',
    floor: 2,
    position: [-24, 7.3, 0],
    dimensions: [4, 1.6, 5],
    color: '#64748b',
    zone: 'Mezanino',
    isAccessible: true,
    description: 'Sanitários adaptados no segundo piso com barras de apoio NBR 9050 e alarme sonoro.',
  },
];

// Waypoint Graph with Sensory & Accessibility Attributes (Orthogonal Grid)
export const VENUE_WAYPOINTS: WaypointNode[] = [
  // --- FLOOR 1: CONCURSO CENTRAL (X = 0) ---
  { id: 'wp_saida_sul', x: 0, z: 30.5, floor: 1, name: 'Saída de Emergência Sul', isEmergencyExit: true },
  { id: 'wp_entrance', x: 0, z: 27, floor: 1, name: 'Entrada Principal' },
  { id: 'wp_concourse_south', x: 0, z: 15, floor: 1, name: 'Concurso Sul & Central' },
  { id: 'wp_info_desk', x: 0, z: 8.5, floor: 1, name: 'Balcão de Informações' },
  { id: 'wp_concourse_mid', x: 0, z: 1, floor: 1, name: 'Concurso Central (Centro)' },
  { id: 'wp_concourse_north', x: 0, z: -14, floor: 1, name: 'Concurso Norte & Mezanino' },
  { id: 'wp_stairs_f1', x: -2.5, z: -18, floor: 1, name: 'Escada para 2F', isStairs: true },
  { id: 'wp_elevator_f1', x: 2.5, z: -18, floor: 1, name: 'Elevador Acessível 1F', isElevator: true },
  { id: 'wp_saida_norte', x: 0, z: -26, floor: 1, name: 'Saída de Emergência Norte', isEmergencyExit: true },

  // --- FLOOR 1: CONCURSO SUL (Z = 15) ---
  { id: 'wp_saida_oeste', x: -36, z: 15, floor: 1, name: 'Saída Acessível Oeste', isEmergencyExit: true },
  { id: 'wp_sala_acolhimento', x: -26, z: 15, floor: 1, name: 'Sala de Acolhimento' },
  { id: 'wp_acolhimento_door', x: -26, z: 19, floor: 1, name: 'Entrada Sala Acolhimento' },
  { id: 'wp_sc_w2', x: -24, z: 15, floor: 1, name: 'Alameda 200 & Concurso Sul' },
  { id: 'wp_sc_w1', x: -12, z: 15, floor: 1, name: 'Alameda 100 & Concurso Sul' },
  { id: 'wp_sc_e1', x: 12, z: 15, floor: 1, name: 'Alameda 300 & Concurso Sul' },
  { id: 'wp_sc_e2', x: 24, z: 15, floor: 1, name: 'Alameda 400 & Concurso Sul' },
  { id: 'wp_food_court_1', x: 26, z: 15, floor: 1, name: 'Cafeteria & Lounge' },
  { id: 'wp_food_court_2', x: 26, z: 26, floor: 1, name: 'Praça Gourmet' },

  // --- FLOOR 1: CONCURSO CENTRAL (Z = 1) ---
  { id: 'wp_mc_w2', x: -24, z: 1, floor: 1, name: 'Alameda 200 & Concurso Central' },
  { id: 'wp_mc_w1', x: -12, z: 1, floor: 1, name: 'Alameda 100 & Concurso Central' },
  { id: 'wp_mc_e1', x: 12, z: 1, floor: 1, name: 'Alameda 300 & Concurso Central' },
  { id: 'wp_mc_e2', x: 24, z: 1, floor: 1, name: 'Alameda 400 & Concurso Central' },

  // --- FLOOR 1: CONCURSO NORTE (Z = -14) ---
  { id: 'wp_main_stage_front', x: -20, z: -16, floor: 1, name: 'Entrada Palco Principal' },
  { id: 'wp_nc_w2', x: -24, z: -14, floor: 1, name: 'Alameda 200 & Concurso Norte' },
  { id: 'wp_nc_w1', x: -12, z: -14, floor: 1, name: 'Alameda 100 & Concurso Norte' },
  { id: 'wp_nc_e1', x: 12, z: -14, floor: 1, name: 'Alameda 300 & Concurso Norte' },
  { id: 'wp_nc_e2', x: 24, z: -14, floor: 1, name: 'Alameda 400 & Concurso Norte' },
  { id: 'wp_tech_stage_front', x: 20, z: -16, floor: 1, name: 'Entrada Palco DevTech' },

  // --- FLOOR 1: AISLE 200 & 400 AMENITIES ---
  { id: 'wp_restroom_west', x: -24, z: -6.5, floor: 1, name: 'Sanitários Oeste' },
  { id: 'wp_restroom_east', x: 24, z: -6.5, floor: 1, name: 'Sanitários Leste' },

  // --- FLOOR 1: STARTUP ALLEY LANES ---
  { id: 'wp_startup_w', x: -5.5, z: 20, floor: 1, name: 'Alameda Startups Oeste' },
  { id: 'wp_startup_e', x: 5.5, z: 20, floor: 1, name: 'Alameda Startups Leste' },

  // --- FLOOR 2: WORKSHOPS & VIP MEZZANINE ---
  { id: 'wp_stairs_f2', x: -2.5, z: -18, floor: 2, name: 'Escada vindo de 1F', isStairs: true },
  { id: 'wp_elevator_f2', x: 2.5, z: -18, floor: 2, name: 'Elevador Acessível 2F', isElevator: true },
  { id: 'wp_f2_landing', x: 0, z: -14, floor: 2, name: 'Hall Mezanino' },
  { id: 'wp_f2_vip', x: 0, z: -14, floor: 2, name: 'Entrada Lounge VIP' },
  { id: 'wp_f2_west', x: -16, z: -14, floor: 2, name: 'Corredor Workshop A' },
  { id: 'wp_f2_east', x: 16, z: -14, floor: 2, name: 'Corredor Workshop B' },
  { id: 'wp_f2_restroom', x: -24, z: -4, floor: 2, name: 'Sanitários 2F' },
];

export const VENUE_EDGES: WaypointEdge[] = [
  // ===============================================
  // FLOOR 1: MAIN CONCOURSE (X = 0)
  // ===============================================
  { from: 'wp_saida_sul', to: 'wp_entrance', lotacao: 1, ruido: 1 },
  { from: 'wp_entrance', to: 'wp_concourse_south', lotacao: 3, ruido: 2 },
  { from: 'wp_concourse_south', to: 'wp_info_desk', lotacao: 3, ruido: 2 },
  { from: 'wp_info_desk', to: 'wp_concourse_mid', lotacao: 3, ruido: 2 },
  { from: 'wp_concourse_mid', to: 'wp_concourse_north', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_north', to: 'wp_saida_norte', lotacao: 1, ruido: 1 },

  // Vertical Access Links (Stairs & Elevator)
  { from: 'wp_concourse_north', to: 'wp_stairs_f1', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_north', to: 'wp_elevator_f1', lotacao: 1, ruido: 1 },

  // ===============================================
  // FLOOR 1: SOUTH CONCOURSE (Z = 15)
  // ===============================================
  // Calm, sensory-friendly route to Sala de Acolhimento & Saída Oeste
  { from: 'wp_saida_oeste', to: 'wp_sala_acolhimento', lotacao: 1, ruido: 1 },
  { from: 'wp_sala_acolhimento', to: 'wp_acolhimento_door', lotacao: 1, ruido: 1 },
  { from: 'wp_sala_acolhimento', to: 'wp_sc_w2', lotacao: 1, ruido: 1 },

  // Cross-Concourse Grid
  { from: 'wp_sc_w2', to: 'wp_sc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_w1', to: 'wp_concourse_south', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_south', to: 'wp_sc_e1', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_e1', to: 'wp_sc_e2', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_e2', to: 'wp_food_court_1', lotacao: 3, ruido: 3 },
  { from: 'wp_food_court_1', to: 'wp_food_court_2', lotacao: 3, ruido: 3 },

  // ===============================================
  // FLOOR 1: MID CONCOURSE (Z = 1)
  // ===============================================
  { from: 'wp_mc_w2', to: 'wp_mc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w1', to: 'wp_concourse_mid', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_mid', to: 'wp_mc_e1', lotacao: 3, ruido: 3 },
  { from: 'wp_mc_e1', to: 'wp_mc_e2', lotacao: 2, ruido: 2 },

  // ===============================================
  // FLOOR 1: NORTH CONCOURSE (Z = -14)
  // ===============================================
  { from: 'wp_main_stage_front', to: 'wp_nc_w2', lotacao: 5, ruido: 5 },
  { from: 'wp_nc_w2', to: 'wp_nc_w1', lotacao: 4, ruido: 4 },
  { from: 'wp_nc_w1', to: 'wp_concourse_north', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_north', to: 'wp_nc_e1', lotacao: 3, ruido: 3 },
  { from: 'wp_nc_e1', to: 'wp_nc_e2', lotacao: 4, ruido: 4 },
  { from: 'wp_nc_e2', to: 'wp_tech_stage_front', lotacao: 4, ruido: 4 },

  // ===============================================
  // FLOOR 1: NORTH-SOUTH AISLES (100, 200, 300, 400)
  // ===============================================
  // Alameda 100 (X = -12)
  { from: 'wp_sc_w1', to: 'wp_mc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w1', to: 'wp_nc_w1', lotacao: 3, ruido: 3 },

  // Alameda 200 (X = -24)
  { from: 'wp_sc_w2', to: 'wp_mc_w2', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w2', to: 'wp_restroom_west', lotacao: 2, ruido: 2 },
  { from: 'wp_restroom_west', to: 'wp_nc_w2', lotacao: 3, ruido: 3 },

  // Alameda 300 (X = 12)
  { from: 'wp_sc_e1', to: 'wp_mc_e1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_e1', to: 'wp_nc_e1', lotacao: 3, ruido: 3 },

  // Alameda 400 (X = 24)
  { from: 'wp_sc_e2', to: 'wp_mc_e2', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_e2', to: 'wp_restroom_east', lotacao: 2, ruido: 2 },
  { from: 'wp_restroom_east', to: 'wp_nc_e2', lotacao: 3, ruido: 3 },

  // ===============================================
  // FLOOR 1: STARTUP ALLEY (ALAMEDA DE STARTUPS)
  // ===============================================
  { from: 'wp_concourse_south', to: 'wp_startup_w', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_south', to: 'wp_startup_e', lotacao: 3, ruido: 3 },
  { from: 'wp_startup_w', to: 'wp_info_desk', lotacao: 3, ruido: 3 },
  { from: 'wp_startup_e', to: 'wp_info_desk', lotacao: 3, ruido: 3 },

  // ===============================================
  // VERTICAL CONNECTIONS: FLOOR 1 <-> FLOOR 2
  // ===============================================
  // Stairs (intransponível para cadeirante e mobilidade reduzida)
  { from: 'wp_stairs_f1', to: 'wp_stairs_f2', temEscada: true, lotacao: 2, ruido: 2 },

  // Accessible Elevator (100% livre de barreiras)
  { from: 'wp_elevator_f1', to: 'wp_elevator_f2', isElevador: true, lotacao: 1, ruido: 1 },

  // ===============================================
  // FLOOR 2: WORKSHOPS & VIP MEZZANINE
  // ===============================================
  { from: 'wp_stairs_f2', to: 'wp_f2_landing', lotacao: 1, ruido: 1 },
  { from: 'wp_elevator_f2', to: 'wp_f2_landing', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_landing', to: 'wp_f2_vip', lotacao: 2, ruido: 2 },
  { from: 'wp_f2_landing', to: 'wp_f2_west', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_landing', to: 'wp_f2_east', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_west', to: 'wp_f2_restroom', lotacao: 1, ruido: 1 },
];
