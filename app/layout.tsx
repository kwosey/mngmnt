import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Management OS",
  description: "Инструмент для осмысления управленческих ситуаций",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <div className="flex-1 pb-14 sm:pb-0">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
