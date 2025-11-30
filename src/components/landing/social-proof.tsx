"use client";

import { motion } from "framer-motion";
import { Target, Zap, Shield } from "lucide-react";

export function SocialProof() {
  const pillars = [
    {
      icon: Target,
      title: "Precision Matching",
      description: "Semantic AI understands context, not just keywords",
      metric: "95%",
      metricLabel: "accuracy"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Process hundreds of resumes in under a minute",
      metric: "< 1s",
      metricLabel: "per resume"
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description: "SOC 2 compliant with bank-grade encryption",
      metric: "99.9%",
      metricLabel: "uptime"
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        {/* Asymmetric header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              Why Teams Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Built for recruiters who <span className="text-gradient-cyan">refuse to compromise</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Every feature designed with one goal: helping you find the right candidate, faster.
          </p>
        </motion.div>

        {/* Pillars grid - editorial cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="card-refined rounded-2xl p-8 h-full">
                  {/* Metric badge - top right */}
                  <div className="absolute top-6 right-6 text-right">
                    <div className="text-2xl font-light text-primary">{pillar.metric}</div>
                    <div className="text-xs text-muted-foreground">{pillar.metricLabel}</div>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-medium mb-3 tracking-tight">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Logos strip - minimal treatment */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-24 pt-12 border-t border-border/50"
        >
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by forward-thinking teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {["Vercel", "Linear", "Notion", "Stripe", "Figma"].map((company) => (
              <span key={company} className="text-lg font-medium tracking-tight">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
