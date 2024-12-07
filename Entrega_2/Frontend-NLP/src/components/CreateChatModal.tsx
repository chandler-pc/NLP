import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (chatName: string) => void;
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [chatName, setChatName] = useState('');

  const handleConfirm = () => {
    if (chatName.trim()) {
      onConfirm(chatName.trim());
      setChatName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo chat</DialogTitle>
          <DialogDescription>
            Introduce un nombre para el nuevo chat.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Nombre del nuevo chat"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!chatName.trim()}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};