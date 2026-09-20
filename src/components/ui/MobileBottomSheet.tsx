import { useState, useMemo, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  HeartHandshake,
  ShieldAlert,
  Bot,
  Flag,
  LayoutDashboard,
  Radio,
  MapPin,
  Navigation,
  Sparkles,
  Search,
  Layers,
  X,
  Bookmark,
  Share2,
  Check,
  Clock,
  User,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  GitCompare,
  Footprints,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
} from 'lucide-react';
import { POI_LIST } from '@/data/eventData';
import type { POI, PoiCategory } from '@/data/eventData';
import type { NavigationRoute } from '@/utils/pathfinding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ChatContent } from './ChatContent';

interface MobileBottomSheetProps {
  // Active POI
  selectedPoi: POI | null;
  onClosePoi: () => void;
  onNavigateHere: (poi: POI) => void;

  // Active Route
  route: NavigationRoute | null;
  onClearRoute: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  simulationProgress: number;
  simulationSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onOpenCompare: () => void;

  // Chat
  isChatOpen: boolean;
  onOpenChat: () => void;
  onCloseChat: () => void;

  // Explore
  selectedCategory: PoiCategory | 'all';
  onSelectCategory: (category: PoiCategory | 'all') => void;
  onSelectPoi: (poi: POI) => void;
  onGoToQuietRoom: () => void;
  onEmergencyEvacuation: () => void;
  onOpenReportModal: () => void;
  onOpenOrganizer: () => void;
  onOpenSchedule: () => void;
  liveSessionsCount: number;
}

const CATEGORIES: { id: PoiCategory | 'all'; label: string; iconEmoji: string }[] = [
  { id: 'all', label: 'Todos', iconEmoji: '✨' },
  { id: 'stage', label: 'Palcos', iconEmoji: '🎤' },
  { id: 'booth', label: 'Estandes', iconEmoji: '🏢' },
  { id: 'workshop', label: 'Workshops', iconEmoji: '💻' },
  { id: 'quiet_room', label: 'Acolhimento', iconEmoji: '💙' },
  { id: 'exit', label: 'Saídas', iconEmoji: '🚪' },
  { id: 'food', label: 'Alimentação', iconEmoji: '☕' },
  { id: 'restroom', label: 'Sanitários', iconEmoji: '🚻' },
];

const CATEGORY_LABELS: Record<string, string> = {
  stage: 'Palco',
  booth: 'Estande',
  workshop: 'Workshop',
  food: 'Alimentação',
  restroom: 'Sanitário',
  info: 'Informações',
  entrance: 'Entrada',
  quiet_room: 'Sala de Acolhimento',
  exit: 'Saída de Emergência',
};

function getManeuverIcon(instruction: string) {
  const lower = instruction.toLowerCase();
  if (lower.includes('direita')) {
    return <CornerUpRight className="w-5 h-5 stroke-[2.5]" />;
  }
  if (lower.includes('esquerda')) {
    return <CornerUpLeft className="w-5 h-5 stroke-[2.5]" />;
  }
  if (lower.includes('cheg') || lower.includes('destino') || lower.includes('estande')) {
    return <MapPin className="w-5 h-5 stroke-[2.5]" />;
  }
  return <ArrowUp className="w-5 h-5 stroke-[2.5]" />;
}

