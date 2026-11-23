import { useState, useEffect, useRef } from "react";
import { searchAllVedanticTexts, SearchResultItem, SearchFilterScope } from "../utils/textSearch";
import { TabType } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  getSearchHistory,
  saveSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  subscribeToSearchHistory,
  DEFAULT_SEARCH_SUGGESTIONS,
} from "../utils/searchHistoryStorage";
import {
  Search,
  BookOpen,
  Scroll,
  X,
  Sparkles,
  Command,
  ArrowRight,
  History,
  Trash2,
  Clock,
  Compass,
  Check,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface GlobalTextSearchProps {
  onSelectResult: (tab: TabType, payload?: any) => void;
  className?: string;
  variant?: "header" | "compact" | "modal";
  placeholder?: string;
  onSearchExecuted?: (query: string) => void;
}

const DEFAULT_POPULAR_QUERIES = DEFAULT_SEARCH_SUGGESTIONS;

const POPULAR_VERSE_MANTRA_SUGGESTIONS = [
  "आचमनविधिं व्याख्यास्यामः (Ācamanopaniṣat)",
  "तत्त्वमसि (Tat Tvam Asi)",
  "अहं ब्रह्मास्मि (Aham Brahmāsmi)",
  "सत्यं ज्ञानमनन्तं ब्रह्म",
  "अथातो ब्रह्मजिज्ञासा",
  "द्वा सुपर्णा सयुजा सखाया",
  "तमेव विदित्वाऽतिमृत्युमेति",
];

const SEARCH_FILTER_OPTIONS: {
  id: SearchFilterScope;
  label: string;
  shortLabel: string;
  desc: string;
}[] = [
  {
    id: "all",
    label: "All Content",
    shortLabel: "All Content",
    desc: "Verses, Mantras, Commentaries, Texts & Scholars",
  },
  {
    id: "only_verse_mantra",
    label: "Only Verses & Mantras",
    shortLabel: "Only Verses & Mantras",
    desc: "Strictly Mūla Sanskrit, IAST transliteration, and verse numbers",
  },
  {
    id: "commentary",
    label: "Bhāṣyas & Commentaries",
    shortLabel: "Bhāṣyas",
    desc: "Classical commentaries (Śaṅkara, Rāmānuja, Madhva, etc.)",
  },
  {
    id: "grantha",
    label: "Texts & Canons",
    shortLabel: "Texts",
    desc: "Treatises, Upanishads & Sūtra compendiums",
  },
  {
    id: "thinker",
    label: "Bengal Scholars",
    shortLabel: "Scholars",
    desc: "Bengal Vedānta masters & modern researchers",
  },
];

export default function GlobalTextSearch({
  onSelectResult,
  className = "",
  variant = "header",
  placeholder,
  onSearchExecuted,
}: GlobalTextSearchProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<SearchFilterScope>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getSearchHistory());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to search history changes
  useEffect(() => {
    setRecentSearches(getSearchHistory());
    const unsubscribe = subscribeToSearchHistory((updated) => {
      setRecentSearches(updated);
    });
    return unsubscribe;
  }, []);

  // Save a query to search history
  const handleSaveSearch = (searchQuery: string) => {
    saveSearchHistory({ query: searchQuery, type: "mapping" });
    setRecentSearches(getSearchHistory());
    onSearchExecuted?.(searchQuery.trim());
  };

  // Remove a single recent search
  const removeRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeSearchHistoryItem(itemToRemove);
    setRecentSearches(updated.map((i) => i.query));
  };

  // Clear all recent searches
  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
    setRecentSearches([]);
  };

  // Search when query changes OR filterType changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      const hits = searchAllVedanticTexts(query, 50, { filterType });
      setResults(hits);
      setIsOpen(true);
    } else {
      setResults([]);
    }
  }, [query, filterType]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredResults = results.filter((r) => {
    if (filterType === "all") return true;
    if (filterType === "only_verse_mantra" || (filterType as any) === "verse") {
      return r.type === "verse" || r.type === "mantra" || r.type === "sutra";
    }
    if (filterType === "commentary") return r.type === "bhashya" || r.matchedField === "bhashya";
    if (filterType === "grantha") return r.type === "grantha" || r.type === "tradition";
    if (filterType === "thinker") return r.type === "thinker";
    return true;
  });

  const handleResultClick = (item: SearchResultItem) => {
    if (query.trim()) {
      handleSaveSearch(query);
    }
    setIsOpen(false);
    setQuery("");

    if (item.type === "verse" || item.type === "mantra" || item.type === "sutra" || item.type === "bhashya") {
      onSelectResult("mapping", {
        textId: item.textId,
        chapterId: item.chapterId,
        verseId: item.verseId,
      });
    } else if (item.type === "grantha") {
      onSelectResult("mapping", { textId: item.textId });
    } else if (item.type === "thinker") {
      onSelectResult("bengal_vedanta");
    } else if (item.type === "tradition") {
      onSelectResult("tree");
    }
  };

  const handleSelectRecentQuery = (recentQuery: string) => {
    setQuery(recentQuery);
    handleSaveSearch(recentQuery);
    const hits = searchAllVedanticTexts(recentQuery, 50, { filterType });
    setResults(hits);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleSaveSearch(query);
      if (filteredResults.length > 0) {
        handleResultClick(filteredResults[0]);
      }
    }
  };

  const getDynamicPlaceholder = () => {
    if (placeholder) return placeholder;
    if (filterType === "only_verse_mantra") {
      return "Search ONLY Verses & Mantras in Mūla Sanskrit or IAST (e.g. 'तत्त्वमसि', 'Tat Tvam Asi', 'Mantra 1')...";
    }
    if (filterType === "commentary") {
      return "Search in Classical Bhāṣyas & Commentaries (e.g. Śaṅkara, Rāmānuja, Madhva)...";
    }
    if (filterType === "grantha") {
      return "Search texts, treatises, and traditions (e.g. 'Īśopaniṣad', 'Advaitasiddhi')...";
    }
    if (filterType === "thinker") {
      return "Search Bengal scholars & preceptors (e.g. 'Baladeva Vidyābhūṣaṇa', 'Anirvān')...";
    }
    return "Search all Vedāntic texts, sūtras, verses, mantras, or bhāṣyas (e.g. 'Athāto', 'सर्ववेदान्त', 'Tat Tvam Asi')...";
  };

  const isVerseOnly = filterType === "only_verse_mantra";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#8c6011] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDownInput}
          onFocus={() => {
            setIsOpen(true);
          }}
          placeholder={getDynamicPlaceholder()}
          className="w-full pl-10 pr-24 py-2.5 sm:py-3 rounded-2xl bg-[#FFFDF9] backdrop-blur-sm border-2 border-[#bf953f]/40 hover:border-[#C59B27] focus:border-[#C59B27] focus:ring-4 focus:ring-[#d4af37]/25 text-xs sm:text-sm text-[#2D2319] placeholder-[#8c745d] transition-all duration-200 shadow-sm focus:shadow-md"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] border border-[#C59B27]/40 text-[10px] font-mono text-[#7A3E00] font-bold shadow-2xs">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Scope Indicator Badge below Search Input if specific filter active */}
      {isVerseOnly && (
        <div className="mt-1 flex items-center gap-1.5 px-2 text-[10px] font-mono text-[#7A3E00]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-bold">Active Search Scope:</span>
          <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-300">
            Strictly Sacred Verses & Mantras (Mūla Sanskrit & IAST only)
          </span>
        </div>
      )}

      {/* Results / Recent Searches Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF8] to-[#FAF5ED] border-2 border-[#C59B27] rounded-2xl shadow-[0_25px_60px_rgba(140,96,17,0.35)] overflow-hidden max-h-[78vh] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Universal Search Filter Options Bar (Always Available so user can choose scope anytime) */}
          <div className="p-2.5 sm:p-3 bg-[#FAF5ED] border-b border-[#bf953f]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#8c6011]" />
                <span>Search Scope:</span>
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {SEARCH_FILTER_OPTIONS.map((f) => {
                  const isSelected = filterType === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterType(f.id)}
                      title={f.desc}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                          : "bg-[#FFFDF9] text-[#6e5842] border border-[#bf953f]/30 hover:bg-[#FAF3E4]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-[#7A3E00]" />}
                      <span>{f.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {query.trim().length >= 2 && (
              <span className="text-[10px] font-mono font-bold text-[#8c6011] bg-[#FAF1E2] px-2 py-0.5 rounded border border-[#bf953f]/25">
                {filteredResults.length} {filteredResults.length === 1 ? "match" : "matches"}
              </span>
            )}
          </div>

          {/* Case 1: When user has typed query (query length >= 2) */}
          {query.trim().length >= 2 ? (
            <>
              {/* Strict Scope Reassurance Banner when Only Verses & Mantras is selected */}
              {isVerseOnly && (
                <div className="bg-emerald-50/90 border-b border-emerald-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-emerald-950 font-serif">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      Searching <strong>only sacred Verses, Mantras & Sūtras</strong> (Mūla text, IAST & numbering). Bhāṣya commentaries and English translations are excluded.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterType("all")}
                    className="text-[10px] font-mono font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer shrink-0 ml-2"
                  >
                    Switch to All Content
                  </button>
                </div>
              )}

              {/* List of Search Results */}
              <div className="overflow-y-auto p-2 sm:p-3 space-y-2 flex-1">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Search className="w-8 h-8 text-[#8c6011] mx-auto opacity-60" />
                    <div className="font-serif font-bold text-sm text-[#2D2319]">
                      {isVerseOnly
                        ? "No matching Verses or Mantras found"
                        : "No matching Vedāntic passages found"}
                    </div>
                    <div className="text-xs text-[#6e5842] max-w-md mx-auto">
                      {isVerseOnly ? (
                        <>
                          The search query was not found in the sacred Sanskrit mūla or IAST of any verse/mantra.
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setFilterType("all")}
                              className="px-3 py-1 bg-[#FAF1E2] hover:bg-[#F5E6CC] border border-[#bf953f]/40 rounded-lg text-[11px] font-mono font-bold text-[#8c6011] transition cursor-pointer"
                            >
                              Search across All Content (includes Commentaries & Translations)
                            </button>
                          </div>
                        </>
                      ) : (
                        "Try searching with Devanāgarī (e.g. अथातो, तत्त्वमसि), IAST (Athāto, Brahman), or English keywords."
                      )}
                    </div>
                  </div>
                ) : (
                  filteredResults.map((item) => {
                    const isMantra = item.type === "mantra";
                    const isSutra = item.type === "sutra";
                    const isVerse = item.type === "verse";
                    const isBhashya = item.type === "bhashya";
                    const isGrantha = item.type === "grantha";

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="p-3 rounded-xl border border-[#bf953f]/30 hover:border-[#C59B27] bg-[#FFFDF9] hover:bg-gradient-to-r hover:from-[#FFFFFF] hover:via-[#FFFDF5] hover:to-[#FFF8E7] transition-all duration-150 cursor-pointer group space-y-1.5 shadow-2xs hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                                isMantra
                                  ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                                  : isSutra
                                  ? "bg-blue-100 text-blue-950 border border-blue-300"
                                  : isVerse
                                  ? "bg-amber-100 text-amber-950 border border-amber-300"
                                  : isBhashya
                                  ? "bg-purple-100 text-purple-950 border border-purple-300"
                                  : isGrantha
                                  ? "bg-teal-100 text-teal-950 border border-teal-300"
                                  : "bg-rose-100 text-rose-950 border border-rose-300"
                              }`}
                            >
                              {item.type.toUpperCase()}
                            </span>

                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D2319] group-hover:text-[#8c6011] transition-colors">
                              {item.textTitle} {item.verseNumber ? `— ${item.verseNumber}` : ""}
                            </h4>

                            {item.verseTitle && (
                              <span className="text-[11px] font-serif text-[#6e5842] hidden md:inline">
                                ({transliterate(item.verseTitle, activeLipi)})
                              </span>
                            )}

                            {/* Field indicator tag */}
                            <span className="text-[9px] font-mono text-[#8c6011] bg-[#FAF5ED] px-1.5 py-0.2 rounded border border-[#bf953f]/20">
                              Matched: {item.matchedField === "mulaSanskrit"
                                ? "Mūla Sanskrit"
                                : item.matchedField === "mulaIast"
                                ? "IAST"
                                : item.matchedField === "padaccheda"
                                ? "Padaccheda"
                                : item.matchedField === "anvaya"
                                ? "Anvaya"
                                : item.matchedField === "bhashya"
                                ? "Bhāṣya Commentary"
                                : item.matchedField === "englishTranslation"
                                ? "Translation"
                                : "Title/Number"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-mono text-[#8c6011] group-hover:translate-x-0.5 transition-transform shrink-0">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Sanskrit extract */}
                        {item.sanskritSnippet && (
                          <div className="font-serif text-xs text-[#8c6011] bg-[#FAF5ED] p-2 rounded-lg border border-[#bf953f]/20 font-bold whitespace-pre-wrap leading-relaxed line-clamp-2">
                            {transliterate(item.sanskritSnippet, activeLipi)}
                          </div>
                        )}

                        {/* English extract */}
                        {item.englishSnippet && (
                          <div className="text-xs text-[#4a3928] font-serif line-clamp-2 italic leading-relaxed">
                            "{item.englishSnippet}"
                          </div>
                        )}

                        {/* Metadata footer */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#735d45] pt-1">
                          <span>
                            {item.chapterTitle ? `${item.chapterTitle} • ` : ""}
                            {item.authorOrSchool}
                          </span>
                          {item.schoolTag && (
                            <span className="bg-[#FAF1E2] px-1.5 py-0.5 rounded text-[#8c6011]">
                              {item.schoolTag}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Case 2: When input is focused but empty or < 2 chars */
            <div className="p-3 sm:p-4 space-y-4 overflow-y-auto">
              {/* Suggested Canonical Verses & Mantras */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span>
                    {isVerseOnly
                      ? "Recommended Verses & Mantras for Direct Search"
                      : "Quick Suggestions"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(isVerseOnly ? POPULAR_VERSE_MANTRA_SUGGESTIONS : DEFAULT_POPULAR_QUERIES).map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectRecentQuery(sug.split(" (")[0])}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF1E2] border border-[#bf953f]/35 hover:border-[#bf953f] text-xs font-serif text-[#2D2319] hover:text-[#8c6011] transition shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3 text-[#8c6011]" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches Section (Persisted in Session) */}
              <div className="space-y-2 pt-2 border-t border-[#bf953f]/25">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                    <History className="w-3.5 h-3.5 text-[#8c6011]" />
                    <span>Recent Searches</span>
                    <span className="text-[10px] font-mono font-normal text-[#8c6011]/80 lowercase">
                      • {recentSearches.length} saved
                    </span>
                  </div>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllRecentSearches}
                      className="text-[11px] font-mono text-[#8c6011] hover:text-red-700 flex items-center gap-1 transition cursor-pointer"
                      title="Clear session search history"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {recentSearches.map((rec, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectRecentQuery(rec)}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF1E2] border border-[#bf953f]/40 hover:border-[#bf953f] text-xs font-serif text-[#2D2319] hover:text-[#8c6011] transition shadow-xs cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-[#8c6011]/70 group-hover:text-[#8c6011]" />
                        <span>{rec}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(rec, e)}
                          className="ml-1 p-0.5 rounded-full text-[#8c6011]/60 hover:text-red-600 hover:bg-[#ebd9bd] transition cursor-pointer"
                          title="Remove this query"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#FAF5ED]/80 border border-dashed border-[#bf953f]/30 text-xs text-[#6e5842] flex items-center gap-2">
                    <History className="w-4 h-4 text-[#8c6011] opacity-70 shrink-0" />
                    <span>No searches recorded in this session yet. Your scholarly queries will appear here automatically.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="p-2.5 bg-[#FAF5ED] border-t border-[#bf953f]/30 flex items-center justify-between text-[11px] font-mono text-[#6e5842]">
            <span>vedāntatattvaṁ Universal Text Search Engine</span>
            <span>Use ↑↓ to navigate • Esc to dismiss</span>
          </div>
        </div>
      )}
    </div>
  );
}

