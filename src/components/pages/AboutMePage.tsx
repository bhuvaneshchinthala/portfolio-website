import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RotatingText from '@/components/ui/RotatingText';
import RedomediaText from '@/components/ui/RedomediaText';
import RedomediaServicesCards from '@/components/ui/RedomediaServicesCards';
import VisionMatrixGallery from '@/components/VisionMatrixGallery';
import ParallaxImage from '@/components/ui/ParallaxImage';
import ImageFlipCard from '@/components/ui/ImageFlipCard';
import AnimatedCircuitLine from '@/components/ui/AnimatedCircuitLine';
import FloatingTerminal from '@/components/ui/FloatingTerminal';
import InteractiveScrambleText from '@/components/ui/InteractiveScrambleText';
import MagneticScrambleText from '@/components/ui/MagneticScrambleText';

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#∆Ω≡∑∞◆▲!?%&';
const EMAIL = 'BHUVANESH';

function EmailChar({ char, index }: { char: string; index: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(char);
    const [close, setClose] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 350, damping: 22 });
    const sy = useSpring(y, { stiffness: 350, damping: 22 });
    const scramRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const max = 120;
            if (dist < max) {
                const force = (1 - dist / max) * 20;
                x.set(dx * force / dist);
                y.set(dy * force / dist);
                setClose(true);
                if (!scramRef.current) {
                    let n = 0;
                    scramRef.current = setInterval(() => {
                        setDisplay(SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]);
                        if (++n > 7) {
                            clearInterval(scramRef.current!); scramRef.current = null;
                            setDisplay(char);
                        }
                    }, 40);
                }
            } else {
                x.set(0); y.set(0); setClose(false);
                if (scramRef.current) { clearInterval(scramRef.current); scramRef.current = null; setDisplay(char); }
            }
        };
        window.addEventListener('mousemove', onMove);
        return () => { window.removeEventListener('mousemove', onMove); if (scramRef.current) clearInterval(scramRef.current); };
    }, [char, x, y]);

    return (
        <motion.span
            ref={ref}
            style={{
                x: sx, y: sy,
                display: 'inline-block',
                color: close ? '#ff2800' : 'white',
                filter: close ? 'drop-shadow(0 0 18px rgba(255,40,0,0.9)) drop-shadow(0 0 40px rgba(255,40,0,0.5))' : 'none',
                transition: 'color 0.15s, filter 0.15s',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
        >
            {display}
        </motion.span>
    );
}

function AnimatedEmail() {
    return (
        <a
            href="mailto:hello@bhuvanesh.dev"
            className="relative z-10 flex flex-wrap justify-center font-black font-sans pb-3 cursor-pointer"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 3.5rem)', letterSpacing: '-0.01em' }}
        >
            {/* Animated underline bar */}
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff2800] rounded-full" style={{ boxShadow: '0 0 16px rgba(255,40,0,0.7)' }} />
            {EMAIL.split('').map((ch, i) => (
                <EmailChar key={i} char={ch} index={i} />
            ))}
        </a>
    );
}

