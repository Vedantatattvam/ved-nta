import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from "recharts";
import { PARAMPARA_TRADITIONS, VEDIC_ROOT_INFO } from "../paramparaData";
import { PRESEEDED_GRANTHAS } from "../data";
import { GuruNode, ParamparaId, ParamparaTradition, TabType } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import {
  GitFork,
  BookOpen,
  Crown,
  Scroll,
  Sparkles,
  ChevronRight,
  Flame,
  Info,
  Scale,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Compass
} from "lucide-react";

interface ParamparaFlowChartProps {
  onSelectTradition?: (traditionId: ParamparaId) => void;
  onOpenGrantha?: (granthaId: string) => void;
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
}

// Numerical Year mappings for plotting on chronological X-axis
interface ChartNodeData {
  id: string;
  name: string;
  devanagariName: string;
  title: string;
  centuryText: string;
  yearNum: number;
  traditionIndex: number;
  traditionId: ParamparaId;
  traditionName: string;
  traditionColor: string;
  keyWorks: string[];
  primaryDoctrines: string[];
  famousQuoteOrMantra?: string;
  guruNode: GuruNode;
  workCount: number;
}

const TRADITION_ORDER: { id: ParamparaId; name: string; yIndex: number; color: string; bg: string }[] = [
  { id: "vedic_root", name: "Vedic & Sūtra Root", yIndex: 9, color: "#8c6011", bg: "#FAF5ED" },
  { id: "advaita", name: "Advaita Vedānta", yIndex: 8, color: "#d97706", bg: "#fef3c7" },
  { id: "visistadvaita", name: "Viśiṣṭādvaita", yIndex: 7, color: "#b45309", bg: "#ffedd5" },
  { id: "dvaitadvaita", name: "Dvaitādvaita", yIndex: 6, color: "#0284c7", bg: "#e0f2fe" },
  { id: "dvaita", name: "Dvaita Vedānta", yIndex: 5, color: "#4338ca", bg: "#e0e7ff" },
  { id: "suddhadvaita", name: "Śuddhādvaita", yIndex: 4, color: "#be185d", bg: "#fce7f3" },
  { id: "acintya", name: "Acintya Bhedābheda", yIndex: 3, color: "#059669", bg: "#d1fae5" },
  { id: "saktavisistadvaita", name: "Śāktaviśiṣṭādvaita", yIndex: 2, color: "#dc2626", bg: "#fee2e2" },
  { id: "neo_vedanta", name: "Navyānubhava Vedānta", yIndex: 1, color: "#7c3aed", bg: "#ede9fe" },
];

function estimateYearFromCentury(centuryStr: string, guruId?: string): number {
  if (guruId === "bhadreshdas_swami") return 2007;
  if (guruId === "swami_gambhirananda") return 1950;
  if (guruId === "ayon_maharaj") return 2018;
  if (guruId === "sarvapriyananda") return 2014;
  if (guruId === "dayananda_saraswati") return 1982;
  if (guruId === "chinmayananda") return 1965;
  if (guruId === "tapovan_maharaj") return 1945;
  if (guruId === "yogananda") return 1935;
  if (guruId === "ramana_maharshi") return 1925;
  if (guruId === "aurobindo") return 1915;
  if (guruId === "vivekananda") return 1893;
  if (guruId === "ramakrishna") return 1872;
  const str = centuryStr.toLowerCase();
  if (str.includes("anādi") || str.includes("beginningless") || str.includes("eternal")) return -1500;
  if (str.includes("vedic") || str.includes("bce") || str.includes("upanishad")) return -800;
  if (str.includes("500 bce") || str.includes("badarayana")) return -500;
  if (str.includes("6th") && str.includes("7th")) return 650;
  if (str.includes("7th") || str.includes("8th")) return 750;
  if (str.includes("8th") && str.includes("9th")) return 820;
  if (str.includes("9th") && str.includes("10th")) return 900;
  if (str.includes("9th")) return 850;
  if (str.includes("10th")) return 950;
  if (str.includes("11th") && str.includes("12th")) return 1100;
  if (str.includes("11th")) return 1050;
  if (str.includes("12th") && str.includes("13th")) return 1200;
  if (str.includes("12th")) return 1150;
  if (str.includes("13th") && str.includes("14th")) return 1300;
  if (str.includes("13th")) return 1250;
  if (str.includes("14th")) return 1350;
  if (str.includes("15th") && str.includes("16th")) return 1500;
  if (str.includes("15th")) return 1450;
  if (str.includes("16th") && str.includes("17th")) return 1600;
  if (str.includes("16th")) return 1550;
  if (str.includes("17th")) return 1650;
  if (str.includes("18th")) return 1750;
  if (str.includes("19th") && str.includes("20th")) return 1900;
  if (str.includes("19th")) return 1850;
  if (str.includes("20th") && str.includes("21st")) return 2005;
  if (str.includes("21st")) return 2012;
  if (str.includes("20th")) return 1950;
  return 1000;
}

