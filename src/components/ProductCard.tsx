"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useLocale } from "@/contexts/LocaleContext";

const SPORT_COLORS: Record<string, string> = {
  running: "bg-blue-100 text-blue-700",
  football: "bg-green-100 text-green-700",
  tennis: "bg-yellow-100 text-yellow-700",
  padel: "bg-orange-100 text-orange-700",
  beach_tennis: "bg-amber-100 text-amber-700",
  cycling: "bg-red-100 text-red-700",
  fight: "bg-purple-100 text-purple-700",
};

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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );
}

export default function ProductCard({
  product,
  reasons,
}: {
  product: Product;
  reasons?: string[];
}) {
  const { t } = useLocale();
  const sportColor = SPORT_COLORS[product.sport] || "bg-gray-100 text-gray-700";
  const emoji = CATEGORY_EMOJI[product.category] || "📦";
  const hasImage = product.image_url && !product.image_url.includes("ui-avatars") && product.image_url.length > 10;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product image area */}
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative">
        {hasImage ? (
          <img
            src={product.image_url || ""}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`flex flex-col items-center justify-center ${hasImage ? "hidden" : ""}`}>
          <span className="text-5xl mb-2">{emoji}</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${sportColor}`}>
            {t(`sports.${product.sport}`)}
          </span>
          <span className="text-xs text-gray-400 font-medium">{product.brand}</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>

        <Stars rating={product.rating} />

        <p className="text-xs text-gray-500 mt-1">
          {product.review_count.toLocaleString("pt-BR")} {t("product.reviews")}
        </p>

        {reasons && reasons.length > 0 && (
          <div className="mt-3 space-y-1">
            {reasons.slice(0, 3).map((reason, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-700">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {reason}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="text-sm bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {t("product.details")}
          </Link>
        </div>
      </div>
    </div>
  );
}
