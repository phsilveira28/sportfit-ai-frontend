"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";

const SPEC_LABELS: Record<string, string> = {
  drop_mm: "Drop (mm)",
  weight_g: "Peso (g)",
  pronation: "Pisada",
  plate: "Placa",
  terrain: "Terreno",
  head_size_cm2: "Cabeça (cm²)",
  balance: "Equilíbrio",
  shape: "Formato",
  weight_oz: "Peso (oz)",
  frame: "Quadro",
  gears: "Marchas",
};

const CATEGORY_EMOJI: Record<string, string> = {
  shoes: "👟", racket: "🏸", ball: "⚽", bike: "🚲",
  helmet: "⛑️", gloves: "🥊", uniform: "🥋", protection: "🛡️",
  clothing: "👕", accessories: "🎒",
};

export default function ComparePage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",").map(Number).filter(Boolean) || [];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => api.getProduct(id)))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Comparar Produtos</h1>
        <p className="text-gray-500">Selecione produtos para comparar na página de recomendações.</p>
        <Link href="/recommend" className="mt-4 inline-block text-emerald-600 hover:underline">
          ← Ir para recomendações
        </Link>
      </div>
    );
  }

  // Collect all spec keys across products
  const allSpecs = new Set<string>();
  products.forEach((p) => Object.keys(p.specs).forEach((k) => allSpecs.add(k)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comparar Produtos</h1>
        <Link href="/recommend" className="text-sm text-emerald-600 hover:underline">
          ← Voltar às recomendações
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-50 rounded-tl-lg w-40"></th>
              {products.map((p) => (
                <th key={p.id} className="p-3 bg-gray-50 text-center min-w-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{CATEGORY_EMOJI[p.category] || "📦"}</span>
                    <span className="text-xs text-emerald-600 font-semibold">{p.brand}</span>
                    <span className="text-sm font-bold text-gray-900 line-clamp-2">{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-t">
              <td className="p-3 text-sm font-medium text-gray-600">Preço</td>
              {products.map((p) => {
                const lowest = Math.min(...products.map((x) => x.price));
                return (
                  <td key={p.id} className="p-3 text-center">
                    <span className={`text-lg font-bold ${p.price === lowest ? "text-emerald-600" : "text-gray-900"}`}>
                      R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    {p.price === lowest && <span className="block text-xs text-emerald-500">Melhor preço</span>}
                  </td>
                );
              })}
            </tr>

            {/* Rating */}
            <tr className="border-t bg-gray-50">
              <td className="p-3 text-sm font-medium text-gray-600">Avaliação</td>
              {products.map((p) => {
                const highest = Math.max(...products.map((x) => x.rating));
                return (
                  <td key={p.id} className="p-3 text-center">
                    <span className={`font-bold ${p.rating === highest ? "text-amber-500" : "text-gray-700"}`}>
                      {"⭐".repeat(Math.round(p.rating))} {p.rating}
                    </span>
                    <span className="block text-xs text-gray-400">{p.review_count.toLocaleString("pt-BR")} avaliações</span>
                  </td>
                );
              })}
            </tr>

            {/* Specs */}
            {Array.from(allSpecs).map((spec, idx) => (
              <tr key={spec} className={`border-t ${idx % 2 === 0 ? "" : "bg-gray-50"}`}>
                <td className="p-3 text-sm font-medium text-gray-600">
                  {SPEC_LABELS[spec] || spec.replace(/_/g, " ")}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-sm text-gray-800">
                    {p.specs[spec] !== undefined ? String(p.specs[spec]) : "—"}
                  </td>
                ))}
              </tr>
            ))}

            {/* Description */}
            <tr className="border-t">
              <td className="p-3 text-sm font-medium text-gray-600">Descrição</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 text-xs text-gray-600 leading-relaxed">
                  {p.description}
                </td>
              ))}
            </tr>

            {/* Buy links */}
            <tr className="border-t bg-gray-50">
              <td className="p-3 text-sm font-medium text-gray-600">Comprar</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <a
                    href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(p.brand + " " + p.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-emerald-600"
                  >
                    Ver preços →
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
