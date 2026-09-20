import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getWaypointsFromApi, getEdgesFromApi } from '@/data/apiMapAdapter';

interface CrowdFlux3DProps {
  eventoCodigo?: string;
  count?: number;
}

interface WalkerState {
  fromId: string;
  toId: string;
  progress: number;
  speedMps: number;
  offsetLateral: number;
  shirtColor: string;
  pantsColor: string;
  skinColor: string;
  hairColor: string;
  scale: number;
  pauseTimer: number;
  walkPhase: number;
  hasBackpack: boolean;
}

interface StaticPerson {
  x: number;
  z: number;
  rotationY: number;
  shirtColor: string;
  pantsColor: string;
  skinColor: string;
  hairColor: string;
  scale: number;
  hasBackpack: boolean;
  idlePhase: number;
}

const SHIRT_COLORS = [
  '#0284c7', // Azul Royal
  '#3b82f6', // Azul Céu
  '#10b981', // Verde Esmeralda
  '#059669', // Verde Floresta
  '#f59e0b', // Âmbar
  '#ea580c', // Laranja
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa Vibrante
  '#64748b', // Cinza Técnico
  '#0f172a', // Preto Tecnológico
  '#ffffff', // Branco
  '#ef4444', // Vermelho
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

const PANTS_COLORS = ['#1e293b', '#334155', '#1e1b4b', '#0f172a', '#475569', '#18181b'];
const SKIN_COLORS = ['#fcd34d', '#fed7aa', '#fbcfe8', '#d97706', '#92400e', '#78350f'];
const HAIR_COLORS = ['#0f172a', '#334155', '#78350f', '#b45309', '#ca8a04', '#475569'];

export function CrowdFlux3D({ eventoCodigo = 'NEXT26', count = 180 }: CrowdFlux3DProps) {
  const waypoints = useMemo(() => getWaypointsFromApi(eventoCodigo), [eventoCodigo]);
  const edges = useMemo(() => getEdgesFromApi(eventoCodigo), [eventoCodigo]);

  const waypointMap = useMemo(() => {
    return new Map(waypoints.map((wp) => [wp.id, wp]));
  }, [waypoints]);

  // Grafo de adjacência direcionado bidirecional baseado nos trechos não bloqueados
  const adjacency = useMemo(() => {
    const adj = new Map<string, Array<{ to: string; distance: number; lotacao: number }>>();

    for (const wp of waypoints) {
      adj.set(wp.id, []);
    }

    for (const e of edges) {
      if (e.bloqueado) continue;
      const wpA = waypointMap.get(e.from);
      const wpB = waypointMap.get(e.to);
      if (!wpA || !wpB) continue;

      const dist = Math.hypot(wpB.x - wpA.x, wpB.z - wpA.z) || 1;
      const lotacao = e.lotacao || 1;

      adj.get(e.from)?.push({ to: e.to, distance: dist, lotacao });
      adj.get(e.to)?.push({ to: e.from, distance: dist, lotacao });
    }

    return adj;
  }, [waypoints, edges, waypointMap]);

  // Pedestres em movimento (fluxo pelos corredores)
  const walkersRef = useRef<WalkerState[]>([]);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const leftLegRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rightLegRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Pessoas estáticas / aglomeradas assistindo palcos e interagindo nos stands
  const staticPeople = useMemo<StaticPerson[]>(() => {
    const people: StaticPerson[] = [];

    // 1. Aglomeração massiva em frente ao Palco Principal (Keynotes: X: 13, Z: 0)
    for (let i = 0; i < 28; i++) {
      const rx = 10.5 + (Math.random() - 0.5) * 6.5;
      const rz = -0.5 + (Math.random() - 0.5) * 4.0;
      people.push({
        x: rx,
        z: rz,
        rotationY: -Math.PI / 2 + (Math.random() - 0.5) * 0.5, // Olhando para o palco
        shirtColor: SHIRT_COLORS[i % SHIRT_COLORS.length],
        pantsColor: PANTS_COLORS[i % PANTS_COLORS.length],
        skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
        hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
        scale: 0.85 + Math.random() * 0.2,
        hasBackpack: Math.random() > 0.3,
        idlePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Aglomeração na Arena Tech4Change (Hackathon: X: -1.25, Z: 0)
    for (let i = 0; i < 20; i++) {
      const rx = -1.25 + (Math.random() - 0.5) * 5.0;
      const rz = 0.5 + (Math.random() - 0.5) * 3.5;
      people.push({
        x: rx,
        z: rz,
        rotationY: Math.PI / 2 + (Math.random() - 0.5) * 0.6,
        shirtColor: SHIRT_COLORS[(i + 4) % SHIRT_COLORS.length],
        pantsColor: PANTS_COLORS[i % PANTS_COLORS.length],
        skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
        hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
        scale: 0.85 + Math.random() * 0.2,
        hasBackpack: Math.random() > 0.5,
        idlePhase: Math.random() * Math.PI * 2,
      });
    }

    // 3. Grupo na Praça de Alimentação (Food Court: X: -26, Z: 5)
    for (let i = 0; i < 16; i++) {
      const rx = -26.0 + (Math.random() - 0.5) * 5.5;
      const rz = 5.0 + (Math.random() - 0.5) * 4.5;
      people.push({
        x: rx,
        z: rz,
        rotationY: Math.random() * Math.PI * 2,
        shirtColor: SHIRT_COLORS[(i + 8) % SHIRT_COLORS.length],
        pantsColor: PANTS_COLORS[i % PANTS_COLORS.length],
        skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
        hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
        scale: 0.85 + Math.random() * 0.2,
        hasBackpack: Math.random() > 0.6,
        idlePhase: Math.random() * Math.PI * 2,
      });
    }

    // 4. Grupo no Stand da Oracle (Demo AI Vector Search: X: 18, Z: 0)
    for (let i = 0; i < 12; i++) {
      const rx = 18.0 + (Math.random() - 0.5) * 4.0;
      const rz = 0.0 + (Math.random() - 0.5) * 2.5;
      people.push({
        x: rx,
        z: rz,
        rotationY: -Math.PI / 4 + (Math.random() - 0.5) * 0.8,
        shirtColor: SHIRT_COLORS[(i + 2) % SHIRT_COLORS.length],
        pantsColor: PANTS_COLORS[i % PANTS_COLORS.length],
        skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
        hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
        scale: 0.85 + Math.random() * 0.2,
        hasBackpack: true,
        idlePhase: Math.random() * Math.PI * 2,
      });
    }

    return people;
  }, []);

  // Inicializa o estado dos pedestres móveis distribuídos proporcionalmente à LOTAÇÃO da API
  useMemo(() => {
    if (edges.length === 0) return;

    const validEdges = edges.filter((e) => !e.bloqueado && waypointMap.has(e.from) && waypointMap.has(e.to));
    if (validEdges.length === 0) return;

    // Criar lista ponderada: trechos com lotação alta aparecem muito mais vezes
    const weightedEdges: typeof validEdges = [];
    for (const edge of validEdges) {
      const lotacao = edge.lotacao || 1;
      const weight = Math.round(Math.pow(lotacao, 2.2)); // lotação 5 tem peso 35, lotação 1 tem peso 1
      for (let w = 0; w < weight; w++) {
        weightedEdges.push(edge);
      }
    }

    const walkers: WalkerState[] = [];
    for (let i = 0; i < count; i++) {
      const edge = weightedEdges[Math.floor(Math.random() * weightedEdges.length)];
      const reverse = Math.random() > 0.5;
      const fromId = reverse ? edge.to : edge.from;
      const toId = reverse ? edge.from : edge.to;

      const lotacao = edge.lotacao || 1;
      // Congestionamento: em corredores cheios, as pessoas andam mais devagar!
      const speedModifier = 1.0 / Math.sqrt(lotacao * 0.8);
      const baseSpeed = 1.2 + Math.random() * 0.6;

      walkers.push({
        fromId,
        toId,
        progress: Math.random(),
        speedMps: baseSpeed * speedModifier,
        offsetLateral: (Math.random() - 0.5) * (0.4 + lotacao * 0.12),
        shirtColor: SHIRT_COLORS[i % SHIRT_COLORS.length],
        pantsColor: PANTS_COLORS[i % PANTS_COLORS.length],
        skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
        hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
        scale: 0.85 + Math.random() * 0.25,
        pauseTimer: 0,
        walkPhase: Math.random() * Math.PI * 2,
        hasBackpack: Math.random() > 0.4,
      });
    }

    walkersRef.current = walkers;
  }, [edges, count, waypointMap]);

  // Loop de Animação e Física de Fluxo
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const walkers = walkersRef.current;

    for (let i = 0; i < walkers.length; i++) {
      const w = walkers[i];
      const grp = groupRefs.current[i];
      const leftLeg = leftLegRefs.current[i];
      const rightLeg = rightLegRefs.current[i];
      if (!grp) continue;

      const wpA = waypointMap.get(w.fromId);
      const wpB = waypointMap.get(w.toId);
      if (!wpA || !wpB) continue;

      const dx = wpB.x - wpA.x;
      const dz = wpB.z - wpA.z;
      const dist = Math.hypot(dx, dz) || 1;

      // Se estiver em pausa (ex: olhando estande)
      if (w.pauseTimer > 0) {
        w.pauseTimer -= dt;
        if (leftLeg) leftLeg.rotation.x = 0;
        if (rightLeg) rightLeg.rotation.x = 0;
        continue;
      }

      // Avança progresso
      const progressInc = (w.speedMps * dt) / dist;
      w.progress += progressInc;
      w.walkPhase += dt * 8;

      // Chegou ao fim do trecho atual
      if (w.progress >= 1) {
        w.progress = 0;
        const currentIntersection = w.toId;
        const neighbors = adjacency.get(currentIntersection) || [];

        // Chance de pausa curta se for ponto de interesse/área
        if (Math.random() < 0.18) {
          w.pauseTimer = 1.5 + Math.random() * 3.0;
        }

        if (neighbors.length > 0) {
          // Filtra o nó de onde acabou de vir
          const forwardOptions = neighbors.filter((n) => n.to !== w.fromId);
          const pickList = forwardOptions.length > 0 ? forwardOptions : neighbors;

          // Escolhe próximo trecho ponderado pela lotação (atração por eventos e estandes)
          const totalLot = pickList.reduce((acc, n) => acc + (n.lotacao || 1), 0);
          let rand = Math.random() * totalLot;
          let chosen = pickList[0];
          for (const n of pickList) {
            rand -= n.lotacao || 1;
            if (rand <= 0) {
              chosen = n;
              break;
            }
          }

          w.fromId = currentIntersection;
          w.toId = chosen.to;

          // Atualiza velocidade conforme a lotação da nova via
          const newLot = chosen.lotacao || 1;
          w.speedMps = (1.2 + Math.random() * 0.6) / Math.sqrt(newLot * 0.8);
        } else {
          // Beco sem saída: inverte direção
          const prev = w.fromId;
          w.fromId = w.toId;
          w.toId = prev;
        }
      }

      // Interpolação de Posição
      const curA = waypointMap.get(w.fromId)!;
      const curB = waypointMap.get(w.toId)!;
      const curDx = curB.x - curA.x;
      const curDz = curB.z - curA.z;
      const curDist = Math.hypot(curDx, curDz) || 1;

      // Vetor normal perpendicular para offset lateral
      const perpX = -curDz / curDist;
      const perpZ = curDx / curDist;

      const px = curA.x + curDx * w.progress + perpX * w.offsetLateral;
      const pz = curA.z + curDz * w.progress + perpZ * w.offsetLateral;

      // Leve oscilação vertical ao caminhar (bobbing natural)
      const py = 0.01 + Math.abs(Math.sin(w.walkPhase)) * 0.03;

      // Rotação na direção do movimento
      const rotY = Math.atan2(curDx, curDz);

      grp.position.set(px, py, pz);
      grp.rotation.set(0, rotY, 0);

      // Balanço alternado das pernas
      const legSwing = Math.sin(w.walkPhase) * 0.45;
      if (leftLeg) leftLeg.rotation.x = legSwing;
      if (rightLeg) rightLeg.rotation.x = -legSwing;
    }
  });

  return (
    <group name="crowd-flux-3d">
      {/* 1. Pedestres Móveis em Fluxo Contínuo */}
      {walkersRef.current.map((w, idx) => (
        <group
          key={`walker-${idx}`}
          ref={(el) => (groupRefs.current[idx] = el)}
          scale={[w.scale, w.scale, w.scale]}
        >
          {/* Tronco / Camiseta */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.22, 0.32, 0.14]} />
            <meshStandardMaterial color={w.shirtColor} roughness={0.7} />
          </mesh>

          {/* Cabeça */}
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={w.skinColor} roughness={0.6} />
          </mesh>

          {/* Cabelo / Boné */}
          <mesh position={[0, 0.78, 0]} castShadow>
            <boxGeometry args={[0.16, 0.06, 0.16]} />
            <meshStandardMaterial color={w.hairColor} roughness={0.8} />
          </mesh>

          {/* Mochila / Crachá de Congresso */}
          {w.hasBackpack && (
            <mesh position={[0, 0.45, -0.1]} castShadow>
              <boxGeometry args={[0.16, 0.22, 0.07]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
          )}

          {/* Perna Esquerda */}
          <mesh
            ref={(el) => (leftLegRefs.current[idx] = el)}
            position={[-0.06, 0.15, 0]}
            castShadow
          >
            <boxGeometry args={[0.065, 0.28, 0.08]} />
            <meshStandardMaterial color={w.pantsColor} roughness={0.8} />
          </mesh>

          {/* Perna Direita */}
          <mesh
            ref={(el) => (rightLegRefs.current[idx] = el)}
            position={[0.06, 0.15, 0]}
            castShadow
          >
            <boxGeometry args={[0.065, 0.28, 0.08]} />
            <meshStandardMaterial color={w.pantsColor} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 2. Pessoas Aglomeradas em Frente a Palcos, Demonstrações e Alimentação */}
      {staticPeople.map((sp, idx) => (
        <group
          key={`static-person-${idx}`}
          position={[sp.x, 0.01, sp.z]}
          rotation={[0, sp.rotationY, 0]}
          scale={[sp.scale, sp.scale, sp.scale]}
        >
          {/* Tronco */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.22, 0.32, 0.14]} />
            <meshStandardMaterial color={sp.shirtColor} roughness={0.7} />
          </mesh>

          {/* Cabeça */}
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={sp.skinColor} roughness={0.6} />
          </mesh>

          {/* Cabelo */}
          <mesh position={[0, 0.78, 0]} castShadow>
            <boxGeometry args={[0.16, 0.06, 0.16]} />
            <meshStandardMaterial color={sp.hairColor} roughness={0.8} />
          </mesh>

          {/* Mochila */}
          {sp.hasBackpack && (
            <mesh position={[0, 0.45, -0.1]} castShadow>
              <boxGeometry args={[0.16, 0.22, 0.07]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
          )}

          {/* Pernas em Posição de Pé */}
          <mesh position={[-0.06, 0.15, 0]} castShadow>
            <boxGeometry args={[0.065, 0.28, 0.08]} />
            <meshStandardMaterial color={sp.pantsColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.06, 0.15, 0]} castShadow>
            <boxGeometry args={[0.065, 0.28, 0.08]} />
            <meshStandardMaterial color={sp.pantsColor} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
