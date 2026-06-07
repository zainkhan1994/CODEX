export interface Skill {
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export const skills: Skill[] = [
  { name: "JavaScript", category: "Languages", level: "expert" },
  { name: "TypeScript", category: "Languages", level: "advanced" },
  { name: "Python", category: "Languages", level: "intermediate" },
  { name: "HTML/CSS", category: "Languages", level: "expert" },
  { name: "React", category: "Frameworks", level: "advanced" },
  { name: "Next.js", category: "Frameworks", level: "advanced" },
  { name: "Node.js", category: "Frameworks", level: "intermediate" },
  { name: "Tailwind CSS", category: "Styling", level: "advanced" },
  { name: "D3.js", category: "Libraries", level: "intermediate" },
  { name: "Git", category: "Tools", level: "advanced" },
  { name: "Vercel", category: "Deployment", level: "intermediate" },
];

export const skillCategories = Array.from(new Set(skills.map((s) => s.category)));
