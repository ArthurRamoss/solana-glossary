"use client";

import { availableLocales } from "@/lib/i18n";

interface LocaleToggleProps {
  current: string;
  onChange: (locale: string) => void;
}

export default function LocaleToggle({ current, onChange }: LocaleToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden">
      {availableLocales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => onChange(loc.code)}
          className={`px-3 py-1.5 text-xs font-mono transition-colors ${
            current === loc.code
              ? "bg-solana-purple text-white"
              : "bg-card text-muted hover:text-foreground hover:bg-card-hover"
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
