import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 1800000,
    max: 5,
    message: { error: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo más tarde.' },
});