'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Upload, Play, Pause, RotateCcw, Trash2, CheckCircle } from 'lucide-react'

export default function VideoDemo() {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadStatus('uploading')
        const url = URL.createObjectURL(file)
        setUploadedVideo(file)
        setVideoUrl(url)
        setUploadStatus('success')
      } else {
        setUploadStatus('error')
        alert('Please select a valid video file')
      }
    }
  }

  const resetVideo = () => {
    setUploadedVideo(null)
    setVideoUrl('')
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Watch how our institutional-grade trading platform transforms your decision-making process 
            with real-time analytics and bias detection.
          </p>
          
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Your Demo
              </Button>
            </div>
            
            {uploadedVideo && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {uploadedVideo.name}
                </span>
                {uploadStatus === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetVideo}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
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
                {uploadedVideo ? 'Your Demo Video' : 'HLC Trading Dashboard'}
              </div>
            </div>
            
            {/* Video Controls */}
            {uploadedVideo && (
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
            )}
            
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full aspect-video object-cover"
                controls={!uploadedVideo}
                autoPlay={!uploadedVideo}
                loop={!uploadedVideo}
                muted={!uploadedVideo}
                playsInline
              >
                <source src={videoUrl} type={uploadedVideo?.type || 'video/mp4'} />
                Your browser does not support the video tag.
              </video>
            ) : (
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
                Your browser does not support the video tag.
              </video>
            )}
            
            {/* Video overlay with trading interface mockup */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          
          {/* Upload Instructions */}
          {!uploadedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Want to showcase your own trading setup? Upload a video above to replace this demo!
              </p>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}

