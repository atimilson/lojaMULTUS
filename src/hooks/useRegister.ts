import { useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterData {
  Nome: string;
  Email: string;
  Senha: string;
  CPFouCNPJ: string;
  IE: string;
  Fone: string;
  DataNascimento: string;
}

interface ApiError {
  error: string;
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchApi } = useApi();
  const { token } = useAuth();

  const register = async (data: RegisterData) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = token;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/ecommerce/usuario', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao realizar cadastro. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}; 