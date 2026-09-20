import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Footprints,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiService } from '@/services/apiService';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEvacuation: () => void;
}

export function OrganizerModal({
  isOpen,
  onClose,
  onTriggerEvacuation,
}: OrganizerModalProps) {
  const [pin, setPin] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const painel = apiService.getPainel();

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '2026') {
      setIsPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleResetCenario = () => {
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 pr-12 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>Painel do Organizador</span>
                <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800 font-bold border-amber-200">
                  Rotas Acessíveis Ops
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Rotas Acessíveis • FIAP NEXT 2026 — Monitoramento de fluxo, acessibilidade e controle de emergência
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold">Rotas Geradas</span>
                <Footprints className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {painel.kpis.total_rotas_calculadas.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400">Total acumulado no evento</p>
            </Card>

            <Card className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold">Pessoas Ativas</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {painel.kpis.participantes_ativos}
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">Navegando no pavilhão</p>
            </Card>

            <Card className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold">Taxa de Adesão</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {painel.kpis.taxa_adesao_rotas_sugeridas}
              </div>
              <p className="text-[10px] text-slate-400">Seguiram rota sugerida</p>
            </Card>

            <Card className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold">Reportes Ativos</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {painel.kpis.reportes_ativos}
              </div>
              <p className="text-[10px] text-amber-600 font-semibold">Incidentes não resolvidos</p>
            </Card>
          </div>

          {/* Corredores Críticos */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Corredores Críticos & Aglomerações</span>
            </h4>
            <div className="space-y-2">
              {painel.corredores_criticos.map((corredor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{corredor.trecho}</div>
                    <div className="text-[11px] text-slate-600">{corredor.motivo}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                      Lotação: Nível {corredor.lotacao}/5
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                      Ruído: Nível {corredor.ruido}/5
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curadoria da IA */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Curadoria da Assistente (Frases para Ensinar)</span>
            </h4>
            <div className="space-y-2">
              {painel.curadoria_ia.frases_nao_compreendidas.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                >
                  <div className="text-xs text-slate-800 italic">
                    "{item.texto}"
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                    {item.sugestao_rotulo}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de Emergência e Reset (Protegidos por PIN) */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Ações do Organizador (Exige PIN: 2026)</span>
            </h4>

            {!isPinUnlocked ? (
              <form onSubmit={handleUnlockPin} className="flex gap-2 max-w-sm">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Digite o PIN do Organizador (2026)..."
                  className={`text-xs rounded-xl min-h-[40px] ${
                    pinError ? 'border-red-500 ring-1 ring-red-500/30' : ''
                  }`}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 text-xs font-bold shrink-0 min-h-[40px]"
                >
                  Desbloquear
                </Button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onTriggerEvacuation();
                    onClose();
                  }}
                  className="rounded-xl font-bold text-xs gap-1.5 min-h-[42px] shadow-md shadow-red-500/20 justify-center"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Acionar Evacuação Geral do Evento</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetCenario}
                  className="rounded-xl font-bold text-xs gap-1.5 min-h-[42px] border-slate-300 justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>{resetSuccess ? 'Cenário Resetado!' : 'Resetar Níveis do Cenário'}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
