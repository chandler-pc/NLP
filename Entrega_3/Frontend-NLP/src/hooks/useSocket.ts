import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Chat, Message } from '../types/chatTypes';

interface UseSocketProps {
  onChatsUpdate: (chats: Chat[]) => void;
  onMessagesUpdate: (messages: Message[]) => void;
  onNewMessage: (message: Message) => void;
  onChatNameUpdated: (chatId: string, name: string) => void;
  onChatDeleted: (chatId: string) => void;
  onImageGenerated: (imageUrl: string) => void;
  onShaderGenerated: (shader: string) => void;
  onError: (error: string) => void;
}

export const useSocket = ({
  onChatsUpdate,
  onMessagesUpdate,
  onNewMessage,
  onChatNameUpdated,
  onChatDeleted,
  onImageGenerated,
  onShaderGenerated,
  onError,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || '';
    const newSocket = io(process.env.REACT_APP_BACK_URL, {
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

    newSocket.on('imageGenerated', (imageUrl: string) => {
      onImageGenerated(imageUrl);
    });

    newSocket.on('shaderGenerated', (shader: string) => {
      onShaderGenerated(shader);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const getMessages = (chatId: string) => {
    socket?.emit('getMessages', { chatId });
  };

  const createChat = (name: string, isChatRealtime: boolean, callback: (chat: Chat) => void) => {
    socket?.emit('createChat', { name, isChatRealtime }, callback);
  };

  const sendMessage = (chatId: string, content: string, model: string) => {
    socket?.emit('sendMessage', { chatId, content, model });
  };

  const generateImage = (prompt: string) => {
    console.log('Generating image');
    socket?.emit('generateImage', { prompt });
  }

  return { socket, getMessages, createChat, sendMessage, generateImage };
};
