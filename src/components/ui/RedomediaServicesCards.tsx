import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// ─────────────────────────────────────────────
// Sub-Component: 3D Parallax Glass Card
// ─────────────────────────────────────────────
interface CardProps {
    title: string;
    desc: string;
    icon: string;
    accentColor: string;
    gridPosition: number; // -1 for left, 0 for center, 1 for right
    scrollYProgress: any;
}

const HolographicCard = ({ title, desc, icon, accentColor, gridPosition, scrollYProgress }: CardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Spring-based 3D rotation for smooth, physical feeling
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Smooth out the raw mouse movement values
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        // Return to flat state
        x.set(0);
        y.set(0);
    };

    // Scroll animation values for fanning out
    // Cards start exactly stacked at 0% translation.
    // As the user scrolls through the 150vh container (from 10% to 60%),
    // they "fan out" to their final columns.
    const fanEffectX = useTransform(scrollYProgress, [0.1, 0.6], ["0%", `${gridPosition * 105}%`]); 
    // Add realistic rotation to the cards as they spread
    const fanEffectRotate = useTransform(scrollYProgress, [0.1, 0.6], [0, gridPosition * 8]);
    
    // Start them all slightly lower, then they rise up
    const fanEffectY = useTransform(scrollYProgress, [0.1, 0.6], [40, gridPosition === 0 ? 0 : 20]);
    // The center card sits on top in the stack
    const zIndex = gridPosition === 0 ? 30 : 20;

    return (
        <motion.div
            className="absolute md:absolute w-full aspect-[3/4] md:aspect-[3/4] max-w-[340px] md:max-w-[380px] shadow-2xl origin-bottom"
            style={{ 
                x: fanEffectX, // Use Framer Motion % transforms 
                y: fanEffectY,
                rotateZ: fanEffectRotate,
                zIndex,
                // Perfectly center all 3 absolute stacked
                left: '0', 
                right: '0',
                margin: '0 auto',
                perspective: 1000
            }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full relative cursor-pointer"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* 
                  The Card Body: 
                  Frosted glass background, dark subtle gradient, glowing border 
                */}
                <div 
                    className="absolute inset-0 rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-[30px] border border-white/10 group transition-colors duration-500"
                    style={{
                        boxShadow: `0 30px 60px -10px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.02)`
                    }}
                >
                    {/* Animated grid/noise background layer */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-30 mix-blend-overlay" />
                    
                    {/* Subtle Base Tint */}
                    <div 
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: accentColor }}
                    />

                    {/* Hover Glow Light following mouse */}
                    <motion.div 
                        className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient( circle at 50% 50%, ${accentColor}33 0%, transparent 60% )`,
                        }}
                    />

                    {/* Content Layer with internal Z-axis pop */}
                    <div 
                        className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between"
                        style={{ transform: 'translateZ(50px)' }} // Pushes content out towards the user
                    >
                        {/* Top: Tech Icon Badge */}
                        <div 
                            className="w-14 h-14 rounded-full border flex items-center justify-center bg-black/50 backdrop-blur-md relative overflow-hidden"
                            style={{ 
                                borderColor: `${accentColor}40`,
                                boxShadow: `0 0 20px ${accentColor}20` 
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent" style={{ '--tw-gradient-to': `${accentColor}20` } as React.CSSProperties} />
                            <span 
                                className="text-xl block transform-gpu group-hover:scale-110 transition-transform"
                                style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}` }}
                            >
                                {icon}
                            </span>
                        </div>

                        {/* Bottom: Text Info */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl md:text-3xl font-sans font-bold leading-tight tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                                style={{
                                    backgroundImage: `linear-gradient(to right, #ffffff, ${accentColor})`,
                                    WebkitBackgroundClip: 'text',
                                }}
                            >
                                {title}
                            </h3>
                            <p className="text-sm font-medium text-white/60 leading-relaxed font-sans mt-2">
                                {desc}
                            </p>
                        </div>
                    </div>

                    {/* Glowing highlight line on top edge */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-[1px] opacity-70"
                        style={{
                            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};


export default function RedomediaServicesCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Track scroll progress strictly within this 300vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const cards = [
        {
            icon: "✦",
            accentColor: "#00e5ff", // Bright Cyan
            title: "Predictive Intelligence",
            desc: "Designing robust ML models tailored to analyze market patterns, forecast structural outcomes, and automate critical decisions.",
            gridPosition: -1 // Left
        },
        {
            icon: "⚡",
            accentColor: "#ff2800", // Signature Red
            title: "Autonomous Systems",
            desc: "Integrating edge computer vision and robotic algorithms to power self-reliant, highly responsive mechanical architectures.",
            gridPosition: 0 // Center
        },
        {
            icon: "⎈",
            accentColor: "#b026ff", // Neon Purple
            title: "Scalable Neural Nets",
            desc: "Optimizing deep learning pipelines for high-throughput enterprise environments, ensuring zero latency at massive scale.",
            gridPosition: 1 // Right
        }
    ];

    return (
        // Extra height (300vh) allows room for the user to scroll through the "fan out" animation
        <div ref={containerRef} className="w-full relative h-[150vh] md:h-auto md:py-48 bg-[#0a0a0a] overflow-hidden md:overflow-visible">
            
            {/* Dark background base */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwaC0yMHYtMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')]" />
            
            <div className="sticky top-[10%] md:relative md:top-0 w-full max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col items-center">
                
                {/* 
                  Vertical Identity Statement Side Badge 
                  Requested by user: "I am an AI Engineer that specializes in Systems"
                */}
                <div className="absolute left-4 md:left-12 top-0 hidden lg:flex flex-col gap-1 items-start opacity-20 hover:opacity-100 transition-opacity duration-700 select-none">
                    {["I", "AM", "AN"].map((w, i) => (
                        <span key={i} className="text-[10px] font-mono tracking-[0.4em] text-white rotate-180 [writing-mode:vertical-lr]">{w}</span>
                    ))}
                    <span className="text-[10px] font-mono tracking-[0.4em] text-[#ff2800] rotate-180 [writing-mode:vertical-lr] font-bold my-2">AI ENGINEER</span>
                    {["THAT", "SPECIALIZES", "IN", "SYSTEMS"].map((w, i) => (
                        <span key={i} className="text-[10px] font-mono tracking-[0.4em] text-white rotate-180 [writing-mode:vertical-lr]">{w}</span>
                    ))}
                </div>

                <h2 className="text-2xl lg:text-[2.75rem] leading-[1.4] font-light tracking-[0.25em] text-white/50 uppercase pr-4 mb-16 md:mb-24 text-center z-40 relative px-4">
                    Architecting <br className="hidden md:block"/>
                    <span className="block mt-2">the future of your <span className="text-white font-bold tracking-tight">SYSTEMS</span></span>
                </h2>

                {/* 
                  Container for the Cards 
                  They are absolutely stacked in the center.
                  X transform handles "fanning" them out based on scroll.
                */}
                <div className="relative w-full h-[70vh] md:h-[600px] flex justify-center items-start pt-10 md:pt-20">
                    {cards.map((card, idx) => (
                        <HolographicCard 
                            key={idx}
                            title={card.title}
                            desc={card.desc}
                            icon={card.icon}
                            accentColor={card.accentColor}
                            gridPosition={card.gridPosition}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
