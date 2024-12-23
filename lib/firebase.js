// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAnbEnN5ET0BkP31jVYjOKOyobSvO52qYU",
    authDomain: "gestionnaire-de-pause.firebaseapp.com",
    projectId: "gestionnaire-de-pause",
    storageBucket: "gestionnaire-de-pause.firebasestorage.app",
    messagingSenderId: "526850978734",
    appId: "1:526850978734:web:457c53a3cddb4d024c8e3f"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore et Auth
export const auth = getAuth(app);  // Authentification Firebase
export const firestore = getFirestore(app);  // Base de données Firestore
