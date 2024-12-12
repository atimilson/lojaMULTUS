import Image from "next/image";
import Link from "next/link";
import { categories } from "@/mocks/products";
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

export function Header() {
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

            {/* Barra de busca com categorias */}
            <div className="flex-1 max-w-3xl">
              <div className="flex">
                <div className="relative">
                  <select className="h-full py-2 px-4 bg-gray-50 border-y border-l border-gray-300 rounded-l-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Todas as Categorias</option>
                    <option value="ferramentas">Ferramentas</option>
                    <option value="eletricos">Materiais Elétricos</option>
                    <option value="hidraulica">Hidráulica</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="search"
                    placeholder="O que você procura?"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-500"
                  />
                </div>
                <button className="px-6 bg-primary hover:bg-primary-dark text-white rounded-r-full transition-colors">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
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

      {/* Linha de navegação - Categorias e Links */}
      <nav className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Menu de categorias com dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 py-4 hover:text-gray-200 transition-colors">
                  <Bars3Icon className="w-6 h-6" />
                  <span className="font-medium">Todas as Categorias</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-lg hidden group-hover:block">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categoria/${category.name.toLowerCase().replace(/ /g, '-')}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={24}
                          height={24}
                        />
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
              <div className="group relative">
                    <a href="/marcas" className="flex items-center gap-2 py-4 hover:text-gray-200">
                      <span className="font-medium">Marcas</span>
                      <span className="text-xs">▼</span>
                    </a>
                    {/* Dropdown de marcas */}
                    <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block">
                      <div className="py-2">
                        <a href="/marca/dewalt" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary">DEWALT</a>
                        <a href="/marca/bosch" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary">BOSCH</a>
                        <a href="/marca/makita" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary">MAKITA</a>
                        <a href="/marca/tramontina" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary">TRAMONTINA</a>
                        <div className="border-t border-gray-100 my-1"></div>
                        <a href="/marcas" className="block px-4 py-2 text-primary hover:bg-gray-50">Ver todas as marcas →</a>
                      </div>
                    </div>
                  </div>
                  <a href="/promocoes" className="flex items-center gap-2 py-4 hover:text-gray-200">
                    <span className="font-medium">Promoções</span>
                  </a>
                  <a href="/lancamentos" className="group flex items-center gap-2 py-4 hover:text-gray-200">
                    <span className="font-medium">Lançamentos</span>
                  </a>
                  
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