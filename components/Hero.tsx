"use client";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import Container from "./ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-400/10 to-transparent" />
      
      <Container className="relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
              >
                🎯 Cohort starts in 6 days — 42/100 seats
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white text-balance">
                Master Institutional{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Supply & Demand
                </span>{" "}
                Trading
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-7 sm:leading-8 max-w-3xl mx-auto">
                Transform your trading psychology with neuroscience-backed learning. Join 2,400+ traders who've achieved consistent profits through institutional-grade decision making and bias-free execution.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button href="/onboarding" size="lg">
                Start Free Trial
              </Button>
              <Button href="#demo" variant="secondary" size="lg">
                See Live Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2,400+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Traders Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">94%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
