import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { OpenAI } from 'openai';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Creación de instancia de OpenAI

const wsMap = new Map();

/**
 * Maneja los eventos de WebSocket para un cliente conectado.
 * @param {Object} socket - Instancia del socket conectado.
 */
export const handleWebSocket = (socket) => {
    /**
     * Evento emitido al cliente para indicar una conexión exitosa.
     */
    socket.emit('connected', { message: 'Conexión establecida con el servidor WebSocket' });

    /**
     * Maneja la solicitud de obtener los chats del usuario autenticado.
     */
    socket.on('getChats', async () => {
        try {
            if (!socket.user?.id) {
                throw new Error('Usuario no autenticado');
            }
            const userId = socket.user.id;
            const chats = await Session.find({ userId }).select('_id name createdAt');
            socket.emit('chats', chats);
        } catch (err) {
            console.error('Error obteniendo chats:', err);
        }
    });

    /**
     * Maneja la edición del nombre de un chat específico.
     * @param {Object} data - Datos proporcionados por el cliente.
     * @param {string} data.chatId - ID del chat a editar.
     * @param {string} data.name - Nuevo nombre para el chat.
     */
    socket.on('editChatName', async ({ chatId, name }) => {
        try {
            await Session.updateOne({ _id: chatId }, { name });
            socket.emit('chatNameUpdated', { chatId, name });
        } catch (err) {
            console.error('Error editando nombre del chat:', err);
        }
    });

    /**
     * Crea un nuevo chat para el usuario autenticado.
     * @param {Object} data - Datos proporcionados por el cliente.
     * @param {string} data.name - Nombre del nuevo chat.
     * @param {Function} callback - Función de devolución de llamada para enviar el chat creado.
     */
    socket.on('createChat', async ({ name, isChatRealtime }, callback) => {
        try {
            const userId = socket.user.id;
            const newChat = await Session.create({ userId, name, isChatRealtime });
            if (isChatRealtime) {
                const wsId = uuidv4();
                const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
                const ws = new WebSocket(url, {
                    headers: {
                        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                        "OpenAI-Beta": "realtime=v1",
                    },
                });
                ws.on("open", function open() {
                    ws.send(JSON.stringify({
                        type: "response.create",
                        response: {
                            modalities: ["text"],
                            instructions: "Eres un chatbot",
                        }
                    }));
                });

                ws.on("message", async function incoming(message) {
                    try {
                        const parsedMessage = JSON.parse(message);

                        if (parsedMessage['type'] === 'response.text.done') {
                            console.log('Mensaje recibido del WebSocket:', parsedMessage['text']);
                            await Message.create({ sessionId: newChat._id, role: 'gpt', content: parsedMessage['text'] });
                            socket.emit('newMessage', {
                                sessionId: newChat._id,
                                role: 'gpt',
                                content: parsedMessage['text'],
                            });
                        }
                    } catch (error) {
                        console.error('Error procesando el mensaje del WebSocket:', error);
                    }
                });
                wsMap.set(wsId, ws);
                console.log('WebSocket creado:', wsId);
                await Session.updateOne({ _id: newChat._id }, { wsId });
            }
            callback(newChat);
        } catch (err) {
            console.error('Error creando un nuevo chat:', err);
        }
    });

    /**
     * Elimina un chat y sus mensajes asociados.
     * @param {Object} data - Datos proporcionados por el cliente.
     * @param {string} data.chatId - ID del chat a eliminar.
     */
    socket.on('deleteChat', async ({ chatId }) => {
        try {
            console.log('Eliminando chat:', chatId);
            await Session.deleteOne({ _id: chatId });
            await Message.deleteMany({ sessionId: chatId });
            socket.emit('chatDeleted', chatId);
        } catch (err) {
            console.error('Error eliminando chat:', err);
        }
    });

    /**
     * Obtiene los mensajes de un chat específico.
     * @param {Object} data - Datos proporcionados por el cliente.
     * @param {string} data.chatId - ID del chat del que se obtendrán los mensajes.
     */
    socket.on('getMessages', async ({ chatId }) => {
        try {
            const messages = await Message.find({ sessionId: chatId }).sort({ timestamp: 1 });
            socket.emit('messages', messages);
        } catch (err) {
            console.error('Error obteniendo mensajes:', err);
        }
    });

    /**
     * Envía un mensaje y genera una respuesta del modelo GPT.
     * También actualiza el resumen de la sesión con el nuevo mensaje.
     * @param {Object} data - Datos proporcionados por el cliente.
     * @param {string} data.chatId - ID del chat al que pertenece el mensaje.
     * @param {string} data.content - Contenido del mensaje enviado por el usuario.
     */
    socket.on('sendMessage', async ({ chatId, content, model }) => {
        try {
            const userMessage = await Message.create({ sessionId: chatId, role: 'user', content });
            socket.emit('newMessage', userMessage);

            const actualSession = await Session.findById(chatId);
            if (!actualSession) throw new Error('Sesión no encontrada.');

            if (actualSession.isChatRealtime) {
                const ws = wsMap.get(actualSession.wsId);
                ws.send(JSON.stringify({
                    type: "conversation.item.create",
                    item: {
                        type: 'message',
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: content,
                            }
                        ]
                    }
                }));
                ws.send(JSON.stringify({ type: 'response.create' }));
            } else {
                const response = await openai.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'Con este resumen' + actualSession.summary + ', contesta a lo siguiente' },
                        { role: 'user', content },
                    ],
                    model: model,
                });

                const gptMessage = response.choices[0]?.message?.content;
                if (!gptMessage) throw new Error('Respuesta de OpenAI no válida.');

                const gptResponse = await Message.create({ sessionId: chatId, role: 'gpt', content: gptMessage });
                socket.emit('newMessage', gptResponse);


                const summaryResponse = await openai.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'A este resumen ' + actualSession.summary + ' agrega lo siguiente ' + 'Usuario:' + content + '\nGPT:' + gptMessage + ' \n y resumelo' },
                    ],
                    model: 'gpt-4o-mini',
                });

                const summaryMessage = summaryResponse.choices[0]?.message?.content;
                if (!summaryMessage) throw new Error('Respuesta de OpenAI para el resumen no válida.');

                await Session.updateOne({ _id: chatId }, { summary: summaryMessage });
            }
        } catch (err) {
            console.log(chatId);
            console.error('Error enviando mensaje:', err);
        }
    });

    socket.on('generateImage', async ({ prompt }) => {
        try {
            console.log('Generando imagen con el prompt', prompt);
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
            });

            const imageUrl = response.data[0].url

            socket.emit('imageGenerated', imageUrl);

        } catch (err) {
            console.error('Error enviando mensaje:', err);
        }
    });

    /**
     * Maneja la desconexión del cliente.
     */
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
};
