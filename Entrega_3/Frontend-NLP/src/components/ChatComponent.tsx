import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from "./ui/button"
import { EditChatModal } from './EditChatModal';
import { DeleteChatModal } from './DeleteChatModal';

interface ChatComponentProps {
  _id: string;
  name: string;
  currentChatId: string;
  onClick: (id: string) => void;
  socket: any;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ _id, name, currentChatId, onClick, socket }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = (newName: string) => {
    socket.emit('editChatName', { chatId: _id, name: newName });
  };

  const handleDeleteConfirm = () => {
    socket.emit('deleteChat', { chatId: _id });
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <li
        className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer ${
          _id === currentChatId ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
        }`}
        onClick={() => onClick(_id)}
      >
        <span className="font-medium truncate">{name}</span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar chat</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar chat</span>
          </Button>
        </div>
      </li>
      <EditChatModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        currentName={name}
      />
      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

