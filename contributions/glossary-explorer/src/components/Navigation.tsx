"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Graph" },
  { href: "/chat", label: "Ask AI" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 border-b border-border bg-background/80 backdrop-blur-md sticky top-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold gradient-text">
              solana.glossary
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 text-xs text-muted">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
    </nav>
  );
}
