import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useChat } from '../hooks/useChat';
import { ChatList } from '../components/ChatList';
import { DrawSection } from '../components/DrawSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChatContainer } from '../components/ChatContainer';

const ChatPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!;
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [imageUrl, setImageUrl] = useState('');
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

  const { socket, getMessages, createChat, sendMessage, generateImage } = useSocket({
    onChatsUpdate: (data) => {
      initializeChats(data);
    },
    onMessagesUpdate: (data) => {
      handleMessagesUpdate(data);
    },
    onNewMessage: (data) => {
      if(data.role === 'gpt'){
        console.log('Time received: ', new Date().getTime());
      }
      handleNewMessage(data);
    },
    onChatNameUpdated: handleChatNameUpdate,
    onChatDeleted: (chatId) => {
      handleChatDeleted(chatId);
    },
    onImageGenerated: (imageUrl) => {
      console.log('Image generated', imageUrl);
      setImageUrl(imageUrl);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useEffect(() => {
    if (currentChatId) {
      getMessages(currentChatId);
    }
  }, [currentChatId]);

  const handleCreateNewChat = (newChatName: string, isChatRealtime: boolean) => {
    if (newChatName) {
      createChat(newChatName, isChatRealtime, (newChat) => {
        initializeChats([...chats, newChat]);
        setCurrentChatId(newChat._id);
      });
    }
  };

  const handleSendMessage = (msg: string) => {
    console.log('Time send: ', new Date().getTime());
    if (!currentChatId) {
      createChat('Nuevo Chat', false, (newChat) => {
        initializeChats([...chats, newChat]);
        setCurrentChatId(newChat._id);
        sendMessage(newChat._id, msg, selectedModel);
      });
      return;
    }
    sendMessage(currentChatId, msg, selectedModel);
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
      <Tabs defaultValue="chat" className="w-full flex flex-col">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="draw">Draw</TabsTrigger>
        </TabsList>
        <div className="flex-1 p-4 pb-0">
          <TabsContent value="chat">
            <ChatContainer
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              username={user?.username ?? ''}
              messages={messages}
              handleSendMessage={handleSendMessage}
            />
          </TabsContent>
          <TabsContent value="draw" className="">
            <DrawSection generateImage={generateImage} imageUrl={imageUrl} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ChatPage;

