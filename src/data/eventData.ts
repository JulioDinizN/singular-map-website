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
  { id: 'boulevard', name: 'Boulevard Central', color: '#0284c7', floor: 1 },
  { id: 'rua-100', name: 'Rua 100 • Inovação', color: '#820AD1', floor: 1 },
  { id: 'rua-200', name: 'Rua 200 • Robótica & Fintech', color: '#EA1D2C', floor: 1 },
  { id: 'rua-300', name: 'Rua 300 • Logística & ERP', color: '#004F9F', floor: 1 },
  { id: 'rua-400', name: 'Rua 400 • Mobilidade & Dados', color: '#002776', floor: 1 },
  { id: 'avenida-palcos', name: 'Avenida dos Palcos (Norte)', color: '#7c3aed', floor: 1 },
  { id: 'startup-alley', name: 'Rua das Startups Brasil', color: '#f59e0b', floor: 1 },
  { id: 'food-court', name: 'Food Court & Cafeteria Brasil', color: '#ea580c', floor: 1 },
  { id: 'lobby', name: 'Lobby de Entrada & Credenciamento', color: '#16a34a', floor: 1 },
  { id: 'workshops', name: 'Salas de Workshop & Imersão', color: '#6366f1', floor: 2 },
  { id: 'vip-lounge', name: 'Lounge VIP & Conexões', color: '#ca8a04', floor: 2 },
];

