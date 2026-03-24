"use client";

import { useEffect, useState } from "react";

function formatParts(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const weekday = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return {
    date: `${day}.${month}.${year}, ${weekday}.`,
    time: `${hours}:${minutes}`,
  };
}

export function CurrentDatetime() {
  const [parts, setParts] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    setParts(formatParts(new Date()));
    const id = setInterval(() => setParts(formatParts(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);

  if (!parts) return <div className="mb-6" style={{ height: "20px" }} />;

  return (
    <div
      className="mb-6 text-xs flex justify-between"
      style={{ color: "var(--primary)" }}
    >
      <span>{parts.date}</span>
      <span>{parts.time}</span>
    </div>
  );
}
