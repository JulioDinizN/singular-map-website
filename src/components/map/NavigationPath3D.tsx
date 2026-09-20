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
  const chevronsGroupRef = useRef<THREE.Group>(null);
  const pinGroupRef = useRef<THREE.Group>(null);
  const beaconBeamRef = useRef<THREE.Mesh>(null);

  const { curve, tubeGeometry, casingGeometry, startPos, endPos, isEmergency } = useMemo(() => {
    if (!route || route.points.length < 2) {
      return {
        curve: null,
        tubeGeometry: null,
        casingGeometry: null,
        startPos: null,
        endPos: null,
        isEmergency: false,
      };
    }

    const vectors = route.points.map(
      (p) => new THREE.Vector3(p[0], p[1] + 0.18, p[2])
    );
    const splineCurve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.15);
    const tubularSegments = Math.max(32, route.points.length * 16);

    // Inner bright navigation core tube
    const coreGeom = new THREE.TubeGeometry(splineCurve, tubularSegments, 0.22, 12, false);
    // Outer casing / shadow tube for contrast against floor
    const casingGeom = new THREE.TubeGeometry(splineCurve, tubularSegments, 0.32, 12, false);

    return {
      curve: splineCurve,
      tubeGeometry: coreGeom,
      casingGeometry: casingGeom,
      startPos: vectors[0],
      endPos: vectors[vectors.length - 1],
      isEmergency: route.isEmergencyExitRoute ?? false,
    };
  }, [route]);

  // Chevron shape for directional arrows along the path
  const chevronShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.28, -0.22);
    s.lineTo(0, 0.22);
    s.lineTo(0.28, -0.22);
    s.lineTo(0.14, -0.22);
    s.lineTo(0, 0.04);
    s.lineTo(-0.14, -0.22);
    s.closePath();
    return s;
  }, []);

  const chevronGeometry = useMemo(() => {
    return new THREE.ShapeGeometry(chevronShape);
  }, [chevronShape]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse destination concentric rings
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, i) => {
        const cycle = ((t * 1.4 + i * 0.45) % 1.5) / 1.5; // 0 to 1
        const scale = 0.6 + cycle * 1.8;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - cycle) * 0.75);
        }
      });
    }

    // Move directional chevron arrows along the path
    if (chevronsGroupRef.current && curve) {
      const children = chevronsGroupRef.current.children;
      const count = children.length;
      for (let i = 0; i < count; i++) {
        // Continuous flow forward
        const progress = (t * 0.22 + i / count) % 1;
        const pos = curve.getPointAt(progress);
        const tangent = curve.getTangentAt(progress);
        // Elevate slightly above the tube
        children[i].position.set(pos.x, pos.y + 0.16, pos.z);
        // Orient towards tangent, facing flat horizontal
        const up = new THREE.Vector3(0, 1, 0);
        const matrix = new THREE.Matrix4();
        matrix.lookAt(pos, pos.clone().add(tangent), up);
        // Chevron shape geometry is defined in XY plane pointing +Y; rotate flat into XZ plane pointing along tangent
        children[i].rotation.set(-Math.PI / 2, 0, Math.atan2(-tangent.x, -tangent.z) + Math.PI);
      }
    }

    // Pin floating bounce animation
    if (pinGroupRef.current) {
      const bobY = Math.sin(t * 3.2) * 0.14;
      pinGroupRef.current.position.y = (endPos?.y ?? 0) + bobY;
    }

    // Beacon beam subtle rotation and pulse
    if (beaconBeamRef.current) {
      beaconBeamRef.current.rotation.y = t * 0.5;
      const mat = beaconBeamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.18 + Math.sin(t * 2) * 0.08;
      }
    }
  });

  if (!route || !curve || !tubeGeometry || !startPos || !endPos) {
    return null;
  }

  // Waze / Google Maps iconic navigation colors
  const primaryColor = isEmergency ? '#ef4444' : '#0284c7';
  const casingColor = isEmergency ? '#7f1d1d' : '#0f172a';
  const accentGlow = isEmergency ? '#f87171' : '#38bdf8';

  return (
    <group>
      {/* Outer Contrast Casing Tube */}
      {casingGeometry && (
        <mesh geometry={casingGeometry}>
          <meshBasicMaterial color={casingColor} transparent opacity={0.35} />
        </mesh>
      )}

      {/* 3D Navigation Core Bright Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* Animated Directional Chevrons along the Path */}
      <group ref={chevronsGroupRef}>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} geometry={chevronGeometry}>
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Start Point Marker (Google Maps Green Dot + Pulse) */}
      <group position={[startPos.x, startPos.y, startPos.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.9, 1.2, 32]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.5} />
        </mesh>
        <Billboard position={[0, 1.2, 0]} follow>
          <Text
            fontSize={0.45}
            color="#059669"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#ffffff"
          >
            VOCÊ ESTÁ AQUI
          </Text>
        </Billboard>
      </group>

      {/* Destination Point Marker (Waze/Google Maps Destination Beacon & Pin) */}
      <group position={[endPos.x, 0, endPos.z]}>
        {/* Holographic Vertical Beacon Beam */}
        <mesh ref={beaconBeamRef} position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.2, 1.4, 9, 32, 1, true]} />
          <meshBasicMaterial
            color={accentGlow}
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Concentric Pulsing Floor Rings */}
        <group ref={pulseRingsRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          {[0, 1, 2].map((idx) => (
            <mesh key={idx}>
              <ringGeometry args={[0.8, 1.1, 32]} />
              <meshBasicMaterial
                color={primaryColor}
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Floating Pin & Label with Bobbing Animation */}
        <group ref={pinGroupRef}>
          {/* Ground Beacon Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color={primaryColor} transparent opacity={0.6} />
          </mesh>

          {/* Pin Pole */}
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.0, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Pin Outer Head (Teardrop Sphere) */}
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.58, 32, 32]} />
            <meshStandardMaterial
              color={isEmergency ? '#dc2626' : '#e11d48'}
              emissive={isEmergency ? '#7f1d1d' : '#9f1239'}
              emissiveIntensity={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* White Center Dot on Pin */}
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Floating Arrival Label */}
          <Billboard position={[0, 3.1, 0]} follow>
            <Text
              fontSize={0.65}
              color={isEmergency ? '#b91c1c' : '#be123c'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.07}
              outlineColor="#ffffff"
            >
              {isEmergency ? '🚨 SAÍDA DE EMERGÊNCIA' : '🎯 DESTINO'}
            </Text>
          </Billboard>
        </group>
      </group>
    </group>
  );
}

