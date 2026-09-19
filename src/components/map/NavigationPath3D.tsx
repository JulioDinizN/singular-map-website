import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import type { NavigationRoute } from '../../utils/pathfinding';

interface NavigationPath3DProps {
  route: NavigationRoute | null;
}

export function NavigationPath3D({ route }: NavigationPath3DProps) {
  const pulseRingsRef = useRef<THREE.Group>(null);
  const arrowsGroupRef = useRef<THREE.Group>(null);

  const { curve, tubeGeometry, startPos, endPos, isEmergency } = useMemo(() => {
    if (!route || route.points.length < 2) {
      return { curve: null, tubeGeometry: null, startPos: null, endPos: null, isEmergency: false };
    }

    const vectors = route.points.map(
      (p) => new THREE.Vector3(p[0], p[1] + 0.18, p[2])
    );
    const splineCurve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.15);
    const geom = new THREE.TubeGeometry(
      splineCurve,
      Math.max(24, route.points.length * 12),
      0.24,
      12,
      false
    );

    return {
      curve: splineCurve,
      tubeGeometry: geom,
      startPos: vectors[0],
      endPos: vectors[vectors.length - 1],
      isEmergency: route.isEmergencyExitRoute ?? false,
    };
  }, [route]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse destination rings
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, i) => {
        const scale = ((t * 1.5 + i * 0.5) % 1.5) + 0.6;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 0.7 - (scale - 0.6) / 1.5);
        }
      });
    }

    // Move directional arrows along the path
    if (arrowsGroupRef.current && curve) {
      const children = arrowsGroupRef.current.children;
      const count = children.length;
      for (let i = 0; i < count; i++) {
        const progress = ((t * 0.25 + i / count) % 1);
        const pos = curve.getPointAt(progress);
        const tangent = curve.getTangentAt(progress);
        children[i].position.copy(pos);
        children[i].quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      }
    }
  });

  if (!route || !curve || !tubeGeometry || !startPos || !endPos) {
    return null;
  }

  // Apple Maps / Google Maps iconic navigation colors
  const pathColor = isEmergency ? '#ef4444' : '#007aff';

  return (
    <group>
      {/* 3D Navigation Blue Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={pathColor}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Animated Directional Arrows along the Path */}
      <group ref={arrowsGroupRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.32, 0.55, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Start Point Marker (Green Base) */}
      <group position={[startPos.x, startPos.y, startPos.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
        </mesh>
        <Billboard position={[0, 1.2, 0]} follow>
          <Text
            fontSize={0.5}
            color="#059669"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#ffffff"
          >
            INÍCIO
          </Text>
        </Billboard>
      </group>

      {/* Destination Point Marker (Classic Red Teardrop / Pin) */}
      <group position={[endPos.x, endPos.y, endPos.z]}>
        {/* Pulsing Floor Rings */}
        <group ref={pulseRingsRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.9, 1.2, 32]} />
            <meshBasicMaterial
              color={isEmergency ? '#ef4444' : '#e11d48'}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[0.9, 1.2, 32]} />
            <meshBasicMaterial
              color={isEmergency ? '#ef4444' : '#e11d48'}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Pin Pole */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>

        {/* Floating Pin Diamond / Sphere */}
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color={isEmergency ? '#dc2626' : '#e11d48'}
            roughness={0.2}
          />
        </mesh>
        {/* White Center Dot on Pin */}
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <Billboard position={[0, 2.9, 0]} follow>
          <Text
            fontSize={0.65}
            color={isEmergency ? '#b91c1c' : '#be123c'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.07}
            outlineColor="#ffffff"
          >
            {isEmergency ? '🚨 SAÍDA' : '🎯 DESTINO'}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
