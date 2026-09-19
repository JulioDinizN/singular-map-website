import { useState } from 'react';
import {
  X,
  Navigation,
  Clock,
  User,
  Share2,
  Bookmark,
  MapPin,
  Check,
} from 'lucide-react';
import type { POI } from '../../data/eventData';

interface PoiDetailDrawerProps {
  poi: POI | null;
  onClose: () => void;
  onNavigateHere: (poi: POI) => void;
}

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

export function PoiDetailDrawer({
  poi,
  onClose,
  onNavigateHere,
}: PoiDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!poi) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Detalhes do Local"
      className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-24 sm:left-6 sm:w-96 z-30 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom sm:slide-in-from-left duration-300"
    >
      <div className="bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-slate-900/15 max-h-[65vh] sm:max-h-[80vh] flex flex-col overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: poi.accentColor || poi.color }}
              >
                {CATEGORY_LABELS[poi.category] || poi.category}
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                Piso {poi.floor}
              </span>
              {poi.boothNumber && (
                <span className="text-xs text-blue-700 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Estande {poi.boothNumber}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {poi.name}
            </h2>
            <div className="flex items-center text-xs text-slate-500 mt-1 gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{poi.zone}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {poi.description}
          </p>

          {/* Agenda / Live Sessions */}
          {poi.sessions && poi.sessions.length > 0 && (
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Programação Oficial</span>
              </h3>
              <div className="space-y-2">
                {poi.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      session.isLiveNow
                        ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.time}
                      </span>
                      {session.isLiveNow && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                          AO VIVO
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {session.title}
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <User className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{session.speaker}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateHere(poi)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-blue-500/25 text-xs sm:text-sm transition-all active:scale-[0.98] min-h-[44px]"
          >
            <Navigation className="w-4 h-4" />
            <span>Como Chegar (Rota Acessível)</span>
          </button>

          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-3 rounded-2xl border transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
              bookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-300'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title="Salvar nos Favoritos"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-3 rounded-2xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
            title="Compartilhar Localização"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
