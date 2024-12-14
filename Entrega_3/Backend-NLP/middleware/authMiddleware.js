import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar solicitudes HTTP utilizando un token JWT.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que continúa con el flujo de middleware.
 */
const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token de la cabecera de autorización
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Verificar si el token está presente
        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado: token ausente' });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar la información del usuario decodificada al objeto `req`
        req.user = decoded;
        next(); // Continuar con el siguiente middleware o controlador
    } catch (err) {
        return res.status(500).json({ error: 'Error de autenticación' });
    }
};

export default authMiddleware;
