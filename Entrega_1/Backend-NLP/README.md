# Backend-NLP

## Descripción
Este proyecto es un backend diseñado para manejar la lógica de autenticación y procesamiento de datos relacionados con un sistema de chat, usando la API de OpenAI y MongoDB para el almacenaje de datos.

## Estructura de Archivos
- **config/**
  - `db.js`: Configuración de la conexión a la base de datos.
- **controllers/**
  - `authController.js`: Controlador para manejar autenticación de usuarios.
  - `chatController.js`: Controlador para manejar la lógica de chat.
- **middleware/**
  - `authMiddleware.js`: Middleware para autenticación de rutas.
  - `socketAuthMiddleware.js`: Middleware para autenticar conexiones de socket.
- **models/**
  - `Message.js`: Modelo para manejar los mensajes de chat.
  - `Session.js`: Modelo para las sesiones de usuario.
  - `User.js`: Modelo para los usuarios.
- **routes/**
  - `auth.js`: Rutas relacionadas con autenticación.
- **.env**: Archivo de configuración para variables de entorno.
- **app.js**: Punto de entrada principal del servidor.