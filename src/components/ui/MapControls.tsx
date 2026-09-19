import { Layers, Box, Square, Compass, Navigation } from 'lucide-react';
import { VENUE_FLOORS } from '../../data/eventData';

interface MapControlsProps {
  activeFloor: 1 | 2;
  onChangeFloor: (floor: 1 | 2) => void;
  is2DView: boolean;
  onToggle2DView: () => void;
  onResetView: () => void;
  onLocateMe: () => void;
}

export function MapControls({
  activeFloor,
  onChangeFloor,
  is2DView,
  onToggle2DView,
  onResetView,
  onLocateMe,
}: MapControlsProps) {
  return (
    <aside
      aria-label="Controles do Mapa"
      className="absolute right-2.5 sm:right-5 top-28 sm:top-24 z-10 flex flex-col items-center gap-2 pointer-events-none"
    >
      {/* Floor Switcher */}
      <div className="pointer-events-auto flex flex-col bg-slate-900/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/80">
        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider flex items-center justify-center gap-1">
          <Layers className="w-3 h-3 text-sky-400" />
          <span>Piso</span>
        </div>
        <div className="flex flex-col gap-1">
          {VENUE_FLOORS.map((f) => {
            const isActive = activeFloor === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeFloor(f.id as 1 | 2)}
                className={`min-w-[44px] min-h-[44px] rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 scale-105 ring-2 ring-sky-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={f.name}
              >
                <span>{f.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2D / 3D Toggle */}
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/80">
        <button
          type="button"
          onClick={onToggle2DView}
          className={`min-w-[44px] min-h-[44px] rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all ${
            is2DView
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={is2DView ? 'Mudar para Visão 3D Isométrica' : 'Mudar para Visão 2D Superior'}
        >
          {is2DView ? <Square className="w-4 h-4" /> : <Box className="w-4 h-4" />}
          <span className="text-[9px] font-mono">{is2DView ? '2D' : '3D'}</span>
        </button>
      </div>

      {/* View Actions: Reset & Locate Me */}
      <div className="pointer-events-auto flex flex-col bg-slate-900/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/80 gap-1">
        <button
          type="button"
          onClick={onLocateMe}
          className="min-w-[44px] min-h-[44px] rounded-xl text-sky-400 hover:text-sky-300 hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95"
          title="Minha Localização (Você está aqui)"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95"
          title="Redefinir Ângulo da Câmera"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
