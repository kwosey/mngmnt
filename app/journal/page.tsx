"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getJournalEntries,
  saveJournalEntry,
  getTodayEntry,
  getJournalStreak,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  todayStr,
  type JournalEntry,
  type Bookmark,
} from "@/lib/storage";
import { getDailyConceptForDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Tab = "journal" | "bookmarks";

function formatDateRu(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

export default function JournalPage() {
  const today = todayStr();
  const dailyConcept = getDailyConceptForDate(today);

  const [tab, setTab] = useState<Tab>("journal");

  // Journal state
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    const entry = getTodayEntry();
    if (entry) {
      setAnswer(entry.answer);
      setSaved(true);
    }
    setStreak(getJournalStreak());
    setHistory(getJournalEntries());
    setBookmarks(getBookmarks());
  }, []);

  // Journal handlers
  function handleSave() {
    if (!answer.trim()) return;
    const entry: JournalEntry = {
      date: today,
      question: dailyConcept.reflectionQuestion,
      answer: answer.trim(),
      conceptId: dailyConcept.id,
    };
    saveJournalEntry(entry);
    setSaved(true);
    setStreak(getJournalStreak());
    setHistory(getJournalEntries());
  }

  // Bookmark handlers
  function handleAddBookmark() {
    if (!newUrl.trim() || !newTitle.trim()) return;
    const url = normalizeUrl(newUrl.trim());
    try {
      new URL(url);
    } catch {
      setUrlError("Некорректный URL");
      return;
    }
    const bookmark = addBookmark({ url, title: newTitle.trim(), note: newNote.trim() });
    setBookmarks((prev) => [bookmark, ...prev]);
    setNewUrl("");
    setNewTitle("");
    setNewNote("");
    setUrlError("");
    setShowForm(false);
  }

  function handleDeleteBookmark(id: string) {
    deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  function handleFormCancel() {
    setShowForm(false);
    setNewUrl("");
    setNewTitle("");
    setNewNote("");
    setUrlError("");
  }

  const pastEntries = history.filter((e) => e.date !== today);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6 animate-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
              Дневник
            </h1>
            <p className="text-sm text-muted-foreground">{formatDateRu(today)}</p>
          </div>
          {streak > 0 && tab === "journal" && (
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-foreground tabular-nums">{streak}</span>
              <span className="text-xs text-muted-foreground">
                {streak === 1 ? "день подряд" : streak < 5 ? "дня подряд" : "дней подряд"}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-8 animate-in" style={{ animationDelay: "40ms" }}>
          <button
            onClick={() => setTab("journal")}
            className={`pb-2.5 px-1 mr-6 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "journal"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Записи
          </button>
          <button
            onClick={() => setTab("bookmarks")}
            className={`pb-2.5 px-1 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              tab === "bookmarks"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Закладки
            {bookmarks.length > 0 && (
              <span className="text-[11px] text-muted-foreground tabular-nums">{bookmarks.length}</span>
            )}
          </button>
        </div>

        {/* ── Journal tab ── */}
        {tab === "journal" && (
          <div className="animate-in">
            {/* Today's entry */}
            <section className="mb-10">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Концепт дня
                </span>
                <Link
                  href={`/concept/${dailyConcept.id}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  {dailyConcept.title}
                </Link>
              </div>
              <p className="text-base font-medium text-foreground leading-7 mb-5">
                {dailyConcept.reflectionQuestion}
              </p>

              {saved ? (
                <div className="rounded-lg border border-border bg-secondary/60 p-4">
                  <p className="text-base text-foreground leading-7 whitespace-pre-wrap">
                    {answer}
                  </p>
                  <button
                    onClick={() => setSaved(false)}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Редактировать
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Напиши своими словами — это только для тебя..."
                    className="min-h-[140px] text-base leading-7 resize-none bg-secondary border-border"
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={!answer.trim()}>
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* History */}
            {pastEntries.length > 0 && (
              <section>
                <button
                  onClick={() => setShowHistory((v) => !v)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1.5"
                >
                  <span className="text-xs">{showHistory ? "↑" : "↓"}</span>
                  <span>История ({pastEntries.length})</span>
                </button>

                {showHistory && (
                  <div className="flex flex-col gap-6 animate-slide-down">
                    {pastEntries.map((entry) => (
                      <div key={entry.date} className="border-l-2 border-border pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDateRu(entry.date)}
                          </span>
                          <Link
                            href={`/concept/${entry.conceptId}`}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                          >
                            {entry.conceptId}
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-2">
                          {entry.question}
                        </p>
                        <p className="text-sm text-foreground leading-6 whitespace-pre-wrap">
                          {entry.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* ── Bookmarks tab ── */}
        {tab === "bookmarks" && (
          <div className="animate-in">
            {/* Add button / form */}
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors mb-6"
              >
                <span className="text-base leading-none">+</span>
                <span>Добавить закладку</span>
              </button>
            ) : (
              <div className="rounded-lg border border-border bg-secondary/40 p-4 mb-6 animate-slide-down">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Ссылка <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => { setNewUrl(e.target.value); setUrlError(""); }}
                      placeholder="https://example.com"
                      className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${urlError ? "border-destructive" : "border-border"}`}
                      autoFocus
                    />
                    {urlError && (
                      <p className="text-xs text-destructive mt-1">{urlError}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Название <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Что это такое?"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Заметка <span className="text-muted-foreground/50">(необязательно)</span>
                    </label>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Почему это важно, к чему вернуться..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button
                      onClick={handleFormCancel}
                      className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Отмена
                    </button>
                    <Button
                      onClick={handleAddBookmark}
                      disabled={!newUrl.trim() || !newTitle.trim()}
                      size="sm"
                    >
                      Добавить
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Bookmarks list */}
            {bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">Закладок пока нет.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Сохраняй ссылки, к которым хочешь вернуться.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="group rounded-lg border border-border px-4 py-3 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:underline underline-offset-2 block truncate"
                        >
                          {bookmark.title}
                        </a>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground truncate">
                            {extractDomain(bookmark.url)}
                          </span>
                          <span className="text-muted-foreground/30 text-xs">·</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDateShort(bookmark.date)}
                          </span>
                        </div>
                        {bookmark.note && (
                          <p className="text-xs text-muted-foreground mt-1.5 leading-5">
                            {bookmark.note}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        aria-label="Удалить закладку"
                        className="shrink-0 w-6 h-6 flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-all rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
