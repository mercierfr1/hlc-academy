'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Play, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
              <Container className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center rounded-full border border-blue-200/60 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/20 px-8 py-4 text-base font-medium text-blue-700 dark:text-blue-300 shadow-lg"
                >
                  <span className="mr-3">🎯</span>
                  Cohort starts in 6 days — 42/100 seats
                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white text-balance leading-[0.9]">
                  Master Institutional{' '}
                  <span className="gradient-text">Supply & Demand</span>{' '}
                  Trading
                </h1>

                       <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-8 sm:leading-9">
                         Transform your trading with neuroscience-backed learning. Join the traders who've achieved consistent profits through institutional-grade decision making.
                       </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-8"
              >
                <Button size="lg" className="group h-36 px-36 text-4xl flex items-center justify-center" asChild>
                  <Link href="/onboarding.html" className="flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-5 h-8 w-8 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button variant="secondary" size="lg" asChild className="group h-36 px-28 text-4xl text-gray-700 dark:text-white flex items-center justify-center">
                  <Link href="#demo" className="flex items-center justify-center">
                    <Play className="mr-5 h-8 w-8" />
                    See Live Demo
                  </Link>
                </Button>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-16 pt-10"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">2,400+</div>
                  <div className="text-base font-medium text-gray-600 dark:text-gray-400">Traders Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">94%</div>
                  <div className="text-base font-medium text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">87%</div>
                  <div className="text-base font-medium text-gray-600 dark:text-gray-400">Win Rate</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
    </section>
  )
}
