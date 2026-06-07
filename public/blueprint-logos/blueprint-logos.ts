import logoIndex from "@/data/blueprint-logo-index.json";

type LogoIndexEntry = {
  publicPath: string;
  segments: string[];
};

type PreparedLogoEntry = LogoIndexEntry & {
  normalizedPath: string[];
  simplifiedPath: string[];
  leafCandidates: Set<string>;
  segmentCandidates: Set<string>;
};

const trailingNoiseTokens = new Set([
  "acct",
  "account",
  "accounts",
  "fin",
  "sub",
  "subscription",
  "apps",
  "app",
  "cards",
  "card",
]);

const manualAliases: Record<string, string> = {
  amex: "americanexpress",
  bofa: "bankofamerica",
  boa: "bankofamerica",
  cashapp: "cashapp",
  disney: "disneyplus",
  disneyplus: "disneyplus",
  googletasks: "googletasks",
  hbomax: "max",
  hondafs: "hondafs",
  iphone: "iphone15",
  iphone15: "iphone15",
  messenger: "facebookmessenger",
  pso: "pso",
  squareup: "squareup",
};

function splitTokens(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/&/g, " and ")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());
}

function joinTokens(tokens: string[]) {
  return tokens.join("");
}

function simplifyTokens(tokens: string[]) {
  const next = [...tokens];
  while (next.length > 1 && trailingNoiseTokens.has(next[next.length - 1])) {
    next.pop();
  }
  return next;
}

function segmentVariants(value: string) {
  const tokens = splitTokens(value);
  const simplified = simplifyTokens(tokens);
  const variants = new Set<string>();

  if (tokens.length > 0) {
    variants.add(joinTokens(tokens));
  }

  if (simplified.length > 0) {
    variants.add(joinTokens(simplified));
  }

  for (const variant of Array.from(variants)) {
    const alias = manualAliases[variant];
    if (alias) variants.add(alias);
  }

  return Array.from(variants).filter(Boolean);
}

const preparedEntries: PreparedLogoEntry[] = (logoIndex as LogoIndexEntry[]).map((entry) => {
  const segmentVariantLists = entry.segments.map((segment) => segmentVariants(segment));

  return {
    ...entry,
    normalizedPath: segmentVariantLists.map((variants) => variants[0] ?? ""),
    simplifiedPath: segmentVariantLists.map((variants) => variants[variants.length - 1] ?? ""),
    leafCandidates: new Set(segmentVariantLists.at(-1) ?? []),
    segmentCandidates: new Set(segmentVariantLists.flat()),
  };
});

const resolutionCache = new Map<string, string | null>();

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function intersects(values: string[], candidates: Set<string>) {
  return values.some((value) => candidates.has(value));
}

export function resolveBlueprintLogo(segments: string[]) {
  const filtered = segments.filter(Boolean);
  const cacheKey = filtered.join(">");

  if (resolutionCache.has(cacheKey)) {
    return resolutionCache.get(cacheKey) ?? null;
  }

  const inputVariants = filtered.map((segment) => segmentVariants(segment));
  const inputNormalizedPath = inputVariants.map((variants) => variants[0] ?? "");
  const inputSimplifiedPath = inputVariants.map((variants) => variants[variants.length - 1] ?? variants[0] ?? "");
  const leafVariants = inputVariants.at(-1) ?? [];
  const recentSegments = inputVariants.slice(-3, -1);

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const entry of preparedEntries) {
    let score = 0;

    if (arraysEqual(entry.normalizedPath, inputNormalizedPath)) score += 140;
    if (arraysEqual(entry.simplifiedPath, inputSimplifiedPath)) score += 120;
    if (intersects(leafVariants, entry.leafCandidates)) score += 70;

    for (const recent of recentSegments) {
      if (intersects(recent, entry.segmentCandidates)) {
        score += 14;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry.publicPath;
    }
  }

  const resolved = bestScore >= 70 ? bestMatch : null;
  resolutionCache.set(cacheKey, resolved);
  return resolved;
}
