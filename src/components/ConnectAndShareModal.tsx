import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Share2,
  Copy,
  Check,
  Mail,
  QrCode,
  BookOpen,
  MessageSquare,
  Globe,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  Send
} from "lucide-react";
import { CANONICAL_PORTAL_URL, getPublicShareUrl } from "../utils/shareUtils";

interface ConnectAndShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  url?: string;
  summaryText?: string;
  citationText?: string;
  onOpenSastrartha?: () => void;
}

export default function ConnectAndShareModal({
  isOpen,
  onClose,
  title = "vedāntatattvaṁ — Indological & Vedānta Research Platform",
  subtitle = "vande guruparamparām • Comprehensive Digital Canon & Scholarly Exegesis",
  url = CANONICAL_PORTAL_URL,
  summaryText = "Explore the authentic Sanskrit canon, multi-school Bhāṣyas, and early Vedānta research on vedāntatattvaṁ.",
  citationText = `vedāntatattvaṁ (vedantatattvam.com). Accessed on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`,
  onOpenSastrartha
}: ConnectAndShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [activeTab, setActiveTab] = useState<"share" | "connect" | "cite">("share");

  if (!isOpen) return null;

  const currentUrl = url || CANONICAL_PORTAL_URL;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`${title} — ${subtitle}`);
  const encodedSummary = encodeURIComponent(`${title}\n\n${summaryText}\n\nExplore at: ${currentUrl}\n#Vedanta #Sanskrit #Indology #Advaita`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const socialChannels = [
    {
      name: "WhatsApp",
      color: "#25D366",
      bgClass: "hover:bg-[#25D366]/15 hover:border-[#25D366]",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.923l-1.662 6.077 6.22-1.632c1.704.928 3.659 1.464 5.74 1.464 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.84c-1.899 0-3.666-.549-5.163-1.493l-.37-.234-3.679.965.982-3.585-.256-.407c-1.042-1.656-1.597-3.578-1.597-5.558 0-5.589 4.546-10.136 10.083-10.136 5.539 0 10.046 4.507 10.046 10.046 0 5.539-4.507 10.002-10.046 10.002z"/>
        </svg>
      ),
      shareUrl: `https://api.whatsapp.com/send?text=${encodedSummary}`,
    },
    {
      name: "X (Twitter)",
      color: "#000000",
      bgClass: "hover:bg-black/10 hover:border-black",
      iconSvg: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      shareUrl: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=Vedanta,Advaita,Sanskrit,Indology`,
    },
    {
      name: "Facebook",
      color: "#1877F2",
      bgClass: "hover:bg-[#1877F2]/15 hover:border-[#1877F2]",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.592 0 9 1.582 9 4.615V8z"/>
        </svg>
      ),
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Telegram",
      color: "#229ED9",
      bgClass: "hover:bg-[#229ED9]/15 hover:border-[#229ED9]",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z"/>
        </svg>
      ),
      shareUrl: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      color: "#0A66C2",
      bgClass: "hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Reddit",
      color: "#FF4500",
      bgClass: "hover:bg-[#FF4500]/15 hover:border-[#FF4500]",
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183.404.284.854.284 1.325 0 2.97-3.08 5.37-6.35 5.37s-6.35-2.4-6.35-5.37c0-.471.101-.921.284-1.325-.776-.443-1.284-1.296-1.284-2.27 0-1.442 1.168-2.61 2.61-2.61.762 0 1.445.328 1.926.852 1.624-.875 3.525-1.42 5.568-1.492l1.196-3.805 3.09.658c.203-.497.693-.848 1.266-.848.756 0 1.368.613 1.368 1.368s-.612 1.368-1.368 1.368c-.628 0-1.15-.424-1.312-1.004l-2.486-.529-.982 3.125c2.085.068 4.024.62 5.674 1.516.485-.536 1.18-.874 1.956-.874 1.442 0 2.61 1.168 2.61 2.61 0 .974-.508 1.827-1.284 2.27z"/>
        </svg>
      ),
      shareUrl: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Email",
      color: "#8c6011",
      bgClass: "hover:bg-[#8c6011]/15 hover:border-[#8c6011]",
      iconSvg: <Mail className="w-5 h-5" />,
      shareUrl: `mailto:?subject=${encodedTitle}&body=${encodedSummary}`,
    },
  ];

  const modalContent = (
    <div
      id="connect-and-share-modal"
      style={{ zIndex: 999999 }}
      className="fixed inset-0 z-50 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="connect-and-share-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDF8] border-2 border-[#d4af37] rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-[0_25px_70px_rgba(140,96,17,0.35)] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Gold Foil Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#aa771c] via-[#fcf6ba] to-[#aa771c]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pt-2 pb-3 border-b border-[#bf953f]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FAF1E2] rounded-xl border border-[#bf953f]/40 text-[#8c6011]">
                <Share2 className="w-4 h-4" />
              </span>
              <h3 className="font-serif font-black text-lg text-[#2D2319] tracking-wide">
                Connect & Scholarly Share
              </h3>
            </div>
            <p className="text-xs text-[#6e5842] font-serif mt-1">
              Share authentic Sanskrit treatises, Bhāṣyas, and Indological research across social platforms.
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

        {/* Navigation Tabs (Whitish luminous style with strong gold contrast) */}
        <div className="flex items-center gap-2 mt-4 p-1.5 bg-[#FAF5ED] rounded-2xl border border-[#bf953f]/30">
          <button
            type="button"
            onClick={() => setActiveTab("share")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "share"
                ? "bg-gradient-to-r from-[#FFFFFF] via-[#FFFDF5] to-[#FFF9E6] text-[#8C4E03] border-2 border-[#D4AF37] shadow-[0_4px_12px_rgba(212,175,55,0.25)] ring-1 ring-[#E2B755]/50"
                : "bg-transparent text-[#6e5842] hover:text-[#2D2319] hover:bg-white/60"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Share</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("connect")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "connect"
                ? "bg-gradient-to-r from-[#FFFFFF] via-[#FFFDF5] to-[#FFF9E6] text-[#8C4E03] border-2 border-[#D4AF37] shadow-[0_4px_12px_rgba(212,175,55,0.25)] ring-1 ring-[#E2B755]/50"
                : "bg-transparent text-[#6e5842] hover:text-[#2D2319] hover:bg-white/60"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Connect & Discuss</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cite")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "cite"
                ? "bg-gradient-to-r from-[#FFFFFF] via-[#FFFDF5] to-[#FFF9E6] text-[#8C4E03] border-2 border-[#D4AF37] shadow-[0_4px_12px_rgba(212,175,55,0.25)] ring-1 ring-[#E2B755]/50"
                : "bg-transparent text-[#6e5842] hover:text-[#2D2319] hover:bg-white/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cite / Monograph</span>
          </button>
        </div>

        {/* Tab 1: Social Share View */}
        {activeTab === "share" && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            {/* Quick URL Copy Box */}
            <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8c6011] font-bold">
                <span>Direct Research Link:</span>
                {copiedLink && (
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-white border border-[#bf953f]/30 rounded-xl px-3 py-1.5 text-xs text-[#4a3928] font-mono select-all focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:from-[#e0bd4b] hover:to-[#d4af37] text-[#120e0b] font-serif font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Social Grid */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                Select Platform to Share:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {socialChannels.map((ch) => (
                  <a
                    key={ch.name}
                    href={ch.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-2xl border border-[#bf953f]/30 bg-[#FFFDF8] ${ch.bgClass} flex items-center gap-2.5 transition-all duration-200 group shadow-xs cursor-pointer`}
                    style={{ color: ch.color }}
                  >
                    <div className="p-1.5 rounded-xl bg-[#FAF5ED] group-hover:bg-white transition-colors">
                      {ch.iconSvg}
                    </div>
                    <span className="font-serif font-bold text-xs text-[#2D2319] group-hover:text-[#8C4E03] truncate">
                      {ch.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quote Snippet Preview */}
            <div className="p-3 rounded-xl bg-white border border-[#bf953f]/30 text-xs text-[#6e5842] italic">
              <span className="font-bold text-[#8c6011] not-italic block mb-0.5">Share Snippet:</span>
              "{summaryText.substring(0, 140)}..."
            </div>
          </div>
        )}

        {/* Tab 2: Connect & Discuss View */}
        {activeTab === "connect" && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-3.5 pr-1 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/40 space-y-3">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#8c6011]">
                <Mail className="w-4 h-4 text-[#8c6011]" />
                <span>Academic Contact & Editorial Queries</span>
              </div>
              <p className="text-[#4a3928] leading-relaxed">
                We welcome scholarly dialogue, manuscript corrections, translation notes, and collaboration with Sanskrit institutions worldwide.
              </p>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#bf953f]/30 font-mono">
                <span className="text-[#8c6011] font-bold">buddhodevghosh@gmail.com</span>
                <a
                  href="mailto:buddhodevghosh@gmail.com?subject=vedantatattvam Academic Research Inquiry"
                  className="px-2.5 py-1 bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] rounded-lg font-serif font-bold text-[11px] flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Internet Archive Monograph Repository Link */}
            <div className="p-4 rounded-2xl bg-white border border-[#bf953f]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#8c6011] flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>Internet Archive Research Monograph</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  Open Access
                </span>
              </div>
              <p className="text-[#6e5842] leading-relaxed">
                Consult Prof. Hajime Nakamura's foundational opus <em>"A History of Early Vedānta Philosophy"</em> directly on the Internet Archive.
              </p>
              <a
                href="https://archive.org/details/AHistoryOfEarlyVedantaPhilosophyHajimeNakamura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] font-serif font-bold transition"
              >
                <span>Open Archive.org Monograph</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* In-App Scholarly Counsel Launcher */}
            {onOpenSastrartha && (
              <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#bf953f]/30 flex items-center justify-between gap-3">
                <div>
                  <div className="font-serif font-bold text-sm text-[#2D2319]">
                    Scholarly Dialectics (शास्त्रार्थ)
                  </div>
                  <div className="text-[#6e5842] text-[11px] mt-0.5">
                    Engage in live multi-school Sūtra inquiries and Pūrvapakṣa debates.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSastrartha();
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] font-serif font-bold rounded-xl text-xs shrink-0 shadow-xs cursor-pointer hover:brightness-105 transition"
                >
                  Enter Counsel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cite / Academic Monograph View */}
        {activeTab === "cite" && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#bf953f]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider text-[11px]">
                  Standard Academic Citation (APA / Chicago):
                </span>
                {copiedCitation && (
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> Citation Copied!
                  </span>
                )}
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#bf953f]/30 font-serif leading-relaxed text-[#2D2319]">
                {citationText}
              </div>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="w-full py-2 bg-[#FAF1E2] hover:bg-[#ebd7b2] text-[#8c6011] font-serif font-bold rounded-xl border border-[#bf953f]/40 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? "Copied Citation" : "Copy Academic Citation"}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#bf953f]/30 text-[11px] text-[#6e5842] space-y-1">
              <span className="font-bold text-[#8c6011] block">Platform Identifier & License:</span>
              <p>
                <strong>Title:</strong> vedāntatattvaṁ (वेदान्ततत्त्वम्) • Digital Indological & Vedānta Research Core
              </p>
              <p>
                <strong>Editorial Curators:</strong> Academic Vedānta Editorial Board & Researchers (vedāntatattvaṁ).
              </p>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="mt-4 pt-3 border-t border-[#bf953f]/30 flex items-center justify-between text-xs text-[#8c6011]">
          <span className="font-serif italic text-[11px]">
            वन्दे गुरुपरम्पराम् • Dedicated to universal Sanskrit scholarship
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#4a3928] font-serif font-bold text-xs cursor-pointer transition"
          >
            Close
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
