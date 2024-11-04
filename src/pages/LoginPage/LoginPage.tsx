import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase';

const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 48 48"
        enableBackground="new 0 0 48 48"
        width={20}
        height={20}
    >
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12  c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24  c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657  C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571  c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
    </svg>
);

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error during Google Sign-In', error);
        }
    };

    const handleEmailSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home or any protected route after login
        } catch (error) {
            setError('Failed to sign in with email and password');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/'); // Redirect to home or any protected route after login
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="m-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm shadow-black backdrop-blur-sm">
                <img
                    src="logo.png"
                    alt="Solarify Logo"
                    className="mx-auto mb-6 scale-[0.6]"
                />
                <h1 className="mb-4 text-2xl font-semibold text-gray-800">
                    Welcome to the Solarify datawharehouse
                </h1>
                <p className="mb-6 text-gray-600">Sign in to continue</p>

                <div
                    className="flex cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white p-4 transition duration-200 hover:scale-105"
                    onClick={handleGoogleSignIn}
                >
                    <GoogleIcon />
                    <span className="ml-3 text-base font-medium text-gray-700">
                        Sign in with Google
                    </span>
                </div>

                <p className="my-4 text-gray-500">or</p>

                <form onSubmit={handleEmailSignIn}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full rounded border border-gray-400 p-3 text-base text-gray-700 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 w-full rounded border border-gray-400 p-3 text-base text-gray-700 focus:outline-none"
                        required
                    />
                    {error && (
                        <p className="mb-4 text-sm text-red-500">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-full bg-blue-500 p-3 text-base font-medium text-white transition duration-200 hover:scale-105"
                    >
                        Sign in with Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
