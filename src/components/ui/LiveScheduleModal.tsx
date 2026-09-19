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

  // Gather all sessions from all POIs
  const allSessions: FlattenedSession[] = [];
  for (const poi of POI_LIST) {
    if (poi.sessions) {
      for (const session of poi.sessions) {
        allSessions.push({ ...session, poi });
      }
    }
  }

  const displayedSessions = activeTab === 'live'
    ? allSessions.filter((s) => s.isLiveNow)
    : allSessions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Event Schedule & Live Talks</span>
              </h2>
              <p className="text-xs text-slate-400">
                Live sessions across stages and workshop suites
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-slate-800/80 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'all'
                ? 'text-sky-400 border-sky-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            All Sessions ({allSessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'live'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Happening Now ({allSessions.filter((s) => s.isLiveNow).length})</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="p-4 sm:px-6 overflow-y-auto space-y-3 flex-1">
          {displayedSessions.map((session) => (
            <div
              key={`${session.poi.id}-${session.id}`}
              className={`p-4 rounded-2xl border transition-all ${
                session.isLiveNow
                  ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {session.time}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: session.poi.accentColor || session.poi.color }}
                  >
                    {session.poi.name} (Floor {session.poi.floor})
                  </span>
                </div>

                {session.isLiveNow && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/40 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE NOW
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                {session.title}
              </h4>

              <div className="flex items-center text-xs text-slate-400 gap-1.5 mb-3">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>{session.speaker}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => {
                    onLocatePoi(session.poi);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Show on Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigatePoi(session.poi);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
