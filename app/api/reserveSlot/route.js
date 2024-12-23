import { firestore } from '../../../lib/firebase'; // Importer la configuration Firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server'; // Utiliser NextResponse

export async function POST(req) {
    try {
        const { slotId, agentName } = await req.json();  // Recevoir le JSON dans le body de la requête

        // Vérifier que les données nécessaires sont présentes
        if (!slotId || !agentName) {
            return NextResponse.json({ error: 'slotId et agentName sont requis' }, { status: 400 });
        }

        // Récupérer le créneau depuis Firestore
        const slotRef = doc(firestore, 'slots', slotId);
        const slotSnapshot = await getDoc(slotRef);

        if (!slotSnapshot.exists()) {
            return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 });
        }

        // Vérifier les cases réservées et mettre à jour la case vide
        const slotData = slotSnapshot.data();
        const reserved = [...slotData.reserved];  // Créer une copie pour ne pas muter l'objet d'origine

        // Trouver la première case libre (null)
        const index = reserved.findIndex((agent) => agent === null);
        if (index === -1) {
            return NextResponse.json({ error: 'Aucune place disponible pour ce créneau' }, { status: 400 });
        }

        // Réserver le créneau pour l'agent
        reserved[index] = agentName;

        // Mettre à jour Firestore avec les nouvelles réservations
        await updateDoc(slotRef, { reserved });

        return NextResponse.json({ message: 'Créneau réservé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réservation :', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
