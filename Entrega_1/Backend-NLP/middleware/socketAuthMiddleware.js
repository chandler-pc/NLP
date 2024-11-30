import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar conexiones de WebSocket utilizando un token JWT.
 * 
 * @param {Object} socket - Objeto de socket.
 * @param {Object} socket.handshake.query - Contiene las consultas enviadas durante el handshake de WebSocket.
 * @param {string} socket.handshake.query.token - Token JWT enviado por el cliente para autenticación.
 * @param {Function} next - Función que continúa con el flujo del middleware.
 * 
 * @throws {Error} Si el token no es proporcionado o no es válido.
 */
export const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.query.token; // Extraer el token del handshake de WebSocket
        if (!token) {
            throw new Error('Token no proporcionado');
        }

        // Verificar y decodificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Adjuntar los datos del usuario decodificados al objeto socket
        next(); // Continuar al siguiente middleware o evento
    } catch (err) {
        console.error('Error autenticando el socket:', err.message);
        next(new Error('Autenticación fallida')); // Terminar con un error de autenticación
    }
};
