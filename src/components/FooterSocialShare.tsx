import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Share2,
  Copy,
  Check,
  Mail,
  QrCode,
  Sparkles,
  BookOpen,
  Send,
  ExternalLink,
  MessageCircle,
  Quote,
  Flame,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import AcademicShareModal, { AcademicShareData } from "./AcademicShareModal";
import { CANONICAL_PORTAL_URL, generateQrDataUrl } from "../utils/shareUtils";

interface FooterSocialShareProps {
  currentTabName?: string;
}

interface MahavakyaOption {
  id: string;
  name: string;
  veda: string;
  sanskrit: string;
  iast: string;
  english: string;
  source: string;
}

const MAHAVAKYAS: MahavakyaOption[] = [
  {
    id: "prajnanam",
    name: "Prajñānaṁ Brahma",
    veda: "Ṛgveda",
    sanskrit: "प्रज्ञानं ब्रह्म",
    iast: "Prajñānaṁ Brahma",
    english: "Consciousness is the Ultimate Reality (Brahman)",
    source: "Aitareya Upaniṣad 3.1.3"
  },
  {
    id: "aham",
    name: "Ahaṁ Brahmāsmi",
    veda: "Śukla Yajurveda",
    sanskrit: "अहं ब्रह्मास्मि",
    iast: "Ahaṁ Brahmāsmi",
    english: "I am the Absolute Brahman",
    source: "Bṛhadāraṇyaka Upaniṣad 1.4.10"
  },
  {
    id: "tattvamasi",
    name: "Tat Tvam Asi",
    veda: "Sāmaveda",
    sanskrit: "तत्त्वमसि",
    iast: "Tat Tvam Asi",
    english: "That Thou Art",
    source: "Chāndogya Upaniṣad 6.8.7"
  },
  {
    id: "ayam",
    name: "Ayam Ātmā Brahma",
    veda: "Atharvaveda",
    sanskrit: "अयमात्मा ब्रह्म",
    iast: "Ayam Ātmā Brahma",
    english: "This Self is the Ultimate Reality",
    source: "Māṇḍūkya Upaniṣad 1.2"
  }
];