export default function ParamparaFlowChart({
  onSelectTradition,
  onOpenGrantha,
  onNavigateToTab,
}: ParamparaFlowChartProps) {
  const { transliterate, activeLipi } = useBharatiyaLipi();
  const [selectedTraditionFilter, setSelectedTraditionFilter] = useState<ParamparaId | "all">("all");
  const [selectedNode, setSelectedNode] = useState<ChartNodeData | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<"flow" | "analytics">("flow");

  // Compile all Nodes for Recharts
  const chartNodes: ChartNodeData[] = useMemo(() => {
    const nodes: ChartNodeData[] = [];

    // Add Vedic Root Nodes from protoAcharyas
    VEDIC_ROOT_INFO.protoAcharyas.forEach((guru, idx) => {
      const tradMeta = TRADITION_ORDER.find((t) => t.id === "vedic_root")!;
      const guruNode: GuruNode = {
        id: `vedic_root_${idx}`,
        name: guru.name,
        devanagariName: "महर्षि-बादरायण-व्यासादयः",
        title: "Proto-Vedāntic Preceptor & Canon Codifier",
        century: guru.era,
        paramparaId: "vedic_root",
        lineageStage: "rishi",
        seatsOrMathas: ["Badarikāśrama", "Naimiṣāraṇya"],
        keyWorks: idx === 0 ? ["Brahma Sūtras", "Mahābhārata", "Upaniṣadic Recensions"] : ["Brahma-Sūtra-Vṛtti", "Upaniṣad Commentaries"],
        primaryDoctrines: [guru.contribution],
        historicalContext: "Foundational proto-Ācārya whose aphorisms and commentaries established the architecture for all subsequent Vedāntic schools."
      };
      nodes.push({
        id: guruNode.id,
        name: guru.name,
        devanagariName: guruNode.devanagariName,
        title: guruNode.title,
        centuryText: guru.era,
        yearNum: estimateYearFromCentury(guru.era),
        traditionIndex: tradMeta.yIndex,
        traditionId: "vedic_root",
        traditionName: tradMeta.name,
        traditionColor: tradMeta.color,
        keyWorks: guruNode.keyWorks,
        primaryDoctrines: guruNode.primaryDoctrines,
        famousQuoteOrMantra: idx === 0 ? "अथातो ब्रह्मजिज्ञासा ॥ जन्माद्यस्य यतः ॥" : undefined,
        guruNode: guruNode,
        workCount: Math.max(2, guruNode.keyWorks.length * 3),
      });
    });

    // Add Tradition Gurus
    PARAMPARA_TRADITIONS.forEach((tradition) => {
      const tradMeta = TRADITION_ORDER.find((t) => t.id === tradition.id) || {
        id: tradition.id,
        name: tradition.name,
        yIndex: 5,
        color: "#8c6011",
        bg: "#FAF5ED",
      };

      tradition.keyGurus.forEach((guru) => {
        nodes.push({
          id: guru.id,
          name: guru.name,
          devanagariName: guru.devanagariName,
          title: guru.title,
          centuryText: guru.century,
          yearNum: estimateYearFromCentury(guru.century, guru.id),
          traditionIndex: tradMeta.yIndex,
          traditionId: tradition.id,
          traditionName: tradition.name,
          traditionColor: tradMeta.color,
          keyWorks: guru.keyWorks,
          primaryDoctrines: guru.primaryDoctrines,
          famousQuoteOrMantra: guru.famousQuoteOrMantra,
          guruNode: guru,
          workCount: Math.max(3, guru.keyWorks.length * 4),
        });
      });
    });

    return nodes;
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (selectedTraditionFilter === "all") return chartNodes;
    return chartNodes.filter((n) => n.traditionId === selectedTraditionFilter);
  }, [chartNodes, selectedTraditionFilter]);

  // Analytics data by tradition for bar chart
  const traditionStats = useMemo(() => {
    return TRADITION_ORDER.map((t) => {
      const gurusInTradition = chartNodes.filter((n) => n.traditionId === t.id);
      const totalWorks = gurusInTradition.reduce((acc, curr) => acc + curr.keyWorks.length, 0);
      return {
        traditionName: t.name,
        traditionId: t.id,
        gurusCount: gurusInTradition.length,
        worksCount: totalWorks,
        fill: t.color,
      };
    }).filter((s) => s.gurusCount > 0);
  }, [chartNodes]);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ChartNodeData = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#C59B27] shadow-[0_8px_25px_rgba(140,96,17,0.25)] text-[#2D2319] max-w-xs space-y-1.5 z-50 pointer-events-none">
          <div className="flex items-center justify-between border-b border-[#bf953f]/30 pb-1">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold text-white shadow-2xs"
              style={{ backgroundColor: data.traditionColor }}
            >
              {data.traditionName}
            </span>
            <span className="text-[10px] font-mono text-[#6e5842]">{data.centuryText}</span>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-[#8c6011] leading-tight">
              {data.name}
            </h4>
            <p className="text-xs font-serif text-[#5c4731]">{transliterate(data.devanagariName, activeLipi)}</p>
          </div>

          <p className="text-[11px] text-[#4a3928] font-serif italic line-clamp-2 leading-tight">
            {data.title}
          </p>

          {data.primaryDoctrines.length > 0 && (
            <div className="pt-1 border-t border-[#bf953f]/20">
              <span className="text-[9px] font-mono font-bold text-[#8c6011] uppercase block">
                Core Doctrine:
              </span>
              <span className="text-[11px] text-[#2D2319] font-serif font-medium line-clamp-2">
                {data.primaryDoctrines[0]}
              </span>
            </div>
          )}

          <div className="text-[10px] text-amber-700 font-mono font-bold pt-1 text-center">
            ✦ Click to view full doctrinal summary & treatises
          </div>
        </div>
      );
    }
    return null;
  };

  // Format X Axis ticks
  const formatXAxis = (tick: number) => {
    if (tick < 0) return `${Math.abs(tick)} BCE`;
    return `${tick} CE`;
  };

  // Format Y Axis ticks
  const formatYAxis = (tick: number) => {
    const item = TRADITION_ORDER.find((t) => t.yIndex === tick);
    return item ? item.name : "";
  };

  return (
    <div id="parampara-flowchart-container" className="space-y-6">
      {/* Top Banner */}
      <div className="card-3d-gold p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <GitFork className="w-5 h-5 text-[#8c6011]" />
              <h3 className="font-serif font-bold gold-text-gradient text-lg sm:text-xl">
                Paramparā Succession Flow Diagram & Timeline Chart
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4a3928] font-serif leading-relaxed">
              Interactive flow mapping of the unbroken succession of Vedic origins, classical Ācāryas, sub-commentarial traditions, and modern renaissance preceptors. Click any node to examine its philosophical doctrines, foundational granthas, and canonical assertions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FAF1E2] p-1 rounded-xl border border-[#bf953f]/30">
              <button
                type="button"
                onClick={() => setActiveChartTab("flow")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === "flow"
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                    : "text-[#6e5842] hover:text-[#2D2319]"
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Succession Flow (3500+ Yrs)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChartTab("analytics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeChartTab === "analytics"
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                    : "text-[#6e5842] hover:text-[#2D2319]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Lineage Doctrine Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-[#bf953f]/20 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-[#8c6011] mr-1">Filter Lineage:</span>
          <button
            type="button"
            onClick={() => setSelectedTraditionFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              selectedTraditionFilter === "all"
                ? "bg-[#8c6011] text-white font-bold shadow-xs"
                : "bg-[#FAF5ED] text-[#5c4731] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
            }`}
          >
            All Lineages ({chartNodes.length} Preceptors)
          </button>

          {TRADITION_ORDER.map((t) => {
            const count = chartNodes.filter((n) => n.traditionId === t.id).length;
            const isSelected = selectedTraditionFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTraditionFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#8c6011] text-white font-bold shadow-xs"
                    : "bg-[#FAF5ED] text-[#5c4731] hover:bg-[#FAF1E2] border border-[#bf953f]/30"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.name}</span>
                <span className="text-[10px] opacity-80 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHART VIEW 1: RECHARTS SUCCESSION FLOW SCATTER DIAGRAM */}
      {activeChartTab === "flow" && (
        <div className="card-3d-gold p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bf953f]/20 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8c6011]" />
              <h4 className="font-serif font-bold text-sm text-[#8c6011]">
                Interactive Chronological Flow Diagram (Click any Preceptor Node)
              </h4>
            </div>
            <div className="text-[11px] font-mono text-[#6e5842]">
              X: Historical Era • Y: Vedāntic Lineage • Node Size: Canonical Works
            </div>
          </div>

          <div className="h-[460px] w-full bg-[#FFFDF9]/60 rounded-xl p-2 border border-[#bf953f]/20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 30, left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6d5bc" opacity={0.6} />

                <XAxis
                  type="number"
                  dataKey="yearNum"
                  name="Historical Era"
                  domain={[-1600, 2030]}
                  tickFormatter={formatXAxis}
                  tick={{ fill: "#6e5842", fontSize: 11, fontFamily: "serif" }}
                  stroke="#bf953f"
                />

                <YAxis
                  type="number"
                  dataKey="traditionIndex"
                  name="Lineage"
                  domain={[0.5, 9.5]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                  tickFormatter={formatYAxis}
                  tick={{ fill: "#6e5842", fontSize: 11, fontFamily: "serif", fontWeight: "bold" }}
                  stroke="#bf953f"
                  width={130}
                />

                <ZAxis type="number" dataKey="workCount" range={[120, 480]} name="Canonical Works" />

                <Tooltip content={<CustomTooltip />} />

                {/* Highlight Classical Golden Era (8th - 16th c.) */}
                <ReferenceArea
                  x1={700}
                  x2={1650}
                  y1={0.5}
                  y2={9.5}
                  fill="#fbf4e4"
                  fillOpacity={0.4}
                />

                <ReferenceLine
                  x={800}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{ value: "Ādi Śaṅkara Era", fill: "#b45309", fontSize: 10, position: "top" }}
                />

                <ReferenceLine
                  x={1100}
                  stroke="#b45309"
                  strokeDasharray="4 4"
                  label={{ value: "Śrī Rāmānuja Era", fill: "#92400e", fontSize: 10, position: "top" }}
                />

                <ReferenceLine
                  x={1250}
                  stroke="#4338ca"
                  strokeDasharray="4 4"
                  label={{ value: "Śrī Madhvācārya Era", fill: "#3730a3", fontSize: 10, position: "top" }}
                />

                <Scatter
                  data={filteredNodes}
                  onClick={(nodeData) => {
                    if (nodeData && nodeData.payload) {
                      setSelectedNode(nodeData.payload);
                    }
                  }}
                  cursor="pointer"
                >
                  {filteredNodes.map((entry, index) => {
                    const isSelected = selectedNode?.id === entry.id;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.traditionColor}
                        stroke={isSelected ? "#120e0b" : "#FFFDF8"}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all hover:opacity-80"
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* CHART VIEW 2: ANALYTICS BAR CHART */}
      {activeChartTab === "analytics" && (
        <div className="card-3d-gold p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8c6011]" />
              <h4 className="font-serif font-bold text-sm text-[#8c6011]">
                Canonical Works & Preceptors across Vedānta Traditions
              </h4>
            </div>
          </div>

          <div className="h-[380px] w-full bg-[#FFFDF9]/60 rounded-xl p-2 border border-[#bf953f]/20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={traditionStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6d5bc" opacity={0.6} />
                <XAxis
                  dataKey="traditionName"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{ fill: "#6e5842", fontSize: 10, fontFamily: "serif" }}
                  stroke="#bf953f"
                />
                <YAxis stroke="#bf953f" tick={{ fill: "#6e5842", fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} ${name === "worksCount" ? "Major Works" : "Key Masters"}`,
                    name === "worksCount" ? "Canonical Treatises" : "Acaryas / Gurus",
                  ]}
                  contentStyle={{
                    backgroundColor: "#FFFDF8",
                    borderColor: "#C59B27",
                    borderRadius: "12px",
                    fontFamily: "serif",
                  }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                <Bar dataKey="worksCount" name="Canonical Treatises" fill="#C59B27" radius={[6, 6, 0, 0]} />
                <Bar dataKey="gurusCount" name="Key Masters" fill="#8c6011" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SELECTED NODE DOCTRINAL SUMMARY PANEL */}
      {selectedNode ? (
        <div className="card-3d-gold p-6 space-y-4 border-2 border-[#C59B27] bg-gradient-to-br from-[#FFFDF8] via-[#FAF5EC] to-[#FAF1E2] relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-md">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c6011] hover:bg-[#FAF1E2] border border-[#bf953f]/30 transition cursor-pointer"
            title="Close summary"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-3 pr-8 border-b border-[#bf953f]/30 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono px-2.5 py-0.5 rounded-full text-white font-bold shadow-2xs"
                  style={{ backgroundColor: selectedNode.traditionColor }}
                >
                  {selectedNode.traditionName}
                </span>
                <span className="text-xs font-mono text-[#6e5842] bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#bf953f]/25">
                  {selectedNode.centuryText}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#8c6011]">
                {selectedNode.name}
              </h3>
              <p className="font-serif text-sm text-[#5c4731] font-bold">
                {transliterate(selectedNode.devanagariName, activeLipi)}
              </p>
              <p className="text-xs font-serif text-[#4a3928] italic">
                {selectedNode.title}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {onSelectTradition && selectedNode.traditionId !== "vedic_root" && (
                <button
                  type="button"
                  onClick={() => onSelectTradition(selectedNode.traditionId)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-xs font-serif font-bold text-[#8c6011] transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Explore Lineage Tree</span>
                </button>
              )}

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToTab("sastrartha", {
                      prompt: `Summarize the key philosophical debates and doctrines of ${selectedNode.name} (${selectedNode.traditionName})`,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-[#120e0b]" />
                  <span>Debate in Śāstrārtha</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Doctrines */}
            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#8c6011]" />
                <span>Primary Doctrines & Siddhānta:</span>
              </div>
              <ul className="space-y-1.5 text-xs font-serif text-[#2D2319] leading-relaxed">
                {selectedNode.primaryDoctrines.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#8c6011] font-bold mt-0.5">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Canonical Works */}
            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[#8c6011]" />
                <span>Key Treatises & Commentaries:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.keyWorks.map((work, idx) => {
                  const matchingGrantha = PRESEEDED_GRANTHAS.find(
                    (g) =>
                      g.title.toLowerCase().includes(work.toLowerCase()) ||
                      work.toLowerCase().includes(g.title.toLowerCase())
                  );

                  return (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/30 text-xs font-serif text-[#4a3928] flex items-center gap-1.5"
                    >
                      <Scroll className="w-3 h-3 text-[#8c6011]" />
                      <span>{work}</span>
                      {matchingGrantha && onOpenGrantha && (
                        <button
                          type="button"
                          onClick={() => onOpenGrantha(matchingGrantha.id)}
                          className="text-[10px] font-mono text-amber-800 hover:underline font-bold ml-1 cursor-pointer flex items-center gap-0.5"
                          title="Read in Sanskrit Text Reader"
                        >
                          <span>[Read]</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Famous Quote / Mantra */}
          {selectedNode.famousQuoteOrMantra && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF4E8] via-[#FFFDF9] to-[#FAF4E8] border border-[#bf953f]/40 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase block">
                Canonical Quote & Sūtra Excerpt:
              </span>
              <p className="text-sm font-serif font-bold text-[#8c6011] leading-relaxed whitespace-pre-line">
                {transliterate(selectedNode.famousQuoteOrMantra, activeLipi)}
              </p>
            </div>
          )}

          {/* Historical Context */}
          {selectedNode.guruNode.historicalContext && (
            <div className="text-xs text-[#5c4731] font-serif leading-relaxed italic border-t border-[#bf953f]/20 pt-2">
              <strong>Historical Exegesis: </strong>
              {selectedNode.guruNode.historicalContext}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/30 text-center text-xs font-serif text-[#6e5842] flex items-center justify-center gap-2 shadow-2xs">
          <Info className="w-4 h-4 text-[#8c6011]" />
          <span>
            Click any preceptor node above on the timeline chart to display its comprehensive doctrinal synthesis, canonical treatises, and debate lineage.
          </span>
        </div>
      )}
    </div>
  );
}
