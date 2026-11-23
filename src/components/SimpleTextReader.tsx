import React, { useState, useMemo, useEffect, useRef } from "react";
import { PRESEEDED_GRANTHAS } from "../data";
import { TextEntry, GranthaChapter, GranthaVerse } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import LogoEmblem from "./LogoEmblem";
import BharatiyaLipiSwitcher from "./BharatiyaLipiSwitcher";
import { CitationButton } from "./CitationButton";
import GlobalTextSearch from "./GlobalTextSearch";
import { 
  BookOpen, 
  GraduationCap, 
  ChevronDown, 
  Search, 
  X,
  Sparkles,
  Library,
  Copy,
  Check,
  Quote,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  BookmarkCheck,
  ExternalLink
} from "lucide-react";

interface SimpleTextReaderProps {
  initialTextId?: string;
  initialChapterId?: string;
  initialTab?: "reader" | "catalogue";
  onSwitchToScholarly: (textId?: string, chapterId?: string, subView?: "reader" | "catalog") => void;
  siteVersion: "simple" | "scholarly";
  onToggleSiteVersion: (version: "simple" | "scholarly") => void;
}

interface GranthaCategoryGroup {
  id: string;
  categoryName: string;
  categorySanskrit: string;
  granthas: TextEntry[];
}

