import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';

export interface PromotionImage {
  URL: string;
}

export interface Promotion {
  Contrato: number;
  Produto: number;
  PrecoNormal: number;
  PrecoPromocional: number;
  Descricao: string;
  DescCategoria: string;
  Marca:string;
  Complemento: string;
  Observacao: string;
  Imagens: PromotionImage[];
}

// Função atualizada para converter Promotion em Product
function promotionToProduct(promotion: Promotion): Product {
  return {
    Produto: promotion.Produto,
    Descricao: promotion.Descricao || '',
    Preco: promotion.PrecoNormal,
    PrecoPromocional: promotion.PrecoPromocional,
    Estoque: 0,
    Categoria: promotion.DescCategoria || '',
    DescCategoria: promotion.DescCategoria || '',
    Marca: promotion.Marca,
    DescEcommerce: promotion.Complemento || '',
    Observacao: promotion.Observacao || '',
    Imagens: promotion.Imagens || [],
    Contrato: promotion.Contrato,
    Grupo: '',
    SubGrupo: '',
    Alteracao: '',
  };
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchApi } = useApi();
  const { token } = useAuth();

  useEffect(() => {
    async function loadPromotions() {
      if (!token) {
        setError('Usuário não autenticado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Chamada direta usando fetch para debug
        const response = await fetch('https://pedidoexterno.mcnsistemas.net.br/api/promocao/ecommerce?empresa=1', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        if (!data || !Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }

        console.log('Dados recebidos:', data); // Debug
        const convertedData = data.map(promotionToProduct);
        setPromotions(convertedData);
      } catch (err) {
        console.error('Erro detalhado:', err);
        if (err instanceof Error) {
          setError(`Erro ao carregar promoções: ${err.message}`);
        } else {
          setError('Erro desconhecido ao carregar promoções');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPromotions();
  }, [token]);

  return { promotions, isLoading, error };
} 