import { useState, useMemo, useEffect } from "react";
import {
  NyayaSutraEntry,
  NyayaCrossReference,
  NYAYA_ADHYAYA_SUMMARIES,
  loadAllNyayaPrasthanaSutras,
} from "../utils/nyayaPrasthanaLoader";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Bookmark,
  Check,
  Copy,
  Scale,
  Compass,
  ArrowRight,
  HelpCircle,
  BookMarked,
  Scroll,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { TabType, TextEntry, GranthaVerse } from "../types";
import BhashyaTikaSelector from "./BhashyaTikaSelector";

interface NyayaPrasthanaNavigatorProps {
  onOpenInReader: (sutraId: string, adhyayaId: string) => void;
  onNavigateToGrantha?: (granthaId: string, chapterId?: string, verseId?: string) => void;
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
  onCompareWithGrantha?: (granthaId: string) => void;
  isFocused?: boolean;
}

export default function NyayaPrasthanaNavigator({
  onOpenInReader,
  onNavigateToGrantha,
  onNavigateToTab,
  onCompareWithGrantha,
  isFocused = false,
}: NyayaPrasthanaNavigatorProps) {
  const { transliterate, currentLipiConfig, activeLipi } = useBharatiyaLipi();
  const allSutras = useMemo(() => loadAllNyayaPrasthanaSutras(), []);

  const [selectedAdhyaya, setSelectedAdhyaya] = useState<1 | 2 | 3 | 4>(1);
  const [currentSutraIndex, setCurrentSutraIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPadaccheda, setShowPadaccheda] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("nyaya_show_padaccheda");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const toggleShowPadaccheda = () => {
    setShowPadaccheda((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nyaya_show_padaccheda", String(next));
      } catch {}
      return next;
    });
  };

  const [showAnvaya, setShowAnvaya] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("nyaya_show_anvaya");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const toggleShowAnvaya = () => {
    setShowAnvaya((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nyaya_show_anvaya", String(next));
      } catch {}
      return next;
    });
  };

  // Filter sūtras by Adhyāya and theme / search
  const filteredSutras = useMemo(() => {
    return allSutras.filter((s) => {
      if (s.adhyayaIndex !== selectedAdhyaya) return false;
      if (selectedThemeFilter !== "all" && !s.philosophicalThemes.includes(selectedThemeFilter)) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.sutraNumber.includes(q) ||
        s.sutraTitle.toLowerCase().includes(q) ||
        s.mulaSanskrit.includes(searchQuery) ||
        s.mulaIast.toLowerCase().includes(q) ||
        s.englishTranslation.toLowerCase().includes(q) ||
        s.adhikarana.name.toLowerCase().includes(q) ||
        s.adhikarana.visayaVakya.toLowerCase().includes(q) ||
        s.crossReferences.some((cr) => cr.sourceRef.toLowerCase().includes(q) || cr.targetPrasthana.toLowerCase().includes(q))
      );
    });
  }, [allSutras, selectedAdhyaya, selectedThemeFilter, searchQuery]);

  // Adjust currentSutraIndex if out of bounds of filteredSutras
  useEffect(() => {
    if (currentSutraIndex >= filteredSutras.length) {
      setCurrentSutraIndex(0);
    }
  }, [filteredSutras, currentSutraIndex]);

  const activeSutra: NyayaSutraEntry | undefined = filteredSutras[currentSutraIndex] || allSutras[0];

  // Distinct themes in the active Adhyāya
  const availableThemes = useMemo(() => {
    const adhyayaSutras = allSutras.filter((s) => s.adhyayaIndex === selectedAdhyaya);
    const set = new Set<string>();
    adhyayaSutras.forEach((s) => s.philosophicalThemes.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [allSutras, selectedAdhyaya]);

  const handlePrev = () => {
    setCurrentSutraIndex((prev) => (prev > 0 ? prev - 1 : filteredSutras.length - 1));
  };

  const handleNext = () => {
    setCurrentSutraIndex((prev) => (prev < filteredSutras.length - 1 ? prev + 1 : 0));
  };

  const handleCopySutra = (sutra: NyayaSutraEntry) => {
    const textToCopy = `Brahma Sūtra ${sutra.sutraNumber}: ${sutra.sutraTitle}
Mūla: ${sutra.mulaSanskrit}
IAST: ${sutra.mulaIast}
Padaccheda: ${sutra.padaccheda}
Translation: ${sutra.englishTranslation}
Adhikaraṇa: ${sutra.adhikarana.name}
Viṣaya-Vākya: ${sutra.adhikarana.visayaVakya}
Siddhānta: ${sutra.adhikarana.siddhanta}
Cross-References:
${sutra.crossReferences.map((cr) => `• [${cr.targetPrasthana}] ${cr.sourceRef} (${cr.hermeneuticalRole})`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(sutra.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const adhyayaSummary = NYAYA_ADHYAYA_SUMMARIES.find((a) => a.number === selectedAdhyaya)!;

  const getAdhyayaGranthaChapterId = (adhyayaNum: number) => {
    return `brahmasutra-adhyaya-${adhyayaNum}`;
  };

  return (
    <div className="bg-[#FAF7F0] border-2 border-[#bf953f]/50 rounded-2xl p-4 sm:p-6 shadow-md space-y-6 text-[#2D2319]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#bf953f]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#8c6011] text-[#FFFDF8] font-mono">
              Nyāya-Prasthāna
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#8c6011]/10 text-[#8c6011] font-mono">
              Brahma-Mīmāṁsā Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D2319] mt-1.5 flex items-center gap-2">
            <span>न्यायप्रस्थानम् — ब्रह्मसूत्राणि</span>
            <span className="text-sm font-sans font-normal text-[#735013]">
              (Verse-by-Verse Dialectical Cross-Referencing)
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-[#6e5842] mt-0.5">
            Explore the aphorisms of Bādarāyaṇa Vyāsa with direct cross-references to Upaniṣadic Viṣaya-Vākyas, Bhagavad Gītā syntheses, and the 5 classical components of each Adhikaraṇa.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenInReader(activeSutra.id, getAdhyayaGranthaChapterId(activeSutra.adhyayaIndex))}
            className="px-3.5 py-2 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Open complete canonical edition in the full Text Reader"
          >
            <Scroll className="w-3.5 h-3.5 text-[#120e0b]" />
            <span>Open in Reader</span>
          </button>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab("comparative_council", { primaryGranthaId: "brahmasutra" })}
              className="px-3.5 py-2 bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] hover:text-[#2D2319] font-medium text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Compare Nyāyaprasthāna interpretations in Comparative Council"
            >
              <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
              <span className="hidden sm:inline">Compare Council</span>
              <span className="sm:hidden">Council</span>
            </button>
          )}
        </div>
      </div>

      {/* Adhyāya Tabs Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {NYAYA_ADHYAYA_SUMMARIES.map((adhyaya) => {
          const isSelected = selectedAdhyaya === adhyaya.number;
          return (
            <button
              key={adhyaya.number}
              type="button"
              onClick={() => {
                setSelectedAdhyaya(adhyaya.number);
                setCurrentSutraIndex(0);
                setSelectedThemeFilter("all");
              }}
              className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#8c6011] text-[#FFFDF8] border-[#8c6011] shadow-sm ring-2 ring-[#8c6011]/30"
                  : "bg-[#FFFDF8] hover:bg-[#FAF3E6] text-[#2D2319] border-[#bf953f]/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={isSelected ? "text-[#fcf6ba] font-bold" : "text-[#8c6011] font-bold"}>
                    Adhyāya {adhyaya.number}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? "bg-[#735013] text-[#fcf6ba]" : "bg-[#FAF5ED] text-[#6e5842]"}`}>
                    {adhyaya.sutraCount} Sūtras
                  </span>
                </div>
                <div className="font-serif font-bold text-xs sm:text-sm line-clamp-1">
                  {adhyaya.titleSanskrit}
                </div>
                <div className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? "text-[#FAF5ED]" : "text-[#6e5842]"}`}>
                  {adhyaya.title.split("(")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF8] p-3 rounded-xl border border-[#bf953f]/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6011]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentSutraIndex(0);
            }}
            placeholder="Search Sūtras, Viṣaya, Upaniṣad..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#bf953f]/40 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#8c6011] text-[#2D2319]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8c6011] font-mono hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          <Filter className="w-3.5 h-3.5 text-[#8c6011] shrink-0" />
          <button
            type="button"
            onClick={() => {
              setSelectedThemeFilter("all");
              setCurrentSutraIndex(0);
            }}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              selectedThemeFilter === "all"
                ? "bg-[#8c6011] text-[#FFFDF8]"
                : "bg-[#FAF5ED] text-[#735013] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
            }`}
          >
            All Adhikaraṇas ({allSutras.filter((s) => s.adhyayaIndex === selectedAdhyaya).length})
          </button>
          {availableThemes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => {
                setSelectedThemeFilter(theme);
                setCurrentSutraIndex(0);
              }}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                selectedThemeFilter === theme
                  ? "bg-[#8c6011] text-[#FFFDF8]"
                  : "bg-[#FAF5ED] text-[#735013] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Main Verse-by-Verse Navigation & Content View */}
      {filteredSutras.length === 0 ? (
        <div className="p-8 text-center bg-[#FFFDF8] rounded-xl border border-[#bf953f]/30">
          <HelpCircle className="w-8 h-8 text-[#8c6011] mx-auto mb-2 opacity-70" />
          <h4 className="text-sm font-bold text-[#2D2319]">No Sūtras match your search or filter</h4>
          <p className="text-xs text-[#6e5842] mt-1">Try clearing your search query or selecting a different Adhyāya.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedThemeFilter("all");
            }}
            className="mt-3 px-3.5 py-1.5 bg-[#8c6011] text-[#FFFDF8] text-xs font-bold rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Verse Stepper Bar */}
          <div className="bg-[#FFFDF8] p-3 rounded-xl border border-[#bf953f]/30 flex items-center justify-between gap-2 shadow-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#8c6011] font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
              title="Previous Sūtra"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous Sūtra</span>
            </button>

            {/* Middle Indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs font-bold font-mono text-[#8c6011]">
                  Sūtra {activeSutra.sutraNumber}
                </span>
                <span className="text-[11px] text-[#6e5842]">
                  ({currentSutraIndex + 1} of {filteredSutras.length})
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#5c4731] font-medium truncate max-w-xs sm:max-w-md">
                {activeSutra.adhikarana.name}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#8c6011] font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
              title="Next Sūtra"
            >
              <span className="hidden sm:inline">Next Sūtra</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sūtra Card */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#bf953f]/40 p-5 sm:p-6 shadow-sm space-y-6">
            {/* Sūtra Title & Badges */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#bf953f]/20 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#8c6011]/10 text-[#8c6011] font-mono text-xs font-bold rounded">
                    BS {activeSutra.sutraNumber}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-serif font-semibold rounded">
                    {activeSutra.adhikarana.name} ({activeSutra.adhikarana.sanskritName})
                  </span>
                  <span className="text-[11px] text-[#6e5842] font-mono">
                    {activeSutra.padaName}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#2D2319] mt-2">
                  {activeSutra.sutraTitle}
                </h4>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopySutra(activeSutra)}
                  className="p-2 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#8c6011] cursor-pointer transition"
                  title="Copy Sūtra citation, translation, and cross-references"
                >
                  {copiedId === activeSutra.id ? (
                    <Check className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Padaccheda Visibility Toggle */}
                <button
                  type="button"
                  onClick={toggleShowPadaccheda}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs ${
                    showPadaccheda
                      ? "bg-[#FAF5ED] border-[#bf953f]/50 text-[#8c6011]"
                      : "bg-[#F5EDE1] border-[#bf953f]/30 text-[#8c6011]/60 hover:text-[#8c6011]"
                  }`}
                  title={showPadaccheda ? "Hide Padaccheda" : "Show Padaccheda"}
                >
                  {showPadaccheda ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{showPadaccheda ? "Padaccheda" : "Padaccheda (Hidden)"}</span>
                </button>

                {/* Anvaya Visibility Toggle */}
                <button
                  type="button"
                  onClick={toggleShowAnvaya}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs ${
                    showAnvaya
                      ? "bg-[#FAF5ED] border-[#bf953f]/50 text-[#8c6011]"
                      : "bg-[#F5EDE1] border-[#bf953f]/30 text-[#8c6011]/60 hover:text-[#8c6011]"
                  }`}
                  title={showAnvaya ? "Hide Anvaya" : "Show Anvaya"}
                >
                  {showAnvaya ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{showAnvaya ? "Anvaya" : "Anvaya (Hidden)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenInReader(activeSutra.id, getAdhyayaGranthaChapterId(activeSutra.adhyayaIndex))}
                  className="px-3 py-1.5 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Read in complete canonical Sanskrit reader"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Reader</span>
                </button>
              </div>
            </div>

            {/* Mūla Text and Transliteration */}
            <div className="bg-[#FAF7F0] border-l-4 border-[#8c6011] p-4 rounded-r-xl space-y-2.5">
              <div 
                className="text-lg sm:text-xl font-bold font-devanagari font-indic text-[#2D2319] tracking-wide"
                style={{ fontFamily: activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
              >
                {transliterate(activeSutra.mulaSanskrit)}
              </div>
              <div className="text-sm font-mono text-[#735013] italic">
                {activeSutra.mulaIast}
              </div>
              {showPadaccheda && (
                <div className="text-xs text-[#5c4731] font-mono pt-1.5 border-t border-[#bf953f]/20 flex items-center justify-between">
                  <div>
                    <strong className="text-[#8c6011]">Padaccheda:</strong>{" "}
                    <span 
                      className="font-devanagari font-indic"
                      style={{ fontFamily: activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
                    >
                      {transliterate(activeSutra.padaccheda)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleShowPadaccheda}
                    className="text-[10px] text-[#8c6011] hover:underline cursor-pointer ml-2"
                  >
                    Hide
                  </button>
                </div>
              )}
              {showAnvaya && activeSutra.anvaya && (
                <div className="text-xs text-[#4a3928] font-serif pt-1.5 border-t border-[#bf953f]/20 flex items-start justify-between gap-2">
                  <div>
                    <strong className="font-mono text-[#8c6011] text-[11px] block">Anvaya (अन्वयः — Syntactic Order):</strong>
                    <span 
                      className="leading-relaxed font-devanagari font-indic"
                      style={{ fontFamily: activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
                    >
                      {transliterate(activeSutra.anvaya)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleShowAnvaya}
                    className="text-[10px] font-mono text-[#8c6011] hover:underline cursor-pointer ml-2 shrink-0"
                  >
                    Hide
                  </button>
                </div>
              )}
            </div>

            {/* English Translation */}
            <div>
              <h5 className="text-[11px] font-bold font-mono text-[#8c6011] uppercase tracking-wider mb-1">
                Canonical English Translation
              </h5>
              <p className="text-sm sm:text-base text-[#2D2319] font-cardo leading-relaxed bg-[#FAF5ED] p-3.5 rounded-xl border border-[#bf953f]/20">
                "{activeSutra.englishTranslation}"
              </p>
            </div>

            {/* Multi-Bhāṣya and Associated Ṭīkā Commentary Section (Rendered directly below the verse) */}
            <div className="pt-2 border-t border-[#bf953f]/25 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Scroll className="w-4 h-4 text-[#8c6011]" />
                <h5 className="text-xs font-bold font-mono text-[#8c6011] uppercase tracking-wider">
                  Commentaries & Associated Ṭīkās (शारीरक-भाष्य-टीका-विमर्शः)
                </h5>
              </div>
              <BhashyaTikaSelector
                verse={{
                  id: activeSutra.id,
                  number: activeSutra.sutraNumber,
                  title: activeSutra.sutraTitle,
                  mulaSanskrit: activeSutra.mulaSanskrit,
                  mulaIast: activeSutra.mulaIast,
                  padaccheda: activeSutra.padaccheda,
                  anvaya: activeSutra.anvaya,
                  bhashyaExtract: activeSutra.bhashyaExtract,
                  englishTranslation: activeSutra.englishTranslation,
                  commentaryNotes: activeSutra.commentaryNotes,
                }}
                granthaId="brahmasutra"
              />
            </div>

            {/* Classical 5-Fold Adhikaraṇa Analysis (पञ्चाङ्ग-विचार) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#8c6011]" />
                <h5 className="text-xs font-bold font-mono text-[#8c6011] uppercase tracking-wider">
                  Adhikaraṇa Pañcāṅga Exegesis (पञ्चाङ्ग-विचारः)
                </h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Viṣaya */}
                <div className="bg-[#FFFDF8] border border-[#bf953f]/30 p-3.5 rounded-xl">
                  <div className="text-[11px] font-bold font-mono text-[#8c6011] uppercase">
                    1. Viṣaya (विषयः — Scriptural Passage)
                  </div>
                  <p className="text-xs text-[#2D2319] mt-1 font-serif leading-relaxed">
                    {activeSutra.adhikarana.visayaVakya}
                  </p>
                </div>

                {/* Saṁśaya */}
                <div className="bg-[#FFFDF8] border border-[#bf953f]/30 p-3.5 rounded-xl">
                  <div className="text-[11px] font-bold font-mono text-[#8c6011] uppercase">
                    2. Saṁśaya (संशयः — The Doubt / Conflict)
                  </div>
                  <p className="text-xs text-[#2D2319] mt-1 leading-relaxed">
                    {activeSutra.adhikarana.samsaya}
                  </p>
                </div>

                {/* Pūrvapakṣa */}
                <div className="bg-red-50/60 border border-red-200/80 p-3.5 rounded-xl">
                  <div className="text-[11px] font-bold font-mono text-red-900 uppercase">
                    3. Pūrvapakṣa (पूर्वपक्षः — Opponent Thesis)
                  </div>
                  <p className="text-xs text-red-950 mt-1 leading-relaxed">
                    {activeSutra.adhikarana.purvapaksa}
                  </p>
                </div>

                {/* Siddhānta */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl">
                  <div className="text-[11px] font-bold font-mono text-emerald-900 uppercase">
                    4. Siddhānta (सिद्धान्तः — Vedāntic Judgment)
                  </div>
                  <p className="text-xs text-emerald-950 mt-1 leading-relaxed">
                    {activeSutra.adhikarana.siddhanta}
                  </p>
                </div>
              </div>

              {/* Saṅgati */}
              <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#bf953f]/30 text-xs text-[#5c4731]">
                <strong className="text-[#8c6011] font-mono">5. Saṅgati (सङ्गतिः — Coherent Sequence):</strong> {activeSutra.adhikarana.sangati}
              </div>
            </div>

            {/* Deep Cross-References Section */}
            <div className="space-y-3 pt-2 border-t border-[#bf953f]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8c6011]" />
                  <h5 className="text-xs font-bold font-mono text-[#8c6011] uppercase tracking-wider">
                    Prasthānatrayī Cross-References & Canonical Citations
                  </h5>
                </div>
                <span className="text-[11px] text-[#6e5842] font-mono">
                  {activeSutra.crossReferences.length} Connected Textual Authorities
                </span>
              </div>

              <div className="space-y-3">
                {activeSutra.crossReferences.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 bg-[#FAF7F0] border border-[#bf953f]/30 rounded-xl hover:border-[#8c6011]/60 transition space-y-2 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                          ref.type === "sruti"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : ref.type === "smrti"
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-purple-100 text-purple-900 border border-purple-300"
                        }`}>
                          {ref.targetPrasthana}
                        </span>
                        <strong className="text-xs font-serif font-bold text-[#2D2319]">
                          {ref.sourceRef}
                        </strong>
                      </div>

                      {/* Jump to Cross-Referenced Grantha if available */}
                      <div className="flex items-center gap-1.5">
                        {ref.granthaId && onNavigateToGrantha && (
                          <button
                            type="button"
                            onClick={() => onNavigateToGrantha(ref.granthaId!, ref.chapterId, ref.verseId)}
                            className="px-2 py-1 bg-[#FFFDF8] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] text-[11px] font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title={`Navigate directly to ${ref.sourceRef} in the Granthasāraṇī`}
                          >
                            <span>Open Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}

                        {ref.granthaId && onCompareWithGrantha && (
                          <button
                            type="button"
                            onClick={() => onCompareWithGrantha(ref.granthaId!)}
                            className="px-2 py-1 bg-[#FFFDF8] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] text-[11px] font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
                            title={`Compare Nyāyaprasthāna with ${ref.sourceRef} side-by-side`}
                          >
                            <Scale className="w-3 h-3" />
                            <span>Compare</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quote */}
                    {ref.sanskritQuote && (
                      <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#bf953f]/20 text-xs">
                        <div className="font-serif font-bold text-[#2D2319]">
                          {transliterate(ref.sanskritQuote)}
                        </div>
                        {ref.quoteIast && (
                          <div className="font-mono text-[#735013] text-[11px] italic mt-0.5">
                            {ref.quoteIast}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-[#5c4731] leading-relaxed">
                      <strong className="text-[#8c6011]">Hermeneutical Role:</strong> {ref.hermeneuticalRole}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
