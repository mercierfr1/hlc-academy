"use client";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Container from "./ui/Container";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

const steps = [
  {
    number: "01",
    icon: "📚",
    title: "Master the Course",
    description: "Learn institutional supply & demand concepts through our neuroscience-backed curriculum",
    link: "#curriculum"
  },
  {
    number: "02", 
    icon: "🎯",
    title: "Join Weekly Calls",
    description: "Get live mentorship and guidance from expert traders in our community sessions",
    link: "#calls"
  },
  {
    number: "03",
    icon: "📝",
    title: "Practice & Review",
    description: "Apply concepts with our bias checklist and structured journaling system",
    link: "#practice"
  },
  {
    number: "04",
    icon: "🚀",
    title: "Iterate & Improve",
    description: "Continuously improve through data-driven feedback and community support",
    link: "#improve"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function Steps() {
  return (
    <Section className="bg-gray-50 dark:bg-gray-800">
      <Container>
        <SectionHeading
          title="How It Works"
          subtitle="Your path to trading mastery in 4 simple steps"
        />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <Card className="p-8 h-full text-center group">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl opacity-20">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <a
                    href={step.link}
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Get started →
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
