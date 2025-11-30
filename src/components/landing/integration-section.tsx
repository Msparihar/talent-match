"use client";

import { motion } from "framer-motion";
import { Sparkles, Database, FileText, Cpu, Lock, Workflow } from "lucide-react";

interface TechItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

const techStack: TechItem[] = [
  {
    title: "LLM Integration",
    description: "State-of-the-art language models for human-like understanding",
    icon: Sparkles,
  },
  {
    title: "Vector Database",
    description: "Sub-millisecond semantic search across millions of documents",
    icon: Database,
  },
  {
    title: "Document Intelligence",
    description: "Parse any format—PDF, DOCX, images with OCR",
    icon: FileText,
  },
  {
    title: "RAG Pipeline",
    description: "Context-aware retrieval for accurate, grounded responses",
    icon: Workflow,
  },
  {
    title: "Edge Processing",
    description: "Distributed compute for global low-latency performance",
    icon: Cpu,
  },
  {
    title: "Zero-Trust Security",
    description: "End-to-end encryption with SOC 2 Type II compliance",
    icon: Lock,
  },
];

export function IntegrationSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-transparent" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column - sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-sm font-medium tracking-widest uppercase text-primary">
                Technology
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Powered by <span className="text-gradient-cyan">modern AI</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We&apos;ve assembled the most advanced AI infrastructure so you can focus on what matters—finding great talent.
            </p>

            {/* Architecture diagram hint */}
            <div className="hidden lg:block">
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">System Architecture</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  </div>
                </div>
                {/* Simplified architecture visual */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-12 rounded-lg border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                    Input
                  </div>
                  <div className="text-muted-foreground/50">→</div>
                  <div className="flex-1 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs text-primary">
                    AI Engine
                  </div>
                  <div className="text-muted-foreground/50">→</div>
                  <div className="flex-1 h-12 rounded-lg border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                    Results
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - tech grid */}
          <div className="space-y-4">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="flex items-start gap-5 p-5 rounded-xl border border-transparent hover:border-border/50 hover:bg-card/50 transition-all duration-300">
                    {/* Number */}
                    <span className="text-sm font-medium text-muted-foreground/50 pt-1">
                      0{index + 1}
                    </span>

                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">
                        {tech.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
