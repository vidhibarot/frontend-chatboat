import { useEffect, useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/store/chatStore';
import { messageAPI } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { useToast } from '@/hooks/use-toast';

interface ChatViewProps {
  sessionId: string;
}

export const ChatView = ({ sessionId }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { admin } = useAuthStore();

  useEffect(() => {
    loadMessages();
    
    socketService.joinSession(sessionId);

    // Listen for new messages
    socketService.onNewMessage((message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socketService.onUserTyping((data: any) => {
      if (data.userType === 'user') {
        setUserIsTyping(data.isTyping);
      }
    });

    return () => {
      socketService.offNewMessage();
      socketService.offUserTyping();
      socketService.leaveSession(sessionId);
    };
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messageAPI.getBySession(sessionId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      socketService.sendMessage(sessionId, 'admin', message.trim(), admin?.id);
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
    socketService.sendTyping(sessionId, 'admin', typing);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Chat Conversation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[550px]">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                No messages yet
              </div>
            ) : (
              messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
            {userIsTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t mt-4">
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
              placeholder="Type your reply..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!message.trim() || isLoading} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};
