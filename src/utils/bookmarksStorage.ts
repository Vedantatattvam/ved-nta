export interface VerseBookmark {
  id: string;
  granthaId: string;
  granthaTitle: string;
  chapterId: string;
  chapterTitle: string;
  verseId: string;
  verseNumber: string;
  verseTitle?: string;
  mulaSanskrit: string;
  mulaIast: string;
  englishTranslation: string;
  school?: string;
  author?: string;
  createdAt: number;
}

const BOOKMARKS_STORAGE_KEY = "vedantatattvam_verse_bookmarks_v1";

export function getBookmarks(): VerseBookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading verse bookmarks:", err);
    return [];
  }
}

export function saveBookmark(bookmark: Omit<VerseBookmark, "id" | "createdAt">): VerseBookmark {
  const all = getBookmarks();
  const existingIndex = all.findIndex(
    (b) => b.granthaId === bookmark.granthaId && b.verseId === bookmark.verseId
  );

  const newBookmark: VerseBookmark = {
    ...bookmark,
    id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
  };

  if (existingIndex >= 0) {
    all[existingIndex] = { ...all[existingIndex], ...bookmark };
  } else {
    all.unshift(newBookmark);
  }

  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error("Error saving bookmark:", err);
  }

  return newBookmark;
}

export function removeBookmark(granthaId: string, verseId: string): void {
  const all = getBookmarks();
  const filtered = all.filter(
    (b) => !(b.granthaId === granthaId && b.verseId === verseId)
  );
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Error removing bookmark:", err);
  }
}

export function isVerseBookmarked(granthaId: string, verseId: string): boolean {
  const all = getBookmarks();
  return all.some((b) => b.granthaId === granthaId && b.verseId === verseId);
}
