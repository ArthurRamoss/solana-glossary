import Link from "next/link";
import type { GlossaryTerm } from "@/lib/types";

export default function TermCard({ term }: { term: GlossaryTerm }) {
  return (
    <Link
      href={`/term/${term.id}`}
      className="group gradient-border glow-hover block rounded-xl bg-card p-4 transition-all hover:bg-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-white transition-colors line-clamp-1">
          {term.term}
        </h3>
        <span
          className={`badge-${term.category} shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium`}
        >
          {term.category}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
        {term.definition}
      </p>
      {term.aliases && term.aliases.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {term.aliases.map((alias) => (
            <span
              key={alias}
              className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {alias}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
