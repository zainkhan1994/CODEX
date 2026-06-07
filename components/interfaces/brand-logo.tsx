"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  alt: string;
  className?: string;
  fallback?: ReactNode;
  sizeClassName?: string;
  src: string | null;
};

export function BrandLogo({
  alt,
  className,
  fallback,
  sizeClassName = "h-10 w-10",
  src,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-background/70",
        sizeClassName,
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-contain p-1.5" />
      ) : (
        fallback ?? <span className="text-xs font-semibold text-primary">{alt.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
