"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const words = [
  "Mallu Magic",      // English
  "മല്ലു മാജിക്",      // Malayalam 
  "மல்லு மேஜிக்",     // Tamil
  "మల్లు మ్యాజిక్",    // Telugu
  "ಮಲ್ಲು ಮ್ಯಾಜಿಕ್",    // Kannada
  "मल्लू मैजिक",    // Hindi
  "মাল্লু ম্যাজিক",     // Bengali
  "મલ્લુ મેજિક",      // Gujarati
  "मल्लू मॅजिक",      // Marathi
  "ਮੱਲੂ ਮੈਜਿਕ",        // Punjabi
  "മല്ലു മാജിക്"        // Malayalam 
]

// Theme Colors defined for easier management
const theme = {
    bgMain: "#F9F8F6",
    bgSecondary: "#EFE9E3",
    accent: "#C9B59C",
    // unused: "#D9CFC7" 
}

const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1, // Increased opacity slightly for better visibility in light mode
    transition: { duration: 1, delay: 0.2 },
  },
}

const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.2 },
  },
}

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
 
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
    
    // Optional: Handle window resize if necessary, though often overkill for a preloader
    // const resize = () => {
    //   setDimension({ width: window.innerWidth, height: window.innerHeight })
    // }
    // window.addEventListener("resize", resize)
    // return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    if (index === words.length - 1) {
      // Start exit animation after showing the last word
      setTimeout(() => {
        setIsExiting(true)
        // Call onComplete after exit animation
        setTimeout(() => {
          onComplete?.()
        }, 1000)
      }, 1000)
      return
    }

    setTimeout(
      () => {
        setIndex(index + 1)
      },
      index === 0 ? 1000 : 200,
    )
  }, [index, onComplete])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.3 },
    },
  }


  return (
      <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      // Changed bg-black to arbitrary tailwind value for theme.bgMain
      className={`fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#F9F8F6] z-[99999999999]`}
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            // Changed text-white to arbitrary theme.accent color
            className="flex items-center text-[#C9B59C] text-4xl md:text-5xl lg:text-6xl absolute z-10 font-medium"
          >
             {/* Changed dot bg-white to arbitrary theme.accent color */}
            <span className="block w-2.5 h-2.5 bg-[#C9B59C] rounded-full mr-2.5"></span>
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            {/* Changed fill to theme.bgSecondary */}
            <motion.path variants={curve} initial="initial" animate={isExiting ? "exit" : "initial"} fill="#EFE9E3" />
          </svg>
        </>
      )}
    </motion.div>
  );
};