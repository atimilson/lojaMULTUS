"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/mocks/products";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  TagIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  PrinterIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import {
  useGetApiEmpresa,
  useGetApiProdutoEcommerce,
} from "@/api/generated/mCNSistemas";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import { toast } from "react-toastify"; 
import { useEcommerceUser } from "@/hooks/useEcommerceUser";
import { useEcommerceAddress } from "@/hooks/useEcommerceAddress";
import axiosInstance from "@/api/axios-instance";

// Adicionar a tipagem
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items: cartItems = [], removeItem, updateQuantity, total = 0, addItem, selectedShipping, setSelectedShipping } = useCart();
  // Garantir que items sempre seja um array
  const items = Array.isArray(cartItems) ? cartItems : [];
  const router = useRouter();
  const { user, isLoading: userLoading, saveUser } = useEcommerceUser();
  const { addresses, isLoading: addressLoading } = useEcommerceAddress();
  const [deliveryOption, setDeliveryOption] = useState('home'); // 'store' para retirar na loja ou 'home' para entrega

  useEffect(() => {
    if (!items || items.length === 0) {
      setSelectedShipping(null);
    }
  }, [items, setSelectedShipping]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/minha-conta?returnTo=/carrinho");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Se selecionar retirada na loja, definir frete como zero
    if (deliveryOption === 'store') {
      setSelectedShipping({
        codigo: 'store-pickup',
        valor: '0.00',
        prazo: '1',
        servico: 'Retirada na Loja'
      });
    } else if (deliveryOption === 'home' && selectedShipping?.codigo === 'store-pickup') {
      // Se trocar de retirada para entrega, limpar a seleção de frete
      setSelectedShipping(null);
    }
  }, [deliveryOption, setSelectedShipping]);

  if (!isAuthenticated) {
    return null; // ou um componente de loading
  }

  const { data: products = [], isLoading: apiLoading } =
    useGetApiProdutoEcommerce({
      empresa: 1,
      destaque: "S",
    });

  const { getSocialMediaUrl, isLoading: isSocialLoading } = useSocialMedia();

  const { data: empresa = [] } = useGetApiEmpresa({
    empresa: 1,
  });

  if (apiLoading) {
    return <Loading />;
  }

  // Filtrar produtos que não estão no carrinho
  const relatedProducts = products.filter(
    (product) => !items || !items.some((item) => item.Produto === product.Produto)
  );

  // Função para imprimir carrinho
  const handlePrint = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Cabeçalho da empresa
    doc.setFontSize(16);
    doc.text(empresa[0]?.Fantasia || "Loja", 14, 20);
    doc.setFontSize(12);
    doc.text([
      `${empresa[0]?.Endereco || ''}, ${empresa[0]?.Numero || ''}`,
      `${empresa[0]?.Cidade || ''} - ${empresa[0]?.UF || ''}`,
      `Tel: ${empresa[0]?.Fone1 || ''}`
    ], 14, 30);

    // Adicionar logo se existir
    if (empresa[0]?.LogoMarca) {
      doc.addImage(
        `data:image/png;base64,${empresa[0].LogoMarca}`,
        'PNG',
        14,
        10,
        30,
        20
      );
    }
    
    // Dados do cliente (movido para baixo)
    doc.setFontSize(16);
    doc.text("Dados do Cliente", 14, 60);
    doc.setFontSize(12);
    doc.text(`Nome: ${user?.Nome || '-'}`, 14, 70);
    doc.text(`Email: ${user?.Email || '-'}`, 14, 78);
    doc.text(`CPF/CNPJ: ${user?.CPFouCNPJ || '-'}`, 14, 86);
    
    // Título do carrinho
    doc.setFontSize(16);
    doc.text("Carrinho de Compras", 14, 100);

    // Tabela de produtos (ajustada posição Y)
    const tableData = items.map((item) => [
      item.Descricao || "Produto",
      item.Quantidade || 1,
      `R$ ${(item.PrecoPromocional || item.Preco || 0).toFixed(2)}`,
      `R$ ${((item.PrecoPromocional || item.Preco || 0) * (item.Quantidade || 1)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 110,
      head: [["Produto", "Qtd", "Preço Un.", "Total"]],
      body: tableData,
    });

    // Totais
    const finalY = (doc as any).lastAutoTable.finalY || 110;
    doc.text(`Subtotal: R$ ${total.toFixed(2)}`, 14, finalY + 10);
    if (selectedShipping) {
      doc.text(`Frete: R$ ${selectedShipping.valor}`, 14, finalY + 20);
      doc.text(
        `Total: R$ ${(total + parseFloat(selectedShipping.valor)).toFixed(2)}`,
        14,
        finalY + 30
      );
    }

    doc.save("carrinho.pdf");
  };

  // Função para compartilhar no WhatsApp
  const handleWhatsApp = async () => {
    // Primeiro, enviar o pedido para a API
    try {
      toast.loading('Processando pedido...');
      
      // Obter o token de autenticação
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Você precisa estar autenticado para enviar pedidos');
        return;
      }
      
      // Obter o endereço principal do usuário se disponível
      const enderecoEntrega = addresses && addresses.length > 0 ? addresses[0] : {
        Bairro: "Centro",
        CEP: "89000000",
        Cidade: "Blumenau",
        Complemento: "",
        Endereco: "Rua Principal",
        Numero: "123",
        UF: "SC"
      };
      
      // Montar o objeto de pedido conforme solicitado
      const pedidoData = {
        Pedido: 0,
        Contrato: 391,
        Empresa: 1,
        Tipo: "O",
        IdUsuario: 2,
        // Dados do cliente
        Cliente: 0, // ID do cliente padrão ou registrado
        ClienteNome: user?.Nome || "Cliente Padrão",
        ClienteFantasia: user?.Nome || "Cliente Padrão",
        CNPJ: user?.CPFouCNPJ && user?.CPFouCNPJ.length > 11 ? user?.CPFouCNPJ : "",
        CPF: user?.CPFouCNPJ && user?.CPFouCNPJ.length <= 11 ? user?.CPFouCNPJ : "12345678900",
        Email: user?.Email || "cliente@exemplo.com",
        Fone1: user?.Fone || "47999999999",
        Fone2: "",
        Fone3: "",
        InscEstadual: "",
        TabPrecoCliente: 0,
        IBGE: "5103403",
        // Endereço        
        Bairro: enderecoEntrega.Bairro,
        CEP: enderecoEntrega.CEP,
        Cidade: enderecoEntrega.Cidade,
        Complemento: enderecoEntrega.Complemento,
        Endereco: enderecoEntrega.Endereco,
        EnderecoNumero: enderecoEntrega.Numero,
        UF: enderecoEntrega.UF,
        
        // Dados do pedido
        DataEmissao: new Date().toISOString().split('T')[0],
        HoraEmissao: new Date().toTimeString().split(' ')[0],
        CondPgto: 1,
        ValorProdutos: total || 0,
        ValorDesconto: 0,
        ValorFrete: selectedShipping ? parseFloat(selectedShipping.valor || "0") : 0,
        ValorPedido: finalTotal || 0,
        Vendedor: 2,
        VendedorNome: "Ecommerce Web",
        Observacao: "Pedido enviado via Ecommerce Web",
        
        // Itens do pedido
        Itens: items.map(item => ({
          Produto: item.Produto,
          Quantidade: item.Quantidade || 1,
          ValorUnitarioBruto: item.PrecoPromocional || item.Preco || 0,
          ValorDescEspecial: 0,
          PercDescontoItem: 0,
          ValorDescontoItem: 0,
          ValorUnitarioLiquido: item.PrecoPromocional || item.Preco || 0,
          ValorTotalLiquido: ((item.PrecoPromocional || item.Preco || 0) * (item.Quantidade || 1)),
          Unidade: "UN",
          ConversaoUnidade: "N",
          Complemento: item.Descricao || ""
        }))
      };
      
      // Enviar para a API
      const response = await fetch('/api/pedidomobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(pedidoData)
      });

      const result = await response.json();
      console.log('Resposta da API de pedido:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar pedido');
      }
      
      toast.dismiss();
      toast.success('Pedido enviado com sucesso!');
      
      // Continuar com o envio para WhatsApp normalmente
      const whatsappNumber =  "65981170765";
      if (!whatsappNumber) {
        toast.error("Número do WhatsApp não disponível");
        return;
      }

      // Montar mensagem com dados do usuário
      let message = "Olá! Gostaria de fazer um pedido:\n\n";
      message += `*Dados do Cliente*\n`;
      message += `Nome: ${user?.Nome || '-'}\n`;
      message += `Email: ${user?.Email || '-'}\n`;
      message += `CPF/CNPJ: ${user?.CPFouCNPJ || '-'}\n\n`;
      message += "*Itens do Pedido:*\n\n";

      items.forEach((item) => {
        message += `${item.Descricao}\n`;
        message += `Quantidade: ${item.Quantidade}\n`;
        message += `Valor: R$ ${(
          (item.PrecoPromocional || item.Preco || 0) *
          item.Quantidade
        ).toFixed(2)}\n\n`;
      });

      message += `\n*Subtotal: R$ ${(total || 0).toFixed(2)}*`;
      if (selectedShipping) {
        message += `\n*Frete: R$ ${selectedShipping.valor || "0"}*`;
        message += `\n*Total: R$ ${(
          (total || 0) + parseFloat(selectedShipping.valor || "0")
        ).toFixed(2)}*`;
      }
      
      // Adicionar número do pedido à mensagem se disponível
      if (result && result.Pedido) {
        message += `\n*Número do Pedido: ${result.Pedido}*`;
      }
      
      message += `\n* Recupere o Pedido no MCN Sistemas *`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
      
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      toast.dismiss();
      toast.error('Erro ao enviar pedido');
      
      // Ainda assim, tenta enviar para o WhatsApp, mesmo com erro
      const whatsappNumber = "65981170765";
      let message = "Olá! Gostaria de fazer um pedido:\n\n";
      message += `*Dados do Cliente*\n`;
      message += `Nome: ${user?.Nome || '-'}\n`;
      message += `Email: ${user?.Email || '-'}\n`;
      message += `CPF/CNPJ: ${user?.CPFouCNPJ || '-'}\n\n`;
      message += "*Itens do Pedido:*\n\n";

      items.forEach((item) => {
        message += `${item.Descricao}\n`;
        message += `Quantidade: ${item.Quantidade}\n`;
        message += `Valor: R$ ${(
          (item.PrecoPromocional || item.Preco || 0) *
          item.Quantidade
        ).toFixed(2)}\n\n`;
      });

      message += `\n*Subtotal: R$ ${(total || 0).toFixed(2)}*`;
      if (selectedShipping) {
        message += `\n*Frete: R$ ${selectedShipping.valor || "0"}*`;
        message += `\n*Total: R$ ${(
          (total || 0) + parseFloat(selectedShipping.valor || "0")
        ).toFixed(2)}*`;
      }
      
      message += `\n* Recupere o Pedido no MCN Sistemas *`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
    }
  };

  const finalTotal = (total || 0) + (selectedShipping ? parseFloat(selectedShipping.valor || "0") : 0);

  const handleCheckout = () => {
    if (!selectedShipping) {
      toast.error('Selecione uma opção de frete');
      return;
    }
    
    router.push('/checkout');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header />
      {/* Breadcrumb */}
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
              <li className="text-gray-900 font-medium">Carrinho</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de Produtos */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Meu Carrinho ({items.length}{" "}
              {items.length === 1 ? "item" : "itens"})
            </h1>

            {/* Produtos */}
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.Produto}
                  className="p-6 flex gap-6 border-b border-gray-100 last:border-0"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.Imagens[0]?.URL}
                      alt={item.Descricao}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <Link
                        href={`/produto/${item.Produto}`}
                        className="text-gray-900 font-medium hover:text-primary line-clamp-2"
                      >
                        {item.Descricao}
                      </Link>
                      <button
                        onClick={() => removeItem(item.Produto)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      Vendido e entregue por{" "}
                      <span className="font-medium ml-1">Multus Comercial</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.Produto, item.Quantidade - 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value={item.Quantidade}
                          onChange={(e) =>
                            updateQuantity(
                              item.Produto,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-12 text-center border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.Produto, item.Quantidade + 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.PrecoPromocional > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {(item.Preco || 0).toFixed(2)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          R${" "}
                          {(
                            ((item.PrecoPromocional || item.Preco || 0)) *
                            item.Quantidade
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cupom e Frete */}
            <div className="grid grid-cols-1 gap-4">
              {/* Cupom de Desconto */}
              {/* <div className=" p-6">
               <div className="bg-white rounded-lg shadow-sm p-6"> 
                 <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-medium text-gray-900">Cupom de Desconto</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Aplicar
                  </button>
                </div> 
              </div>
              </div> */}

              {/* Cálculo de Frete */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-medium text-gray-900">Opções de Entrega</h2>
                </div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDeliveryOption('store')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        deliveryOption === 'store' 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          deliveryOption === 'store' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <ShieldCheckIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Retirar na loja</h3>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              deliveryOption === 'store' 
                                ? 'border-primary' 
                                : 'border-gray-300'
                            }`}>
                              {deliveryOption === 'store' && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Sem custos de frete</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setDeliveryOption('home')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        deliveryOption === 'home' 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          deliveryOption === 'home' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <TruckIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Receber em casa</h3>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              deliveryOption === 'home' 
                                ? 'border-primary' 
                                : 'border-gray-300'
                            }`}>
                              {deliveryOption === 'home' && (
                                <div className="w-3 h-3 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Calcule o frete abaixo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {deliveryOption === 'store' ? (
                  <div className="bg-green-50 border border-green-100 p-5 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <ShieldCheckIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">
                          Retirada na loja confirmada
                        </h3>
                        <p className="text-green-700">
                          Frete: <span className="font-bold">GRÁTIS</span>
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Você poderá retirar seu pedido na loja em até 1 dia útil após a confirmação do pagamento. 
                          Nossa equipe entrará em contato quando estiver disponível.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ShippingCalculator 
                    items={items} 
                    total={total}
                    onSelectShipping={setSelectedShipping}
                    selectedShipping={selectedShipping}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({items.length} itens)
                  </span>
                  <span className="text-gray-900">R$ {(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">
                    {selectedShipping 
                      ? `R$ ${selectedShipping.valor || "0"}`
                      : 'Calcular frete'
                    }
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-green-600">- R$ 0,00</span>
                </div> */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        R$ {(finalTotal || 0).toFixed(2)}
                      </p>
                      {selectedShipping && (
                        <p className="text-sm text-gray-600">
                          Prazo de entrega: {selectedShipping.prazo} dias úteis
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {/* Botão Finalizar Compra */}
                <button 
                  onClick={handleCheckout}
                  disabled={!selectedShipping || items.length === 0}
                  className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {!selectedShipping ? 'Selecione um frete' : 'Finalizar Compra'}
                  {selectedShipping && <ArrowRightIcon className="w-4 h-4" />}
                </button>


                {/* Botões de Impressão e WhatsApp */}
                <div className="flex gap-4">
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <PrinterIcon className="w-5 h-5" />
                    Imprimir Carrinho
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    Finalizar via WhatsApp
                  </button>
                </div>
              </div>

              {/* Garantias */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-primary" />
                  <span>Compra 100% Segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((product) => (
              <div
                key={product.Produto}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <Link href={`/produto/${product.Produto}`}>
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={
                        product?.Imagens?.[0]?.URL || "/placeholder-product.jpg"
                      }
                      alt={product.Descricao || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-sm text-gray-900 line-clamp-2 mb-2">
                    {product.Descricao}
                  </h3>
                  {product.PrecoPromocional > 0 ? (
                    <>
                      <p className="text-sm text-gray-500 line-through">
                        R$ {(product.Preco || 0).toFixed(2)}
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        R$ {(product.PrecoPromocional || 0).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-primary">
                      R$ {(product.Preco || 0).toFixed(2)}
                    </p>
                  )}
                </Link>
                <button
                  onClick={() => addItem(product, 1)}
                  className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                    ${
                      product.PrecoPromocional > 0
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-primary hover:bg-primary-dark text-white"
                    }`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
