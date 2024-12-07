import { useState, useCallback } from 'react';
import { Chat, Message, UseChatReturn } from '../types/chatTypes';


export const useChat = (): UseChatReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const initializeChats = useCallback((data: Chat[]) => {
    if (data.length === 0) {
      setChats([]);
      setCurrentChatId('');
    } else {
      setChats(data);
      setCurrentChatId(data[0]._id);
    }
  }, []);

  const handleChatNameUpdate = useCallback((chatId: string, name: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat._id === chatId ? { ...chat, name } : chat))
    );
  }, []);

  const handleChatDeleted = useCallback((chatId: string) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat._id !== chatId);
      if(updatedChats.length === 0) {
        setCurrentChatId('');
        setMessages([]);
        return updatedChats;
      }
      if (currentChatId === chatId) {
        setCurrentChatId('');
        setMessages([]);
      }

      return updatedChats;
    });
  }, [currentChatId]);

  const handleMessagesUpdate = useCallback((data: Message[]) => {
    setMessages(data);
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return {
    chats,
    currentChatId,
    messages,
    setCurrentChatId,
    initializeChats,
    handleChatNameUpdate,
    handleChatDeleted,
    handleMessagesUpdate,
    handleNewMessage,
  };
};
