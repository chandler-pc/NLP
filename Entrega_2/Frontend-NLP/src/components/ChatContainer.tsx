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
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ selectedModel, setSelectedModel, messages, username, handleSendMessage }) => {

    return (
        <div className='flex flex-col'>
            <div className="flex justify-between items-center mb-4 h-auto">
                <h2 className="text-2xl font-bold">Chat</h2>
                <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
            </div>
            <div className='flex-grow'>
                <ChatMessages messages={messages} username={username} />
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}