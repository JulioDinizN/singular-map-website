interface VenueEnvironmentProps {
  activeFloor?: 1 | 2;
}

// 1400px x 1000px from NEXT26.json scaled by MAP_3D_SCALE (0.05) = 70m x 50m
export const VENUE_PLANE_WIDTH = 70.0;
export const VENUE_PLANE_DEPTH = 50.0;

export function VenueEnvironment(_props?: VenueEnvironmentProps) {
  return (
    <group>
      {/* Warm Natural Exhibition Daylight Lighting */}
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight
        position={[35, 50, 25]}
        intensity={2.0}
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
      <directionalLight
        position={[-30, 45, -25]}
        intensity={0.8}
        color="#e0f2fe"
      />

      {/* Main Exhibition Floor (exact bounds of NEXT26 API map: 70m x 50m) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[VENUE_PLANE_WIDTH, VENUE_PLANE_DEPTH]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* Outer Ground Border Base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[VENUE_PLANE_WIDTH + 8, VENUE_PLANE_DEPTH + 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

