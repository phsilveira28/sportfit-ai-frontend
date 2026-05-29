"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";
import { Product } from "@/types";

const CATEGORY_EMOJI: Record<string, string> = {
  shoes: "👟",
  racket: "🏸",
  ball: "⚽",
  bike: "🚲",
  helmet: "⛑️",
  gloves: "🥊",
  uniform: "🥋",
  protection: "🛡️",
  clothing: "👕",
  accessories: "🎒",
};

const STORE_NAMES: Record<string, { label: string; color: string }> = {
  centauro: { label: "Centauro", color: "bg-orange-500 hover:bg-orange-600" },
  decathlon: { label: "Decathlon", color: "bg-blue-600 hover:bg-blue-700" },
  nike: { label: "Nike.com.br", color: "bg-black hover:bg-gray-800" },
  adidas: { label: "Adidas.com.br", color: "bg-black hover:bg-gray-800" },
  asics: { label: "ASICS.com.br", color: "bg-blue-700 hover:bg-blue-800" },
  newbalance: { label: "New Balance", color: "bg-red-600 hover:bg-red-700" },
  mizuno: { label: "Mizuno.com.br", color: "bg-gray-800 hover:bg-gray-900" },
  netshoes: { label: "Netshoes", color: "bg-purple-600 hover:bg-purple-700" },
  google_shopping: { label: "Google Shopping", color: "bg-emerald-600 hover:bg-emerald-700" },
};

const SPEC_LABELS: Record<string, string> = {
  drop_mm: "Drop",
  weight_g: "Peso",
  pronation: "Pisada",
  plate: "Placa",
  terrain: "Terreno",
  head_size_cm2: "Cabeça",
  balance: "Equilíbrio",
  shape: "Formato",
  material: "Material",
  frame: "Quadro",
  gears: "Marchas",
  wheel_size: "Aro",
  protection: "Proteção",
  weight_oz: "Peso (oz)",
  closure: "Fechamento",
  fabric: "Tecido",
  weight_kg: "Peso (kg)",
  field_type: "Tipo campo",
  cleat_type: "Trava",
  size: "Tamanho",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProduct(Number(id))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Produto não encontrado.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-emerald-600 hover:underline"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  const emoji = CATEGORY_EMOJI[product.category] || "📦";
  const buyLinks = (product as Product & { buy_links?: Record<string, string> }).buy_links || {};
  const hasImage = product.image_url && product.image_url.length > 10;

  // Build a Google Shopping search URL as fallback
  const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(product.brand + " " + product.name)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Voltar aos resultados</span>
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product image */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center min-h-[400px]">
          {hasImage ? (
            <img
              src={product.image_url || ""}
              alt={product.name}
              className="max-h-[350px] max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div className={`flex flex-col items-center justify-center ${hasImage ? "hidden" : ""}`}>
            <span className="text-8xl mb-4">{emoji}</span>
            <span className="text-lg font-bold text-gray-300 uppercase tracking-widest">{product.brand}</span>
          </div>
        </div>

        {/* Product info */}
        <div>
          <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wide">
            {product.brand}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= product.rating ? "text-yellow-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.review_count.toLocaleString("pt-BR")} avaliações)
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="text-3xl font-bold text-gray-900 mb-6">
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Especificações
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-500">{SPEC_LABELS[key] || key.replace(/_/g, " ")}:</span>{" "}
                    <span className="font-medium text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Buy links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              🛒 Onde comprar
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(buyLinks).map(([store, url]) => {
                const storeInfo = STORE_NAMES[store] || { label: store, color: "bg-gray-600 hover:bg-gray-700" };
                return (
                  <a
                    key={store}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${storeInfo.color} text-white text-sm font-medium px-4 py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2`}
                  >
                    {storeInfo.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })}
              {/* Always show Google Shopping as fallback */}
              {!buyLinks.google_shopping && (
                <a
                  href={googleShoppingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  Google Shopping
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
