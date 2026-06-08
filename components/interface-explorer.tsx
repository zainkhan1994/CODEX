"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BlueprintTreeView } from "@/components/interfaces/blueprint-tree-view";
import { BlueprintGraphView } from "@/components/interfaces/blueprint-graph-view";
import { LogoMapView } from "@/components/interfaces/logo-map-view";
import {
  BriefcaseBusiness,
  GripVertical,
  LayoutPanelLeft,
  LibraryBig,
  Mail,
  Network,
  Newspaper,
  PenTool,
  UserRound,
} from "lucide-react";

export type InterfaceViewId =
  | "tree"
  | "graph"
  | "logo-map"
  | "mindmap-demo"
  | "portfolio"
  | "about"
  | "projects"
  | "blog"
  | "contact";

type InterfaceItem = {
  id: string;
  label: string;
  kind: string;
  href: string;
  description: string;
  group: string;
};

const interfaceItems: InterfaceItem[] = [
  {
    id: "tree",
    label: "Blueprint Tree",
    kind: "Primary",
    href: "/blueprint/tree",
    description: "The original organizer UI with toolbar actions, tree navigation, search, and export controls.",
    group: "Blueprint Workspace",
  },
  {
    id: "graph",
    label: "Mind Map Explorer",
    kind: "Primary",
    href: "/blueprint/graph",
    description: "The graph-first explorer for navigating Blueprint data spatially from a high-level overview.",
    group: "Blueprint Workspace",
  },
  {
    id: "logo-map",
    label: "Logo Map",
    kind: "Native",
    href: "/blueprint/logo-map",
    description: "Category-based app/logo exploration with grid and mini mind-map modes.",
    group: "Blueprint Workspace",
  },
  {
    id: "mindmap-demo",
    label: "Mind Map Demo",
    kind: "Experiment",
    href: "/blueprint/mindmap-demo",
    description: "The earlier standalone demo for the pure JavaScript MindMapViewer component.",
    group: "Experiments",
  },
  {
    id: "portfolio",
    label: "Portfolio Home",
    kind: "Primary",
    href: "/portfolio",
    description: "The public-facing Blueprint landing experience with the current portfolio narrative.",
    group: "Portfolio Site",
  },
  {
    id: "about",
    label: "About",
    kind: "Page",
    href: "/about",
    description: "The short background and positioning page from the portfolio site.",
    group: "Portfolio Site",
  },
  {
    id: "projects",
    label: "Projects",
    kind: "Page",
    href: "/projects",
    description: "The carousel and grid project listing from the existing Next.js site.",
    group: "Portfolio Site",
  },
  {
    id: "blog",
    label: "Blog",
    kind: "Page",
    href: "/blog",
    description: "The article index for the current site content and writing surface.",
    group: "Portfolio Site",
  },
  {
    id: "contact",
    label: "Contact",
    kind: "Page",
    href: "/contact",
    description: "The contact form and reach-out flow from the existing site.",
    group: "Portfolio Site",
  },
];

const itemIcons: Record<InterfaceViewId, typeof LayoutPanelLeft> = {
  tree: LayoutPanelLeft,
  graph: Network,
  "logo-map": PenTool,
  "mindmap-demo": LibraryBig,
  portfolio: LayoutPanelLeft,
  about: UserRound,
  projects: BriefcaseBusiness,
  blog: Newspaper,
  contact: Mail,
};

