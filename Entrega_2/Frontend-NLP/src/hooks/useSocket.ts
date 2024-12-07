import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Chat, Message } from '../types/chatTypes';

interface UseSocketProps {
  onChatsUpdate: (chats: Chat[]) => void;
  onMessagesUpdate: (messages: Message[]) => void;
  onNewMessage: (message: Message) => void;
  onChatNameUpdated: (chatId: string, name: string) => void;
  onChatDeleted: (chatId: string) => void;
  onError: (error: string) => void;
}

export const useSocket = ({
  onChatsUpdate,
  onMessagesUpdate,
  onNewMessage,
  onChatNameUpdated,
  onChatDeleted,
  onError,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const newSocket = io('http://localhost:5000', {
      auth: { token },
    });
    console.log('Connecting to server');
    setSocket(newSocket);
    newSocket.on('connected', () => {
      console.log('Connected to server');
      newSocket.emit('getChats');
    });

    newSocket.on('chats', (data: Chat[]) => {
      onChatsUpdate(data);
    });

    newSocket.on('chatNameUpdated', ({ chatId, name }: { chatId: string; name: string }) => {
      onChatNameUpdated(chatId, name);
    });

    newSocket.on('chatDeleted', (chatId : string) => {
      onChatDeleted(chatId);
    });

    newSocket.on('messages', (data: Message[]) => {
      onMessagesUpdate(data);
    });

    newSocket.on('newMessage', (data: Message) => {
      onNewMessage(data);
    });

    newSocket.on('error', (error: { message: string }) => {
      onError(error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const getMessages = (chatId: string) => {
    socket?.emit('getMessages', { chatId });
  };

  const createChat = (name: string, callback: (chat: Chat) => void) => {
    socket?.emit('createChat', { name }, callback);
  };

  const sendMessage = (chatId: string, content: string) => {
    socket?.emit('sendMessage', { chatId, content });
  };

  return { socket, getMessages, createChat, sendMessage };
};
