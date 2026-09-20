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
        className="absolute right-2 sm:right-4 top-24 sm:top-24 z-10 flex flex-col items-center gap-1 sm:gap-1.5 pointer-events-none"
      >
        {/* 2D / 3D Toggle */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md sm:shadow-xl shadow-slate-900/10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={is2DView ? 'default' : 'ghost'}
                size="icon"
                type="button"
                onClick={onToggle2DView}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 ${
                  is2DView ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm' : 'text-slate-700'
                }`}
              >
                {is2DView ? <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span className="text-[7.5px] sm:text-[8.5px] font-mono leading-none">{is2DView ? '2D' : '3D'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{is2DView ? 'Mudar para Visão 3D Isométrica' : 'Mudar para Visão 2D Superior'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Heatmap & Real-time Sensors Toggle */}
        {onToggleSensors && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md sm:shadow-xl shadow-slate-900/10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showSensors ? 'default' : 'ghost'}
                  size="icon"
                  type="button"
                  onClick={onToggleSensors}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 ${
                    showSensors
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="text-[7px] sm:text-[7.5px] font-mono leading-none">SENSORES</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{showSensors ? 'Ocultar Sensores de Ruído & Lotação' : 'Exibir Sensores de Ruído & Lotação (dB e %)'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* View Actions: Reset & Locate Me (Compact Compass & Cursor Pill) */}
        <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md sm:shadow-xl shadow-slate-900/10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onLocateMe}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <Navigation className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Minha Localização (Você está aqui)</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-[1px] w-4/5 mx-auto bg-slate-200/80 my-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onResetView}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center"
              >
                <Compass className="w-3.5 h-3.5" />
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
