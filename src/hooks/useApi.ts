import { useAuth } from '@/contexts/AuthContext';

export function useApi() {
  const { token } = useAuth();

  async function fetchApi(endpoint: string, options: RequestInit = {}) {
    if (!token) {
      throw new Error('Token não disponível');
    }

    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`https://pedidoexterno.mcnsistemas.net.br/api/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    return response.json();
  }

  return { fetchApi };
} 