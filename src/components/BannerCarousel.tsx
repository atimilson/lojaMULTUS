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
    <section className="bg-gray-100 w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="w-full relative"
        style={{
          // Altura responsiva usando aspect ratio
          aspectRatio: '32/9', // Para desktop
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative w-full h-full">
            <div className="absolute inset-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
} 