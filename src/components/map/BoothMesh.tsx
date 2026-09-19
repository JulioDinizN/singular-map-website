import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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
      // Slight elevation bounce when hovered or selected
      const targetY = isSelected ? y + 0.4 : isHovered ? y + 0.2 : y;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 8
      );
    }
  });

  const isStage = poi.category === 'stage';
  const isRestroom = poi.category === 'restroom';
  const isWorkshop = poi.category === 'workshop';
  const isEntrance = poi.category === 'entrance';

  // Base opacity and color tweaks
  const opacity = isDimmed ? 0.35 : 1;
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
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Structure */}
      {isStage ? (
        // STAGE STRUCTURE
        <group>
          {/* Stage Platform */}
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

          {/* Stage Lighting Truss Arch */}
          <mesh position={[0, h * 0.95, -d / 6]}>
            <boxGeometry args={[w * 0.9, 0.25, d * 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ) : isEntrance ? (
        // ENTRANCE GATE
        <group>
          {/* Left Pillar */}
          <mesh position={[-w / 2 + 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2, 1.2]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[w / 2 - 0.6, 0, 0]} castShadow>
            <boxGeometry args={[1.2, h * 2, 1.2]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          {/* Overhead Header Banner */}
          <mesh position={[0, h * 1.5, 0]} castShadow>
            <boxGeometry args={[w, 1, 1.4]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Floor Welcome Mat */}
          <mesh position={[0, -h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.9, d * 0.9]} />
            <meshBasicMaterial color="#065f46" transparent opacity={0.7} />
          </mesh>
        </group>
      ) : (
        // EXHIBITION BOOTH / FACILITY
        <group>
          {/* Base Platform */}
          <mesh position={[0, -h / 2 + 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.3, d]} />
            <meshStandardMaterial
              color="#1e293b"
              roughness={0.6}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Main Booth Body / Walls */}
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

          {/* Header Banner with Accent Color */}
          <mesh position={[0, h / 2 + 0.3, 0]} castShadow>
            <boxGeometry args={[w * 0.96, 0.45, d * 0.96]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isSelected || internalHover ? 0.8 : 0.3}
              roughness={0.3}
            />
          </mesh>

          {/* Counter Desk in Front for Booths */}
          {!isRestroom && !isWorkshop && (
            <mesh position={[0, -h / 4, d / 2 - 0.4]} castShadow>
              <boxGeometry args={[w * 0.5, h * 0.5, 0.6]} />
              <meshStandardMaterial color="#334155" roughness={0.3} />
            </mesh>
          )}
        </group>
      )}

      {/* Floating 3D/HTML Badge & Name */}
      <Html
        position={[0, h + 0.8, 0]}
        center
        distanceFactor={38}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg flex items-center gap-1.5 transition-transform duration-200 ${
            isSelected
              ? 'bg-sky-500 text-white scale-110 ring-2 ring-white shadow-sky-500/50'
              : internalHover
              ? 'bg-slate-800 text-white scale-105 border border-sky-400'
              : 'bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-sm'
          }`}
          style={{
            transform: isSelected || internalHover ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          {/* Status / Category Dot */}
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{
              backgroundColor:
                poi.sessions?.some((s) => s.isLiveNow) ? '#22c55e' : accentColor,
              boxShadow: poi.sessions?.some((s) => s.isLiveNow)
                ? '0 0 6px #22c55e'
                : 'none',
            }}
          />
          <span>{poi.shortName || poi.name}</span>
          {poi.boothNumber && (
            <span className="text-[10px] text-slate-400 font-mono">
              {poi.boothNumber}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}
