# Entrega 3 - NLP Project

## Descripción

Tercer entrega del ChatApp para el proyecto de NLP, esta entrega incluye un mayor uso de la API de OpenAI y 3 apartados funcionales,
Chat, Draw (Para generar dibujos usando Dall-3) y Shader que permite hacer uso de GPT para editar y mostrar un shader a través de WebGPU.

---

## Cambios principales en esta entrega:

- Backend
    * Sanitización de entradas: Se sanitizan los contenidos que llegan a través el login y register para evitar inyección de código u otros problemas.
    * Implementación de la API de Realtime de OpenAI: Esta API nos permite interactuar directamente con un modelo de OpenAI mediante Websockets.
    * Implementación de eventos en el socket principal para llamar a la api de DALL-3 y para generar shaders.

- Frontend
    * Sanitización de entradas: Se sanitizan las entradas del login y register.
    * Se mejora el apartado responsive en todas las vistas.
    * Se agregan componentes para los nuevos apartados de Realtime, Draw y Shaders

## Requerimientos y Dependencias
* Node.js 20+
* React 18+
* Tailwind CSS
* Shadcn
* React Router
* Socket.IO Client
* Webpack
* Babel

---

