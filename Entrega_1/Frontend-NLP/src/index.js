import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
const container = document.getElementById('root');
import './styles-build.css';

if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('No se encontró el elemento con id "root"');
}