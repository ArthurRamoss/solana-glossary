import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana Glossary — 1001 Terms Explored",
  description:
    "The definitive Solana glossary. Search, browse, and explore 1001 terms with interactive relationship graphs and multi-language support.",
  keywords: ["Solana", "glossary", "blockchain", "crypto", "web3", "definitions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="noise-bg min-h-full flex flex-col bg-background text-foreground">
        <Navigation />
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-border py-6 text-center text-sm text-muted">
          <p>
            Built on{" "}
            <a
              href="https://github.com/solanabr/solana-glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-purple hover:text-solana-green transition-colors"
            >
              @stbr/solana-glossary
            </a>{" "}
            — 1001 terms across 14 categories
          </p>
        </footer>
      </body>
    </html>
  );
}
