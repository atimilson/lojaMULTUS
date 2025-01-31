'use client'

import { useState } from 'react';
import { usePostApiEcommerceUsuario } from '@/api/generated/mCNSistemas';
import type { UsuarioEcommerceDto } from '@/api/generated/mCNSistemas.schemas';

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const { trigger, isMutating: isLoading } = usePostApiEcommerceUsuario();

  const register = async (data: UsuarioEcommerceDto) => {
    try {
      setError(null);
      await trigger(data);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao realizar cadastro. Tente novamente.');
      }
      return false;
    }
  };

  return { register, isLoading, error };
}; 