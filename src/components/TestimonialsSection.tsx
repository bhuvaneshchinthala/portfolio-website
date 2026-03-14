import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const values = [
    {
        id: 1,
        name: "Vision",
        role: "The Ability to See",
        text: "It is the art of seeing what is invisible to others. To create not just what is expected, but what is necessary for the future."
    },
    {
        id: 2,
        name: "Discipline",
        role: "The Bridge to Goals",
        text: "Motivation gets you started. Habit keeps you going. Discipline is choosing between what you want now and what you want most."
    },
    {
        id: 3,
        name: "Passion",
        role: "The Fuel for Excellence",
        text: "There is no substitute for passion. It turns work into craft, effort into art, and time into a legacy."
    }
];

// Framer Motion Variants for 3D Character Reveal
const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.1,
        }
    }
};

const charVariant = {
    hidden: { opacity: 0, y: "80%", skewY: "25deg", rotate: "10deg" },
    visible: {
        opacity: 1,
        y: "0%",
        skewY: "0deg",
        rotate: "0deg",
        transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000] } // easeOutCubic
    }
};

const RevealWord = ({ word, className, delay = 0 }: { word: string, className: string, delay?: number }) => {
    return (
        <motion.span
            className={`inline-flex py-2 relative ${className}`}
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delayChildren: delay }}
        >
            {word.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={charVariant}
                    style={{ display: 'inline-block', transformOrigin: "top left" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: headerProgress } = useScroll({
        target: headerRef,
        offset: ["start 90%", "end 50%"]
    });

    // Track the entire section for the floating cards and overall opacity
    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const cardsY = useTransform(sectionProgress, [0, 1], [100, -100]);

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-deep-black text-white flex flex-col justify-center py-24 overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,40,0,0.03)_0%,transparent_70%)] pointer-events-none"></div>

            {/* Massive Typography Header */}
            <div ref={headerRef} className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col text-center md:text-left pt-20">

                <div className="flex flex-col font-black tracking-tighter leading-[0.8] mb-12">
                    {/* Line 1: MY */}
                    <div className="flex text-[15vw] md:text-[12rem] text-[#e0e0e0]">
                        <RevealWord word="MY" delay={0} className="drop-shadow-lg" />
                    </div>

                    {/* Line 2: CORE */}
                    <div className="flex text-[15vw] md:text-[12rem] text-white ml-[5vw] md:ml-[10vw]">
                        <RevealWord word="CORE" delay={0.2} className="drop-shadow-xl" />
                    </div>

                    {/* Line 3: VALUES (Special Glow & Pulse) */}
                    <div className="flex flex-wrap items-baseline gap-4 ml-[10vw] md:ml-[5vw]">
                        <RevealWord
                            word="VALUES"
                            delay={0.4}
                            className="text-[15vw] md:text-[12rem] text-[#ff2800] drop-shadow-[0_0_30px_rgba(255,40,0,0.4)]"
                        />

                        {/* Decorative rotating accent dot that fades in at the end of the text animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="w-6 h-6 md:w-12 md:h-12 bg-[#ff2800] rounded-full mb-6 md:mb-16 shadow-[0_0_40px_rgba(255,40,0,0.8)] animate-pulse"
                        />
                    </div>
                </div>

            </div>

            {/* Values List */}
            <motion.div
                style={{ y: cardsY }}
                className="container mx-auto px-4 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16 relative z-10"
            >
                {values.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-4 group hover:bg-white/[0.02] p-6 rounded-3xl transition-colors border border-transparent hover:border-white/5"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-4xl md:text-5xl font-black text-white/5 transition-colors group-hover:text-red-500/20">0{item.id}.</span>
                            <div className="w-8 h-[1px] bg-red-500/0 group-hover:bg-red-500/50 mt-4 transition-all duration-500"></div>
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-500 transition-colors">{item.name}</h3>
                            <span className="text-sm font-mono text-[#ff2800]/80 tracking-widest uppercase mt-1 block">{item.role}</span>
                        </div>
                        <p className="text-lg text-gray-400 leading-relaxed italic mt-2">
                            "{item.text}"
                        </p>
                    </motion.div>
                ))}
            </motion.div>

        </section>
    );
}
