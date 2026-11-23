import { TabType } from "../types";

export interface AppNavState {
  tab: TabType;
  subTab?: "comparative" | "qa";
  subView?: "catalog" | "reader" | "compare" | "commentary";
  textId?: string;
  chapterId?: string;
  verseId?: string;
  compareLeftId?: string;
  compareRightId?: string;
  commentaryId?: string;
  scholarId?: number;
  thinkerId?: string;
  searchQuery?: string;
  isSideNavOpen?: boolean;
  isGlossaryOpen?: boolean;
  timestamp?: number;
}

const GRANTHA_NAMES: Record<string, string> = {
  brahmasutra: "Brahmasūtrāṇi",
  "brahmasutra-saktabhasya": "Śāktabhāṣyam",
  vivekacudamani: "Vivekacūḍāmaṇi",
  sribhasya: "Śrībhāṣyam",
  anubhasya: "Aṇubhāṣyam",
  govindabhasya: "Govindabhāṣyam",
  vedantaparijata: "Vedānta-Pārijāta-Saurabha",
  mandukya: "Māṇḍūkyopaniṣad",
  gita: "Bhagavadgītā",
  upadeshasahasri: "Upadeśasāhasrī",
  tattvasandarbha: "Tattva-Sandarbha",
  siddhantabindu: "Siddhānta-Bindu",
};

export function getFriendlyPageTitle(state: AppNavState): string {
  if (state.tab === "mapping") {
    if (state.subView === "reader" && state.textId) {
      const name = GRANTHA_NAMES[state.textId] || state.textId;
      return `Reader: ${name}`;
    }
    if (state.subView === "compare") {
      return "Comparative Grantha View";
    }
    if (state.subView === "commentary") {
      return `Commentary Exegesis: ${state.commentaryId === "shaktibhashya" ? "Śāktabhāṣyam" : (state.commentaryId || "Commentary")}`;
    }
    return "Granthasāraṇī (Canon)";
  }

  if (state.tab === "tree") {
    if (state.subView === "reader" && state.textId) {
      const name = GRANTHA_NAMES[state.textId] || state.textId;
      return `Reader: ${name}`;
    }
    return "Paramparā Knowledge Tree";
  }

  if (state.tab === "comparative_council" || state.tab === "comparative" || state.tab === "qa" || state.tab === "sastrartha") {
    if (state.subTab === "qa" || state.tab === "qa" || state.tab === "sastrartha") {
      return "Śāstrārtha Inquiry (Q&A)";
    }
    return "Comparative Council";
  }

  if (state.tab === "bengal_vedanta") {
    if (state.scholarId) {
      return `Bengal Scholar #${state.scholarId}`;
    }
    return "Bengal Vedānta Heritage";
  }

  if (state.tab === "early_vedanta") {
    if (state.thinkerId) {
      return `Early Vedānta: ${state.thinkerId}`;
    }
    return "Early Vedānta & Pre-Śaṅkara";
  }

  if (state.tab === "translation") {
    return "Precision Translation";
  }

  if (state.tab === "ocr") {
    return "Manuscript OCR Correction";
  }

  if (state.tab === "bharatiya_lipi") {
    return "Bharatiya Lipi & Typography";
  }

  if (state.tab === "about_us") {
    return "About VedantaTattvam";
  }

  return "vedāntatattvaṁ";
}

/**
 * Converts an AppNavState to a standard URL hash string
 */
