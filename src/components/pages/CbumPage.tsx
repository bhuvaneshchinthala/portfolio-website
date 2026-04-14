import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    motion, useScroll, useTransform, useMotionValue,
    useSpring, useVelocity, AnimatePresence
} from 'framer-motion';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// CBUM — FULL MOUSE ANIMATION + NIVORA SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── Hooks ─────────────────────────────────────────────────────────────────
function useGlobalMouse() {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const normX = useMotionValue(0);
    const normY = useMotionValue(0);
    useEffect(() => {
        const fn = (e: MouseEvent) => {
            rawX.set(e.clientX); rawY.set(e.clientY);
            normX.set((e.clientX / window.innerWidth - 0.5) * 2);
            normY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener('mousemove', fn);
        return () => window.removeEventListener('mousemove', fn);
    }, [rawX, rawY, normX, normY]);
    return { rawX, rawY, normX, normY };
}

function useMagnetic(strength = 0.4) {
    const ref = useRef<HTMLElement>(null);
    const x = useSpring(0, { stiffness: 200, damping: 20 });
    const y = useSpring(0, { stiffness: 200, damping: 20 });
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    }, [strength, x, y]);
    const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        el.addEventListener('mousemove', handleMouseMove as EventListener);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove as EventListener); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, [handleMouseMove, handleMouseLeave]);
    return { ref, style: { x, y } };
}

function useTilt(maxDeg = 12) {
    const rotX = useSpring(0, { stiffness: 150, damping: 20 });
    const rotY = useSpring(0, { stiffness: 150, damping: 20 });
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        rotX.set(-((e.clientY - rect.top) / rect.height - 0.5) * maxDeg);
        rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * maxDeg);
    };
    const handleLeave = () => { rotX.set(0); rotY.set(0); };
    return { rotX, rotY, handleMove, handleLeave };
}

// ── Scramble ──────────────────────────────────────────────────────────────
const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@∆Ω∑∞◆!?%&';
function CubeTextFace({ text, isOutline = false }: { text: string; isOutline?: boolean }) {
    const [d, setD] = useState(text);
    useEffect(() => { const iv = setInterval(() => { setD(text.split('').map(c => Math.random() > 0.82 ? SC[Math.floor(Math.random() * SC.length)] : c).join('')); }, 80); return () => clearInterval(iv); }, [text]);
    return (
        <div className="w-full h-full flex items-center justify-center">
            <span className={`text-center text-[13px] md:text-[17px] font-black tracking-widest uppercase break-words px-3 w-[80%] leading-tight ${isOutline ? 'text-transparent' : 'text-white'}`}
                style={isOutline ? { WebkitTextStroke: '1px rgba(255,40,0,0.9)' } : {}}>{d}</span>
        </div>
    );
}

