import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CODEX. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="https://github.com/zainkhan1994" className="hover:text-foreground transition-colors">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