export function stateToHash(state: AppNavState): string {
  const parts: string[] = [];
  const tab = state.tab || "mapping";
  parts.push(tab);

  const params = new URLSearchParams();

  if (state.subTab && state.subTab !== "comparative") {
    params.set("subtab", state.subTab);
  }
  if (state.subView && state.subView !== "catalog") {
    params.set("view", state.subView);
  }
  if (state.textId) {
    params.set("text", state.textId);
  }
  if (state.chapterId) {
    params.set("ch", state.chapterId);
  }
  if (state.verseId) {
    params.set("v", state.verseId);
  }
  if (state.compareLeftId) {
    params.set("left", state.compareLeftId);
  }
  if (state.compareRightId) {
    params.set("right", state.compareRightId);
  }
  if (state.commentaryId) {
    params.set("comm", state.commentaryId);
  }
  if (state.scholarId) {
    params.set("scholar", String(state.scholarId));
  }
  if (state.thinkerId) {
    params.set("thinker", state.thinkerId);
  }
  if (state.searchQuery) {
    params.set("q", state.searchQuery);
  }

  const queryStr = params.toString();
  return `#/${parts.join("/")}${queryStr ? `?${queryStr}` : ""}`;
}

/**
 * Parses the current window.location.hash into an AppNavState
 */
export function parseHash(hashStr: string = window.location.hash): AppNavState {
  const clean = (hashStr || "").replace(/^#\/?/, "").trim();
  if (!clean) {
    return { tab: "mapping", subView: "catalog" };
  }

  const [pathPart, queryPart] = clean.split("?");
  const pathSegments = pathPart.split("/").filter(Boolean);

  let tab: TabType = "mapping";
  const validTabs: TabType[] = [
    "tree",
    "mapping",
    "bengal_vedanta",
    "early_vedanta",
    "bharatiya_lipi",
    "comparative_council",
    "comparative",
    "translation",
    "qa",
    "ocr",
    "sastrartha",
    "about_us",
  ];

  if (pathSegments.length > 0 && validTabs.includes(pathSegments[0] as TabType)) {
    tab = pathSegments[0] as TabType;
  }

  // Normalize legacy tab aliases
  if (tab === "comparative" || tab === "qa" || tab === "sastrartha") {
    const subTab = (tab === "qa" || tab === "sastrartha") ? "qa" : "comparative";
    tab = "comparative_council";
    return {
      tab,
      subTab,
      subView: "catalog",
    };
  }

  const result: AppNavState = { tab, subView: "catalog" };

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    if (params.get("subtab") === "qa" || params.get("subtab") === "comparative") {
      result.subTab = params.get("subtab") as "comparative" | "qa";
    }
    const view = params.get("view");
    if (view === "reader" || view === "compare" || view === "commentary" || view === "catalog") {
      result.subView = view;
    }
    if (params.get("text")) result.textId = params.get("text")!;
    if (params.get("ch")) result.chapterId = params.get("ch")!;
    if (params.get("v")) result.verseId = params.get("v")!;
    if (params.get("left")) result.compareLeftId = params.get("left")!;
    if (params.get("right")) result.compareRightId = params.get("right")!;
    if (params.get("comm")) result.commentaryId = params.get("comm")!;
    if (params.get("scholar")) {
      const parsed = parseInt(params.get("scholar")!, 10);
      if (!isNaN(parsed)) result.scholarId = parsed;
    }
    if (params.get("thinker")) result.thinkerId = params.get("thinker")!;
    if (params.get("q")) result.searchQuery = params.get("q")!;
  }

  // Handle shorthand path like #/mapping/reader/brahmasutra
  if (pathSegments.length > 1) {
    const second = pathSegments[1];
    if (second === "reader" || second === "compare" || second === "commentary") {
      result.subView = second;
    }
    if (pathSegments.length > 2) {
      result.textId = pathSegments[2];
    }
  }

  return result;
}

/**
 * Pushes a new state to window.history and updates URL hash
 */
export function pushNavHistory(state: AppNavState): void {
  const newHash = stateToHash(state);
  const currentHash = window.location.hash || "#/mapping";

  if (newHash === currentHash) {
    // Replace state with updated timestamp
    window.history.replaceState({ ...state, timestamp: Date.now() }, "", newHash);
    return;
  }

  window.history.pushState({ ...state, timestamp: Date.now() }, "", newHash);
}

/**
 * Replaces the current state in window.history
 */
export function replaceNavHistory(state: AppNavState): void {
  const newHash = stateToHash(state);
  window.history.replaceState({ ...state, timestamp: Date.now() }, "", newHash);
}
