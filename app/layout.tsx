import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WebVitalsProvider } from "@/components/web-vitals-provider";
import "../styles/globals.css";
import "../styles/animations.css";

const siteUrl = "https://zainkhan1994.github.io/CODEX";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CODEX | Interface Explorer",
    template: "%s | CODEX",
  },
  description:
    "A multi-view interface explorer built with Next.js, combining the organizer tree, graph explorer, logo map, and portfolio surfaces in one deployable shell.",
  keywords: ["codex", "nextjs", "portfolio", "graph explorer", "knowledge map", "web development"],
  authors: [{ name: "Zain Khan" }],
  creator: "CODEX",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CODEX",
    title: "CODEX | Interface Explorer",
    description: "A unified shell for the organizer tree, graph explorer, portfolio, and supporting views.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CODEX | Interface Explorer",
    description: "A unified shell for the organizer tree, graph explorer, portfolio, and supporting views.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://github.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <WebVitalsProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
