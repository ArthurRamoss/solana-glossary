import { notFound } from "next/navigation";
import { allTerms, getTerm } from "@/lib/glossary";
import TermDetail from "@/components/TermDetail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return allTerms.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const term = getTerm(id);
  if (!term) return { title: "Term Not Found" };
  return {
    title: `${term.term} — Solana Glossary`,
    description: term.definition.slice(0, 160),
  };
}

export default async function TermPage({ params }: Props) {
  const { id } = await params;
  const term = getTerm(id);
  if (!term) notFound();

  const relatedTerms = (term.related ?? [])
    .map((rid) => getTerm(rid))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTerm>>[];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <TermDetail term={term} relatedTerms={relatedTerms} />
    </div>
  );
}