export const POI_LIST: POI[] = [
  // =========================================================================
  // --- ENTRADA PRINCIPAL & LOBBY (SUL) ---
  // =========================================================================
  {
    id: 'entrance-main',
    name: 'Pórtico de Entrada Principal (São Paulo Expo)',
    shortName: 'Entrada Principal',
    category: 'entrance',
    tier: 'facility',
    floor: 1,
    position: [0.06, 0.6, 19.0],
    dimensions: [8.0, 1.2, 1.5],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Lobby de Entrada & Credenciamento',
    isAccessible: true,
    description: 'Pórtico de entrada com portas automáticas de vidro, catracas eletrônicas biométricas e filas prioritárias NBR 9050 para PCDs, idosos e neurodivergentes.',
  },
  {
    id: 'lobby-reception',
    name: 'Balcão de Credenciamento & Central de Acessibilidade',
    shortName: 'Credenciamento & Libras',
    category: 'info',
    tier: 'facility',
    floor: 1,
    position: [-5.5, 0.8, 16.63],
    dimensions: [6.0, 1.5, 2.0],
    color: '#0284c7',
    accentColor: '#38bdf8',
    zone: 'Lobby de Entrada & Credenciamento',
    isAccessible: true,
    description: 'Balcão de credenciamento do São Paulo Expo: impressão rápida de crachás, equipe presencial de intérpretes de Libras, empréstimo de fones abafadores e cordões de girassol.',
  },
  {
    id: 'saida-sul',
    name: 'Saída de Emergência Sul (Lobby)',
    shortName: 'Saída Sul',
    category: 'exit',
    floor: 1,
    position: [0.06, 0.6, 19.4],
    dimensions: [6.0, 1.2, 1.0],
    color: '#16a34a',
    accentColor: '#4ade80',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Portas de emergência com barra antipânico de fácil abertura com acesso direto ao bolsão de vans e ambulâncias.',
  },
  {
    id: 'saida-oeste-meio',
    name: 'Saída de Emergência Oeste (Central)',
    shortName: 'Saída Oeste',
    category: 'exit',
    floor: 1,
    position: [-35.41, 0.6, 0.58],
    dimensions: [1.0, 1.2, 3.0],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência lateral oeste com rampa suave e iluminação fotoluminescente de alta intensidade.',
  },
  {
    id: 'saida-oeste-norte',
    name: 'Saída de Emergência Noroeste',
    shortName: 'Saída Noroeste',
    category: 'exit',
    floor: 1,
    position: [-35.41, 0.6, -18.5],
    dimensions: [1.0, 1.2, 3.0],
    color: '#16a34a',
    accentColor: '#22c55e',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência no canto noroeste do pavilhão.',
  },
  {
    id: 'saida-norte',
    name: 'Saída de Emergência Norte (Avenida dos Palcos)',
    shortName: 'Saída Norte',
    category: 'exit',
    floor: 1,
    position: [0.64, 0.6, -20.88],
    dimensions: [4.0, 1.2, 1.0],
    color: '#15803d',
    accentColor: '#86efac',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência aos fundos do pavilhão principal.',
  },
  {
    id: 'saida-leste-norte',
    name: 'Saída de Emergência Nordeste',
    shortName: 'Saída Nordeste',
    category: 'exit',
    floor: 1,
    position: [36.69, 0.6, -18.5],
    dimensions: [1.0, 1.2, 3.0],
    color: '#15803d',
    accentColor: '#86efac',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência no canto nordeste contígua à Cafeteria.',
  },
  {
    id: 'saida-leste-meio',
    name: 'Saída de Emergência Leste (Food Court)',
    shortName: 'Saída Leste',
    category: 'exit',
    floor: 1,
    position: [36.69, 0.6, -0.5],
    dimensions: [1.0, 1.2, 3.0],
    color: '#15803d',
    accentColor: '#86efac',
    zone: 'Saídas de Emergência',
    isAccessible: true,
    isEmergencyExit: true,
    description: 'Saída de emergência direta da Praça Gastronômica.',
  },

  // =========================================================================
  // --- GRANDES ESTANDES ILHA (CONFORME PLANTA BAIXA 100% 1:1) ---
  // =========================================================================
  // 1) NUBANK (Bottom-Left: X=-20.32, Z=4.21, W=9.77, D=6.1)
  {
    id: 'booth-nubank',
    name: 'Nubank • Inovação Financeira & Nu AI',
    shortName: 'Nubank',
    boothNumber: 'A101',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-20.32, 1.3, 4.21],
    dimensions: [9.77, 2.6, 6.1],
    color: '#820AD1',
    accentColor: '#a855f7',
    zone: 'Rua 100 • Estande Ilha A101',
    isAccessible: true,
    description: 'Mega-ilha corporativa do Nubank: balcões curvos característicos, lounge executivo, bancadas de demonstração do Nu AI e distribuição de brindes exclusivos.',
    sessions: [
      { id: 'nb1', title: 'Arquitetura dos Agentes Autônomos no App Nubank', speaker: 'Engenharia Nu AI', time: '10:30 - 11:00', isLiveNow: true },
      { id: 'nb2', title: 'Carreiras Tech no Maior Neobanco do Ocidente', speaker: 'Time de Pessoas & Cultura', time: '13:30 - 14:15' },
    ],
  },

  // 2) iFOOD (Bottom-Center-Left: X=-7.02, Z=4.21, W=8.42, D=6.1)
  {
    id: 'booth-ifood',
    name: 'iFood • Robótica & Inteligência Artificial',
    shortName: 'iFood Tech',
    boothNumber: 'A201',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [-7.02, 1.1, 4.21],
    dimensions: [8.42, 2.2, 6.1],
    color: '#EA1D2C',
    accentColor: '#ff5252',
    zone: 'Rua 200 • Robótica',
    isAccessible: true,
    description: 'Estande com arena de demonstração dos robôs autônomos de entrega brasileiros (Ada) e simulador de inteligência logística.',
  },

  // 3) ITAÚ BBA (Top-Center-Left: X=-7.02, Z=-6.53, W=8.42, D=10.62)
  {
    id: 'booth-itau',
    name: 'Itaú BBA & Open Finance Brasil',
    shortName: 'Itaú BBA',
    boothNumber: 'A202',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [-7.02, 1.3, -6.53],
    dimensions: [8.42, 2.6, 10.62],
    color: '#EC7000',
    accentColor: '#003399',
    zone: 'Rua 200 • Open Finance',
    isAccessible: true,
    description: 'Estande ilha de grande porte do Itaú BBA: lounges curvos, mini-auditório interno com fones sem fio e ativações de Pix por aproximação.',
  },

  // 4) TOTVS (Bottom-Center-Right: X=6.32, Z=4.21, W=7.02, D=6.1)
  {
    id: 'booth-totvs',
    name: 'TOTVS • Tecnologia & ERP em Nuvem',
    shortName: 'TOTVS',
    boothNumber: 'B301',
    category: 'booth',
    tier: 'gold',
    floor: 1,
    position: [6.32, 1.1, 4.21],
    dimensions: [7.02, 2.2, 6.1],
    color: '#004F9F',
    accentColor: '#0080ff',
    zone: 'Rua 300 • Software & Nuvem',
    isAccessible: true,
    description: 'Estande com estações interativas de software empresarial em nuvem, inteligência de negócios e aceleração digital para empresas de todos os portes.',
  },

  // 5) MERCADO LIVRE (Top-Center-Right: X=6.32, Z=-6.53, W=7.02, D=10.62)
  {
    id: 'booth-mercadolivre',
    name: 'Mercado Livre & Mercado Pago',
    shortName: 'Mercado Livre',
    boothNumber: 'B302',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [6.32, 1.2, -6.53],
    dimensions: [7.02, 2.4, 10.62],
    color: '#FFE600',
    accentColor: '#2D3277',
    zone: 'Rua 300 • Logística & Pagamentos',
    isAccessible: true,
    description: 'Ilha tecnológica com esteira automatizada demonstrando separação inteligente por visão computacional e APIs abertas do Mercado Pago.',
    sessions: [
      { id: 'meli1', title: 'Logística Inteligente e Roteirização em Escala Continental', speaker: 'Meli Tech Labs', time: '11:00 - 11:45' },
      { id: 'meli2', title: 'Open Source e Soluções Financeiras Inclusivas', speaker: 'Equipe Mercado Pago', time: '14:30 - 15:15' },
    ],
  },

  // 6) EMBRAER EVE (Bottom-Right: X=18.16, Z=4.21, W=11.17, D=6.1)
  {
    id: 'booth-eve',
    name: 'Embraer Eve • Mobilidade Aérea Urbana (eVTOL)',
    shortName: 'Embraer Eve',
    boothNumber: 'B401',
    category: 'booth',
    tier: 'diamond',
    floor: 1,
    position: [18.16, 1.2, 4.21],
    dimensions: [11.17, 2.4, 6.1],
    color: '#002776',
    accentColor: '#009B3A',
    zone: 'Rua 400 • Mobilidade & Dados',
    isAccessible: true,
    description: 'Área de exibição do mockup em tamanho real da cabine do eVTOL (carro voador elétrico) projetado no Brasil, com simulador imersivo e 3 filas de assentos executivos.',
  },

  // 7) PALCO BRASIL (Top-Right: X=19.56, Z=-8.46, W=14.0, D=14.59 - Full Amphitheater Footprint)
  {
    id: 'stage-main',
    name: 'Arena Principal Keynote (Palco Brasil)',
    shortName: 'Palco Brasil',
    category: 'stage',
    floor: 1,
    position: [19.56, 1.5, -8.46],
    dimensions: [14.0, 3.2, 14.59],
    color: '#7c3aed',
    accentColor: '#a78bfa',
    zone: 'Avenida dos Palcos • Auditório Principal',
    isAccessible: true,
    description: 'Grande auditório em leque com palco curvo monumental, arquibancadas em leque, área técnica de som/luz, tradução em Libras ao vivo e aro magnético para pessoas com deficiência auditiva.',
    sessions: [
      { id: 's1', title: 'Abertura: O Futuro da Tecnologia e IA no Brasil', speaker: 'Cristina Junqueira (Co-fundadora Nubank)', time: '09:30 - 10:45', isLiveNow: true },
      { id: 's2', title: 'Inteligência Artificial Aplicada e Inovação em Escala', speaker: 'Fabricio Bloisi (Presidente Prosus / iFood)', time: '11:15 - 12:30' },
      { id: 's3', title: 'Inclusão Digital e Diversidade no Ecossistema Tech', speaker: 'Nina Silva (Fundadora Movimento Black Money)', time: '14:00 - 15:15' },
    ],
  },

  // =========================================================================
  // --- FOOD COURT & CAFETERIA (ALA LESTE) ---
  // =========================================================================
  {
    id: 'food-court-1',
    name: 'Praça Gastronômica Brasil (Food Court)',
    shortName: 'Food Court',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [29.06, 0.8, -2.5],
    dimensions: [5.0, 1.6, 29.06],
    color: '#ea580c',
    accentColor: '#fb923c',
    zone: 'Food Court & Cafeteria Brasil',
    isAccessible: true,
    description: 'Ampla praça de alimentação com mesas organizadas, cadeiras confortáveis, opções veganas, sem lactose e mesas rebaixadas para cadeirantes conforme NBR 9050.',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria do Cerrado & Lounge Café',
    shortName: 'Cafeteria',
    category: 'food',
    tier: 'facility',
    floor: 1,
    position: [34.09, 0.9, -11.23],
    dimensions: [4.45, 1.8, 8.55],
    color: '#db2777',
    accentColor: '#f472b6',
    zone: 'Food Court & Cafeteria Brasil',
    isAccessible: true,
    description: 'Espaço com baristas especializados em cafés do Cerrado Mineiro, pão de queijo quentinho da Canastra e sofás para bate-papo descontraído.',
  },
  {
    id: 'restroom-east',
    name: 'Sanitários Acessíveis Leste (NBR 9050)',
    shortName: 'Sanitários Leste',
    category: 'restroom',
    tier: 'facility',
    floor: 1,
    position: [33.79, 0.8, 10.5],
    dimensions: [5.06, 1.8, 6.84],
    color: '#64748b',
    zone: 'Food Court & Cafeteria Brasil',
    isAccessible: true,
    description: 'Bateria completa de sanitários masculinos, femininos e cabines individuais 100% acessíveis com barras de apoio e botão de emergência.',
  },

  // =========================================================================
  // --- SALA DE ACOLHIMENTO (ESPAÇO GIRASSOL / DESCOMPRESSÃO) ---
  // =========================================================================
  {
    id: 'sala-acolhimento',
    name: 'Sala de Acolhimento & Neurodiversidade (Espaço Girassol)',
    shortName: 'Sala de Acolhimento',
    category: 'quiet_room',
    floor: 1,
    position: [-25.0, 0.9, -19.5],
    dimensions: [8.0, 1.8, 2.6],
    color: '#0d9488',
    accentColor: '#2dd4bf',
    zone: 'Avenida dos Palcos (Norte)',
    isAccessible: true,
    isQuietZone: true,
    description: 'Ambiente calmo e acolhedor com isolamento acústico especial, iluminação dimerizada suave, fones abafadores e apoio para pessoas autistas ou com sobrecarga sensorial.',
  },

  // =========================================================================
  // --- RUA DAS STARTUPS BRASIL (SUL & OESTE) ---
  // =========================================================================
  {
    id: 'pod-startup-1',
    name: 'QuintoAndar (PropTech & Moradia)',
    shortName: 'QuintoAndar',
    boothNumber: 'S101',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-24.8, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#0041C2',
    accentColor: '#3b82f6',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Estande modular com demonstração de vistorias 3D e precificação inteligente de imóveis.',
  },
  {
    id: 'pod-startup-2',
    name: 'Stone Pagamentos (Soluções PME)',
    shortName: 'Stone',
    boothNumber: 'S102',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-23.4, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#00A868',
    accentColor: '#10b981',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Soluções de pagamento, maquininhas inteligentes e sistemas de gestão integrados para pequenas empresas.',
  },
  {
    id: 'pod-startup-3',
    name: 'Wellhub / Gympass (Saúde & Bem-Estar)',
    shortName: 'Wellhub',
    boothNumber: 'S103',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-22.0, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#f43f5e',
    accentColor: '#fb7185',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Plataforma corporativa de bem-estar, atividade física e cuidados com a saúde mental.',
  },
  {
    id: 'pod-startup-4',
    name: 'Asaas (Automação de Cobranças)',
    shortName: 'Asaas',
    boothNumber: 'S104',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-20.6, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#7c3aed',
    accentColor: '#a855f7',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Automação financeira, emissão de boletos, Pix e notas fiscais automáticas.',
  },
  {
    id: 'pod-startup-5',
    name: 'Brex Brasil (Fintech Corporativa)',
    shortName: 'Brex',
    boothNumber: 'S105',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-19.2, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#ea580c',
    accentColor: '#f97316',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Cartões corporativos globais e software de gestão de despesas para empresas em rápido crescimento.',
  },
  {
    id: 'pod-startup-6',
    name: 'Pipefy (Gestão de Processos)',
    shortName: 'Pipefy',
    boothNumber: 'S106',
    category: 'booth',
    tier: 'startup',
    floor: 1,
    position: [-17.8, 0.9, 13.0],
    dimensions: [1.2, 1.8, 1.8],
    color: '#0284c7',
    accentColor: '#38bdf8',
    zone: 'Rua das Startups Brasil',
    isAccessible: true,
    description: 'Plataforma sem código para automação e otimização de fluxos de trabalho empresariais.',
  },

  // =========================================================================
  // --- PISO 2: MEZANINO DE WORKSHOPS & LOUNGE VIP ---
  // =========================================================================
  {
    id: 'workshop-room-a',
    name: 'Sala de Workshop A: IA Agêntica & Modelos Fundacionais',
    shortName: 'Workshop A (IA)',
    category: 'workshop',
    floor: 2,
    position: [-14.0, 7.5, -15.0],
    dimensions: [12.0, 2.5, 6.0],
    color: '#4f46e5',
    accentColor: '#818cf8',
    zone: 'Mezanino • Workshops',
    isAccessible: true,
    description: 'Laboratório prático de código com bancadas adaptadas, tomadas elétricas em altura padrão NBR 9050 e monitores de alto contraste.',
    sessions: [
      { id: 'w1', title: 'Hands-on: Construindo Agentes de IA com Dados Brasileiros', speaker: 'Equipe Tech Brasil', time: '11:00 - 13:00', isLiveNow: true },
    ],
  },
  {
    id: 'workshop-room-b',
    name: 'Sala de Workshop B: Web3D & Three.js na Prática',
    shortName: 'Workshop B (Web3D)',
    category: 'workshop',
    floor: 2,
    position: [14.0, 7.5, -15.0],
    dimensions: [12.0, 2.5, 6.0],
    color: '#0891b2',
    accentColor: '#22d3ee',
    zone: 'Mezanino • Workshops',
    isAccessible: true,
    description: 'Treinamento intensivo de computação gráfica 3D e experiências interativas no navegador.',
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
    position: [0, 7.5, 16.63],
    dimensions: [14.0, 2.5, 4.5],
    color: '#ca8a04',
    accentColor: '#facc15',
    zone: 'Mezanino • Área VIP',
    isAccessible: true,
    description: 'Espaço VIP exclusivo com vista panorâmica para todo o pavilhão e salas de reuniões executivas reservadas.',
  },
  {
    id: 'mezzanine-restroom',
    name: 'Sanitários Mezanino (Piso 2 Acessível)',
    shortName: 'Sanitários 2F',
    category: 'restroom',
    tier: 'facility',
    floor: 2,
    position: [-10.0, 7.3, 16.63],
    dimensions: [4.0, 1.8, 4.0],
    color: '#64748b',
    zone: 'Mezanino',
    isAccessible: true,
    description: 'Sanitários adaptados no segundo piso com barras de apoio NBR 9050 e botão de socorro.',
  },
];

