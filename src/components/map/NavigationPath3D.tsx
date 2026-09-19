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

  // Generate smooth 3D curve from route points
  const { curve, tubeGeometry, startPos, endPos, isEmergency } = useMemo(() => {
    if (!route || route.points.length < 2) {
      return { curve: null, tubeGeometry: null, startPos: null, endPos: null, isEmergency: false };
    }

    // Elevate slightly to avoid z-fighting with the floor
    const vectors = route.points.map(
      (p) => new THREE.Vector3(p[0], p[1] + 0.15, p[2])
    );
    const splineCurve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.15);
    const geom = new THREE.TubeGeometry(
      splineCurve,
      Math.max(24, route.points.length * 12),
      0.22,
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

  // Animate directional pulses & destination ripples
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse destination rings
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, i) => {
        const scale = ((t * 1.5 + i * 0.5) % 1.5) + 0.6;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 0.8 - (scale - 0.6) / 1.5);
        }
      });
    }

    // Move directional arrows/pulses along the path
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

  const pathColor = isEmergency ? '#ef4444' : '#0284c7';
  const emissiveColor = isEmergency ? '#f87171' : '#38bdf8';

  return (
    <group>
      {/* 3D Glowing Walking Path Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={pathColor}
          emissive={emissiveColor}
          emissiveIntensity={1.0}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Animated Directional Arrows along the Path */}
      <group ref={arrowsGroupRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i}>
            {/* Forward Chevron Arrow */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.35, 0.6, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Start Point Marker */}
      <group position={[startPos.x, startPos.y, startPos.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
        </mesh>
        <Billboard position={[0, 1.2, 0]} follow>
          <Text
            fontSize={0.5}
            color="#34d399"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#050811"
          >
            INÍCIO
          </Text>
        </Billboard>
      </group>

      {/* Destination Point Marker (Pin & Ripple Rings) */}
      <group position={[endPos.x, endPos.y, endPos.z]}>
        {/* Pulsing Floor Rings */}
        <group ref={pulseRingsRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.9, 1.2, 32]} />
            <meshBasicMaterial
              color={isEmergency ? '#ef4444' : '#f43f5e'}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[0.9, 1.2, 32]} />
            <meshBasicMaterial
              color={isEmergency ? '#ef4444' : '#f43f5e'}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Floating Pin / Diamond */}
        <mesh position={[0, 2.0, 0]}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color={isEmergency ? '#dc2626' : '#f43f5e'}
            emissive={isEmergency ? '#ef4444' : '#fb7185'}
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Pin Pole */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} />
        </mesh>

        <Billboard position={[0, 3.0, 0]} follow>
          <Text
            fontSize={0.65}
            color={isEmergency ? '#fca5a5' : '#fda4af'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#050811"
          >
            {isEmergency ? '🚨 SAÍDA' : '🎯 DESTINO'}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
