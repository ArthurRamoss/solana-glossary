import type { GlossaryTerm, Category } from "./types";

import coreProtocol from "@/data/terms/core-protocol.json";
import programmingModel from "@/data/terms/programming-model.json";
import tokenEcosystem from "@/data/terms/token-ecosystem.json";
import defi from "@/data/terms/defi.json";
import zkCompression from "@/data/terms/zk-compression.json";
import infrastructure from "@/data/terms/infrastructure.json";
import security from "@/data/terms/security.json";
import devTools from "@/data/terms/dev-tools.json";
import network from "@/data/terms/network.json";
import blockchainGeneral from "@/data/terms/blockchain-general.json";
import web3 from "@/data/terms/web3.json";
import programmingFundamentals from "@/data/terms/programming-fundamentals.json";
import aiMl from "@/data/terms/ai-ml.json";
import solanaEcosystem from "@/data/terms/solana-ecosystem.json";

export const allTerms: GlossaryTerm[] = [
  ...coreProtocol,
  ...programmingModel,
  ...tokenEcosystem,
  ...defi,
  ...zkCompression,
  ...infrastructure,
  ...security,
  ...devTools,
  ...network,
  ...blockchainGeneral,
  ...web3,
  ...programmingFundamentals,
  ...aiMl,
  ...solanaEcosystem,
] as GlossaryTerm[];

const termMap = new Map<string, GlossaryTerm>();
const aliasMap = new Map<string, string>();

for (const t of allTerms) {
  termMap.set(t.id, t);
  if (t.aliases) {
    for (const alias of t.aliases) {
      aliasMap.set(alias.toLowerCase(), t.id);
    }
  }
}

export function getTerm(idOrAlias: string): GlossaryTerm | undefined {
  const lower = idOrAlias.toLowerCase();
  const direct = termMap.get(lower) || termMap.get(idOrAlias);
  if (direct) return direct;
  const resolved = aliasMap.get(lower);
  return resolved ? termMap.get(resolved) : undefined;
}

export function searchTerms(query: string): GlossaryTerm[] {
  const q = query.toLowerCase();
  return allTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.id.includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      t.aliases?.some((a) => a.toLowerCase().includes(q))
  );
}

export function getTermsByCategory(category: Category): GlossaryTerm[] {
  return allTerms.filter((t) => t.category === category);
}

const CATEGORIES: Category[] = [
  "core-protocol",
  "programming-model",
  "token-ecosystem",
  "defi",
  "zk-compression",
  "infrastructure",
  "security",
  "dev-tools",
  "network",
  "blockchain-general",
  "web3",
  "programming-fundamentals",
  "ai-ml",
  "solana-ecosystem",
];

export function getCategories(): Category[] {
  return CATEGORIES;
}
