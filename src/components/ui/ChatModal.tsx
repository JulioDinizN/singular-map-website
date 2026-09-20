import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ChatContent } from './ChatContent';
import type { POI } from '@/data/eventData';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPoi: (poi: POI) => void;
  onEmergencyExit: () => void;
}

export function ChatModal({
  isOpen,
  onClose,
  onNavigateToPoi,
  onEmergencyExit,
}: ChatModalProps) {
  const isMobile = useIsMobile();

  // On mobile devices, the Chatbot UI is integrated inside MobileBottomSheet
  if (isMobile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-xl h-[85vh] p-0 gap-0 overflow-hidden rounded-3xl bg-white border-slate-200 flex flex-col">
        <DialogTitle className="sr-only">Assistente Rotas Acessíveis</DialogTitle>
        <DialogDescription className="sr-only">
          Chatbot de navegação e acessibilidade NBR 9050
        </DialogDescription>
        <ChatContent
          onNavigateToPoi={onNavigateToPoi}
          onEmergencyExit={onEmergencyExit}
          onClose={onClose}
          isMobile={false}
        />
      </DialogContent>
    </Dialog>
  );
}
