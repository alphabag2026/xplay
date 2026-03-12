import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple";
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "cyan",
  delay = 0,
}: GlassCardProps) {
  const borderColor =
    glowColor === "cyan" ? "rgba(0,245,255,0.15)" : "rgba(168,85,247,0.15)";
  const shadowColor =
    glowColor === "cyan"
      ? "0 0 30px rgba(0,245,255,0.08)"
      : "0 0 30px rgba(168,85,247,0.08)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-5 sm:p-6 ${className}`}
      style={{
        background: "rgba(15,15,35,0.7)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        boxShadow: shadowColor,
      }}
    >
      {children}
    </motion.div>
  );
}
