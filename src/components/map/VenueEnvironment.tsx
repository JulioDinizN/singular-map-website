import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { AllArchitecturalDoors } from './ArchitecturalDoors';
import { StartupAlley } from './StartupAlley';

interface VenueEnvironmentProps {
  activeFloor: 1 | 2;
}

// Exact dimensions calculated from 1376x768 blueprint:
export const VENUE_PLANE_WIDTH = 84.0;
export const VENUE_PLANE_DEPTH = (84.0 * 768.0) / 1376.0; // 46.8837

// 24 structural columns (4 rows × 6 columns) matching the architectural grid
const STRUCTURAL_PILLARS = [
  // Row 1: North (Avenida dos Palcos, Z = -14.83)
  { id: 'P1', pos: [-25.21, 0, -14.83] as [number, number, number] },
  { id: 'P2', pos: [-12.70, 0, -14.83] as [number, number, number] },
  { id: 'P3', pos: [-2.81, 0, -14.83] as [number, number, number] },
  { id: 'P4', pos: [2.81, 0, -14.83] as [number, number, number] },
  { id: 'P5', pos: [9.83, 0, -14.83] as [number, number, number] },
  { id: 'P6', pos: [23.74, 0, -14.83] as [number, number, number] },

  // Row 2: Upper-Middle (Between top & bottom booths, Z = -7.51)
  { id: 'P1', pos: [-25.21, 0, -7.51] as [number, number, number] },
  { id: 'P2', pos: [-12.70, 0, -7.51] as [number, number, number] },
  { id: 'P3', pos: [-2.81, 0, -7.51] as [number, number, number] },
  { id: 'P4', pos: [2.81, 0, -7.51] as [number, number, number] },
  { id: 'P5', pos: [9.83, 0, -7.51] as [number, number, number] },
  { id: 'P6', pos: [23.74, 0, -7.51] as [number, number, number] },

  // Row 3: Lower-Middle (Cross aisle / Rua 200-300-400, Z = -0.06)
  { id: 'P1', pos: [-25.21, 0, -0.06] as [number, number, number] },
  { id: 'P2', pos: [-12.70, 0, -0.06] as [number, number, number] },
  { id: 'P3', pos: [-2.81, 0, -0.06] as [number, number, number] },
  { id: 'P4', pos: [2.81, 0, -0.06] as [number, number, number] },
  { id: 'P5', pos: [9.83, 0, -0.06] as [number, number, number] },
  { id: 'P6', pos: [23.74, 0, -0.06] as [number, number, number] },

  // Row 4: South (Bottom of booths / Concurso Sul, Z = 7.51)
  { id: 'P1', pos: [-25.21, 0, 7.51] as [number, number, number] },
  { id: 'P2', pos: [-12.70, 0, 7.51] as [number, number, number] },
  { id: 'P3', pos: [-2.81, 0, 7.51] as [number, number, number] },
  { id: 'P4', pos: [2.81, 0, 7.51] as [number, number, number] },
  { id: 'P5', pos: [9.83, 0, 7.51] as [number, number, number] },
  { id: 'P6', pos: [23.74, 0, 7.51] as [number, number, number] },
];

