import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import { handleWebSocket } from './controllers/chatController.js';
import { socketAuthMiddleware } from './middleware/socketAuthMiddleware.js';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

app.use(json());

const corsOptions = {
    origin: process.env.FRONTEND_URL
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

io.use(socketAuthMiddleware);

app.use('/api/auth', authRoutes);

connectDB();

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    handleWebSocket(socket);

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
