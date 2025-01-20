'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header";
import { Product } from "@/types/product";
import { useApi } from '@/hooks/useApi';
import Image from "next/image";
import Link from "next/link";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchApi } = useApi();

  useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchApi(`/produto/ecommerce?empresa=1&busca=${encodeURIComponent(query)}`);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro na busca:', err);
        setError('Erro ao realizar a busca');
      } finally {
        setIsLoading(false);
      }
    }

    searchProducts();
  }, [query]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Cabeçalho da Busca */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl font-bold">Resultados da busca</h1>
            </div>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'resultado' : 'resultados'} encontrado{products.length === 1 ? '' : 's'} para "{query}"
            </p>
          </div>

          {/* Controles de Visualização */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid de Produtos */}
          {products.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {products.map((product) => (
                <Link
                  key={product.Produto}
                  href={`/produto/${product.Produto}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className={`p-4 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                    <div className={`
                      relative aspect-square mb-4
                      ${viewMode === 'list' ? 'w-48 mb-0' : ''}
                    `}>
                      <Image
                        src={product.Imagens[0]?.URL || '/placeholder.jpg'}
                        alt={product.Descricao}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.Descricao}
                      </h3>
                      
                      <div className="space-y-1">
                        {product.PrecoPromocional > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.Preco.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xl font-bold text-primary">
                          R$ {(product.PrecoPromocional || product.Preco).toFixed(2)}
                        </p>
                      </div>

                      {viewMode === 'list' && product.DescEcommerce && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                          {product.DescEcommerce}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhum produto encontrado para sua busca</p>
              <p className="text-sm text-gray-400 mt-2">
                Tente usar palavras-chave diferentes ou mais genéricas
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 