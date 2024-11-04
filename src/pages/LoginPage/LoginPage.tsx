// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust path to your Firebase config

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error during Google Sign-In', error);
        }
    };

    useEffect(() => {
        // Redirect to home (or another route) if user is already authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/'); // Redirect to home or any other protected route after login
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
    );
};

export default LoginPage;
