import { useState, useEffect, useMemo } from 'react';
import {
  Navigation,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
  FastForward,
  ShieldCheck,
  VolumeX,
  Volume2,
  GitCompare,
  AlertTriangle,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  MapPin,
} from 'lucide-react';
import type { NavigationRoute } from '../../utils/pathfinding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavigationPanelProps {
  route: NavigationRoute | null;
  onClearRoute: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  simulationProgress: number; // 0 to 1
  simulationSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onOpenCompare: () => void;
}

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

export function NavigationPanel({
  route,
  onClearRoute,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  simulationProgress,
  simulationSpeed,
  onChangeSpeed,
  onOpenCompare,
}: NavigationPanelProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Active step in route
  const currentStepIdx = useMemo(() => {
    if (!route || route.steps.length === 0) return 0;
    return Math.min(
      route.steps.length - 1,
      Math.floor(simulationProgress * route.steps.length)
    );
  }, [route, simulationProgress]);

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (voiceEnabled && route && route.steps.length > 0) {
      const currentStep = route.steps[currentStepIdx];
      if (currentStep) {
        speakInstruction(currentStep.instruction);
      }
    }
  }, [voiceEnabled, route, currentStepIdx]);

  if (!route) return null;

  const currentStep = route.steps[currentStepIdx];
  const nextStep = route.steps[currentStepIdx + 1];
  const remainingMinutes = Math.max(1, Math.round(route.estimatedMinutes * (1 - simulationProgress)));
  const remainingDistance = Math.round((1 - simulationProgress) * route.totalDistanceMeters);

  return (
    <aside
      aria-label="Navegação Ativa"
      className="hidden sm:block fixed sm:top-24 sm:left-6 sm:w-96 z-30 pointer-events-auto transition-all animate-in fade-in sm:slide-in-from-left duration-300"
    >
      <div className="bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden max-h-[82vh]">
        {/* Waze-style Top Maneuver Banner (Active during simulation or progress) */}
        {(isSimulating || simulationProgress > 0) && currentStep && (
          <div className="bg-slate-900 text-white p-3.5 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              {getManeuverIcon(currentStep.instruction)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                {currentStep.distanceMeters > 0 ? `Em ${Math.round(currentStep.distanceMeters)}m` : 'Agora'}
              </div>
              <div className="text-xs font-bold text-white leading-tight truncate">
                {currentStep.instruction}
              </div>
              {nextStep && (
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Depois: {nextStep.instruction}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header: Destination & Stats */}
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              {route.isEmergencyExitRoute ? (
                <span className="flex items-center gap-1 text-red-600 font-bold animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  ROTA DE EVACUAÇÃO
                </span>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="text-emerald-700">Navegando para</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={onClearRoute}
              className="text-slate-400 hover:text-slate-700 rounded-full"
              title="Encerrar Rota"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {route.toPoi?.name || 'Destino'}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            Origem: {route.fromPoi?.name || 'Sua Localização Atual'}
          </p>

          {/* Active Profile Pill */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                style={{ backgroundColor: route.profile.color }}
              >
                {route.profile.shortName}
              </span>
              {route.avoidedStairs && (
                <Badge variant="success" className="gap-1 text-[10px] py-0.5 px-1.5 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Sem escadas
                </Badge>
              )}
              {route.avoidedNoise && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  <VolumeX className="w-3 h-3" />
                  Calmo
                </span>
              )}
            </div>

            {/* Compare Profiles Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCompare}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto py-1 px-2 rounded-lg"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Comparar</span>
            </Button>
          </div>

          {/* Google Maps Metrics & ETA Card */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-600 font-mono">
                ~{isSimulating || simulationProgress > 0 ? remainingMinutes : route.estimatedMinutes} min
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({isSimulating || simulationProgress > 0 ? remainingDistance : route.totalDistanceMeters}m)
              </span>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Chegada às
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono">
                {getArrivalTime(isSimulating || simulationProgress > 0 ? remainingMinutes : route.estimatedMinutes)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="h-full bg-emerald-600 transition-all duration-150"
                style={{ width: `${Math.round(simulationProgress * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono font-medium">
              <span>{Math.round(simulationProgress * 100)}% concluído</span>
              <span>{remainingDistance}m restantes</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Controls & Voice */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <Button
            onClick={onToggleSimulation}
            className={`flex-1 gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 min-h-[42px] sm:min-h-[44px] rounded-xl px-2 sm:px-4 ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0 fill-white" />}
            <span>
              {isSimulating ? (
                'Pausar'
              ) : simulationProgress > 0 ? (
                'Continuar'
              ) : (
                'Iniciar Navegação'
              )}
            </span>
          </Button>

          {/* Voice Text-to-Speech Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (next && route.steps[currentStepIdx]) {
                speakInstruction(route.steps[currentStepIdx].instruction);
              }
            }}
            className={`rounded-xl min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] shrink-0 ${
              voiceEnabled
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title={voiceEnabled ? 'Instruções em voz ativadas' : 'Ativar leitura em voz alta'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          {/* Speed Toggle */}
          <Button
            variant="outline"
            onClick={() => {
              const speeds = [1, 2, 4];
              const next = speeds[(speeds.indexOf(simulationSpeed) + 1) % speeds.length];
              onChangeSpeed(next);
            }}
            className="gap-1 px-2.5 sm:px-3 bg-white text-slate-700 hover:text-slate-900 rounded-xl text-xs font-mono font-bold border-slate-200 min-h-[40px] sm:min-h-[44px] shrink-0 shadow-sm"
            title="Velocidade de Simulação"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-600" />
            <span>{simulationSpeed}x</span>
          </Button>

          {/* Reset Walk */}
          <Button
            variant="outline"
            size="icon"
            onClick={onResetSimulation}
            className="bg-white text-slate-600 hover:text-slate-900 rounded-xl border-slate-200 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] shrink-0 shadow-sm"
            title="Reiniciar ao Início"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Turn-by-Turn Collapsible Section */}
        <div className="flex-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            <span className="flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instruções Passo a Passo ({route.steps.length})</span>
            </span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSteps && (
            <div className="px-4 pb-4 space-y-2 divide-y divide-slate-100">
              {route.steps.map((step, idx) => {
                const isActive = currentStepIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`pt-2.5 flex items-start gap-2.5 text-xs rounded-xl p-2 transition-colors ${
                      isActive ? 'bg-emerald-50/80 border border-emerald-200' : ''
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-bold mt-0.5 shadow-sm ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {getManeuverIcon(step.instruction)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-semibold leading-snug">{step.instruction}</p>
                      {step.distanceMeters > 0 && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {step.distanceMeters} metros
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => speakInstruction(step.instruction)}
                      className="text-slate-400 hover:text-emerald-600 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Ouvir instrução"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
