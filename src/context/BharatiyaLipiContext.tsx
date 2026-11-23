import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BharatiyaLipiId,
  BHARATIYA_LIPIS,
  BharatiyaLipiConfig,
  transliterateBharatiyaText
} from "../utils/bharatiyaLipiTransliteration";

export type FontSizeScale = "sm" | "base" | "lg" | "xl" | "2xl";
export type FontWeight = "normal" | "medium" | "semibold" | "bold" | "black";
export type LineHeight = "tight" | "normal" | "relaxed" | "loose";
export type LetterSpacing = "normal" | "wide" | "wider";

export interface BharatiyaLipiContextType {
  activeLipi: BharatiyaLipiId;
  setActiveLipi: (lipi: BharatiyaLipiId) => void;
  
  // Font family selection per script
  scriptFonts: Record<BharatiyaLipiId, string>;
  setScriptFont: (lipi: BharatiyaLipiId, fontId: string) => void;
  getActiveFontConfig: (lipi?: BharatiyaLipiId) => { family: string; name: string };

  // Typography customizations
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
  fontWeight: FontWeight;
  setFontWeight: (weight: FontWeight) => void;
  lineHeight: LineHeight;
  setLineHeight: (lh: LineHeight) => void;
  letterSpacing: LetterSpacing;
  setLetterSpacing: (ls: LetterSpacing) => void;
  
  // Dual Script & Display options
  showDualScript: boolean;
  setShowDualScript: (show: boolean) => void;
  
  // Helper utility functions for components
  transliterate: (text: string, target?: BharatiyaLipiId, source?: BharatiyaLipiId) => string;
  getTypographyStyle: (lipi?: BharatiyaLipiId) => React.CSSProperties;
  getTypographyClasses: () => string;
  
  // Current active Lipi config
  currentLipiConfig: BharatiyaLipiConfig;
  allLipis: BharatiyaLipiConfig[];
  
  // Reset all settings
  resetToDefaults: () => void;
}

const STORAGE_KEY = "vedantatattvam_bharatiya_lipi_settings";

const defaultFonts: Record<BharatiyaLipiId, string> = {
  devanagari: "tiro-deva",
  bengali: "tiro-bangla",
  tamil: "tiro-tamil",
  telugu: "tiro-telugu",
  kannada: "tiro-kannada",
  malayalam: "tiro-malayalam",
  odia: "tiro-odia",
  gujarati: "tiro-gujarati",
  gurmukhi: "tiro-gurmukhi",
  iast: "cardo"
};

const BharatiyaLipiContext = createContext<BharatiyaLipiContextType | undefined>(undefined);

