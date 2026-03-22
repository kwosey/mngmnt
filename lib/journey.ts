export interface JourneyStage {
  id: string;
  label: string;
  period: string;
  description: string;
  question: string;
  /** day range from role start, inclusive. null = before start */
  dayRange: [number, number] | null;
  /** days offset from role start (null = preparation stage) */
  startOffset: number | null;
}

const DEFAULT_ROLE_START = "2026-04-10";

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "preparation",
    label: "Подготовка",
    period: "Сейчас",
    description: "Изучить команду, контекст, ожидания",
    question: "Я понимаю, куда я иду, или просто жду старта?",
    dayRange: null,
    startOffset: null,
  },
  {
    id: "start",
    label: "Выход",
    period: "День 0",
    description: "Первые разговоры, сбор сигналов",
    question: "Я больше слушаю или сразу начинаю менять?",
    dayRange: [0, 0],
    startOffset: 0,
  },
  {
    id: "diagnosis",
    label: "Диагностика",
    period: "0–30 дней",
    description: "Понять людей, процессы, реальные проблемы",
    question: "Я действительно понимаю систему или делаю быстрые выводы?",
    dayRange: [1, 30],
    startOffset: 1,
  },
  {
    id: "focus",
    label: "Фокус",
    period: "30–60 дней",
    description: "Определить ключевые направления",
    question: "Я выбрал главное или распылился?",
    dayRange: [31, 60],
    startOffset: 31,
  },
  {
    id: "change",
    label: "Изменения",
    period: "60–90 дней",
    description: "Начать внедрять и закреплять решения",
    question: "Я внедряю изменения или просто обсуждаю их?",
    dayRange: [61, Infinity],
    startOffset: 61,
  },
];

export function getRoleStartDate(): Date {
  if (typeof window === "undefined") return new Date(DEFAULT_ROLE_START + "T00:00:00");
  try {
    const raw = localStorage.getItem("role_start_date");
    return new Date((raw ?? DEFAULT_ROLE_START) + "T00:00:00");
  } catch {
    return new Date(DEFAULT_ROLE_START + "T00:00:00");
  }
}

export function setRoleStartDate(date: Date): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("role_start_date", date.toISOString().split("T")[0]);
  }
}

/** Returns the current role day (negative = before start) */
export function getRoleDay(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = getRoleStartDate();
  start.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000);
}

/** Returns the id of the currently active stage */
export function getActiveStageId(): string {
  const day = getRoleDay();
  if (day < 0) return "preparation";
  for (const stage of JOURNEY_STAGES) {
    if (stage.dayRange === null) continue;
    const [min, max] = stage.dayRange;
    if (day >= min && day <= max) return stage.id;
  }
  return "change";
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function formatRuDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}
