'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiEcommerceProdutoCategoria } from '@/api/generated/mCNSistemas';
import type { ProdutoCategoriaDto } from '@/api/generated/mCNSistemas.schemas';

export function useCategorie() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  
  const {
    data: categories,
    error,
    isLoading,
  } = useGetApiEcommerceProdutoCategoria({
    swr: {
      enabled: !isAuthLoading,
    },

  });

  const sortedCategories = categories?.sort((a: ProdutoCategoriaDto, b: ProdutoCategoriaDto) => 
    a.Descricao?.localeCompare(b.Descricao?b.Descricao:'', 'pt-BR', { sensitivity: 'base' }) || 0
  ) || [];


  return {
    categories: sortedCategories,
    isLoading,
    error: error ? 'Erro ao carregar categorias' : null,
  };
} 