export function InterfaceExplorer({
  initialView = "tree",
  children,
}: {
  initialView?: InterfaceViewId;
  children?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<InterfaceViewId>(initialView);
  const [sidebarWidth, setSidebarWidth] = useState(312);
  const dragStateRef = useRef<{ dragging: boolean; startX: number; startWidth: number }>({
    dragging: false,
    startX: 0,
    startWidth: 312,
  });

  useEffect(() => {
    setSelectedId(initialView);
  }, [initialView]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStateRef.current.dragging) return;
      const delta = event.clientX - dragStateRef.current.startX;
      const nextWidth = Math.max(260, Math.min(420, dragStateRef.current.startWidth + delta));
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      dragStateRef.current.dragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const groupedItems = useMemo(() => {
    return interfaceItems.reduce<Record<string, InterfaceItem[]>>((acc, item) => {
      acc[item.group] ??= [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, []);

  const selectedItem =
    interfaceItems.find((item) => item.id === selectedId) ?? interfaceItems[0];

  const embeddedPage = useMemo(() => {
    if (!children) return null;

    return (
      <div className="h-full overflow-y-auto rounded-[28px] border border-border bg-card/75 px-2 py-2">
        {children}
      </div>
    );
  }, [children]);

  const content = useMemo(() => {
    switch (selectedId) {
      case "graph":
        return <BlueprintGraphView mode="workspace" />;
      case "logo-map":
        return <LogoMapView />;
      case "mindmap-demo":
        return <BlueprintGraphView mode="demo" />;
      case "portfolio":
      case "about":
      case "projects":
      case "blog":
      case "contact":
        return (
          embeddedPage ?? (
            <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
              This route is expected to render inside the Blueprint shell.
            </div>
          )
        );
      case "tree":
      default:
        return <BlueprintTreeView />;
    }
  }, [embeddedPage, selectedId]);

  const selectedIcon = itemIcons[selectedId];
  const Icon = selectedIcon;
  const immersiveView = selectedId === "tree";

  return (
    <section className="relative h-[calc(100svh-3.5rem)] overflow-hidden bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--background))_45%,rgba(24,26,34,0.96))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.08),transparent_26%)]" />
      <div className="relative flex h-full gap-4 px-4 py-4 sm:px-6">
        <aside
          className="relative flex shrink-0 flex-col overflow-hidden rounded-[32px] border border-border bg-card/75 backdrop-blur"
          style={{ width: sidebarWidth }}
        >
          <div className="border-b border-border/80 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <LayoutPanelLeft className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-semibold tracking-tight">Blueprint</div>
                <div className="text-sm text-muted-foreground">Unified interface workspace</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
              <div className="text-sm font-medium">My interfaces</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Browse the repo as a product surface instead of a pile of entry points.
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-5">
              {Object.entries(groupedItems).map(([group, items]) => (
                <div key={group}>
                  <div className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {group}
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const itemId = item.id as InterfaceViewId;
                      const ActiveIcon = itemIcons[itemId];
                      const active = selectedItem.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(itemId);
                            if (pathname !== item.href) {
                              router.replace(item.href, { scroll: false });
                            }
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                            active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                          )}
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60">
                            <ActiveIcon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{item.label}</span>
                            <span className="block truncate text-xs text-muted-foreground">{item.kind}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/80 p-4 text-xs text-muted-foreground">
            Drag the edge to resize this rail.
          </div>

          <button
            type="button"
            onMouseDown={(event) => {
              dragStateRef.current = {
                dragging: true,
                startX: event.clientX,
                startWidth: sidebarWidth,
              };
            }}
            className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none"
            aria-label="Resize sidebar"
          >
            <span className="absolute inset-y-0 right-0 flex w-4 items-center justify-center">
              <span className="rounded-full border border-border bg-background/80 p-1 text-muted-foreground">
                <GripVertical className="h-3 w-3" />
              </span>
            </span>
          </button>
        </aside>

        <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden", !immersiveView && "gap-4")}>
          {!immersiveView ? (
            <div className="rounded-[28px] border border-border bg-card/75 p-5 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
                    <Icon className="h-3.5 w-3.5" />
                    {selectedItem.kind}
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight">{selectedItem.label}</h1>
                  <p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">
                    {selectedItem.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId("tree");
                    if (pathname !== "/") router.replace("/", { scroll: false });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Reset to organizer
                </button>
              </div>
            </div>
          ) : null}
          <div className="min-h-0 flex-1 overflow-hidden">{content}</div>
        </div>
      </div>
    </section>
  );
}
