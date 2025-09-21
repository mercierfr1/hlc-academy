'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Play, Pause } from 'lucide-react'

export default function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section id="demo" className="py-20 sm:py-24 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Watch how our institutional-grade trading platform transforms your decision-making process 
            with real-time analytics and bias detection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-gray-200/60 dark:border-white/10 shadow-xl overflow-hidden bg-gray-900 ring-1 ring-gray-200/20 dark:ring-white/10">
            <div className="absolute top-4 left-4 flex space-x-2 z-10">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
            </div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white font-medium shadow-lg">
                HLC Trading Platform Demo
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePlayPause}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            
            <video
              ref={videoRef}
              className="w-full h-full aspect-video object-cover"
              controls
              playsInline
              poster="/demo-poster.jpg"
            >
              {/* Use your custom demo video - replace this URL with your hosted video */}
              <source src="https://your-video-hosting-url.com/walkthrough-software.mp4" type="video/mp4" />
              <source src="/demo.webm" type="video/webm" />
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video overlay with trading interface mockup */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

