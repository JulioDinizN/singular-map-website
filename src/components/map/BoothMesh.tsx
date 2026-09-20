import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
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

  const isQuietRoom = poi.category === 'quiet_room';
  const isEmergencyExit = poi.category === 'exit' || poi.isEmergencyExit;
  const isRestroom = poi.category === 'restroom';
  const isEntrance = poi.category === 'entrance';
  const isFoodCourt = poi.id === 'food-court-1';
  const isCafeteria = poi.id === 'cafeteria';
  const isNubank = poi.id === 'booth-nubank';
  const isEve = poi.id === 'booth-eve';

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

      {/* Main Structure Matching Architectural Blueprint */}
      {poi.id === 'A_PALCO' || poi.name.toLowerCase().includes('palco') ? (
        // =========================================================================
        // PALCO PRINCIPAL (GRAND KEYNOTE AUDITORIUM - FACING SOUTH TO BOULEVARD NEXT)
        // =========================================================================
        <group>
          {/* Base Floor Plinth with Acoustic Carpet */}
          <mesh position={[0, -h / 2 + 0.05, 0]} receiveShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Elevated Stage Deck (North side, facing South towards audience) */}
          <mesh position={[0, 0.25, -d * 0.25]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.88, 0.5, d * 0.32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Glowing Front Edge LED Strip on Stage */}
          <mesh position={[0, 0.48, -d * 0.09]}>
            <boxGeometry args={[w * 0.88, 0.04, 0.06]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Ultra-Wide Curved Panoramic Backstage LED Wall (16:9 / 21:9 ratio) */}
          <group position={[0, h * 0.5, -d * 0.42]}>
            {/* Screen Frame */}
            <mesh castShadow>
              <boxGeometry args={[w * 0.82, h * 0.75, 0.25]} />
              <meshStandardMaterial color="#020617" roughness={0.5} />
            </mesh>
            {/* Active Display Panel (Vibrant Keynote Screen) */}
            <mesh position={[0, 0, 0.14]}>
              <planeGeometry args={[w * 0.8, h * 0.7]} />
              <meshStandardMaterial
                color="#dc2626"
                emissive="#ef4444"
                emissiveIntensity={isSelected ? 0.9 : 0.65}
                roughness={0.2}
              />
            </mesh>
            {/* Keynote Screen Title */}
            <Text
              position={[0, h * 0.12, 0.16]}
              fontSize={0.65}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#7f1d1d"
            >
              FIAP NEXT 2026
            </Text>
            <Text
              position={[0, -h * 0.12, 0.16]}
              fontSize={0.36}
              color="#fecaca"
              anchorX="center"
              anchorY="middle"
            >
              KEYNOTE PRINCIPAL • IA QUE AMPLIA PESSOAS
            </Text>
          </group>

          {/* Overhead Lighting Truss Rig with Spotlights */}
          <group position={[0, h * 0.95, -d * 0.2]}>
            {/* Main Truss Bar */}
            <mesh castShadow>
              <boxGeometry args={[w * 0.86, 0.15, 0.15]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* 6 Stage Spotlights pointing down */}
            {[-w * 0.35, -w * 0.21, -w * 0.07, w * 0.07, w * 0.21, w * 0.35].map((lx) => (
              <mesh key={`spot-${lx}`} position={[lx, -0.15, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.18, 0.25, 16]} />
                <meshStandardMaterial color="#020617" roughness={0.3} />
              </mesh>
            ))}
          </group>

          {/* Modern Speaker Lectern / Podium */}
          <group position={[w * 0.26, 0.5, -d * 0.2]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.7, 0.9, 0.5]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Lectern Top with Tablet */}
            <mesh position={[0, 0.92, 0]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.75, 0.05, 0.55]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
          </group>

          {/* Accessible Stage Ramp (NBR 9050 Compliant - Left Side) */}
          <group position={[-w * 0.42, 0, -d * 0.25]}>
            <mesh position={[0, 0.15, 0]} rotation={[0, 0, -0.12]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.08, d * 0.28]} />
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.35, d * 0.12]}>
              <boxGeometry args={[1.2, 0.6, 0.05]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>

          {/* Auditorium Seating Rows (Facing North towards stage, with wide central aisle) */}
          {[0, 1, 2, 3].map((row) => {
            const rz = -d * 0.02 + row * (d * 0.11);
            const ry = 0.12 + row * 0.08; // Leve inclinação de anfiteatro

            return (
              <group key={`aud-row-${row}`} position={[0, ry, rz]}>
                {/* Left Seating Block */}
                <mesh position={[-w * 0.24, 0.15, 0]} castShadow receiveShadow>
                  <boxGeometry args={[w * 0.36, 0.3, 0.55]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} />
                </mesh>
                {/* Left Seat Cushions */}
                <mesh position={[-w * 0.24, 0.32, -0.05]} castShadow>
                  <boxGeometry args={[w * 0.35, 0.08, 0.45]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>

                {/* Right Seating Block */}
                <mesh position={[w * 0.24, 0.15, 0]} castShadow receiveShadow>
                  <boxGeometry args={[w * 0.36, 0.3, 0.55]} />
                  <meshStandardMaterial color="#334155" roughness={0.7} />
                </mesh>
                {/* Right Seat Cushions */}
                <mesh position={[w * 0.24, 0.32, -0.05]} castShadow>
                  <boxGeometry args={[w * 0.35, 0.08, 0.45]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>
              </group>
            );
          })}

          {/* Reserved Accessible Wheelchair Spaces (Front Row, Central Aisle) */}
          <group position={[0, 0.1, -d * 0.02]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.8, 0.02, 0]}>
              <planeGeometry args={[1.2, 1.2]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.6} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.02, 0]}>
              <planeGeometry args={[1.2, 1.2]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.6} />
            </mesh>
            <Text position={[0, 0.2, 0]} fontSize={0.28} color="#0284c7">
              ESPAÇO RESERVADO PCD
            </Text>
          </group>
        </group>
      ) : poi.id === 'A_ARENA' || poi.name.toLowerCase().includes('arena') ? (
        // =========================================================================
        // ARENA TECH4CHANGE (HACKATHON ARENA - CIRCULAR PITCH STAGE & WORKSPACES)
        // =========================================================================
        <group>
          {/* Base Floor Plinth */}
          <mesh position={[0, -h / 2 + 0.05, 0]} receiveShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Central Circular Pitching Stage */}
          <mesh position={[0, 0.25, -d * 0.12]} castShadow receiveShadow>
            <cylinderGeometry args={[w * 0.28, w * 0.3, 0.45, 32]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Glowing Purple Stage Ring */}
          <mesh position={[0, 0.49, -d * 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[w * 0.27, w * 0.29, 32]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>

          {/* Presentation LED Totems (Dual Screens facing Audience) */}
          <group position={[0, h * 0.55, -d * 0.38]}>
            <mesh castShadow>
              <boxGeometry args={[w * 0.65, h * 0.6, 0.2]} />
              <meshStandardMaterial
                color="#6b21a8"
                emissive="#a855f7"
                emissiveIntensity={isSelected ? 0.9 : 0.6}
                roughness={0.2}
              />
            </mesh>
            <Text
              position={[0, 0, 0.12]}
              fontSize={0.55}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#3b0764"
            >
              HACKATHON TECH4CHANGE
            </Text>
          </group>

          {/* 4 Hackathon Development Benches with Dual Monitors around the stage */}
          {[
            [-w * 0.32, -d * 0.15],
            [w * 0.32, -d * 0.15],
            [-w * 0.28, d * 0.22],
            [w * 0.28, d * 0.22],
          ].map(([bx, bz], bIdx) => (
            <group key={`bench-${bIdx}`} position={[bx, 0.1, bz]}>
              {/* Work Desk */}
              <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
                <boxGeometry args={[w * 0.22, 0.7, 0.8]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              {/* 2 Dual Monitors */}
              {[-0.6, 0.6].map((mx) => (
                <mesh key={`mon-${mx}`} position={[mx, 0.85, 0]} castShadow>
                  <boxGeometry args={[0.55, 0.35, 0.05]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
                </mesh>
              ))}
            </group>
          ))}

          {/* Spectator Seating Benches at the South Side */}
          <group position={[0, 0.2, d * 0.38]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[w * 0.8, 0.35, 0.7]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[w * 0.78, 0.08, 0.65]} />
              <meshStandardMaterial color="#9333ea" roughness={0.6} />
            </mesh>
          </group>
        </group>
      ) : isFoodCourt ? (
        // PRAÇA GASTRONÔMICA (FOOD COURT WITH NORTH/SOUTH TABLES & CENTRAL COMMUNAL COUNTER)
        <group>
          {/* Base Plinth */}
          <mesh position={[0, -h / 2 + 0.05, 0]} receiveShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>

          {/* North Section: Dining Tables */}
          {[-1.3, 1.3].map((tx) =>
            Array.from({ length: 3 }).map((_, ti) => {
              const tz = -d * 0.42 + ti * (d * 0.1);
              return (
                <group key={`n-${tx}-${ti}`} position={[tx, 0, tz]}>
                  <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.3, 0.08, 1.3]} />
                    <meshStandardMaterial color="#fed7aa" roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.22, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, 0.45, 12]} />
                    <meshStandardMaterial color="#475569" metalness={0.8} />
                  </mesh>
                  {[-0.7, 0.7].map((cx) => (
                    <mesh key={cx} position={[cx, 0.25, 0]}>
                      <boxGeometry args={[0.32, 0.48, 0.32]} />
                      <meshStandardMaterial color="#ea580c" roughness={0.5} />
                    </mesh>
                  ))}
                </group>
              );
            })
          )}

          {/* Center Section: Long High Communal Counter with Bar Stools */}
          <group position={[0, 0, 0]}>
            {/* High Counter Top */}
            <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.1, d * 0.32]} />
              <meshStandardMaterial color="#78350f" roughness={0.3} />
            </mesh>
            {/* Supporting Pillar Legs */}
            {[-d * 0.12, 0, d * 0.12].map((pz) => (
              <mesh key={pz} position={[0, 0.42, pz]}>
                <boxGeometry args={[0.2, 0.84, 0.2]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>
            ))}
            {/* Bar Stools along both sides */}
            {[-1.1, 1.1].map((sx) =>
              [-d * 0.12, -d * 0.04, d * 0.04, d * 0.12].map((sz) => (
                <mesh key={`${sx}-${sz}`} position={[sx, 0.4, sz]} castShadow>
                  <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
                  <meshStandardMaterial color="#f97316" roughness={0.5} />
                </mesh>
              ))
            )}
          </group>

          {/* South Section: Dining Tables */}
          {[-1.3, 1.3].map((tx) =>
            Array.from({ length: 3 }).map((_, ti) => {
              const tz = d * 0.22 + ti * (d * 0.1);
              return (
                <group key={`s-${tx}-${ti}`} position={[tx, 0, tz]}>
                  <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.3, 0.08, 1.3]} />
                    <meshStandardMaterial color="#fed7aa" roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.22, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, 0.45, 12]} />
                    <meshStandardMaterial color="#475569" metalness={0.8} />
                  </mesh>
                  {[-0.7, 0.7].map((cx) => (
                    <mesh key={cx} position={[cx, 0.25, 0]}>
                      <boxGeometry args={[0.32, 0.48, 0.32]} />
                      <meshStandardMaterial color="#ea580c" roughness={0.5} />
                    </mesh>
                  ))}
                </group>
              );
            })
          )}
        </group>
      ) : isCafeteria ? (
        // CAFETERIA DO CERRADO (ESPRESSO BAR + WARM LEATHER LOUNGE)
        <group>
          <mesh position={[0, -h / 2 + 0.05, 0]} receiveShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color="#fff7ed" roughness={0.5} />
          </mesh>
          {/* Main Barista Coffee Counter in Rich Walnut */}
          <mesh position={[-w * 0.12, 0.55, -d * 0.22]} castShadow>
            <boxGeometry args={[w * 0.65, 1.1, 0.8]} />
            <meshStandardMaterial color="#451a03" roughness={0.3} />
          </mesh>
          {/* Brushed Stainless Steel Espresso Machine */}
          <mesh position={[-w * 0.12, 1.25, -d * 0.22]} castShadow>
            <boxGeometry args={[0.8, 0.35, 0.5]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Warm Amber Leather Lounge Sofas */}
          <mesh position={[0, 0.35, d * 0.22]} castShadow>
            <boxGeometry args={[w * 0.75, 0.7, 1.2]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
          {/* Low Coffee Table */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
        </group>
      ) : isEntrance ? (
        // PÓRTICO MONUMENTAL SÃO PAULO EXPO COM CATRACAS
        <group>
          {/* Side Pillars */}
          <mesh position={[-w / 2 + 0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.8, h * 2.2, 0.8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          <mesh position={[w / 2 - 0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.8, h * 2.2, 0.8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          {/* Top Arch */}
          <mesh position={[0, h * 1.5, 0]} castShadow>
            <boxGeometry args={[w, 0.8, 1.0]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          {/* 8 Security Turnstiles / Catracas */}
          {[-3, -2, -1, 0, 1, 2, 3].map((cx) => (
            <mesh key={cx} position={[cx * (w * 0.12), -h / 4, 0]} castShadow>
              <boxGeometry args={[0.3, 0.9, 0.6]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* Floor Carpet */}
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
          <mesh position={[0, h / 2 + 0.15, 0]} castShadow>
            <boxGeometry args={[w * 0.98, 0.3, d * 0.98]} />
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
          <mesh position={[0, h / 2 + 0.2, 0]}>
            <boxGeometry args={[w * 0.8, 0.25, d * 0.8]} />
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
          {/* Back Wall */}
          <mesh position={[0, 0, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w * 0.96, h, 0.12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Branded Fascia Beam */}
          <mesh position={[0, h / 2 + 0.15, 0]} castShadow>
            <boxGeometry args={[w * 0.98, 0.3, d * 0.98]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          {/* Front Bistro Counter */}
          <mesh position={[0, -h / 4, d / 2 - 0.3]} castShadow>
            <boxGeometry args={[w * 0.6, h * 0.5, 0.4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      ) : (
        // ARCHITECTURAL BOOTHS (NUBANK, IFOOD, ITAU, TOTVS, MERCADO LIVRE, EMBRAER EVE)
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

          {/* Brand Colored Fascia Beam */}
          <mesh position={[0, h / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[w * 0.96, 0.4, d * 0.96]} />
            <meshStandardMaterial
              color={accentColor}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>

          {/* NUBANK SPECIFIC: Curved signature reception counters & center display tables */}
          {isNubank && (
            <group>
              {/* Top-Left Curved Counter */}
              <mesh position={[-w * 0.28, -h / 4, -d * 0.25]} castShadow>
                <boxGeometry args={[w * 0.35, h * 0.5, 0.7]} />
                <meshStandardMaterial color="#820AD1" roughness={0.2} />
              </mesh>
              {/* Bottom-Right Curved Counter */}
              <mesh position={[w * 0.28, -h / 4, d * 0.25]} castShadow>
                <boxGeometry args={[w * 0.35, h * 0.5, 0.7]} />
                <meshStandardMaterial color="#820AD1" roughness={0.2} />
              </mesh>
              {/* Center-Top Oval Display Table */}
              <mesh position={[-w * 0.05, -h / 4, -d * 0.15]} castShadow receiveShadow>
                <cylinderGeometry args={[0.9, 0.9, 0.5, 24]} />
                <meshStandardMaterial color="#a855f7" roughness={0.3} />
              </mesh>
              {/* Center-Bottom Organic Display Table */}
              <mesh position={[w * 0.05, -h / 4, d * 0.15]} castShadow receiveShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.5, 24]} />
                <meshStandardMaterial color="#c084fc" roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* iFOOD SPECIFIC: Autonomous robot arena & 7 perimeter display stands */}
          {poi.id === 'booth-ifood' && (
            <group>
              {/* Robot Demonstration Track Circle */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[1.2, 1.8, 24]} />
                <meshBasicMaterial color="#ff5252" transparent opacity={0.6} />
              </mesh>
              {/* Autonomous Delivery Robot Mockup */}
              <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[0.8, 0.6, 0.8]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[0.4, 0.2, 0.4]} />
                <meshStandardMaterial color="#ea1d2c" roughness={0.2} />
              </mesh>
              {/* 3 Top Display Stands */}
              {[-w * 0.25, 0, w * 0.25].map((tx) => (
                <mesh key={`t-${tx}`} position={[tx, -h / 4, -d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.2, h * 0.45, 0.4]} />
                  <meshStandardMaterial color="#ea1d2c" roughness={0.3} />
                </mesh>
              ))}
              {/* 2 Right Display Stands */}
              {[-d * 0.2, d * 0.2].map((tz) => (
                <mesh key={`r-${tz}`} position={[w * 0.38, -h / 4, tz]} castShadow>
                  <boxGeometry args={[0.4, h * 0.45, d * 0.22]} />
                  <meshStandardMaterial color="#ea1d2c" roughness={0.3} />
                </mesh>
              ))}
              {/* 1 Left Display Stand */}
              <mesh position={[-w * 0.38, -h / 4, 0]} castShadow>
                <boxGeometry args={[0.4, h * 0.45, d * 0.3]} />
                <meshStandardMaterial color="#ea1d2c" roughness={0.3} />
              </mesh>
              {/* 1 Bottom Counter */}
              <mesh position={[0, -h / 4, d * 0.38]} castShadow>
                <boxGeometry args={[w * 0.3, h * 0.45, 0.4]} />
                <meshStandardMaterial color="#ea1d2c" roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* ITAÚ BBA SPECIFIC: Curved lounge pods, trapezoidal counter, and organic sofa */}
          {poi.id === 'booth-itau' && (
            <group>
              {/* Top-Left Curved Lounge Pod */}
              <mesh position={[-w * 0.28, -h / 4, -d * 0.28]} castShadow>
                <cylinderGeometry args={[1.2, 1.2, h * 0.45, 16, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#ec7000" roughness={0.3} />
              </mesh>
              {/* Top-Right Trapezoidal Counter */}
              <mesh position={[w * 0.25, -h / 4, -d * 0.28]} castShadow>
                <boxGeometry args={[w * 0.35, h * 0.45, 0.8]} />
                <meshStandardMaterial color="#003399" roughness={0.3} />
              </mesh>
              {/* Bottom Curved Organic Sofa Bench */}
              <mesh position={[0, -h / 4, d * 0.28]} castShadow>
                <boxGeometry args={[w * 0.65, h * 0.4, 0.8]} />
                <meshStandardMaterial color="#ec7000" roughness={0.4} />
              </mesh>
              {/* Left & Right Consultation Pods */}
              <mesh position={[-w * 0.38, -h / 4, 0]} castShadow>
                <boxGeometry args={[0.4, h * 0.45, d * 0.2]} />
                <meshStandardMaterial color="#003399" roughness={0.3} />
              </mesh>
              <mesh position={[w * 0.38, -h / 4, 0]} castShadow>
                <boxGeometry args={[0.4, h * 0.45, d * 0.2]} />
                <meshStandardMaterial color="#003399" roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* TOTVS SPECIFIC: 7 display counters matching blueprint */}
          {poi.id === 'booth-totvs' && (
            <group>
              {/* 2 Top Counters */}
              {[-w * 0.2, w * 0.2].map((tx) => (
                <mesh key={`totvs-t-${tx}`} position={[tx, -h / 4, -d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.28, h * 0.45, 0.4]} />
                  <meshStandardMaterial color="#004f9f" roughness={0.3} />
                </mesh>
              ))}
              {/* 2 Bottom Counters */}
              {[-w * 0.2, w * 0.2].map((tx) => (
                <mesh key={`totvs-b-${tx}`} position={[tx, -h / 4, d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.28, h * 0.45, 0.4]} />
                  <meshStandardMaterial color="#004f9f" roughness={0.3} />
                </mesh>
              ))}
              {/* 3 Left Counters */}
              {[-d * 0.25, 0, d * 0.25].map((tz) => (
                <mesh key={`totvs-l-${tz}`} position={[-w * 0.38, -h / 4, tz]} castShadow>
                  <boxGeometry args={[0.4, h * 0.45, d * 0.18]} />
                  <meshStandardMaterial color="#0080ff" roughness={0.3} />
                </mesh>
              ))}
            </group>
          )}

          {/* MERCADO LIVRE SPECIFIC: Curved counters and logistics display */}
          {poi.id === 'booth-mercadolivre' && (
            <group>
              {/* Top-Right Curved Counter */}
              <mesh position={[w * 0.28, -h / 4, -d * 0.28]} castShadow>
                <boxGeometry args={[w * 0.35, h * 0.45, 0.7]} />
                <meshStandardMaterial color="#ffe600" roughness={0.3} />
              </mesh>
              {/* Bottom-Right Curved Counter */}
              <mesh position={[w * 0.28, -h / 4, d * 0.28]} castShadow>
                <boxGeometry args={[w * 0.35, h * 0.45, 0.7]} />
                <meshStandardMaterial color="#ffe600" roughness={0.3} />
              </mesh>
              {/* 3 Left Display Stands */}
              {[-d * 0.25, 0, d * 0.25].map((tz) => (
                <mesh key={`meli-l-${tz}`} position={[-w * 0.38, -h / 4, tz]} castShadow>
                  <boxGeometry args={[0.4, h * 0.45, d * 0.2]} />
                  <meshStandardMaterial color="#2d3277" roughness={0.3} />
                </mesh>
              ))}
              {/* 2 Top-Left Counters */}
              {[-w * 0.22, 0].map((tx) => (
                <mesh key={`meli-t-${tx}`} position={[tx, -h / 4, -d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.18, h * 0.45, 0.4]} />
                  <meshStandardMaterial color="#ffe600" roughness={0.3} />
                </mesh>
              ))}
            </group>
          )}

          {/* EMBRAER EVE SPECIFIC: Mockup eVTOL Cabin & Display Stands */}
          {isEve && (
            <group position={[0, -h / 4 + 0.1, 0]}>
              {/* Helipad Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[1.5, 2.5, 32]} />
                <meshBasicMaterial color="#009B3A" transparent opacity={0.8} />
              </mesh>
              {/* eVTOL Fuselage Mockup */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[w * 0.5, 0.9, d * 0.4]} />
                <meshStandardMaterial color="#002776" roughness={0.2} metalness={0.7} />
              </mesh>
              {/* Display Stands along Top and Bottom Rows */}
              {[-w * 0.35, -w * 0.12, w * 0.12, w * 0.35].map((tx) => (
                <mesh key={`eve-t-${tx}`} position={[tx, 0.3, -d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.15, 0.6, 0.4]} />
                  <meshStandardMaterial color="#009b3a" roughness={0.3} />
                </mesh>
              ))}
              {[-w * 0.35, -w * 0.12, w * 0.12, w * 0.35].map((tx) => (
                <mesh key={`eve-b-${tx}`} position={[tx, 0.3, d * 0.38]} castShadow>
                  <boxGeometry args={[w * 0.15, 0.6, 0.4]} />
                  <meshStandardMaterial color="#009b3a" roughness={0.3} />
                </mesh>
              ))}
            </group>
          )}

          {/* Standard Reception Desk */}
          {!isRestroom && !isNubank && !isEve && poi.id !== 'booth-ifood' && poi.id !== 'booth-itau' && poi.id !== 'booth-totvs' && poi.id !== 'booth-mercadolivre' && (
            <mesh position={[0, -h / 4, d / 2 - 0.4]} castShadow>
              <boxGeometry args={[Math.min(w * 0.4, 4), h * 0.5, 0.5]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          )}
        </group>
      )}

      {/* Minimal Floating Badge Pill on Top of 3D Building (Same Title as Inspect Drawer) */}
      <Html
        position={[0, h + 0.45, 0]}
        center
        distanceFactor={38}
        zIndexRange={[1, 10]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium whitespace-nowrap flex items-center gap-1.5 transition-all select-none shadow-xs border ${
            isSelected
              ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold ring-2 ring-blue-400/30 scale-105'
              : isHovered || internalHover
              ? 'bg-white text-slate-900 border-slate-300 shadow-sm font-semibold scale-102'
              : 'bg-white/92 backdrop-blur-xs text-slate-800 border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: isSelected
                ? '#ffffff'
                : poi.sessions?.some((s) => s.isLiveNow)
                ? '#16a34a'
                : accentColor,
            }}
          />
          <span className="truncate max-w-[120px] sm:max-w-[160px]">{poi.name}</span>
          {poi.boothNumber && (
            <span
              className={`text-[9px] font-mono px-1 rounded ${
                isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {poi.boothNumber}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}
