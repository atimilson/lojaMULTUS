import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';

function parseBrazilianDate(dateStr: string): Date {
  // Formato esperado: "DD/MM/YYYY HH:mm:ss"
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1, // Mês em JS começa em 0
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  );
}

export function useNewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (!token) {
        setError('Usuário não autenticado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/produto/ecommerce', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }

        // Filtra produtos dos últimos 90 dias
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        const newProducts = data.filter((product: Product) => {
          try {
            const alteracaoDate = parseBrazilianDate(product.Alteracao);
            const isRecent = alteracaoDate >= ninetyDaysAgo;
            console.log('Data produto:', alteracaoDate, 'É recente:', isRecent); // Debug
            return isRecent;
          } catch (err) {
            console.error('Erro ao processar data:', product.Alteracao, err);
            return false;
          }
        });

        if (isMounted) {
          setProducts(newProducts);
        }
      } catch (err) {
        console.error('Erro detalhado:', err);
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Erro ao carregar produtos');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return { products, isLoading, error };
} 