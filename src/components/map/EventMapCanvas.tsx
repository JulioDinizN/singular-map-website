import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { POI_LIST } from '../../data/eventData';
import type { POI, PoiCategory } from '../../data/eventData';
import type { NavigationRoute } from '../../utils/pathfinding';
import { VenueEnvironment } from './VenueEnvironment';
import { BoothMesh } from './BoothMesh';
import { NavigationPath3D } from './NavigationPath3D';
import { LiveUserMarker } from './LiveUserMarker';

interface EventMapCanvasProps {
  activeFloor: 1 | 2;
  selectedPoi: POI | null;
  hoveredPoi: POI | null;
  onSelectPoi: (poi: POI | null) => void;
  onHoverPoi: (poi: POI | null) => void;
  route: NavigationRoute | null;
  userPosition: [number, number, number];
  userHeading: number;
  isSimulating: boolean;
  is2DView: boolean;
  cameraTargetTrigger: number;
  cameraTargetPos: [number, number, number] | null;
  selectedCategory?: PoiCategory | 'all';
}

// Internal Camera & Controls Controller
function CameraManager({
  selectedPoi,
  is2DView,
  userPosition,
  isSimulating,
  cameraTargetPos,
  cameraTargetTrigger,
  activeFloor,
}: {
  selectedPoi: POI | null;
  is2DView: boolean;
  userPosition: [number, number, number];
  isSimulating: boolean;
  cameraTargetPos: [number, number, number] | null;
  cameraTargetTrigger: number;
  activeFloor: 1 | 2;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Target positions for lerping
  const targetCamPos = useRef(new THREE.Vector3(25, 32, 35));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // When switching 2D/3D or clicking POI, calculate target
  useEffect(() => {
    isTransitioning.current = true;

    if (is2DView) {
      targetCamPos.current.set(0, 65, 0.001);
      targetLookAt.current.set(0, activeFloor === 2 ? 7 : 0, 0);
    } else if (cameraTargetPos) {
      targetCamPos.current.set(
        cameraTargetPos[0] + 15,
        cameraTargetPos[1] + 20,
        cameraTargetPos[2] + 20
      );
      targetLookAt.current.set(
        cameraTargetPos[0],
        cameraTargetPos[1],
        cameraTargetPos[2]
      );
    } else if (selectedPoi) {
      const [px, py, pz] = selectedPoi.position;
      targetCamPos.current.set(px + 12, py + 16, pz + 16);
      targetLookAt.current.set(px, py, pz);
    } else {
      const baseY = activeFloor === 2 ? 7 : 0;
      targetCamPos.current.set(24, 30 + baseY, 34);
      targetLookAt.current.set(0, baseY, 0);
    }
  }, [is2DView, selectedPoi, cameraTargetTrigger, activeFloor, cameraTargetPos]);

  // Frame loop for smooth transitions and following live user
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isSimulating) {
      const [ux, uy, uz] = userPosition;
      controlsRef.current.target.lerp(new THREE.Vector3(ux, uy, uz), delta * 4);

      if (!is2DView) {
        camera.position.lerp(
          new THREE.Vector3(ux + 12, uy + 16, uz + 16),
          delta * 3
        );
      }
      controlsRef.current.update();
      return;
    }

    if (isTransitioning.current) {
      camera.position.lerp(targetCamPos.current, delta * 4);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 4);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.1 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.1
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={is2DView ? 0.01 : Math.PI / 2 - 0.08}
      minDistance={10}
      maxDistance={110}
      enableRotate={!is2DView}
      rotateSpeed={0.8}
      panSpeed={0.9}
      zoomSpeed={1.0}
      touches={{
        ONE: is2DView ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}

export function EventMapCanvas({
  activeFloor,
  selectedPoi,
  hoveredPoi,
  onSelectPoi,
  onHoverPoi,
  route,
  userPosition,
  userHeading,
  isSimulating,
  is2DView,
  cameraTargetTrigger,
  cameraTargetPos,
  selectedCategory = 'all',
}: EventMapCanvasProps) {
  const isNavigating = !!route;

  return (
    <div className="w-full h-full relative select-none z-0">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [25, 32, 35], fov: 45, near: 0.1, far: 500 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            onSelectPoi(null);
          }
        }}
      >
        <color attach="background" args={['#050811']} />
        <fog attach="fog" args={['#050811', 60, 140]} />

        {/* Camera and Controls Controller */}
        <CameraManager
          selectedPoi={selectedPoi}
          is2DView={is2DView}
          userPosition={userPosition}
          isSimulating={isSimulating}
          cameraTargetPos={cameraTargetPos}
          cameraTargetTrigger={cameraTargetTrigger}
          activeFloor={activeFloor}
        />

        {/* 3D Venue Structure & Lighting */}
        <VenueEnvironment activeFloor={activeFloor} />

        {/* 3D Booths & POIs */}
        <group>
          {POI_LIST.map((poi) => {
            const isSelected = selectedPoi?.id === poi.id;
            const isHovered = hoveredPoi?.id === poi.id;
            const isDestination = route?.toPoi?.id === poi.id;
            const isOrigin = route?.fromPoi?.id === poi.id;

            // When navigating, dim booths that aren't the destination or origin
            const isDimmed =
              poi.floor !== activeFloor ||
              (selectedCategory !== 'all' && poi.category !== selectedCategory) ||
              (isNavigating && !isDestination && !isOrigin && !isSelected);

            return (
              <BoothMesh
                key={poi.id}
                poi={poi}
                isSelected={isSelected}
                isHovered={isHovered}
                isDimmed={isDimmed}
                onSelect={onSelectPoi}
                onHover={onHoverPoi}
              />
            );
          })}
        </group>

        {/* Animated 3D Navigation Route */}
        <NavigationPath3D route={route} />

        {/* "You Are Here" Live User Beacon */}
        <LiveUserMarker
          position={userPosition}
          heading={userHeading}
          isSimulating={isSimulating}
        />
      </Canvas>
    </div>
  );
}
