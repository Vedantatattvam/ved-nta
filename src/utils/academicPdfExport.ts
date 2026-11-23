import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { GranthaChapter, GranthaVerse, TextEntry } from "../types";
import { StudyNoteAnnotation } from "../types/studyNotes";

/**
 * Clean & normalize text for academic display
 */
function cleanText(str?: string): string {
  if (!str) return "";
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .trim();
}

/**
 * Format current date for academic citation
 */
function getAcademicDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Simple HTML escape helper
 */
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates an offscreen container attached to document.body for layout rendering
 */
function createMonographContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.id = `academic-pdf-export-${Date.now()}`;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // Standard A4 width at 96 DPI
  container.style.backgroundColor = "#FFFFFF";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);
  return container;
}

/**
 * Creates a standard A4 page wrapper (794px x 1123px)
 */
function createPage(pageNum: number): {
  page: HTMLDivElement;
  contentArea: HTMLDivElement;
  footerPageSpan: HTMLSpanElement;
} {
  const page = document.createElement("div");
  page.className = "monograph-pdf-page";
  page.style.width = "794px";
  page.style.height = "1123px";
  page.style.minHeight = "1123px";
  page.style.maxHeight = "1123px";
  page.style.padding = "34px 40px 28px 40px";
  page.style.boxSizing = "border-box";
  page.style.backgroundColor = "#FFFFFF";
  page.style.color = "#2D2319";
  page.style.fontFamily = "'Cardo', 'Gentium Book Plus', 'EB Garamond', Georgia, serif";
  page.style.display = "flex";
  page.style.flexDirection = "column";
  page.style.justifyContent = "space-between";
  page.style.overflow = "hidden";
  page.style.position = "relative";

  // Top Academic Header
  const header = document.createElement("div");
  header.style.flexShrink = "0";
  header.style.marginBottom = "12px";
  header.innerHTML = `
    <div style="height: 3.5px; background: linear-gradient(to right, #b48214, #d4af37, #8c6011); margin-bottom: 7px; border-radius: 2px;"></div>
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <span style="font-size: 13.5px; font-weight: 800; color: #8c6011; font-family: 'Cinzel', serif; letter-spacing: 0.04em;">VEDĀNTATATTVAṂ — ACADEMIC RESEARCH MONOGRAPH</span>
      <span style="font-size: 9.5px; font-style: italic; color: #6e5842; font-family: 'Cardo', serif;">vande guruparamparām</span>
    </div>
    <div style="font-size: 9px; color: #735d45; margin-top: 2px;">
      Monograph generated on ${getAcademicDate()} • Digital Indological & Vedānta Research Core
    </div>
    <div style="height: 1px; background-color: rgba(191, 149, 63, 0.45); margin-top: 6px;"></div>
  `;
  page.appendChild(header);

  // Content Area
  const contentArea = document.createElement("div");
  contentArea.style.flex = "1";
  contentArea.style.display = "flex";
  contentArea.style.flexDirection = "column";
  contentArea.style.gap = "9px";
  contentArea.style.overflow = "hidden";
  page.appendChild(contentArea);

  // Bottom Academic Footer
  const footer = document.createElement("div");
  footer.style.flexShrink = "0";
  footer.style.borderTop = "1px solid rgba(191, 149, 63, 0.5)";
  footer.style.paddingTop = "7px";
  footer.style.marginTop = "6px";
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.alignItems = "center";
  footer.style.fontSize = "9px";
  footer.style.color = "#735d45";
  footer.style.fontStyle = "italic";

  const brandSpan = document.createElement("span");
  brandSpan.textContent = "vedāntatattvaṁ • Digital Indological & Vedānta Research Core";
  footer.appendChild(brandSpan);

  const footerPageSpan = document.createElement("span");
  footerPageSpan.textContent = `Page ${pageNum}`;
  footer.appendChild(footerPageSpan);

  page.appendChild(footer);

  return { page, contentArea, footerPageSpan };
}

/**
 * Distribute content items across standard A4 pages to prevent awkward page splits
 */
