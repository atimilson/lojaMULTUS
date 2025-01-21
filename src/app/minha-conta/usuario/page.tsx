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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Schema de validação
const userFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  dataNascimento: z.string(),
  genero: z.enum(['M', 'F', 'O']),
  receberNoticias: z.boolean()
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { logout } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema)
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      // Aqui você implementaria a chamada à API para atualizar os dados
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    }
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
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Meus Dados</h2>
                      <span className="text-sm text-gray-500">* Campos obrigatórios</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Dados Pessoais */}
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              {...register('nome')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Seu nome completo"
                            />
                            {errors.nome && (
                              <span className="text-sm text-red-500">{errors.nome.message}</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              E-mail *
                            </label>
                            <input
                              type="email"
                              {...register('email')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="seu@email.com"
                            />
                            {errors.email && (
                              <span className="text-sm text-red-500">{errors.email.message}</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CPF *
                            </label>
                            <input
                              type="text"
                              {...register('cpf')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="000.000.000-00"
                            />
                            {errors.cpf && (
                              <span className="text-sm text-red-500">{errors.cpf.message}</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Telefone *
                            </label>
                            <input
                              type="tel"
                              {...register('telefone')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="(00) 00000-0000"
                            />
                            {errors.telefone && (
                              <span className="text-sm text-red-500">{errors.telefone.message}</span>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Data de Nascimento
                            </label>
                            <input
                              type="date"
                              {...register('dataNascimento')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Gênero
                            </label>
                            <select
                              {...register('genero')}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="">Selecione</option>
                              <option value="M">Masculino</option>
                              <option value="F">Feminino</option>
                              <option value="O">Outro</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Preferências */}
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências</h3>
                        
                        <div className="space-y-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...register('receberNoticias')}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">
                              Desejo receber ofertas e novidades por e-mail
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Botões */}
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
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