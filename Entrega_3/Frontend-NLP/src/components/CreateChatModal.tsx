import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
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
  onConfirm: (chatName: string,isChatRealtime: boolean) => void;
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [chatName, setChatName] = useState('');

  const handleConfirm = (isChatRealtime: boolean) => {
    if (chatName.trim()) {
      onConfirm(chatName.trim(), isChatRealtime);
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
          <Button onClick={() => handleConfirm(false)} disabled={!chatName.trim()}>Crear</Button>
          <Button onClick={() => handleConfirm(true)} disabled={!chatName.trim()}>Crear realtime</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};