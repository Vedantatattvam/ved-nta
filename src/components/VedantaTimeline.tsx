import React, { useState, useMemo } from "react";
import { 
  History, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Search, 
  ExternalLink,
  Award,
  Layers,
  ArrowRight,
  Info,
  Flame,
  Feather
} from "lucide-react";
import { 
  VEDANTA_HISTORICAL_TIMELINE, 
  TimelineEpoch, 
  TimelineMilestone,
  PARAMPARA_TRADITIONS
} from "../paramparaData";
import { ParamparaId } from "../types";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";

interface VedantaTimelineProps {
  onSelectTradition?: (traditionId: ParamparaId) => void;
  onOpenGrantha?: (granthaId: string) => void;
  onSelectGuru?: (guruId: string) => void;
}

export const VedantaTimeline: React.FC<VedantaTimelineProps> = ({
  onSelectTradition,
  onOpenGrantha,
  onSelectGuru
}) => {
  const { transliterate, activeLipi, getTypographyStyle } = useBharatiyaLipi();
  const [selectedEpochId, setSelectedEpochId] = useState<string>("all");
  const [selectedTraditionFilter, setSelectedTraditionFilter] = useState<ParamparaId | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeMilestone, setActiveMilestone] = useState<TimelineMilestone | null>(null);

  // Flattened and filtered milestones
  const filteredMilestones = useMemo(() => {
    const allMilestones: { milestone: TimelineMilestone; epoch: TimelineEpoch }[] = [];
    
    VEDANTA_HISTORICAL_TIMELINE.forEach(epoch => {
      if (selectedEpochId === "all" || selectedEpochId === epoch.id) {
        epoch.milestones.forEach(m => {
          allMilestones.push({ milestone: m, epoch });
        });
      }
    });

    return allMilestones.filter(({ milestone, epoch }) => {
      const matchesTradition = selectedTraditionFilter === "all" || milestone.sampradayaId === selectedTraditionFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTradition;

      const matchesSearch = 
        milestone.title.toLowerCase().includes(q) ||
        milestone.sanskritTitle.toLowerCase().includes(q) ||
        milestone.yearOrCentury.toLowerCase().includes(q) ||
        milestone.primaryFigures.some(f => f.toLowerCase().includes(q)) ||
        milestone.keyTexts.some(t => t.toLowerCase().includes(q)) ||
        milestone.coreEventOrDebate.toLowerCase().includes(q) ||
        milestone.dialecticalSignificance.toLowerCase().includes(q);

      return matchesTradition && matchesSearch;
    });
  }, [selectedEpochId, selectedTraditionFilter, searchQuery]);

  const traditionOptions: { id: ParamparaId | "all"; label: string; count?: number }[] = [
    { id: "all", label: "All Traditions (सर्वसम्प्रदायाः)" },
    { id: "vedic_root", label: "Vedic & Sūtra Root (वैदिकमूलम्)" },
    { id: "advaita", label: "Advaita (अद्वैत)" },
    { id: "visistadvaita", label: "Viśiṣṭādvaita (विशिष्टाद्वैत)" },
    { id: "dvaita", label: "Dvaita (द्वैत)" },
    { id: "suddhadvaita", label: "Śuddhādvaita (शुद्धाद्वैत)" },
    { id: "dvaitadvaita", label: "Dvaitādvaita (द्वैताद्वैत)" },
    { id: "acintya", label: "Acintya Bhedābheda (अचिन्त्य)" },
    { id: "saktavisistadvaita", label: "Śāktaviśiṣṭādvaita (शाक्तविशिष्टाद्वैत)" },
    { id: "neo_vedanta", label: "Navyānubhava Vedānta (नव्यानुभव-वेदान्त)" },
  ];

  const getTraditionMeta = (id: ParamparaId) => {
    return PARAMPARA_TRADITIONS.find(t => t.id === id);
  };

  return (
    <div id="vedanta-timeline-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F5EADB] rounded-2xl p-6 sm:p-8 text-[#2D2319] shadow-sm border border-[#bf953f]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f3d999]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF1E2] border border-[#bf953f]/40 text-[#8c6011] text-xs font-semibold uppercase tracking-wider shadow-xs">
              <History className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Kāla-Krama Sāraṇī • Historical Paramparā Evolution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold gold-text-gradient tracking-wide">
              Historical Timeline of Vedāntic Traditions
            </h2>
            <p className="text-[#5c4731] text-sm sm:text-base leading-relaxed font-serif">
              Trace the continuous 3,500-year development of Vedānta: from the Vedic & Upaniṣadic revelation and Sūtra codification, through the apostolic Bhāṣyas and classical dialectical battles, to Bengal's Śāktaviśiṣṭādvaita and global Navyānubhava Vedānta syntheses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#FAF2E3] p-3 sm:p-4 rounded-xl border border-[#bf953f]/35 self-start md:self-auto shrink-0 text-xs text-[#735013] shadow-xs">
            <div className="text-center px-2 py-1">
              <div className="text-xl font-bold text-[#8c6011] font-serif">5</div>
              <div className="text-[10px] text-[#8c6011] uppercase font-bold">Epochs</div>
            </div>
            <div className="h-8 w-px bg-[#bf953f]/30"></div>
            <div className="text-center px-2 py-1">
              <div className="text-xl font-bold text-[#8c6011] font-serif">20+</div>
              <div className="text-[10px] text-[#8c6011] uppercase font-bold">Key Vādas & Texts</div>
            </div>
            <div className="h-8 w-px bg-[#bf953f]/30"></div>
            <div className="text-center px-2 py-1">
              <div className="text-xl font-bold text-[#8c6011] font-serif">3500+</div>
              <div className="text-[10px] text-[#8c6011] uppercase font-bold">Years Span</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 sm:p-5 space-y-4">
        {/* Search & Tradition Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="timeline-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milestone, Ācārya, text, or debate (e.g. Advaitasiddhi, Pañcānana, Vivartavāda)..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              id="timeline-tradition-select"
              value={selectedTraditionFilter}
              onChange={(e) => setSelectedTraditionFilter(e.target.value as ParamparaId | "all")}
              aria-label="Filter timeline by tradition"
              className="text-xs sm:text-sm py-2 px-3 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {traditionOptions.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Epoch Selector Pills */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Epochs:
          </span>
          <button
            onClick={() => setSelectedEpochId("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedEpochId === "all"
                ? "bg-amber-600 text-white shadow-sm font-semibold"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            All Epochs ({VEDANTA_HISTORICAL_TIMELINE.reduce((acc, ep) => acc + ep.milestones.length, 0)})
          </button>
          {VEDANTA_HISTORICAL_TIMELINE.map(epoch => (
            <button
              key={epoch.id}
              onClick={() => setSelectedEpochId(epoch.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                selectedEpochId === epoch.id
                  ? "bg-amber-800 text-white shadow-sm font-semibold"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <span>{epoch.name.split(". ")[1] || epoch.name}</span>
              <span className="opacity-70 text-[10px]">({epoch.milestones.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Epochs & Milestones Flow */}
      <div className="space-y-8">
        {VEDANTA_HISTORICAL_TIMELINE.map((epoch) => {
          if (selectedEpochId !== "all" && selectedEpochId !== epoch.id) return null;

          const epochMilestones = filteredMilestones.filter(m => m.epoch.id === epoch.id);
          if (epochMilestones.length === 0 && (selectedTraditionFilter !== "all" || searchQuery)) {
            return null;
          }

          return (
            <div key={epoch.id} className="bg-stone-50/70 border border-stone-200/80 rounded-2xl p-5 sm:p-6 space-y-6">
              {/* Epoch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 border border-amber-300 px-2.5 py-0.5 rounded-md">
                      {epoch.period}
                    </span>
                    <span className="text-xs text-stone-600 font-serif font-medium font-indic" style={getTypographyStyle()}>
                      {transliterate(epoch.devanagariName, activeLipi)}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                    {epoch.name}
                  </h3>
                </div>
                <div className="text-xs text-stone-600 sm:text-right max-w-md italic">
                  "{epoch.theme}"
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {epoch.description}
              </p>

              {/* Milestones Vertical Rail */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-amber-400 before:to-stone-300">
                {epochMilestones.map(({ milestone }) => {
                  const tradMeta = getTraditionMeta(milestone.sampradayaId);
                  const isSelected = activeMilestone?.id === milestone.id;

                  return (
                    <div 
                      key={milestone.id} 
                      className={`relative bg-white rounded-xl p-5 border transition-all duration-200 ${
                        isSelected 
                          ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md" 
                          : "border-stone-200 hover:border-amber-400/70 hover:shadow-sm"
                      }`}
                    >
                      {/* Node Bullet on Rail */}
                      <div className="absolute -left-6 sm:-left-8 top-5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Era Badge & Tradition */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1 border border-stone-200">
                              <Calendar className="w-3 h-3 text-stone-500" />
                              {milestone.yearOrCentury}
                            </span>

                            {tradMeta && (
                              <button
                                onClick={() => onSelectTradition?.(milestone.sampradayaId)}
                                className={`px-2.5 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1 hover:opacity-80 transition-opacity ${tradMeta.badgeColor}`}
                              >
                                <span>{tradMeta.name}</span>
                              </button>
                            )}

                            <span className="text-xs text-stone-600 font-serif font-indic" style={getTypographyStyle()}>
                              {transliterate(milestone.sanskritTitle, activeLipi)}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 hover:text-amber-800 transition-colors">
                            {milestone.title}
                          </h4>

                          {/* Primary Figures & Texts */}
                          <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-stone-600">
                            <div>
                              <span className="font-semibold text-stone-700">Preceptors / Ācāryas: </span>
                              {milestone.primaryFigures.join(", ")}
                            </div>
                            <div>
                              <span className="font-semibold text-stone-700">Key Texts: </span>
                              <span className="italic">{milestone.keyTexts.join(", ")}</span>
                            </div>
                          </div>

                          {/* Core Event & Dialectical Significance */}
                          <div className="space-y-1.5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
                            <p>
                              <span className="font-semibold text-stone-900">Historical Event / Thesis: </span>
                              {milestone.coreEventOrDebate}
                            </p>
                            <p className="text-stone-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                              <span className="font-semibold text-amber-950">Dialectical Milestone: </span>
                              {milestone.dialecticalSignificance}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          {milestone.granthaIdToRead && (
                            <button
                              onClick={() => onOpenGrantha?.(milestone.granthaIdToRead!)}
                              className="w-full sm:w-auto px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Read Mūla Grantha</span>
                            </button>
                          )}
                          <button
                            onClick={() => setActiveMilestone(isSelected ? null : milestone)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Info className="w-3.5 h-3.5 text-stone-600" />
                            <span>{isSelected ? "Collapse" : "Inspect"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expanded In-Depth Drawer / Modal Details */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-amber-200/80 bg-amber-50/30 -mx-5 -mb-5 p-5 rounded-b-xl space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              Hermeneutical Significance & Cross-Tradition Polemics
                            </h5>
                            <span className="text-xs text-stone-500 font-mono">
                              ID: {milestone.id}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                              <div className="font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-rose-500" />
                                Core Philosophical Stance (Siddhānta)
                              </div>
                              <p className="text-stone-600 leading-relaxed">
                                {milestone.dialecticalSignificance}
                              </p>
                            </div>

                            <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs">
                              <div className="font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                                <Feather className="w-3.5 h-3.5 text-indigo-500" />
                                Textual & Commentarial Heritage
                              </div>
                              <ul className="list-disc list-inside text-stone-600 space-y-0.5">
                                {milestone.keyTexts.map((txt, i) => (
                                  <li key={i}><span className="font-medium text-stone-800">{txt}</span></li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            {milestone.sampradayaId !== "vedic_root" && (
                              <button
                                onClick={() => onSelectTradition?.(milestone.sampradayaId)}
                                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                              >
                                <span>Explore {tradMeta?.name || "Tradition"} Lineage</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredMilestones.length === 0 && (
          <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
            <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="text-base font-medium text-stone-700">No milestones match your filter</div>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try clearing your search query or selecting "All Traditions" to explore the full timeline.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTraditionFilter("all");
                setSelectedEpochId("all");
              }}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
