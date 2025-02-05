"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useEcommerceUser } from "@/hooks/useEcommerceUser";
import { useEcommerceAddress } from "@/hooks/useEcommerceAddress";
import { UsuarioEcommerceEnderecoDto } from "@/api/generated/mCNSistemas.schemas";

interface CheckoutFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: {
    zipcode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  payment: {
    method: "credit_card" | "boleto" | "pix" | "debit_card";
    installments: number;
  };
}

export default function CheckoutPage() {
  const { items, total, selectedShipping } = useCart();
  const router = useRouter();
  const { user, isLoading: userLoading } = useEcommerceUser();
  const { addresses , isLoading: addressLoading } = useEcommerceAddress();
  const enderecoCliente : UsuarioEcommerceEnderecoDto = addresses[0];


  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: {
      zipcode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    payment: {
      method: "credit_card",
      installments: 1,
    },
  });

  useEffect(() => {
    if (user && addresses?.[0]) {
      console.log(addresses[0]);
      setFormData(prev => ({
        ...prev,
        name: user.Nome || '',
        email: user.Email || '',
        cpf: user.CPFouCNPJ || '',
        phone: user.Fone || '',
        address: {
          zipcode: enderecoCliente?.CEP || '',
          street: enderecoCliente?.Endereco || '',
          number: enderecoCliente?.Numero || '',
          complement: enderecoCliente?.Complemento || '',
          neighborhood: enderecoCliente?.Bairro || '',
          city: enderecoCliente?.Cidade || '',
          state: enderecoCliente?.UF || ''
        }
      }));
    }
  }, [user, addresses]);

  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    let value = ((total + (selectedShipping?.valor ? parseFloat(selectedShipping.valor) : 0)) / (i + 1));
    if (i > 0) {
      value = value + (2.5 * i);
    }
    return {
      number: i + 1,
      value: value,
      total: value * (i + 1),
    };


  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/pagbank/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
          },
          shipping: formData.address,
          payment: formData.payment,
        }),
      });

      const data = await response.json();

      if (data.id) {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Dados Pessoais - Somente Leitura */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Dados Pessoais</h2>
                {userLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                        {formData.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                        {formData.email}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {formData.cpf}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {formData.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Endereço - Somente Leitura */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Endereço de Entrega</h2>
                {addressLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : addresses && addresses.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700">
                          {`${formData.address.street} N:${formData.address.number}`}
                          {formData.address.complement && ` - ${formData.address.complement}`}
                          <br />
                          {`${formData.address.neighborhood} - ${formData.address.city}/${formData.address.state}`}
                          <br />
                          {`CEP: ${formData.address.zipcode}`}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.address.zipcode}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, zipcode: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="00000-000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.address.number}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, number: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.address.complement}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, complement: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={formData.address.neighborhood}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, neighborhood: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, city: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          value={formData.address.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: { ...formData.address, state: e.target.value }
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          {/* ... outros estados ... */}
                          <option value="SP">São Paulo</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagamento */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Forma de Pagamento</h2>
                <div className="space-y-4">
                  {/* Métodos de Pagamento */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="credit_card"
                        checked={formData.payment.method === "credit_card"}
                        onChange={() => setFormData({
                          ...formData,
                          payment: { ...formData.payment, method: "credit_card" }
                        })}
                      />
                      <span className="ml-2">Cartão de Crédito</span>
                    </label>

                    <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="debit_card"
                        checked={formData.payment.method === "debit_card"}
                        onChange={() => setFormData({
                          ...formData,
                          payment: { ...formData.payment, method: "debit_card" }
                        })}
                      />
                      <span className="ml-2">Cartão de Débito</span>
                    </label>

                    <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="boleto"
                        checked={formData.payment.method === "boleto"}
                        onChange={() => setFormData({
                          ...formData,
                          payment: { ...formData.payment, method: "boleto" }
                        })}
                      />
                      <span className="ml-2">Boleto</span>
                    </label>

                    <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="pix"
                        checked={formData.payment.method === "pix"}
                        onChange={() => setFormData({
                          ...formData,
                          payment: { ...formData.payment, method: "pix" }
                        })}
                      />
                      <span className="ml-2">PIX</span>
                    </label>
                  </div>

                  {/* Campos do Cartão */}
                  {(formData.payment.method === "credit_card" || formData.payment.method === "debit_card") && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome no Cartão
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Como está impresso no cartão"
                        />
                      </div>

                      {formData.payment.method === "credit_card" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parcelas
                          </label>
                          <select
                            className="w-full px-4 py-2 border rounded-lg"
                            value={formData.payment.installments}
                            onChange={(e) => setFormData({
                              ...formData,
                              payment: { ...formData.payment, installments: Number(e.target.value) }
                            })}
                          >
                            {installmentOptions.map(option => (
                              <option key={option.number} value={option.number}>
                                {option.number}x de R$ {option.value.toFixed(2)}
                                {option.number > 1 ? ` (Total: R$ ${option.total.toFixed(2)})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg"
              >
                Finalizar Compra
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
              {/* Lista de Itens */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{item.Descricao}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.Quantidade}</p>
                    </div>
                    <p className="font-medium">
                      R$ {((item.PrecoPromocional || item.Preco || 0) * item.Quantidade).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span>R$ {selectedShipping?.valor || '0.00'}</span>
                </div>

                {formData.payment.method === "credit_card" && formData.payment.installments > 1 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Juros</span>
                    <span>R$ {(total * 0.0199).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {(total + (selectedShipping?.valor ? parseFloat(selectedShipping.valor) : 0) + (total * 0.0199)).toFixed(2)}
                  </span>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
