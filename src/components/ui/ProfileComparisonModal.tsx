import { ArrowRight, ShieldCheck, VolumeX, Users, Footprints, Clock } from 'lucide-react';
import type { ProfileComparisonResult } from '../../utils/pathfinding';
import { ACCESSIBILITY_PROFILES } from '../../data/eventData';
import type { AccessibilityProfile } from '../../data/eventData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProfileComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ProfileComparisonResult[];
  activeProfile: AccessibilityProfile;
  onSelectProfile: (profile: AccessibilityProfile) => void;
}

export function ProfileComparisonModal({
  isOpen,
  onClose,
  results,
  activeProfile,
  onSelectProfile,
}: ProfileComparisonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 pr-12">
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            Comparação de Rotas por Perfil
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Veja como cada perfil adapta o trajeto para evitar barreiras, escadas e sobrecargas
          </DialogDescription>
        </DialogHeader>

        {/* Comparison Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {results.map((item) => {
            const profile = ACCESSIBILITY_PROFILES[item.profileId];
            const isCurrent = activeProfile.id === item.profileId;

            return (
              <Card
                key={item.profileId}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-400 ring-1 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: profile.color }}
                    >
                      {item.profileName}
                    </span>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200">
                        Ativo
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-1 text-slate-800 font-bold">
                      <Footprints className="w-3.5 h-3.5 text-blue-600" />
                      {item.distanceMeters}m
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      ~{item.estimatedMinutes} min
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mb-3">
                  {profile.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  {profile.evitaEscada && (
                    <Badge variant="success" className="gap-1 text-[11px] font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Livre de degraus (usa elevador/rampa)
                    </Badge>
                  )}
                  {item.avoidedNoise && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      <VolumeX className="w-3 h-3 text-purple-600" />
                      Desviou de som alto
                    </span>
                  )}
                  {item.avoidedCrowd && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      <Users className="w-3 h-3 text-blue-600" />
                      Desviou de aglomerações
                    </span>
                  )}

                  {!isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onSelectProfile(profile);
                        onClose();
                      }}
                      className="ml-auto text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1 rounded-xl min-h-[36px]"
                    >
                      <span>Aplicar este perfil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
