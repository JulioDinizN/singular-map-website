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
      aria-label="Map Controls"
      className="absolute right-3 sm:right-5 top-28 sm:top-24 z-20 flex flex-col items-center gap-2.5 pointer-events-none"
    >
      {/* Floor Switcher */}
      <div className="pointer-events-auto flex flex-col bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl shadow-black/40">
        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider flex items-center justify-center gap-1">
          <Layers className="w-3 h-3 text-sky-400" />
          <span>Floor</span>
        </div>
        <div className="flex flex-col gap-1">
          {VENUE_FLOORS.map((f) => {
            const isActive = activeFloor === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeFloor(f.id as 1 | 2)}
                className={`w-10 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
      <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl shadow-black/40">
        <button
          type="button"
          onClick={onToggle2DView}
          className={`w-10 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all ${
            is2DView
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={is2DView ? 'Switch to 3D Isometric View' : 'Switch to 2D Top-Down View'}
        >
          {is2DView ? <Square className="w-4 h-4" /> : <Box className="w-4 h-4" />}
          <span className="text-[9px] font-mono">{is2DView ? '2D' : '3D'}</span>
        </button>
      </div>

      {/* View Actions: Reset & Locate Me */}
      <div className="pointer-events-auto flex flex-col bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl shadow-black/40 gap-1">
        <button
          type="button"
          onClick={onLocateMe}
          className="w-10 h-10 rounded-xl text-sky-400 hover:text-sky-300 hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95"
          title="Locate Me (You are here)"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95"
          title="Reset Camera Angle"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
