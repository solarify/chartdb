// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyA7nHhUychX_n-Y0Yb-uppAiCugO0s4KUA',
    authDomain: 'solarify-dwh-lab.firebaseapp.com',
    projectId: 'solarify-dwh-lab',
    storageBucket: 'solarify-dwh-lab.firebasestorage.app',
    messagingSenderId: '887637074431',
    appId: '1:887637074431:web:13f6a4c9005b46529a87ca',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
