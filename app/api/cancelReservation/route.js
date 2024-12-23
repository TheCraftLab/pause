import { firestore } from '../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { slotId, index } = await req.json(); // Recevoir slotId et index de la réservation

        if (!slotId || index === undefined) {
            return NextResponse.json({ error: 'slotId et index sont requis' }, { status: 400 });
        }

        // Récupérer le créneau depuis Firestore
        const slotRef = doc(firestore, 'slots', slotId);
        const slotSnapshot = await getDoc(slotRef);

        if (!slotSnapshot.exists()) {
            return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 });
        }

        // Annuler la réservation
        const slotData = slotSnapshot.data();
        const reserved = [...slotData.reserved];
        reserved[index] = null; // Annuler la réservation pour l'index spécifié

        // Mettre à jour le créneau dans Firestore
        await updateDoc(slotRef, { reserved });

        return NextResponse.json({ message: 'Réservation annulée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'annulation de la réservation:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
