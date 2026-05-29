"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Locale } from "@/lib/i18n";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            Sport<span className="text-emerald-500">Fit</span> AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            {t("nav.home")}
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm">
            {t("nav.products")}
          </Link>
          {user && (
            <Link href="/recommend" className="text-gray-600 hover:text-gray-900 text-sm">
              {t("nav.recommendations")}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  locale === l.code
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
