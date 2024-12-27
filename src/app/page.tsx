'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
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

export default function Home() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { fetchApi } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchApi('/produto/ecommerce');
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && !authError) {
      loadProducts();
    }
  }, [isAuthLoading, authError]);

  if (isAuthLoading || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (authError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">
      Erro: {authError}
    </div>;
  }

  // Filtra produtos em promoção
  const promoProducts = products.filter(p => p.PrecoPromocional > 0);
  
  // Filtra produtos mais vendidos (você pode ajustar essa lógica conforme necessário)
  const bestSellers = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <BannerCarousel banners={banners} />

        <ProductCarousel
          title="Ofertas Imperdíveis"
          products={promoProducts}
          viewAllLink="/promocoes"
        />

        <ProductCarousel
          title="Mais Vendidos"
          products={bestSellers}
          viewAllLink="/mais-vendidos"
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Institucional */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Institucional</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/sobre"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="/trabalhe-conosco"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Trabalhe Conosco
                  </a>
                </li>
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
                <li>
                  <a
                    href="/blog"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Atendimento */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Atendimento</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/central-ajuda"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="/fale-conosco"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Fale Conosco
                  </a>
                </li>
                <li>
                  <a
                    href="/whatsapp"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="/trocas"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Trocas e Devoluções
                  </a>
                </li>
                <li>
                  <a
                    href="/ouvidoria"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Ouvidoria
                  </a>
                </li>
              </ul>
            </div>

            {/* Minha Conta */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Minha Conta</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/meus-pedidos"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Meus Pedidos
                  </a>
                </li>
                <li>
                  <a
                    href="/cadastro"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Cadastre-se
                  </a>
                </li>
                <li>
                  <a
                    href="/favoritos"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Lista de Desejos
                  </a>
                </li>
                <li>
                  <a
                    href="/cartoes"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Meus Cartões
                  </a>
                </li>
              </ul>
            </div>

            {/* Vendas */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Vendas</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/venda-na-multus"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Venda na Multus
                  </a>
                </li>
                <li>
                  <a
                    href="/vendas-corporativas"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Vendas Corporativas
                  </a>
                </li>
                <li>
                  <a
                    href="/marketplace"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Marketplace
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato e Redes Sociais */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Contato</h3>
              <ul className="space-y-4">
                <li>
                  <p className="text-gray-400">Horário de atendimento:</p>
                  <p className="text-white">Seg a Sex - 8h às 18h</p>
                </li>
                <li>
                  <p className="text-gray-400">Telefone:</p>
                  <p className="text-white">(11) 4444-5555</p>
                </li>
                <li>
                  <p className="text-gray-400">E-mail:</p>
                  <p className="text-white">contato@multus.com.br</p>
                </li>
                <li>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaFacebook className="w-6 h-6" />
                    </a>
                    <a
                      href="https://instagram.com"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaInstagram className="w-6 h-6" />
                    </a>
                    <a
                      href="https://youtube.com"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaYoutube className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaLinkedin className="w-6 h-6" />
                    </a>
                    <a
                      href="https://whatsapp.com"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <FaWhatsapp className="w-6 h-6" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pagamentos e Certificados */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Formas de Pagamento */}
              <div>
                <h4 className="font-semibold mb-4">Formas de Pagamento</h4>
                <div className="flex flex-wrap gap-2">
                  <Image src="/visa.png" alt="Visa" width={40} height={25} />
                  <Image
                    src="/mastercard.png"
                    alt="Mastercard"
                    width={40}
                    height={25}
                  />
                  <Image src="/elo.png" alt="Elo" width={40} height={25} />
                  <Image src="/pix.png" alt="Pix" width={40} height={25} />
                  <Image
                    src="/boleto.png"
                    alt="Boleto"
                    width={40}
                    height={25}
                  />
                </div>
              </div>

              {/* Certificados de Segurança */}
              <div>
                <h4 className="font-semibold mb-4">Segurança</h4>
                <div className="flex gap-4">
                  <Image
                    src="https://www.multuscomercial.com.br/img/footer/ssl.png"
                    alt="SSL"
                    width={100}
                    height={30}
                  />
                  <Image
                    src="https://www.multuscomercial.com.br/img/footer/google-security.png"
                    alt="PCI"
                    width={80}
                    height={40}
                  />
                </div>
              </div>

              {/* Powered by */}
              <div className="flex items-center justify-end">
                <Image
                  src="https://www.multuscomercial.com.br/storage/empresas/24753864000142/24753864000142.png"
                  alt="Multus Comercial"
                  width={120}
                  height={35}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-950">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© 2024 Multus Comercial. Todos os direitos reservados.</p>
              <p>CNPJ: 24.753.864/0001-42</p>
            </div>
            <div className="mt-4 text-center text-gray-400">
              <p>Avenida General Mello, N° 3255, Jardim Califórnia, Cuiabá - MT, CEP 78070-300 | CNPJ 24.753.864/0001-42 | (65) 2136-4199 | vendas@multuscomercial.com.br</p>
              <p>Todos os preços, regras e promoções são válidas para produtos vendidos e entregues pela loja virtual. O preço válido será o da finalização da compra.</p>
            </div>
            {/* MCN Sistemas */}
            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-center font-extrabold">Desenvolvido e Hospedado por:</span>
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
