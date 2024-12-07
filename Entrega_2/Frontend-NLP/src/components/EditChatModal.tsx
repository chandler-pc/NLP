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

interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  currentName: string;
}

export const EditChatModal: React.FC<EditChatModalProps> = ({ isOpen, onClose, onConfirm, currentName }) => {
  const [newName, setNewName] = useState(currentName);

  const handleConfirm = () => {
    onConfirm(newName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nombre del chat</DialogTitle>
          <DialogDescription>
            Introduce el nuevo nombre para este chat.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nuevo nombre del chat"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};