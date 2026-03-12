import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  bgImage?: string;
  overlay?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  bgImage,
  overlay = true,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen py-20 overflow-hidden ${className}`}
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {bgImage && overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/85 via-[#0a0e1a]/70 to-[#0a0e1a]/90" />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6"
      >
        {children}
      </motion.div>
    </section>
  );
}
