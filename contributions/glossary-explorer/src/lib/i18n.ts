import type { GlossaryTerm } from "./types";
import { allTerms, getTerm } from "./glossary";
import ptData from "@/data/i18n/pt.json";
import esData from "@/data/i18n/es.json";

type TranslationMap = Record<string, { term: string; definition: string }>;

const translations: Record<string, TranslationMap> = {
  pt: ptData as TranslationMap,
  es: esData as TranslationMap,
};

export function getLocalizedTerms(locale: string): GlossaryTerm[] {
  const localeData = translations[locale];
  if (!localeData) return allTerms;

  return allTerms.map((t) => {
    const override = localeData[t.id];
    if (!override) return t;
    return { ...t, term: override.term, definition: override.definition };
  });
}

export function getLocalizedTerm(
  id: string,
  locale: string
): GlossaryTerm | undefined {
  const base = getTerm(id);
  if (!base) return undefined;
  if (locale === "en") return base;

  const localeData = translations[locale];
  if (!localeData) return base;

  const override = localeData[base.id];
  if (!override) return base;
  return { ...base, term: override.term, definition: override.definition };
}

export const availableLocales = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
] as const;
