'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Banner {
  Tipo: string
  Texto: string
  URL: string
  Link: string
}

export function BannerCarousel() {
  const { fetchApi } = useApi()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await fetchApi('empresa/banner?empresa=1')
        setBanners(data)
      } catch (err) {
        setError('Erro ao carregar banners')
        console.error('Erro ao carregar banners:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBanners()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100" style={{ aspectRatio: '32/9' }}>
        <div className="animate-pulse w-full h-full bg-gray-200" />
      </div>
    )
  }

  if (error || banners.length === 0) {
    return null // Não mostra nada se houver erro ou nenhum banner
  }

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
          aspectRatio: '32/9',
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {banner.Link ? (
              <Link href={banner.Link} className="block w-full h-full">
                <div className="absolute inset-0">
                  <Image
                    src={banner.URL}
                    alt={banner.Texto || `Banner ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
                {banner.Texto && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-lg font-medium">{banner.Texto}</p>
                  </div>
                )}
              </Link>
            ) : (
              <div className="absolute inset-0">
                <Image
                  src={banner.URL}
                  alt={banner.Texto || `Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={index === 0}
                />
                {banner.Texto && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-lg font-medium">{banner.Texto}</p>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
} 