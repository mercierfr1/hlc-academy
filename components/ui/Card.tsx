"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  const baseClasses = "rounded-2xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 shadow-xl/10 backdrop-blur-sm";
  const hoverClasses = hover ? "hover:shadow-2xl/20 hover:-translate-y-1 transition-all duration-300" : "";

  if (hover) {
    return (
      <motion.div
        className={`${baseClasses} ${hoverClasses} ${className}`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}
