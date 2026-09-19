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
      const targetY = isSelected ? y + 0.4 : isHovered ? y + 0.2 : y;
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

  // Major landmarks show badge by default; other booths show 3D text and only show badge on hover/select
  const isMajorLandmark = isStage || isQuietRoom || isEntrance || isEmergencyExit;
  const showBadge = isSelected || isHovered || internalHover;

  // Base opacity and color tweaks
  const opacity = isDimmed ? 0.25 : 1;
  const mainColor = poi.color;
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
          <ringGeometry args={[Math.max(w, d) * 0.6, Math.max(w, d) * 0.75, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Structure */}
      {isStage ? (
        // STAGE STRUCTURE
        <group>
          <mesh position={[0, -h / 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h / 2, d]} />
            <meshStandardMaterial
              color="#1e1b4b"
              roughness={0.4}
              metalness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Curved Backstage LED Display Screen */}
          <mesh position={[0, h / 2, -d / 3]} castShadow>
            <boxGeometry args={[w * 0.85, h * 0.85, 0.4]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isSelected ? 1.2 : 0.6}
              roughness={0.2}
            />
          </mesh>

          {/* Truss Arch */}
          <mesh position={[0, h * 0.95, -d / 6]}>
            <boxGeometry args={[w * 0.9, 0.25, d * 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ) : isEntrance ? (
        // ENTRANCE GATE
        <group>
          <mesh position={[-w / 2 + 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2, 1.2]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          <mesh position={[w / 2 - 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2, 1.2]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          <mesh position={[0, h * 1.5, 0]} castShadow>
            <boxGeometry args={[w, 1, 1.4]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0, -h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.9, d * 0.9]} />
            <meshBasicMaterial color="#065f46" transparent opacity={0.7} />
          </mesh>
        </group>
      ) : isQuietRoom ? (
        // SALA DE ACOLHIMENTO (SENSORY RELIEF)
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color="#0f766e"
              roughness={0.5}
              metalness={0.1}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Soft Calming Header */}
          <mesh position={[0, h / 2 + 0.25, 0]} castShadow>
            <boxGeometry args={[w * 0.98, 0.4, d * 0.98]} />
            <meshStandardMaterial
              color="#2dd4bf"
              emissive="#14b8a6"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ) : isEmergencyExit ? (
        // EMERGENCY EXIT DOOR
        <group>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color="#16a34a"
              emissive="#22c55e"
              emissiveIntensity={0.7}
            />
          </mesh>
        </group>
      ) : (
        // STANDARD EXHIBITOR BOOTH
        <group>
          <mesh position={[0, -h / 2 + 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.3, d]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>

          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.94, h, d * 0.94]} />
            <meshStandardMaterial
              color={mainColor}
              roughness={0.4}
              metalness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>

          <mesh position={[0, h / 2 + 0.3, 0]} castShadow>
            <boxGeometry args={[w * 0.96, 0.45, d * 0.96]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isSelected || internalHover ? 0.8 : 0.3}
              roughness={0.3}
            />
          </mesh>

          {!isRestroom && !isWorkshop && (
            <mesh position={[0, -h / 4, d / 2 - 0.4]} castShadow>
              <boxGeometry args={[w * 0.5, h * 0.5, 0.6]} />
              <meshStandardMaterial color="#334155" roughness={0.3} />
            </mesh>
          )}
        </group>
      )}

      {/* 3D In-World Text (Never clips over DOM UI elements!) */}
      <Billboard position={[0, h + 0.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={isMajorLandmark ? 0.9 : 0.65}
          color={isSelected ? '#38bdf8' : '#f8fafc'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#050811"
        >
          {poi.shortName || poi.name}
        </Text>
        {poi.boothNumber && (
          <Text
            position={[0, -0.65, 0]}
            fontSize={0.45}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#050811"
          >
            {poi.boothNumber}
          </Text>
        )}
      </Billboard>

      {/* Selected / Hovered Focused HTML Tooltip with STRICT LOW Z-INDEX (z-1) */}
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
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900/95 border border-sky-400 shadow-xl shadow-black/80 flex items-center gap-2 whitespace-nowrap">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  poi.sessions?.some((s) => s.isLiveNow) ? '#22c55e' : accentColor,
              }}
            />
            <span>{poi.name}</span>
            {poi.isAccessible && (
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-700/50">
                Acessível
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
