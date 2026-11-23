import React, { useState, useMemo, useEffect } from 'react';
import { 
  BENGAL_VEDANTA_RESEARCH, 
  BengalVedantaScholar 
} from '../bengalVedantaData';
import { useBharatiyaLipi } from '../context/BharatiyaLipiContext';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  History, 
  Library, 
  Layers, 
  Quote, 
  Award, 
  ExternalLink,
  ChevronRight,
  Filter,
  Users,
  Compass,
  FileText
} from 'lucide-react';

interface BengalVedantaFacilityProps {
  initialScholarId?: number | null;
  onScholarSelect?: (scholarId: number | null) => void;
  onNavigateToText?: (textId: string) => void;
  onNavigateToParampara?: (paramparaId: string) => void;
}

export const BengalVedantaFacility: React.FC<BengalVedantaFacilityProps> = ({
  initialScholarId,
  onScholarSelect,
  onNavigateToText,
  onNavigateToParampara
}) => {
  const { activeLipi, transliterate } = useBharatiyaLipi();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedScholar, setSelectedScholar] = useState<BengalVedantaScholar | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'categories' | 'timeline'>('grid');

  const research = BENGAL_VEDANTA_RESEARCH;
  const currentBadge = research.facilityBadge[activeLipi] || research.facilityBadge.bengali;
  const currentOneLiner = research.oneLinerDescription[activeLipi] || research.oneLinerDescription.bengali;

  // Synchronize selected scholar with initialScholarId from URL history
  useEffect(() => {
    if (initialScholarId) {
      const found = research.scholars.find((s) => s.id === initialScholarId);
      if (found) setSelectedScholar(found);
    } else {
      setSelectedScholar(null);
    }
  }, [initialScholarId, research.scholars]);

  const handleSelectScholar = (scholar: BengalVedantaScholar | null) => {
    setSelectedScholar(scholar);
    onScholarSelect?.(scholar ? scholar.id : null);
  };

  // Filter scholars based on query, category, era
  const filteredScholars = useMemo(() => {
    return research.scholars.filter((scholar) => {
      const matchesCategory = selectedCategory === 'all' || scholar.category === selectedCategory;
      const matchesEra = selectedEra === 'all' || scholar.eraPeriod === selectedEra;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || (
        scholar.name.toLowerCase().includes(q) ||
        (scholar.bengaliName && scholar.bengaliName.toLowerCase().includes(q)) ||
        scholar.traditionOrSchool.toLowerCase().includes(q) ||
        scholar.keyContribution.toLowerCase().includes(q) ||
        scholar.majorWorks.some(w => w.toLowerCase().includes(q))
      );

      return matchesCategory && matchesEra && matchesQuery;
    });
  }, [research.scholars, selectedCategory, selectedEra, searchQuery]);

  const eraGroups = useMemo(() => {
    const groups: { [key: string]: BengalVedantaScholar[] } = {
      "500 CE (Early Classical)": [],
      "14th–17th Century": [],
      "18th–19th Century": [],
      "20th–21st Century": []
    };
    research.scholars.forEach(s => {
      if (groups[s.eraPeriod]) {
        groups[s.eraPeriod].push(s);
      }
    });
    return groups;
  }, [research.scholars]);

  return (
    <div id="bengal-vedanta-facility" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner & Academic Grounding Citation */}
      <div id="bengal-vedanta-header" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F5EADB] text-[#2D2319] p-6 sm:p-10 border border-[#bf953f]/45 shadow-[0_10px_30px_rgba(160,110,20,0.10)] space-y-4">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#f3d999]/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/40 shadow-xs">
              <Library className="w-3.5 h-3.5 text-[#8c6011]" />
              {currentBadge}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#735013] bg-[#FAF2E3] px-3 py-1 rounded-md border border-[#bf953f]/30">
              <FileText className="w-3.5 h-3.5 text-[#8c6011]" />
              Academic Reference: <strong className="text-[#2D2319]">{research.authorReference}</strong>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight gold-text-gradient font-serif">
              {research.paperTitle}
            </h1>
            <p className="text-[#5c4731] text-sm sm:text-base mt-2 max-w-4xl leading-relaxed font-serif">
              {currentOneLiner}
            </p>
          </div>

          {/* Opening Vedic Dictum Box */}
          <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/40 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c6011]">
              <Quote className="w-4 h-4 text-[#8c6011]" />
              <span>Foundational Vedic Dictum • {research.epigraphCitation}</span>
            </div>
            <p className="text-lg sm:text-xl font-serif text-[#2D2319] italic tracking-wide">
              "{transliterate(research.epigraphSanskrit, activeLipi)}"
            </p>
            <p className="text-xs sm:text-sm text-[#6e5842] leading-relaxed">
              {research.epigraphTranslation}
            </p>
          </div>

          {/* Core Thesis & Living Reality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm">
            <div className="md:col-span-2 p-3.5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/30 text-[#4a3928] space-y-1">
              <span className="text-[#8c6011] font-bold block">Socio-Philosophical Significance:</span>
              <p className="text-[#4a3928] leading-relaxed font-serif">{research.coreThesis}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/30 text-[#4a3928] space-y-1">
              <span className="text-[#8c6011] font-bold block">Living Cultural Resonance:</span>
              <p className="italic text-[#4a3928] leading-relaxed font-serif">"{research.swamiAtmapriyanandaQuote}"</p>
              <span className="text-[11px] text-[#8c6011] block text-right font-medium">— Swami Atmapriyananda</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Categories Cards */}
      <div id="bengal-vedanta-categories-overview" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {research.threeCategories.map((cat) => {
          const isSelected = selectedCategory === cat.categoryNumber;
          return (
            <button
              key={cat.categoryNumber}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.categoryNumber)}
              className={`text-left p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_16px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF3E4] border-[#bf953f]/35 hover:border-[#bf953f] text-[#3D2C1D] shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF1E2] text-[#8c6011] border border-[#bf953f]/30">
                    Category {cat.categoryNumber}
                  </span>
                  <span className="text-xs text-[#6e5842] font-mono font-bold">
                    {research.scholars.filter(s => s.category === cat.categoryNumber).length} Scholars
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2319]">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#5c4731] leading-relaxed font-serif">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#bf953f]/20 text-[11px] text-[#6e5842]">
                <span className="font-bold text-[#8c6011]">Key Traditions: </span>
                {cat.prominentExamples}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Controls & Filter Bar */}
      <div id="bengal-vedanta-controls" className="card-3d-gold p-4 rounded-2xl space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c6011]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar, Bengali name, work, philosophy..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#bf953f]/40 rounded-xl text-xs sm:text-sm text-[#2D2319] placeholder-[#8c6011]/60 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8c6011] hover:text-[#2D2319]"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center p-1 bg-[#FAF5ED] rounded-xl border border-[#bf953f]/30">
              <button
                type="button"
                onClick={() => setActiveViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeViewMode === 'grid' 
                    ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs' 
                    : 'text-[#6e5842] hover:text-[#2D2319]'
                }`}
              >
                Catalog Grid ({filteredScholars.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeViewMode === 'timeline' 
                    ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border border-[#C59B27] shadow-xs' 
                    : 'text-[#6e5842] hover:text-[#2D2319]'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#bf953f]/20 text-xs">
          <span className="text-[#8c6011] flex items-center gap-1 font-serif font-bold mr-1">
            <Filter className="w-3.5 h-3.5" /> Epochs:
          </span>
          <button
            type="button"
            onClick={() => setSelectedEra('all')}
            className={`px-3 py-1 rounded-xl transition-all font-serif font-bold cursor-pointer ${
              selectedEra === 'all'
                ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/60'
                : 'bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#5c4731] border border-[#bf953f]/30'
            }`}
          >
            All Eras (75)
          </button>
          {Object.keys(eraGroups).map((era) => (
            <button
              key={era}
              type="button"
              onClick={() => setSelectedEra(era)}
              className={`px-3 py-1 rounded-xl transition-all font-serif font-bold cursor-pointer ${
                selectedEra === era
                  ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/60'
                  : 'bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#5c4731] border border-[#bf953f]/30'
              }`}
            >
              {era} ({eraGroups[era].length})
            </button>
          ))}

          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="ml-auto text-xs text-[#8c6011] font-serif font-bold hover:underline cursor-pointer"
            >
              Reset Category Filter
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Content Area (Grid vs Timeline) */}
      {activeViewMode === 'grid' ? (
        <div id="bengal-vedanta-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScholars.map((scholar) => {
            const isSelected = selectedScholar?.id === scholar.id;
            return (
              <div
                key={scholar.id}
                id={`scholar-card-${scholar.id}`}
                onClick={() => handleSelectScholar(scholar)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_16px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60'
                    : 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF8] to-[#FAF4E8] hover:bg-[#FAF3E4] border-[#bf953f]/35 hover:border-[#bf953f] text-[#2D2319] shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top line metadata */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#8c6011] font-bold bg-[#FAF1E2] px-2 py-0.5 rounded border border-[#bf953f]/30">
                      #{scholar.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#735013] bg-[#FAF2E3] px-2 py-0.5 rounded text-[11px] border border-[#bf953f]/25">
                      {scholar.eraPeriod}
                    </span>
                  </div>

                    {/* Name & Bengali Name */}
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D2319] group-hover:text-[#8c6011] transition-colors">
                        {scholar.name}
                      </h3>
                      {scholar.bengaliName && (
                        <p 
                          className="text-xs text-[#8c6011] font-bengali tracking-wide font-medium"
                          style={{ fontFamily: "'Tiro Bangla', 'Noto Serif Bengali', serif" }}
                        >
                          {scholar.bengaliName}
                        </p>
                      )}
                    </div>

                  {/* Category & School Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      scholar.category === 1 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : scholar.category === 2
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}>
                      Cat {scholar.category}
                    </span>
                    <span className="text-[10px] text-[#5c4731] bg-[#FAF2E3] px-2 py-0.5 rounded border border-[#bf953f]/25">
                      {scholar.traditionOrSchool}
                    </span>
                  </div>

                  {/* Scholarly Contribution */}
                  <p className="text-xs text-[#4a3928] leading-relaxed line-clamp-3 font-serif">
                    {scholar.keyContribution}
                  </p>
                </div>

                {/* Major Works Footer */}
                <div className="mt-4 pt-3 border-t border-[#bf953f]/25 space-y-1">
                  <span className="text-[11px] font-semibold text-[#8c6011] block">Major Works:</span>
                  <div className="flex flex-wrap gap-1">
                    {scholar.majorWorks.slice(0, 2).map((work, idx) => (
                      <span key={idx} className="text-[11px] text-[#735013] italic bg-[#FAF2E3] px-2 py-0.5 rounded border border-[#bf953f]/30">
                        {work}
                      </span>
                    ))}
                    {scholar.majorWorks.length > 2 && (
                      <span className="text-[10px] text-[#8c6011] self-center">
                        +{scholar.majorWorks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Timeline View */
        <div id="bengal-vedanta-timeline" className="space-y-8">
          {Object.entries(eraGroups).map(([era, scholars]) => {
            const eraFiltered = scholars.filter(s => {
              const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
              const q = searchQuery.toLowerCase().trim();
              const matchesQuery = !q || (
                s.name.toLowerCase().includes(q) ||
                (s.bengaliName && s.bengaliName.toLowerCase().includes(q)) ||
                s.traditionOrSchool.toLowerCase().includes(q) ||
                s.keyContribution.toLowerCase().includes(q)
              );
              return matchesCategory && matchesQuery;
            });

            if (eraFiltered.length === 0) return null;

            return (
              <div key={era} className="space-y-4">
                <div className="flex items-center gap-3 sticky top-16 bg-[#FAF5EC]/95 backdrop-blur py-2 z-10 border-b border-[#bf953f]/35">
                  <History className="w-5 h-5 text-[#8c6011]" />
                  <h2 className="text-lg font-serif font-bold text-[#2D2319]">{era}</h2>
                  <span className="text-xs text-[#8c6011] bg-[#FAF1E2] px-2.5 py-0.5 rounded-full border border-[#bf953f]/30">
                    {eraFiltered.length} Scholars
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eraFiltered.map(scholar => (
                    <div
                      key={scholar.id}
                      onClick={() => handleSelectScholar(scholar)}
                      className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF3E4] border border-[#bf953f]/35 hover:border-[#bf953f] cursor-pointer transition-colors space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#8c6011] font-bold bg-[#FAF1E2] px-1.5 py-0.5 rounded border border-[#bf953f]/25">#{scholar.id}</span>
                          <h4 className="font-serif font-bold text-[#2D2319]">{scholar.name}</h4>
                          {scholar.bengaliName && (
                            <span 
                              className="text-xs text-[#8c6011] font-bengali font-medium"
                              style={{ fontFamily: "'Tiro Bangla', 'Noto Serif Bengali', serif" }}
                            >
                              ({scholar.bengaliName})
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          scholar.category === 1 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : scholar.category === 2
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-purple-50 text-purple-800 border-purple-300'
                        }`}>
                          Cat {scholar.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#4a3928] leading-relaxed font-serif">{scholar.keyContribution}</p>
                      <div className="text-[11px] text-[#735013] italic">
                        {scholar.majorWorks.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Detail Modal for Selected Scholar */}
      {selectedScholar && (
        <div 
          id="scholar-detail-modal" 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2319]/45 backdrop-blur-xs"
          onClick={() => handleSelectScholar(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#FFFDF9] border-2 border-[#C59B27] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#bf953f]/25 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8c6011] bg-[#FAF1E2] px-2 py-0.5 rounded border border-[#bf953f]/30">
                    Scholar #{selectedScholar.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#735013] bg-[#FAF2E3] px-2 py-0.5 rounded border border-[#bf953f]/25">
                    {selectedScholar.eraPeriod}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#2D2319]">
                  {selectedScholar.name}
                </h2>
                {selectedScholar.bengaliName && (
                  <p 
                    className="text-sm text-[#8c6011] font-bengali font-medium"
                    style={{ fontFamily: "'Tiro Bangla', 'Noto Serif Bengali', serif" }}
                  >
                    {selectedScholar.bengaliName}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleSelectScholar(null)}
                className="text-[#5c4731] hover:text-[#2D2319] p-1.5 rounded-lg bg-[#FAF1E2] hover:bg-[#F3E5CD] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                selectedScholar.category === 1 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : selectedScholar.category === 2
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-purple-50 text-purple-800 border-purple-300'
              }`}>
                {selectedScholar.categoryLabel}
              </span>
              <span className="text-xs text-[#5c4731] bg-[#FAF2E3] px-2.5 py-1 rounded border border-[#bf953f]/30">
                School: {selectedScholar.traditionOrSchool}
              </span>
            </div>

            {/* Key Contribution */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c6011]">
                Philosophical & Historical Contribution
              </h4>
              <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/35 text-[#2D2319] text-sm leading-relaxed font-serif">
                {selectedScholar.keyContribution}
              </div>
            </div>

            {/* Major Works */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c6011]">
                Major Works & Canonical Expositions
              </h4>
              <ul className="space-y-2">
                {selectedScholar.majorWorks.map((work, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#3b2e21] p-2.5 rounded-lg bg-[#FFFDF8] border border-[#bf953f]/30 font-serif">
                    <BookOpen className="w-4 h-4 text-[#8c6011] mt-0.5 flex-shrink-0" />
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Reference Citation */}
            <div className="pt-4 border-t border-[#bf953f]/25 flex items-center justify-between text-xs text-[#6e5842]">
              <span>Source: <strong>Buddhodev Ghosh (2024)</strong></span>
              <button
                onClick={() => handleSelectScholar(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:from-[#e0bd4b] hover:to-[#d4af37] text-[#120e0b] font-serif font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer Citation Card */}
      <div id="bengal-vedanta-footer-citation" className="p-5 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/30 text-center space-y-2 text-xs text-[#5c4731]">
        <p className="text-[#3b2e21] font-serif">
          This scholarly facility is based on the research monograph <strong>"The Contribution of Bengal to Vedānta"</strong> by <strong>Buddhodev Ghosh (2024)</strong>.
        </p>
        <p className="text-[#735013]">
          Integrating 75 key personalities, 4 epochs, and 3 canonical categories spanning 500 CE to the 21st century.
        </p>
      </div>

    </div>
  );
};
