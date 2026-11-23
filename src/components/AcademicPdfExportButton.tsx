import { useState } from "react";
import { FileDown, Printer, Check, Sparkles, Loader2 } from "lucide-react";

interface AcademicPdfExportButtonProps {
  onExportPdf: () => Promise<void> | void;
  label?: string;
  className?: string;
  variant?: "primary" | "secondary" | "compact" | "icon";
  title?: string;
}

export function AcademicPdfExportButton({
  onExportPdf,
  label = "Export Academic PDF",
  className = "",
  variant = "secondary",
  title = "Export as formatted PDF document for academic & research use",
}: AcademicPdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await Promise.resolve(onExportPdf());
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2200);
    } catch (err) {
      console.error("PDF Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className={`p-2 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#8c6011] transition shadow-sm cursor-pointer disabled:opacity-50 ${className}`}
        title={title}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#8c6011]" />
        ) : isSuccess ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <FileDown className="w-4 h-4 text-[#8c6011]" />
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#bf953f]/35 bg-[#FAF1E2] hover:bg-[#f3e5ce] text-[#8c6011] text-xs font-mono font-bold transition shadow-2xs cursor-pointer disabled:opacity-50 ${className}`}
        title={title}
      >
        {isExporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isSuccess ? (
          <Check className="w-3.5 h-3.5 text-emerald-700" />
        ) : (
          <FileDown className="w-3.5 h-3.5" />
        )}
        <span>{isSuccess ? "PDF Generated!" : label}</span>
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] text-[#120e0b] border border-[#ffe680] font-bold text-xs font-serif shadow-md hover:brightness-105 transition cursor-pointer disabled:opacity-50 ${className}`}
        title={title}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#120e0b]" />
        ) : isSuccess ? (
          <Check className="w-4 h-4 text-emerald-900" />
        ) : (
          <FileDown className="w-4 h-4 text-[#120e0b]" />
        )}
        <span>{isSuccess ? "Academic PDF Ready!" : label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] hover:text-[#2D2319] font-bold text-xs font-serif transition shadow-sm cursor-pointer disabled:opacity-50 ${className}`}
      title={title}
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8c6011]" />
      ) : isSuccess ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <FileDown className="w-3.5 h-3.5 text-[#8c6011]" />
      )}
      <span>{isSuccess ? "Exported!" : label}</span>
    </button>
  );
}
