"use client";

import { motion } from "framer-motion";
import { Bot, Database, Sparkles, FileText, Cpu, Lock } from "lucide-react";

interface Integration {
  title: string;
  description: string;
  icon: React.ElementType;
}

const integrations: Integration[] = [
  {
    title: "OpenAI Integration",
    description: "Powered by GPT-4 for advanced natural language understanding",
    icon: Bot,
  },
  {
    title: "RAG Technology",
    description: "Retrieval-Augmented Generation for accurate context-aware analysis",
    icon: Sparkles,
  },
  {
    title: "Vector Search",
    description: "Lightning-fast semantic search across thousands of documents",
    icon: Database,
  },
  {
    title: "Document Parsing",
    description: "Extract text from PDF, DOCX, and other resume formats",
    icon: FileText,
  },
  {
    title: "Smart Chunking",
    description: "Intelligent content segmentation for optimal processing",
    icon: Cpu,
  },
  {
    title: "Secure Storage",
    description: "Enterprise-grade security for sensitive candidate data",
    icon: Lock,
  },
];

export function IntegrationSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built on cutting-edge technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leveraging the latest AI and search technologies to deliver unmatched accuracy and performance
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={integration.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-border/50 bg-card hover:bg-card/80 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{integration.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
