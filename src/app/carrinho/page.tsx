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

// Adicionar a tipagem
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, total, addItem, selectedShipping, setSelectedShipping } = useCart();
  const router = useRouter();


  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/minha-conta?returnTo=/carrinho");
    }
  }, [isAuthenticated, router]);

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
    (product) => !items.some((item) => item.Produto === product.Produto)
  );

  // Função para imprimir carrinho
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow?.document.writeln(`
      <html>
        <head>
          <title>Carrinho de Compras - ${empresa[0]?.Fantasia || "Loja"}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
              margin-bottom: 20px;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 10px;
            }
            .company-info {
              font-size: 14px;
              color: #666;
              margin-bottom: 20px;
            }
            .item { 
              padding: 15px;
              border-bottom: 1px solid #eee;
              margin-bottom: 10px;
            }
            .item h3 {
              margin: 0 0 10px 0;
              color: #333;
            }
            .total { 
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #eee;
              font-weight: bold;
              font-size: 18px;
              text-align: right;
            }
            .date {
              text-align: right;
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              empresa[0]?.LogoMarca
                ? `<img src="data:image/png;base64,${empresa[0].LogoMarca}" class="logo" alt="${empresa[0].Fantasia}"/>`
                : ""
            }


            <h3>${empresa[0]?.Fantasia || "Loja"}</h3>
            <div class="company-info">
              ${empresa[0]?.Endereco ? `${empresa[0].Endereco}, ` : ""}
              ${empresa[0]?.Numero ? `${empresa[0].Numero}` : ""}<br/>
              ${empresa[0]?.Cidade ? `${empresa[0].Cidade} - ` : ""}
              ${empresa[0]?.UF || ""}<br/>
              ${empresa[0]?.Fone1 ? `Tel: ${empresa[0].Fone1}` : ""}
            </div>
          </div>

          <div class="date">
            Data: ${new Date().toLocaleDateString()}
          </div>

          <h2>Itens do Pedido</h2>
          <div class="items">
            ${items
              .map(
                (item) => `
              <div class="item">
                <h3>${item.Descricao}</h3>
                <p>Quantidade: ${item.Quantidade}</p>
                <p>Preço: R$ ${(
                  item.PrecoPromocional ||
                  item.Preco ||
                  0
                ).toFixed(2)}</p>
                <p>Subtotal: R$ ${(
                  (item.PrecoPromocional || item.Preco || 0) * item.Quantidade
                ).toFixed(2)}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="total">
            Total: R$ ${total.toFixed(2)}
          </div>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  // Função para enviar pedido via WhatsApp
  const handleWhatsApp = async () => {
    // Criar um elemento temporário para renderizar o conteúdo
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; width: 600px; background: white;">
        <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          ${
            empresa[0]?.LogoMarca
              ? `<img src="data:image/png;base64,${empresa[0].LogoMarca}" style="max-width: 200px; margin-bottom: 10px;" />`
              : ""
          }
          <h3 style="margin: 10px 0;">${empresa[0]?.Fantasia || "Loja"}</h3>
          <div style="font-size: 14px; color: #666;">
            ${empresa[0]?.Endereco ? `${empresa[0].Endereco}, ` : ""}
            ${empresa[0]?.Numero ? `${empresa[0].Numero}` : ""}<br/>
            ${empresa[0]?.Cidade ? `${empresa[0].Cidade} - ` : ""}
            ${empresa[0]?.UF || ""}<br/>
            ${empresa[0]?.Fone1 ? `Tel: ${empresa[0].Fone1}` : ""}
          </div>
        </div>

        <div style="text-align: right; font-size: 12px; color: #666; margin-bottom: 20px;">
          Data: ${new Date().toLocaleDateString()}
        </div>

        <h2 style="margin-bottom: 15px;">Itens do Pedido</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 10px; text-align: left; border: 1px solid #eee;">Produto</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #eee;">Qtd</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #eee;">Preço</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #eee;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #eee;">${
                  item.Descricao
                }</td>
                <td style="padding: 10px; text-align: center; border: 1px solid #eee;">${
                  item.Quantidade
                }</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #eee;">R$ ${(
                  item.PrecoPromocional ||
                  item.Preco ||
                  0
                ).toFixed(2)}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #eee;">R$ ${(
                  (item.PrecoPromocional || item.Preco || 0) * item.Quantidade
                ).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #eee;">Total:</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #eee;">R$ ${total.toFixed(
                2
              )}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Usar html2canvas para converter o HTML em imagem
    const canvas = await import("html2canvas").then((html2canvas) =>
      html2canvas.default(tempDiv, {
        scale: 2,
        backgroundColor: "#ffffff",
      })
    );

    document.body.removeChild(tempDiv);

    // Converter canvas para blob e criar URL para download
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) return;

    // Criar link de download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob as Blob);
    downloadLink.download = "pedido.png";
    downloadLink.click();

    // Criar mensagem apenas com os itens
    const message = `*Novo Pedido*\n\n${items
      .map(
        (item) => `
*${item.Descricao}*
Quantidade: ${item.Quantidade}
Preço: R$ ${(item.PrecoPromocional || item.Preco || 0).toFixed(2)}
Subtotal: R$ ${(
          (item.PrecoPromocional || item.Preco || 0) * item.Quantidade
        ).toFixed(2)}
    `
      )
      .join("\n")}\n\n*Total: R$ ${total.toFixed(
      2
    )}*\n\nA imagem do pedido foi baixada automaticamente.`;

    // Enviar para WhatsApp
    const whatsappUrl = `https://wa.me/5565981170765?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Limpar URL após download
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
  };

  const finalTotal = total + (selectedShipping ? parseFloat(selectedShipping.valor) : 0);

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
                            R$ {item.Preco.toFixed(2)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          R${" "}
                          {(
                            (item.PrecoPromocional || item.Preco) *
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <ShippingCalculator 
                  items={items} 
                  total={total}
                  onSelectShipping={setSelectedShipping}
                  selectedShipping={selectedShipping}
                />
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
                  <span className="text-gray-900">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">
                    {selectedShipping 
                      ? `R$ ${selectedShipping.valor}`
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
                        R$ {finalTotal.toFixed(2)}
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
                  disabled={!selectedShipping}
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
                        R$ {product.Preco.toFixed(2)}
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        R$ {product.PrecoPromocional.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-primary">
                      R$ {product.Preco.toFixed(2)}
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
