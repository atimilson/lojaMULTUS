'use client'

import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';

interface Brand {
  Codigo: number;
  Descricao: string;
}

export function useBrands() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchApi('ecommerce/produto/marca');
        const sortedBrands = data.sort((a: Brand, b: Brand) => 
          a.Descricao.localeCompare(b.Descricao, 'pt-BR', { sensitivity: 'base' })
        );
        setBrands(sortedBrands);
      } catch (err) {
        setError('Erro ao carregar marcas');
        console.error('Erro ao carregar marcas:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
      loadBrands();
    }
  }, [isAuthLoading, authError]);

  return { brands, isLoading, error };
} 