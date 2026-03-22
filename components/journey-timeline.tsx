"use client";

import { useEffect, useRef, useState } from "react";
import {
  JOURNEY_STAGES,
  getActiveStageId,
  getRoleStartDate,
  setRoleStartDate,
  addDays,
  formatRuDate,
} from "@/lib/journey";
import {
  getStageTodos,
  addStageTodo,
  updateStageTodo,
  deleteStageTodo,
  type StageTodo,
} from "@/lib/storage";

function pluralDays(n: number): string {
  const abs = Math.abs(n);
  if (abs % 10 === 1 && abs % 100 !== 11) return `${abs} день`;
  if (abs % 10 >= 2 && abs % 10 <= 4 && (abs % 100 < 10 || abs % 100 >= 20)) return `${abs} дня`;
  return `${abs} дней`;
}

function daysUntil(d: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// ─── Stage todos ──────────────────────────────────────────────────────────────

function StageTodos({ stageId }: { stageId: string }) {
  const [todos, setTodos] = useState<StageTodo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const newInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodos(getStageTodos(stageId));
  }, [stageId]);

  useEffect(() => {
    if (adding) newInputRef.current?.focus();
  }, [adding]);

  function handleAdd() {
    const text = newText.trim();
    if (!text) { setAdding(false); return; }
    const todo = addStageTodo(stageId, text);
    setTodos(prev => [...prev, todo]);
    setNewText("");
    setAdding(false);
  }

  function commitEdit(id: string) {
    const text = editText.trim();
    if (!text) {
      deleteStageTodo(stageId, id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } else {
      updateStageTodo(stageId, id, { text });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    }
    setEditingId(null);
  }

  function handleToggle(id: string, done: boolean) {
    updateStageTodo(stageId, id, { done });
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done } : t));
  }

  return (
    <div className="mt-2">
      {todos.map(todo => (
        <div key={todo.id} className="flex items-start gap-1.5 mb-1">
          <button
            onClick={() => handleToggle(todo.id, !todo.done)}
            className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
            style={{
              border: "1.5px solid var(--border)",
              background: todo.done ? "var(--accent)" : "transparent",
              borderColor: todo.done ? "var(--accent)" : "var(--border)",
            }}
          >
            {todo.done && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {editingId === todo.id ? (
            <input
              autoFocus
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={() => commitEdit(todo.id)}
              onKeyDown={e => {
                if (e.key === "Enter") commitEdit(todo.id);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="flex-1 text-xs bg-transparent outline-none"
              style={{ color: "var(--foreground)", borderBottom: "1px solid var(--accent)" }}
            />
          ) : (
            <span
              onClick={() => { setEditingId(todo.id); setEditText(todo.text); }}
              className="flex-1 text-xs cursor-text leading-snug"
              style={{
                color: todo.done ? "var(--muted-foreground)" : "var(--foreground)",
                textDecoration: todo.done ? "line-through" : "none",
                opacity: todo.done ? 0.6 : 1,
              }}
            >
              {todo.text}
            </span>
          )}
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-3.5 h-3.5 shrink-0 rounded" style={{ border: "1.5px solid var(--border)" }} />
          <input
            ref={newInputRef}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onBlur={handleAdd}
            onKeyDown={e => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setAdding(false); setNewText(""); }
            }}
            placeholder="Новый пункт..."
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> добавить
        </button>
      )}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export function JourneyTimeline() {
  const [roleStart, setRoleStart] = useState<Date>(() => new Date("2026-04-10T00:00:00"));
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRoleStart(getRoleStartDate());
  }, []);

  useEffect(() => {
    if (editingDate) dateInputRef.current?.focus();
  }, [editingDate]);

  const activeId = getActiveStageId();

  // Compute display date for each stage
  function stageDate(stageId: string): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (stageId === "preparation") return today;
    const offsets: Record<string, number> = {
      start: 0,
      diagnosis: 1,
      focus: 31,
      change: 61,
    };
    return addDays(roleStart, offsets[stageId] ?? 0);
  }

  function handleDateChange(stageId: string, value: string) {
    if (!value) return;
    const newDate = new Date(value + "T00:00:00");
    // All editable stages are offset from roleStart — translate back
    const offsets: Record<string, number> = {
      start: 0,
      diagnosis: 1,
      focus: 31,
      change: 61,
    };
    const offset = offsets[stageId] ?? 0;
    const newRoleStart = addDays(newDate, -offset);
    setRoleStartDate(newRoleStart);
    setRoleStart(newRoleStart);
    setEditingDate(null);
  }

  return (
    <div className="pt-4 pb-1">
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "var(--border)" }}
        />

        <div className="flex flex-col gap-0">
          {JOURNEY_STAGES.map((stage, i) => {
            const isActive = stage.id === activeId;
            const isPast = JOURNEY_STAGES.findIndex(s => s.id === activeId) > i;
            const date = stageDate(stage.id);
            const remaining = stage.id !== "preparation" ? daysUntil(date) : null;
            const isEditable = stage.id !== "preparation";

            return (
              <div key={stage.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {isActive ? (
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "var(--accent)", background: "var(--card)" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    </div>
                  ) : (
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{
                        background: isPast ? "var(--border)" : "var(--secondary)",
                        border: "1.5px solid var(--border)",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Date row */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Date label */}
                    {editingDate === stage.id ? (
                      <input
                        ref={dateInputRef}
                        type="date"
                        defaultValue={date.toISOString().split("T")[0]}
                        onChange={e => handleDateChange(stage.id, e.target.value)}
                        onBlur={() => setEditingDate(null)}
                        className="text-[10px] font-medium uppercase tracking-wide bg-transparent outline-none"
                        style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)", width: "120px" }}
                      />
                    ) : (
                      <span
                        className="text-[10px] font-medium uppercase tracking-wide"
                        style={{
                          color: isActive ? "var(--accent)" : "var(--border)",
                          cursor: isEditable ? "pointer" : "default",
                        }}
                        onClick={() => isEditable && setEditingDate(stage.id)}
                        title={isEditable ? "Изменить дату" : undefined}
                      >
                        {formatRuDate(date)}
                      </span>
                    )}

                    {/* Days remaining */}
                    {remaining !== null && remaining > 0 && (
                      <span
                        className="text-[10px] font-medium tabular-nums shrink-0"
                        style={{ color: isActive ? "var(--accent)" : "var(--muted-foreground)", opacity: isPast ? 0 : 1 }}
                      >
                        через {pluralDays(remaining)}
                      </span>
                    )}
                    {remaining !== null && remaining <= 0 && !isPast && isActive && (
                      <span className="text-[10px] font-medium shrink-0" style={{ color: "var(--accent)" }}>
                        активен
                      </span>
                    )}
                  </div>

                  {/* Stage name */}
                  <div
                    className="text-sm font-semibold leading-snug mt-0.5"
                    style={{
                      color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                      opacity: isPast ? 0.5 : 1,
                    }}
                  >
                    {stage.label}
                  </div>

                  {/* Description */}
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--muted-foreground)",
                      opacity: isPast ? 0.5 : isActive ? 1 : 0.75,
                    }}
                  >
                    {stage.description}
                  </div>

                  {/* Reflection question — only for active stage */}
                  {isActive && (
                    <div
                      className="mt-2 text-xs italic px-3 py-2 rounded-xl"
                      style={{
                        background: "var(--secondary)",
                        color: "var(--muted-foreground)",
                        borderLeft: "2px solid var(--accent)",
                      }}
                    >
                      {stage.question}
                    </div>
                  )}

                  <StageTodos stageId={stage.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
