import Image from "next/image";
import Link from "next/link";
import { featuredProducts, categories } from "@/mocks/products";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Header } from "@/components/Header";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find(c => c.name.toLowerCase().replace(/ /g, '-') === params.slug);

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
              <li className="text-gray-900 font-medium">{category?.name || 'Categoria'}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros Laterais */}
          <aside className="w-full md:w-64 space-y-6">
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

            {/* Preço */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Preço</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-700">Até R$ 100</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-700">R$ 100 a R$ 300</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-700">R$ 300 a R$ 500</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <span className="text-gray-700">Acima de R$ 500</span>
                </label>
              </div>
            </div>

            {/* Marcas */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Marcas</h3>
              <div className="space-y-2">
                {['BOSCH', 'DEWALT', 'MAKITA', 'STANLEY'].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Avaliação */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Avaliação</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-600">ou mais</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Lista de Produtos */}
          <div className="flex-1">
            {/* Cabeçalho da Lista */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    {featuredProducts.length} produtos encontrados
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <Squares2X2Icon className="w-6 h-6 text-gray-700" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <ListBulletIcon className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Ordenar por:</span>
                  <select className="text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                    <option>Mais Relevantes</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                    <option>Melhor Avaliados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <Link href={`/produto/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          R$ {product.oldPrice.toFixed(2)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        Em até 10x de R$ {(product.price / 10).toFixed(2)}
                      </p>
                      {product.oldPrice && (
                        <span className="inline-block mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Anterior</button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
                <span className="px-4 py-2">...</span>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">10</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Próxima</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 