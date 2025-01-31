'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGetApiProdutoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto as Product } from '@/api/generated/mCNSistemas.schemas';
import { toast } from "react-hot-toast";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';

// Tipagem para os parâmetros da página
type CategoryPageParams = {
  slug: string;
}


type SortOption = 'relevancia' | 'menor' | 'maior' | 'nome';

type PriceRange = {
  min: number;
  max: number;
  label: string;
};

// Página de categoria
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('relevancia');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: productsData = [], error: apiError, isLoading: apiLoading } = useGetApiProdutoEcommerce({
    empresa: 1,
    categoria: parseInt(params.slug)
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });


  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      
      // Calcular faixas de preço dinâmicas baseadas nos produtos
      const prices = productsData.map(p => p.PrecoPromocional || p.Preco || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const range = maxPrice - minPrice;
      

      const priceRanges = [
        { min: minPrice, max: minPrice + range * 0.25, label: `Até R$ ${(minPrice + range * 0.25).toFixed(2)}` },
        { min: minPrice + range * 0.25, max: minPrice + range * 0.5, label: `R$ ${(minPrice + range * 0.25).toFixed(2)} a R$ ${(minPrice + range * 0.5).toFixed(2)}` },
        { min: minPrice + range * 0.5, max: minPrice + range * 0.75, label: `R$ ${(minPrice + range * 0.5).toFixed(2)} a R$ ${(minPrice + range * 0.75).toFixed(2)}` },
        { min: minPrice + range * 0.75, max: maxPrice, label: `Acima de R$ ${(minPrice + range * 0.75).toFixed(2)}` }
      ];
      setSelectedPriceRanges(priceRanges);
    }
  }, [productsData]);

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.Marca || ''));
    }

    // Aplicar filtros de faixa de preço
    if (selectedPriceRanges.length > 0) {
      result = result.filter(p => {
        const price = p.PrecoPromocional || p.Preco || 0;
        return selectedPriceRanges.some(range => 
          price >= range.min && price <= range.max
        );
      });

    }

    // Aplicar ordenação
    switch (sortOrder) {
      case 'menor':
        result.sort((a, b) => (a.PrecoPromocional || a.Preco || 0) - (b.PrecoPromocional || b.Preco || 0));
        break;
      case 'maior':
        result.sort((a, b) => (b.PrecoPromocional || b.Preco || 0) - (a.PrecoPromocional || a.Preco || 0));
        break;
      case 'nome':
        result.sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0);

        break;
    }

    return result;
  }, [products, selectedBrands, selectedPriceRanges, sortOrder]);

  // Extrair marcas únicas
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.Marca)));
  }, [products]);

  const handleBrandChange = (marca: string) => {
    setSelectedBrands(prev => 
      prev.includes(marca)
        ? prev.filter(m => m !== marca)
        : [...prev, marca]
    );
  };

  // Handler para filtro de preço
  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRanges(prev => {
      const exists = prev.some(r => r.min === range.min && r.max === range.max);
      if (exists) {
        return prev.filter(r => r.min !== range.min || r.max !== range.max);
      }
      return [...prev, range];
    });
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setSortOrder('relevancia');
  };

  // Adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao || ''}
            fill
            className="object-contain"

          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">{product.Descricao}</p>
        </div>
      </div>
    );
  };

  if (apiLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const categoryName = products[0]?.Categoria || 'Categoria';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Breadcrumb e Cabeçalho */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <span>/</span>
              <li><Link href="/categorias" className="hover:text-primary">Categorias</Link></li>
              <span>/</span>
              <li className="text-gray-900 font-medium">{categoryName}</li>
            </ol>
          </nav>
          
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-600 mt-2">
            {filteredAndSortedProducts.length} produtos encontrados
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Laterais */}
          <aside className="w-full lg:w-64 space-y-6">
            {/* Cabeçalho Filtros */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-gray-900">Filtros</span>
              </div>
              <button className="text-primary hover:text-primary-dark font-medium">
                Limpar Filtros
              </button>
            </div>

            {/* Filtro de Preço */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Preço</h3>
              <div className="space-y-2">
                {selectedPriceRanges.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.some(r => r.min === range.min && r.max === range.max)}
                      onChange={() => handlePriceRangeChange(range)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro de Marcas */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Marcas</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand || '')}
                      onChange={() => handleBrandChange(brand || '')}
                      className="rounded text-primary focus:ring-primary"
                    />

                    <span className="text-gray-700">{brand}</span>
                    <span className="text-xs text-gray-500">
                      ({products.filter(p => p.Marca === brand).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Lista de Produtos */}
          <div className="flex-1">
            {/* Controles de visualização */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {filteredAndSortedProducts.length} produtos
                  </span>
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOption)}
                  className="text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="relevancia">Mais Relevantes</option>
                  <option value="menor">Menor Preço</option>
                  <option value="maior">Maior Preço</option>
                  <option value="nome">Nome</option>
                </select>
              </div>
            </div>

            {/* Grid/Lista de Produtos */}
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.Produto}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                >
                  <Link href={`/produto/${product.Produto}`} className="block">
                    <div className={`
                      relative group
                      ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}
                    `}>
                      <Image
                        src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
                        alt={product.Descricao || ''}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"

                      />
                      {product.PrecoPromocional > 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round(((product.Preco || 0 - product.PrecoPromocional || 0) / (product.Preco || 0)) * 100)}% OFF
                        </span>
                      )}

                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {product.Descricao}
                      </h3>
                      <div className="space-y-1">
                        {product.PrecoPromocional > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            De: R$ {product.Preco?.toFixed(2) || '0.00'}
                          </p>
                        )}

                        <p className="text-xl font-bold text-primary">
                          R$ {(product.PrecoPromocional || product.Preco || 0).toFixed(2)}
                        </p>
                      </div>

                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              ))}
            </div>

            {/* Estado vazio */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">
                  Nenhum produto encontrado
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}