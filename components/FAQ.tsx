'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What makes HLC Academy different from other trading courses?',
    answer: 'HLC Academy combines neuroscience-backed learning with institutional supply & demand concepts. We focus on rewiring your brain for better trading decisions through structured practice, bias prevention, and real-time feedback systems.',
  },
  {
    question: 'How long does it take to see results?',
    answer: 'Most students see improvement in their trading psychology within 2-4 weeks. However, consistent profits typically develop over 3-6 months of dedicated practice with our structured approach.',
  },
  {
    question: 'Do I need prior trading experience?',
    answer: 'No prior experience is required. Our curriculum is designed to take you from beginner to advanced trader through structured learning modules and hands-on practice.',
  },
  {
    question: 'What is the bias checklist and how does it work?',
    answer: 'The bias checklist is a pre-trade discipline system that helps you identify and avoid common psychological pitfalls like overconfidence, recency bias, and confirmation bias. It\'s integrated into our trading journal.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all plans. If you\'re not satisfied with your progress, you can request a full refund, no questions asked.',
  },
  {
    question: 'What kind of support do I get?',
    answer: 'Support varies by plan. Kickstart includes email support, Scale Up adds weekly group calls and priority support, while Mastery includes personal coaching and direct mentor access.',
  },
  {
    question: 'Can I access the content on mobile?',
    answer: 'Yes, all our content is accessible through our mobile app and responsive web platform. You can practice trading psychology exercises and access your journal anywhere.',
  },
  {
    question: 'How often is the content updated?',
    answer: 'We update our content monthly with new market insights, advanced strategies, and improved learning modules based on the latest neuroscience research and market developments.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-32 sm:py-40 lg:py-48 bg-gray-50 dark:bg-gray-800/50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about HLC Academy"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-gray-200/60 dark:border-white/10 hover:border-blue-200/60 dark:hover:border-blue-800/60 transition-colors">
                <CardContent className="p-0">
                  <button
                    className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
