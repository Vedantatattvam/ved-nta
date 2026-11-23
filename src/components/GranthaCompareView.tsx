import React, { useState, useMemo, useRef } from "react";
import { PRESEEDED_GRANTHAS } from "../data";
import { TextEntry, GranthaChapter, GranthaVerse, TabType } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import { CANONICAL_PORTAL_URL } from "../utils/shareUtils";
import { exportSideBySideVerseCompareToPdf } from "../utils/academicPdfExport";
import VedicChantButton from "./VedicChantButton";
import {
  Columns,
  Scale,
  ArrowLeftRight,
  Copy,
  Check,
  BookOpen,
  Scroll,
  GitFork,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  Bookmark,
  Share2,
  FileDown,
  Loader2
} from "lucide-react";
import { CitationButton } from "./CitationButton";
import BharatiyaLipiSwitcher from "./BharatiyaLipiSwitcher";
import AcademicShareModal, { AcademicShareData } from "./AcademicShareModal";

interface GranthaCompareViewProps {
  onBackToCatalog?: () => void;
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
  initialLeftGranthaId?: string;
  initialRightGranthaId?: string;
  initialLeftVerseId?: string;
  initialRightVerseId?: string;
}

interface CuratedComparativePreset {
  id: string;
  label: string;
  description: string;
  leftGranthaId: string;
  leftChapterIndex?: number;
  leftVerseIndex?: number;
  rightGranthaId: string;
  rightChapterIndex?: number;
  rightVerseIndex?: number;
  philosophicalCrux: string;
}

const CURATED_PRESETS: CuratedComparativePreset[] = [
  {
    id: "advaita-vs-visistadvaita-1",
    label: "Vivekacūḍāmaṇi vs Śrībhāṣya",
    description: "Brahmātmaikya (Identity) vs Śarīra-Śarīrī-Bhāva (Inherent Attribute)",
    leftGranthaId: "vivekacudamani",
    leftChapterIndex: 0,
    leftVerseIndex: 0,
    rightGranthaId: "sribhasya",
    rightChapterIndex: 0,
    rightVerseIndex: 0,
    philosophicalCrux: "Advaita posits pure non-dual consciousness beyond subject-object dichotomy, while Viśiṣṭādvaita asserts Brahman as the inner ruler endowed with infinite auspicious qualities and the cosmos as His divine body."
  },
  {
    id: "epistemology-vp-vs-ymd",
    label: "Vedāntaparibhāṣā vs Yatīndramatadīpikā",
    description: "Advaita Epistemology vs Viśiṣṭādvaita Epistemology",
    leftGranthaId: "vedantaparibhasa",
    leftChapterIndex: 0,
    leftVerseIndex: 0,
    rightGranthaId: "yatindramatadipika",
    rightChapterIndex: 0,
    rightVerseIndex: 0,
    philosophicalCrux: "Vedāntaparibhāṣā structures perception around mental modifications (Vṛtti) removing Avidyā to unveil Brahman, whereas Yatīndramatadīpikā establishes the reality of Dharmabhūtajñāna (attributive consciousness) apprehending real objective difference."
  },
  {
    id: "dvaita-refutation-vs-advaita",
    label: "Upādhikhaṇḍana vs Vivekacūḍāmaṇi",
    description: "Dvaita Plurality vs Advaita Superimposition",
    leftGranthaId: "upadhikhandana",
    leftChapterIndex: 0,
    leftVerseIndex: 0,
    rightGranthaId: "vivekacudamani",
    rightChapterIndex: 0,
    rightVerseIndex: 1,
    philosophicalCrux: "Madhvācārya dismantles the concept of limiting adjuncts (Upādhis) as non-explanatory of real distinction, whereas Śaṅkara affirms ignorance (Avidyā) as anirvacanīya (indescribable) causing the apparent appearance of plurality."
  },
  {
    id: "bengal-acintya-vs-suddhadvaita",
    label: "Siddhāntaratna vs Anubhāṣya",
    description: "Acintya Bhedābheda vs Śuddhādvaita Puṣṭi",
    leftGranthaId: "siddhantaratna",
    leftChapterIndex: 0,
    leftVerseIndex: 0,
    rightGranthaId: "anubhasya",
    rightChapterIndex: 0,
    rightVerseIndex: 0,
    philosophicalCrux: "Baladeva Vidyābhūṣaṇa synthesizes simultaneous identity and difference via inconceivable potency (Acintya-śakti), while Vallabhācārya posits pure non-dual transformation without Māyā (Avikṛta Pariṇāma)."
  },
  {
    id: "modern-integral-exegesis",
    label: "Swami Vivekananda vs Sri Aurobindo",
    description: "Practical Vedānta (Dynamic Oneness) vs Integral Brahman (Supramental Descent)",
    leftGranthaId: "vivekananda-practical-vedanta",
    leftChapterIndex: 0,
    leftVerseIndex: 0,
    rightGranthaId: "aurobindo-life-divine",
    rightChapterIndex: 0,
    rightVerseIndex: 0,
    philosophicalCrux: "Vivekananda translates Kevalādvaita into practical universal service (Śiva-jñāne Jīva-sevā), whereas Sri Aurobindo sees the world not as an illusion to be escaped but as an evolving manifestation of the Supramental Divine."
  }
];

