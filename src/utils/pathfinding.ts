import {
  VENUE_WAYPOINTS,
  VENUE_EDGES,
  ACCESSIBILITY_PROFILES,
  POI_LIST,
} from '../data/eventData';
import type {
  POI,
  AccessibilityProfile,
  AccessibilityProfileId,
  WaypointEdge,
} from '../data/eventData';

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  floor: 1 | 2;
  warning?: string;
  isStairs?: boolean;
  isElevator?: boolean;
}

export interface NavigationRoute {
  points: [number, number, number][];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  steps: RouteStep[];
  fromPoi?: POI;
  toPoi?: POI;
  profile: AccessibilityProfile;
  avoidedStairs?: boolean;
  avoidedNoise?: boolean;
  avoidedCrowd?: boolean;
  isEmergencyExitRoute?: boolean;
}

export interface ProfileComparisonResult {
  profileId: AccessibilityProfileId;
  profileName: string;
  distanceMeters: number;
  estimatedMinutes: number;
  avoidedStairs: boolean;
  avoidedNoise: boolean;
  avoidedCrowd: boolean;
  route: NavigationRoute | null;
}

// Map scale: 1 3D unit = ~2.5 meters
const UNIT_TO_METERS = 2.5;

export const getFloorY = (floor: 1 | 2) => (floor === 1 ? 0.35 : 6.85);

interface GraphEdgeData {
  target: GraphNode;
  distance: number;
  ruido: number;
  lotacao: number;
  temEscada: boolean;
  isElevador: boolean;
  isRampa: boolean;
  bloqueado: boolean;
}

interface GraphNode {
  id: string;
  x: number;
  z: number;
  floor: 1 | 2;
  name?: string;
  isStairs?: boolean;
  isElevator?: boolean;
  isRamp?: boolean;
  isEmergencyExit?: boolean;
  neighbors: GraphEdgeData[];
}

// Build adjacency graph
function buildGraph(
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>
): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();

  for (const wp of VENUE_WAYPOINTS) {
    graph.set(wp.id, {
      ...wp,
      neighbors: [],
    });
  }

  for (const baseEdge of VENUE_EDGES) {
    const key = `${baseEdge.from}->${baseEdge.to}`;
    const reverseKey = `${baseEdge.to}->${baseEdge.from}`;
    const override = dynamicOverrides?.get(key) || dynamicOverrides?.get(reverseKey) || {};

    const edge: WaypointEdge = { ...baseEdge, ...override };

    const nodeA = graph.get(edge.from);
    const nodeB = graph.get(edge.to);

    if (nodeA && nodeB) {
      const dx = nodeA.x - nodeB.x;
      const dz = nodeA.z - nodeB.z;
      const dy = nodeA.floor !== nodeB.floor ? 6 : 0;
      const dist = Math.hypot(dx, dz) + dy;

      const edgeDataA: GraphEdgeData = {
        target: nodeB,
        distance: dist,
        ruido: edge.ruido ?? 1,
        lotacao: edge.lotacao ?? 1,
        temEscada: edge.temEscada ?? false,
        isElevador: edge.isElevador ?? false,
        isRampa: edge.isRampa ?? false,
        bloqueado: edge.bloqueado ?? false,
      };

      const edgeDataB: GraphEdgeData = {
        target: nodeA,
        distance: dist,
        ruido: edge.ruido ?? 1,
        lotacao: edge.lotacao ?? 1,
        temEscada: edge.temEscada ?? false,
        isElevador: edge.isElevador ?? false,
        isRampa: edge.isRampa ?? false,
        bloqueado: edge.bloqueado ?? false,
      };

      nodeA.neighbors.push(edgeDataA);
      nodeB.neighbors.push(edgeDataB);
    }
  }

  return graph;
}

// Find nearest waypoint on floor
function findNearestWaypoint(
  graph: Map<string, GraphNode>,
  x: number,
  z: number,
  floor: 1 | 2
): GraphNode | null {
  let nearest: GraphNode | null = null;
  let minDist = Infinity;

  for (const node of graph.values()) {
    if (node.floor === floor) {
      const dist = Math.hypot(node.x - x, node.z - z);
      if (dist < minDist) {
        minDist = dist;
        nearest = node;
      }
    }
  }

  return nearest;
}

