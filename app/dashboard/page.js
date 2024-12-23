'use client';

import { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';

export default function Dashboard() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch('/api/getSlots');

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des créneaux');
                }

                const data = await response.json();
                setSlots(data.slots);  // Mettre à jour l'état avec les créneaux
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchSlots();
    }, []);

// Fonction pour formater correctement l'heure
    const formatTime = (timestamp) => {
        console.log('Timestamp:', timestamp); // Ajoutez ceci pour vérifier ce que contient `timestamp`

        let date;

        if (timestamp instanceof Date) {
            // Si c'est déjà un objet Date, l'utiliser directement
            date = timestamp;
        } else if (timestamp?.toDate) {
            // Si c'est un Timestamp Firestore, convertir en Date
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            // Si c'est une chaîne, convertir en objet Date
            date = new Date(timestamp);
        } else {
            // Si ce n'est aucun des formats attendus, loggez une erreur
            console.error('Format de timestamp invalide:', timestamp);
            return 'Date invalide';
        }

        // Format de l'heure
        return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };



    // Fonction pour gérer la réservation
    const handleReservation = async (slotId, index, agentName) => {
        setLoading(true);
        try {
            const response = await fetch('/api/reserveSlot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotId, agentName }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la réservation');
            }

            // Mettre à jour les créneaux après la réservation
            const updatedSlots = [...slots];
            updatedSlots.forEach((slot) => {
                if (slot.id === slotId) {
                    slot.reserved[index] = agentName; // Réserver le créneau
                }
            });
            setSlots(updatedSlots);
        } catch (error) {
            console.error('Erreur de réservation:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer l'annulation de la réservation
    const handleCancel = async (slotId, index) => {
        setLoading(true);
        try {
            const response = await fetch('/api/cancelReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotId, index }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'annulation');
            }

            // Mettre à jour les créneaux après l'annulation
            const updatedSlots = [...slots];
            updatedSlots.forEach((slot) => {
                if (slot.id === slotId) {
                    slot.reserved[index] = null; // Annuler la réservation
                }
            });
            setSlots(updatedSlots);
        } catch (error) {
            console.error('Erreur d\'annulation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Tableau de bord des créneaux
            </Typography>
            <Grid container spacing={2}>
                {slots
                    .sort((a, b) => new Date(a.time) - new Date(b.time)) // Trier les créneaux par heure croissante
                    .map((slot) => (
                        <Grid item xs={12} sm={4} key={slot.id}>
                            <Typography variant="h6">
                                {formatTime(slot.time)} {/* Afficher l'heure du créneau */}
                            </Typography>
                            <div>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={slot.reserved[index] ? 'contained' : 'outlined'}
                                        color={slot.reserved[index] ? 'error' : 'success'}
                                        disabled={loading} // Désactiver si en chargement
                                        onClick={() => {
                                            if (!slot.reserved[index] && !loading) {
                                                handleReservation(slot.id, index, `agent${index + 1}`);
                                            } else if (slot.reserved[index] && !loading) {
                                                handleCancel(slot.id, index); // Annuler si réservé
                                            }
                                        }}
                                    >
                                        {slot.reserved[index] ? `Réservé par ${slot.reserved[index]}` : 'Disponible'}
                                    </Button>
                                ))}
                            </div>
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
}
