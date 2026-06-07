import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";
import { ProjectCard } from "@/components/project-card";
import { ProjectsCarousel } from "@/components/projects-carousel";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of projects and work",
};

export default function ProjectsPage() {
  return (
    <InterfaceExplorer initialView="projects">
      <div className="container py-20">
        <h1 className="mb-4 text-4xl font-bold">Projects</h1>
        <p className="mb-8 text-muted-foreground">
          A collection of projects I have built and contributed to.
        </p>

        <ProjectsCarousel projects={projects} />

        <h2 className="mt-16 mb-6 text-2xl font-semibold">All Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </InterfaceExplorer>
  );
}
