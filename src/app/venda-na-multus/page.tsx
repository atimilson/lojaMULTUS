import Image from "next/image";
import { Header } from "@/components/Header";
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venda na Multus | Multus Comercial',
  description: 'Seja um parceiro Multus e expanda seus negócios'
};

export default function VendaNaMultusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner Principal com as Lojas */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">Nossas Lojas</h1>
            
            {/* Grid de Cards das Lojas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Card Loja General Melo */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
                <div className="relative h-64">
                  <Image
                    src="https://www.multuscomercial.com.br/storage/empresas/24753864000142/lojas/DmKUc1Q7nUVBW3c1Dg3uJ3y50TiW00-metabXVsdHVzMi5qcGc=-.jpeg"
                    alt="Loja General Melo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-gray-800">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Loja General Melo</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold mb-2">Horário de Funcionamento:</p>
                        <p>Segunda à Sexta: 08:00 às 18:00</p>
                        <p>Sábado: 08:00 às 13:00</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold mb-2">Endereço:</p>
                        <p>Avenida Tenente Praeiro, 3255</p>
                        <p>Jardim Califórnia</p>
                        <p>Cuiabá - MT, 78070-300</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <PhoneIcon className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-2">Telefone:</p>
                        <p>(65) 2136-4199</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Loja Nova Esperança */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
                <div className="relative h-64">
                  <Image
                    src="https://www.multuscomercial.com.br/storage/empresas/24753864000142/lojas/N8NoA8PWqWQc6QtUQhu1LH5zlbAKTq-metabXVsdHVzMS5qcGc=-.jpeg"
                    alt="Loja Nova Esperança"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-gray-800">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Loja Nova Esperança</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold mb-2">Horário de Funcionamento:</p>
                        <p>Segunda à Sexta: 08:00 às 18:00</p>
                        <p>Sábado: 08:00 às 13:00</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold mb-2">Endereço:</p>
                        <p>Avenida V-2, 89</p>
                        <p>Jardim Industriário</p>
                        <p>Cuiabá - MT, 78099-357</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Informações da Loja */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-700">Nossa Loja Física</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <MapPinIcon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-gray-700">Endereço</h3>
                <p className="text-gray-600">
                  Avenida General Mello, N° 3255
                  <br />
                  Jardim Califórnia
                  <br />
                  Cuiabá - MT
                  <br />
                  CEP 78070-300
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <PhoneIcon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-gray-700">Telefones</h3>
                <p className="text-gray-600">
                  (65) 2136-4199
                  <br />
                  (65) 99999-9999 (WhatsApp)
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ClockIcon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-gray-700">Horário de Funcionamento</h3>
                <p className="text-gray-600">
                  Segunda a Sexta: 08h às 18h
                  <br />
                  Sábado: 08h às 12h
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <EnvelopeIcon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-gray-700">Contato</h3>
                <p className="text-gray-600">
                  vendas@multuscomercial.com.br
                  <br />
                  CNPJ: 24.753.864/0001-42
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="h-[400px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.4175247785897!2d-56.118800585076916!3d-15.579999989182439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x939db1b40f388773%3A0x3e70f0d0a7b8f00!2sAv.%20Gen.%20Mello%2C%203255%20-%20Jardim%20California%2C%20Cuiab%C3%A1%20-%20MT%2C%2078070-300!5e0!3m2!1spt-BR!2sbr!4v1647881234567!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>      

      </main>
    </div>
  );
} 