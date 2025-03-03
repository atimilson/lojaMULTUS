'use client'

import Image from "next/image";
import Link from "next/link";
import { useBrands } from "@/hooks/useBrands";
import { useSearch } from "@/hooks/useSearch";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  Bars3Icon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  TagIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { useDebounce } from "@/hooks/useDebounce";
import { useCart } from "@/contexts/CartContext";
import { useCategorie } from '@/hooks/useCategorie';
import { useGetApiEmpresa } from '@/api/generated/mCNSistemas';
import type { EmpresaDto as Empresa } from '@/api/generated/mCNSistemas.schemas';
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { isLoading: isAuthLoading, error: authError, token, isAuthenticated, authenticate } = useAuth();
  const router = useRouter();
  const { brands, isLoading: isBrandsLoading } = useBrands();
  const { itemsCount } = useCart();
  const [searchBrand, setSearchBrand] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchResults, isLoading: isSearchLoading, searchProducts } = useSearch();
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categories, isLoading: isCategoriesLoading } = useCategorie();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);

  // const { data: empresa = [] } = useGetApiEmpresa({
  //   empresa: 1
  // }, {
  //   swr: {
  //     enabled: !isAuthLoading && !authError
  //   }
  // });

  useEffect(() => {
    if (token === null && !isAuthenticated) {
      authenticate();
    }
  }, [token, isAuthenticated]);

  const filteredBrands = brands.filter(brand => 
    brand.Descricao?.toLowerCase().includes(searchBrand.toLowerCase()) || false
  );

  // Organiza as marcas por letra inicial
  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand.Descricao?.charAt(0).toUpperCase() || '';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;

  }, {} as Record<string, typeof brands>);

  // Filtrar categorias baseado na busca
  const filteredCategories = categories.filter(category =>
    category.Descricao?.toLowerCase().includes(searchCategory.toLowerCase()) || false
  );

  // Agrupar categorias por letra inicial (ordem alfabética)
  const groupedCategories = useMemo(() => {
    return filteredCategories.reduce((acc, category) => {
      const firstLetter = category.Descricao?.charAt(0).toUpperCase() || '';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(category);
      return acc;
    }, {} as Record<string, typeof categories>);
  }, [filteredCategories]);

  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [searchProducts]);

  // Fechar resultados ao clicar for

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Fechar dropdown ao pressionar Esc
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isDropdownOpen]);

  // Fechar dropdown de categorias ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Faixa superior - Informações de entrega/CEP */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Link href="/central-ajuda" className="hover:text-primary">Central de Ajuda</Link>
              <Link href="/acompanhe-pedido" className="hover:text-primary">Acompanhe seu Pedido</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Linha principal - Logo, Busca e Ações */}
      <div className="bg-white shadow-sm max-sm:hidden sm:hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-8 mb-[-5px]">
            {/* Logo */}
            <Link href="/">
              <Image
                src={`/logo.png`}
                alt="Multus Comercial"
                width={200}
                height={50}
                priority
              />
            </Link>

            {/* Barra de busca com dropdown de resultados */}
            <div className="flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="flex">
                  <div className="flex-1 relative">
                    <input 
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="O que você procura?"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-500"
                    />
                    {isSearchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="px-6 bg-primary hover:bg-primary-dark text-white rounded-r-full transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Dropdown de resultados */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.Produto}
                      href={`/produto/${product.Produto}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}
                          alt={product.Descricao || ''}
                          fill
                          className="object-contain"

                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.Descricao}
                        </h4>
                        <p className="text-sm font-bold text-primary mt-1">
                          R$ {product.Preco?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Ações do usuário */}
            <div className="flex items-center gap-6">
              <Link href="/minha-conta" className="flex flex-col items-center">
                <UserIcon className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-700">Minha Conta</span>
              </Link>
              <Link href="/favoritos" className="flex flex-col items-center">
                <HeartIcon className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-700">Favoritos</span>
              </Link>
              <Link href="/carrinho" className="flex flex-col items-center relative">
                <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
                <span className="text-xs text-gray-700">Carrinho</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de navegação - Marcas e Links */}
      <nav className="bg-primary text-white max-sm:hidden sm:hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Menu de Categorias */}
              <div className="relative" ref={categoryDropdownRef}>
                <button 
                  className="flex items-center gap-2 py-4 hover:text-gray-200 transition-colors"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <TagIcon className="w-6 h-6" />
                  <span className="font-medium">Categorias</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {/* Dropdown de Categorias */}
                {isCategoryDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-lg rounded-b-lg flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    {/* Barra de pesquisa fixa no topo */}
                    <div className="sticky top-0 bg-white p-4 border-b z-10">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar categoria..."
                          value={searchCategory}
                          onChange={(e) => setSearchCategory(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Lista de categorias com scroll */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-3 gap-6 p-6">
                        {Object.entries(groupedCategories).map(([letter, letterCategories]) => (
                          letterCategories.length > 0 && (
                            <div key={letter} className="space-y-3">
                              <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                  {letter}
                                </span>
                              </h3>
                              <div className="space-y-1">
                                {letterCategories
                                  .sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0)
                                  .map((category) => (
                                    <Link
                                      key={category.Codigo}
                                      href={`/categoria/${encodeURIComponent(category.Codigo || 0)}`}
                                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors group"
                                      onClick={() => setIsCategoryDropdownOpen(false)}
                                    >

                                      <div className="flex items-center justify-between">
                                        <span className="group-hover:text-primary transition-colors">
                                          {category.Descricao}
                                        </span>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Footer fixo */}
                    <div className="sticky bottom-0 bg-gray-50 p-4 border-t text-center">
                      <Link
                        href="/categorias"
                        className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      >
                        Ver todas as categorias
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu de marcas com dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 py-4 hover:text-gray-200 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Bars3Icon className="w-6 h-6" />
                  <span className="font-medium">Marcas</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {/* Dropdown menu melhorado */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-lg rounded-b-lg flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    {/* Barra de pesquisa fixa no topo */}
                    <div className="sticky top-0 bg-white p-4 border-b z-10">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar marca..."
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
                        />
                        <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Área de scroll */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      {isBrandsLoading ? (
                        <div className="p-4 text-gray-500">Carregando...</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6 p-6">
                          {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
                            <div key={letter} className="space-y-2">
                              <h3 className="font-bold text-primary text-lg">{letter}</h3>
                              <div className="space-y-1">
                                {letterBrands.map((brand) => (
                                  <Link
                                    key={brand.Codigo || ''}
                                    href={`/marca/${encodeURIComponent(brand.Codigo || 0)}`}
                                    className="block px-2 py-1 rounded hover:bg-gray-50 text-gray-700 text-sm"
                                    onClick={() => setIsDropdownOpen(false)}

                                  >
                                    {brand.Descricao}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer do dropdown fixo na parte inferior */}
                    <div className="sticky bottom-0 bg-gray-50 p-4 border-t text-center mt-auto">
                      <Link
                        href="/marcas"
                        className="text-primary hover:text-primary-dark font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Ver todas as marcas →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <Link href="/promocoes" className="flex items-center gap-2 py-4 hover:text-gray-200">
                  <span className="font-medium">Promoções</span>
                </Link>
                <Link href="/lancamentos" className="flex items-center gap-2 py-4 hover:text-gray-200">
                  <span className="font-medium">Lançamentos</span>
                </Link>
              </div>
            </div>

            {/* Links secundários */}
            <div className="flex items-center gap-6">
              <Link href="/venda-na-multus" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <BuildingStorefrontIcon className="w-6 h-6" />
                <span>Venda na Multus</span>
              </Link>
              <Link href="/fale-conosco" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Fale Conosco</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="bg-white md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <Link href="/" className="flex-shrink-0">
            <Image src={`/logoPng.png`} alt="Logo" width={160} height={70} />
          </Link>


          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchMobileOpen(!isSearchMobileOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <Link href="/minha-conta" className="flex flex-col items-center">
                <UserIcon className="w-6 h-6 text-gray-700" />
              </Link>
            <Link href="/carrinho" className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ShoppingCartIcon className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemsCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        {isSearchMobileOpen && (
          <div className="px-4 py-2 border-t">
            <div className="relative">
            <input 
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="O que você procura?"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-500"
                    />
               <button 
                type="submit"
                onClick={(e) => handleSearch(e)}
                className="p-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                <p>Pesquisar</p><MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

        )}
      </div>

      {/* Menu Mobile Lateral */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/minha-conta" 
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/produtos" 
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categorias" 
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categorias
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/marcas" 
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Marcas
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/promocoes" 
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Promoções
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/lancamentos" 
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Lançamentos
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 