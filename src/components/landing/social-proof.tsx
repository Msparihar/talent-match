"use client";

import { motion } from "framer-motion";
import { Building2, Users, Zap, Target } from "lucide-react";

export function SocialProof() {
  const companies = [
    { name: "TechCorp", icon: Building2 },
    { name: "InnovateLabs", icon: Users },
    { name: "FastHire", icon: Zap },
    { name: "TalentFlow", icon: Target },
  ];

  return (
    <section className="py-24 border-y border-border/50 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          {/* Headline */}
          <h3 className="text-xl text-muted-foreground">
            Powering modern recruiting teams
          </h3>

          {/* Company logos/icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center max-w-4xl mx-auto">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <company.icon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Philosophy pillars */}
          <div className="grid md:grid-cols-3 gap-8 pt-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Purpose-built</h4>
              <p className="text-muted-foreground">
                Designed specifically for modern recruiters who need intelligent screening tools
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Lightning-fast</h4>
              <p className="text-muted-foreground">
                Process hundreds of resumes in minutes with AI-powered automation
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Enterprise-ready</h4>
              <p className="text-muted-foreground">
                Built for teams with security, scalability, and accuracy in mind
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
