import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getTerm, searchTerms, getTermsByCategory } from "@/lib/glossary";
import { getLocalizedTerm } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a Solana glossary assistant. You help users understand Solana blockchain concepts using a comprehensive glossary of 1001 terms across 14 categories.

Always use the available tools to look up terms before answering. Be concise but thorough. When a term has related concepts, mention them. You can answer in the user's language.

Available categories: core-protocol, programming-model, token-ecosystem, defi, zk-compression, infrastructure, security, dev-tools, network, blockchain-general, web3, programming-fundamentals, ai-ml, solana-ecosystem.`,
    messages,
    tools: {
      lookupTerm: tool({
        description:
          "Look up a specific Solana glossary term by ID or alias",
        inputSchema: z.object({
          id: z.string().describe("Term ID or alias (e.g., 'pda', 'proof-of-history')"),
          locale: z.enum(["en", "pt", "es"]).optional(),
        }),
        execute: async ({ id, locale }) => {
          const term = locale ? getLocalizedTerm(id, locale) : getTerm(id);
          if (!term) return { error: `Term "${id}" not found` };
          return term;
        },
      }),
      searchTerms: tool({
        description: "Search the glossary for terms matching a query",
        inputSchema: z.object({
          query: z.string().describe("Search query"),
          limit: z.number().optional().default(5),
        }),
        execute: async ({ query, limit }) => {
          const results = searchTerms(query).slice(0, limit);
          return results.map((t) => ({
            id: t.id,
            term: t.term,
            category: t.category,
            definition: t.definition.slice(0, 150),
          }));
        },
      }),
      getCategoryTerms: tool({
        description: "Get all terms in a category",
        inputSchema: z.object({
          category: z.string().describe("Category slug"),
        }),
        execute: async ({ category }) => {
          const terms = getTermsByCategory(category as Category);
          return {
            category,
            count: terms.length,
            terms: terms.slice(0, 20).map((t) => ({
              id: t.id,
              term: t.term,
            })),
          };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
