import { StudyNoteAnnotation } from "../types/studyNotes";

const STORAGE_KEY = "vedantatattva_study_notes_v1";

/**
 * Retrieve all saved study notes from localStorage
 */
export function getStudyNotes(): StudyNoteAnnotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading study notes from storage:", err);
    return [];
  }
}

/**
 * Save a new note or update an existing one
 */
export function saveStudyNote(
  note: Omit<StudyNoteAnnotation, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): StudyNoteAnnotation {
  const existingNotes = getStudyNotes();
  const now = new Date().toISOString();

  if (note.id) {
    // Update
    const index = existingNotes.findIndex((n) => n.id === note.id);
    if (index > -1) {
      const updated: StudyNoteAnnotation = {
        ...existingNotes[index],
        ...note,
        id: note.id,
        updatedAt: now,
      };
      existingNotes[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingNotes));
      return updated;
    }
  }

  // Create new
  const newNote: StudyNoteAnnotation = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updatedNotes = [newNote, ...existingNotes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  return newNote;
}

/**
 * Delete a note by ID
 */
export function deleteStudyNote(id: string): boolean {
  try {
    const existingNotes = getStudyNotes();
    const filtered = existingNotes.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error("Error deleting study note:", err);
    return false;
  }
}

/**
 * Get all notes for a specific text & verse
 */
export function getNotesForVerse(
  textId: string,
  chapterId: string,
  verseId: string
): StudyNoteAnnotation[] {
  const all = getStudyNotes();
  return all.filter(
    (n) => n.textId === textId && n.chapterId === chapterId && n.verseId === verseId
  );
}

/**
 * Get count of notes for a grantha
 */
export function getNotesCountForGrantha(textId: string): number {
  const all = getStudyNotes();
  return all.filter((n) => n.textId === textId).length;
}

/**
 * Export notes as a formatted Markdown study journal
 */
export function exportNotesAsMarkdown(notes?: StudyNoteAnnotation[]): string {
  const targetNotes = notes || getStudyNotes();
  if (targetNotes.length === 0) {
    return "# vedāntatattvaṁ Study Journal\n\nNo study annotations recorded yet.";
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let md = `# vedāntatattvaṁ — Scholarly Vedānta Study Journal\n`;
  md += `**Exported on:** ${dateStr}\n`;
  md += `**Total Annotations:** ${targetNotes.length}\n`;
  md += `**Repository:** vedāntatattvaṁ Granthasāraṇī Study Repository\n\n---\n\n`;

  // Group by text
  const byText: Record<string, StudyNoteAnnotation[]> = {};
  targetNotes.forEach((n) => {
    if (!byText[n.textTitle]) {
      byText[n.textTitle] = [];
    }
    byText[n.textTitle].push(n);
  });

  Object.entries(byText).forEach(([textTitle, group]) => {
    md += `## ${textTitle}\n\n`;
    group.forEach((item, idx) => {
      md += `### ${idx + 1}. ${item.chapterTitle} — ${item.verseNumber} ${
        item.verseTitle ? `(${item.verseTitle})` : ""
      }\n`;
      md += `> **Highlighted Excerpt [${item.field.toUpperCase()}]:**\n`;
      md += `> *${item.selectedText.replace(/\n/g, "\n> ")}*\n\n`;
      if (item.note) {
        md += `**Scholarly Annotation / Personal Exegesis:**\n${item.note}\n\n`;
      }
      if (item.tags && item.tags.length > 0) {
        md += `**Tags:** ${item.tags.map((t) => `\`#${t}\``).join(" ")}\n\n`;
      }
      md += `*Recorded:* ${new Date(item.createdAt).toLocaleString()} | *Color Code:* ${item.color}\n\n---\n\n`;
    });
  });

  md += `\n*End of vedāntatattvaṁ Study Journal. वन्दे गुरुपरम्पराम्।*`;
  return md;
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
