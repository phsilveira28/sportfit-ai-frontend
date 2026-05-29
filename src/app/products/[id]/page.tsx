"use client";

import { useState, useEffect, use } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";
import { Product } from "@/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();
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
        <p className="text-gray-500 text-lg">Produto nao encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center min-h-[400px]">
          <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-6xl">
              {product.category === "shoes" && "👟"}
              {product.category === "racket" && "🏸"}
              {product.category === "ball" && "⚽"}
              {product.category === "bike" && "🚲"}
              {product.category === "helmet" && "⛑️"}
              {product.category === "gloves" && "🥊"}
              {product.category === "uniform" && "🥋"}
              {product.category === "protection" && "🛡️"}
            </span>
          </div>
        </div>

        <div>
          <span className="text-sm text-emerald-600 font-medium">
            {product.brand}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= product.rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.review_count} {t("product.reviews")})
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="text-3xl font-bold text-gray-900 mb-6">
            R$ {product.price.toFixed(2)}
          </div>

          {Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Especificacoes
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 px-3 py-2 rounded-lg text-sm"
                  >
                    <span className="text-gray-500">
                      {key.replace(/_/g, " ")}:
                    </span>{" "}
                    <span className="font-medium text-gray-900">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button className="w-full py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold text-lg">
            {t("product.buy")}
          </button>
        </div>
      </div>
    </div>
  );
}
