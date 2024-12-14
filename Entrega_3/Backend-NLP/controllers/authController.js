import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

/**
 * Middleware para validar y sanitizar los datos de registro.
 */
export const validateRegister = [
    body('username').trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres').escape(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').escape(),
    body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido').normalizeEmail(),
];

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la solicitud con los datos del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {
        // Verificar si el nombre de usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Nombre de usuario ya existe' });
        }

        // Verificar si el correo electrónico ya existe
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Correo ya existe' });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            email,
        });

        // Guardar el nuevo usuario
        await user.save();

        res.status(201).json({
            message: 'Usuario registrado',
            user: { id: user._id, username, email },
        });
    } catch (err) {
        res.status(500).json({
            error: 'Error registrando usuario',
            details: err.message,
        });
    }
};

/**
 * Middleware para validar y sanitizar los datos de inicio de sesión.
 */
export const validateLogin = [
    body('username').trim().notEmpty().withMessage('El nombre de usuario es obligatorio').escape(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria').escape(),
];

/**
 * Inicia sesión un usuario existente y devuelve un token JWT.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la solicitud con las credenciales del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Verificar si la contraseña es válida
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({
            error: 'Error iniciando sesión',
            details: err.message,
        });
    }
};

/**
 * Obtiene el perfil del usuario autenticado.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const getProfile = async (req, res) => {
    try {
        // Buscar usuario por ID y excluir la contraseña
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el perfil del usuario', details: err.message });
    }
};
