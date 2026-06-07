"use client";

import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <div className="max-w-2xl">
            <p className="text-muted-foreground mb-4">
              I am a passionate full-stack developer who loves building clean, efficient, and user-friendly web applications.
              My journey in software development has been driven by curiosity and a desire to solve real-world problems through technology.
            </p>
            <p className="text-muted-foreground">
              When I am not coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously expanding my knowledge in the ever-evolving world of software development.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
