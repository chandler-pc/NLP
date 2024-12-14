import React from 'react';
import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import { ModelSelector } from '../components/ModelSelector';
import { Message } from '../types/chatTypes';

interface ChatContainerProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    messages: Message[];
    username: string;
    handleSendMessage: (message: string) => void;
    isWriting?: boolean;
}
export const ChatContainer: React.FC<ChatContainerProps> = ({
    selectedModel,
    setSelectedModel,
    messages,
    username,
    handleSendMessage,
    isWriting,
}) => {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex justify-between items-center bg-white shadow-sm px-4 py-2">
                <h2 className="text-2xl font-bold">Chat</h2>
                <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
            </div>

            <div className="flex-1 overflow-y-auto">
                <ChatMessages messages={messages} username={username} isWriting={isWriting} />
            </div>

            <div className="bg-white p-4">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};


