'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Brain, BarChart3, CheckCircle, Star, Users } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Neuroscience-Led',
    description: 'Evidence-based training that rewires your brain for better trading decisions',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Real-time insights into your trading performance and psychological patterns',
  },
  {
    icon: CheckCircle,
    title: 'Bias Checklist',
    description: 'Pre-trade discipline system to eliminate emotional decision-making',
  },
  {
    icon: Star,
    title: 'Deliberate Practice',
    description: 'Structured learning loops that accelerate skill development',
  },
  {
    icon: Users,
    title: 'Community & Support',
    description: 'Join a community of serious traders and get expert mentorship',
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

export default function FeatureGrid() {
  return (
    <section id="features" className="py-32 sm:py-40 lg:py-48 bg-white dark:bg-gray-900">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full card-hover group border-gray-200/60 dark:border-white/10 hover:border-blue-200/60 dark:hover:border-blue-800/60 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
