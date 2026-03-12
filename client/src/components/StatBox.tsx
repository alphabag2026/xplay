import { motion } from "framer-motion";

interface StatBoxProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  delay?: number;
}

export default function StatBox({
  label,
  value,
  sub,
  color = "#00f5ff",
  delay = 0,
}: StatBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="text-center p-4 sm:p-5"
      style={{
        background: "rgba(15,15,35,0.6)",
        border: `1px solid ${color}22`,
        borderRadius: "8px",
      }}
    >
      <p className="text-xs sm:text-sm mb-2 uppercase tracking-wider" style={{ color: "rgba(226,232,240,0.5)" }}>
        {label}
      </p>
      <p
        className="text-2xl sm:text-3xl lg:text-4xl font-bold"
        style={{ color, fontFamily: "'Space Grotesk', sans-serif", textShadow: `0 0 20px ${color}40` }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "rgba(226,232,240,0.5)" }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}
