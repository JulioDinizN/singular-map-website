import { Text } from '@react-three/drei';

interface VenueEnvironmentProps {
  activeFloor: 1 | 2;
}

export function VenueEnvironment({ activeFloor }: VenueEnvironmentProps) {
  return (
    <group>
      {/* Warm Natural Daylight Lighting */}
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight
        position={[35, 50, 25]}
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
      {/* Soft Sky Fill Light from Opposite Side */}
      <directionalLight
        position={[-30, 40, -25]}
        intensity={0.8}
        color="#e0f2fe"
      />

      {/* ================= FLOOR 1 (GROUND EXPO) ================= */}
      <group position={[0, 0, 0]}>
        {/* Base Architectural Floor Surface (Soft Light Slate) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[84, 66]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Clean Venue Boundary Outline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <ringGeometry args={[41.8, 42.2, 4]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>

        {/* ================= SOFT PASTEL ZONE OVERLAYS (GRID BLOCKS) ================= */}
        {/* Sala de Acolhimento / Sensory Quiet Zone (Serene Teal) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-28, 0.01, 18]}>
          <planeGeometry args={[16, 14]} />
          <meshStandardMaterial color="#ccfbf1" roughness={0.9} />
        </mesh>

        {/* Praça de Alimentação & Lounge (Soft Rose) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[27, 0.01, 18]}>
          <planeGeometry args={[14, 16]} />
          <meshStandardMaterial color="#ffe4e6" roughness={0.9} />
        </mesh>

        {/* Startup Alley Zone (Soft Amber) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 17]}>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.9} />
        </mesh>

        {/* Main Stage Zone (Soft Lavender) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.01, -20]}>
          <planeGeometry args={[22, 16]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.9} />
        </mesh>

        {/* Tech Stage Zone (Soft Sky) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.01, -20]}>
          <planeGeometry args={[20, 16]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.9} />
        </mesh>

        {/* AI & Robotics Zone - Aisles 100 & 200 (Soft Blue) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, 0.01, 2]}>
          <planeGeometry args={[20, 24]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.9} />
        </mesh>

        {/* Cloud & Fintech Zone - Aisles 300 & 400 (Soft Mint/Cyan) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.01, 2]}>
          <planeGeometry args={[20, 24]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.9} />
        </mesh>

        {/* ================= POLISHED WHITE WALKING CORRIDORS (ORTHOGONAL GRID) ================= */}
        {/* Concurso Central (North-South Main Aisle, X = 0) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]} receiveShadow>
          <planeGeometry args={[4.6, 44]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Alameda 100 (X = -10) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, 0.02, 2]} receiveShadow>
          <planeGeometry args={[3.6, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Alameda 200 (X = -20) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.02, 2]} receiveShadow>
          <planeGeometry args={[3.6, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Alameda 300 (X = 10) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.02, 2]} receiveShadow>
          <planeGeometry args={[3.6, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Alameda 400 (X = 20) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.02, 2]} receiveShadow>
          <planeGeometry args={[3.6, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Concurso Norte (Stage Access & Mezzanine, Z = -12) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]} receiveShadow>
          <planeGeometry args={[54, 4.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Concurso Central Crossway (Z = 2) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]} receiveShadow>
          <planeGeometry args={[54, 3.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Concurso Sul (Z = 16, connects Sala de Acolhimento, Startups and Food Court) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.02, 16]} receiveShadow>
          <planeGeometry args={[66, 4.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* ================= 3D FLOOR DECALS & AISLE WAYFINDING ================= */}
        <Text
          position={[0, 0.025, 21]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.65}
          color="#94a3b8"
          letterSpacing={0.15}
        >
          CONCURSO CENTRAL
        </Text>
        <Text
          position={[-10, 0.025, 2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          ALAMEDA 100
        </Text>
        <Text
          position={[-20, 0.025, 2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          ALAMEDA 200
        </Text>
        <Text
          position={[10, 0.025, 2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          ALAMEDA 300
        </Text>
        <Text
          position={[20, 0.025, 2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          ALAMEDA 400
        </Text>
        <Text
          position={[0, 0.025, -12]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          CONCURSO NORTE • PALCOS
        </Text>
        <Text
          position={[-2, 0.025, 16]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          CONCURSO SUL
        </Text>
      </group>

      {/* ================= VERTICAL ACCESS: ELEVATOR & STAIRS ================= */}
      {/* 1) Modern Glass Elevator Tower */}
      <group position={[2.5, 0, -16]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 7, 4.2]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Brushed Aluminum Frame Pillars */}
        {[-2, 2].map((px) =>
          [-2, 2].map((pz) => (
            <mesh key={`${px}-${pz}`} position={[px, 3.5, pz]}>
              <boxGeometry args={[0.2, 7, 0.2]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Elevator Cab */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[3.2, 3, 3.2]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Modern Blue Header */}
        <mesh position={[0, 7.15, 0]}>
          <boxGeometry args={[4.4, 0.3, 4.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
      </group>

      {/* 2) Clean Architectural Staircase */}
      <group position={[-2.5, 0, -16]}>
        {/* Steel Railings */}
        {[-1.8, 1.8].map((px) => (
          <mesh key={px} position={[px, 3.5, -0.2]} rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.08, 7.5, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Clean Oak/Steel Steps */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[0, 0.3 + i * 0.55, -1.8 + i * 0.32]} castShadow receiveShadow>
            <boxGeometry args={[3.4, 0.12, 0.45]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ================= FLOOR 2 (MEZZANINE / WORKSHOPS) ================= */}
      <group position={[0, 6.5, 0]}>
        {/* Mezzanine Surface */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -8]}
          receiveShadow
        >
          <planeGeometry args={[56, 22]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.6}
            transparent
            opacity={activeFloor === 2 ? 1.0 : 0.4}
          />
        </mesh>

        {/* Clean Glass Safety Railing with Aluminum Cap */}
        <mesh position={[0, 0.5, 3]}>
          <boxGeometry args={[56, 1.0, 0.08]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={activeFloor === 2 ? 0.35 : 0.15}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.02, 3]}>
          <boxGeometry args={[56, 0.06, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
