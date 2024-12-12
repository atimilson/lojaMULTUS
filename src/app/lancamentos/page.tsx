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
import { Metadata } from 'next';

// Metadata
export const metadata: Metadata = {
  title: 'Lançamentos | Multus Comercial',
  description: 'Confira os novos produtos da Multus Comercial'
};

// Mock de produtos lançamentos
const newProducts = [
  {
    id: 1,
    name: "Serra Circular de Bancada 10\" 2000W",
    brand: "DEWALT",
    price: 3599.90,
    image: "https://images.tcdn.com.br/img/img_prod/1066586/serra_circular_bancada_10_2000w_dwe7470_dewalt_8909_1_20201214152616.jpg",
    rating: 5,
    reviews: 12,
    isNew: true,
    releaseDate: "2024-03-01",
    category: "Ferramentas Elétricas",
    features: ["Motor 2000W", "Precisão profissional", "Sistema de segurança"]
  },
  {
    id: 2,
    name: "Kit Ferramentas a Bateria 18V",
    brand: "BOSCH",
    price: 2899.90,
    image: "https://images.tcdn.com.br/img/img_prod/1066586/kit_ferramentas_bateria_18v_bosch_8901_1_20201214152616.jpg",
    rating: 4,
    reviews: 8,
    isNew: true,
    releaseDate: "2024-02-15",
    category: "Kits Profissionais",
    features: ["Bateria 18V", "5 ferramentas", "Maleta premium"]
  },
  // Adicione mais produtos aqui
];

export default function LancamentosPage() {
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
              Descubra as novidades em ferramentas e equipamentos profissionais
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
                    <label className="flex items-center gap-2">
                      <input type="radio" name="release" className="text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Últimos 30 dias</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="release" className="text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Últimos 60 dias</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="release" className="text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Últimos 90 dias</span>
                    </label>
                  </div>
                </div>

                {/* Categorias */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Categorias</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Ferramentas Elétricas</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm  text-gray-700">Kits Profissionais</span>
                    </label>
                    {/* Adicione mais categorias */}
                  </div>
                </div>

                {/* Marcas */}
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
                    {/* Adicione mais marcas */}
                  </div>
                </div>
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
                    Mostrando {newProducts.length} produtos
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="relative p-4">
                      {/* Badge de Lançamento */}
                      <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                        NOVO
                      </span>
                      
                      <div className="relative h-48 mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        {/* Features do produto */}
                        <ul className="text-xs text-gray-500 mb-4 space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-primary rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < product.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-600">
                            ({product.reviews})
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xl font-bold text-primary">
                            R$ {product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Em até 10x de R$ {(product.price / 10).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Anterior</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-gray-700">1</button>
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