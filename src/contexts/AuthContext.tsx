"use client"
// import { cookies } from 'next/headers';
import { createContext, useContext, useState, useEffect, SetStateAction } from 'react';


interface AuthContextData {
  token: string | null;
  usuario: string | null;
  setToken: (value: SetStateAction<string | null>) => void;
  setUsuario: (value: SetStateAction<string | null>) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;

}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isTokenValid = (token: string) => {
    try {
      // Decodificar o token (assumindo formato base64)
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      
      // Obter timestamp atual e de 6 horas atrás
      const currentTime = new Date().getTime();
      const tokenTime = new Date(decodedPayload.iat * 1000).getTime();
      const sixHours = 6 * 60 * 60 * 1000; // 6 horas em milissegundos
      
      return (currentTime - tokenTime) < sixHours;
    } catch {
      return false;
    }
  };

  const logout = async() => {
    // Limpar estados
    setToken(null);
    setIsAuthenticated(false);
    setUsuario(null);
    
    // Limpar localStorage
    localStorage.removeItem('token');
    
    // Limpar cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
    
    await authenticate();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      // Limpar token inválido se existir
      localStorage.removeItem('token');
      authenticate();
    }
    setIsLoading(false);
  }, []);

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
        }),
        next: {
          revalidate: 21600 // 6 horas em segundos
        }
      } 
    );



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

  return (
    <AuthContext.Provider value={{ 
      usuario,
      setUsuario,
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