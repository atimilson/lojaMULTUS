'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useGetApiEcommerceProdutoMarca } from '@/api/generated/mCNSistemas';
import type { ProdutoMarcaDto } from '@/api/generated/mCNSistemas.schemas';

export function useBrands() {
  const { isLoading: isAuthLoading, error: authError,  } = useAuth();
  
  const {
    data: brands,
    error,
    isLoading,
  } = useGetApiEcommerceProdutoMarca({
    swr: {
      enabled: !isAuthLoading && !authError,
    },
  });


  const sortedBrands = brands?.sort((a: ProdutoMarcaDto, b: ProdutoMarcaDto) => 
    a.Descricao?.localeCompare(b.Descricao?b.Descricao:'', 'pt-BR', { sensitivity: 'base' }) || 0
  ) || [];


  return {
    brands: sortedBrands,
    isLoading,
    error: error ? 'Erro ao carregar marcas' : null,
  };
} 