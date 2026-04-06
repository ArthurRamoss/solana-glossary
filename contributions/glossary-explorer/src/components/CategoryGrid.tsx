"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryCardData {
  slug: string;
  label: string;
  count: number;
  color: string;
}

export default function CategoryGrid({ categories }: { categories: CategoryCardData[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <Link
            href={`/category/${cat.slug}`}
            className="group gradient-border glow-hover block rounded-xl bg-card p-4 transition-all hover:bg-card-hover"
          >
            <div
              className="mb-2 h-1 w-8 rounded-full"
              style={{ background: cat.color }}
            />
            <h3 className="font-mono text-sm font-medium text-foreground group-hover:text-white transition-colors">
              {cat.label}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {cat.count} terms
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
