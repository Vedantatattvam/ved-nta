import { useState, useEffect } from "react";
import { COMPARATIVE_EXAMPLES } from "../data";
import { ComparativeState } from "../types";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import { Sparkles, Scale, Columns, ListFilter, AlertCircle } from "lucide-react";
import { CitationButton } from "./CitationButton";
import WorkspaceShareBar from "./WorkspaceShareBar";
import { GlossaryHover } from "./GlossaryHover";
import { AcademicPdfExportButton } from "./AcademicPdfExportButton";
import { exportComparativeAnalysisToPdf } from "../utils/academicPdfExport";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";

const SUPPORTED_SCHOOLS = [
  "Advaita (Śaṅkara)",
  "Viśiṣṭādvaita (Rāmānuja)",
  "Dvaita (Madhva)",
  "Śuddhādvaita (Vallabha)",
  "Acintya Bhedābheda (Caitanya)",
  "Svāminārāyaṇa (Bhadreśadāsa)",
  "Vijñāna Vedānta (Sri Ramakrishna / Ayon Maharaj)",
];

interface ComparativeUtilityProps {
  initialVerseOrSutra?: string;
}

export default function ComparativeUtility({ initialVerseOrSutra }: ComparativeUtilityProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [state, setState] = useState<ComparativeState>({
    verseOrSutra: initialVerseOrSutra || "",
    selectedSchools: ["Advaita (Śaṅkara)", "Viśiṣṭādvaita (Rāmānuja)", "Dvaita (Madhva)"],
    isProcessing: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    if (initialVerseOrSutra) {
      setState((prev) => ({ ...prev, verseOrSutra: initialVerseOrSutra }));
    }
  }, [initialVerseOrSutra]);


  const toggleSchool = (school: string) => {
    setState((prev) => {
      const idx = prev.selectedSchools.indexOf(school);
      let updated = [...prev.selectedSchools];
      if (idx > -1) {
        updated.splice(idx, 1);
      } else {
        updated.push(school);
      }
      return { ...prev, selectedSchools: updated };
    });
  };

  const handleCompare = async () => {
    if (!state.verseOrSutra.trim()) return;

    setState((prev) => ({ ...prev, isProcessing: true, error: null, result: null }));
    try {
      const res = await fetch("/api/comparative-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verseOrSutra: state.verseOrSutra,
          selectedSchools: state.selectedSchools,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to make comparative analysis request.");
      }

      const data = await res.json();
      setState((prev) => ({ ...prev, isProcessing: false, result: data.result }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, isProcessing: false, error: err.message }));
    }
  };

  const loadExample = (text: string, desc: string) => {
    setState((prev) => ({
      ...prev,
      verseOrSutra: text,
      result: null,
      error: null,
    }));
  };

  const handleClear = () => {
    setState({
      verseOrSutra: "",
      selectedSchools: ["Advaita (Śaṅkara)", "Viśiṣṭādvaita (Rāmānuja)", "Dvaita (Madhva)"],
      isProcessing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="card-3d-gold p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-[#8c6011]" />
          <h3 className="font-serif font-bold gold-text-gradient text-base sm:text-lg">
            Comparative Hermeneutics & Sampradāya Vimarśa
          </h3>
        </div>
        <div className="text-sm text-[#4a3928] leading-relaxed">
          The <GlossaryHover termName="Prasthānatrayī">Prasthānatrayī</GlossaryHover> is interpreted across sectarian lines. This module cross-references texts across major schools, contrasting <GlossaryHover termName="Abheda">Abheda</GlossaryHover> vs. <GlossaryHover termName="Bheda">Bheda</GlossaryHover>, <GlossaryHover termName="Jīva">Jīva</GlossaryHover> agency, and the reality of <GlossaryHover termName="Jagat">Jagat</GlossaryHover>.
        </div>
      </div>

      {/* Preset Seeds Selection */}
      <div>
        <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Select Analytical Seeds:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COMPARATIVE_EXAMPLES.map((ex, index) => (
            <button
              key={index}
              onClick={() => loadExample(ex.text, ex.description)}
              type="button"
              className="text-left p-3.5 rounded-xl border border-[#C59B27]/30 bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] hover:border-[#C59B27] hover:shadow-xs transition-all duration-200 group cursor-pointer shadow-2xs"
            >
              <div className="font-serif text-[#8c6011] text-xs font-bold group-hover:text-[#a67c1e] truncate">
                {transliterate(ex.title, activeLipi)}
              </div>
              <div className="text-[11px] text-[#6e5842] mt-1 line-clamp-2 italic font-serif">
                {ex.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="card-3d-gold p-5 space-y-5">
        <div>
          <label htmlFor="comp-input-textarea" className="block text-sm font-bold text-[#735013] mb-1.5">
            Verse, Sūtra, or Doctrine to Examine:
          </label>
          <textarea
            id="comp-input-textarea"
            className="w-full h-28 p-3.5 border border-[#bf953f]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 bg-[#FFFDF9] placeholder-[#9c8266] font-cardo text-base leading-relaxed text-[#2D2319] shadow-inner"
            placeholder="e.g. जन्माद्यस्य यतः, अहं ब्रह्मास्मि, or the concept of 'Jīva as dependent vs independent agent'..."
            value={state.verseOrSutra}
            onChange={(e) => setState((prev) => ({ ...prev, verseOrSutra: e.target.value }))}
          />
        </div>

        {/* Selection of Schools */}
        <div>
          <label className="block text-sm font-bold text-[#735013] mb-2 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-[#8c6011]" /> Align Sampradāyas (Schools) for Dialectical Matrix:
          </label>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_SCHOOLS.map((school, idx) => {
              const active = state.selectedSchools.includes(school);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleSchool(school)}
                  className={`px-3.5 py-1.5 text-xs rounded-full border transition cursor-pointer ${
                    active
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold shadow-xs"
                      : "bg-[#FFFDF9] border border-[#bf953f]/30 text-[#5c4731] hover:border-[#bf953f] hover:bg-[#FAF3E4]"
                  }`}
                >
                  {school}
                </button>
              );
            })}
          </div>
          {state.selectedSchools.length === 0 && (
            <p className="text-xs text-red-600 mt-1 italic font-semibold">
              Warning: Please select at least one school for a comparative reading.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#bf953f]/20">
          <button
            onClick={handleClear}
            disabled={state.isProcessing || !state.verseOrSutra}
            className="btn-3d-dark flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium disabled:opacity-40 cursor-pointer"
          >
            Reset Form
          </button>

          <button
            onClick={handleCompare}
            disabled={state.isProcessing || !state.verseOrSutra.trim() || state.selectedSchools.length === 0}
            className="btn-3d-gold flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
          >
            <Columns className="w-4 h-4 text-[#120e0b]" />
            Synthesize Vimarśa Study
          </button>
        </div>
      </div>

      {/* Output Panel / Loader */}
      {state.isProcessing && <Loader label="Evaluating schools' comments, Śrībhāṣya vs Śāṅkarabhāṣya..." />}

      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-xl text-sm flex gap-2 items-start shadow-md">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="text-red-950">Hermeneutical Disruption:</strong> {state.error}
          </div>
        </div>
      )}

      {state.result && (
        <div className="card-3d-gold p-6 relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#735013]">
              <Scale className="w-4 h-4 text-[#8c6011]" />
              <span className="font-bold uppercase tracking-wider text-[#8c6011]">
                Sampradāya Vimarśa Comparative Report
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <WorkspaceShareBar
                shareData={{
                  title: `Sampradāya Vimarśa: "${state.verseOrSutra.substring(0, 70)}${state.verseOrSutra.length > 70 ? "..." : ""}"`,
                  subtitle: `Comparative Hermeneutics: ${state.selectedSchools.join(", ")}`,
                  sanskritText: state.verseOrSutra,
                  translation: state.result ? state.result.substring(0, 180) + "..." : undefined,
                  sourceText: "Comparative Hermeneutics (Vimarśa)",
                  authorOrSchool: state.selectedSchools.join(" • "),
                  type: "comparative",
                }}
                label="Share Study:"
              />

              <AcademicPdfExportButton
                onExportPdf={async () => {
                  if (state.result) {
                    await exportComparativeAnalysisToPdf({
                      verseOrSutra: state.verseOrSutra,
                      selectedSchools: state.selectedSchools,
                      analysisResult: state.result,
                    });
                  }
                }}
                label="Export PDF"
                variant="compact"
                title="Download this comparative hermeneutical study as a formatted PDF"
              />

              {/* Citation Button */}
              <CitationButton
                moduleName="Comparative Vimarśa"
                title={state.verseOrSutra}
                schools={state.selectedSchools}
                analysisContent={state.result}
              />
            </div>
          </div>

          <div className="markdown-body">
            <ReactMarkdown>{state.result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
