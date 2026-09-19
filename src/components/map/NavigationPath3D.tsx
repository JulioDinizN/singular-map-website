import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { NavigationRoute } from '../../utils/pathfinding';

interface NavigationPath3DProps {
  route: NavigationRoute | null;
}

export function NavigationPath3D({ route }: NavigationPath3DProps) {
  const pulseRingsRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);

  // Generate smooth 3D curve from route points
  const { curve, tubeGeometry, startPos, endPos } = useMemo(() => {
    if (!route || route.points.length < 2) {
      return { curve: null, tubeGeometry: null, startPos: null, endPos: null };
    }

    const vectors = route.points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const splineCurve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.2);
    const geom = new THREE.TubeGeometry(splineCurve, Math.max(20, route.points.length * 10), 0.18, 8, false);

    return {
      curve: splineCurve,
      tubeGeometry: geom,
      startPos: vectors[0],
      endPos: vectors[vectors.length - 1],
    };
  }, [route]);

  // Animate particles along the path and pulsing destination ring
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse destination rings
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, i) => {
        const scale = ((t * 1.5 + i * 0.5) % 1.5) + 0.5;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 1 - scale / 2);
        }
      });
    }

    // Move glowing travel pulses along the curve
    if (particleGroupRef.current && curve) {
      const children = particleGroupRef.current.children;
      const count = children.length;
      for (let i = 0; i < count; i++) {
        const progress = ((t * 0.35 + i / count) % 1);
        const pos = curve.getPointAt(progress);
        children[i].position.copy(pos);
      }
    }
  });

  if (!route || !curve || !tubeGeometry || !startPos || !endPos) {
    return null;
  }

  return (
    <group>
      {/* 3D Glowing Walking Path Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Animated Traveling Pulses */}
      <group ref={particleGroupRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Start Point Marker (Green Base) */}
      <group position={[startPos.x, startPos.y, startPos.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Destination Point Marker (Pin & Ripple Rings) */}
      <group position={[endPos.x, endPos.y, endPos.z]}>
        {/* Pulsing Floor Rings */}
        <group ref={pulseRingsRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.8, 1.0, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.8, 1.0, 32]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Floating Pin / Diamond */}
        <mesh position={[0, 1.8, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Pin Pole */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
