import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

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
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Direction Cone / Heading Indicator */}
      <group rotation={[0, heading, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0.8]}>
          <coneGeometry args={[0.6, 1.2, 16]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Core Floating User Sphere & Halo */}
      <mesh ref={coreRef} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Center White Dot */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Floating "You are here" Pill */}
      <Html
        position={[0, 1.8, 0]}
        center
        distanceFactor={32}
        zIndexRange={[200, 100]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/95 text-white text-xs font-bold rounded-full shadow-lg shadow-sky-500/50 backdrop-blur-sm border border-sky-300">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>{isSimulating ? 'Walking...' : 'You Are Here'}</span>
        </div>
      </Html>
    </group>
  );
}
