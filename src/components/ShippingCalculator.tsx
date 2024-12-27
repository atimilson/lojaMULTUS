'use client'

import { useState } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';

interface ShippingCalculatorProps {
  productId: number;
}

export function ShippingCalculator({ productId }: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    setCep(value);
  };

  const calculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Aqui você pode integrar com a API de cálculo de frete
      // Por enquanto, vamos simular alguns resultados
      const mockShipping = [
        { service: 'PAC', price: 25.90, days: 8 },
        { service: 'SEDEX', price: 45.90, days: 3 },
      ];

      setShippingOptions(mockShipping);
    } catch (err) {
      setError('Erro ao calcular o frete. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <TruckIcon className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Calcular Frete</h3>
      </div>

      <form onSubmit={calculateShipping} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite seu CEP"
              value={cep}
              onChange={handleCepChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={9}
            />
          </div>
          <button
            type="submit"
            disabled={cep.length < 8 || isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Calcular
          </button>
        </div>

        <div className="text-sm">
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Não sei meu CEP
          </a>
        </div>

        {isLoading && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {shippingOptions.length > 0 && (
          <div className="space-y-2">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white rounded-lg border"
              >
                <div>
                  <p className="font-medium">{option.service}</p>
                  <p className="text-sm text-gray-600">
                    Entrega em até {option.days} dias úteis
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    R$ {option.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
} 