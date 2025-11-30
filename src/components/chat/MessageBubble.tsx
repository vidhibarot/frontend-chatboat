import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/store/chatStore';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.senderType === 'user';
  console.log("mesagegg",message)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('max-w-[80%] space-y-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          )}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {format(new Date(message.createdAt), 'HH:mm')}
        </span>
      </div>
    </motion.div>
  );
};
