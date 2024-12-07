import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar solicitudes HTTP utilizando un token JWT.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función que continúa con el flujo de middleware.
 * 
 * @throws {Error} Lanza un error si el token no está presente o es inválido.
 */
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado 'Authorization'

    // Verificar si el token está presente
    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    try {
        // Extraer el token (eliminar el prefijo "Bearer ")
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        // Adjuntar la información del usuario decodificada al objeto `req`
        req.user = decoded;
        next(); // Continuar con el siguiente middleware o controlador
    } catch (err) {
        // Manejar errores de token inválido
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export default authMiddleware;