function packElementsIntoPages(
  container: HTMLDivElement,
  items: HTMLDivElement[]
): Array<{ page: HTMLDivElement; footerPageSpan: HTMLSpanElement }> {
  const pages: Array<{ page: HTMLDivElement; contentArea: HTMLDivElement; footerPageSpan: HTMLSpanElement }> = [];
  const MAX_CONTENT_HEIGHT = 920; // Safe height budget for 1123px total page

  let currentPage = createPage(1);
  container.appendChild(currentPage.page);
  pages.push(currentPage);

  for (const item of items) {
    currentPage.contentArea.appendChild(item);

    // If item causes content area to exceed safe limit, and page already has prior items
    if (currentPage.contentArea.offsetHeight > MAX_CONTENT_HEIGHT && currentPage.contentArea.children.length > 1) {
      currentPage.contentArea.removeChild(item);

      // Advance to next page
      currentPage = createPage(pages.length + 1);
      container.appendChild(currentPage.page);
      pages.push(currentPage);

      currentPage.contentArea.appendChild(item);
    }
  }

  // Update total page numbers
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.footerPageSpan.textContent = `Page ${idx + 1} of ${totalPages}`;
  });

  return pages;
}

/**
 * Converts array of rendered pages into high-definition vector PDF and triggers browser download
 */
