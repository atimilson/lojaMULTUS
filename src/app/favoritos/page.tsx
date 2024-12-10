import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/mocks/products";
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  ShareIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Header } from "@/components/Header";

export default function FavoritosPage() {
  return (
    <div className="flex-1 bg-gray-50">
        <Header />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Meus Favoritos</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos</h1>
            <p className="text-gray-600 mt-1">12 produtos salvos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <ShareIcon className="w-5 h-5" />
              <span>Compartilhar Lista</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <BellIcon className="w-5 h-5" />
              <span>Ativar Alertas</span>
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <button className="flex items-center gap-1 text-sm text-gray-900 hover:text-primary">
                  Mais Recentes
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="text-sm text-red-500 hover:text-red-600">
              Limpar Lista
            </button>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative p-4">
                {/* Botão Remover */}
                <button className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>

                {/* Imagem */}
                <Link href={`/produto/${product.id}`}>
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Informações */}
                <div className="space-y-2">
                  <Link href={`/produto/${product.id}`}>
                    <h3 className="text-gray-900 font-medium line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>

                  <div>
                    {product.oldPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        R$ {product.oldPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      em até 10x de R$ {(product.price / 10).toFixed(2)}
                    </p>
                  </div>

                  {/* Alert */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 