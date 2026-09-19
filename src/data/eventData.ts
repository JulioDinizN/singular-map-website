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
  // --- FOYER DE ENTRADA & FACILIDADES (SUL) ---
  // ==========================================
  {
    id: 'entrance-main',
    name: 'Pórtico de Entrada & Credenciamento (São Paulo Expo)',
    shortName: 'Entrada Principal',
    category: 'entrance',
    tier: 'facility',
    floor: 1,
    position: [0, 0.5, 28.5],
    dimensions: [12, 1.2, 3],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Foyer de Entrada & Credenciamento',
    isAccessible: true,
    description: 'Pórtico monumental de entrada do São Paulo Expo: check-in digital por QR code, impressão de crachás e filas prioritárias NBR 9050 para PCDs, idosos, gestantes e neurodivergentes.',
  },
  {
    id: 'saida-sul',
    name: 'Saída de Emergência Sul (Boulevard)',
    shortName: 'Saída Sul',
    category: 'exit',
    floor: 1,
    position: [0, 0.6, 31],
    dimensions: [8, 1.2, 1.5],
    color: '#16a34a',
    accentColor: '#4ade80',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Portas antipânico automáticas no nível da rua com rampas suaves de escoamento e acesso imediato ao bolsão de vans acessíveis.',
  },
  {
    id: 'saida-acessivel-oeste',
    name: 'Saída de Emergência Oeste (100% Acessível NBR 9050)',
    shortName: 'Saída Acessível Oeste',
    category: 'exit',
    floor: 1,
    position: [-36, 0.6, 22],
    dimensions: [4, 1.2, 2],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Rota de fuga prioritária com piso tátil direcional e de alerta, sinalização estroboscópica para pessoas surdas e rampa suave contígua ao Espaço Girassol.',
  },
  {
    id: 'saida-norte',
    name: 'Saída de Emergência Norte (Fundos das Arenas)',
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
    description: 'Saída de emergência aos fundos dos palcos com barras antipânico e sinalização fotoluminescente de alta intensidade.',
  },
  {
    id: 'info-desk',
    name: 'Central de Acessibilidade, Libras & Informações',
    shortName: 'Central de Acessibilidade',
    category: 'info',
    tier: 'facility',
    floor: 1,
    position: [-10, 0.9, 25],
    dimensions: [4, 1.8, 2.5],
    color: '#0284c7',
    accentColor: '#38bdf8',
    zone: 'Foyer de Entrada',
    isAccessible: true,
    description: 'Ponto de atendimento prioritário no foyer do São Paulo Expo: equipe de intérpretes presenciais de Libras, empréstimo gratuito de cadeiras de rodas motorizadas, fones abafadores de ruído, cordões de girassol e guias videntes.',
  },

  // =======================================================
  // --- SALA DE ACOLHIMENTO (ESPAÇO GIRASSOL) ---
  // =======================================================
  {
    id: 'sala-acolhimento',
    name: 'Sala de Acolhimento & Neurodiversidade (Espaço Girassol)',
    shortName: 'Sala de Acolhimento',
    category: 'quiet_room',
    floor: 1,
    position: [-26, 1.2, 22],
    dimensions: [11, 2.4, 7],
    color: '#0d9488',
    accentColor: '#2dd4bf',
    zone: 'Espaço de Descompressão',
    isAccessible: true,
    isQuietZone: true,
    description: 'Espaço sensorialmente neutro com isolamento acústico especial, iluminação indireta quente dimerizável, poltronas ergonômicas de repouso, abafadores sonoros e suporte especializado para pessoas no espectro autista (TEA), TDAH ou em crise de sobrecarga sensorial.',
  },

  // ==========================================
  // --- SANITÁRIOS (NBR 9050) ---
  // ==========================================
  {
    id: 'restroom-west',
    name: 'Sanitários Acessíveis & Bebedouros (Pavilhão 1 Oeste)',
    shortName: 'Sanitários Oeste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [-32, 0.8, -10],
    dimensions: [5, 1.8, 6],
    color: '#64748b',
    zone: 'Rua 200',
    isAccessible: true,
    description: 'Bateria de sanitários 100% acessíveis conforme a NBR 9050 com barras de apoio em aço inox, campainhas de emergência, trocador adaptado e bebedouros com acionamento baixo.',
  },
  {
    id: 'restroom-east',
    name: 'Sanitários & Bebedouros (Pavilhão 2 Leste)',
    shortName: 'Sanitários Leste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [33, 0.8, -10],
    dimensions: [5, 1.8, 6],
    color: '#64748b',
    zone: 'Rua 400',
    isAccessible: true,
    description: 'Sanitários masculinos, femininos e cabine acessível individual com alarme sonoro de emergência e bebedouro refrigerado duplo.',
  },

  // ==========================================
  // --- GRANDES ARENAS PLENÁRIAS (NORTE) ---
  // ==========================================
  {
    id: 'stage-main',
    name: 'Arena Principal Keynote (Palco Brasil)',
    shortName: 'Palco Brasil',
    category: 'stage',
    floor: 1,
    position: [-20, 1.5, -22],
    dimensions: [20, 3.2, 11],
    color: '#7c3aed',
    accentColor: '#a78bfa',
    zone: 'Avenida dos Palcos (Norte)',
    isAccessible: true,
    description: 'Grande plenária do São Paulo Expo com capacidade para 1.500 pessoas: telão curvo de LED de alta definição com 16 metros, tradução simultânea em Libras presencial, closed caption nos telões, área reservada para cadeirantes na primeira fila com visão 100% desobstruída e sistema de aro magnético para pessoas com deficiência auditiva.',
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
    position: [20, 1.2, -22],
    dimensions: [18, 2.6, 11],
    color: '#2563eb',
    accentColor: '#60a5fa',
    zone: 'Avenida dos Palcos (Norte)',
    isAccessible: true,
    description: 'Arena técnica aberta com fones de áudio sem fio multicanal (Silent Stage), espaço para 600 desenvolvedores, demonstrações ao vivo de código e acessibilidade completa.',
    sessions: [
      { id: 's4', title: 'Arquiteturas Escaláveis de Nuvem e Open Finance', speaker: 'Silvio Meira (Cientista-Chefe TDS Company)', time: '10:00 - 10:45', isLiveNow: true },
      { id: 's5', title: 'Modelos de IA Abertos e Soberania de Dados Nacional', speaker: 'Dra. Bianca Zadrozny (Líder de Pesquisa em IA IBM Brasil)', time: '11:30 - 12:15' },
    ],
  },

  // =========================================================================
  // --- PAVILHÃO 1 (OESTE): GRANDES ILHAS DE INOVAÇÃO & IA ---
  // =========================================================================
  {
    id: 'booth-nubank',
    name: 'Nubank • Inovação Financeira & Nu AI',
    shortName: 'Nubank',
    boothNumber: 'A101',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-18, 1.3, 1],
    dimensions: [14, 2.6, 10],
    color: '#820AD1',
    accentColor: '#a855f7',
    zone: 'Boulevard Central • Estande Ilha A101',
    isAccessible: true,
    description: 'Mega-ilha corporativa de 140m² do Nubank de 4 frentes abertas: lounge executivo, bancadas de teste do assistente autônomo Nu AI, consultoria de engenharia de software e distribuição do kit Nu 2026.',
    sessions: [
      { id: 'nb1', title: 'Arquitetura dos Agentes Autônomos no App Nubank', speaker: 'Engenharia Nu AI', time: '10:30 - 11:00', isLiveNow: true },
      { id: 'nb2', title: 'Carreiras Tech no Maior Neobanco do Ocidente', speaker: 'Time de Pessoas & Cultura', time: '13:30 - 14:15' },
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
    position: [-32, 1.1, 1],
    dimensions: [8, 2.2, 8],
    color: '#EA1D2C',
    accentColor: '#ff5252',
    zone: 'Rua 200 • Robótica',
    isAccessible: true,
    description: 'Estande interativo com arena circular de demonstração em tempo real dos robôs de entrega autônomos nacionais (Ada) e simulador de despacho logístico por IA.',
  },
  {
    id: 'booth-mercadolivre',
    name: 'Mercado Livre & Mercado Pago',
    shortName: 'Mercado Livre',
    boothNumber: 'A102',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-18, 1.2, -10],
    dimensions: [12, 2.4, 8],
    color: '#FFE600',
    accentColor: '#2D3277',
    zone: 'Rua 100 • Logística & Pagamentos',
    isAccessible: true,
    description: 'Ilha tecnológica com esteira automatizada demonstrando separação por visão computacional e APIs abertas do Mercado Pago.',
    sessions: [
      { id: 'meli1', title: 'Logística Inteligente e Roteirização em Escala Continental', speaker: 'Meli Tech Labs', time: '11:00 - 11:45' },
      { id: 'meli2', title: 'Open Source e Soluções Financeiras Inclusivas', speaker: 'Equipe Mercado Pago', time: '14:30 - 15:15' },
    ],
  },

  // =========================================================================
  // --- PAVILHÃO 2 (LESTE): FINTECH, NUVEM & MOBILIDADE AÉREA ---
  // =========================================================================
  {
    id: 'booth-itau',
    name: 'Itaú BBA & Open Finance Brasil',
    shortName: 'Itaú BBA',
    boothNumber: 'B301',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [18, 1.3, 1],
    dimensions: [12, 2.6, 10],
    color: '#EC7000',
    accentColor: '#003399',
    zone: 'Boulevard Central • Estande Ilha B301',
    isAccessible: true,
    description: 'Grande ilha de 120m² com mini-auditório interno com fones sem fio, ativações interativas sobre Pix por aproximação e ecossistema de APIs do Open Finance.',
  },
  {
    id: 'booth-totvs',
    name: 'TOTVS • Tecnologia & ERP em Nuvem',
    shortName: 'TOTVS',
    boothNumber: 'B302',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [31, 1.1, 1],
    dimensions: [8, 2.2, 8],
    color: '#004F9F',
    accentColor: '#0080ff',
    zone: 'Rua 400 • Software & Nuvem',
    isAccessible: true,
    description: 'Estande com estações de demonstração de software empresarial em nuvem, inteligência de negócios brasileira e aceleração digital corporativa.',
  },
  {
    id: 'booth-eve',
    name: 'Embraer Eve • Mobilidade Aérea Urbana (eVTOL)',
    shortName: 'Embraer Eve',
    boothNumber: 'B401',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [20, 1.2, -10],
    dimensions: [14, 2.4, 8],
    color: '#002776',
    accentColor: '#009B3A',
    zone: 'Rua 300 • Mobilidade & Dados',
    isAccessible: true,
    description: 'Área especial de exposição do mockup em tamanho real da cabine do eVTOL (carro voador elétrico) projetado no Brasil, com simulador imersivo de voo urbano e software de controle do espaço aéreo.',
  },

  // ==================================================================
  // --- ALAMEDA DE STARTUPS BRASIL (RUA MODULAR PADRONIZADA) ---
  // ==================================================================
  {
    id: 'pod-startup-1',
    name: 'QuintoAndar (PropTech & Moradia)',
    shortName: 'QuintoAndar',
    boothNumber: 'S101',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-5, 0.9, 18],
    dimensions: [4, 1.8, 3.5],
    color: '#0041C2',
    accentColor: '#3b82f6',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Estande modular de 14m² com totem de demonstração de vistorias imobiliárias 3D por visão computacional e precificação algorítmica.',
  },
  {
    id: 'pod-startup-2',
    name: 'Stone Pagamentos (Soluções para PMEs)',
    shortName: 'Stone',
    boothNumber: 'S102',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [5, 0.9, 18],
    dimensions: [4, 1.8, 3.5],
    color: '#00A868',
    accentColor: '#10b981',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Estande modular com bancada de soluções financeiras, maquininhas inteligentes e sistemas de gestão integrados para pequenas empresas.',
  },
  {
    id: 'pod-startup-3',
    name: 'Wellhub / Gympass (Saúde & Bem-Estar)',
    shortName: 'Wellhub',
    boothNumber: 'S103',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-5, 0.9, 13],
    dimensions: [4, 1.8, 3.5],
    color: '#f43f5e',
    accentColor: '#fb7185',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Estande de bem-estar com ativações de bioimpedância, ergonomia no trabalho e plataforma corporativa de atividade física e saúde mental.',
  },
  {
    id: 'pod-startup-4',
    name: 'Asaas (Automação Financeira & Cobranças)',
    shortName: 'Asaas',
    boothNumber: 'S104',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [5, 0.9, 13],
    dimensions: [4, 1.8, 3.5],
    color: '#7c3aed',
    accentColor: '#a855f7',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Estande com demonstração de APIs de automação bancária, split de pagamentos e emissão automatizada de notas fiscais para plataformas digitais.',
  },

  // =========================================================================
  // --- PRAÇA GASTRONÔMICA BRASIL (SUL LESTE) ---
  // =========================================================================
  {
    id: 'food-court-1',
    name: 'Cafeteria do Cerrado & Pão de Queijo Canastra',
    shortName: 'Café do Cerrado',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [24, 0.9, 16],
    dimensions: [9, 1.8, 4.5],
    color: '#ea580c',
    accentColor: '#fb923c',
    zone: 'Praça Gastronômica Brasil',
    isAccessible: true,
    description: 'Cafés especiais cultivados no Cerrado Mineiro, pão de queijo da Canastra quentinho, opções veganas, sem lactose e mesas acessíveis com vão livre para cadeirantes.',
  },
  {
    id: 'food-court-2',
    name: 'Praça Gastronômica Brasil & Açaí Orgânico',
    shortName: 'Praça Gastronômica',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [24, 0.9, 23],
    dimensions: [9, 1.8, 4.5],
    color: '#db2777',
    accentColor: '#f472b6',
    zone: 'Praça Gastronômica Brasil',
    isAccessible: true,
    description: 'Estações gastronômicas com refeições rápidas brasileiras, açaí orgânico do Pará, opções vegetarianas e balcões com altura adaptada conforme a NBR 9050.',
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
    position: [-16, 7.5, -6],
    dimensions: [12, 2.5, 8],
    color: '#4f46e5',
    accentColor: '#818cf8',
    zone: 'Mezanino • Workshops',
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
    position: [16, 7.5, -6],
    dimensions: [12, 2.5, 8],
    color: '#0891b2',
    accentColor: '#22d3ee',
    zone: 'Mezanino • Workshops',
    isAccessible: true,
    description: 'Treinamento intensivo de computação gráfica 3D no navegador com Three.js, React Three Fiber e WebGPU.',
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
    position: [0, 7.5, -13],
    dimensions: [14, 2.5, 6],
    color: '#ca8a04',
    accentColor: '#facc15',
    zone: 'Mezanino • Área VIP',
    isAccessible: true,
    description: 'Espaço exclusivo com vista panorâmica para todo o pavilhão do São Paulo Expo, salas de reuniões reservadas e catering executivo.',
  },
  {
    id: 'mezzanine-restroom',
    name: 'Sanitários Mezanino (Piso 2 Acessível)',
    shortName: 'Sanitários 2F',
    category: 'restroom',
    tier: 'facility',
    floor: 2,
    position: [-22, 7.3, 1],
    dimensions: [5, 1.8, 5],
    color: '#64748b',
    zone: 'Mezanino',
    isAccessible: true,
    description: 'Sanitários adaptados no segundo piso com barras de apoio NBR 9050 e botão de socorro com alarme sonoro.',
  },
];