export const BharatiyaLipiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or defaults
  const [activeLipi, setActiveLipiState] = useState<BharatiyaLipiId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeLipi) return parsed.activeLipi;
      }
    } catch (e) {
      // ignore
    }
    return "devanagari";
  });

  const [scriptFonts, setScriptFonts] = useState<Record<BharatiyaLipiId, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scriptFonts) return { ...defaultFonts, ...parsed.scriptFonts };
      }
    } catch (e) {
      // ignore
    }
    return defaultFonts;
  });

  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSizeScale) return parsed.fontSizeScale;
      }
    } catch (e) {
      // ignore
    }
    return "base";
  });

  const [fontWeight, setFontWeight] = useState<FontWeight>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontWeight) return parsed.fontWeight;
      }
    } catch (e) {
      // ignore
    }
    return "normal";
  });

  const [lineHeight, setLineHeight] = useState<LineHeight>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lineHeight) return parsed.lineHeight;
      }
    } catch (e) {
      // ignore
    }
    return "relaxed";
  });

  const [letterSpacing, setLetterSpacing] = useState<LetterSpacing>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.letterSpacing) return parsed.letterSpacing;
      }
    } catch (e) {
      // ignore
    }
    return "normal";
  });

  const [showDualScript, setShowDualScript] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.showDualScript === "boolean") return parsed.showDualScript;
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  // Save to localStorage on changes & update DOM CSS properties
  useEffect(() => {
    try {
      const data = {
        activeLipi,
        scriptFonts,
        fontSizeScale,
        fontWeight,
        lineHeight,
        letterSpacing,
        showDualScript
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }

    if (typeof document !== "undefined") {
      const targetLipi = activeLipi;
      const config = BHARATIYA_LIPIS.find(l => l.id === targetLipi) || BHARATIYA_LIPIS[0];
      const chosenFontId = scriptFonts[targetLipi] || defaultFonts[targetLipi];
      const fontObj = config.availableFonts.find(f => f.id === chosenFontId) || config.availableFonts[0];
      
      const appliedFamily = targetLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : fontObj.family;
      document.documentElement.style.setProperty("--font-indic-active", appliedFamily);
      document.documentElement.setAttribute("data-active-lipi", activeLipi);
    }
  }, [activeLipi, scriptFonts, fontSizeScale, fontWeight, lineHeight, letterSpacing, showDualScript]);

  const setActiveLipi = (lipi: BharatiyaLipiId) => {
    setActiveLipiState(lipi);
  };

  const setScriptFont = (lipi: BharatiyaLipiId, fontId: string) => {
    setScriptFonts(prev => ({
      ...prev,
      [lipi]: fontId
    }));
  };

  const getActiveFontConfig = (lipi?: BharatiyaLipiId) => {
    const targetLipi = lipi || activeLipi;
    if (targetLipi === "devanagari") {
      return {
        family: "'Tiro Devanagari Sanskrit', serif",
        name: "Tiro Devanagari Sanskrit"
      };
    }
    const config = BHARATIYA_LIPIS.find(l => l.id === targetLipi) || BHARATIYA_LIPIS[0];
    const chosenFontId = scriptFonts[targetLipi] || defaultFonts[targetLipi];
    const fontObj = config.availableFonts.find(f => f.id === chosenFontId) || config.availableFonts[0];
    return {
      family: fontObj.family,
      name: fontObj.name
    };
  };

  const transliterate = (text: string, target?: BharatiyaLipiId, source?: BharatiyaLipiId) => {
    const targetLipi = target || activeLipi;
    return transliterateBharatiyaText(text, targetLipi, source);
  };

  const getTypographyStyle = (lipi?: BharatiyaLipiId): React.CSSProperties => {
    const targetLipi = lipi || activeLipi;
    const fontInfo = getActiveFontConfig(targetLipi);

    let weightNum = 400;
    if (fontWeight === "medium") weightNum = 500;
    if (fontWeight === "semibold") weightNum = 600;
    if (fontWeight === "bold") weightNum = 700;
    if (fontWeight === "black") weightNum = 900;

    let lhVal = "1.75";
    if (lineHeight === "tight") lhVal = "1.35";
    if (lineHeight === "normal") lhVal = "1.5";
    if (lineHeight === "loose") lhVal = "2.0";

    let lsVal = "normal";
    if (letterSpacing === "wide") lsVal = "0.025em";
    if (letterSpacing === "wider") lsVal = "0.05em";

    return {
      fontFamily: fontInfo.family,
      fontWeight: weightNum,
      lineHeight: lhVal,
      letterSpacing: lsVal
    };
  };

  const getTypographyClasses = (): string => {
    switch (fontSizeScale) {
      case "sm":
        return "text-base sm:text-lg";
      case "lg":
        return "text-2xl sm:text-3xl";
      case "xl":
        return "text-3xl sm:text-4xl";
      case "2xl":
        return "text-4xl sm:text-5xl";
      case "base":
      default:
        return "text-xl sm:text-2xl";
    }
  };

  const resetToDefaults = () => {
    setActiveLipiState("devanagari");
    setScriptFonts(defaultFonts);
    setFontSizeScale("base");
    setFontWeight("normal");
    setLineHeight("relaxed");
    setLetterSpacing("normal");
    setShowDualScript(false);
  };

  const currentLipiConfig = BHARATIYA_LIPIS.find(l => l.id === activeLipi) || BHARATIYA_LIPIS[0];

  return (
    <BharatiyaLipiContext.Provider
      value={{
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
        showDualScript,
        setShowDualScript,
        transliterate,
        getTypographyStyle,
        getTypographyClasses,
        currentLipiConfig,
        allLipis: BHARATIYA_LIPIS,
        resetToDefaults
      }}
    >
      {children}
    </BharatiyaLipiContext.Provider>
  );
};

export const useBharatiyaLipi = (): BharatiyaLipiContextType => {
  const context = useContext(BharatiyaLipiContext);
  if (!context) {
    throw new Error("useBharatiyaLipi must be used within a BharatiyaLipiProvider");
  }
  return context;
};
