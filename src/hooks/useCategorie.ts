'use client'

import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';

interface Brand {
  Codigo: number;
  Descricao: string;
}

export function useCategorie() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [categories, setCategories] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchApi('ecommerce/produto/categoria');
        const sortedBrands = data.sort((a: Brand, b: Brand) => 
          a.Descricao.localeCompare(b.Descricao, 'pt-BR', { sensitivity: 'base' })
        );
        setCategories(sortedBrands);
      } catch (err) {
        setError('Erro ao carregar marcas');
        console.error('Erro ao carregar marcas:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
        loadCategories();
    }
  }, [isAuthLoading, authError]);

  return { categories, isLoading, error };
} 