// Waypoint Graph with Sensory & Accessibility Attributes (São Paulo Expo Realistic Grid)
export const VENUE_WAYPOINTS: WaypointNode[] = [
  // --- PISO 1: FOYER DE ENTRADA & SAÍDAS (SUL) ---
  { id: 'wp_saida_sul', x: 0, z: 31, floor: 1, name: 'Saída de Emergência Sul', isEmergencyExit: true },
  { id: 'wp_entrance', x: 0, z: 27, floor: 1, name: 'Pórtico de Entrada Principal' },
  { id: 'wp_foyer_cross', x: 0, z: 25, floor: 1, name: 'Foyer de Entrada (Catracas)' },
  { id: 'wp_info_desk', x: -10, z: 25, floor: 1, name: 'Central de Acessibilidade & Libras' },
  { id: 'wp_saida_oeste', x: -36, z: 22, floor: 1, name: 'Saída Acessível Oeste NBR 9050', isEmergencyExit: true },
  { id: 'wp_sala_acolhimento', x: -26, z: 22, floor: 1, name: 'Espaço Girassol (Acolhimento)' },
  { id: 'wp_acolhimento_door', x: -26, z: 18, floor: 1, name: 'Entrada Sala Acolhimento' },

  // --- PISO 1: BOULEVARD CENTRAL (EIXO X = 0) ---
  { id: 'wp_boulevard_south', x: 0, z: 18, floor: 1, name: 'Boulevard Central (Rua das Startups)' },
  { id: 'wp_boulevard_mid', x: 0, z: 8, floor: 1, name: 'Boulevard Central (Entre Pilares P1 e P2)' },
  { id: 'wp_boulevard_center', x: 0, z: 1, floor: 1, name: 'Boulevard Central (Coração do Evento)' },
  { id: 'wp_boulevard_north', x: 0, z: -7, floor: 1, name: 'Boulevard Central (Entre Pilares P3 e P4)' },
  { id: 'wp_concourse_palcos', x: 0, z: -15, floor: 1, name: 'Avenida dos Palcos & Acesso Mezanino' },
  { id: 'wp_saida_norte', x: 0, z: -26, floor: 1, name: 'Saída de Emergência Norte', isEmergencyExit: true },

  // --- PISO 1: ACESSO VERTICAL AO MEZANINO (2F) ---
  { id: 'wp_stairs_f1', x: -2.5, z: -17, floor: 1, name: 'Escadaria para Mezanino 2F', isStairs: true },
  { id: 'wp_elevator_f1', x: 2.5, z: -17, floor: 1, name: 'Elevador Acessível 1F', isElevator: true },

  // --- PISO 1: RUA 100 (PAVILHÃO 1 - INOVAÇÃO & IA, X = -8) ---
  { id: 'wp_r100_south', x: -8, z: 18, floor: 1, name: 'Rua 100 (Início Sul)' },
  { id: 'wp_r100_p1', x: -8, z: 7, floor: 1, name: 'Rua 100 junto ao Pilar P1' },
  { id: 'wp_r100_center', x: -8, z: 1, floor: 1, name: 'Rua 100 (Acesso Nubank A101)' },
  { id: 'wp_r100_p3', x: -8, z: -5, floor: 1, name: 'Rua 100 junto ao Pilar P3' },
  { id: 'wp_r100_north', x: -8, z: -15, floor: 1, name: 'Rua 100 com Avenida dos Palcos' },

  // --- PISO 1: RUA 200 (PAVILHÃO 1 - TECNOLOGIA & ROBÓTICA, X = -26.5) ---
  { id: 'wp_r200_south', x: -26.5, z: 18, floor: 1, name: 'Rua 200 Sul (Conexão Acolhimento)' },
  { id: 'wp_r200_center', x: -26.5, z: 1, floor: 1, name: 'Rua 200 (Entre Nubank e iFood)' },
  { id: 'wp_r200_restroom', x: -26.5, z: -10, floor: 1, name: 'Rua 200 (Sanitários Oeste & Mercado Livre)' },
  { id: 'wp_r200_north', x: -26.5, z: -15, floor: 1, name: 'Rua 200 com Avenida dos Palcos' },

  // --- PISO 1: RUA 300 (PAVILHÃO 2 - FINTECH & MOBILIDADE, X = 8) ---
  { id: 'wp_r300_south', x: 8, z: 18, floor: 1, name: 'Rua 300 (Início Sul)' },
  { id: 'wp_r300_p2', x: 8, z: 7, floor: 1, name: 'Rua 300 junto ao Pilar P2' },
  { id: 'wp_r300_center', x: 8, z: 1, floor: 1, name: 'Rua 300 (Acesso Itaú BBA B301)' },
  { id: 'wp_r300_p4', x: 8, z: -5, floor: 1, name: 'Rua 300 junto ao Pilar P4' },
  { id: 'wp_r300_north', x: 8, z: -15, floor: 1, name: 'Rua 300 com Avenida dos Palcos' },

  // --- PISO 1: RUA 400 (PAVILHÃO 2 - SOFTWARE & DADOS, X = 25.5) ---
  { id: 'wp_r400_south', x: 25.5, z: 18, floor: 1, name: 'Rua 400 Sul (Praça Gastronômica)' },
  { id: 'wp_r400_center', x: 25.5, z: 1, floor: 1, name: 'Rua 400 (Entre Itaú e TOTVS)' },
  { id: 'wp_r400_north', x: 25.5, z: -15, floor: 1, name: 'Rua 400 com Avenida dos Palcos' },

  // --- PISO 1: PRAÇA GASTRONÔMICA (Leste Z = 16 a 23) ---
  { id: 'wp_food_court_1', x: 24, z: 16, floor: 1, name: 'Cafeteria do Cerrado' },
  { id: 'wp_food_court_2', x: 24, z: 23, floor: 1, name: 'Praça Gastronômica Brasil' },

  // --- PISO 1: ARENAS PLENÁRIAS ---
  { id: 'wp_stage_main_front', x: -18, z: -16, floor: 1, name: 'Entrada Arena Brasil (Palco Principal)' },
  { id: 'wp_stage_tech_front', x: 18, z: -16, floor: 1, name: 'Entrada Palco DevBrasil' },

  // --- PISO 2: MEZANINO DE WORKSHOPS & VIP ---
  { id: 'wp_stairs_f2', x: -2.5, z: -17, floor: 2, name: 'Chegada Escada 2F', isStairs: true },
  { id: 'wp_elevator_f2', x: 2.5, z: -17, floor: 2, name: 'Chegada Elevador Acessível 2F', isElevator: true },
  { id: 'wp_f2_landing', x: 0, z: -13, floor: 2, name: 'Hall Mezanino 2F' },
  { id: 'wp_f2_vip', x: 0, z: -13, floor: 2, name: 'Entrada Lounge VIP' },
  { id: 'wp_f2_west', x: -16, z: -6, floor: 2, name: 'Acesso Workshop A (IA)' },
  { id: 'wp_f2_east', x: 16, z: -6, floor: 2, name: 'Acesso Workshop B (Web3D)' },
  { id: 'wp_f2_restroom', x: -22, z: 1, floor: 2, name: 'Sanitários Mezanino 2F' },
];