function getArrivalTime(minutes: number) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.max(1, Math.round(minutes)));
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MobileBottomSheet({
  selectedPoi,
  onClosePoi,
  onNavigateHere,
  route,
  onClearRoute,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  simulationProgress,
  simulationSpeed,
  onChangeSpeed,
  onOpenCompare,
  isChatOpen,
  onOpenChat,
  onCloseChat,
  selectedCategory,
  onSelectCategory,
  onSelectPoi,
  onGoToQuietRoom,
  onEmergencyEvacuation,
  onOpenReportModal,
  onOpenOrganizer,
  onOpenSchedule,
  liveSessionsCount,
}: MobileBottomSheetProps) {
  // Determine active mode
  const mode: 'navigation' | 'poi' | 'chat' | 'explore' = route
    ? 'navigation'
    : selectedPoi
    ? 'poi'
    : isChatOpen
    ? 'chat'
    : 'explore';

  // Unified snap points across all modes so the sheet itself never shifts size unexpectedly
  const snapPeek = '180px';
  const snapExpanded = 0.85;

  const [snapPoint, setSnapPoint] = useState<number | string | null>(
    mode === 'chat' ? snapExpanded : snapPeek
  );
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Current navigation active step
  const currentStepIdx = useMemo(() => {
    if (!route || route.steps.length === 0) return 0;
    return Math.min(
      route.steps.length - 1,
      Math.floor(simulationProgress * route.steps.length)
    );
  }, [route, simulationProgress]);

  // Height is strictly user-controlled via drag or the Ver Mais / Recolher button.
  // Neither mode changes nor modal triggers will programmatically alter the sheet height.

  const isExpanded =
    snapPoint === snapExpanded ||
    snapPoint === 0.85 ||
    snapPoint === '85%' ||
    snapPoint === 1;

  const toggleSnap = () => {
    setSnapPoint(isExpanded ? snapPeek : snapExpanded);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Voice TTS for navigation
  useEffect(() => {
    if (voiceEnabled && route && route.steps.length > 0 && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentStep = route.steps[currentStepIdx];
      if (currentStep) {
        const utterance = new SpeechSynthesisUtterance(currentStep.instruction);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [voiceEnabled, route, currentStepIdx]);

  // Search results for explore mode
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return POI_LIST.filter((poi) => {
      const matchesName =
        poi.name.toLowerCase().includes(q) ||
        (poi.shortName && poi.shortName.toLowerCase().includes(q));
      const matchesBooth = poi.boothNumber?.toLowerCase().includes(q);
      const matchesZone = poi.zone.toLowerCase().includes(q);
      const matchesCategory =
        poi.category.toLowerCase().includes(q) ||
        (CATEGORY_LABELS[poi.category] &&
          CATEGORY_LABELS[poi.category].toLowerCase().includes(q));
      const matchesDescription = poi.description?.toLowerCase().includes(q);
      const matchesSession = poi.sessions?.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.speaker?.toLowerCase().includes(q)
      );
      return (
        matchesName ||
        matchesBooth ||
        matchesZone ||
        matchesCategory ||
        matchesDescription ||
        matchesSession
      );
    });
  }, [searchQuery]);

  // Filter POIs by category for explore mode
  const filteredPois = useMemo(() => {
    if (selectedCategory === 'all') return POI_LIST;
    return POI_LIST.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Live sessions
  const liveSessions = useMemo(() => {
    const list: { poi: POI; title: string; speaker?: string; time: string }[] = [];
    for (const poi of POI_LIST) {
      if (poi.sessions) {
        for (const s of poi.sessions) {
          if (s.isLiveNow) {
            list.push({
              poi,
              title: s.title,
              speaker: s.speaker,
              time: s.time,
            });
          }
        }
      }
    }
    return list;
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: POI_LIST.length };
    for (const p of POI_LIST) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      {/* Waze Floating Top Maneuver Card on Mobile */}
      {route && (
        <div className="fixed top-3 inset-x-3 z-40 sm:hidden pointer-events-auto animate-in fade-in slide-in-from-top duration-300">
          <div className="bg-slate-900/96 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl shadow-black/50 flex items-center gap-3">
            {/* Big Maneuver Icon */}
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              {getManeuverIcon(route.steps[currentStepIdx]?.instruction || '')}
              <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">
                {route.steps[currentStepIdx]?.distanceMeters > 0
                  ? `${Math.round(route.steps[currentStepIdx].distanceMeters)}m`
                  : 'Agora'}
              </span>
            </div>

            {/* Maneuver Instruction */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span>{route.steps[currentStepIdx]?.distanceMeters > 0 ? `Em ${Math.round(route.steps[currentStepIdx].distanceMeters)}m` : 'Em frente'}</span>
                <span>•</span>
                <span className="text-slate-300 truncate">{route.toPoi?.name || 'Destino'}</span>
              </div>
              <div className="text-xs font-bold text-white leading-tight truncate">
                {route.steps[currentStepIdx]?.instruction || 'Siga a rota indicada'}
              </div>
              {route.steps[currentStepIdx + 1] && (
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Depois: {route.steps[currentStepIdx + 1].instruction}
                </div>
              )}
            </div>

            {/* Voice Toggle & Quick End */}
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`rounded-xl text-white hover:bg-white/10 ${voiceEnabled ? 'text-emerald-400' : 'text-slate-400'}`}
                title={voiceEnabled ? 'Desativar voz' : 'Ativar voz'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onClearRoute}
                className="rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/10"
                title="Encerrar rota"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Drawer
        open={true}
        dismissible={false}
        modal={false}
        shouldScaleBackground={false}
        snapPoints={[snapPeek, snapExpanded]}
        activeSnapPoint={snapPoint}
        setActiveSnapPoint={setSnapPoint}
      >
        <DrawerContent
          hideOverlay
          className="fixed inset-x-0 top-0 bottom-0 z-30 flex flex-col rounded-t-[28px] border-t border-slate-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl shadow-slate-900/25 focus:outline-none sm:hidden overflow-hidden"
        >
          {/* Animated Container: Keyed by mode/POI to trigger left-to-right transition on change */}
          <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
            <div
              key={mode === 'poi' ? `poi-${selectedPoi?.id}` : mode}
              className="flex flex-col h-[85dvh] max-h-[85dvh] animate-slide-left-to-right"
            >
              {/* ========================================================= */}
              {/* MODE 1: NAVIGATION (Turn-by-turn guidance) */}
              {/* ========================================================= */}
              {mode === 'navigation' && route && (
                <div className="flex flex-col h-full">
                  {/* Peek Section */}
                  <div className="shrink-0 px-3.5 pt-1.5 pb-2.5 select-none border-b border-slate-100">
                    {/* Google Maps / Waze: Route Preview State vs Active Guidance State */}
                    {!isSimulating && simulationProgress === 0 ? (
                      /* STATE A: ROUTE PREVIEW (Google Maps Style) */
                      <div>
                        {/* Destination Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Navigation className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                {route.isEmergencyExitRoute ? 'Rota de Emergência' : 'Destino Selecionado'}
                              </div>
                              <DrawerTitle className="text-sm font-bold text-slate-900 truncate">
                                {route.toPoi?.name || 'Destino'}
                              </DrawerTitle>
                              <DrawerDescription className="sr-only">
                                Visão geral da rota e navegação
                              </DrawerDescription>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="iconSm"
                            onClick={onClearRoute}
                            className="text-slate-400 hover:text-slate-700 rounded-full w-7 h-7"
                            title="Cancelar Rota"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Google Maps Metrics & ETA Card */}
                        <div className="mt-2.5 flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-3 py-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-emerald-700 font-mono tracking-tight">
                              ~{route.estimatedMinutes} min
                            </span>
                            <span className="text-xs text-slate-600 font-medium">
                              ({route.totalDistanceMeters.toFixed(0)} m)
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                              Chegada às
                            </div>
                            <div className="text-xs font-bold text-slate-900 font-mono">
                              {getArrivalTime(route.estimatedMinutes)}
                            </div>
                          </div>
                        </div>

                        {/* Prominent Google Maps "Iniciar Navegação" Button */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <Button
                            onClick={onToggleSimulation}
                            className="flex-1 gap-2 font-bold text-xs min-h-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 active:scale-98 transition-transform"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>Iniciar Navegação</span>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={toggleSnap}
                            className="px-3 min-h-[44px] rounded-2xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <span>{isExpanded ? 'Recolher' : 'Passos'}</span>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
                          </Button>

                          <Button
                            variant="outline"
                            size="iconSm"
                            onClick={onOpenCompare}
                            className="rounded-2xl min-w-[44px] min-h-[44px] border-slate-200 text-blue-600 hover:bg-blue-50"
                            title="Comparar Perfis de Rota"
                          >
                            <GitCompare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* STATE B: ACTIVE GUIDANCE (Waze / Google Maps Style) */
                      <div>
                        {/* Active Metrics Bar: ETA, Arrival Time, Distance Remaining */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-sm font-mono shadow-xs">
                              ~{Math.max(1, Math.round(route.estimatedMinutes * (1 - simulationProgress)))} min
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {Math.round((1 - simulationProgress) * route.totalDistanceMeters)}m restantes
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Chegada às {getArrivalTime(Math.max(1, Math.round(route.estimatedMinutes * (1 - simulationProgress))))}
                              </div>
                            </div>
                          </div>

                          {/* End Navigation (Red Button) */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearRoute}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-2.5 py-1 rounded-xl gap-1 h-auto"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Encerrar</span>
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5">
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className="h-full bg-emerald-600 transition-all duration-200"
                              style={{ width: `${Math.round(simulationProgress * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Navigation Controls: Play/Pause, Speed, Reset, Voice */}
                        <div className="mt-2.5 flex items-center justify-between gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={onToggleSimulation}
                            className={`flex-1 rounded-xl text-xs font-bold min-h-[40px] gap-1.5 ${
                              isSimulating
                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                            }`}
                          >
                            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            <span>{isSimulating ? 'Pausar' : 'Continuar'}</span>
                          </Button>

                          {/* Speed Toggle */}
                          <Button
                            variant="outline"
                            onClick={() => {
                              const speeds = [1, 2, 4];
                              const next = speeds[(speeds.indexOf(simulationSpeed) + 1) % speeds.length];
                              onChangeSpeed(next);
                            }}
                            className="gap-0.5 px-2 bg-white text-slate-700 hover:text-slate-900 rounded-xl text-xs font-mono font-bold border-slate-200 min-h-[40px] shrink-0"
                            title="Velocidade de Simulação"
                          >
                            <span>{simulationSpeed}x</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="iconSm"
                            onClick={onResetSimulation}
                            className="rounded-xl min-w-[40px] min-h-[40px] border-slate-200"
                            title="Reiniciar ao Início"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                          </Button>

                          <Button
                            variant="outline"
                            size="iconSm"
                            onClick={() => setVoiceEnabled(!voiceEnabled)}
                            className={`rounded-xl min-w-[40px] min-h-[40px] border-slate-200 ${
                              voiceEnabled ? 'bg-blue-50 text-blue-600 border-blue-300' : 'text-slate-600'
                            }`}
                            title="Instruções de Voz"
                          >
                            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          </Button>

                          <button
                            type="button"
                            onClick={toggleSnap}
                            className="flex items-center gap-0.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 min-h-[40px]"
                          >
                            <span>{isExpanded ? 'Recolher' : 'Passos'}</span>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content: Turn-by-turn steps */}
                  <div className="flex-1 overflow-y-auto px-4 pt-3 pb-12 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instruções Passo a Passo</span>
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500">Velocidade:</span>
                        {[1, 2, 4].map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => onChangeSpeed(speed)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              simulationSpeed === speed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {route.steps.map((step, idx) => {
                        const isActive = currentStepIdx === idx;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl border transition-all text-left flex items-start gap-2.5 ${
                              isActive
                                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                                : 'bg-white border-slate-200/80'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                isActive ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {getManeuverIcon(step.instruction)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-900 leading-snug">
                                {step.instruction}
                              </div>
                              {step.distanceMeters > 0 && (
                                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                  {step.distanceMeters.toFixed(0)}m
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            {/* ========================================================= */}
            {/* MODE 2: POI DETAIL (Selected Location) */}
            {/* ========================================================= */}
            {mode === 'poi' && selectedPoi && (
              <div className="flex flex-col h-full">
                {/* Peek Section (~210px) */}
                <div className="shrink-0 px-3.5 pt-1 pb-2.5 select-none border-b border-slate-100">
                  {/* Header with badges and close */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
                          style={{ backgroundColor: selectedPoi.accentColor || selectedPoi.color }}
                        >
                          {CATEGORY_LABELS[selectedPoi.category] || selectedPoi.category}
                        </span>
                        <span className="text-[11px] text-slate-600 font-semibold">
                          Piso {selectedPoi.floor}
                        </span>
                        {selectedPoi.boothNumber && (
                          <Badge variant="secondary" className="text-[10px] text-blue-700 font-mono font-semibold bg-blue-50 border border-blue-200">
                            Estande {selectedPoi.boothNumber}
                          </Badge>
                        )}
                      </div>
                      <DrawerTitle className="text-base font-bold text-slate-900 tracking-tight truncate">
                        {selectedPoi.name}
                      </DrawerTitle>
                      <DrawerDescription className="sr-only">
                        {selectedPoi.description}
                      </DrawerDescription>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5 gap-1">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{selectedPoi.zone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={toggleSnap}
                        className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"
                      >
                        <span>{isExpanded ? 'Recolher' : 'Detalhes'}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      </button>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={onClosePoi}
                        className="text-slate-400 hover:text-slate-700 rounded-full w-7 h-7"
                        title="Fechar detalhes"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons: Como Chegar, Bookmark, Share */}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      onClick={() => onNavigateHere(selectedPoi)}
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/25 text-xs min-h-[44px]"
                    >
                      <Navigation className="w-4 h-4 shrink-0" />
                      <span>Como Chegar</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`rounded-2xl min-w-[44px] min-h-[44px] shrink-0 ${
                        bookmarked
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                      title="Salvar nos Favoritos"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="rounded-2xl bg-white text-slate-600 hover:text-slate-900 border-slate-200 min-w-[44px] min-h-[44px] shrink-0 shadow-xs"
                      title="Compartilhar Localização"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content: Description & Sessions */}
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-12 space-y-4">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedPoi.description}
                  </p>

                  {/* Agenda / Live Sessions */}
                  {selectedPoi.sessions && selectedPoi.sessions.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Programação Oficial</span>
                      </h4>
                      <div className="space-y-2">
                        {selectedPoi.sessions.map((session) => (
                          <Card
                            key={session.id}
                            className={`p-3 rounded-2xl border transition-all ${
                              session.isLiveNow
                                ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/30'
                                : 'bg-slate-50 border-slate-200/80'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {session.time}
                              </span>
                              {session.isLiveNow && (
                                <Badge variant="live" className="gap-1 text-[9px] py-0 px-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                                  AO VIVO
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-900">
                              {session.title}
                            </div>
                            <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-1">
                              <User className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>{session.speaker}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 3: CHATBOT UI (Integrated inside BottomSheet) */}
            {/* ========================================================= */}
            {mode === 'chat' && (
              <div className="flex flex-col h-full">
                <DrawerTitle className="sr-only">Assistente Rotas Acessíveis</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Chatbot com orientações de acessibilidade e navegação pelo pavilhão
                </DrawerDescription>
                <ChatContent
                  onNavigateToPoi={(poi) => {
                    onCloseChat();
                    onNavigateHere(poi);
                  }}
                  onEmergencyExit={() => {
                    onCloseChat();
                    onEmergencyEvacuation();
                  }}
                  onClose={onCloseChat}
                  isMobile={true}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 4: EXPLORE (Default Map Menu) */}
            {/* ========================================================= */}
            {mode === 'explore' && (
              <div className="flex flex-col h-full">
                {/* Peek Section (~148px) */}
                <div className="shrink-0 px-3 pt-1 pb-2 select-none border-b border-slate-100">
                  {/* Header Bar */}
                  <div
                    onClick={toggleSnap}
                    className="w-full flex items-center justify-between py-1 px-1 cursor-pointer active:opacity-75 transition-opacity"
                  >
                    <div className="flex items-center gap-1.5">
                      <DrawerTitle className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span>Explorar Pavilhão</span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 text-teal-700 bg-teal-50 border-teal-200 font-bold"
                        >
                          FIAP NEXT
                        </Badge>
                      </DrawerTitle>
                      <DrawerDescription className="sr-only">
                        Menu de navegação e exploração de estandes, palcos e serviços
                      </DrawerDescription>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSnap();
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 active:text-blue-800"
                    >
                      <span>{isExpanded ? 'Recolher' : 'Ver Mais'}</span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Integrated Search Bar */}
                  <div className="mt-1.5 relative flex items-center bg-slate-100/90 focus-within:bg-white rounded-2xl border border-slate-200/90 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all min-h-[38px] px-3">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                    <input
                      id="mobile-bottomsheet-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim() && !isExpanded) {
                          setSnapPoint(snapExpanded);
                        }
                      }}
                      onFocus={() => {
                        if (!isExpanded) {
                          setSnapPoint(snapExpanded);
                        }
                      }}
                      placeholder="Buscar estande, palco, café, palestra..."
                      className="border-0 bg-transparent focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 w-full h-8"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center shrink-0 ml-1 transition-colors"
                        title="Limpar busca"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* 4 Quick Action Buttons */}
                  <div className="flex items-center justify-between gap-1.5 mt-1.5">
                    {/* Acolhimento */}
                    <button
                      type="button"
                      onClick={onGoToQuietRoom}
                      className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 text-teal-900 transition-all active:scale-95 min-h-[58px]"
                    >
                      <HeartHandshake className="w-4 h-4 text-teal-600 mb-1" />
                      <span className="text-[10px] font-bold leading-tight">Acolhimento</span>
                    </button>

                    {/* Evacuação */}
                    <button
                      type="button"
                      onClick={onEmergencyEvacuation}
                      className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-rose-50/90 hover:bg-rose-100 border border-rose-200/80 text-rose-900 transition-all active:scale-95 min-h-[58px]"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-600 mb-1" />
                      <span className="text-[10px] font-bold leading-tight">Evacuação</span>
                    </button>

                    {/* Assistente IA */}
                    <button
                      type="button"
                      onClick={onOpenChat}
                      className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-900 transition-all active:scale-95 min-h-[58px]"
                    >
                      <Bot className="w-4 h-4 text-indigo-600 mb-1" />
                      <span className="text-[10px] font-bold leading-tight">Assistente</span>
                    </button>

                    {/* Reportar */}
                    <button
                      type="button"
                      onClick={onOpenReportModal}
                      className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 text-amber-900 transition-all active:scale-95 min-h-[58px]"
                    >
                      <Flag className="w-4 h-4 text-amber-600 mb-1" />
                      <span className="text-[10px] font-bold leading-tight">Reportar</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-14 space-y-5">
                  {searchQuery.trim() !== '' ? (
                    <div className="space-y-3 pb-8">
                      {/* Search Results Header */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-blue-600" />
                          <span>Resultados ({searchResults.length})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Limpar busca
                        </button>
                      </div>

                      {/* Search Results Cards */}
                      {searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((poi) => (
                            <Card
                              key={poi.id}
                              className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-blue-300 transition-all space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div
                                    className="w-3 h-3 rounded-full shrink-0 mt-0.5 shadow-xs"
                                    style={{ backgroundColor: poi.accentColor || poi.color }}
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-bold text-slate-900 leading-tight">
                                        {poi.name}
                                      </span>
                                      {poi.boothNumber && (
                                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                          {poi.boothNumber}
                                        </span>
                                      )}
                                      {poi.isAccessible && (
                                        <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                          Acessível
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      {CATEGORY_LABELS[poi.category] || poi.category} • Piso {poi.floor} • {poi.zone}
                                    </div>
                                    {poi.description && (
                                      <p className="text-[10px] text-slate-600 line-clamp-2 mt-1">
                                        {poi.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Live session tag if any */}
                              {poi.sessions?.some((s) => s.isLiveNow) && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                                  <span>Sessão ao vivo acontecendo agora!</span>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    onSelectPoi(poi);
                                  }}
                                  className="h-8 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-3 rounded-xl gap-1"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Ver no Mapa</span>
                                </Button>

                                <Button
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    onNavigateHere(poi);
                                  }}
                                  className="h-8 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 rounded-xl gap-1 shadow-sm"
                                >
                                  <Navigation className="w-3.5 h-3.5" />
                                  <span>Como Chegar</span>
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                            <Search className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              Nenhum local encontrado
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Tente buscar por outro termo ou selecione uma sugestão:
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                            {['Oracle', 'Palco Principal', 'Nubank', 'Acolhimento', 'iFood', 'Sanitários'].map(
                              (sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onClick={() => setSearchQuery(sug)}
                                  className="text-[10px] font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                >
                                  {sug}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Seção 1: Recursos & Operação */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ações Rápidas & Segurança</span>
                        </h4>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenOrganizer();
                            }}
                            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all active:scale-98"
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <LayoutDashboard className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">Painel Ops</div>
                              <div className="text-[10px] text-slate-500 truncate">Métricas e fluxo</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onOpenSchedule();
                            }}
                            className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left transition-all active:scale-98"
                          >
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">Agenda Ao Vivo</div>
                              <div className="text-[10px] text-blue-600 font-semibold truncate">
                                {liveSessionsCount} sessões agora
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Seção 2: Categorias */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            <span>Filtrar por Categoria</span>
                          </h4>
                          {selectedCategory !== 'all' && (
                            <button
                              type="button"
                              onClick={() => onSelectCategory('all')}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              Limpar filtro
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            const count = categoryCounts[cat.id] || 0;
                            return (
                              <Button
                                key={cat.id}
                                variant={isSelected ? 'primary' : 'outline'}
                                size="sm"
                                type="button"
                                onClick={() => onSelectCategory(cat.id)}
                                className={`rounded-xl text-xs font-semibold px-2.5 py-1 min-h-[36px] gap-1.5 transition-all ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                <span>{cat.iconEmoji}</span>
                                <span>{cat.label}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                    isSelected
                                      ? 'bg-blue-800 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {count}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Seção 3: Locais Correspondentes */}
                      {selectedCategory !== 'all' && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Locais Encontrados ({filteredPois.length})
                          </h4>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {filteredPois.map((poi) => (
                              <button
                                key={poi.id}
                                type="button"
                                onClick={() => {
                                  onSelectPoi(poi);
                                }}
                                className="w-full p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 flex items-center justify-between text-left transition-all active:bg-slate-50 shadow-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: poi.accentColor || poi.color }}
                                  />
                                  <div className="truncate">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {poi.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      Piso {poi.floor} • {poi.zone}
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                  <MapPin className="w-3 h-3" />
                                  <span>Ver</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Seção 4: Acontecendo Agora */}
                      {liveSessions.length > 0 && selectedCategory === 'all' && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                            <span>Acontecendo Agora</span>
                          </h4>

                          <div className="space-y-2">
                            {liveSessions.slice(0, 3).map((session, idx) => (
                              <Card
                                key={idx}
                                className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <Badge
                                    variant="success"
                                    className="text-[9px] uppercase px-1.5 py-0 font-bold bg-emerald-100 text-emerald-800 border-0"
                                  >
                                    Ao Vivo
                                  </Badge>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {session.time}
                                  </span>
                                </div>
                                <div className="text-xs font-bold text-slate-900 leading-snug">
                                  {session.title}
                                </div>
                                {session.speaker && (
                                  <div className="text-[10px] text-slate-500">
                                    Com {session.speaker}
                                  </div>
                                )}
                                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                                  <span className="text-[10px] text-slate-600 font-semibold truncate">
                                    {session.poi.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      onSelectPoi(session.poi);
                                    }}
                                    className="h-7 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 rounded-lg gap-1"
                                  >
                                    <Navigation className="w-3 h-3" />
                                    <span>Ver</span>
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    </>
  );
}
