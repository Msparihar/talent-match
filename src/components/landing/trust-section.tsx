"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Server, BadgeCheck } from "lucide-react";

export function TrustSection() {
  const certifications = [
    { label: "SOC 2 Type II", icon: Shield },
    { label: "GDPR", icon: Lock },
    { label: "ISO 27001", icon: BadgeCheck },
    { label: "99.99% SLA", icon: Server },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Main content - editorial quote style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium tracking-widest uppercase text-primary">
                Enterprise Ready
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 max-w-4xl mx-auto">
              Security isn&apos;t a feature.<br />
              <span className="text-muted-foreground">It&apos;s our foundation.</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bank-grade encryption, continuous compliance monitoring, and infrastructure designed for the most demanding enterprise requirements.
            </p>
          </motion.div>

          {/* Certifications - horizontal strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <motion.div
                  key={cert.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <div className="card-refined rounded-xl p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{cert.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 pt-16 border-t border-border/30"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-light text-gradient-cyan mb-2">256-bit</div>
                <div className="text-sm text-muted-foreground">AES Encryption</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-foreground mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Security Monitoring</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-light text-foreground mb-2">&lt;1hr</div>
                <div className="text-sm text-muted-foreground">Incident Response</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
