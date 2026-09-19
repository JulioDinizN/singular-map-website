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
  { id: 1, name: '1F - Pavilhão & Palcos', shortName: '1F' },
  { id: 2, name: '2F - Workshops & Mezanino', shortName: '2F' },
] as const;

export const VENUE_ZONES = [
  { id: 'main-stage', name: 'Arena Principal (Keynote)', color: '#8b5cf6', floor: 1 },
  { id: 'ai-zone', name: 'Pavilhão de IA & Robótica', color: '#3b82f6', floor: 1 },
  { id: 'cloud-zone', name: 'Cloud & Infraestrutura', color: '#06b6d4', floor: 1 },
  { id: 'fintech-zone', name: 'Fintech & Segurança', color: '#10b981', floor: 1 },
  { id: 'startup-alley', name: 'Alameda de Startups', color: '#f59e0b', floor: 1 },
  { id: 'food-court', name: 'Praça de Alimentação & Lounge', color: '#ec4899', floor: 1 },
  { id: 'quiet-zone', name: 'Espaço de Descompressão', color: '#14b8a6', floor: 1 },
  { id: 'workshops', name: 'Salas de Workshop', color: '#6366f1', floor: 2 },
  { id: 'vip-lounge', name: 'Lounge VIP & Palestrantes', color: '#eab308', floor: 2 },
];

