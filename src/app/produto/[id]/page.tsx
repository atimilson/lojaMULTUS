"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/product";
import {
  ShoppingCartIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        // Busca o produto específico
        const [productData] = await fetchApi(
          `/produto/ecommerce?empresa=1&busca=${params.id}`
        );
        console.log(productData)
        setProduct(productData);

        // Busca produtos relacionados (usando a lista completa)
        const allProducts = await fetchApi(
          "/produto/ecommerce?empresa=1&destaque=S"
        );
        setRelatedProducts(allProducts.slice(0, 4)); // Pegando os 4 primeiros produtos como relacionados
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
      loadProduct();
    }
  }, [params.id, isAuthLoading, authError]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product,
    quantity: number
  ) => {
    e.preventDefault();
    addItem(product, quantity);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.Descricao}
          </p>
          <p className="text-sm text-gray-500">Quantidade: {quantity}</p>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 bg-gray-50">
      <Header />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/categoria/${product.Categoria.toLowerCase()}`}
                  className="hover:text-primary"
                >
                  {product.Categoria}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">{product.Descricao}</li>
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
                  src={product.Imagens[0]?.URL || "/placeholder-product.jpg"}
                  alt={product.Descricao}
                  fill
                  className="object-contain p-4"
                />
              </div>
              {/* Miniaturas */}
              <div className="grid grid-cols-4 gap-2">
                {product.Imagens.map((img, index) => (
                  <button
                    key={index}
                    className="relative aspect-square border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img.URL}
                      alt={`${product.Descricao} - Imagem ${index + 1}`}
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.Descricao}
                </h1>
                <p className="text-gray-600 mt-1">
                  Marca: <span className="font-medium">{product.Marca}</span>
                </p>
                <p className="text-gray-600">
                  Código: {product.Produto.toString().padStart(6, "0")}
                </p>
              </div>

              {/* Preços */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {product.PrecoPromocional > 0 && (
                  <p className="text-gray-500 line-through">
                    De: R$ {product.Preco.toFixed(2)}
                  </p>
                )}
                <p className="text-3xl font-bold text-primary">
                  R$ {(product.PrecoPromocional || product.Preco).toFixed(2)}
                </p>
                {/* <p className="text-sm text-gray-600 mt-1">
                  Em até 10x de R$ {((product.PrecoPromocional || product.Preco) / 10).toFixed(2)} sem juros
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  À vista R$ {((product.PrecoPromocional || product.Preco) * 0.9).toFixed(2)} (10% de desconto)
                </p> */}
              </div>

              {/* Calculadora de Frete */}
              <ShippingCalculator productId={product.Produto} />

              {/* Quantidade e Botões */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600">Quantidade:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      className="px-3 py-2 border-r hover:bg-gray-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center py-2 focus:outline-none"
                    />
                    <button
                      className="px-3 py-2 border-l hover:bg-gray-50"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={(e) => handleAddToCart(e, product, quantity)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
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
                      <p className="font-medium text-gray-600">
                        Frete para todo Brasil
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-gray-600">
                        Compra Garantida
                      </p>
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
            <h2 className="text-2xl font-bold text-gray-900">
              Descrição do Produto
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="prose max-w-none">
              <p className="text-gray-600">
                {product.DescEcommerce ||
                  product.Observacao ||
                  "Descrição detalhada do produto em breve."}
              </p>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Produtos Relacionados
            </h2>
            <Link
              href={`/produtos`}
              className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
            >
              Ver Todos
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/produto/${relatedProduct.Produto}`}
                key={relatedProduct.Produto}
              >
                <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="relative aspect-square mb-3">
                    <Image
                      src={
                        relatedProduct.Imagens[0]?.URL ||
                        "/placeholder-product.jpg"
                      }
                      alt={relatedProduct.Descricao}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {relatedProduct.Descricao}
                  </h3>
                  {relatedProduct.PrecoPromocional > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      R$ {relatedProduct.Preco.toFixed(2)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">
                    R${" "}
                    {(
                      relatedProduct.PrecoPromocional || relatedProduct.Preco
                    ).toFixed(2)}
                  </p>
                  
                {/* Botão Adicionar ao Carrinho */}
                  <button
                    onClick={(e) => handleAddToCart(e, relatedProduct, 1)}
                    className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                  ${
                    product.PrecoPromocional > 0
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-primary hover:bg-primary-dark text-white"
                  }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
