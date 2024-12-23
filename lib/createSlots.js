// lib/createSlots.js
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // Assurez-vous que le chemin vers le fichier Firebase est correct

// Fonction pour créer les créneaux de 9h à 17h30 toutes les 15 minutes
const createSlots = async () => {
    const slotsCollection = collection(firestore, 'slots');

    // Récupérer la date d'aujourd'hui
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // Mois commence à 0, donc décembre est 11
    const day = today.getDate();

    // Création des créneaux de 9h à 17h30 toutes les 15 minutes
    for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const slotTime = new Date(year, month, day, hour, minute); // Utiliser la date actuelle
            const timestamp = Timestamp.fromDate(slotTime); // Créer un Timestamp Firestore

            // Ajouter le créneau dans Firestore
            await addDoc(slotsCollection, {
                time: timestamp,
                reserved: [null, null, null], // Créneau initialement disponible pour 3 agents
            });

            console.log(`Créneau ajouté à : ${timestamp.toDate()}`);
        }
    }
};

export default createSlots; // Exportation par défaut de la fonction createSlots
