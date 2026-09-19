import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text, Html } from '@react-three/drei';
import type { POI } from '../../data/eventData';

interface BoothMeshProps {
  poi: POI;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (poi: POI) => void;
  onHover: (poi: POI | null) => void;
  isDimmed?: boolean;
}

export function BoothMesh({
  poi,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  isDimmed = false,
}: BoothMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [internalHover, setInternalHover] = useState(false);

  const [w, h, d] = poi.dimensions;
  const [x, y, z] = poi.position;

  // Animate selection ring and hover float
  useFrame((_, delta) => {
    if (ringRef.current && isSelected) {
      ringRef.current.rotation.z += delta * 1.5;
    }
    if (meshRef.current) {
      const targetY = isSelected ? y + 0.35 : isHovered ? y + 0.18 : y;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 8
      );
    }
  });

  const isStage = poi.category === 'stage';
  const isQuietRoom = poi.category === 'quiet_room';
  const isEmergencyExit = poi.category === 'exit' || poi.isEmergencyExit;
  const isRestroom = poi.category === 'restroom';
  const isWorkshop = poi.category === 'workshop';
  const isEntrance = poi.category === 'entrance';

  const isMajorLandmark = isStage || isQuietRoom || isEntrance || isEmergencyExit;
  const showBadge = isSelected || isHovered || internalHover;

  const opacity = isDimmed ? 0.3 : 1;
  const accentColor = poi.accentColor || poi.color;

  return (
    <group
      ref={meshRef}
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(poi);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setInternalHover(true);
        onHover(poi);
      }}
      onPointerOut={() => {
        setInternalHover(false);
        onHover(null);
      }}
    >
      {/* Selection Glow Ring */}
      {isSelected && (
        <mesh
          ref={ringRef}
          position={[0, -h / 2 + 0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[Math.max(w, d) * 0.58, Math.max(w, d) * 0.72, 32]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Structure */}
      {isStage ? (
        // STAGE STRUCTURE (AUDITÓRIO / PLENÁRIA)
        <group>
          {/* Stage Platform */}
          <mesh position={[0, -h / 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h / 2, d]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.4}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Panoramic Curved Backstage LED Display Screen */}
          <mesh position={[0, h / 2, -d / 3]} castShadow>
            <boxGeometry args={[w * 0.9, h * 0.85, 0.4]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isSelected ? 0.9 : 0.4}
              roughness={0.2}
            />
          </mesh>

          {/* Overhead Truss Arch */}
          <mesh position={[0, h * 0.95, -d / 6]}>
            <boxGeometry args={[w * 0.95, 0.3, d * 0.7]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Speaker Podium */}
          <mesh position={[-w * 0.3, h / 4, d * 0.1]} castShadow>
            <boxGeometry args={[1.2, 1.2, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        </group>
      ) : isEntrance ? (
        // PÓRTICO MONUMENTAL SÃO PAULO EXPO COM CATRACAS
        <group>
          {/* Side Pillars */}
          <mesh position={[-w / 2 + 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2.2, 1.2]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          <mesh position={[w / 2 - 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2.2, 1.2]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          {/* Top Arch */}
          <mesh position={[0, h * 1.6, 0]} castShadow>
            <boxGeometry args={[w, 1.2, 1.4]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          {/* Catracas Eletrônicas */}
          {[-3, -1, 1, 3].map((cx) => (
            <mesh key={cx} position={[cx, -h / 4, 1.2]} castShadow>
              <boxGeometry args={[0.4, 1.0, 0.8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* Carpet Floor */}
          <mesh position={[0, -h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.95, d * 0.95]} />
            <meshBasicMaterial color="#bbf7d0" transparent opacity={0.7} />
          </mesh>
        </group>
      ) : isQuietRoom ? (
        // SALA DE ACOLHIMENTO (ESPAÇO GIRASSOL)
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color="#f0fdfa"
              roughness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Calming Teal Header */}
          <mesh position={[0, h / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[w * 0.98, 0.35, d * 0.98]} />
            <meshStandardMaterial color="#0d9488" roughness={0.3} />
          </mesh>
          {/* Sunflower Gold Emblem Strip */}
          <mesh position={[0, h / 2 + 0.05, d / 2 + 0.02]}>
            <boxGeometry args={[w * 0.5, 0.15, 0.05]} />
            <meshStandardMaterial color="#eab308" roughness={0.2} emissive="#ca8a04" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ) : isEmergencyExit ? (
        // PORTAS DE EMERGÊNCIA
        <group>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#16a34a" roughness={0.3} />
          </mesh>
          {/* Exit Sign Header */}
          <mesh position={[0, h / 2 + 0.25, 0]}>
            <boxGeometry args={[w * 0.7, 0.3, d * 0.3]} />
            <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ) : poi.tier === 'startup' ? (
        // ESTANDES MODULARES PADRONIZADOS (VILA DAS STARTUPS)
        <group>
          {/* Plinth */}
          <mesh position={[0, -h / 2 + 0.08, 0]} receiveShadow>
            <boxGeometry args={[w, 0.15, d]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          {/* Back Wall (Painel Traseiro Modular) */}
          <mesh position={[0, 0, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w * 0.96, h, 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Side Partition Wall */}
          <mesh position={[-w / 2 + 0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.15, h, d * 0.9]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Branded Fascia Beam (Testeira com Marca) */}
          <mesh position={[0, h / 2 + 0.15, 0]} castShadow>
            <boxGeometry args={[w * 0.98, 0.35, d * 0.98]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          {/* Front Bistro Reception Counter */}
          <mesh position={[0, -h / 4, d / 2 - 0.4]} castShadow>
            <boxGeometry args={[w * 0.55, h * 0.5, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      ) : (
        // CLEAN ARCHITECTURAL BOOTH (ILHAS E PENÍNSULAS)
        <group>
          {/* Base Plinth */}
          <mesh position={[0, -h / 2 + 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.2, d]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Crisp White Architectural Body */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.94, h, d * 0.94]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.4}
              metalness={0.05}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Clean Colored Brand Header */}
          <mesh position={[0, h / 2 + 0.22, 0]} castShadow>
            <boxGeometry args={[w * 0.96, 0.4, d * 0.96]} />
            <meshStandardMaterial
              color={accentColor}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* Special Feature: Embraer Eve eVTOL Platform */}
          {poi.id === 'booth-eve' && (
            <group position={[0, -h / 4 + 0.1, 0]}>
              {/* Helipad/Platform Circle */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[1.5, 2.8, 32]} />
                <meshBasicMaterial color="#009B3A" transparent opacity={0.8} />
              </mesh>
              {/* Center 'H' or 'EVE' mark */}
              <mesh position={[0, 0.4, 0]} castShadow>
                <boxGeometry args={[2.5, 0.6, 1.8]} />
                <meshStandardMaterial color="#002776" roughness={0.2} metalness={0.8} />
              </mesh>
            </group>
          )}

          {/* Reception Desk */}
          {!isRestroom && !isWorkshop && poi.id !== 'booth-eve' && (
            <mesh position={[0, -h / 4, d / 2 - 0.4]} castShadow>
              <boxGeometry args={[Math.min(w * 0.4, 4), h * 0.5, 0.6]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          )}
        </group>
      )}

      {/* 3D In-World Text: Dark Charcoal (#0f172a) with White Outline for Maximum Contrast */}
      <Billboard position={[0, h + 0.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={isMajorLandmark ? 0.9 : 0.65}
          color={isSelected ? '#0284c7' : '#0f172a'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.07}
          outlineColor="#ffffff"
        >
          {poi.shortName || poi.name}
        </Text>
        {poi.boothNumber && (
          <Text
            position={[0, -0.65, 0]}
            fontSize={0.45}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#ffffff"
          >
            {poi.boothNumber}
          </Text>
        )}
      </Billboard>

      {/* Hovered/Selected Clean Tooltip */}
      {showBadge && (
        <Html
          position={[0, h + 1.6, 0]}
          center
          distanceFactor={35}
          zIndexRange={[1, 1]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'opacity 0.2s ease',
          }}
        >
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-white/95 border border-slate-200 shadow-xl shadow-slate-900/10 flex items-center gap-2 whitespace-nowrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor:
                  poi.sessions?.some((s) => s.isLiveNow) ? '#16a34a' : accentColor,
              }}
            />
            <span>{poi.name}</span>
            {poi.isAccessible && (
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                Acessível
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
