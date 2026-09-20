import { useState, useMemo } from 'react';
import {
  ChevronUp,
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
  X,
} from 'lucide-react';
import { POI_LIST } from '@/data/eventData';
import type { POI, PoiCategory } from '@/data/eventData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
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
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. PERSISTENT BOTTOM PEEK BAR ON THE 3D MAP */}
      <aside
        aria-label="Menu de Navegação e Exploração"
        className="fixed inset-x-0 bottom-0 z-20 pointer-events-auto flex flex-col sm:hidden"
      >
        <div className="bg-white/98 backdrop-blur-2xl border-t border-slate-200/90 rounded-t-[28px] shadow-2xl shadow-slate-900/20 p-3 pt-2 flex flex-col gap-2">
          {/* Drawer Trigger Header */}
          <DrawerTrigger asChild>
            <button
              type="button"
              className="w-full flex flex-col items-center cursor-pointer select-none active:bg-slate-50/80 rounded-xl py-1 transition-colors group"
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1.5 group-hover:bg-slate-400 transition-colors" />
              <div className="w-full flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Explorar Pavilhão</span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 text-teal-700 bg-teal-50 border-teal-200 font-bold"
                  >
                    FIAP NEXT
                  </Badge>
                </span>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <span>Ver Menu</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          </DrawerTrigger>

          {/* 4 Quick Action Buttons (Waze-style, always accessible) */}
          <div className="flex items-center justify-between gap-1.5 shrink-0">
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
      </aside>

      {/* 2. SHADCN / VAUL DRAWER CONTENT (Smooth open & close animation) */}
      <DrawerContent className="max-h-[82vh] focus:outline-none sm:hidden flex flex-col">
        {/* Drawer Header */}
        <DrawerHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between text-left shrink-0">
          <div>
            <DrawerTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Explorar Pavilhão</span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 text-teal-700 bg-teal-50 border-teal-200 font-bold"
              >
                FIAP NEXT 2026
              </Badge>
            </DrawerTitle>
            <DrawerDescription className="text-xs text-slate-500 mt-0.5">
              Ações rápidas, categorias de estandes e eventos ao vivo
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 shrink-0"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Seção 1: Ações Rápidas de Segurança & Acessibilidade */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ações Rápidas & Segurança</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {/* Acolhimento */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onGoToQuietRoom();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-teal-900 truncate">Acolhimento</div>
                  <div className="text-[10px] text-teal-700 truncate">Sala sensorial</div>
                </div>
              </button>

              {/* Evacuação */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEmergencyEvacuation();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-rose-900 truncate">Evacuação</div>
                  <div className="text-[10px] text-rose-700 truncate">Saída acessível</div>
                </div>
              </button>

              {/* Assistente IA */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenChat();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-indigo-900 truncate">Assistente IA</div>
                  <div className="text-[10px] text-indigo-700 truncate">Dúvidas e rotas</div>
                </div>
              </button>

              {/* Reportar */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenReportModal();
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Flag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-900 truncate">Reportar</div>
                  <div className="text-[10px] text-amber-700 truncate">Bloqueios & som</div>
                </div>
              </button>

              {/* Painel do Organizador */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
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
                  setIsOpen(false);
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
                      setIsOpen(false);
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
            <div className="space-y-2 pb-2">
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
                          setIsOpen(false);
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
