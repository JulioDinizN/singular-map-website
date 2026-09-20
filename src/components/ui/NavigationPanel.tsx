import { useState, useEffect } from 'react';
import {
  Navigation,
  Footprints,
  Clock,
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
      speakInstruction(route.steps[0].instruction);
    }
  }, [voiceEnabled, route]);

  if (!route) return null;

  return (
    <aside
      aria-label="Navegação Ativa"
      className="hidden sm:block fixed sm:top-24 sm:left-6 sm:w-96 z-30 pointer-events-auto transition-all animate-in fade-in sm:slide-in-from-left duration-300"
    >
      <div className="bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden max-h-[70vh] sm:max-h-[80vh]">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

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
                  <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>Navegando para</span>
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

          {/* Quick Metrics (Google Maps / Apple Maps style) */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <Clock className="w-4 h-4" />
              <span>~{route.estimatedMinutes} min a pé</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Footprints className="w-4 h-4 text-blue-600" />
              <span>{route.totalDistanceMeters} metros</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="h-full bg-blue-600 transition-all duration-150"
                style={{ width: `${Math.round(simulationProgress * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono font-medium">
              <span>{Math.round(simulationProgress * 100)}% concluído</span>
              <span>{Math.round((1 - simulationProgress) * route.totalDistanceMeters)}m restantes</span>
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
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0 fill-white" />}
            <span>
              {isSimulating ? (
                'Pausar'
              ) : (
                <>
                  <span className="sm:hidden">Iniciar</span>
                  <span className="hidden sm:inline">Iniciar Passo a Passo</span>
                </>
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
              if (next && route.steps[0]) {
                speakInstruction(route.steps[0].instruction);
              }
            }}
            className={`rounded-xl min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] shrink-0 ${
              voiceEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title={voiceEnabled ? 'Instruções em voz ativadas' : 'Ativar leitura em voz alta'}
          >
            <Volume2 className="w-4 h-4" />
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
            <FastForward className="w-3.5 h-3.5 text-blue-600" />
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
            <span>Instruções Passo a Passo ({route.steps.length})</span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSteps && (
            <div className="px-4 pb-4 space-y-2.5 divide-y divide-slate-100">
              {route.steps.map((step, idx) => (
                <div key={idx} className="pt-2.5 flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold mt-0.5 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
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
                    className="text-slate-400 hover:text-blue-600 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Ouvir instrução"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
