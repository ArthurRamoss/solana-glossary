"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { GlossaryTerm } from "@/lib/types";

interface SearchBarProps {
  terms: GlossaryTerm[];
  placeholder?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export default function SearchBar({
  terms,
  placeholder = "Search 1001 Solana terms...",
  autoFocus = false,
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlossaryTerm[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<GlossaryTerm> | null>(null);
  const router = useRouter();

  useEffect(() => {
    fuseRef.current = new Fuse(terms, {
      keys: [
        { name: "term", weight: 2 },
        { name: "id", weight: 1.5 },
        { name: "aliases", weight: 1.5 },
        { name: "definition", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [terms]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(0);
      if (!value.trim()) {
        setResults([]);
        return;
      }
      if (fuseRef.current) {
        const matches = fuseRef.current.search(value, { limit: 8 });
        setResults(matches.map((m) => m.item));
      }
    },
    []
  );

  const navigateToTerm = (id: string) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/term/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigateToTerm(results[selectedIndex].id);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`gradient-border flex items-center rounded-xl bg-card ${
          large ? "px-5 py-4" : "px-4 py-2.5"
        } ${isOpen && results.length > 0 ? "rounded-b-none" : ""}`}
      >
        <svg
          className={`text-muted ${large ? "h-5 w-5" : "h-4 w-4"} mr-3 shrink-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-transparent font-mono outline-none placeholder:text-muted/50 ${
            large ? "text-lg" : "text-sm"
          }`}
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
          ⌘K
        </kbd>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 overflow-hidden rounded-b-xl border border-t-0 border-border bg-[#111111] shadow-2xl">
          {results.map((term, i) => (
            <button
              key={term.id}
              onMouseDown={() => navigateToTerm(term.id)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors ${
                i === selectedIndex ? "bg-card-hover" : ""
              }`}
            >
              <span className="font-mono text-sm font-medium text-foreground">
                {term.term}
              </span>
              <span className={`badge-${term.category} shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium`}>
                {term.category}
              </span>
              <span className="ml-auto truncate text-xs text-muted max-w-[40%]">
                {term.definition.slice(0, 80)}...
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
