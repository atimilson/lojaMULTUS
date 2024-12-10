import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/mocks/products";
import { 
  ShoppingCartIcon, 
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Header } from "@/components/Header";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const product = featuredProducts.find(p => p.id === parseInt(params.id));

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <main className="flex-1 bg-gray-50">
        <Header />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href={`/categoria/${product.category.toLowerCase()}`} className="hover:text-primary">{product.category}</Link></li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Conteúdo do Produto */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna da Esquerda - Imagens */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              {/* Miniaturas (se houver mais imagens) */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <button key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Coluna da Direita - Informações */}
            <div className="space-y-6">
              {/* Nome e Marca */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-600 mt-1">Marca: <span className="font-medium">{product.brand}</span></p>
                <p className="text-gray-600">Código: {product.id.toString().padStart(6, '0')}</p>
              </div>

              {/* Preços */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {product.oldPrice && (
                  <p className="text-gray-500 line-through">
                    De: R$ {product.oldPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Em até 10x de R$ {(product.price / 10).toFixed(2)} sem juros
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  À vista R$ {(product.price * 0.9).toFixed(2)} (10% de desconto)
                </p>
              </div>

              {/* Quantidade e Botões */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600">Quantidade:</label>
                  <div className="flex items-center border rounded-lg">
                    <button className="px-3 py-2 border-r hover:bg-gray-50">-</button>
                    <input 
                      type="number" 
                      value="1" 
                      className="w-16 text-center py-2 focus:outline-none" 
                    />
                    <button className="px-3 py-2 border-l hover:bg-gray-50">+</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCartIcon className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Benefícios */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-gray-600">Frete Grátis</p>
                      <p className="text-sm text-gray-600">Para compras acima de R$ 299</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-gray-600">Garantia de 12 meses</p>
                      <p className="text-sm text-gray-600">Direto com o fabricante</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-gray-600">Pagamento Facilitado</p>
                      <p className="text-sm text-gray-600">Até 10x sem juros no cartão</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição do Produto */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Descrição do Produto</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="prose max-w-none">
              <p className="text-gray-600">
                {product.description || 'Descrição detalhada do produto em breve.'}
              </p>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produtos Relacionados</h2>
            <Link 
              href={`/categoria/${product.category.toLowerCase()}`} 
              className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
            >
              Ver Todos
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((relatedProduct) => (
              <Link href={`/produto/${relatedProduct.id}`} key={relatedProduct.id}>
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="relative aspect-square mb-3">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {relatedProduct.name}
                  </h3>
                  {relatedProduct.oldPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      R$ {relatedProduct.oldPrice.toFixed(2)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">
                    R$ {relatedProduct.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Em até 10x de R$ {(relatedProduct.price / 10).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 