import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my background, skills, and experience",
};

export default function AboutPage() {
  return (
    <InterfaceExplorer initialView="about">
      <div className="container py-20">
        <h1 className="mb-8 text-4xl font-bold">About Me</h1>
        <div className="prose max-w-none dark:prose-invert">
          <p className="mb-6 text-xl text-muted-foreground">
            I am a passionate developer building modern web applications and digital experiences.
          </p>
          <p className="text-muted-foreground">
            Welcome to Blueprint — my personal portfolio and knowledge management system. I
            specialize in building scalable web applications with modern technologies.
          </p>
        </div>
      </div>
    </InterfaceExplorer>
  );
}