export const VENUE_EDGES: WaypointEdge[] = [
  // ===============================================
  // PISO 1: FOYER DE ENTRADA & SAÍDAS (SUL)
  // ===============================================
  { from: 'wp_saida_sul', to: 'wp_entrance', lotacao: 1, ruido: 1 },
  { from: 'wp_entrance', to: 'wp_foyer_cross', lotacao: 3, ruido: 2 },
  { from: 'wp_foyer_cross', to: 'wp_info_desk', lotacao: 2, ruido: 2 },
  { from: 'wp_foyer_cross', to: 'wp_boulevard_south', lotacao: 3, ruido: 2 },
  { from: 'wp_info_desk', to: 'wp_sala_acolhimento', lotacao: 1, ruido: 1 },
  { from: 'wp_sala_acolhimento', to: 'wp_acolhimento_door', lotacao: 1, ruido: 1 },
  { from: 'wp_sala_acolhimento', to: 'wp_saida_oeste', lotacao: 1, ruido: 1 },
  { from: 'wp_acolhimento_door', to: 'wp_r200_south', lotacao: 1, ruido: 1 },

  // ===============================================
  // PISO 1: BOULEVARD CENTRAL (EIXO X = 0)
  // ===============================================
  { from: 'wp_boulevard_south', to: 'wp_boulevard_mid', lotacao: 3, ruido: 2 },
  { from: 'wp_boulevard_mid', to: 'wp_boulevard_center', lotacao: 4, ruido: 3 },
  { from: 'wp_boulevard_center', to: 'wp_boulevard_north', lotacao: 3, ruido: 3 },
  { from: 'wp_boulevard_north', to: 'wp_concourse_palcos', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_palcos', to: 'wp_saida_norte', lotacao: 1, ruido: 1 },

  // Acesso Vertical (Escadas & Elevador)
  { from: 'wp_concourse_palcos', to: 'wp_stairs_f1', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_palcos', to: 'wp_elevator_f1', lotacao: 1, ruido: 1 },

  // ===============================================
  // PISO 1: CONCURSO SUL (Z = 18 - STARTUPS & GASTRONOMIA)
  // ===============================================
  { from: 'wp_r200_south', to: 'wp_r100_south', lotacao: 2, ruido: 2 },
  { from: 'wp_r100_south', to: 'wp_boulevard_south', lotacao: 3, ruido: 2 },
  { from: 'wp_boulevard_south', to: 'wp_r300_south', lotacao: 3, ruido: 2 },
  { from: 'wp_r300_south', to: 'wp_r400_south', lotacao: 2, ruido: 2 },
  { from: 'wp_r400_south', to: 'wp_food_court_1', lotacao: 3, ruido: 3 },
  { from: 'wp_food_court_1', to: 'wp_food_court_2', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: RUA 100 (PAVILHÃO 1 - INOVAÇÃO & IA, X = -8)
  // ===============================================
  { from: 'wp_r100_south', to: 'wp_r100_p1', lotacao: 2, ruido: 2 },
  { from: 'wp_r100_p1', to: 'wp_r100_center', lotacao: 3, ruido: 3 },
  { from: 'wp_r100_center', to: 'wp_r100_p3', lotacao: 3, ruido: 3 },
  { from: 'wp_r100_p3', to: 'wp_r100_north', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: RUA 200 (PAVILHÃO 1 - ROBÓTICA, X = -26.5)
  // ===============================================
  { from: 'wp_r200_south', to: 'wp_r200_center', lotacao: 2, ruido: 2 },
  { from: 'wp_r200_center', to: 'wp_r200_restroom', lotacao: 2, ruido: 2 },
  { from: 'wp_r200_restroom', to: 'wp_r200_north', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: RUA 300 (PAVILHÃO 2 - FINTECH & MOBILIDADE, X = 8)
  // ===============================================
  { from: 'wp_r300_south', to: 'wp_r300_p2', lotacao: 2, ruido: 2 },
  { from: 'wp_r300_p2', to: 'wp_r300_center', lotacao: 3, ruido: 3 },
  { from: 'wp_r300_center', to: 'wp_r300_p4', lotacao: 3, ruido: 3 },
  { from: 'wp_r300_p4', to: 'wp_r300_north', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: RUA 400 (PAVILHÃO 2 - SOFTWARE & NUVEM, X = 25.5)
  // ===============================================
  { from: 'wp_r400_south', to: 'wp_r400_center', lotacao: 2, ruido: 2 },
  { from: 'wp_r400_center', to: 'wp_r400_north', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: CRUZAMENTO CENTRAL (Z = 1)
  // ===============================================
  { from: 'wp_r200_center', to: 'wp_r100_center', lotacao: 3, ruido: 3 },
  { from: 'wp_r100_center', to: 'wp_boulevard_center', lotacao: 4, ruido: 3 },
  { from: 'wp_boulevard_center', to: 'wp_r300_center', lotacao: 4, ruido: 3 },
  { from: 'wp_r300_center', to: 'wp_r400_center', lotacao: 3, ruido: 3 },

  // ===============================================
  // PISO 1: AVENIDA DOS PALCOS (Z = -15)
  // ===============================================
  { from: 'wp_stage_main_front', to: 'wp_r200_north', lotacao: 4, ruido: 4 },
  { from: 'wp_r200_north', to: 'wp_r100_north', lotacao: 3, ruido: 3 },
  { from: 'wp_r100_north', to: 'wp_concourse_palcos', lotacao: 3, ruido: 3 },
  { from: 'wp_concourse_palcos', to: 'wp_r300_north', lotacao: 3, ruido: 3 },
  { from: 'wp_r300_north', to: 'wp_r400_north', lotacao: 3, ruido: 3 },
  { from: 'wp_r400_north', to: 'wp_stage_tech_front', lotacao: 4, ruido: 4 },

  // ===============================================
  // CONEXÕES VERTICAIS (1F <-> 2F)
  // ===============================================
  { from: 'wp_stairs_f1', to: 'wp_stairs_f2', temEscada: true, lotacao: 2, ruido: 2 },
  { from: 'wp_elevator_f1', to: 'wp_elevator_f2', isElevador: true, lotacao: 1, ruido: 1 },

  // ===============================================
  // PISO 2: MEZANINO DE WORKSHOPS & VIP
  // ===============================================
  { from: 'wp_stairs_f2', to: 'wp_f2_landing', lotacao: 1, ruido: 1 },
  { from: 'wp_elevator_f2', to: 'wp_f2_landing', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_landing', to: 'wp_f2_vip', lotacao: 2, ruido: 2 },
  { from: 'wp_f2_landing', to: 'wp_f2_west', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_landing', to: 'wp_f2_east', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_west', to: 'wp_f2_restroom', lotacao: 1, ruido: 1 },
];