export const POI_LIST: POI[] = [
  // ==========================================
  // --- FLOOR 1: FACILIDADES & EMERGÊNCIA ---
  // ==========================================
  {
    id: 'entrance-main',
    name: 'Entrada Principal & Credenciamento',
    shortName: 'Entrada Principal',
    category: 'entrance',
    tier: 'facility',
    floor: 1,
    position: [0, 0.5, 27],
    dimensions: [12, 1, 3],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Entrada & Saída',
    isAccessible: true,
    description: 'Check-in, retirada de crachás, filas prioritárias para pessoas com deficiência, idosos e gestantes.',
  },
  {
    id: 'saida-sul',
    name: 'Saída de Emergência Sul (Principal)',
    shortName: 'Saída Sul',
    category: 'exit',
    floor: 1,
    position: [0, 0.6, 29],
    dimensions: [8, 1.2, 2],
    color: '#16a34a',
    accentColor: '#4ade80',
    zone: 'Entrada & Saída',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída ampla no nível da rua com rampas suaves, portas automáticas e acesso direto ao ponto de encontro externo.',
  },
  {
    id: 'saida-acessivel-oeste',
    name: 'Saída de Emergência Oeste (100% Acessível)',
    shortName: 'Saída Acessível Oeste',
    category: 'exit',
    floor: 1,
    position: [-35, 0.6, 16],
    dimensions: [4, 1.2, 2],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Rota de fuga prioritária com piso tátil, sinalização sonoro-luminosa e rampa com inclinação NBR 9050 conectada à Sala de Acolhimento.',
  },
  {
    id: 'saida-norte',
    name: 'Saída de Emergência Norte',
    shortName: 'Saída Norte',
    category: 'exit',
    floor: 1,
    position: [0, 0.6, -25],
    dimensions: [6, 1.2, 2],
    color: '#15803d',
    accentColor: '#86efac',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência aos fundos dos palcos com barra antipânico.',
  },
  {
    id: 'info-desk',
    name: 'Balcão de Informações & Acessibilidade',
    shortName: 'Informações',
    category: 'info',
    tier: 'facility',
    floor: 1,
    position: [0, 0.9, 9],
    dimensions: [5, 1.8, 3],
    color: '#0284c7',
    accentColor: '#38bdf8',
    zone: 'Entrada & Saída',
    isAccessible: true,
    description: 'Central de atendimento com empréstimo de cadeiras de rodas, fones antirruído, cordões de girassol e guias videntes.',
  },

  // =======================================================
  // --- FLOOR 1: SALA DE ACOLHIMENTO (SENSORY CALM ZONE) ---
  // =======================================================
  {
    id: 'sala-acolhimento',
    name: 'Sala de Acolhimento & Descompressão',
    shortName: 'Sala Acolhimento',
    category: 'quiet_room',
    floor: 1,
    position: [-27, 1.2, 18],
    dimensions: [10, 2.4, 7],
    color: '#0d9488',
    accentColor: '#2dd4bf',
    zone: 'Espaço de Descompressão',
    isAccessible: true,
    isQuietZone: true,
    description: 'Ambiente silencioso com iluminação reduzida, abafadores de ruído, sofás confortáveis e equipe de apoio para pessoas neurodivergentes ou com sobrecarga sensorial.',
  },

  // ==========================================
  // --- FLOOR 1: SANITÁRIOS (RESTROOMS) ---
  // ==========================================
  {
    id: 'restroom-west',
    name: 'Sanitários Acessíveis & Bebedouro (Oeste)',
    shortName: 'Sanitários Oeste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [-26, 0.8, -5],
    dimensions: [4, 1.6, 6],
    color: '#64748b',
    zone: 'Facilidades',
    isAccessible: true,
    description: 'Cabines acessíveis para cadeirantes, barras de apoio, trocador infantil e bebedouro com acionamento baixo.',
  },
  {
    id: 'restroom-east',
    name: 'Sanitários & Bebedouro (Leste)',
    shortName: 'Sanitários Leste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [26, 0.8, -5],
    dimensions: [4, 1.6, 6],
    color: '#64748b',
    zone: 'Facilidades',
    isAccessible: true,
    description: 'Sanitários masculinos, femininos e cabine acessível com botão de emergência.',
  },

  // ==========================================
  // --- FLOOR 1: STAGES (ARENAS NORTE) ---
  // ==========================================
  {
    id: 'stage-main',
    name: 'Arena Principal de Keynote',
    shortName: 'Palco Principal',
    category: 'stage',
    floor: 1,
    position: [-22, 1.5, -20],
    dimensions: [18, 3, 12],
    color: '#7c3aed',
    accentColor: '#a78bfa',
    zone: 'Arena Principal (Keynote)',
    isAccessible: true,
    description: 'Palco principal com área reservada para cadeirantes na primeira fila, intérpretes de Libras e legendagem em tempo real no telão. Capacidade: 1.200 pessoas.',
    sessions: [
      { id: 's1', title: 'Abertura: O Futuro dos Agentes de IA em 2026', speaker: 'Dra. Elena Vance (Lead Scientist)', time: '09:30 - 10:45', isLiveNow: true },
      { id: 's2', title: 'Sistemas Autônomos em Escala Global', speaker: 'Marcus Sterling (CTO)', time: '11:15 - 12:30' },
      { id: 's3', title: 'Web Espacial e Interfaces Inclusivas', speaker: 'Sarah Chen (VP Design)', time: '14:00 - 15:15' },
    ],
  },
  {
    id: 'stage-tech',
    name: 'Palco DevTech & Engenharia',
    shortName: 'Palco DevTech',
    category: 'stage',
    floor: 1,
    position: [22, 1.2, -20],
    dimensions: [16, 2.4, 12],
    color: '#2563eb',
    accentColor: '#60a5fa',
    zone: 'Pavilhão de IA & Robótica',
    isAccessible: true,
    description: 'Palestras técnicas aprofundadas, arquitetura e demonstrações ao vivo com acessibilidade garantida.',
    sessions: [
      { id: 's4', title: 'WebGPU e Renderização 3D em Tempo Real', speaker: 'Alex Rivera (Staff Engineer)', time: '10:00 - 10:45', isLiveNow: true },
      { id: 's5', title: 'Arquiteturas Multi-Agente & RAG', speaker: 'Priya Sharma (Principal Architect)', time: '11:30 - 12:15' },
    ],
  },

  // ===============================================================
  // --- FLOOR 1: EXPO GRID - PAVILHÃO IA & ROBÓTICA (OESTE) ---
  // ===============================================================
  {
    id: 'booth-google-cloud',
    name: 'Google Cloud & Vertex AI',
    shortName: 'Google Cloud',
    boothNumber: 'A101',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-15, 1.2, -5],
    dimensions: [7, 2.4, 6],
    color: '#4285F4',
    accentColor: '#34A853',
    zone: 'Pavilhão de IA & Robótica',
    description: 'Demos interativas com modelos multimodais Gemini, bancadas acessíveis e distribuição de brindes.',
    sessions: [
      { id: 'b1', title: 'Demo: Construindo Agentes com Gemini', speaker: 'Equipe Cloud', time: '10:30 - 11:00', isLiveNow: true },
      { id: 'b2', title: 'Mentoria Técnica & Sorteios', speaker: 'Developer Advocates', time: '13:00 - 14:00' },
    ],
  },
  {
    id: 'booth-nvidia',
    name: 'NVIDIA Omniverse & Robótica',
    shortName: 'NVIDIA',
    boothNumber: 'A102',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-15, 1.2, 9],
    dimensions: [7, 2.4, 6],
    color: '#76B900',
    accentColor: '#9be821',
    zone: 'Pavilhão de IA & Robótica',
    description: 'Gêmeos digitais no Omniverse e arquiteturas de aceleração neural em hardware Blackwell.',
  },
  {
    id: 'booth-anthropic',
    name: 'Anthropic Claude Showcase',
    shortName: 'Anthropic',
    boothNumber: 'A201',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [-26, 1.1, 9],
    dimensions: [7, 2.2, 6],
    color: '#D97706',
    accentColor: '#F59E0B',
    zone: 'Pavilhão de IA & Robótica',
    description: 'Segurança em IA, raciocínio avançado com Claude e workshops de prompting.',
  },

  // ===============================================================
  // --- FLOOR 1: EXPO GRID - CLOUD & FINTECH (LESTE) ---
  // ===============================================================
  {
    id: 'booth-aws',
    name: 'AWS Cloud & Bedrock',
    shortName: 'AWS',
    boothNumber: 'B301',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [15, 1.2, -5],
    dimensions: [7, 2.4, 6],
    color: '#FF9900',
    accentColor: '#FFB84D',
    zone: 'Cloud & Infraestrutura',
    description: 'Aplicações de IA generativa com Amazon Bedrock e arquiteturas de alta resiliência.',
  },
  {
    id: 'booth-stripe',
    name: 'Stripe Global Payments',
    shortName: 'Stripe',
    boothNumber: 'B302',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [15, 1.2, 9],
    dimensions: [7, 2.4, 6],
    color: '#635BFF',
    accentColor: '#7a73ff',
    zone: 'Fintech & Segurança',
    description: 'Checkout autônomo por agentes e orquestração global de pagamentos.',
  },
  {
    id: 'booth-github',
    name: 'GitHub Copilot Workspace',
    shortName: 'GitHub',
    boothNumber: 'B401',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [26, 1.1, 9],
    dimensions: [7, 2.2, 6],
    color: '#24292F',
    accentColor: '#58a6ff',
    zone: 'Cloud & Infraestrutura',
    description: 'Desafios de código assistido por IA e adesivos exclusivos do Octocat.',
  },

  // =======================================================
  // --- FLOOR 1: STARTUP ALLEY (ALAMEDA DE STARTUPS) ---
  // =======================================================
  {
    id: 'pod-startup-1',
    name: 'Veloce AI (Entregas Autônomas)',
    shortName: 'Veloce AI',
    boothNumber: 'S101',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-4.5, 0.8, 14],
    dimensions: [3.2, 1.6, 3.2],
    color: '#0ea5e9',
    zone: 'Alameda de Startups',
    description: 'Robótica de micro-entregas expressas urbanas com zero emissões.',
  },
  {
    id: 'pod-startup-2',
    name: 'Synapse Biosystems',
    shortName: 'Synapse',
    boothNumber: 'S102',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [4.5, 0.8, 14],
    dimensions: [3.2, 1.6, 3.2],
    color: '#14b8a6',
    zone: 'Alameda de Startups',
    description: 'Wearables de interface neural para acessibilidade motora e fala assistida.',
  },
  {
    id: 'pod-startup-3',
    name: 'PulseFlow Security',
    shortName: 'PulseFlow',
    boothNumber: 'S103',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-4.5, 0.8, 20],
    dimensions: [3.2, 1.6, 3.2],
    color: '#f43f5e',
    zone: 'Alameda de Startups',
    description: 'Malha de segurança zero-trust para microsserviços corporativos.',
  },
  {
    id: 'pod-startup-4',
    name: 'HoloGraph 3D',
    shortName: 'HoloGraph',
    boothNumber: 'S104',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [4.5, 0.8, 20],
    dimensions: [3.2, 1.6, 3.2],
    color: '#a855f7',
    zone: 'Alameda de Startups',
    description: 'Streaming volumétrico 3D direto no navegador de smartphones.',
  },

  // ===============================================================
  // --- FLOOR 1: PRAÇA DE ALIMENTAÇÃO & LOUNGE (LESTE SUL) ---
  // ===============================================================
  {
    id: 'food-court-1',
    name: 'Cafeteria Artesanal & Lanches',
    shortName: 'Café & Snacks',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [27, 0.9, 15],
    dimensions: [8, 1.8, 5],
    color: '#ea580c',
    accentColor: '#fb923c',
    zone: 'Praça de Alimentação & Lounge',
    description: 'Espresso especial, opções sem glúten, bebidas vegetais e mesas acessíveis.',
  },
  {
    id: 'food-court-2',
    name: 'Praça Gourmet & Bebidas',
    shortName: 'Praça Gourmet',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [27, 0.9, 22],
    dimensions: [8, 1.8, 5],
    color: '#db2777',
    accentColor: '#f472b6',
    zone: 'Praça de Alimentação & Lounge',
    description: 'Cardápio variado com opções veganas, pratos rápidos e mesas com altura adaptada.',
  },

  // ===============================================================
  // --- FLOOR 2: WORKSHOPS & VIP MEZZANINE ---
  // ===============================================================
  {
    id: 'workshop-room-a',
    name: 'Sala de Workshop A: IA Agêntica',
    shortName: 'Workshop A',
    category: 'workshop',
    floor: 2,
    position: [-16, 7.5, -8],
    dimensions: [12, 2.5, 8],
    color: '#4f46e5',
    accentColor: '#818cf8',
    zone: 'Salas de Workshop',
    isAccessible: true,
    description: 'Laboratório prático de código com bancadas acessíveis, pontos de energia e Wi-Fi de alta densidade.',
    sessions: [
      { id: 'w1', title: 'Hands-on: Fine-Tuning de LLMs Abertos', speaker: 'David Kim', time: '11:00 - 13:00', isLiveNow: true },
    ],
  },
  {
    id: 'workshop-room-b',
    name: 'Sala de Workshop B: WebGL & 3D',
    shortName: 'Workshop B',
    category: 'workshop',
    floor: 2,
    position: [16, 7.5, -8],
    dimensions: [12, 2.5, 8],
    color: '#0891b2',
    accentColor: '#22d3ee',
    zone: 'Salas de Workshop',
    isAccessible: true,
    description: 'Programação de gráficos interativos com Three.js e WebGPU.',
    sessions: [
      { id: 'w3', title: 'Introdução ao Three.js de Alta Performance', speaker: 'Chloe Martin', time: '11:30 - 13:30' },
    ],
  },
  {
    id: 'vip-lounge',
    name: 'Lounge Executivo VIP & Palestrantes',
    shortName: 'Lounge VIP',
    category: 'booth',
    tier: 'diamond',
    floor: 2,
    position: [0, 7.5, -14],
    dimensions: [12, 2.5, 6],
    color: '#ca8a04',
    accentColor: '#facc15',
    zone: 'Lounge VIP & Palestrantes',
    isAccessible: true,
    description: 'Espaço exclusivo com catering dedicado e salas reservadas para imprensa e oradores.',
  },
  {
    id: 'mezzanine-restroom',
    name: 'Sanitários Mezanino (Piso 2)',
    shortName: 'Sanitários 2F',
    category: 'restroom',
    tier: 'facility',
    floor: 2,
    position: [-24, 7.3, 0],
    dimensions: [4, 1.6, 5],
    color: '#64748b',
    zone: 'Facilidades',
    isAccessible: true,
    description: 'Sanitários adaptados no segundo piso com barras de apoio.',
  },
];

