import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
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
   return (
   <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />

          </CartProvider>
        </AuthProvider>
  );

} 