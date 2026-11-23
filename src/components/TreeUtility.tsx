import { useState } from "react";
import { PARAMPARA_TRADITIONS, VEDIC_ROOT_INFO } from "../paramparaData";
import { PRESEEDED_GRANTHAS } from "../data";
import { GuruNode, ParamparaId, ParamparaTradition, TabType, TextEntry } from "../types";
import { 
  GitFork, 
  BookOpen, 
  Crown, 
  Scroll, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  ArrowRight,
  Flame,
  Search,
  ExternalLink,
  ShieldCheck,
  History,
  Scale
} from "lucide-react";
import { CitationButton } from "./CitationButton";
import { GlossaryHover } from "./GlossaryHover";
import TextReaderView from "./TextReaderView";
import { VedantaTimeline } from "./VedantaTimeline";
import ParamparaFlowChart from "./ParamparaFlowChart";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";

interface TreeUtilityProps {
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
  onOpenFacilitiesDrawer?: () => void;
}

export default function TreeUtility({
  onNavigateToTab,
  onOpenFacilitiesDrawer,
}: TreeUtilityProps) {
  const { transliterate, activeLipi, getTypographyStyle } = useBharatiyaLipi();
  const [activeViewMode, setActiveViewMode] = useState<"flowchart" | "tree" | "timeline" | "matrix">("flowchart");
  const [selectedParamparaId, setSelectedParamparaId] = useState<ParamparaId | "all">("advaita");
  const [selectedGuru, setSelectedGuru] = useState<GuruNode | null>(null);
  const [showVedicRoot, setShowVedicRoot] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [compareTraditionA, setCompareTraditionA] = useState<ParamparaId>("advaita");
  const [compareTraditionB, setCompareTraditionB] = useState<ParamparaId>("visistadvaita");
  const [compareTraditionC, setCompareTraditionC] = useState<ParamparaId>("saktavisistadvaita");

  // Reader state if a user clicks to read a canonical grantha directly from the tree
  const [readingGrantha, setReadingGrantha] = useState<TextEntry | null>(null);

  const activeTradition = PARAMPARA_TRADITIONS.find((p) => p.id === selectedParamparaId) || PARAMPARA_TRADITIONS[0];

  // Filtered traditions based on search
  const filteredTraditions = PARAMPARA_TRADITIONS.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.devanagariName.toLowerCase().includes(q) ||
      t.founderOrPreceptor.toLowerCase().includes(q) ||
      t.primaryPhilosophy.toLowerCase().includes(q) ||
      t.coreDoctrine.toLowerCase().includes(q) ||
      t.keyGurus.some((g) => g.name.toLowerCase().includes(q) || g.devanagariName.toLowerCase().includes(q) || g.keyWorks.some(w => w.toLowerCase().includes(q)))
    );
  });

  if (readingGrantha) {
    return (
      <TextReaderView
        grantha={readingGrantha}
        onBack={() => setReadingGrantha(null)}
        onNavigateToTab={onNavigateToTab}
        onOpenFacilitiesDrawer={onOpenFacilitiesDrawer}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="card-3d-gold p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitFork className="w-6 h-6 text-[#8c6011]" />
              <h2 className="font-serif font-bold text-xl sm:text-2xl gold-text-gradient">
                Vedānta Paramparā Jñāna-Vṛkṣa & Kāla-Krama
              </h2>
            </div>
            <p className="text-sm text-[#4a3928] leading-relaxed max-w-3xl">
              The Comprehensive Knowledge Tree & Historical Timeline of all classical and modern Vedānta lineages. Trace the unbroken succession of Vedic origins, classical Ācāryas, sub-commentarial traditions (Prasthānatrayī), Śāktaviśiṣṭādvaita, and modern Navyānubhava Vedānta renaissance masters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab?.("sastrartha")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-amber-700 to-amber-900 text-white hover:from-amber-800 hover:to-amber-950 border border-amber-500/50 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Śāstrārtha Sabha</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="mt-5 pt-4 border-t border-[#bf953f]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF1E2] p-1 rounded-xl border border-[#bf953f]/30">
            <button
              type="button"
              onClick={() => setActiveViewMode("flowchart")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "flowchart"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                  : "text-[#6e5842] hover:text-[#2D2319]"
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Interactive Flow Chart (Recharts)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode("tree")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "tree"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                  : "text-[#6e5842] hover:text-[#2D2319]"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Paramparā Tree</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode("timeline")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "timeline"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                  : "text-[#6e5842] hover:text-[#2D2319]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historical Epochs (3500+ Yrs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode("matrix")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === "matrix"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                  : "text-[#6e5842] hover:text-[#2D2319]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dialectical Matrix</span>
            </button>
          </div>

          {activeViewMode === "tree" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVedicRoot(!showVedicRoot)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/80 hover:bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Flame className="w-3 h-3" />
                <span>{showVedicRoot ? "Hide Vedic Root" : "View Vedic Root"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Search */}
        {activeViewMode === "tree" && (
          <div className="mt-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-[#8c6011] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by master, work, doctrine (e.g. 'Pañcānana', 'Vivekananda', 'Bhamati', 'Prapatti', 'Ajativada')..."
              className="w-full bg-[#FFFDF9] border border-[#bf953f]/30 rounded-lg px-3 py-1.5 text-xs text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#8c6011] hover:underline shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* VIEW 0: RECHARTS INTERACTIVE PARAMPARA SUCCESSION FLOW DIAGRAM & TIMELINE */}
      {activeViewMode === "flowchart" && (
        <ParamparaFlowChart
          onSelectTradition={(tid) => {
            setSelectedParamparaId(tid);
            setActiveViewMode("tree");
          }}
          onOpenGrantha={(gid) => {
            const found = PRESEEDED_GRANTHAS.find((g) => g.id === gid);
            if (found) {
              setReadingGrantha(found);
            }
          }}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* VIEW 1: HISTORICAL VISUAL TIMELINE */}
      {activeViewMode === "timeline" && (
        <VedantaTimeline
          onSelectTradition={(tid) => {
            setSelectedParamparaId(tid);
            setActiveViewMode("tree");
          }}
          onOpenGrantha={(gid) => {
            const found = PRESEEDED_GRANTHAS.find(g => g.id === gid);
            if (found) {
              setReadingGrantha(found);
            }
          }}
        />
      )}

      {/* VIEW 2: DIALECTICAL COMPARISON MATRIX */}
      {activeViewMode === "matrix" && (
        <div className="card-3d-gold p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8c6011]" />
              <h3 className="font-serif font-bold text-lg text-[#2D2319]">
                Comparative Dialectical Matrix of Vedānta Traditions
              </h3>
            </div>
            <div className="text-xs text-[#6e5842] font-mono">
              Compare 3 Traditions Simultaneously
            </div>
          </div>

          {/* Selectors for 3 Traditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#8c6011] font-mono block mb-1">Column A:</label>
              <select
                value={compareTraditionA}
                onChange={(e) => setCompareTraditionA(e.target.value as ParamparaId)}
                className="w-full bg-[#FAF1E2] border border-[#bf953f]/40 rounded-lg p-2 text-xs font-serif text-[#2D2319]"
              >
                {PARAMPARA_TRADITIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#8c6011] font-mono block mb-1">Column B:</label>
              <select
                value={compareTraditionB}
                onChange={(e) => setCompareTraditionB(e.target.value as ParamparaId)}
                className="w-full bg-[#FAF1E2] border border-[#bf953f]/40 rounded-lg p-2 text-xs font-serif text-[#2D2319]"
              >
                {PARAMPARA_TRADITIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#8c6011] font-mono block mb-1">Column C:</label>
              <select
                value={compareTraditionC}
                onChange={(e) => setCompareTraditionC(e.target.value as ParamparaId)}
                className="w-full bg-[#FAF1E2] border border-[#bf953f]/40 rounded-lg p-2 text-xs font-serif text-[#2D2319]"
              >
                {PARAMPARA_TRADITIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto border border-[#bf953f]/30 rounded-xl shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FAF1E2] font-mono text-[#8c6011] uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-r border-[#bf953f]/20 w-1/4">Philosophical Dimension</th>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return (
                      <th key={idx} className="p-3 border-b border-r border-[#bf953f]/20 font-serif font-bold text-sm text-[#2D2319]">
                        <div>{trad?.name}</div>
                        <div className="text-[10px] text-[#8c6011] font-sans font-normal">{trad?.englishTitle}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bf953f]/15 bg-white">
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Primary Philosophy
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return <td key={idx} className="p-3 border-r border-[#bf953f]/20 text-[#2D2319] font-medium">{trad?.primaryPhilosophy}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Core Preceptors & Founders
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return <td key={idx} className="p-3 border-r border-[#bf953f]/20 text-[#4a3928]">{trad?.founderOrPreceptor}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Cosmic Reality Model (Jagat)
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return <td key={idx} className="p-3 border-r border-[#bf953f]/20 text-[#4a3928] leading-relaxed">{trad?.realityModel}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Jīva-Brahman Relationship
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return <td key={idx} className="p-3 border-r border-[#bf953f]/20 text-[#4a3928] leading-relaxed">{trad?.jivaBrahmanRelation}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Direct Means to Mukti / Liberation
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    return <td key={idx} className="p-3 border-r border-[#bf953f]/20 text-[#4a3928] leading-relaxed">{trad?.mokshaMeans}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold font-mono text-[#8c6011] border-r border-[#bf953f]/20 bg-[#FAFDF8]">
                    Primary Canonical Granthas
                  </td>
                  {[compareTraditionA, compareTraditionB, compareTraditionC].map((tid, idx) => {
                    const trad = PARAMPARA_TRADITIONS.find((t) => t.id === tid);
                    const granthas = PRESEEDED_GRANTHAS.filter((g) => g.paramparaId === tid);
                    return (
                      <td key={idx} className="p-3 border-r border-[#bf953f]/20">
                        <div className="space-y-1">
                          {granthas.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setReadingGrantha(g)}
                              className="text-[11px] font-serif text-[#8c6011] hover:text-[#52380a] hover:underline flex items-center gap-1 text-left cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span>{g.title}</span>
                            </button>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PARAMPARA KNOWLEDGE TREE */}
      {activeViewMode === "tree" && (
        <>
          {/* Vedic Root Card (Prasthānatrayī) */}
          {showVedicRoot && (
            <div className="card-3d-gold p-5 bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E6] to-[#F5E7D0] border-2 border-[#bf953f]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8c6011] text-[#fff8ea] flex items-center justify-center font-bold text-xs shadow-inner">
                    ॐ
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2D2319] flex items-center gap-2">
                      <span>{transliterate(VEDIC_ROOT_INFO.devanagariName, activeLipi)}</span>
                      <span className="text-xs text-[#8c6011] font-sans font-normal">({VEDIC_ROOT_INFO.name})</span>
                    </h3>
                    <p className="text-xs text-[#6e5842]">{VEDIC_ROOT_INFO.description}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#bf953f]/20 text-[#8c6011] rounded-full border border-[#bf953f]/30">
                  Fountainhead
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3">
                {VEDIC_ROOT_INFO.threePrasthānas.map((prasthana, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/80 border border-[#bf953f]/30 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-serif text-[#8c6011]">
                        {transliterate(prasthana.sanskritName, activeLipi)}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF1E2] text-[#6e5842] border border-[#bf953f]/20">
                        Prasthāna {idx + 1}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#2D2319]">{prasthana.name}</div>
                    <div className="text-[11px] text-[#6e5842]"><strong className="text-[#4a3928]">Authority:</strong> {prasthana.authority}</div>
                    <p className="text-[11px] text-[#4a3928] leading-snug">{prasthana.significance}</p>
                    <div className="pt-1.5 border-t border-[#bf953f]/20 flex flex-wrap gap-1">
                      {prasthana.coreTexts.map((text, tidx) => {
                        const isIso = text === "Īśa" || text === "Īśāvāsyopaniṣad";
                        const isKena = text === "Kena" || text === "Kenopaniṣad";
                        const isKatha = text === "Kaṭha" || text === "Kaṭhopaniṣad" || text === "Kathopanisad";
                        const isPrasna = text === "Praśna" || text === "Praśnopaniṣad" || text === "Prasnopanisad";
                        const isMundaka = text === "Muṇḍaka" || text === "Muṇḍakopaniṣad" || text === "Mundakopanisad";
                        const isMandukya = text === "Māṇḍūkya" || text === "Māṇḍūkyopaniṣad" || text === "Mandukyopanisad";
                        const isAitareya = text === "Aitareya" || text === "Aitareyopaniṣad" || text === "Aitareya Upaniṣad";
                        const isTaittiriya = text === "Taittirīya" || text === "Taittirīyopaniṣad" || text === "Taittiriya Upaniṣad";
                        const isChandogya = text === "Chāndogya" || text === "Chāndogyopaniṣad" || text === "Chandogya Upaniṣad";
                        const isBrhadaranyaka = text === "Bṛhadāraṇyaka" || text === "Bṛhadāraṇyakopaniṣad" || text === "Brhadaranyaka" || text === "Brhadaranyakopanisad";
                        const isBrahmasutra = text.toLowerCase().includes("brahma sūtra") || text.toLowerCase().includes("brahmasutra") || text === "Brahma Sūtras";
                        const isGita = text.toLowerCase().includes("bhagavad gītā") || text.toLowerCase().includes("gītā") || text.toLowerCase().includes("gita");
                        const isAvailable = isIso || isKena || isKatha || isPrasna || isMundaka || isMandukya || isAitareya || isTaittiriya || isChandogya || isBrhadaranyaka || isBrahmasutra || isGita;
                        return (
                          <span
                            key={tidx}
                            onClick={() => {
                              if (isIso) {
                                const iso = PRESEEDED_GRANTHAS.find((g) => g.id === "isopanisad");
                                if (iso) setReadingGrantha(iso);
                              } else if (isKena) {
                                const kena = PRESEEDED_GRANTHAS.find((g) => g.id === "kenopanisad");
                                if (kena) setReadingGrantha(kena);
                              } else if (isKatha) {
                                const katha = PRESEEDED_GRANTHAS.find((g) => g.id === "kathopanisad");
                                if (katha) setReadingGrantha(katha);
                              } else if (isPrasna) {
                                const prasna = PRESEEDED_GRANTHAS.find((g) => g.id === "prasnopanisad");
                                if (prasna) setReadingGrantha(prasna);
                              } else if (isMundaka) {
                                const mundaka = PRESEEDED_GRANTHAS.find((g) => g.id === "mundakopanisad");
                                if (mundaka) setReadingGrantha(mundaka);
                              } else if (isMandukya) {
                                const mandukya = PRESEEDED_GRANTHAS.find((g) => g.id === "mandukyopanisad");
                                if (mandukya) setReadingGrantha(mandukya);
                              } else if (isAitareya) {
                                const aitareya = PRESEEDED_GRANTHAS.find((g) => g.id === "aitareyopanisad");
                                if (aitareya) setReadingGrantha(aitareya);
                              } else if (isTaittiriya) {
                                const taittiriya = PRESEEDED_GRANTHAS.find((g) => g.id === "taittiriyopanisad");
                                if (taittiriya) setReadingGrantha(taittiriya);
                              } else if (isChandogya) {
                                const chandogya = PRESEEDED_GRANTHAS.find((g) => g.id === "chandogyopanisad");
                                if (chandogya) setReadingGrantha(chandogya);
                              } else if (isBrhadaranyaka) {
                                const brhadaranyaka = PRESEEDED_GRANTHAS.find((g) => g.id === "brhadaranyakopanisad");
                                if (brhadaranyaka) setReadingGrantha(brhadaranyaka);
                              } else if (isBrahmasutra) {
                                const bs = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra");
                                if (bs) setReadingGrantha(bs);
                              } else if (isGita) {
                                const gita = PRESEEDED_GRANTHAS.find((g) => g.id === "bhagavadgita");
                                if (gita) setReadingGrantha(gita);
                              }
                            }}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                              isAvailable
                                ? "bg-[#8c6011] text-[#fff8ea] font-semibold cursor-pointer hover:bg-[#724e0d] shadow-xs"
                                : "bg-[#bf953f]/10 text-[#7a4f08]"
                            }`}
                            title={
                              isAvailable ? `Click to read complete ${text}` : undefined
                            }
                          >
                            {text} {isAvailable && "📖"}
                          </span>
                        );
                      })}
                    </div>
                    {idx === 0 && (
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const iso = PRESEEDED_GRANTHAS.find((g) => g.id === "isopanisad");
                            if (iso) setReadingGrantha(iso);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Īśopaniṣad (18)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const kena = PRESEEDED_GRANTHAS.find((g) => g.id === "kenopanisad");
                            if (kena) setReadingGrantha(kena);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Kenopaniṣad (35)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const katha = PRESEEDED_GRANTHAS.find((g) => g.id === "kathopanisad");
                            if (katha) setReadingGrantha(katha);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Kaṭhopaniṣad (119)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const prasna = PRESEEDED_GRANTHAS.find((g) => g.id === "prasnopanisad");
                            if (prasna) setReadingGrantha(prasna);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Praśnopaniṣad (67)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const mundaka = PRESEEDED_GRANTHAS.find((g) => g.id === "mundakopanisad");
                            if (mundaka) setReadingGrantha(mundaka);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Muṇḍaka (65)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const mandukya = PRESEEDED_GRANTHAS.find((g) => g.id === "mandukyopanisad");
                            if (mandukya) setReadingGrantha(mandukya);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Māṇḍūkya & Kārikā</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const aitareya = PRESEEDED_GRANTHAS.find((g) => g.id === "aitareyopanisad");
                            if (aitareya) setReadingGrantha(aitareya);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Aitareya (33)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const taittiriya = PRESEEDED_GRANTHAS.find((g) => g.id === "taittiriyopanisad");
                            if (taittiriya) setReadingGrantha(taittiriya);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Taittirīya (31)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const chandogya = PRESEEDED_GRANTHAS.find((g) => g.id === "chandogyopanisad");
                            if (chandogya) setReadingGrantha(chandogya);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Chāndogya (8 Adhyāyas)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const brhadaranyaka = PRESEEDED_GRANTHAS.find((g) => g.id === "brhadaranyakopanisad");
                            if (brhadaranyaka) setReadingGrantha(brhadaranyaka);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Bṛhadāraṇyaka (6 Adhyāyas)</span>
                        </button>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const bs = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra");
                            if (bs) setReadingGrantha(bs);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Brahma Sūtras (4 Adhyāyas / 555 Sūtras)</span>
                        </button>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const gita = PRESEEDED_GRANTHAS.find((g) => g.id === "bhagavadgita");
                            if (gita) setReadingGrantha(gita);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg bg-[#8c6011] text-[#fff8ea] hover:bg-[#724e0d] text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Bhagavad Gītā (18 Adhyāyas / 700 Ślokas)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Proto-Acharyas */}
              <div className="mt-4 pt-3 border-t border-[#bf953f]/20">
                <div className="text-xs font-bold text-[#8c6011] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5" /> Early Proto-Ācāryas (Pre-Śaṅkara Vedantic Masters):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VEDIC_ROOT_INFO.protoAcharyas.map((pa, pidx) => (
                    <div key={pidx} className="p-2 rounded-lg bg-white/70 border border-[#bf953f]/20 text-xs">
                      <div className="font-serif font-bold text-[#2D2319]">{pa.name}</div>
                      <div className="text-[10px] text-[#8c6011] font-mono">{pa.era}</div>
                      <div className="text-[10px] text-[#6e5842] mt-0.5">{pa.contribution}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Tradition Navigation Tabs */}
          <div className="flex flex-wrap gap-2 items-center border-b border-[#bf953f]/30 pb-3">
        {PARAMPARA_TRADITIONS.map((trad) => {
          const isSelected = selectedParamparaId === trad.id;
          const isNeo = trad.id === "neo_vedanta";
          return (
            <button
              key={trad.id}
              type="button"
              onClick={() => {
                setSelectedParamparaId(trad.id);
                setSelectedGuru(null);
              }}
              className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 scale-[1.02] font-bold"
                  : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] border border-[#bf953f]/30 shadow-xs"
              }`}
            >
              <span>{trad.name}</span>
              {isNeo && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-800 text-teal-100 uppercase tracking-wider">
                  Navyānubhava
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tradition Card Detail */}
      <div className="card-3d-gold p-6 space-y-6">
        {/* Tradition Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#bf953f]/20 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold border ${activeTradition.badgeColor}`}>
                {activeTradition.sampradayaName}
              </span>
              <span className="text-xs text-[#8c6011] font-mono">{activeTradition.englishTitle}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2D2319] flex items-center gap-3">
              <span className="font-indic" style={getTypographyStyle()}>{transliterate(activeTradition.devanagariName, activeLipi)}</span>
            </h2>
            <div className="text-sm font-semibold text-[#8c6011]">{activeTradition.name}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF1E2]/60 border border-[#bf953f]/30 text-xs space-y-1 max-w-sm">
            <div className="flex justify-between">
              <span className="text-[#6e5842]">Founder / Preceptor:</span>
              <span className="font-bold text-[#2D2319]">{activeTradition.founderOrPreceptor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6e5842]">Supreme Archetype:</span>
              <span className="font-semibold text-[#8c6011]">{activeTradition.avatarOrDeity}</span>
            </div>
          </div>
        </div>

        {/* Doctrine Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/90 border border-[#bf953f]/20 shadow-sm space-y-2">
            <div className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Reality Model (Ontology)
            </div>
            <div className="text-xs font-bold text-[#2D2319]">{activeTradition.primaryPhilosophy}</div>
            <p className="text-xs text-[#4a3928] leading-relaxed">{activeTradition.realityModel}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-[#bf953f]/20 shadow-sm space-y-2">
            <div className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" /> Jīva-Brahman Relation
            </div>
            <p className="text-xs text-[#4a3928] leading-relaxed">{activeTradition.jivaBrahmanRelation}</p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-[#bf953f]/20 shadow-sm space-y-2">
            <div className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Means to Mokṣa / Liberation
            </div>
            <p className="text-xs text-[#4a3928] leading-relaxed">{activeTradition.mokshaMeans}</p>
          </div>
        </div>

        {/* Core Doctrine Axiom Quote */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF1E2] via-[#FFFDF8] to-[#FAF1E2] border border-[#bf953f]/40 flex items-start gap-3 shadow-inner">
          <Sparkles className="w-5 h-5 text-[#8c6011] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold">Central Vedantic Axiom:</span>
            <div className="font-serif italic text-sm text-[#2D2319] mt-0.5 leading-relaxed font-semibold">
              "{activeTradition.coreDoctrine}"
            </div>
          </div>
        </div>

        {/* Sub-Prasthānas Section if available */}
        {activeTradition.subPrasthānas && activeTradition.subPrasthānas.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#8c6011] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Sub-Prasthānas & Commentarial Schools within this Tradition:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activeTradition.subPrasthānas.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl bg-[#FFFDF9] border border-[#bf953f]/30 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#8c6011]">
                      {transliterate(sub.sanskritName, activeLipi)}
                    </span>
                    <span className="text-[10px] font-mono text-[#6e5842]">{sub.century}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#2D2319]">{sub.name}</div>
                  <div className="text-[11px] text-[#6e5842]">
                    <strong className="text-[#4a3928]">Proponent:</strong> {sub.proponent}
                  </div>
                  <p className="text-xs text-[#4a3928] leading-snug">{sub.coreEpistemology}</p>
                  <div className="pt-2 border-t border-[#bf953f]/20">
                    <span className="text-[10px] text-[#8c6011] font-mono font-bold">Key Treatises: </span>
                    <span className="text-[10px] text-[#6e5842] italic">{sub.keyWorks.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unbroken Guru-Paramparā Lineage Nodes */}
        <div className="space-y-3 pt-4 border-t border-[#bf953f]/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#8c6011] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4" /> Unbroken Guru-Paramparā Lineage Flow:
            </h4>
            <span className="text-[11px] text-[#6e5842] font-mono">
              Click any Ācārya to inspect their works, doctrines, & mathas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {activeTradition.keyGurus.map((guru, index) => {
              const isSelected = selectedGuru?.id === guru.id;
              return (
                <div
                  key={guru.id}
                  onClick={() => setSelectedGuru(isSelected ? null : guru)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-br from-[#FAF1E2] to-[#FFFDF8] border-[#8c6011] ring-2 ring-[#bf953f] shadow-md scale-[1.02]"
                      : "bg-white/90 hover:bg-[#FAF3E6] border-[#bf953f]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-6 h-6 rounded-full bg-[#bf953f]/20 text-[#8c6011] flex items-center justify-center text-[10px] font-mono font-bold">
                      {index + 1}
                    </div>
                    <span className="text-[10px] font-mono text-[#6e5842] bg-[#FAF1E2] px-1.5 py-0.5 rounded border border-[#bf953f]/20">
                      {guru.century}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="font-serif font-bold text-sm text-[#2D2319] font-indic" style={getTypographyStyle()}>
                      {transliterate(guru.devanagariName, activeLipi)}
                    </div>
                    <div className="text-xs font-semibold text-[#8c6011]">{guru.name}</div>
                    <div className="text-[11px] text-[#6e5842] mt-0.5 italic">{guru.title}</div>
                  </div>

                  {guru.guruName && (
                    <div className="text-[10px] text-[#4a3928] mt-2 pt-1.5 border-t border-[#bf953f]/20">
                      <strong className="text-[#8c6011]">Guru:</strong> {guru.guruName}
                    </div>
                  )}

                  <div className="text-[10px] text-[#8c6011] font-mono font-bold mt-2 flex items-center gap-1">
                    <span>Inspect Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Guru Detailed Modal / Panel */}
        {selectedGuru && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E6] to-[#F5E7D0] border-2 border-[#bf953f] shadow-lg space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#bf953f]/20 text-[#8c6011] font-bold">
                  Ācārya Profile ({selectedGuru.century})
                </span>
                <h3 className="font-serif font-bold text-xl text-[#2D2319] mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-indic" style={getTypographyStyle()}>{transliterate(selectedGuru.devanagariName, activeLipi)}</span>
                  <span className="text-[#8c6011]">({selectedGuru.name})</span>
                </h3>
                <p className="text-xs text-[#6e5842] italic">{selectedGuru.title}</p>
              </div>

              <div className="flex items-center gap-2">
                {selectedGuru.primaryGranthaId && (
                  <button
                    type="button"
                    onClick={() => {
                      const g = PRESEEDED_GRANTHAS.find((item) => item.id === selectedGuru.primaryGranthaId);
                      if (g) setReadingGrantha(g);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#120e0b]" />
                    <span>Open Master Work in Reader</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedGuru(null)}
                  className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white/80 hover:bg-white text-[#4a3928] border border-[#bf953f]/30 cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5">
                {selectedGuru.guruName && (
                  <div>
                    <strong className="text-[#8c6011] font-mono">Dīkṣā / Śikṣā Guru:</strong>
                    <div className="text-[#2D2319] font-medium">{selectedGuru.guruName}</div>
                  </div>
                )}

                {selectedGuru.prominentDisciples && selectedGuru.prominentDisciples.length > 0 && (
                  <div>
                    <strong className="text-[#8c6011] font-mono">Prominent Disciples:</strong>
                    <div className="text-[#4a3928]">{selectedGuru.prominentDisciples.join(", ")}</div>
                  </div>
                )}

                {selectedGuru.seatsOrMathas && selectedGuru.seatsOrMathas.length > 0 && (
                  <div>
                    <strong className="text-[#8c6011] font-mono">Pīṭhams / Maṭhas / Seats:</strong>
                    <div className="text-[#4a3928]">{selectedGuru.seatsOrMathas.join(" • ")}</div>
                  </div>
                )}

                {selectedGuru.historicalContext && (
                  <div>
                    <strong className="text-[#8c6011] font-mono">Historical & Spiritual Context:</strong>
                    <p className="text-[#4a3928] leading-relaxed mt-0.5">{selectedGuru.historicalContext}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <div>
                  <strong className="text-[#8c6011] font-mono">Master Works & Treatises:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedGuru.keyWorks.map((work, widx) => (
                      <span key={widx} className="px-2 py-0.5 rounded-md bg-white text-[#8c6011] border border-[#bf953f]/30 font-serif font-semibold text-[11px]">
                        {work}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-[#8c6011] font-mono">Primary Doctrines & Contributions:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-[#4a3928]">
                    {selectedGuru.primaryDoctrines.map((doc, didx) => (
                      <li key={didx} className="leading-snug">{doc}</li>
                    ))}
                  </ul>
                </div>

                {selectedGuru.famousQuoteOrMantra && (
                  <div className="p-3 rounded-xl bg-white/90 border border-[#bf953f]/30 shadow-inner">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold">Famous Sanskrit Invocation / Quote:</span>
                    <div className="font-serif text-xs text-[#2D2319] font-bold mt-1 whitespace-pre-line leading-relaxed font-indic" style={getTypographyStyle()}>
                      {transliterate(selectedGuru.famousQuoteOrMantra, activeLipi)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Canonical Granthas under this Tradition */}
        <div className="space-y-3 pt-4 border-t border-[#bf953f]/20">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8c6011] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Canonical Granthas & Texts of this Paramparā:
            </h4>
            <span className="text-xs font-serif text-[#6e5842]">
              Available to read in Sanskrit reader
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PRESEEDED_GRANTHAS.filter((g) => g.paramparaId === activeTradition.id).map((grantha) => (
              <div key={grantha.id} className="p-4 rounded-xl bg-white border border-[#bf953f]/30 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#2D2319] font-indic" style={getTypographyStyle()}>
                      {transliterate(grantha.transliteratedTitle, activeLipi)}
                    </span>
                    {grantha.isNeoVedanta && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                        Navyānubhava Vedānta
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8c6011] font-medium mt-0.5">{grantha.author} ({grantha.century})</div>
                  <p className="text-xs text-[#6e5842] mt-2 line-clamp-3 leading-relaxed">
                    {grantha.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#bf953f]/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6e5842]">
                    {grantha.chapters ? `${grantha.chapters.length} Section(s)` : "Sanskrit Text Ready"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReadingGrantha(grantha)}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scroll className="w-3.5 h-3.5 text-[#120e0b]" />
                    <span>Read Actual Text</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
