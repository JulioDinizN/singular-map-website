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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Comparação de Rotas por Perfil</span>
            </h2>
            <p className="text-xs text-slate-500">
              Veja como cada perfil adapta o trajeto para evitar barreiras, escadas e sobrecargas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                        Ativo
                      </span>
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
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Livre de degraus (usa elevador/rampa)
                    </span>
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
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProfile(profile);
                        onClose();
                      }}
                      className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-blue-200 min-h-[36px]"
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
