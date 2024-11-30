import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { io } from 'socket.io-client';
import { ChatComponent } from '../components/ChatComponent.js';

const Chat = () => {
    const { user, logout } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            query: { token: localStorage.getItem('token') },
        });
        setSocket(newSocket);

        newSocket.on('connected', (data) => {
            console.log(data.message);
            newSocket.emit('getChats');
        });

        newSocket.on('chats', (data) => {
            if (data.length === 0) {
                newSocket.emit('createChat', { name: 'Nuevo Chat' }, (newChat) => {
                    setChats([newChat]);
                    setCurrentChatId(newChat._id);
                });
            } else {
                setChats(data);
                setCurrentChatId(data[0]._id);
            }
        });

        newSocket.on('chatNameUpdated', ({ chatId, name }) => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === chatId ? { ...chat, name } : chat
                )
            );
        });

        newSocket.on('chatDeleted', ({ chatId }) => {
            setChats((prevChats) => {
                const updatedChats = prevChats.filter((chat) => chat._id !== chatId);

                if (updatedChats.length === 0) {
                    newSocket.emit('createChat', { name: 'Nuevo Chat' }, (newChat) => {
                        setChats([newChat]);
                        setCurrentChatId(newChat._id);
                        setMessages([]);
                    });
                }
                return updatedChats;
            });

            if (currentChatId === chatId) {
                setCurrentChatId(null);
                setMessages([]);
            }
        });

        newSocket.on('messages', (data) => {
            setMessages(data);
        });

        newSocket.on('newMessage', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        newSocket.on('error', (error) => {
            console.error(error.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (currentChatId && socket) {
            socket.emit('getMessages', { chatId: currentChatId });
        }
    }, [currentChatId, socket]);

    const sendMessage = () => {
        if (!currentChatId || !message.trim()) return;
        socket.emit('sendMessage', { chatId: currentChatId, content: message });

        setMessage('');
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '25%', backgroundColor: '#f5f5f5', padding: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0 }}>Mis Chats</h2>
                    <button
                        onClick={() => {
                            const newChatName = prompt('Introduce el nombre del nuevo chat:');
                            if (newChatName) {
                                socket.emit('createChat', { name: newChatName }, (newChat) => {
                                    setChats((prev) => [...prev, newChat]);
                                });
                            }
                        }}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#AAAAAA',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            fontSize: '14px',
                        }}
                    >
                        ➕
                    </button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, flex: 1, overflowY: 'auto' }}>
                    {chats.map((chat) => (
                        <ChatComponent
                            key={chat._id}
                            _id={chat._id}
                            name={chat.name}
                            currentChatId={currentChatId}
                            onClick={setCurrentChatId}
                            socket={socket}
                        />
                    ))}
                </ul>
                <button
                    onClick={logout}
                    style={{
                        marginTop: 'auto',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px',
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column' }}>
                <h2>Chat</h2>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.role === 'gpt' ? 'GPT' : user.username}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: '80%', padding: '10px' }}
                    />
                    <button onClick={sendMessage} style={{ padding: '10px', marginLeft: '10px' }}>Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;