import Link from "next/link";
import Image from "next/image";
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function LoginPage() {
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

                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="newEmail"
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="newPassword"
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
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
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Criar conta
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

                  <form className="space-y-4">
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
                          className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
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
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Entrar
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