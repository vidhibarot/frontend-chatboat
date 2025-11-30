import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatSession } from '@/store/chatStore';
import { useAdminStore } from '@/store/adminStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { User, Circle } from 'lucide-react';

interface SessionListProps {
  sessions: ChatSession[];
}

export const SessionList = ({ sessions }: SessionListProps) => {
  const { selectedSessionId, setSelectedSessionId } = useAdminStore();

  // Filter → Only show sessions that have > 0 messages
  const filtered = sessions.filter((s:any) => s.messages.length > 0);

  return (
    <ScrollArea className="h-[600px]">
      <div className="p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No conversations yet
          </div>
        ) : (
          filtered.map((session) => (
            <Button
              key={session.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-auto py-3 px-3',
                selectedSessionId === session.id && 'bg-muted'
              )}
              onClick={() => setSelectedSessionId(session.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {session.userName || session.userId}
                    </span>

                    {session.status === 'active' && (
                      <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>

                    <Badge
                      variant={session.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs flex-shrink-0"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Button>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
