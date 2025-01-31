"use client"
import { createContext, useContext, useState, useEffect, SetStateAction } from 'react';

interface AuthContextData {
  token: string | null;
  setToken: (value: SetStateAction<string | null>) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async() => {
    setToken(null);
    setIsAuthenticated(false);
    await authenticate()
  };

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
        localStorage.setItem('token', data.Token);
      } else {
        setError('Falha na autenticação');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      setToken, 
      isLoading, 
      error, 
      logout,
      isAuthenticated,
      setIsAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 