// Waypoint Graph aligned with the blueprint floorplan aisles
export const VENUE_WAYPOINTS: WaypointNode[] = [
  // --- PISO 1: ENTRADA & LOBBY (SUL) ---
  { id: 'wp_entrance', x: 0.06, z: 19.0, floor: 1, name: 'Pórtico de Entrada Principal' },
  { id: 'wp_saida_sul', x: 0.06, z: 19.4, floor: 1, name: 'Saída de Emergência Sul', isEmergencyExit: true },
  { id: 'wp_lobby_center', x: 0.06, z: 16.63, floor: 1, name: 'Lobby Central' },
  { id: 'wp_reception', x: -5.5, z: 16.63, floor: 1, name: 'Credenciamento & Central de Acessibilidade' },
  { id: 'wp_stairs_left_f1', x: -12.43, z: 16.63, floor: 1, name: 'Escadaria Oeste (Acesso 2F)', isStairs: true },
  { id: 'wp_stairs_right_f1', x: 12.57, z: 16.63, floor: 1, name: 'Escadaria Leste (Acesso 2F)', isStairs: true },
  { id: 'wp_elevator_f1', x: 2.5, z: 15.5, floor: 1, name: 'Elevador Acessível 1F', isElevator: true },

  // --- PISO 1: CONCURSO SUL (Z = 11.5) ---
  { id: 'wp_concourse_s_west', x: -33.8, z: 11.5, floor: 1, name: 'Rua das Startups Oeste' },
  { id: 'wp_concourse_s_nubank', x: -20.32, z: 11.5, floor: 1, name: 'Rua das Startups Sul (Nubank)' },
  { id: 'wp_concourse_s_ifood', x: -7.02, z: 11.5, floor: 1, name: 'Acesso Sul iFood' },
  { id: 'wp_boulevard_south', x: 0.0, z: 11.5, floor: 1, name: 'Boulevard Central (Início Sul)' },
  { id: 'wp_concourse_s_totvs', x: 6.32, z: 11.5, floor: 1, name: 'Acesso Sul TOTVS' },
  { id: 'wp_concourse_s_eve', x: 18.16, z: 11.5, floor: 1, name: 'Acesso Sul Embraer Eve' },
  { id: 'wp_concourse_s_food', x: 29.06, z: 11.5, floor: 1, name: 'Acesso Food Court Sul' },

  // --- PISO 1: BOULEVARD CENTRAL (EIXO X = 0) ---
  { id: 'wp_boulevard_mid_s', x: 0.0, z: 6.0, floor: 1, name: 'Boulevard Central (Entre iFood e TOTVS)' },
  { id: 'wp_boulevard_center', x: 0.0, z: 0.0, floor: 1, name: 'Boulevard Central (Cruzamento Principal)' },
  { id: 'wp_boulevard_mid_n', x: 0.0, z: -6.0, floor: 1, name: 'Boulevard Central (Entre Itaú e Mercado Livre)' },
  { id: 'wp_boulevard_north', x: 0.0, z: -13.5, floor: 1, name: 'Boulevard Central com Avenida dos Palcos' },
  { id: 'wp_saida_norte', x: 0.64, z: -20.88, floor: 1, name: 'Saída de Emergência Norte', isEmergencyExit: true },

  // --- PISO 1: RUA 100 & NUBANK (X = -20.32) ---
  { id: 'wp_r100_nubank_front', x: -20.32, z: 0.0, floor: 1, name: 'Rua 100 (Frente Nubank)' },
  { id: 'wp_r100_north', x: -20.32, z: -13.5, floor: 1, name: 'Rua 100 com Avenida dos Palcos' },

  // --- PISO 1: RUA 200 (ENTRE IFOOD E ITAÚ BBA, Z = 0) ---
  { id: 'wp_r200_center', x: -7.02, z: 0.0, floor: 1, name: 'Rua 200 (Entre iFood e Itaú BBA)' },
  { id: 'wp_r200_north', x: -7.02, z: -13.5, floor: 1, name: 'Rua 200 com Avenida dos Palcos' },

  // --- PISO 1: RUA 300 (ENTRE TOTVS E MERCADO LIVRE, Z = 0) ---
  { id: 'wp_r300_center', x: 6.32, z: 0.0, floor: 1, name: 'Rua 300 (Entre TOTVS e Mercado Livre)' },
  { id: 'wp_r300_north', x: 6.32, z: -13.5, floor: 1, name: 'Rua 300 com Avenida dos Palcos' },

  // --- PISO 1: RUA 400 (ENTRE EMBRAER EVE E PALCO BRASIL, Z = 0) ---
  { id: 'wp_r400_center', x: 18.16, z: 0.0, floor: 1, name: 'Rua 400 (Entre Embraer Eve e Palco Brasil)' },
  { id: 'wp_r400_north', x: 18.16, z: -13.5, floor: 1, name: 'Rua 400 com Avenida dos Palcos' },

  // --- PISO 1: AVENIDA DOS PALCOS (Z = -13.5) ---
  { id: 'wp_palcos_west', x: -25.0, z: -13.5, floor: 1, name: 'Avenida dos Palcos Oeste (Sala de Acolhimento)' },
  { id: 'wp_palcos_stage_front', x: 18.16, z: -15.0, floor: 1, name: 'Entrada Arena Palco Brasil' },
  { id: 'wp_palcos_food_access', x: 29.06, z: -13.5, floor: 1, name: 'Acesso Cafeteria / Food Court' },

  // --- PISO 1: SAÍDAS LATERAIS ---
  { id: 'wp_saida_oeste', x: -35.41, z: 0.58, floor: 1, name: 'Saída de Emergência Oeste', isEmergencyExit: true },
  { id: 'wp_saida_leste', x: 36.69, z: -0.5, floor: 1, name: 'Saída de Emergência Leste', isEmergencyExit: true },

  // --- PISO 1: FOOD COURT & CAFETERIA (ALA LESTE) ---
  { id: 'wp_food_court_mid', x: 29.06, z: 0.0, floor: 1, name: 'Corredor Central Food Court' },
  { id: 'wp_cafeteria_front', x: 34.09, z: -11.23, floor: 1, name: 'Balcão Cafeteria do Cerrado' },
  { id: 'wp_restroom_east', x: 33.79, z: 10.5, floor: 1, name: 'Sanitários Acessíveis Leste' },

  // --- PISO 2: MEZANINO ---
  { id: 'wp_stairs_left_f2', x: -12.43, z: 16.63, floor: 2, name: 'Chegada Escadaria Oeste 2F', isStairs: true },
  { id: 'wp_stairs_right_f2', x: 12.57, z: 16.63, floor: 2, name: 'Chegada Escadaria Leste 2F', isStairs: true },
  { id: 'wp_elevator_f2', x: 2.5, z: 15.5, floor: 2, name: 'Chegada Elevador Acessível 2F', isElevator: true },
  { id: 'wp_f2_vip_lounge', x: 0.0, z: 16.63, floor: 2, name: 'Lounge VIP 2F' },
  { id: 'wp_f2_workshop_a', x: -14.0, z: -15.0, floor: 2, name: 'Sala Workshop A (IA)' },
  { id: 'wp_f2_workshop_b', x: 14.0, z: -15.0, floor: 2, name: 'Sala Workshop B (Web3D)' },
];

