import { useState, useMemo } from "react";
import {
  HighlightColor,
  HIGHLIGHT_COLOR_CONFIG,
  StudyNoteAnnotation,
} from "../types/studyNotes";
import {
  getStudyNotes,
  deleteStudyNote,
  exportNotesAsMarkdown,
  downloadFile,
} from "../utils/studyNotesStorage";
import {
  Bookmark,
  BookMarked,
  X,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Tag,
  Filter,
  Palette,
  FileText,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

interface StudyNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTextId?: string;
  onNavigateToVerse?: (textId: string, chapterId: string, verseId: string) => void;
  onEditNote?: (note: StudyNoteAnnotation) => void;
}

export function StudyNotesDrawer({
  isOpen,
  onClose,
  currentTextId,
  onNavigateToVerse,
  onEditNote,
}: StudyNotesDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorFilter, setSelectedColorFilter] = useState<
    HighlightColor | "all"
  >("all");
  const [filterCurrentTextOnly, setFilterCurrentTextOnly] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | "all">(
    "all"
  );
  const [notesVersion, setNotesVersion] = useState(0);

  // Load fresh notes from storage
  const allNotes = useMemo(() => {
    return getStudyNotes();
  }, [notesVersion, isOpen]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allNotes.forEach((n) => {
      if (n.tags) {
        n.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [allNotes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return allNotes.filter((n) => {
      // Color filter
      if (selectedColorFilter !== "all" && n.color !== selectedColorFilter) {
        return false;
      }
      // Current text filter
      if (filterCurrentTextOnly && currentTextId && n.textId !== currentTextId) {
        return false;
      }
      // Tag filter
      if (
        selectedTagFilter !== "all" &&
        (!n.tags || !n.tags.includes(selectedTagFilter))
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.textTitle.toLowerCase().includes(q) ||
          n.chapterTitle.toLowerCase().includes(q) ||
          n.verseNumber.toLowerCase().includes(q) ||
          (n.verseTitle && n.verseTitle.toLowerCase().includes(q)) ||
          n.selectedText.toLowerCase().includes(q) ||
          n.note.toLowerCase().includes(q) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [
    allNotes,
    selectedColorFilter,
    filterCurrentTextOnly,
    currentTextId,
    selectedTagFilter,
    searchQuery,
  ]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    if (confirm("Delete this study annotation?")) {
      deleteStudyNote(id);
      setNotesVersion((v) => v + 1);
    }
  };

  const handleExportMarkdown = () => {
    const md = exportNotesAsMarkdown(filteredNotes);
    const date = new Date().toISOString().split("T")[0];
    downloadFile(md, `vedantatattvam-study-notes-${date}.md`, "text/markdown");
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(filteredNotes, null, 2);
    const date = new Date().toISOString().split("T")[0];
    downloadFile(json, `vedantatattvam-study-notes-${date}.json`, "application/json");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2319]/45 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#FFFDF8] border-l-2 border-[#bf953f]/60 shadow-[0_0_40px_rgba(0,0,0,0.25)] flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#bf953f]/30 bg-gradient-to-r from-[#FAF5EC] via-[#FFFDF9] to-[#FAF5EC]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#fcf6ba] to-[#c59b27] text-[#120e0b] shadow-sm border border-[#ffe680]">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-lg sm:text-xl gold-text-gradient leading-tight">
                    Scholarly Study Notes & Highlights
                  </h2>
                  <p className="text-xs font-mono text-[#8c6011]">
                    स्वाध्याय-मञ्जूषा ({allNotes.length} Annotations Saved)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl border border-[#bf953f]/30 hover:bg-[#FAF1E2] text-[#8c6011] transition cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Export Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#bf953f]/20">
              <div className="text-xs text-[#6e5842] font-serif">
                Showing <strong>{filteredNotes.length}</strong> of{" "}
                <strong>{allNotes.length}</strong> notes
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  disabled={filteredNotes.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF1E2] hover:bg-[#f3e5ce] border border-[#bf953f]/35 text-[#8c6011] text-xs font-bold font-mono transition cursor-pointer disabled:opacity-50"
                  title="Download Markdown Study Journal"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .MD</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  disabled={filteredNotes.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF1E2] hover:bg-[#f3e5ce] border border-[#bf953f]/35 text-[#8c6011] text-xs font-bold font-mono transition cursor-pointer disabled:opacity-50"
                  title="Download Raw JSON Archive"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className="p-3.5 bg-[#FAF5ED] border-b border-[#bf953f]/25 space-y-2.5">
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c6011] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all annotations, text excerpts, or tags..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#bf953f]/40 text-xs sm:text-sm text-[#2D2319] focus:outline-none focus:ring-2 focus:ring-[#8c6011]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6011]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Ribbons */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Color filter */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                <span className="text-[10px] font-mono text-[#8c6011] font-bold uppercase mr-1">
                  Palette:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedColorFilter("all")}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                    selectedColorFilter === "all"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold shadow-xs"
                      : "bg-white text-[#5c4731] border-[#bf953f]/30"
                  }`}
                >
                  All
                </button>
                {(Object.keys(HIGHLIGHT_COLOR_CONFIG) as HighlightColor[]).map(
                  (cKey) => {
                    const conf = HIGHLIGHT_COLOR_CONFIG[cKey];
                    const isSel = selectedColorFilter === cKey;
                    return (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => setSelectedColorFilter(cKey)}
                        className={`w-5 h-5 rounded-full border transition cursor-pointer relative flex items-center justify-center ${
                          isSel
                            ? "ring-2 ring-[#8c6011] scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: conf.hex }}
                        title={conf.name}
                      />
                    );
                  }
                )}
              </div>

              {/* Current text only checkbox */}
              {currentTextId && (
                <label className="flex items-center gap-1.5 text-xs text-[#5c4731] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterCurrentTextOnly}
                    onChange={(e) => setFilterCurrentTextOnly(e.target.checked)}
                    className="rounded text-[#8c6011] focus:ring-[#8c6011]"
                  />
                  <span className="text-[11px] font-mono font-medium">
                    Current Grantha Only
                  </span>
                </label>
              )}
            </div>

            {/* Tags bar */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                <Tag className="w-3 h-3 text-[#8c6011] shrink-0" />
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter("all")}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap cursor-pointer ${
                    selectedTagFilter === "all"
                      ? "bg-[#8c6011] text-white border-[#8c6011]"
                      : "bg-white text-[#6e5842] border-[#bf953f]/30"
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => {
                  const isSel = selectedTagFilter === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTagFilter(tag)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap cursor-pointer ${
                        isSel
                          ? "bg-[#8c6011] text-white border-[#8c6011] font-bold"
                          : "bg-white text-[#6e5842] border-[#bf953f]/30 hover:bg-[#FAF1E2]"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF1E2] border border-[#bf953f]/30 mx-auto flex items-center justify-center text-[#8c6011]">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#2D2319]">
                  No Study Annotations Found
                </h4>
                <p className="text-xs text-[#6e5842] max-w-sm mx-auto leading-relaxed">
                  While reading any text in the Granthasāraṇī Text Reader, select
                  any Sanskrit verse, IAST, or commentary to highlight passages and
                  record personal philosophical notes.
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const colorConf = HIGHLIGHT_COLOR_CONFIG[note.color] || HIGHLIGHT_COLOR_CONFIG.gold;
                return (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-white border border-[#bf953f]/35 shadow-xs hover:shadow-md transition-all duration-200 space-y-3 relative group"
                  >
                    {/* Top Metadata */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: colorConf.hex }}
                          />
                          <h4 className="font-serif font-bold text-sm text-[#2D2319]">
                            {note.textTitle}
                          </h4>
                          <span className="text-[10px] font-mono text-[#8c6011] bg-[#FAF1E2] px-1.5 py-0.5 rounded border border-[#bf953f]/25">
                            {note.verseNumber}
                          </span>
                        </div>
                        <div className="text-[11px] font-serif text-[#6e5842] mt-0.5">
                          {note.chapterTitle} {note.verseTitle ? `• ${note.verseTitle}` : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {onEditNote && (
                          <button
                            type="button"
                            onClick={() => {
                              onEditNote(note);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer text-xs font-serif font-bold"
                            title="Edit Note"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer opacity-70 hover:opacity-100"
                          title="Delete Annotation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Highlighted text block */}
                    <div
                      className={`p-3 rounded-xl border font-serif text-sm leading-relaxed ${colorConf.bgClass} ${colorConf.borderClass} ${colorConf.textClass}`}
                    >
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider block opacity-75 mb-1">
                        [{note.field.toUpperCase()}] Highlighted Text:
                      </span>
                      {note.selectedText}
                    </div>

                    {/* Annotation commentary */}
                    {note.note && (
                      <div className="text-xs text-[#2D2319] bg-[#FAF5ED]/70 p-3 rounded-xl border border-[#bf953f]/20 font-serif leading-relaxed">
                        <span className="text-[10px] font-mono text-[#8c6011] uppercase font-bold tracking-wider block mb-1">
                          Scholar Reflection:
                        </span>
                        {note.note}
                      </div>
                    )}

                    {/* Tags & Jump action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#bf953f]/15">
                      <div className="flex flex-wrap gap-1">
                        {note.tags &&
                          note.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/20"
                            >
                              #{t}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#8c6011]">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        {onNavigateToVerse && (
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateToVerse(
                                note.textId,
                                note.chapterId,
                                note.verseId
                              );
                              onClose();
                            }}
                            className="flex items-center gap-1 text-xs font-mono font-bold text-[#8c6011] hover:text-[#2D2319] hover:underline cursor-pointer ml-2"
                          >
                            <span>Jump to Reader</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#FAF5ED] border-t border-[#bf953f]/30 flex items-center justify-between text-xs text-[#6e5842] font-mono">
            <span>vedāntatattvaṁ Local Storage Notes</span>
            <span>वन्दे गुरुपरम्पराम्</span>
          </div>
        </div>
      </div>
    </div>
  );
}
