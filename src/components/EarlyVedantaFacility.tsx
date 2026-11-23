import React, { useState, useMemo, useEffect } from "react";
import {
  EARLY_VEDANTA_RESEARCH,
  PreSankaraThinker,
  EarlyVedantaSourceVolume,
  EarlyVedantaSutraTeacher,
  EarlyVedantaBuddhistJainaCitation
} from "../earlyVedantaData";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import ConnectAndShareModal from "./ConnectAndShareModal";
import {
  BookOpen,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  GitFork,
  Scale,
  Calendar,
  Quote,
  Share2,
  Filter,
  CheckCircle2,
  ChevronRight,
  BookMarked,
  Scroll,
  Library,
  Award,
  Globe,
  Flame,
  FileText
} from "lucide-react";

interface EarlyVedantaFacilityProps {
  initialThinkerId?: string | null;
  onThinkerSelect?: (thinkerId: string | null) => void;
  onNavigateToText?: (textId: string, chapterId?: string) => void;
  onNavigateToParampara?: (paramparaId: string) => void;
  onOpenSastrartha?: (topicPrompt?: string) => void;
}

export default function EarlyVedantaFacility({
  initialThinkerId,
  onThinkerSelect,
  onNavigateToText,
  onNavigateToParampara,
  onOpenSastrartha
}: EarlyVedantaFacilityProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [activeTab, setActiveTab] = useState<"thinkers" | "volumes" | "sutras" | "external">("thinkers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThinkerId, setSelectedThinkerId] = useState<string | null>(initialThinkerId || null);
  const [selectedVolumeNum, setSelectedVolumeNum] = useState<number | null>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const data = EARLY_VEDANTA_RESEARCH;

  useEffect(() => {
    if (initialThinkerId) {
      setSelectedThinkerId(initialThinkerId);
    }
  }, [initialThinkerId]);

  const handleSelectThinker = (id: string) => {
    setSelectedThinkerId(id);
    onThinkerSelect?.(id);
  };

  // Filter thinkers
  const filteredThinkers = useMemo(() => {
    if (!searchQuery.trim()) return data.preSankaraThinkers;
    const q = searchQuery.toLowerCase();
    return data.preSankaraThinkers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.devanagariName.toLowerCase().includes(q) ||
        t.coreDoctrine.toLowerCase().includes(q) ||
        t.philosophicalSchool.toLowerCase().includes(q) ||
        t.nakamuraAnalysis.toLowerCase().includes(q)
    );
  }, [searchQuery, data.preSankaraThinkers]);

  // Filter external citations
  const filteredCitations = useMemo(() => {
    if (!searchQuery.trim()) return data.externalCitations;
    const q = searchQuery.toLowerCase();
    return data.externalCitations.filter(
      (c) =>
        c.author.toLowerCase().includes(q) ||
        c.sourceWork.toLowerCase().includes(q) ||
        c.vedanticViewDescribed.toLowerCase().includes(q) ||
        c.nakamuraCommentary.toLowerCase().includes(q)
    );
  }, [searchQuery, data.externalCitations]);

  const selectedThinker = data.preSankaraThinkers.find((t) => t.id === selectedThinkerId) || filteredThinkers[0];
  const selectedVolume = data.volumes.find((v) => v.volumeNumber === selectedVolumeNum) || data.volumes[0];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="card-3d-gold p-5 sm:p-6 relative overflow-hidden space-y-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-36 bg-[#f3d999]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-[#d4af37] to-[#c59b27] text-[#120e0b] rounded-2xl shadow-sm">
              <Scroll className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8c6011] bg-[#FAF1E2] px-2.5 py-0.5 rounded-full border border-[#bf953f]/30">
                Academic Research Core • Hajime Nakamura Archive
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black gold-text-gradient uppercase tracking-wide mt-0.5">
                {data.workTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#8c6011] text-xs font-serif font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Share Early Vedanta Monograph"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Research</span>
            </button>

            <a
              href={data.archiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:from-[#e0bd4b] hover:to-[#d4af37] text-[#120e0b] text-xs font-serif font-bold transition shadow-sm flex items-center gap-1.5"
              title="Open full monograph on Internet Archive"
            >
              <span>Archive.org Monograph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Epigraph Card */}
        <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#bf953f]/40 shadow-inner space-y-2">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#8c6011]">
            <Quote className="w-4 h-4 text-[#8c6011]" />
            <span>Foundational Canonical Epigraph (Chāndogya Upaniṣad VI.2.1):</span>
          </div>
          <div className="font-serif text-sm sm:text-base font-bold text-[#2D2319] leading-relaxed">
            {transliterate(data.epigraphSanskrit, activeLipi)}
          </div>
          <div className="text-xs font-mono italic text-[#735013]">
            {data.epigraphIAST}
          </div>
          <div className="text-xs text-[#5c4731] font-serif border-t border-[#bf953f]/20 pt-1.5">
            {data.epigraphTranslation}
          </div>
        </div>

        {/* Author Bio & Monograph Abstract */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="lg:col-span-2 p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/30 space-y-1.5">
            <span className="font-serif font-bold text-[#8c6011] text-xs uppercase tracking-wider block">
              Monograph Overview & Scope:
            </span>
            <p className="text-[#3b2e21] leading-relaxed font-serif">
              {data.monographOverview}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/30 space-y-1.5">
            <span className="font-serif font-bold text-[#8c6011] text-xs uppercase tracking-wider block">
              Research Authorship & Archive:
            </span>
            <p className="font-serif font-bold text-[#2D2319]">
              {data.author} ({data.japaneseTitle})
            </p>
            <p className="text-[#6e5842] leading-relaxed text-[11px]">
              {data.authorBio}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Warm Parchment & Gold Navigation Tabs Ribbon */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF5ED] rounded-2xl border border-[#bf953f]/35 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("thinkers")}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "thinkers"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] hover:text-[#1F140A] border border-[#bf953f]/30"
          }`}
        >
          <Award className="w-4 h-4 text-[#8c6011]" />
          <span>Pre-Śaṅkara Thinkers ({data.preSankaraThinkers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("volumes")}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "volumes"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] hover:text-[#1F140A] border border-[#bf953f]/30"
          }`}
        >
          <Layers className="w-4 h-4 text-[#8c6011]" />
          <span>4-Volume Opus Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sutras")}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "sutras"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] hover:text-[#1F140A] border border-[#bf953f]/30"
          }`}
        >
          <Scale className="w-4 h-4 text-[#8c6011]" />
          <span>Brahma Sūtra Preceptors ({data.sutraDisputants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("external")}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "external"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] hover:text-[#1F140A] border border-[#bf953f]/30"
          }`}
        >
          <Globe className="w-4 h-4 text-[#8c6011]" />
          <span>Buddhist & Jaina Records ({data.externalCitations.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c6011]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pre-Śaṅkara thinkers, doctrines (Bhedābheda, Sphoṭa, Ajātivāda), citations..."
            className="w-full pl-10 pr-4 py-2 bg-[#FFFDF8] border border-[#bf953f]/40 rounded-xl text-xs sm:text-sm text-[#2D2319] placeholder-[#8c6011]/60 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8c6011] hover:text-[#2D2319]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. Tab Content 1: Pre-Sankara Thinkers Matrix */}
      {activeTab === "thinkers" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Thinker List (Left 4 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center justify-between">
              <span>Pre-Śaṅkara Masters ({filteredThinkers.length}):</span>
              <span className="text-[10px] text-[#6e5842]">c. 350 CE – 750 CE</span>
            </div>

            <div className="space-y-2">
              {filteredThinkers.map((thinker) => {
                const isSelected = selectedThinker.id === thinker.id;
                return (
                  <button
                    key={thinker.id}
                    type="button"
                    onClick={() => handleSelectThinker(thinker.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                        : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] border-[#bf953f]/30 shadow-xs"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? "bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/40" : "bg-[#FAF5EC] text-[#8c6011]"}`}>
                      <Award className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif font-black text-sm text-[#2D2319] truncate">
                          {thinker.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-[#8c6011] bg-[#FAF5ED] px-1.5 py-0.5 rounded border border-[#bf953f]/25 shrink-0">
                          {thinker.centuryPeriod}
                        </span>
                      </div>

                      <div className="text-xs font-serif font-bold text-[#8c6011] mt-0.5">
                        {transliterate(thinker.devanagariName, activeLipi)}
                      </div>

                      <div className="text-[11px] text-[#5c4731] font-mono mt-1 truncate">
                        {thinker.coreDoctrine}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 self-center shrink-0 ${isSelected ? "text-[#8c6011] translate-x-1" : "text-[#bf953f]/60"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thinker Detailed Scholarly Monograph (Right 7 cols) */}
          <div className="lg:col-span-7">
            {selectedThinker && (
              <div className="card-3d-gold p-5 sm:p-6 space-y-4 sticky top-20">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#bf953f]/30">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8c6011] bg-[#FAF1E2] px-2 py-0.5 rounded-md border border-[#bf953f]/30">
                      {selectedThinker.philosophicalSchool}
                    </span>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-[#2D2319] mt-1">
                      {selectedThinker.name}
                    </h3>
                    <div className="font-serif text-sm font-bold text-[#8c6011]">
                      {transliterate(selectedThinker.devanagariName, activeLipi)} • {selectedThinker.centuryPeriod}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSastrartha) {
                        onOpenSastrartha(`Examine the pre-Śaṅkara Vedāntic doctrine of ${selectedThinker.name} (${selectedThinker.coreDoctrine}) according to Hajime Nakamura's research.`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] text-xs font-serif font-bold border border-[#bf953f]/40 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Debate in Counsel</span>
                  </button>
                </div>

                {/* Core Doctrine & Epistemology */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#bf953f]/40 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c6011] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    Core Doctrine: {selectedThinker.coreDoctrine}
                  </span>
                  <p className="text-xs sm:text-sm text-[#3b2e21] font-serif leading-relaxed">
                    {selectedThinker.epistemologyAndOntology}
                  </p>
                </div>

                {/* Nakamura's Philological Assessment */}
                <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/30 space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c6011] flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-[#8c6011]" />
                    Prof. Hajime Nakamura's Historical Assessment:
                  </span>
                  <p className="text-xs text-[#4a3928] font-serif italic leading-relaxed">
                    "{selectedThinker.nakamuraAnalysis}"
                  </p>
                </div>

                {/* Citations in Later Classical Works */}
                <div className="space-y-2 text-xs">
                  <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
                    Classical Citations & Scholarly Testimonies:
                  </span>
                  <ul className="space-y-1.5">
                    {selectedThinker.citationsInLaterTraditions.map((cit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#4a3928] bg-white p-2.5 rounded-xl border border-[#bf953f]/25">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6011] shrink-0 mt-0.5" />
                        <span className="font-serif leading-relaxed">{cit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Works / Fragments */}
                <div className="pt-2 border-t border-[#bf953f]/20 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#8c6011] font-bold">Key Works / Fragments:</span>
                  {selectedThinker.keyExtantFragmentsOrWorks.map((work, idx) => (
                    <span key={idx} className="text-[11px] font-serif bg-[#FAF5ED] px-2.5 py-1 rounded-lg border border-[#bf953f]/30 text-[#2D2319] font-bold">
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Tab Content 2: 4-Volume Monograph Breakdown */}
      {activeTab === "volumes" && (
        <div className="space-y-5">
          {/* Volume Selection Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.volumes.map((vol) => {
              const isSelected = selectedVolumeNum === vol.volumeNumber;
              return (
                <button
                  key={vol.volumeNumber}
                  type="button"
                  onClick={() => setSelectedVolumeNum(vol.volumeNumber)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                      : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] border-[#bf953f]/30 shadow-xs"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8c6011] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#bf953f]/25">
                      Volume {vol.volumeNumber}
                    </span>
                    <h4 className="font-serif font-black text-sm text-[#2D2319] mt-1.5 leading-tight">
                      {vol.volumeTitle.split(":")[1] || vol.volumeTitle}
                    </h4>
                  </div>
                  <div className="text-[10px] font-mono text-[#6e5842] border-t border-[#bf953f]/20 pt-1.5">
                    Era: {vol.historicalPeriodCovered}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Volume Deep-Dive */}
          {selectedVolume && (
            <div className="card-3d-gold p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#bf953f]/30">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c6011]">
                    Archive Monograph Volume {selectedVolume.volumeNumber}
                  </span>
                  <h3 className="font-serif font-black text-xl text-[#2D2319] mt-0.5">
                    {selectedVolume.volumeTitle}
                  </h3>
                  <p className="text-xs font-serif text-[#6e5842] mt-0.5">
                    {selectedVolume.subtitle} • Historical Horizon: <strong>{selectedVolume.historicalPeriodCovered}</strong>
                  </p>
                </div>

                <a
                  href={data.archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] text-xs font-serif font-bold border border-[#bf953f]/40 flex items-center gap-1.5 transition"
                >
                  <span>Read Volume on Archive.org</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Core Findings Box */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#bf953f]/40 space-y-1.5 text-xs sm:text-sm">
                <span className="font-serif font-bold text-[#8c6011] uppercase tracking-wider block text-xs">
                  Executive Philological Findings:
                </span>
                <p className="text-[#3b2e21] font-serif leading-relaxed">
                  {selectedVolume.coreFindings}
                </p>
              </div>

              {/* Key Themes Chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
                  Core Themes Analyzed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVolume.keyThemes.map((theme, idx) => (
                    <span key={idx} className="text-xs font-serif bg-white px-3 py-1 rounded-xl border border-[#bf953f]/30 text-[#4a3928]">
                      • {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chapter-by-Chapter Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
                  Chapter Exegesis & Doctrinal Insights:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {selectedVolume.chapters.map((ch, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#8c6011] bg-white px-2 py-0.5 rounded border border-[#bf953f]/25">
                          {ch.chapterNumber}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#2D2319]">
                        {ch.title}
                      </h4>
                      <p className="text-[#4a3928] font-serif leading-relaxed">
                        {ch.summary}
                      </p>
                      <div className="pt-2 border-t border-[#bf953f]/20 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#8c6011] block uppercase">Key Insights:</span>
                        <ul className="space-y-1 text-[#5c4731]">
                          {ch.keyInsights.map((ins, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#8c6011] font-bold">›</span>
                              <span className="font-serif">{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content 3: Brahma Sūtra Preceptors & Disputants */}
      {activeTab === "sutras" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#bf953f]/40 text-xs sm:text-sm text-[#4a3928] font-serif leading-relaxed">
            In Chapter IV of his research, Prof. Nakamura demonstrates that the Brahma Sūtras explicitly quote seven ancient preceptors by name. These quotations prove that diverse Vedāntic interpretations regarding the relationship between the Individual Self (Jīva) and the Supreme (Brahman)—ranging from pure non-difference to difference-in-identity—flourished before Bādarāyaṇa finalized the aphorisms.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data.sutraDisputants.map((disp, idx) => (
              <div key={idx} className="card-3d-gold p-4 rounded-2xl space-y-2.5 text-xs flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-black text-base text-[#2D2319]">
                      {disp.name}
                    </h4>
                    <span className="font-serif text-xs font-bold text-[#8c6011]">
                      {transliterate(disp.devanagariName, activeLipi)}
                    </span>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-[#bf953f]/25 font-mono text-[10px] text-[#8c6011]">
                    {disp.sutraReferences.join(" • ")}
                  </div>

                  <p className="text-[#3b2e21] font-serif leading-relaxed">
                    <strong>Ontological Position:</strong> {disp.viewOnJivaBrahmanRelation}
                  </p>
                </div>

                <div className="p-2.5 bg-[#FAF5EC] rounded-xl border border-[#bf953f]/25 text-[11px] text-[#6e5842] italic font-serif">
                  <strong className="not-italic text-[#8c6011]">Nakamura Note: </strong>
                  {disp.nakamuraHistoricalAssessment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab Content 4: External Buddhist & Jaina Records */}
      {activeTab === "external" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#bf953f]/40 text-xs sm:text-sm text-[#4a3928] font-serif leading-relaxed">
            One of Prof. Nakamura's greatest contributions was translating and critically contextualizing external Buddhist and Jaina philosophical treatises from 500–800 CE. These external testimonies prove that early Vedānta was celebrated as a premier philosophical darśana across ancient Indian universities.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCitations.map((cit, idx) => (
              <div key={idx} className="card-3d-gold p-5 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#bf953f]/30">
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${cit.tradition === "Buddhist" ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"}`}>
                      {cit.tradition} Source
                    </span>
                    <h4 className="font-serif font-black text-sm text-[#2D2319] mt-1">
                      {cit.author} ({cit.century})
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#8c6011]">
                    {cit.sectionOrChapter}
                  </span>
                </div>

                <div className="font-serif font-bold text-xs text-[#8c6011]">
                  Treatise: {cit.sourceWork}
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#bf953f]/30 text-[#3b2e21] font-serif leading-relaxed">
                  <strong className="text-[#8c6011] block mb-0.5">Vedāntic Philosophy as Depicted:</strong>
                  {cit.vedanticViewDescribed}
                </div>

                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#bf953f]/25 text-[#5c4731] font-serif italic leading-relaxed">
                  <strong className="not-italic text-[#8c6011] block mb-0.5">Nakamura's Indological Analysis:</strong>
                  "{cit.nakamuraCommentary}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      <ConnectAndShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="A History of Early Vedānta Philosophy — Prof. Hajime Nakamura"
        subtitle="Pre-Śaṅkara Masters, Upaniṣadic Stratification & Buddhist/Jaina Citations"
        url="https://archive.org/details/AHistoryOfEarlyVedantaPhilosophyHajimeNakamura"
        summaryText="Explore the pre-Śaṅkara Vedānta thinkers (Upavarṣa, Bodhāyana, Ṭaṅka, Dramiḍa, Bhartṛprapañca, Bhartṛhari, Gauḍapāda) reconstructed in Prof. Hajime Nakamura's seminal 4-volume monograph on vedāntatattvaṁ."
        citationText="Nakamura, Hajime. (1983–1990). A History of Early Vedānta Philosophy (Vols 1–4). English translation by Trevor Leggett et al. Delhi: Motilal Banarsidass / Harvard-Yenching Institute."
        onOpenSastrartha={() => onOpenSastrartha && onOpenSastrartha("Debate the pre-Śaṅkara Bhedābheda vs Advaita views")}
      />
    </div>
  );
}

export { EarlyVedantaFacility };
