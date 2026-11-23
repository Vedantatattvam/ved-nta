import React, { useState, useEffect } from "react";
import { Scale, MessageSquare, Sparkles, BookOpen, Layers } from "lucide-react";
import ComparativeUtility from "./ComparativeUtility";
import QaUtility from "./QaUtility";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";

interface ComparativeCouncilFacilityProps {
  initialSubTab?: "comparative" | "qa";
  comparativePayload?: string;
  qaPayload?: string;
  onSubTabChange?: (subTab: "comparative" | "qa") => void;
}

export default function ComparativeCouncilFacility({
  initialSubTab = "comparative",
  comparativePayload,
  qaPayload,
  onSubTabChange,
}: ComparativeCouncilFacilityProps) {
  const [activeSubTab, setActiveSubTab] = useState<"comparative" | "qa">(initialSubTab);
  const { transliterate, activeLipi } = useBharatiyaLipi();

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: "comparative" | "qa") => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Option Switcher Banner */}
      <div className="bg-gradient-to-r from-[#FAF5EC] via-[#FFFDF8] to-[#FAF5EC] p-2.5 sm:p-3 rounded-2xl border border-[#bf953f]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#dfb76c] to-[#8c6011] text-[#FFFDF8] shadow-xs shrink-0">
            {activeSubTab === "comparative" ? (
              <Scale className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
              Facility Exegesis Mode
            </span>
            <span className="text-xs font-serif font-bold text-[#2D2319]">
              {activeSubTab === "comparative"
                ? transliterate("साम्प्रदायिक-भाष्य-विमर्शः (Comparative Exegesis)", activeLipi)
                : transliterate("शास्त्रार्थ-परामर्शः (Scholarly Counsel & Dialogue)", activeLipi)}
            </span>
          </div>
        </div>

        {/* 2 Sub-options Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/30 w-full sm:w-auto shadow-2xs">
          <button
            type="button"
            onClick={() => handleSwitchTab("comparative")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
              activeSubTab === "comparative"
                ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/50"
                : "text-[#6e5842] hover:text-[#2D2319] hover:bg-[#FFFDF8]/60"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
            <span>1. Comparative Hermeneutics</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab("qa")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
              activeSubTab === "qa"
                ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/50"
                : "text-[#6e5842] hover:text-[#2D2319] hover:bg-[#FFFDF8]/60"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8c6011]" />
            <span>2. Scholarly Counsel (Q&A)</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-Option */}
      <div className="transition-all duration-200">
        {activeSubTab === "comparative" ? (
          <ComparativeUtility initialVerseOrSutra={comparativePayload} />
        ) : (
          <QaUtility initialPrompt={qaPayload} />
        )}
      </div>
    </div>
  );
}
