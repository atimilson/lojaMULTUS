'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Banner = {
  id: number
  title: string
  subtitle: string
  buttonText: string
  image: string
}

type BannerCarouselProps = {
  banners: Banner[]
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <section className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-lg overflow-hidden h-[400px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
                  <div className="text-white ml-12 max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
                    <p className="text-xl mb-8 text-gray-100">{banner.subtitle}</p>
                    <button className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-full text-lg font-semibold transition-colors">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
} 