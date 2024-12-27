"use client"
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticate() {
      try {
        const response = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/autenticacao/autenticar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Contrato: 391,
            Usuario: "ECOMMERCE",
            Senha: "123"
          })
        });

        const data = await response.json();
        
        if (data.Token) {
          setToken(data.Token);
        } else {
          setError('Falha na autenticação');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
      } finally {
        setIsLoading(false);
      }
    }

    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 