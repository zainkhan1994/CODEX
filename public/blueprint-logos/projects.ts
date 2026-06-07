export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "blueprint",
    title: "Blueprint",
    description: "A comprehensive, interactive blueprint management system with a beautiful dark aesthetic and glass morphism effects. Features tree navigation, mind maps, and full CRUD operations.",
    tags: ["JavaScript", "HTML", "CSS", "D3.js"],
    githubUrl: "https://github.com/zainkhan1994/Blueprint",
    featured: true,
  },
  {
    slug: "interactive-mind-map",
    title: "Interactive Mind Map Visualizer",
    description: "An advanced D3.js-powered mind map visualization tool with zoom, pan, and touch support for exploring complex data relationships.",
    tags: ["D3.js", "JavaScript", "Data Visualization"],
    featured: true,
  },
  {
    slug: "portfolio",
    title: "Portfolio Website",
    description: "A modern portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI components featuring dark mode and smooth animations.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI"],
    featured: true,
  },
];
