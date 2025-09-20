'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Brain, BarChart3, CheckCircle, Star, Users, MessageCircle, Calendar, Target, BookOpen, Zap } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Discord Community',
    description: 'Join a community of serious traders and get expert mentorship',
  },
  {
    icon: Target,
    title: 'Daily Trade Ideas',
    description: 'Get fresh trading opportunities delivered to your inbox every morning',
  },
  {
    icon: Calendar,
    title: 'Personalised Trading Journal Calendar',
    description: 'Track your progress with a custom calendar that adapts to your trading schedule',
  },
  {
    icon: BookOpen,
    title: 'All You Need Video Modules',
    description: 'Complete video modules designed to make you profitable from day one',
  },
  {
    icon: Zap,
    title: 'Daily XP Goals',
    description: 'Gamified learning with daily experience points to keep you motivated',
  },
  {
    icon: BarChart3,
    title: 'Trading Goal Manager',
    description: 'Set, track, and achieve your trading goals with our comprehensive management system',
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
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
