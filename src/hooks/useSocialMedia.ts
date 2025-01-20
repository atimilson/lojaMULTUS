import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';

interface SocialMedia {
  Empresa: number;
  RedeSocial: string;
  URL: string;
}

export function useSocialMedia() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { fetchApi } = useApi();

  useEffect(() => {
    async function loadSocialMedia() {
      if (!token) {
        setError('Usuário não autenticado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchApi('/empresa/redesocial?empresa=1');
        setSocialMedia(data);
      } catch (err) {
        console.error('Erro ao carregar redes sociais:', err);
        setError('Erro ao carregar informações de contato');
      } finally {
        setIsLoading(false);
      }
    }

    loadSocialMedia();
  }, [token]);

  const getSocialMediaUrl = (type: string) => {
    const social = socialMedia.find(s => s.RedeSocial.toUpperCase() === type.toUpperCase());
    return social?.URL || '';
  };

  return { socialMedia, isLoading, error, getSocialMediaUrl };
} 