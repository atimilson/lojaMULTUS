import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/mocks/products";
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  TagIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Header } from "@/components/Header";

export default function CartPage() {
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
              <li className="text-gray-900 font-medium">Carrinho</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de Produtos */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Meu Carrinho (3 itens)</h1>

            {/* Produtos */}
            <div className="bg-white rounded-lg shadow-sm">
              {featuredProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="p-6 flex gap-6 border-b border-gray-100 last:border-0">
                  <div className="relative w-24 h-24">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <Link href={`/produto/${product.id}`} className="text-gray-900 font-medium hover:text-primary line-clamp-2">
                        {product.name}
                      </Link>
                      <button className="text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      Vendido e entregue por <span className="font-medium ml-1">Multus Comercial</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <MinusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value="1"
                          className="w-12 text-center border border-gray-300 rounded-md"
                        />
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right">
                        {product.oldPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.oldPrice.toFixed(2)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cupom e Frete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cupom de Desconto */}
              <div className=" p-6">
              {/* <div className="bg-white rounded-lg shadow-sm p-6"> */}
                {/* <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-medium text-gray-900">Cupom de Desconto</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Aplicar
                  </button>
                </div> */}
              </div>

              {/* Cálculo de Frete */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-medium text-gray-900">Calcular Frete</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (3 itens)</span>
                  <span className="text-gray-900">R$ 1.499,97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">R$ 0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-green-600">- R$ 0,00</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">R$ 1.499,97</p>
                      <p className="text-sm text-gray-600">em até 10x de R$ 149,99</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                Finalizar Compra
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              {/* Garantias */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-primary" />
                  <span>Compra 100% Segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.slice(0, 5).map((product) => (
              <Link href={`/produto/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-sm text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 