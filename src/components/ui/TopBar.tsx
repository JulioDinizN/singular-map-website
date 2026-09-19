import { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Radio,
  MapPin,
  Compass,
  Accessibility,
  HeartHandshake,
  AlertTriangle,
  Flag,
} from 'lucide-react';
import { POI_LIST } from '../../data/eventData';
import type { POI, PoiCategory, AccessibilityProfile } from '../../data/eventData';

interface TopBarProps {
  onSelectPoi: (poi: POI) => void;
  selectedCategory: PoiCategory | 'all';
  onSelectCategory: (category: PoiCategory | 'all') => void;
  onOpenSchedule: () => void;
  liveSessionsCount: number;
  activeProfile: AccessibilityProfile;
  onOpenProfileSelector: () => void;
  onGoToQuietRoom: () => void;
  onEmergencyEvacuation: () => void;
  onOpenReportModal: () => void;
}

const CATEGORIES: { id: PoiCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'stage', label: 'Palcos' },
  { id: 'booth', label: 'Stands' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'quiet_room', label: 'Descompressão' },
  { id: 'exit', label: 'Saídas' },
  { id: 'food', label: 'Alimentação' },
  { id: 'restroom', label: 'Sanitários' },
];

export function TopBar({
  onSelectPoi,
  selectedCategory,
  onSelectCategory,
  onOpenSchedule,
  liveSessionsCount,
  activeProfile,
  onOpenProfileSelector,
  onGoToQuietRoom,
  onEmergencyEvacuation,
  onOpenReportModal,
}: TopBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter POIs based on search query
  const searchResults =
    query.trim() === ''
      ? []
      : POI_LIST.filter((poi) => {
          const q = query.toLowerCase();
          const matchesName =
            poi.name.toLowerCase().includes(q) ||
            (poi.shortName && poi.shortName.toLowerCase().includes(q));
          const matchesBooth = poi.boothNumber?.toLowerCase().includes(q);
          const matchesZone = poi.zone.toLowerCase().includes(q);
          const matchesSession = poi.sessions?.some(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.speaker.toLowerCase().includes(q)
          );
          return matchesName || matchesBooth || matchesZone || matchesSession;
        }).slice(0, 6);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-2.5 sm:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        {/* Brand / Title & Profile Pill */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/70 shadow-lg shadow-black/40">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>ROTAS ACESSÍVEIS</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">
                3D LIVE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Tech4Change 2026 • Navegação Inclusiva
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div
          ref={searchContainerRef}
          className="pointer-events-auto relative flex-1 max-w-md mx-auto"
        >
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/30 transition-all">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Buscar stands, salas, palestrantes..."
              className="w-full bg-transparent px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-1 mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80">
              {searchResults.map((poi) => (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => {
                    onSelectPoi(poi);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/70 flex items-center justify-between gap-2 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: poi.accentColor || poi.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-sky-400 truncate flex items-center gap-1.5">
                        <span>{poi.name}</span>
                        {poi.boothNumber && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({poi.boothNumber})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Piso {poi.floor} • {poi.zone}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-[11px] text-slate-400 group-hover:text-sky-300">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span>Ver</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accessibility Profile Selector Button */}
        <button
          type="button"
          onClick={onOpenProfileSelector}
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg border border-slate-700/80 transition-all active:scale-95"
          title="Trocar Perfil de Acessibilidade"
        >
          <Accessibility className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline text-slate-200">Perfil:</span>
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm"
            style={{ backgroundColor: activeProfile.color }}
          >
            {activeProfile.shortName}
          </span>
        </button>

        {/* Live Agenda Button */}
        <button
          type="button"
          onClick={onOpenSchedule}
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-95"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Ao Vivo</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-[10px] font-bold text-emerald-300">
            {liveSessionsCount}
          </span>
        </button>
      </div>

      {/* Quick Action Pills: Sala de Acolhimento, Rota de Saída, Reportar & Categories */}
      <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-7xl mx-auto w-full py-0.5">
        {/* Quick Sala de Acolhimento */}
        <button
          type="button"
          onClick={onGoToQuietRoom}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-500/40 backdrop-blur-md shadow-md shadow-teal-950/40 transition-all active:scale-95"
          title="Espaço calmo para descompressão sensorial"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
          <span>Acolhimento</span>
        </button>

        {/* Quick Emergency Evacuation */}
        <button
          type="button"
          onClick={onEmergencyEvacuation}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 backdrop-blur-md shadow-md shadow-red-950/40 transition-all active:scale-95"
          title="Calcular rota para a saída viável mais próxima"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Rota de Saída</span>
        </button>

        {/* Quick Report */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 backdrop-blur-md transition-all active:scale-95"
          title="Reportar bloqueio, lotação ou barulho"
        >
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <span>Reportar</span>
        </button>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-1" />

        {/* Category Filter Chips */}
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border transition-all ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
