import { X, ArrowRight, ShieldCheck, VolumeX, Users, Footprints, Clock } from 'lucide-react';
import type { ProfileComparisonResult } from '../../utils/pathfinding';
import { ACCESSIBILITY_PROFILES } from '../../data/eventData';
import type { AccessibilityProfile } from '../../data/eventData';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Comparação de Rotas por Perfil</span>
            </h2>
            <p className="text-xs text-slate-400">
              Veja como cada perfil adapta o trajeto para evitar barreiras, escadas e sobrecargas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {results.map((item) => {
            const profile = ACCESSIBILITY_PROFILES[item.profileId];
            const isCurrent = activeProfile.id === item.profileId;

            return (
              <div
                key={item.profileId}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-800/80 border-sky-400/80 ring-1 ring-sky-400/30 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: profile.color }}
                    >
                      {item.profileName}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                        Ativo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-1 text-slate-200">
                      <Footprints className="w-3.5 h-3.5 text-sky-400" />
                      {item.distanceMeters}m
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      ~{item.estimatedMinutes} min
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3">
                  {profile.description}
                </p>

                {/* Badges of what was adapted/avoided */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
                  {profile.evitaEscada && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Livre de degraus (usa elevador/rampa)
                    </span>
                  )}
                  {item.avoidedNoise && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-500/30">
                      <VolumeX className="w-3 h-3 text-purple-400" />
                      Desviou de som alto
                    </span>
                  )}
                  {item.avoidedCrowd && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-500/30">
                      <Users className="w-3 h-3 text-sky-400" />
                      Desviou de aglomerações
                    </span>
                  )}

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProfile(profile);
                        onClose();
                      }}
                      className="ml-auto flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-white hover:bg-sky-600/30 px-3 py-1 rounded-xl transition-all border border-sky-500/30"
                    >
                      <span>Aplicar este perfil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
