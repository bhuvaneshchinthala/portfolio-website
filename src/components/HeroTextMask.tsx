import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const TEXT_ITEMS = ["ENGINEER", "DEVELOPER", "CREATOR", "VISIONARY"];

export default function HeroTextMask() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % TEXT_ITEMS.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    // Reveal animation for static text lines
    const reveal = {
        hidden: { y: "100%" },
        visible: {
            y: "0%",
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const }
        }
    };

    return (
        <div className="flex flex-col items-start justify-center h-full max-w-[120rem] mx-auto px-8">
            {/* Line 1 */}
            <div className="overflow-hidden">
                <motion.h1
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight"
                    initial="hidden"
                    animate="visible"
                    variants={reveal}
                >
                    DESIGN FOR
                </motion.h1>
            </div>

            {/* Line 2 with Ticker */}
            <div className="flex items-center gap-4 overflow-hidden">
                <motion.h1
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight"
                    initial="hidden"
                    animate="visible"
                    variants={reveal}
                >
                    THE
                </motion.h1>

                {/* Ticker Container */}
                <div className="h-[1.1em] overflow-hidden relative w-[400px]">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={index}
                            className="absolute top-0 left-0 text-6xl md:text-8xl font-black italic tracking-tighter text-red-600 block"
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "-100%" }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }}
                        >
                            {TEXT_ITEMS[index]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* Line 3 / Subtitle */}
            <div className="overflow-hidden mt-6 max-w-xl">
                <motion.p
                    className="text-lg md:text-xl text-gray-400 font-light"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                >
                    Crafting digital experiences where precision meets passion.
                    Building the future of web interaction.
                </motion.p>
            </div>
        </div>
    );
}