/**
 * Weighted cost function per technical specification:
 * custo = distancia * (
 *   1 + (ruido - 1) * peso_ruido / 10
 *     + (lotacao - 1) * peso_lotacao / 10
 *     + max(0, lotacao - lotacao_limite) * fator_excesso
 *     + max(0, ruido - ruido_limite) * fator_excesso
 * )
 */
function calculateEdgeCost(
  edge: GraphEdgeData,
  profile: AccessibilityProfile
): number {
  if (edge.bloqueado) {
    return Infinity;
  }

  if (edge.temEscada && profile.evitaEscada) {
    return Infinity; // Intransponível para cadeirantes / mobilidade reduzida
  }

  const ruido = edge.ruido;
  const lotacao = edge.lotacao;
  const dist = edge.distance;

  const excessoLotacao =
    profile.limiteLotacao !== null
      ? Math.max(0, lotacao - profile.limiteLotacao) * profile.fatorExcesso
      : 0;

  const excessoRuido =
    profile.limiteRuido !== null
      ? Math.max(0, ruido - profile.limiteRuido) * profile.fatorExcesso
      : 0;

  const costMultiplier =
    1 +
    ((ruido - 1) * profile.pesoRuido) / 10 +
    ((lotacao - 1) * profile.pesoLotacao) / 10 +
    excessoLotacao +
    excessoRuido;

  return dist * costMultiplier;
}

// Dijkstra with Profile Weighting
function findShortestPathWithProfile(
  graph: Map<string, GraphNode>,
  startId: string,
  endId: string,
  profile: AccessibilityProfile
): { path: GraphNode[]; edges: GraphEdgeData[] } | null {
  const distances = new Map<string, number>();
  const previous = new Map<string, { node: GraphNode; edge: GraphEdgeData } | null>();
  const unvisited = new Set<string>();

  for (const id of graph.keys()) {
    distances.set(id, Infinity);
    previous.set(id, null);
    unvisited.add(id);
  }

  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const id of unvisited) {
      const dist = distances.get(id) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = id;
      }
    }

    if (!currentId || minDistance === Infinity) break;
    if (currentId === endId) break;

    unvisited.delete(currentId);
    const currentNode = graph.get(currentId)!;

    for (const edge of currentNode.neighbors) {
      if (!unvisited.has(edge.target.id)) continue;

      const edgeCost = calculateEdgeCost(edge, profile);
      if (edgeCost === Infinity) continue;

      const alt = minDistance + edgeCost;
      if (alt < (distances.get(edge.target.id) ?? Infinity)) {
        distances.set(edge.target.id, alt);
        previous.set(edge.target.id, { node: currentNode, edge });
      }
    }
  }

  if (distances.get(endId) === Infinity) {
    return null;
  }

  // Reconstruct path & edges
  const path: GraphNode[] = [];
  const edges: GraphEdgeData[] = [];
  let curr: GraphNode | null = graph.get(endId) ?? null;

  while (curr) {
    path.unshift(curr);
    const prev = previous.get(curr.id);
    if (prev) {
      edges.unshift(prev.edge);
      curr = prev.node;
    } else {
      curr = null;
    }
  }

  return { path, edges };
}

/**
 * Calculate the navigation route according to the attendee's accessibility profile
 */
