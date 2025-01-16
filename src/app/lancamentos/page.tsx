'use client';

import { useState, useMemo } from 'react';
import { useNewProducts } from '@/hooks/useNewProducts';
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function formatDate(dateStr: string): string {
  try {
    const [datePart] = dateStr.split(' ');
    return datePart;
  } catch (err) {
    console.error('Erro ao formatar data:', dateStr);
    return dateStr;
  }
}

export default function LancamentosPage() {
  const { products, isLoading, error } = useNewProducts();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<number>(30);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('mais_recentes');

  // Extrair categorias únicas e remover undefined
  const categories = useMemo(() => {
    if (!products.length) return [];
    return Array.from(new Set(
      products
        .map(p => p.DescCategoria)
        .filter((category): category is string => Boolean(category))
    ));
  }, [products]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - dateFilter);

    let filtered = products.filter(product => {
      const alteracaoDate = new Date(product.Alteracao);
      return alteracaoDate >= dateLimit;
    });

    // Aplicar filtros de categoria
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        p.DescCategoria && selectedCategories.includes(p.DescCategoria)
      );
    }

    // Ordenação
    switch (sortOrder) {
      case 'mais_recentes':
        filtered.sort((a, b) => 
          new Date(b.Alteracao).getTime() - new Date(a.Alteracao).getTime()
        );
        break;
      case 'menor_preco':
        filtered.sort((a, b) => (a.Preco || 0) - (b.Preco || 0));
        break;
      case 'maior_preco':
        filtered.sort((a, b) => (b.Preco || 0) - (a.Preco || 0));
        break;
    }

    return filtered;
  }, [products, selectedCategories, dateFilter, sortOrder]);

  // Renderizar categorias
  const renderCategories = () => {
    return categories.map((category) => (
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
    ));
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Banner Lançamentos */}
        <div className="bg-gradient-to-r from-primary to-primary-dark">
          <div className="container mx-auto px-4 py-8 text-white">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Lançamentos</h1>
            </div>
            <p className="mt-2 text-gray-100">
              Descubra as novidades 
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <div className="w-full lg:w-64 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-4 text-gray-700" >Filtrar por</h3>
                
                {/* Data de Lançamento */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700">Data de Lançamento</h4>
                  <div className="space-y-2">
                    {[30, 60, 90, 360].map((days) => (
                      <label key={days} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="release"
                          checked={dateFilter === days}
                          onChange={() => setDateFilter(days)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          Últimos {days} dias
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categorias */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700">Categorias</h4>
                  <div className="space-y-2">
                    {renderCategories()}
                  </div>
                </div>

                {/*
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700">Marcas</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">DEWALT</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">BOSCH</span>
                    </label>
                   
                  </div>
                </div> */}
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
              {/* Controles de visualização */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500">
                    Mostrando {filteredProducts.length} produtos
                  </span>
                </div>
                <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-700">
                  <option>Mais Recentes</option>
                  <option>Maior Preço</option>
                  <option>Menor Preço</option>
                  <option>Mais Vendidos</option>
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
                        <p className="text-sm text-gray-600 mb-1">{product.Marca}</p>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.Descricao}
                        </h3>
                        
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-primary">
                            R$ {(product.Preco || 0).toFixed(2)}
                          </p>
                        </div>

                        {viewMode === 'list' && product.DescEcommerce && (
                          <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                            {product.DescEcommerce}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                          Lançado em: {formatDate(product.Alteracao)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Anterior</button>
                  <button className="px-4 py-2 bg-primary rounded-lg text-gray-700">1</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">2</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 ">3</button>
                  <span className="px-4 py-2 text-gray-700">...</span>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">10</button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Próxima</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 