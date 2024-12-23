'use client';

import { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';

export default function Dashboard() {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch('/api/getSlots');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des créneaux');
                }

                const data = await response.json();
                console.log('Données des créneaux:', data); // Vérifiez ici les données des créneaux
                setSlots(data.slots);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchSlots();
    }, []);

    const formatTime = (timestamp) => {
        console.log('Timestamp:', timestamp);
        console.log('Type du timestamp:', typeof timestamp);

        let date;

        if (timestamp instanceof Date) {
            // Si c'est déjà un objet Date, l'utiliser directement
            date = timestamp;
        } else if (timestamp && timestamp.toDate) {
            // Si c'est un Timestamp Firestore, convertir en Date
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            // Si c'est une chaîne, tenter de la convertir en Date
            date = new Date(timestamp);
        } else {
            // Si ce n'est aucun des formats attendus, loggez une erreur
            console.error('Format de timestamp invalide:', timestamp);
            return 'Date invalide';
        }

        // Format de l'heure
        return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };


    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Tableau de bord des créneaux
            </Typography>
            <Grid container spacing={2}>
                {slots
                    .sort((a, b) => a.time - b.time) // Trier les créneaux par ordre croissant
                    .map((slot) => (
                        <Grid item xs={12} sm={4} key={slot.id}>
                            <Typography variant="h6">
                                {formatTime(slot.time)} {/* Afficher l'heure du créneau */}
                            </Typography>
                            <div>
                                {/* Pour chaque créneau, on a 3 boutons pour les 3 agents */}
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={slot.reserved[index] ? 'contained' : 'outlined'}
                                        color={slot.reserved[index] ? 'error' : 'success'}
                                        disabled={slot.reserved[index]}  // Désactiver le bouton si réservé
                                    >
                                        {slot.reserved[index] ? slot.reserved[index] : 'Disponible'}
                                    </Button>
                                ))}
                            </div>
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
}
