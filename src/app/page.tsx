"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";

const SPORTS = [
  { key: "running", emoji: "🏃" },
  { key: "football", emoji: "⚽" },
  { key: "tennis", emoji: "🎾" },
  { key: "padel", emoji: "🏓" },
  { key: "beach_tennis", emoji: "🏖️" },
  { key: "cycling", emoji: "🚴" },
  { key: "fight", emoji: "🥊" },
];

export default function Home() {
  const { t } = useLocale();
  const { user } = useAuth();

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <Link
            href={user ? "/recommend" : "/register"}
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-lg"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">{n}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t(`features.step${n}.title`)}
              </h3>
              <p className="text-gray-600">{t(`features.step${n}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t("questionnaire.sport")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {SPORTS.map((sport) => (
              <Link
                key={sport.key}
                href={user ? `/recommend?sport=${sport.key}` : "/register"}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <span className="text-3xl">{sport.emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {t(`sports.${sport.key}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>SportFit AI - {t("app.subtitle")}</p>
        </div>
      </footer>
    </div>
  );
}
