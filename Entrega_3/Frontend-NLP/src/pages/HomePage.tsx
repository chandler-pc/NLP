import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { MessageCircle } from 'lucide-react'

const HomePage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authContext && authContext.isAuthenticated()) {
            navigate('/chat');
        }
    }, [authContext, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-primary">Bienvenido a GPTApp</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Chatea y descubre nuevas conversaciones
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                    <MessageCircle className="w-24 h-24 text-primary" />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button 
                        className="w-full" 
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </Button>
                    <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate('/register')}
                    >
                        Registrarme
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default HomePage;

