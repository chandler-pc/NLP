import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Message } from "../types/chatTypes";

interface ChatMessagesProps {
  messages: Message[];
  username?: string;
  isWriting?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, username, isWriting }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWriting]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'gpt' ? 'justify-start' : 'justify-end'
            }`}
          >
            {msg.role === 'gpt' && (
              <Avatar className="h-8 w-8 border bg-white">
                <AvatarImage src="" alt="GPT Avatar" />
                <AvatarFallback>GPT</AvatarFallback>
              </Avatar>
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
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};