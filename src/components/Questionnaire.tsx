"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { QuestionnaireData } from "@/types";

const SPORTS = ["running", "football", "tennis", "padel", "beach_tennis", "cycling", "fight"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const FREQUENCIES = ["1-2x", "3-4x", "5+"];
const BUDGETS = ["low", "medium", "high"];
const GOALS = ["performance", "comfort", "durability", "style"];

const PRONATION_OPTIONS = [
  { value: "neutral", label: "Neutra", desc: "Pisada equilibrada, sem desvio" },
  { value: "overpronation", label: "Pronada", desc: "Pé vira para dentro ao pisar" },
  { value: "supination", label: "Supinada", desc: "Pé vira para fora ao pisar" },
  { value: "unknown", label: "Não sei", desc: "Nunca fiz teste de pisada" },
];

const DISTANCE_OPTIONS = [
  { value: "short", label: "Curta (até 5km)" },
  { value: "medium", label: "Média (5-15km)" },
  { value: "long", label: "Longa (15km+)" },
  { value: "marathon", label: "Maratona (42km)" },
];

const TERRAIN_OPTIONS = [
  { value: "road", label: "Asfalto / Rua" },
  { value: "track", label: "Pista de atletismo" },
  { value: "trail", label: "Trilha / Terra" },
  { value: "treadmill", label: "Esteira" },
];

type StepType = "options" | "multi" | "form" | "text" | "running_specific";

interface Step {
  key: string;
  title: string;
  subtitle?: string;
  type: StepType;
  options?: { value: string; label: string; desc?: string }[];
  showIf?: () => boolean;
}

export default function Questionnaire({
  onSubmit,
}: {
  onSubmit: (data: QuestionnaireData) => void;
}) {
  const { t } = useLocale();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuestionnaireData>({
    sport: "",
    level: "",
    frequency: "",
    budget: "",
    goals: [],
    specific_needs: {},
  });

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [previousShoe, setPreviousShoe] = useState("");
  const [shoeFeeling, setShoeFeeling] = useState("");

  const allSteps: Step[] = [
    {
      key: "sport",
      title: t("questionnaire.sport"),
      type: "options",
      options: SPORTS.map((s) => ({ value: s, label: t(`sports.${s}`) })),
    },
    {
      key: "level",
      title: t("questionnaire.level"),
      type: "options",
      options: LEVELS.map((l) => ({ value: l, label: t(`level.${l}`) })),
    },
    {
      key: "frequency",
      title: t("questionnaire.frequency"),
      type: "options",
      options: FREQUENCIES.map((f) => ({ value: f, label: t(`freq.${f}`) })),
    },
    {
      key: "body",
      title: "Seus dados físicos",
      subtitle: "Isso nos ajuda a recomendar equipamentos adequados ao seu corpo",
      type: "form",
    },
    {
      key: "pronation",
      title: "Qual seu tipo de pisada?",
      subtitle: "Se não sabe, tudo bem — recomendaremos com base nos outros dados",
      type: "options",
      options: PRONATION_OPTIONS,
      showIf: () => data.sport === "running",
    },
    {
      key: "distance",
      title: "Qual distância você costuma correr?",
      type: "options",
      options: DISTANCE_OPTIONS,
      showIf: () => data.sport === "running",
    },
    {
      key: "terrain",
      title: "Onde você corre normalmente?",
      type: "options",
      options: TERRAIN_OPTIONS,
      showIf: () => data.sport === "running",
    },
    {
      key: "previous_shoe",
      title: "Tênis que você já usou",
      subtitle: "Nos conte sobre sua experiência com tênis anteriores",
      type: "text",
    },
    {
      key: "budget",
      title: t("questionnaire.budget"),
      type: "options",
      options: BUDGETS.map((b) => ({ value: b, label: t(`budget.${b}`) })),
    },
    {
      key: "goals",
      title: t("questionnaire.goals"),
      subtitle: "Selecione um ou mais",
      type: "multi",
      options: GOALS.map((g) => ({ value: g, label: t(`goal.${g}`) })),
    },
  ];

  const visibleSteps = allSteps.filter((s) => !s.showIf || s.showIf());
  const currentStep = visibleSteps[step];
  const isLast = step === visibleSteps.length - 1;

  function getCanProceed(): boolean {
    if (!currentStep) return false;
    switch (currentStep.key) {
      case "goals":
        return data.goals.length > 0;
      case "body":
        return true; // optional
      case "previous_shoe":
        return true; // optional
      default:
        return getFieldValue(currentStep.key) !== "";
    }
  }

  function getFieldValue(key: string): string {
    if (key === "pronation" || key === "distance" || key === "terrain") {
      return data.specific_needs[key] || "";
    }
    return (data as unknown as Record<string, string>)[key] || "";
  }

  function handleSelect(key: string, value: string) {
    if (key === "goals") {
      setData((prev) => ({
        ...prev,
        goals: prev.goals.includes(value)
          ? prev.goals.filter((g) => g !== value)
          : [...prev.goals, value],
      }));
    } else if (["pronation", "distance", "terrain"].includes(key)) {
      setData((prev) => ({
        ...prev,
        specific_needs: { ...prev.specific_needs, [key]: value },
      }));
    } else {
      setData((prev) => ({ ...prev, [key]: value }));
    }
  }

  function handleNext() {
    // Save body data into specific_needs
    if (currentStep.key === "body") {
      setData((prev) => ({
        ...prev,
        specific_needs: {
          ...prev.specific_needs,
          ...(weight ? { weight } : {}),
          ...(height ? { height } : {}),
        },
      }));
    }
    if (currentStep.key === "previous_shoe") {
      setData((prev) => ({
        ...prev,
        specific_needs: {
          ...prev.specific_needs,
          ...(previousShoe ? { previous_shoe: previousShoe } : {}),
          ...(shoeFeeling ? { shoe_feeling: shoeFeeling } : {}),
        },
      }));
    }

    if (isLast) {
      onSubmit(data);
    } else {
      setStep((s) => s + 1);
    }
  }

  function renderStepContent() {
    if (!currentStep) return null;

    if (currentStep.type === "form") {
      return (
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 75"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Ex: 175"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            />
          </div>
        </div>
      );
    }

    if (currentStep.type === "text") {
      return (
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qual tênis você usa atualmente ou já usou? (opcional)
            </label>
            <input
              type="text"
              value={previousShoe}
              onChange={(e) => setPreviousShoe(e.target.value)}
              placeholder="Ex: Nike Pegasus 40, ASICS Gel-Nimbus 25..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O que gostou ou não gostou nele? (opcional)
            </label>
            <textarea
              value={shoeFeeling}
              onChange={(e) => setShoeFeeling(e.target.value)}
              placeholder="Ex: Achei pesado demais, mas o amortecimento era bom..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white resize-none"
            />
          </div>
        </div>
      );
    }

    // Options or multi
    const selectedValue =
      currentStep.key === "goals"
        ? data.goals
        : getFieldValue(currentStep.key);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {(currentStep.options || []).map((opt) => {
          const isSelected = Array.isArray(selectedValue)
            ? selectedValue.includes(opt.value)
            : selectedValue === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(currentStep.key, opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
              }`}
            >
              <span className="text-sm font-medium block">{opt.label}</span>
              {opt.desc && (
                <span className="text-xs text-gray-500 block mt-1">
                  {opt.desc}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-1 mb-8">
        {visibleSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {currentStep?.title}
      </h2>
      {currentStep?.subtitle && (
        <p className="text-gray-500 text-sm mb-6">{currentStep.subtitle}</p>
      )}

      {renderStepContent()}

      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
          >
            Voltar
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!getCanProceed()}
          className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLast ? t("questionnaire.submit") : "Continuar"}
        </button>
      </div>
    </div>
  );
}
