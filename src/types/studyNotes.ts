export type HighlightColor = "gold" | "ochre" | "emerald" | "rose" | "sapphire" | "amethyst";

export interface StudyNoteAnnotation {
  id: string;
  textId: string;
  textTitle: string;
  chapterId: string;
  chapterTitle: string;
  verseId: string;
  verseNumber: string;
  verseTitle?: string;
  selectedText: string;
  field: "mula" | "iast" | "translation" | "bhashya" | "padaccheda" | "custom";
  color: HighlightColor;
  note: string;
  tags: string[];
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export const HIGHLIGHT_COLOR_CONFIG: Record<
  HighlightColor,
  {
    name: string;
    sanskritName: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    chipClass: string;
    hex: string;
  }
> = {
  gold: {
    name: "Golden Radiance",
    sanskritName: "सुवर्ण (Suvarṇa)",
    bgClass: "bg-amber-100/80 hover:bg-amber-200/90",
    borderClass: "border-amber-400/80",
    textClass: "text-amber-950",
    chipClass: "bg-amber-100 border-amber-300 text-amber-900",
    hex: "#f59e0b",
  },
  ochre: {
    name: "Vedic Ochre",
    sanskritName: "गैरिक (Gairika)",
    bgClass: "bg-orange-100/80 hover:bg-orange-200/90",
    borderClass: "border-orange-400/80",
    textClass: "text-orange-950",
    chipClass: "bg-orange-100 border-orange-300 text-orange-900",
    hex: "#ea580c",
  },
  emerald: {
    name: "Forest Emerald",
    sanskritName: "मरकत (Marakata)",
    bgClass: "bg-emerald-100/80 hover:bg-emerald-200/90",
    borderClass: "border-emerald-400/80",
    textClass: "text-emerald-950",
    chipClass: "bg-emerald-100 border-emerald-300 text-emerald-900",
    hex: "#10b981",
  },
  rose: {
    name: "Sacred Lotus",
    sanskritName: "पद्म (Padma)",
    bgClass: "bg-rose-100/80 hover:bg-rose-200/90",
    borderClass: "border-rose-400/80",
    textClass: "text-rose-950",
    chipClass: "bg-rose-100 border-rose-300 text-rose-900",
    hex: "#f43f5e",
  },
  sapphire: {
    name: "Royal Sapphire",
    sanskritName: "नीलमणि (Nīlamaṇi)",
    bgClass: "bg-sky-100/80 hover:bg-sky-200/90",
    borderClass: "border-sky-400/80",
    textClass: "text-sky-950",
    chipClass: "bg-sky-100 border-sky-300 text-sky-900",
    hex: "#0284c7",
  },
  amethyst: {
    name: "Mystic Amethyst",
    sanskritName: "जाम्बूनद (Jāmbūnada)",
    bgClass: "bg-purple-100/80 hover:bg-purple-200/90",
    borderClass: "border-purple-400/80",
    textClass: "text-purple-950",
    chipClass: "bg-purple-100 border-purple-300 text-purple-900",
    hex: "#9333ea",
  },
};
