"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface CandidateDot {
  id: string;
  matchPercent: number;
  orbitRadius: number;
  angle: number;
  floatDuration: number;
  avatar: string;
  name: string;
}

const candidates: CandidateDot[] = [
  { id: "1", matchPercent: 95, orbitRadius: 100, angle: 45, floatDuration: 3, avatar: "https://i.pravatar.cc/150?img=1", name: "Sarah" },
  { id: "2", matchPercent: 91, orbitRadius: 100, angle: 180, floatDuration: 4, avatar: "https://i.pravatar.cc/150?img=3", name: "James" },
  { id: "3", matchPercent: 87, orbitRadius: 175, angle: 100, floatDuration: 3.5, avatar: "https://i.pravatar.cc/150?img=5", name: "Emily" },
  { id: "4", matchPercent: 78, orbitRadius: 175, angle: 280, floatDuration: 4.5, avatar: "https://i.pravatar.cc/150?img=8", name: "Michael" },
  { id: "5", matchPercent: 72, orbitRadius: 250, angle: 200, floatDuration: 5, avatar: "https://i.pravatar.cc/150?img=9", name: "Lisa" },
  { id: "6", matchPercent: 68, orbitRadius: 250, angle: 340, floatDuration: 3.8, avatar: "https://i.pravatar.cc/150?img=12", name: "David" },
];

function getPosition(angle: number, radius: number) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return { x, y };
}

function DraggableDot({ candidate }: { candidate: CandidateDot }) {
  const { x, y } = getPosition(candidate.angle, candidate.orbitRadius);

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: `calc(50% + ${x}px - 32px)`,
        top: `calc(50% + ${y}px - 32px)`,
      }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.7}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.3, zIndex: 50 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{
          duration: candidate.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center"
      >
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-border">

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
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
          {candidate.matchPercent}%
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MatchRadar() {
  return (
    <div className="relative w-[600px] h-[600px]">
      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
        />
        {/* Middle ring */}
        <div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{ border: "1px solid rgba(255, 255, 255, 0.15)" }}
        />
        {/* Inner ring */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{ border: "1px solid rgba(77, 212, 228, 0.3)" }}
        />
      </div>

      {/* Radar sweep */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute h-[2px] origin-left"
          style={{
            width: "250px",
            background: "linear-gradient(90deg, rgba(77, 212, 228, 0.8) 0%, transparent 100%)",
            left: "50%",
            top: "50%",
            marginTop: "-1px",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Central core */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Pulse ring */}
        <motion.div
          className="absolute w-20 h-20 rounded-full"
          style={{ backgroundColor: "rgba(77, 212, 228, 0.2)" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core background glow */}
        <motion.div
          className="absolute w-16 h-16 rounded-full blur-xl"
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

        {/* Core icon container */}
        <motion.div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "rgba(18, 18, 24, 1)",
            border: "1px solid rgba(77, 212, 228, 0.4)",
            boxShadow: "0 0 30px rgba(77, 212, 228, 0.3)"
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
          <Sparkles className="w-7 h-7" style={{ color: "rgb(77, 212, 228)" }} />
        </motion.div>
      </div>

      {/* Draggable candidate dots */}
      {candidates.map((candidate) => (
        <DraggableDot key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
