import {
  getPoisFromApi,
  getWaypointsFromApi,
  getEdgesFromApi,
} from './apiMapAdapter';

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
  distancia?: number;
}

export const VENUE_FLOORS = [
  { id: 1, name: 'Pavilhão Principal', shortName: '1F' },
] as const;

export const VENUE_ZONES = [
  { id: 'cloud-street', name: 'Cloud Street (AWS, Azure, GCP, IBM)', color: '#0284c7', floor: 1 },
  { id: 'arena-stage', name: 'Arena Tech4Change & Palco Principal', color: '#8b5cf6', floor: 1 },
  { id: 'tech-stands', name: 'Stands Tecnológicos (Oracle, NVIDIA, Labs)', color: '#c74634', floor: 1 },
  { id: 'startups', name: 'Startups FIAP', color: '#22d3ee', floor: 1 },
  { id: 'food-court', name: 'Praça de Alimentação', color: '#f59e0b', floor: 1 },
  { id: 'accessibility', name: 'Acessibilidade & Acolhimento Sensorial', color: '#2dd4bf', floor: 1 },
  { id: 'services', name: 'Credenciamento & Serviços de Apoio', color: '#64748b', floor: 1 },
  { id: 'exits', name: 'Saídas de Emergência & Evacuação', color: '#16a34a', floor: 1 },
];

// =========================================================================
// DADOS FORMULADOS DIRETAMENTE DA API DO BANCO ORACLE 26ai (NEXT26.json)
// =========================================================================
export const POI_LIST: POI[] = getPoisFromApi('NEXT26');
export const VENUE_WAYPOINTS: WaypointNode[] = getWaypointsFromApi('NEXT26');
export const VENUE_EDGES: WaypointEdge[] = getEdgesFromApi('NEXT26');
