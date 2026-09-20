/**
 * Adaptador de Dados da API para a Visualização do Mapa 3D
 * 
 * Converte o grafo de eventos (areas, pontos e trechos) do Oracle 26ai / NEXT26.json
 * para as estruturas de POI, WaypointNode e WaypointEdge utilizadas pela cena Three.js.
 */

import next26Data from '../../public/dados/NEXT26.json';
import expo26Data from '../../public/dados/EXPO26.json';
import type { POI, PoiCategory, WaypointNode, WaypointEdge } from './eventData';

export interface ApiEventData {
  evento: {
    codigo: string;
    nome: string;
    local?: string;
    largura_px: number;
    altura_px: number;
    escala_m_px: number;
    descricao?: string;
    origem_padrao: string;
  };
  perfis: any[];
  areas: Array<{
    codigo: string;
    nome: string;
    tipo: string;
    x: number;
    y: number;
    largura: number;
    altura: number;
    cor?: string | null;
    subtitulo?: string | null;
    descricao?: string | null;
  }>;
  pontos: Array<{
    codigo: string;
    nome: string;
    tipo: string;
    x: number;
    y: number;
    bloqueado: string;
  }>;
  trechos: Array<{
    id: number;
    a: string;
    b: string;
    via?: string;
    distancia_m: number;
    escada: string;
    ruido: number;
    lotacao: number;
    ruido_base?: number;
    lotacao_base?: number;
    bloqueado: string;
  }>;
  programacao?: Array<{
    ponto: string;
    titulo: string;
    inicio: string;
    fim: string;
    ruido_prev: number;
  }>;
}

const EVENT_DATA_MAP: Record<string, ApiEventData> = {
  NEXT26: next26Data as unknown as ApiEventData,
  EXPO26: expo26Data as unknown as ApiEventData,
};

// Escala padrão: 1px da planta = 0.05 unidades no mundo 3D (Three.js)
export const MAP_3D_SCALE = 0.05;

/**
 * Converte coordenadas 2D em pixels da planta para [x, y, z] no Three.js
 */
export function to3DCoordinates(
  xPx: number,
  yPx: number,
  canvasWidth = 1400,
  canvasHeight = 1000,
  yHeight = 0
): [number, number, number] {
  const x3D = (xPx - canvasWidth / 2) * MAP_3D_SCALE;
  const z3D = (yPx - canvasHeight / 2) * MAP_3D_SCALE;
  return [x3D, yHeight, z3D];
}

/**
 * Mapeia o tipo da área da API para uma categoria de POI da UI
 */
function mapAreaTipoToCategory(tipo: string): PoiCategory {
  switch (tipo) {
    case 'PALCO':
    case 'ARENA':
      return 'stage';
    case 'ACOLHIMENTO':
      return 'quiet_room';
    case 'BANHEIRO_ADAP':
      return 'restroom';
    case 'ALIMENTACAO':
      return 'food';
    case 'SAIDA':
      return 'exit';
    case 'SERVICO':
    case 'CRED':
    case 'BRIG':
      return 'info';
    case 'STAND':
    default:
      return 'booth';
  }
}

/**
 * Retorna a altura 3D da geometria com base no tipo da área
 */
function getAreaHeight(tipo: string): number {
  switch (tipo) {
    case 'PALCO':
    case 'ARENA':
      return 2.8;
    case 'STAND':
      return 2.0;
    case 'ACOLHIMENTO':
      return 1.8;
    case 'ALIMENTACAO':
      return 1.6;
    case 'BANHEIRO_ADAP':
    case 'SERVICO':
      return 1.4;
    case 'RAMPA':
      return 0.3;
    case 'CORREDOR':
      return 0.05;
    default:
      return 1.5;
  }
}

/**
 * Converte as Áreas e Pontos da API em POIs para renderização no mapa 3D
 */