export function calculateRoute(
  startPos: [number, number, number],
  startFloor: 1 | 2,
  endPos: [number, number, number],
  endFloor: 1 | 2,
  fromPoi?: POI,
  toPoi?: POI,
  profile: AccessibilityProfile = ACCESSIBILITY_PROFILES.PADRAO,
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>
): NavigationRoute | null {
  const graph = buildGraph(dynamicOverrides);
  const startWaypoint = findNearestWaypoint(graph, startPos[0], startPos[2], startFloor);
  const endWaypoint = findNearestWaypoint(graph, endPos[0], endPos[2], endFloor);

  if (!startWaypoint || !endWaypoint) {
    return null;
  }

  const result = findShortestPathWithProfile(graph, startWaypoint.id, endWaypoint.id, profile);
  if (!result || result.path.length === 0) {
    return null;
  }

  const { path: waypointPath, edges } = result;

  // Check if route avoided stairs or noisy areas
  const usedStairs = edges.some((e) => e.temEscada);
  const usedElevator = edges.some((e) => e.isElevador);
  const maxNoise = Math.max(...edges.map((e) => e.ruido), 1);
  const maxCrowd = Math.max(...edges.map((e) => e.lotacao), 1);

  // Assemble full 3D points
  const points: [number, number, number][] = [];
  points.push([startPos[0], getFloorY(startFloor), startPos[2]]);

  for (const wp of waypointPath) {
    points.push([wp.x, getFloorY(wp.floor), wp.z]);
  }

  points.push([endPos[0], getFloorY(endFloor), endPos[2]]);

  // Deduplicate points
  const filteredPoints: [number, number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    if (
      i === 0 ||
      Math.hypot(
        points[i][0] - points[i - 1][0],
        points[i][1] - points[i - 1][1],
        points[i][2] - points[i - 1][2]
      ) > 0.1
    ) {
      filteredPoints.push(points[i]);
    }
  }

  // Calculate real distance
  let totalDistanceUnits = 0;
  for (let i = 1; i < filteredPoints.length; i++) {
    const p1 = filteredPoints[i - 1];
    const p2 = filteredPoints[i];
    totalDistanceUnits += Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
  }

  const totalDistanceMeters = Math.round(totalDistanceUnits * UNIT_TO_METERS);
  const estimatedMinutes = Math.max(
    1,
    Math.ceil(totalDistanceMeters / profile.velocidadeMetersPerMin)
  );

function getAisleName(x: number, z: number, floor: 1 | 2): string | null {
  if (floor === 2) {
    if (z <= -10) return 'pelo Mezanino VIP';
    return 'pelo Corredor de Workshops';
  }
  if (z >= 24) return 'pelo Foyer de Entrada & Credenciamento';
  if (z <= -13) return 'pela Avenida dos Palcos (Grandes Arenas)';
  if (Math.abs(z - 18) < 2.5) {
    if (x > 15) return 'pela Praça Gastronômica Brasil';
    return 'pela Rua das Startups Brasil';
  }
  if (Math.abs(z - 1) < 2.5 && Math.abs(x) > 10) return 'pelo Cruzamento Central';
  if (Math.abs(x) < 3.5) {
    if (z > 5) return 'pelo Boulevard Central próximo aos Pilares P1 e P2';
    if (z < -3) return 'pelo Boulevard Central próximo aos Pilares P3 e P4';
    return 'pelo Boulevard Central';
  }
  if (Math.abs(x - (-8)) < 2.5) {
    if (z > 3) return 'pela Rua 100 junto ao Pilar P1';
    if (z < -2) return 'pela Rua 100 junto ao Pilar P3';
    return 'pela Rua 100 (Inovação & IA)';
  }
  if (Math.abs(x - (-26.5)) < 3.0) return 'pela Rua 200 (Tecnologia & Robótica)';
  if (Math.abs(x - 8) < 2.5) {
    if (z > 3) return 'pela Rua 300 junto ao Pilar P2';
    if (z < -2) return 'pela Rua 300 junto ao Pilar P4';
    return 'pela Rua 300 (Fintech & Mobilidade)';
  }
  if (Math.abs(x - 25.5) < 3.0) return 'pela Rua 400 (Software & Dados)';
  return null;
}

  // Generate Turn-by-Turn Steps
  const steps: RouteStep[] = [];
  const destName = toPoi?.name || 'Destino';
  const startName = fromPoi?.name || 'Seu Ponto de Partida';

  steps.push({
    instruction: `Inicie o trajeto a partir de: ${startName}`,
    distanceMeters: 0,
    floor: startFloor,
  });

  for (let i = 1; i < filteredPoints.length - 1; i++) {
    const prev = filteredPoints[i - 1];
    const curr = filteredPoints[i];
    const next = filteredPoints[i + 1];

    const currentFloor: 1 | 2 = curr[1] > 3 ? 2 : 1;
    const nextFloor: 1 | 2 = next[1] > 3 ? 2 : 1;

    // Floor transition
    if (currentFloor !== nextFloor) {
      if (usedElevator || profile.evitaEscada) {
        steps.push({
          instruction:
            nextFloor === 2
              ? 'Acesse o Elevador Acessível e suba para o Piso 2 (Mezanino de Workshops & VIP)'
              : 'Acesse o Elevador Acessível e desça para o Piso 1 (Pavilhão Principal)',
          distanceMeters: 10,
          floor: nextFloor,
          isElevator: true,
        });
      } else {
        steps.push({
          instruction:
            nextFloor === 2
              ? 'Suba pela escadaria para o Piso 2 (Mezanino de Workshops & VIP)'
              : 'Desça pela escadaria para o Piso 1 (Pavilhão Principal)',
          distanceMeters: 10,
          floor: nextFloor,
          isStairs: true,
        });
      }
      continue;
    }

    // Direction turn
    const v1x = curr[0] - prev[0];
    const v1z = curr[2] - prev[2];
    const v2x = next[0] - curr[0];
    const v2z = next[2] - curr[2];

    const angle1 = Math.atan2(v1z, v1x);
    const angle2 = Math.atan2(v2z, v2x);
    let diff = angle2 - angle1;

    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    const deg = (diff * 180) / Math.PI;
    const segmentDist = Math.round(Math.hypot(v2x, v2z) * UNIT_TO_METERS);
    const aisleText = getAisleName(next[0], next[2], nextFloor);

    let instruction = aisleText
      ? `Siga em frente por ${segmentDist}m ${aisleText}`
      : `Siga em frente por ${segmentDist}m pelo corredor`;

    if (deg < -35) {
      instruction = aisleText
        ? `Vire à esquerda e siga por ${segmentDist}m ${aisleText}`
        : `Vire à esquerda e siga por ${segmentDist}m`;
    } else if (deg > 35) {
      instruction = aisleText
        ? `Vire à direita e siga por ${segmentDist}m ${aisleText}`
        : `Vire à direita e siga por ${segmentDist}m`;
    }

    steps.push({
      instruction,
      distanceMeters: segmentDist,
      floor: currentFloor,
    });
  }

  steps.push({
    instruction: `Você chegou ao seu destino: ${destName}`,
    distanceMeters: 0,
    floor: endFloor,
  });

  return {
    points: filteredPoints,
    totalDistanceMeters,
    estimatedMinutes,
    steps,
    fromPoi,
    toPoi,
    profile,
    avoidedStairs: profile.evitaEscada && !usedStairs,
    avoidedNoise: profile.id === 'NEURODIVERGENTE' && maxNoise <= 3,
    avoidedCrowd: (profile.id === 'CADEIRANTE' || profile.id === 'NEURODIVERGENTE') && maxCrowd <= 3,
  };
}

