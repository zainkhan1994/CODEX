"use client";

import { useDeferredValue, useMemo, useState } from "react";
import logoMapApps from "@/data/logo-map-apps.json";
import { cn } from "@/lib/utils";
import { LayoutGrid, Search } from "lucide-react";

type LogoApp = {
  path: string;
  name: string;
  category: string;
  subcategory: string;
};

const apps = logoMapApps as LogoApp[];

const categoryLabels: Record<string, string> = {
  all: "All",
  social: "Social",
  productivity: "Productivity",
  finance: "Finance",
  shopping: "Shopping",
  navigation: "Navigation",
  health: "Health",
  learning: "Learning",
  entertainment: "Entertainment",
  ai: "AI",
};

const subcategoryLabels: Record<string, string> = {
  "direct-messaging": "Direct Messaging",
  communities: "Communities & Groups",
  "social-media": "Social Media",
  planning: "Planning & Notes",
  project: "Project Management",
  automation: "Automation & Tools",
  "finance-apps": "Finance & Payments",
  retail: "Retail",
  food: "Food & Coffee",
  shipping: "Shipping & Tracking",
  maps: "Maps & Transport",
  housing: "Housing & Weather",
  "health-apps": "Health & Fitness",
  "learning-apps": "Learning & Self-Improvement",
  streaming: "Streaming",
  devices: "Devices & Control",
  "ai-tools": "AI & Knowledge Tools",
};

const sharedLogoMap: Record<string, string> = {
  Allstate: "/legacy/shared/logos/allstate.png",
  "American Express": "/legacy/shared/logos/american_express.png",
  "Wells Fargo": "/legacy/shared/logos/wells_fargo.png",
  BofA: "/legacy/shared/logos/bank_of_america.png",
  Chase: "/legacy/shared/logos/chase.png",
  "Credit One": "/legacy/shared/logos/credit_one.png",
  Indigo: "/legacy/shared/logos/indigo.png",
  Nordstrom: "/legacy/shared/logos/nordstrom.png",
  Synchrony: "/legacy/shared/logos/synchrony.png",
  Honda: "/legacy/shared/logos/honda.png",
};

function initials(name: string) {
  return name
    .split(/[\s_-]+/)
    .slice(0, 2)
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase();
}

export function LogoMapView() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPath, setSelectedPath] = useState(apps[0]?.path ?? "");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const categoryMatch = selectedCategory === "all" || app.category === selectedCategory;
      const searchMatch =
        !deferredSearch ||
        app.name.toLowerCase().includes(deferredSearch) ||
        app.path.toLowerCase().includes(deferredSearch);
      return categoryMatch && searchMatch;
    });
  }, [deferredSearch, selectedCategory]);

  const groupedApps = useMemo(() => {
    return filteredApps.reduce<Record<string, LogoApp[]>>((acc, app) => {
      acc[app.subcategory] ??= [];
      acc[app.subcategory].push(app);
      return acc;
    }, {});
  }, [filteredApps]);

  const selectedApp = filteredApps.find((app) => app.path === selectedPath) ?? filteredApps[0] ?? apps[0];

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Native Logo Map</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Applications & services</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
            A React version of the app/logo explorer with category filters, search, and a detail pane for the path and metadata.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <label className="relative block max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search apps, services, or paths..."
                className="w-full rounded-2xl border border-border bg-background/70 px-10 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    selectedCategory === key
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-5">
            {Object.entries(groupedApps).map(([subcategory, items]) => (
              <section key={subcategory}>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                  {subcategoryLabels[subcategory] ?? subcategory}
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {items.map((app) => {
                    const selected = selectedApp?.path === app.path;
                    const logo = sharedLogoMap[app.name];

                    return (
                      <button
                        key={app.path}
                        type="button"
                        onClick={() => setSelectedPath(app.path)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                          selected ? "border-primary/50 bg-primary/10" : "border-border/70 hover:bg-secondary/60"
                        )}
                      >
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background/70">
                          {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logo} alt={app.name} className="h-8 w-8 object-contain" />
                          ) : (
                            <span className="text-sm font-semibold text-primary">{initials(app.name)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{app.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{app.path}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-border bg-card/75">
        <div className="border-b border-border/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Selected App</div>
          <h3 className="mt-2 text-xl font-semibold">{selectedApp?.name ?? "No selection"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedApp
              ? "Inspect the app path, category, and where the logo explorer places it in the Blueprint taxonomy."
              : "Choose an app tile to inspect it."}
          </p>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          {selectedApp ? (
            <>
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</div>
                <div className="mt-2 font-medium">{categoryLabels[selectedApp.category] ?? selectedApp.category}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Subcategory</div>
                <div className="mt-2 font-medium">
                  {subcategoryLabels[selectedApp.subcategory] ?? selectedApp.subcategory}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Blueprint Path</div>
                <code className="mt-3 block break-all rounded-xl bg-background px-3 py-2 text-xs text-muted-foreground">
                  {selectedApp.path}
                </code>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

