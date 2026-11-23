import React, { useState } from "react";
import { useBharatiyaLipi, FontSizeScale, FontWeight, LineHeight, LetterSpacing } from "../context/BharatiyaLipiContext";
import {
  BharatiyaLipiId,
  BHARATIYA_LIPIS,
  BharatiyaLipiConfig,
  transliterateBharatiyaText
} from "../utils/bharatiyaLipiTransliteration";
import { CitationButton } from "./CitationButton";
import {
  Languages,
  Type,
  Sparkles,
  Layers,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Sliders,
  ArrowRightLeft,
  Grid,
  Download,
  Scroll,
  Eye,
  Settings2,
  Bookmark
} from "lucide-react";

interface BharatiyaLipiFacilityProps {
  onNavigateToText?: (textId: string) => void;
}

interface SamplePassage {
  id: string;
  title: string;
  source: string;
  tradition: string;
  sanskritDeva: string;
  englishMeaning: string;
}

const CANONICAL_PASSAGES: SamplePassage[] = [
  {
    id: "brahma-sutra-1-1-1",
    title: "Brahma Sūtra 1.1.1 (The Gateway to Inquiry)",
    source: "Bādarāyaṇa Brahma Sūtras",
    tradition: "Prasthānatrayī Foundational",
    sanskritDeva: "अथातो ब्रह्मजिज्ञासा ॥",
    englishMeaning: "Now, therefore, the inquiry into Brahman (the ultimate non-dual Reality)."
  },
  {
    id: "gita-10-33",
    title: "Akṣara-Brahma (The Primordial Sound)",
    source: "Śrīmad Bhagavad Gītā 10.33",
    tradition: "Vedic Epistemology",
    sanskritDeva: "अक्षराणामकारोऽस्मि द्वन्द्वः सामासिकस्य च । अहमेवाक्षयः कालो धाताऽहं विश्वतोमुखः ॥",
    englishMeaning: "Among letters, I am the letter 'A' (Akāra); among compound words, I am the Dvandva (dual). I alone am inexhaustible Time; I am the Universal Sustainer facing everywhere."
  },
  {
    id: "mahavakya-chandogya",
    title: "Tat Tvam Asi (That Thou Art)",
    source: "Chāndogya Upaniṣad 6.8.7",
    tradition: "Sāma Veda Mahāvākya",
    sanskritDeva: "स य एषोऽणिमैतदात्म्यमिदँ सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो ॥",
    englishMeaning: "That which is the subtle essence, this whole world has that as its Self. That is the Truth. That is the Ātman. That thou art, O Śvetaketu!"
  },
  {
    id: "mahavakya-brihad",
    title: "Aham Brahmāsmi (I am the Absolute)",
    source: "Bṛhadāraṇyaka Upaniṣad 1.4.10",
    tradition: "Yajur Veda Mahāvākya",
    sanskritDeva: "ब्रह्म वा इदमग्र आसीत्, तदात्मानमेवावेत्, अहं ब्रह्मास्मीति । तस्मात्तत्सर्वमभवत् ॥",
    englishMeaning: "Brahman indeed was this in the beginning. It knew only Itself as: 'I am Brahman.' Therefore It became all this."
  },
  {
    id: "shankaracharya-nirvana",
    title: "Nirvāṇa-Ṣaṭkam (Identity Beyond Predicates)",
    source: "Ādi Śaṅkarācārya",
    tradition: "Advaita Vedānta",
    sanskritDeva: "मनोबुद्ध्यहङ्कारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे । न च व्योमभूमिर्न तेजो न वायुश्चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥",
    englishMeaning: "I am neither mind, intellect, ego, nor memory; neither the ears, tongue, nose, nor eyes; nor ether, earth, fire, or air. I am of the nature of pure Consciousness and Bliss; I am Śiva, I am Śiva."
  },
  {
    id: "bengal-padavali",
    title: "Gauḍīya Vedānta: Prema & Cinmaya Svarūpa",
    source: "Caitanya Caritāmṛta / Jīva Gosvāmī",
    tradition: "Acintya-Bhedābheda",
    sanskritDeva: "आनन्दचिन्मयरसप्रतिभाविताभिस्ताभिर्य एव निजरूपतया कलाभिः । गोलोक एव निवसत्यखिलात्मभूतो गोविन्दमादिपुरुषं तमहं भजामि ॥",
    englishMeaning: "I worship Govinda, the primeval Lord, who resides in His transcendental realm of Goloka accompanied by His spiritual potencies embodied in pure conscious ecstatic bliss."
  },
  {
    id: "ramanuja-sribhashya",
    title: "Śrī-Bhāṣya Maṅgalācaraṇam",
    source: "Śrī Rāmānujācārya",
    tradition: "Viśiṣṭādvaita Vedānta",
    sanskritDeva: "अखिलभुवनजन्मस्थेमभङ्गादिलीले विनतविविधभूतव्रातरक्षैकदीक्षे । श्रुतिशिरसि विदीप्ते ब्रह्मणि श्रीनिवासे भवतु मम परस्मिन् शेमुषी भक्तिरूपा ॥",
    englishMeaning: "May my intellect assume the form of devotional contemplation (Bhakti) towards the Supreme Brahman, Śrīnivāsa, whose sport is the creation, preservation, and dissolution of the universe, and who is revealed in the crowning summits of the Upaniṣads."
  },
  {
    id: "kc-bhattacharyya-dictum",
    title: "The Subject as Freedom (आत्मस्वातन्त्र्यम्)",
    source: "K.C. Bhattacharyya (Navyānubhava Vedānta)",
    tradition: "Phenomenological Advaita",
    sanskritDeva: "चेतनाया अविषयत्वमेव पारमार्थिकं स्वातन्त्र्यम् । स्वराज्यं विचारे प्रतिष्ठितं भवति ॥",
    englishMeaning: "The de-objectification of consciousness is transcendental Freedom. True autonomy and Swaraj are firmly established in unborrowed, self-luminous contemplation."
  }
];