/**
 * Compare the same route across all 4 accessibility profiles
 */
export function calculateMultiProfileComparison(
  startPos: [number, number, number],
  startFloor: 1 | 2,
  endPos: [number, number, number],
  endFloor: 1 | 2,
  fromPoi?: POI,
  toPoi?: POI,
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>
): ProfileComparisonResult[] {
  const profileKeys: AccessibilityProfileId[] = [
    'PADRAO',
    'CADEIRANTE',
    'MOBILIDADE',
    'NEURODIVERGENTE',
  ];

  return profileKeys.map((key) => {
    const profile = ACCESSIBILITY_PROFILES[key];
    const r = calculateRoute(
      startPos,
      startFloor,
      endPos,
      endFloor,
      fromPoi,
      toPoi,
      profile,
      dynamicOverrides
    );

    return {
      profileId: key,
      profileName: profile.name,
      distanceMeters: r?.totalDistanceMeters ?? 0,
      estimatedMinutes: r?.estimatedMinutes ?? 0,
      avoidedStairs: r?.avoidedStairs ?? false,
      avoidedNoise: r?.avoidedNoise ?? false,
      avoidedCrowd: r?.avoidedCrowd ?? false,
      route: r,
    };
  });
}

/**
 * Emergency Evacuation: finds the closest viable exit matching the attendee's profile
 */
export function findClosestEmergencyExit(
  userPos: [number, number, number],
  userFloor: 1 | 2,
  profile: AccessibilityProfile = ACCESSIBILITY_PROFILES.PADRAO,
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>
): NavigationRoute | null {
  const exitPois = POI_LIST.filter((p) => p.category === 'exit' || p.isEmergencyExit);

  let bestRoute: NavigationRoute | null = null;
  let shortestDist = Infinity;

  for (const exit of exitPois) {
    // If wheelchair/reduced mobility, require accessible exit
    if (profile.evitaEscada && exit.isAccessible === false) {
      continue;
    }

    const route = calculateRoute(
      userPos,
      userFloor,
      exit.position,
      exit.floor,
      undefined,
      exit,
      profile,
      dynamicOverrides
    );

    if (route && route.totalDistanceMeters < shortestDist) {
      shortestDist = route.totalDistanceMeters;
      bestRoute = {
        ...route,
        isEmergencyExitRoute: true,
      };
    }
  }

  return bestRoute;
}