// ─────────────────────────────────────────────
// Sub-Component: Floating Navigation
// ─────────────────────────────────────────────
const AboutNavInfo = () => (
    <div className="fixed top-0 left-0 w-full z-[100] p-6 md:p-12 flex justify-between items-start pointer-events-none mix-blend-difference">
        {/* Animated Name Logo (Valentin Cheval Style) */}
        <Link to="/" className="pointer-events-auto group overflow-hidden relative font-sans text-xl md:text-2xl font-bold tracking-tight h-8 flex items-start">
            <div className="flex flex-col transition-transform duration-[0.6s] ease-[0.76,0,0.24,1] transform group-hover:-translate-y-1/2 mt-1 uppercase">
                <div className="h-8 flex items-center leading-none">
                    <span className="text-white">BHUVANESH</span>
                    <span className="text-[#A3A3A3] font-normal ml-1">CHINTHALA</span>
                </div>
                <div className="h-8 flex items-center leading-none text-[#ff2800]">
                    <span>AI</span>
                    <span className="text-[#ff2800]/70 font-normal ml-1">ENGINEER</span>
                </div>
            </div>
        </Link>
        <div className="flex flex-col items-end text-right text-xs uppercase tracking-[0.2em] text-white">
            <span className="font-sans font-bold text-[#ff2800]">BHUVANESH CHINTHALA&reg;</span>
            <span className="font-sans text-white/50 font-medium tracking-widest mt-1">AI ARCHITECT</span>
            <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-white/30 text-[10px]">
                <span>93</span>
                <span className="text-[#ff2800]">—</span>
                <span className="text-white">25</span>
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────
// Sub-Component: Hover Services List
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Sub-Component: Experience Row
// ─────────────────────────────────────────────
const ExperienceRow = ({ role, type, company, location, start, end }: any) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-8 border-b border-white/20 text-sm md:text-base hover:bg-white/[0.02] transition-colors group cursor-default font-sans px-4 md:px-0">
            <div className="col-span-2 font-bold text-white group-hover:text-[#ff2800] transition-colors font-sans uppercase tracking-widest text-lg">{role}</div>
            <div className="text-white/40 uppercase tracking-widest text-sm mt-1">{type}</div>
            <div className="text-white/80 font-medium text-lg">{company}</div>
            <div className="text-white/40 hidden md:block">{location}</div>
            <div className="text-white/40 text-right md:text-left flex flex-col md:flex-row md:gap-2 justify-end font-mono text-[10px] text-xs mt-1">
                <span>{start}</span>
                <span className="hidden md:inline text-[#ff2800]">—</span>
                <span className="text-white">{end}</span>
            </div>
        </div>
    );
};