export function BengalVedantaFacilityWrapper() {
  return null;
}

export function BharatiyaLipiFacility({ onNavigateToText }: BharatiyaLipiFacilityProps) {
  const {
    activeLipi,
    setActiveLipi,
    scriptFonts,
    setScriptFont,
    getActiveFontConfig,
    fontSizeScale,
    setFontSizeScale,
    fontWeight,
    setFontWeight,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    transliterate,
    currentLipiConfig,
    allLipis,
    resetToDefaults
  } = useBharatiyaLipi();

  const [activeTab, setActiveTab] = useState<"matrix" | "studio" | "varga" | "converter">("matrix");
  const [selectedPassageId, setSelectedPassageId] = useState<string>(CANONICAL_PASSAGES[0].id);
  const [customText, setCustomText] = useState<string>("");
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Converter state
  const [convSourceLipi, setConvSourceLipi] = useState<BharatiyaLipiId>("devanagari");
  const [convTargetLipi, setConvTargetLipi] = useState<BharatiyaLipiId>("bengali");
  const [convInput, setConvInput] = useState<string>("सत्यं ज्ञानमनन्तं ब्रह्म । आनन्दो ब्रह्मेति व्यजानात् ॥");

  const selectedPassage = CANONICAL_PASSAGES.find((p) => p.id === selectedPassageId) || CANONICAL_PASSAGES[0];
  const activeSanskritText = customText.trim() ? customText : selectedPassage.sanskritDeva;

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const handleDownloadSpecimen = () => {
    const lines: string[] = [
      "============================================================",
      "vedāntatattvaṁ: BHARATIYA BHASHA LIPI TYPOGRAPHY SPECIMEN",
      `Title: ${selectedPassage.title}`,
      `Source: ${selectedPassage.source} (${selectedPassage.tradition})`,
      "============================================================\n"
    ];

    allLipis.forEach((lipi) => {
      const rendered = transliterate(activeSanskritText, lipi.id, "devanagari");
      const font = getActiveFontConfig(lipi.id);
      lines.push(`[${lipi.name.toUpperCase()} / ${lipi.nativeName}] (Font: ${font.name})`);
      lines.push(rendered);
      lines.push("");
    });

    lines.push(`[English Translation]\n${selectedPassage.englishMeaning}\n`);
    lines.push("Source: vedāntatattvaṁ Bharatiya Lipi Research Suite (2026)");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bharatiya_lipi_${selectedPassage.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="card-3d-gold p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FAF4E8] to-[#FFFDF8] border-l-4 border-l-[#8c6011]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono text-[#8c6011] bg-[#bf953f]/20 border border-[#bf953f]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pan-Indian Epigraphy & Typography Facility (अखिलभारतीयलिपिशास्त्रम्)
              </span>
            </div>
            <h1 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-[#2D2319] leading-tight">
              Bharatiya Bhasha Lipi & Typography Studio
            </h1>
            <div className="text-xs sm:text-sm text-[#735013] font-serif font-semibold">
              भारतीय भाषा लिपि, मुद्रणकला एवं अक्षरतुलना केन्द्रम्
            </div>
            <p className="text-xs text-[#5c4731] font-serif leading-relaxed pt-1">
              Explore, compare, and render Vedantic manuscripts and classical texts across all 10 historical Indic scripts (Devanāgarī, Bengali/Gauḍīya, Tamil/Grantha, Telugu, Kannada, Malayalam, Odia, Gujarati, Gurmukhi, and Roman IAST) with authentic scholar-grade Google Fonts (Tiro, Noto Serif, Cardo, and classical typefaces).
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={handleDownloadSpecimen}
              type="button"
              className="btn-3d-dark flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
              title="Download UTF-8 multi-script specimen text file"
            >
              <Download className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Export Specimen</span>
            </button>

            <CitationButton
              moduleName="Bharatiya Bhasha Lipi Facility"
              title="Comparative Indic Epigraphy & Multi-Script Typography Studio"
              schools={["Pan-Indian Classical Sanskrit", "All Vedantic Sampradāyas"]}
              analysisContent={`Rendered canonical Sanskrit passage across 10 Bharatiya Lipis with Tiro and Noto academic typefaces. Selected Text: ${selectedPassage.title}`}
            />
          </div>
        </div>

        {/* Foundational Epigraph */}
        <div className="mt-4 pt-3 border-t border-[#bf953f]/25 flex items-start gap-2 text-xs text-[#6e5842] font-serif italic bg-[#FAF5EC]/70 p-3 rounded-xl">
          <BookOpen className="w-4 h-4 text-[#8c6011] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#8c6011] not-italic font-mono uppercase text-[10px] block">
              Gītā 10.33 Epigraph (The Omnipresent Akṣara):
            </strong>
            <span>"अक्षराणामकारोऽस्मि" — Among all letters and alphabets, I am the primordial 'A' (Akāra-Brahman), unifying all scripts and phonemes of Bhārata.</span>
          </div>
        </div>
      </div>

      {/* 2. Facility Sub-Navigation Tabs */}
      <div className="flex rounded-2xl bg-[#FAF5ED] p-1.5 gap-1.5 overflow-x-auto border border-[#bf953f]/30 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "matrix"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "text-[#5c4731] hover:text-[#2D2319] hover:bg-[#FAF1E2] border border-transparent"
          }`}
        >
          <Grid className="w-4 h-4 text-[#8c6011]" />
          <span>1. Multi-Script Matrix (10 Lipis)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "studio"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "text-[#5c4731] hover:text-[#2D2319] hover:bg-[#FAF1E2] border border-transparent"
          }`}
        >
          <Sliders className="w-4 h-4 text-[#8c6011]" />
          <span>2. Font Studio & Specimen Lab</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("varga")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "varga"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "text-[#5c4731] hover:text-[#2D2319] hover:bg-[#FAF1E2] border border-transparent"
          }`}
        >
          <Type className="w-4 h-4 text-[#8c6011]" />
          <span>3. Akṣara Varga Chart (Alphabet)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("converter")}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "converter"
              ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
              : "text-[#5c4731] hover:text-[#2D2319] hover:bg-[#FAF1E2] border border-transparent"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-[#8c6011]" />
          <span>4. Live Script Converter</span>
        </button>
      </div>

      {/* 3. TAB 1: MULTI-SCRIPT SIMULTANEOUS MATRIX */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Preset Selector & Custom Input */}
          <div className="card-3d-gold p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#8c6011] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Select Canonical Sanskrit Passage:
              </span>

              {customText && (
                <button
                  type="button"
                  onClick={() => setCustomText("")}
                  className="text-xs text-[#8c6011] font-bold hover:underline"
                >
                  Clear Custom Text (Restore Preset)
                </button>
              )}
            </div>

            {/* Passage Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANONICAL_PASSAGES.map((passage) => {
                const isSelected = selectedPassageId === passage.id && !customText;
                return (
                  <button
                    key={passage.id}
                    type="button"
                    onClick={() => {
                      setSelectedPassageId(passage.id);
                      setCustomText("");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                        : "bg-[#FFFDF9] hover:bg-[#FAF3E4] border-[#bf953f]/30 text-[#3D2C1D] shadow-xs"
                    }`}
                  >
                    <div className="font-serif font-bold text-xs line-clamp-1">{passage.title}</div>
                    <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-[#8C4E03] font-bold" : "text-[#8c6011]"}`}>
                      {passage.source}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Textarea */}
            <div>
              <label className="text-[11px] font-bold text-[#735013] font-mono block mb-1">
                Or type / paste any custom Sanskrit or Indic passage:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter Sanskrit passage (Devanāgarī or IAST) to view across all 10 scripts..."
                className="w-full h-16 p-3 bg-[#FFFDF9] border border-[#bf953f]/40 rounded-xl text-sm font-serif text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
              />
            </div>
          </div>

          {/* Active Passage Overview Banner */}
          <div className="card-3d-gold p-4 bg-[#FAF4E8] border-l-4 border-l-[#8c6011] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-black text-base text-[#2D2319]">{selectedPassage.title}</h2>
              <p className="text-xs text-[#6e5842] font-serif italic mt-0.5">
                "{selectedPassage.englishMeaning}"
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8c6011] font-bold bg-[#FFFDF8] px-3 py-1 rounded-lg border border-[#bf953f]/30">
              {selectedPassage.tradition}
            </span>
          </div>

          {/* The 10 Script Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allLipis.map((lipi) => {
              const font = getActiveFontConfig(lipi.id);
              const renderedText = transliterate(activeSanskritText, lipi.id, "devanagari");
              const isCopied = copiedScript === lipi.name;

              return (
                <div
                  key={lipi.id}
                  className="card-3d-gold p-5 space-y-3 bg-[#FFFDF8] flex flex-col justify-between"
                >
                  {/* Card Head */}
                  <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-black text-sm text-[#2D2319]">
                        {lipi.nativeName}
                      </span>
                      <span className="text-[11px] font-mono text-[#8c6011] font-semibold">
                        ({lipi.name})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Font Selector for this specific script */}
                      <select
                        value={scriptFonts[lipi.id] || lipi.availableFonts[0].id}
                        onChange={(e) => setScriptFont(lipi.id, e.target.value)}
                        className="text-[10px] font-mono px-2 py-1 bg-[#FAF1E2] border border-[#bf953f]/30 rounded-lg text-[#5c4731] focus:outline-none"
                      >
                        {lipi.availableFonts.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyText(renderedText, lipi.name)}
                        type="button"
                        className="p-1 rounded-lg border border-[#bf953f]/30 hover:bg-[#FAF1E2] text-[#8c6011] transition"
                        title="Copy script text"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rendered Text Body */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF5EC] to-[#FFFDF8] border border-[#bf953f]/25 shadow-inner my-1">
                    <div
                      className="text-[#2D2319] leading-relaxed break-words"
                      style={{
                        fontFamily: font.family,
                        fontSize: "1.25rem",
                        fontWeight: 500
                      }}
                    >
                      {renderedText}
                    </div>
                  </div>

                  {/* Card Foot: Tradition info */}
                  <div className="text-[10px] text-[#6e5842] font-serif flex items-center justify-between pt-1">
                    <span className="truncate">Active Font: <strong className="text-[#8c6011]">{font.name}</strong></span>
                    <span className="text-[#8c6011] font-mono">{lipi.region.split(",")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: FONT STUDIO & TYPOGRAPHY SPECIMEN LAB */}
      {activeTab === "studio" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="card-3d-gold p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#2D2319] flex items-center gap-2 border-b border-[#bf953f]/20 pb-2">
              <Sliders className="w-4 h-4 text-[#8c6011]" />
              <span>Interactive Typographic Lab & Font Tuning Suite</span>
            </h3>

            {/* Script Selection Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#8c6011] font-mono uppercase">
                1. Select Target Script for Deep Font Comparison:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allLipis.map((lipi) => {
                  const isSelected = activeLipi === lipi.id;
                  return (
                    <button
                      key={lipi.id}
                      type="button"
                      onClick={() => setActiveLipi(lipi.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-[0_4px_14px_rgba(197,155,39,0.28)] ring-1 ring-[#E2B755]/60 font-bold"
                          : "bg-[#FFFDF9] hover:bg-[#FAF3E4] border-[#bf953f]/30 text-[#3D2C1D]"
                      }`}
                    >
                      <span>{lipi.nativeName}</span>
                      <span className="ml-1 text-[10px] font-normal opacity-80">({lipi.name})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {/* Font Size Scale */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c6011] font-mono uppercase block">
                  Font Scale:
                </span>
                <div className="flex rounded-lg border border-[#bf953f]/30 overflow-hidden text-xs">
                  {(["sm", "base", "lg", "xl", "2xl"] as FontSizeScale[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSizeScale(sz)}
                      className={`flex-1 py-1 text-center font-mono font-bold transition ${
                        fontSizeScale === sz ? "bg-[#8c6011] text-[#FFFDF8]" : "bg-[#FFFDF8] text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c6011] font-mono uppercase block">
                  Weight:
                </span>
                <div className="flex rounded-lg border border-[#bf953f]/30 overflow-hidden text-xs">
                  {(["normal", "medium", "semibold", "bold"] as FontWeight[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFontWeight(w)}
                      className={`flex-1 py-1 text-center font-mono font-bold transition ${
                        fontWeight === w ? "bg-[#8c6011] text-[#FFFDF8]" : "bg-[#FFFDF8] text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {w === "normal" ? "Reg" : w === "medium" ? "Med" : w === "semibold" ? "Semi" : "Bold"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c6011] font-mono uppercase block">
                  Line Height:
                </span>
                <div className="flex rounded-lg border border-[#bf953f]/30 overflow-hidden text-xs">
                  {(["tight", "normal", "relaxed", "loose"] as LineHeight[]).map((lh) => (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => setLineHeight(lh)}
                      className={`flex-1 py-1 text-center font-mono font-bold transition ${
                        lineHeight === lh ? "bg-[#8c6011] text-[#FFFDF8]" : "bg-[#FFFDF8] text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {lh === "tight" ? "1.3" : lh === "normal" ? "1.5" : lh === "relaxed" ? "1.7" : "2.0"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c6011] font-mono uppercase block">
                  Kerning / Spacing:
                </span>
                <div className="flex rounded-lg border border-[#bf953f]/30 overflow-hidden text-xs">
                  {(["normal", "wide", "wider"] as LetterSpacing[]).map((ls) => (
                    <button
                      key={ls}
                      type="button"
                      onClick={() => setLetterSpacing(ls)}
                      className={`flex-1 py-1 text-center font-mono font-bold transition ${
                        letterSpacing === ls ? "bg-[#8c6011] text-[#FFFDF8]" : "bg-[#FFFDF8] text-[#5c4731] hover:bg-[#FAF1E2]"
                      }`}
                    >
                      {ls === "normal" ? "Std" : ls === "wide" ? "Wide" : "Accents"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Font Cards for Selected Script */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8c6011] font-mono font-bold">
              <span>All Available Fonts for {currentLipiConfig.name} ({currentLipiConfig.nativeName}):</span>
              <span>{currentLipiConfig.availableFonts.length} Typography Profiles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLipiConfig.availableFonts.map((font) => {
                const isSelected = (scriptFonts[activeLipi] || currentLipiConfig.availableFonts[0].id) === font.id;
                const rendered = transliterate(activeSanskritText, activeLipi, "devanagari");

                return (
                  <div
                    key={font.id}
                    className={`card-3d-gold p-5 space-y-3 transition-all ${
                      isSelected
                        ? "ring-2 ring-[#bf953f] bg-gradient-to-br from-[#FFFDF8] to-[#FAF4E8] shadow-lg"
                        : "bg-[#FFFDF8] hover:border-[#bf953f]"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#bf953f]/20 pb-2">
                      <div>
                        <div className="font-serif font-black text-sm text-[#2D2319]">
                          {font.name}
                        </div>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#bf953f]/15 text-[#8c6011]">
                          {font.category} face
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setScriptFont(activeLipi, font.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold font-serif transition cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/60 font-bold"
                            : "bg-[#FAF1E2] hover:bg-[#eadecc] text-[#735013] border border-[#bf953f]/30"
                        }`}
                      >
                        {isSelected ? "Active Default" : "Set as Default"}
                      </button>
                    </div>

                    {/* Specimen Preview */}
                    <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#bf953f]/20">
                      <div
                        className="text-[#2D2319] leading-relaxed break-words"
                        style={{
                          fontFamily: font.family,
                          fontSize: fontSizeScale === "sm" ? "1.1rem" : fontSizeScale === "base" ? "1.35rem" : fontSizeScale === "lg" ? "1.6rem" : fontSizeScale === "xl" ? "2rem" : "2.4rem",
                          fontWeight: fontWeight === "normal" ? 400 : fontWeight === "medium" ? 500 : fontWeight === "semibold" ? 600 : 700,
                          lineHeight: lineHeight === "tight" ? 1.3 : lineHeight === "normal" ? 1.5 : lineHeight === "relaxed" ? 1.75 : 2.0,
                          letterSpacing: letterSpacing === "normal" ? "normal" : letterSpacing === "wide" ? "0.025em" : "0.05em"
                        }}
                      >
                        {rendered}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#6e5842] font-serif leading-tight">
                      {font.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: AKSHARA VARGA & PHONETIC ANATOMY CHART */}
      {activeTab === "varga" && (
        <div className="space-y-6">
          <div className="card-3d-gold p-5 space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#2D2319] flex items-center gap-2 border-b border-[#bf953f]/20 pb-2">
              <Type className="w-4 h-4 text-[#8c6011]" />
              <span>Comparative Sanskrit Akṣara Matrix (सर्वलिपि-वर्णमाला-पटलम्)</span>
            </h3>
            <p className="text-xs text-[#6e5842] font-serif">
              The phonetic sound inventory of Sanskrit categorized according to classical Pāṇinian place of articulation (Sthāna: Kaṇṭhya, Tālavya, Mūrdhanya, Dantya, Oṣṭhya) and rendered across all 10 Bharatiya scripts.
            </p>
          </div>

          {/* Vowels (Svara) Table */}
          <div className="card-3d-gold p-5 space-y-4">
            <h4 className="font-serif font-bold text-xs text-[#8c6011] uppercase tracking-wider font-mono">
              1. Svaras (Vowels — स्वरवर्णाः):
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-[#bf953f]/30">
                <thead>
                  <tr className="bg-[#FAF1E2] text-[#735013] font-mono text-[11px]">
                    <th className="p-2 border border-[#bf953f]/20">IAST</th>
                    {allLipis.filter(l => l.id !== "iast").map(l => (
                      <th key={l.id} className="p-2 border border-[#bf953f]/20">{l.nativeName.split(" ")[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "e", "ai", "o", "au", "aṃ", "aḥ"
                  ].map((svara) => (
                    <tr key={svara} className="hover:bg-[#FAF5EC] font-serif text-sm">
                      <td className="p-2 font-mono font-bold text-[#8c6011] border border-[#bf953f]/20">{svara}</td>
                      {allLipis.filter(l => l.id !== "iast").map(l => {
                        const font = getActiveFontConfig(l.id);
                        const deva = svara === "aṃ" ? "अं" : svara === "aḥ" ? "अः" : transliterate(svara, "devanagari", "iast");
                        const char = transliterate(deva, l.id, "devanagari");
                        return (
                          <td
                            key={l.id}
                            className="p-2 border border-[#bf953f]/20 text-[#2D2319] text-base"
                            style={{ fontFamily: font.family }}
                          >
                            {char}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consonants (Vyañjana) Table */}
          <div className="card-3d-gold p-5 space-y-4">
            <h4 className="font-serif font-bold text-xs text-[#8c6011] uppercase tracking-wider font-mono">
              2. Vyañjanas (Consonant Classes — व्यञ्जनवर्गाः):
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-[#bf953f]/30">
                <thead>
                  <tr className="bg-[#FAF1E2] text-[#735013] font-mono text-[11px]">
                    <th className="p-2 border border-[#bf953f]/20">Class (Sthāna)</th>
                    <th className="p-2 border border-[#bf953f]/20">IAST</th>
                    {allLipis.filter(l => l.id !== "iast").map(l => (
                      <th key={l.id} className="p-2 border border-[#bf953f]/20">{l.nativeName.split(" ")[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sthana: "Guttural (कण्ठ्य)", iasts: ["ka", "kha", "ga", "gha", "ṅa"] },
                    { sthana: "Palatal (तालव्य)", iasts: ["ca", "cha", "ja", "jha", "ña"] },
                    { sthana: "Retroflex (मूर्धन्य)", iasts: ["ṭa", "ṭha", "ḍa", "ḍha", "ṇa"] },
                    { sthana: "Dental (दन्त्य)", iasts: ["ta", "tha", "da", "dha", "na"] },
                    { sthana: "Labial (ओष्ठ्य)", iasts: ["pa", "pha", "ba", "bha", "ma"] },
                    { sthana: "Semi-vowels (अन्तःस्थ)", iasts: ["ya", "ra", "la", "va"] },
                    { sthana: "Sibilants / Aspirate (ऊष्म)", iasts: ["śa", "ṣa", "sa", "ha"] },
                    { sthana: "Conjuncts (संयुक्त)", iasts: ["kṣa", "jña", "tra", "śra"] }
                  ].map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      {group.iasts.map((v, vIdx) => (
                        <tr key={v} className="hover:bg-[#FAF5EC] font-serif text-sm">
                          {vIdx === 0 && (
                            <td
                              rowSpan={group.iasts.length}
                              className="p-2 font-mono text-[11px] font-bold text-[#8c6011] bg-[#FAF3E6]/60 border border-[#bf953f]/20 align-top"
                            >
                              {group.sthana}
                            </td>
                          )}
                          <td className="p-2 font-mono font-bold text-[#735013] border border-[#bf953f]/20">{v}</td>
                          {allLipis.filter(l => l.id !== "iast").map(l => {
                            const font = getActiveFontConfig(l.id);
                            const deva = transliterate(v, "devanagari", "iast");
                            const char = transliterate(deva, l.id, "devanagari");
                            return (
                              <td
                                key={l.id}
                                className="p-2 border border-[#bf953f]/20 text-[#2D2319] text-base"
                                style={{ fontFamily: font.family }}
                              >
                                {char}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: LIVE INTERACTIVE SCRIPT CONVERTER */}
      {activeTab === "converter" && (
        <div className="space-y-6">
          <div className="card-3d-gold p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#2D2319] flex items-center gap-2 border-b border-[#bf953f]/20 pb-2">
              <ArrowRightLeft className="w-4 h-4 text-[#8c6011]" />
              <span>Real-Time Bi-Directional Indic Script Converter (लिपि-परिवर्तकः)</span>
            </h3>

            {/* Script Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Script */}
              <div>
                <label className="text-xs font-bold text-[#8c6011] font-mono block mb-1.5">
                  Source Script (मूल लिपिः):
                </label>
                <select
                  value={convSourceLipi}
                  onChange={(e) => setConvSourceLipi(e.target.value as BharatiyaLipiId)}
                  className="w-full p-2.5 bg-[#FFFDF8] border border-[#bf953f]/40 rounded-xl text-xs font-serif text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                >
                  {allLipis.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Script */}
              <div>
                <label className="text-xs font-bold text-[#8c6011] font-mono block mb-1.5">
                  Target Script (लक्ष्य लिपिः):
                </label>
                <select
                  value={convTargetLipi}
                  onChange={(e) => setConvTargetLipi(e.target.value as BharatiyaLipiId)}
                  className="w-full p-2.5 bg-[#FFFDF8] border border-[#bf953f]/40 rounded-xl text-xs font-serif text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                >
                  {allLipis.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Textarea Input and Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono text-[#6e5842]">
                  <span>Input Passage:</span>
                  <button
                    onClick={() => setConvInput("")}
                    className="text-[10px] text-[#8c6011] hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  value={convInput}
                  onChange={(e) => setConvInput(e.target.value)}
                  placeholder="Type or paste Sanskrit text..."
                  className="w-full h-44 p-3.5 bg-[#FFFDF9] border border-[#bf953f]/40 rounded-xl text-base leading-relaxed text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                  style={{ fontFamily: getActiveFontConfig(convSourceLipi).family }}
                />
              </div>

              {/* Converted Output */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono text-[#6e5842]">
                  <span className="font-bold text-[#8c6011]">
                    Converted to {allLipis.find(l => l.id === convTargetLipi)?.name}:
                  </span>
                  <button
                    onClick={() => handleCopyText(transliterate(convInput, convTargetLipi, convSourceLipi), "converter")}
                    className="text-[10px] text-[#8c6011] font-bold hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Output</span>
                  </button>
                </div>
                <div
                  className="w-full h-44 p-3.5 bg-gradient-to-br from-[#FAF4E8] to-[#FFFDF8] border border-[#bf953f]/40 rounded-xl text-lg leading-relaxed text-[#2D2319] overflow-y-auto shadow-inner"
                  style={{ fontFamily: getActiveFontConfig(convTargetLipi).family }}
                >
                  {transliterate(convInput, convTargetLipi, convSourceLipi) || (
                    <span className="text-[#9c8266] italic text-xs">
                      Converted text will appear here instantaneously...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
