'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/Header";
import { Product } from "@/types/product";
import { useCart } from '@/contexts/CartContext';
import Image from "next/image";
import Link from "next/link";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useGetApiProdutoEcommerce } from '@/api/generated/mCNSistemas';

// Componente de Loading
function LoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

// Componente principal de busca
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  const { data: products = [], error, isLoading } = useGetApiProdutoEcommerce({
    empresa: 1,
    busca: query
  });

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.preventDefault();
    addItem(product, 1);
    alert('Produto adicionado ao carrinho!');
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error.toString()}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
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
              <div
                key={product.Produto}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className={`p-4 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                  <Link href={`/produto/${product.Produto}`}>
                    <div className={`
                      relative aspect-square mb-4
                      ${viewMode === 'list' ? 'w-48 mb-0' : ''}
                    `}>
                      <Image
                        src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                        alt={product.Descricao || ''}
                        fill
                        className="object-contain"

                      />
                    </div>
                  </Link>
                  
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <Link href={`/produto/${product.Produto}`}>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.Descricao}
                      </h3>
                      
                      <div className="space-y-1">
                        {product.PrecoPromocional && product.PrecoPromocional > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.Preco?.toFixed(2) || '0.00'}
                          </p>
                        )}

                        <p className="text-xl font-bold text-primary">
                          R$ {(product.PrecoPromocional || product.Preco || 0).toFixed(2)}
                        </p>
                      </div>


                      {viewMode === 'list' && product.DescEcommerce && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                          {product.DescEcommerce}
                        </p>
                      )}
                    </Link>

                    {/* Botão Adicionar ao Carrinho */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
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
  );
}

// Componente página principal
export default function BuscaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<LoadingState />}>
        <SearchContent />
      </Suspense>
    </div>
  );
} 