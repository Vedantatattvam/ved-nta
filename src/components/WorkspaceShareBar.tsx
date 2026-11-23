import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import AcademicShareModal, { AcademicShareData } from "./AcademicShareModal";
import { CANONICAL_PORTAL_URL } from "../utils/shareUtils";

interface WorkspaceShareBarProps {
  shareData: AcademicShareData;
  variant?: "banner" | "compact" | "inline";
  label?: string;
}

export default function WorkspaceShareBar({
  shareData,
  variant = "banner",
  label = "Share Insight:"
}: WorkspaceShareBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUrl = shareData.url || CANONICAL_PORTAL_URL;

  const shareHeading = shareData.title + (shareData.subtitle ? ` — ${shareData.subtitle}` : "");
  let formattedText = `📜 ${shareHeading}\n`;
  if (shareData.sanskritText) {
    formattedText += `\n"${shareData.sanskritText}"\n`;
  }
  if (shareData.translation) {
    formattedText += `\nTranslation: ${shareData.translation}\n`;
  }
  formattedText += `\nExplore at: ${currentUrl}\n#Vedanta #Sanskrit #Indology #Advaita`;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedShareText = encodeURIComponent(formattedText);
  const encodedXText = encodeURIComponent(
    `${shareHeading}\n${shareData.sanskritText ? `"${shareData.sanskritText.substring(0, 100)}..."` : ""}\n`
  );

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  if (variant === "inline") {
    return (
      <>
        <div className="inline-flex items-center gap-1 bg-[#FFFDF8] p-1 rounded-xl border border-[#C59B27]/30 shadow-2xs">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-[#25D366] hover:bg-[#25D366]/15 transition cursor-pointer"
            title="Share verse/insight on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.923l-1.662 6.077 6.22-1.632c1.704.928 3.659 1.464 5.74 1.464 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.84c-1.899 0-3.666-.549-5.163-1.493l-.37-.234-3.679.965.982-3.585-.256-.407c-1.042-1.656-1.597-3.578-1.597-5.558 0-5.589 4.546-10.136 10.083-10.136 5.539 0 10.046 4.507 10.046 10.046 0 5.539-4.507 10.002-10.046 10.002z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-[#1877F2] hover:bg-[#1877F2]/15 transition cursor-pointer"
            title="Share on Facebook"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.592 0 9 1.582 9 4.615V8z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedXText}&url=${encodedUrl}&hashtags=Vedanta,Sanskrit`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-black hover:bg-black/10 transition cursor-pointer"
            title="Share on X (Twitter)"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              copiedLink ? "bg-emerald-100 text-emerald-800" : "text-[#8c6011] hover:bg-[#FAF1E2]"
            }`}
            title="Copy Direct Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Expand Modal Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
            title="Open Full Citation & Share Studio"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <AcademicShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareData={shareData}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl bg-[#FFFDF8] border border-[#C59B27]/40 shadow-2xs">
        <span className="text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider pl-1.5 pr-0.5 hidden sm:inline">
          {label}
        </span>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedShareText}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-[#25D366] hover:bg-[#25D366]/15 hover:scale-105 transition cursor-pointer"
          title="Share on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.923l-1.662 6.077 6.22-1.632c1.704.928 3.659 1.464 5.74 1.464 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.84c-1.899 0-3.666-.549-5.163-1.493l-.37-.234-3.679.965.982-3.585-.256-.407c-1.042-1.656-1.597-3.578-1.597-5.558 0-5.589 4.546-10.136 10.083-10.136 5.539 0 10.046 4.507 10.046 10.046 0 5.539-4.507 10.002-10.046 10.002z"/>
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-[#1877F2] hover:bg-[#1877F2]/15 hover:scale-105 transition cursor-pointer"
          title="Share on Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.592 0 9 1.582 9 4.615V8z"/>
          </svg>
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedXText}&url=${encodedUrl}&hashtags=Vedanta,Sanskrit`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-black hover:bg-black/10 hover:scale-105 transition cursor-pointer"
          title="Share on X (Twitter)"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-serif font-bold transition cursor-pointer ${
            copiedLink
              ? "bg-emerald-100 border border-emerald-400 text-emerald-900 shadow-2xs"
              : "bg-[#FAF2E3] hover:bg-[#ebd8b6] text-[#7A3E00] border border-[#C59B27]/40"
          }`}
          title="Copy Link to Clipboard"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-[#8c6011]" />}
          <span className="hidden sm:inline">{copiedLink ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* Full Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/30 transition cursor-pointer"
          title="More Share & Citation Options"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <AcademicShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareData={shareData}
      />
    </>
  );
}
