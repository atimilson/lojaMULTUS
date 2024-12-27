'use client'

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

export function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link
            href={viewAllLink}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.Produto}
              href={`/produto/${product.Produto}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
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
                  <p className="text-xs text-gray-600">
                    Em até 10x de R$ {((product.PrecoPromocional || product.Preco) / 10).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 