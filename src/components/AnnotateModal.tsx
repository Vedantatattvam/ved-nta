import { useState } from "react";
import { createPortal } from "react-dom";
import {
  HighlightColor,
  HIGHLIGHT_COLOR_CONFIG,
  StudyNoteAnnotation,
} from "../types/studyNotes";
import { saveStudyNote } from "../utils/studyNotesStorage";
import {
  Sparkles,
  Bookmark,
  Check,
  X,
  Tag,
  Palette,
  FileText,
  AlignLeft,
  Trash2,
} from "lucide-react";

interface AnnotateModalProps {
  isOpen: boolean;
  onClose: () => void;
  textId: string;
  textTitle: string;
  chapterId: string;
  chapterTitle: string;
  verseId: string;
  verseNumber: string;
  verseTitle?: string;
  initialSelectedText: string;
  initialField?: "mula" | "iast" | "translation" | "bhashya" | "padaccheda" | "custom";
  existingNote?: StudyNoteAnnotation | null;
  onSaved: (note: StudyNoteAnnotation) => void;
  onDelete?: (id: string) => void;
}

const COMMON_TAGS = [
  "Brahman",
  "Māyā",
  "Jīva-Īśvara",
  "Mokṣa",
  "Pūrvapakṣa",
  "Siddhānta",
  "Pramāṇa",
  "Advaita",
  "Bhakti",
  "Sādhanā",
  "Dialectics",
  "Mahāvākya",
];

export function AnnotateModal({
  isOpen,
  onClose,
  textId,
  textTitle,
  chapterId,
  chapterTitle,
  verseId,
  verseNumber,
  verseTitle,
  initialSelectedText,
  initialField = "mula",
  existingNote,
  onSaved,
  onDelete,
}: AnnotateModalProps) {
  const [selectedText, setSelectedText] = useState(
    existingNote?.selectedText || initialSelectedText
  );
  const [field, setField] = useState(existingNote?.field || initialField);
  const [color, setColor] = useState<HighlightColor>(
    existingNote?.color || "gold"
  );
  const [noteText, setNoteText] = useState(existingNote?.note || "");
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const clean = customTagInput.trim().replace(/^#/, "");
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setCustomTagInput("");
  };

  const handleSave = () => {
    if (!selectedText.trim()) return;

    const saved = saveStudyNote({
      id: existingNote?.id,
      textId,
      textTitle,
      chapterId,
      chapterTitle,
      verseId,
      verseNumber,
      verseTitle,
      selectedText: selectedText.trim(),
      field,
      color,
      note: noteText.trim(),
      tags,
    });

    onSaved(saved);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 400);
  };

  const modalContent = (
    <div
      id="study-note-annotation-modal"
      style={{ zIndex: 999999 }}
      className="fixed inset-0 z-50 z-[999999] flex items-center justify-center p-4 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="study-note-annotation-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF8] border-2 border-[#bf953f]/70 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-5 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#bf953f]/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c59b27] text-[#120e0b]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg text-[#2D2319]">
                {existingNote ? "Edit Study Annotation" : "Highlight & Add Study Note"}
              </h3>
              <p className="text-[11px] font-mono text-[#8c6011]">
                {textTitle} • {verseNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Excerpt to Highlight */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5" /> Highlighted Passage / Excerpt:
          </label>
          <div
            className={`p-3 rounded-xl border font-serif text-sm leading-relaxed transition-all ${
              HIGHLIGHT_COLOR_CONFIG[color].bgClass
            } ${HIGHLIGHT_COLOR_CONFIG[color].borderClass} ${
              HIGHLIGHT_COLOR_CONFIG[color].textClass
            }`}
          >
            {selectedText || "No text selected."}
          </div>
        </div>

        {/* Target Field Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Target Section:
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: "mula", label: "Mūla Sanskrit" },
              { id: "iast", label: "IAST Roman" },
              { id: "translation", label: "Translation" },
              { id: "bhashya", label: "Bhāṣya Extract" },
              { id: "padaccheda", label: "Padaccheda" },
              { id: "custom", label: "General Pass" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setField(f.id as any)}
                className={`py-1.5 px-2 rounded-lg border text-center font-medium transition cursor-pointer text-xs ${
                  field === f.id
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold shadow-xs"
                    : "bg-[#FAF5ED] border-[#bf953f]/30 text-[#4a3928] hover:bg-[#FAF1E2]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Color Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Highlight Sacred Palette:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(HIGHLIGHT_COLOR_CONFIG) as HighlightColor[]).map((cKey) => {
              const cConf = HIGHLIGHT_COLOR_CONFIG[cKey];
              const isSelected = color === cKey;
              return (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => setColor(cKey)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer relative ${
                    isSelected
                      ? "ring-2 ring-[#8c6011] border-[#8c6011] shadow-md scale-105"
                      : "border-transparent opacity-80 hover:opacity-100"
                  } ${cConf.bgClass}`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: cConf.hex }}
                  />
                  <span className="text-[10px] font-bold text-center font-serif text-[#120e0b] leading-tight">
                    {cConf.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note / Scholarly Reflection Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Scholarly Commentary / Personal Note:
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Write your textual analysis, cross-references (e.g., Śāṅkarabhāṣya 1.1.4, Chāndogya 6.8.7), or philosophical reflections..."
            className="w-full p-3 rounded-xl border border-[#bf953f]/40 bg-white text-xs sm:text-sm text-[#2D2319] focus:outline-none focus:ring-2 focus:ring-[#8c6011] resize-none"
          />
        </div>

        {/* Thematic Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Thematic Tags:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_TAGS.map((t) => {
              const isSelected = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleToggleTag(t)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#8c6011] text-[#FFFDF8] border-[#8c6011] font-bold"
                      : "bg-[#FAF5ED] text-[#6e5842] border-[#bf953f]/30 hover:bg-[#FAF1E2]"
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              placeholder="Add custom tag (press Enter)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-[#bf953f]/35 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#8c6011]"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-3 py-1.5 rounded-lg bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-bold text-[#8c6011] hover:bg-[#f3e5ce] cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#bf953f]/30">
          <div>
            {existingNote && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this study annotation?")) {
                    onDelete(existingNote.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6e5842] hover:bg-[#FAF1E2] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] text-[#120e0b] font-bold text-xs shadow-md hover:brightness-105 transition cursor-pointer border border-[#ffe680]"
            >
              <Check className="w-4 h-4" />
              <span>{existingNote ? "Update Study Note" : "Save Annotation"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
