import { Suspense } from "react";
import { allTerms, getCategories } from "@/lib/glossary";
import { categoryMeta } from "@/lib/categories";
import ExploreClient from "@/components/ExploreClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Relationships — Solana Glossary",
  description:
    "Interactive visualization of relationships between 1001 Solana terms.",
};

export default function ExplorePage() {
  const categories = getCategories().map((slug) => ({
    slug,
    label: categoryMeta[slug].label,
    color: categoryMeta[slug].color,
  }));

  const serializedTerms = allTerms.map((t) => ({
    id: t.id,
    term: t.term,
    category: t.category,
    related: t.related ?? [],
  }));

  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-140px)] items-center justify-center">
          <p className="font-mono text-sm text-muted animate-pulse">
            Loading graph...
          </p>
        </div>
      }
    >
      <ExploreClient terms={serializedTerms} categories={categories} />
    </Suspense>
  );
}
