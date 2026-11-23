import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, Quote, Share2, ChevronDown } from "lucide-react";

interface CitationButtonProps {
  title?: string;
  sourceText?: string;
  analysisContent?: string;
  schools?: string[];
  moduleName?: string;
  className?: string;
}

export function CitationButton({
  title,
  sourceText,
  analysisContent,
  schools,
  moduleName,
}: CitationButtonProps) {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<"standard" | "chicago" | "bibtex">("standard");
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; right: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownEstimatedHeight = 175;

    let top = rect.bottom + 6;
    if (spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight) {
      top = rect.top - dropdownEstimatedHeight - 6;
    }

    const right = Math.max(12, window.innerWidth - rect.right);
    setDropdownCoords({ top, right });
  }, []);

  const toggleOptions = () => {
    if (!showOptions) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownEstimatedHeight = 175;
        let top = rect.bottom + 6;
        if (spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight) {
          top = rect.top - dropdownEstimatedHeight - 6;
        }
        const right = Math.max(12, window.innerWidth - rect.right);
        setDropdownCoords({ top, right });
      }
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (!showOptions) return;

    updatePosition();

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowOptions(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [showOptions, updatePosition]);

  const formatCitation = (chosenStyle: "standard" | "chicago" | "bibtex") => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (chosenStyle === "chicago") {
      return `vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${today}.`;
    }

    if (chosenStyle === "bibtex") {
      return `@misc{vedantatattvam,
  title = {{vedāntatattvaṁ}},
  howpublished = {\\url{https://vedantatattvam.com}},
  note = {Accessed: ${today}}
}`;
    }

    // Standard format: strictly website name and when it was accessed
    return `vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${today}.`;
  };

  const handleCopy = (chosenStyle: "standard" | "chicago" | "bibtex" = style) => {
    const textToCopy = formatCitation(chosenStyle);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setShowOptions(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${showOptions ? "z-50" : "z-10"}`}>
      <div className="flex items-center gap-1 bg-[#FFFDF8] p-1 rounded-xl border border-[#bf953f]/40 shadow-xs">
        <button
          onClick={() => handleCopy(style)}
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#d4af37] text-[#120e0b] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          title="Copy formatted academic citation"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-800" />
              <span className="text-emerald-900">Citation Copied!</span>
            </>
          ) : (
            <>
              <Quote className="w-3.5 h-3.5 text-[#120e0b]" />
              <span>Copy Citation</span>
            </>
          )}
        </button>

        <button
          onClick={toggleOptions}
          type="button"
          className={`px-2 py-1.5 rounded-lg text-[#8c6011] hover:text-[#2D2319] hover:bg-[#FAF1E2] text-xs font-mono transition cursor-pointer flex items-center gap-0.5 ${
            showOptions ? "bg-[#FAF1E2] text-[#2D2319] ring-1 ring-[#bf953f]" : ""
          }`}
          title="Select Citation Style"
          aria-expanded={showOptions}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOptions ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Style selector dropdown rendered via Portal with high z-index (z-50 / z-[999999]) to appear above all other content layers */}
      {showOptions &&
        dropdownCoords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            id="citation-style-dropdown-menu"
            style={{
              position: "fixed",
              top: `${dropdownCoords.top}px`,
              right: `${dropdownCoords.right}px`,
              zIndex: 999999,
            }}
            className="z-50 z-[999999] w-60 bg-[#FFFDF9] border-2 border-[#C59B27] rounded-xl shadow-[0_12px_36px_rgba(140,96,17,0.35)] p-2 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150 ring-1 ring-[#e2b755]/50"
          >
            <div className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider px-2 py-1 border-b border-[#bf953f]/30 flex items-center justify-between">
              <span>Academic Citation Style:</span>
              <span className="text-[9px] font-mono text-[#6e5842] font-normal">Select Format</span>
            </div>

            <button
              onClick={() => {
                setStyle("standard");
                handleCopy("standard");
              }}
              type="button"
              className={`w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif transition-colors ${
                style === "standard" ? "bg-[#FAF1E2] font-bold text-[#8c6011]" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold">Standard Vedāntatattvaṁ</span>
                <span className="text-[10px] text-[#6e5842]">Full bibliographic header</span>
              </div>
              {style === "standard" && <Check className="w-3.5 h-3.5 text-[#8c6011] shrink-0" />}
            </button>

            <button
              onClick={() => {
                setStyle("chicago");
                handleCopy("chicago");
              }}
              type="button"
              className={`w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif transition-colors ${
                style === "chicago" ? "bg-[#FAF1E2] font-bold text-[#8c6011]" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold">Chicago / Humanities</span>
                <span className="text-[10px] text-[#6e5842]">Notes & Bibliography style</span>
              </div>
              {style === "chicago" && <Check className="w-3.5 h-3.5 text-[#8c6011] shrink-0" />}
            </button>

            <button
              onClick={() => {
                setStyle("bibtex");
                handleCopy("bibtex");
              }}
              type="button"
              className={`w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif transition-colors ${
                style === "bibtex" ? "bg-[#FAF1E2] font-bold text-[#8c6011]" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold">BibTeX (.bib)</span>
                <span className="text-[10px] text-[#6e5842]">LaTeX & Zotero format</span>
              </div>
              {style === "bibtex" && <Check className="w-3.5 h-3.5 text-[#8c6011] shrink-0" />}
            </button>
          </div>,
          document.body
        )}

      {/* Fallback inline dropdown menu with high z-index (z-50) if portal is not active */}
      {showOptions && (!dropdownCoords || typeof document === "undefined") && (
        <div
          ref={dropdownRef}
          id="citation-style-dropdown-fallback"
          style={{ zIndex: 999999 }}
          className="z-50 z-[999999] absolute right-0 top-full mt-2 w-60 bg-[#FFFDF9] border-2 border-[#C59B27] rounded-xl shadow-[0_12px_36px_rgba(140,96,17,0.35)] p-2 space-y-1 text-xs"
        >
          <div className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider px-2 py-1 border-b border-[#bf953f]/30 flex items-center justify-between">
            <span>Academic Citation Style:</span>
            <span className="text-[9px] font-mono text-[#6e5842] font-normal">Select Format</span>
          </div>

          <button
            onClick={() => {
              setStyle("standard");
              handleCopy("standard");
            }}
            type="button"
            className="w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif"
          >
            <span className="text-xs font-bold">Standard Vedāntatattvaṁ</span>
            {style === "standard" && <Check className="w-3.5 h-3.5 text-[#8c6011]" />}
          </button>
          <button
            onClick={() => {
              setStyle("chicago");
              handleCopy("chicago");
            }}
            type="button"
            className="w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif"
          >
            <span className="text-xs font-bold">Chicago / Humanities</span>
            {style === "chicago" && <Check className="w-3.5 h-3.5 text-[#8c6011]" />}
          </button>
          <button
            onClick={() => {
              setStyle("bibtex");
              handleCopy("bibtex");
            }}
            type="button"
            className="w-full text-left px-2.5 py-2 rounded-lg text-[#2D2319] hover:bg-[#FAF1E2] flex items-center justify-between cursor-pointer font-serif"
          >
            <span className="text-xs font-bold">BibTeX (.bib)</span>
            {style === "bibtex" && <Check className="w-3.5 h-3.5 text-[#8c6011]" />}
          </button>
        </div>
      )}
    </div>
  );
}
