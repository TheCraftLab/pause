// app/api/createSlots/route.js
import { NextResponse } from 'next/server';
import createSlots from '../../../lib/createSlots'; // Importation correcte de la fonction createSlots

export async function GET() {
    try {
        // Appel de la fonction createSlots pour créer les créneaux
        await createSlots();
        return NextResponse.json({ message: 'Créneaux créés avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création des créneaux :', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
