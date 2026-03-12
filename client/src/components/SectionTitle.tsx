import { motion } from "framer-motion";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ badge, title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 mb-4 text-xs sm:text-sm font-medium tracking-widest uppercase border rounded-full"
          style={{
            color: "#00f5ff",
            borderColor: "rgba(0,245,255,0.3)",
            background: "rgba(0,245,255,0.06)",
          }}
        >
          {badge}
        </motion.span>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 neon-text-cyan"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "rgba(226,232,240,0.7)" }}>
          {subtitle}
        </p>
      )}
      <div
        className="mt-6 mx-auto h-px w-24"
        style={{
          background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
        }}
      />
    </div>
  );
}
