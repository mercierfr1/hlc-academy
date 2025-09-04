"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Container from "./ui/Container";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

const faqs = [
  {
    question: "What makes HLC Academy different from other trading courses?",
    answer: "HLC Academy is built on neuroscience principles, not just technical analysis. We focus on rewiring your brain for better decision-making through structured practice, bias elimination, and deliberate learning loops that actually stick."
  },
  {
    question: "How long does it take to see results?",
    answer: "Most students see improvements in their trading psychology within 2-4 weeks. Consistent profits typically emerge after 8-12 weeks of following our structured approach. Remember, we're building lasting habits, not quick fixes."
  },
  {
    question: "Do I need any prior trading experience?",
    answer: "No prior experience required. Our curriculum starts with the fundamentals and builds up systematically. We have students from complete beginners to experienced traders looking to improve their psychology."
  },
  {
    question: "What if I'm not satisfied with the course?",
    answer: "We offer a 30-day money-back guarantee on all plans. If you're not completely satisfied, we'll refund your payment, no questions asked."
  },
  {
    question: "How much time do I need to commit each week?",
    answer: "We recommend 5-7 hours per week for optimal results. This includes 2-3 hours of course content, 1-2 hours of practice, and 1-2 hours of community engagement and live calls."
  },
  {
    question: "What trading platforms do you support?",
    answer: "Our methods work with any trading platform. We focus on universal concepts like supply & demand, risk management, and psychological discipline that apply regardless of your broker or platform choice."
  },
  {
    question: "Is there ongoing support after I complete the course?",
    answer: "Yes! All plans include lifetime access to course updates, community access, and ongoing support. Scale Up and Mastery plans include additional 1-on-1 sessions and priority support."
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time. We'll prorate any differences and ensure you have access to the appropriate level of content and support."
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="bg-white dark:bg-gray-900" id="faq">
      <Container>
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about HLC Academy"
        />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
