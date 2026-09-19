import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';

interface LiveUserMarkerProps {
  position: [number, number, number];
  heading?: number; // radians
  isSimulating?: boolean;
}

export function LiveUserMarker({
  position,
  heading = 0,
  isSimulating = false,
}: LiveUserMarkerProps) {
  const markerGroupRef = useRef<THREE.Group>(null);
  const radarRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Radar pulse animation
    if (radarRingRef.current) {
      const scale = 1 + (t * 1.5) % 1.5;
      radarRingRef.current.scale.set(scale, scale, 1);
      const mat = radarRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.7 - (scale - 1) / 1.5);
      }
    }

    // Gentle vertical bobbing
    if (coreRef.current) {
      coreRef.current.position.y = 0.6 + Math.sin(t * 3) * 0.08;
    }

    // Smooth position interpolation for group
    if (markerGroupRef.current) {
      markerGroupRef.current.position.x = THREE.MathUtils.lerp(
        markerGroupRef.current.position.x,
        position[0],
        delta * 10
      );
      markerGroupRef.current.position.y = THREE.MathUtils.lerp(
        markerGroupRef.current.position.y,
        position[1],
        delta * 10
      );
      markerGroupRef.current.position.z = THREE.MathUtils.lerp(
        markerGroupRef.current.position.z,
        position[2],
        delta * 10
      );
    }
  });

  return (
    <group ref={markerGroupRef} position={position}>
      {/* Ground Radar Pulse Ring */}
      <mesh
        ref={radarRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[0.8, 1.3, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Direction Cone / Heading Indicator */}
      <group rotation={[0, heading, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0.9]}>
          <coneGeometry args={[0.6, 1.2, 16]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Core Floating User Sphere & Halo */}
      <mesh ref={coreRef} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Center White Dot */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3D In-World User Label (Never clips over DOM UI!) */}
      <Billboard position={[0, 1.6, 0]} follow>
        <Text
          fontSize={0.55}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#050811"
        >
          {isSimulating ? '🚶 Em Deslocamento' : '📍 Você Está Aqui'}
        </Text>
      </Billboard>
    </group>
  );
}
