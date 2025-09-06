'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookOpen, Users, CheckCircle, Zap, Play } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: BookOpen,
    title: 'Course',
    description: 'Master institutional supply & demand concepts through our neuroscience-backed curriculum',
    link: 'View Curriculum',
    linkHref: '#curriculum',
  },
  {
    number: 2,
    icon: Users,
    title: 'Weekly Calls',
    description: 'Join live sessions with expert mentors and fellow traders for real-time guidance',
    link: 'Learn More',
    linkHref: '#curriculum',
  },
  {
    number: 3,
    icon: CheckCircle,
    title: 'Practice & Review',
    description: 'Apply concepts with our bias checklist and structured journaling system',
    link: 'See Tools',
    linkHref: '#curriculum',
  },
  {
    number: 4,
    icon: Zap,
    title: 'Iterate',
    description: 'Continuously improve through data-driven feedback and community support',
    link: 'Get Started',
    linkHref: '#pricing',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function Steps() {
  return (
    <section id="how-it-works" className="py-32 sm:py-40 lg:py-48 bg-white dark:bg-gray-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeading
            title="How It Works"
            subtitle="Your path to trading mastery in 4 simple steps"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={itemVariants}>
              <Card className="h-full card-hover group border-gray-200/60 dark:border-white/10 hover:border-blue-200/60 dark:hover:border-blue-800/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400">
                    {step.number}
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center pt-0 flex-1 flex flex-col">
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                    {step.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 font-medium group/link cursor-pointer">
                    <span>{step.link}</span>
                    <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
