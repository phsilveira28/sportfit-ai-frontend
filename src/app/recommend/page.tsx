"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import Questionnaire from "@/components/Questionnaire";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { Recommendation, QuestionnaireData } from "@/types";

export default function RecommendPage() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [compareIds, setCompareIds] = useState<number[]>([]);

  function toggleCompare(id: number) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(data: QuestionnaireData) {
    setFetching(true);
    setError("");
    try {
      const recs = await api.getRecommendations(data);
      setRecommendations(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get recommendations");
    } finally {
      setFetching(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
        <p className="text-gray-600">Analisando seu perfil e encontrando os melhores equipamentos...</p>
      </div>
    );
  }

  if (recommendations !== null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("rec.title")}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {recommendations.length} {recommendations.length === 1 ? "produto encontrado" : "produtos encontrados"} para você
            </p>
          </div>
          <button
            onClick={() => setRecommendations(null)}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
          >
            ← Nova busca
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado nessa faixa</p>
            <p className="text-gray-400 text-sm mt-2">
              Tente ajustar seu orçamento ou objetivos
            </p>
            <button
              onClick={() => setRecommendations(null)}
              className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Refazer busca
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={rec.product.id} className="relative">
                  {/* Match percentage badge */}
                  <div className={`absolute -top-3 -right-3 z-10 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    rec.match_percent >= 85 ? "bg-emerald-500" :
                    rec.match_percent >= 65 ? "bg-emerald-400" :
                    rec.match_percent >= 45 ? "bg-yellow-500" : "bg-orange-400"
                  }`}>
                    {rec.match_percent}%
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-3 -left-3 z-10 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                      ⭐ Top Pick
                    </div>
                  )}
                  {/* Compare checkbox */}
                  <button
                    onClick={() => toggleCompare(rec.product.id)}
                    className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all ${
                      compareIds.includes(rec.product.id)
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white/80 border-gray-300 text-transparent hover:border-blue-400"
                    }`}
                    title="Adicionar à comparação"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <ProductCard product={rec.product} reasons={rec.reasons} />
                </div>
              ))}
            </div>

            {/* Floating compare bar */}
            {compareIds.length >= 2 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
                <span className="text-sm font-medium">{compareIds.length} selecionados</span>
                <Link
                  href={`/compare?ids=${compareIds.join(",")}`}
                  className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors"
                >
                  Comparar →
                </Link>
                <button
                  onClick={() => setCompareIds([])}
                  className="text-blue-200 hover:text-white text-xs"
                >
                  Limpar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        {t("questionnaire.title")}
      </h1>
      <p className="text-gray-500 text-center mb-12">
        {t("app.subtitle")}
      </p>
      <Questionnaire onSubmit={handleSubmit} />
    </div>
  );
}
