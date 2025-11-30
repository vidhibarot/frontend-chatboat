import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { sessionAPI } from '@/services/api';
import { socketService } from '@/services/socket';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentSessionId } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      const userId = `user_${Date.now()}`;
      const session = await sessionAPI.create(userId);
      
      setCurrentSessionId(session.id);
      socketService.connect();
      socketService.joinSession(session.id);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  );
};
