'use client';

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  AdjustmentsHorizontalIcon,
  FireIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export default function LancamentosPage() {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'relevancia' | 'menor' | 'maior' | 'nome'>('relevancia');

  // Hooks
  const { isLoading: isAuthLoading } = useAuth();
  const { fetchApi } = useApi();
  const { addItem } = useCart();

  // Carregar produtos
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchApi('/produto/ecommerce/novos?empresa=1');
        setProducts(data);
      } catch (err) {
        setError('Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Extrair marcas e categorias únicas
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.Marca))).sort();
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.Categoria))).sort();
  }, [products]);

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.Marca));
    }

    // Aplicar filtros de categoria
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.Categoria));
    }

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
    }

    return result;
  }, [products, selectedBrands, selectedCategories, sortOrder]);

  // Adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao}
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

  // Renderização do card do produto
  const ProductCard = (product: Product) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300">
      <Link
        href={`/produto/${product.Produto}`}
        className={`block ${viewMode === 'list' ? 'flex gap-6' : ''}`}
      >
        <div className={`
          relative group
          ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}
        `}>
          <Image
            src={product.Imagens[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {product.PrecoPromocional > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {Math.round(((product.Preco - product.PrecoPromocional) / product.Preco) * 100)}% OFF
            </span>
          )}
        </div>

        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {product.Descricao}
          </h3>

          <div className="space-y-1 mb-4">
            {product.PrecoPromocional > 0 ? (
              <>
                <p className="text-sm text-gray-500 line-through">
                  De: R$ {product.Preco.toFixed(2)}
                </p>
                <p className="text-xl font-bold text-red-600">
                  Por: R$ {product.PrecoPromocional.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-primary">
                R$ {product.Preco.toFixed(2)}
              </p>
            )}
          </div>

          {viewMode === 'list' && product.DescEcommerce && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {product.DescEcommerce}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <BuildingStorefrontIcon className="w-4 h-4" />
              {product.Marca}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <CubeIcon className="w-4 h-4" />
              {product.Categoria}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={(e) => handleAddToCart(e, product)}
          className={`
            w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 
            transition-all duration-300 transform hover:scale-[1.02]
            ${product.PrecoPromocional > 0
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-primary hover:bg-primary-dark text-white"
            }
          `}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        {/* Banner Principal Melhorado */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-4 justify-center">
                <SparklesIcon className="w-12 h-12 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold">Lançamentos</h1>
              </div>
              <p className="text-lg text-gray-100 max-w-2xl">
                Descubra as últimas novidades em nosso catálogo. Produtos recém-chegados e exclusivos para você.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <TagIcon className="w-5 h-5" />
                  <span className="text-sm">Produtos Exclusivos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <FireIcon className="w-5 h-5" />
                  <span className="text-sm">Novidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros Laterais */}
            <div className="w-full lg:w-64 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <FunnelIcon className="w-5 h-5 text-primary" />
                    Filtros
                  </h3>
                </div>

                {/* Marcas */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Marcas</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 hover:bg-primary/5 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => {
                            setSelectedBrands(prev =>
                              prev.includes(brand)
                                ? prev.filter(b => b !== brand)
                                : [...prev, brand]
                            );
                          }}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categorias */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Categorias</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2 hover:bg-primary/5 p-2 rounded-lg transition-colors">
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
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
              {/* Controles de Visualização */}
              <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
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
                    <span className="text-sm text-gray-600 font-medium">
                      {filteredAndSortedProducts.length} produtos encontrados
                    </span>
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                    className="p-2 border rounded-lg text-sm bg-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="relevancia">Mais Relevantes</option>
                    <option value="menor">Menor Preço</option>
                    <option value="maior">Maior Preço</option>
                    <option value="nome">Nome</option>
                  </select>
                </div>
              </div>

              {/* Grid de Produtos */}
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.Produto} {...product} />
                ))}
              </div>

              {/* Estado Vazio */}
              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="mb-4">
                    <CubeIcon className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    Nenhum produto encontrado com os filtros selecionados
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                    }}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
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