// Anchors — short mental notes to keep in mind.

export interface Anchor {
  id: string;
  text: string;
  priority: 0 | 1 | 2;
}

export const DEFAULT_ANCHORS: Anchor[] = [
  { id: "1", text: "я не должен нравиться", priority: 0 },
  { id: "2", text: "создавать систему, а не тушить пожары", priority: 0 },
  { id: "3", text: "не избегать конфликтов, а управлять напряжением", priority: 0 },
];

const STORAGE_KEY = "anchors";

export function getAnchors(): Anchor[] {
  if (typeof window === "undefined") return DEFAULT_ANCHORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ANCHORS;
    const parsed: Anchor[] = JSON.parse(raw);
    if (parsed.length === 0) return DEFAULT_ANCHORS;
    return parsed.map((a) => ({ ...a, priority: a.priority ?? 0 }));
  } catch {
    return DEFAULT_ANCHORS;
  }
}

export function saveAnchors(anchors: Anchor[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anchors));
}

export function addAnchor(text: string): Anchor {
  const anchor: Anchor = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text,
    priority: 0,
  };
  saveAnchors([anchor, ...getAnchors()]);
  return anchor;
}

export function updateAnchor(id: string, text: string): void {
  saveAnchors(getAnchors().map((a) => (a.id === id ? { ...a, text } : a)));
}

export function cycleAnchorPriority(id: string): Anchor["priority"] {
  const anchors = getAnchors();
  const anchor = anchors.find((a) => a.id === id);
  if (!anchor) return 0;
  const next = ((anchor.priority + 1) % 3) as Anchor["priority"];
  saveAnchors(anchors.map((a) => (a.id === id ? { ...a, priority: next } : a)));
  return next;
}

export function deleteAnchor(id: string): void {
  saveAnchors(getAnchors().filter((a) => a.id !== id));
}

export function getRandomAnchor(anchors: Anchor[]): Anchor | null {
  if (anchors.length === 0) return null;
  return anchors[Math.floor(Math.random() * anchors.length)];
}
