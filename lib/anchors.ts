// Anchors — short mental notes to keep in mind.

export interface Anchor {
  id: string;
  text: string;
}

export const DEFAULT_ANCHORS: Anchor[] = [
  { id: "1", text: "я не должен нравиться" },
  { id: "2", text: "создавать систему, а не тушить пожары" },
  { id: "3", text: "не избегать конфликтов, а управлять напряжением" },
];

const STORAGE_KEY = "anchors";

export function getAnchors(): Anchor[] {
  if (typeof window === "undefined") return DEFAULT_ANCHORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ANCHORS;
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_ANCHORS;
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
  };
  saveAnchors([...getAnchors(), anchor]);
  return anchor;
}

export function deleteAnchor(id: string): void {
  saveAnchors(getAnchors().filter((a) => a.id !== id));
}

export function getRandomAnchor(anchors: Anchor[]): Anchor | null {
  if (anchors.length === 0) return null;
  return anchors[Math.floor(Math.random() * anchors.length)];
}
