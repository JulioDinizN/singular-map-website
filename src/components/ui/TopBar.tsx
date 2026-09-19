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
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2.5 sm:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        {/* Brand & App Title (Apple Maps style card) */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 min-h-[44px]">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>ROTAS ACESSÍVEIS</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-bold border border-blue-200">
                3D MAP
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              Tech4Change 2026 • Navegação Inclusiva
            </p>
          </div>
        </div>

        {/* Search Bar (Clean Apple Maps style search pill) */}
        <div
          ref={searchContainerRef}
          className="pointer-events-auto relative flex-1 max-w-md mx-auto"
        >
          <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all min-h-[44px]">
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Buscar stands, palcos, facilidades..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
              {searchResults.map((poi) => (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => {
                    onSelectPoi(poi);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-2 transition-colors group min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: poi.accentColor || poi.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate flex items-center gap-1.5">
                        <span>{poi.name}</span>
                        {poi.boothNumber && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({poi.boothNumber})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Piso {poi.floor} • {poi.zone}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-[11px] text-slate-500 group-hover:text-blue-600">
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
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 bg-white/95 hover:bg-slate-50 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold backdrop-blur-xl shadow-lg shadow-slate-900/5 border border-slate-200/90 transition-all active:scale-95 min-h-[44px]"
          title="Trocar Perfil de Acessibilidade"
        >
          <Accessibility className="w-4 h-4 text-blue-600" />
          <span className="hidden md:inline text-slate-700">Perfil:</span>
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
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium backdrop-blur-xl shadow-lg shadow-blue-600/20 border border-blue-500/30 transition-all active:scale-95 min-h-[44px]"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span className="hidden sm:inline">Ao Vivo</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-800 text-[10px] font-bold text-emerald-300">
            {liveSessionsCount}
          </span>
        </button>
      </div>

      {/* Action Pills & Categories (Clean Apple Maps style pills) */}
      <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-7xl mx-auto w-full py-0.5">
        {/* Quick Sala de Acolhimento */}
        <button
          type="button"
          onClick={onGoToQuietRoom}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-sm min-h-[40px] transition-all active:scale-95"
          title="Espaço calmo para descompressão sensorial"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
          <span>Acolhimento</span>
        </button>

        {/* Quick Emergency Evacuation */}
        <button
          type="button"
          onClick={onEmergencyEvacuation}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 shadow-sm min-h-[40px] transition-all active:scale-95"
          title="Calcular rota para a saída viável mais próxima"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>Rota de Saída</span>
        </button>

        {/* Quick Report */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-sm min-h-[40px] transition-all active:scale-95"
          title="Reportar bloqueio, lotação ou barulho"
        >
          <Flag className="w-3.5 h-3.5 text-amber-600" />
          <span>Reportar</span>
        </button>

        <div className="h-4 w-px bg-slate-300 shrink-0 mx-1" />

        {/* Category Filter Chips */}
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[40px] ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
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
