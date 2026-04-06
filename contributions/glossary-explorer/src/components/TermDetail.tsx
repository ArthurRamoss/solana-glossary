import Link from "next/link";
import type { GlossaryTerm } from "@/lib/types";

interface TermDetailProps {
  term: GlossaryTerm;
  relatedTerms: GlossaryTerm[];
}

export default function TermDetail({ term, relatedTerms }: TermDetailProps) {
  return (
    <article className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/category/${term.category}`}
          className={`badge-${term.category} inline-block rounded-md px-2.5 py-1 text-xs font-medium mb-4 hover:opacity-80 transition-opacity`}
        >
          {term.category}
        </Link>
        <h1 className="font-mono text-3xl font-bold text-foreground sm:text-4xl">
          {term.term}
        </h1>
        {term.aliases && term.aliases.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {term.aliases.map((alias) => (
              <span
                key={alias}
                className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-sm text-muted"
              >
                {alias}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Definition */}
      <div className="gradient-border rounded-xl bg-card p-6 mb-8">
        <p className="text-base leading-relaxed text-foreground/90">
          {term.definition}
        </p>
      </div>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <div>
          <h2 className="font-mono text-lg font-semibold text-foreground mb-4">
            Related Terms
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedTerms.map((related) => (
              <Link
                key={related.id}
                href={`/term/${related.id}`}
                className="group gradient-border glow-hover rounded-xl bg-card p-4 transition-all hover:bg-card-hover block"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium text-foreground group-hover:text-white transition-colors">
                    {related.term}
                  </span>
                  <span
                    className={`badge-${related.category} rounded px-1.5 py-0.5 text-[10px] font-medium`}
                  >
                    {related.category}
                  </span>
                </div>
                <p className="text-xs text-muted line-clamp-2">
                  {related.definition}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Explore link */}
      <div className="mt-8 text-center">
        <Link
          href={`/explore?highlight=${term.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-all"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07l-2.83 2.83m-8.48 8.48l-2.83 2.83m0-14.14l2.83 2.83m8.48 8.48l2.83 2.83" />
          </svg>
          View in Relationship Graph
        </Link>
      </div>
    </article>
  );
}
