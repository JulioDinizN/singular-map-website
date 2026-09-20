import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Navigation,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/apiService';
import type { ConversaResponse } from '@/services/apiService';
import { POI_LIST } from '@/data/eventData';
import type { POI } from '@/data/eventData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  response?: ConversaResponse;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPoi: (poi: POI) => void;
  onEmergencyExit: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    sender: 'assistant',
    text: 'Olá! Sou a assistente de acessibilidade do evento. Como posso te ajudar a navegar pelo pavilhão hoje?',
    time: 'Agora',
    response: {
      resposta: 'Olá! Sou a assistente de acessibilidade do evento.',
      explicacao: { metodo: 'REGRAS_LOCAIS' },
      sugestoes: [
        'Onde fica a Sala de Acolhimento?',
        'Como chegar ao Stand da Oracle?',
        'Onde fica a saída de emergência?',
        'Onde tem sanitário acessível?',
      ],
    },
  },
];

export function ChatModal({
  isOpen,
  onClose,
  onNavigateToPoi,
  onEmergencyExit,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simula resposta síncrona/rápida da API
    setTimeout(() => {
      const response = apiService.enviarConversa(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.resposta,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        response,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleAction = (response: ConversaResponse) => {
    if (!response.acao) return;

    if (response.acao.tipo === 'SAIDA') {
      onEmergencyExit();
      onClose();
      return;
    }

    if (response.acao.tipo === 'TRACAR_ROTA' && response.acao.destino) {
      const targetPoi =
        POI_LIST.find((p) => p.id === response.acao?.destino) ||
        POI_LIST.find((p) => p.name.toLowerCase().includes('acolhimento')) ||
        POI_LIST.find((p) => p.category === 'quiet_room') ||
        POI_LIST[0];

      if (targetPoi) {
        onNavigateToPoi(targetPoi);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-xl h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 pr-12 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Assistente Acessível</span>
                <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 font-bold border-blue-200">
                  IA Local
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Respostas sobre lugares, programação e rotas sem degraus
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white border border-slate-200 shadow-sm text-slate-800'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Action Button from API */}
                  {isBot && msg.response?.acao && (
                    <div className="pt-1.5 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAction(msg.response!)}
                        className="text-xs font-bold gap-1.5 rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {msg.response.acao.tipo === 'SAIDA' ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-red-300" />
                            <span>Ver Saída de Emergência</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Traçar Rota no Mapa</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Suggestions Chips from API */}
                  {isBot && msg.response?.sugestoes && msg.response.sugestoes.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.response.sugestoes.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] ${
                      isBot ? 'text-slate-400' : 'text-blue-200'
                    } text-right flex items-center justify-end gap-1`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{msg.time}</span>
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mb-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-slate-500 italic pl-11">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span>Consultando base de conhecimento...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua dúvida (ex: onde tem rampa, banheiro PCD)..."
            className="text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-xl min-h-[44px]"
          />
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl min-h-[44px] px-4 font-bold shadow-md shadow-blue-500/20 shrink-0 gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
