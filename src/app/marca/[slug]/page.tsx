import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';

// Mock de marcas
const brands = [
  {
    id: 1,
    name: "DEWALT",
    slug: "dewalt",
    logo: "https://logodownload.org/wp-content/uploads/2014/07/dewalt-logo-0.png",
    description: "Líder mundial em ferramentas elétricas profissionais e acessórios industriais."
  },
  {
    id: 2,
    name: "BOSCH",
    slug: "bosch",
    logo: "https://logodownload.org/wp-content/uploads/2014/04/bosch-logo-0.png",
    description: "Inovação para a vida com tecnologia de ponta em ferramentas profissionais."
  },
  {
    id: 3,
    name: "MAKITA",
    slug: "makita",
    logo: "https://logodownload.org/wp-content/uploads/2014/09/makita-logo-0.png",
    description: "Qualidade japonesa em ferramentas elétricas e equipamentos profissionais."
  },
  {
    id: 4,
    name: "TRAMONTINA",
    slug: "tramontina",
    logo: "https://logodownload.org/wp-content/uploads/2017/04/tramontina-logo-0.png",
    description: "Tradição brasileira em ferramentas e utensílios de alta qualidade."
  }
];

// Mock de produtos por marca
const brandProducts = [
  {
    id: 1,
    name: "Furadeira de Impacto 1/2\" 20V MAX XR",
    brand: "DEWALT",
    price: 1299.90,
    oldPrice: 1499.90,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format",
    rating: 5,
    reviews: 127,
    inStock: true
  },
  {
    id: 2,
    name: "Serra Circular 7-1/4\" 1800W",
    brand: "DEWALT",
    price: 899.90,
    oldPrice: 999.90,
    image: "https://images.unsplash.com/photo-1588783952556-a3772b26a2a3?w=500&auto=format",
    rating: 4,
    reviews: 89,
    inStock: true
  },
  {
    id: 3,
    name: "Martelete Perfurador Rompedor 800W",
    brand: "BOSCH",
    price: 799.90,
    oldPrice: 899.90,
    image: "https://images.tcdn.com.br/img/img_prod/1066586/martelete_perfurador_rompedor_800w_gbh_2_24_d_bosch_8901_1_20201214152616.jpg",
    rating: 5,
    reviews: 156,
    inStock: true
  },
  {
    id: 4,
    name: "Parafusadeira/Furadeira de Impacto 18V",
    brand: "MAKITA",
    price: 1099.90,
    oldPrice: 1299.90,
    image: "https://images.tcdn.com.br/img/img_prod/1066586/parafusadeira_furadeira_de_impacto_18v_dhp482rfe_makita_8901_1_20201214152616.jpg",
    rating: 4,
    reviews: 98,
    inStock: true
  },
  {
    id: 5,
    name: "Jogo de Chaves Combinadas 8 a 22mm",
    brand: "TRAMONTINA",
    price: 199.90,
    oldPrice: 249.90,
    image: "https://images.tcdn.com.br/img/img_prod/1066586/jogo_de_chaves_combinadas_8_a_22mm_12_pecas_tramontina_pro_8901_1_20201214152616.jpg",
    rating: 5,
    reviews: 234,
    inStock: true
  }
];

// Metadata dinâmica
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const brand = brands.find(b => b.slug === params.slug);
  
  return {
    title: brand ? `${brand.name} | Multus Comercial` : 'Marca | Multus Comercial',
    description: brand?.description || 'Encontre os melhores produtos na Multus Comercial'
  }
}

// Página da marca
export default function BrandPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const brand = brands.find(b => b.slug === params.slug);
  const products = brandProducts.filter(p => p.brand.toLowerCase() === params.slug);

  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/marcas" className="hover:text-primary">Marcas</Link>
          <span>/</span>
          <span className="text-gray-900">{brand?.name}</span>
        </div>
      </div>

      {/* Cabeçalho da marca */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <Image 
              src={brand?.logo || ''} 
              alt={brand?.name || ''} 
              width={200} 
              height={80}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{brand?.name}</h1>
              <p className="text-gray-700 mt-2 text-base">{brand?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filtros */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center text-gray-700 gap-2">
                  <FunnelIcon className="w-5 h-5" />
                  Filtros
                </h3>
                <button className="text-sm text-primary hover:text-primary-dark">
                  Limpar
                </button>
              </div>

              {/* Categorias */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-gray-700">Categorias</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Ferramentas Elétricas</span>
                  </label>
                  {/* ... mais categorias */}
                </div>
              </div>

              {/* Preço */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-gray-700">Faixa de Preço</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Até R$ 100</span>
                  </label>
                  {/* ... mais faixas de preço */}
                </div>
              </div>

              {/* Avaliação */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-gray-700">Avaliação</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </label>
                  {/* ... mais opções de avaliação */}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1">
            {/* Cabeçalho da lista */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-medium">{products.length}</span> produtos encontrados
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar por:</span>
                    <select className="text-sm border rounded-lg px-2 py-1">
                      <option>Mais Relevantes</option>
                      <option>Menor Preço</option>
                      <option>Maior Preço</option>
                      <option>Mais Vendidos</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id}
                  href={`/produto/${product.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
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
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Anterior</button>
                <button className="px-4 py-2 bg-primary rounded-lg text-gray-700">1</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">2</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">3</button>
                <span className="px-4 py-2 text-gray-700">...</span>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">10</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Próxima</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Geração de rotas estáticas
export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
} 