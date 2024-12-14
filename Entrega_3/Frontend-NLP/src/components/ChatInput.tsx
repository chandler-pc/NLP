import React, { useState, KeyboardEvent } from 'react';
import { Button } from "../components/ui/button"
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  promptMessage?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, promptMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-start space-x-2 px-4 pb-2 bg-background">
      <textarea
        rows={1}
        placeholder={promptMessage}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 resize-none p-2 border rounded-lg"
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim()}
        className="px-4 py-2"
      >
        <Send className="h-4 w-4 mr-2" />
        Enviar
      </Button>
    </div>
  );
};

