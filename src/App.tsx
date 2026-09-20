import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  POI_LIST,
  ACCESSIBILITY_PROFILES,
} from './data/eventData';
import type {
  POI,
  PoiCategory,
  AccessibilityProfile,
  WaypointEdge,
} from './data/eventData';
import {
  calculateRoute,
  calculateMultiProfileComparison,
  findClosestEmergencyExit,
} from './utils/pathfinding';
import type {
  NavigationRoute,
  ProfileComparisonResult,
} from './utils/pathfinding';
import { EventMapCanvas } from './components/map/EventMapCanvas';
import { TopBar } from './components/ui/TopBar';
import { MapControls } from './components/ui/MapControls';
import { PoiDetailDrawer } from './components/ui/PoiDetailDrawer';
import { NavigationPanel } from './components/ui/NavigationPanel';
import { LiveScheduleModal } from './components/ui/LiveScheduleModal';
import { ProfileSelector } from './components/ui/ProfileSelector';
import { ProfileComparisonModal } from './components/ui/ProfileComparisonModal';
import { ReportModal } from './components/ui/ReportModal';
import type { ReportType } from './components/ui/ReportModal';
import { ChatModal } from './components/ui/ChatModal';
import { OrganizerModal } from './components/ui/OrganizerModal';

// Starting user location: Main Entrance
const INITIAL_USER_POS: [number, number, number] = [0, 0.4, 27];

