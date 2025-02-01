"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
  CubeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGetApiProdutoEcommerce } from '@/api/generated/mCNSistemas';
import type { ProdutosEcommerceDto as Product } from '@/api/generated/mCNSistemas.schemas';
import toast from "react-hot-toast";

export default function ProdutosPage() {
  const { isLoading: isAuthLoading, error: authError } = useAuth();
  const { addItem } = useCart();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<string>("menor_preco");

  const { data: products = [], error: apiError, isLoading } = useGetApiProdutoEcommerce({
    empresa: 1
  }, {
    swr: {
      enabled: !isAuthLoading && !authError
    }
  });

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 relative w-12 h-12">
          <Image
            src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
            alt={product.Descricao || ''}
            fill
            className="object-contain"

          />
        </div>
        <div>
          <p className="font-medium">Produto adicionado ao carrinho!</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.Descricao}
          </p>
          <p className="text-sm text-gray-500">Quantidade: {1}</p>
        </div>
      </div>
    );
  };

  // Extrair marcas únicas
  const brands = useMemo(() => {
    if (!products.length) return [];
    const brandSet = new Set(
      products.map((p) => p.Marca).filter((brand): brand is string => !!brand)
    );
    return Array.from(brandSet);
  }, [products]);

  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (p) => p.Marca && selectedBrands.includes(p.Marca)
      );
    }

    // Aplicar filtro de preço
    filtered = filtered.filter((p) => {
      const price = p.Preco;
      return price && price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenação
    switch (sortOrder) {
      case "menor_preco":
        filtered.sort((a, b) => (a.Preco || 0) - (b.Preco || 0));
        break;
      case "maior_preco":
        filtered.sort((a, b) => (b.Preco || 0) - (a.Preco || 0));

        break;
      case "nome":
        filtered.sort((a, b) => a.Descricao?.localeCompare(b.Descricao || '') || 0);
        break;
    }

    return filtered;
  }, [products, selectedBrands, priceRange, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Banner Principal */}
        <div className="bg-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <CubeIcon className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Nossos Produtos</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <div className="w-full lg:w-64 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-black">
                    <FunnelIcon className="w-5 h-5" />
                    Filtros
                  </h3>
                </div>

                {/* Marcas */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-black">Marcas</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 text-black"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => {
                            setSelectedBrands((prev) =>
                              prev.includes(brand)
                                ? prev.filter((b) => b !== brand)
                                : [...prev, brand]
                            );
                          }}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid" ? "bg-gray-100" : ""
                    }`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list" ? "bg-gray-100" : ""
                    }`}
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} produtos encontrados
                  </span>
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="menor_preco">Menor Preço</option>
                  <option value="maior_preco">Maior Preço</option>
                  <option value="nome">Nome</option>
                </select>
              </div>

              {/* Grid de Produtos */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.Produto}
                    href={`/produto/${product.Produto}`}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`p-4 ${
                        viewMode === "list" ? "flex gap-6" : ""
                      }`}
                    >
                      <div
                        className={`
                        relative aspect-square mb-4
                        ${viewMode === "list" ? "w-48 mb-0" : ""}
                      `}
                      >
                        <Image
                          src={product.Imagens?.[0]?.URL || "/placeholder.jpg"}
                          alt={product.Descricao || ''}
                          fill
                          className="object-contain"

                        />
                      </div>

                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.Descricao}
                        </h3>

                        <div className="space-y-1">
                          { product.PrecoPromocional > 0 && (
                            <p className="text-gray-500 text-sm line-through">
                              De: R$ {product.Preco?.toFixed(2) || '0.00'}
                            </p>
                          )}

                          <p className="text-xl font-bold text-primary">
                            R${" "}
                            {(
                              product.PrecoPromocional || product.Preco
                            ).toFixed(2)}
                          </p>

                        </div>

                        {viewMode === "list" && (product.DescEcommerce || product.Descricao) && (
                          <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                            {product.DescEcommerce || product.Descricao}
                          </p>
                        )}

                      </div>
                    </div>
                    {/* Botão Adicionar ao Carrinho */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                        ${
                           product.PrecoPromocional > 0
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-primary hover:bg-primary-dark text-white"
                        }`}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">
                    Nenhum produto encontrado com os filtros selecionados
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setPriceRange([0, 5000]);
                    }}
                    className="mt-4 text-primary hover:text-primary-dark font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
