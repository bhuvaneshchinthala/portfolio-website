import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AnimatedCircuitLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="absolute left-0 top-0 bottom-0 w-[40px] pointer-events-none z-0 hidden md:block">
      <svg 
        width="40" 
        height="100%" 
        viewBox="0 0 40 1000" 
        preserveAspectRatio="none" 
        className="w-full h-full opacity-40 mix-blend-screen"
      >
        {/* Faint background grid line */}
        <line x1="20" y1="0" x2="20" y2="1000" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* The glowing red circuit path that draws down on scroll */}
        <motion.path
          d="M 20 0 L 20 1000"
          stroke="#ff2800"
          strokeWidth="2"
          fill="none"
          style={{ pathLength }}
        />
        
        {/* Little connection nodes */}
        <motion.circle cx="20" cy="250" r="3" fill="#ff2800" style={{ opacity: pathLength }} />
        <motion.circle cx="20" cy="500" r="3" fill="#ff2800" style={{ opacity: pathLength }} />
        <motion.circle cx="20" cy="750" r="3" fill="#ff2800" style={{ opacity: pathLength }} />
      </svg>
    </div>
  );
}