export default function App() {
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [hoveredPoi, setHoveredPoi] = useState<POI | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PoiCategory | 'all'>('all');

  // Accessibility Profile
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfile>(
    ACCESSIBILITY_PROFILES.PADRAO
  );

  // Dynamic Graph Overrides (Crowdsourced Reports)
  const [dynamicOverrides, setDynamicOverrides] = useState<
    Map<string, Partial<WaypointEdge>>
  >(new Map());

  // Live user position & orientation
  const [userPosition, setUserPosition] = useState<[number, number, number]>(INITIAL_USER_POS);
  const [userFloor, setUserFloor] = useState<1 | 2>(1);
  const [userHeading, setUserHeading] = useState<number>(-Math.PI / 2);

  // Active navigation route
  const [route, setRoute] = useState<NavigationRoute | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Modals & Triggers
  const [is2DView, setIs2DView] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState<boolean>(false);

  const [cameraTargetTrigger, setCameraTargetTrigger] = useState<number>(0);
  const [cameraTargetPos, setCameraTargetPos] = useState<[number, number, number] | null>(null);

  // Count live sessions for badge
  const liveSessionsCount = useMemo(() => {
    let count = 0;
    for (const poi of POI_LIST) {
      if (poi.sessions) {
        count += poi.sessions.filter((s) => s.isLiveNow).length;
      }
    }
    return count;
  }, []);

  // Handle change of accessibility profile with instant route recalculation
  const handleSelectProfile = useCallback(
    (newProfile: AccessibilityProfile) => {
      setActiveProfile(newProfile);
      if (route && route.toPoi) {
        const updated = calculateRoute(
          userPosition,
          userFloor,
          route.toPoi.position,
          route.toPoi.floor,
          route.fromPoi,
          route.toPoi,
          newProfile,
          dynamicOverrides
        );
        if (updated) {
          setRoute(updated);
        }
      }
    },
    [route, userPosition, userFloor, dynamicOverrides]
  );

  // Handle POI selection
  const handleSelectPoi = useCallback(
    (poi: POI | null) => {
      setSelectedPoi(poi);
      if (poi) {
        if (poi.floor !== activeFloor) {
          setActiveFloor(poi.floor);
        }
        setCameraTargetPos(poi.position);
        setCameraTargetTrigger((c) => c + 1);
      }
    },
    [activeFloor]
  );

  // Handle Start Navigation to POI
  const handleNavigateToPoi = useCallback(
    (poi: POI) => {
      const computedRoute = calculateRoute(
        userPosition,
        userFloor,
        poi.position,
        poi.floor,
        undefined,
        poi,
        activeProfile,
        dynamicOverrides
      );

      if (computedRoute) {
        setRoute(computedRoute);
        setSimulationProgress(0);
        setIsSimulating(false);
        setSelectedPoi(null);

        if (userFloor !== activeFloor) {
          setActiveFloor(userFloor);
        }
      }
    },
    [userPosition, userFloor, activeFloor, activeProfile, dynamicOverrides]
  );

  // Clear Active Navigation Route
  const handleClearRoute = useCallback(() => {
    setRoute(null);
    setIsSimulating(false);
    setSimulationProgress(0);
  }, []);

  // Quick Action: Go to Sala de Acolhimento (Sensory Relief Room)
  const handleGoToQuietRoom = useCallback(() => {
    const quietPoi = POI_LIST.find((p) => p.id === 'sala-acolhimento');
    if (quietPoi) {
      handleNavigateToPoi(quietPoi);
    }
  }, [handleNavigateToPoi]);

  // Quick Action: Emergency Evacuation
  const handleEmergencyEvacuation = useCallback(() => {
    const evacuationRoute = findClosestEmergencyExit(
      userPosition,
      userFloor,
      activeProfile,
      dynamicOverrides
    );

    if (evacuationRoute) {
      setRoute(evacuationRoute);
      setSimulationProgress(0);
      setIsSimulating(false);
      setSelectedPoi(null);

      if (userFloor !== activeFloor) {
        setActiveFloor(userFloor);
      }
    }
  }, [userPosition, userFloor, activeProfile, activeFloor, dynamicOverrides]);

  // Handle Crowdsourced Report
  const handleSubmitReport = useCallback(
    (type: ReportType, locationId: string) => {
      setDynamicOverrides((prev) => {
        const nextMap = new Map(prev);
        const isBlock = type === 'BLOQUEIO';
        const isCrowd = type === 'CHEIO';
        const isNoise = type === 'BARULHO';
        const isCleared = type === 'LIBERADO';

        const override: Partial<WaypointEdge> = isBlock
          ? { bloqueado: true }
          : isCrowd
          ? { lotacao: 5 }
          : isNoise
          ? { ruido: 5 }
          : isCleared
          ? { bloqueado: false, lotacao: 1, ruido: 1 }
          : {};

        nextMap.set(`${locationId}->wp_concourse_mid`, override);
        nextMap.set(`wp_concourse_mid->${locationId}`, override);
        nextMap.set(`${locationId}->wp_info_desk`, override);
        nextMap.set(`wp_info_desk->${locationId}`, override);

        // Recalculate route if active
        if (route && route.toPoi) {
          const updated = calculateRoute(
            userPosition,
            userFloor,
            route.toPoi.position,
            route.toPoi.floor,
            route.fromPoi,
            route.toPoi,
            activeProfile,
            nextMap
          );
          if (updated) {
            setRoute(updated);
          }
        }

        return nextMap;
      });
    },
    [route, userPosition, userFloor, activeProfile]
  );

  // Calculate comparison across all 4 profiles for the active route
  const profileComparisonResults: ProfileComparisonResult[] = useMemo(() => {
    if (!route || !route.toPoi) return [];
    return calculateMultiProfileComparison(
      userPosition,
      userFloor,
      route.toPoi.position,
      route.toPoi.floor,
      route.fromPoi,
      route.toPoi,
      dynamicOverrides
    );
  }, [route, userPosition, userFloor, dynamicOverrides]);

  // Locate Me: focus camera on current user position
  const handleLocateMe = useCallback(() => {
    if (userFloor !== activeFloor) {
      setActiveFloor(userFloor);
    }
    setSelectedPoi(null);
    setCameraTargetPos(userPosition);
    setCameraTargetTrigger((c) => c + 1);
  }, [userPosition, userFloor, activeFloor]);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    setSelectedPoi(null);
    setCameraTargetPos(null);
    setCameraTargetTrigger((c) => c + 1);
  }, []);

  // Live Walking Simulation Loop
  const routeDistances = useMemo(() => {
    if (!route || route.points.length < 2) return null;
    const distances: number[] = [];
    let total = 0;
    for (let i = 1; i < route.points.length; i++) {
      const p1 = route.points[i - 1];
      const p2 = route.points[i];
      const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
      distances.push(d);
      total += d;
    }
    return { distances, total };
  }, [route]);

  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isSimulating || !route || !routeDistances || routeDistances.total === 0) {
      return;
    }

    let animationFrameId: number;

    const animate = (now: number) => {
      const deltaSec = Math.min(0.1, (now - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = now;

      setSimulationProgress((prev) => {
        const unitsAdvanced = deltaSec * 4.5 * simulationSpeed;
        const progressIncrement = unitsAdvanced / routeDistances.total;
        const nextProgress = Math.min(1, prev + progressIncrement);

        const targetDist = nextProgress * routeDistances.total;
        let accumulated = 0;
        let currentPos: [number, number, number] = route.points[0];
        let currentHeading = userHeading;

        for (let i = 0; i < routeDistances.distances.length; i++) {
          const segDist = routeDistances.distances[i];
          if (accumulated + segDist >= targetDist || i === routeDistances.distances.length - 1) {
            const segFraction = segDist > 0 ? (targetDist - accumulated) / segDist : 0;
            const p1 = route.points[i];
            const p2 = route.points[i + 1];

            const x = p1[0] + (p2[0] - p1[0]) * segFraction;
            const y = p1[1] + (p2[1] - p1[1]) * segFraction;
            const z = p1[2] + (p2[2] - p1[2]) * segFraction;

            currentPos = [x, y, z];

            const dx = p2[0] - p1[0];
            const dz = p2[2] - p1[2];
            if (Math.hypot(dx, dz) > 0.05) {
              currentHeading = Math.atan2(dx, dz);
            }
            break;
          }
          accumulated += segDist;
        }

        setUserPosition(currentPos);
        setUserHeading(currentHeading);

        const detectedFloor: 1 | 2 = currentPos[1] > 3 ? 2 : 1;
        if (detectedFloor !== userFloor) {
          setUserFloor(detectedFloor);
          setActiveFloor(detectedFloor);
        }

        if (nextProgress >= 1) {
          setIsSimulating(false);
        }

        return nextProgress;
      });

      if (isSimulating) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    lastFrameTimeRef.current = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimulating, route, routeDistances, simulationSpeed, userHeading, userFloor]);

  const handleResetSimulation = () => {
    if (!route) return;
    setSimulationProgress(0);
    setIsSimulating(false);
    setUserPosition(route.points[0]);
    setUserFloor(route.points[0][1] > 3 ? 2 : 1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100 font-sans">
      {/* 3D Interactive Map Canvas */}
      <EventMapCanvas
        activeFloor={activeFloor}
        selectedPoi={selectedPoi}
        hoveredPoi={hoveredPoi}
        onSelectPoi={handleSelectPoi}
        onHoverPoi={setHoveredPoi}
        route={route}
        userPosition={userPosition}
        userHeading={userHeading}
        isSimulating={isSimulating}
        is2DView={is2DView}
        cameraTargetTrigger={cameraTargetTrigger}
        cameraTargetPos={cameraTargetPos}
        selectedCategory={selectedCategory}
      />

      {/* Top Header, Search, Profile & Quick Actions */}
      <TopBar
        onSelectPoi={handleSelectPoi}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        liveSessionsCount={liveSessionsCount}
        activeProfile={activeProfile}
        onOpenProfileSelector={() => setIsProfileSelectorOpen(true)}
        onGoToQuietRoom={handleGoToQuietRoom}
        onEmergencyEvacuation={handleEmergencyEvacuation}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenChat={() => setIsChatModalOpen(true)}
        onOpenOrganizer={() => setIsOrganizerModalOpen(true)}
      />

      {/* Floating Map Controls (Floor, 2D/3D, Reset, Locate) */}
      <MapControls
        activeFloor={activeFloor}
        onChangeFloor={setActiveFloor}
        is2DView={is2DView}
        onToggle2DView={() => setIs2DView(!is2DView)}
        onResetView={handleResetView}
        onLocateMe={handleLocateMe}
      />

      {/* POI / Booth Details Drawer */}
      {selectedPoi && !route && (
        <PoiDetailDrawer
          poi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
          onNavigateHere={handleNavigateToPoi}
        />
      )}

      {/* Active Navigation Panel (Turn-by-turn, Voice & Live Walk Simulation) */}
      {route && (
        <NavigationPanel
          route={route}
          onClearRoute={handleClearRoute}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
          onResetSimulation={handleResetSimulation}
          simulationProgress={simulationProgress}
          simulationSpeed={simulationSpeed}
          onChangeSpeed={setSimulationSpeed}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />
      )}

      {/* Live Schedule & Agenda Modal */}
      <LiveScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onLocatePoi={handleSelectPoi}
        onNavigatePoi={handleNavigateToPoi}
      />

      {/* Accessibility Profile Selector Modal */}
      <ProfileSelector
        currentProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
      />

      {/* Profile Comparison Modal */}
      <ProfileComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        results={profileComparisonResults}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
      />

      {/* Crowdsourced Incident Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Conversational Assistant / Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onNavigateToPoi={handleNavigateToPoi}
        onEmergencyExit={handleEmergencyEvacuation}
      />

      {/* Organizer Dashboard & Emergency Panel */}
      <OrganizerModal
        isOpen={isOrganizerModalOpen}
        onClose={() => setIsOrganizerModalOpen(false)}
        onTriggerEvacuation={handleEmergencyEvacuation}
      />
    </div>
  );
}
