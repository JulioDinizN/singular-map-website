import { useMemo } from 'react';
import { getEdgesFromApi, getWaypointsFromApi } from '@/data/apiMapAdapter';
import type { WaypointEdge } from '@/data/eventData';

interface ApiCorridors3DProps {
  eventoCodigo?: string;
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>;
}

// Cores do Heatmap para Níveis de Lotação / Ruído (1 a 5)
const LEVEL_COLORS = [
  '#3b82f6', // Nível 1 - Azul tranquilo / normal
  '#10b981', // Nível 2 - Verde suave
  '#f59e0b', // Nível 3 - Âmbar moderado
  '#ea580c', // Nível 4 - Laranja intenso
  '#ef4444', // Nível 5 - Vermelho crítico / aglomeração máxima
];

export function ApiCorridors3D({
  eventoCodigo = 'NEXT26',
  dynamicOverrides,
}: ApiCorridors3DProps) {
  const waypoints = useMemo(() => getWaypointsFromApi(eventoCodigo), [eventoCodigo]);
  const baseEdges = useMemo(() => getEdgesFromApi(eventoCodigo), [eventoCodigo]);

  const waypointMap = useMemo(() => {
    return new Map(waypoints.map((wp) => [wp.id, wp]));
  }, [waypoints]);

  // Aplica overrides dinâmicos da telemetria/reportes
  const effectiveEdges = useMemo(() => {
    return baseEdges.map((edge) => {
      const overrideKey = `${edge.from}->${edge.to}`;
      const reverseKey = `${edge.to}->${edge.from}`;
      const override = dynamicOverrides?.get(overrideKey) || dynamicOverrides?.get(reverseKey);

      if (override) {
        return { ...edge, ...override };
      }
      return edge;
    });
  }, [baseEdges, dynamicOverrides]);

  return (
    <group position={[0, 0.01, 0]}>
      {/* 1. Corredores e Trechos Conectados */}
      {effectiveEdges.map((edge, idx) => {
        const wpA = waypointMap.get(edge.from);
        const wpB = waypointMap.get(edge.to);
        if (!wpA || !wpB) return null;

        const ax = wpA.x;
        const az = wpA.z;
        const bx = wpB.x;
        const bz = wpB.z;

        const length = Math.hypot(bx - ax, bz - az);
        const angle = Math.atan2(bz - az, bx - ax);
        const midX = (ax + bx) / 2;
        const midZ = (az + bz) / 2;

        const isBlocked = edge.bloqueado;
        const hasStairs = edge.temEscada;
        const lotacao = edge.lotacao || 1;

        // Cor do corredor: Bloqueado (Vermelho escuro), Degrau (Âmbar escuro), ou nível de lotação
        const color = isBlocked
          ? '#991b1b'
          : hasStairs
          ? '#b45309'
          : LEVEL_COLORS[Math.min(lotacao - 1, LEVEL_COLORS.length - 1)];

        const walkwayWidth = 1.2;

        return (
          <group key={`edge-${edge.from}-${edge.to}-${idx}`}>
            {/* Faixa do Corredor no Chão */}
            <mesh
              position={[midX, 0.005, midZ]}
              rotation={[0, -angle, 0]}
              receiveShadow
            >
              <boxGeometry args={[length, 0.02, walkwayWidth]} />
              <meshStandardMaterial
                color={color}
                roughness={0.8}
                metalness={0.1}
                transparent
                opacity={isBlocked ? 0.9 : 0.45}
              />
            </mesh>

            {/* Linhas guias laterais do corredor */}
            <mesh
              position={[midX, 0.01, midZ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[length, 0.015, walkwayWidth * 0.95]} />
              <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
            </mesh>

            {/* Indicador de Degrau / Escada */}
            {hasStairs && (
              <mesh position={[midX, 0.08, midZ]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[1.0, 0.12, walkwayWidth]} />
                <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.3} />
              </mesh>
            )}

            {/* Indicador de Bloqueio Físico */}
            {isBlocked && (
              <mesh position={[midX, 0.35, midZ]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[0.3, 0.7, walkwayWidth * 1.1]} />
                <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.5} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 2. Círculos de Interseção / Waypoints */}
      {waypoints.map((wp) => {
        const isExit = wp.isEmergencyExit;
        return (
          <mesh
            key={`wp-${wp.id}`}
            position={[wp.x, 0.012, wp.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[isExit ? 0.7 : 0.4, 24]} />
            <meshStandardMaterial
              color={isExit ? '#16a34a' : '#475569'}
              emissive={isExit ? '#22c55e' : '#1e293b'}
              emissiveIntensity={isExit ? 0.4 : 0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}
