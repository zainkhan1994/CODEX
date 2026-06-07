"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import blueprintTreeData from "@/data/blueprint-tree.json";
import sampleMindmapData from "@/data/sample-mindmap.json";
import { Search } from "lucide-react";

type RawNode = {
  id: string;
  name: string;
  description: string;
  type: "root" | "folder" | "file";
  parentId: string | null;
};

type CollapsibleNode = d3.HierarchyNode<RawNode> & {
  _children?: d3.HierarchyNode<RawNode>[];
};

type GraphPointNode = d3.HierarchyPointNode<RawNode> & {
  _children?: d3.HierarchyNode<RawNode>[];
};

type BlueprintGraphViewProps = {
  mode?: "workspace" | "demo";
};

const workspaceNodes: RawNode[] = (blueprintTreeData as Array<{
  id: number;
  name: string;
  description: string;
  type: "folder" | "file";
  parentId: number | null;
}>).map((node) => ({
  id: String(node.id),
  name: node.name.replace(/_/g, " "),
  description: node.description,
  type: node.parentId === null ? "root" : node.type,
  parentId: node.parentId === null ? "root" : String(node.parentId),
}));

const workspaceGraphData: RawNode[] = [
  { id: "root", name: "Blueprint", description: "Workspace root", type: "root", parentId: null },
  ...workspaceNodes,
];

const sampleGraphData: RawNode[] = (() => {
  const sample = sampleMindmapData as {
    nodes: Array<{ id: string; label: string; description?: string; type: string }>;
    edges: Array<{ source: string; target: string }>;
  };
  const parentByChild = new Map<string, string | null>();
  sample.edges.forEach((edge) => parentByChild.set(edge.target, edge.source));
  return sample.nodes.map((node) => ({
    id: node.id,
    name: node.label,
    description: node.description ?? "",
    type: node.type === "root" ? "root" : node.type === "item" ? "file" : "folder",
    parentId: parentByChild.get(node.id) ?? null,
  }));
})();

function computeDefaultCollapsedNodes(data: RawNode[]) {
  const childrenByParent = new Map<string, RawNode[]>();

  for (const node of data) {
    if (!node.parentId) continue;
    const children = childrenByParent.get(node.parentId) ?? [];
    children.push(node);
    childrenByParent.set(node.parentId, children);
  }

  return new Set(
    data
      .filter((node) => node.parentId && childrenByParent.has(node.id))
      .map((node) => node.id)
  );
}

