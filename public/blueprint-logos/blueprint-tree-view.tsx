"use client";

import { useDeferredValue, useMemo, useState } from "react";
import blueprintTreeData from "@/data/blueprint-tree.json";
import { cn } from "@/lib/utils";
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

const data = blueprintTreeData as BlueprintItem[];

const defaultCollapsedFolders = new Set(
  data.filter((item) => item.type === "folder" && item.parentId !== null).map((item) => item.id)
);

function humanizeName(value: string) {
  return value.replace(/_/g, " ");
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

  const buildPath = (item: BlueprintItem) => {
    const segments: string[] = [];
    let current: BlueprintItem | undefined = item;

    while (current) {
      segments.unshift(humanizeName(current.name));
      current = current.parentId !== null ? itemsById.get(current.parentId) : undefined;
    }

    return segments;
  };

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
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary">Native Tree View</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Blueprint organizer</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                A native React version of the original folder-and-file workspace with collapse, search, export, and detail inspection.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
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
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block max-w-xl flex-1">
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {deferredSearch ? (
            <div className="space-y-2">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    selectedId === item.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/70 hover:bg-secondary/60"
                  )}
                >
                  {item.type === "folder" ? (
                    <Folder className="mt-0.5 h-4 w-4 text-primary" />
                  ) : (
                    <FileText className="mt-0.5 h-4 w-4 text-rose-400" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{humanizeName(item.name)}</span>
                    {item.description ? (
                      <span className="block text-sm text-muted-foreground">{item.description}</span>
                    ) : null}
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {buildPath(item).join(" / ")}
                    </span>
                  </span>
                </button>
              ))}
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
                  depth={0}
                  childrenByParent={childrenByParent}
                  collapsedFolders={collapsedFolders}
                  selectedId={selectedId}
                  onToggle={toggleFolder}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Inspector</div>
          <h3 className="mt-2 text-xl font-semibold">{humanizeName(selectedItem.name)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedItem.description || "No description for this node."}
          </p>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Path</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {buildPath(selectedItem).map((segment) => (
                <span key={segment} className="rounded-full border border-border px-3 py-1 text-xs">
                  {segment}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Kind</div>
                <div className="mt-2 font-medium capitalize">{selectedItem.type}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Node ID</div>
                <div className="mt-2 font-medium">{selectedItem.id}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Parent</div>
                <div className="mt-2 font-medium">
                  {selectedItem.parentId !== null ? humanizeName(itemsById.get(selectedItem.parentId)?.name ?? "") : "Root"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Children</div>
                <div className="mt-2 font-medium">{childrenByParent.get(selectedItem.id)?.length ?? 0}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Notes</div>
            <p className="mt-2 leading-7 text-muted-foreground">
              This native view uses the legacy Blueprint structure directly from the old static implementation, but now it lives inside the Next.js workspace shell and supports route-based navigation.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

type TreeBranchProps = {
  item: BlueprintItem;
  depth: number;
  childrenByParent: Map<number | null, BlueprintItem[]>;
  collapsedFolders: Set<number>;
  selectedId: number;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
};

function TreeBranch({
  item,
  depth,
  childrenByParent,
  collapsedFolders,
  selectedId,
  onToggle,
  onSelect,
}: TreeBranchProps) {
  const children = childrenByParent.get(item.id) ?? [];
  const isFolder = item.type === "folder";
  const isCollapsed = collapsedFolders.has(item.id);
  const isSelected = selectedId === item.id;
  const indent = depth * 18;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-2xl px-3 py-2 transition-colors",
          isSelected ? "bg-primary/10 text-foreground" : "hover:bg-secondary/60"
        )}
        style={{ marginLeft: indent }}
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
            <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {isFolder ? (
            <Folder className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <FileText className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{humanizeName(item.name)}</span>
            {item.description ? (
              <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
            ) : null}
          </span>
        </button>
      </div>

      {isFolder && !isCollapsed ? (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <TreeBranch
              key={child.id}
              item={child}
              depth={depth + 1}
              childrenByParent={childrenByParent}
              collapsedFolders={collapsedFolders}
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