// ── NIVORA-STYLE: Flowing Text Reveal + Image Grid ────────────────────────
function TextRevealSection({ setCursorState }: { setCursorState: (s: string) => void }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 30%"] });

    const text = "I'm Bhuvanesh, and Chris Bumstead is my biggest motivation. His journey through classic physique — overcoming every challenge to forge the ultimate aesthetic legacy — inspires me every single day. He doesn't just compete. He redefines the standard of perfection.";
    const words = text.split(" ");

    const SHOWCASE_IMAGES = [
        { src: 'https://m.gettywallpapers.com/wp-content/uploads/2023/10/Cool-Cbum-icon.jpg', title: 'CHAMPION', cat: 'Inspiration' },
        { src: 'https://wallpaperbat.com/img/1432837-chris-bumstead-printable-photo.jpg', title: 'WORK ETHIC', cat: 'Motivation' },
        { src: 'https://m.media-amazon.com/images/I/41tzKqvhYYL.jpg', title: 'NEVER QUIT', cat: 'Mindset' },
        { src: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', title: 'DISCIPLINE', cat: 'Philosophy' },
    ];

    return (
        <section ref={sectionRef} className="relative z-20 w-full bg-[#050505] py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 items-start">
                {/* LEFT: Text with word-by-word reveal */}
                <div className="w-full md:w-[55%]">
                    <p className="text-[7vw] md:text-[2.6vw] font-medium leading-[1.35] tracking-tight flex flex-wrap gap-x-[0.35em]">
                        {words.map((word, i) => {
                            const start = i / words.length;
                            const end = start + 1 / words.length;
                            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
                            return (
                                <motion.span key={i} style={{ opacity }} className="text-white inline-block py-1">
                                    {word}
                                </motion.span>
                            );
                        })}
                    </p>
                </div>

                {/* RIGHT: 2x2 Image Grid */}
                <div className="w-full md:w-[45%] grid grid-cols-2 gap-4">
                    {SHOWCASE_IMAGES.map((img, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                            className="group cursor-none overflow-hidden"
                            onMouseEnter={() => setCursorState('view')}
                            onMouseLeave={() => setCursorState('default')}>
                            <div className="aspect-[4/5] overflow-hidden relative rounded-sm">
                                <img src={img.src} alt={img.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-[#ff2800]/0 group-hover:bg-[#ff2800]/10 mix-blend-overlay transition-colors duration-700 pointer-events-none" />
                            </div>
                            <div className="mt-3 flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-white">{img.title}</span>
                                <span className="text-white/40">{img.cat}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── NIVORA-STYLE: Hover-Based Project Showcase ────────────────────────────
function ProjectShowcase({ setCursorState }: { setCursorState: (s: string) => void }) {
    const SHOWCASE = [
        { name: 'DISCIPLINE', category: 'What He Taught Me', img: 'https://m.gettywallpapers.com/wp-content/uploads/2023/10/Cool-Cbum-icon.jpg' },
        { name: 'CONSISTENCY', category: 'Show Up Every Day', img: 'https://wallpaperbat.com/img/1432837-chris-bumstead-printable-photo.jpg' },
        { name: 'NO EXCUSES', category: 'Zero Compromise Mindset', img: 'https://m.media-amazon.com/images/I/41tzKqvhYYL.jpg' },
        { name: 'WORK ETHIC', category: 'Outwork Everyone', img: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { name: 'LEGACY', category: 'Build Something Greater', img: 'https://img.republicworld.com/all_images/chris-bumstead-or-cbum-is-a-canadian-professional-bodybuilder-1728831196980-16_9.webp?w=1280&h=720&q=75&format=webp' },
    ];

    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <section className="relative z-20 w-full bg-[#050505] py-24 px-6 md:px-12 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto">
                <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-10">Lessons He Inspires In Me</p>
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* LEFT: Project List */}
                    <div className="w-full md:w-[55%] flex flex-col">
                        {SHOWCASE.map((proj, i) => (
                            <motion.div key={i}
                                onMouseEnter={() => { setActiveIdx(i); setCursorState('link'); }}
                                onMouseLeave={() => setCursorState('default')}
                                animate={{ opacity: i === activeIdx ? 1 : 0.25, x: i === activeIdx ? 0 : -8 }}
                                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                className="py-5 border-b border-white/10 cursor-none">
                                <h3 className={`text-2xl md:text-5xl font-black tracking-tighter uppercase transition-colors duration-400 ${i === activeIdx ? 'text-white' : 'text-white/20'}`}>
                                    {proj.name}
                                </h3>
                                <motion.p animate={{ opacity: i === activeIdx ? 1 : 0, height: i === activeIdx ? 'auto' : 0 }}
                                    className="text-[10px] font-mono tracking-[0.3em] text-[#ff2800] uppercase mt-2 overflow-hidden">
                                    {proj.category}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT: Preview Image */}
                    <div className="w-full md:w-[45%] aspect-[4/5] relative overflow-hidden rounded-sm"
                        onMouseEnter={() => setCursorState('view')}
                        onMouseLeave={() => setCursorState('default')}>
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeIdx}
                                src={SHOWCASE[activeIdx].img}
                                alt={SHOWCASE[activeIdx].name}
                                initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Bento Spotlight Card ──────────────────────────────────────────────────
function SpotlightCard({ item, index }: { item: typeof BENTO_ITEMS[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const spotX = useMotionValue(0);
    const spotY = useMotionValue(0);
    const { rotX, rotY, handleMove, handleLeave: tiltLeave } = useTilt(8);
    const [showSpot, setShowSpot] = useState(false);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        handleMove(e); if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        spotX.set(e.clientX - rect.left); spotY.set(e.clientY - rect.top);
    };
    return (
        <motion.div ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ delay: index * 0.1, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowSpot(true)}
            onMouseLeave={() => { tiltLeave(); setShowSpot(false); }}
            className={`relative ${item.size} border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 flex flex-col justify-between overflow-hidden group cursor-none rounded-sm`}>
            {showSpot && <motion.div className="absolute inset-0 pointer-events-none rounded-sm z-0" style={{ background: `radial-gradient(200px circle at ${spotX.get()}px ${spotY.get()}px, ${item.accent}22, transparent 70%)` }} />}
            <div className="absolute top-0 left-0 w-0 h-px group-hover:w-full transition-all duration-700 ease-out pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }} />
            <div className="relative z-10">
                <span className="text-[9px] font-mono tracking-[0.3em] text-white/30 uppercase block mb-3">{item.sub}</span>
                <span className="text-4xl md:text-6xl font-black leading-none tracking-tighter block" style={{ color: item.accent }}>{item.title}</span>
            </div>
            <p className="relative z-10 text-white/40 text-xs font-medium leading-relaxed tracking-wide">{item.desc}</p>
        </motion.div>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────
const BENTO_ITEMS = [
    { title: '5×', sub: 'Olympia Titles', desc: 'His 5 consecutive wins prove that consistency beats everything', size: 'md:col-span-1 md:row-span-2', accent: '#ff2800' },
    { title: '100%', sub: 'Dedication', desc: 'He taught me that half-effort gets zero results — always go all in', size: 'md:col-span-2', accent: '#ffffff' },
    { title: 'DAY 1', sub: 'Mentality', desc: 'His hunger stays the same whether it\'s day 1 or day 1000', size: 'md:col-span-1', accent: '#ff2800' },
    { title: 'GRIND', sub: 'Daily Ritual', desc: 'He proves that greatness is built in the hours nobody sees', size: 'md:col-span-1', accent: '#ffffff' },
    { title: 'GOAT', sub: 'My GOAT', desc: 'The greatest classic physique athlete — my ultimate inspiration', size: 'md:col-span-2', accent: '#ff2800' },
    { title: 'ICON', sub: 'Role Model', desc: 'Proof that you can build an empire while staying authentic', size: 'md:col-span-1', accent: '#ffffff' },
];

const GALLERY_IMAGES = [
    { src: 'https://m.gettywallpapers.com/wp-content/uploads/2023/10/Cool-Cbum-icon.jpg', alt: 'The GOAT', aspect: 'aspect-[3/4]', width: 'w-[38%]', x: '2%', right: undefined, y: '0px' },
    { src: 'https://wallpaperbat.com/img/1432837-chris-bumstead-printable-photo.jpg', alt: 'Pure Focus', aspect: 'aspect-[4/5]', width: 'w-[28%]', x: 'auto', right: '2%', y: '200px' },
    { src: 'https://img.republicworld.com/all_images/chris-bumstead-or-cbum-is-a-canadian-professional-bodybuilder-1728831196980-16_9.webp?w=1280&h=720&q=75&format=webp', alt: 'Champion', aspect: 'aspect-[16/9]', width: 'w-[52%]', x: '8%', right: undefined, y: '320px' },
    { src: 'https://m.media-amazon.com/images/I/41tzKqvhYYL.jpg', alt: 'Aesthetic King', aspect: 'aspect-[2/3]', width: 'w-[33%]', x: 'auto', right: '12%', y: '700px' },
    { src: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', alt: 'Relentless', aspect: 'aspect-square', width: 'w-[42%]', x: '18%', right: undefined, y: '1050px' },
];

function MagBtn({ to, children, orange = false }: { to: string; children: React.ReactNode; orange?: boolean }) {
    const { ref, style } = useMagnetic(0.5);
    return (
        <motion.div ref={ref as any} style={style}>
            <Link to={to} className={`block text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 cursor-none border ${orange ? 'bg-[#ff2800] border-[#ff2800] text-white hover:bg-white hover:text-black hover:border-white' : 'bg-transparent border-white/30 text-white hover:bg-white hover:text-black'}`}>
                {children}
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CbumPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY, scrollYProgress } = useScroll({ target: containerRef });

    // Kinetic Background
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const dynamicSkew = useTransform(smoothVelocity, [-1500, 1500], [-20, 20]);
    const topX = useTransform(scrollYProgress, [0, 1], ['5%', '-40%']);
    const midX = useTransform(scrollYProgress, [0, 1], ['-25%', '10%']);
    const botX = useTransform(scrollYProgress, [0, 1], ['12%', '-55%']);

    // Hero
    const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -200]);
    const cubeRotX = useSpring(useTransform(scrollYProgress, [0.15, 0.4], [-10, -55]), { stiffness: 60, damping: 25 });
    const cubeRotY = useSpring(useTransform(scrollYProgress, [0.15, 0.4], [40, 145]), { stiffness: 60, damping: 25 });

    // Mouse
    const { rawX, rawY, normX, normY } = useGlobalMouse();
    const [cursorState, setCursorState] = useState<'default' | 'view' | 'drag' | 'link'>('default');
    const cursorX = useSpring(rawX, { stiffness: 150, damping: 22, mass: 0.5 });
    const cursorY = useSpring(rawY, { stiffness: 150, damping: 22, mass: 0.5 });
    const heroParX = useSpring(useTransform(normX, [-1, 1], [-40, 40]), { stiffness: 60, damping: 20 });
    const heroParY = useSpring(useTransform(normY, [-1, 1], [-20, 20]), { stiffness: 60, damping: 20 });
    const cubeMouseX = useSpring(useTransform(normX, [-1, 1], [-25, 25]), { stiffness: 80, damping: 20 });
    const cubeMouseY = useSpring(useTransform(normY, [-1, 1], [15, -15]), { stiffness: 80, damping: 20 });

    const cursorSize = cursorState === 'view' ? 110 : cursorState === 'drag' ? 80 : cursorState === 'link' ? 50 : 8;
    const cursorColor = cursorState === 'view' ? 'rgba(255,40,0,0.8)' : cursorState === 'drag' ? 'rgba(255,255,255,0.15)' : cursorState === 'link' ? 'rgba(255,40,0,0.5)' : '#ff2800';
    const cursorLabel = cursorState === 'view' ? 'VIEW' : cursorState === 'drag' ? 'DRAG' : cursorState === 'link' ? '↗' : null;

    return (
        <div ref={containerRef} className="bg-[#050505] text-white font-sans cursor-none selection:bg-[#ff2800] selection:text-black overflow-x-hidden">

            {/* CURSOR */}
            <motion.div className="fixed top-0 left-0 pointer-events-none rounded-full z-[9999] flex items-center justify-center border"
                animate={{ width: cursorSize, height: cursorSize, backgroundColor: cursorColor, borderColor: cursorState === 'drag' ? 'rgba(255,255,255,0.3)' : 'transparent' }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', mixBlendMode: (cursorState === 'default' || cursorState === 'link') ? 'difference' : 'normal' }}>
                <AnimatePresence>
                    {cursorLabel && <motion.span initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.4 }} className="text-white text-[10px] font-black tracking-[0.25em] uppercase select-none">{cursorLabel}</motion.span>}
                </AnimatePresence>
            </motion.div>

            {/* KINETIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0 flex flex-col justify-center overflow-hidden opacity-[0.035]" aria-hidden>
                <motion.p style={{ x: topX, skewX: dynamicSkew }} className="text-[22vw] font-black uppercase whitespace-nowrap leading-[0.82] tracking-tighter text-white select-none">MY INSPIRATION MY MOTIVATION MY ICON MY GOAT</motion.p>
                <motion.p style={{ x: midX, skewX: dynamicSkew, WebkitTextStroke: '2px rgba(255,40,0,0.9)' }} className="text-[22vw] font-black uppercase whitespace-nowrap leading-[0.82] tracking-tighter text-transparent select-none">CBUM CHRIS BUMSTEAD CBUM CHRIS BUMSTEAD CBUM</motion.p>
                <motion.p style={{ x: botX, skewX: dynamicSkew }} className="text-[22vw] font-black uppercase whitespace-nowrap leading-[0.82] tracking-tighter text-white select-none">MY INSPIRATION MY MOTIVATION MY ICON MY GOAT</motion.p>
            </div>

            {/* NAV */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 flex justify-between items-start pointer-events-none">
                <div className="flex gap-2 pointer-events-auto" onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}>
                    <MagBtn to="/">Home</MagBtn>
                    <MagBtn to="/" orange>Let's Talk</MagBtn>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} className="w-20 h-20 pointer-events-none opacity-80">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path id="cp2" d="M50,50m-37,0a37,37,0,1,1,74,0,a37,37,0,1,1,-74,0" fill="transparent" />
                        <text><textPath href="#cp2" className="fill-white" fontSize="11" fontWeight="bold" letterSpacing="3">BHUVANESH • CBUM • </textPath></text>
                    </svg>
                </motion.div>
            </nav>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1. HERO */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative w-full h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
                <motion.div className="absolute inset-0 pointer-events-none z-0" style={{
                    background: useTransform([normX, normY], ([x, y]) => `radial-gradient(600px circle at ${(+x * 0.5 + 0.5) * 100}% ${(+y * 0.5 + 0.5) * 100}%, rgba(255,40,0,0.08), transparent 70%)`)
                }} />
                <motion.h1 style={{ y: heroY, x: heroParX, WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}
                    className="absolute text-[28vw] leading-none font-black tracking-tighter text-transparent select-none whitespace-nowrap z-0 opacity-15">CBUM</motion.h1>

                <motion.div style={{ x: useSpring(useTransform(normX, [-1, 1], [-80, 80]), { stiffness: 40, damping: 15 }), y: useSpring(useTransform(normY, [-1, 1], [-50, 50]), { stiffness: 40, damping: 15 }) }}
                    className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-[#ff2800] opacity-60 pointer-events-none" />
                <motion.div style={{ x: useSpring(useTransform(normX, [-1, 1], [60, -60]), { stiffness: 30, damping: 12 }), y: useSpring(useTransform(normY, [-1, 1], [-40, 40]), { stiffness: 30, damping: 12 }) }}
                    className="absolute bottom-[20%] right-[12%] w-3 h-3 rounded-full border border-white/30 pointer-events-none" />

                <motion.div style={{ y: heroParY }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    className="z-20 flex flex-col items-center text-center gap-5">
                    <span className="text-[10px] font-mono tracking-[0.4em] text-[#ff2800] uppercase">Bhuvanesh's Biggest Motivation & Inspiration</span>
                    <h2 className="text-[6vw] md:text-[4.5vw] font-black tracking-tighter uppercase leading-[0.9]">
                        Chris<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)' }}>Bumstead</span>
                    </h2>
                    <p className="text-white/40 text-sm font-medium tracking-[0.15em] uppercase">The Man Who Inspires My Grind · Every Single Day</p>
                    <div className="mt-6 flex gap-3">
                        {['His Legacy', 'His Story'].map((label, i) => {
                            const mag = useMagnetic(0.45);
                            return (
                                <motion.button key={label} ref={mag.ref as any} style={mag.style} whileTap={{ scale: 0.95 }}
                                    onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}
                                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.25em] rounded-full transition-all duration-300 cursor-none ${i === 0 ? 'bg-[#ff2800] text-white hover:bg-white hover:text-black' : 'border border-white/20 text-white hover:bg-white/10'}`}>
                                    {label}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-12 bg-gradient-to-b from-[#ff2800] to-transparent" />
                    <span className="text-[8px] font-mono tracking-[0.3em] text-white/30 uppercase">Scroll</span>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2. TICKER */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 w-full border-y border-white/10 py-6 overflow-hidden bg-[#0a0a0a]">
                <motion.div animate={{ x: [0, -2400] }} transition={{ repeat: Infinity, ease: 'linear', duration: 18 }} className="flex gap-20 whitespace-nowrap items-center">
                    {[...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            {['My Biggest Inspiration', 'Discipline Over Motivation', 'No Days Off', 'Classic Physique GOAT', 'Zero Excuses Culture'].map((t, j) => (
                                <React.Fragment key={j}>
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70">{t}</span>
                                    <span className="text-[#ff2800] text-lg">◆</span>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 3. NIVORA: STICKY TEXT REVEAL + SCROLLING IMAGE GALLERY */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <TextRevealSection setCursorState={setCursorState as any} />

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 4. 3D CUBE + PARALLAX OFFSET SIDEBAR */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative z-20 w-full bg-[#050505] py-24 px-6 md:px-12 flex flex-col md:flex-row items-start gap-12 min-h-screen border-t border-white/10"
                onMouseEnter={() => setCursorState('drag')} onMouseLeave={() => setCursorState('default')}>
                {/* Parallax Offset Sidebar — Nivora Process-style staggered cards */}
                <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
                    {[
                        { label: 'His Olympia Wins', value: '5 Titles', detail: '2019 · 2020 · 2021 · 2022 · 2023', offset: 0 },
                        { label: 'What He Taught Me', value: 'Discipline', detail: 'Zero Excuses · Total Accountability', offset: 60 },
                        { label: 'My Takeaway', value: 'Never Stop', detail: 'Keep Grinding · Build Your Legacy', offset: 120 },
                    ].map((item, i) => {
                        const { rotX, rotY, handleMove, handleLeave } = useTilt(10);
                        return (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 80 + item.offset }}
                                whileInView={{ opacity: 1, y: item.offset / 3 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                                style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', transformPerspective: 600 }}
                                onMouseMove={handleMove} onMouseLeave={handleLeave}
                                onMouseEnter={() => setCursorState('default')}
                                className="p-5 border border-white/10 bg-white/[0.03] rounded-sm hover:border-[#ff2800]/40 transition-colors duration-400 group cursor-none">
                                <span className="text-white/40 block mb-1 text-[10px] tracking-widest uppercase">{item.label}</span>
                                <span className="text-2xl font-black text-[#ff2800] block mb-1">{item.value}</span>
                                <span className="text-white/30 text-[9px] font-mono">{item.detail}</span>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-10">
                    <p className="text-[10px] font-mono tracking-[0.35em] text-white/20 uppercase">Move mouse + scroll to rotate</p>
                    <div style={{ perspective: 1400 }} className="w-[280px] h-[280px] md:w-[380px] md:h-[380px]">
                        <motion.div style={{
                            rotateX: useTransform([cubeRotX, cubeMouseY], ([s, m]) => +s + +m),
                            rotateY: useTransform([cubeRotY, cubeMouseX], ([s, m]) => +s + +m),
                            transformStyle: 'preserve-3d'
                        }} className="w-full h-full relative">
                            {[
                                { t: 'translateZ(190px)', text: 'MY BIGGEST INSPIRATION', ol: false },
                                { t: 'rotateY(90deg) translateZ(190px)', text: 'CBUM IS MY MOTIVATION', ol: true },
                                { t: 'rotateY(-90deg) translateZ(190px)', text: 'DISCIPLINE OVER EXCUSES', ol: false },
                                { t: 'rotateX(90deg) translateZ(190px)', text: 'NEVER STOP GRINDING', ol: true },
                                { t: 'rotateX(-90deg) translateZ(190px)', text: 'BE THE HARDEST WORKER', ol: false },
                                { t: 'rotateY(180deg) translateZ(190px)', text: 'CHRIS BUMSTEAD', ol: true },
                            ].map((face, i) => (
                                <div key={i} style={{ transform: face.t }}
                                    className="absolute inset-0 border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-lg flex items-center justify-center">
                                    <CubeTextFace text={face.text} isOutline={face.ol} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 5. BENTO GRID — Staggered Fade-Up Entry (Nivora-style) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative z-20 w-full bg-[#050505] py-24 px-6 md:px-12 border-t border-white/10">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mb-16 flex items-end justify-between">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        Why He<br /><span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,40,0,0.8)' }}>Inspires</span>
                    </h2>
                    <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase mb-2">What I Learned</span>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                    {BENTO_ITEMS.map((item, i) => <SpotlightCard key={i} item={item} index={i} />)}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 6. NIVORA: INTERACTIVE PROJECT SHOWCASE (Sticky List + Swap) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <ProjectShowcase setCursorState={setCursorState as any} />

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 7. AESTHETICS LEGACY — Parallax Image Matrix */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative z-20 w-full py-24 border-t border-white/10 bg-[#050505]">
                <div className="px-6 md:px-12 mb-20 flex items-end justify-between">
                    <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        My<br /><span className="font-bold italic text-[#ff2800]">Inspiration</span>
                    </motion.h2>
                    <span className="text-[10px] font-mono tracking-[0.3em] mb-2 text-white/30 uppercase">Gallery</span>
                </div>
                <div className="relative w-full h-[1400px] max-w-[1400px] mx-auto px-6 md:px-12">
                    {GALLERY_IMAGES.map((proj, i) => {
                        const yOff = useTransform(scrollYProgress, [0.6, 1], [0, -200 * (i + 1)]);
                        return (
                            <motion.div key={i} style={{ y: yOff, left: proj.x, right: proj.right ?? 'auto', top: proj.y }}
                                className={`absolute ${proj.width} group cursor-none overflow-hidden`}
                                onMouseEnter={() => setCursorState('view')} onMouseLeave={() => setCursorState('default')}>
                                <div className={`w-full ${proj.aspect} overflow-hidden relative`}>
                                    <motion.img src={proj.src} alt={proj.alt} whileHover={{ scale: 1.08 }}
                                        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-[#ff2800]/0 group-hover:bg-[#ff2800]/10 mix-blend-overlay transition-colors duration-700 pointer-events-none" />
                                </div>
                                <div className="mt-3 flex justify-between text-[9px] font-black tracking-widest uppercase border-t border-white/10 pt-2">
                                    <span>{proj.alt}</span>
                                    <span className="text-[#ff2800]">Inspiration</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 8. BRAND MARQUEE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 w-full bg-[#ff2800] py-6 overflow-hidden border-y-4 border-black">
                <motion.div animate={{ x: [0, -2200] }} transition={{ repeat: Infinity, ease: 'linear', duration: 14 }}
                    className="flex gap-16 whitespace-nowrap items-center shrink-0">
                    {[...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            {['My Motivation', 'Never Give Up', 'Stay Hungry', 'Outwork Everyone', 'No Excuses', 'Be Legendary'].map((b, j) => (
                                <React.Fragment key={j}>
                                    <span className="text-black text-xl md:text-3xl font-black uppercase tracking-tighter">{b}</span>
                                    <span className="text-black text-2xl">★</span>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 9. FOOTER */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative z-20 w-full min-h-[80vh] bg-[#000] flex flex-col justify-between px-6 md:px-12 py-20 border-t border-white/10"
                onMouseEnter={() => setCursorState('default')}>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="group cursor-none" onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}>
                    <h2 className="text-[13vw] font-black tracking-tighter uppercase leading-[0.82] group-hover:text-[#ff2800] transition-colors duration-500 cursor-none">
                        Stay<br />Inspired
                    </h2>
                </motion.div>
                <div className="flex flex-col md:flex-row justify-between items-end pt-20 text-[10px] font-bold tracking-widest uppercase gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-white/30 mb-2">Follow</span>
                        {['CBUM Instagram ↗', 'CBUM YouTube ↗', 'Raw Nutrition ↗'].map(l => {
                            const mag = useMagnetic(0.5);
                            return <motion.a key={l} href="#" ref={mag.ref as any} style={mag.style}
                                onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}
                                className="hover:text-[#ff2800] transition-colors cursor-none w-fit">{l}</motion.a>;
                        })}
                    </div>
                    {(() => {
                        const mag = useMagnetic(0.6);
                        return <motion.span ref={mag.ref as any} style={mag.style}
                            onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}
                            className="px-8 py-4 border border-[#ff2800]/40 text-[#ff2800] rounded-full hover:bg-[#ff2800] hover:text-black transition-all duration-300 cursor-none">
                            Follow CBUM ↗
                        </motion.span>;
                    })()}
                    <div className="flex flex-col gap-2 text-right text-white/30">
                        <span>Bhuvanesh × CBUM © 2026</span>
                        <a href="#" onMouseEnter={() => setCursorState('link')} onMouseLeave={() => setCursorState('default')}
                            className="hover:text-white cursor-none transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
