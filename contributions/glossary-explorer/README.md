# Solana Glossary Explorer

A modern, dark-themed web interface for exploring the **1001 terms** in the Solana Glossary. Features instant fuzzy search, an interactive relationship graph, multi-language support, and statically generated pages for every term.

**Live Demo:** _coming soon_

## Features

- **Instant Fuzzy Search** — Cmd+K to search across all 1001 terms using Fuse.js. Results appear in real-time with keyboard navigation.
- **Interactive Relationship Graph** — Visualize connections between terms using a force-directed graph. Filter by category, click nodes to navigate.
- **1001 Static Pages** — Every term gets its own pre-rendered page with definition, category badge, aliases, and related term links.
- **14 Category Pages** — Browse terms organized by category with term counts.
- **i18n Support** — Toggle between English, Portuguese (pt-BR), and Spanish.
- **"Solana Terminal" Design** — Dark theme with Solana gradient accents (#9945FF to #14F195), JetBrains Mono typography, glassmorphism cards, and subtle animations.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, SSG) |
| Styling | Tailwind CSS v4 |
| Search | Fuse.js (client-side fuzzy search) |
| Graph | react-force-graph-2d |
| Animations | Framer Motion |
| Data | `@stbr/solana-glossary` JSON data |

## Setup

```bash
# From repository root
cd contributions/glossary-explorer

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (generates 1020 static pages)
npm run build

# Start production server
npm start
```

## Architecture

```
src/
  app/
    page.tsx              # Home: hero + search + category grid
    term/[id]/page.tsx    # Term detail (SSG, 1001 pages)
    category/[slug]/      # Category listing (SSG, 14 pages)
    explore/page.tsx      # Interactive relationship graph
  components/
    SearchBar.tsx         # Cmd+K fuzzy search with Fuse.js
    CategoryGrid.tsx      # Animated category cards
    TermCard.tsx          # Term preview card
    TermDetail.tsx        # Full term view with related links
    ExploreClient.tsx     # Force-directed graph visualization
    LocaleToggle.tsx      # EN/PT/ES language switcher
  lib/
    glossary.ts           # SDK-compatible data layer
    categories.ts         # Category metadata and colors
    i18n.ts               # Localization with pt-BR and es
    types.ts              # GlossaryTerm and Category types
  data/
    terms/*.json          # 14 category files, 1001 terms
    i18n/pt.json          # Portuguese translations
    i18n/es.json          # Spanish translations
```

## SDK Integration

This project mirrors the `@stbr/solana-glossary` SDK API:
- `getTerm(idOrAlias)` — case-insensitive lookup by ID or alias
- `searchTerms(query)` — full-text search across terms
- `getTermsByCategory(category)` — filter by category
- `getLocalizedTerms(locale)` — get translated terms

All 1001 terms are imported from the glossary data files at build time.

## Deploy

Optimized for Vercel:
```bash
vercel --prod
```

Or any static hosting — `npm run build` generates a fully static site.

## License

MIT
