# Frontend Application

## Descripción

Este es el frontend de una aplicación web basada en React. Proporciona una interfaz de usuario para interactuar con el backend y manejar la autenticación y los chats.

---

## Estructura del Proyecto

### **Carpetas principales**
- **`node_modules/`**: Dependencias instaladas para el proyecto.
- **`public/`**: Archivos estáticos públicos accesibles desde el navegador.
  - `_redirects`: Archivo de configuración para redirecciones.
  - `index.html`: Documento principal HTML para la aplicación.
- **`src/`**: Contiene el código fuente principal.
  - **`components/`**: Componentes reutilizables de la aplicación.
    - `ChatComponent.js`: Componente para seleccionar un chat.
  - **`context/`**: Manejo del contexto global de React.
    - `AuthContext.js`: Contexto de autenticación para el manejo del estado de usuario.
  - **`pages/`**: Páginas principales de la aplicación.
    - `Chat.js`: Página para manejar las sesiones de chat.
    - `Home.js`: Página principal o landing page.
    - `Login.js`: Página para el inicio de sesión.
    - `Register.js`: Página para registrar nuevos usuarios.
  - **`App.js`**: Componente raíz que define las rutas y estructura principal de la aplicación.
  - **`index.js`**: Punto de entrada para renderizar la aplicación en el navegador.
- **Archivos de estilos:**
  - `styles.css`: Estilos principales de la aplicación.
  - `styles-build.css`: Archivo generado (con Tailwind CSS) después del proceso de construcción.

---

## Configuración

### **Dependencias principales**
- **React**: Biblioteca principal para construir interfaces de usuario.
- **Tailwind CSS**: Framework para diseñar estilos de manera rápida y eficiente.
- **React Router**: Manejo de rutas para navegación entre páginas.
- **Webpack**: Empaquetador de módulos para gestionar los archivos del proyecto.

### **Archivos de configuración**
- **`.babelrc`**: Configuración para Babel.
- **`postcss.config.js`**: Configuración para PostCSS.
- **`tailwind.config.js`**: Configuración personalizada de Tailwind CSS.
- **`webpack.config.js`**: Configuración para Webpack.

---