// Waypoint Graph with Sensory & Accessibility Attributes (Orthogonal Grid)
export const VENUE_WAYPOINTS: WaypointNode[] = [
  // --- FLOOR 1: CONCURSO CENTRAL (X = 0) ---
  { id: 'wp_saida_sul', x: 0, z: 28, floor: 1, name: 'Saída de Emergência Sul', isEmergencyExit: true },
  { id: 'wp_entrance', x: 0, z: 24, floor: 1, name: 'Entrada Principal' },
  { id: 'wp_concourse_south', x: 0, z: 16, floor: 1, name: 'Concurso Sul & Central' },
  { id: 'wp_info_desk', x: 0, z: 9, floor: 1, name: 'Balcão de Informações' },
  { id: 'wp_concourse_mid', x: 0, z: 2, floor: 1, name: 'Concurso Central (Centro)' },
  { id: 'wp_concourse_north', x: 0, z: -12, floor: 1, name: 'Concurso Norte & Mezanino' },
  { id: 'wp_stairs_f1', x: -2.5, z: -16, floor: 1, name: 'Escada para 2F', isStairs: true },
  { id: 'wp_elevator_f1', x: 2.5, z: -16, floor: 1, name: 'Elevador Acessível 1F', isElevator: true },
  { id: 'wp_saida_norte', x: 0, z: -24, floor: 1, name: 'Saída de Emergência Norte', isEmergencyExit: true },

  // --- FLOOR 1: CONCURSO SUL (Z = 16) ---
  { id: 'wp_saida_oeste', x: -34, z: 16, floor: 1, name: 'Saída Acessível Oeste', isEmergencyExit: true },
  { id: 'wp_sala_acolhimento', x: -27, z: 16, floor: 1, name: 'Sala de Acolhimento' },
  { id: 'wp_sc_w2', x: -20, z: 16, floor: 1, name: 'Alameda 200 & Concurso Sul' },
  { id: 'wp_sc_w1', x: -10, z: 16, floor: 1, name: 'Alameda 100 & Concurso Sul' },
  { id: 'wp_sc_e1', x: 10, z: 16, floor: 1, name: 'Alameda 300 & Concurso Sul' },
  { id: 'wp_sc_e2', x: 20, z: 16, floor: 1, name: 'Alameda 400 & Concurso Sul' },
  { id: 'wp_food_court_1', x: 26, z: 16, floor: 1, name: 'Cafeteria & Lounge' },
  { id: 'wp_food_court_2', x: 26, z: 22, floor: 1, name: 'Praça Gourmet' },

  // --- FLOOR 1: CONCURSO CENTRAL (Z = 2) ---
  { id: 'wp_mc_w2', x: -20, z: 2, floor: 1, name: 'Alameda 200 & Concurso Central' },
  { id: 'wp_mc_w1', x: -10, z: 2, floor: 1, name: 'Alameda 100 & Concurso Central' },
  { id: 'wp_mc_e1', x: 10, z: 2, floor: 1, name: 'Alameda 300 & Concurso Central' },
  { id: 'wp_mc_e2', x: 20, z: 2, floor: 1, name: 'Alameda 400 & Concurso Central' },

  // --- FLOOR 1: CONCURSO NORTE (Z = -12) ---
  { id: 'wp_main_stage_front', x: -22, z: -14, floor: 1, name: 'Entrada Palco Principal' },
  { id: 'wp_nc_w2', x: -20, z: -12, floor: 1, name: 'Alameda 200 & Concurso Norte' },
  { id: 'wp_nc_w1', x: -10, z: -12, floor: 1, name: 'Alameda 100 & Concurso Norte' },
  { id: 'wp_nc_e1', x: 10, z: -12, floor: 1, name: 'Alameda 300 & Concurso Norte' },
  { id: 'wp_nc_e2', x: 20, z: -12, floor: 1, name: 'Alameda 400 & Concurso Norte' },
  { id: 'wp_tech_stage_front', x: 22, z: -14, floor: 1, name: 'Entrada Palco DevTech' },

  // --- FLOOR 1: AISLE 200 & 400 AMENITIES ---
  { id: 'wp_restroom_west', x: -20, z: -5, floor: 1, name: 'Sanitários Oeste' },
  { id: 'wp_restroom_east', x: 20, z: -5, floor: 1, name: 'Sanitários Leste' },

  // --- FLOOR 1: STARTUP ALLEY LANES ---
  { id: 'wp_startup_w', x: -4.5, z: 17, floor: 1, name: 'Alameda Startups Oeste' },
  { id: 'wp_startup_e', x: 4.5, z: 17, floor: 1, name: 'Alameda Startups Leste' },

  // --- FLOOR 2: WORKSHOPS & VIP MEZZANINE ---
  { id: 'wp_stairs_f2', x: -2.5, z: -16, floor: 2, name: 'Escada vindo de 1F', isStairs: true },
  { id: 'wp_elevator_f2', x: 2.5, z: -16, floor: 2, name: 'Elevador Acessível 2F', isElevator: true },
  { id: 'wp_f2_landing', x: 0, z: -12, floor: 2, name: 'Hall Mezanino' },
  { id: 'wp_f2_vip', x: 0, z: -14, floor: 2, name: 'Entrada Lounge VIP' },
  { id: 'wp_f2_west', x: -16, z: -12, floor: 2, name: 'Corredor Workshop A' },
  { id: 'wp_f2_east', x: 16, z: -12, floor: 2, name: 'Corredor Workshop B' },
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
  // FLOOR 1: SOUTH CONCOURSE (Z = 16)
  // ===============================================
  // Calm, sensory-friendly route to Sala de Acolhimento & Saída Oeste
  { from: 'wp_saida_oeste', to: 'wp_sala_acolhimento', lotacao: 1, ruido: 1 },
  { from: 'wp_sala_acolhimento', to: 'wp_sc_w2', lotacao: 1, ruido: 1 },

  // Cross-Concourse Grid
  { from: 'wp_sc_w2', to: 'wp_sc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_w1', to: 'wp_concourse_south', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_south', to: 'wp_sc_e1', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_e1', to: 'wp_sc_e2', lotacao: 2, ruido: 2 },
  { from: 'wp_sc_e2', to: 'wp_food_court_1', lotacao: 3, ruido: 3 },
  { from: 'wp_food_court_1', to: 'wp_food_court_2', lotacao: 3, ruido: 3 },

  // ===============================================
  // FLOOR 1: MID CONCOURSE (Z = 2)
  // ===============================================
  { from: 'wp_mc_w2', to: 'wp_mc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w1', to: 'wp_concourse_mid', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_mid', to: 'wp_mc_e1', lotacao: 3, ruido: 3 },
  { from: 'wp_mc_e1', to: 'wp_mc_e2', lotacao: 2, ruido: 2 },

  // ===============================================
  // FLOOR 1: NORTH CONCOURSE (Z = -12)
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
  // Alameda 100 (X = -10)
  { from: 'wp_sc_w1', to: 'wp_mc_w1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w1', to: 'wp_nc_w1', lotacao: 3, ruido: 3 },

  // Alameda 200 (X = -20)
  { from: 'wp_sc_w2', to: 'wp_mc_w2', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_w2', to: 'wp_restroom_west', lotacao: 2, ruido: 2 },
  { from: 'wp_restroom_west', to: 'wp_nc_w2', lotacao: 3, ruido: 3 },

  // Alameda 300 (X = 10)
  { from: 'wp_sc_e1', to: 'wp_mc_e1', lotacao: 2, ruido: 2 },
  { from: 'wp_mc_e1', to: 'wp_nc_e1', lotacao: 3, ruido: 3 },

  // Alameda 400 (X = 20)
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
