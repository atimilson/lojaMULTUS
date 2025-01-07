'use client'

import { useEffect, useState, useMemo } from "react";
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
  StarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

type SortOption = 'relevancia' | 'menor' | 'maior' | 'nome' | 'mais_vendidos';

export default function BrandPage({ params }: { params: { slug: string } }) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('relevancia');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPriceFilter, setCurrentPriceFilter] = useState<[number, number]>([0, 0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Carregar produtos
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchApi(`/produto/ecommerce?empresa=0&marca=${params.slug}`);
        setProducts(data);
        
        // Definir range de preços inicial
        const prices = data.map((p: Product) => p.Preco);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
        setCurrentPriceFilter([minPrice, maxPrice]);
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

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Aplicar filtros de categoria
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.Categoria));
    }

    // Aplicar filtro de preço
    result = result.filter(p => {
      const price = p.PrecoPromocional || p.Preco;
      return price >= currentPriceFilter[0] && price <= currentPriceFilter[1];
    });

    // Aplicar ordenação
    switch (sortOrder) {
      case 'menor':
        result.sort((a, b) => (a.PrecoPromocional || a.Preco) - (b.PrecoPromocional || b.Preco));
        break;
      case 'maior':
        result.sort((a, b) => (b.PrecoPromocional || b.Preco) - (a.PrecoPromocional || a.Preco));
        break;
      case 'nome':
        result.sort((a, b) => a.Descricao.localeCompare(b.Descricao));
        break;
      // Adicione mais casos de ordenação conforme necessário
    }

    return result;
  }, [products, selectedCategories, currentPriceFilter, sortOrder]);

  // Extrair categorias únicas
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.Categoria)));
  }, [products]);

  const handleCategoryChange = (categoria: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setCurrentPriceFilter(priceRange);
    setSortOrder('relevancia');
  };

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

  const brandName = products[0]?.Marca || 'Marca';

  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      
      {/* Breadcrumb e Cabeçalho */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <span>/</span>
              <li><Link href="/marcas" className="hover:text-primary">Marcas</Link></li>
              <span>/</span>
              <li className="text-gray-900 font-medium">{brandName}</li>
            </ol>
          </nav>
          
          <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
          <p className="text-gray-600 mt-2">
            {filteredAndSortedProducts.length} produtos encontrados
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Botão de filtros mobile */}
        <button
          className="md:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filtros e Ordenação
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className={`
            md:w-64 flex-shrink-0
            ${isMobileFiltersOpen 
              ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' 
              : 'hidden md:block'}
          `}>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center text-gray-700 gap-2">
                  <FunnelIcon className="w-5 h-5" />
                  Filtros
                </h3>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Categorias */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-gray-700">Categorias</h4>
                <div className="space-y-2">
                  {categories.map((categoria) => (
                    <label key={categoria} className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={selectedCategories.includes(categoria)}
                        onChange={() => handleCategoryChange(categoria)}
                        className="rounded text-primary"
                      />
                      <span className="text-sm text-gray-700">{categoria}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preço */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-gray-700">Faixa de Preço</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>R$ {currentPriceFilter[0].toFixed(2)}</span>
                    <span>R$ {currentPriceFilter[1].toFixed(2)}</span>
                  </div>
                  <input 
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={currentPriceFilter[1]}
                    onChange={(e) => setCurrentPriceFilter([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary"
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Ordenar por:</span>
                  <select 
                    className="text-sm border rounded-lg px-2 py-1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOption)}
                  >
                    <option value="relevancia">Mais Relevantes</option>
                    <option value="menor">Menor Preço</option>
                    <option value="maior">Maior Preço</option>
                    <option value="nome">Nome</option>
                    <option value="mais_vendidos">Mais Vendidos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid/Lista de produtos */}
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredAndSortedProducts.map((product) => (
                <Link 
                  key={product.Produto}
                  href={`/produto/${product.Produto}`}
                  className={`
                    bg-white rounded-lg shadow hover:shadow-md transition-shadow
                    ${viewMode === 'list' ? 'block' : ''}
                  `}
                >
                  <div className={`p-4 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                    <div className={`
                      relative aspect-square mb-4
                      ${viewMode === 'list' ? 'w-48 mb-0' : ''}
                    `}>
                      <Image
                        src={product.Imagens[0]?.URL || '/placeholder-product.jpg'}
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

                      {viewMode === 'list' && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                          {product.DescEcommerce || product.Observacao}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Nenhum produto encontrado com os filtros selecionados</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary hover:text-primary-dark font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 