import { useState } from 'react';
import { Clock, User, MapPin, Navigation, Radio } from 'lucide-react';
import { POI_LIST } from '@/data/eventData';
import type { POI, EventSession } from '@/data/eventData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-row items-center gap-3 space-y-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
          </div>
          <div>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
              Programação & Palestras ao Vivo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Sessões em tempo real nos palcos e salas de workshop
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Tab Filters */}
        <div className="px-4 sm:px-6 pt-2 flex gap-2 border-b border-slate-100 bg-slate-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('all')}
            className={`rounded-none border-b-2 font-bold px-3 py-2 h-auto text-xs sm:text-sm ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas as Sessões ({allSessions.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('live')}
            className={`rounded-none border-b-2 font-bold px-3 py-2 h-auto text-xs sm:text-sm gap-1.5 ${
              activeTab === 'live'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Acontecendo Agora ({allSessions.filter((s) => s.isLiveNow).length})</span>
          </Button>
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
                  <Badge
                    className="text-white shadow-sm border-0"
                    style={{ backgroundColor: session.poi.accentColor || session.poi.color }}
                  >
                    {session.poi.name} (Piso {session.poi.floor})
                  </Badge>
                </div>

                {session.isLiveNow && (
                  <Badge variant="success" className="gap-1.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    AO VIVO
                  </Badge>
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
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onLocatePoi(session.poi);
                    onClose();
                  }}
                  className="gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ver no Mapa</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onNavigatePoi(session.poi);
                    onClose();
                  }}
                  className="gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Como Chegar</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
