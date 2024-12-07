export interface Chat {
    _id: string;
    name: string;
}

export interface Message {
    content: string;
    role: string;
}

export interface UseChatReturn {
    chats: Chat[];
    currentChatId: string;
    messages: Message[];
    setCurrentChatId: (chatId: string) => void;
    initializeChats: (data: Chat[]) => void;
    handleChatNameUpdate: (chatId: string, name: string) => void;
    handleChatDeleted: (chatId: string) => void;
    handleMessagesUpdate: (data: Message[]) => void;
    handleNewMessage: (message: Message) => void;
}

export interface ChatListProps {
    chats: Chat[];
    currentChatId: string;
    onSelectChat: (chatId: string) => void;
    socket: any;
    onCreateChat: (newChatName: string) => void;
    onLogout: () => void;
}