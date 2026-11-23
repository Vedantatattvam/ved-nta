import { useState, useEffect, useMemo, useRef } from "react";
import { BhashyaEntry, GranthaVerse } from "../types";
import { getBhashyasForVerse } from "../bhashyaData";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  BookOpen,
  Scroll,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Columns,
  X,
} from "lucide-react";
import VedicChantButton from "./VedicChantButton";

interface BhashyaTikaSelectorProps {
  verse: GranthaVerse;
  granthaId?: string;
  isFocused?: boolean;
  focusedLineSpacing?: "spacious" | "airy" | "expansive";
  className?: string;
  preferredBhashyaId?: string;
  onAnnotate?: (
    verse: GranthaVerse,
    selectedText: string,
    field: "bhashya" | "mula" | "iast" | "translation" | "padaccheda" | "custom"
  ) => void;
}

export default function BhashyaTikaSelector({
  verse,
  granthaId,
  isFocused = false,
  focusedLineSpacing = "airy",
  className = "",
  preferredBhashyaId,
  onAnnotate,
}: BhashyaTikaSelectorProps) {
  const { activeLipi, transliterate } = useBharatiyaLipi();

  // All available Bhāṣyas for this verse/sūtra
  const availableBhashyas: BhashyaEntry[] = useMemo(() => {
    return getBhashyasForVerse(verse, granthaId);
  }, [verse, granthaId]);

  // Dropdown open state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Selected Bhāṣya IDs (multi-choice)
  const [selectedBhashyaIds, setSelectedBhashyaIds] = useState<string[]>(() => {
    if (preferredBhashyaId && availableBhashyas.length > 0) {
      const match = availableBhashyas.find(
        (b) =>
          b.id === preferredBhashyaId ||
          b.id.startsWith(preferredBhashyaId) ||
          b.paramparaId === preferredBhashyaId ||
          (preferredBhashyaId === "shaktibhashya" &&
            (b.id.includes("sakta") || b.id.includes("shakti") || b.paramparaId === "saktavisistadvaita"))
      );
      if (match) return [match.id];
    }
    // Default: select the primary (first) Bhāṣya
    if (availableBhashyas.length > 0) {
      return [availableBhashyas[0].id];
    }
    return [];
  });

  // Synchronize when preferredBhashyaId changes
  useEffect(() => {
    if (preferredBhashyaId && availableBhashyas.length > 0) {
      const match = availableBhashyas.find(
        (b) =>
          b.id === preferredBhashyaId ||
          b.id.startsWith(preferredBhashyaId) ||
          b.paramparaId === preferredBhashyaId ||
          (preferredBhashyaId === "shaktibhashya" &&
            (b.id.includes("sakta") || b.id.includes("shakti") || b.paramparaId === "saktavisistadvaita"))
      );
      if (match) {
        setSelectedBhashyaIds([match.id]);
      }
    }
  }, [preferredBhashyaId, availableBhashyas]);

  // Global toggle to show Ṭīkās
  const [showTikas, setShowTikas] = useState<boolean>(true);

  // Per-Bhāṣya selected Ṭīkā IDs (map: bhashyaId -> array of selected tikaIds)
  const [selectedTikaIdsByBhashya, setSelectedTikaIdsByBhashya] = useState<
    Record<string, string[]>
  >(() => {
    const map: Record<string, string[]> = {};
    availableBhashyas.forEach((b) => {
      if (b.tikas && b.tikas.length > 0) {
        // By default, select all available ṭīkās for each commentary
        map[b.id] = b.tikas.map((t) => t.id);
      }
    });
    return map;
  });

  // Layout mode: stacked vs comparative columns (if 2 or more selected)
  const [layoutMode, setLayoutMode] = useState<"stacked" | "columns">("stacked");

  // Search filter in dropdown
  const [dropdownSearch, setDropdownSearch] = useState("");

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collapsed states for individual cards
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  // When verse changes, ensure valid selection
  useEffect(() => {
    if (availableBhashyas.length > 0) {
      // If current selection is empty or has non-matching IDs, reseed with the first available
      setSelectedBhashyaIds((prev) => {
        const valid = prev.filter((id) => availableBhashyas.some((b) => b.id === id));
        return valid.length > 0 ? valid : [availableBhashyas[0].id];
      });

      setSelectedTikaIdsByBhashya((prev) => {
        const nextMap = { ...prev };
        availableBhashyas.forEach((b) => {
          if (b.tikas && b.tikas.length > 0) {
            if (!nextMap[b.id] || nextMap[b.id].length === 0) {
              nextMap[b.id] = b.tikas.map((t) => t.id);
            }
          }
        });
        return nextMap;
      });
    }
  }, [availableBhashyas]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Toggle single Bhāṣya
  const toggleBhashya = (id: string) => {
    setSelectedBhashyaIds((prev) => {
      if (prev.includes(id)) {
        // Keep at least one or allow empty with a message
        return prev.filter((bId) => bId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle single Ṭīkā for a given Bhāṣya
  const toggleTika = (bhashyaId: string, tikaId: string) => {
    setSelectedTikaIdsByBhashya((prev) => {
      const currentList = prev[bhashyaId] || [];
      const nextList = currentList.includes(tikaId)
        ? currentList.filter((t) => t !== tikaId)
        : [...currentList, tikaId];
      return { ...prev, [bhashyaId]: nextList };
    });
  };

  // Preset selectors
  const selectAll = () => {
    setSelectedBhashyaIds(availableBhashyas.map((b) => b.id));
  };

  const selectPrimaryOnly = () => {
    if (availableBhashyas.length > 0) {
      setSelectedBhashyaIds([availableBhashyas[0].id]);
    }
  };

  const selectTrimata = () => {
    // Advaita, Viśiṣṭādvaita, Dvaita
    const trimataIds = availableBhashyas
      .filter((b) =>
        ["advaita", "visistadvaita", "dvaita"].includes(b.paramparaId || "")
      )
      .map((b) => b.id);
    if (trimataIds.length > 0) {
      setSelectedBhashyaIds(trimataIds);
    } else if (availableBhashyas.length > 0) {
      setSelectedBhashyaIds(availableBhashyas.slice(0, 3).map((b) => b.id));
    }
  };

  const selectShaktibhashya = () => {
    const sakta = availableBhashyas.find(
      (b) =>
        b.paramparaId === "saktavisistadvaita" ||
        b.id.toLowerCase().includes("sakta") ||
        b.name.toLowerCase().includes("शाक्त") ||
        b.name.toLowerCase().includes("śākta")
    );
    if (sakta) {
      setSelectedBhashyaIds((prev) =>
        prev.includes(sakta.id) ? prev : [...prev, sakta.id]
      );
    }
  };

  const clearAll = () => {
    setSelectedBhashyaIds([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCardCollapse = (id: string) => {
    setCollapsedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered list for the dropdown
  const filteredBhashyas = useMemo(() => {
    if (!dropdownSearch.trim()) return availableBhashyas;
    const q = dropdownSearch.toLowerCase();
    return availableBhashyas.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.school.toLowerCase().includes(q) ||
        (b.tikas &&
          b.tikas.some(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.author.toLowerCase().includes(q)
          ))
    );
  }, [availableBhashyas, dropdownSearch]);

  // Selected Bhashya objects to display
  const displayedBhashyas = useMemo(() => {
    return availableBhashyas.filter((b) => selectedBhashyaIds.includes(b.id));
  }, [availableBhashyas, selectedBhashyaIds]);

  return (
    <div
      id={`bhashya-tika-section-${verse.id}`}
      className={`space-y-3 pt-2 ${className}`}
    >
      {/* Top Bar: Dropdown Menu Trigger and View Options */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-gradient-to-r from-[#FAF4E8] via-[#FFFDF8] to-[#FAF4E8] border border-[#bf953f]/35 shadow-xs">
        {/* Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            id={`btn-select-bhashyas-${verse.id}`}
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#F5ECE0] border border-[#bf953f]/40 text-[#543b14] font-medium text-xs sm:text-sm transition shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#8c6011]/30"
            aria-expanded={isDropdownOpen}
            title="Open dropdown menu to select Bhāṣyas and Ṭīkās"
          >
            <BookOpen className="w-4 h-4 text-[#8c6011]" />
            <span className="font-serif font-semibold">
              Bhāṣya Commentaries (भाष्य-चयनम्)
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#8c6011]/15 text-[#8c6011] text-[11px] font-mono font-bold">
              {selectedBhashyaIds.length} of {availableBhashyas.length}
            </span>
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8c6011]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8c6011]" />
            )}
          </button>

          {/* Floating Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id={`dropdown-bhashya-menu-${verse.id}`}
              className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 max-w-[95vw] bg-[#FFFDF9] border-2 border-[#bf953f]/50 rounded-2xl shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold font-serif text-[#3d2f21] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#8c6011]" />
                    <span>Choose Commentaries & Ṭīkās</span>
                  </h4>
                  <p className="text-[10px] text-[#7a6550] font-sans">
                    Multi-select Bhāṣyas and sub-commentaries to compare
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 rounded-md text-[#7a6550] hover:text-[#3d2f21] hover:bg-[#FAF1E2] transition cursor-pointer"
                  title="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-2 py-0.5 rounded-md bg-[#FAF4E8] hover:bg-[#F2E6D0] border border-[#bf953f]/30 text-[#6d4f18] cursor-pointer transition font-medium"
                >
                  All ({availableBhashyas.length})
                </button>
                <button
                  type="button"
                  onClick={selectPrimaryOnly}
                  className="px-2 py-0.5 rounded-md bg-[#FAF4E8] hover:bg-[#F2E6D0] border border-[#bf953f]/30 text-[#6d4f18] cursor-pointer transition font-medium"
                >
                  Primary Only
                </button>
                <button
                  type="button"
                  onClick={selectTrimata}
                  className="px-2 py-0.5 rounded-md bg-[#FAF4E8] hover:bg-[#F2E6D0] border border-[#bf953f]/30 text-[#6d4f18] cursor-pointer transition font-medium"
                  title="Advaita, Viśiṣṭādvaita, Dvaita"
                >
                  Trimata (3)
                </button>
                <button
                  type="button"
                  onClick={selectShaktibhashya}
                  className="px-2 py-0.5 rounded-md bg-[#e11d48]/10 hover:bg-[#e11d48]/20 border border-[#e11d48]/30 text-[#be123c] font-semibold cursor-pointer transition font-mono"
                  title="Add Śāktabhāṣyam (Bhatpara Tradition) by MM Pañcānana Tarkaratna"
                >
                  + Śāktabhāṣya
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-2 py-0.5 rounded-md bg-[#FAF4E8] hover:bg-[#F2E6D0] border border-[#bf953f]/30 text-[#8c6011] cursor-pointer transition font-medium ml-auto"
                >
                  Clear
                </button>
              </div>

              {/* Global Ṭīkā Option Toggle */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#FAF5EC] to-[#F7EFE1] border border-[#bf953f]/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-[#8c6011] shrink-0" />
                  <div>
                    <div className="text-xs font-serif font-bold text-[#3d2f21]">
                      Enable Ṭīkās (उपटीकाः)
                    </div>
                    <div className="text-[10px] text-[#6d553e]">
                      Include sub-commentaries & dialectical glosses
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTikas}
                    onChange={(e) => setShowTikas(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#d8c8b4] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#bfa993] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8c6011]"></div>
                </label>
              </div>

              {/* Search Filter if multiple commentaries */}
              {availableBhashyas.length > 3 && (
                <div className="relative">
                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    placeholder="Filter by author or school..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/30 text-[#2D2319] placeholder-[#9a8570] focus:outline-hidden focus:ring-1 focus:ring-[#8c6011]"
                  />
                  {dropdownSearch && (
                    <button
                      type="button"
                      onClick={() => setDropdownSearch("")}
                      className="absolute right-2 top-1.5 text-xs text-[#8c6011] cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Bhāṣyas Checklist */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredBhashyas.map((bhashya) => {
                  const isSelected = selectedBhashyaIds.includes(bhashya.id);
                  const bhashyaTikas = bhashya.tikas || [];
                  const selectedTikas = selectedTikaIdsByBhashya[bhashya.id] || [];

                  return (
                    <div
                      key={bhashya.id}
                      className={`p-2 rounded-xl border transition ${
                        isSelected
                          ? "bg-[#FAF5EC] border-[#bf953f]/50 shadow-2xs"
                          : "bg-[#FFFDFB] border-stone-200/80 hover:bg-[#FAF7F0]"
                      }`}
                    >
                      {/* Bhāṣya Main Checkbox Row */}
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBhashya(bhashya.id)}
                          className="mt-0.5 h-4 w-4 rounded text-[#8c6011] focus:ring-[#8c6011] border-stone-300 accent-[#8c6011] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold"
                              style={{
                                backgroundColor: `${bhashya.badgeColor || "#8c6011"}18`,
                                color: bhashya.badgeColor || "#8c6011",
                                border: `1px solid ${bhashya.badgeColor || "#8c6011"}35`,
                              }}
                            >
                              {bhashya.school}
                            </span>
                            {bhashya.century && (
                              <span className="text-[9px] text-[#7a6550] font-mono">
                                • {bhashya.century}
                              </span>
                            )}
                          </div>
                          <div className="font-serif font-bold text-xs sm:text-sm text-[#2D2319] leading-snug mt-0.5">
                            {bhashya.name}
                          </div>
                          <div className="text-[11px] text-[#6d553e] font-serif">
                            {bhashya.author}
                          </div>
                        </div>
                      </label>

                      {/* Nested Ṭīkās checklist for this Bhāṣya */}
                      {showTikas && isSelected && bhashyaTikas.length > 0 && (
                        <div className="mt-2 ml-6 pl-2.5 border-l-2 border-[#bf953f]/35 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold flex items-center gap-1">
                            <Scroll className="w-3 h-3" />
                            <span>Select Ṭīkās (उपटीकाः):</span>
                          </div>
                          {bhashyaTikas.map((tika) => {
                            const isTikaChecked = selectedTikas.includes(tika.id);
                            return (
                              <label
                                key={tika.id}
                                className="flex items-start gap-2 text-[11px] text-[#4a3928] cursor-pointer hover:text-[#2D2319]"
                              >
                                <input
                                  type="checkbox"
                                  checked={isTikaChecked}
                                  onChange={() => toggleTika(bhashya.id, tika.id)}
                                  className="mt-0.5 h-3.5 w-3.5 rounded text-[#8c6011] focus:ring-[#8c6011] border-stone-300 accent-[#8c6011] cursor-pointer"
                                />
                                <div>
                                  <div className="font-serif font-semibold leading-tight">
                                    {tika.name}
                                  </div>
                                  <div className="text-[10px] text-[#7a6550]">
                                    {tika.author}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Apply / Done button */}
              <div className="border-t border-[#bf953f]/20 pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#6d553e] font-sans">
                  {selectedBhashyaIds.length} commentaries visible
                </span>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-3 py-1 bg-[#8c6011] hover:bg-[#734f0d] text-white text-xs font-medium rounded-lg shadow-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Active Badges on the right */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Ṭīkā toggle pill */}
          <button
            type="button"
            onClick={() => setShowTikas((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer border ${
              showTikas
                ? "bg-[#8c6011]/12 border-[#8c6011]/35 text-[#8c6011] font-bold"
                : "bg-[#FAF5ED] border-stone-300/70 text-[#7a6550]"
            }`}
            title="Toggle Ṭīkās (sub-commentaries) display"
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Ṭīkās (उपटीकाः): {showTikas ? "ON" : "OFF"}</span>
          </button>

          {/* Layout Mode Toggle (Stacked vs Comparative Columns) when 2+ selected */}
          {displayedBhashyas.length > 1 && (
            <div className="flex items-center bg-[#FAF5ED] p-0.5 rounded-lg border border-[#bf953f]/30">
              <button
                type="button"
                onClick={() => setLayoutMode("stacked")}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono cursor-pointer transition ${
                  layoutMode === "stacked"
                    ? "bg-[#8c6011] text-white shadow-2xs font-bold"
                    : "text-[#6d553e] hover:text-[#2D2319]"
                }`}
                title="View commentaries stacked vertically"
              >
                Stacked
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("columns")}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono cursor-pointer transition flex items-center gap-1 ${
                  layoutMode === "columns"
                    ? "bg-[#8c6011] text-white shadow-2xs font-bold"
                    : "text-[#6d553e] hover:text-[#2D2319]"
                }`}
                title="View commentaries side-by-side in columns"
              >
                <Columns className="w-3 h-3" />
                <span>Columns</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Bhāṣyas Display Area (Appears Below the Main Verse / Sūtra) */}
      {displayedBhashyas.length === 0 ? (
        <div className="p-4 rounded-xl bg-[#FAF5ED] border border-dashed border-[#bf953f]/40 text-center space-y-2">
          <BookOpen className="w-5 h-5 text-[#8c6011] mx-auto opacity-70" />
          <p className="text-xs sm:text-sm font-serif text-[#6d553e]">
            No Bhāṣyas currently selected. Click <strong>Bhāṣya Commentaries</strong> above to select commentaries for this verse.
          </p>
          <button
            type="button"
            onClick={selectPrimaryOnly}
            className="px-3 py-1 bg-[#8c6011] text-white text-xs rounded-lg font-medium hover:bg-[#734f0d] transition cursor-pointer"
          >
            Show Primary Bhāṣya
          </button>
        </div>
      ) : (
        <div
          className={
            layoutMode === "columns" && displayedBhashyas.length > 1
              ? "grid grid-cols-1 md:grid-cols-2 gap-3"
              : "space-y-3"
          }
        >
          {displayedBhashyas.map((bhashya) => {
            const isCollapsed = collapsedCards[bhashya.id] || false;
            const bhashyaTikas = bhashya.tikas || [];
            const selectedTikaIds = selectedTikaIdsByBhashya[bhashya.id] || [];
            const activeTikas = bhashyaTikas.filter((t) =>
              selectedTikaIds.includes(t.id)
            );

            return (
              <div
                key={bhashya.id}
                id={`bhashya-card-${bhashya.id}`}
                className="rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FFFDF8] border-2 border-[#bf953f]/35 shadow-xs overflow-hidden transition"
              >
                {/* Commentary Card Header */}
                <div className="p-3 bg-gradient-to-r from-[#FAF4E8] via-[#FAF2DE] to-[#FAF4E8] border-b border-[#bf953f]/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide"
                      style={{
                        backgroundColor: `${bhashya.badgeColor || "#8c6011"}18`,
                        color: bhashya.badgeColor || "#8c6011",
                        border: `1px solid ${bhashya.badgeColor || "#8c6011"}40`,
                      }}
                    >
                      {bhashya.school}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D2319] truncate">
                      {bhashya.name}
                    </h4>
                    <span className="text-[11px] text-[#6d553e] font-serif hidden sm:inline">
                      — {bhashya.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Audio Chant Button if available */}
                    {bhashya.mulaExtract && (
                      <VedicChantButton
                        verseText={bhashya.mulaExtract}
                        variant="compact"
                        label="Chant"
                      />
                    )}

                    {/* Copy Commentary Button */}
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `[${bhashya.name} by ${bhashya.author}]\n${bhashya.mulaExtract}\n\n[Translation]: ${bhashya.englishExplanation || ""}`,
                          bhashya.id
                        )
                      }
                      className="p-1 rounded-md text-[#7a6550] hover:text-[#2D2319] hover:bg-[#FAF1E2] transition cursor-pointer"
                      title="Copy commentary text"
                    >
                      {copiedId === bhashya.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Collapse / Expand Card */}
                    <button
                      type="button"
                      onClick={() => toggleCardCollapse(bhashya.id)}
                      className="p-1 rounded-md text-[#7a6550] hover:text-[#2D2319] hover:bg-[#FAF1E2] transition cursor-pointer"
                      title={isCollapsed ? "Expand commentary" : "Collapse commentary"}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                {!isCollapsed && (
                  <div className="p-3.5 space-y-3">
                    {/* Sanskrit Mūla Commentary Extract */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#8c6011] uppercase tracking-wide font-bold">
                        <span>भाष्य-मूलम् (Mūla Commentary Extract):</span>
                        <span className="text-[#7a6550] font-serif lowercase italic text-[11px]">
                          {bhashya.author}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/25 font-serif text-[#2D2319] leading-relaxed select-text ${
                          isFocused ? "text-base sm:text-lg" : "text-xs sm:text-sm"
                        }`}
                        style={{
                          lineHeight: isFocused
                            ? focusedLineSpacing === "spacious"
                              ? 2.0
                              : focusedLineSpacing === "expansive"
                              ? 2.4
                              : 2.2
                            : undefined,
                        }}
                      >
                        {transliterate(bhashya.mulaExtract, activeLipi)}
                      </div>
                    </div>

                    {/* English Scholarly Translation & Exegesis */}
                    {bhashya.englishExplanation && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-[#8c6011] uppercase tracking-wide font-bold">
                          Scholarly Exegesis & Philosophical Analysis:
                        </div>
                        <p
                          className={`font-serif text-[#3d2f21] leading-relaxed ${
                            isFocused ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                          }`}
                        >
                          {bhashya.englishExplanation}
                        </p>
                      </div>
                    )}

                    {/* Dialectical Notes if present */}
                    {bhashya.commentaryNotes && (
                      <div className="p-2.5 rounded-lg bg-[#FAF2DE]/80 border border-[#bf953f]/20 text-xs text-[#5c4731] leading-relaxed font-serif flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#8c6011] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#8c6011] font-mono uppercase tracking-wider text-[10px] block mb-0.5">
                            Dialectical Insight:
                          </strong>
                          {bhashya.commentaryNotes}
                        </div>
                      </div>
                    )}

                    {/* Nested Ṭīkā Section (उपटीकाः — Sub-commentaries) */}
                    {showTikas && activeTikas.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#bf953f]/25 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#8c6011]">
                            <Scroll className="w-3.5 h-3.5 text-[#8c6011]" />
                            <span>
                              Ṭīkā-Prasthāna (उपटीकाः — Classical Sub-Commentaries)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#7a6550] bg-[#FAF5ED] px-1.5 py-0.5 rounded border border-[#bf953f]/20">
                            {activeTikas.length} {activeTikas.length === 1 ? "Ṭīkā" : "Ṭīkās"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {activeTikas.map((tika) => (
                            <div
                              key={tika.id}
                              id={`tika-card-${tika.id}`}
                              className="p-3 rounded-xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border border-[#bf953f]/30 space-y-1.5 shadow-2xs"
                            >
                              {/* Ṭīkā Header */}
                              <div className="flex items-center justify-between gap-2 border-b border-[#bf953f]/20 pb-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-serif font-bold text-xs text-[#543b14]">
                                    {tika.name}
                                  </span>
                                  <span className="text-[10px] text-[#7a6550] font-serif">
                                    by {tika.author}
                                  </span>
                                  {tika.tradition && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#8c6011]/10 text-[#8c6011] font-mono">
                                      {tika.tradition}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(
                                      `[${tika.name} by ${tika.author}]\n${tika.mulaExtract}\n${tika.englishExplanation || ""}`,
                                      tika.id
                                    )
                                  }
                                  className="p-1 rounded text-[#7a6550] hover:text-[#2D2319] transition cursor-pointer"
                                  title="Copy Ṭīkā extract"
                                >
                                  {copiedId === tika.id ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>

                              {/* Ṭīkā Sanskrit Extract */}
                              <div className="font-serif text-xs text-[#2D2319] leading-relaxed italic bg-[#FAF7F0] p-2 rounded-lg border border-[#bf953f]/20">
                                {transliterate(tika.mulaExtract, activeLipi)}
                              </div>

                              {/* Ṭīkā English Explanation */}
                              {tika.englishExplanation && (
                                <p className="text-[11px] text-[#543b14] font-serif leading-relaxed">
                                  {tika.englishExplanation}
                                </p>
                              )}

                              {/* Dialectical notes if any */}
                              {tika.dialecticalNotes && (
                                <p className="text-[10px] text-[#7a6550] font-mono italic">
                                  Note: {tika.dialecticalNotes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
