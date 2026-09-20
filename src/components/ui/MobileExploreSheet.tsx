import { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  HeartHandshake,
  ShieldAlert,
  Bot,
  Flag,
  LayoutDashboard,
  Radio,
  MapPin,
  Navigation,
  Sparkles,
  Layers,
} from 'lucide-react';
import { POI_LIST } from '@/data/eventData';
import type { POI, PoiCategory } from '@/data/eventData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

interface MobileExploreSheetProps {
  selectedCategory: PoiCategory | 'all';
  onSelectCategory: (category: PoiCategory | 'all') => void;
  onSelectPoi: (poi: POI) => void;
  onGoToQuietRoom: () => void;
  onEmergencyEvacuation: () => void;
  onOpenChat: () => void;
  onOpenReportModal: () => void;
  onOpenOrganizer: () => void;
  onOpenSchedule: () => void;
  liveSessionsCount: number;
}

const CATEGORIES: { id: PoiCategory | 'all'; label: string; iconEmoji: string }[] = [
  { id: 'all', label: 'Todos', iconEmoji: '✨' },
  { id: 'stage', label: 'Palcos', iconEmoji: '🎤' },
  { id: 'booth', label: 'Estandes', iconEmoji: '🏢' },
  { id: 'workshop', label: 'Workshops', iconEmoji: '💻' },
  { id: 'quiet_room', label: 'Acolhimento', iconEmoji: '💙' },
  { id: 'exit', label: 'Saídas', iconEmoji: '🚪' },
  { id: 'food', label: 'Alimentação', iconEmoji: '☕' },
  { id: 'restroom', label: 'Sanitários', iconEmoji: '🚻' },
];

const SNAP_PEEK = '148px';
const SNAP_EXPANDED = 0.8;

