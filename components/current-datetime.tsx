"use client";

import { useEffect, useState } from "react";

function format(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const weekday = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year}, ${weekday}. ${hours}:${minutes}`;
}

export function CurrentDatetime() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(format(new Date()));
    const id = setInterval(() => setText(format(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);

  if (!text) return <div className="mb-6" style={{ height: "20px" }} />;

  return (
    <div
      className="mb-6 text-xs"
      style={{ color: "var(--muted-foreground)", paddingLeft: "26px" }}
    >
      {text}
    </div>
  );
}
