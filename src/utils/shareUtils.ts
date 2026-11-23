/**
 * Canonical domain & sharing utilities for vedāntatattvaṁ
 * All shared links, citations, social channels, and QR codes route to vedantatattvam.com
 */
import QRCode from "qrcode";

export const CANONICAL_PORTAL_URL = "https://vedantatattvam.com";

/**
 * Returns a clean, academic canonical URL for sharing
 */
export function getPublicShareUrl(hashOrQuery?: string): string {
  if (!hashOrQuery) return CANONICAL_PORTAL_URL;
  const clean = hashOrQuery.startsWith("/") || hashOrQuery.startsWith("#") || hashOrQuery.startsWith("?")
    ? hashOrQuery
    : `/#${hashOrQuery}`;
  return `${CANONICAL_PORTAL_URL}${clean}`;
}

/**
 * Generates an ultra-crisp, high-contrast SVG Data URL or canvas data for QR code scanning
 */
export async function generateQrDataUrl(
  text: string = CANONICAL_PORTAL_URL,
  options?: { margin?: number; color?: { dark?: string; light?: string }; width?: number }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 256,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.color?.dark || "#1a130b",
        light: options?.color?.light || "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("QR Code Generation Error:", err);
    return "";
  }
}
