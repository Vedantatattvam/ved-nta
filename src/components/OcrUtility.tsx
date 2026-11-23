import { useState } from "react";
import { OCR_EXAMPLES } from "../data";
import { OcrState } from "../types";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import { Sparkles, FileText, CheckCircle2, RotateCcw } from "lucide-react";
import { CitationButton } from "./CitationButton";
import { GlossaryAutoText, GlossaryHover } from "./GlossaryHover";

export default function OcrUtility() {
  const [state, setState] = useState<OcrState>({
    rawText: "",
    isProcessing: false,
    result: null,
    error: null,
  });

  const handleCorrect = async () => {
    if (!state.rawText.trim()) return;

    setState((prev) => ({ ...prev, isProcessing: true, error: null, result: null }));
    try {
      const res = await fetch("/api/ocr-correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: state.rawText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process text.");
      }

      const data = await res.json();
      setState((prev) => ({ ...prev, isProcessing: false, result: data.result }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, isProcessing: false, error: err.message }));
    }
  };

  const loadExample = (text: string) => {
    setState((prev) => ({ ...prev, rawText: text, result: null, error: null }));
  };

  const handleReset = () => {
    setState({ rawText: "", isProcessing: false, result: null, error: null });
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="card-3d-gold p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-[#8c6011]" />
          <h3 className="font-serif font-bold gold-text-gradient text-base sm:text-lg">
            Manuscript OCR Curation & Sandhi Rectification
          </h3>
        </div>
        <div className="text-sm text-[#4a3928] leading-relaxed">
          Digital archives often yield fragmented text with missing accents, combined <GlossaryHover termName="Sandhi">Sandhis</GlossaryHover>, or character transpositions (e.g. deleting terminal <GlossaryHover termName="Visarga">Visargas</GlossaryHover> or <GlossaryHover termName="Anusvara">Anusvāras</GlossaryHover>). This module verifies grammar against classical <GlossaryHover termName="Vyākaraṇa">Vyākaraṇa</GlossaryHover> standards.
        </div>
      </div>

      {/* Preset Seeds Selection */}
      <div>
        <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Select Roman/Devanāgarī Archive OCR Seeds:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {OCR_EXAMPLES.map((ex, index) => (
            <button
              key={index}
              onClick={() => loadExample(ex.raw)}
              type="button"
              className="text-left p-3.5 rounded-xl border border-[#bf953f]/30 bg-[#FFFDF8] hover:bg-[#FAF3E6] hover:border-[#bf953f] transition-all duration-200 group cursor-pointer shadow-sm"
            >
              <span className="block font-serif text-[#8c6011] text-xs font-bold group-hover:text-[#a67c1e] truncate">
                {ex.name}
              </span>
              <span className="block text-[11px] text-[#6e5842] mt-1 line-clamp-2 italic font-serif">
                {ex.note}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Sheet */}
      <div className="card-3d-gold p-5 space-y-4">
        <div>
          <label htmlFor="raw-ocr-textarea" className="block text-sm font-bold text-[#735013] mb-1.5 flex items-center justify-between">
            <span>Raw OCR Text Input:</span>
            <span className="text-xs font-mono text-[#8c6011]">Devanāgarī / IAST</span>
          </label>
          <textarea
            id="raw-ocr-textarea"
            className="w-full h-36 p-4 border border-[#bf953f]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 bg-[#FFFDF9] placeholder-[#9c8266] font-cardo text-base leading-relaxed text-[#2D2319] shadow-inner"
            placeholder="प्राकृते लिपौ मन्त्रान् लिखतु वा उपरिष्टाद् बीजमङ्कुरयतु... Paste raw Sanskrit text with scanning anomalies or merged letters here."
            value={state.rawText}
            onChange={(e) => setState((prev) => ({ ...prev, rawText: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReset}
            disabled={state.isProcessing || !state.rawText}
            className="btn-3d-dark flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Workspace
          </button>

          <button
            onClick={handleCorrect}
            disabled={state.isProcessing || !state.rawText.trim()}
            className="btn-3d-gold flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#120e0b]" />
            Curate & Align Text
          </button>
        </div>
      </div>

      {/* Output Results */}
      {state.isProcessing && <Loader label="Evaluating Paninian grammar rules & Sandhis..." />}

      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-xl text-sm shadow-md">
          <strong className="text-red-950">Critical Scholastic Interruption:</strong> {state.error}
        </div>
      )}

      {state.result && (
        <div className="card-3d-gold p-6 relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#735013]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold uppercase tracking-wider text-[#8c6011]">
                Transcription Sanitized & Annotated
              </span>
            </div>

            {/* Academic Copy Citation Button */}
            <CitationButton
              moduleName="OCR Curation"
              sourceText={state.rawText}
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
