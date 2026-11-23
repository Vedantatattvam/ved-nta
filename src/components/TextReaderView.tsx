import { useState, useEffect, useMemo, useRef } from "react";
import { GranthaChapter, GranthaVerse, TabType, TextEntry } from "../types";
import { GlossaryHover } from "./GlossaryHover";
import { CitationButton } from "./CitationButton";
import WorkspaceShareBar from "./WorkspaceShareBar";
import BharatiyaLipiSwitcher from "./BharatiyaLipiSwitcher";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import { StudyNoteAnnotation, HIGHLIGHT_COLOR_CONFIG } from "../types/studyNotes";
import {
  getStudyNotes,
  deleteStudyNote,
} from "../utils/studyNotesStorage";
import {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isVerseBookmarked,
  VerseBookmark,
} from "../utils/bookmarksStorage";
import { AnnotateModal } from "./AnnotateModal";
import { StudyNotesDrawer } from "./StudyNotesDrawer";
import { BookmarksDrawer } from "./BookmarksDrawer";
import { exportTextReaderToPdf } from "../utils/academicPdfExport";
import { AcademicPdfExportButton } from "./AcademicPdfExportButton";
import VedicChantButton from "./VedicChantButton";
import BhashyaTikaSelector from "./BhashyaTikaSelector";
import { 
  ArrowLeft, 
  BookOpen, 
  Copy, 
  Check, 
  Sparkles, 
  Scale, 
  Languages, 
  GraduationCap, 
  Search, 
  Layers, 
  SlidersHorizontal,
  Bookmark,
  BookMarked,
  Scroll,
  PanelRightClose,
  PanelRightOpen,
  Info,
  Maximize2,
  Minimize2,
  Menu,
  GitFork,
  Type,
  Highlighter,
  FileDown,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Compass,
  BookmarkCheck,
  Percent,
  Columns,
  Split,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  EyeOff,
  History,
  Clock,
  ChevronDown,
  X,
  Pin,
  PinOff,
  Link2,
  Unlink,
  Pause,
  Play,
  Filter
} from "lucide-react";

interface TextReaderViewProps {
  grantha: TextEntry;
  onBack: () => void;
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
  onOpenFacilitiesDrawer?: () => void;
  initialChapterId?: string;
  initialVerseId?: string;
  isFocusedReadingMode?: boolean;
  onToggleFocusedReadingMode?: (active?: boolean) => void;
}

type ScriptMode = "devanagari" | "iast" | "both" | "active_lipi";
type CommentaryDepth = "mula" | "padaccheda" | "bhashya" | "full";
type FontSize = "sm" | "base" | "lg" | "xl" | "2xl";
type FocusedLineSpacing = "spacious" | "airy" | "expansive";

