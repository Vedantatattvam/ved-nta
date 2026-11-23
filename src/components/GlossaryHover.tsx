import React, { useState } from "react";
import { lookupTerm, GLOSSARY_DICTIONARY, GlossaryTerm } from "../glossary";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import { BookOpen, Sparkles } from "lucide-react";

interface GlossaryHoverProps {
  termName?: string;
  children?: React.ReactNode;
}

export function GlossaryHover({ termName, children }: GlossaryHoverProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [isOpen, setIsOpen] = useState(false);
  const textContent = typeof children === "string" ? children : termName || "";
  const matchedTerm = lookupTerm(termName || textContent);

  if (!matchedTerm) {
    return <>{children || termName}</>;
  }

  const transliteratedScript = transliterate(matchedTerm.devanagari, activeLipi);

  return (
    <span className="relative inline-block group">
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer font-medium text-[#b38728] border-b-2 border-dotted border-[#d4af37] hover:text-[#9e741e] hover:border-[#bf953f] transition-colors duration-150 px-0.5 rounded bg-[#fdf8e9]/60"
      >
        {children || matchedTerm.term}
      </span>

      {/* Modern 3D Golden Tooltip Popover */}
      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 block bg-gradient-to-b from-[#2A2219] via-[#382D22] to-[#241C14] text-[#FFF9E6] border border-[#d4af37] rounded-xl shadow-[0_10px_30px_rgba(140,90,20,0.35),0_0_15px_rgba(212,175,55,0.3)] z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-none text-left font-normal">
          {/* Subtle top golden light bar */}
          <span className="block h-1 -mt-4 -mx-4 rounded-t-xl bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c]" />

          <span className="flex items-start justify-between gap-2 mb-2 pt-1">
            <span className="block">
              <span className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg text-[#fcf6ba] tracking-wide">
                  {matchedTerm.term}
                </span>
                <span 
                  className={`text-xs font-semibold px-2 py-0.5 rounded border border-[#d4af37]/40 ${activeLipi === "bengali" ? "font-bengali text-[#fcf6ba] bg-[#bf953f]/30" : activeLipi === "devanagari" ? "font-devanagari text-[#d4af37] bg-[#bf953f]/20" : "font-mono text-[#d4af37] bg-[#bf953f]/20"}`}
                  style={{ fontFamily: activeLipi === "bengali" ? "'Tiro Bangla', serif" : activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
                >
                  {transliteratedScript}
                </span>
              </span>
              <span className="inline-block mt-1 text-[10px] font-bold tracking-widest uppercase text-[#e6c875] bg-[#d4af37]/20 px-1.5 py-0.5 rounded">
                {matchedTerm.category}
              </span>
            </span>
            <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
          </span>

          <span className="block text-xs font-semibold text-[#f5e6be] mb-1.5 leading-snug">
            {matchedTerm.definition}
          </span>

          <span className="block text-[11px] text-[#e3d0b2] leading-relaxed border-t border-[#d4af37]/30 pt-2 font-serif italic">
            {matchedTerm.explanation}
          </span>
          
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-8 border-transparent border-t-[#241C14] block" />
        </span>
      )}
    </span>
  );
}

/**
 * A wrapper component that automatically scans text/markdown for Vedantic keywords and turns them into interactive GlossaryHover elements!
 */
export function GlossaryAutoText({ text }: { text: string }) {
  if (!text) return null;

  // Build regex of all glossary term names & alt spellings
  const allTerms: { key: string; display: string }[] = [];
  Object.values(GLOSSARY_DICTIONARY).forEach((gt) => {
    allTerms.push({ key: gt.term, display: gt.term });
    if (gt.altSpellings) {
      gt.altSpellings.forEach((alt) => allTerms.push({ key: gt.term, display: alt }));
    }
  });

  // Sort by length descending so longer phrases match first
  allTerms.sort((a, b) => b.display.length - a.display.length);

  // Split text into tokens safely
  // Regex pattern matching word boundaries
  const escapedDisplays = allTerms.map((t) => t.display.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escapedDisplays.length === 0) return <span>{text}</span>;

  const pattern = new RegExp(`\\b(${escapedDisplays.join("|")})\\b`, "gi");

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const matchedText = match[0];
    parts.push(
      <GlossaryHover key={match.index} termName={matchedText}>
        {matchedText}
      </GlossaryHover>
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
