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
} from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useDebounce } from "@/hooks/useDebounce";

export function Header() {
  const router = useRouter();
  const { brands, isLoading: isBrandsLoading } = useBrands();
  const [searchBrand, setSearchBrand] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchResults, isLoading: isSearchLoading, searchProducts } = useSearch();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredBrands = brands.filter(brand => 
    brand.Descricao.toLowerCase().includes(searchBrand.toLowerCase())
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

  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, [debouncedSearch, searchProducts]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/">
              <Image
                src="https://www.multuscomercial.com.br/storage/empresas/24753864000142/24753864000142.png"
                alt="Multus Comercial"
                width={140}
                height={40}
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
                          src={product.Imagens[0]?.URL || '/placeholder.jpg'}
                          alt={product.Descricao}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.Descricao}
                        </h4>
                        <p className="text-sm font-bold text-primary mt-1">
                          R$ {product.Preco.toFixed(2)}
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
                <span className="text-xs text-gray-700">Carrinho</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de navegação - Marcas e Links */}
      <nav className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Menu de marcas com dropdown */}
              <div className="relative">
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
                    className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-lg rounded-b-lg"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                  >
                    {/* Barra de pesquisa */}
                    <div className="sticky top-0 bg-white p-4 border-b">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar marca..."
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {isBrandsLoading ? (
                      <div className="p-4 text-gray-500">Carregando...</div>
                    ) : (
                      <div className="grid grid-cols-3 gap-6 p-6 overflow-y-auto">
                        {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
                          <div key={letter} className="space-y-2">
                            <h3 className="font-bold text-primary text-lg">{letter}</h3>
                            <div className="space-y-1">
                              {letterBrands.map((brand) => (
                                <Link
                                  key={brand.Codigo}
                                  href={`/marca/${encodeURIComponent(brand.Codigo)}`}
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

                    {/* Footer do dropdown */}
                    <div className="sticky bottom-0 bg-gray-50 p-4 border-t text-center">
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
    </header>
  );
} 