import React, { useState } from 'react';
import { ChatComponent } from './ChatComponent';
import { CreateChatModal } from './CreateChatModal';
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { PlusCircle, LogOut, Menu } from 'lucide-react'
import { ChatListProps } from "../types/chatTypes";

const ChatListContent: React.FC<{
  chats: any[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  socket: any;
  onLogout: () => void;
  setIsCreateModalOpen: (state: boolean) => void;
  setIsMobileMenuOpen?: (state: boolean) => void;
}> = ({
  chats,
  currentChatId,
  onSelectChat,
  socket,
  onLogout,
  setIsCreateModalOpen,
  setIsMobileMenuOpen,
}) => (
    <>
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-primary mb-4">Mis Chats</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3">
        <ul className="space-y-2 py-4">
          {chats.map((chat) => (
            <ChatComponent
              key={chat._id}
              _id={chat._id}
              name={chat.name}
              currentChatId={currentChatId}
              onClick={(id) => {
                onSelectChat(id);
                setIsMobileMenuOpen?.(false);
              }}
              socket={socket}
            />
          ))}
        </ul>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <Button onClick={onLogout} className="w-full" variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );

export const ChatList: React.FC<ChatListProps> = ({ chats, currentChatId, onSelectChat, socket, onCreateChat, onLogout }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateChat = (chatName: string, isChatRealtime: boolean) => {
    onCreateChat(chatName, isChatRealtime);
  };

  return (
    <>
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-secondary">
              <ChatListContent
                chats={chats}
                currentChatId={currentChatId}
                onSelectChat={onSelectChat}
                socket={socket}
                onLogout={onLogout}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex w-64 bg-secondary border-r border-border flex-col h-full">
        <ChatListContent
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
          socket={socket}
          onLogout={onLogout}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      </div>
      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateChat}
      />
    </>
  );
};
