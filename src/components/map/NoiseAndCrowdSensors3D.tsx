import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';

interface NoiseAndCrowdSensors3DProps {
  visible?: boolean;
}

interface SensorSpot {
  id: string;
  name: string;
  pos: [number, number, number];
  type: 'noise' | 'crowd' | 'quiet';
  level: number; // 1 to 5
  metricText: string;
  subtitle: string;
  color: string;
  radius: number;
}

const SENSOR_SPOTS: SensorSpot[] = [
  {
    id: 'palco-noise',
    name: 'Palco Principal (Keynotes)',
    pos: [14.0, 0.05, -1.0],
    type: 'noise',
    level: 5,
    metricText: '88 dB • Muito Barulhento',
    subtitle: 'Show e Keynotes ao Vivo',
    color: '#ef4444',
    radius: 5.5,
  },
  {
    id: 'arena-noise',
    name: 'Arena Tech4Change',
    pos: [-1.25, 0.05, 0.5],
    type: 'noise',
    level: 4,
    metricText: '78 dB • Barulho Elevado',
    subtitle: 'Final do Hackathon',
    color: '#a855f7',
    radius: 4.5,
  },
  {
    id: 'food-crowd',
    name: 'Praça de Alimentação',
    pos: [-25.5, 0.05, 5.0],
    type: 'crowd',
    level: 4,
    metricText: '85% • Horário de Pico',
    subtitle: 'Mesas e Food Trucks Cheios',
    color: '#f59e0b',
    radius: 4.8,
  },
  {
    id: 'oracle-crowd',
    name: 'Corredor Interno / Oracle',
    pos: [18.0, 0.05, 7.5],
    type: 'crowd',
    level: 5,
    metricText: '95% • Corredor Crítico',
    subtitle: 'Fluxo Intenso de Pessoas',
    color: '#dc2626',
    radius: 3.5,
  },
  {
    id: 'quiet-oasis',
    name: 'Sala de Acolhimento Sensorial',
    pos: [21.0, 0.05, 17.5],
    type: 'quiet',
    level: 1,
    metricText: '32 dB • Silêncio Total',
    subtitle: 'Espaço Calmo & Abafadores',
    color: '#14b8a6',
    radius: 3.2,
  },
];

export function NoiseAndCrowdSensors3D({ visible = true }: NoiseAndCrowdSensors3DProps) {
  const pulseRingsRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (!visible) return;
    const t = clock.getElapsedTime();

    // Animação de expansão e fade dos anéis de onda sonora e aglomeração
    pulseRingsRef.current.forEach((ring, idx) => {
      if (!ring) return;
      const spot = SENSOR_SPOTS[idx % SENSOR_SPOTS.length];
      const cycle = (t * 1.5 + idx * 0.7) % 2.0; // 0 to 2s
      const progress = cycle / 2.0;

      const scale = 0.5 + progress * 1.2;
      ring.scale.set(scale, scale, 1);

      const mat = ring.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1 - progress) * (spot.type === 'quiet' ? 0.3 : 0.6);
      }
    });
  });

  if (!visible) return null;

  return (
    <group name="noise-and-crowd-sensors-3d">
      {SENSOR_SPOTS.map((spot, idx) => {
        const isQuiet = spot.type === 'quiet';
        const isNoise = spot.type === 'noise';

        return (
          <group key={spot.id} position={spot.pos}>
            {/* Anel de Onda Sonora / Lotação Pulsante no Piso */}
            <mesh
              ref={(el) => {
                if (el) pulseRingsRef.current[idx] = el;
              }}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.015, 0]}
            >
              <ringGeometry args={[spot.radius * 0.8, spot.radius, 32]} />
              <meshBasicMaterial
                color={spot.color}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Halo Fixo de Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
              <circleGeometry args={[spot.radius * 0.7, 32]} />
              <meshBasicMaterial
                color={spot.color}
                transparent
                opacity={isQuiet ? 0.15 : 0.08}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Badge Flutuante em 3D com Nível de Ruído / Lotação */}
            <Billboard position={[0, 3.8, 0]} follow lockX={false} lockY={false} lockZ={false}>
              <Html center distanceFactor={28} zIndexRange={[1, 1]}>
                <div
                  className="px-3 py-1.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all select-none whitespace-nowrap flex items-center gap-2"
                  style={{
                    backgroundColor: isQuiet ? 'rgba(240, 253, 250, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: spot.color,
                    boxShadow: `0 8px 24px -4px ${spot.color}33`,
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 animate-ping"
                    style={{ backgroundColor: spot.color }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: spot.color }}>
                      <span>{isQuiet ? '🤫' : isNoise ? '🔊' : '👥'}</span>
                      <span>{spot.metricText}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {spot.name}
                    </div>
                  </div>
                </div>
              </Html>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
