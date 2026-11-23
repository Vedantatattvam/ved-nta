import React from "react";

interface LogoEmblemProps {
  className?: string;
  size?: number;
  alt?: string;
}

export default function LogoEmblem({
  className = "w-20 h-20",
  size,
  alt = "vedāntatattvaṁ Sacred Logo"
}: LogoEmblemProps) {
  return (
    <img
      src="/Logo.png"
      alt={alt}
      className={`object-contain select-none inline-block ${className}`}
      style={size ? { width: size, height: size } : undefined}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback to SVG if PNG fails
        const target = e.currentTarget;
        if (!target.src.endsWith(".svg")) {
          target.src = "/Logo.svg";
        }
      }}
    />
  );
}
