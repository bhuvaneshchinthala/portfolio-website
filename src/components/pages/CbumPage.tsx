import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import FluidCursor from '@/components/ui/FluidCursor';

// ─────────────────────────────────────────────────────────────────
// STABONDAR 1:1 CLONE REPLICA WITH CBUM CONTENT (ADVANCED)
// ─────────────────────────────────────────────────────────────────

const SCRAMBLE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#∆Ω≡∑∞◆▲!?%&';
function CubeTextFace({ text, scrambleTrigger, isFooter = false }: { text: string, scrambleTrigger: number, isFooter?: boolean }) {
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (scrambleTrigger > 0) {
            let iteration = 0;
            const interval = setInterval(() => {
                setDisplay(text.split('').map((char, index) => {
                    if (index < iteration) return char;
                    return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
                }).join(''));
                iteration += 1 / 3;
                if (iteration >= text.length) clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        } else {
            const interval = setInterval(() => {
                setDisplay(text.split('').map(char => {
                    return Math.random() > 0.8 ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] : char;
                }).join(''));
            }, 100);
            return () => clearInterval(interval);
        }
    }, [text, scrambleTrigger]);

    return (
        <div className={`w-full h-full flex items-center justify-center ${isFooter ? 'text-[#ff4d00]/40' : 'text-white'}`}>
            <span className="font-sans text-[20px] md:text-[28px] font-medium leading-none tracking-tight text-center px-4 w-[75%] break-words uppercase">
                {display}
            </span>
        </div>
    );
}

