"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <p className="text-gray-600">Analisando seu perfil...</p>
      </div>
    );
  }

  if (recommendations !== null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("rec.title")}</h1>
          <button
            onClick={() => setRecommendations(null)}
            className="text-sm text-emerald-600 hover:underline"
          >
            Refazer questionario
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t("rec.empty")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.product.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round(rec.score * 10)}% match
                </div>
                <ProductCard product={rec.product} reasons={rec.reasons} />
              </div>
            ))}
          </div>
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
