import { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Navigation,
  ShieldAlert,
  Clock,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/apiService';
import type { ConversaResponse } from '@/services/apiService';
import { POI_LIST } from '@/data/eventData';
import type { POI } from '@/data/eventData';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  response?: ConversaResponse;
}

export interface ChatContentProps {
  onNavigateToPoi: (poi: POI) => void;
  onEmergencyExit: () => void;
  onClose: () => void;
  isMobile?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    sender: 'assistant',
    text: 'Olá! Sou a assistente do Rotas Acessíveis no FIAP NEXT 2026. Como posso te ajudar a navegar pelo pavilhão hoje?',
    time: 'Agora',
    response: {
      resposta: 'Olá! Sou a assistente do Rotas Acessíveis no FIAP NEXT 2026.',
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

export function ChatContent({
  onNavigateToPoi,
  onEmergencyExit,
  onClose,
  isMobile = false,
}: ChatContentProps) {
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

    // Resposta síncrona/rápida da API
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
    <div className={`flex flex-col ${isMobile ? 'h-[88dvh] max-h-[88dvh]' : 'h-full'} overflow-hidden bg-white`}>
      {/* Header */}
      {isMobile ? (
        <div className="shrink-0 px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 active:scale-95 transition-all"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img
              src="/brand/rotas-acessiveis-icone-app.svg"
              alt="Rotas Acessíveis"
              className="w-7 h-7 rounded-xl shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  Assistente Acessível
                </span>
                <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-teal-100 text-teal-800 font-bold border-teal-200">
                  IA Local
                </Badge>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Navegação e suporte NBR 9050
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center shrink-0"
            title="Fechar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src="/brand/rotas-acessiveis-icone-app.svg"
              alt="Rotas Acessíveis"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl shadow-md shrink-0"
            />
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Assistente Rotas Acessíveis</span>
                <Badge variant="secondary" className="text-[10px] bg-teal-100 text-teal-800 font-bold border-teal-200">
                  IA Local
                </Badge>
              </div>
              <div className="text-xs text-slate-500">
                Cada pessoa, a sua rota • Navegação e acessibilidade NBR 9050
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/40">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 sm:gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
            >
              {isBot && (
                <img
                  src="/brand/rotas-acessiveis-icone-app.svg"
                  alt="Assistente"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl shadow-xs shrink-0 mt-0.5"
                />
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-white border border-slate-200/90 shadow-xs text-slate-800'
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
                      className="text-xs font-bold gap-1.5 rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700 text-white min-h-[36px]"
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
                  <div className="pt-1.5 flex flex-wrap gap-1.5">
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
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mb-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-slate-500 italic pl-10">
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
        className="p-2.5 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0 pb-safe"
      >
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua dúvida (ex: onde tem rampa, banheiro PCD)..."
          className="text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-xl min-h-[44px] flex-1"
        />
        <Button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl min-h-[44px] min-w-[44px] px-3.5 sm:px-4 font-bold shadow-md shadow-blue-500/20 shrink-0 gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </Button>
      </form>
    </div>
  );
}