export function VenueEnvironment({ activeFloor }: VenueEnvironmentProps) {
  // Load architectural floorplan reference blueprint texture
  const floorplanTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/floorplan_reference.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  return (
    <group>
      {/* Warm Natural Exhibition Daylight Lighting */}
      <ambientLight intensity={1.9} color="#ffffff" />
      <directionalLight
        position={[35, 55, 25]}
        intensity={2.2}
        color="#fffef7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={130}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-30, 45, -25]}
        intensity={0.9}
        color="#e0f2fe"
      />

      {/* ================= FLOOR 1 (GROUND EXPO) ================= */}
      <group position={[0, 0, 0]}>
        {/* Architectural Blueprint Floor Ground Overlay (100% 1:1 Scale) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.001, 0]}
          receiveShadow
        >
          <planeGeometry args={[VENUE_PLANE_WIDTH, VENUE_PLANE_DEPTH]} />
          <meshBasicMaterial
            map={floorplanTexture}
            toneMapped={false}
          />
        </mesh>

        {/* Outer Background Border Base */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[96, 58]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>

        {/* ================= PERIMETER STRUCTURAL WALLS ================= */}
        {/* Main Hall North Outer Wall */}
        <mesh position={[0.64, 1.8, -20.88]} castShadow receiveShadow>
          <boxGeometry args={[72.1, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* North Rooms Inner Wall (dividing service rooms from Avenida dos Palcos) */}
        {/* Left Segment */}
        <mesh position={[-18.5, 1.6, -18.68]} castShadow receiveShadow>
          <boxGeometry args={[32.0, 3.2, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
        {/* Right Segment */}
        <mesh position={[14.5, 1.6, -18.68]} castShadow receiveShadow>
          <boxGeometry args={[22.0, 3.2, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* North Room Partition Walls */}
        {[-25.0, -12.0, -2.0, 2.0, 12.0].map((px) => (
          <mesh key={px} position={[px, 1.6, -19.78]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 3.2, 2.2]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
        ))}

        {/* Main Hall West Wall */}
        <mesh position={[-35.41, 1.8, -3.42]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 3.6, 34.92]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Main Hall East Wall */}
        <mesh position={[36.69, 1.8, -3.42]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 3.6, 34.92]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Main Hall South Wall Left (west of lobby) */}
        <mesh position={[-24.69, 1.8, 14.04]} castShadow receiveShadow>
          <boxGeometry args={[21.43, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Main Hall South Wall Right (east of lobby) */}
        <mesh position={[25.42, 1.8, 14.04]} castShadow receiveShadow>
          <boxGeometry args={[22.53, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* ================= LOBBY ENCLOSURE & INTERIOR ================= */}
        {/* Lobby West Wall */}
        <mesh position={[-13.98, 1.8, 16.63]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 3.6, 5.19]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Lobby East Wall */}
        <mesh position={[14.16, 1.8, 16.63]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 3.6, 5.19]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Lobby South Wall Left & Right of Entrance Doors */}
        <mesh position={[-8.5, 1.8, 19.23]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>
        <mesh position={[8.5, 1.8, 19.23]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Lobby Inner Wall (dividing Lobby from Boulevard Central, with wide open portal) */}
        <mesh position={[-7.5, 1.8, 14.04]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>
        <mesh position={[7.5, 1.8, 14.04]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 3.6, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>

        {/* Lobby Reception Counter with 4 Stools */}
        <group position={[-5.5, 0, 16.63]}>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.5, 1.1, 0.9]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          {/* Counter Top */}
          <mesh position={[0, 1.12, 0]} castShadow>
            <boxGeometry args={[6.8, 0.08, 1.05]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* 4 Circular Reception Stools */}
          {[-2.2, -0.7, 0.7, 2.2].map((sx) => (
            <mesh key={sx} position={[sx, 0.35, 0.8]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.65, 16]} />
              <meshStandardMaterial color="#64748b" roughness={0.4} />
            </mesh>
          ))}
          <Text position={[0, 1.4, 0]} fontSize={0.35} color="#0f172a">
            CREDENCIAMENTO & LIBRAS
          </Text>
        </group>

        {/* 8 Turnstiles / Catracas with Guide Barriers */}
        <group position={[0.0, 0, 16.63]}>
          {[-2.4, -1.7, -1.0, -0.3, 0.4, 1.1, 1.8, 2.5].map((tx) => (
            <group key={tx} position={[tx, 0, 0]}>
              {/* Turnstile Body */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.22, 1.0, 0.7]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Rotating Arm */}
              <mesh position={[0.15, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ================= EAST WING (FOOD COURT & CAFETERIA ROOMS) ================= */}
        {/* Main Food Court Dividing Wall */}
        <mesh position={[26.56, 1.6, -3.42]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 3.2, 34.92]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.35} />
        </mesh>

        {/* Cafeteria Room Dividing Wall (X = 31.8) */}
        <mesh position={[31.8, 1.6, -11.23]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 3.2, 8.55]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* East Restrooms Dividing Wall (X = 31.8) */}
        <mesh position={[31.8, 1.6, 10.5]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 3.2, 6.84]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>

        {/* ================= 24 STRUCTURAL PILLARS (P1 to P6) ================= */}
        {STRUCTURAL_PILLARS.map((pillar, idx) => (
          <group key={`${pillar.id}-${idx}`} position={pillar.pos}>
            {/* Concrete Pillar Column */}
            <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 7.0, 0.85]} />
              <meshStandardMaterial color="#64748b" roughness={0.7} metalness={0.1} />
            </mesh>
            {/* Base Protective Collar */}
            <mesh position={[0, 0.2, 0]} receiveShadow>
              <boxGeometry args={[1.1, 0.4, 1.1]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.5} />
            </mesh>
            {/* Overhead Pillar Sign Cube */}
            <mesh position={[0, 5.0, 0]} castShadow>
              <boxGeometry args={[1.0, 0.65, 1.0]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            {/* Pillar Numbering on 4 Faces */}
            <Text position={[0, 5.0, 0.52]} fontSize={0.4} color="#ffffff">
              {pillar.id}
            </Text>
            <Text position={[0, 5.0, -0.52]} rotation={[0, Math.PI, 0]} fontSize={0.4} color="#ffffff">
              {pillar.id}
            </Text>
            <Text position={[0.52, 5.0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.4} color="#ffffff">
              {pillar.id}
            </Text>
            <Text position={[-0.52, 5.0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.4} color="#ffffff">
              {pillar.id}
            </Text>
          </group>
        ))}

        {/* ================= LOBBY ENCLOSED STAIRWELLS ================= */}
        {/* Left Enclosed Stairwell */}
        <group position={[-12.43, 0, 16.63]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 3.2, 4.8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          <Text position={[0, 3.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.35} color="#334155">
            ESCADA 2F
          </Text>
        </group>

        {/* Right Enclosed Stairwell */}
        <group position={[12.57, 0, 16.63]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 3.2, 4.8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          <Text position={[0, 3.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.35} color="#334155">
            ESCADA 2F
          </Text>
        </group>

        {/* Glass Elevator Tower in Lobby */}
        <group position={[2.5, 0, 15.5]}>
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 7, 2.5]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <boxGeometry args={[2.0, 3, 2.0]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} />
          </mesh>
        </group>

        {/* ================= ALL 3D ARCHITECTURAL DOORS ================= */}
        <AllArchitecturalDoors />

        {/* ================= ALL 16 MODULAR STARTUP BOOTHS ================= */}
        <StartupAlley />
      </group>

      {/* ================= FLOOR 2 (MEZZANINE / WORKSHOPS) - STRICT VISIBILITY ================= */}
      <group position={[0, 6.5, 0]} visible={activeFloor === 2}>
        {/* Mezzanine Surface overlooking the Boulevard */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 16.63]}
          receiveShadow
        >
          <planeGeometry args={[28, 5.2]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.6}
          />
        </mesh>

        {/* North Mezzanine Gallery over Palcos */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -15.0]}
          receiveShadow
        >
          <planeGeometry args={[56, 8.0]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.6}
          />
        </mesh>

        {/* Glass Safety Railing */}
        <mesh position={[0, 0.5, 14.1]}>
          <boxGeometry args={[28, 1.0, 0.08]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}
