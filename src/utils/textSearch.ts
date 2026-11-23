import { PRESEEDED_GRANTHAS } from "../data";
import { PARAMPARA_TRADITIONS } from "../paramparaData";
import { BENGAL_VEDANTA_RESEARCH } from "../bengalVedantaData";

export type SearchFilterScope = "all" | "only_verse_mantra" | "commentary" | "grantha" | "thinker" | "verse";

export interface SearchOptions {
  filterType?: SearchFilterScope;
  maxResults?: number;
}

export interface SearchResultItem {
  id: string;
  type: "verse" | "mantra" | "sutra" | "bhashya" | "grantha" | "thinker" | "tradition";
  textId?: string;
  textTitle: string;
  transliteratedTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  verseId?: string;
  verseNumber?: string;
  verseTitle?: string;
  matchedField: "mulaSanskrit" | "mulaIast" | "englishTranslation" | "bhashya" | "title" | "author" | "doctrine" | "padaccheda" | "anvaya";
  matchedSnippet: string;
  sanskritSnippet?: string;
  englishSnippet?: string;
  authorOrSchool?: string;
  schoolTag?: string;
}

// Normalize diacritics and convert to ASCII-comparable string
export function normalizeSanskritSearch(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents/macrons
    .replace(/[।॥\.,;:\-\(\)\"\'\?!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Full-text search across all preseeded Vedānta granthas, chapters, and verses.
 * Supports filtering specifically to "only_verse_mantra" (strictly Mūla Sanskrit, IAST, number, title).
 */
export function searchAllVedanticTexts(
  query: string,
  maxResultsOrOptions: number | SearchOptions = 30,
  maybeOptions?: SearchOptions
): SearchResultItem[] {
  if (!query || query.trim().length < 2) return [];

  // Parse polymorphic arguments
  let maxResults = 30;
  let options: SearchOptions = {};

  if (typeof maxResultsOrOptions === "number") {
    maxResults = maxResultsOrOptions;
    if (maybeOptions) options = maybeOptions;
  } else if (typeof maxResultsOrOptions === "object" && maxResultsOrOptions !== null) {
    options = maxResultsOrOptions;
    if (typeof options.maxResults === "number") maxResults = options.maxResults;
  }

  const filterType: SearchFilterScope = options.filterType || "all";
  const isOnlyVerseMantra = filterType === "only_verse_mantra" || filterType === "verse";
  const isCommentaryOnly = filterType === "commentary";
  const isGranthaOnly = filterType === "grantha";
  const isThinkerOnly = filterType === "thinker";

  const rawQ = query.trim().toLowerCase();
  const normQ = normalizeSanskritSearch(query);
  const results: SearchResultItem[] = [];

  // 1. Search in Granthas (Texts, Chapters, and Verses)
  for (const grantha of PRESEEDED_GRANTHAS) {
    // If user specifically requested ONLY verses and mantras, or ONLY commentary, or ONLY thinkers,
    // do NOT add grantha overview cards!
    if (!isOnlyVerseMantra && !isCommentaryOnly && !isThinkerOnly) {
      const granthaNorm = normalizeSanskritSearch(`${grantha.title} ${grantha.transliteratedTitle} ${grantha.author} ${grantha.school}`);

      // Check if the grantha metadata matches
      if (granthaNorm.includes(normQ) || grantha.title.toLowerCase().includes(rawQ)) {
        results.push({
          id: `grantha_${grantha.id}`,
          type: "grantha",
          textId: grantha.id,
          textTitle: grantha.title,
          transliteratedTitle: grantha.transliteratedTitle,
          matchedField: "title",
          matchedSnippet: `${grantha.transliteratedTitle} (${grantha.school}) by ${grantha.author}`,
          englishSnippet: grantha.description.substring(0, 160) + "...",
          authorOrSchool: `${grantha.author} • ${grantha.century}`,
          schoolTag: grantha.school,
        });
      }
    }

    // If user specifically selected "Texts & Canons" (grantha) only, skip verses
    if (isGranthaOnly || isThinkerOnly) continue;

    if (!grantha.chapters) continue;

    for (const chapter of grantha.chapters) {
      if (!chapter.verses) continue;

      for (const verse of chapter.verses) {
        const mulaNorm = normalizeSanskritSearch(verse.mulaSanskrit);
        const iastNorm = normalizeSanskritSearch(verse.mulaIast);
        const numNorm = normalizeSanskritSearch(verse.number);
        const titleNorm = verse.title ? normalizeSanskritSearch(verse.title) : "";
        const padaNorm = verse.padaccheda ? normalizeSanskritSearch(verse.padaccheda) : "";
        const anvayaNorm = verse.anvaya ? normalizeSanskritSearch(verse.anvaya) : "";

        let matched = false;
        let matchedField: SearchResultItem["matchedField"] = "mulaIast";
        let matchedSnippet = "";

        if (isOnlyVerseMantra) {
          // STRICT FILTER: Match ONLY on the actual verse/mantra mūla, IAST, number, title, or anvaya/padaccheda.
          // NEVER match on English translation or Bhāṣya commentary!
          if (numNorm.includes(normQ) || (verse.number && verse.number.toLowerCase().includes(rawQ))) {
            matched = true;
            matchedField = "title";
            matchedSnippet = `${verse.number}: ${verse.title || ""}`;
          } else if (titleNorm.includes(normQ) || (verse.title && verse.title.toLowerCase().includes(rawQ))) {
            matched = true;
            matchedField = "title";
            matchedSnippet = verse.title || "";
          } else if (verse.mulaSanskrit.includes(rawQ) || mulaNorm.includes(normQ)) {
            matched = true;
            matchedField = "mulaSanskrit";
            matchedSnippet = verse.mulaSanskrit;
          } else if (iastNorm.includes(normQ) || verse.mulaIast.toLowerCase().includes(rawQ)) {
            matched = true;
            matchedField = "mulaIast";
            matchedSnippet = verse.mulaIast;
          } else if (padaNorm && (padaNorm.includes(normQ) || (verse.padaccheda && verse.padaccheda.toLowerCase().includes(rawQ)))) {
            matched = true;
            matchedField = "padaccheda";
            matchedSnippet = verse.padaccheda || "";
          } else if (anvayaNorm && (anvayaNorm.includes(normQ) || (verse.anvaya && verse.anvaya.toLowerCase().includes(rawQ)))) {
            matched = true;
            matchedField = "anvaya";
            matchedSnippet = verse.anvaya || "";
          }
        } else if (isCommentaryOnly) {
          // Commentary filter: Search specifically in Bhāṣya extract & notes
          const bhashyaNorm = verse.bhashyaExtract ? normalizeSanskritSearch(verse.bhashyaExtract) : "";
          const notesNorm = verse.commentaryNotes ? normalizeSanskritSearch(verse.commentaryNotes) : "";

          if (bhashyaNorm.includes(normQ) || (verse.bhashyaExtract && verse.bhashyaExtract.toLowerCase().includes(rawQ))) {
            matched = true;
            matchedField = "bhashya";
            matchedSnippet = verse.bhashyaExtract || "";
          } else if (notesNorm.includes(normQ) || (verse.commentaryNotes && verse.commentaryNotes.toLowerCase().includes(rawQ))) {
            matched = true;
            matchedField = "bhashya";
            matchedSnippet = verse.commentaryNotes || "";
          }
        } else {
          // "all": Check Mūla, IAST, number, title, translation, and commentary
          const engNorm = normalizeSanskritSearch(verse.englishTranslation);
          const bhashyaNorm = verse.bhashyaExtract ? normalizeSanskritSearch(verse.bhashyaExtract) : "";

          if (numNorm.includes(normQ) || (verse.number && verse.number.toLowerCase().includes(rawQ))) {
            matched = true;
            matchedField = "title";
            matchedSnippet = `${verse.number}: ${verse.title || ""}`;
          } else if (titleNorm.includes(normQ)) {
            matched = true;
            matchedField = "title";
            matchedSnippet = verse.title || "";
          } else if (verse.mulaSanskrit.includes(rawQ) || mulaNorm.includes(normQ)) {
            matched = true;
            matchedField = "mulaSanskrit";
            matchedSnippet = verse.mulaSanskrit;
          } else if (iastNorm.includes(normQ)) {
            matched = true;
            matchedField = "mulaIast";
            matchedSnippet = verse.mulaIast;
          } else if (engNorm.includes(normQ) || verse.englishTranslation.toLowerCase().includes(rawQ)) {
            matched = true;
            matchedField = "englishTranslation";
            matchedSnippet = verse.englishTranslation;
          } else if (bhashyaNorm.includes(normQ) || (verse.bhashyaExtract && verse.bhashyaExtract.includes(rawQ))) {
            matched = true;
            matchedField = "bhashya";
            matchedSnippet = verse.bhashyaExtract || "";
          }
        }

        if (matched) {
          const isSutra =
            grantha.id.includes("brahmasutra") ||
            grantha.id.includes("catuhsutri") ||
            (verse.number && (verse.number.toLowerCase().includes("sutra") || verse.number.toLowerCase().includes("sūtra")));

          const isMantra =
            grantha.id.includes("upanisad") ||
            grantha.transliteratedTitle.toLowerCase().includes("upanisad") ||
            grantha.title.includes("उपनिषद्") ||
            (verse.number && verse.number.toLowerCase().includes("mantra"));

          const itemType: SearchResultItem["type"] = isCommentaryOnly
            ? "bhashya"
            : isSutra
            ? "sutra"
            : isMantra
            ? "mantra"
            : "verse";

          results.push({
            id: `v_${grantha.id}_${chapter.id}_${verse.id}`,
            type: itemType,
            textId: grantha.id,
            textTitle: grantha.title,
            transliteratedTitle: grantha.transliteratedTitle,
            chapterId: chapter.id,
            chapterTitle: chapter.chapterTitle,
            verseId: verse.id,
            verseNumber: verse.number,
            verseTitle: verse.title,
            matchedField,
            matchedSnippet,
            sanskritSnippet: verse.mulaSanskrit,
            englishSnippet: verse.englishTranslation,
            authorOrSchool: `${grantha.author} (${grantha.school.split(" ")[0]})`,
            schoolTag: grantha.schoolTag || grantha.school,
          });
        }
      }
    }
  }

  // 2. Search in Bengal Vedanta Thinkers & Scholars (only when "all" or "thinker")
  if (!isOnlyVerseMantra && !isCommentaryOnly && !isGranthaOnly) {
    for (const scholar of BENGAL_VEDANTA_RESEARCH.scholars) {
      const tNorm = normalizeSanskritSearch(
        `${scholar.name} ${scholar.bengaliName || ""} ${scholar.keyContribution} ${scholar.traditionOrSchool} ${scholar.majorWorks?.join(" ") || ""}`
      );
      if (
        tNorm.includes(normQ) ||
        scholar.name.toLowerCase().includes(rawQ) ||
        (scholar.bengaliName && scholar.bengaliName.includes(query.trim()))
      ) {
        results.push({
          id: `scholar_${scholar.id}`,
          type: "thinker",
          textTitle: scholar.name,
          transliteratedTitle: scholar.bengaliName || scholar.name,
          matchedField: "author",
          matchedSnippet: scholar.keyContribution,
          englishSnippet: scholar.keyContribution,
          authorOrSchool: `Bengal Vedānta • ${scholar.eraPeriod}`,
          schoolTag: scholar.categoryLabel,
        });
      }
    }
  }

  // 3. Search in Parampara Traditions (only when "all" or "grantha")
  if (!isOnlyVerseMantra && !isCommentaryOnly && !isThinkerOnly) {
    for (const p of PARAMPARA_TRADITIONS) {
      const pNorm = normalizeSanskritSearch(
        `${p.name} ${p.founderOrPreceptor} ${p.coreDoctrine} ${p.realityModel} ${p.primaryPhilosophy}`
      );
      if (pNorm.includes(normQ) || p.name.toLowerCase().includes(rawQ)) {
        results.push({
          id: `tradition_${p.id}`,
          type: "tradition",
          textTitle: p.name,
          transliteratedTitle: p.devanagariName,
          matchedField: "doctrine",
          matchedSnippet: `${p.founderOrPreceptor} — ${p.coreDoctrine}`,
          englishSnippet: p.primaryPhilosophy,
          authorOrSchool: `${p.founderOrPreceptor} • ${p.sampradayaName}`,
          schoolTag: p.primaryPhilosophy,
        });
      }
    }
  }

  return results.slice(0, maxResults);
}
