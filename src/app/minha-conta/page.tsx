"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import { useLogin } from "@/hooks/useLogin";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarIcon,
  EyeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import InputMask from 'react-input-mask';
import { toast } from "react-hot-toast";
import { customInstance } from "@/api/mutator/custom-instance";
// import axios from "axios";
// Adicione essa interface para tipar a resposta da API
interface ClienteResponse {
  Contrato: number;
  Cliente: number;
  RazaoSocial: string;
  Fantasia: string;
  TipoPessoa: string;
  CPF: string;
  CNPJ: string;
  IE: string;
  Endereco: string;
  Complemento: string;
  Numero: string;
  CEP: string;
  NomeBairro: string;
  NomeCidade: string;
  UF: string;
  Fone1: string;
  Fone2: string;
  Fone3: string;
  Fone4: string;
  Email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();
  const { isAuthenticated } = useAuth();
  
  // Estados separados para cada campo
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [ie, setIe] = useState("");
  const [fone, setFone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState("F");
  const [camposDesabilitados, setCamposDesabilitados] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Função para determinar a máscara baseada no tipo de pessoa
  const getDocumentMask = (tipoPessoa: string) => {
    return tipoPessoa === 'F' ? '999.999.999-99' : '99.999.999/9999-99';
  };

  // Função para formatar o valor do documento
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
    }
  };

  // Modifique a função verificarCliente
  const verificarCliente = async (documento: string) => {
    try {
      // const response: any = await axios.get(`https://pedidoexterno.mcnsistemas.net.br/api/cliente?cliente=0&CPFouCNPJ=${documento}`);
      const token = localStorage.getItem('token');
      const response: any = await fetch(`https://pedidoexterno.mcnsistemas.net.br/api/cliente?cliente=0&CPFouCNPJ=${documento}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        }
      )
      const data = await response.json();
      console.log('Resposta da API:', data);

      if (data && data.length > 0) {
        const cliente = data[0];
        console.log('Cliente encontrado:', cliente);

        // Armazenar os dados do cliente para usar no cadastro
        setNome(cliente.TipoPessoa === 'J' ? (cliente.Fantasia || cliente.RazaoSocial) : cliente.RazaoSocial);
        setEmail(cliente.Email || '');
        setCpfCnpj(cliente.TipoPessoa === 'F' ? cliente.CPF : cliente.CNPJ);
        setIe(cliente.IE || '');
        setFone(cliente.Fone2 || cliente.Fone1 || cliente.Fone3 || cliente.Fone4 || '');
        setTipoPessoa(cliente.TipoPessoa);
        
        // Limpar campos de senha
        setSenha('');
        setConfirmarSenha('');
        
        // Atualiza o formulário de login
        setLoginData(prev => ({
          ...prev,
          email: cliente.Email || ''
        }));

        // Mostrar apenas campos de email e senha
        toast.success("Cliente encontrado! Complete seu cadastro com email e senha.");
        setCamposDesabilitados(true);
        
        // Forçar atualização do estado
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar cliente:', error);
      toast.error("Erro ao consultar cliente");
      return false;
    }
  };

  // Modifique a função handleChange
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    // Atualiza o campo específico baseado no nome
    switch (name) {
      case 'Nome':
        setNome(value);
        break;
      case 'Email':
        setEmail(value);
        break;
      case 'Senha':
        setSenha(value);
        break;
      case 'CPFouCNPJ':
        setCpfCnpj(value);
        const numeroLimpo = value.replace(/\D/g, '');
        
        if (numeroLimpo.length > 11) {
          setTipoPessoa('J');
        } else {
          setTipoPessoa('F');
          setIe('');
        }

        // Verificar cliente apenas quando o campo estiver completo
        if ((numeroLimpo.length === 11 && tipoPessoa === 'F') || 
            (numeroLimpo.length === 14 && tipoPessoa === 'J')) {
          await verificarCliente(value);
        }
        break;
      case 'IE':
        setIe(value);
        break;
      case 'Fone':
        setFone(value);
        break;
      case 'DataNascimento':
        setDataNascimento(value);
        break;
      case 'confirmarSenha':
        setConfirmarSenha(value);
        break;
      case 'termsAccepted':
        setTermsAccepted(checked);
        break;
      case 'tipoPessoa':
        setTipoPessoa(value);
        break;
    }
  };

  // Modifique o handleSubmit para usar os dados armazenados
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos de uso e política de privacidade");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (senha.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(senha);
    const hasSpecialChar = /[!@#$%^&*]/.test(senha);

    if (!hasLetter || !hasSpecialChar) {
      toast.error("A senha deve conter pelo menos uma letra e um caractere especial");
      return;
    }

    // Se os campos estiverem desabilitados, significa que o cliente já existe
    // e estamos apenas completando o cadastro com email e senha
    const success = await register({
      Nome: nome,
      Email: email,
      Senha: senha,
      CPFouCNPJ: cpfCnpj,
      IE: ie,
      Fone: fone,
      DataNascimento: dataNascimento,
    });

    if (success) {
      setSuccessMessage("Cadastro realizado com sucesso!");
      // Limpa todos os campos
      setNome("");
      setEmail("");
      setSenha("");
      setCpfCnpj("");
      setIe("");
      setFone("");
      setDataNascimento("");
      setConfirmarSenha("");
      setTermsAccepted(false);
      setTipoPessoa("F");
      setCamposDesabilitados(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push("/minha-conta/usuario");
      }
    }
  }, [isAuthenticated, router]);

  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await login({
      Usuario: loginData.email,
      Senha: loginData.password,
    });
  };

  // Adicione este useEffect para monitorar mudanças no estado camposDesabilitados
  useEffect(() => {
    if (camposDesabilitados) {
      console.log("Campos desabilitados:", camposDesabilitados);
      console.log("Dados do cliente:", { nome, email, cpfCnpj, tipoPessoa });
    }
  }, [camposDesabilitados]);

  return (
    <div className="flex-1 bg-gray-50">

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-primary hover:text-primary-dark">
                  Home
                </Link>
              </li>
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
              <div className="p-8 border-r border-gray-200">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Criar conta
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Preencha seus dados para se cadastrar
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Erro no cadastro:</span>
                      </div>
                      <p className="mt-1 ml-7">{error}</p>

                      {error.includes(
                        "informe letra ou caractere especial"
                      ) && (
                        <ul className="mt-2 ml-7 text-sm list-disc list-inside text-red-500">
                          <li>A senha deve conter pelo menos uma letra</li>
                          <li>
                            A senha deve conter pelo menos um caractere especial
                            (!@#$%^&*)
                          </li>
                          <li>A senha deve ter no mínimo 8 caracteres</li>
                        </ul>
                      )}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {camposDesabilitados ? (
                      // Formulário simplificado para cliente existente
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-blue-700">Cliente encontrado! Complete seu cadastro criando uma senha.</p>
                          <p className="text-sm text-blue-600 mt-2">
                            Nome: {nome}<br />
                            {tipoPessoa === 'F' ? 'CPF' : 'CNPJ'}: {cpfCnpj}
                          </p>
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
                              value={email}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                              placeholder="seu@email.com"
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
                              value={senha}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                              placeholder="Mínimo 8 caracteres"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            A senha deve ter no mínimo 8 caracteres, incluindo letras e caracteres especiais.
                          </p>
                        </div>

                        <div>
                          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Senha
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              id="confirmarSenha"
                              name="confirmarSenha"
                              value={confirmarSenha}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                              placeholder="Confirme sua senha"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      // Formulário completo para novo cliente
                      <>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de Cadastro
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4 hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="tipoPessoa"
                            value="F"
                            checked={tipoPessoa === 'F'}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <UserIcon className="h-6 w-6 text-gray-500 peer-checked:text-primary" />
                            <span className="text-sm font-medium text-gray-700 peer-checked:text-primary">
                              Pessoa Física
                            </span>
                          </div>
                          <span className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary" 
                            aria-hidden="true"
                          />
                        </label>

                        <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-4 hover:border-primary transition-colors">
                          <input
                            type="radio"
                            name="tipoPessoa"
                            value="J"
                            checked={tipoPessoa === 'J'}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <BuildingStorefrontIcon className="h-6 w-6 text-gray-500 peer-checked:text-primary" />
                            <span className="text-sm font-medium text-gray-700 peer-checked:text-primary">
                              Pessoa Jurídica
                            </span>
                          </div>
                          <span className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-primary" 
                            aria-hidden="true"
                          />
                        </label>
                      </div>
                    </div>

                        <div>
                          <label htmlFor="CPFouCNPJ" className="block text-sm font-medium text-gray-700 mb-1">
                            {tipoPessoa === 'F' ? 'CPF' : 'CNPJ'}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IdentificationIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <InputMask
                              mask={getDocumentMask(tipoPessoa)}
                              value={cpfCnpj}
                              onChange={handleChange}
                              id="CPFouCNPJ"
                              name="CPFouCNPJ"
                              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                              placeholder={tipoPessoa === 'F' ? '000.000.000-00' : '00.000.000/0000-00'}
                              required
                            />
                          </div>
                        </div>

                        {/* Campos que sempre aparecem */}
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
                              value={email}
                              onChange={handleChange}
                              required
                              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>

                        {/* Campos que aparecem apenas se não for cliente existente */}
                        {!camposDesabilitados && (
                          <>
                            <div>
                              <label htmlFor="Nome" className="block text-sm font-medium text-gray-700 mb-1">
                                {tipoPessoa === 'F' ? 'Nome Completo' : 'Razão Social'}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  id="Nome"
                                  name="Nome"
                                  value={nome}
                                  onChange={handleChange}
                                  required
                                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                                  placeholder={tipoPessoa === 'F' ? 'Seu nome completo' : 'Razão Social da empresa'}
                                />
                              </div>
                            </div>

                            {tipoPessoa === 'J' && (
                              <div>
                                <label htmlFor="IE" className="block text-sm font-medium text-gray-700 mb-1">
                                  Inscrição Estadual
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <InputMask
                                    mask="999.999.999.999"
                                    value={ie}
                                    onChange={handleChange}
                                    id="IE"
                                    name="IE"
                                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                                    placeholder="000.000.000.000"
                                  />
                                </div>
                              </div>
                            )}

                            {tipoPessoa === 'F' && (
                              <div>
                                <label htmlFor="DataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
                                  Data de Nascimento
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <InputMask
                                    mask="99/99/9999"
                                    value={dataNascimento}
                                    onChange={handleChange}
                                    id="DataNascimento"
                                    name="DataNascimento"
                                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                                    placeholder="DD/MM/AAAA"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label htmlFor="Fone" className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <InputMask
                                  mask="(99) 99999-9999"
                                  value={fone}
                                  onChange={handleChange}
                                  id="Fone"
                                  name="Fone"
                                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                                  placeholder="(00) 00000-0000"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Campos comuns para ambos os casos */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={termsAccepted}
                        onChange={handleChange}
                        className="mt-1 mr-2"
                        required
                      />
                      <label htmlFor="termsAccepted" className="text-sm text-gray-600">
                        Concordo com os <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Cadastrando..." : camposDesabilitados ? "Completar Cadastro" : "Criar conta"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-8 bg-gray-50">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Já sou cliente
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Faça login para continuar
                    </p>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                        <span className="ml-2 text-sm text-gray-600">
                          Lembrar-me
                        </span>
                      </label>
                      <Link
                        href="/esqueci-senha"
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoginLoading ? "Entrando..." : "Entrar"}
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