export function getPoisFromApi(eventoCodigo = 'NEXT26'): POI[] {
  const data = EVENT_DATA_MAP[eventoCodigo.toUpperCase()] || EVENT_DATA_MAP.NEXT26;
  const W = data.evento.largura_px;
  const H = data.evento.altura_px;

  // Mapa de programação por código de ponto
  const sessionsByPonto: Record<string, any[]> = {};
  if (data.programacao) {
    for (const prog of data.programacao) {
      sessionsByPonto[prog.ponto] = sessionsByPonto[prog.ponto] || [];
      sessionsByPonto[prog.ponto].push({
        id: `prog-${prog.ponto}-${sessionsByPonto[prog.ponto].length}`,
        title: prog.titulo,
        speaker: 'Tech4Change 2026',
        time: `${prog.inicio} - ${prog.fim}`,
        isLiveNow: prog.inicio <= '12:00' && prog.fim >= '10:00', // Exemplo ilustrativo
      });
    }
  }

  const pois: POI[] = [];

  // 1. Converter Áreas em POIs 3D
  for (const a of data.areas) {
    if (a.tipo === 'CORREDOR') continue;

    const cx = a.x + a.largura / 2;
    const cy = a.y + a.altura / 2;
    const height = getAreaHeight(a.tipo);
    const pos = to3DCoordinates(cx, cy, W, H, height / 2);
    const width = a.largura * MAP_3D_SCALE;
    const depth = a.altura * MAP_3D_SCALE;

    // Localiza ponto correspondente para obter sessões
    const matchingPonto = data.pontos.find(
      (p) => p.codigo === a.codigo.replace(/^A_/, '') || a.nome.toLowerCase().includes(p.nome.toLowerCase())
    );

    const sessions = matchingPonto ? sessionsByPonto[matchingPonto.codigo] : undefined;

    pois.push({
      id: a.codigo,
      name: a.nome,
      shortName: a.subtitulo || a.nome,
      category: mapAreaTipoToCategory(a.tipo),
      floor: 1,
      position: pos,
      dimensions: [width, height, depth],
      color: a.cor || '#3b82f6',
      accentColor: a.cor || '#1d4ed8',
      zone: a.subtitulo || a.tipo,
      description: a.descricao || `${a.nome} no ${data.evento.nome}`,
      sessions,
      isAccessible: a.tipo !== 'RAMPA',
      isQuietZone: a.tipo === 'ACOLHIMENTO',
      isEmergencyExit: a.tipo === 'SAIDA',
    });
  }

  // 2. Adicionar Saídas de Emergência e Pontos Críticos dos Pontos da API
  for (const p of data.pontos) {
    if (p.tipo === 'SAIDA') {
      const pos = to3DCoordinates(p.x, p.y, W, H, 0.6);
      pois.push({
        id: `ponto-${p.codigo}`,
        name: p.nome,
        shortName: p.nome,
        category: 'exit',
        floor: 1,
        position: pos,
        dimensions: [2.5, 1.2, 1.0],
        color: '#15803d',
        accentColor: '#22c55e',
        zone: 'Saídas de Emergência',
        description: `Saída de emergência ${p.nome}. Acesso direto à área externa do pavilhão.`,
        isAccessible: !p.nome.toLowerCase().includes('degrau'),
        isEmergencyExit: true,
      });
    }
  }

  return pois;
}

/**
 * Converte os Pontos da API em Nós de Waypoint do Grafo 3D
 */
export function getWaypointsFromApi(eventoCodigo = 'NEXT26'): WaypointNode[] {
  const data = EVENT_DATA_MAP[eventoCodigo.toUpperCase()] || EVENT_DATA_MAP.NEXT26;
  const W = data.evento.largura_px;
  const H = data.evento.altura_px;

  return data.pontos.map((p) => {
    const [x, , z] = to3DCoordinates(p.x, p.y, W, H);
    return {
      id: p.codigo,
      name: p.nome,
      x,
      z,
      floor: 1,
      isStairs: p.nome.toLowerCase().includes('degrau'),
      isRamp: p.tipo === 'RAMPA',
      isEmergencyExit: p.tipo === 'SAIDA',
    };
  });
}

/**
 * Converte os Trechos da API em Arestas do Grafo 3D
 */
export function getEdgesFromApi(eventoCodigo = 'NEXT26'): WaypointEdge[] {
  const data = EVENT_DATA_MAP[eventoCodigo.toUpperCase()] || EVENT_DATA_MAP.NEXT26;

  return data.trechos.map((t) => ({
    from: t.a,
    to: t.b,
    distancia: t.distancia_m,
    ruido: t.ruido,
    lotacao: t.lotacao,
    temEscada: t.escada === 'S',
    bloqueado: t.bloqueado === 'S',
  }));
}

/**
 * Retorna os metadados do evento da API
 */
export function getEventMetadataFromApi(eventoCodigo = 'NEXT26') {
  const data = EVENT_DATA_MAP[eventoCodigo.toUpperCase()] || EVENT_DATA_MAP.NEXT26;
  return data.evento;
}
