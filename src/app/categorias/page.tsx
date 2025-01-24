'use client'

import Link from "next/link";
import { Header } from "@/components/Header";
import { useCategorie } from "@/hooks/useCategorie";
import { useState } from "react";
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategorie();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.Descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Organiza as categorias por letra inicial
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const firstLetter = category.Descricao.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

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
          Erro ao carregar as categorias
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
            <span className="text-gray-900">Categorias</span>
          </div>
        </div>

        {/* Título e Busca */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
                <p className="text-gray-600 mt-2">
                  Explore nossa variedade de produtos por categoria
                </p>
              </div>
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar categoria..."
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

        {/* Lista de Categorias */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedCategories).map(([letter, letterCategories]) => (
              <div key={letter} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 pb-2 border-b flex items-center gap-2">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {letter}
                  </span>
                </h2>
                <div className="space-y-2">
                  {letterCategories.map((category) => (
                    <Link
                      key={category.Codigo}
                      href={`/categoria/${encodeURIComponent(category.Codigo)}`}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group"
                    >
                      <TagIcon className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                      <span className="group-hover:text-primary">{category.Descricao}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma categoria encontrada com "{searchTerm}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
