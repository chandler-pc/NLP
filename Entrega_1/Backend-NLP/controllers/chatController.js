import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Creación de instancia de OpenAI

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
    socket.on('createChat', async ({ name }, callback) => {
        try {
            const userId = socket.user.id;
            const newChat = await Session.create({ userId, name });
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
    socket.on('sendMessage', async ({ chatId, content }) => {
        try {
            const userMessage = await Message.create({ sessionId: chatId, role: 'user', content });
            socket.emit('newMessage', userMessage);

            const actualSession = await Session.findById(chatId);
            if (!actualSession) throw new Error('Sesión no encontrada.');

            const response = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'Con este resumen' + actualSession.summary + ', contesta a lo siguiente' },
                    { role: 'user', content },
                ],
                model: 'gpt-4o-mini',
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
