import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token);
            } else {
                setMessage(data.error || 'Credenciales inválidas');
            }
        } catch {
            setMessage('Error en el servidor');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Ingresar
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm text-red-500">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
