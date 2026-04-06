"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface TermNode {
  id: string;
  term: string;
  category: string;
  related: string[];
}

interface CategoryInfo {
  slug: string;
  label: string;
  color: string;
}

interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
  val: number;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function ExploreClient({
  terms,
  categories,
}: {
  terms: TermNode[];
  categories: CategoryInfo[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all"
  );
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 140,
    });
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 140,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categories) map[c.slug] = c.color;
    return map;
  }, [categories]);

  const graphData = useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? terms.filter((t) => t.related.length > 0)
        : terms.filter((t) => t.category === selectedCategory);

    const nodeIds = new Set(filtered.map((t) => t.id));
    // Include related nodes that are in the filtered set
    const nodes: GraphNode[] = filtered.map((t) => ({
      id: t.id,
      name: t.term,
      category: t.category,
      color: colorMap[t.category] || "#666",
      val: t.related.length + 1,
    }));

    const links: GraphLink[] = [];
    for (const t of filtered) {
      for (const r of t.related) {
        if (nodeIds.has(r)) {
          links.push({ source: t.id, target: r });
        }
      }
    }

    return { nodes, links };
  }, [terms, selectedCategory, colorMap]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      router.push(`/term/${node.id}`);
    },
    [router]
  );

  const nodeCanvasObject = useCallback(
    (node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (!node.x || !node.y) return;
      const label = node.name;
      const fontSize = Math.max(10 / globalScale, 1.5);
      const isHighlighted = node.id === highlight;
      const isHovered = hoveredNode?.id === node.id;
      const radius = Math.sqrt(node.val) * 2;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted || isHovered
        ? "#ffffff"
        : node.color + "cc";
      ctx.fill();

      if (isHighlighted || isHovered) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
      }

      // Label (only show when zoomed enough)
      if (globalScale > 1.5 || isHighlighted || isHovered) {
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isHighlighted || isHovered ? "#ffffff" : "#ffffff99";
        ctx.fillText(label, node.x, node.y + radius + 2);
      }
    },
    [highlight, hoveredNode]
  );

  return (
    <div className="relative h-full">
      {/* Category filter bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
            selectedCategory === "all"
              ? "bg-white text-black"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          All ({terms.filter((t) => t.related.length > 0).length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
              selectedCategory === cat.slug
                ? "text-black"
                : "text-white/70 hover:text-white"
            }`}
            style={{
              background:
                selectedCategory === cat.slug
                  ? cat.color
                  : `${cat.color}22`,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hovered node info */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 gradient-border rounded-xl bg-[#111] p-4 max-w-sm">
          <p className="font-mono text-sm font-semibold text-foreground">
            {hoveredNode.name}
          </p>
          <p className="mt-1 text-xs text-muted">
            {hoveredNode.category} — Click to view details
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="absolute top-4 right-4 z-20 text-right text-xs text-muted font-mono">
        <p>{graphData.nodes.length} nodes</p>
        <p>{graphData.links.length} edges</p>
      </div>

      {/* Graph */}
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0a"
        nodeCanvasObject={nodeCanvasObject as never}
        nodePointerAreaPaint={((node: never, color: string, ctx: CanvasRenderingContext2D) => {
          const n = node as GraphNode & { x?: number; y?: number };
          if (!n.x || !n.y) return;
          const r = Math.sqrt(n.val) * 2 + 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }) as never}
        linkColor={() => "rgba(255,255,255,0.06)"}
        linkWidth={0.5}
        onNodeClick={handleNodeClick as never}
        onNodeHover={((node: never) => setHoveredNode(node as GraphNode | null)) as never}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
