import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export const ChatComponent = ({ _id, name, currentChatId, onClick, socket }) => {
    return (
        <li
            key={_id}
            style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: _id === currentChatId ? '#ddd' : 'transparent',
            }}
            onClick={() => onClick(_id)}
        >
            {name}
            <button
                style={{
                    marginLeft: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt('Introduce el nuevo nombre del chat:', name);
                    if (newName) {
                        socket.emit('editChatName', { chatId: _id, name: newName });
                    }
                }}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button
                style={{
                    marginLeft: '10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('¿Estás seguro de que quieres eliminar este chat?')) {
                        socket.emit('deleteChat', {chatId: _id});
                    }
                }}
            >
                <FontAwesomeIcon icon={faTrash}/>
            </button>
        </li>
    );
};
