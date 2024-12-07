import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const container = document.getElementById('root');
import './index.css';

if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error('No se encontró el elemento con id "root"');
}