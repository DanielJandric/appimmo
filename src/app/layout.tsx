import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neural Asset Manager",
  description:
    "Console IA premium pour investisseurs immobiliers romands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="bg-slate-950">
      <body
        className={`${jetBrains.variable} bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
