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

        {/* Clean Rectangular Venue Boundary Outline */}
        <mesh position={[0, -0.04, -32.5]}>
          <boxGeometry args={[83, 0.02, 0.2]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.04, 32.5]}>
          <boxGeometry args={[83, 0.02, 0.2]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-41.5, -0.04, 0]}>
          <boxGeometry args={[0.2, 0.02, 65]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>
        <mesh position={[41.5, -0.04, 0]}>
          <boxGeometry args={[0.2, 0.02, 65]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>

        {/* ================= SOFT PASTEL ZONE OVERLAYS (SÃO PAULO EXPO) ================= */}
        {/* Foyer de Entrada & Credenciamento (Soft Slate/Blue) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 27]}>
          <planeGeometry args={[36, 10]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.9} />
        </mesh>

        {/* Sala de Acolhimento / Espaço Girassol (Serene Teal) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26, 0.01, 22]}>
          <planeGeometry args={[18, 12]} />
          <meshStandardMaterial color="#ccfbf1" roughness={0.9} />
        </mesh>

        {/* Praça Gastronômica Brasil (Warm Rose) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[24, 0.01, 20]}>
          <planeGeometry args={[18, 15]} />
          <meshStandardMaterial color="#ffe4e6" roughness={0.9} />
        </mesh>

        {/* Rua das Startups Brasil (Soft Amber) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 16]}>
          <planeGeometry args={[18, 10]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.9} />
        </mesh>

        {/* Arena Principal Keynote (Palco Brasil) (Soft Lavender) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.01, -22]}>
          <planeGeometry args={[26, 14]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.9} />
        </mesh>

        {/* Palco DevBrasil (Soft Sky) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.01, -22]}>
          <planeGeometry args={[24, 14]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.9} />
        </mesh>

        {/* Pavilhão 1: Inovação, IA & Robótica (Soft Blue) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.01, -4]}>
          <planeGeometry args={[28, 22]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.9} />
        </mesh>

        {/* Pavilhão 2: Fintech, Nuvem & Mobilidade (Soft Mint) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.01, -4]}>
          <planeGeometry args={[28, 22]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.9} />
        </mesh>

        {/* ================= POLISHED WHITE WALKING CORRIDORS ================= */}
        {/* Boulevard Central (Main Aisle, X = 0, 6m wide) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]} receiveShadow>
          <planeGeometry args={[6.0, 42]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Rua 100 (X = -8) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.02, 1.5]} receiveShadow>
          <planeGeometry args={[3.2, 33]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Rua 200 (X = -26.5) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26.5, 0.02, 1.5]} receiveShadow>
          <planeGeometry args={[3.2, 33]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Rua 300 (X = 8) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.02, 1.5]} receiveShadow>
          <planeGeometry args={[3.2, 33]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Rua 400 (X = 25.5) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25.5, 0.02, 1.5]} receiveShadow>
          <planeGeometry args={[3.2, 33]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Avenida dos Palcos (Z = -15) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -15]} receiveShadow>
          <planeGeometry args={[72, 4.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Cruzamento Central (Z = 1) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]} receiveShadow>
          <planeGeometry args={[72, 3.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Concurso Sul & Startups (Z = 18) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 18]} receiveShadow>
          <planeGeometry args={[74, 3.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Foyer de Entrada & Catracas (Z = 26) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 26]} receiveShadow>
          <planeGeometry args={[32, 6.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Acesso à Sala de Acolhimento */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26, 0.02, 20]} receiveShadow>
          <planeGeometry args={[3.2, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* ================= 3D FLOOR DECALS & SÃO PAULO EXPO WAYFINDING ================= */}
        <Text
          position={[0, 0.025, 4]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.65}
          color="#94a3b8"
          letterSpacing={0.15}
        >
          BOULEVARD CENTRAL • SÃO PAULO EXPO
        </Text>
        <Text
          position={[0, 0.025, 27]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.55}
          color="#64748b"
          letterSpacing={0.15}
        >
          FOYER DE ENTRADA & CREDENCIAMENTO
        </Text>
        <Text
          position={[0, 0.025, 14]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          RUA DAS STARTUPS BRASIL
        </Text>
        <Text
          position={[-8, 0.025, 1]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.55}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          RUA 100 • INOVAÇÃO & IA
        </Text>
        <Text
          position={[-26.5, 0.025, 1]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.55}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          RUA 200 • TECNOLOGIA & ROBÓTICA
        </Text>
        <Text
          position={[8, 0.025, 1]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.55}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          RUA 300 • FINTECH & MOBILIDADE
        </Text>
        <Text
          position={[25.5, 0.025, 1]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.55}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          RUA 400 • SOFTWARE & DADOS
        </Text>
        <Text
          position={[0, 0.025, -15]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.6}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          AVENIDA DOS PALCOS • GRANDES ARENAS
        </Text>
        <Text
          position={[24, 0.025, 18]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="#94a3b8"
          letterSpacing={0.12}
        >
          PRAÇA GASTRONÔMICA BRASIL
        </Text>

        {/* ================= PILARES ESTRUTURAIS DO SÃO PAULO EXPO (P1 A P6) ================= */}
        {[
          { id: 'P1', pos: [-10, 0, 7] as [number, number, number] },
          { id: 'P2', pos: [10, 0, 7] as [number, number, number] },
          { id: 'P3', pos: [-10, 0, -5] as [number, number, number] },
          { id: 'P4', pos: [10, 0, -5] as [number, number, number] },
          { id: 'P5', pos: [-26.5, 0, -5] as [number, number, number] },
          { id: 'P6', pos: [25.5, 0, -5] as [number, number, number] },
        ].map((pillar) => (
          <group key={pillar.id} position={pillar.pos}>
            {/* Concrete Pillar Column */}
            <mesh position={[0, 3.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 7.5, 1.2]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.7} metalness={0.1} />
            </mesh>
            {/* Base Protective Collar */}
            <mesh position={[0, 0.2, 0]} receiveShadow>
              <boxGeometry args={[1.5, 0.4, 1.5]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
            </mesh>
            {/* Overhead Pillar Sign Cube */}
            <mesh position={[0, 5.0, 0]} castShadow>
              <boxGeometry args={[1.4, 0.8, 1.4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            {/* Pillar Numbering on 4 Faces */}
            <Text position={[0, 5.0, 0.72]} fontSize={0.45} color="#ffffff" font="bold">
              {pillar.id}
            </Text>
            <Text position={[0, 5.0, -0.72]} rotation={[0, Math.PI, 0]} fontSize={0.45} color="#ffffff" font="bold">
              {pillar.id}
            </Text>
            <Text position={[0.72, 5.0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.45} color="#ffffff" font="bold">
              {pillar.id}
            </Text>
            <Text position={[-0.72, 5.0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.45} color="#ffffff" font="bold">
              {pillar.id}
            </Text>
          </group>
        ))}
      </group>

      {/* ================= VERTICAL ACCESS: ELEVATOR & STAIRS ================= */}
      {/* 1) Modern Glass Elevator Tower */}
      <group position={[2.5, 0, -17]}>
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
      <group position={[-2.5, 0, -18]}>
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
