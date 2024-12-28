'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/product";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function BrandPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('relevancia');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchApi(`/produto/ecommerce?empresa=0&marca=${params.slug}`);
        setProducts(data);
      } catch (err) {
        setError('Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
      loadProducts();
    }
  }, [params.slug, isAuthLoading, authError]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !products.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error || 'Nenhum produto encontrado para esta marca'}
        </div>
      </div>
    );
  }

  // Pega o nome da marca do primeiro produto
  const brandName = products[0]?.Marca || 'Marca';

  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/marcas" className="hover:text-primary">Marcas</Link>
          <span>/</span>
          <span className="text-gray-900">{brandName}</span>
        </div>
      </div>

      {/* Cabeçalho da marca */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
          <p className="text-gray-700 mt-2">
            Produtos da marca {brandName}
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center text-gray-700 gap-2">
                  <FunnelIcon className="w-5 h-5" />
                  Filtros
                </h3>
                <button className="text-sm text-primary hover:text-primary-dark">
                  Limpar
                </button>
              </div>

              {/* Categorias */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-gray-700">Categorias</h4>
                <div className="space-y-2">
                  {Array.from(new Set(products.map(p => p.Categoria))).map((categoria) => (
                    <label key={categoria} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary" />
                      <span className="text-sm text-gray-700">{categoria}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preço */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-gray-700">Faixa de Preço</h4>
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.max(...products.map(p => p.Preco))} 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1">
            {/* Cabeçalho da lista */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-medium">{products.length}</span> produtos encontrados
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar por:</span>
                    <select 
                      className="text-sm border rounded-lg px-2 py-1"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="relevancia">Mais Relevantes</option>
                      <option value="menor">Menor Preço</option>
                      <option value="maior">Maior Preço</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.Produto}
                  href={`/produto/${product.Produto}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={product.Imagens[0]?.URL || '/placeholder-product.jpg'}
                        alt={product.Descricao}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.Descricao}
                      </h3>
                      
                      <p className="text-lg font-bold text-primary">
                        R$ {(product.PrecoPromocional || product.Preco).toFixed(2)}
                      </p>
                      {product.PrecoPromocional > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          R$ {product.Preco.toFixed(2)}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Em até 10x de R$ {((product.PrecoPromocional || product.Preco) / 10).toFixed(2)}
                      </p>
                      {product.PrecoPromocional > 0 && (
                        <span className="inline-block mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                          {Math.round(((product.Preco - product.PrecoPromocional) / product.Preco) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 