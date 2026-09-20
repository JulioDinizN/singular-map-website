import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MapControls as R3FMapControls } from '@react-three/drei';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import { POI_LIST } from '../../data/eventData';
import type { POI, PoiCategory } from '../../data/eventData';
import type { NavigationRoute } from '../../utils/pathfinding';
import { VenueEnvironment } from './VenueEnvironment';
import { BoothMesh } from './BoothMesh';
import { NavigationPath3D } from './NavigationPath3D';
import { LiveUserMarker } from './LiveUserMarker';
import { ApiCorridors3D } from './ApiCorridors3D';
import { CrowdFlux3D } from './CrowdFlux3D';
import { NoiseAndCrowdSensors3D } from './NoiseAndCrowdSensors3D';
import type { WaypointEdge } from '../../data/eventData';

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
  dynamicOverrides?: Map<string, Partial<WaypointEdge>>;
  showSensors?: boolean;
}

// Internal Camera & Controls Controller (Google Maps / Waze Style)
function CameraManager({
  selectedPoi,
  is2DView,
  userPosition,
  userHeading,
  isSimulating,
  cameraTargetPos,
  cameraTargetTrigger,
  activeFloor,
}: {
  selectedPoi: POI | null;
  is2DView: boolean;
  userPosition: [number, number, number];
  userHeading: number;
  isSimulating: boolean;
  cameraTargetPos: [number, number, number] | null;
  cameraTargetTrigger: number;
  activeFloor: 1 | 2;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<MapControlsImpl>(null);

  const targetCamPos = useRef(new THREE.Vector3(25, 32, 35));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

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
      targetLookAt.current.set(px, py, pz - 1.5);
    } else {
      const baseY = activeFloor === 2 ? 7 : 0;
      targetCamPos.current.set(22, 28 + baseY, 30);
      targetLookAt.current.set(0, baseY, -2.5);
    }
  }, [is2DView, selectedPoi, cameraTargetTrigger, activeFloor, cameraTargetPos]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isSimulating) {
      const [ux, uy, uz] = userPosition;
      controlsRef.current.target.lerp(new THREE.Vector3(ux, uy, uz), delta * 5);

      if (!is2DView) {
        // Waze/Google Maps follow camera: smoothly tracks behind the user heading
        const camDist = 16;
        const camHeight = 14;
        const camX = ux - Math.sin(userHeading) * camDist;
        const camZ = uz - Math.cos(userHeading) * camDist;
        camera.position.lerp(
          new THREE.Vector3(camX, uy + camHeight, camZ),
          delta * 4
        );
      } else {
        camera.position.lerp(new THREE.Vector3(ux, 65, uz + 0.001), delta * 5);
      }
      controlsRef.current.update();
      return;
    }

    if (isTransitioning.current) {
      camera.position.lerp(targetCamPos.current, delta * 4);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 4);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.15 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.15
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <R3FMapControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      screenSpacePanning={false}
      maxPolarAngle={is2DView ? 0.01 : Math.PI / 2.25}
      minPolarAngle={0.01}
      minDistance={6}
      maxDistance={125}
      enableRotate={!is2DView}
      rotateSpeed={0.8}
      panSpeed={1.2}
      zoomSpeed={1.1}
      onStart={() => {
        isTransitioning.current = false;
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
  dynamicOverrides,
  showSensors = true,
}: EventMapCanvasProps) {
  const isNavigating = !!route;

  return (
    <div className="w-full h-full relative select-none z-0">
      <Canvas
        shadows="percentage"
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
        <color attach="background" args={['#f1f5f9']} />
        <fog attach="fog" args={['#f1f5f9', 80, 200]} />

        {/* Camera and Controls Controller */}
        <CameraManager
          selectedPoi={selectedPoi}
          is2DView={is2DView}
          userPosition={userPosition}
          userHeading={userHeading}
          isSimulating={isSimulating}
          cameraTargetPos={cameraTargetPos}
          cameraTargetTrigger={cameraTargetTrigger}
          activeFloor={activeFloor}
        />

        {/* 3D Venue Structure & Lighting */}
        <VenueEnvironment activeFloor={activeFloor} />

        {/* 3D Corridors & Heatmap Walkways directly from API trechos */}
        <ApiCorridors3D
          eventoCodigo="NEXT26"
          dynamicOverrides={dynamicOverrides}
        />

        {/* 3D Crowd Flux of little people walking along API walkways */}
        <CrowdFlux3D eventoCodigo="NEXT26" />

        {/* 3D Real-time Acoustic & Crowd Congestion Sensors */}
        <NoiseAndCrowdSensors3D visible={showSensors} />

        {/* 3D Booths & POIs formulated from API data */}
        <group>
          {POI_LIST.filter((poi) => poi.floor === activeFloor).map((poi) => {
            const isSelected = selectedPoi?.id === poi.id;
            const isHovered = hoveredPoi?.id === poi.id;
            const isDestination = route?.toPoi?.id === poi.id;
            const isOrigin = route?.fromPoi?.id === poi.id;

            const isDimmed =
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
