"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Image from "next/image";

interface CandidateNode {
  id: string;
  matchPercent: number;
  angle: number;
  floatDuration: number;
  avatar: string;
  name: string;
}

const candidates: CandidateNode[] = [
  { id: "1", matchPercent: 95, angle: 30, floatDuration: 3, avatar: "https://i.pravatar.cc/150?img=1", name: "Sarah" },
  { id: "2", matchPercent: 91, angle: 90, floatDuration: 4, avatar: "https://i.pravatar.cc/150?img=3", name: "James" },
  { id: "3", matchPercent: 87, angle: 150, floatDuration: 3.5, avatar: "https://i.pravatar.cc/150?img=5", name: "Emily" },
  { id: "4", matchPercent: 78, angle: 210, floatDuration: 4.5, avatar: "https://i.pravatar.cc/150?img=8", name: "Michael" },
  { id: "5", matchPercent: 72, angle: 270, floatDuration: 5, avatar: "https://i.pravatar.cc/150?img=9", name: "Lisa" },
  { id: "6", matchPercent: 68, angle: 330, floatDuration: 3.8, avatar: "https://i.pravatar.cc/150?img=12", name: "David" },
];

// Calculate distance from center based on match - higher match = closer
function getDistance(matchPercent: number): number {
  // 95% match = 100px, 60% match = 220px
  const minDist = 100;
  const maxDist = 220;
  const normalizedMatch = (matchPercent - 60) / 40; // normalize 60-100 to 0-1
  return maxDist - normalizedMatch * (maxDist - minDist);
}

function getPosition(angle: number, distance: number) {
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  return { x, y };
}

function ConnectionLine({ candidate }: { candidate: CandidateNode }) {
  const distance = getDistance(candidate.matchPercent);
  const { x, y } = getPosition(candidate.angle, distance);

  // Higher match = brighter line
  const opacity = 0.15 + (candidate.matchPercent / 100) * 0.35;

  return (
    <motion.line
      x1="250"
      y1="250"
      x2={250 + x}
      y2={250 + y}
      stroke="rgb(77, 212, 228)"
      strokeWidth="1"
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: [opacity * 0.5, opacity, opacity * 0.5],
      }}
      transition={{
        pathLength: { duration: 1, delay: 0.2 },
        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

function CandidateNode({ candidate }: { candidate: CandidateNode }) {
  const distance = getDistance(candidate.matchPercent);
  const { x, y } = getPosition(candidate.angle, distance);

  // Higher match = brighter glow
  const glowIntensity = 10 + (candidate.matchPercent / 100) * 20;
  const glowOpacity = 0.3 + (candidate.matchPercent / 100) * 0.4;

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: `calc(50% + ${x}px - 28px)`,
        top: `calc(50% + ${y}px - 28px)`,
      }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.7}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.3, zIndex: 50 }}
    >
      {/* Floating animation */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{
          duration: candidate.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center"
      >
        {/* Pulsing glow for high matches */}
        {candidate.matchPercent >= 85 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 ${glowIntensity}px rgba(77, 212, 228, ${glowOpacity})`,
            }}
            animate={{
              boxShadow: [
                `0 0 ${glowIntensity}px rgba(77, 212, 228, ${glowOpacity})`,
                `0 0 ${glowIntensity * 1.5}px rgba(77, 212, 228, ${glowOpacity * 1.3})`,
                `0 0 ${glowIntensity}px rgba(77, 212, 228, ${glowOpacity})`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Avatar */}
        <div
          className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-border"
          style={{
            boxShadow: `0 0 ${glowIntensity}px rgba(77, 212, 228, ${glowOpacity * 0.5})`,
          }}
        >
          <Image
            src={candidate.avatar}
            alt={candidate.name}
            fill
            className="object-cover pointer-events-none select-none"
            draggable={false}
            unoptimized
          />
        </div>

        {/* Match percentage badge */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
          {candidate.matchPercent}%
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MatchConstellation() {
  return (
    <div className="relative w-[500px] h-[500px]">
      {/* Connection lines SVG layer */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {candidates.map((candidate) => (
          <ConnectionLine key={candidate.id} candidate={candidate} />
        ))}
      </svg>

      {/* Central job node */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        {/* Outer pulse */}
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          style={{ backgroundColor: "rgba(77, 212, 228, 0.15)" }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core glow */}
        <motion.div
          className="absolute w-12 h-12 rounded-full blur-lg"
          style={{ backgroundColor: "rgba(77, 212, 228, 0.4)" }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Central icon */}
        <motion.div
          className="relative w-12 h-12 rounded-full flex items-center justify-center bg-card border border-primary/40"
          style={{
            boxShadow: "0 0 25px rgba(77, 212, 228, 0.3)",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Briefcase className="w-5 h-5 text-primary" />
        </motion.div>

        {/* "JOB" label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 text-[10px] font-medium text-muted-foreground tracking-wider">
          JOB
        </div>
      </div>

      {/* Candidate nodes */}
      {candidates.map((candidate) => (
        <CandidateNode key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
