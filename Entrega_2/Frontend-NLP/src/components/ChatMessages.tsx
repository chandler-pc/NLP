import React from 'react';
import { ScrollArea } from "../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Message } from "../types/chatTypes";

interface ChatMessagesProps {
  messages: Message[];
  username?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, username }) => {
  return (
    <ScrollArea className="flex-1 mb-4 p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-3 ${
              msg.role === 'gpt' ? 'justify-start' : 'justify-end'
            }`}
          >
            {msg.role === 'gpt' && (
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8 border bg-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="GPT Avatar" />
                  <AvatarFallback>GPT</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div 
              className={`relative max-w-[80%] ${
                msg.role === 'gpt' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-blue-500 text-white'
              } px-4 py-2 rounded-2xl shadow-sm`}
            >
              <div className="font-medium text-sm mb-1">
                {msg.role === 'gpt' ? 'GPT' : username}
              </div>
              <div className="text-sm whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            {msg.role !== 'gpt' && (
              <div className="flex-shrink-0">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}&backgroundColor=c0aede,d1d4f9&backgroundType=gradientLinear`} alt="User Avatar" />
                <AvatarFallback className="bg-blue-500 text-white">
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};