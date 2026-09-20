import { Box, Square, Compass, Navigation, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MapControlsProps {
  activeFloor?: 1 | 2;
  onChangeFloor?: (floor: 1 | 2) => void;
  is2DView: boolean;
  onToggle2DView: () => void;
  onResetView: () => void;
  onLocateMe: () => void;
  showSensors?: boolean;
  onToggleSensors?: () => void;
}

export function MapControls({
  is2DView,
  onToggle2DView,
  onResetView,
  onLocateMe,
  showSensors = true,
  onToggleSensors,
}: MapControlsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <aside
        aria-label="Controles do Mapa"
        className="absolute right-2.5 sm:right-5 top-28 sm:top-24 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        {/* 2D / 3D Toggle */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={is2DView ? 'default' : 'ghost'}
                size="icon"
                type="button"
                onClick={onToggle2DView}
                className={`min-w-[44px] min-h-[44px] rounded-xl font-bold text-xs flex flex-col gap-0.5 ${
                  is2DView ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30' : ''
                }`}
              >
                {is2DView ? <Square className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                <span className="text-[9px] font-mono">{is2DView ? '2D' : '3D'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{is2DView ? 'Mudar para Visão 3D Isométrica' : 'Mudar para Visão 2D Superior'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Heatmap & Real-time Sensors Toggle */}
        {onToggleSensors && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showSensors ? 'default' : 'ghost'}
                  size="icon"
                  type="button"
                  onClick={onToggleSensors}
                  className={`min-w-[44px] min-h-[44px] rounded-xl font-bold text-xs flex flex-col gap-0.5 ${
                    showSensors
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span className="text-[8px] font-mono">SENSORES</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{showSensors ? 'Ocultar Sensores de Ruído & Lotação' : 'Exibir Sensores de Ruído & Lotação (dB e %)'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* View Actions: Reset & Locate Me */}
        <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onLocateMe}
                className="min-w-[44px] min-h-[44px] rounded-xl text-blue-600 hover:text-blue-700 hover:bg-slate-100"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Minha Localização (Você está aqui)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onResetView}
                className="min-w-[44px] min-h-[44px] rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <Compass className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Redefinir Ângulo da Câmera</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
