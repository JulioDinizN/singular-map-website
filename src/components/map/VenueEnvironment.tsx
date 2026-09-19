import { useMemo } from 'react';
import * as THREE from 'three';

interface VenueEnvironmentProps {
  activeFloor: 1 | 2;
}

export function VenueEnvironment({ activeFloor }: VenueEnvironmentProps) {
  // Ground grid lines
  const gridHelper = useMemo(() => {
    return new THREE.GridHelper(80, 40, '#334155', '#1e293b');
  }, []);

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />
      {/* Accent Point Lights for High-Tech Vibe */}
      <pointLight position={[-22, 10, -18]} intensity={4} color="#a855f7" distance={25} />
      <pointLight position={[22, 10, -18]} intensity={3.5} color="#3b82f6" distance={25} />
      <pointLight position={[0, 8, 10]} intensity={2.5} color="#38bdf8" distance={20} />
      {/* Soft Teal light over Sala de Acolhimento */}
      <pointLight position={[-28, 6, 8]} intensity={2.0} color="#2dd4bf" distance={15} />

      {/* ================= FLOOR 1 (GROUND EXPO) ================= */}
      <group position={[0, 0, 0]}>
        {/* Main Floor Surface */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[84, 66]} />
          <meshStandardMaterial
            color="#0b0f19"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Floor Border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <ringGeometry args={[41.8, 42.2, 4]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>

        {/* Floor Grid Lines */}
        <primitive object={gridHelper} position={[0, 0.01, 0]} />

        {/* Zone Floor Tint Overlays */}
        {/* Sala de Acolhimento / Sensory Quiet Zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-28, 0.02, 8]}>
          <planeGeometry args={[14, 12]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.12} />
        </mesh>

        {/* Main Stage Zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.02, -18]}>
          <planeGeometry args={[24, 18]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} />
        </mesh>

        {/* Tech Stage Zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.02, -18]}>
          <planeGeometry args={[20, 16]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.08} />
        </mesh>

        {/* AI & Robotics Zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, 0.02, 1]}>
          <planeGeometry args={[14, 22]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} />
        </mesh>

        {/* Cloud & Fintech Zone */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.02, 1]}>
          <planeGeometry args={[14, 22]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.06} />
        </mesh>

        {/* Food & Networking Area */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 20]}>
          <planeGeometry args={[60, 12]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.05} />
        </mesh>

        {/* Main Walking Aisle Markings */}
        {/* Central North-South Aisle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 3]}>
          <planeGeometry args={[4, 44]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.25} />
        </mesh>
        {/* West-East Cross Aisle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 1]}>
          <planeGeometry args={[56, 4]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.25} />
        </mesh>
        {/* Quiet Aisle towards Sala de Acolhimento */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.03, 8]}>
          <planeGeometry args={[14, 3]} />
          <meshBasicMaterial color="#0d9488" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* ================= VERTICAL ACCESS: ELEVATOR & STAIRS ================= */}
      {/* 1) Accessible Glass Elevator Tower */}
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
        {/* Elevator Cab */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[3.2, 3, 3.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glowing Accessibility Icon Header */}
        <mesh position={[0, 7.2, 0]}>
          <boxGeometry args={[4.4, 0.6, 4.4]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 2) Staircase Structure */}
      <group position={[-2, 0, -16]}>
        {/* Frame Pillars */}
        {[-2, 2].map((px) =>
          [-2, 2].map((pz) => (
            <mesh key={`${px}-${pz}`} position={[px, 3.5, pz]}>
              <boxGeometry args={[0.25, 7, 0.25]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          ))
        )}
        {/* Staircase Steps */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[0, 0.3 + i * 0.55, -1.8 + i * 0.32]}>
            <boxGeometry args={[3.4, 0.15, 0.45]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ================= FLOOR 2 (MEZZANINE / WORKSHOPS) ================= */}
      <group position={[0, 6.5, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -8]}
          receiveShadow
        >
          <planeGeometry args={[54, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.7}
            transparent
            opacity={activeFloor === 2 ? 0.95 : 0.3}
          />
        </mesh>

        {/* Safety Glass Railing */}
        <mesh position={[0, 0.6, 4]}>
          <boxGeometry args={[54, 1.2, 0.1]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={activeFloor === 2 ? 0.4 : 0.15}
            roughness={0.2}
          />
        </mesh>

        {/* Second Floor Grid */}
        <primitive
          object={new THREE.GridHelper(54, 18, '#475569', '#1e293b')}
          position={[0, 0.02, -8]}
        />
      </group>
    </group>
  );
}
