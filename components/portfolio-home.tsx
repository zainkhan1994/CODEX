import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";

const AboutSection = dynamic(
  () => import("@/components/sections/about-section").then((mod) => ({ default: mod.AboutSection })),
  { loading: () => <div className="h-96 bg-secondary/30" /> }
);

const SkillsSection = dynamic(
  () => import("@/components/sections/skills-section").then((mod) => ({ default: mod.SkillsSection })),
  { loading: () => <div className="h-96 bg-background" /> }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/projects-section").then((mod) => ({ default: mod.ProjectsSection })),
  { loading: () => <div className="h-96 bg-secondary/30" /> }
);

const ContactSection = dynamic(
  () => import("@/components/sections/contact-section").then((mod) => ({ default: mod.ContactSection })),
  { loading: () => <div className="h-96 bg-background" /> }
);

export function PortfolioHome() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}

