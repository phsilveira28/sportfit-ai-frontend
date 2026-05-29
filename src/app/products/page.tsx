"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { Product } from "@/types";

const SPORTS = ["running", "football", "tennis", "padel", "beach_tennis", "cycling", "fight"];

export default function ProductsPage() {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (selectedSport) params.sport = selectedSport;
    if (search) params.search = search;

    api
      .getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedSport, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("nav.products")}
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSport("")}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              !selectedSport
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            Todos
          </button>
          {SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport === selectedSport ? "" : sport)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedSport === sport
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {t(`sports.${sport}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Nenhum produto encontrado.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