export const VENUE_EDGES: WaypointEdge[] = [
  // LOBBY & ENTRADA
  { from: 'wp_entrance', to: 'wp_saida_sul', lotacao: 1, ruido: 1 },
  { from: 'wp_entrance', to: 'wp_lobby_center', lotacao: 3, ruido: 2 },
  { from: 'wp_lobby_center', to: 'wp_reception', lotacao: 2, ruido: 2 },
  { from: 'wp_lobby_center', to: 'wp_stairs_left_f1', lotacao: 1, ruido: 1 },
  { from: 'wp_lobby_center', to: 'wp_stairs_right_f1', lotacao: 1, ruido: 1 },
  { from: 'wp_lobby_center', to: 'wp_elevator_f1', lotacao: 1, ruido: 1 },
  { from: 'wp_lobby_center', to: 'wp_boulevard_south', lotacao: 3, ruido: 2 },

  // CONCURSO SUL (Z = 11.5)
  { from: 'wp_concourse_s_west', to: 'wp_concourse_s_nubank', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_s_nubank', to: 'wp_concourse_s_ifood', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_s_ifood', to: 'wp_boulevard_south', lotacao: 3, ruido: 2 },
  { from: 'wp_boulevard_south', to: 'wp_concourse_s_totvs', lotacao: 3, ruido: 2 },
  { from: 'wp_concourse_s_totvs', to: 'wp_concourse_s_eve', lotacao: 2, ruido: 2 },
  { from: 'wp_concourse_s_eve', to: 'wp_concourse_s_food', lotacao: 2, ruido: 2 },

  // BOULEVARD CENTRAL (X = 0)
  { from: 'wp_boulevard_south', to: 'wp_boulevard_mid_s', lotacao: 3, ruido: 2 },
  { from: 'wp_boulevard_mid_s', to: 'wp_boulevard_center', lotacao: 4, ruido: 3 },
  { from: 'wp_boulevard_center', to: 'wp_boulevard_mid_n', lotacao: 3, ruido: 3 },
  { from: 'wp_boulevard_mid_n', to: 'wp_boulevard_north', lotacao: 3, ruido: 3 },
  { from: 'wp_boulevard_north', to: 'wp_saida_norte', lotacao: 1, ruido: 1 },

  // CORREDOR CENTRAL (Z = 0) - RUA 100, 200, 300, 400
  { from: 'wp_saida_oeste', to: 'wp_r100_nubank_front', lotacao: 1, ruido: 1 },
  { from: 'wp_concourse_s_nubank', to: 'wp_r100_nubank_front', lotacao: 3, ruido: 3 },
  { from: 'wp_r100_nubank_front', to: 'wp_r200_center', lotacao: 3, ruido: 3 },
  { from: 'wp_r200_center', to: 'wp_boulevard_center', lotacao: 4, ruido: 3 },
  { from: 'wp_boulevard_center', to: 'wp_r300_center', lotacao: 4, ruido: 3 },
  { from: 'wp_r300_center', to: 'wp_r400_center', lotacao: 3, ruido: 3 },
  { from: 'wp_r400_center', to: 'wp_food_court_mid', lotacao: 3, ruido: 3 },
  { from: 'wp_food_court_mid', to: 'wp_saida_leste', lotacao: 1, ruido: 1 },

  // CONEXÕES VERTICAIS NORTE-SUL DOS CORREDORES
  { from: 'wp_r100_nubank_front', to: 'wp_r100_north', lotacao: 2, ruido: 2 },
  { from: 'wp_r200_center', to: 'wp_r200_north', lotacao: 2, ruido: 2 },
  { from: 'wp_r300_center', to: 'wp_r300_north', lotacao: 2, ruido: 2 },
  { from: 'wp_r400_center', to: 'wp_r400_north', lotacao: 3, ruido: 3 },

  // AVENIDA DOS PALCOS (Z = -13.5)
  { from: 'wp_palcos_west', to: 'wp_r100_north', lotacao: 2, ruido: 1 },
  { from: 'wp_r100_north', to: 'wp_r200_north', lotacao: 2, ruido: 2 },
  { from: 'wp_r200_north', to: 'wp_boulevard_north', lotacao: 3, ruido: 3 },
  { from: 'wp_boulevard_north', to: 'wp_r300_north', lotacao: 3, ruido: 3 },
  { from: 'wp_r300_north', to: 'wp_r400_north', lotacao: 3, ruido: 3 },
  { from: 'wp_r400_north', to: 'wp_palcos_stage_front', lotacao: 4, ruido: 4 },
  { from: 'wp_r400_north', to: 'wp_palcos_food_access', lotacao: 2, ruido: 2 },

  // FOOD COURT & CAFETERIA
  { from: 'wp_concourse_s_food', to: 'wp_restroom_east', lotacao: 2, ruido: 1 },
  { from: 'wp_concourse_s_food', to: 'wp_food_court_mid', lotacao: 3, ruido: 3 },
  { from: 'wp_food_court_mid', to: 'wp_palcos_food_access', lotacao: 3, ruido: 3 },
  { from: 'wp_palcos_food_access', to: 'wp_cafeteria_front', lotacao: 2, ruido: 2 },

  // TRANSIÇÕES VERTICAIS (1F <-> 2F)
  { from: 'wp_stairs_left_f1', to: 'wp_stairs_left_f2', temEscada: true, lotacao: 2, ruido: 1 },
  { from: 'wp_stairs_right_f1', to: 'wp_stairs_right_f2', temEscada: true, lotacao: 2, ruido: 1 },
  { from: 'wp_elevator_f1', to: 'wp_elevator_f2', isElevador: true, lotacao: 1, ruido: 1 },

  // MEZANINO 2F
  { from: 'wp_stairs_left_f2', to: 'wp_f2_vip_lounge', lotacao: 1, ruido: 1 },
  { from: 'wp_stairs_right_f2', to: 'wp_f2_vip_lounge', lotacao: 1, ruido: 1 },
  { from: 'wp_elevator_f2', to: 'wp_f2_vip_lounge', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_vip_lounge', to: 'wp_f2_workshop_a', lotacao: 1, ruido: 1 },
  { from: 'wp_f2_vip_lounge', to: 'wp_f2_workshop_b', lotacao: 1, ruido: 1 },
];
