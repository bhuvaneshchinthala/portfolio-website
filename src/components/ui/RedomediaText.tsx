import React from 'react';
import { motion } from 'framer-motion';

export default function RedomediaText({ 
  text, 
  className = "",
  delayOffset = 0
}: { 
  text: string, 
  className?: string,
  delayOffset?: number
}) {
  const words = text.split(" ");
  
  return (
    <div className={`flex flex-wrap gap-x-[0.25em] gap-y-2 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="relative overflow-hidden inline-flex pb-2">
          <motion.span
            initial={{ y: "110%", filter: "blur(8px)", opacity: 0, rotateZ: 5 }}
            whileInView={{ y: "0%", filter: "blur(0px)", opacity: 1, rotateZ: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 1.2, 
              delay: delayOffset + i * 0.08, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block origin-bottom-left will-change-[transform,filter,opacity]"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
