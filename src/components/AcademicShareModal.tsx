import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Share2,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  ExternalLink,
  Quote,
  Scale,
  Languages,
  CheckCircle2
} from "lucide-react";
import { CANONICAL_PORTAL_URL } from "../utils/shareUtils";

export interface AcademicShareData {
  title: string;
  subtitle?: string;
  sanskritText?: string;
  translation?: string;
  sourceText?: string;
  authorOrSchool?: string;
  url?: string;
  type?: "verse" | "comparative" | "facility" | "general";
  citation?: string;
}

interface AcademicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: AcademicShareData;
}

export default function AcademicShareModal({
  isOpen,
  onClose,
  shareData
}: AcademicShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedFullSnippet, setCopiedFullSnippet] = useState(false);

  if (!isOpen) return null;

  const currentUrl = shareData.url || CANONICAL_PORTAL_URL;

  // Construct formatted share message for WhatsApp, Facebook, X
  const shareHeading = shareData.title + (shareData.subtitle ? ` — ${shareData.subtitle}` : "");
  
  let formattedText = `📜 ${shareHeading}\n`;
  if (shareData.sanskritText) {
    formattedText += `\n"${shareData.sanskritText}"\n`;
  }
  if (shareData.translation) {
    formattedText += `\nTranslation: ${shareData.translation}\n`;
  }
  if (shareData.sourceText || shareData.authorOrSchool) {
    formattedText += `\nSource: ${[shareData.sourceText, shareData.authorOrSchool].filter(Boolean).join(" • ")}\n`;
  }
  formattedText += `\nExplore authentic Vedāntic research at: ${currentUrl}\n#Vedanta #Sanskrit #Indology #Advaita`;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(shareHeading);
  const encodedShareText = encodeURIComponent(formattedText);
  const encodedXText = encodeURIComponent(
    `${shareHeading}\n${shareData.sanskritText ? `"${shareData.sanskritText.substring(0, 100)}..."` : ""}\n`
  );

  const accessDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const defaultCitation =
    shareData.citation &&
    !shareData.citation.includes("Ghosh") &&
    !shareData.citation.includes("Acharya")
      ? shareData.citation
      : `vedāntatattvaṁ (vedantatattvam.com). Accessed on ${accessDate}.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(defaultCitation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyFullSnippet = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedFullSnippet(true);
      setTimeout(() => setCopiedFullSnippet(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const modalContent = (
    <div
      id="academic-citation-modal"
      style={{ zIndex: 999999 }}
      className="fixed inset-0 z-50 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="academic-citation-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF9] border-2 border-[#C59B27] rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-[0_25px_70px_rgba(140,96,17,0.38)] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Gold Foil Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#aa771c] via-[#fcf6ba] to-[#aa771c]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pt-2 pb-3 border-b border-[#bf953f]/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] rounded-xl border border-[#C59B27]/40 text-[#8c6011] shadow-2xs">
                {shareData.type === "comparative" ? (
                  <Scale className="w-4 h-4 text-[#8c6011]" />
                ) : (
                  <Share2 className="w-4 h-4 text-[#8c6011]" />
                )}
              </span>
              <h3 className="font-serif font-black text-base sm:text-lg text-[#2D2319] tracking-wide">
                {shareData.type === "verse"
                  ? "Share Academic Verse"
                  : shareData.type === "comparative"
                  ? "Share Comparative Insight"
                  : "Share Scholarly Insight"}
              </h3>
            </div>
            <p className="text-xs text-[#6e5842] font-serif">
              Share authentic Sanskrit passages, commentaries, and research citations across platforms.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8c6011] hover:bg-[#FAF1E2] border border-[#bf953f]/30 hover:border-[#bf953f] transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          {/* Card Preview of What Is Being Shared */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF8] to-[#FAF4E8] border border-[#C59B27]/40 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8c6011] bg-[#FAF2E3] px-2 py-0.5 rounded-md border border-[#bf953f]/30">
                {shareData.sourceText || "vedāntatattvaṁ Research"}
              </span>
              {shareData.authorOrSchool && (
                <span className="text-[10px] font-serif text-[#6e5842]">
                  {shareData.authorOrSchool}
                </span>
              )}
            </div>

            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2D2319] leading-snug">
              {shareData.title}
            </h4>

            {shareData.sanskritText && (
              <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/25 font-serif text-sm sm:text-base text-[#7A3E00] leading-relaxed font-semibold">
                {shareData.sanskritText}
              </div>
            )}

            {shareData.translation && (
              <p className="text-xs text-[#5c4731] font-serif leading-relaxed line-clamp-3 italic">
                "{shareData.translation}"
              </p>
            )}
          </div>

          {/* 4 Core Quick Share Channels: WhatsApp, Facebook, X, Copy Link */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider">
              Share to Platform:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-[#25D366]/40 bg-[#FFFDF8] hover:bg-[#25D366]/10 hover:border-[#25D366] flex flex-col items-center justify-center gap-1.5 transition-all duration-150 shadow-2xs hover:shadow-xs group cursor-pointer"
                title="Share via WhatsApp"
              >
                <div className="p-2 rounded-xl bg-[#25D366]/15 text-[#25D366] group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.923l-1.662 6.077 6.22-1.632c1.704.928 3.659 1.464 5.74 1.464 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.84c-1.899 0-3.666-.549-5.163-1.493l-.37-.234-3.679.965.982-3.585-.256-.407c-1.042-1.656-1.597-3.578-1.597-5.558 0-5.589 4.546-10.136 10.083-10.136 5.539 0 10.046 4.507 10.046 10.046 0 5.539-4.507 10.002-10.046 10.002z"/>
                  </svg>
                </div>
                <span className="font-serif font-bold text-xs text-[#2D2319] group-hover:text-[#25D366]">
                  WhatsApp
                </span>
              </a>

              {/* 2. Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-[#1877F2]/40 bg-[#FFFDF8] hover:bg-[#1877F2]/10 hover:border-[#1877F2] flex flex-col items-center justify-center gap-1.5 transition-all duration-150 shadow-2xs hover:shadow-xs group cursor-pointer"
                title="Share on Facebook"
              >
                <div className="p-2 rounded-xl bg-[#1877F2]/15 text-[#1877F2] group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.592 0 9 1.582 9 4.615V8z"/>
                  </svg>
                </div>
                <span className="font-serif font-bold text-xs text-[#2D2319] group-hover:text-[#1877F2]">
                  Facebook
                </span>
              </a>

              {/* 3. X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedXText}&url=${encodedUrl}&hashtags=Vedanta,Sanskrit,Indology`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-black/30 bg-[#FFFDF8] hover:bg-black/5 hover:border-black flex flex-col items-center justify-center gap-1.5 transition-all duration-150 shadow-2xs hover:shadow-xs group cursor-pointer"
                title="Share on X (Twitter)"
              >
                <div className="p-2 rounded-xl bg-black/10 text-black group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="font-serif font-bold text-xs text-[#2D2319] group-hover:text-black">
                  X (Twitter)
                </span>
              </a>

              {/* 4. Copy Direct Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`p-3 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs group cursor-pointer ${
                  copiedLink
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                    : "bg-[#FFFDF8] border-[#C59B27]/40 hover:border-[#C59B27] hover:bg-[#FAF3E4]"
                }`}
                title="Copy Direct Link to Clipboard"
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    copiedLink
                      ? "bg-emerald-200 text-emerald-900"
                      : "bg-[#FAF2E3] text-[#8c6011] group-hover:scale-110 transition-transform"
                  }`}
                >
                  {copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="font-serif font-bold text-xs">
                  {copiedLink ? "Link Copied!" : "Copy Link"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick URL Input Bar */}
          <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8c6011] font-bold">
              <span>Direct Link:</span>
              {copiedLink && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Ready to paste!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-white border border-[#bf953f]/30 rounded-xl px-3 py-2 text-xs text-[#4a3928] font-mono select-all focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 text-[#120e0b] font-serif font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 border border-[#ffe680]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Academic Citation Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider text-[11px]">
                Standard Academic Citation:
              </span>
              {copiedCitation && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-mono">
                  <Check className="w-3 h-3" /> Citation Copied!
                </span>
              )}
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-[#bf953f]/30 font-serif leading-relaxed text-[#2D2319]">
              {defaultCitation}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyCitation}
                className="flex-1 py-1.5 bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] font-serif font-bold rounded-xl border border-[#bf953f]/40 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs text-xs"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? "Copied Citation" : "Copy Academic Citation"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyFullSnippet}
                className="py-1.5 px-3 bg-white hover:bg-[#FAF1E2] text-[#6e5842] hover:text-[#2D2319] font-serif font-bold rounded-xl border border-[#bf953f]/40 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs text-xs"
                title="Copy full Sanskrit text, translation & citation summary"
              >
                {copiedFullSnippet ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Quote className="w-3.5 h-3.5" />}
                <span>{copiedFullSnippet ? "Copied Text" : "Copy Full Text"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="mt-4 pt-3 border-t border-[#bf953f]/30 flex items-center justify-between text-xs text-[#8c6011]">
          <span className="font-serif italic text-[11px] text-[#8c6011]">
            वन्दे गुरुपरम्पराम् • Authentic Digital Indology & Vedānta Exegesis
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#4a3928] font-serif font-bold text-xs cursor-pointer transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
