"use client";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Container from "./ui/Container";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

const features = [
  {
    icon: "🧠",
    title: "Neuroscience-Led",
    description: "Evidence-based training that rewires your brain for better trading decisions",
    link: "#neuroscience"
  },
  {
    icon: "📊",
    title: "Dashboard Analytics",
    description: "Real-time insights into your trading performance and psychological patterns",
    link: "#analytics"
  },
  {
    icon: "✅",
    title: "Bias Checklist",
    description: "Pre-trade discipline system to eliminate emotional decision-making",
    link: "#bias"
  },
  {
    icon: "⭐",
    title: "Deliberate Practice",
    description: "Structured learning loops that accelerate skill development",
    link: "#practice"
  },
  {
    icon: "👥",
    title: "Community & Support",
    description: "Join a community of serious traders and get expert mentorship",
    link: "#community"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function FeatureGrid() {
  return (
    <Section className="bg-white dark:bg-gray-900">
      <Container>
        <SectionHeading
          title="Why Choose HLC Academy"
          subtitle="Everything you need to transform your trading psychology and achieve consistent profits"
        />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 h-full text-center group cursor-pointer">
                <div className="space-y-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <a
                    href={feature.link}
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Learn more →
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
