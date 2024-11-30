import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a la App de Chat</h1>
            <p className="text-lg mb-6">Regístrate o inicia sesión para comenzar</p>
            <div className="flex space-x-4">
                <Link to="/login">
                    <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                        Iniciar Sesión
                    </button>
                </Link>
                <Link to="/register">
                    <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                        Registrarme
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
