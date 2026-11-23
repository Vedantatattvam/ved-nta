import { useState, useEffect } from "react";
import { TRANSLATION_EXAMPLES } from "../data";
import { TranslationState } from "../types";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import { Sparkles, Languages, BookOpen, AlertCircle } from "lucide-react";
import { CitationButton } from "./CitationButton";
import { GlossaryHover } from "./GlossaryHover";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import { saveSearchHistory } from "../utils/searchHistoryStorage";

interface TranslationUtilityProps {
  initialText?: string;
  initialContext?: string;
}

export default function TranslationUtility({
  initialText,
  initialContext,
}: TranslationUtilityProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [state, setState] = useState<TranslationState>({
    text: initialText || "",
    context: initialContext || "",
    isProcessing: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    if (initialText || initialContext) {
      setState((prev) => ({
        ...prev,
        text: initialText ?? prev.text,
        context: initialContext ?? prev.context,
      }));
    }
  }, [initialText, initialContext]);


  const handleTranslate = async () => {
    if (!state.text.trim()) return;

    saveSearchHistory({
      query: state.text,
      type: "translation",
      context: state.context,
    });

    setState((prev) => ({ ...prev, isProcessing: true, error: null, result: null }));
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: state.text,
          context: state.context,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to make translation request.");
      }

      const data = await res.json();
      setState((prev) => ({ ...prev, isProcessing: false, result: data.result }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, isProcessing: false, error: err.message }));
    }
  };

  const loadExample = (text: string, context: string) => {
    setState((prev) => ({
      ...prev,
      text,
      context,
      result: null,
      error: null,
    }));
  };

  const handleClear = () => {
    setState({ text: "", context: "", isProcessing: false, result: null, error: null });
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="card-3d-gold p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-5 h-5 text-[#8c6011]" />
          <h3 className="font-serif font-bold gold-text-gradient text-base sm:text-lg">
            Precision Translation & Ontological Exegesis
          </h3>
        </div>
        <div className="text-sm text-[#4a3928] leading-relaxed">
          Vedantic texts require rigorous metaphysical translations (avoiding loose terms like 'Soul' for <GlossaryHover termName="Ātman">Ātman</GlossaryHover> or 'God' for <GlossaryHover termName="Brahman">Brahman</GlossaryHover>). Each output produces an <strong>Ontological Glossary</strong> and paragraph exegesis mapping key concepts.
        </div>
      </div>

      {/* Preset Seeds Selection */}
      <div>
        <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Select High-Precision Sanskrit Seeds:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TRANSLATION_EXAMPLES.map((ex, index) => (
            <button
              key={index}
              onClick={() => loadExample(ex.text, ex.context)}
              type="button"
              className="text-left p-3.5 rounded-xl border border-[#bf953f]/30 bg-[#FFFDF8] hover:bg-[#FAF3E6] hover:border-[#bf953f] transition-all duration-200 group cursor-pointer shadow-sm"
            >
              <span className="block font-serif text-[#8c6011] text-xs font-bold group-hover:text-[#a67c1e] truncate">
                {transliterate(ex.title, activeLipi)}
              </span>
              <span className="block text-[11px] text-[#6e5842] mt-1 line-clamp-2 italic font-serif">
                {ex.context}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Translation form workspace */}
      <div className="card-3d-gold p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sanskrit-text-input" className="block text-sm font-bold text-[#735013] mb-1.5">
              Sanskrit Passage (Devanāgarī or IAST):
            </label>
            <textarea
              id="sanskrit-text-input"
              className="w-full h-32 p-3.5 border border-[#bf953f]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 bg-[#FFFDF9] placeholder-[#9c8266] font-cardo text-base leading-relaxed text-[#2D2319] shadow-inner"
              placeholder="सदेव सोम्येदमग्र आसीदेकमेवाद्वितीयम्... Enter Sanskrit passage here"
              value={state.text}
              onChange={(e) => setState((prev) => ({ ...prev, text: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="context-text-input" className="block text-sm font-bold text-[#735013] mb-1.5">
              Scholarly Context / Sampradāya Focus (Optional):
            </label>
            <textarea
              id="context-text-input"
              className="w-full h-32 p-3.5 border border-[#bf953f]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 bg-[#FFFDF9] placeholder-[#9c8266] font-sans text-sm leading-relaxed text-[#2D2319] shadow-inner"
              placeholder="e.g. Chāndogya Upaniṣad Ch. 6, Advaitic or Viśiṣṭādvaitic focus..."
              value={state.context}
              onChange={(e) => setState((prev) => ({ ...prev, context: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#bf953f]/20">
          <button
            onClick={handleClear}
            disabled={state.isProcessing || !state.text}
            className="btn-3d-dark flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium disabled:opacity-40 cursor-pointer"
          >
            Reset Form
          </button>

          <button
            onClick={handleTranslate}
            disabled={state.isProcessing || !state.text.trim()}
            className="btn-3d-gold flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#120e0b]" />
            Translate & Exegetize
          </button>
        </div>
      </div>

      {/* Output / Loader */}
      {state.isProcessing && <Loader label="Translating metaphysical structures & context..." />}

      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-xl text-sm flex gap-2 items-start shadow-md">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="text-red-950">Translation Disruption:</strong> {state.error}
          </div>
        </div>
      )}

      {state.result && (
        <div className="card-3d-gold p-6 relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#735013]">
              <BookOpen className="w-4 h-4 text-[#8c6011]" />
              <span className="font-bold uppercase tracking-wider text-[#8c6011]">
                Ontological Dialectic Translation Sheet
              </span>
            </div>

            {/* Citation Button */}
            <CitationButton
              moduleName="Precision Translation"
              sourceText={state.text}
              analysisContent={state.result}
            />
          </div>

          <div className="markdown-body">
            <ReactMarkdown>{state.result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
