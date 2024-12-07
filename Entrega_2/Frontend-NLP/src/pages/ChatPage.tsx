import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useChat } from '../hooks/useChat';
import { ChatList } from '../components/ChatList';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';

const ChatPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!;
  const {
    chats,
    currentChatId,
    messages,
    setCurrentChatId,
    initializeChats,
    handleChatNameUpdate,
    handleChatDeleted,
    handleMessagesUpdate,
    handleNewMessage
  } = useChat();

  const { socket, getMessages, createChat, sendMessage } = useSocket({
    onChatsUpdate: (data) => {
      initializeChats(data);
    },
    onMessagesUpdate: handleMessagesUpdate,
    onNewMessage: handleNewMessage,
    onChatNameUpdated: handleChatNameUpdate,
    onChatDeleted: (chatId) => {
      handleChatDeleted(chatId);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useEffect(() => {
    if (currentChatId) {
      getMessages(currentChatId);
    }
  }, [currentChatId, getMessages]);

  const handleCreateNewChat = (newChatName :string) => {
    if (newChatName) {
      createChat(newChatName, (newChat) => {
        initializeChats([...chats, newChat]);
        setCurrentChatId(newChat._id);
      });
    }
  };

  const handleSendMessage = (msg: string) => {
    console.log('Sending message:', msg);
    console.log('Current chat:', currentChatId);
    if (!currentChatId) {
      createChat('Nuevo Chat', (newChat) => {
        initializeChats([...chats, newChat]);
        setCurrentChatId(newChat._id);
        sendMessage(newChat._id, msg);
      });
      return;
    }
    sendMessage(currentChatId, msg);
  };

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        socket={socket}
        onCreateChat={handleCreateNewChat}
        onLogout={logout}
      />

      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 t text-right">Chat</h2>
        <ChatMessages messages={messages} username={user?.username} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
