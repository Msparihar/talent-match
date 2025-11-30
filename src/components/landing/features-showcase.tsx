"use client";

import { motion } from "framer-motion";
import { Brain, Target, BarChart3, MessageSquare } from "lucide-react";

interface Feature {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  accent: "cyan" | "amber";
}

const features: Feature[] = [
  {
    title: "Semantic Understanding",
    subtitle: "Beyond Keywords",
    description:
      "Our AI reads resumes like a human recruiter—understanding context, inferring skills, and recognizing potential that keyword matching misses.",
    icon: Brain,
    highlights: [
      "Context-aware parsing",
      "Implicit skill detection",
      "Experience inference",
      "Cultural fit signals",
    ],
    accent: "cyan",
  },
  {
    title: "Precision Matching",
    subtitle: "Find the One",
    description:
      "Multi-dimensional scoring that goes beyond surface-level qualifications. Match on skills, growth trajectory, and team dynamics.",
    icon: Target,
    highlights: [
      "Weighted scoring models",
      "Skills gap visualization",
      "Trajectory prediction",
      "Ranked shortlists",
    ],
    accent: "amber",
  },
  {
    title: "Live Analytics",
    subtitle: "Data-Driven Hiring",
    description:
      "Real-time dashboards that surface hiring bottlenecks, track pipeline health, and help you make faster, smarter decisions.",
    icon: BarChart3,
    highlights: [
      "Pipeline visualization",
      "Conversion metrics",
      "Time-to-hire tracking",
      "Custom reporting",
    ],
    accent: "cyan",
  },
  {
    title: "Team Sync",
    subtitle: "Hire Together",
    description:
      "Collaborative tools designed for modern hiring teams. Share insights, collect feedback, and reach consensus faster.",
    icon: MessageSquare,
    highlights: [
      "Shared candidate pools",
      "Inline annotations",
      "Decision workflows",
      "Audit trails",
    ],
    accent: "amber",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const isEven = index % 2 === 0;
  const accentClass = feature.accent === "cyan" ? "text-primary" : "text-accent";
  const bgAccentClass = feature.accent === "cyan" ? "bg-primary/10" : "bg-accent/10";
  const glowClass = feature.accent === "cyan" ? "glow-cyan" : "glow-amber";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="py-24 lg:py-32"
    >
      <div
        className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
          isEven ? "" : "lg:grid-flow-dense"
        }`}
      >
        {/* Text content - takes 5 columns */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`lg:col-span-5 space-y-6 ${isEven ? "lg:col-start-1" : "lg:col-start-8"}`}
        >
          {/* Feature number and subtitle */}
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${accentClass}`}>0{index + 1}</span>
            <div className="h-px w-8 bg-border" />
            <span className="text-sm text-muted-foreground tracking-wide uppercase">
              {feature.subtitle}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          {/* Highlights - horizontal tags */}
          <div className="flex flex-wrap gap-2 pt-4">
            {feature.highlights.map((highlight, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`px-3 py-1.5 text-sm rounded-full border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors`}
              >
                {highlight}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Visual - takes 6 columns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`lg:col-span-6 ${isEven ? "lg:col-start-7" : "lg:col-start-1 lg:row-start-1"}`}
        >
          <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${glowClass}`}>
            {/* Card background */}
            <div className="absolute inset-0 bg-card border border-border/50 rounded-2xl" />

            {/* Abstract visualization based on feature */}
            <div className="absolute inset-0 p-8 flex items-center justify-center">
              {/* Central icon container */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-0 ${bgAccentClass} rounded-full blur-2xl scale-150 opacity-50`}
                />
                <div className={`relative w-24 h-24 rounded-2xl ${bgAccentClass} flex items-center justify-center`}>
                  <Icon className={`w-12 h-12 ${accentClass}`} />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-16 h-16 border border-border/30 rounded-lg" />
              <div className="absolute bottom-8 right-8 w-20 h-20 border border-border/30 rounded-full" />
              <div className={`absolute top-1/4 right-12 w-2 h-2 rounded-full ${bgAccentClass}`} />
              <div className={`absolute bottom-1/3 left-16 w-3 h-3 rounded-full ${bgAccentClass}`} />
            </div>

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              feature.accent === "cyan"
                ? "from-primary/5 via-transparent to-primary/10"
                : "from-accent/5 via-transparent to-accent/10"
            } rounded-2xl`} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturesShowcase() {
  return (
    <section id="features" className="py-16 lg:py-24 relative">
      {/* Background accent */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2" />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Section header - left aligned for editorial feel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Everything you need,<br />
            <span className="text-muted-foreground">nothing you don&apos;t</span>
          </h2>
        </motion.div>

        {/* Features list */}
        <div className="divide-y divide-border/30">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