export default function AboutMePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yImg = useTransform(scrollYProgress, [0, 1], [0, 200]);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const contentHeight = contentRef.current.offsetHeight;
            
            // Seamless jump
            if (window.scrollY >= contentHeight) {
                window.scrollTo({ top: window.scrollY - contentHeight, behavior: 'auto' });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white relative flex flex-col items-center selection:bg-[#ff2800] selection:text-white font-inter overflow-x-hidden">

            <AboutNavInfo />
            <AnimatedCircuitLine />
            <FloatingTerminal />

            {/* Custom Noise Grid Background native to the website theme */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwaC0yMHYtMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0 mix-blend-overlay" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1000px] bg-red-600/5 rounded-full blur-[200px] pointer-events-none z-0" />

            <div className="w-full flex flex-col items-center relative z-10">
                <div ref={contentRef} className="w-full flex flex-col items-center">
                    <AboutContent scrollYProgress={scrollYProgress} />
                </div>
                {/* Seamless Loop Duplicate */}
                <div className="w-full flex flex-col items-center" aria-hidden="true">
                    <AboutContent scrollYProgress={scrollYProgress} />
                </div>
            </div>
        </div>
    );
}

const AboutContent = ({ scrollYProgress }: { scrollYProgress: any }) => (
    <>
            {/* 1. HERO SECTION (Replicating exact Valentin structural boxes) */}
            <section className="relative z-10 w-full min-h-screen pt-40 md:pt-48 pb-12 flex flex-col justify-start max-w-[1800px] mx-auto px-4 md:px-12 border-b border-white/20">

                {/* 1A. Massive Kinetic Header (Dynamic focal point) */}
                <div className="w-full mb-32 relative">
                    <motion.div
                        style={{ y: useTransform(scrollYProgress, [0, 0.2], [0, -100]), scale: useTransform(scrollYProgress, [0, 0.2], [1, 1.05]) }}
                        className="w-full flex flex-col items-start justify-start pt-12 md:pt-20 select-none"
                    >
                        {/* FIRST NAME: BHUVANESH (Clean, Crisp Solid White) */}
                        <div className="relative text-[16vw] md:text-[12rem] lg:text-[15rem] leading-[0.75] font-sans font-black tracking-[-0.08em] overflow-hidden w-full overflow-hidden">
                            <div className="relative z-10 text-white flex">
                                {"BHUVANESH".split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ y: '110%' }}
                                        animate={{ y: '0%' }}
                                        transition={{ duration: 1.2, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* LAST NAME: CHINTHALA (Elegant Silver/Zinc Gradient) */}
                        <div className="flex items-end justify-between w-full md:w-[95%] md:ml-[5%] mt-[-1vw] md:mt-[-2rem] relative z-20">
                            <motion.div 
                                style={{ x: useTransform(scrollYProgress, [0, 0.3], [0, 100]) }}
                                className="text-[16vw] md:text-[12rem] lg:text-[15rem] leading-[0.75] font-sans font-black tracking-[-0.08em] flex items-start"
                            >
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 flex overflow-hidden py-4">
                                    {"CHINTHALA".split("").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ y: '110%' }}
                                            animate={{ y: '0%' }}
                                            transition={{ duration: 1.2, delay: 0.3 + (i * 0.05), ease: [0.19, 1, 0.22, 1] }}
                                            className="inline-block"
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </div>
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0, rotate: -45 }} 
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }} 
                                    transition={{ delay: 1, type: "spring", stiffness: 200 }} 
                                    className="text-4xl md:text-7xl ml-2 md:ml-6 font-medium text-white/40 italic self-end mb-[2vw] md:mb-[3rem]"
                                >&reg;</motion.span>
                            </motion.div>

                            {/* Kinetic Signature Numbers */}
                            <div className="hidden xl:flex flex-col font-sans font-black text-7xl lg:text-9xl tracking-tight leading-[0.8] text-right overflow-hidden opacity-30 group">
                                <motion.span 
                                    initial={{ y: "100%" }} 
                                    animate={{ y: 0 }} 
                                    transition={{ duration: 1.2, delay: 0.8, ease: "backOut" }} 
                                    className="text-[#1a1a1a] block group-hover:text-white transition-colors duration-700 cursor-default"
                                >
                                    26
                                </motion.span>
                                <motion.span 
                                    initial={{ y: "100%" }} 
                                    animate={{ y: 0 }} 
                                    transition={{ duration: 1.2, delay: 1, ease: "backOut" }} 
                                    className="text-white block hover:text-[#ff2800] transition-colors duration-700 cursor-default"
                                >
                                    08
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 1B. Valentin-style Strict Bordered Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 w-full border-t border-white/20 relative">

                    {/* Column 1: Intro Texts enclosed in grid boxes */}
                    <div className="md:col-span-5 flex flex-col pt-12">
                        <div className="flex flex-col items-start relative overflow-hidden group/identity">
                            
                            <h2 className="text-2xl lg:text-[2.75rem] leading-[1.4] font-sans font-light tracking-[0.25em] text-white/50 uppercase pr-8">
                                <InteractiveScrambleText text="I AM AN" className="block mb-4" />
                                
                                <span className="text-white font-semibold my-6 block drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] text-4xl lg:text-[4.5rem] tracking-[-0.02em]">
                                    <InteractiveScrambleText text="AI ENGINEER" className="" />
                                </span>
                                
                                <InteractiveScrambleText text="THAT SPECIALIZES" className="block mt-4" />
                                <InteractiveScrambleText text="IN SYSTEMS" className="block mt-2" />
                            </h2>
                        </div>
                    </div>

                    {/* Column 2: The Core Portrait Box */}
                    <div className="md:col-span-4 border-r border-white/20 relative w-full h-[60vh] md:h-auto">
                        <ImageFlipCard
                            src="/images/about-img-1.png"
                            alt="Portrait Architecture"
                            className="w-full h-full"
                        />
                    </div>

                    {/* Column 3: Secondary Information aligned right */}
                    <div className="md:col-span-3 flex flex-col">
                        <div className="p-6 md:p-12 flex flex-col justify-start flex-grow gap-6">
                            <MagneticScrambleText className="text-sm font-medium leading-relaxed">
                                I have a proven track record in bleeding-edge AI architecture and extensive systems engineering, leading deployments for research facilities and autonomous AI systems.
                            </MagneticScrambleText>
                            <MagneticScrambleText className="text-sm font-medium leading-relaxed">
                                My experience extends to the cutting-edge world of robotics, where I contributed to innovative multi-model deep learning networks and hardware integration.
                            </MagneticScrambleText>
                            <MagneticScrambleText className="text-sm font-medium leading-relaxed">
                                I'm fascinated by their intricate mechanical details and the strategic thinking required to scale computational models effectively.
                            </MagneticScrambleText>
                        </div>

                        {/* THE MISSING SUB-IMAGE FROM VALENTIN'S COLUMN 3 */}
                        <div className="w-full mt-auto p-4 md:p-8 pt-0 relative hidden md:block">
                            <ParallaxImage
                                src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop"
                                alt="Secondary Circuit Architecture"
                                containerClassName="aspect-square w-full sm:w-[80%] ml-auto border border-white/10 bg-zinc-900"
                            />
                        </div>
                    </div>
                </div>

                {/* THE MISSING (VISION) SECTION */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 mt-16 md:mt-24 pt-8 md:pt-16 border-t border-white/20 relative">
                    <div className="md:col-span-4 mb-8 md:mb-0 relative">
                        <p className="text-xl md:text-2xl font-sans font-light text-white/50 tracking-wide">(Vision)</p>
                        <div className="absolute top-12 left-0 font-mono text-[10px] text-[#ff2800]/50 uppercase tracking-[0.2em] hidden md:block">
                            φ = 1.618 <br />
                            <span className="text-white/20">Data.Flow</span>
                        </div>
                    </div>
                    <div className="md:col-span-8 border-t border-white/20 pt-8 mt-[-32px] md:mt-[-64px]">
                        <span className="text-[#ff2800] mr-4 text-3xl hidden md:inline-block translate-y-2">|</span>
                        <MagneticScrambleText className="text-xl md:text-2xl lg:text-[1.75rem] leading-[1.4] font-sans tracking-tight max-w-4xl">
                            My obsession is bridging the gap between raw computational capability and exceptional human-centric design. I believe being an engineer is being a servant to performance, in the most noble sense of the term; it's dedicating yourself to finding the right balance between systemic power and product goals. I follow strict mechanical principles: metrics used to iterate fast and verify hypothesis. I believe in constant testing and fail fast, learn fast principles.
                        </MagneticScrambleText>
                        <div className="w-full border-t border-white/20 mt-12 md:mt-16" />
                    </div>
                </div>

                {/* THE MISSING (I WORK WITH) SECTION */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 mt-16 md:mt-24 pt-8 md:pt-16 border-t border-white/20 relative mb-12">
                    <div className="md:col-span-4 mb-8 md:mb-0">
                        <p className="text-xl md:text-2xl font-sans font-light text-white/50 tracking-wide">(I work with)</p>
                    </div>
                    <div className="md:col-span-8 flex flex-col justify-start">
                        <h3 className="text-3xl md:text-4xl lg:text-[4.5rem] leading-[0.9] font-sans font-bold tracking-tighter text-white/80 mb-12">
                            Highly complex <br />
                            <RotatingText words={['neural networks', 'robotics systems', 'web architectures']} className="text-[#ff2800] mt-2 block" />
                        </h3>
                        <div className="w-full border-t border-white/20 mb-8" />
                        <MagneticScrambleText className="text-base max-w-xl">
                            I thrive on optimizing intricate computational challenges, pushing the boundaries of what these highly complex systems can execute in real-time environments.
                        </MagneticScrambleText>
                    </div>
                </div>

            </section>

            {/* 2. SERVICES HIGHLIGHTS (Replicating strict grid structure) */}
            <section className="relative z-10 w-full px-4 md:px-12 py-32 max-w-[1800px] mx-auto border-b border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 w-full h-full border-b border-white/20 pb-12 mb-12 font-sans">
                    <div className="col-span-1 hidden md:flex items-start">
                        <span className="font-mono text-[10px] text-[#ff2800] text-xs font-normal tracking-[0.3em] uppercase">[Core Competencies]</span>
                    </div>
                    <div className="md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="font-sans flex flex-col items-start"
                        >
                            <h2 className="text-2xl lg:text-[2.75rem] leading-[1.4] font-light tracking-[0.25em] text-white/50 uppercase pr-8 mb-4">
                                Architecting <br/>
                                <span className="block mt-2">the future of your</span>
                            </h2>
                            <div className="text-white font-bold my-2 block text-5xl lg:text-[5.5rem] tracking-tight uppercase">
                                <InteractiveScrambleText text="SYSTEMS" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="group border-b border-white/20 py-8 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer relative overflow-hidden px-4 md:px-12 bg-zinc-900/10">
                        {/* Background Reveal */}
                        <div className="absolute inset-0 bg-[#ff2800] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0" />
                        <div className="relative z-10 font-mono text-[10px] text-sm tracking-[0.2em] text-[#ff2800] group-hover:text-white mb-4 md:mb-0 transition-colors duration-500 uppercase">Artifact_01</div>
                        <h3 className="relative z-10 text-4xl md:text-6xl lg:text-[5rem] font-sans font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                            ML ARCHITECTURE <ArrowUpRight size={48} className="opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 hidden md:block" />
                        </h3>
                    </div>
                    <div className="group border-b border-white/20 py-8 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer relative overflow-hidden px-4 md:px-12 bg-zinc-900/5">
                        <div className="absolute inset-0 bg-[#ff2800] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0" />
                        <div className="relative z-10 font-mono text-[10px] text-sm tracking-[0.2em] text-[#ff2800] group-hover:text-white mb-4 md:mb-0 transition-colors duration-500 uppercase">Artifact_02</div>
                        <h3 className="relative z-10 text-4xl md:text-6xl lg:text-[5rem] font-sans font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                            ADVANCED WEBGL <ArrowUpRight size={48} className="opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 hidden md:block" />
                        </h3>
                    </div>
                    <div className="group border-b border-white/20 py-8 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer relative overflow-hidden px-4 md:px-12 bg-zinc-900/10">
                        <div className="absolute inset-0 bg-[#ff2800] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0" />
                        <div className="relative z-10 font-mono text-[10px] text-sm tracking-[0.2em] text-[#ff2800] group-hover:text-white mb-4 md:mb-0 transition-colors duration-500 uppercase">Artifact_03</div>
                        <h3 className="relative z-10 text-4xl md:text-6xl lg:text-[5rem] font-sans font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                            DEEP LEARNING <ArrowUpRight size={48} className="opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 hidden md:block" />
                        </h3>
                    </div>
                    <div className="group border-b border-white/20 py-8 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer relative overflow-hidden px-4 md:px-12 bg-zinc-900/5">
                        <div className="absolute inset-0 bg-[#ff2800] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0" />
                        <div className="relative z-10 font-mono text-[10px] text-sm tracking-[0.2em] text-[#ff2800] group-hover:text-white mb-4 md:mb-0 transition-colors duration-500 uppercase">Artifact_04</div>
                        <h3 className="relative z-10 text-4xl md:text-6xl lg:text-[5rem] font-sans font-black uppercase tracking-tighter text-white group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                            GENERATIVE AI <ArrowUpRight size={48} className="opacity-0 group-hover:opacity-100 transform -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 hidden md:block" />
                        </h3>
                    </div>
                </div>

                {/* THE MISSING DAILY APPROACH / IMAGE SECTION */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 mt-24 pt-16 border-t border-white/20">
                    <div className="md:col-span-6 relative w-full h-[50vh] md:h-[70vh]">
                        <ImageFlipCard
                            src="/images/about-img-2.jpg"
                            alt="Engineering Process"
                            className="w-full h-full"
                        />
                    </div>
                    <div className="md:col-span-6 flex items-center justify-center p-8 md:p-16 bg-deep-black z-10 md:-ml-12 mt-[-40px] md:mt-0">
                        <MagneticScrambleText className="text-xl md:text-2xl lg:text-[1.75rem] leading-[1.4] font-sans tracking-tight max-w-lg">
                            My approach to engineering centers on open conversation and collaboration, where ideas are shaped through shared input and mechanical creativity. It's a process of working together to ensure the final architecture reflects a shared vision and computational purpose.
                        </MagneticScrambleText>
                    </div>
                </div>
            </section>

            {/* 3. EXPERIENCE TIMELINE */}
            <section className="relative z-10 w-full px-4 md:px-12 py-32 max-w-[1800px] mx-auto border-b border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 w-full h-full border-b border-white/20 pb-12 mb-12">
                    <div className="col-span-1 hidden md:flex items-start">
                        <span className="font-mono text-[10px] text-[#ff2800] text-xs font-normal tracking-[0.3em] uppercase">[Timeline]</span>
                    </div>
                    <div className="md:col-span-3 font-sans">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1] font-black tracking-tighter uppercase mb-8"
                        >
                            <RedomediaText text="I build at the bleeding edge of" /> 
                            <span className="inline-block ml-2"><RotatingText words={['intelligence', 'data scaling', 'web systems']} className="text-[#ff2800]" /></span> 
                            <RedomediaText text="deployment." delayOffset={0.5} />
                        </motion.div>
                        <MagneticScrambleText className="text-lg md:text-xl font-light max-w-2xl font-sans mt-6">
                            With extensive experience in building robust software architectures and deploying production-grade ML systems, I have a deep understanding of core mechanics and a relentless pursuit of perfection.
                        </MagneticScrambleText>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <ExperienceRow role="Lead ML Engineer"    type="Full-time"  company="SPAR3D"          location="Vision"         start="May, 2026" end="Present" />
                    <ExperienceRow role="System Architect"    type="Full-time"  company="VOLTAI"          location="Infrastructure"  start="Aug, 2025" end="May, 2026" />
                    <ExperienceRow role="Backend Developer"   type="Contract"   company="RAG AI Systems"  location="NLP"             start="Oct, 2024" end="Aug, 2025" />
                    <ExperienceRow role="Robotics Engineer"   type="Internship" company="ROBOPICK"        location="Automation"      start="Sep, 2024" end="Oct, 2024" />
                </div>
            </section>

            {/* 4. REDOMEDIA SCROLL FLIPPING CARDS */}
            <RedomediaServicesCards />

            {/* 5. VISION MATRIX GALLERY (Injected) */}
            <div className="relative z-10 w-full max-w-[1800px] mx-auto border-b border-white/20 py-20 px-4">
                <VisionMatrixGallery />
            </div>

            {/* 5. FOOTER CTA */}
            <section className="relative z-10 w-full px-6 md:px-12 pt-32 pb-40 max-w-[1800px] mx-auto overflow-hidden flex flex-col items-center justify-center text-center">

                <h4 className="relative z-10 text-xs md:text-sm font-mono text-[10px] tracking-[0.3em] text-[#ff2800] mb-8 uppercase animate-pulse-slow">Got a project in mind?</h4>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 text-[10vw] font-sans font-black tracking-tighter uppercase leading-[0.8] mb-12"
                >
                    Let's make<br />
                    <span className="text-transparent liquid-chrome" style={{ WebkitTextStroke: '2px rgba(255,40,0,1)' }}>HAPPEN</span>
                </motion.h2>

                <AnimatedEmail />
            </section>
    </>
);
