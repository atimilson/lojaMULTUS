'use client';

import { useState } from 'react';
import Link from "next/link";
import { 
  UserIcon, 
  MapPinIcon, 
  ShoppingBagIcon, 
  HeartIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Minha Conta</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {/* Menu Lateral */}
              <div className="p-6 border-r border-gray-200">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="h-5 w-5" />
                    Meus Dados
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <MapPinIcon className="h-5 w-5" />
                    Endereços
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    Pedidos
                  </button>

                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      activeTab === 'favorites' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <HeartIcon className="h-5 w-5" />
                    Favoritos
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sair
                  </button>
                </nav>
              </div>

              {/* Conteúdo */}
              <div className="col-span-3 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Dados</h2>
                    {/* Adicionar formulário de edição de dados */}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Endereços</h2>
                    {/* Adicionar lista de endereços e formulário */}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h2>
                    {/* Adicionar lista de pedidos */}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Favoritos</h2>
                    {/* Adicionar lista de produtos favoritos */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 