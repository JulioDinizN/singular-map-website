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
  const isEntrance = poi.category === 'entrance';
  const isFoodCourt = poi.id === 'food-court-1';
  const isCafeteria = poi.id === 'cafeteria';
  const isNubank = poi.id === 'booth-nubank';
  const isEve = poi.id === 'booth-eve';

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

      {/* Main Structure Matching Architectural Blueprint */}
      {isStage ? (
        // PALCO BRASIL (CURVED WEST STAGE + EXPANSIVE FAN-SHAPED TIERED SEATING)
        <group>
          {/* Base Platform */}
          <mesh position={[0, -h / 2 + 0.1, 0]} receiveShadow>
            <boxGeometry args={[w, 0.2, d]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>

          {/* Curved Stage Platform on West Side (facing East) */}
          <mesh position={[-w * 0.32, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[d * 0.35, d * 0.35, 0.6, 32, 1, false, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Panoramic Curved Backstage LED Wall */}
          <mesh position={[-w * 0.45, h * 0.6, 0]} castShadow>
            <boxGeometry args={[0.3, h * 1.2, d * 0.72]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={isSelected ? 0.9 : 0.45}
              roughness={0.2}
            />
          </mesh>

          {/* Speaker Podium */}
          <mesh position={[-w * 0.22, 0.7, 0]} castShadow>
            <boxGeometry args={[0.8, 0.9, 0.6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>

          {/* Expansive Fan-Shaped Tiered Seating Rows (6 Rows × 3 Wedges) */}
          {[0, 1, 2, 3, 4, 5].map((row) => {
            const rx = -w * 0.05 + row * (w * 0.09);
            const ry = 0.15 + row * 0.25;
            const rDepth = d * (0.88 - row * 0.06);

            return (
              <group key={row} position={[rx, ry, 0]}>
                {/* Left Wedge */}
                <mesh position={[0, 0, -rDepth * 0.32]} castShadow receiveShadow>
                  <boxGeometry args={[w * 0.075, 0.3 + row * 0.05, rDepth * 0.28]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>
                {/* Center Wedge */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[w * 0.075, 0.3 + row * 0.05, rDepth * 0.26]} />
                  <meshStandardMaterial color="#334155" roughness={0.6} />
                </mesh>
                {/* Right Wedge */}
                <mesh position={[0, 0, rDepth * 0.32]} castShadow receiveShadow>
                  <boxGeometry args={[w * 0.075, 0.3 + row * 0.05, rDepth * 0.28]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>

                {/* Violet Cushioned Seats on Top */}
                <mesh position={[0, 0.18 + row * 0.025, 0]} castShadow>
                  <boxGeometry args={[w * 0.065, 0.08, rDepth * 0.92]} />
                  <meshStandardMaterial color="#7c3aed" roughness={0.7} />
                </mesh>
              </group>
            );
          })}

          {/* Technical Area / Sound & Light Control Booth (South) */}
          <mesh position={[w * 0.22, 0.5, d * 0.38]} castShadow>
            <boxGeometry args={[w * 0.45, 1.0, d * 0.18]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <Text position={[w * 0.22, 1.1, d * 0.38]} fontSize={0.32} color="#94a3b8">
            ÁREA TÉCNICA / SOM & LUZ
          </Text>
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

      {/* 3D Billboard Text Label */}
      <Billboard position={[0, h + 0.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={isMajorLandmark ? 0.85 : 0.6}
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
            position={[0, -0.6, 0]}
            fontSize={0.42}
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
          position={[0, h + 1.5, 0]}
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
