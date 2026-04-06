# Solana Glossary Explorer

A polished frontend for the **1001-term Solana Glossary** with live MCP-powered AI chat, an interactive relationship graph, localized UI, and statically generated term/category pages.

**MCP Endpoint:** `https://solana-glossary-production-5f40.up.railway.app/mcp`  
**Frontend URL:** _add deployed Appwrite URL here_

## What Ships

- Persistent floating AI widget across the app, plus a shared full-page `/chat` view
- Real MCP tool calling from the chat API with resilient local fallback
- Three AI modes: `Normal`, `Professor`, `Solana Bro`
- EN / PT / ES language switcher with client-side glossary localization
- Relationship graph with hover tooltip, graph deep links, and "Ask AI about this"
- Upgraded category cards with descriptions, counts, and top related-term previews
- Prominent home CTA for graph exploration

## MCP Integration

The chat route keeps OpenAI as the LLM and uses the deployed Streamable HTTP MCP server for tool execution.

Tools wired into the chat flow:

- `lookup_term`
- `search_terms`
- `get_category_terms`
- `get_related_terms`
- `explain_concept`
- `glossary_stats`

If the Railway MCP endpoint fails or times out, the route falls back to local glossary helpers so the chat UI keeps working.

## Locale Model

- Canonical routes and metadata stay in English
- Visible UI and glossary content switch client-side between `en`, `pt`, and `es`
- PT and ES translation JSON files are lazy-loaded only when selected
- Locale choice persists in `localStorage`

## Agent Modes

- `Normal`: concise and direct
- `Professor`: step-by-step teaching with analogies
- `Solana Bro`: more playful crypto-native tone while staying technically correct

## Setup

```bash
cd contributions/glossary-explorer
npm install
npm run dev
```

### Environment

Create a local `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
GLOSSARY_MCP_URL=https://solana-glossary-production-5f40.up.railway.app/mcp
```

`GLOSSARY_MCP_URL` is optional; the deployed Railway endpoint is the default.

## Build

```bash
npm run build
npm start
```

## Manual Verification

- Switch EN / PT / ES in the header and confirm the choice persists after reload
- Open the floating widget, navigate across pages, and confirm the conversation persists
- Visit `/chat` and confirm it shows the same messages and mode as the widget
- Ask glossary questions and confirm the chat triggers requests to the Railway MCP endpoint
- Temporarily break MCP access and confirm the chat still answers via local fallback
- Open `/explore`, hover nodes, and confirm there is no layout shift
- Use `Ask AI about this` from the graph tooltip and confirm the widget opens with context
- Click a chat link to `/explore?highlight=...` and confirm the graph centers on that node
- Verify home category cards show descriptions and top related-term previews

## Architecture

```text
src/
  app/
    api/chat/route.ts        MCP-backed chat endpoint with fallback
    page.tsx                 Home with search, graph CTA, category grid
    explore/page.tsx         Interactive graph route
    chat/page.tsx            Full-page shared chat session
  components/
    ChatPanel.tsx            Shared chat UI for widget and page
    ChatWidget.tsx           Persistent floating assistant
    ExploreClient.tsx        Graph rendering + tooltip + chat bridge
    CategoryGrid.tsx         Redesigned category cards
  contexts/
    ChatContext.tsx          Shared conversation/session state
    LocaleContext.tsx        Global locale state + lazy translation loading
  lib/
    chat-tools.ts            MCP wrapper + local fallback tools
    mcp.ts                   JSON-RPC Streamable HTTP helper
```

## Verification Commands

```bash
cd contributions/glossary-explorer && npm run build
cd <repo-root> && npm test
```

## License

MIT