export default function FooterSocialShare({
  currentTabName = "Vedānta Scholarly Portal"
}: FooterSocialShareProps) {
  const [selectedMahavakya, setSelectedMahavakya] = useState<MahavakyaOption>(MAHAVAKYAS[2]); // Tat Tvam Asi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(() => {
    try {
      return localStorage.getItem("vedanta_newsletter_sub") === "true";
    } catch {
      return false;
    }
  });

  const portalUrl = CANONICAL_PORTAL_URL;
  const portalTitle = "vedāntatattvaṁ — Advaita & Classical Vedānta Scholarly Repository";

  // Pre-generate QR code for canonical URL
  useEffect(() => {
    generateQrDataUrl(CANONICAL_PORTAL_URL, { width: 260, margin: 1 }).then((url) => {
      if (url) setQrDataUrl(url);
    });
  }, []);

  // Share messages
  const generalShareMessage = `Explore vedāntatattvaṁ: Comprehensive scholarly repository for Advaita, Viśiṣṭādvaita, Dvaita, Acintya Bhedābheda, and classical Sanskrit Vedānta granthas with multi-script transliteration and authentic commentary exegesis.\n\n${portalUrl}\n\n#Vedanta #Sanskrit #Advaita #IndianPhilosophy`;
  const quoteShareMessage = `📜 "${selectedMahavakya.sanskrit}" (${selectedMahavakya.iast})\n"${selectedMahavakya.english}"\n— ${selectedMahavakya.source} (${selectedMahavakya.veda})\n\nExplore classical Sanskrit granthas on vedāntatattvaṁ:\n${portalUrl}\n\n#Vedanta #Upanishads #Sanskrit #Advaita`;

  const encodedUrl = encodeURIComponent(portalUrl);
  const encodedGeneralText = encodeURIComponent(generalShareMessage);
  const encodedQuoteText = encodeURIComponent(quoteShareMessage);
  const encodedXText = encodeURIComponent(
    `Explore vedāntatattvaṁ — Classical Sanskrit Vedānta Canon & Commentary Exegesis:\n`
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(quoteShareMessage);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) return;
    try {
      localStorage.setItem("vedanta_newsletter_sub", "true");
      setNewsletterSubscribed(true);
    } catch {
      // ignore
    }
  };

  const academicData: AcademicShareData = {
    title: "vedāntatattvaṁ Scholarly Portal",
    subtitle: `${selectedMahavakya.name} (${selectedMahavakya.source}) • ${currentTabName}`,
    sanskritText: selectedMahavakya.sanskrit,
    translation: selectedMahavakya.english,
    sourceText: `${selectedMahavakya.source} • ${selectedMahavakya.veda}`,
    authorOrSchool: "Advaita & Classical Vedānta Canon",
    url: portalUrl,
    type: "verse"
  };

  return (
    <>
      {/* Sleek, Compact Social & Scholarly Share Hub */}
      <div
        id="footer-social-hub"
        className="w-full bg-[#FAF5EC] border border-[#bf953f]/35 rounded-xl p-2.5 sm:p-3 shadow-xs relative overflow-hidden text-xs"
      >
        {/* Main Single-Row Compact Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Compact Branding & Domain Badge */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#dfb76c] to-[#8c6011] text-[#FFFDF8] flex items-center justify-center shadow-xs shrink-0">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-[#8c6011] text-xs">
                  Vedānta Connect & Share
                </span>
                <span className="font-mono text-[10px] text-[#735013] bg-[#8c6011]/10 px-1.5 py-0.2 rounded font-bold border border-[#8c6011]/20">
                  vedantatattvam.com
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Social & Utility Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodedGeneralText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#25D366]/15 border border-[#bf953f]/30 hover:border-[#25D366] text-[#128C7E] transition shadow-2xs hover:scale-105"
              title="Share on WhatsApp (vedantatattvam.com)"
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.923l-1.662 6.077 6.22-1.632c1.704.928 3.659 1.464 5.74 1.464 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.84c-1.899 0-3.666-.549-5.163-1.493l-.37-.234-3.679.965.982-3.585-.256-.407c-1.042-1.656-1.597-3.578-1.597-5.558 0-5.589 4.546-10.136 10.083-10.136 5.539 0 10.046 4.507 10.046 10.046 0 5.539-4.507 10.002-10.046 10.002z"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedXText}&url=${encodedUrl}&hashtags=Vedanta,Sanskrit,Advaita`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#FFFDF8] hover:bg-black/10 border border-[#bf953f]/30 hover:border-black text-[#2D2319] transition shadow-2xs hover:scale-105"
              title="Share on X (Twitter)"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedGeneralText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#229ED9]/15 border border-[#bf953f]/30 hover:border-[#229ED9] text-[#229ED9] transition shadow-2xs hover:scale-105"
              title="Share on Telegram"
            >
              <svg className="w-3.5 h-3.5 fill-[#229ED9]" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.828.942z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#0A66C2]/15 border border-[#bf953f]/30 hover:border-[#0A66C2] text-[#0A66C2] transition shadow-2xs hover:scale-105"
              title="Share on LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-2.5 py-1 rounded-lg border text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedLink
                  ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                  : "bg-[#FFFDF8] hover:bg-[#FAF1E2] border-[#bf953f]/35 text-[#8c6011]"
              }`}
              title="Copy canonical link vedantatattvam.com"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#8c6011]" />}
              <span>{copiedLink ? "Copied" : "Copy"}</span>
            </button>

            {/* QR Code Button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] hover:bg-[#FAF1E2] border border-[#bf953f]/35 text-[#8c6011] text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer"
              title="View QR Code for vedantatattvam.com"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR</span>
            </button>

            {/* Academic Citation Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Academic Citation & Export Format"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#120e0b]" />
              <span>Cite</span>
            </button>

            {/* Expand / Collapse Mahāvākyas & Community Drawer */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/30 text-[#8c6011] transition cursor-pointer ml-0.5"
              title={isExpanded ? "Collapse additional sharing tools" : "Expand Mahāvākya quotes and study circles"}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Optional Drawer for Mahāvākyas & Community */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-[#bf953f]/25 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-150">
            {/* Left: Quick Mahāvākya Share */}
            <div className="p-2.5 rounded-lg bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#8c6011] flex items-center gap-1">
                  <Quote className="w-3 h-3" /> Transmit Mahāvākya:
                </span>
                <span className="text-[10px] font-mono text-[#6e5842]">{selectedMahavakya.source}</span>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {MAHAVAKYAS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMahavakya(m)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition cursor-pointer border ${
                      selectedMahavakya.id === m.id
                        ? "bg-[#8c6011] text-[#FFFDF8] border-[#8c6011] font-bold"
                        : "bg-[#FAF5ED] text-[#5c4731] border-[#bf953f]/30 hover:bg-[#ebd9bd]"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              <div className="p-2 bg-[#FAF5ED] rounded border border-[#bf953f]/20 text-[11px] font-serif leading-snug">
                <div className="font-bold text-[#8c6011]">"{selectedMahavakya.sanskrit}"</div>
                <div className="text-[#2D2319] italic">"{selectedMahavakya.english}"</div>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedQuoteText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded bg-[#25D366] text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#20bd5a] transition"
                >
                  <Share2 className="w-3 h-3" />
                  <span>WhatsApp Quote</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/30 text-[#8c6011] text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedQuote ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedQuote ? "Copied" : "Copy Quote"}</span>
                </button>
              </div>
            </div>

            {/* Right: Study Circles & Newsletter */}
            <div className="p-2.5 rounded-lg bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#8c6011] flex items-center gap-1">
                  <Users className="w-3 h-3" /> Scholarly Study Circles:
                </span>
                <span className="text-[10px] font-mono text-[#6e5842]">Open Access</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <a
                  href="https://t.me/share/url?url=https://vedantatattvam.com&text=Join%20the%20VedantaTattvam%20Scholarly%20Discussion%20Circle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/25 text-[10px] text-[#2D2319] font-mono flex items-center gap-1 transition"
                >
                  <MessageCircle className="w-3 h-3 text-[#229ED9]" />
                  <span>Telegram Forum</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#8c6011]" />
                </a>

                <a
                  href="https://reddit.com/r/AdvaitaVedanta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/25 text-[10px] text-[#2D2319] font-mono flex items-center gap-1 transition"
                >
                  <Flame className="w-3 h-3 text-[#FF4500]" />
                  <span>r/AdvaitaVedanta</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#8c6011]" />
                </a>
              </div>

              {newsletterSubscribed ? (
                <div className="p-1.5 bg-emerald-50 rounded border border-emerald-300 text-[10px] text-emerald-900 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Subscribed to Monthly Vedānta Dispatches</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-1 pt-0.5">
                  <input
                    type="email"
                    required
                    placeholder="scholar@university.edu"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-2 py-1 text-[11px] rounded bg-[#FAF5ED] border border-[#bf953f]/30 font-mono focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] text-[10px] font-bold font-mono transition cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal for Mobile / Classroom Scan */}
      {isQrModalOpen && (
        typeof document !== "undefined" ? (
          createPortal(
            <div
              id="footer-citation-qr-modal"
              style={{ zIndex: 999999 }}
              className="fixed inset-0 z-50 z-[999999] flex items-center justify-center p-3 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-150"
              onClick={() => setIsQrModalOpen(false)}
            >
              <div
                id="footer-citation-qr-content"
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FFFDF8] border-2 border-[#d4af37] rounded-2xl max-w-sm w-full p-4 shadow-xl relative text-center space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#bf953f]/30">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-[#8c6011] text-xs">
                    <QrCode className="w-4 h-4" />
                    <span>Mobile Scan QR Code</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(false)}
                    className="p-1 rounded text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#bf953f]/30 inline-block shadow-inner mx-auto">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR Code for vedantatattvam.com"
                      className="w-48 h-48 mx-auto"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-[#8c6011]">
                      Generating QR Code...
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#8c6011] bg-[#FAF5ED] py-1 px-2 rounded-lg border border-[#bf953f]/30">
                    {CANONICAL_PORTAL_URL}
                  </div>
                  <p className="text-[11px] text-[#5c4731] font-serif">
                    Scan with any smartphone camera to open vedāntatattvaṁ directly.
                  </p>
                </div>

                <div className="pt-1 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#ebd9bd] border border-[#bf953f]/40 text-[#8c6011] text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied" : "Copy URL"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#8c6011] text-[#FFFDF8] text-xs font-serif font-bold transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        ) : null
      )}

      {/* Academic Citation Studio Modal */}
      <AcademicShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareData={academicData}
      />
    </>
  );
}
