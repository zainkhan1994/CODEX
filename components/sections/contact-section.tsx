"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Mail, Github } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have a project in mind or want to collaborate? I would love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </Link>
            <Link
              href="https://github.com/zainkhan1994"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-input px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
