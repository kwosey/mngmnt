// All app state lives in localStorage — no backend needed.

// ─── Learned concepts ────────────────────────────────────────────────────────

export function getLearnedConcepts(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("learned_concepts");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function toggleLearnedConcept(id: string): Set<string> {
  const learned = getLearnedConcepts();
  if (learned.has(id)) {
    learned.delete(id);
  } else {
    learned.add(id);
  }
  localStorage.setItem("learned_concepts", JSON.stringify([...learned]));
  return learned;
}

// ─── Journal entries ──────────────────────────────────────────────────────────

export interface JournalEntry {
  date: string; // "YYYY-MM-DD"
  question: string;
  answer: string;
  conceptId: string;
}

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("journal_entries");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries().filter((e) => e.date !== entry.date);
  entries.unshift(entry);
  localStorage.setItem("journal_entries", JSON.stringify(entries));
}

export function getTodayEntry(): JournalEntry | null {
  const today = todayStr();
  return getJournalEntries().find((e) => e.date === today) ?? null;
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function getJournalStreak(): number {
  const entries = getJournalEntries();
  if (entries.length === 0) return 0;

  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  let cursor = new Date();

  // Start counting from today or yesterday
  const todayStr_ = todayStr();
  if (!dates.has(todayStr_)) {
    // Check if yesterday counts
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const d = formatDate(cursor);
    if (dates.has(d)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note: string;
  date: string; // "YYYY-MM-DD"
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("bookmarks");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(data: Pick<Bookmark, "url" | "title" | "note">): Bookmark {
  const bookmark: Bookmark = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    url: data.url,
    title: data.title,
    note: data.note,
    date: todayStr(),
  };
  const bookmarks = getBookmarks();
  bookmarks.unshift(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  return bookmark;
}

export function deleteBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// ─── Stage todos ──────────────────────────────────────────────────────────────

export interface StageTodo {
  id: string;
  text: string;
  done: boolean;
}

function stageTodosKey(stageId: string) {
  return `stage_todos_${stageId}`;
}

export function getStageTodos(stageId: string): StageTodo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(stageTodosKey(stageId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStageTodos(stageId: string, todos: StageTodo[]): void {
  localStorage.setItem(stageTodosKey(stageId), JSON.stringify(todos));
}

export function addStageTodo(stageId: string, text: string): StageTodo {
  const todo: StageTodo = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text,
    done: false,
  };
  saveStageTodos(stageId, [...getStageTodos(stageId), todo]);
  return todo;
}

export function updateStageTodo(stageId: string, id: string, updates: Partial<Pick<StageTodo, "text" | "done">>): void {
  const todos = getStageTodos(stageId).map(t => t.id === id ? { ...t, ...updates } : t);
  saveStageTodos(stageId, todos);
}

export function deleteStageTodo(stageId: string, id: string): void {
  saveStageTodos(stageId, getStageTodos(stageId).filter(t => t.id !== id));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function todayStr(): string {
  return formatDate(new Date());
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}
