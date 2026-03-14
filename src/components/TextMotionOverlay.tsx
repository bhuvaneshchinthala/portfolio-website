import { motion } from 'framer-motion';

interface TextMotionOverlayProps {
  text: string;
  className?: string;
}

/**
 * TextMotionOverlay
 * Minimalist text motion animation inspired by Moroccan design
 * Creates a smooth reveal effect with letter-by-letter stagger
 */
export default function TextMotionOverlay({ text, className = '' }: TextMotionOverlayProps) {
  const letters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      x: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // bouncy easing
      },
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
