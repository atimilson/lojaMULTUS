import { useState } from 'react';
import { useApi } from './useApi';
import { Product } from '@/types/product';

interface UseSearchReturn {
  searchResults: Product[];
  isLoading: boolean;
  error: string | null;
  searchProducts: (query: string) => Promise<void>;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchApi } = useApi();

  async function searchProducts(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApi(`/produto/ecommerce?empresa=1&busca=${encodeURIComponent(query)}`);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao realizar a busca');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    searchResults,
    isLoading,
    error,
    searchProducts
  };
}; 