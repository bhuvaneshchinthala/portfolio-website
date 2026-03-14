import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import CoreValuesCanvas from './CoreValuesCanvas';

export default function CoreValuesSection() {
    const containerRef = useRef<HTMLElement>(null);

    // Track scroll progress through this specific section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Fade out text as video plays
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

    return (
        <section
            ref={containerRef}
            className="relative bg-black h-[300vh] w-full"
            id="core-values"
        >
            {/* STICKY CONTAINER: Stays on screen while we scroll through the 300vh */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* 1. Canvas Animation Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <CoreValuesCanvas scrollYProgress={scrollYProgress} />
                </div>

                {/* 2. Text Overlay (Continuous breathing animation, fades on scroll) */}
                <motion.div
                    style={{ opacity: textOpacity }}
                    className="relative z-10 flex flex-col items-center text-center px-4 mix-blend-difference pointer-events-none"
                >
                    {/* "MY CORE" continuous breathing animation */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.02, 1],
                            textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 20px rgba(255,255,255,0.3)", "0px 0px 0px rgba(255,255,255,0)"]
                        }}
                        transition={{
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                            textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="text-white text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter mix-blend-difference"
                    >
                        MY CORE
                    </motion.h2>

                    {/* "VALUES" continuous breathing animation */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        animate={{
                            y: [0, 10, 0],
                            scale: [1, 1.03, 1],
                            textShadow: ["0px 0px 20px rgba(255,40,0,0.5)", "0px 0px 40px rgba(255,40,0,0.8)", "0px 0px 20px rgba(255,40,0,0.5)"]
                        }}
                        transition={{
                            delay: 0.5,
                            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="text-[#ff2800] text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter mt-[-2vw]"
                    >
                        VALUES
                    </motion.h2>

                    {/* Subtitle slides up from bottom once, then stays */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                        className="mt-6 text-white/80 text-xl md:text-2xl font-light tracking-widest uppercase"
                    >
                        Discipline. Focus. Execution.
                    </motion.p>
                </motion.div>

                {/* Optional dark gradients to blend top/bottom edges into next sections */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
            </div>
        </section>
    );
}