export default function TextReaderView({
  grantha,
  onBack,
  onNavigateToTab,
  onOpenFacilitiesDrawer,
  initialChapterId,
  initialVerseId,
  isFocusedReadingMode,
  onToggleFocusedReadingMode,
}: TextReaderViewProps) {
  const {
    activeLipi,
    currentLipiConfig,
    getActiveFontConfig,
    fontSizeScale,
    fontWeight,
    lineHeight,
    letterSpacing,
    showDualScript,
    transliterate,
  } = useBharatiyaLipi();

  const chapters: GranthaChapter[] = grantha.chapters || [];

  const [selectedChapterId, setSelectedChapterId] = useState<string>(() => {
    if (initialChapterId && chapters.some((c) => c.id === initialChapterId)) {
      return initialChapterId;
    }
    return chapters.length > 0 ? chapters[0].id : "";
  });

  const [selectedVerseId, setSelectedVerseId] = useState<string>(() => {
    if (initialVerseId) return initialVerseId;
    return chapters.length > 0 && chapters[0]?.verses?.length > 0
      ? chapters[0].verses[0].id
      : "";
  });

  const [scriptMode, setScriptMode] = useState<ScriptMode>("active_lipi");
  const [commentaryDepth, setCommentaryDepth] = useState<CommentaryDepth>("full");
  const [fontSize, setFontSize] = useState<FontSize>("base");
  const [searchQuery, setSearchQuery] = useState("");
  const [inTextSearchScope, setInTextSearchScope] = useState<"all" | "only_verse_mantra">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToolsSidebar, setShowToolsSidebar] = useState<boolean>(true);

  // Focused Reading Mode State & Handlers
  const [internalFocusedReadingMode, setInternalFocusedReadingMode] = useState(false);
  const isFocused = isFocusedReadingMode !== undefined ? isFocusedReadingMode : internalFocusedReadingMode;
  const [focusedLineSpacing, setFocusedLineSpacing] = useState<FocusedLineSpacing>("airy");

  const toggleFocusedMode = (nextVal?: boolean) => {
    const target = nextVal !== undefined ? nextVal : !isFocused;
    setInternalFocusedReadingMode(target);
    onToggleFocusedReadingMode?.(target);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        toggleFocusedMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (fontSize === "sm" || fontSize === "base") {
        setFontSize("xl");
      }
      setShowToolsSidebar(false);
    }
  }, [isFocused]);

  // Unified Reader State (Main text and commentary together)
  const [readerLayoutMode, setReaderLayoutMode] = useState<"spotlight_split" | "unified_cards">("unified_cards");
  const [isSyncScrollEnabled, setIsSyncScrollEnabled] = useState<boolean>(true);
  const [scrollSpyPercent, setScrollSpyPercent] = useState<number>(0);
  const coreVersePaneRef = useRef<HTMLDivElement>(null);
  const translationCommentaryPaneRef = useRef<HTMLDivElement>(null);
  const activeScrollSourceRef = useRef<"core" | "trans" | null>(null);
  const scrollLockTimerRef = useRef<any>(null);

  // Independent Visibility Toggles for Padaccheda and Anvaya
  const [showPadaccheda, setShowPadaccheda] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vedanta_show_padaccheda");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [showAnvaya, setShowAnvaya] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vedanta_show_anvaya");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Per-verse individual toggles / overrides
  const [versePadacchedaOverrides, setVersePadacchedaOverrides] = useState<Record<string, boolean>>({});
  const [verseAnvayaOverrides, setVerseAnvayaOverrides] = useState<Record<string, boolean>>({});

  const toggleShowPadaccheda = () => {
    setShowPadaccheda((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vedanta_show_padaccheda", JSON.stringify(next));
      } catch {}
      return next;
    });
    setVersePadacchedaOverrides({});
  };

  const toggleShowAnvaya = () => {
    setShowAnvaya((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vedanta_show_anvaya", JSON.stringify(next));
      } catch {}
      return next;
    });
    setVerseAnvayaOverrides({});
  };

  const toggleVersePadaccheda = (verseId: string) => {
    setVersePadacchedaOverrides((prev) => {
      const current = prev[verseId] !== undefined ? prev[verseId] : showPadaccheda;
      return { ...prev, [verseId]: !current };
    });
  };

  const toggleVerseAnvaya = (verseId: string) => {
    setVerseAnvayaOverrides((prev) => {
      const current = prev[verseId] !== undefined ? prev[verseId] : showAnvaya;
      return { ...prev, [verseId]: !current };
    });
  };

  // Study Notes & Annotation State
  const [notesVersion, setNotesVersion] = useState(0);
  const [isStudyNotesDrawerOpen, setIsStudyNotesDrawerOpen] = useState(false);
  const [activeAnnotateModal, setActiveAnnotateModal] = useState<{
    isOpen: boolean;
    verse: GranthaVerse;
    selectedText: string;
    field: "mula" | "iast" | "translation" | "bhashya" | "padaccheda" | "custom";
    existingNote?: StudyNoteAnnotation | null;
  } | null>(null);

  // Bookmarks State
  const [bookmarksVersion, setBookmarksVersion] = useState(0);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);
  const [onlyShowBookmarked, setOnlyShowBookmarked] = useState(false);

  // Load all study notes from localStorage
  const allNotes = useMemo(() => {
    return getStudyNotes();
  }, [notesVersion]);

  // Notes for this grantha
  const granthaNotes = useMemo(() => {
    return allNotes.filter((n) => n.textId === grantha.id);
  }, [allNotes, grantha.id]);

  // Bookmarks for this grantha
  const granthaBookmarks = useMemo(() => {
    const allBm = getBookmarks();
    return allBm.filter((b) => b.granthaId === grantha.id);
  }, [bookmarksVersion, grantha.id]);

  const currentChapter =
    chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  const currentVerses = currentChapter?.verses || [];

  // Reading Progress Calculations
  const currentVerseIndex = useMemo(() => {
    const idx = currentVerses.findIndex((v) => v.id === selectedVerseId);
    return idx >= 0 ? idx : 0;
  }, [currentVerses, selectedVerseId]);

  const totalChapterVerses = currentVerses.length || 1;
  const chapterProgressPercent = Math.min(
    100,
    Math.round(((currentVerseIndex + 1) / totalChapterVerses) * 100)
  );

  const totalGranthaVerses = useMemo(() => {
    return chapters.reduce((acc, c) => acc + (c.verses?.length || 0), 0);
  }, [chapters]);

  const handleToggleBookmark = (verse: GranthaVerse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isBookmarked = isVerseBookmarked(grantha.id, verse.id);
    if (isBookmarked) {
      removeBookmark(grantha.id, verse.id);
    } else {
      saveBookmark({
        granthaId: grantha.id,
        granthaTitle: grantha.title,
        chapterId: currentChapter?.id || "c1",
        chapterTitle: currentChapter?.chapterTitle || "Chapter 1",
        verseId: verse.id,
        verseNumber: verse.number,
        verseTitle: verse.title,
        mulaSanskrit: verse.mulaSanskrit,
        mulaIast: verse.mulaIast,
        englishTranslation: verse.englishTranslation,
        school: grantha.school,
        author: grantha.author,
      });
    }
    setBookmarksVersion((v) => v + 1);
  };

  const syncToVerse = (verseId: string) => {
    setSelectedVerseId(verseId);
    
    // In dual-pane mode, smoothly scroll both panes with deliberate offset easing
    const leftEl = document.getElementById(`left-verse-${verseId}`);
    const rightEl = document.getElementById(`right-verse-${verseId}`);
    const unifiedEl = document.getElementById(`verse-${verseId}`);

    if (leftEl && coreVersePaneRef.current) {
      const coreEl = coreVersePaneRef.current;
      const leftRect = leftEl.getBoundingClientRect();
      const parentRect = coreEl.getBoundingClientRect();
      const relativeTop = leftRect.top - parentRect.top + coreEl.scrollTop;
      coreEl.scrollTo({ top: Math.max(0, relativeTop - 16), behavior: "smooth" });
    }
    if (rightEl && translationCommentaryPaneRef.current) {
      const transEl = translationCommentaryPaneRef.current;
      const rightRect = rightEl.getBoundingClientRect();
      const parentRect = transEl.getBoundingClientRect();
      const relativeTop = rightRect.top - parentRect.top + transEl.scrollTop;
      transEl.scrollTo({ top: Math.max(0, relativeTop - 16), behavior: "smooth" });
    }
    if (unifiedEl) {
      unifiedEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      const prevVerse = currentVerses[currentVerseIndex - 1];
      syncToVerse(prevVerse.id);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < currentVerses.length - 1) {
      const nextVerse = currentVerses[currentVerseIndex + 1];
      syncToVerse(nextVerse.id);
    }
  };

  const [pulsingVerseId, setPulsingVerseId] = useState<string | null>(null);

  const handleSelectBookmark = (bookmark: VerseBookmark) => {
    if (bookmark.chapterId && bookmark.chapterId !== selectedChapterId) {
      setSelectedChapterId(bookmark.chapterId);
    }
    setTimeout(() => {
      syncToVerse(bookmark.verseId);
      setPulsingVerseId(bookmark.verseId);
      setTimeout(() => setPulsingVerseId(null), 4500);
    }, 200);
  };

  const activeFont = getActiveFontConfig();

  // Scroll to initial verse if provided and trigger pulse animation
  useEffect(() => {
    if (initialVerseId) {
      const scrollTimer = setTimeout(() => {
        syncToVerse(initialVerseId);
        setPulsingVerseId(initialVerseId);
      }, 250);
      const pulseTimer = setTimeout(() => {
        setPulsingVerseId(null);
      }, 4800);
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(pulseTimer);
      };
    }
  }, [initialVerseId]);

  const handleCopyVerse = (verse: GranthaVerse) => {
    const renderedMula = transliterate(verse.mulaSanskrit, activeLipi, "devanagari");
    const isCustomLipi = activeLipi !== "devanagari";
    const textToCopy = `=== ${grantha.title} (${grantha.transliteratedTitle}) — Verse ${verse.number}${verse.title ? `: ${verse.title}` : ""} ===
Author: ${grantha.author} | Sampradāya: ${grantha.school} | Century: ${grantha.century}

[Original Sanskrit Mūla (Devanāgarī)]
${verse.mulaSanskrit}
${isCustomLipi ? `\n[Mūla in ${currentLipiConfig.name} Lipi]\n${renderedMula}\n` : ""}
[IAST Transliteration]
${verse.mulaIast}

${verse.padaccheda ? `[Padaccheda (Word Division)]\n${verse.padaccheda}\n\n` : ""}${
      verse.bhashyaExtract ? `[Bhāṣya Extract / Commentary]\n${verse.bhashyaExtract}\n\n` : ""
    }[English Translation]
"${verse.englishTranslation}"

Academic Citation: vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenAnnotate = (
    verse: GranthaVerse,
    selectedText: string,
    field: "mula" | "iast" | "translation" | "bhashya" | "padaccheda" | "custom" = "mula",
    existingNote?: StudyNoteAnnotation | null
  ) => {
    setActiveAnnotateModal({
      isOpen: true,
      verse,
      selectedText,
      field,
      existingNote,
    });
  };

  const handleExportChapterPdf = async () => {
    if (!currentChapter) return;
    await exportTextReaderToPdf({
      grantha,
      chapter: currentChapter,
      notes: granthaNotes,
    });
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case "sm":
        return {
          mula: isFocused ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
          iast: isFocused ? "text-base sm:text-lg" : "text-sm",
          commentary: isFocused ? "text-sm sm:text-base" : "text-xs",
        };
      case "lg":
        return {
          mula: isFocused ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          iast: isFocused ? "text-xl sm:text-2xl" : "text-lg",
          commentary: isFocused ? "text-lg sm:text-xl" : "text-base",
        };
      case "xl":
        return {
          mula: isFocused ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
          iast: isFocused ? "text-2xl sm:text-3xl" : "text-xl",
          commentary: isFocused ? "text-xl sm:text-2xl" : "text-lg",
        };
      case "2xl":
        return {
          mula: isFocused ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl",
          iast: isFocused ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          commentary: isFocused ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        };
      case "base":
      default:
        return {
          mula: isFocused ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          iast: isFocused ? "text-lg sm:text-xl" : "text-base",
          commentary: isFocused ? "text-base sm:text-lg" : "text-sm",
        };
    }
  };

  const getMulaLineHeight = () => {
    if (isFocused) {
      switch (focusedLineSpacing) {
        case "spacious":
          return 2.2;
        case "expansive":
          return 2.65;
        case "airy":
        default:
          return 2.4;
      }
    }
    return lineHeight === "tight" ? 1.35 : lineHeight === "normal" ? 1.55 : lineHeight === "relaxed" ? 1.8 : 2.05;
  };

  const getMulaFontSize = () => {
    if (isFocused) {
      switch (fontSize) {
        case "sm":
          return "1.65rem";
        case "lg":
          return "2.35rem";
        case "xl":
          return "2.85rem";
        case "2xl":
          return "3.35rem";
        case "base":
        default:
          return "2.05rem";
      }
    }
    return fontSizeScale === "sm" ? "1.15rem" : fontSizeScale === "base" ? "1.45rem" : fontSizeScale === "lg" ? "1.8rem" : fontSizeScale === "xl" ? "2.25rem" : "2.6rem";
  };

  const fontClasses = getFontSizeClasses();

  // Filter verses if search query is active or onlyShowBookmarked is checked
  const filteredVerses = currentChapter?.verses?.filter((v) => {
    if (onlyShowBookmarked && !isVerseBookmarked(grantha.id, v.id)) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();

    if (inTextSearchScope === "only_verse_mantra") {
      // Strictly search within the sacred verse/mantra itself: Mūla Sanskrit, IAST, number, title, padaccheda, anvaya
      return (
        v.mulaSanskrit.toLowerCase().includes(q) ||
        v.mulaIast.toLowerCase().includes(q) ||
        (v.number && v.number.toLowerCase().includes(q)) ||
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.padaccheda && v.padaccheda.toLowerCase().includes(q)) ||
        (v.anvaya && v.anvaya.toLowerCase().includes(q))
      );
    }

    // "all" includes English translation and commentary extracts
    return (
      v.mulaSanskrit.toLowerCase().includes(q) ||
      v.mulaIast.toLowerCase().includes(q) ||
      v.englishTranslation.toLowerCase().includes(q) ||
      (v.title && v.title.toLowerCase().includes(q)) ||
      (v.number && v.number.toLowerCase().includes(q)) ||
      (v.commentaryNotes && v.commentaryNotes.toLowerCase().includes(q)) ||
      (v.bhashyaExtract && v.bhashyaExtract.toLowerCase().includes(q))
    );
  }) || [];

  // LocalStorage Recent Searches History for Spotlight Widget with Pinning Support
  const SPOTLIGHT_RECENT_SEARCHES_KEY = "vedantatattva_spotlight_recent_searches";

  interface SpotlightSearchHistoryItem {
    query: string;
    isPinned: boolean;
    timestamp: number;
  }

  const getSpotlightRecentSearches = (): SpotlightSearchHistoryItem[] => {
    try {
      const raw = localStorage.getItem(SPOTLIGHT_RECENT_SEARCHES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const normalized: SpotlightSearchHistoryItem[] = parsed.map((item, idx) => {
        if (typeof item === "string") {
          return {
            query: item.trim(),
            isPinned: false,
            timestamp: Date.now() - idx * 1000,
          };
        }
        return {
          query: String(item.query || "").trim(),
          isPinned: Boolean(item.isPinned),
          timestamp: Number(item.timestamp) || Date.now(),
        };
      }).filter((item) => item.query.length > 0);

      return normalized.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.timestamp - a.timestamp;
      });
    } catch {
      return [];
    }
  };

  const [recentSearches, setRecentSearches] = useState<SpotlightSearchHistoryItem[]>(getSpotlightRecentSearches);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const saveSpotlightRecentSearch = (query: string, pinStatus?: boolean) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    try {
      const current = getSpotlightRecentSearches();
      const existing = current.find((item) => item.query.toLowerCase() === trimmed.toLowerCase());
      const isPinned = pinStatus !== undefined ? pinStatus : existing ? existing.isPinned : false;
      const remaining = current.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
      const updated: SpotlightSearchHistoryItem[] = [
        { query: trimmed, isPinned, timestamp: Date.now() },
        ...remaining,
      ];
      const sorted = updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.timestamp - a.timestamp;
      }).slice(0, 10);
      localStorage.setItem(SPOTLIGHT_RECENT_SEARCHES_KEY, JSON.stringify(sorted));
      setRecentSearches(sorted);
    } catch {
      // ignore
    }
  };

  const togglePinRecentSearch = (queryToToggle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const current = getSpotlightRecentSearches();
      const updated = current.map((item) =>
        item.query.toLowerCase() === queryToToggle.toLowerCase()
          ? { ...item, isPinned: !item.isPinned }
          : item
      );
      const sorted = updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.timestamp - a.timestamp;
      });
      localStorage.setItem(SPOTLIGHT_RECENT_SEARCHES_KEY, JSON.stringify(sorted));
      setRecentSearches(sorted);
    } catch {
      // ignore
    }
  };

  const clearSpotlightRecentSearches = (clearAll: boolean = false) => {
    try {
      if (clearAll) {
        localStorage.removeItem(SPOTLIGHT_RECENT_SEARCHES_KEY);
        setRecentSearches([]);
      } else {
        const current = getSpotlightRecentSearches();
        const pinnedOnly = current.filter((item) => item.isPinned);
        localStorage.setItem(SPOTLIGHT_RECENT_SEARCHES_KEY, JSON.stringify(pinnedOnly));
        setRecentSearches(pinnedOnly);
      }
    } catch {
      // ignore
    }
  };

  const removeSingleRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const current = getSpotlightRecentSearches();
      const updated = current.filter((item) => item.query !== itemToRemove);
      localStorage.setItem(SPOTLIGHT_RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  // Subtle Overflow Indicators State
  const [coreOverflow, setCoreOverflow] = useState<{ top: boolean; bottom: boolean }>({ top: false, bottom: false });
  const [transOverflow, setTransOverflow] = useState<{ top: boolean; bottom: boolean }>({ top: false, bottom: false });

  const updateOverflowStates = () => {
    if (coreVersePaneRef.current) {
      const el = coreVersePaneRef.current;
      const canScrollUp = el.scrollTop > 8;
      const canScrollDown = el.scrollTop < el.scrollHeight - el.clientHeight - 8;
      setCoreOverflow({ top: canScrollUp, bottom: canScrollDown });
    }
    if (translationCommentaryPaneRef.current) {
      const el = translationCommentaryPaneRef.current;
      const canScrollUp = el.scrollTop > 8;
      const canScrollDown = el.scrollTop < el.scrollHeight - el.clientHeight - 8;
      setTransOverflow({ top: canScrollUp, bottom: canScrollDown });
    }
  };

  // Synchronized Scrolling Handlers with Scroll-Spy Progress Calculation
  const handleCoreScroll = () => {
    updateOverflowStates();
    if (coreVersePaneRef.current) {
      const el = coreVersePaneRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((el.scrollTop / maxScroll) * 100)));
        setScrollSpyPercent(pct);
      }
    }

    if (!isSyncScrollEnabled || !coreVersePaneRef.current || !translationCommentaryPaneRef.current) {
      return;
    }
    // If the translation pane is currently driving, do not echo back
    if (activeScrollSourceRef.current === "trans") {
      return;
    }

    activeScrollSourceRef.current = "core";
    clearTimeout(scrollLockTimerRef.current);
    scrollLockTimerRef.current = setTimeout(() => {
      activeScrollSourceRef.current = null;
    }, 100);

    const coreEl = coreVersePaneRef.current;
    const transEl = translationCommentaryPaneRef.current;
    const maxCore = coreEl.scrollHeight - coreEl.clientHeight;
    const maxTrans = transEl.scrollHeight - transEl.clientHeight;

    if (maxCore > 0 && maxTrans > 0) {
      const ratio = coreEl.scrollTop / maxCore;
      transEl.scrollTop = ratio * maxTrans;
    }
  };

  const handleTranslationScroll = () => {
    updateOverflowStates();
    if (translationCommentaryPaneRef.current) {
      const el = translationCommentaryPaneRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((el.scrollTop / maxScroll) * 100)));
        setScrollSpyPercent(pct);
      }
    }

    if (!isSyncScrollEnabled || !coreVersePaneRef.current || !translationCommentaryPaneRef.current) {
      return;
    }
    // If core pane is driving, do not echo back
    if (activeScrollSourceRef.current === "core") {
      return;
    }

    activeScrollSourceRef.current = "trans";
    clearTimeout(scrollLockTimerRef.current);
    scrollLockTimerRef.current = setTimeout(() => {
      activeScrollSourceRef.current = null;
    }, 100);

    const coreEl = coreVersePaneRef.current;
    const transEl = translationCommentaryPaneRef.current;
    const maxCore = coreEl.scrollHeight - coreEl.clientHeight;
    const maxTrans = transEl.scrollHeight - transEl.clientHeight;

    if (maxCore > 0 && maxTrans > 0) {
      const ratio = transEl.scrollTop / maxTrans;
      coreEl.scrollTop = ratio * maxCore;
    }
  };

  // Window scroll-spy for unified cards mode
  useEffect(() => {
    if (readerLayoutMode !== "unified_cards") return;
    const handleWinScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / totalH) * 100)));
        setScrollSpyPercent(pct);
      }
    };
    window.addEventListener("scroll", handleWinScroll, { passive: true });
    handleWinScroll();
    return () => window.removeEventListener("scroll", handleWinScroll);
  }, [readerLayoutMode, filteredVerses]);

  // Initial and reactive overflow state updates
  useEffect(() => {
    const timer = setTimeout(() => {
      updateOverflowStates();
    }, 120);
    return () => clearTimeout(timer);
  }, [filteredVerses, selectedVerseId, selectedChapterId, scriptMode, commentaryDepth, readerLayoutMode]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Dedicated Focused Reading Mode HUD (Distraction-Free Scriptural Study) */}
      {isFocused && (
        <div className="sticky top-2 z-40 bg-[#FFFDF8] border-2 border-[#bf953f]/70 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          {/* Scripture & Section Context */}
          <div className="flex items-center gap-3">
            <span className="p-2 bg-gradient-to-br from-[#aa771c] to-[#8c6011] text-[#FFFDF8] rounded-xl shadow-xs shrink-0">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider bg-[#FAF5ED] px-2 py-0.5 rounded-md border border-[#bf953f]/40">
                  Focused Reading Mode
                </span>
                <span className="text-xs font-serif font-black text-[#2D2319] line-clamp-1">
                  {grantha.transliteratedTitle}
                </span>
              </div>
              <div className="text-[11px] text-[#5c4731] font-serif">
                {currentChapter?.chapterTitleSanskrit} • v.{currentVerseIndex + 1} of {currentVerses.length} ({chapterProgressPercent}% read)
              </div>
            </div>
          </div>

          {/* Typography Controls (Enlarged Text & Line Spacing Suite) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Font Size Boost Controls */}
            <div className="flex items-center gap-1 bg-[#FAF5ED] border border-[#bf953f]/35 rounded-xl p-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-[#8c6011] px-1.5 uppercase">Size:</span>
              <button
                type="button"
                onClick={() => {
                  const sizes: FontSize[] = ["sm", "base", "lg", "xl", "2xl"];
                  const curIdx = sizes.indexOf(fontSize);
                  if (curIdx > 0) setFontSize(sizes[curIdx - 1]);
                }}
                disabled={fontSize === "sm"}
                className="w-7 h-7 rounded-lg bg-[#FFFDF8] hover:bg-[#FAF1E2] disabled:opacity-40 border border-[#bf953f]/30 text-xs font-bold text-[#735013] flex items-center justify-center cursor-pointer"
                title="Decrease scripture text size"
              >
                A-
              </button>
              <span className="text-xs font-mono font-bold text-[#8c6011] px-1.5 uppercase">
                {fontSize}
              </span>
              <button
                type="button"
                onClick={() => {
                  const sizes: FontSize[] = ["sm", "base", "lg", "xl", "2xl"];
                  const curIdx = sizes.indexOf(fontSize);
                  if (curIdx < sizes.length - 1) setFontSize(sizes[curIdx + 1]);
                }}
                disabled={fontSize === "2xl"}
                className="w-7 h-7 rounded-lg bg-[#FFFDF8] hover:bg-[#FAF1E2] disabled:opacity-40 border border-[#bf953f]/30 text-xs font-bold text-[#735013] flex items-center justify-center cursor-pointer"
                title="Increase scripture text size"
              >
                A+
              </button>
            </div>

            {/* Line Spacing Controls */}
            <div className="flex items-center gap-1 bg-[#FAF5ED] border border-[#bf953f]/35 rounded-xl p-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-[#8c6011] px-1.5 uppercase">Spacing:</span>
              <button
                type="button"
                onClick={() => setFocusedLineSpacing("spacious")}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  focusedLineSpacing === "spacious"
                    ? "bg-[#8c6011] text-white shadow-xs"
                    : "text-[#735013] hover:bg-[#FAF1E2]"
                }`}
                title="Spacious line height (2.2x)"
              >
                Spacious
              </button>
              <button
                type="button"
                onClick={() => setFocusedLineSpacing("airy")}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  focusedLineSpacing === "airy"
                    ? "bg-[#8c6011] text-white shadow-xs"
                    : "text-[#735013] hover:bg-[#FAF1E2]"
                }`}
                title="Airy line height (2.4x) — Optimal for scriptural contemplation"
              >
                Airy
              </button>
              <button
                type="button"
                onClick={() => setFocusedLineSpacing("expansive")}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  focusedLineSpacing === "expansive"
                    ? "bg-[#8c6011] text-white shadow-xs"
                    : "text-[#735013] hover:bg-[#FAF1E2]"
                }`}
                title="Expansive line height (2.65x)"
              >
                Expansive
              </button>
            </div>

            {/* Padaccheda & Anvaya Visibility Toggles */}
            <div className="flex items-center gap-1 bg-[#FAF5ED] border border-[#bf953f]/35 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={toggleShowPadaccheda}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  showPadaccheda
                    ? "bg-[#8c6011] text-white shadow-xs"
                    : "text-[#735013] hover:bg-[#FAF1E2]"
                }`}
                title="Toggle Padaccheda (Grammatical word division)"
              >
                {showPadaccheda ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Padaccheda</span>
              </button>
              <button
                type="button"
                onClick={toggleShowAnvaya}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  showAnvaya
                    ? "bg-[#8c6011] text-white shadow-xs"
                    : "text-[#735013] hover:bg-[#FAF1E2]"
                }`}
                title="Toggle Anvaya (Sanskrit prose order)"
              >
                {showAnvaya ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Anvaya</span>
              </button>
            </div>

            {/* Exit Focused Mode Button */}
            <button
              onClick={() => toggleFocusedMode(false)}
              type="button"
              className="px-3.5 py-1.5 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] text-xs font-bold font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
              title="Exit Focused Reading Mode (Esc)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focused Mode</span>
              <kbd className="hidden sm:inline text-[9px] bg-black/25 px-1.5 py-0.5 rounded">Esc</kbd>
            </button>
          </div>
        </div>
      )}

      {/* Compact Top Navigation & Focus Toggle Bar with Sticky Scroll-Spy Progress */}
      <div className="card-3d-gold p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30 bg-[#FFFDF8]/95 backdrop-blur-md relative overflow-hidden shadow-[0_6px_20px_rgba(180,130,20,0.12)]">
        {/* Pinned Real-Time Scroll-Spy Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#FAF1E2] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#aa771c] via-[#d4af37] to-[#8c6011] transition-all duration-150 ease-out shadow-xs"
            style={{ width: `${Math.max(2, scrollSpyPercent || chapterProgressPercent)}%` }}
            title={`Reading progress: ${scrollSpyPercent || chapterProgressPercent}%`}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#FAF1E2] border border-[#bf953f]/40 hover:border-[#bf953f] text-[#735013] hover:text-[#2D2319] font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8c6011]" />
            <span className="hidden sm:inline">Back to Catalog</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-base sm:text-lg text-[#2D2319] line-clamp-1">
                {grantha.transliteratedTitle}
              </h1>
              <span className="text-[11px] font-mono text-[#8c6011] bg-[#bf953f]/15 border border-[#bf953f]/30 px-2 py-0.5 rounded-full hidden md:inline-block">
                {grantha.school.split(" ")[0]}
              </span>
            </div>
            <div className="text-[11px] text-[#6e5842] font-serif">
              By {grantha.author} • {grantha.century}
            </div>
          </div>
        </div>

        {/* Action Controls Suite with Live Reading Progress Metric */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scroll-Spy Live Progress Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/40 text-xs font-mono text-[#8c6011] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span>{scrollSpyPercent || chapterProgressPercent}% Read</span>
            <span className="text-[#bf953f]/60">•</span>
            <span className="text-[#5c4731]">v.{currentVerseIndex + 1}/{currentVerses.length}</span>
          </div>
          {/* Quick Chapter Selector in Compact Header */}
          {chapters.length > 1 && (
            <select
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                const chap = chapters.find((c) => c.id === e.target.value);
                if (chap && chap.verses.length > 0) {
                  setSelectedVerseId(chap.verses[0].id);
                }
              }}
              className="px-2.5 py-1.5 bg-[#FFFDF8] border border-[#bf953f]/40 rounded-xl text-xs font-serif text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
            >
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {transliterate(chap.chapterTitleSanskrit, activeLipi)} ({chap.chapterTitle})
                </option>
              ))}
            </select>
          )}

          {/* Bookmarks Drawer Button */}
          <button
            type="button"
            onClick={() => setIsBookmarksDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FAF5ED] hover:bg-[#f3e5ce] text-[#8c6011] text-xs font-serif font-bold transition shadow-xs cursor-pointer"
            title="Open Bookmarked Verses & Passages"
          >
            <BookMarked className="w-3.5 h-3.5 text-[#8c6011]" />
            <span>Bookmarks</span>
            {granthaBookmarks.length > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {granthaBookmarks.length}
              </span>
            )}
          </button>

          {/* Study Notes & Highlights Drawer Button */}
          <button
            type="button"
            onClick={() => setIsStudyNotesDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FAF5ED] hover:bg-[#f3e5ce] text-[#8c6011] text-xs font-serif font-bold transition shadow-xs cursor-pointer"
            title="Open Saved Study Notes & Highlights"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#8c6011]" />
            <span>Study Notes</span>
            <span className="bg-[#8c6011] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
              {granthaNotes.length}
            </span>
          </button>

          {/* Academic PDF Export Button */}
          <AcademicPdfExportButton
            onExportPdf={handleExportChapterPdf}
            label="Export Academic PDF"
            variant="compact"
            title="Export this section as a formatted Indological PDF with Mūla, IAST, commentary, and study notes"
          />

          {/* Focused Reading Mode Button */}
          <button
            id="reader-focused-reading-mode-btn"
            onClick={() => toggleFocusedMode()}
            type="button"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
              isFocused
                ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] shadow-md ring-1 ring-[#bf953f]"
                : "bg-gradient-to-r from-[#FAF5ED] to-[#f5e6ce] hover:brightness-95 border-[#bf953f]/40 text-[#8c6011]"
            }`}
            title={
              isFocused
                ? "Exit Focused Reading Mode (Esc)"
                : "Enter Focused Reading Mode (Hides Header & Navigation, Increases Font & Line Spacing for Deep Scriptural Study)"
            }
          >
            <Eye className="w-3.5 h-3.5 text-[#8c6011]" />
            <span>{isFocused ? "Focused Active" : "Focused Reading Mode"}</span>
          </button>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setShowToolsSidebar((prev) => !prev)}
            type="button"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
              showToolsSidebar
                ? "bg-[#FFFDF8] border-[#bf953f]/40 hover:bg-[#FAF1E2] text-[#735013]"
                : "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] shadow-md ring-1 ring-[#bf953f]"
            }`}
            title={showToolsSidebar ? "Hide Tools Sidebar" : "Show Tools & Info Sidebar"}
          >
            {showToolsSidebar ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#8c6011]" />
                <span className="hidden md:inline">Hide Sidebar</span>
                <span className="md:hidden">Sidebar</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#120e0b]" />
                <span>Show Sidebar</span>
              </>
            )}
          </button>

          <CitationButton
            moduleName="Granthasāraṇī Inventory"
            title={`${grantha.title} (${grantha.transliteratedTitle})`}
            schools={[grantha.school]}
            analysisContent={`Author: ${grantha.author} (${grantha.century}). Foundational Root: ${grantha.foundationalText}. Summary: ${grantha.description}`}
          />
        </div>
      </div>

      {/* Main Reading Workspace */}
      <div className={`grid grid-cols-1 ${showToolsSidebar && !isFocused ? "lg:grid-cols-12" : "lg:grid-cols-1"} gap-6 items-start`}>
        {/* Texts and Verses Main Column */}
        <div className={`${showToolsSidebar && !isFocused ? "lg:col-span-8" : "lg:col-span-12"} space-y-5 transition-all duration-300 ${
          isFocused ? "max-w-5xl mx-auto w-full" : ""
        }`}>
          {/* Active Chapter Header & Reading Progress Indicator Banner */}
          <div className="card-3d-gold p-4 sm:p-5 bg-gradient-to-r from-[#FFFDF8] via-[#FAF4E8] to-[#FFFDF8] border-l-4 border-l-[#8c6011] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#8c6011] uppercase tracking-wider block">
                  Current Canonical Section:
                </span>
                <h2 className="font-serif font-black text-lg sm:text-xl text-[#2D2319]">
                  {currentChapter?.chapterTitleSanskrit}
                </h2>
                <div className="text-xs text-[#6e5842] font-serif mt-0.5">
                  {currentChapter?.chapterTitle}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#8c6011] bg-[#FAF5ED] px-2.5 py-1 rounded-lg border border-[#bf953f]/30 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span>Verse {currentVerseIndex + 1} of {currentVerses.length}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1">
                  <span>{chapterProgressPercent}% Complete</span>
                </span>
              </div>
            </div>

            {/* Visual Reading Progress Bar & Scrubber */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8c6011]">
                <div className="flex items-center gap-2">
                  <span className="font-bold flex items-center gap-1">
                    <Scroll className="w-3.5 h-3.5" /> Reading Progress:
                  </span>
                  <span>
                    {currentVerseIndex + 1}/{currentVerses.length} verses read
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevVerse}
                    disabled={currentVerseIndex <= 0}
                    className="p-1 rounded bg-[#FAF5ED] border border-[#bf953f]/30 text-[#8c6011] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3e5ce] transition cursor-pointer"
                    title="Previous Verse (Shift+Left)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVerse}
                    disabled={currentVerseIndex >= currentVerses.length - 1}
                    className="p-1 rounded bg-[#FAF5ED] border border-[#bf953f]/30 text-[#8c6011] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3e5ce] transition cursor-pointer"
                    title="Next Verse (Shift+Right)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-full bg-[#f3e8d6] rounded-full overflow-hidden border border-[#bf953f]/30 relative shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#aa771c] via-[#d4af37] to-[#fcf6ba] rounded-full transition-all duration-300 ease-out shadow-xs"
                  style={{ width: `${Math.max(4, chapterProgressPercent)}%` }}
                />
              </div>

              {/* Interactive Verse Quick Jump Ticks */}
              {currentVerses.length > 1 && (
                <div className="flex items-center gap-1 pt-1 overflow-x-auto pb-0.5">
                  <span className="text-[10px] font-mono text-[#8c6011]/80 shrink-0 mr-1">
                    Jump:
                  </span>
                  {currentVerses.map((v, i) => {
                    const isCurrent = v.id === selectedVerseId;
                    const isBookmarked = isVerseBookmarked(grantha.id, v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVerseId(v.id);
                          const el = document.getElementById(`verse-${v.id}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`h-5 min-w-5 px-1.5 rounded text-[10px] font-mono font-bold transition shrink-0 cursor-pointer flex items-center justify-center gap-0.5 ${
                          isCurrent
                            ? "bg-[#8c6011] text-white shadow-xs"
                            : isBookmarked
                            ? "bg-amber-100 text-amber-900 border border-amber-400"
                            : i <= currentVerseIndex
                            ? "bg-[#ebd9bd] text-[#735013] hover:bg-[#dfc8a5]"
                            : "bg-[#FAF5ED] text-[#9c8266] hover:bg-[#FAF1E2] border border-[#bf953f]/20"
                        }`}
                        title={`Jump to Verse ${v.number}${isBookmarked ? " (Bookmarked)" : ""}`}
                      >
                        {isBookmarked && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />}
                        <span>{v.number.replace(/[^0-9.]/g, "") || (i + 1)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Filter: Show Bookmarked Only Toggle */}
            {granthaBookmarks.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-[#bf953f]/20 text-xs">
                <button
                  type="button"
                  onClick={() => setOnlyShowBookmarked((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                    onlyShowBookmarked
                      ? "bg-amber-600 border-amber-700 text-white font-bold shadow-xs"
                      : "bg-[#FFFDF8] border-[#bf953f]/40 text-[#8c6011] hover:bg-[#FAF1E2]"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${onlyShowBookmarked ? "fill-white text-white" : "text-[#8c6011]"}`} />
                  <span>{onlyShowBookmarked ? "Showing Bookmarked Only" : "Filter Bookmarked Verses"}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${onlyShowBookmarked ? "bg-white/20 text-white" : "bg-[#8c6011] text-white"}`}>
                    {granthaBookmarks.length}
                  </span>
                </button>
                {onlyShowBookmarked && (
                  <button
                    type="button"
                    onClick={() => setOnlyShowBookmarked(false)}
                    className="text-xs text-[#8c6011] underline hover:text-[#2D2319] cursor-pointer"
                  >
                    Show all verses
                  </button>
                )}
              </div>
            )}

            {currentChapter?.summary && (
              <p className="text-xs text-[#5c4731] mt-2 pt-2 border-t border-[#bf953f]/20 font-serif leading-relaxed">
                {currentChapter.summary}
              </p>
            )}
          </div>

          {/* Unified Exegetical Reader Space (Main text, Word splits, Prose order & Commentaries together) */}
          <div id="unified-reader-widget" className="space-y-4">
            {/* Unified Exegetical Reader Control Bar */}
            <div className="card-3d-gold p-3.5 sm:p-4 bg-gradient-to-r from-[#FFFDF8] via-[#FAF4E8] to-[#FFFDF8] border-l-4 border-l-[#8c6011] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border border-[#ffe680] text-[#120e0b] shadow-xs">
                    <Layers className="w-4 h-4 text-[#120e0b]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-black text-sm sm:text-base text-[#2D2319]">
                        Unified Exegetical Reader
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-[#FAF5ED] border border-[#bf953f]/40 text-[#8c6011] px-2 py-0.5 rounded-full">
                        एकीकृत-वेदान्त-पाठः
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6e5842] font-serif">
                      Continuous layout: Root verse, word breakdown, prose order, translation, and multi-sampradāya commentaries unified together.
                    </p>
                  </div>
                </div>

                {/* Exegetical Layer Visibility Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Padaccheda Visibility Toggle */}
                  <button
                    type="button"
                    onClick={toggleShowPadaccheda}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                      showPadaccheda
                        ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b]"
                        : "bg-[#FAF5ED] border-[#bf953f]/40 text-[#6e5842] hover:bg-[#ebd9bd]"
                    }`}
                    title={showPadaccheda ? "Click to hide Padaccheda (पदच्छेदः)" : "Click to show Padaccheda (पदच्छेदः)"}
                  >
                    {showPadaccheda ? <Eye className="w-3.5 h-3.5 text-[#120e0b]" /> : <EyeOff className="w-3.5 h-3.5 text-[#6e5842]" />}
                    <span>Padaccheda: {showPadaccheda ? "Shown" : "Hidden"}</span>
                  </button>

                  {/* Anvaya Visibility Toggle */}
                  <button
                    type="button"
                    onClick={toggleShowAnvaya}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                      showAnvaya
                        ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b]"
                        : "bg-[#FAF5ED] border-[#bf953f]/40 text-[#6e5842] hover:bg-[#ebd9bd]"
                    }`}
                    title={showAnvaya ? "Click to hide Anvaya (अन्वयः)" : "Click to show Anvaya (अन्वयः)"}
                  >
                    {showAnvaya ? <Eye className="w-3.5 h-3.5 text-[#120e0b]" /> : <EyeOff className="w-3.5 h-3.5 text-[#6e5842]" />}
                    <span>Anvaya: {showAnvaya ? "Shown" : "Hidden"}</span>
                  </button>
                </div>
              </div>

              {/* Spotlight In-Widget Search Bar with Search Scope Selector & LocalStorage Recent Searches History */}
              <div className="pt-2.5 border-t border-[#bf953f]/25 space-y-2">
                {/* Search Scope Filter Buttons */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
                      <Filter className="w-3 h-3 text-[#8c6011]" />
                      <span>Search Scope:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setInTextSearchScope("all")}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                        inTextSearchScope === "all"
                          ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                          : "bg-[#FAF5ED] text-[#6e5842] border border-[#bf953f]/30 hover:bg-[#ebd9bd]"
                      }`}
                    >
                      All Content
                    </button>
                    <button
                      type="button"
                      onClick={() => setInTextSearchScope("only_verse_mantra")}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                        inTextSearchScope === "only_verse_mantra"
                          ? "bg-emerald-100 text-emerald-950 border-2 border-emerald-500 ring-1 ring-emerald-400/60 shadow-xs"
                          : "bg-[#FAF5ED] text-[#6e5842] border border-[#bf953f]/30 hover:bg-[#ebd9bd]"
                      }`}
                    >
                      <span>Only Verses & Mantras</span>
                      <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1 py-0.2 rounded font-mono">
                        Mūla & IAST
                      </span>
                    </button>
                  </div>

                  {inTextSearchScope === "only_verse_mantra" && (
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Excludes commentaries & translations
                    </span>
                  )}
                </div>

                <div className="relative flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6011]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => {
                        setTimeout(() => setIsSearchFocused(false), 240);
                      }}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveSpotlightRecentSearch(searchQuery);
                          setIsSearchFocused(false);
                        }
                      }}
                      placeholder={
                        inTextSearchScope === "only_verse_mantra"
                          ? "Search ONLY sacred Sanskrit verses & mantras in Mūla or IAST..."
                          : "Search Sanskrit verses, IAST transliteration, terms, or English commentary..."
                      }
                      className="w-full pl-9 pr-9 py-2 bg-[#FFFDF9] border border-[#bf953f]/40 focus:border-[#bf953f] rounded-xl text-xs sm:text-sm text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-2 focus:ring-[#bf953f]/40 shadow-2xs font-serif transition"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c6011] hover:text-[#2D2319] font-bold p-1 cursor-pointer"
                        title="Clear query"
                      >
                        ✕
                      </button>
                    )}

                  {/* Recent Searches Dropdown with Pinning & Clear History */}
                  {isSearchFocused && recentSearches.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-[#FFFDF8] border-2 border-[#bf953f]/70 rounded-xl shadow-[0_12px_32px_rgba(140,96,17,0.22)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2 bg-[#FAF5ED] border-b border-[#bf953f]/30 flex items-center justify-between text-[11px] font-mono text-[#8c6011] font-bold">
                        <span className="flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-[#8c6011]" />
                          <span>Search History ({recentSearches.length})</span>
                          {recentSearches.some((s) => s.isPinned) && (
                            <span className="text-[10px] bg-[#bf953f]/20 text-[#8c6011] px-1.5 py-0.2 rounded font-mono">
                              {recentSearches.filter((s) => s.isPinned).length} pinned
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              clearSpotlightRecentSearches(false);
                            }}
                            className="text-[10px] text-[#9c8266] hover:text-[#8c6011] hover:underline cursor-pointer"
                            title="Clear unpinned recent search queries"
                          >
                            Clear Recent
                          </button>
                          <span className="text-[#bf953f]/40">•</span>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              clearSpotlightRecentSearches(true);
                            }}
                            className="text-[10px] text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                            title="Clear all search history including pinned"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      <div className="py-1 max-h-56 overflow-y-auto divide-y divide-[#bf953f]/15">
                        {recentSearches.map((item, idx) => (
                          <div
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchQuery(item.query);
                              saveSpotlightRecentSearch(item.query);
                              setIsSearchFocused(false);
                            }}
                            className={`px-3.5 py-2 hover:bg-[#FAF1E2] text-xs font-serif text-[#2D2319] flex items-center justify-between group cursor-pointer transition-colors ${
                              item.isPinned ? "bg-[#FFFDF3]" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  togglePinRecentSearch(item.query, e);
                                }}
                                className={`p-1 rounded transition cursor-pointer ${
                                  item.isPinned
                                    ? "text-[#c59b27] hover:text-[#8c6011] bg-amber-50"
                                    : "text-[#bf953f]/50 opacity-40 group-hover:opacity-100 hover:text-[#8c6011]"
                                }`}
                                title={item.isPinned ? "Unpin query from top" : "Pin query to top of history"}
                              >
                                <Pin className={`w-3.5 h-3.5 ${item.isPinned ? "fill-[#c59b27] text-[#8c6011]" : ""}`} />
                              </button>
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="truncate font-medium">{item.query}</span>
                                {item.isPinned && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100/90 text-amber-900 border border-amber-300 shrink-0 font-bold">
                                    Pinned
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  removeSingleRecentSearch(item.query, e);
                                }}
                                className="p-1 text-[#9c8266] hover:text-amber-800 rounded transition cursor-pointer"
                                title="Remove query from history"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Active search filter badge & Pin / Save query button */}
                {searchQuery.trim() && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-mono text-[#8c6011] bg-[#FAF5ED] px-2.5 py-1 rounded-lg border border-[#bf953f]/30 font-bold shadow-2xs">
                      {filteredVerses.length} {filteredVerses.length === 1 ? "verse" : "verses"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        saveSpotlightRecentSearch(searchQuery, true);
                      }}
                      className="px-2 py-1 bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-mono text-[#8c6011] rounded-lg flex items-center gap-1 transition cursor-pointer"
                      title="Pin this search term to the top of Recent Searches"
                    >
                      <Pin className="w-3 h-3 fill-[#c59b27] text-[#8c6011]" />
                      <span>Pin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        saveSpotlightRecentSearch(searchQuery);
                      }}
                      className="text-xs font-mono text-[#735013] hover:text-[#2D2319] underline cursor-pointer px-1 py-0.5"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Verses & Bhāṣya List */}
            {filteredVerses.length === 0 ? (
              <div className="card-3d-gold p-8 text-center text-[#6e5842]">
                <BookOpen className="w-8 h-8 text-[#8c6011] mx-auto mb-2 opacity-60" />
                <p className="font-serif">No verses matching "{searchQuery}" in this chapter.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs text-[#8c6011] font-bold hover:underline cursor-pointer"
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              /* CONTINUOUS UNIFIED CARDS VIEW (Main text, Padaccheda, Anvaya, Translation & Commentaries together) */
              <div className="space-y-5">
                {filteredVerses.map((verse) => {
                  const isSelected = verse.id === selectedVerseId;
                  const isPulsing = verse.id === pulsingVerseId;
                  const verseAnnotations = granthaNotes.filter((n) => n.verseId === verse.id);

                  const isPadacchedaVisible = versePadacchedaOverrides[verse.id] !== undefined
                    ? versePadacchedaOverrides[verse.id]
                    : showPadaccheda;

                  const isAnvayaVisible = verseAnvayaOverrides[verse.id] !== undefined
                    ? verseAnvayaOverrides[verse.id]
                    : showAnvaya;

                  return (
                    <article
                      key={verse.id}
                      id={`verse-${verse.id}`}
                      onClick={() => syncToVerse(verse.id)}
                      className={`card-3d-gold p-6 sm:p-7 space-y-5 relative transition-all duration-300 ${
                        isPulsing
                          ? "ring-4 ring-[#c59b27] border-[#8c6011] bg-gradient-to-r from-[#FFF8E7] via-[#FFFDF5] to-[#FFF8E7] shadow-[0_0_35px_rgba(197,155,39,0.6)] animate-pulse"
                          : isSelected
                          ? "ring-2 ring-[#bf953f] shadow-[0_10px_30px_rgba(140,96,17,0.18)]"
                          : "hover:border-[#bf953f]"
                      }`}
                    >
                      {/* Verse Head Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/25 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-[#8c6011] text-[#FFFDF8] text-xs font-mono font-bold">
                            {verse.number}
                          </span>
                          {verse.title && (
                            <h2 className="font-serif font-bold text-sm sm:text-base text-[#2D2319]">
                              {verse.title}
                            </h2>
                          )}
                          {isPulsing && (
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold shadow-xs animate-pulse">
                              ✦ Jumped to Verse
                            </span>
                          )}
                        </div>

                        {/* Action Suite for this Verse */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Vedic Chanting Audio Synthesis */}
                          <VedicChantButton
                            verseText={verse.mulaSanskrit}
                            variant="badge"
                          />

                          {/* Bookmark Verse Action Button */}
                          <button
                            onClick={(e) => handleToggleBookmark(verse, e)}
                            type="button"
                            className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1 transition cursor-pointer shadow-xs ${
                              isVerseBookmarked(grantha.id, verse.id)
                                ? "bg-amber-100/90 border-amber-400 text-amber-950 font-bold"
                                : "bg-[#FFFDF8] hover:bg-[#FAF1E2] border-[#bf953f]/30 text-[#735013]"
                            }`}
                            title={
                              isVerseBookmarked(grantha.id, verse.id)
                                ? "Bookmarked (Click to remove)"
                                : "Bookmark verse for later review"
                            }
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isVerseBookmarked(grantha.id, verse.id)
                                  ? "fill-amber-600 text-amber-700"
                                  : "text-[#8c6011]"
                              }`}
                            />
                            <span className="hidden sm:inline">
                              {isVerseBookmarked(grantha.id, verse.id)
                                ? "Bookmarked"
                                : "Bookmark"}
                            </span>
                          </button>

                          {/* Highlight & Annotate Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAnnotate(verse, verse.mulaSanskrit, "mula");
                            }}
                            type="button"
                            className="px-2.5 py-1 text-xs rounded-lg border border-amber-400/80 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium flex items-center gap-1 transition cursor-pointer shadow-xs"
                            title="Highlight passage & save study annotation to local notes"
                          >
                            <Highlighter className="w-3.5 h-3.5 text-amber-700" />
                            <span className="hidden sm:inline">Highlight & Annotate</span>
                            <span className="sm:hidden">Annotate</span>
                          </button>

                          {/* Academic Share Bar with WhatsApp, FB, X, Copy Link */}
                          <WorkspaceShareBar
                            shareData={{
                              title: `${grantha.title} — ${verse.number}${verse.title ? ` (${verse.title})` : ""}`,
                              subtitle: `${grantha.author} • ${grantha.school}`,
                              sanskritText: verse.mulaSanskrit,
                              translation: verse.englishTranslation,
                              sourceText: `${grantha.title} ${verse.number}`,
                              authorOrSchool: `${grantha.author} (${grantha.school})`,
                              type: "verse",
                              url: typeof window !== "undefined" ? `${window.location.origin}/#mapping?text=${grantha.id}&verse=${verse.id}` : undefined,
                            }}
                            variant="inline"
                          />

                          {/* Copy verse & translation */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyVerse(verse);
                            }}
                            type="button"
                            className="px-2.5 py-1 text-xs rounded-lg border border-[#bf953f]/40 bg-[#FAF5ED] hover:bg-[#FAF1E2] text-[#735013] hover:text-[#2D2319] font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            title="Copy Sanskrit Mūla and translation for academic citation"
                          >
                            {copiedId === verse.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span className="text-emerald-800 font-bold">Copied Citation!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#8c6011]" />
                                <span className="hidden sm:inline">Copy Citation</span>
                                <span className="sm:hidden">Copy</span>
                              </>
                            )}
                          </button>

                          {onNavigateToTab && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToTab("comparative", {
                                    verseOrSutra: `${verse.mulaSanskrit}\n(${grantha.title} ${verse.number})`,
                                  });
                                }}
                                type="button"
                                className="px-2.5 py-1 text-xs rounded-lg border border-[#bf953f]/30 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] font-medium flex items-center gap-1 transition cursor-pointer shadow-sm"
                                title="Compare verse across Sampradāyas"
                              >
                                <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
                                <span className="hidden sm:inline">Compare</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToTab("translation", {
                                    text: verse.mulaSanskrit,
                                    context: `${grantha.title} (${grantha.author}) - ${verse.number}`,
                                  });
                                }}
                                type="button"
                                className="px-2.5 py-1 text-xs rounded-lg border border-[#bf953f]/30 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] font-medium flex items-center gap-1 transition cursor-pointer shadow-sm"
                                title="Analyze in Precision Translation"
                              >
                                <Languages className="w-3.5 h-3.5 text-[#8c6011]" />
                                <span className="hidden sm:inline">Translate</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToTab("qa", {
                                    prompt: `Explain the philosophical significance and traditional commentaries on this passage from ${grantha.title} (${grantha.author}):\n\n"${verse.mulaSanskrit}"`,
                                  });
                                }}
                                type="button"
                                className="px-2.5 py-1 text-xs rounded-lg border border-[#bf953f]/30 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] font-medium flex items-center gap-1 transition cursor-pointer shadow-sm"
                                title="Ask Scholarly Counsel"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-[#8c6011]" />
                                <span className="hidden sm:inline">Inquire</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Sanskrit Mūla & Bharatiya Lipi Display */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF4E8] via-[#FFFDF9] to-[#FAF4E8] border border-[#bf953f]/35 space-y-3 shadow-inner group/mula relative">
                        {/* Primary Text in chosen Bharatiya Lipi / Devanagari */}
                        <div
                          className="text-[#8c6011] leading-relaxed whitespace-pre-wrap transition-all select-text"
                          style={{
                            fontFamily: activeFont.family,
                            fontSize: isFocused ? getMulaFontSize() : (fontSizeScale === "sm" ? "1.15rem" : fontSizeScale === "base" ? "1.45rem" : fontSizeScale === "lg" ? "1.8rem" : fontSizeScale === "xl" ? "2.25rem" : "2.6rem"),
                            fontWeight: fontWeight === "normal" ? 500 : fontWeight === "medium" ? 600 : fontWeight === "semibold" ? 700 : 900,
                            lineHeight: isFocused ? getMulaLineHeight() : (lineHeight === "tight" ? 1.35 : lineHeight === "normal" ? 1.55 : lineHeight === "relaxed" ? 1.8 : 2.05),
                            letterSpacing: letterSpacing === "normal" ? "normal" : letterSpacing === "wide" ? "0.025em" : "0.05em"
                          }}
                        >
                          {activeLipi === "devanagari" 
                            ? verse.mulaSanskrit 
                            : transliterate(verse.mulaSanskrit, activeLipi, "devanagari")}
                        </div>

                        {/* Secondary Original Devanagari (if dual-script is active and current script is not Devanagari) */}
                        {(showDualScript || scriptMode === "both") && activeLipi !== "devanagari" && (
                          <div className="pt-2 border-t border-[#bf953f]/20">
                            <span className="text-[10px] font-mono text-[#8c6011] block mb-0.5">
                              Original Devanāgarī (मूल-देवनागरी):
                            </span>
                            <div
                              className="text-[#4a3928] font-devanagari leading-relaxed whitespace-pre-wrap text-base"
                              style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                            >
                              {verse.mulaSanskrit}
                            </div>
                          </div>
                        )}

                        {/* IAST Transliteration */}
                        {(scriptMode === "iast" || scriptMode === "both" || activeLipi === "iast") && (
                          <div
                            className={`font-serif italic text-[#4a3928] leading-relaxed whitespace-pre-wrap ${fontClasses.iast}`}
                          >
                            {verse.mulaIast}
                          </div>
                        )}
                      </div>

                      {/* Padaccheda (Word-by-word grammatical separation) */}
                      {verse.padaccheda && (
                        isPadacchedaVisible ? (
                          <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/25 space-y-1 relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider font-mono block">
                                Padaccheda (पदच्छेदः — Grammatical Word Split):
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVersePadaccheda(verse.id);
                                }}
                                className="text-[11px] font-mono text-[#8c6011] hover:text-[#2D2319] flex items-center gap-1 cursor-pointer transition"
                                title="Hide Padaccheda for this verse"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>Hide</span>
                              </button>
                            </div>
                            <p className={`font-serif text-[#3d2f21] ${fontClasses.commentary} leading-relaxed`}>
                              {transliterate(verse.padaccheda, activeLipi)}
                            </p>
                          </div>
                        ) : (
                          <div className="pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVersePadaccheda(verse.id);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-xs font-mono text-[#8c6011] transition cursor-pointer"
                              title="Show Padaccheda for this verse"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Show Padaccheda (पदच्छेदः)</span>
                            </button>
                          </div>
                        )
                      )}

                      {/* Anvaya (Syntactic prose order) */}
                      {verse.anvaya && (
                        isAnvayaVisible ? (
                          <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/25 space-y-1 relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider font-mono block">
                                Anvaya (अन्वयः — Sanskrit Prose Order):
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVerseAnvaya(verse.id);
                                }}
                                className="text-[11px] font-mono text-[#8c6011] hover:text-[#2D2319] flex items-center gap-1 cursor-pointer transition"
                                title="Hide Anvaya for this verse"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>Hide</span>
                              </button>
                            </div>
                            <p className={`font-serif text-[#3d2f21] ${fontClasses.commentary} leading-relaxed`}>
                              {transliterate(verse.anvaya, activeLipi)}
                            </p>
                          </div>
                        ) : (
                          <div className="pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVerseAnvaya(verse.id);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-xs font-mono text-[#8c6011] transition cursor-pointer"
                              title="Show Anvaya for this verse"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Show Anvaya (अन्वयः)</span>
                            </button>
                          </div>
                        )
                      )}

                      {/* English Precision Translation */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider font-mono block">
                          Scholarly English Exegesis & Translation:
                        </span>
                        <p 
                          className={`font-serif text-[#2D2319] ${fontClasses.commentary}`}
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
                          {verse.englishTranslation}
                        </p>
                      </div>

                      {/* Classical Bhāṣya Commentaries & Ṭīkās (Multi-Selection Dropdown & Display together below verse) */}
                      <BhashyaTikaSelector
                        verse={verse}
                        granthaId={grantha.id}
                        isFocused={isFocused}
                        focusedLineSpacing={focusedLineSpacing}
                        onAnnotate={handleOpenAnnotate}
                      />

                      {/* Display User Highlights & Annotations for this Verse */}
                      {verseAnnotations.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-[#bf953f]/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
                              <Bookmark className="w-3 h-3 text-[#8c6011]" />
                              Saved Study Annotations ({verseAnnotations.length}):
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsStudyNotesDrawerOpen(true)}
                              className="text-[11px] font-mono font-bold text-[#8c6011] hover:underline"
                            >
                              View in Study Journal →
                            </button>
                          </div>

                          <div className="space-y-2">
                            {verseAnnotations.map((ann) => {
                              const colConf = HIGHLIGHT_COLOR_CONFIG[ann.color] || HIGHLIGHT_COLOR_CONFIG.gold;
                              return (
                                <div
                                  key={ann.id}
                                  className={`p-3 rounded-xl border ${colConf.bgClass} ${colConf.borderClass} space-y-1.5 transition-all`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block"
                                        style={{ backgroundColor: colConf.hex }}
                                      />
                                      <span className="text-[10px] font-mono uppercase font-bold text-[#120e0b]">
                                        [{ann.field.toUpperCase()}] Highlight
                                      </span>
                                      {ann.tags && ann.tags.length > 0 && (
                                        <div className="flex gap-1 ml-1">
                                          {ann.tags.map((t) => (
                                            <span
                                              key={t}
                                              className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/70 text-[#4a3928] border border-black/10"
                                            >
                                              #{t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenAnnotate(verse, ann.selectedText, ann.field, ann)}
                                        className="p-1 rounded text-[#8c6011] hover:bg-white/60 transition cursor-pointer"
                                        title="Edit Note"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm("Delete this annotation?")) {
                                            deleteStudyNote(ann.id);
                                            setNotesVersion((v) => v + 1);
                                          }
                                        }}
                                        className="p-1 rounded text-red-700 hover:bg-white/60 transition cursor-pointer"
                                        title="Delete Note"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="font-serif text-xs font-medium text-[#120e0b] italic leading-relaxed">
                                    "{ann.selectedText}"
                                  </div>

                                  {ann.note && (
                                    <div className="text-xs font-serif text-[#2D2319] bg-white/80 p-2 rounded-lg border border-black/5 leading-relaxed">
                                      <strong>Note:</strong> {ann.note}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR: Script controls, Commentary Depth, Search, Chapters index, & Text Info */}
        {showToolsSidebar && !isFocused && (
          <aside className="lg:col-span-4 space-y-4 animate-in slide-in-from-right-4 duration-200">
            {/* 1. Reader Controls & Script Selection */}
            <div className="card-3d-gold p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#bf953f]/20">
                <h3 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Exegetical Controls:
                </h3>
                <button
                  onClick={() => setShowToolsSidebar(false)}
                  className="text-xs text-[#6e5842] hover:text-[#2D2319] flex items-center gap-1 font-sans cursor-pointer"
                  title="Hide sidebar to focus on text"
                >
                  <PanelRightClose className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span>Hide</span>
                </button>
              </div>

              {/* Bharatiya Lipi & Font Changer Control */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FAF4E8] to-[#FFFDF8] border border-[#bf953f]/35 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" /> Lipi & Font Family:
                  </span>
                  <span className="text-[10px] font-mono text-[#8c6011] bg-[#bf953f]/15 px-2 py-0.5 rounded-full font-bold">
                    {currentLipiConfig.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-serif text-[#2D2319]">
                    Font: <strong>{activeFont.name}</strong>
                  </div>
                  <BharatiyaLipiSwitcher
                    onOpenFacility={() => onNavigateToTab?.("bharatiya_lipi")}
                  />
                </div>
              </div>

              {/* Script Mode Selection */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Display Format:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs">
                  {(
                    [
                      { id: "active_lipi", label: `${currentLipiConfig.nativeName.split(" ")[0]}` },
                      { id: "both", label: "Dual-Script" },
                      { id: "iast", label: "IAST Roman" },
                    ] as { id: ScriptMode; label: string }[]
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setScriptMode(mode.id)}
                      className={`px-2 py-1.5 rounded-lg border text-center font-medium transition cursor-pointer text-xs truncate ${
                        scriptMode === mode.id
                          ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] font-bold shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF3E6]"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commentary View Depth */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Commentary Depth:
                </span>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {(
                    [
                      { id: "full", label: "Full Exegesis" },
                      { id: "bhashya", label: "Mūla + Bhāṣya" },
                      { id: "padaccheda", label: "Padaccheda" },
                      { id: "mula", label: "Mūla Only" },
                    ] as { id: CommentaryDepth; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCommentaryDepth(opt.id)}
                      className={`px-2 py-1.5 rounded-lg border text-center font-medium transition cursor-pointer text-xs ${
                        commentaryDepth === opt.id
                          ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] font-bold shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF3E6]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size Slider */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#8c6011] uppercase tracking-wider font-mono block">
                  Text Scale:
                </span>
                <div className="flex gap-1.5">
                  {(["sm", "base", "lg", "xl"] as FontSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1 rounded-lg border text-center font-serif text-xs transition cursor-pointer ${
                        fontSize === sz
                          ? "bg-[#8c6011] border-[#735013] text-[#FFFDF8] font-bold shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF3E6]"
                      }`}
                    >
                      {sz === "sm" ? "Compact" : sz === "base" ? "Standard" : sz === "lg" ? "Large" : "Extra"}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Text Search */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#8c6011]">
                  <span>Scope:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setInTextSearchScope("all")}
                      className={`px-1.5 py-0.5 rounded text-[9px] transition cursor-pointer ${
                        inTextSearchScope === "all"
                          ? "bg-[#8c6011] text-[#FFFDF8]"
                          : "text-[#6e5842] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setInTextSearchScope("only_verse_mantra")}
                      className={`px-1.5 py-0.5 rounded text-[9px] transition cursor-pointer ${
                        inTextSearchScope === "only_verse_mantra"
                          ? "bg-emerald-700 text-white"
                          : "text-[#6e5842] hover:bg-[#FAF1E2]"
                      }`}
                      title="Only sacred verses & mantras (Mūla Sanskrit & IAST)"
                    >
                      Verses Only
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c6011]" />
                  <input
                    type="text"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FFFDF9] border border-[#bf953f]/40 rounded-xl text-xs text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                    placeholder={
                      inTextSearchScope === "only_verse_mantra"
                        ? "Search verses/mantras only..."
                        : "Search words in text..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8c6011] font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Text Information & Dialectical Metadata */}
            <div className="card-3d-gold p-4 space-y-3 bg-gradient-to-br from-[#FFFDF8] to-[#FAF4E8]">
              <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Text Dossier:
              </h4>

              <div className="text-xs space-y-2 font-serif">
                <div className="flex justify-between border-b border-[#bf953f]/15 pb-1">
                  <span className="text-[#6e5842]">Author:</span>
                  <strong className="text-[#2D2319]">{grantha.author}</strong>
                </div>
                <div className="flex justify-between border-b border-[#bf953f]/15 pb-1">
                  <span className="text-[#6e5842]">Sampradāya:</span>
                  <strong className="text-[#8c6011]">{grantha.school}</strong>
                </div>
                <div className="flex justify-between border-b border-[#bf953f]/15 pb-1">
                  <span className="text-[#6e5842]">Era / Century:</span>
                  <strong className="text-[#2D2319]">{grantha.century}</strong>
                </div>
                <div className="flex justify-between border-b border-[#bf953f]/15 pb-1">
                  <span className="text-[#6e5842]">Foundational Base:</span>
                  <strong className="text-[#2D2319]">{grantha.foundationalText}</strong>
                </div>
              </div>

              <p className="text-xs text-[#5c4731] leading-relaxed pt-1">
                {grantha.description}
              </p>

              {/* Refutations and Support pills */}
              <div className="space-y-2 pt-2 border-t border-[#bf953f]/20 text-[11px]">
                <div className="bg-red-50/90 border border-red-200/80 p-2.5 rounded-lg">
                  <strong className="font-mono text-red-900 block text-[10px] uppercase">
                    Refutes (Pūrvapakṣa):
                  </strong>
                  <span className="text-red-950 font-serif leading-snug">{grantha.refutationsDet}</span>
                </div>
                <div className="bg-emerald-50/90 border border-emerald-200/80 p-2.5 rounded-lg">
                  <strong className="font-mono text-emerald-900 block text-[10px] uppercase">
                    Upholds (Siddhānta):
                  </strong>
                  <span className="text-emerald-950 font-serif leading-snug">{grantha.supportsDet}</span>
                </div>
              </div>
            </div>

            {/* 3. Chapters and Verses Index */}
            <div className="card-3d-gold p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Chapter Index:
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {chapters.map((chap) => {
                  const isActive = chap.id === currentChapter?.id;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setSelectedChapterId(chap.id);
                        if (chap.verses.length > 0) {
                          setSelectedVerseId(chap.verses[0].id);
                        }
                      }}
                      type="button"
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] font-bold shadow-sm"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#2D2319] hover:bg-[#FAF3E6]"
                      }`}
                    >
                      <div className="text-xs font-serif font-black">{chap.chapterTitleSanskrit}</div>
                      <div className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? "text-[#261c10]" : "text-[#6e5842]"}`}>
                        {chap.chapterTitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Verse Pills Index */}
              <div className="pt-2 border-t border-[#bf953f]/20">
                <span className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider font-mono block mb-1.5">
                  Verses in this Section:
                </span>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
                  {currentChapter?.verses?.map((v) => {
                    const isSelected = v.id === selectedVerseId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVerseId(v.id);
                          const el = document.getElementById(`verse-${v.id}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        type="button"
                        className={`px-2 py-0.5 text-xs rounded-md border font-mono transition cursor-pointer ${
                          isSelected
                            ? "bg-[#8c6011] border-[#735013] text-[#FFFDF8] font-bold shadow-sm"
                            : "bg-[#FFFDF8] border-[#bf953f]/30 text-[#5c4731] hover:bg-[#FAF3E6]"
                        }`}
                      >
                        {v.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Annotate & Study Notes Modal */}
      {activeAnnotateModal && (
        <AnnotateModal
          isOpen={activeAnnotateModal.isOpen}
          onClose={() => setActiveAnnotateModal(null)}
          textId={grantha.id}
          textTitle={grantha.title}
          chapterId={currentChapter.id}
          chapterTitle={currentChapter.chapterTitle}
          verseId={activeAnnotateModal.verse.id}
          verseNumber={activeAnnotateModal.verse.number}
          verseTitle={activeAnnotateModal.verse.title}
          initialSelectedText={activeAnnotateModal.selectedText}
          initialField={activeAnnotateModal.field}
          existingNote={activeAnnotateModal.existingNote}
          onSaved={() => {
            setNotesVersion((v) => v + 1);
          }}
          onDelete={(id) => {
            deleteStudyNote(id);
            setNotesVersion((v) => v + 1);
          }}
        />
      )}

      {/* Study Notes Full Drawer */}
      <StudyNotesDrawer
        isOpen={isStudyNotesDrawerOpen}
        onClose={() => setIsStudyNotesDrawerOpen(false)}
        currentTextId={grantha.id}
        onNavigateToVerse={(textId, chapterId, verseId) => {
          setSelectedChapterId(chapterId);
          setSelectedVerseId(verseId);
          setTimeout(() => {
            const el = document.getElementById(`verse-${verseId}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 150);
        }}
        onEditNote={(note) => {
          const v = currentChapter.verses.find((item) => item.id === note.verseId) || {
            id: note.verseId,
            number: note.verseNumber,
            title: note.verseTitle,
            mulaSanskrit: note.selectedText,
            mulaIast: "",
            englishTranslation: "",
          };
          setActiveAnnotateModal({
            isOpen: true,
            verse: v,
            selectedText: note.selectedText,
            field: note.field,
            existingNote: note,
          });
        }}
      />

      {/* Bookmarks Full Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksDrawerOpen}
        onClose={() => setIsBookmarksDrawerOpen(false)}
        onSelectBookmark={handleSelectBookmark}
        currentGranthaId={grantha.id}
      />
    </div>
  );
}
