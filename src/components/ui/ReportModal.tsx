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
    color: 'text-red-700 bg-red-50',
    border: 'border-red-200 hover:border-red-400',
  },
  {
    type: 'CHEIO',
    title: 'Superlotação / Multidão',
    desc: 'Corredor engarrafado ou fluxo de pessoas travado que dificulta a locomoção.',
    icon: Users,
    color: 'text-amber-700 bg-amber-50',
    border: 'border-amber-200 hover:border-amber-400',
  },
  {
    type: 'BARULHO',
    title: 'Ruído Muito Alto',
    desc: 'Som ou música excessivamente alta causando sobrecarga sensorial no local.',
    icon: Volume2,
    color: 'text-purple-700 bg-purple-50',
    border: 'border-purple-200 hover:border-purple-400',
  },
  {
    type: 'LIBERADO',
    title: 'Passagem Liberada / Normalizada',
    desc: 'O local anteriormente bloqueado ou barulhento já foi normalizado.',
    icon: CheckCircle2,
    color: 'text-emerald-700 bg-emerald-50',
    border: 'border-emerald-200 hover:border-emerald-400',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Reportar Acessibilidade / Incidente
              </h2>
              <p className="text-xs text-slate-500">
                Ajude outros participantes atualizando as condições do local
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reporte Registrado!</h3>
            <p className="text-xs text-slate-600">
              Obrigado! O mapa e as rotas acessíveis de todos os participantes foram atualizados.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            {/* Report Type Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
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
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 min-h-[44px] ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : `bg-white ${opt.border}`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${opt.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {opt.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Localização do Incidente
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 min-h-[44px]"
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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Detalhes Adicionais (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cabos no chão, som de teste muito alto..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all min-h-[44px]"
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
