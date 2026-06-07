"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Github } from "lucide-react";
import { AnimatedSvgText } from "@/components/AnimatedSvgText";
import "@/styles/animations.css";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <AnimatedSvgText
              text="Building Digital Blueprints"
              duration={3}
              dashOffset={2000}
              strokeColor="hsl(var(--primary))"
              fillColor="currentColor"
              fontSize={48}
              viewBoxHeight={70}
              className="w-full max-w-2xl"
              ariaLabel="Building Digital Blueprints"
            />
            <span className="block text-primary mt-1">for the Modern Web</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            I am a developer passionate about creating intuitive, performant web applications.
            Welcome to my portfolio and knowledge management system.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/zainkhan1994"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-input px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
