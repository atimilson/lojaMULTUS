'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'

type Product = {
  id: number
  name: string
  brand: string
  price: number
  oldPrice?: number
  image: string
}

type ProductCarouselProps = {
  title: string
  products: Product[]
  viewAllLink: string
}

export function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <a href={viewAllLink} className="text-primary hover:text-primary-dark">Ver todos</a>
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={5}
          navigation
          className="product-carousel"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 8 },
            640: { slidesPerView: 3, spaceBetween: 12 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={`/produto/${product.id}`}>
                <div className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Badge de desconto */}
                  {product.oldPrice && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                  
                  {/* Informações do produto */}
                  <div className="p-4">
                    {/* Marca */}
                    <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
                    
                    {/* Nome do produto */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Preços */}
                    <div className="space-y-1 mb-3">
                      {product.oldPrice && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500 line-through">
                            R$ {product.oldPrice.toFixed(2)}
                          </p>
                          <span className="text-xs text-red-500 font-medium">
                            Economia de R$ {(product.oldPrice - product.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          R$ {Math.floor(product.price)}
                          <span className="text-lg">,{((product.price % 1) * 100).toFixed(0)}</span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        em até 10x de R$ {(product.price / 10).toFixed(2)} sem juros
                      </p>
                    </div>

                    {/* Botão de compra */}
                    <button className="w-full bg-primary text-white py-2 rounded-full font-medium hover:bg-primary-dark transition-colors">
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
} 