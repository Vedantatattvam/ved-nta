import React, { useState, useRef, useEffect } from "react";
import { useBharatiyaLipi, FontSizeScale, FontWeight, LineHeight, LetterSpacing } from "../context/BharatiyaLipiContext";
import { BharatiyaLipiId, BHARATIYA_LIPIS } from "../utils/bharatiyaLipiTransliteration";
import {
  Languages,
  Sliders,
  Type,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
  Eye,
  Settings2,
  BookOpen,
  Layers,
  ArrowRight
} from "lucide-react";

interface BharatiyaLipiSwitcherProps {
  variant?: "button" | "compact" | "full";
  onOpenFacility?: () => void;
  className?: string;
}

export default function BharatiyaLipiSwitcher({
  variant = "button",
  onOpenFacility,
  className = ""
}: BharatiyaLipiSwitcherProps) {
  const {
    activeLipi,
    setActiveLipi,
    scriptFonts,
    setScriptFont,
    getActiveFontConfig,
    fontSizeScale,
    setFontSizeScale,
    fontWeight,
    setFontWeight,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    showDualScript,
    setShowDualScript,
    transliterate,
    currentLipiConfig,
    allLipis,
    resetToDefaults
  } = useBharatiyaLipi();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"lipi" | "font" | "typography" | "tester">("lipi");
  const [testText, setTestText] = useState("ॐ तत्सद्ब्रह्मणे नमः | सत्यं ज्ञानमनन्तं ब्रह्म");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  const activeFont = getActiveFontConfig();

  return (
    <div className={`relative inline-block ${isOpen ? "z-50" : ""} ${className}`} ref={modalRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] hover:text-[#2D2319] text-xs font-serif font-bold transition shadow-sm cursor-pointer"
        title="Bharatiya Bhasha Lipi & Font Options"
      >
        <Languages className="w-3.5 h-3.5 text-[#8c6011]" />
        <span className="hidden sm:inline">Lipi & Fonts</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#8c6011]/15 text-[#735013] font-mono font-bold">
          {currentLipiConfig.nativeName.split(" ")[0]}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#8c6011] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Popover / Modal Panel */}
      {isOpen && (
        <div
          id="bharatiya-lipi-switcher-dropdown-panel"
          style={{ zIndex: 999999 }}
          className="absolute right-0 mt-2 w-[340px] sm:w-[480px] max-h-[85vh] overflow-y-auto card-3d-gold p-4 sm:p-5 z-50 z-[999999] bg-[#FFFDF8]/98 backdrop-blur-lg shadow-2xl border-2 border-[#bf953f]/60 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#bf953f]/25 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#8c6011]/15 text-[#8c6011]">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#2D2319] leading-tight">
                  Bharatiya Bhasha Lipi & Typography
                </h3>
                <span className="text-[10px] font-mono text-[#8c6011]">
                  भारतीय भाषा लिपि एवं मुद्रणकला चयन
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetToDefaults}
                className="p-1.5 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition"
                title="Reset to Devanāgarī & Default Typography"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#6e5842] hover:bg-[#FAF1E2] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex rounded-xl bg-[#FAF1E2] p-1 gap-1 mb-4 text-xs font-serif font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("lipi")}
              className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeTab === "lipi"
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                  : "text-[#5c4731] hover:text-[#2D2319]"
              }`}
            >
              1. Script (Lipi)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("font")}
              className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeTab === "font"
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                  : "text-[#5c4731] hover:text-[#2D2319]"
              }`}
            >
              2. Fonts ({currentLipiConfig.availableFonts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("typography")}
              className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeTab === "typography"
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                  : "text-[#5c4731] hover:text-[#2D2319]"
              }`}
            >
              3. Style & Scale
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tester")}
              className={`flex-1 py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeTab === "tester"
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                  : "text-[#5c4731] hover:text-[#2D2319]"
              }`}
            >
              4. Preview
            </button>
          </div>

          {/* TAB 1: SCRIPT (LIPI) SELECTION */}
          {activeTab === "lipi" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c6011] font-mono">
                <span>Select Bharatiya Script:</span>
                <span className="text-[10px] bg-[#bf953f]/20 px-2 py-0.5 rounded-full font-bold">
                  10 Classical Scripts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {allLipis.map((lipi) => {
                  const isSelected = activeLipi === lipi.id;
                  return (
                    <button
                      key={lipi.id}
                      type="button"
                      onClick={() => setActiveLipi(lipi.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-[#FAF5EC] to-[#F5EADB] text-[#2D2319] border-2 border-[#bf953f] shadow-xs ring-1 ring-[#d4af37]/50"
                          : "bg-[#FFFDF8] hover:bg-[#FAF1E2] border-[#bf953f]/30 text-[#2D2319]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs sm:text-sm">
                          {lipi.nativeName}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8c6011]" />}
                      </div>
                      <div className={`text-[11px] font-sans mt-0.5 ${isSelected ? "text-[#8c6011] font-semibold" : "text-[#735013]"}`}>
                        {lipi.name}
                      </div>
                      <div className={`text-[10px] font-mono mt-1 truncate ${isSelected ? "text-[#5c4731]" : "text-[#9c8266]"}`}>
                        {lipi.sampleAkshara}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dual Script Toggle */}
              <div className="pt-2 border-t border-[#bf953f]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif font-bold text-[#2D2319] block">
                    Dual-Script Parallel Mode
                  </span>
                  <span className="text-[10px] text-[#6e5842]">
                    Display original Devanāgarī alongside chosen Lipi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDualScript(!showDualScript)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showDualScript ? "bg-[#8c6011]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showDualScript ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FONT FAMILY SELECTION FOR CURRENT SCRIPT */}
          {activeTab === "font" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c6011] font-mono">
                <span>Fonts for {currentLipiConfig.name} ({currentLipiConfig.nativeName}):</span>
                <span className="text-[10px] bg-[#bf953f]/20 px-2 py-0.5 rounded-full font-bold">
                  {currentLipiConfig.availableFonts.length} Available
                </span>
              </div>

              <div className="space-y-2">
                {currentLipiConfig.availableFonts.map((font) => {
                  const isCurrent = (scriptFonts[activeLipi] || currentLipiConfig.availableFonts[0].id) === font.id;
                  const sampleRendered = transliterate("ॐ नमः शिवाय | सत्यमेव जयते", activeLipi);
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setScriptFont(activeLipi, font.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-gradient-to-br from-[#FAF5EC] to-[#F5EADB] text-[#2D2319] border-2 border-[#bf953f] shadow-xs ring-1 ring-[#d4af37]/50"
                          : "bg-[#FFFDF8] hover:bg-[#FAF1E2] border-[#bf953f]/30 text-[#2D2319]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xs">
                            {font.name}
                          </span>
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                            isCurrent ? "bg-[#bf953f]/25 text-[#8c6011]" : "bg-[#bf953f]/15 text-[#8c6011]"
                          }`}>
                            {font.category}
                          </span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#8c6011]" />}
                      </div>

                      {/* Live Font Rendering Preview */}
                      <div
                        className="text-base sm:text-lg my-1 leading-snug"
                        style={{ fontFamily: font.family }}
                      >
                        {sampleRendered}
                      </div>

                      <p className={`text-[10px] leading-tight ${isCurrent ? "text-[#5c4731]" : "text-[#6e5842]"}`}>
                        {font.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY, SCALE, WEIGHT & LINE-HEIGHT */}
          {activeTab === "typography" && (
            <div className="space-y-4 text-xs font-serif">
              {/* Font Size Scale */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#8c6011] font-mono text-[11px] uppercase tracking-wider block">
                  1. Font Size Scale (पाठ्य परिमाणम्):
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["sm", "base", "lg", "xl", "2xl"] as FontSizeScale[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSizeScale(sz)}
                      className={`py-1.5 rounded-lg border text-center font-mono font-bold transition cursor-pointer text-xs ${
                        fontSizeScale === sz
                          ? "bg-[#8c6011] text-[#FFFDF8] border-[#735013] shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#8c6011] font-mono text-[11px] uppercase tracking-wider block">
                  2. Font Weight (अक्षर गुरुत्वम्):
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: "normal", label: "Reg" },
                      { id: "medium", label: "Med" },
                      { id: "semibold", label: "Semi" },
                      { id: "bold", label: "Bold" },
                      { id: "black", label: "Black" },
                    ] as { id: FontWeight; label: string }[]
                  ).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setFontWeight(w.id)}
                      className={`py-1.5 rounded-lg border text-center font-mono font-bold transition cursor-pointer text-xs ${
                        fontWeight === w.id
                          ? "bg-[#8c6011] text-[#FFFDF8] border-[#735013] shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#8c6011] font-mono text-[11px] uppercase tracking-wider block">
                  3. Line Height / Vertical Spacing (पङ्क्ति-अन्तरम्):
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: "tight", label: "Tight" },
                      { id: "normal", label: "Normal" },
                      { id: "relaxed", label: "Relaxed" },
                      { id: "loose", label: "Spacious" },
                    ] as { id: LineHeight; label: string }[]
                  ).map((lh) => (
                    <button
                      key={lh.id}
                      type="button"
                      onClick={() => setLineHeight(lh.id)}
                      className={`py-1.5 rounded-lg border text-center font-mono font-bold transition cursor-pointer text-xs ${
                        lineHeight === lh.id
                          ? "bg-[#8c6011] text-[#FFFDF8] border-[#735013] shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {lh.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#8c6011] font-mono text-[11px] uppercase tracking-wider block">
                  4. Letter Spacing / Diacritic Kerning (अक्षर-अन्तरम्):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "normal", label: "Standard" },
                      { id: "wide", label: "Wide" },
                      { id: "wider", label: "Wider (Accents)" },
                    ] as { id: LetterSpacing; label: string }[]
                  ).map((ls) => (
                    <button
                      key={ls.id}
                      type="button"
                      onClick={() => setLetterSpacing(ls.id)}
                      className={`py-1.5 rounded-lg border text-center font-mono font-bold transition cursor-pointer text-xs ${
                        letterSpacing === ls.id
                          ? "bg-[#8c6011] text-[#FFFDF8] border-[#735013] shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {ls.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PREVIEW & INTERACTIVE TESTING SCRATCHPAD */}
          {activeTab === "tester" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c6011] font-mono">
                <span>Interactive Live Testing:</span>
                <span className="text-[10px] font-bold text-[#2D2319]">
                  Font: {activeFont.name}
                </span>
              </div>

              {/* Input */}
              <div>
                <label className="text-[10px] font-mono text-[#6e5842] block mb-1">
                  Type or Paste Sanskrit / Indic text to test:
                </label>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#bf953f]/40 bg-[#FFFDF9] text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                  placeholder="Enter text..."
                />
              </div>

              {/* Live Rendered Output Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF4E8] via-[#FFFDF9] to-[#FAF4E8] border border-[#bf953f]/40 space-y-2 shadow-inner">
                <div className="text-[10px] font-mono text-[#8c6011] uppercase font-bold flex justify-between">
                  <span>Rendered in {currentLipiConfig.name}:</span>
                  <span>{activeFont.name}</span>
                </div>

                <div
                  className="text-[#2D2319] whitespace-pre-wrap break-words transition-all"
                  style={{
                    fontFamily: activeFont.family,
                    fontSize: fontSizeScale === "sm" ? "1rem" : fontSizeScale === "base" ? "1.25rem" : fontSizeScale === "lg" ? "1.5rem" : fontSizeScale === "xl" ? "1.875rem" : "2.25rem",
                    fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : fontWeight === "bold" ? 700 : 900,
                    lineHeight: lineHeight === "tight" ? 1.3 : lineHeight === "normal" ? 1.5 : lineHeight === "relaxed" ? 1.75 : 2.0,
                    letterSpacing: letterSpacing === "normal" ? "normal" : letterSpacing === "wide" ? "0.025em" : "0.05em"
                  }}
                >
                  {transliterate(testText, activeLipi)}
                </div>

                {showDualScript && activeLipi !== "devanagari" && (
                  <div className="pt-2 mt-2 border-t border-[#bf953f]/20">
                    <span className="text-[9px] font-mono text-[#8c6011] block mb-0.5">Original Devanāgarī:</span>
                    <div className="text-sm font-serif text-[#6e5842]">
                      {transliterate(testText, "devanagari")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer: Open Full Facility */}
          {onOpenFacility && (
            <div className="mt-4 pt-3 border-t border-[#bf953f]/25 flex items-center justify-between">
              <span className="text-[10px] text-[#6e5842] font-serif">
                Need multi-script matrix or Akṣara chart?
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFacility();
                }}
                className="flex items-center gap-1 text-xs font-serif font-bold text-[#8c6011] hover:text-[#593e0b] cursor-pointer"
              >
                <span>Full Lipi Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