export function BlueprintGraphView({ mode = "workspace" }: BlueprintGraphViewProps) {
  const rawData = mode === "workspace" ? workspaceGraphData : sampleGraphData;
  const defaultCollapsed = useMemo(() => computeDefaultCollapsedNodes(rawData), [rawData]);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set(defaultCollapsed));
  const [selectedId, setSelectedId] = useState<string | null>(mode === "workspace" ? "root" : "root");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const [zoomScale, setZoomScale] = useState(0.85);

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    setCollapsedNodes(new Set(defaultCollapsed));
  }, [defaultCollapsed, mode]);

  const nodesById = useMemo(() => {
    const map = new Map<string, RawNode>();
    rawData.forEach((node) => map.set(node.id, node));
    return map;
  }, [rawData]);

  const searchResults = useMemo(() => {
    if (!deferredSearch) return [];
    return rawData.filter((node) => {
      if (node.id === "root") return false;
      return (
        node.name.toLowerCase().includes(deferredSearch) ||
        node.description.toLowerCase().includes(deferredSearch)
      );
    });
  }, [deferredSearch, rawData]);

  const { nodes, links } = useMemo(() => {
    const stratified = d3
      .stratify<RawNode>()
      .id((d) => d.id)
      .parentId((d) => d.parentId)(rawData);

    stratified.each((node) => {
      const collapsibleNode = node as CollapsibleNode;
      if (collapsedNodes.has(collapsibleNode.data.id) && collapsibleNode.children) {
        collapsibleNode._children = collapsibleNode.children;
        collapsibleNode.children = undefined;
      }
    });

    const tree = d3.tree<RawNode>().nodeSize([52, 260]);
    const laidOut = tree(stratified);

    return {
      nodes: laidOut.descendants() as GraphPointNode[],
      links: laidOut.links(),
    };
  }, [collapsedNodes, rawData]);

  const selectedNode = selectedId ? nodesById.get(selectedId) : null;

  useEffect(() => {
    const svgElement = svgRef.current;
    const groupElement = gRef.current;

    if (!svgElement || !groupElement) return;

    const svg = d3.select(svgElement);
    const group = d3.select(groupElement);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.45, 2.6])
      .on("zoom", (event) => {
        group.attr("transform", event.transform.toString());
        setZoomScale(event.transform.k);
      });

    svg.call(zoom);

    const { width, height } = svgElement.getBoundingClientRect();
    const xs = nodes.map((node) => node.y);
    const ys = nodes.map((node) => node.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const contentWidth = maxX - minX || 1;
    const contentHeight = maxY - minY || 1;
    const scale = Math.max(0.55, Math.min(1, Math.min((width - 160) / contentWidth, (height - 140) / contentHeight)));
    const transform = d3.zoomIdentity
      .translate(width / 2 - (minX + maxX) / 2 * scale, height / 2 - (minY + maxY) / 2 * scale)
      .scale(scale);

    svg.call(zoom.transform, transform);

    return () => {
      svg.on(".zoom", null);
    };
  }, [nodes]);

  const handleToggle = (id: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSearchSelect = (id: string) => {
    setSelectedId(id);
    let current: RawNode | undefined | null = nodesById.get(id);
    const toExpand: string[] = [];
    while (current?.parentId) {
      toExpand.push(current.parentId);
      current = nodesById.get(current.parentId) ?? null;
    }
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      toExpand.forEach((value) => next.delete(value));
      return next;
    });
    setSearch("");
  };

  const labelVisible = (node: GraphPointNode) => {
    const branchNode = Boolean(node.children || node._children);

    if (node.data.id === selectedId || node.data.id === hoveredId) return true;
    if (zoomScale < 0.95) return node.depth <= 1;
    if (zoomScale < 1.35) return node.depth <= 2 && node.data.type !== "file";
    if (zoomScale < 1.8) return node.depth <= 3 && branchNode;
    if (node.data.type === "file" && zoomScale < 2.05) return false;
    return true;
  };

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary">
                {mode === "workspace" ? "Native Graph View" : "Native Demo View"}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {mode === "workspace" ? "Blueprint graph explorer" : "Mind map demo"}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                {mode === "workspace"
                  ? "The graph now starts in a readable overview state and reveals more labels as you zoom or focus specific branches."
                  : "This uses the same native graph engine but points at the original sample mind map structure."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCollapsedNodes(new Set(defaultCollapsed))}
                className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setCollapsedNodes(new Set())}
                className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Expand all
              </button>
            </div>
          </div>
          <div className="relative mt-4 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search nodes..."
              className="w-full rounded-2xl border border-border bg-background/70 px-10 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
            {searchResults.length > 0 ? (
              <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSearchSelect(result.id)}
                    className="w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary/70"
                  >
                    <div className="text-sm font-medium">{result.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{result.description}</div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <div className="h-full overflow-hidden rounded-[24px] border border-border bg-[#050607]">
            <svg ref={svgRef} width="100%" height="100%" className="h-full w-full cursor-grab active:cursor-grabbing">
              <g ref={gRef}>
                {links.map((link, index) => {
                  const path = d3
                    .linkHorizontal<d3.HierarchyPointLink<RawNode>, d3.HierarchyPointNode<RawNode>>()
                    .x((point) => point.y)
                    .y((point) => point.x)(link as any);

                  return (
                    <path
                      key={`${link.source.data.id}-${link.target.data.id}-${index}`}
                      d={path ?? ""}
                      className="fill-none stroke-[rgba(255,255,255,0.14)]"
                    />
                  );
                })}
                {nodes.map((node) => {
                  const isFolder = node.data.type !== "file";
                  const isSelected = node.data.id === selectedId;
                  const showLabel = labelVisible(node);
                  const hasChildren = Boolean(node.children || node._children);

                  return (
                    <g
                      key={node.data.id}
                      transform={`translate(${node.y},${node.x})`}
                      onMouseEnter={() => setHoveredId(node.data.id)}
                      onMouseLeave={() => setHoveredId((current) => (current === node.data.id ? null : current))}
                    >
                      {isSelected ? (
                        <circle r={20} className="fill-none stroke-[rgba(96,165,250,0.65)] stroke-2" />
                      ) : null}
                      <circle
                        r={isFolder ? 13 : 9}
                        className={
                          isFolder
                            ? "fill-[rgba(96,165,250,0.16)] stroke-[rgba(96,165,250,0.92)] stroke-2 cursor-pointer"
                            : "fill-[rgba(244,114,182,0.12)] stroke-[rgba(244,114,182,0.75)] stroke-[1.5] cursor-pointer"
                        }
                        onClick={() => {
                          setSelectedId(node.data.id);
                          if (hasChildren) handleToggle(node.data.id);
                        }}
                      />
                      {showLabel ? (
                        <text
                          x={isFolder ? 20 : 16}
                          y={4}
                          className={isSelected ? "fill-white text-[12px] font-semibold" : "fill-[rgba(255,255,255,0.76)] text-[11px]"}
                        >
                          {node.data.name.length > (isSelected ? 28 : 18)
                            ? `${node.data.name.slice(0, isSelected ? 28 : 18)}…`
                            : node.data.name}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Selection</div>
          <h3 className="mt-2 text-xl font-semibold">{selectedNode?.name ?? "Blueprint"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedNode?.description || "Select a node to inspect its branch in more detail."}
          </p>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Zoom level</div>
            <div className="mt-2 font-medium">{zoomScale.toFixed(2)}x</div>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Visible nodes</div>
            <div className="mt-2 font-medium">{nodes.length}</div>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tips</div>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>Use “Overview” to reset back to a clean high-level graph.</li>
              <li>Leaf labels stay quiet until you zoom or select a node.</li>
              <li>Click folders to expand branches without blowing up the whole map.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
