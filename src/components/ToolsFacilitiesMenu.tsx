import React, { useState, useRef, useEffect } from "react";
import { TabType } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  GitFork,
  BookOpen,
  Scale,
  Languages,
  MessageSquare,
  FileText,
  ChevronDown,
  Menu,
  Sparkles,
  BookMarked,
  Layers,
  ArrowRight,
  Compass,
  Scroll,
  Library,
  Type,
  Info
} from "lucide-react";

export interface FacilityItem {
  id: TabType;
  title: string;
  sanskritTitle: string;
  shortLabel: string;
  category: "canon" | "analysis" | "tools";
  description: string;
  icon: React.ElementType;
  badge: string;
}

export const ALL_FACILITIES: FacilityItem[] = [
  {
    id: "mapping",
    title: "Granthasāraṇī Canon & Reader",
    sanskritTitle: "ग्रन्थसारणी एवं मूलपाठः",
    shortLabel: "Granthasāraṇī (Canon)",
    category: "canon",
    description: "Canonical Treatises, Multi-Script Verses, Bhāṣya Extracts, & Manuscript Reader",
    icon: BookOpen,
    badge: "Canon & Texts",
  },
  {
    id: "tree",
    title: "Paramparā Knowledge Tree",
    sanskritTitle: "वेदान्त-परम्परा-ज्ञानवृक्षः",
    shortLabel: "Knowledge Tree",
    category: "canon",
    description: "Lineage Succession, Sub-Prasthānas, Timeline & Master Doctrines of All Vedānta Schools",
    icon: GitFork,
    badge: "Lineage Tree",
  },
  {
    id: "bharatiya_lipi",
    title: "Bharatiya Bhasha Lipi & Typography",
    sanskritTitle: "भारतीय भाषा लिपि एवं मुद्रणकला",
    shortLabel: "Bharatiya Lipi & Fonts",
    category: "tools",
    description: "Multi-Script Matrix, 10 Indic Lipis (Devanāgarī, Bengali, Tamil, Telugu, etc.), Font Changing & Typographic Studio",
    icon: Type,
    badge: "Lipi & Fonts",
  },
  {
    id: "comparative_council",
    title: "Comparative & Scholarly Council",
    sanskritTitle: "साम्प्रदायिक-भाष्य-विमर्शः एवं शास्त्रार्थ-परामर्शः",
    shortLabel: "Comparative & Council",
    category: "analysis",
    description: "Cross-School Bhāṣya Exegesis, Dialectical Synthesis & Exegetical Q&A Counsel across All Vedānta Traditions",
    icon: Scale,
    badge: "Exegesis & Council",
  },
  {
    id: "translation",
    title: "Precision Translation & Anvaya",
    sanskritTitle: "पदच्छेदान्वय-सटीकानुवादः",
    shortLabel: "Precision Translation",
    category: "analysis",
    description: "Word-by-word Padaccheda, Syntactical Anvaya, Grammatical Vibhakti & Commentary",
    icon: Languages,
    badge: "Grammar & Anvaya",
  },
  {
    id: "ocr",
    title: "Sanskrit Manuscript OCR",
    sanskritTitle: "मातृका-लिपि-उद्धरणम्",
    shortLabel: "Manuscript OCR",
    category: "tools",
    description: "Palm-leaf & Grantha Script Image-to-Devanāgarī Transcriber and Orthographic Restorer",
    icon: FileText,
    badge: "OCR Transcriber",
  },
  {
    id: "early_vedanta",
    title: "Early Vedānta (Hajime Nakamura Archive)",
    sanskritTitle: "प्रारम्भिक-वेदान्त-इतिहासः (हाजिमे नाकामुरा)",
    shortLabel: "Early Vedānta (Nakamura)",
    category: "canon",
    description: "Pre-Śaṅkara Masters (Upavarṣa, Bodhāyana, Bhartṛprapañca, Gauḍapāda), Upaniṣadic Stratification & Buddhist/Jaina Records",
    icon: Scroll,
    badge: "Nakamura Archive",
  },
  {
    id: "bengal_vedanta",
    title: "Vedānta in Bengal (75 Scholars)",
    sanskritTitle: "বঙ্গীয় বেদান্ত-ঐতিহ্য (বুদ্ধদেব ঘোষ ২০২৪)",
    shortLabel: "Vedānta in Bengal",
    category: "canon",
    description: "Special Cell on Bengal's 75 Thinkers, 3 Canonical Categories, & Socio-Spiritual Matrix (Buddhodev Ghosh, 2024)",
    icon: Library,
    badge: "Research Cell",
  },
  {
    id: "about_us",
    title: "About Us (Mission & Vision)",
    sanskritTitle: "ध्येयवाक्यम् एवं सम्पादन-परिचयः",
    shortLabel: "About Us",
    category: "canon",
    description: "Mission, Vision, Non-Sectarian Preservation Philosophy & Academic Curation Credits",
    icon: Info,
    badge: "Mission & Vision",
  },
];

