'use client'

import Link from "next/link";
import { Header } from "@/components/Header";
import { useBrands } from "@/hooks/useBrands";
import { useState } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function BrandsPage() {
  const { brands, isLoading, error } = useBrands();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.Descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Organiza as marcas por letra inicial
  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand.Descricao.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, typeof brands>);

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
        <div className="flex-1 flex items-center justify-center text-red-500">
          Erro ao carregar as marcas
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Marcas</span>
          </div>
        </div>

        {/* Título e Busca */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nossas Marcas</h1>
                <p className="text-gray-600 mt-2">
                  Encontre produtos das melhores marcas do mercado
                </p>
              </div>
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Marcas */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
              <div key={letter} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 pb-2 border-b">
                  {letter}
                </h2>
                <div className="space-y-2">
                  {letterBrands.map((brand) => (
                    <Link
                      key={brand.Codigo}
                      href={`/marca/${encodeURIComponent(brand.Descricao.toLowerCase())}`}
                      className="block py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      {brand.Descricao}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma marca encontrada com "{searchTerm}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 