"use client";

import { useMemo } from "react";
import { ThreeDSlider } from "@/components/ThreeDSlider";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/projects";

interface ProjectsCarouselProps {
  projects: Project[];
}

/**
 * Wraps ThreeDSlider with ProjectCard content for the projects showcase page.
 */
export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const items = useMemo(
    () =>
      projects.map((project) => ({
        id: project.slug,
        content: (
          <div className="w-72">
            <ProjectCard project={project} />
          </div>
        ),
      })),
    [projects]
  );

  return (
    <section className="mb-4">
      <p className="text-sm text-muted-foreground mb-4">
        Drag or swipe to explore · auto-rotates
      </p>
      <ThreeDSlider
        items={items}
        stageHeight={480}
        translateZ="38vmin"
        autoRotateSpeed={15}
        ariaLabel="Projects 3D carousel"
      />
    </section>
  );
}
