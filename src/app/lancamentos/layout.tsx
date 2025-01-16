import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lançamentos | Multus Comercial',
  description: 'Confira os novos produtos da Multus Comercial'
};

export default function LancamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 