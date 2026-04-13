import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import VisionMatrixGallery from '@/components/VisionMatrixGallery';
import InteractiveScrambleText from '@/components/ui/InteractiveScrambleText';
import FloatingTerminal from '@/components/ui/FloatingTerminal';

const SCRAMBLE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#∆Ω≡∑∞◆▲!?%&';

function CubeTextFace({ texts, className }: { texts: string[], className?: string }) {
    const [scrambled, setScrambled] = useState([...texts]);
    
    // Continuous random scrambling simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setScrambled(texts.map(t => {
                if (Math.random() > 0.8) {
                    return Array.from({ length: t.length }).map(() => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]).join('');
                }
                return t;
            }));
        }, 150);
        return () => clearInterval(interval);
    }, [texts]);

    return (
        <div className={`w-full h-full flex flex-col justify-center gap-4 text-[4vw] md:text-[3rem] font-sans font-light tracking-tight opacity-70 p-8 or 12 leading-[1.1] ${className}`}>
            {scrambled.map((line, i) => (
                <div key={i} className="whitespace-nowrap overflow-hidden text-clip">{line}</div>
            ))}
        </div>
    );
}

const StabondarNavInfo = () => (
    <div className="fixed top-0 left-0 w-full z-[100] p-6 md:p-12 flex justify-between items-start pointer-events-none mix-blend-difference">
        <Link to="/" className="pointer-events-auto font-sans text-xl md:text-2xl font-bold tracking-tight bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
            <span className="uppercase text-sm">Return Home</span>
        </Link>
        <div className="flex flex-col items-end text-right text-xs uppercase tracking-[0.2em] text-[#ff2800]">
            <span className="font-sans font-bold">st^b::nd^r</span>
        </div>
    </div>
);

export default function StabondarPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    
    // Smooth scroll physics
    const yHero = useTransform(scrollYProgress, [0, 1], [0, -400]);

    // Mouse Parallax for Isometric Cube
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [45, 75]), { stiffness: 50, damping: 20 });
    const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth - 0.5);
            mouseY.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0d0d0d] text-white relative font-inter overflow-x-hidden selection:bg-[#ff2800] selection:text-white pb-32">
            <StabondarNavInfo />
            <FloatingTerminal />

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0" 
                 style={{
                     backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                     backgroundSize: '100px 100px',
                     transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-200px)',
                     transformOrigin: 'top center'
                 }} 
            />

            {/* 1. Isometric Rotating Cube Hero */}
            <motion.section style={{ y: yHero }} className="relative z-10 w-full min-h-[120vh] flex items-center justify-center pt-24 overflow-hidden pointer-events-none">
                
                <div style={{ perspective: 2000 }} className="w-[800px] h-[800px] flex items-center justify-center">
                    <motion.div 
                        style={{ rotateX, rotateZ, transformStyle: "preserve-3d" }}
                        className="w-[400px] h-[400px] relative transition-transform duration-75"
                    >
                        {/* Plane 1: Front */}
                        <div className="absolute inset-0 border-[1px] border-white/20 bg-[#0d0d0d]/80 backdrop-blur-sm" style={{ transform: 'translateZ(200px)' }}>
                            <CubeTextFace texts={['gtIvayb', 'Idqahqzvixv', 'ojcqgygtfgk', 'wzy']} className="text-white" />
                        </div>
                        
                        {/* Plane 2: Right */}
                        <div className="absolute inset-0 border-[1px] border-white/20 bg-[#0d0d0d]/80 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(200px)' }}>
                            <CubeTextFace texts={['Nominee', 'ishcympqgsy', 'ogxlvjvurl', 'vg']} className="text-white" />
                        </div>
                        
                        {/* Plane 3: Left */}
                        <div className="absolute inset-0 border-[1px] border-white/20 bg-[#0d0d0d]/80 backdrop-blur-sm" style={{ transform: 'rotateY(-90deg) translateZ(200px)' }}>
                            <CubeTextFace texts={['cfezjyz', 'Inzhxbnfg', 'of tinswemo', '2b']} className="text-white" />
                        </div>

                        {/* Plane 4: Top */}
                        <div className="absolute inset-0 border-[1px] border-white/20 bg-[#0d0d0d]/80 backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(200px)' }}>
                            <CubeTextFace texts={['Nominfn', 'Independent', 'of the Year', '2024']} className="text-white/30" />
                        </div>

                        {/* Plane 5: Bottom */}
                        <div className="absolute inset-0 border-[1px] border-white/20 bg-[#0d0d0d]/80 backdrop-blur-sm" style={{ transform: 'rotateX(-90deg) translateZ(200px)' }}>
                            <CubeTextFace texts={['Nomhvst', 'epenugpg', 'Year', '11q']} className="text-[#ff2800]/50" />
                        </div>
                    </motion.div>
                </div>

            </motion.section>

            {/* 2. Stabondar Projects Grid Array */}
            <section className="relative z-20 w-full px-4 md:px-12 py-24 border-t-[1px] border-white/10 bg-[#0a0a0a]">
                <div className="max-w-[1800px] mx-auto text-white">
                    <h2 className="text-3xl md:text-5xl font-mono tracking-tighter uppercase mb-16 text-[#ff2800]">
                        <InteractiveScrambleText text="[ ARCHITECTURE // CASES ]" />
                    </h2>
                    <VisionMatrixGallery />
                </div>
            </section>

        </div>
    );
}