export default function SimpleTextReader({
  initialTextId,
  initialChapterId,
  initialTab = "reader",
  onSwitchToScholarly,
  siteVersion,
  onToggleSiteVersion,
}: SimpleTextReaderProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();

  // Active sub-tab in simple mode: "reader" (Sacred Text) or "catalogue" (Granthasūcī)
  const [activeSimpleTab, setActiveSimpleTab] = useState<"reader" | "catalogue">(initialTab);

  // Selected grantha (default to initialTextId if provided, or empty/first)
  const [selectedGranthaId, setSelectedGranthaId] = useState<string>(initialTextId || "isopanisad");
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId || "all");
  const [showIast, setShowIast] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("large");
  const [verseSearchQuery, setVerseSearchQuery] = useState<string>("");

  // Search Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Catalogue Category & Text Filters
  const [catalogueCategoryFilter, setCatalogueCategoryFilter] = useState<string>("all");
  const [catalogueSearchQuery, setCatalogueSearchQuery] = useState<string>("");

  // Copied verse feedback
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);

  // Update selected grantha when initialTextId changes
  useEffect(() => {
    if (initialTextId) {
      setSelectedGranthaId(initialTextId);
    }
  }, [initialTextId]);

  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
    }
  }, [initialChapterId]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K opens the Universal Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen]);

  // Current selected grantha
  const currentGrantha: TextEntry | undefined = useMemo(() => {
    return PRESEEDED_GRANTHAS.find((g) => g.id === selectedGranthaId);
  }, [selectedGranthaId]);

  // Reset chapter selection when grantha changes
  const handleSelectGrantha = (granthaId: string, chapterId: string = "all") => {
    setSelectedGranthaId(granthaId);
    setSelectedChapterId(chapterId);
    setActiveSimpleTab("reader");
    setVerseSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Grouped Granthas for organized dropdown & catalogue
  const groupedGranthas: GranthaCategoryGroup[] = useMemo(() => {
    const upanishadIds = [
      "isopanisad", "kenopanisad", "kathopanisad", "prasnopanisad", "mundakopanisad",
      "mandukyopanisad", "aitareyopanisad", "taittiriyopanisad", "chandogyopanisad", "brhadaranyakopanisad"
    ];
    const itaropanishadIds = [
      "acamanopanisad"
    ];
    const nyayaIds = ["brahmasutra", "brahmasutra-saktabhasya"];
    const smritiIds = ["bhagavadgita"];
    const prakaranaIds = ["advaitamakaranda", "advaitarasamanjari", "vivekacudamani", "vedantasara", "jivanmuktiviveka", "vedantaparibhasa"];
    const bhashyaIds = [
      "sribhasya", "anubhasya", "yatindramatadipika", "upadhikhandana", "nyayamrta",
      "vedanta-parijata-saurabha", "siddhantaratna", "swaminarayan-brahmasutra-bhashyam",
      "swaminarayan-upanishad-bhashyam", "swaminarayan-gita-bhashyam", "swaminarayan-siddhanta-sudha", "vachanamrut"
    ];

    const upanishads = PRESEEDED_GRANTHAS.filter((g) => upanishadIds.includes(g.id));
    const itaropanishads = PRESEEDED_GRANTHAS.filter((g) => itaropanishadIds.includes(g.id));
    const nyaya = PRESEEDED_GRANTHAS.filter((g) => nyayaIds.includes(g.id));
    const smriti = PRESEEDED_GRANTHAS.filter((g) => smritiIds.includes(g.id));
    const prakarana = PRESEEDED_GRANTHAS.filter((g) => prakaranaIds.includes(g.id));
    const bhashyas = PRESEEDED_GRANTHAS.filter((g) => bhashyaIds.includes(g.id));
    const modern = PRESEEDED_GRANTHAS.filter(
      (g) => !upanishadIds.includes(g.id) &&
             !itaropanishadIds.includes(g.id) &&
             !nyayaIds.includes(g.id) &&
             !smritiIds.includes(g.id) &&
             !prakaranaIds.includes(g.id) &&
             !bhashyaIds.includes(g.id)
    );

    return [
      {
        id: "upanishads",
        categoryName: "Prasthānatrayī — 10 Mukhya Upaniṣads (Śruti)",
        categorySanskrit: "प्रस्थानत्रयी — दश मुख्योपनिषदः (श्रुतिः)",
        granthas: upanishads,
      },
      {
        id: "itaropanishads",
        categoryName: "Itaropaniṣadaḥ — Other Upaniṣads (इतरोपनिषदः)",
        categorySanskrit: "इतरोपनिषदः — आचमनोपनिषदादयः (श्रुति-प्रयोगः)",
        granthas: itaropanishads,
      },
      {
        id: "nyaya",
        categoryName: "Prasthānatrayī — Brahma Sūtras (Nyāya)",
        categorySanskrit: "प्रस्थानत्रयी — ब्रह्मसूत्राणि (न्यायः)",
        granthas: nyaya,
      },
      {
        id: "smriti",
        categoryName: "Prasthānatrayī — Śrīmad Bhagavad Gītā (Smṛti)",
        categorySanskrit: "प्रस्थानत्रयी — श्रीमद्भगवद्गीता (स्मृतिः)",
        granthas: smriti,
      },
      {
        id: "prakarana",
        categoryName: "Classical Prakaraṇa Granthas",
        categorySanskrit: "प्रकरणग्रन्थाः (विवेकचूडामणि-वेदान्तसारादयः)",
        granthas: prakarana,
      },
      {
        id: "bhashya",
        categoryName: "Ācārya Bhāṣyas & Canonical Exegesis",
        categorySanskrit: "आचार्यभाष्याणि एवं सिद्धान्तग्रन्थाः",
        granthas: bhashyas,
      },
      {
        id: "modern",
        categoryName: "Modern & Contemporary Vedāntic Works",
        categorySanskrit: "आधुनिकवेदान्तग्रन्थाः",
        granthas: modern,
      },
    ];
  }, []);

  // Filtered Catalogue Granthas
  const filteredCatalogueGranthas = useMemo(() => {
    let list: TextEntry[] = [];
    if (catalogueCategoryFilter === "all") {
      list = PRESEEDED_GRANTHAS;
    } else {
      const group = groupedGranthas.find((g) => g.id === catalogueCategoryFilter);
      list = group ? group.granthas : PRESEEDED_GRANTHAS;
    }

    if (!catalogueSearchQuery.trim()) return list;

    const q = catalogueSearchQuery.toLowerCase().trim();
    return list.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        g.transliteratedTitle.toLowerCase().includes(q) ||
        g.author.toLowerCase().includes(q) ||
        g.school.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    });
  }, [catalogueCategoryFilter, catalogueSearchQuery, groupedGranthas]);

  // Filter chapters and verses for the selected grantha in Reader mode
  const displayedChapters: GranthaChapter[] = useMemo(() => {
    if (!currentGrantha || !currentGrantha.chapters) return [];
    if (selectedChapterId === "all") {
      return currentGrantha.chapters;
    }
    return currentGrantha.chapters.filter((ch) => ch.id === selectedChapterId);
  }, [currentGrantha, selectedChapterId]);

  // Optional verse filtering within the chosen text
  const filteredChaptersWithVerses = useMemo(() => {
    if (!verseSearchQuery.trim()) return displayedChapters;
    const q = verseSearchQuery.toLowerCase().trim();
    return displayedChapters.map((ch) => {
      const matchingVerses = ch.verses.filter((v) => {
        return (
          v.mulaSanskrit.toLowerCase().includes(q) ||
          v.mulaIast.toLowerCase().includes(q) ||
          v.number.toLowerCase().includes(q) ||
          (v.title && v.title.toLowerCase().includes(q))
        );
      });
      return {
        ...ch,
        verses: matchingVerses,
      };
    }).filter((ch) => ch.verses.length > 0);
  }, [displayedChapters, verseSearchQuery]);

  // Total verses count of currently active scripture
  const totalVersesCount = useMemo(() => {
    if (!currentGrantha || !currentGrantha.chapters) return 0;
    return currentGrantha.chapters.reduce((acc, ch) => acc + (ch.verses?.length || 0), 0);
  }, [currentGrantha]);

  // Copy individual verse citation and text
  const handleCopyVerse = (verse: GranthaVerse, chapterTitle?: string) => {
    if (!currentGrantha) return;
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const clip = `=== ${currentGrantha.title} (${currentGrantha.transliteratedTitle}) — ${verse.number} ===
${chapterTitle ? `Section: ${chapterTitle}\n` : ""}
[Mūla Sanskrit]
${verse.mulaSanskrit}

[IAST Transliteration]
${verse.mulaIast}

Academic Citation: ${currentGrantha.transliteratedTitle}, verse ${verse.number}. Curated by Dr. Saibal Acharya. vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${today}.`;

    navigator.clipboard.writeText(clip);
    setCopiedVerseId(verse.id || verse.number);
    setTimeout(() => setCopiedVerseId(null), 2500);
  };

  // Handle Search Result Selection from Global Search Modal
  const handleSelectSearchResult = (_tab: any, payload?: any) => {
    setIsSearchModalOpen(false);
    if (!payload) return;

    if (payload.textId) {
      setSelectedGranthaId(payload.textId);
      setSelectedChapterId(payload.chapterId || "all");
      setActiveSimpleTab("reader");
      setVerseSearchQuery("");

      if (payload.verseId) {
        setTimeout(() => {
          const el = document.getElementById(`verse-${payload.verseId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-2", "ring-[#C59B27]", "bg-[#FFF8E7]");
            setTimeout(() => {
              el.classList.remove("ring-2", "ring-[#C59B27]", "bg-[#FFF8E7]");
            }, 3000);
          }
        }, 300);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Font size styling
  const fontSizeClasses = {
    normal: {
      sanskrit: "text-lg sm:text-xl leading-relaxed sm:leading-loose",
      iast: "text-sm sm:text-base leading-relaxed",
    },
    large: {
      sanskrit: "text-xl sm:text-2xl lg:text-3xl leading-relaxed sm:leading-loose",
      iast: "text-base sm:text-lg leading-relaxed",
    },
    xlarge: {
      sanskrit: "text-2xl sm:text-3xl lg:text-4xl leading-relaxed sm:leading-loose",
      iast: "text-lg sm:text-xl leading-relaxed",
    },
  }[fontSize];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2319] flex flex-col font-serif selection:bg-[#E2B755]/30 relative">
      {/* 1. Minimal Dedicated Top Bar for Simple Version */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#bf953f]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <LogoEmblem className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" />
            <div>
              <div className="font-serif font-black text-sm sm:text-base gold-text-gradient tracking-wider uppercase leading-none">
                vedāntatattvaṁ
              </div>
              <div className="text-[10px] font-mono text-[#8c6011] tracking-tight font-semibold mt-0.5 flex items-center gap-1">
                <span>सरल-संस्करणम्</span>
                <span className="text-[#bf953f]">•</span>
                <span className="hidden xs:inline">Simple Version</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Option Tabs: Sacred Reader vs Canonical Catalogue */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/40 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveSimpleTab("reader")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeSimpleTab === "reader"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/40"
                  : "text-[#8c6011] hover:text-[#5c4731]"
              }`}
              title="Open Sacred Text Reader (ग्रन्थ-वाचनम्)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Sacred Text</span>
              <span className="text-[10px] font-mono text-[#8c6011]/80 hidden md:inline">
                ({transliterate("वाचनम्", activeLipi)})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimpleTab("catalogue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                activeSimpleTab === "catalogue"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/40"
                  : "text-[#8c6011] hover:text-[#5c4731]"
              }`}
              title="Open Canonical Catalogue (ग्रन्थसूची)"
            >
              <Library className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Catalogue</span>
              <span className="text-[10px] font-mono text-[#8c6011]/80 hidden md:inline">
                ({transliterate("ग्रन्थसूची", activeLipi)})
              </span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#E2B755]/20 text-[10px] font-mono text-[#7A3E00] font-bold">
                {PRESEEDED_GRANTHAS.length}
              </span>
            </button>
          </div>

          {/* Right Controls: Search Bar Trigger, Citation, Version Switcher & Lipi */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Universal Search Bar Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#7A3E00] text-xs font-serif shadow-xs transition cursor-pointer group"
              title="Search all Vedāntic texts, sūtras, verses, and bhāṣyas (Ctrl+K or ⌘K)"
              aria-label="Universal Search Bar"
            >
              <Search className="w-3.5 h-3.5 text-[#8c6011] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">Search Canon</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-[#FFFDF9] border border-[#bf953f]/30 rounded text-[#8c6011]">
                ⌘K
              </kbd>
            </button>

            {/* Top Citation Button (Always available in simple version header) */}
            <div className="hidden xs:block">
              <CitationButton
                moduleName="Granthasāraṇī Inventory"
                title={currentGrantha ? `${currentGrantha.title} (${currentGrantha.transliteratedTitle})` : "vedāntatattvaṁ Sacred Canon"}
                schools={currentGrantha ? [currentGrantha.school] : ["Vedānta"]}
                analysisContent={
                  currentGrantha
                    ? `Author: ${currentGrantha.author} (${currentGrantha.century}). Foundational Root: ${currentGrantha.foundationalText}. Summary: ${currentGrantha.description}`
                    : "Universal Vedānta Research Platform."
                }
              />
            </div>

            {/* Version Switcher Pill (Simple / Scholarly) */}
            <div 
              id="site-version-toggle-simple"
              className="flex items-center p-0.5 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/40 shadow-xs"
            >
              <button
                type="button"
                onClick={() => onToggleSiteVersion("simple")}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  siteVersion === "simple"
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/40"
                    : "text-[#8c6011] hover:text-[#5c4731]"
                }`}
                title="Currently in Simple Version (Text Only)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8c6011]" />
                <span className="hidden sm:inline">Simple</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleSiteVersion("scholarly");
                  onSwitchToScholarly(
                    selectedGranthaId || undefined, 
                    selectedChapterId !== "all" ? selectedChapterId : undefined,
                    activeSimpleTab === "catalogue" ? "catalog" : "reader"
                  );
                }}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  siteVersion === "scholarly"
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs"
                    : "text-[#8c6011] hover:text-[#5c4731]"
                }`}
                title="Switch to Full Scholarly Research Suite with all facilities & tools"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#8c6011]" />
                <span className="hidden sm:inline">Scholarly</span>
              </button>
            </div>

            {/* Quick Lipi / Script Switcher */}
            <BharatiyaLipiSwitcher />
          </div>
        </div>
      </header>

      {/* 2. UNIVERSAL SEARCH MODAL (Triggered via Header Search button or ⌘K) */}
      {isSearchModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div 
            className="w-full max-w-3xl mt-8 sm:mt-12 bg-[#FFFDF9] border-2 border-[#C59B27] rounded-2xl shadow-[0_25px_60px_rgba(140,96,17,0.35)] p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#bf953f]/30">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#8c6011]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2D2319]">
                  Universal Vedāntic Canon Search
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
                title="Close Search (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GlobalTextSearch Component configured to navigate inside Simple Reader */}
            <GlobalTextSearch
              variant="modal"
              placeholder="Search across all 10 Upaniṣads, Brahma Sūtras, Bhagavad Gītā, Bhāṣyas (e.g. 'Athāto', 'सर्ववेदान्त', 'Tat Tvam Asi')..."
              onSelectResult={handleSelectSearchResult}
            />

            <div className="pt-2 flex items-center justify-between text-xs text-[#8c6011] font-mono border-t border-[#bf953f]/20">
              <span>Select any result to jump directly to that sacred text & verse</span>
              <span>Press <kbd className="px-1.5 py-0.5 bg-[#FAF5ED] border border-[#bf953f]/30 rounded">Esc</kbd> to exit</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONDITIONAL BODY: SACRED TEXT READER vs CANONICAL CATALOGUE */}
      {activeSimpleTab === "reader" ? (
        <>
          {/* Text Choosing Bar (Front & Center Dropdown + Options + Citation) */}
          <section className="bg-gradient-to-b from-[#FAF5ED] to-[#FDFBF7] border-b border-[#bf953f]/25 py-4 sm:py-5 px-3 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Main Text Choosing Dropdown */}
                <div className="flex-1 relative">
                  <div className="flex items-center justify-between mb-1">
                    <label 
                      htmlFor="sacred-text-dropdown"
                      className="block text-xs font-mono font-bold text-[#8c6011] tracking-wider uppercase"
                    >
                      Choose Sacred Text (ग्रन्थ-चयनम्)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveSimpleTab("catalogue")}
                      className="text-xs font-mono text-[#8c6011] hover:text-[#5c4731] underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Browse Full Catalogue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      id="sacred-text-dropdown"
                      value={selectedGranthaId}
                      onChange={(e) => handleSelectGrantha(e.target.value)}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 sm:py-3 bg-[#FFFDF9] hover:bg-[#FFFFFF] border-2 border-[#C59B27]/70 focus:border-[#8c6011] focus:ring-2 focus:ring-[#C59B27]/30 rounded-xl font-serif text-sm sm:text-base font-bold text-[#2D2319] shadow-sm transition cursor-pointer"
                    >
                      <option value="" disabled>
                        -- Select a Sacred Scripture / ग्रन्थं चिनोतु --
                      </option>
                      {groupedGranthas.map((group) => (
                        <optgroup key={group.categoryName} label={`${group.categoryName} • ${group.categorySanskrit}`}>
                          {group.granthas.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.title} ({transliterate(g.title, activeLipi)}) {g.totalVersesOrSutras ? `— ${g.totalVersesOrSutras}` : ""}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8c6011] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Chapter Selection Dropdown (Only if text has multiple chapters) */}
                {currentGrantha && currentGrantha.chapters && currentGrantha.chapters.length > 1 && (
                  <div className="w-full sm:w-64 relative">
                    <label 
                      htmlFor="sacred-chapter-dropdown"
                      className="block text-xs font-mono font-bold text-[#8c6011] mb-1 tracking-wider uppercase"
                    >
                      Chapter / Section (अध्यायः)
                    </label>
                    <div className="relative">
                      <select
                        id="sacred-chapter-dropdown"
                        value={selectedChapterId}
                        onChange={(e) => setSelectedChapterId(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-10 py-2.5 sm:py-3 bg-[#FFFDF9] hover:bg-[#FFFFFF] border-2 border-[#bf953f]/60 focus:border-[#8c6011] focus:ring-2 focus:ring-[#C59B27]/30 rounded-xl font-serif text-xs sm:text-sm font-semibold text-[#2D2319] shadow-sm transition cursor-pointer"
                      >
                        <option value="all">
                          All Chapters ({currentGrantha.chapters.length} Chapters / पूर्णग्रन्थः)
                        </option>
                        {currentGrantha.chapters.map((ch) => (
                          <option key={ch.id} value={ch.id}>
                            {ch.chapterTitleSanskrit ? `${ch.chapterTitleSanskrit} — ` : ""}{ch.chapterTitle}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#8c6011] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal Reading Options (IAST toggle, Font Size, Citation & Verse Search) */}
              {currentGrantha && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1.5 border-t border-[#bf953f]/20 text-xs">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* IAST Transliteration Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowIast(!showIast)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                        showIast
                          ? "bg-[#FFFDF9] border-[#C59B27] text-[#7A3E00] font-bold shadow-2xs"
                          : "bg-[#FAF5ED] border-[#bf953f]/30 text-[#8c6011]/80 hover:text-[#8c6011]"
                      }`}
                      title="Toggle Roman IAST transliteration beneath sacred Sanskrit"
                    >
                      <span className="font-serif italic font-bold">IAST</span>
                      <span>{showIast ? "Shown" : "Hidden"}</span>
                    </button>

                    {/* Font Size Adjuster */}
                    <div className="flex items-center bg-[#FAF5ED] border border-[#bf953f]/30 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setFontSize("normal")}
                        className={`px-2 py-0.5 rounded text-xs transition cursor-pointer font-serif ${
                          fontSize === "normal" ? "bg-[#FFFDF9] text-[#7A3E00] font-bold shadow-2xs" : "text-[#8c6011]"
                        }`}
                        title="Regular text size"
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize("large")}
                        className={`px-2 py-0.5 rounded text-sm transition cursor-pointer font-serif ${
                          fontSize === "large" ? "bg-[#FFFDF9] text-[#7A3E00] font-bold shadow-2xs" : "text-[#8c6011]"
                        }`}
                        title="Large text size"
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize("xlarge")}
                        className={`px-2 py-0.5 rounded text-base transition cursor-pointer font-serif ${
                          fontSize === "xlarge" ? "bg-[#FFFDF9] text-[#7A3E00] font-bold shadow-2xs" : "text-[#8c6011]"
                        }`}
                        title="Extra large text size"
                      >
                        A++
                      </button>
                    </div>

                    {/* Prominent Academic Citation for currently chosen scripture */}
                    <CitationButton
                      moduleName="Granthasāraṇī Inventory"
                      title={`${currentGrantha.title} (${currentGrantha.transliteratedTitle})`}
                      schools={[currentGrantha.school]}
                      analysisContent={`Author: ${currentGrantha.author} (${currentGrantha.century}). Foundational Root: ${currentGrantha.foundationalText}. Summary: ${currentGrantha.description}`}
                    />
                  </div>

                  {/* Verses Count & In-Text Verse Filter */}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[11px] font-mono text-[#8c6011] hidden sm:inline">
                      {totalVersesCount} Verses/Sūtras
                    </span>
                    {totalVersesCount > 6 && (
                      <div className="relative">
                        <input
                          type="text"
                          value={verseSearchQuery}
                          onChange={(e) => setVerseSearchQuery(e.target.value)}
                          placeholder="Filter in this text..."
                          className="w-36 sm:w-48 pl-2 pr-6 py-1 bg-[#FFFDF9] border border-[#bf953f]/35 rounded-lg text-xs font-mono focus:border-[#C59B27] focus:outline-none"
                        />
                        {verseSearchQuery ? (
                          <button
                            type="button"
                            onClick={() => setVerseSearchQuery("")}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8c6011] hover:text-[#2D2319] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <Search className="w-3 h-3 text-[#8c6011]/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Main Sacred Text Content Display Area */}
          <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10">
            {!currentGrantha ? (
              /* Landing Screen when no text has been chosen yet */
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#FFFDF5] to-[#F7EACD] border-2 border-[#C59B27] flex items-center justify-center shadow-lg shadow-[#C59B27]/10">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#8c6011]" />
                </div>

                <div className="space-y-2 max-w-lg">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2D2319]">
                    {transliterate("कृपया उपरिष्टाद् ग्रन्थं चिनोतु", activeLipi)}
                  </h2>
                  <p className="text-sm text-[#735013] font-serif leading-relaxed">
                    Please choose a sacred scripture from the dropdown menu above or from the <strong>Canonical Catalogue</strong>. In this <strong>Simple Version</strong>, only the sacred mūla text is displayed with search and academic citations.
                  </p>
                </div>

                {/* Quick-choice chips for popular texts */}
                <div className="pt-4 space-y-2.5 max-w-lg">
                  <div className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                    Or select from popular scriptures:
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      { id: "isopanisad", label: "Īśāvāsyopaniṣad", skt: "ईशावास्योपनिषत्" },
                      { id: "brahmasutra", label: "Brahma Sūtras", skt: "ब्रह्मसूत्राणि" },
                      { id: "bhagavadgita", label: "Bhagavad Gītā", skt: "श्रीमद्भगवद्गीता" },
                      { id: "kathopanisad", label: "Kaṭhopaniṣad", skt: "कठोपनिषत्" },
                      { id: "vivekacudamani", label: "Vivekacūḍāmaṇi", skt: "विवेकचूडामणिः" },
                      { id: "chandogyopanisad", label: "Chāndogyopaniṣad", skt: "छान्दोग्योपनिषत्" },
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => handleSelectGrantha(chip.id)}
                        className="px-3 py-1.5 bg-[#FFFDF9] hover:bg-[#FAF1E2] border border-[#bf953f]/50 hover:border-[#C59B27] text-[#7A3E00] text-xs font-serif font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{chip.label}</span>
                        <span className="text-[10px] text-[#8c6011]/80 font-mono">({transliterate(chip.skt, activeLipi)})</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveSimpleTab("catalogue")}
                      className="px-4 py-2 bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#d4af37] text-[#120e0b] font-serif font-bold text-xs rounded-xl shadow-xs hover:brightness-105 transition cursor-pointer flex items-center gap-2 mx-auto"
                    >
                      <Library className="w-4 h-4" />
                      <span>Explore Canonical Catalogue (ग्रन्थसूची)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Sacred Main Text Display (Only the Mūla Text is visible, nothing else) */
              <div className="space-y-10 sm:space-y-14">
                {/* Header of the Selected Text */}
                <div className="text-center space-y-3 pb-6 border-b border-[#bf953f]/30 relative">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-mono font-bold text-[#8c6011] tracking-wider uppercase">
                      {currentGrantha.author || "Vedāntic Canon"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF8E7] border border-[#C59B27]/40 text-xs font-mono text-[#7A3E00]">
                      {currentGrantha.school}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#1F140A] tracking-tight">
                    {transliterate(currentGrantha.title, activeLipi)}
                  </h1>
                  <p className="text-xs sm:text-sm font-serif italic text-[#735013]">
                    {currentGrantha.transliteratedTitle}
                  </p>

                  {/* Header Citation & Academic Reference Pill */}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <CitationButton
                      moduleName="Granthasāraṇī Inventory"
                      title={`${currentGrantha.title} (${currentGrantha.transliteratedTitle})`}
                      schools={[currentGrantha.school]}
                      analysisContent={`Author: ${currentGrantha.author} (${currentGrantha.century}). Foundational Root: ${currentGrantha.foundationalText}. Summary: ${currentGrantha.description}`}
                    />
                  </div>
                </div>

                {/* Render Each Chapter and its Verses */}
                {filteredChaptersWithVerses.map((chapter) => (
                  <section key={chapter.id} className="space-y-6 sm:space-y-8">
                    {/* Chapter Title Banner (Clean and reverent) */}
                    {(currentGrantha.chapters && currentGrantha.chapters.length > 1) && (
                      <div className="text-center py-3 px-4 rounded-xl bg-gradient-to-r from-transparent via-[#FAF1E2]/70 to-transparent border-y border-[#bf953f]/25">
                        <h2 className="text-base sm:text-lg font-bold font-serif text-[#7A3E00]">
                          {chapter.chapterTitleSanskrit ? transliterate(chapter.chapterTitleSanskrit, activeLipi) : chapter.chapterTitle}
                        </h2>
                        {chapter.summary && (
                          <p className="text-xs font-serif text-[#735013]/90 italic mt-0.5">
                            {chapter.summary}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Verses / Sūtras Container */}
                    <div className="space-y-6 sm:space-y-8 divide-y divide-[#bf953f]/20">
                      {chapter.verses.map((verse, vIdx) => (
                        <article
                          key={verse.id || vIdx}
                          id={`verse-${verse.id || vIdx}`}
                          className="pt-6 first:pt-0 space-y-3.5 text-center group transition-colors duration-200 rounded-xl"
                        >
                          {/* Verse Number Pill & Quick Verse Citation */}
                          <div className="inline-flex items-center justify-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5ED] border border-[#bf953f]/40 text-[11px] font-mono font-bold text-[#8c6011] tracking-wider">
                              {verse.number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyVerse(verse, chapter.chapterTitle)}
                              className="opacity-60 group-hover:opacity-100 hover:opacity-100 p-1 rounded-md text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
                              title="Copy verse text and bibliographic citation"
                            >
                              {copiedVerseId === (verse.id || verse.number) ? (
                                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Copied</span>
                                </span>
                              ) : (
                                <Quote className="w-3 h-3 text-[#8c6011]" />
                              )}
                            </button>
                          </div>

                          {/* Main Sacred Mūla Sanskrit Text */}
                          <div className="max-w-3xl mx-auto px-2">
                            <p 
                              className={`font-serif font-bold text-[#1F140A] whitespace-pre-line tracking-normal ${fontSizeClasses.sanskrit}`}
                              style={{ textWrap: "balance" as any }}
                            >
                              {transliterate(verse.mulaSanskrit, activeLipi)}
                            </p>
                          </div>

                          {/* Roman IAST Transliteration (Clean and non-intrusive) */}
                          {showIast && verse.mulaIast && (
                            <div className="max-w-2xl mx-auto px-2 pt-0.5">
                              <p className={`font-serif italic text-[#63482F] whitespace-pre-line ${fontSizeClasses.iast}`}>
                                {verse.mulaIast}
                              </p>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {filteredChaptersWithVerses.length === 0 && (
                  <div className="text-center py-12 text-[#735013] font-serif space-y-2">
                    <p>No verses match &quot;{verseSearchQuery}&quot; in this scripture.</p>
                    <button
                      type="button"
                      onClick={() => setVerseSearchQuery("")}
                      className="px-3 py-1 bg-[#FAF1E2] border border-[#C59B27] rounded-lg text-xs font-serif font-bold text-[#7A3E00] cursor-pointer"
                    >
                      Clear Verse Filter
                    </button>
                  </div>
                )}

                {/* Sacred Colophon End Marker */}
                <div className="pt-8 pb-12 text-center space-y-2 border-t border-[#bf953f]/30">
                  <div className="text-base sm:text-lg font-bold font-serif text-[#7A3E00]">
                    {transliterate("॥ इति ग्रन्थः समाप्तः ॥", activeLipi)}
                  </div>
                  <div className="text-xs font-mono text-[#8c6011]">
                    {transliterate("ॐ तत्सत् श्रीब्रह्मार्पणमस्तु", activeLipi)}
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      ) : (
        /* 4. CANONICAL CATALOGUE TAB (ग्रन्थसूची) */
        <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
          {/* Catalogue Title & Search Header */}
          <div className="text-center space-y-3 pb-6 border-b border-[#bf953f]/30">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF1E2] border border-[#C59B27]/40 text-xs font-mono font-bold text-[#8c6011] tracking-wider uppercase">
              <Library className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>{transliterate("ग्रन्थसूची — वेदान्तप्रस्थानत्रयी वाङ्मयम्", activeLipi)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#1F140A] tracking-tight">
              Canonical Vedāntic Catalogue
            </h1>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm font-serif text-[#735013] leading-relaxed">
              Explore the foundational corpus of Vedāntic literature — the 10 Mukhya Upaniṣads, Brahma Sūtras, Bhagavad Gītā, Classical Prakaraṇas, and Ācārya Bhāṣyas. Select any scripture to read immediately in pure distraction-free form.
            </p>

            {/* In-Catalogue Search Bar */}
            <div className="max-w-xl mx-auto pt-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8c6011] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={catalogueSearchQuery}
                  onChange={(e) => setCatalogueSearchQuery(e.target.value)}
                  placeholder="Search catalogue by scripture name, author, school, or keyword..."
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FFFDF9] border-2 border-[#bf953f]/40 hover:border-[#C59B27] focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/30 rounded-xl text-xs sm:text-sm text-[#2D2319] shadow-xs"
                />
                {catalogueSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCatalogueSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6011] hover:text-[#2D2319] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
              <button
                type="button"
                onClick={() => setCatalogueCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition cursor-pointer ${
                  catalogueCategoryFilter === "all"
                    ? "bg-[#8c6011] text-[#FFFDF9] shadow-xs"
                    : "bg-[#FAF5ED] text-[#7A3E00] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
                }`}
              >
                All Scriptures ({PRESEEDED_GRANTHAS.length})
              </button>
              {groupedGranthas.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setCatalogueCategoryFilter(group.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition cursor-pointer ${
                    catalogueCategoryFilter === group.id
                      ? "bg-[#8c6011] text-[#FFFDF9] shadow-xs"
                      : "bg-[#FAF5ED] text-[#7A3E00] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
                  }`}
                >
                  {group.categoryName.split(" — ")[1] || group.categoryName} ({group.granthas.length})
                </button>
              ))}
            </div>
          </div>

          {/* Catalogue Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalogueGranthas.map((grantha) => (
              <div
                key={grantha.id}
                className="bg-[#FFFDF9] border border-[#bf953f]/40 hover:border-[#C59B27] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & School Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF1E2] text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                      {grantha.foundationalText || "Canon"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF8E7] border border-[#C59B27]/30 text-[10px] font-mono text-[#7A3E00]">
                      {grantha.school}
                    </span>
                  </div>

                  {/* Title in Lipi & English */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1F140A] group-hover:text-[#8c6011] transition-colors">
                      {transliterate(grantha.title, activeLipi)}
                    </h3>
                    <div className="text-xs font-serif italic text-[#735013]">
                      {grantha.transliteratedTitle}
                    </div>
                  </div>

                  {/* Author, Era & Verses Count */}
                  <div className="text-xs text-[#6e5842] space-y-1 font-serif">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2D2319]">{grantha.author}</span>
                      <span className="font-mono text-[11px] text-[#8c6011]">{grantha.century}</span>
                    </div>
                    {grantha.totalVersesOrSutras && (
                      <div className="text-[11px] font-mono text-[#8c6011]/90">
                        Extent: {grantha.totalVersesOrSutras}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#5c4731] line-clamp-3 leading-relaxed font-serif pt-1 border-t border-[#bf953f]/15">
                    {grantha.description}
                  </p>
                </div>

                {/* Card Action Controls: Read Scripture, Citation & Scholarly Mode */}
                <div className="pt-4 mt-4 border-t border-[#bf953f]/20 flex items-center justify-between gap-2">
                  {/* Read Scripture Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectGrantha(grantha.id)}
                    className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#d4af37] text-[#120e0b] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    title={`Read ${grantha.transliteratedTitle} in Simple Version`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#120e0b]" />
                    <span>Read Text</span>
                  </button>

                  {/* Citation Button */}
                  <CitationButton
                    moduleName="Granthasāraṇī Inventory"
                    title={`${grantha.title} (${grantha.transliteratedTitle})`}
                    schools={[grantha.school]}
                    analysisContent={`Author: ${grantha.author} (${grantha.century}). Foundational Root: ${grantha.foundationalText}. Summary: ${grantha.description}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredCatalogueGranthas.length === 0 && (
            <div className="text-center py-16 bg-[#FFFDF9] border border-dashed border-[#bf953f]/40 rounded-2xl space-y-3">
              <Library className="w-10 h-10 text-[#8c6011]/60 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#2D2319]">
                No scriptures match your filter
              </h3>
              <p className="text-xs text-[#735013] max-w-sm mx-auto">
                No canon entry matched &quot;{catalogueSearchQuery}&quot;. Clear the search input to view the full catalogue.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCatalogueSearchQuery("");
                  setCatalogueCategoryFilter("all");
                }}
                className="px-3.5 py-1.5 bg-[#FAF1E2] border border-[#C59B27] rounded-xl text-xs font-serif font-bold text-[#7A3E00] cursor-pointer"
              >
                Reset Catalogue Filters
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
