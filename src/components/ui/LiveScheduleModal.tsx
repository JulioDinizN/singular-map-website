import { useState } from 'react';
import { X, Clock, User, MapPin, Navigation, Radio } from 'lucide-react';
import { POI_LIST } from '../../data/eventData';
import type { POI, EventSession } from '../../data/eventData';

interface LiveScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocatePoi: (poi: POI) => void;
  onNavigatePoi: (poi: POI) => void;
}

interface FlattenedSession extends EventSession {
  poi: POI;
}

export function LiveScheduleModal({
  isOpen,
  onClose,
  onLocatePoi,
  onNavigatePoi,
}: LiveScheduleModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'live'>('all');

  if (!isOpen) return null;

  const allSessions: FlattenedSession[] = [];
  for (const poi of POI_LIST) {
    if (poi.sessions) {
      for (const session of poi.sessions) {
        allSessions.push({ ...session, poi });
      }
    }
  }

  const displayedSessions =
    activeTab === 'live'
      ? allSessions.filter((s) => s.isLiveNow)
      : allSessions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Programação & Palestras ao Vivo</span>
              </h2>
              <p className="text-xs text-slate-500">
                Sessões em tempo real nos palcos e salas de workshop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all min-h-[40px] ${
              activeTab === 'all'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            Todas as Sessões ({allSessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all min-h-[40px] ${
              activeTab === 'live'
                ? 'text-emerald-700 border-emerald-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Acontecendo Agora ({allSessions.filter((s) => s.isLiveNow).length})</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {displayedSessions.map((session) => (
            <div
              key={`${session.poi.id}-${session.id}`}
              className={`p-4 rounded-2xl border transition-all ${
                session.isLiveNow
                  ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {session.time}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: session.poi.accentColor || session.poi.color }}
                  >
                    {session.poi.name} (Piso {session.poi.floor})
                  </span>
                </div>

                {session.isLiveNow && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    AO VIVO
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {session.title}
              </h4>

              <div className="flex items-center text-xs text-slate-500 gap-1.5 mb-3">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{session.speaker}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onLocatePoi(session.poi);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors min-h-[36px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ver no Mapa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigatePoi(session.poi);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-colors min-h-[36px]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Como Chegar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
