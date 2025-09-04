"use client";
import { motion } from "framer-motion";
import Container from "./ui/Container";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

export default function VideoDemo() {
  return (
    <Section id="demo" className="bg-gray-50 dark:bg-gray-800">
      <Container>
        <SectionHeading
          title="See HLC Academy in Action"
          subtitle="Watch how our neuroscience-led approach transforms trading psychology"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  <div className="text-2xl font-semibold mb-2">Trading Dashboard Demo</div>
                  <div className="text-lg">Experience our platform in action</div>
                  <div className="text-sm mt-2 opacity-75">Video coming soon</div>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live Demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Interactive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Real-time</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video placeholder - replace with actual video when available */}
            {/* 
            <video
              className="w-full h-full aspect-video object-cover"
              muted
              playsInline
              autoPlay
              loop
              poster="/demo-poster.jpg"
            >
              <source src="/demo.webm" type="video/webm" />
              <source src="/demo.mp4" type="video/mp4" />
            </video>
            */}
          </div>
          
          {/* Video features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Real-time Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">See live performance metrics and bias tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Bias Checklist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pre-trade discipline system in action</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Psychology Training</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Neuroscience-backed decision making</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
