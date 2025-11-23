"use client";

import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Users } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  imagePosition: "left" | "right";
}

const features: Feature[] = [
  {
    title: "Intelligent Resume Screening",
    description:
      "AI-powered analysis that understands context, not just keywords. Our advanced natural language processing extracts skills, experience, and qualifications with unprecedented accuracy.",
    icon: Brain,
    highlights: [
      "Semantic understanding of resumes",
      "Automatic skill extraction",
      "Experience level detection",
      "Education verification",
    ],
    imagePosition: "right",
  },
  {
    title: "Perfect Candidate Matching",
    description:
      "Match candidates to job descriptions with AI precision. Our matching algorithm considers skills, experience, culture fit, and potential for growth.",
    icon: Target,
    highlights: [
      "Multi-dimensional scoring",
      "Job description alignment",
      "Skills gap analysis",
      "Ranked recommendations",
    ],
    imagePosition: "left",
  },
  {
    title: "Actionable Insights Dashboard",
    description:
      "Comprehensive analytics that help you make better hiring decisions. Track trends, identify bottlenecks, and optimize your recruitment process.",
    icon: BarChart3,
    highlights: [
      "Real-time analytics",
      "Custom reports",
      "Export capabilities",
      "Performance tracking",
    ],
    imagePosition: "right",
  },
  {
    title: "Team Collaboration",
    description:
      "Work together seamlessly with your hiring team. Share candidates, leave feedback, and make collective decisions with built-in collaboration tools.",
    icon: Users,
    highlights: [
      "Shared workspaces",
      "Comment & annotations",
      "Role-based access",
      "Activity tracking",
    ],
    imagePosition: "left",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const isImageRight = feature.imagePosition === "right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="py-24"
    >
      <div
        className={`grid lg:grid-cols-2 gap-12 items-center ${
          isImageRight ? "" : "lg:grid-flow-dense"
        }`}
      >
        {/* Text content */}
        <div className={`space-y-6 ${isImageRight ? "" : "lg:col-start-2"}`}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
            <Icon className="h-7 w-7 text-primary" />
          </div>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
            {feature.title}
          </h3>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          <ul className="space-y-3">
            {feature.highlights.map((highlight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Image/Visual */}
        <div className={`${isImageRight ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[4/3] rounded-xl border border-border/50 bg-muted/20 overflow-hidden shadow-2xl"
          >
            {/* Placeholder for screenshot/image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
              <div className="text-center space-y-4 p-8">
                <Icon className="h-16 w-16 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground/50">
                  Feature screenshot placeholder
                </p>
              </div>
            </div>

            {/* Animated overlay for visual interest */}
            <motion.div
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesShowcase() {
  return (
    <section id="features" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to hire smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your recruitment process from screening to hiring
          </p>
        </motion.div>

        <div className="divide-y divide-border/50">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
