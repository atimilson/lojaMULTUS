'use client'

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from "@/contexts/CartContext";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

export function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const { addItem } = useCart();

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.preventDefault(); // Previne a navegação para a página do produto
    addItem(product, 1);
    // Opcional: Adicionar feedback visual
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-1 px-3 py-1 text-md font-medium text-primary hover:text-white bg-transparent hover:bg-primary border border-primary rounded-full transition-all duration-200 group"
          >
            Ver todos
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.Produto}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 relative group"
            >
              <Link href={`/produto/${product.Produto}`}>
                <div className="relative h-48 mb-4">
                  <Image
                    src={product.Imagens[0]?.URL || '/placeholder-product.jpg'}
                    alt={product.Descricao}
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">{product.Marca}</p>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.Descricao}
                  </h3>

                  <div className="space-y-1">
                    {product.PrecoPromocional > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        R$ {product.Preco.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-primary">
                      R$ {(product.PrecoPromocional || product.Preco).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Botão Adicionar ao Carrinho */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 