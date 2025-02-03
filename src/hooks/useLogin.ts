import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePostApiAutenticacaoAutenticar } from '@/api/generated/mCNSistemas';
import type { AutenticacaoDto } from '@/api/generated/mCNSistemas.schemas';

interface LoginCredentials {
  Usuario: string;
  Senha: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const { setToken, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const { trigger, isMutating: isLoading, error: loginError, data: loginData } = usePostApiAutenticacaoAutenticar();
  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const data = await trigger({
        Contrato: 391,
        Usuario: credentials.Usuario,
        Senha: credentials.Senha
      } as AutenticacaoDto);

      if (data.Token) {
        setToken(data.Token);
        setIsAuthenticated(true);
        
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo');
        
        router.push(returnTo || '/minha-conta/usuario');
        return true;
      }
      setError(loginData?.error || 'Erro ao fazer login');
      return false;
    } catch (err) {
      setError(loginData?.error || 'Erro ao fazer login');
      return false;
    }
    

  };

  return { login, isLoading, error };
}; 