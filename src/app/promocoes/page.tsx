'use client';

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePromotions } from "@/hooks/usePromotions";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { Product } from "@/types/product";

export default function PromocoesPage() {
  const { promotions, isLoading, error } = usePromotions();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('maior_desconto');

  // Extrair categorias únicas e remover undefined
  const categories = useMemo(() => {
    if (!promotions.length) return [];
    const categorySet = new Set(
      promotions
        .map(p => p.DescCategoria)
        .filter((category): category is string => !!category) // Type guard para remover undefined
    );
    return Array.from(categorySet);
  }, [promotions]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...promotions];

    // Aplicar filtros de categoria
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        p.DescCategoria && selectedCategories.includes(p.DescCategoria)
      );
    }

    // Aplicar filtro de preço
    filtered = filtered.filter(p => {
      const price = p.PrecoPromocional || p.Preco;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenação
    switch (sortOrder) {
      case 'maior_desconto':
        filtered.sort((a, b) => {
          const discountA = ((a.Preco - (a.PrecoPromocional || a.Preco)) / a.Preco) * 100;
          const discountB = ((b.Preco - (b.PrecoPromocional || b.Preco)) / b.Preco) * 100;
          return discountB - discountA;
        });
        break;
      case 'menor_preco':
        filtered.sort((a, b) => (a.PrecoPromocional || a.Preco) - (b.PrecoPromocional || b.Preco));
        break;
      case 'maior_preco':
        filtered.sort((a, b) => (b.PrecoPromocional || b.Preco) - (a.PrecoPromocional || a.Preco));
        break;
    }

    return filtered;
  }, [promotions, selectedCategories, priceRange, sortOrder]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500">
          Erro ao carregar promoções: {error}
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
        {/* Banner Principal */}
        <div className="bg-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <FireIcon className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Ofertas Imperdíveis</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <div className="w-full lg:w-64 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-black">
                    <FunnelIcon className="w-5 h-5" />
                    Filtros
                  </h3>
                </div>

                {/* Categorias */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-black">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2 text-black">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => {
                            setSelectedCategories(prev =>
                              prev.includes(category)
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
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
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} produtos encontrados
                  </span>
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="maior_desconto">Maior Desconto</option>
                  <option value="menor_preco">Menor Preço</option>
                  <option value="maior_preco">Maior Preço</option>
                </select>
              </div>

              {/* Grid de Produtos */}
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
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
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.Preco.toFixed(2)}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            R$ {(product.PrecoPromocional || product.Preco).toFixed(2)}
                          </p>
                          
                          {product.PrecoPromocional && (
                            <span className="inline-block bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded">
                              {Math.round(((product.Preco - product.PrecoPromocional) / product.Preco) * 100)}% OFF
                            </span>
                          )}
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

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Nenhum produto encontrado com os filtros selecionados</p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 2000]);
                    }}
                    className="mt-4 text-primary hover:text-primary-dark font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 