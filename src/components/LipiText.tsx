import React from "react";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import { BharatiyaLipiId } from "../utils/bharatiyaLipiTransliteration";

export interface LipiTextProps {
  children?: React.ReactNode;
  text?: string;
  sourceLipi?: BharatiyaLipiId;
  targetLipi?: BharatiyaLipiId;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  applyFont?: boolean;
}

/**
 * Universal Bharatiya Lipi Text Component
 * Automatically transliterates any Sanskrit or Indic text into the currently active script
 * and applies the selected academic font family.
 */
export const LipiText: React.FC<LipiTextProps> = ({
  children,
  text,
  sourceLipi,
  targetLipi,
  className = "",
  style = {},
  as: Component = "span",
  applyFont = true,
}) => {
  const { transliterate, activeLipi, getTypographyStyle } = useBharatiyaLipi();
  const rawText = text !== undefined ? text : typeof children === "string" ? children : "";

  if (!rawText && children) {
    return <Component className={className} style={style}>{children}</Component>;
  }

  const effectiveTarget = targetLipi || activeLipi;
  const renderedText = transliterate(rawText, effectiveTarget, sourceLipi);

  const typoStyle = applyFont ? getTypographyStyle(effectiveTarget) : {};
  const mergedStyle: React.CSSProperties = {
    ...typoStyle,
    ...style,
  };

  return (
    <Component className={`font-indic ${className}`} style={mergedStyle}>
      {renderedText}
    </Component>
  );
};

export default LipiText;
