import { useState } from 'react';
import { X, AlertTriangle, Volume2, Users, CheckCircle2, ShieldAlert } from 'lucide-react';
import { POI_LIST } from '../../data/eventData';

export type ReportType = 'CHEIO' | 'BARULHO' | 'BLOQUEIO' | 'LIBERADO';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (type: ReportType, locationId: string, description: string) => void;
}

const REPORT_OPTIONS: {
  type: ReportType;
  title: string;
  desc: string;
  icon: typeof AlertTriangle;
  color: string;
  border: string;
}[] = [
  {
    type: 'BLOQUEIO',
    title: 'Bloqueio ou Degrau Indevido',
    desc: 'Passagem obstruída, elevador fora de serviço ou barreira física que impede a passagem.',
    icon: ShieldAlert,
    color: 'text-red-400 bg-red-950/40',
    border: 'border-red-500/40 hover:border-red-400',
  },
  {
    type: 'CHEIO',
    title: 'Superlotação / Multidão',
    desc: 'Corredor engarrafado ou fluxo de pessoas travado que dificulta a locomoção.',
    icon: Users,
    color: 'text-amber-400 bg-amber-950/40',
    border: 'border-amber-500/40 hover:border-amber-400',
  },
  {
    type: 'BARULHO',
    title: 'Ruído Muito Alto',
    desc: 'Som ou música excessivamente alta causando sobrecarga sensorial no local.',
    icon: Volume2,
    color: 'text-purple-400 bg-purple-950/40',
    border: 'border-purple-500/40 hover:border-purple-400',
  },
  {
    type: 'LIBERADO',
    title: 'Passagem Liberada / Normalizada',
    desc: 'O local anteriormente bloqueado ou barulhento já foi normalizado.',
    icon: CheckCircle2,
    color: 'text-emerald-400 bg-emerald-950/40',
    border: 'border-emerald-500/40 hover:border-emerald-400',
  },
];

export function ReportModal({
  isOpen,
  onClose,
  onSubmitReport,
}: ReportModalProps) {
  const [selectedType, setSelectedType] = useState<ReportType>('BLOQUEIO');
  const [selectedLocation, setSelectedLocation] = useState<string>('wp_west_aisle_north');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedType, selectedLocation, notes);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Reportar Acessibilidade / Incidente
              </h2>
              <p className="text-xs text-slate-400">
                Ajude outros participantes atualizando as condições do local
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-white">Reporte Registrado!</h3>
            <p className="text-xs text-slate-300">
              Obrigado! O mapa e as rotas acessíveis de todos os participantes foram atualizados.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            {/* Report Type Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tipo do Incidente
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REPORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSelectedType(opt.type)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? `bg-slate-800 border-sky-400 ring-2 ring-sky-400/30 shadow-md`
                          : `bg-slate-900/60 ${opt.border}`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${opt.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          {opt.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Localização do Incidente
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400"
              >
                <option value="wp_west_aisle_north">Corredor Oeste (Próximo ao Palco Principal)</option>
                <option value="wp_east_aisle_north">Corredor Leste (Próximo ao DevTech)</option>
                <option value="wp_elevator_f1">Elevador Acessível (Piso 1)</option>
                <option value="wp_stairs_f1">Escadaria Central</option>
                <option value="wp_info_desk">Cruzamento Central / Informações</option>
                <option value="wp_startup_lane_3">Alameda de Startups (Corredor Sul)</option>
                {POI_LIST.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name} (Piso {poi.floor})
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detalhes Adicionais (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cabos no chão, som de teste muito alto..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Enviar Reporte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
