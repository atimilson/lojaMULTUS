"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { usePromotions } from "@/hooks/usePromotions";
import Image from "next/image";
import {
  featuredProducts,
  categories,
  bannerImage,
  banners,
} from "../mocks/products";
import { BannerCarousel } from "@/components/BannerCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import {
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ShoppingCartIcon,
  Bars3Icon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CubeIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { Header } from "@/components/Header";
import { Product } from "@/types/product";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import Link from "next/link";

export default function Home() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { promotions, isLoading: isPromotionsLoading } = usePromotions();
  const { getSocialMediaUrl, isLoading: isSocialLoading } = useSocialMedia();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchApi("/produto/ecommerce?empresa=1&destaque=S");
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
      loadProducts();
    }
  }, [isAuthLoading, authError]);

  if (isAuthLoading || isLoading || isPromotionsLoading || isSocialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Erro: {authError}
      </div>
    );
  }

  // Usar diretamente as promoções convertidas
  const promoProducts = promotions.slice(0, 8);

  // Filtra produtos
  const bestSellers = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <BannerCarousel />

        <ProductCarousel
          title="Ofertas Imperdíveis"
          products={promoProducts}
          viewAllLink="/promocoes"
          isPromotion={true}
        />

        <ProductCarousel
          title="Destaques"
          products={bestSellers}
          viewAllLink="/produtos"
          isPromotion={false}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Newsletter */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <EnvelopeIcon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">Receba nossas ofertas</h3>
                  <p className="text-gray-400">
                    Cadastre-se e receba promoções exclusivas!
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-xl w-full">
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
                    Cadastrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Links principais */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nossas Redes */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Nossas Redes</h3>
              <ul className="space-y-4">
                {getSocialMediaUrl("FACEBOOK") && (
                  <li>
                    <a
                      href={getSocialMediaUrl("FACEBOOK")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaFacebook className="w-6 h-6" />
                      <span>Facebook</span>
                    </a>
                  </li>
                )}
                {getSocialMediaUrl("INSTAGRAM") && (
                  <li>
                    <a
                      href={getSocialMediaUrl("INSTAGRAM")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaInstagram className="w-6 h-6" />
                      <span>Instagram</span>
                    </a>
                  </li>
                )}
                {getSocialMediaUrl("YOUTUBE") && (
                  <li>
                    <a
                      href={getSocialMediaUrl("YOUTUBE")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaYoutube className="w-6 h-6" />
                      <span>YouTube</span>
                    </a>
                  </li>
                )}
                {getSocialMediaUrl("LINKEDIN") && (
                  <li>
                    <a
                      href={getSocialMediaUrl("LINKEDIN")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaLinkedin className="w-6 h-6" />
                      <span>LinkedIn</span>
                    </a>
                  </li>
                )}
                
              </ul>
            </div>

            {/* Páginas de Termos */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Páginas de Termos</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/politica-privacidade"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="/termos"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div className="pb-5">
              <h3 className="font-bold mb-4 text-lg">Contato</h3>
              <ul className="space-y-4">
                <li>
                  <p className="text-gray-400">Horário de atendimento:</p>
                  <p className="text-white">Seg a Sex - 8h às 18h</p>
                </li>
                <li>
                  <p className="text-gray-400">WhatsApp:</p>
                  <p className="text-white">{getSocialMediaUrl("WHATSAAP")}</p>
                </li>
                <li>
                  <p className="text-gray-400">E-mail:</p>
                  <p className="text-white">{getSocialMediaUrl("EMAIL")}</p>
                </li>
              </ul>
            </div>
            
          </div>
          <div className="container mx-auto px-4 py-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <Image
                      src="https://www.multuscomercial.com.br/storage/empresas/24753864000142/24753864000142.png"
                      alt="Multus Comercial"
                      width={140}
                      height={40}
                      priority
                      className="object-contain"
                    />
                  </Link>
                </div>
                <p className="text-sm text-gray-400">
                  Copyright © {new Date().getFullYear()}. Todos os direitos reservados.
                </p>
              </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-950">
          <div className="container mx-auto px-4 py-4">
            {/* MCN Sistemas */}
            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-center font-extrabold">
                Desenvolvido e Hospedado por:
              </span>
              <p>
                <a
                  href="https://www.mcnsistemas.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="https://www.mcnsistemas.com.br/_next/image?url=%2Fassets%2Fimages%2Fmcnsistemas-logo.png&w=256&q=100"
                    alt="MCN Sistemas"
                    width={200}
                    height={60}
                    className="object-contain"
                  />
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
