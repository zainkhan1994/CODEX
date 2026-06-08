"use client";

import { useDeferredValue, useMemo, useState } from "react";
import blueprintTreeData from "@/data/blueprint-tree.json";
import { BrandLogo } from "@/components/interfaces/brand-logo";
import { cn } from "@/lib/utils";
import { resolveBlueprintLogo } from "@/lib/blueprint-logos";
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Folder,
  Search,
} from "lucide-react";

type BlueprintItem = {
  id: number;
  name: string;
  description: string;
  type: "folder" | "file";
  parentId: number | null;
};

type BranchKey =
  | "personal"
  | "health"
  | "work"
  | "projects"
  | "growth"
  | "neutral";

type BranchTheme = {
  chip: string;
  dot: string;
  folderIcon: string;
  muted: string;
  row: string;
  rowStrong: string;
  selected: string;
  topLevel: string;
};

const data = blueprintTreeData as BlueprintItem[];

const defaultCollapsedFolders = new Set(
  data.filter((item) => item.type === "folder" && item.parentId !== null).map((item) => item.id)
);

function humanizeName(value: string) {
  return value.replace(/_/g, " ");
}

const branchThemes: Record<BranchKey, BranchTheme> = {
  personal: {
    chip: "border-rose-400/35 bg-rose-500/12 text-rose-100",
    dot: "bg-rose-400",
    folderIcon: "text-rose-300",
    muted: "text-rose-200/75",
    row: "hover:bg-rose-500/6",
    rowStrong: "border-rose-400/22 bg-rose-500/8",
    selected: "border-rose-400/28 bg-rose-500/14",
    topLevel: "border-rose-400/28 bg-rose-500/10 shadow-[inset_0_1px_0_rgba(251,113,133,0.08)]",
  },
  health: {
    chip: "border-amber-300/35 bg-amber-400/12 text-amber-50",
    dot: "bg-amber-300",
    folderIcon: "text-amber-200",
    muted: "text-amber-100/75",
    row: "hover:bg-amber-400/6",
    rowStrong: "border-amber-300/22 bg-amber-400/8",
    selected: "border-amber-300/28 bg-amber-400/14",
    topLevel: "border-amber-300/28 bg-amber-400/10 shadow-[inset_0_1px_0_rgba(252,211,77,0.08)]",
  },
  work: {
    chip: "border-sky-400/35 bg-sky-500/12 text-sky-50",
    dot: "bg-sky-400",
    folderIcon: "text-sky-300",
    muted: "text-sky-100/75",
    row: "hover:bg-sky-500/6",
    rowStrong: "border-sky-400/22 bg-sky-500/8",
    selected: "border-sky-400/28 bg-sky-500/14",
    topLevel: "border-sky-400/28 bg-sky-500/10 shadow-[inset_0_1px_0_rgba(56,189,248,0.08)]",
  },
  projects: {
    chip: "border-violet-400/35 bg-violet-500/12 text-violet-50",
    dot: "bg-violet-400",
    folderIcon: "text-violet-300",
    muted: "text-violet-100/75",
    row: "hover:bg-violet-500/6",
    rowStrong: "border-violet-400/22 bg-violet-500/8",
    selected: "border-violet-400/28 bg-violet-500/14",
    topLevel: "border-violet-400/28 bg-violet-500/10 shadow-[inset_0_1px_0_rgba(167,139,250,0.08)]",
  },
  growth: {
    chip: "border-zinc-500/45 bg-zinc-950 text-zinc-100",
    dot: "bg-zinc-300",
    folderIcon: "text-zinc-200",
    muted: "text-zinc-300/75",
    row: "hover:bg-zinc-900/70",
    rowStrong: "border-zinc-500/22 bg-zinc-900/65",
    selected: "border-zinc-400/28 bg-zinc-900",
    topLevel: "border-zinc-500/28 bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  },
  neutral: {
    chip: "border-border bg-background/70 text-foreground",
    dot: "bg-slate-400",
    folderIcon: "text-slate-300",
    muted: "text-muted-foreground",
    row: "hover:bg-secondary/60",
    rowStrong: "border-border/70 bg-background/55",
    selected: "border-primary/24 bg-primary/10",
    topLevel: "border-border bg-background/60",
  },
};

const branchLegend: Array<{ key: BranchKey; label: string }> = [
  { key: "personal", label: "Personal" },
  { key: "health", label: "Health" },
  { key: "work", label: "Work" },
  { key: "projects", label: "Projects" },
  { key: "growth", label: "Growth" },
];

function getBranchKeyFromName(name: string): BranchKey {
  const normalized = name.toLowerCase();

  if (normalized.includes("personal")) return "personal";
  if (normalized.includes("health")) return "health";
  if (normalized.includes("projects")) return "projects";
  if (normalized.includes("work")) return "work";
  if (normalized.includes("growth")) return "growth";
  return "neutral";
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function BlueprintTreeView() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [collapsedFolders, setCollapsedFolders] = useState<Set<number>>(new Set(defaultCollapsedFolders));
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const { childrenByParent, itemsById, rootItems } = useMemo(() => {
    const children = new Map<number | null, BlueprintItem[]>();
    const byId = new Map<number, BlueprintItem>();

    for (const item of data) {
      byId.set(item.id, item);
      const siblings = children.get(item.parentId) ?? [];
      siblings.push(item);
      children.set(item.parentId, siblings);
    }

    for (const value of Array.from(children.values())) {
      value.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }

    return {
      childrenByParent: children,
      itemsById: byId,
      rootItems: children.get(null) ?? [],
    };
  }, []);

  const selectedItem = itemsById.get(selectedId) ?? rootItems[0];

  const buildPath = (item: BlueprintItem, humanized = true) => {
    const segments: string[] = [];
    let current: BlueprintItem | undefined = item;

    while (current) {
      segments.unshift(humanized ? humanizeName(current.name) : current.name);
      current = current.parentId !== null ? itemsById.get(current.parentId) : undefined;
    }

    return segments;
  };

  const logoById = useMemo(() => {
    const logos = new Map<number, string | null>();

    for (const item of data) {
      logos.set(item.id, resolveBlueprintLogo(buildPath(item, false)));
    }

    return logos;
  }, [itemsById]);

  const branchById = useMemo(() => {
    const branches = new Map<number, BranchKey>();

    for (const item of data) {
      let current: BlueprintItem | undefined = item;

      while (current && current.parentId !== null) {
        current = itemsById.get(current.parentId);
      }

      branches.set(item.id, current ? getBranchKeyFromName(current.name) : "neutral");
    }

    return branches;
  }, [itemsById]);

  const selectedTheme = branchThemes[branchById.get(selectedItem.id) ?? "neutral"];

  const searchResults = useMemo(() => {
    if (!deferredSearch) return [];

    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(deferredSearch) ||
        item.description.toLowerCase().includes(deferredSearch)
      );
    });
  }, [deferredSearch]);

  const counts = useMemo(() => {
    const folders = data.filter((item) => item.type === "folder").length;
    return {
      total: data.length,
      folders,
      files: data.length - folders,
    };
  }, []);

  const toggleFolder = (id: number) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exportJson = () => {
    downloadBlob("blueprint-tree.json", JSON.stringify(data, null, 2), "application/json");
  };

  const exportCsv = () => {
    const headers = ["id", "name", "type", "description", "parentId", "path"];
    const rows = data
      .map((item) =>
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`,
          item.type,
          `"${item.description.replace(/"/g, '""')}"`,
          item.parentId ?? "",
          `"${buildPath(item).join(" > ").replace(/"/g, '""')}"`,
        ].join(",")
      )
      .join("\n");

    downloadBlob("blueprint-tree.csv", `${headers.join(",")}\n${rows}`, "text/csv;charset=utf-8;");
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[32px] border border-border bg-card/80 backdrop-blur">
      <div className="border-b border-border/80 p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Native Tree View
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Blueprint organizer</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
              The tree route now opens in an immersive full-width workspace with Blueprint branch colors applied directly to the hierarchy.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {branchLegend.map((branch) => (
                <span
                  key={branch.key}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em]",
                    branchThemes[branch.key].chip
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full", branchThemes[branch.key].dot)} />
                  {branch.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <button
              type="button"
              onClick={() => setCollapsedFolders(new Set(defaultCollapsedFolders))}
              className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Collapse all
            </button>
            <button
              type="button"
              onClick={() => setCollapsedFolders(new Set())}
              className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              <Download className="h-4 w-4" />
              JSON
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative block max-w-2xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search names or descriptions..."
              className="w-full rounded-2xl border border-border bg-background/70 px-10 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">Total {counts.total}</span>
            <span className="rounded-full border border-border px-3 py-1">Folders {counts.folders}</span>
            <span className="rounded-full border border-border px-3 py-1">Files {counts.files}</span>
          </div>
        </div>
        <div
          className={cn(
            "mt-5 flex items-start gap-4 rounded-[24px] border px-4 py-4",
            selectedTheme.rowStrong
          )}
        >
          <BrandLogo
            alt={humanizeName(selectedItem.name)}
            sizeClassName="h-14 w-14 shrink-0"
            src={logoById.get(selectedItem.id) ?? null}
            fallback={
              selectedItem.type === "folder" ? (
                <Folder className={cn("h-6 w-6", selectedTheme.folderIcon)} />
              ) : (
                <FileText className={cn("h-6 w-6", selectedTheme.folderIcon)} />
              )
            }
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{humanizeName(selectedItem.name)}</h3>
              <span className={cn("rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]", selectedTheme.chip)}>
                {branchById.get(selectedItem.id) ?? "neutral"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedItem.description || "No description for this node."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {buildPath(selectedItem).map((segment, index) => (
                <span
                  key={`${segment}-${index}`}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    index === 0 ? selectedTheme.chip : "border-border bg-background/70"
                  )}
                >
                  {segment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {deferredSearch ? (
          <div className="space-y-2">
            {searchResults.map((item) => {
              const theme = branchThemes[branchById.get(item.id) ?? "neutral"];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    selectedId === item.id
                      ? theme.selected
                      : cn("border-border/70", theme.row)
                  )}
                >
                  <BrandLogo
                    alt={humanizeName(item.name)}
                    className="mt-0.5"
                    sizeClassName="h-10 w-10 shrink-0"
                    src={logoById.get(item.id) ?? null}
                    fallback={
                      item.type === "folder" ? (
                        <Folder className={cn("h-4 w-4", theme.folderIcon)} />
                      ) : (
                        <FileText className={cn("h-4 w-4", theme.folderIcon)} />
                      )
                    }
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{humanizeName(item.name)}</span>
                    {item.description ? (
                      <span className={cn("block text-sm", theme.muted)}>{item.description}</span>
                    ) : null}
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {buildPath(item).join(" / ")}
                    </span>
                  </span>
                </button>
              );
            })}
            {searchResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No matches for “{search}”.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-1">
            {rootItems.map((item) => (
              <TreeBranch
                key={item.id}
                item={item}
                branchById={branchById}
                childrenByParent={childrenByParent}
                collapsedFolders={collapsedFolders}
                logoById={logoById}
                selectedId={selectedId}
                onToggle={toggleFolder}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type TreeBranchProps = {
  item: BlueprintItem;
  branchById: Map<number, BranchKey>;
  childrenByParent: Map<number | null, BlueprintItem[]>;
  collapsedFolders: Set<number>;
  logoById: Map<number, string | null>;
  selectedId: number;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
};

function TreeBranch({
  item,
  branchById,
  childrenByParent,
  collapsedFolders,
  logoById,
  selectedId,
  onToggle,
  onSelect,
}: TreeBranchProps) {
  const children = childrenByParent.get(item.id) ?? [];
  const isFolder = item.type === "folder";
  const isCollapsed = collapsedFolders.has(item.id);
  const isSelected = selectedId === item.id;
  const theme = branchThemes[branchById.get(item.id) ?? "neutral"];
  const isTopLevel = item.parentId === null;

  return (
    <div className={cn("rounded-[26px] border border-transparent", isTopLevel && theme.topLevel)}>
      <div
        className={cn(
          "group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
          isTopLevel ? "mx-2 my-2" : "mx-1",
          isSelected ? theme.selected : cn("border-transparent", theme.row),
          !isSelected && isTopLevel && "border-transparent"
        )}
      >
        <button
          type="button"
          onClick={() => (isFolder ? onToggle(item.id) : onSelect(item.id))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
          aria-label={isFolder ? `${isCollapsed ? "Expand" : "Collapse"} ${item.name}` : `Select ${item.name}`}
        >
          {isFolder ? (
            isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          ) : (
            <span className={cn("h-2.5 w-2.5 rounded-full", theme.dot)} />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <BrandLogo
            alt={humanizeName(item.name)}
            sizeClassName="h-8 w-8 shrink-0"
            src={logoById.get(item.id) ?? null}
            fallback={
              isFolder ? (
                <Folder className={cn("h-4 w-4", theme.folderIcon)} />
              ) : (
                <FileText className={cn("h-4 w-4", theme.folderIcon)} />
              )
            }
          />
          <span className="min-w-0">
            <span className={cn("block truncate text-sm font-medium", isTopLevel && theme.folderIcon)}>
              {humanizeName(item.name)}
            </span>
            {item.description ? (
              <span className={cn("block truncate text-xs", isTopLevel ? theme.muted : "text-muted-foreground")}>
                {item.description}
              </span>
            ) : null}
          </span>
        </button>
      </div>

      {isFolder && !isCollapsed ? (
        <div className={cn("space-y-1 pb-2", isTopLevel ? "pl-7 pr-3" : "pl-7")}>
          {children.map((child) => (
            <TreeBranch
              key={child.id}
              item={child}
              branchById={branchById}
              childrenByParent={childrenByParent}
              collapsedFolders={collapsedFolders}
              logoById={logoById}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
