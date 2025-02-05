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
    method: "credit_card" | "boleto" | "pix";
    installments: number;
  };
}

export default function CheckoutPage() {
  const { items, total } = useCart();
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
    const value = total / (i + 1);
    return {
      number: i + 1,
      value,
      total: i === 0 ? total : total * 1.0199, // 1.99% de juros
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
                  <div className="flex gap-4">
                    <label className="flex-1 border rounded-lg p-4 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="credit_card"
                        checked={formData.payment.method === "credit_card"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            payment: {
                              ...formData.payment,
                              method: "credit_card",
                            },
                          })
                        }
                      />
                      <span className="ml-2">Cartão de Crédito</span>
                    </label>
                    {/* ... outros métodos ... */}
                  </div>

                  {/* Parcelas */}
                  {formData.payment.method === "credit_card" && (
                    <select
                      className="w-full border rounded-lg p-2"
                      value={formData.payment.installments}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment: {
                            ...formData.payment,
                            installments: Number(e.target.value),
                          },
                        })
                      }
                    >
                      {installmentOptions.map((option) => (
                        <option key={option.number} value={option.number}>
                          {option.number}x de R$ {option.value.toFixed(2)}
                          {option.number > 1
                            ? ` (Total: R$ ${option.total.toFixed(2)})`
                            : ""}
                        </option>
                      ))}
                    </select>
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
            {/* ... resumo do pedido ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
