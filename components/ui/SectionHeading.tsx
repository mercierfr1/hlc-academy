"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className = "" }: SectionHeadingProps) {
  return (
    <motion.div
      className={`text-center max-w-3xl mx-auto mb-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white text-balance mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-7 sm:leading-8">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