export default function GranthaCompareView({
  onBackToCatalog,
  onNavigateToTab,
  initialLeftGranthaId = "vivekacudamani",
  initialRightGranthaId = "sribhasya",
  initialLeftVerseId,
  initialRightVerseId,
}: GranthaCompareViewProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();

  // Compare mode: "verse" (specific verses side-by-side) or "chapter" (full chapter flow side-by-side)
  const [compareMode, setCompareMode] = useState<"verse" | "chapter">("verse");
  const [syncScroll, setSyncScroll] = useState(false);
  const [copiedCitationSide, setCopiedCitationSide] = useState<"left" | "right" | "dual" | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);

  // Left Column State
  const [leftGranthaId, setLeftGranthaId] = useState<string>(initialLeftGranthaId);
  const leftGrantha = useMemo(() => {
    return PRESEEDED_GRANTHAS.find((g) => g.id === leftGranthaId) || PRESEEDED_GRANTHAS[0];
  }, [leftGranthaId]);

  const [leftChapterId, setLeftChapterId] = useState<string>(() => {
    return leftGrantha.chapters?.[0]?.id || "";
  });

  const leftChapter = useMemo(() => {
    if (!leftGrantha.chapters || leftGrantha.chapters.length === 0) return null;
    return leftGrantha.chapters.find((c) => c.id === leftChapterId) || leftGrantha.chapters[0];
  }, [leftGrantha, leftChapterId]);

  const [leftVerseId, setLeftVerseId] = useState<string>(() => {
    if (initialLeftVerseId) return initialLeftVerseId;
    return leftChapter?.verses?.[0]?.id || "";
  });

  const leftVerse = useMemo(() => {
    if (!leftChapter?.verses || leftChapter.verses.length === 0) return null;
    return leftChapter.verses.find((v) => v.id === leftVerseId) || leftChapter.verses[0];
  }, [leftChapter, leftVerseId]);

  // Right Column State
  const [rightGranthaId, setRightGranthaId] = useState<string>(initialRightGranthaId);
  const rightGrantha = useMemo(() => {
    return PRESEEDED_GRANTHAS.find((g) => g.id === rightGranthaId) || PRESEEDED_GRANTHAS[1] || PRESEEDED_GRANTHAS[0];
  }, [rightGranthaId]);

  const [rightChapterId, setRightChapterId] = useState<string>(() => {
    return rightGrantha.chapters?.[0]?.id || "";
  });

  const rightChapter = useMemo(() => {
    if (!rightGrantha.chapters || rightGrantha.chapters.length === 0) return null;
    return rightGrantha.chapters.find((c) => c.id === rightChapterId) || rightGrantha.chapters[0];
  }, [rightGrantha, rightChapterId]);

  const [rightVerseId, setRightVerseId] = useState<string>(() => {
    if (initialRightVerseId) return initialRightVerseId;
    return rightChapter?.verses?.[0]?.id || "";
  });

  const rightVerse = useMemo(() => {
    if (!rightChapter?.verses || rightChapter.verses.length === 0) return null;
    return rightChapter.verses.find((v) => v.id === rightVerseId) || rightChapter.verses[0];
  }, [rightChapter, rightVerseId]);

  // Scroll references for synchronized scrolling
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const isScrollingSync = useRef(false);

  const handleLeftScroll = () => {
    if (!syncScroll || isScrollingSync.current) return;
    isScrollingSync.current = true;
    if (leftPaneRef.current && rightPaneRef.current) {
      const percentage =
        leftPaneRef.current.scrollTop /
        (leftPaneRef.current.scrollHeight - leftPaneRef.current.clientHeight);
      rightPaneRef.current.scrollTop =
        percentage * (rightPaneRef.current.scrollHeight - rightPaneRef.current.clientHeight);
    }
    setTimeout(() => {
      isScrollingSync.current = false;
    }, 50);
  };

  const handleRightScroll = () => {
    if (!syncScroll || isScrollingSync.current) return;
    isScrollingSync.current = true;
    if (leftPaneRef.current && rightPaneRef.current) {
      const percentage =
        rightPaneRef.current.scrollTop /
        (rightPaneRef.current.scrollHeight - rightPaneRef.current.clientHeight);
      leftPaneRef.current.scrollTop =
        percentage * (leftPaneRef.current.scrollHeight - leftPaneRef.current.clientHeight);
    }
    setTimeout(() => {
      isScrollingSync.current = false;
    }, 50);
  };

  // Swap Left and Right Granthas
  const handleSwapColumns = () => {
    const tempG = leftGranthaId;
    const tempC = leftChapterId;
    const tempV = leftVerseId;

    setLeftGranthaId(rightGranthaId);
    setLeftChapterId(rightChapterId);
    setLeftVerseId(rightVerseId);

    setRightGranthaId(tempG);
    setRightChapterId(tempC);
    setRightVerseId(tempV);
  };

  // Apply curated comparative preset
  const handleApplyPreset = (preset: CuratedComparativePreset) => {
    setLeftGranthaId(preset.leftGranthaId);
    const lg = PRESEEDED_GRANTHAS.find((g) => g.id === preset.leftGranthaId);
    if (lg && lg.chapters) {
      const cIdx = preset.leftChapterIndex ?? 0;
      const ch = lg.chapters[cIdx] || lg.chapters[0];
      setLeftChapterId(ch?.id || "");
      const vIdx = preset.leftVerseIndex ?? 0;
      const vr = ch?.verses?.[vIdx] || ch?.verses?.[0];
      setLeftVerseId(vr?.id || "");
    }

    setRightGranthaId(preset.rightGranthaId);
    const rg = PRESEEDED_GRANTHAS.find((g) => g.id === preset.rightGranthaId);
    if (rg && rg.chapters) {
      const cIdx = preset.rightChapterIndex ?? 0;
      const ch = rg.chapters[cIdx] || rg.chapters[0];
      setRightChapterId(ch?.id || "");
      const vIdx = preset.rightVerseIndex ?? 0;
      const vr = ch?.verses?.[vIdx] || ch?.verses?.[0];
      setRightVerseId(vr?.id || "");
    }
  };

  // Copy Citation Handlers
  const handleCopyLeftCitation = () => {
    if (!leftVerse) return;
    const text = `=== ${leftGrantha.title} (${leftVerse.number}: ${leftVerse.title || ""}) ===
Author: ${leftGrantha.author} | School: ${leftGrantha.school}
[Mūla Sanskrit]
${leftVerse.mulaSanskrit}

[IAST]
${leftVerse.mulaIast}

[Translation]
${leftVerse.englishTranslation}

Academic Reference: ${leftGrantha.author}, ${leftGrantha.title} (${leftVerse.number}). vedāntatattvaṁ Platform, ${CANONICAL_PORTAL_URL}`;
    navigator.clipboard.writeText(text);
    setCopiedCitationSide("left");
    setTimeout(() => setCopiedCitationSide(null), 2200);
  };

  const handleCopyRightCitation = () => {
    if (!rightVerse) return;
    const text = `=== ${rightGrantha.title} (${rightVerse.number}: ${rightVerse.title || ""}) ===
Author: ${rightGrantha.author} | School: ${rightGrantha.school}
[Mūla Sanskrit]
${rightVerse.mulaSanskrit}

[IAST]
${rightVerse.mulaIast}

[Translation]
${rightVerse.englishTranslation}

Academic Reference: ${rightGrantha.author}, ${rightGrantha.title} (${rightVerse.number}). vedāntatattvaṁ Platform, ${CANONICAL_PORTAL_URL}`;
    navigator.clipboard.writeText(text);
    setCopiedCitationSide("right");
    setTimeout(() => setCopiedCitationSide(null), 2200);
  };

  const handleCopyDualComparativeMatrix = () => {
    const text = `===============================================================
VEDĀNTATATTVAṀ COMPARATIVE EXEGESIS MATRIX
Canonical Reference: ${CANONICAL_PORTAL_URL}
===============================================================

[PRIMARY TEXT A]
Treatise: ${leftGrantha.title} (${leftGrantha.school})
Author / Century: ${leftGrantha.author} (${leftGrantha.century})
Section: ${leftChapter?.chapterTitle || ""}
Verse / Sūtra: ${leftVerse?.number || ""} - ${leftVerse?.title || ""}
Sanskrit Mūla:
${leftVerse?.mulaSanskrit || ""}

Translation:
${leftVerse?.englishTranslation || ""}

---------------------------------------------------------------
[COUNTERPART TEXT B]
Treatise: ${rightGrantha.title} (${rightGrantha.school})
Author / Century: ${rightGrantha.author} (${rightGrantha.century})
Section: ${rightChapter?.chapterTitle || ""}
Verse / Sūtra: ${rightVerse?.number || ""} - ${rightVerse?.title || ""}
Sanskrit Mūla:
${rightVerse?.mulaSanskrit || ""}

Translation:
${rightVerse?.englishTranslation || ""}

---------------------------------------------------------------
[PHILOSOPHICAL DIVERGENCE & SYNTHESIS]
School A (${leftGrantha.school}) vs School B (${rightGrantha.school})
Text A Assertion: ${leftGrantha.supportsDet}
Text B Assertion: ${rightGrantha.supportsDet}
Platform: vedāntatattvaṁ Digital Indological Research Repository (${CANONICAL_PORTAL_URL})
===============================================================`;
    navigator.clipboard.writeText(text);
    setCopiedCitationSide("dual");
    setTimeout(() => setCopiedCitationSide(null), 2200);
  };

  const dualShareData: AcademicShareData = {
    title: `Comparative Exegesis: ${leftGrantha.title} vs ${rightGrantha.title}`,
    subtitle: `${leftVerse?.number || ""} & ${rightVerse?.number || ""}`,
    sanskritText: `${leftVerse?.mulaSanskrit || ""}\n\n[vs]\n\n${rightVerse?.mulaSanskrit || ""}`,
    translation: `(${leftGrantha.school}): ${leftVerse?.englishTranslation || ""}\n\n(${rightGrantha.school}): ${rightVerse?.englishTranslation || ""}`,
    sourceText: `${leftGrantha.title} (${leftGrantha.author}) • ${rightGrantha.title} (${rightGrantha.author})`,
    authorOrSchool: `${leftGrantha.school} vs ${rightGrantha.school}`,
    url: `${CANONICAL_PORTAL_URL}/#mapping?compareLeft=${leftGrantha.id}&compareRight=${rightGrantha.id}`,
    type: "comparative",
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="card-3d-gold p-4 sm:p-5 relative overflow-hidden space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6011] text-[#FFFDF8] flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg gold-text-gradient tracking-wide">
                  Grantha Sāmyadāyinī: Dual-Column Comparative Exegesis
                </h3>
                <span className="text-[10px] font-mono uppercase bg-[#8c6011]/15 text-[#8c6011] px-2 py-0.5 rounded-full font-bold border border-[#8c6011]/30">
                  Compare Mode
                </span>
              </div>
              <p className="text-xs text-[#5c4731] font-serif">
                Select two treatises, chapters, or verses to place Sanskrit mūla, word padaccheda, bhāṣya, and translations side-by-side for dialectical analysis.
              </p>
            </div>
          </div>

          {/* Top Actions: Back to Catalog & Script Indicator */}
          <div className="flex flex-wrap items-center gap-2">
            <BharatiyaLipiSwitcher variant="compact" />

            {onBackToCatalog && (
              <button
                type="button"
                onClick={onBackToCatalog}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/40 text-xs font-serif font-bold text-[#8c6011] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle, Scroll Lock & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Compare Granularity Switcher */}
          <div className="flex items-center gap-1 bg-[#FFFDF8] p-1 rounded-xl border border-[#bf953f]/30 shadow-2xs">
            <button
              type="button"
              onClick={() => setCompareMode("verse")}
              className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                compareMode === "verse"
                  ? "bg-gradient-to-r from-[#8c6011] to-[#6e4604] text-[#FFFDF8] shadow-xs"
                  : "text-[#8c6011] hover:bg-[#FAF1E2]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Verse-by-Verse Side-by-Side</span>
            </button>

            <button
              type="button"
              onClick={() => setCompareMode("chapter")}
              className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                compareMode === "chapter"
                  ? "bg-gradient-to-r from-[#8c6011] to-[#6e4604] text-[#FFFDF8] shadow-xs"
                  : "text-[#8c6011] hover:bg-[#FAF1E2]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Chapter Flow</span>
            </button>
          </div>

          {/* Middle Controls: Swap & Scroll Lock */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwapColumns}
              className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-serif font-bold text-[#8c6011] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Swap Left and Right Columns"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Columns</span>
            </button>

            <label className="flex items-center gap-1.5 text-xs text-[#5c4731] font-mono bg-[#FFFDF8] px-2.5 py-1.5 rounded-xl border border-[#bf953f]/30 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncScroll}
                onChange={(e) => setSyncScroll(e.target.checked)}
                className="rounded text-[#8c6011] focus:ring-[#8c6011]"
              />
              <span>Sync Scrolling</span>
            </label>
          </div>

          {/* Right Controls: Copy Dual Matrix & Export */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDualComparativeMatrix}
              className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-serif font-bold text-[#8c6011] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Copy side-by-side text matrix to clipboard"
            >
              {copiedCitationSide === "dual" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800 font-bold">Dual Matrix Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span>Copy Dual Matrix</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isPdfExporting}
              onClick={async () => {
                if (leftGrantha && leftVerse && rightGrantha && rightVerse) {
                  try {
                    setIsPdfExporting(true);
                    const matchingPreset = CURATED_PRESETS.find(
                      (p) => p.leftGranthaId === leftGrantha.id && p.rightGranthaId === rightGrantha.id
                    );
                    await exportSideBySideVerseCompareToPdf({
                      leftGrantha,
                      leftVerse,
                      rightGrantha,
                      rightVerse,
                      philosophicalCrux: matchingPreset?.philosophicalCrux,
                    });
                  } finally {
                    setIsPdfExporting(false);
                  }
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              title="Download current side-by-side verse analysis layout as an academic PDF document"
            >
              {isPdfExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#120e0b] animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-[#120e0b]" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] hover:text-[#2D2319] font-medium text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Share & Export</span>
            </button>
          </div>
        </div>

        {/* Curated Presets Bar */}
        <div className="pt-2 border-t border-[#bf953f]/20">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#8c6011] font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb76c] fill-[#dfb76c]" />
            <span>Curated Classical Dialectical Pairs:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CURATED_PRESETS.map((preset) => {
              const isCurrent =
                leftGranthaId === preset.leftGranthaId && rightGranthaId === preset.rightGranthaId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-[#8c6011] text-[#FFFDF8] border-[#8c6011] shadow-xs font-bold"
                      : "bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#5c4731] border-[#bf953f]/30"
                  }`}
                  title={preset.philosophicalCrux}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dual-Column Main Comparison Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: TEXT A */}
        {/* ==================================================================== */}
        <div className="card-3d-gold p-4 sm:p-5 space-y-3.5 flex flex-col relative overflow-hidden">
          {/* Header Controls for Left Column */}
          <div className="space-y-2 border-b border-[#bf953f]/30 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase text-[#8c6011] font-bold bg-[#8c6011]/10 px-2 py-0.5 rounded-full border border-[#8c6011]/20">
                Column A (Reference / Siddhānta)
              </span>
              <span className="text-xs font-serif text-[#6e5842] italic">
                {leftGrantha.school}
              </span>
            </div>

            {/* Grantha Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#735013] font-bold block">
                Select Canonical Treatise A:
              </label>
              <div className="relative">
                <select
                  value={leftGranthaId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setLeftGranthaId(newId);
                    const found = PRESEEDED_GRANTHAS.find((g) => g.id === newId);
                    if (found?.chapters?.[0]) {
                      setLeftChapterId(found.chapters[0].id);
                      if (found.chapters[0].verses?.[0]) {
                        setLeftVerseId(found.chapters[0].verses[0].id);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-xl text-xs font-serif font-bold text-[#2D2319] focus:outline-hidden focus:ring-1 focus:ring-[#8c6011] cursor-pointer"
                >
                  {PRESEEDED_GRANTHAS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.transliteratedTitle}) — {g.author} [{g.school}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter & Verse Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono text-[#735013] font-bold block mb-1">
                  Chapter / Section:
                </label>
                <select
                  value={leftChapterId}
                  onChange={(e) => {
                    const newCId = e.target.value;
                    setLeftChapterId(newCId);
                    const ch = leftGrantha.chapters?.find((c) => c.id === newCId);
                    if (ch?.verses?.[0]) {
                      setLeftVerseId(ch.verses[0].id);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-lg text-xs font-serif text-[#2D2319] focus:outline-hidden cursor-pointer"
                >
                  {leftGrantha.chapters?.map((ch, idx) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.chapterTitle}
                    </option>
                  ))}
                </select>
              </div>

              {compareMode === "verse" && (
                <div>
                  <label className="text-[11px] font-mono text-[#735013] font-bold block mb-1">
                    Specific Verse / Sūtra:
                  </label>
                  <select
                    value={leftVerseId}
                    onChange={(e) => setLeftVerseId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-lg text-xs font-serif text-[#2D2319] focus:outline-hidden cursor-pointer"
                  >
                    {leftChapter?.verses?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.number}: {v.title || v.mulaIast.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Left Column Content Area */}
          <div
            ref={leftPaneRef}
            onScroll={handleLeftScroll}
            className="flex-1 space-y-4 overflow-y-auto max-h-[720px] pr-1"
          >
            {/* Treatise Overview Card */}
            <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-[#8c6011] text-sm">
                  {leftGrantha.title}
                </span>
                <span className="text-[10px] font-mono text-[#6e5842]">{leftGrantha.century}</span>
              </div>
              <div className="text-[11px] text-[#5c4731]">
                Author: <strong>{leftGrantha.author}</strong> | Base: <em>{leftGrantha.foundationalText}</em>
              </div>
            </div>

            {/* If Chapter Mode: list all verses in chapter */}
            {compareMode === "chapter" ? (
              <div className="space-y-4">
                <div className="p-3 bg-[#FFFDF8] rounded-xl border border-[#bf953f]/30 space-y-1">
                  <h4 className="font-serif font-bold text-xs text-[#8c6011]">
                    {leftChapter?.chapterTitle}
                  </h4>
                  <p className="text-xs text-[#5c4731] font-serif leading-relaxed italic">
                    {leftChapter?.summary}
                  </p>
                </div>

                {leftChapter?.verses?.map((v, vIdx) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-1.5">
                      <span className="text-xs font-mono font-bold text-[#8c6011]">
                        {v.number} {v.title ? `— ${v.title}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${v.mulaSanskrit}\n\n${v.englishTranslation}`);
                        }}
                        className="text-[10px] font-mono text-[#8c6011] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    {/* Sanskrit Mūla */}
                    <div className="text-base font-serif font-bold text-[#8c6011] leading-relaxed whitespace-pre-line">
                      {transliterate(v.mulaSanskrit)}
                    </div>

                    {/* IAST */}
                    <div className="text-xs font-serif text-[#5c4731] italic leading-relaxed whitespace-pre-line">
                      {v.mulaIast}
                    </div>

                    {/* Translation */}
                    <div className="text-xs font-serif text-[#2D2319] leading-relaxed pt-1 border-t border-[#bf953f]/15">
                      <strong className="text-[#8c6011]">Exegesis:</strong> {v.englishTranslation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Verse Mode: Deep single verse analysis */
              leftVerse && (
                <div className="space-y-3.5">
                  {/* Sanskrit Mūla Card */}
                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/40 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8c6011]">
                        {leftVerse.number} {leftVerse.title ? `— ${leftVerse.title}` : ""}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <VedicChantButton
                          verseText={leftVerse.mulaSanskrit}
                          variant="compact"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLeftCitation}
                          className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/30 text-[10px] font-mono text-[#8c6011] flex items-center gap-1 transition cursor-pointer"
                          title="Copy Left Verse Citation"
                        >
                          {copiedCitationSide === "left" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span className="text-emerald-800 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#8c6011]" />
                              <span>Copy Citation</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/20">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#8c6011] leading-relaxed whitespace-pre-line">
                        {transliterate(leftVerse.mulaSanskrit)}
                      </div>
                    </div>

                    <div className="text-xs font-serif text-[#5c4731] italic leading-relaxed whitespace-pre-line">
                      {leftVerse.mulaIast}
                    </div>
                  </div>

                  {/* Padaccheda & Anvaya (if present) */}
                  {leftVerse.padaccheda && (
                    <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1">
                      <span className="text-[11px] font-mono text-[#735013] font-bold uppercase block">
                        Padaccheda (Word Analysis):
                      </span>
                      <p className="text-xs font-mono text-[#2D2319] leading-relaxed">
                        {transliterate(leftVerse.padaccheda)}
                      </p>
                    </div>
                  )}

                  {/* Bhāṣya Extract (if present) */}
                  {leftVerse.bhashyaExtract && (
                    <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-1">
                      <span className="text-[11px] font-mono text-[#8c6011] font-bold uppercase block">
                        Classical Commentary Extract:
                      </span>
                      <p className="text-xs font-serif text-[#2D2319] leading-relaxed italic">
                        "{transliterate(leftVerse.bhashyaExtract)}"
                      </p>
                    </div>
                  )}

                  {/* English Translation */}
                  <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1.5">
                    <span className="text-[11px] font-mono text-[#735013] font-bold uppercase block">
                      Scholarly English Translation & Meaning:
                    </span>
                    <p className="text-xs font-serif text-[#2D2319] leading-relaxed">
                      {leftVerse.englishTranslation}
                    </p>
                  </div>

                  {/* Commentary Notes */}
                  {leftVerse.commentaryNotes && (
                    <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/25 space-y-1">
                      <span className="text-[11px] font-mono text-[#6e5842] font-bold uppercase block">
                        Doctrinal Exegesis:
                      </span>
                      <p className="text-xs text-[#5c4731] font-serif leading-relaxed">
                        {leftVerse.commentaryNotes}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: TEXT B */}
        {/* ==================================================================== */}
        <div className="card-3d-gold p-4 sm:p-5 space-y-3.5 flex flex-col relative overflow-hidden">
          {/* Header Controls for Right Column */}
          <div className="space-y-2 border-b border-[#bf953f]/30 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase text-[#8c6011] font-bold bg-[#8c6011]/10 px-2 py-0.5 rounded-full border border-[#8c6011]/20">
                Column B (Counterpart / Pūrvapakṣa / Prati-Siddhānta)
              </span>
              <span className="text-xs font-serif text-[#6e5842] italic">
                {rightGrantha.school}
              </span>
            </div>

            {/* Grantha Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#735013] font-bold block">
                Select Canonical Treatise B:
              </label>
              <div className="relative">
                <select
                  value={rightGranthaId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setRightGranthaId(newId);
                    const found = PRESEEDED_GRANTHAS.find((g) => g.id === newId);
                    if (found?.chapters?.[0]) {
                      setRightChapterId(found.chapters[0].id);
                      if (found.chapters[0].verses?.[0]) {
                        setRightVerseId(found.chapters[0].verses[0].id);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-xl text-xs font-serif font-bold text-[#2D2319] focus:outline-hidden focus:ring-1 focus:ring-[#8c6011] cursor-pointer"
                >
                  {PRESEEDED_GRANTHAS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.transliteratedTitle}) — {g.author} [{g.school}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter & Verse Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono text-[#735013] font-bold block mb-1">
                  Chapter / Section:
                </label>
                <select
                  value={rightChapterId}
                  onChange={(e) => {
                    const newCId = e.target.value;
                    setRightChapterId(newCId);
                    const ch = rightGrantha.chapters?.find((c) => c.id === newCId);
                    if (ch?.verses?.[0]) {
                      setRightVerseId(ch.verses[0].id);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-lg text-xs font-serif text-[#2D2319] focus:outline-hidden cursor-pointer"
                >
                  {rightGrantha.chapters?.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.chapterTitle}
                    </option>
                  ))}
                </select>
              </div>

              {compareMode === "verse" && (
                <div>
                  <label className="text-[11px] font-mono text-[#735013] font-bold block mb-1">
                    Specific Verse / Sūtra:
                  </label>
                  <select
                    value={rightVerseId}
                    onChange={(e) => setRightVerseId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#FAF5ED] border border-[#bf953f]/40 rounded-lg text-xs font-serif text-[#2D2319] focus:outline-hidden cursor-pointer"
                  >
                    {rightChapter?.verses?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.number}: {v.title || v.mulaIast.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column Content Area */}
          <div
            ref={rightPaneRef}
            onScroll={handleRightScroll}
            className="flex-1 space-y-4 overflow-y-auto max-h-[720px] pr-1"
          >
            {/* Treatise Overview Card */}
            <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-[#8c6011] text-sm">
                  {rightGrantha.title}
                </span>
                <span className="text-[10px] font-mono text-[#6e5842]">{rightGrantha.century}</span>
              </div>
              <div className="text-[11px] text-[#5c4731]">
                Author: <strong>{rightGrantha.author}</strong> | Base: <em>{rightGrantha.foundationalText}</em>
              </div>
            </div>

            {/* If Chapter Mode: list all verses in chapter */}
            {compareMode === "chapter" ? (
              <div className="space-y-4">
                <div className="p-3 bg-[#FFFDF8] rounded-xl border border-[#bf953f]/30 space-y-1">
                  <h4 className="font-serif font-bold text-xs text-[#8c6011]">
                    {rightChapter?.chapterTitle}
                  </h4>
                  <p className="text-xs text-[#5c4731] font-serif leading-relaxed italic">
                    {rightChapter?.summary}
                  </p>
                </div>

                {rightChapter?.verses?.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-1.5">
                      <span className="text-xs font-mono font-bold text-[#8c6011]">
                        {v.number} {v.title ? `— ${v.title}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${v.mulaSanskrit}\n\n${v.englishTranslation}`);
                        }}
                        className="text-[10px] font-mono text-[#8c6011] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    {/* Sanskrit Mūla */}
                    <div className="text-base font-serif font-bold text-[#8c6011] leading-relaxed whitespace-pre-line">
                      {transliterate(v.mulaSanskrit)}
                    </div>

                    {/* IAST */}
                    <div className="text-xs font-serif text-[#5c4731] italic leading-relaxed whitespace-pre-line">
                      {v.mulaIast}
                    </div>

                    {/* Translation */}
                    <div className="text-xs font-serif text-[#2D2319] leading-relaxed pt-1 border-t border-[#bf953f]/15">
                      <strong className="text-[#8c6011]">Exegesis:</strong> {v.englishTranslation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Verse Mode: Deep single verse analysis */
              rightVerse && (
                <div className="space-y-3.5">
                  {/* Sanskrit Mūla Card */}
                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/40 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8c6011]">
                        {rightVerse.number} {rightVerse.title ? `— ${rightVerse.title}` : ""}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <VedicChantButton
                          verseText={rightVerse.mulaSanskrit}
                          variant="compact"
                        />
                        <button
                          type="button"
                          onClick={handleCopyRightCitation}
                          className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/30 text-[10px] font-mono text-[#8c6011] flex items-center gap-1 transition cursor-pointer"
                          title="Copy Right Verse Citation"
                        >
                          {copiedCitationSide === "right" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span className="text-emerald-800 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#8c6011]" />
                              <span>Copy Citation</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/20">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#8c6011] leading-relaxed whitespace-pre-line">
                        {transliterate(rightVerse.mulaSanskrit)}
                      </div>
                    </div>

                    <div className="text-xs font-serif text-[#5c4731] italic leading-relaxed whitespace-pre-line">
                      {rightVerse.mulaIast}
                    </div>
                  </div>

                  {/* Padaccheda & Anvaya (if present) */}
                  {rightVerse.padaccheda && (
                    <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1">
                      <span className="text-[11px] font-mono text-[#735013] font-bold uppercase block">
                        Padaccheda (Word Analysis):
                      </span>
                      <p className="text-xs font-mono text-[#2D2319] leading-relaxed">
                        {transliterate(rightVerse.padaccheda)}
                      </p>
                    </div>
                  )}

                  {/* Bhāṣya Extract (if present) */}
                  {rightVerse.bhashyaExtract && (
                    <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-1">
                      <span className="text-[11px] font-mono text-[#8c6011] font-bold uppercase block">
                        Classical Commentary Extract:
                      </span>
                      <p className="text-xs font-serif text-[#2D2319] leading-relaxed italic">
                        "{transliterate(rightVerse.bhashyaExtract)}"
                      </p>
                    </div>
                  )}

                  {/* English Translation */}
                  <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/30 space-y-1.5">
                    <span className="text-[11px] font-mono text-[#735013] font-bold uppercase block">
                      Scholarly English Translation & Meaning:
                    </span>
                    <p className="text-xs font-serif text-[#2D2319] leading-relaxed">
                      {rightVerse.englishTranslation}
                    </p>
                  </div>

                  {/* Commentary Notes */}
                  {rightVerse.commentaryNotes && (
                    <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/25 space-y-1">
                      <span className="text-[11px] font-mono text-[#6e5842] font-bold uppercase block">
                        Doctrinal Exegesis:
                      </span>
                      <p className="text-xs text-[#5c4731] font-serif leading-relaxed">
                        {rightVerse.commentaryNotes}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cross-Analysis & Synthesis Footer Bar */}
      <div className="card-3d-gold p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8c6011]" />
            <h4 className="font-serif font-bold text-sm text-[#8c6011]">
              Dialectical Divergence Matrix: {leftGrantha.school} vs {rightGrantha.school}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToTab && leftVerse && rightVerse && (
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab("sastrartha", {
                    customTopic: `Dialectical debate between ${leftGrantha.title} (${leftGrantha.school}, ${leftVerse.number}) and ${rightGrantha.title} (${rightGrantha.school}, ${rightVerse.number}) on the nature of Brahman and reality.`,
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] text-xs font-serif font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Open in Śāstrārtha Debate Studio</span>
              </button>
            )}

            {onNavigateToTab && leftVerse && (
              <button
                type="button"
                onClick={() => {
                  onNavigateToTab("comparative", {
                    verseOrSutra: `${leftVerse.mulaSanskrit}\n(${leftGrantha.title} ${leftVerse.number})`,
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/40 text-xs font-serif font-bold text-[#8c6011] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Across All 6 Schools</span>
              </button>
            )}
          </div>
        </div>

        {/* Side-by-Side Synthesis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="font-mono text-[10px] text-emerald-900 font-bold uppercase block">
              {leftGrantha.title} ({leftGrantha.school}) Siddhānta:
            </span>
            <p className="text-emerald-950 font-serif leading-relaxed">
              {leftGrantha.supportsDet}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="font-mono text-[10px] text-amber-900 font-bold uppercase block">
              {rightGrantha.title} ({rightGrantha.school}) Siddhānta:
            </span>
            <p className="text-amber-950 font-serif leading-relaxed">
              {rightGrantha.supportsDet}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Share Modal */}
      <AcademicShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={dualShareData}
      />
    </div>
  );
}
