"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap, CheckCircle2 } from "lucide-react";

export function TrustSection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "End-to-end encryption for all candidate information",
    },
    {
      icon: Lock,
      title: "GDPR Compliant",
      description: "Fully compliant with data privacy regulations",
    },
    {
      icon: Zap,
      title: "99.9% Uptime",
      description: "Reliable infrastructure you can depend on",
    },
    {
      icon: CheckCircle2,
      title: "SOC 2 Type II",
      description: "Certified security and compliance standards",
    },
  ];

  return (
    <section className="py-24 border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built on strong foundations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security, reliability, and compliance you can trust
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-2">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-border/50"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg border border-border/50 bg-muted/20">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg border border-border/50 bg-muted/20">
            <Lock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg border border-border/50 bg-muted/20">
            <CheckCircle2 className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">ISO 27001</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
