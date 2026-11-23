import { useState, useEffect } from "react";
import LogoEmblem from "./LogoEmblem";
import GlobalTextSearch from "./GlobalTextSearch";
import { TabType } from "../types";
import {
  getSearchHistoryEntries,
  saveSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  subscribeToSearchHistory,
  DEFAULT_SEARCH_SUGGESTIONS,
  SearchHistoryItem,
} from "../utils/searchHistoryStorage";
import { searchAllVedanticTexts } from "../utils/textSearch";
import {
  History,
  Clock,
  X,
  Trash2,
  Sparkles,
  Languages,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

interface HeaderProps {
  onSelectSearchResult?: (tab: TabType, payload?: any) => void;
}

export default function Header({ onSelectSearchResult }: HeaderProps) {
  const [historyEntries, setHistoryEntries] = useState<SearchHistoryItem[]>(() => {
    return getSearchHistoryEntries().slice(0, 5);
  });

  // Keep search history synchronized across components in real time
  useEffect(() => {
    setHistoryEntries(getSearchHistoryEntries().slice(0, 5));
    const unsubscribe = subscribeToSearchHistory((_strings, entries) => {
      setHistoryEntries(entries.slice(0, 5));
    });
    return unsubscribe;
  }, []);

  // Jump to Mapping lookup
  const handleJumpToMapping = (term: string) => {
    saveSearchHistory({ query: term, type: "mapping" });
    if (!onSelectSearchResult) return;

    // Search against database and jump to best matching verse, text, scholar, or tradition
    const hits = searchAllVedanticTexts(term, 10);
    if (hits.length > 0) {
      const topHit = hits[0];
      if (topHit.type === "verse" || topHit.type === "mantra" || topHit.type === "sutra" || topHit.type === "bhashya") {
        onSelectSearchResult("mapping", {
          textId: topHit.textId,
          chapterId: topHit.chapterId,
          verseId: topHit.verseId,
        });
      } else if (topHit.type === "grantha") {
        onSelectSearchResult("mapping", { textId: topHit.textId });
      } else if (topHit.type === "thinker") {
        onSelectSearchResult("bengal_vedanta");
      } else if (topHit.type === "tradition") {
        onSelectSearchResult("tree");
      }
    } else {
      onSelectSearchResult("mapping");
    }
  };

  // Jump to Precision Translation lookup
  const handleJumpToTranslation = (term: string, context?: string) => {
    saveSearchHistory({ query: term, type: "translation", context });
    if (!onSelectSearchResult) return;
    onSelectSearchResult("translation", {
      text: term,
      context: context || "Vedāntic Passage Translation",
    });
  };

  // Default jump depending on original query type
  const handleJumpToEntry = (item: SearchHistoryItem) => {
    if (item.type === "translation") {
      handleJumpToTranslation(item.query, item.context);
    } else {
      handleJumpToMapping(item.query);
    }
  };

  const handleRemoveHistoryItem = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeSearchHistoryItem(term);
    setHistoryEntries(updated.slice(0, 5));
  };

  const handleClearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
    setHistoryEntries([]);
  };

  return (
    <header className="text-center py-6 border-b border-[#bf953f]/30 mb-6 bg-gradient-to-b from-[#FFFDF8] via-[#FAF5EC] to-[#FAF5ED] shadow-[0_8px_20px_rgba(160,110,20,0.08)] relative z-30">
      {/* Background golden light ambient shine */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#f3d999]/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center relative z-10 space-y-4">
        {/* Transparent Sacred Logo Emblem */}
        <div className="flex items-center justify-center">
          <LogoEmblem className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_14px_rgba(180,130,20,0.35)] hover:scale-105 transition-transform duration-300 cursor-pointer" />
        </div>

        {/* Title: vedāntatattvaṁ */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-widest font-serif gold-text-gradient uppercase relative drop-shadow-sm">
            vedāntatattvaṁ
          </h1>

          {/* Invocation in Sanskrit with English Meaning */}
          <div className="mt-2.5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#bf953f]" />
              <span className="font-serif text-base sm:text-lg font-bold text-[#8c6011] tracking-wider">
                वन्दे गुरुपरम्पराम्
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#bf953f]" />
            </div>
            <p className="text-xs sm:text-xs text-[#6e5842] font-serif italic max-w-md">
              vande guruparamparām — "I bow to the sacred lineage of spiritual preceptors"
            </p>
          </div>
        </div>

        {/* Global Full-Text Search Bar across all Curated Vedantic Texts */}
        {onSelectSearchResult && (
          <div className="w-full max-w-2xl pt-1 space-y-2">
            <GlobalTextSearch onSelectResult={onSelectSearchResult} />

            {/* Recent Searches (Last 5 Queries with Quick Jump back to Translation or Mapping) */}
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-between gap-2 px-1 text-xs">
              {historyEntries.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 flex-1">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider shrink-0 mr-1">
                      <History className="w-3.5 h-3.5 text-[#8c6011]" />
                      <span>Recent Searches (Last 5):</span>
                    </div>

                    {historyEntries.map((item, idx) => {
                      const isTranslation = item.type === "translation";
                      return (
                        <div
                          key={idx}
                          onClick={() => handleJumpToEntry(item)}
                          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF1E2] border border-[#bf953f]/35 hover:border-[#C59B27] text-xs font-serif text-[#2D2319] hover:text-[#8c6011] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                          title={`Click to jump back to ${isTranslation ? "translation" : "mapping"}: "${item.query}"`}
                        >
                          {/* Type indicator badge */}
                          {isTranslation ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-1.5 py-0.2 rounded shrink-0">
                              <Languages className="w-2.5 h-2.5 text-amber-800" />
                              <span>Translate</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-1.5 py-0.2 rounded shrink-0">
                              <BookOpen className="w-2.5 h-2.5 text-emerald-800" />
                              <span>Mapping</span>
                            </span>
                          )}

                          <Clock className="w-3 h-3 text-[#8c6011]/60 group-hover:text-[#8c6011] shrink-0" />
                          <span className="font-medium max-w-[130px] sm:max-w-[160px] truncate">
                            {item.query}
                          </span>

                          {/* Quick Jump Action Shortcuts: Jump to Translation or Mapping with one click */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJumpToTranslation(item.query, item.context);
                              }}
                              className="p-1 rounded text-[9px] font-mono text-amber-800 hover:bg-amber-200/70 transition cursor-pointer"
                              title="Jump back to Precision Translation"
                            >
                              <Languages className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJumpToMapping(item.query);
                              }}
                              className="p-1 rounded text-[9px] font-mono text-emerald-800 hover:bg-emerald-200/70 transition cursor-pointer"
                              title="Jump back to Granthasāraṇī Mapping"
                            >
                              <BookOpen className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveHistoryItem(item.query, e)}
                            className="ml-0.5 p-0.5 rounded-full text-[#8c6011]/40 hover:text-red-700 hover:bg-[#ebd9bd] transition cursor-pointer"
                            title="Remove this query"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="text-[10px] font-mono text-[#8c6011]/80 hover:text-red-700 flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-[#FAF1E2] border border-transparent hover:border-[#bf953f]/30 transition cursor-pointer shrink-0"
                    title="Clear recent search history"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-1.5 w-full text-center">
                  <span className="text-[10px] font-mono text-[#8c6011]/80 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-[#8c6011]" />
                    <span>Foundational Vedānta Queries:</span>
                  </span>
                  {DEFAULT_SEARCH_SUGGESTIONS.slice(0, 4).map((suggested, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpToMapping(suggested.split(" (")[0])}
                      className="px-2 py-0.5 rounded-md bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/25 hover:border-[#bf953f] text-[11px] font-serif text-[#5c4731] hover:text-[#8c6011] transition cursor-pointer shadow-2xs"
                    >
                      {suggested}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
