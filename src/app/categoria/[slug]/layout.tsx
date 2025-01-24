import { Metadata } from 'next';
import { useCategorie } from '@/hooks/useCategorie';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Aqui você pode fazer uma chamada à API para buscar os detalhes da categoria
  // Por enquanto vamos retornar um título genérico
  return {
    title: `Categoria ${params.slug} | Multus Comercial`,
    description: 'Encontre os melhores produtos na Multus Comercial'
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 