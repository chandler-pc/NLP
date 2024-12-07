import React, { useState, KeyboardEvent } from 'react';
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 bg-background border-t border-border">
      <Input
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
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

