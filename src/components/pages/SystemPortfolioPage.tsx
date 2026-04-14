import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PORTFOLIO PAGE
// Inspired by Stabondar mechanics, geared towards System Architecture/Backend
// ─────────────────────────────────────────────────────────────────────────────

// Reusable Scroll Reveal Component
const RevealBlock = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }}
        >
            {children}
        </motion.div>
    );
};

// Fake Terminal Hook Engine
function useTypewriter(commands: string[], typingSpeed: number = 50, pauseDelay: number = 2000) {
    const [text, setText] = useState("");
    const [commandIndex, setCommandIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        
        if (isTyping) {
            const currentCommand = commands[commandIndex];
            if (text.length < currentCommand.length) {
                timeout = setTimeout(() => {
                    setText(currentCommand.slice(0, text.length + 1));
                }, typingSpeed);
            } else {
                setIsTyping(false);
                timeout = setTimeout(() => {
                    setCommandIndex((prev) => (prev + 1) % commands.length);
                    setText("");
                    setIsTyping(true);
                }, pauseDelay);
            }
        }
        return () => clearTimeout(timeout);
    }, [text, isTyping, commandIndex, commands, typingSpeed, pauseDelay]);

    return { text, fullCommand: commands[commandIndex] };
}

export default function SystemPortfolioPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    
    // Physics
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 300]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const aboutY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
    
    const { text: consoleText } = useTypewriter([
        "npm run build",
        "deploying scalable system...",
        "initializing serverless edge DB...",
        "status: 200 OK | ready"
    ]);

    return (
        <div ref={containerRef} className="bg-[#050505] text-white min-h-screen relative selection:bg-white/20 selection:text-white font-sans">
            
            {/* FLOATING HEADER */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-12 z-[100] mix-blend-difference flex justify-between items-center pointer-events-none">
                <span className="font-bold tracking-[0.2em] uppercase text-xs">Architect</span>
                <Link to="/" className="pointer-events-auto text-xs font-bold tracking-widest uppercase hover:text-white/50 transition-colors">
                    Menu
                </Link>
            </header>

            {/* 1. HERO SECTION */}
            <section className="relative w-full h-[120vh] flex flex-col justify-center items-center overflow-hidden">
                {/* Background Particle Mesh Simulation */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="z-10 flex flex-col items-center text-center w-full px-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <h1 className="text-[12vw] leading-none font-black tracking-tighter uppercase whitespace-nowrap" style={{ letterSpacing: "-0.05em" }}>
                            Bhuvanesh
                        </h1>
                        <h1 className="text-[12vw] leading-none font-black tracking-tighter uppercase text-transparent whitespace-nowrap overflow-visible" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)', letterSpacing: "-0.05em" }}>
                            Chinthala
                        </h1>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-12 flex flex-col items-center"
                    >
                        <p className="font-mono text-sm md:text-base text-white/50 uppercase tracking-[0.3em] mb-12">
                            Architecting Scalable Systems
                        </p>
                        {/* Magnetic CTA Button */}
                        <button className="magnetic-target relative group px-8 py-4 border border-white/20 rounded-full overflow-hidden bg-transparent hover:bg-white transition-colors duration-500">
                            <span className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase group-hover:text-black transition-colors duration-500">
                                Explore Models &rarr;
                            </span>
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. ABOUT SECTION (Split Layout) */}
            <section className="relative w-full min-h-screen py-32 px-6 md:px-12 z-20 bg-[#050505]">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-20 items-center">
                    <div className="w-full md:w-1/2">
                        <RevealBlock>
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-tight mb-8">
                                Building the<br/>Foundation.
                            </h2>
                            <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                                Specializing in high-performance computing, distributed databases, and bulletproof API architectures. I don't just write code; I construct the arterial networks that power modern scalable applications to handle massive throughput with zero latency degradation.
                            </p>
                        </RevealBlock>
                    </div>
                    <div className="w-full md:w-1/2 h-[600px] relative overflow-hidden group rounded-sm bg-[#111]">
                        <RevealBlock delay={0.2}>
                            <motion.div 
                                style={{ y: aboutY }}
                                className="absolute inset-[-100px] bg-gradient-to-tr from-black via-[#222] to-[#111] opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center border border-white/10 m-4">
                                <svg className="w-32 h-32 text-white/20 group-hover:text-white/50 transition-colors duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </RevealBlock>
                    </div>
                </div>
            </section>

            {/* 3. SKILLS GRID SECTION */}
            <section className="py-32 px-6 md:px-12 w-full max-w-[1400px] mx-auto border-t border-white/10">
                <RevealBlock>
                    <h3 className="text-sm font-mono text-white/50 tracking-[0.3em] uppercase mb-16">Domain Expertise</h3>
                </RevealBlock>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "SYSTEM DESIGN", desc: "Monolith to Microservices. High availability, fault tolerance, and complex state synchronization." },
                        { title: "FULL STACK", desc: "React, Next.js, Node. End-to-end type safety with pristine frontend execution." },
                        { title: "API DESIGN", desc: "GraphQL, REST, gRPC. Designing strictly-typed, versioned, and scalable communication layers." },
                        { title: "DB ARCHITECT", desc: "PostgreSQL, Redis, Mongo. Index optimization, sharding, and latency reduction." }
                    ].map((skill, i) => (
                        <RevealBlock delay={i * 0.1} key={i}>
                            <div className="group relative p-12 border border-white/10 bg-[#0a0a0a] hover:bg-[#111] overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <h4 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6 relative z-10">{skill.title}</h4>
                                <p className="text-white/50 text-sm tracking-wide leading-relaxed relative z-10">
                                    {skill.desc}
                                </p>
                            </div>
                        </RevealBlock>
                    ))}
                </div>
            </section>

            {/* 4. TERMINAL SECTION (IMPORTANT) */}
            <section className="py-32 px-6 md:px-12 w-full bg-[#0a0a0a]">
                <div className="max-w-[1000px] mx-auto">
                    <RevealBlock>
                        <div className="w-full rounded-xl border border-white/10 bg-black overflow-hidden shadow-2xl">
                            {/* MacOS Fake Header */}
                            <div className="w-full bg-[#111] px-4 py-3 flex items-center border-b border-white/10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="mx-auto text-xs font-mono text-white/30 truncate">
                                    user@architect-terminal:~
                                </div>
                            </div>
                            {/* Terminal Body */}
                            <div className="p-8 h-[300px] md:h-[400px] font-mono text-sm md:text-lg text-green-400 overflow-hidden">
                                <div className="mb-2">
                                    <span className="text-blue-400">~/server</span> <span className="text-white">&rarr;</span> <span className="opacity-70">git push origin deploy</span>
                                </div>
                                <div className="mb-4 text-white/60">
                                    Authenticating credentials... OK.
                                </div>
                                <div>
                                    <span className="text-blue-400">~/server</span> <span className="text-white">&rarr;</span> <span className="text-green-400">{consoleText}</span>
                                    <motion.span 
                                        animate={{ opacity: [1, 0, 1] }} 
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="inline-block w-3 h-5 bg-green-400 ml-1 translate-y-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </RevealBlock>
                </div>
            </section>

            {/* 5. PROJECTS SECTION */}
            <section className="py-32 px-6 md:px-12 w-full max-w-[1400px] mx-auto border-t border-white/10">
                <RevealBlock>
                    <h3 className="text-sm font-mono text-white/50 tracking-[0.3em] uppercase mb-16">Global Deployments</h3>
                </RevealBlock>
                <div className="flex flex-col gap-8">
                    {[
                        { name: "Atlas Protocol", type: "Core Infrastructure", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80" },
                        { name: "Nexus Data Grid", type: "Distributed Compute", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80" },
                        { name: "Zero Latency API", type: "Financial Systems", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" }
                    ].map((proj, i) => (
                        <RevealBlock delay={i * 0.15} key={i}>
                            <div className="group relative w-full h-[300px] md:h-[500px] overflow-hidden bg-[#111] border border-white/10 cursor-none flex items-center justify-center">
                                <img 
                                    src={proj.img} 
                                    alt={proj.name} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px] grayscale transition-all duration-700 group-hover:blur-none group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60" 
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-700" />
                                <div className="relative z-10 text-center transform group-hover:translate-y-[-20px] transition-transform duration-700 pointer-events-none">
                                    <h4 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">{proj.name}</h4>
                                    <p className="text-xs font-mono tracking-[0.3em] text-white/50 uppercase">{proj.type}</p>
                                </div>
                            </div>
                        </RevealBlock>
                    ))}
                </div>
            </section>

            {/* 6. CONTACT SECTION */}
            <section className="py-40 px-6 md:px-12 w-full bg-[#000] border-t border-white/10">
                <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
                    <RevealBlock>
                        <h2 className="text-5xl md:text-[80px] font-black tracking-tighter uppercase leading-none mb-12">
                            Initialize<br/>Connection.
                        </h2>
                    </RevealBlock>
                    <RevealBlock delay={0.2}>
                        <form className="w-full flex justify-center mb-16 relative">
                            <input 
                                type="email" 
                                placeholder="ENTER YOUR EMAIL" 
                                className="w-full md:w-2/3 bg-transparent border-b-2 border-white/20 px-4 py-4 text-center font-mono text-sm focus:outline-none focus:border-white transition-colors uppercase tracking-widest placeholder:text-white/20"
                            />
                        </form>
                        <button className="magnetic-target px-12 py-5 bg-white text-black text-sm font-bold tracking-[0.3em] uppercase rounded-full hover:bg-white/80 transition-all hover:scale-105 active:scale-95">
                            Let's Talk &rarr;
                        </button>
                    </RevealBlock>
                </div>
            </section>

        </div>
    );
}
