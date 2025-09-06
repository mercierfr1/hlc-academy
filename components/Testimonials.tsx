'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardContent } from '@/components/ui/Card'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Professional Trader',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'HLC Academy completely changed my approach to trading. The neuroscience-backed methods helped me eliminate emotional decisions and achieve 87% win rate consistently.',
    profit: '+$12,450',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Day Trader',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content: 'The bias checklist alone saved me thousands. I finally understand why I was losing money and how to fix it. This is the real deal.',
    profit: '+$8,920',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'Swing Trader',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'From losing money every month to consistent profits. The supply & demand concepts are game-changing. Worth every penny.',
    profit: '+$15,680',
    rating: 5,
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

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gray-50 dark:bg-gray-800/50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeading
            title="Real Traders, Real Results"
            subtitle="See how our funded traders are cashing in on their success"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} variants={itemVariants}>
              <Card className="h-full card-hover group border-gray-200/60 dark:border-white/10 hover:border-blue-200/60 dark:hover:border-blue-800/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                        {testimonial.profit}
                      </div>
                    </div>
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
