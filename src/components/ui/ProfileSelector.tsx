import { Accessibility, Volume2, Users, Check } from 'lucide-react';
import {
  ACCESSIBILITY_PROFILES,
} from '../../data/eventData';
import type {
  AccessibilityProfile,
  AccessibilityProfileId,
} from '../../data/eventData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ProfileSelectorProps {
  currentProfile: AccessibilityProfile;
  onSelectProfile: (profile: AccessibilityProfile) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSelector({
  currentProfile,
  onSelectProfile,
  isOpen,
  onClose,
}: ProfileSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Perfil de Acessibilidade
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Adapte as rotas e alertas às suas necessidades
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Profile Options */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[70vh]">
          {(Object.keys(ACCESSIBILITY_PROFILES) as AccessibilityProfileId[]).map((key) => {
            const profile = ACCESSIBILITY_PROFILES[key];
            const isSelected = currentProfile.id === profile.id;

            return (
              <Card
                key={profile.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectProfile(profile);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProfile(profile);
                    onClose();
                  }
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: profile.color }}
                    >
                      {profile.name}
                    </span>
                    {profile.evitaEscada && (
                      <Badge variant="success" className="text-[10px] py-0.5">
                        100% Sem Escadas
                      </Badge>
                    )}
                    {profile.id === 'NEURODIVERGENTE' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Desvio de Ruído & Multidão
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {profile.description}
                  </p>

                  {/* Weights / Specs */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-purple-600" />
                      Peso Som: {profile.pesoRuido}x
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      Peso Lotação: {profile.pesoLotacao}x
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
