'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from "@/contexts/AuthContext";
import { useGetApiEmpresaBanner } from '@/api/generated/mCNSistemas';
import type { BannerDto as Banner } from '@/api/generated/mCNSistemas.schemas';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useEffect, useState } from 'react'

export function BannerCarousel() {
  const { isLoading: isAuthLoading, token } = useAuth();
  const [bannerWidth, setBannerWidth] = useState<Banner[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const { data: banners = [], isLoading } = useGetApiEmpresaBanner({
    empresa: 1
  }, {
    swr: {
     revalidateOnFocus: false,     
    }
  });

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint md do Tailwind
    };

    // Verificação inicial
    checkMobile();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading || isAuthLoading) {
    return (
      <div className="w-full bg-gray-100" style={{ aspectRatio: '32/9' }}>
        <div className="animate-pulse w-full h-full bg-gray-200" />
      </div>
    )
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
        className="swiper relative"
        style={{
          aspectRatio: isMobile ? '1/1' : '32/9',
        }}
      >
        {banners.map((banner, index) => (
          banner.Tipo === (isMobile ? 'mobile' : 'desktop') && (
            <SwiperSlide key={index} className="relative w-full h-full">
              {banner.Link ? (
                <Link href={banner.Link} className="block w-full h-full">
                  <div className="absolute inset-0">
                    <Image
                      src={banner.URL || ''}
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
                    src={banner.URL || ''}
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
          )
        ))}
      </Swiper>
    </section>
  )
} 