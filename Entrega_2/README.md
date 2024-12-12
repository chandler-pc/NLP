# Entrega 2 - NLP Project

## Descripción

En esta segunda entrega, se han realizado mejoras significativas en la interfaz de usuario (Frontend-NLP), con el objetivo de mejorar la experiencia del usuario al interactuar con el backend. Ahora la aplicación incluye una  optimización de diseño y mejoras en la gestión de la autenticación y los chats en tiempo real.

---

## Cambios principales en esta entrega:

*   Nuevo diseño responsivo: Se ha optimizado la interfaz con Tailwind CSS y Shadcn para que se vea bien tanto en dispositivos móviles como de escritorio.

* Animaciones de transición: Se han añadido animaciones sutiles para mejorar la fluidez de la interacción, como al abrir chats o enviar mensajes.

* Manejo de errores de autenticación: Se han agregado mensajes claros de error si el usuario ingresa credenciales incorrectas.

* Pantalla de inicio de sesión y registro: Se ha simplificado la navegación inicial para facilitar el acceso.

* Barra lateral: Se ha actualizado la barra de chats de forma responsiva.

* Implementación de la API en tiempo real: Ahora se habilitó la creación de chats que usan la implementación de websocket de OpenAI para tener respuestas en menor tiempo conforme el modelo las procese.

* Generación de imágenes con Dall-3: Agregado apartado para hacer uso de la API de DALL-3 para generar imágenes.

## Estructura del Proyecto
* src/components/: Contiene los componentes clave de la interfaz de usuario.
* src/pages/: Páginas principales de la aplicación (login, chats, historial, etc.).
* src/lib/: Función utils para permitir el correcto manejo de Shadcn.
* src/context: Contiene el AuthContext usado para la autenticación del usuario en toda la aplicación.
* src/types: Contiene las interfaces para varios componentes de Chat.

## Requerimientos y Dependencias
* Node.js 23+
* React 18+
* Tailwind CSS
* Shadcn
* React Router
* Socket.IO Client
* Webpack
* Babel

---

