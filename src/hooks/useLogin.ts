import { useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  Usuario: string;
  Senha: string;
}

interface LoginResponse {
  Token: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchApi } = useApi();
  const { setToken, setIsAuthenticated, isAuthenticated } = useAuth();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchApi('/autenticacao/autenticar', {
        method: 'POST',
        body: JSON.stringify({
          Contrato: 391,
          Usuario: credentials.Usuario,
          Senha: credentials.Senha
        })
      }) as LoginResponse;

      if (data.Token) {
        setToken(data.Token);
        setIsAuthenticated(true);
        
        // Verifica se existe um parâmetro returnTo na URL
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo');
        
        // Se existir, redireciona para a página solicitada, senão vai para a área do usuário
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/minha-conta/usuario');
        }
        
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro no login:', err);
      setError('E-mail ou senha inválidos');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}; 