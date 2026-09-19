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

        {/* Soft Pastel Zone Overlays (Apple Maps style) */}
        {/* Sala de Acolhimento / Sensory Quiet Zone (Serene Teal) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-28, 0.01, 8]}>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#ccfbf1" roughness={0.9} />
        </mesh>

        {/* Main Stage Zone (Soft Lavender) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.01, -18]}>
          <planeGeometry args={[24, 18]} />
          <meshStandardMaterial color="#ede9fe" roughness={0.9} />
        </mesh>

        {/* Tech Stage Zone (Soft Sky) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.01, -18]}>
          <planeGeometry args={[20, 16]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.9} />
        </mesh>

        {/* AI & Robotics Zone (Soft Blue) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, 0.01, 1]}>
          <planeGeometry args={[14, 22]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.9} />
        </mesh>

        {/* Cloud & Fintech Zone (Soft Mint/Cyan) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.01, 1]}>
          <planeGeometry args={[14, 22]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.9} />
        </mesh>

        {/* Food & Networking Area (Soft Rose/Peach) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 20]}>
          <planeGeometry args={[60, 12]} />
          <meshStandardMaterial color="#ffe4e6" roughness={0.9} />
        </mesh>

        {/* Polished White Walking Corridors with Subtle Borders */}
        {/* Central North-South Aisle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]} receiveShadow>
          <planeGeometry args={[4.2, 44]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* West-East Cross Aisle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]} receiveShadow>
          <planeGeometry args={[56, 4.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* West Corridor to Stage & Acolhimento */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16, 0.02, 3]} receiveShadow>
          <planeGeometry args={[3.6, 40]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* East Corridor to Tech Stage */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, 0.02, 3]} receiveShadow>
          <planeGeometry args={[3.6, 40]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Quiet Walkway to Sala de Acolhimento */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.02, 8]} receiveShadow>
          <planeGeometry args={[14, 3.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= VERTICAL ACCESS: ELEVATOR & STAIRS ================= */}
      {/* 1) Modern Glass Elevator Tower */}
      <group position={[2, 0, -16]}>
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
      <group position={[-2, 0, -16]}>
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
          <planeGeometry args={[54, 24]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.6}
            transparent
            opacity={activeFloor === 2 ? 1.0 : 0.4}
          />
        </mesh>

        {/* Clean Glass Safety Railing with Aluminum Cap */}
        <mesh position={[0, 0.5, 4]}>
          <boxGeometry args={[54, 1.0, 0.08]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={activeFloor === 2 ? 0.35 : 0.15}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.02, 4]}>
          <boxGeometry args={[54, 0.06, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
