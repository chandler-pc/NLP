# Entrega 1 - NLP Project

## Descripción

Este proyecto está dividido en dos partes principales:
1. **Backend-NLP**: Implementa la lógica y expone una API para el manejo de autenticación, sesiones de chat, y procesamiento de datos relacionados con la aplicación.
2. **Frontend-NLP**: Proporciona una interfaz de usuario para interactuar con el backend y gestionar el flujo de trabajo del usuario, como el inicio de sesión, los chats y la visualización de mensajes.

---

## Estructura del Proyecto

### Directorios principales
- **`Backend-NLP/`**: Código del servidor backend.
- **`Frontend-NLP/`**: Código de la aplicación frontend.

---

### **Backend-NLP**
Ubicado en el directorio `Backend-NLP`.

#### Características principales:
- **Autenticación de usuarios**: Usando JWT para proteger las rutas.
- **Gestión de chats**: Crear, editar, eliminar y obtener mensajes.
- **Integración con OpenAI**: Procesamiento de mensajes utilizando modelos de NLP como GPT.
- **WebSockets**: Implementación para manejar eventos en tiempo real.

#### Archivos importantes:
- **.env**: Variables de entorno necesarias:
    ```
        MONGO_URI=<URL_DE_TU_BASE_DE_DATOS>
        JWT_SECRET=<CLAVE_SECRETA_PARA_JWT>
        OPENAI_API_KEY=<CLAVE_DE_OPENAI>
    ```
- **app.js**: Punto de entrada de la aplicación.
- **routes/**: Define las rutas principales del backend.
- **controllers/**: Contiene la lógica para manejar las rutas.

### **Frontend-NLP**
Ubicado en el directorio `Frontend-NLP`.

#### Características principales:
- **Interfaz de usuario**: Proporciona vistas para el inicio de sesión, registro, chats y mensajes.
- **Gestión de autenticación**: Usando React Context para manejar el estado del usuario.
- **Diseño responsivo**: Utilizando Tailwind CSS para personalización rápida.

