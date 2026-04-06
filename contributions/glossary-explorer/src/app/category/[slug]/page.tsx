import { notFound } from "next/navigation";
import { getCategories, getTermsByCategory } from "@/lib/glossary";
import { categoryMeta } from "@/lib/categories";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";
import TermCard from "@/components/TermCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug as Category];
  if (!meta) return { title: "Category Not Found" };
  return {
    title: `${meta.label} — Solana Glossary`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const meta = categoryMeta[slug as Category];
  if (!meta) notFound();

  const terms = getTermsByCategory(slug as Category).sort((a, b) =>
    a.term.localeCompare(b.term)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div
          className="mb-3 h-1 w-12 rounded-full"
          style={{ background: meta.color }}
        />
        <h1 className="font-mono text-3xl font-bold text-foreground">
          {meta.label}
        </h1>
        <p className="mt-2 text-muted">{meta.description}</p>
        <p className="mt-1 text-sm text-muted">
          {terms.length} terms
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map((term) => (
          <TermCard key={term.id} term={term} />
        ))}
      </div>
    </div>
  );
}
