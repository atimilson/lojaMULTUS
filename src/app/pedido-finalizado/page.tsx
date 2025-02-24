"use client";

import { Header } from "@/components/Header";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Pedido realizado com sucesso!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Agradecemos sua compra. Você receberá um e-mail com os detalhes do pedido.
            </p>

            <div className="space-y-4">
              <Link 
                href="/minha-conta/pedidos"
                className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark"
              >
                Acompanhar Pedido
              </Link>
              
              <Link 
                href="/"
                className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Voltar para a Loja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 