import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSession(sessionId: string) {
    this.socket?.emit('join_session', sessionId);
  }

  leaveSession(sessionId: string) {
    this.socket?.emit('leave_session', sessionId);
  }

  sendMessage(
    sessionId: string,
    senderType: 'user' | 'admin',
    content: string,
    senderId?: string
  ) {
    this.socket?.emit('send_message', {
      sessionId,
      senderType,
      senderId,
      content,
    });
  }

  sendTyping(sessionId: string, userType: 'user' | 'admin', isTyping: boolean) {
    this.socket?.emit('typing', {
      sessionId,
      userType,
      isTyping,
    });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user_typing', callback);
  }

  offNewMessage() {
    this.socket?.off('new_message');
  }

  offUserTyping() {
    this.socket?.off('user_typing');
  }
}

export const socketService = new SocketService();
