'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useRegister';
import { useLogin } from '@/hooks/useLogin';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Senha: '',
    CPFouCNPJ: '',
    IE: '',
    Fone: '',
    DataNascimento: '',
    termsAccepted: false
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Você precisa aceitar os termos de uso e política de privacidade');
      return;
    }

    const success = await register({
      Nome: formData.Nome,
      Email: formData.Email,
      Senha: formData.Senha,
      CPFouCNPJ: formData.CPFouCNPJ,
      IE: formData.IE,
      Fone: formData.Fone,
      DataNascimento: formData.DataNascimento
    });

    if (success) {
      setSuccessMessage('Cadastro realizado com sucesso!');
      setFormData({
        Nome: '',
        Email: '',
        Senha: '',
        CPFouCNPJ: '',
        IE: '',
        Fone: '',
        DataNascimento: '',
        termsAccepted: false
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/minha-conta/usuario');
    }
  }, [isAuthenticated, router]);

  // Login
  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    await login({
      Usuario: loginData.email,
      Senha: loginData.password
    });
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
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Cadastro - Lado Esquerdo */}
              <div className="p-8 border-r border-gray-200">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Criar conta</h2>
                    <p className="text-gray-600 mt-1">Preencha seus dados para se cadastrar</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Erro no cadastro:</span>
                      </div>
                      <p className="mt-1 ml-7">{error}</p>
                      
                      {error.includes('informe letra ou caractere especial') && (
                        <ul className="mt-2 ml-7 text-sm list-disc list-inside text-red-500">
                          <li>A senha deve conter pelo menos uma letra</li>
                          <li>A senha deve conter pelo menos um caractere especial (!@#$%^&*)</li>
                          <li>A senha deve ter no mínimo 8 caracteres</li>
                        </ul>
                      )}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="Nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="Nome"
                          name="Nome"
                          value={formData.Nome}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="CPFouCNPJ" className="block text-sm font-medium text-gray-700 mb-1">
                        CPF ou CNPJ
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="CPFouCNPJ"
                          name="CPFouCNPJ"
                          value={formData.CPFouCNPJ}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="IE" className="block text-sm font-medium text-gray-700 mb-1">
                        Inscrição Estadual
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="IE"
                          name="IE"
                          value={formData.IE}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="Inscrição Estadual (opcional)"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="DataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="DataNascimento"
                          name="DataNascimento"
                          value={formData.DataNascimento}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="Email"
                          name="Email"
                          value={formData.Email}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="Fone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="Fone"
                          name="Fone"
                          value={formData.Fone}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="Senha" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="Senha"
                          name="Senha"
                          value={formData.Senha}
                          onChange={handleChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 rounded text-primary focus:ring-primary"
                      />
                      <label className="ml-2 text-sm text-gray-600">
                        Li e aceito os{" "}
                        <Link href="/termos" className="text-primary hover:text-primary-dark">
                          termos de uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacidade" className="text-primary hover:text-primary-dark">
                          política de privacidade
                        </Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Cadastrando...' : 'Criar conta'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Login - Lado Direito */}
              <div className="p-8 bg-gray-50">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Já sou cliente</h2>
                    <p className="text-gray-600 mt-1">Faça login para continuar</p>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                      </label>
                      <Link href="/esqueci-senha" className="text-sm text-primary hover:text-primary-dark">
                        Esqueci minha senha
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoginLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 