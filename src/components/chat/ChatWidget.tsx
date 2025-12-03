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
      // Check if we have an existing session
      const existingSessionId = localStorage.getItem('chat_session_id');
      
      if (existingSessionId) {
        // Restore existing session
        setCurrentSessionId(existingSessionId);
        socketService.connect();
        socketService.joinSession(existingSessionId);
      } else {
        // Create new session
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
          userId = `user_${Date.now()}`;
          localStorage.setItem('chat_user_id', userId);
        }
        
        const session = await sessionAPI.create(userId);
        
        // Store session ID for persistence
        localStorage.setItem('chat_session_id', session.id);
        setCurrentSessionId(session.id);
        socketService.connect();
        socketService.joinSession(session.id);
      }
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
