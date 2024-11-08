// src/components/AuthWrapper.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                if (!isAuthChecking) {
                    navigate('/login');
                }
            }
            setIsAuthChecking(false);
        });

        return () => unsubscribe();
    }, [navigate, isAuthChecking]);

    if (isAuthChecking) return <div>Loading...</div>;

    return isAuthenticated ? <>{children}</> : null;
};
