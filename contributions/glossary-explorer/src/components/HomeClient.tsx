"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SearchBar from "./SearchBar";
import CategoryGrid from "./CategoryGrid";
import type { GlossaryTerm } from "@/lib/types";

interface HomeProps {
  terms: GlossaryTerm[];
  categories: {
    slug: string;
    label: string;
    color: string;
    count: number;
    description: string;
  }[];
}

export default function HomeClient({ terms, categories }: HomeProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-4xl font-bold tracking-tight sm:text-6xl"
        >
          <span className="gradient-text">Solana Glossary</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-muted sm:text-xl"
        >
          <span className="font-mono text-foreground">1001</span> terms across{" "}
          <span className="font-mono text-foreground">14</span> categories.
          <br className="hidden sm:block" />
          Search, browse, and explore the Solana ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 mx-auto max-w-2xl"
        >
          <SearchBar terms={terms} large autoFocus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
            or explore the relationship graph
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xl font-semibold">Categories</h2>
          <span className="text-sm text-muted">
            {terms.length} total terms
          </span>
        </div>
        <CategoryGrid categories={categories} />
      </section>
    </div>
  );
}