async function renderPagesToPdf(
  pages: Array<{ page: HTMLDivElement; footerPageSpan: HTMLSpanElement }>,
  filename: string,
  container: HTMLDivElement
): Promise<void> {
  try {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i].page, {
        scale: 2, // 2x gives 192-300 DPI publication quality
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        windowWidth: 850,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      if (i > 0) {
        doc.addPage("a4", "portrait");
      }
      doc.addImage(imgData, "JPEG", 0, 0, 210, 297);
    }

    doc.save(filename);
  } finally {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

/**
 * 1. Export Text Reader Chapter / Verse into High-Resolution Indological Academic PDF
 */
export async function exportTextReaderToPdf({
  grantha,
  chapter,
  singleVerse,
  notes = [],
}: {
  grantha: TextEntry;
  chapter: GranthaChapter;
  singleVerse?: GranthaVerse;
  notes?: StudyNoteAnnotation[];
}): Promise<void> {
  const container = createMonographContainer();
  const items: HTMLDivElement[] = [];

  // 1. Monograph Title & Chapter Header Card
  const titleCard = document.createElement("div");
  titleCard.style.background = "linear-gradient(to right, #FFFDF8, #FAF5ED, #FFFDF8)";
  titleCard.style.border = "1px solid #C59B27";
  titleCard.style.borderLeft = "4px solid #8C6011";
  titleCard.style.borderRadius = "6px";
  titleCard.style.padding = "10px 14px";
  titleCard.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
      <h1 style="margin: 0; font-size: 16px; font-weight: 800; color: #2D2319; font-family: 'Cinzel', 'Cardo', serif;">
        ${escapeHtml(grantha.transliteratedTitle || grantha.title)}
      </h1>
      <span style="font-size: 10px; font-weight: 700; color: #8C6011; background: #FAF1E2; border: 1px solid rgba(191,149,63,0.45); padding: 2px 8px; border-radius: 9999px; white-space: nowrap;">
        ${escapeHtml(grantha.school)}
      </span>
    </div>
    <div style="margin-top: 4px; font-size: 10px; color: #6E5842; font-style: italic;">
      Author: ${escapeHtml(grantha.author)} • Era: ${escapeHtml(grantha.century)} • Chapter: ${escapeHtml(chapter.chapterTitle)}
    </div>
  `;
  items.push(titleCard);

  // 2. Chapter Overview & Exegetical Context Box
  if (chapter.summary) {
    const overviewCard = document.createElement("div");
    overviewCard.style.backgroundColor = "#FAF5ED";
    overviewCard.style.border = "1px solid #BF953F";
    overviewCard.style.borderRadius = "6px";
    overviewCard.style.padding = "10px 14px";
    overviewCard.innerHTML = `
      <div style="font-size: 10.5px; font-weight: 800; color: #8C6011; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; font-family: 'Cinzel', serif;">
        CHAPTER OVERVIEW & EXEGETICAL CONTEXT:
      </div>
      <div style="font-size: 10.5px; line-height: 1.55; color: #4A3928;">
        ${escapeHtml(cleanText(chapter.summary))}
      </div>
    `;
    items.push(overviewCard);
  }

  // 3. Verses to Export
  const versesToExport = singleVerse ? [singleVerse] : chapter.verses || [];

  versesToExport.forEach((verse, index) => {
    const verseCard = document.createElement("div");
    verseCard.style.border = "1px solid rgba(191, 149, 63, 0.45)";
    verseCard.style.borderRadius = "6px";
    verseCard.style.backgroundColor = "#FFFDF8";
    verseCard.style.padding = "11px 13px";

    const verseNotes = notes.filter((n) => n.verseId === verse.id);

    verseCard.innerHTML = `
      <!-- Verse Number & Heading -->
      <div style="font-size: 11.5px; font-weight: 800; color: #8C6011; margin-bottom: 7px; font-family: 'Cinzel', serif;">
        [${index + 1}] ${escapeHtml(verse.number)}: ${escapeHtml(verse.title || "Mūla Recension")}
      </div>

      <!-- Sanskrit Mūla in Authentic Devanagari Script -->
      ${
        verse.mulaSanskrit
          ? `
      <div style="background-color: #FAF5ED; border-left: 3.5px solid #8C6011; padding: 7px 11px; margin-bottom: 7px; font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 14.5px; line-height: 1.65; color: #1F160E; font-weight: 600;">
        ${escapeHtml(verse.mulaSanskrit)}
      </div>
      `
          : ""
      }

      <!-- IAST Transliteration -->
      ${
        verse.mulaIast
          ? `
      <div style="font-size: 11px; font-style: italic; color: #5C4731; line-height: 1.5; margin-bottom: 8px; padding-left: 10px; border-left: 2px solid rgba(191,149,63,0.35);">
        <strong style="font-style: normal; color: #8C6011; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 2px;">IAST Transliteration:</strong>
        ${escapeHtml(verse.mulaIast)}
      </div>
      `
          : ""
      }

      <!-- Padaccheda (Word-by-word Analysis) -->
      ${
        verse.padaccheda
          ? `
      <div style="margin-top: 6px; margin-bottom: 7px; font-size: 10px; line-height: 1.5; color: #4A3928; background: #FCFAF6; padding: 6px 10px; border-radius: 4px; border: 1px solid rgba(191,149,63,0.25);">
        <span style="font-weight: 800; color: #6E5842; text-transform: uppercase; font-size: 9px; letter-spacing: 0.04em; display: block; margin-bottom: 2px;">Padaccheda (Word-by-word Analysis):</span>
        <span style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 11.5px; color: #2D2319;">${escapeHtml(
          verse.padaccheda
        )}</span>
      </div>
      `
          : ""
      }

      <!-- Philosophical Translation & Meaning -->
      <div style="margin-top: 7px; margin-bottom: 7px; font-size: 10.5px; line-height: 1.55; color: #2D2319;">
        <span style="font-weight: 800; color: #8C6011; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.04em; display: block; margin-bottom: 2px; font-family: 'Cinzel', serif;">Philosophical Translation & Exegesis:</span>
        ${escapeHtml(verse.englishTranslation)}
      </div>

      <!-- Classical Bhāṣya Commentary Extract if present -->
      ${
        verse.bhashyaExtract
          ? `
      <div style="margin-top: 7px; background-color: #F8F4EA; border-radius: 4px; padding: 7px 10px; font-size: 10px; line-height: 1.55; color: #4A3928; border-left: 2.5px solid #BF953F;">
        <span style="font-weight: 800; color: #6E5842; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 2px;">Classical Bhāṣya Commentary Extract:</span>
        <div style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 11.5px; line-height: 1.6; color: #2D2319;">${escapeHtml(
          verse.bhashyaExtract
        )}</div>
      </div>
      `
          : ""
      }

      <!-- Doctrinal Exegesis Notes -->
      ${
        verse.commentaryNotes
          ? `
      <div style="margin-top: 6px; font-size: 10px; line-height: 1.5; color: #5C4731;">
        <strong style="color: #6E5842; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em;">Doctrinal Exegesis & Philosophical Notes: </strong>
        ${escapeHtml(verse.commentaryNotes)}
      </div>
      `
          : ""
      }

      <!-- Attached Study Annotations -->
      ${
        verseNotes.length > 0
          ? `
      <div style="margin-top: 7px; background-color: #FEF3C7; border: 1px solid #D97706; border-radius: 4px; padding: 6px 10px; font-size: 9.5px; color: #78350F;">
        <strong style="color: #92400E; text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 3px;">Attached Study Annotations (${
          verseNotes.length
        }):</strong>
        ${verseNotes
          .map(
            (vn) =>
              `<div style="margin-top: 2px;">• [${escapeHtml(vn.field.toUpperCase())}] "${escapeHtml(
                vn.selectedText.substring(0, 50)
              )}..." — <em>${escapeHtml(vn.note || "Annotated")}</em></div>`
          )
          .join("")}
      </div>
      `
          : ""
      }
    `;
    items.push(verseCard);
  });

  // 4. Suggested Academic Citation Box
  const citationBox = document.createElement("div");
  citationBox.style.backgroundColor = "#FAF5ED";
  citationBox.style.border = "1px solid #BF953F";
  citationBox.style.borderRadius = "6px";
  citationBox.style.padding = "9px 13px";
  citationBox.innerHTML = `
    <div style="font-size: 9.5px; font-weight: 800; color: #8C6011; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; font-family: 'Cinzel', serif;">
      SUGGESTED ACADEMIC CITATION:
    </div>
    <div style="font-size: 9.5px; line-height: 1.5; color: #3C3024;">
      vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${getAcademicDate()}.
    </div>
  `;
  items.push(citationBox);

  // Distribute into pages and convert to PDF
  const pages = packElementsIntoPages(container, items);
  const filename = `${grantha.id}_${chapter.id}_academic_monograph.pdf`;
  await renderPagesToPdf(pages, filename, container);
}

