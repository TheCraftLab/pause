import { NextResponse } from 'next/server';
import { firestore } from '../../../lib/firebase';  // Assure-toi que le chemin est correct
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        const slotsCollection = collection(firestore, 'slots');
        const snapshot = await getDocs(slotsCollection);
        const slots = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Trier les créneaux par heure (ordre croissant)
        slots.sort((a, b) => a.time.toDate() - b.time.toDate());

        // Retourner une réponse JSON
        return NextResponse.json({ slots });
    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux:', error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des créneaux', error: error.message });
    }
}
