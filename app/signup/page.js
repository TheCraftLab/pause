'use client'

import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';  // Assure-toi d'importer le bon fichier Firebase
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Créer l'utilisateur avec l'email et le mot de passe
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/login'); // Rediriger vers la page de login après l'inscription réussie
        } catch (err) {
            setError("Erreur lors de l'inscription. Vérifie tes informations.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>Créer un compte</Typography>
                <form onSubmit={handleSignup} style={{ width: '100%' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Confirmer le mot de passe"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                        S'inscrire
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;