/**
 * 2. Export Comparative Analysis (Vimarśa) into Academic PDF
 */
export async function exportComparativeAnalysisToPdf({
  verseOrSutra,
  selectedSchools,
  analysisResult,
}: {
  verseOrSutra: string;
  selectedSchools: string[];
  analysisResult: string;
}): Promise<void> {
  const container = createMonographContainer();
  const items: HTMLDivElement[] = [];

  // 1. Header Banner
  const titleCard = document.createElement("div");
  titleCard.style.background = "linear-gradient(to right, #FFFDF8, #FAF5ED, #FFFDF8)";
  titleCard.style.border = "1px solid #C59B27";
  titleCard.style.borderLeft = "4px solid #8C6011";
  titleCard.style.borderRadius = "6px";
  titleCard.style.padding = "10px 14px";
  titleCard.innerHTML = `
    <h1 style="margin: 0; font-size: 16px; font-weight: 800; color: #2D2319; font-family: 'Cinzel', serif;">
      COMPARATIVE VEDĀNTIC VIMARŚA (विमर्शः)
    </h1>
    <div style="margin-top: 3px; font-size: 10px; color: #6E5842; font-style: italic;">
      Multi-School Dialectical Exegesis on Vedāntic Canon & Ontological Realities
    </div>
  `;
  items.push(titleCard);

  // 2. Subject Text Card
  const subjectCard = document.createElement("div");
  subjectCard.style.backgroundColor = "#FAF5ED";
  subjectCard.style.border = "1px solid #BF953F";
  subjectCard.style.borderRadius = "6px";
  subjectCard.style.padding = "10px 13px";
  subjectCard.innerHTML = `
    <div style="font-size: 10px; font-weight: 800; color: #8C6011; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-family: 'Cinzel', serif;">
      CANONICAL SUBJECT TEXT / SŪTRA / VERSE:
    </div>
    <div style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 14px; line-height: 1.6; color: #1F160E; font-weight: 600; margin-bottom: 4px;">
      ${escapeHtml(verseOrSutra)}
    </div>
    <div style="margin-top: 6px; font-size: 9.5px; color: #6E5842;">
      <strong style="color: #8C6011;">Participating Traditions (${selectedSchools.length}):</strong> 
      ${selectedSchools.map((s) => `<span style="background: #FFFDF8; border: 1px solid rgba(191,149,63,0.4); padding: 1px 6px; border-radius: 4px; margin-right: 4px; font-size: 9px;">${escapeHtml(s)}</span>`).join("")}
    </div>
  `;
  items.push(subjectCard);

  // 3. Formatted Analysis Content
  const analysisSections = analysisResult.split(/(?=###?\s+)/);

  analysisSections.forEach((section) => {
    if (!section.trim()) return;

    const sectionCard = document.createElement("div");
    sectionCard.style.backgroundColor = "#FFFDF8";
    sectionCard.style.border = "1px solid rgba(191, 149, 63, 0.35)";
    sectionCard.style.borderRadius = "6px";
    sectionCard.style.padding = "10px 14px";

    // Format markdown bold, italic, and headers
    let htmlContent = escapeHtml(section)
      .replace(/^###?\s+(.*?)$/gm, '<h3 style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; color: #8C6011; font-family: \'Cinzel\', serif;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2D2319;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: #4A3928;">$1</em>')
      .replace(/^\s*-\s+(.*?)$/gm, '<div style="margin-left: 10px; margin-bottom: 4px; display: flex; gap: 6px;"><span style="color: #8C6011;">•</span><span>$1</span></div>')
      .replace(/\n\n/g, '<div style="height: 6px;"></div>');

    sectionCard.innerHTML = `<div style="font-size: 10.5px; line-height: 1.55; color: #2D2319;">${htmlContent}</div>`;
    items.push(sectionCard);
  });

  // 4. Citation Box
  const citationBox = document.createElement("div");
  citationBox.style.backgroundColor = "#FAF5ED";
  citationBox.style.border = "1px solid #BF953F";
  citationBox.style.borderRadius = "6px";
  citationBox.style.padding = "9px 13px";
  citationBox.innerHTML = `
    <div style="font-size: 9.5px; font-weight: 800; color: #8C6011; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; font-family: 'Cinzel', serif;">
      SUGGESTED ACADEMIC CITATION:
    </div>
    <div style="font-size: 9.5px; line-height: 1.5; color: #3C3024;">
      vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${getAcademicDate()}.
    </div>
  `;
  items.push(citationBox);

  const pages = packElementsIntoPages(container, items);
  const filename = `vedantic_comparative_vimarsha_${Date.now()}.pdf`;
  await renderPagesToPdf(pages, filename, container);
}

/**
 * 3. Export Side-by-Side Verse Analysis Layout into Clean Academic PDF Monograph
 */
export async function exportSideBySideVerseCompareToPdf({
  title = "Comparative Side-by-Side Exegesis",
  leftGrantha,
  leftVerse,
  rightGrantha,
  rightVerse,
  philosophicalCrux,
}: {
  title?: string;
  leftGrantha: TextEntry;
  leftVerse: GranthaVerse;
  rightGrantha: TextEntry;
  rightVerse: GranthaVerse;
  philosophicalCrux?: string;
}): Promise<void> {
  const container = createMonographContainer();
  const items: HTMLDivElement[] = [];

  // 1. Header Banner
  const titleCard = document.createElement("div");
  titleCard.style.background = "linear-gradient(to right, #FFFDF8, #FAF5ED, #FFFDF8)";
  titleCard.style.border = "1px solid #C59B27";
  titleCard.style.borderLeft = "4px solid #8C6011";
  titleCard.style.borderRadius = "6px";
  titleCard.style.padding = "10px 14px";
  titleCard.innerHTML = `
    <h1 style="margin: 0; font-size: 15px; font-weight: 800; color: #2D2319; font-family: 'Cinzel', serif;">
      COMPARATIVE SIDE-BY-SIDE VERSE ANALYSIS
    </h1>
    <div style="margin-top: 3px; font-size: 10px; color: #6E5842; font-style: italic;">
      ${escapeHtml(leftGrantha.title)} (${escapeHtml(leftGrantha.school)}) vs. ${escapeHtml(rightGrantha.title)} (${escapeHtml(rightGrantha.school)})
    </div>
  `;
  items.push(titleCard);

  // 2. Philosophical Crux Box
  if (philosophicalCrux) {
    const cruxCard = document.createElement("div");
    cruxCard.style.backgroundColor = "#FAF5ED";
    cruxCard.style.border = "1px solid #BF953F";
    cruxCard.style.borderRadius = "6px";
    cruxCard.style.padding = "9px 13px";
    cruxCard.innerHTML = `
      <div style="font-size: 9.5px; font-weight: 800; color: #8C6011; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; font-family: 'Cinzel', serif;">
        PHILOSOPHICAL CRUX & HERMENEUTICAL TENSION:
      </div>
      <div style="font-size: 10px; line-height: 1.5; color: #4A3928; font-style: italic;">
        ${escapeHtml(cleanText(philosophicalCrux))}
      </div>
    `;
    items.push(cruxCard);
  }

  // 3. Side-by-Side Comparison Container
  const compareBlock = document.createElement("div");
  compareBlock.style.display = "grid";
  compareBlock.style.gridTemplateColumns = "1fr 1fr";
  compareBlock.style.gap = "10px";

  // Left Column
  const leftCol = `
    <div style="background: #FFFDF8; border: 1px solid rgba(191,149,63,0.4); border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px;">
      <div style="border-bottom: 1px solid rgba(191,149,63,0.3); padding-bottom: 5px;">
        <div style="font-size: 12px; font-weight: 800; color: #8C6011; font-family: 'Cinzel', serif;">
          ${escapeHtml(leftGrantha.title)}
        </div>
        <div style="font-size: 9px; color: #6E5842;">
          ${escapeHtml(leftGrantha.school)} • Verse ${escapeHtml(leftVerse.number)}
        </div>
      </div>

      <!-- Sanskrit Mūla -->
      <div style="background-color: #FAF5ED; border-left: 3px solid #8C6011; padding: 6px 9px; font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 13px; line-height: 1.6; color: #1F160E; font-weight: 600;">
        ${escapeHtml(leftVerse.mulaSanskrit)}
      </div>

      <!-- IAST -->
      ${
        leftVerse.mulaIast
          ? `
      <div style="font-size: 10px; font-style: italic; color: #5C4731; line-height: 1.45;">
        ${escapeHtml(leftVerse.mulaIast)}
      </div>
      `
          : ""
      }

      <!-- English Translation -->
      <div style="font-size: 10px; line-height: 1.5; color: #2D2319;">
        <strong style="color: #8C6011; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">Translation & Exegesis:</strong>
        ${escapeHtml(leftVerse.englishTranslation)}
      </div>

      <!-- Bhāṣya Extract -->
      ${
        leftVerse.bhashyaExtract
          ? `
      <div style="background: #F8F4EA; border-radius: 4px; padding: 6px 8px; font-size: 9.5px; line-height: 1.5; color: #4A3928;">
        <strong style="color: #6E5842; font-size: 8.5px; text-transform: uppercase; display: block; margin-bottom: 2px;">Bhāṣya Exegesis:</strong>
        <div style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 11px;">${escapeHtml(
          leftVerse.bhashyaExtract
        )}</div>
      </div>
      `
          : ""
      }

      <!-- Doctrinal Significance -->
      ${
        leftVerse.commentaryNotes
          ? `
      <div style="font-size: 9.5px; line-height: 1.45; color: #5C4731;">
        <strong style="color: #6E5842; font-size: 8.5px; text-transform: uppercase;">Doctrinal Significance: </strong>
        ${escapeHtml(leftVerse.commentaryNotes)}
      </div>
      `
          : ""
      }
    </div>
  `;

  // Right Column
  const rightCol = `
    <div style="background: #FFFDF8; border: 1px solid rgba(191,149,63,0.4); border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px;">
      <div style="border-bottom: 1px solid rgba(191,149,63,0.3); padding-bottom: 5px;">
        <div style="font-size: 12px; font-weight: 800; color: #8C6011; font-family: 'Cinzel', serif;">
          ${escapeHtml(rightGrantha.title)}
        </div>
        <div style="font-size: 9px; color: #6E5842;">
          ${escapeHtml(rightGrantha.school)} • Verse ${escapeHtml(rightVerse.number)}
        </div>
      </div>

      <!-- Sanskrit Mūla -->
      <div style="background-color: #FAF5ED; border-left: 3px solid #8C6011; padding: 6px 9px; font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 13px; line-height: 1.6; color: #1F160E; font-weight: 600;">
        ${escapeHtml(rightVerse.mulaSanskrit)}
      </div>

      <!-- IAST -->
      ${
        rightVerse.mulaIast
          ? `
      <div style="font-size: 10px; font-style: italic; color: #5C4731; line-height: 1.45;">
        ${escapeHtml(rightVerse.mulaIast)}
      </div>
      `
          : ""
      }

      <!-- English Translation -->
      <div style="font-size: 10px; line-height: 1.5; color: #2D2319;">
        <strong style="color: #8C6011; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">Translation & Exegesis:</strong>
        ${escapeHtml(rightVerse.englishTranslation)}
      </div>

      <!-- Bhāṣya Extract -->
      ${
        rightVerse.bhashyaExtract
          ? `
      <div style="background: #F8F4EA; border-radius: 4px; padding: 6px 8px; font-size: 9.5px; line-height: 1.5; color: #4A3928;">
        <strong style="color: #6E5842; font-size: 8.5px; text-transform: uppercase; display: block; margin-bottom: 2px;">Bhāṣya Exegesis:</strong>
        <div style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif; font-size: 11px;">${escapeHtml(
          rightVerse.bhashyaExtract
        )}</div>
      </div>
      `
          : ""
      }

      <!-- Doctrinal Significance -->
      ${
        rightVerse.commentaryNotes
          ? `
      <div style="font-size: 9.5px; line-height: 1.45; color: #5C4731;">
        <strong style="color: #6E5842; font-size: 8.5px; text-transform: uppercase;">Doctrinal Significance: </strong>
        ${escapeHtml(rightVerse.commentaryNotes)}
      </div>
      `
          : ""
      }
    </div>
  `;

  compareBlock.innerHTML = leftCol + rightCol;
  items.push(compareBlock);

  // 4. Citation Box
  const citationBox = document.createElement("div");
  citationBox.style.backgroundColor = "#FAF5ED";
  citationBox.style.border = "1px solid #BF953F";
  citationBox.style.borderRadius = "6px";
  citationBox.style.padding = "9px 13px";
  citationBox.innerHTML = `
    <div style="font-size: 9.5px; font-weight: 800; color: #8C6011; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; font-family: 'Cinzel', serif;">
      SUGGESTED ACADEMIC CITATION:
    </div>
    <div style="font-size: 9.5px; line-height: 1.5; color: #3C3024;">
      vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${getAcademicDate()}.
    </div>
  `;
  items.push(citationBox);

  const pages = packElementsIntoPages(container, items);
  const filename = `comparative_verse_analysis_${leftGrantha.id}_vs_${rightGrantha.id}.pdf`;
  await renderPagesToPdf(pages, filename, container);
}

/**
 * 4. Browser Print-Ready Academic PDF Trigger (Native High-Resolution Vector)
 */
export function triggerAcademicPrint() {
  window.print();
}
