import React from "react";
import { TabType } from "../types";
import LogoEmblem from "./LogoEmblem";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Globe2,
  Cpu,
  GraduationCap,
  Users,
  Feather,
  GitFork,
  Library,
  Scale,
  HeartHandshake,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface AboutUsFacilityProps {
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
}

export default function AboutUsFacility({ onNavigateToTab }: AboutUsFacilityProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner with Logo & Golden Ambience */}
      <div className="card-3d-gold p-6 sm:p-10 relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5EADB]">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-radial from-[#dfb76c]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-radial from-[#dfb76c]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left">
          <div className="shrink-0 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37] to-[#aa771c] rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative bg-white p-3 rounded-full border-2 border-[#bf953f] shadow-lg">
              <LogoEmblem className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_4px_12px_rgba(180,130,20,0.35)]" />
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF1E2] border border-[#bf953f]/40 text-[#8c6011] text-xs font-mono font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT VEDĀNTATATTVAM</span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#2D2319] tracking-wide gold-text-gradient uppercase leading-tight">
              VedantaTattvam.com
            </h1>

            <p className="font-serif text-sm sm:text-base text-[#8c6011] font-bold italic">
              "Digitizing Eternal Wisdom for the Digital Age."
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#5c4731] font-mono">
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-lg border border-[#bf953f]/25">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Open Non-Sectarian Access</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-lg border border-[#bf953f]/25">
                <Globe2 className="w-4 h-4 text-[#8c6011]" />
                <span>Global Vedānta Research</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-lg border border-[#bf953f]/25">
                <Cpu className="w-4 h-4 text-indigo-700" />
                <span>Prasthānatrayī Digital Core</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="card-3d-gold p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#bf953f]/25 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/30 text-[#8c6011]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#2D2319] tracking-wide">
                Our Mission
              </h2>
              <div className="text-xs font-serif font-bold text-[#8c6011]">
                {transliterate("ध्येयवाक्यम् एवं सङ्कल्पः", activeLipi)} (Preserving & Disseminating Timeless Insight)
              </div>
            </div>
          </div>
        </div>

        {/* Mission Content */}
        <div className="space-y-4 text-sm sm:text-base text-[#382b1f] leading-relaxed font-cardo">
          <p className="bg-[#FAF5ED] p-4 sm:p-5 rounded-2xl border-l-4 border-[#8c6011] text-[#2D2319] shadow-xs">
            At <strong className="font-serif text-[#8c6011] font-black">VedantaTattvam.com</strong>, our mission is to preserve, digitize, and disseminate the profound knowledge embedded in the Vedantic tradition, irrespective of its school of thought—be it <em>Advaita</em>, <em>Vishishtadvaita</em>, <em>Dvaita</em>, <em>Shuddhadvaita</em>, <em>Achintya Bheda Abheda</em>, <em>Śāktaviśiṣṭādvaita</em>, or others.
          </p>

          <p>
            We are committed to creating a comprehensive, accessible, and authentic digital archive of Vedantic scriptures, commentaries, and related works. By doing so, we aim to bridge the gap between timeless spiritual wisdom and the modern digital world, empowering scholars, practitioners, and seekers worldwide with reliable and curated content.
          </p>

          <p className="italic text-[#5c4731] border-t border-[#bf953f]/20 pt-3">
            "Our mission is not just about digitization—it's about honoring the diversity, depth, and dialogue inherent in the Vedantic tradition and making that wealth of insight available to all."
          </p>
        </div>

        {/* 3 Mission Pillar Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white border border-[#bf953f]/30 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#8c6011] font-serif font-bold text-sm">
              <Users className="w-4 h-4 text-[#8c6011]" />
              <span>Universal & Inclusive</span>
            </div>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Equitably representing classical traditions alongside regional developments, from Śaṅkara to Bengal's Śāktaviśiṣṭādvaita.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#bf953f]/30 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#8c6011] font-serif font-bold text-sm">
              <BookOpen className="w-4 h-4 text-[#8c6011]" />
              <span>Authentic Digital Archive</span>
            </div>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Preserving original Sanskrit recensions with grammatical word-analysis, multi-script typography, and authoritative bhāṣyas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#bf953f]/30 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#8c6011] font-serif font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-[#8c6011]" />
              <span>Bridging Wisdom & Technology</span>
            </div>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Empowering modern seekers, research institutions, and traditional scholars with AI-assisted hermeneutics and multi-script tools.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="card-3d-gold p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#bf953f]/25 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/30 text-[#8c6011]">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#2D2319] tracking-wide">
                Our Vision
              </h2>
              <div className="text-xs font-serif font-bold text-[#8c6011]">
                {transliterate("दूरदर्शिता एवं भविष्य-दर्शनम्", activeLipi)} (The Definitive Digital Hub for Vedāntic Literature)
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#382b1f] leading-relaxed font-cardo">
          Our vision is to become the definitive digital hub for Vedantic literature, fostering a platform that:
        </p>

        {/* 5 Vision Bullet Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#bf953f]/35 flex gap-3 items-start shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#FAF1E2] text-[#8c6011] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#bf953f]/30">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Shared Scriptural Heritage Without Bias
              </h3>
              <p className="text-xs text-[#5c4731] leading-relaxed">
                Unites all schools of Vedanta under a shared respect for scriptural heritage, without bias or sectarianism.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#bf953f]/35 flex gap-3 items-start shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#FAF1E2] text-[#8c6011] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#bf953f]/30">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Cross-School Understanding & Comparative Study
              </h3>
              <p className="text-xs text-[#5c4731] leading-relaxed">
                Encourages cross-school understanding and comparative study, deepening the appreciation of Vedanta’s philosophical richness.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#bf953f]/35 flex gap-3 items-start shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#FAF1E2] text-[#8c6011] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#bf953f]/30">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Free and Open Universal Access
              </h3>
              <p className="text-xs text-[#5c4731] leading-relaxed">
                Provides free and open access to digitized manuscripts, translations, commentaries, and original Sanskrit texts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#bf953f]/35 flex gap-3 items-start shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-[#FAF1E2] text-[#8c6011] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#bf953f]/30">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Academic Research & Spiritual Inquiry
              </h3>
              <p className="text-xs text-[#5c4731] leading-relaxed">
                Supports academic research, spiritual inquiry, and cultural preservation by offering resources that are both authentic and well-organized.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#bf953f]/35 flex gap-3 items-start shadow-xs md:col-span-2">
            <div className="w-7 h-7 rounded-lg bg-[#FAF1E2] text-[#8c6011] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#bf953f]/30">
              5
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Modern Technology & Global Longevity
              </h3>
              <p className="text-xs text-[#5c4731] leading-relaxed">
                Embraces modern technology to ensure the longevity, accessibility, and global reach of Vedantic wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Culmination Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF1E2] via-[#FFFDF8] to-[#FAF1E2] border border-[#bf953f]/40 text-center space-y-3">
          <div className="font-serif text-lg sm:text-xl font-bold text-[#8c6011]">
            {transliterate("तत्त्वमसि", activeLipi)} — "That Thou Art"
          </div>
          <p className="text-xs sm:text-sm text-[#4a3928] leading-relaxed max-w-3xl mx-auto font-serif">
            We envision a world where Vedantic teachings are preserved for future generations, where scholars collaborate across traditions, and where seekers can explore the essence of Vedanta—<strong>Tattvamasi: “That Thou Art”</strong>—in the language and medium of their time.
          </p>
        </div>
      </div>

      {/* Credits & Curation Acknowledgement Card */}
      <div className="card-3d-gold p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#bf953f]/25 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF1E2] border border-[#bf953f]/30 text-[#8c6011]">
              <Feather className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl text-[#2D2319] tracking-wide">
                Project Credits & Scholarly Curation
              </h2>
              <div className="text-xs font-serif font-bold text-[#8c6011]">
                प्रकल्प-निर्माणम् एवं सम्पादनम्
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Creator / Designer */}
          <div className="p-5 rounded-2xl bg-white border border-[#bf953f]/35 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF1E2] text-[#8c6011] font-serif font-bold flex items-center justify-center border border-[#bf953f]/30 text-base">
                BG
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold">
                  Design, Architecture & Development
                </div>
                <h3 className="font-serif font-black text-base text-[#2D2319]">
                  Buddhodev Ghosh
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Site architecture, interactive digital facilities, multi-script Indic typography engines, and Bengal Vedānta 75-scholar socio-spiritual classification matrix.
            </p>
          </div>

          {/* Academic Curator */}
          <div className="p-5 rounded-2xl bg-white border border-[#bf953f]/35 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF1E2] text-[#8c6011] font-serif font-bold flex items-center justify-center border border-[#bf953f]/30 text-base">
                SA
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold">
                  Scholarly Curation & Exegesis
                </div>
                <h3 className="font-serif font-black text-base text-[#2D2319]">
                  Dr. Saibal Acharya
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Hermeneutic validation, canonical text curation across traditional prasthānas, scriptural commentary accuracy, and academic rigor.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Portal */}
      {onNavigateToTab && (
        <div className="card-3d-gold p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8c6011]" />
              <h3 className="font-serif font-bold text-sm text-[#2D2319]">
                Explore Key Facilities on VedantaTattvam.com
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8c6011]">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => onNavigateToTab("mapping")}
              className="p-3 rounded-xl bg-white hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-left transition flex flex-col justify-between group cursor-pointer shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-[#8c6011]" />
                  <ArrowRight className="w-3 h-3 text-[#8c6011] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="font-serif font-bold text-xs text-[#2D2319] mt-2">
                  Granthasāraṇī Canon
                </div>
              </div>
              <div className="text-[10px] text-[#6e5842] mt-1 font-mono">
                Primary Texts & Reader
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab("tree")}
              className="p-3 rounded-xl bg-white hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-left transition flex flex-col justify-between group cursor-pointer shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <GitFork className="w-4 h-4 text-[#8c6011]" />
                  <ArrowRight className="w-3 h-3 text-[#8c6011] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="font-serif font-bold text-xs text-[#2D2319] mt-2">
                  Knowledge Tree
                </div>
              </div>
              <div className="text-[10px] text-[#6e5842] mt-1 font-mono">
                Paramparā & Timeline
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab("bengal_vedanta")}
              className="p-3 rounded-xl bg-white hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-left transition flex flex-col justify-between group cursor-pointer shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Library className="w-4 h-4 text-[#8c6011]" />
                  <ArrowRight className="w-3 h-3 text-[#8c6011] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="font-serif font-bold text-xs text-[#2D2319] mt-2">
                  Bengal Vedānta
                </div>
              </div>
              <div className="text-[10px] text-[#6e5842] mt-1 font-mono">
                75 Thinkers & Cell
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab("comparative")}
              className="p-3 rounded-xl bg-white hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-left transition flex flex-col justify-between group cursor-pointer shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Scale className="w-4 h-4 text-[#8c6011]" />
                  <ArrowRight className="w-3 h-3 text-[#8c6011] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="font-serif font-bold text-xs text-[#2D2319] mt-2">
                  Comparative Bhāṣya
                </div>
              </div>
              <div className="text-[10px] text-[#6e5842] mt-1 font-mono">
                Cross-School Exegesis
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
