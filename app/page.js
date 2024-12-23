'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers la page de signup
    router.push('/dashboard');
  }, [router]);

  return null; // Pas besoin de rendre quoi que ce soit car on redirige immédiatement
};

export default Home;
