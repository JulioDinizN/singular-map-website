import { useState } from 'react';
import { AlertTriangle, Volume2, Users, CheckCircle2, ShieldAlert } from 'lucide-react';
import { POI_LIST } from '../../data/eventData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [selectedLocation, setSelectedLocation] = useState<string>('wp_nc_w2');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Reportar Acessibilidade / Incidente
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Ajude outros participantes atualizando as condições do local
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

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
                <option value="wp_nc_w2">Alameda 200 / Norte (Próximo ao Palco Principal)</option>
                <option value="wp_nc_e2">Alameda 400 / Norte (Próximo ao DevTech)</option>
                <option value="wp_elevator_f1">Elevador Acessível (Piso 1)</option>
                <option value="wp_stairs_f1">Escadaria Central</option>
                <option value="wp_info_desk">Concurso Central / Informações</option>
                <option value="wp_startup_w">Alameda de Startups</option>
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
              <Input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cabos no chão, som de teste muito alto..."
                className="bg-slate-50 text-xs min-h-[44px] rounded-xl"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl min-h-[44px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 min-h-[44px]"
              >
                Enviar Reporte
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
