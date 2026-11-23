import React, { useState } from "react";
import { TabType } from "../types";
import LogoEmblem from "./LogoEmblem";
import ToolsFacilitiesMenu, { ALL_FACILITIES } from "./ToolsFacilitiesMenu";
import BharatiyaLipiSwitcher from "./BharatiyaLipiSwitcher";
import GlobalTextSearch from "./GlobalTextSearch";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  Menu,
  BookMarked,
  Search,
  X,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface TopNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType, payload?: any) => void;
  onOpenDrawer: () => void;
  onOpenGlossary?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
  previousPageTitle?: string;
  currentPageTitle?: string;
  siteVersion?: "scholarly" | "simple";
  onToggleSiteVersion?: (version: "scholarly" | "simple") => void;
}

export default function TopNavBar({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  onOpenGlossary,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  previousPageTitle,
  currentPageTitle,
  siteVersion = "scholarly",
  onToggleSiteVersion,
}: TopNavBarProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { transliterate, activeLipi } = useBharatiyaLipi();

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#bf953f]/30 shadow-[0_4px_20px_rgba(160,110,20,0.08)] transition-all">
      {/* Top Gold Foil Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#aa771c] via-[#fcf6ba] to-[#aa771c] w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Left Brand Identity and Back/Forward Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              onClick={() => onSelectTab("tree")}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              title="Return to Paramparā Knowledge Tree"
            >
              <LogoEmblem className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_2px_8px_rgba(180,130,20,0.3)] group-hover:scale-105 transition-transform" />
              <div className="hidden xs:block">
                <div className="font-serif font-black text-sm sm:text-base gold-text-gradient tracking-wider uppercase leading-none">
                  vedāntatattvaṁ
                </div>
                <div className="text-[10px] font-mono text-[#8c6011] tracking-tight font-semibold mt-0.5">
                  {transliterate("वन्दे गुरुपरम्पराम्", activeLipi)}
                </div>
              </div>
            </div>

            {/* In-App Back & Forward Navigation Controls */}
            <div className="flex items-center gap-1 pl-1 border-l border-[#bf953f]/25 ml-1 sm:ml-2">
              <button
                type="button"
                onClick={onGoBack}
                disabled={!canGoBack}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-xs font-serif font-bold transition-all duration-150 ${
                  canGoBack
                    ? "bg-[#FFFDF9] hover:bg-[#FAF1E2] text-[#7A3E00] border-[#bf953f]/60 hover:border-[#bf953f] cursor-pointer shadow-xs active:scale-95"
                    : "opacity-30 cursor-not-allowed bg-transparent text-[#998066] border-transparent pointer-events-none"
                }`}
                title={
                  canGoBack
                    ? previousPageTitle
                      ? `Back to: ${previousPageTitle}`
                      : "Go to previously opened page or option"
                    : "No previous page in history"
                }
                aria-label="Go to previously opened page or option"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#8c6011]" />
                <span className="hidden md:inline font-semibold">Back</span>
              </button>

              {canGoForward && (
                <button
                  type="button"
                  onClick={onGoForward}
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-[#bf953f]/60 bg-[#FFFDF9] hover:bg-[#FAF1E2] text-[#7A3E00] transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Forward to next page or option"
                  aria-label="Forward to next page or option"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#8c6011]" />
                </button>
              )}
            </div>
          </div>

          {/* Center Tabs: Desktop Horizontal Direct Menu with Warm Parchment & Gold Aesthetic */}
          <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto py-1">
            {ALL_FACILITIES.map((facility) => {
              const Icon = facility.icon;
              const isActive = activeTab === facility.id;
              return (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => onSelectTab(facility.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                      : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] hover:text-[#1F140A] border border-[#bf953f]/35 shadow-xs"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#7A3E00]" : "text-[#8c6011]"}`} />
                  <span>{facility.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Menu Suite */}
          <div className="flex items-center gap-2">
            {/* Version Switcher (Simple vs Scholarly) */}
            {onToggleSiteVersion && (
              <div 
                id="site-version-toggle-scholarly"
                className="flex items-center p-0.5 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/40 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => onToggleSiteVersion("simple")}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                    siteVersion === "simple"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs"
                      : "text-[#8c6011] hover:text-[#5c4731]"
                  }`}
                  title="Switch to Simple Sacred Text Reader (Text Only)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span className="hidden sm:inline">Simple</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSiteVersion("scholarly")}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                    siteVersion === "scholarly"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/40"
                      : "text-[#8c6011] hover:text-[#5c4731]"
                  }`}
                  title="Currently in Scholarly Research Version (Full Suite)"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#8c6011]" />
                  <span className="hidden sm:inline">Scholarly</span>
                </button>
              </div>
            )}

            {/* Quick Full-Text Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FAF5ED] hover:bg-[#f3e5ce] text-[#8c6011] text-xs font-bold font-mono transition shadow-xs cursor-pointer group"
              title="Search all Vedāntic verses, sūtras & texts (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#8c6011] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-block text-[9px] bg-white px-1.5 py-0.5 rounded border border-[#bf953f]/30 text-[#8c6011]">
                ⌘K
              </kbd>
            </button>

            {/* Quick Bharatiya Lipi & Font Changer Popover Button */}
            <BharatiyaLipiSwitcher
              onOpenFacility={() => onSelectTab("bharatiya_lipi")}
            />

            {/* Tools & Facilities Dropdown Menu (Accessible Everywhere) */}
            <ToolsFacilitiesMenu
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onOpenDrawer={onOpenDrawer}
              onOpenGlossary={onOpenGlossary}
              buttonLabel="Facilities"
              variant="compact"
            />

            {/* Quick Glossary Index Button */}
            {onOpenGlossary && (
              <button
                type="button"
                onClick={onOpenGlossary}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] hover:bg-[#FAF1E2] text-[#735013] hover:text-[#2D2319] text-xs font-serif font-bold transition shadow-sm cursor-pointer"
                title="Open Vedānta Glossary & Lexicon"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#8c6011]" />
                <span className="hidden md:inline">Glossary</span>
              </button>
            )}

            {/* Side Drawer Toggle (Full Facilities Catalog) */}
            <button
              type="button"
              onClick={onOpenDrawer}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#bf953f]/40 bg-[#FAF1E2] hover:bg-[#f3e5ce] text-[#8c6011] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Open Full Side Navigation Drawer"
            >
              <Menu className="w-4 h-4 text-[#8c6011]" />
              <span className="hidden sm:inline font-mono">Drawer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Text Search Modal Dialog if triggered from Navbar */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-[#2D2319]/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FFFDF8] border-2 border-[#bf953f]/80 rounded-2xl max-w-2xl w-full p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.35)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#bf953f]/30">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8c6011]" />
                <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                  Universal Vedāntic Canon Search
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-[#8c6011] hover:bg-[#FAF1E2] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <GlobalTextSearch
              onSelectResult={(tab, payload) => {
                setIsSearchModalOpen(false);
                onSelectTab(tab, payload);
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