// --- PROJECT IMAGES ---
const projects = [
    { src: "https://m.gettywallpapers.com/wp-content/uploads/2023/10/Cool-Cbum-icon.jpg", alt: "Raw Energy", aspect: "aspect-[3/4]", width: "w-[40%]", x: "0", y: "0" },
    { src: "https://wallpaperbat.com/img/1432837-chris-bumstead-printable-photo.jpg", alt: "Discipline", aspect: "aspect-[4/5]", width: "w-[30%]", x: "auto", right: "0", y: "300px" },
    { src: "https://img.republicworld.com/all_images/chris-bumstead-or-cbum-is-a-canadian-professional-bodybuilder-1728831196980-16_9.webp?w=1280&h=720&q=75&format=webp", alt: "Olympia 2023", aspect: "aspect-[16/9]", width: "w-[50%]", x: "10%", y: "400px" },
    { src: "https://m.media-amazon.com/images/I/41tzKqvhYYL.jpg", alt: "Aesthetic", aspect: "aspect-[2/3]", width: "w-[35%]", x: "auto", right: "15%", y: "800px" },
    { src: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", alt: "Execution", aspect: "aspect-square", width: "w-[45%]", x: "20%", y: "1200px" },
];

export default function CbumPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    
    // Progress Bar mapping
    const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Hero Scroll Physics
    const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -800]);

    // Mouse Parallax Physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-50, 50]), { stiffness: 50, damping: 20 });
    const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-50, 50]), { stiffness: 50, damping: 20 });
    
    // Cube Rotation Physics
    const cubeRotateX = useSpring(useTransform(scrollYProgress, [0, 0.5], [-15, -45]), { stiffness: 50, damping: 20 });
    const cubeRotateY = useSpring(useTransform(scrollYProgress, [0, 0.5], [45, 135]), { stiffness: 50, damping: 20 });

    const [scrolledPastHero, setScrolledPastHero] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth - 0.5);
            mouseY.set(e.clientY / window.innerHeight - 0.5);
        };
        const handleScroll = () => {
            setScrolledPastHero(window.scrollY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#000000] text-white relative font-sans overflow-hidden selection:bg-[#ff4d00] selection:text-white cursor-none">
            <FluidCursor />
            
            {/* GLOBAL CINEMATIC NOISE */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-difference" 
                 style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')" }}>
            </div>

            {/* PROGRESS BAR */}
            <div className="fixed right-0 top-0 w-[4px] h-full bg-white/5 z-[100] hidden md:block">
                <motion.div style={{ height: progressHeight }} className="w-full bg-[#ff4d00]" />
            </div>

            {/* 1. FIXED FLOATING NAVIGATION */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 md:px-12 flex justify-between items-start mix-blend-difference pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <Link to="/" className="bg-[#111] hover:bg-white hover:text-black border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors duration-300">
                        Home
                    </Link>
                    <Link to="/" className="bg-[#ff4d00] hover:bg-white hover:text-black text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors duration-300">
                        Let's Talk
                    </Link>
                </div>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="w-24 h-24 absolute right-6 md:right-12 top-6 flex items-center justify-center opacity-80"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -37,0" fill="transparent" />
                        <text className="text-[12px] uppercase font-bold tracking-[0.2em] fill-white">
                            <textPath href="#circlePath">CBUM • CHRIS BUMSTEAD • </textPath>
                        </text>
                    </svg>
                </motion.div>
            </nav>

            {/* 2. ATMOSPHERIC PARALLAX GRID */}
            <motion.div style={{ x: parallaxX, y: parallaxY }} className="fixed inset-0 pointer-events-none z-0 opacity-40">
                <div className="absolute inset-0"
                     style={{
                         backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)',
                         backgroundSize: '80px 80px'
                     }}>
                </div>
                {[
                    {t: "OLY", top: "15%", left: "12%"}, {t: "100%", top: "45%", left: "80%"}, {t: "5X", top: "85%", left: "30%"}, {t: "04", top: "70%", left: "85%"}
                ].map((coord, i) => (
                    <div key={i} className="absolute text-[10px] text-white/50 font-mono" style={{ top: coord.top, left: coord.left }}>
                        {coord.t}
                    </div>
                ))}
            </motion.div>

            {/* 3. HERO SECTION */}
            <section className="relative w-full h-[120vh] flex items-center justify-center z-10 pointer-events-none border-b border-white/5">
                <motion.h1 
                    style={{ y: heroTextY }}
                    className="absolute text-[30vw] leading-[0.8] font-bold tracking-tighter text-transparent opacity-20 select-none flex flex-col items-center"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
                >
                    <span>CB</span>
                    <span>UM</span>
                </motion.h1>

                <div className="flex flex-col items-center gap-4 text-center z-20">
                    <span className="text-[20px] md:text-[32px] font-bold tracking-[0.2em] uppercase">5x Mr. Olympia</span>
                    <span className="text-[20px] md:text-[32px] font-bold tracking-[0.2em] uppercase text-white/60">Pure Aesthetic</span>
                    <span className="text-[20px] md:text-[32px] font-bold tracking-[0.2em] uppercase text-white/30">100% Dedication</span>
                </div>
            </section>

            {/* 4. ISOMETRIC SCRMABLE CUBE & AWARDS SIDEBAR */}
            <section className="relative w-full min-h-[150vh] flex flex-col md:flex-row pt-32 px-6 md:px-24 z-20 pointer-events-none">
                <div className="w-full md:w-1/3 flex flex-col gap-8 text-[12px] md:text-sm tracking-wider uppercase font-medium text-white/70 mb-20 md:mb-0 sticky top-40 h-[60vh] overflow-hidden">
                    <div className="flex flex-col border-b border-white/20 pb-4">
                        <span className="text-white font-bold text-lg mb-1">OLYMPIA —</span>
                        <span>Classic Physique 2019</span>
                        <span>Classic Physique 2020</span>
                        <span>Classic Physique 2021</span>
                        <span>Classic Physique 2022</span>
                        <span>Classic Physique 2023</span>
                    </div>
                    <div className="flex flex-col border-b border-white/20 pb-4">
                        <span className="text-white font-bold text-lg mb-1">EXECUTION —</span>
                        <span>Zero Excuses</span>
                        <span>Total Accountability</span>
                    </div>
                </div>

                <div className="w-full md:w-2/3 h-[600px] flex justify-center items-start pt-20">
                    <div style={{ perspective: 1200 }} className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                        <motion.div 
                            style={{ rotateX: cubeRotateX, rotateY: cubeRotateY, transformStyle: "preserve-3d" }}
                            className="w-full h-full relative"
                        >
                            <div className="absolute inset-0 border border-white/20 bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'translateZ(200px)' }}>
                                <CubeTextFace text="PURE AESTHETIC POWER" scrambleTrigger={scrolledPastHero} />
                            </div>
                            <div className="absolute inset-0 border border-white/20 bg-[#111]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'rotateY(90deg) translateZ(200px)' }}>
                                <CubeTextFace text="5x MR. OLYMPIA CLASSIC" scrambleTrigger={scrolledPastHero} />
                            </div>
                            <div className="absolute inset-0 border border-white/20 bg-[#111]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'rotateY(-90deg) translateZ(200px)' }}>
                                <CubeTextFace text="100% DEDICATION AND FOCUS" scrambleTrigger={scrolledPastHero} />
                            </div>
                            <div className="absolute inset-0 border border-white/20 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'rotateX(90deg) translateZ(200px)' }}>
                                <CubeTextFace text="DOMINATING THE SPORT" scrambleTrigger={scrolledPastHero} />
                            </div>
                            <div className="absolute inset-0 border border-white/20 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'rotateX(-90deg) translateZ(200px)' }}>
                                <CubeTextFace text="LEGACY // 5X" scrambleTrigger={0} isFooter={true} />
                            </div>
                            <div className="absolute inset-0 border border-white/20 bg-[#111]/90 backdrop-blur-md flex items-center justify-center p-8" style={{ transform: 'rotateY(180deg) translateZ(200px)' }}>
                                <CubeTextFace text="CHRIS BUMSTEAD PORTFOLIO" scrambleTrigger={0} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. AESTHETICS // LEGACY (EDITORIAL IMAGE MATRIX) */}
            <section className="relative z-30 w-full min-h-[300vh] mt-32 px-6 md:px-12 bg-transparent pointer-events-none">
                <h2 className="text-4xl md:text-[100px] leading-none font-bold tracking-tighter uppercase mb-40 text-center">
                    Aesthetics <br/><span className="text-[#ff4d00]">// Legacy</span>
                </h2>

                {/* Hardcoded height gives the images vertical room to absolute properly without bleeding over edges */}
                <div className="relative w-full h-[2500px] max-w-[1400px] mx-auto mb-40 pointer-events-auto">
                    {projects.map((proj, i) => {
                        const yStart = 0;
                        const yEnd = 1;
                        const yOffset = useTransform(scrollYProgress, [yStart, yEnd], [0, -300 * (i + 1)]);
                        
                        return (
                            <motion.div
                                key={i}
                                style={{ y: yOffset, left: proj.x, right: proj.right || 'auto', top: proj.y }}
                                className={`absolute ${proj.width} cursor-crosshair group overflow-hidden`}
                            >
                                <div className={`w-full ${proj.aspect} overflow-hidden bg-[#ff4d00]/10`}>
                                    <motion.img 
                                        src={proj.src} 
                                        alt={proj.alt}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 saturate-[1.2] transition-all duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-[#ff4d00]/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                <div className="mt-4 flex justify-between items-center text-[10px] md:text-sm font-medium tracking-wide border-t border-white/20 pt-2 uppercase">
                                    <span className="font-bold">{proj.alt}</span>
                                    <span className="text-[#ff4d00] font-mono">Olympia</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
            
            {/* NEW ADVANCED MAGNETIC HOVER SECTION */}
            <section className="relative z-30 w-full py-32 flex flex-col items-center justify-center pointer-events-auto overflow-hidden bg-[#111] border-y border-white/10">
                <div className="absolute w-full h-full pointer-events-none flex items-center justify-center">
                    <motion.div 
                        animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="w-[800px] h-[800px] rounded-full border border-dashed border-white/5"
                    />
                </div>
                <div className="group cursor-crosshair relative">
                    <h2 className="text-[15vw] leading-none font-black uppercase tracking-tighter mix-blend-difference flex">
                        {['L','E','G','A','C','Y'].map((letter, i) => (
                           <motion.span
                               key={i}
                               whileHover={{ y: -40, scale: 1.2, color: '#ff4d00', transition: { type: 'spring', stiffness: 300 } }}
                               className="inline-block transition-colors duration-300"
                           >
                               {letter}
                           </motion.span>
                        ))}
                    </h2>
                    <p className="text-center font-mono text-sm tracking-[0.5em] mt-4 opacity-50 group-hover:opacity-100 transition-opacity text-[#ff4d00]">
                        INTERACT. REBEL. CONQUER.
                    </p>
                </div>
            </section>

            {/* 6. INFINITE BRAND MARQUEE */}
            <div className="relative z-40 bg-white text-black py-8 md:py-12 overflow-hidden flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -2000] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                    className="flex gap-16 font-black uppercase text-3xl md:text-5xl tracking-tighter shrink-0"
                >
                    {[...Array(3)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span>Raw Nutrition</span>
                            <span>•</span>
                            <span>Young LA</span>
                            <span>•</span>
                            <span>Revive MD</span>
                            <span>•</span>
                            <span>CBUM Fitness</span>
                            <span>•</span>
                            <span>Itholate</span>
                            <span>•</span>
                            <span>Thavage</span>
                            <span>•</span>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* 7. FOOTER */}
            <section className="relative z-40 w-full bg-[#000] flex flex-col justify-between p-6 md:p-12 pt-40 pb-20 pointer-events-auto">
                <div className="text-center group">
                    <h2 className="text-[12vw] md:text-[180px] leading-[0.8] font-bold tracking-tighter text-white hover:text-[#ff4d00] transition-colors duration-500 cursor-pointer">
                        Build your<br/>Legacy
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mt-40 text-xs md:text-sm tracking-widest uppercase font-medium">
                    <div className="flex flex-col gap-2 mb-12 md:mb-0">
                        <span className="text-white/50 mb-2">Social</span>
                        <a href="#" className="hover:text-[#ff4d00] flex items-center gap-2"><span>Instagram</span> ↗</a>
                        <a href="#" className="hover:text-[#ff4d00] flex items-center gap-2"><span>YouTube</span> ↗</a>
                        <a href="#" className="hover:text-[#ff4d00] flex items-center gap-2"><span>Raw Nutrition</span> ↗</a>
                    </div>
                    
                    <div className="flex flex-col gap-2 cursor-pointer group pb-4 mb-8 md:mb-0 text-center md:text-left">
                        <span className="text-[#ff4d00] border border-[#ff4d00]/30 rounded-full px-6 py-2 group-hover:bg-[#ff4d00] group-hover:text-black transition-all">
                            copy: legacy@cbum.com
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 text-right">
                        <span className="text-white/50">Chris Bumstead © 2026</span>
                        <a href="#" className="hover:text-white text-white/50">Privacy Policy</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
