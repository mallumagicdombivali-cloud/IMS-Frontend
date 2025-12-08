"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Preloader from "./components/ui/Preloader" // Ensure path matches your folder structure

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true)

  const handleComplete = useCallback(() => {
    setShowPreloader(false)
  }, [])

  return (
    <>
      {/* Show Preloader until it finishes */}
      {showPreloader && <Preloader onComplete={handleComplete} />}

      {/* Main Hero Section */}
      <main className="relative h-screen w-full overflow-hidden">
        
        {/* 1. THE VIDEO LAYER */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Replace this src with your actual video path inside public/videos */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 2. THE OVERLAY LAYER (Black with 50% Opacity) */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* 3. THE TEXT CONTENT LAYER */}
        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showPreloader ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white font-sans tracking-wide mb-6">
            Mallu Magic
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light">
            Authentic • Taste • Experience
          </p>
          <Link href="/login" className="mt-10 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-block">
            Explore Work
          </Link>
        </motion.div>
      </main>
    </>
  )
}