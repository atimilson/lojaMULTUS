import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lançamentos | Multus Comercial',
  description: 'Confira os novos produtos da Multus Comercial. Produtos recém chegados e últimos lançamentos.',
  keywords: 'lançamentos, novos produtos, produtos novos, últimos lançamentos',
};

export default function LancamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 