interface ToolsFacilitiesMenuProps {
  activeTab?: TabType;
  onSelectTab: (tab: TabType, payload?: any) => void;
  onOpenDrawer?: () => void;
  onOpenGlossary?: () => void;
  variant?: "dropdown" | "button" | "compact";
  className?: string;
  buttonLabel?: string;
  contextPayload?: any;
}

export default function ToolsFacilitiesMenu({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  onOpenGlossary,
  variant = "dropdown",
  className = "",
  buttonLabel = "Tools & Facilities Menu",
  contextPayload,
}: ToolsFacilitiesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { transliterate, activeLipi } = useBharatiyaLipi();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (tabId: TabType) => {
    onSelectTab(tabId, contextPayload);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${isOpen ? "z-50" : ""} ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
            isOpen
              ? "bg-gradient-to-r from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border-[#ffe680] text-[#120e0b]"
          }`}
          title="Open Tools & Facilities Menu"
        >
          <Menu className="w-3.5 h-3.5" />
          <span className="font-serif">{buttonLabel}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-md border ${
            isOpen
              ? "bg-gradient-to-r from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 font-bold"
              : "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border-[#ffe680] text-[#120e0b]"
          }`}
        >
          <Menu className={`w-4 h-4 text-[#120e0b] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
          <span className="font-serif">{buttonLabel}</span>
          <ChevronDown className={`w-4 h-4 text-[#120e0b] opacity-80 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          id="tools-facilities-dropdown-menu"
          style={{ zIndex: 999999 }}
          className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-[320px] sm:w-[380px] md:w-[420px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F7EFE1] border-2 border-[#bf953f] rounded-2xl shadow-[0_15px_40px_rgba(140,96,17,0.35)] z-50 z-[999999] p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
        >
          {/* Top Header */}
          <div className="px-2 py-1.5 border-b border-[#bf953f]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8c6011]" />
              <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                Research Facilities & Utilities
              </span>
            </div>
            <span className="text-[10px] font-serif italic text-[#6e5842]">
              Select any facility to jump
            </span>
          </div>

          {/* Menu Items List */}
          <div className="space-y-1.5">
            {ALL_FACILITIES.map((facility) => {
              const Icon = facility.icon;
              const isActive = activeTab === facility.id;
              return (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => handleSelect(facility.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer group ${
                    isActive
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] border-2 border-[#C59B27] text-[#7A3E00] shadow-md ring-1 ring-[#E2B755]/60 font-bold"
                      : "bg-[#FFFDF9] hover:bg-[#FAF3E4] border-[#bf953f]/30 hover:border-[#bf953f] text-[#3D2C1D]"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                        : "bg-[#FAF1E2] group-hover:bg-[#f5e5cc] text-[#8c6011] border border-[#bf953f]/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-serif font-bold text-xs sm:text-sm truncate text-[#2D2319]">
                        {facility.title}
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                          isActive
                            ? "bg-[#FAF1E2] text-[#7A3E00] border-[#d4af37] font-bold"
                            : "bg-[#FAF1E2] text-[#8c6011] border-[#bf953f]/30"
                        }`}
                      >
                        {facility.badge}
                      </span>
                    </div>

                    <div
                      className={`text-[11px] font-serif mt-0.5 font-bold ${
                        isActive ? "text-[#7A3E00]" : "text-[#8c6011]"
                      }`}
                    >
                      {transliterate(facility.sanskritTitle, activeLipi)}
                    </div>

                    <p
                      className={`text-[11px] leading-snug mt-1 line-clamp-2 ${
                        isActive ? "text-[#5c4731]" : "text-[#6e5842]"
                      }`}
                    >
                      {facility.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Utility Actions Footer */}
          <div className="pt-2 border-t border-[#bf953f]/25 grid grid-cols-2 gap-2">
            {onOpenGlossary && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenGlossary();
                }}
                className="p-2 rounded-xl bg-[#FAF1E2] hover:bg-[#FAF5ED] border border-[#bf953f]/30 text-[#8c6011] text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Vedānta Glossary</span>
              </button>
            )}

            {onOpenDrawer && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenDrawer();
                }}
                className="p-2 rounded-xl bg-[#FAF1E2] hover:bg-[#FAF5ED] border border-[#bf953f]/30 text-[#8c6011] text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Full Drawer View</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
