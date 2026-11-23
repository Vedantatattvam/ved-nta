import React, { useState } from "react";
import { GLOSSARY_DICTIONARY, GlossaryTerm } from "../glossary";
import { BookOpen, Search, X, Sparkles, Filter } from "lucide-react";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";

interface GlossaryDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GlossaryDrawer({ isOpen: externalIsOpen, onClose: externalOnClose }: GlossaryDrawerProps = {}) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const terms = Object.values(GLOSSARY_DICTIONARY);
  const categories = ["All", ...Array.from(new Set(terms.map((t) => t.category)))];

  const filtered = terms.filter((t) => {
    const matchesSearch =
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.devanagari.includes(search) ||
      t.definition.toLowerCase().includes(search.toLowerCase()) ||
      t.explanation.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <>
      {/* Floating 3D Golden Trigger Button (Shown if not controlled externally) */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          type="button"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#aa771c] via-[#bf953f] to-[#aa771c] text-[#fcf6ba] font-serif font-bold text-xs uppercase tracking-widest shadow-[0_8px_20px_rgba(170,119,28,0.4)] border border-[#fcf6ba]/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          title="Open Student Glossary Index"
        >
          <BookOpen className="w-4 h-4 text-[#fcf6ba] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Vedānta Glossary</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fcf6ba] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fcf6ba]"></span>
          </span>
        </button>
      )}

      {/* Modal / Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#FFFDF8] via-[#FAF5ED] to-[#F7EFE1] text-[#2D2319] w-full max-w-2xl max-h-[85vh] rounded-2xl border-2 border-[#bf953f] shadow-[0_20px_50px_rgba(140,96,17,0.25),0_0_30px_rgba(212,175,55,0.2)] flex flex-col overflow-hidden relative">
            {/* Top Metallic Gold Accent */}
            <div className="h-2 bg-gradient-to-r from-[#aa771c] via-[#fcf6ba] to-[#aa771c] shadow-[0_0_10px_#bf953f]" />

            {/* Header */}
            <div className="p-5 border-b border-[#bf953f]/30 flex items-center justify-between bg-[#FFFDF8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#fcf6ba] to-[#c59b27] text-[#1c1815] shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg tracking-wider gold-text-gradient flex items-center gap-2">
                    VEDĀNTA GLOSSARY INDEX <Sparkles className="w-4 h-4 text-[#8c6011]" />
                  </h3>
                  <p className="text-xs text-[#5c4731]">
                    Hover-enabled terminology encyclopedia for students & researchers
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                type="button"
                className="p-1.5 rounded-xl border border-[#bf953f]/40 hover:bg-[#FAF1E2] text-[#8c6011] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 bg-[#FAF1E2]/60 border-b border-[#bf953f]/20 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6011]" />
                <input
                  type="text"
                  placeholder="Search Sanskrit term, Devanāgarī, definition..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/40 text-xs text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f] placeholder-[#8c6011]/50"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-[#8c6011] shrink-0 mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition whitespace-nowrap cursor-pointer border ${
                      selectedCategory === cat
                        ? "bg-[#8c6011] text-[#fcf6ba] border-[#8c6011] font-bold"
                        : "bg-[#FFFDF8] text-[#5c4731] border-[#bf953f]/30 hover:bg-[#FAF1E2]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-sm text-[#735d45]">
                  No matching Vedāntic terms found for "{search}".
                </div>
              ) : (
                filtered.map((term: GlossaryTerm) => (
                  <div
                    key={term.term}
                    className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 hover:border-[#bf953f] transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-base text-[#1c1815]">
                            {term.term}
                          </span>
                          <span 
                            className={`text-sm font-semibold text-[#8c6011] ${activeLipi === "bengali" ? "font-bengali" : activeLipi === "devanagari" ? "font-devanagari" : "font-serif"}`}
                            style={{ fontFamily: activeLipi === "bengali" ? "'Tiro Bangla', serif" : activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
                          >
                            ({transliterate(term.devanagari, activeLipi)})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8c6011] uppercase tracking-wider bg-[#FAF1E2] px-2 py-0.5 rounded border border-[#bf953f]/30 inline-block mt-1">
                          {term.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#2D2319] font-medium leading-relaxed">
                      {term.definition}
                    </div>

                    <div className="text-xs text-[#5c4731] bg-[#FAF5ED] p-2.5 rounded-lg border border-[#bf953f]/20 font-serif leading-relaxed italic">
                      {term.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-[#FAF1E2] border-t border-[#bf953f]/30 flex justify-between items-center text-xs text-[#8c6011] font-mono">
              <span>Total Terms: {terms.length}</span>
              <span>Showing: {filtered.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
