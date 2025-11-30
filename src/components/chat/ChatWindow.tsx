import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore, Message } from '@/store/chatStore';
import { messageAPI } from '@/services/api';
import { socketService } from '@/services/socket';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useToast } from '@/hooks/use-toast';

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    currentSessionId,
    messages,
    adminIsTyping,
    setMessages,
    addMessage,
    setAdminIsTyping,
  } = useChatStore();

  useEffect(() => {
    if (!currentSessionId) return;

    loadMessages();

    // Connect socket and join session
    socketService.connect();
    socketService.joinSession(currentSessionId);

    // Listen for new messages
    socketService.onNewMessage((message: Message) => {
      addMessage(message);
    });

    // Listen for typing indicators
    socketService.onUserTyping((data: any) => {
      if (data.userType === 'admin') {
        setAdminIsTyping(data.isTyping);
      }
    });

    return () => {
      socketService.offNewMessage();
      socketService.offUserTyping();
      socketService.leaveSession(currentSessionId);
    };
  }, [currentSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    if (!currentSessionId) return;

    try {
      const data = await messageAPI.getBySession(currentSessionId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !currentSessionId) return;

    setIsLoading(true);

    try {
      socketService.sendMessage(currentSessionId, 'user', message.trim());
      setMessage('');
      handleTyping(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleTyping = (typing: boolean) => {
    if (!currentSessionId) return;
    socketService.sendTyping(currentSessionId, 'user', typing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-24 right-6 z-50 w-96 h-[600px]"
    >
      <Card className="h-full flex flex-col shadow-xl border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Chat Support</h3>
            <p className="text-xs opacity-90">We're here to help!</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>Start a conversation!</p>
                <p className="text-xs mt-2">We'll respond as soon as possible.</p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg}  />
            ))}
            {adminIsTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
