import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function ParallaxImage({ src, alt, className = "", containerClassName = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll specifically for THIS image container, not the whole page
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create a subtle parallax shift (-10% to 10% movement within the larger container)
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div style={{ y }} className="absolute md:inset-[-15%] inset-[-10%] w-[120%] md:w-[130%] h-[120%] md:h-[130%] flex items-center justify-center">
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover opacity-90 mix-blend-luminosity grayscale contrast-[1.1] ${className}`}
        />
        <div className="absolute inset-0 bg-[#ff2800]/10 mix-blend-overlay" />
      </motion.div>
    </div>
  );
}
