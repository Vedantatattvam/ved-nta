import React from "react";
import { TabType } from "../types";
import LogoEmblem from "./LogoEmblem";
import { ALL_FACILITIES } from "./ToolsFacilitiesMenu";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  X,
  BookMarked,
  ShieldCheck,
  Compass,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenGlossary?: () => void;
  onSwitchToSimpleVersion?: () => void;
}

export default function SideNavDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenGlossary,
  onSwitchToSimpleVersion,
}: SideNavDrawerProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2319]/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Side Drawer Panel */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F7EFE1] text-[#2D2319] h-full shadow-[0_0_50px_rgba(140,96,17,0.35)] border-r-2 border-[#bf953f] flex flex-col animate-in slide-in-from-left duration-300">
        {/* Top Gold Bar */}
        <div className="h-2 bg-gradient-to-r from-[#aa771c] via-[#fcf6ba] to-[#aa771c] shadow-[0_0_12px_#bf953f]" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-[#bf953f]/30 bg-[#FFFDF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoEmblem className="w-10 h-10 drop-shadow-[0_2px_8px_rgba(180,130,20,0.3)]" />
            <div>
              <div className="font-serif font-black text-sm uppercase tracking-wider text-[#8c6011]">
                vedāntatattvaṁ
              </div>
              <div className="text-[11px] font-mono text-[#6e5842] font-semibold">
                Facilities & Research Tools
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-[#735013] hover:bg-[#FAF1E2] border border-[#bf953f]/30 hover:border-[#bf953f] transition cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-[#8c6011]" />
              <span className="hidden sm:inline text-[11px]">Collapse</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-[#735013] hover:bg-[#FAF1E2] border border-[#bf953f]/30 hover:border-[#bf953f] transition cursor-pointer"
              title="Close Menu"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4 text-[#8c6011]" />
            </button>
          </div>
        </div>

        {/* Invocation Strip */}
        <div className="px-5 py-2.5 bg-[#FAF1E2] border-b border-[#bf953f]/25 flex items-center justify-between text-xs">
          <span className="font-serif font-bold text-[#8c6011] tracking-wider">
            {transliterate("वन्दे गुरुपरम्पराम्", activeLipi)}
          </span>
          <span className="text-[10px] text-[#6e5842] italic font-serif">
            Lineage of Preceptors
          </span>
        </div>

        {/* Facility Selection List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider px-2 pt-1 pb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Choose Scholarly Facility:</span>
          </div>

          {ALL_FACILITIES.map((facility) => {
            const Icon = facility.icon;
            const isActive = activeTab === facility.id;

            return (
              <button
                key={facility.id}
                type="button"
                onClick={() => {
                  onSelectTab(facility.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer relative group ${
                  isActive
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] border-2 border-[#C59B27] text-[#7A3E00] shadow-[0_4px_16px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                    : "bg-[#FFFDF9] hover:bg-[#FAF3E4] border-[#bf953f]/35 hover:border-[#bf953f] text-[#3D2C1D] shadow-xs"
                }`}
              >
                {/* Active Indicator Accent */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-[#d4af37] to-[#8C4E03] rounded-r" />
                )}

                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-[#d4af37] to-[#c59b27] text-[#120e0b] shadow-xs"
                      : "bg-[#FAF1E2] group-hover:bg-[#f5e5cc] text-[#8c6011] border border-[#bf953f]/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-serif font-black text-sm leading-tight truncate text-[#2D2319]">
                      {facility.title}
                    </h4>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                        isActive
                          ? "bg-[#FAF1E2] text-[#7A3E00] border border-[#d4af37] font-bold"
                          : "bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/30"
                      }`}
                    >
                      {facility.badge}
                    </span>
                  </div>

                  <div
                    className={`text-xs font-serif font-bold mt-1 ${
                      isActive ? "text-[#7A3E00]" : "text-[#8c6011]"
                    }`}
                  >
                    {transliterate(facility.sanskritTitle, activeLipi)}
                  </div>

                  <p
                    className={`text-xs leading-relaxed mt-1.5 ${
                      isActive ? "text-[#5c4731]" : "text-[#6e5842]"
                    }`}
                  >
                    {facility.description}
                  </p>
                </div>

                <div className="shrink-0 self-center">
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive
                        ? "text-[#ffd875] translate-x-1"
                        : "text-[#8c6011] opacity-40 group-hover:opacity-100 group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-[#FAF1E2] border-t border-[#bf953f]/30 space-y-2">
          {onSwitchToSimpleVersion && (
            <button
              onClick={() => {
                onClose();
                onSwitchToSimpleVersion();
              }}
              type="button"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FFFDF5] to-[#FAF1E2] hover:bg-[#FAF1E2] border-2 border-[#C59B27] text-[#7A3E00] font-bold text-xs font-serif rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[#8c6011]" />
              <span>Switch to Simple Version (Sacred Text Only)</span>
            </button>
          )}

          {onOpenGlossary && (
            <button
              onClick={() => {
                onClose();
                onOpenGlossary();
              }}
              type="button"
              className="w-full py-2.5 px-4 bg-[#FFFDF8] hover:bg-[#FAF5ED] border border-[#bf953f]/40 hover:border-[#bf953f] text-[#8c6011] font-bold text-xs font-serif rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <BookMarked className="w-4 h-4 text-[#8c6011]" />
              <span>Explore Vedānta Student Glossary Index</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[10px] text-[#735d45] font-mono pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Prasthānatrayī Academic Core</span>
            </span>
            <span>v2.4 Canon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
