import React, { useState, useEffect } from "react";
import {
  VerseBookmark,
  getBookmarks,
  removeBookmark,
} from "../utils/bookmarksStorage";
import { TabType } from "../types";
import {
  Bookmark,
  BookOpen,
  Trash2,
  X,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  BookMarked,
} from "lucide-react";

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookmark: (bookmark: VerseBookmark) => void;
  currentGranthaId?: string;
}

export function BookmarksDrawer({
  isOpen,
  onClose,
  onSelectBookmark,
  currentGranthaId,
}: BookmarksDrawerProps) {
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([]);
  const [filterGrantha, setFilterGrantha] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const refreshBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  useEffect(() => {
    if (isOpen) {
      refreshBookmarks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const uniqueGranthas = Array.from(
    new Set(bookmarks.map((b) => b.granthaTitle))
  );

  const filteredBookmarks = bookmarks.filter((b) => {
    if (filterGrantha !== "all" && b.granthaTitle !== filterGrantha) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.granthaTitle.toLowerCase().includes(q) ||
      b.chapterTitle.toLowerCase().includes(q) ||
      b.verseNumber.toLowerCase().includes(q) ||
      b.mulaSanskrit.toLowerCase().includes(q) ||
      b.englishTranslation.toLowerCase().includes(q) ||
      (b.verseTitle && b.verseTitle.toLowerCase().includes(q))
    );
  });

  const handleDelete = (granthaId: string, verseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(granthaId, verseId);
    refreshBookmarks();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2D2319]/45 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#FFFDF8] h-full shadow-[0_0_50px_rgba(0,0,0,0.35)] border-l-2 border-[#bf953f]/80 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#bf953f]/30 flex items-center justify-between bg-gradient-to-r from-[#FAF1E2] to-[#FFFDF8]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8c6011] text-white shadow-xs">
              <Bookmark className="w-5 h-5 fill-amber-300 text-amber-200" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-[#2D2319] flex items-center gap-2">
                <span>Bookmarked Verses</span>
                <span className="text-xs font-mono px-2 py-0.5 bg-[#bf953f]/20 border border-[#bf953f]/40 text-[#8c6011] rounded-full">
                  {bookmarks.length} saved
                </span>
              </h2>
              <p className="text-xs text-[#735013] font-serif">
                Quick reference repository for scriptural passages & verses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#bf953f]/30 hover:bg-[#FAF1E2] text-[#8c6011] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#bf953f]/20 bg-[#FAF5ED] space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6011]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in bookmarked Sanskrit, translation, or titles..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#bf953f]/40 rounded-xl text-xs font-serif text-[#2D2319] placeholder:text-[#9e8367] focus:outline-none focus:ring-1 focus:ring-[#8c6011]"
            />
          </div>

          {uniqueGranthas.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-mono text-[#8c6011] font-bold shrink-0">
                Text:
              </span>
              <button
                type="button"
                onClick={() => setFilterGrantha("all")}
                className={`px-2.5 py-1 rounded-lg font-serif transition shrink-0 cursor-pointer ${
                  filterGrantha === "all"
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold shadow-xs"
                    : "bg-white border border-[#bf953f]/30 text-[#4a3928]"
                }`}
              >
                All ({bookmarks.length})
              </button>
              {uniqueGranthas.map((title) => {
                const count = bookmarks.filter((b) => b.granthaTitle === title).length;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setFilterGrantha(title)}
                    className={`px-2.5 py-1 rounded-lg font-serif transition shrink-0 cursor-pointer ${
                      filterGrantha === title
                        ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold shadow-xs"
                        : "bg-white border border-[#bf953f]/30 text-[#4a3928]"
                    }`}
                  >
                    {title} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3 text-[#735013]">
              <BookMarked className="w-12 h-12 text-[#bf953f]/60 mx-auto" />
              <div className="font-serif font-bold text-base text-[#2D2319]">
                {bookmarks.length === 0
                  ? "No bookmarked verses yet"
                  : "No bookmarks match your search"}
              </div>
              <p className="text-xs max-w-sm mx-auto leading-relaxed text-[#6e5842]">
                Click the <strong className="text-[#8c6011]">Bookmark</strong> button on any verse in the Sanskrit Text Reader to save it here for fast revision and comparative study.
              </p>
            </div>
          ) : (
            filteredBookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onSelectBookmark(bm);
                  onClose();
                }}
                className="card-3d-gold p-4 space-y-2.5 hover:border-[#bf953f] hover:shadow-md transition cursor-pointer group relative"
              >
                {/* Grantha & Chapter Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#bf953f]/20 pb-2">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wide">
                      {bm.granthaTitle} • {bm.chapterTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-[#8c6011] text-white text-[11px] font-mono font-bold">
                        {bm.verseNumber}
                      </span>
                      {bm.verseTitle && (
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D2319]">
                          {bm.verseTitle}
                        </h4>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(bm.granthaId, bm.verseId, e)}
                      className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="p-1 text-[#8c6011] group-hover:translate-x-0.5 transition">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Sanskrit Verse */}
                <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/25 font-devanagari text-[#8c6011] font-bold text-sm leading-relaxed whitespace-pre-wrap">
                  {bm.mulaSanskrit}
                </div>

                {/* Translation Preview */}
                <p className="text-xs text-[#4a3928] leading-relaxed line-clamp-2 font-serif italic">
                  "{bm.englishTranslation}"
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#8c6011]/80 pt-1">
                  <span>Saved on {new Date(bm.createdAt).toLocaleDateString()}</span>
                  <span className="group-hover:underline flex items-center gap-1 font-bold">
                    <span>Open in Reader</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
