/**
 * Local State & Storage Manager for Search History
 * Tracks the last searched terms across sessions (supporting translation & mapping requests)
 * and notifies UI components in real time.
 */

const SEARCH_HISTORY_STORAGE_KEY = "vedanta_search_history_v3";
const LEGACY_STORAGE_KEY = "vedanta_search_history_v2";
const SEARCH_HISTORY_EVENT = "vedanta_search_history_updated";

export type SearchType = "translation" | "mapping" | "general";

export interface SearchHistoryItem {
  query: string;
  type: SearchType;
  context?: string;
  timestamp: number;
}

export const DEFAULT_SEARCH_SUGGESTIONS: string[] = [
  "Athāto Brahma Jijñāsā",
  "तत्त्वमसि (Tat Tvam Asi)",
  "Śrī Bhāṣya",
  "Advaitasiddhi",
  "Nāsadīya Sūkta",
];

export function getSearchHistoryEntries(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY) ||
      sessionStorage.getItem(SEARCH_HISTORY_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, idx): SearchHistoryItem | null => {
        if (typeof item === "string") {
          const trimmed = item.trim();
          if (!trimmed) return null;
          return {
            query: trimmed,
            type: "general",
            timestamp: Date.now() - idx * 1000,
          };
        }
        if (item && typeof item === "object" && typeof item.query === "string") {
          const trimmed = item.query.trim();
          if (!trimmed) return null;
          return {
            query: trimmed,
            type: item.type === "translation" || item.type === "mapping" ? item.type : "general",
            context: typeof item.context === "string" ? item.context : undefined,
            timestamp: Number(item.timestamp) || Date.now(),
          };
        }
        return null;
      })
      .filter((item): item is SearchHistoryItem => item !== null);
  } catch (err) {
    console.warn("Could not read search history from storage:", err);
    return [];
  }
}

export function getSearchHistory(): string[] {
  return getSearchHistoryEntries().map((entry) => entry.query);
}

export function saveSearchHistory(
  input: string | { query: string; type?: SearchType; context?: string },
  defaultType: SearchType = "general"
): SearchHistoryItem[] {
  const query = typeof input === "string" ? input.trim() : input.query.trim();
  if (!query || query.length < 2 || typeof window === "undefined") {
    return getSearchHistoryEntries();
  }

  const explicitType: SearchType =
    typeof input === "object" && input.type ? input.type : defaultType;
  const context = typeof input === "object" ? input.context : undefined;

  try {
    const current = getSearchHistoryEntries();
    // Case-insensitive deduplication, keeping the newest at the top
    const filtered = current.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase()
    );

    const newItem: SearchHistoryItem = {
      query,
      type: explicitType,
      context,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, 15); // Store top 15, UI displays last 5

    const jsonStr = JSON.stringify(updated);
    try {
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, jsonStr);
    } catch {
      sessionStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, jsonStr);
    }

    // Broadcast update across components
    window.dispatchEvent(
      new CustomEvent(SEARCH_HISTORY_EVENT, { detail: { history: updated } })
    );
    return updated;
  } catch (err) {
    console.warn("Could not save search history:", err);
    return getSearchHistoryEntries();
  }
}

export function removeSearchHistoryItem(queryToRemove: string): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getSearchHistoryEntries();
    const updated = current.filter(
      (item) => item.query.toLowerCase() !== queryToRemove.toLowerCase()
    );

    const jsonStr = JSON.stringify(updated);
    try {
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, jsonStr);
    } catch {
      sessionStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, jsonStr);
    }

    window.dispatchEvent(
      new CustomEvent(SEARCH_HISTORY_EVENT, { detail: { history: updated } })
    );
    return updated;
  } catch (err) {
    console.warn("Could not remove item from search history:", err);
    return getSearchHistoryEntries();
  }
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
    sessionStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(SEARCH_HISTORY_EVENT, { detail: { history: [] } })
    );
  } catch (err) {
    console.warn("Could not clear search history:", err);
  }
}

export function subscribeToSearchHistory(
  callback: (history: string[], entries: SearchHistoryItem[]) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const emit = () => {
    const entries = getSearchHistoryEntries();
    const stringList = entries.map((e) => e.query);
    callback(stringList, entries);
  };

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<{ history: SearchHistoryItem[] }>;
    if (custom.detail?.history) {
      const entries = custom.detail.history;
      const stringList = entries.map((e) => e.query);
      callback(stringList, entries);
    } else {
      emit();
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === SEARCH_HISTORY_STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
      emit();
    }
  };

  window.addEventListener(SEARCH_HISTORY_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(SEARCH_HISTORY_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
