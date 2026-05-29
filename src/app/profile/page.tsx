"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { api } from "@/lib/api";

const SPORTS = ["running", "football", "tennis", "padel", "beach_tennis", "cycling", "fight"];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    fitness_level: "",
    sports: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setForm({
        age: user.age?.toString() || "",
        gender: user.gender || "",
        weight: user.weight?.toString() || "",
        height: user.height?.toString() || "",
        fitness_level: user.fitness_level || "",
        sports: user.sports || [],
      });
    }
  }, [user]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.updateProfile({
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        weight: form.weight ? Number(form.weight) : null,
        height: form.height ? Number(form.height) : null,
        fitness_level: form.fitness_level || null,
        sports: form.sports,
      });
      setMessage("Perfil atualizado!");
    } catch {
      setMessage("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  function toggleSport(sport: string) {
    setForm((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("nav.profile")}</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.includes("Erro") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genero</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Selecione</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
            <input
              type="number"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de condicionamento</label>
          <select
            value={form.fitness_level}
            onChange={(e) => setForm({ ...form, fitness_level: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Selecione</option>
            <option value="beginner">{t("level.beginner")}</option>
            <option value="intermediate">{t("level.intermediate")}</option>
            <option value="advanced">{t("level.advanced")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Esportes</label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  form.sports.includes(sport)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {t(`sports.${sport}`)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors font-medium"
        >
          {saving ? "Salvando..." : "Salvar perfil"}
        </button>
      </form>
    </div>
  );
}
