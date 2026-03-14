import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
    words: string[];
    interval?: number;
    className?: string;
}

export default function RotatingText({ words, interval = 3000, className = '' }: RotatingTextProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, interval);
        return () => clearInterval(timer);
    }, [words, interval]);

    return (
        <div
            className={`inline-flex items-center justify-center overflow-hidden relative ${className}`}
            style={{ perspective: '82.5rem' }} // From Valentin's reference
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ rotateX: 90, y: "50%", opacity: 0 }}
                    animate={{ rotateX: 0, y: "0%", opacity: 1 }}
                    exit={{ rotateX: -90, y: "-50%", opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1], // Cinematic easing
                    }}
                    className="block absolute whitespace-nowrap"
                    style={{ transformOrigin: 'center center -0.26em' }}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>

            {/* Invisible element to maintain width based on the longest word */}
            <span className="invisible whitespace-nowrap" aria-hidden="true">
                {words.reduce((a, b) => a.length > b.length ? a : b)}
            </span>
        </div>
    );
}