export function MobileExploreSheet({
  selectedCategory,
  onSelectCategory,
  onSelectPoi,
  onGoToQuietRoom,
  onEmergencyEvacuation,
  onOpenChat,
  onOpenReportModal,
  onOpenOrganizer,
  onOpenSchedule,
  liveSessionsCount,
}: MobileExploreSheetProps) {
  const [snapPoint, setSnapPoint] = useState<number | string | null>(SNAP_PEEK);

  const isExpanded = snapPoint === SNAP_EXPANDED || snapPoint === 0.8 || snapPoint === '80%' || snapPoint === 1;

  // Filter POIs by category
  const filteredPois = useMemo(() => {
    if (selectedCategory === 'all') return POI_LIST;
    return POI_LIST.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Live sessions
  const liveSessions = useMemo(() => {
    const list: { poi: POI; title: string; speaker?: string; time: string }[] = [];
    for (const poi of POI_LIST) {
      if (poi.sessions) {
        for (const s of poi.sessions) {
          if (s.isLiveNow) {
            list.push({
              poi,
              title: s.title,
              speaker: s.speaker,
              time: s.time,
            });
          }
        }
      }
    }
    return list;
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: POI_LIST.length };
    for (const p of POI_LIST) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  const toggleSnap = () => {
    setSnapPoint(isExpanded ? SNAP_PEEK : SNAP_EXPANDED);
  };

  return (
    <Drawer
      open={true}
      dismissible={false}
      modal={false}
      shouldScaleBackground={false}
      snapPoints={[SNAP_PEEK, SNAP_EXPANDED]}
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={setSnapPoint}
    >
      <DrawerContent
        hideOverlay
        className="fixed inset-x-0 top-0 bottom-0 z-30 flex flex-col rounded-t-[28px] border-t border-slate-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl shadow-slate-900/25 focus:outline-none sm:hidden"
      >
        {/* PEEK SECTION (~148px total height) */}
        <div className="shrink-0 px-3 pt-1 pb-2 select-none">
          {/* Header Bar */}
          <div
            onClick={toggleSnap}
            className="w-full flex items-center justify-between py-1 px-1 cursor-pointer active:opacity-75 transition-opacity"
          >
            <div className="flex items-center gap-1.5">
              <DrawerTitle className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Explorar Pavilhão</span>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 text-teal-700 bg-teal-50 border-teal-200 font-bold"
                >
                  FIAP NEXT
                </Badge>
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Menu de navegação e exploração de estandes, palcos e serviços
              </DrawerDescription>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSnap();
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 active:text-blue-800"
            >
              <span>{isExpanded ? 'Recolher' : 'Ver Mais'}</span>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 4 Quick Action Buttons (Always visible in peek and expanded states) */}
          <div className="flex items-center justify-between gap-1.5 mt-1.5">
            {/* Acolhimento */}
            <button
              type="button"
              onClick={onGoToQuietRoom}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 text-teal-900 transition-all active:scale-95 min-h-[58px]"
            >
              <HeartHandshake className="w-4 h-4 text-teal-600 mb-1" />
              <span className="text-[10px] font-bold leading-tight">Acolhimento</span>
            </button>

            {/* Evacuação */}
            <button
              type="button"
              onClick={onEmergencyEvacuation}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-rose-50/90 hover:bg-rose-100 border border-rose-200/80 text-rose-900 transition-all active:scale-95 min-h-[58px]"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 mb-1" />
              <span className="text-[10px] font-bold leading-tight">Evacuação</span>
            </button>

            {/* Assistente IA */}
            <button
              type="button"
              onClick={onOpenChat}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-900 transition-all active:scale-95 min-h-[58px]"
            >
              <Bot className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="text-[10px] font-bold leading-tight">Assistente</span>
            </button>

            {/* Reportar */}
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 text-amber-900 transition-all active:scale-95 min-h-[58px]"
            >
              <Flag className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-[10px] font-bold leading-tight">Reportar</span>
            </button>
          </div>
        </div>

        {/* EXPANDED CONTENT (Scrollable inside the same physical sheet) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Seção 1: Recursos & Operação */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ações Rápidas & Segurança</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {/* Painel do Organizador */}
              <button
                type="button"
                onClick={() => {
                  setSnapPoint(SNAP_PEEK);
                  onOpenOrganizer();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Painel Ops</div>
                  <div className="text-[10px] text-slate-500 truncate">Métricas e fluxo</div>
                </div>
              </button>

              {/* Agenda Ao Vivo */}
              <button
                type="button"
                onClick={() => {
                  setSnapPoint(SNAP_PEEK);
                  onOpenSchedule();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Agenda Ao Vivo</div>
                  <div className="text-[10px] text-blue-600 font-semibold truncate">
                    {liveSessionsCount} sessões agora
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Seção 2: Categorias do Evento */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Filtrar por Categoria</span>
              </h4>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <Button
                    key={cat.id}
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`rounded-xl text-xs font-semibold px-2.5 py-1 min-h-[36px] gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{cat.iconEmoji}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-blue-800 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Seção 3: Locais Correspondentes */}
          {selectedCategory !== 'all' && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Locais Encontrados ({filteredPois.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredPois.map((poi) => (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => {
                      setSnapPoint(SNAP_PEEK);
                      onSelectPoi(poi);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 flex items-center justify-between text-left transition-all active:bg-slate-50 shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: poi.accentColor || poi.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {poi.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Piso {poi.floor} • {poi.zone}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <MapPin className="w-3 h-3" />
                      <span>Ver</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seção 4: Acontecendo Agora (Ao Vivo) */}
          {liveSessions.length > 0 && selectedCategory === 'all' && (
            <div className="space-y-2 pb-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Acontecendo Agora</span>
              </h4>

              <div className="space-y-2">
                {liveSessions.slice(0, 3).map((session, idx) => (
                  <Card
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="success"
                        className="text-[9px] uppercase px-1.5 py-0 font-bold bg-emerald-100 text-emerald-800 border-0"
                      >
                        Ao Vivo
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-500">
                        {session.time}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {session.title}
                    </div>
                    {session.speaker && (
                      <div className="text-[10px] text-slate-500">
                        Com {session.speaker}
                      </div>
                    )}
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-600 font-semibold truncate">
                        {session.poi.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setSnapPoint(SNAP_PEEK);
                          onSelectPoi(session.poi);
                        }}
                        className="h-7 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 rounded-lg gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Como Chegar</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
