import { Accessibility, Volume2, Users, Check } from 'lucide-react';
import {
  ACCESSIBILITY_PROFILES,
} from '../../data/eventData';
import type {
  AccessibilityProfile,
  AccessibilityProfileId,
} from '../../data/eventData';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Perfil de Acessibilidade
              </h2>
              <p className="text-xs text-slate-500">
                Adapte as rotas e alertas às suas necessidades
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 min-h-[36px]"
          >
            Fechar
          </button>
        </div>

        {/* Profile Options */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[70vh]">
          {(Object.keys(ACCESSIBILITY_PROFILES) as AccessibilityProfileId[]).map((key) => {
            const profile = ACCESSIBILITY_PROFILES[key];
            const isSelected = currentProfile.id === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onSelectProfile(profile);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 min-h-[44px] ${
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
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        100% Sem Escadas
                      </span>
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
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
