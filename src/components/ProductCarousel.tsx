'use client'

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ArrowRightIcon, ShoppingCartIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { ProdutosEcommerceDto, ProdutosEmPromocaoEcommerceDto } from "@/api/generated/mCNSistemas.schemas";

interface ProductCarouselProps {
  title: string;
  products: (ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto)[];
  viewAllLink: string;
  isPromotion?: boolean;
}

export function ProductCarousel({ title, products, viewAllLink, isPromotion }: ProductCarouselProps) {
  const { addItem } = useCart();

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProdutosEcommerceDto
  ) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || '/placeholder.jpg'}

            alt={product.Descricao || ''}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">{product.Descricao}</p>
          <p className="text-sm text-gray-500">Quantidade: {1}</p>
        </div>
      </div>
    );
  };

  const isEcommerceProduct = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto): product is ProdutosEcommerceDto => {
    return 'Preco' in product;
  };

  const getOriginalPrice = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto) => {
    return isEcommerceProduct(product) ? product.Preco : product.PrecoNormal;
  };

  const calculateDiscount = (product: ProdutosEcommerceDto | ProdutosEmPromocaoEcommerceDto) => {
    const originalPrice = getOriginalPrice(product);
    if (!originalPrice || !product.PrecoPromocional || originalPrice <= product.PrecoPromocional) return 0;
    return Math.round(((originalPrice - product.PrecoPromocional) / originalPrice) * 100);
  };


  return (
    <section className={`py-8 ${isPromotion ? 'bg-red-50' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          {isPromotion && <TagIcon className="w-8 h-8 text-red-500" />}
          <h2 className={`text-2xl font-bold ${isPromotion ? 'text-red-600' : ''}`}>{title}</h2>
          <Link
            href={viewAllLink}
            className={`inline-flex items-center gap-1 px-3 py-1 text-md font-medium 
              ${isPromotion 
                ? 'text-red-600 hover:text-white bg-transparent hover:bg-red-600 border border-red-600' 
                : 'text-primary hover:text-white bg-transparent hover:bg-primary border border-primary'} 
              rounded-full transition-all duration-200 group`}
          >
            Ver todos
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.Produto}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 relative group
                ${  product.PrecoPromocional > 0 ? 'border-2 border-red-200' : ''}`}
            >
              {/* Badge de desconto */}
              {
                  product.PrecoPromocional > 0 &&  (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold z-10">
                  -{calculateDiscount(product)}%
                </div>
              )}

              <Link href={`/produto/${product.Produto}`}>
                <div className="relative h-48 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={product?.Imagens?.[0]?.URL || '/placeholder-product.jpg'}
                    alt={product.Descricao || ''}
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">{product.Marca}</p>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.Descricao}
                  </h3>

                  <div className="space-y-1">
                    {  product.PrecoPromocional > 0 && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 line-through">
                          R$ {getOriginalPrice(product)?.toFixed(2) || '0.00'}
                        </p>
                        <span className="text-xs text-red-500 font-medium">
                          Economize R$ {(getOriginalPrice(product) || 0 - product.PrecoPromocional || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <p className={`text-xl font-bold ${  product.PrecoPromocional > 0 ? 'text-red-600' : 'text-primary'}`}>
                      R$ {(product.PrecoPromocional || getOriginalPrice(product) || 0).toFixed(2)}

                    </p>
                  </div>
                </div>
              </Link>

              {/* Botão Adicionar ao Carrinho */}
              <button
                onClick={(e) => handleAddToCart(e, product as ProdutosEcommerceDto)}
                className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                  ${  product.PrecoPromocional > 0 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-primary hover:bg-primary-dark text-white'}`}
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