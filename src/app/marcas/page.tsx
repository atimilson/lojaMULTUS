import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Metadata } from 'next';

// Metadata
export const metadata: Metadata = {
  title: 'Todas as Marcas | Multus Comercial',
  description: 'Conheça todas as marcas disponíveis na Multus Comercial'
};

// Mock de marcas (você pode mover isso para o arquivo de mocks)
const brands = [
  {
    id: 1,
    name: "DEWALT",
    slug: "dewalt",
    logo: "https://logodownload.org/wp-content/uploads/2014/07/dewalt-logo-0.png",
    description: "Líder mundial em ferramentas elétricas profissionais e acessórios industriais.",
    productCount: 245
  },
  {
    id: 2,
    name: "BOSCH",
    slug: "bosch",
    logo: "https://logodownload.org/wp-content/uploads/2014/04/bosch-logo-0.png",
    description: "Inovação para a vida com tecnologia de ponta em ferramentas profissionais.",
    productCount: 189
  },
  {
    id: 3,
    name: "MAKITA",
    slug: "makita",
    logo: "https://logodownload.org/wp-content/uploads/2014/09/makita-logo-0.png",
    description: "Qualidade japonesa em ferramentas elétricas e equipamentos profissionais.",
    productCount: 167
  },
  {
    id: 4,
    name: "TRAMONTINA",
    slug: "tramontina",
    logo: "https://logodownload.org/wp-content/uploads/2017/04/tramontina-logo-0.png",
    description: "Tradição brasileira em ferramentas e utensílios de alta qualidade.",
    productCount: 312
  },
  // Adicione mais marcas aqui
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Marcas</span>
          </div>
        </div>

        {/* Título da página */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900">Nossas Marcas</h1>
            <p className="text-gray-600 mt-2">
              Conheça todas as marcas disponíveis na Multus Comercial
            </p>
          </div>
        </div>

        {/* Grid de marcas */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marca/${brand.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-48 h-24 mb-4">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {brand.name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                  <span className="text-sm text-primary">
                    {brand.productCount} produtos
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer será renderizado automaticamente */}
    </div>
  );
} 