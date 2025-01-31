'use client'

import { useGetApiProdutoEcommerce, getApiProdutoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

interface UseSearchReturn {
  searchResults: ProdutosEcommerceDto[];
  isLoading: boolean;
  error: string | null;
  searchProducts: (query: string) => void;
}

export const useSearch = (): UseSearchReturn => {
  const {
    data: searchResults,
    error,
    isLoading,
    mutate
  } = useGetApiProdutoEcommerce({ empresa: 1, busca: '' }, {
    swr: {
      revalidateOnFocus: false
    }
  });

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      mutate([], false);
      return;
    }

    try {
      const newData = await getApiProdutoEcommerce({ empresa: 1, busca: query });
      mutate(newData);
    } catch (err) {
      console.error('Erro na busca:', err);
    }
  };

  return {
    searchResults: searchResults || [],
    isLoading,
    error: error ? 'Erro ao realizar a busca' : null,
    searchProducts
  };
}; 