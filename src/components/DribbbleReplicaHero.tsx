import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue, AnimatePresence, useMotionValue, useAnimationFrame, useMotionTemplate } from 'framer-motion';
import VideoScrollCanvas from '@/components/VideoScrollCanvas';

/* ═══════════════════════════════════════════════════════════
   BHUVI — 3D Depth Stack + Letter Scramble + Mouse Tilt
   Layers stacked in real CSS 3D z-space, mouse tilts entire stack.
   Phase change triggers per-letter character scramble.
   ═══════════════════════════════════════════════════════════ */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#∆Ω≡∑∞◆▲';
const BASE_LETTERS = ['B', 'H', 'U', 'V', 'I'];

/* ═══════════════════════════════════════════════════════════
   BHUVI LETTER — magnetic + scramble + glow per letter
   ═══════════════════════════════════════════════════════════ */
function BhuviLetter({
    char,
    index,
    gradientStyle,
    maxForce = 30,
    maxDist = 180,
    delayBase = 0.2,
    delayStep = 0.1,
}: {
    char: string;
    index: number;
    gradientStyle?: React.CSSProperties;
    maxForce?: number;
    maxDist?: number;
    delayBase?: number;
    delayStep?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(char);
    const [isClose, setIsClose] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });
    const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
                const force = (1 - dist / maxDist) * maxForce;
                x.set(dx * force / dist);
                y.set(dy * force / dist);
                setIsClose(true);

                // Scramble
                if (!scrambleRef.current) {
                    let count = 0;
                    scrambleRef.current = setInterval(() => {
                        setDisplay(SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
                        count++;
                        if (count > 8) {
                            clearInterval(scrambleRef.current!);
                            scrambleRef.current = null;
                            setDisplay(char);
                        }
                    }, 40);
                }
            } else {
                x.set(0);
                y.set(0);
                setIsClose(false);
                if (scrambleRef.current) {
                    clearInterval(scrambleRef.current);
                    scrambleRef.current = null;
                    setDisplay(char);
                }
            }
        };

        window.addEventListener('mousemove', handleMouse);
        return () => {
            window.removeEventListener('mousemove', handleMouse);
            if (scrambleRef.current) clearInterval(scrambleRef.current);
        };
    }, [char, x, y, maxDist, maxForce]);

    const baseStyle: React.CSSProperties = gradientStyle
        ? {
            ...gradientStyle,
            filter: isClose ? 'drop-shadow(0 0 10px rgba(255,40,0,0.9)) drop-shadow(0 0 20px rgba(255,40,0,0.5))' : undefined,
            transition: 'filter 0.2s',
            display: 'inline-block',
        }
        : {
            color: 'transparent',
            WebkitTextStroke: isClose ? '2px rgba(255,40,0,0.95)' : '1.5px rgba(255,255,255,0.85)',
            filter: isClose
                ? 'drop-shadow(0 0 20px rgba(255,40,0,0.8)) drop-shadow(0 0 40px rgba(255,40,0,0.4))'
                : 'drop-shadow(0 0 12px rgba(255,255,255,0.25))',
            transition: 'color 0.2s, filter 0.2s, -webkit-text-stroke 0.2s',
            display: 'inline-block',
        };

    return (
        <motion.span
            ref={ref}
            style={{ x: springX, y: springY, ...baseStyle }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delayBase + index * delayStep, ease: [0.22, 1, 0.36, 1] }}
        >
            {display}
        </motion.span>
    );
}

function MagneticBhuvi({ activePhase: _ }: { activePhase: number }) {
    const fs = 'clamp(90px, 17vw, 230px)';
    const ls = '-0.02em';

    return (
        <div
            className="absolute bottom-[4%] left-0 right-0 z-[3] flex justify-center items-end select-none pointer-events-none"
        >
            <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Per-letter interactive main text */}
                <div
                    aria-label="BHUVI"
                    className="font-orbitron font-black uppercase leading-none"
                    style={{
                        fontSize: fs,
                        letterSpacing: ls,
                        display: 'block',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                    }}
                >
                    {BASE_LETTERS.map((char, i) => (
                        <BhuviLetter key={i} char={char} index={i} />
                    ))}
                </div>

                {/* Floor reflection */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0, right: 0,
                        transform: 'scaleY(-1)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 55%)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 55%)',
                        pointerEvents: 'none',
                    }}
                >
                    <span
                        className="font-orbitron font-black uppercase leading-none"
                        style={{
                            fontSize: fs,
                            letterSpacing: ls,
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                            display: 'block',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        BHUVI
                    </span>
                </div>
            </div>
        </div>
    );
}



/* ═══════════════════════════════════════════════════════════
   DASHED GRID LINES — Porsche Taycan editorial style
   ═══════════════════════════════════════════════════════════ */
function DashedGrid() {
    return (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
            {[20, 40, 60, 80].map(pct => (
                <div
                    key={pct}
                    className="absolute top-0 bottom-0"
                    style={{
                        left: `${pct}%`,
                        width: '1px',
                        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 6px, transparent 6px, transparent 14px)',
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   CENTERED PILL NAV — Porsche Taycan style
   ═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = ['Home', 'About', 'Projects', 'Contact'];
function PillNav() {
    const [active, setActive] = useState('Home');
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-[20]"
        >
            <div
                className="flex items-center rounded-full px-1 py-1 gap-0.5"
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {NAV_ITEMS.map(item => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setActive(item)}
                        className={`px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase transition-all duration-300 ${active === item
                            ? 'bg-white text-black shadow-md'
                            : 'text-white/60 hover:text-white'
                            }`}
                    >
                        {item}
                    </a>
                ))}
            </div>
        </motion.nav>
    );
}

/* ═══════════════════════════════════════════════════════════
   PHASES DATA — 4 phases synced to scroll
   ═══════════════════════════════════════════════════════════ */
const PHASES = [
    {
        label: 'AI Engineer & Creative Designer',
        line1: 'BEYOND',
        line2: 'ORDINARY.',
        line1Color: 'linear-gradient(180deg, #ffffff 0%, #d0d0d0 40%, #808080 100%)',
        line2Color: 'linear-gradient(180deg, #ff2800 0%, #ff4422 40%, #cc1100 100%)',
        glowColor: 'rgba(255,40,0,0.4)',
        glowBg: 'radial-gradient(ellipse at 30% 50%, rgba(255,40,0,0.15) 0%, transparent 60%)',
        desc: 'I build systems that don\'t just work \u2014 they think.\nAn AI Engineer & Designer pushing the boundary\nbetween intelligence and creative design.',
        stats: [
            { value: '10+', unit: '', label: 'PROJECTS' },
            { value: 'AI', unit: '', label: 'POWERED' },
            { value: 'ML', unit: '', label: 'RESEARCH' },
            { value: '\u221e', unit: '', label: 'VISION' },
        ],
        rightTitle: 'BHUVANESH',
        rightBody: 'Aspiring AI Engineer from Telangana,\nAmrita Vishwa Vidyapeetham, Coimbatore.',
        rightSpecs: [
            { key: 'Role', val: 'AI Engineer & Designer' },
            { key: 'Focus', val: 'Machine Learning · Vision' },
            { key: 'Status', val: 'Open for Projects' },
        ]
    },
    {
        label: 'Machine Learning \u00b7 Deep Learning',
        line1: 'MACHINE',
        line2: 'LEARNING.',
        line1Color: 'linear-gradient(180deg, #ff2800 0%, #ff4422 40%, #cc1100 100%)',
        line2Color: 'linear-gradient(180deg, #ffffff 0%, #d0d0d0 40%, #808080 100%)',
        glowColor: 'rgba(255,40,0,0.35)',
        glowBg: 'radial-gradient(ellipse at 70% 50%, rgba(255,40,0,0.12) 0%, transparent 60%)',
        desc: 'Designing neural architectures that learn and adapt.\nFrom research to deployment \u2014 building models\nthat power the next generation of intelligent systems.',
        stats: [
            { value: 'CNN', unit: '', label: 'ARCHITECT' },
            { value: 'LLM', unit: '', label: 'RESEARCH' },
            { value: 'GPU', unit: '', label: 'TRAINED' },
            { value: '95', unit: '%', label: 'ACCURACY' },
        ],
        rightTitle: 'MACHINE LEARNING',
        rightBody: 'Building intelligent models from the ground up,\ntrained on real-world data end-to-end.',
        rightSpecs: [
            { key: 'Arch', val: 'CNN · Transformer · LSTM' },
            { key: 'Framework', val: 'PyTorch · TensorFlow' },
            { key: 'Specialty', val: 'Deep Learning Research' },
        ]
    },
    {
        label: 'Computer Vision \u00b7 Generative AI',
        line1: 'COMPUTER',
        line2: 'VISION.',
        line1Color: 'linear-gradient(180deg, #ffffff 0%, #d0d0d0 40%, #808080 100%)',
        line2Color: 'linear-gradient(180deg, #ff2800 0%, #ff4422 40%, #cc1100 100%)',
        glowColor: 'rgba(255,40,0,0.5)',
        glowBg: 'radial-gradient(ellipse at 30% 50%, rgba(255,40,0,0.18) 0%, transparent 60%)',
        desc: 'Teaching machines to see the world.\nBuilding real-time perception & generative models \u2014\nwhere pixels become intelligence.',
        stats: [
            { value: 'CV', unit: '', label: 'VISION' },
            { value: 'GAN', unit: '', label: 'GENERATE' },
            { value: 'RT', unit: '', label: 'DETECTION' },
            { value: '4K', unit: '', label: 'RESOLUTION' },
        ],
        rightTitle: 'COMPUTER VISION',
        rightBody: 'Real-time object detection, GAN generation\nand visual intelligence systems.',
        rightSpecs: [
            { key: 'Models', val: 'YOLOv8 · ResNet · ViT' },
            { key: 'Tools', val: 'OpenCV · CUDA' },
            { key: 'Output', val: 'Real-time 4K Detection' },
        ]
    },
    {
        label: 'System Design \u00b7 Full-Stack Dev',
        line1: 'SYSTEM',
        line2: 'DESIGN.',
        line1Color: 'linear-gradient(180deg, #ffffff 0%, #e8e8e8 40%, #aaaaaa 100%)',
        line2Color: 'linear-gradient(180deg, #cccccc 0%, #999999 50%, #555555 100%)',
        glowColor: 'rgba(255,255,255,0.2)',
        glowBg: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        desc: 'Architecting scalable full-stack systems from scratch.\nAmrita Vishwa Vidyapeetham \u00b7 Coimbatore \u2014\nBuilding tomorrow\'s digital infrastructure, today.',
        stats: [
            { value: 'FSD', unit: '', label: 'FULL-STACK' },
            { value: 'API', unit: '', label: 'DESIGN' },
            { value: 'DB', unit: '', label: 'ARCHITECT' },
            { value: '\u221e', unit: '', label: 'SCALABLE' },
        ],
        rightTitle: 'SYSTEM DESIGN',
        rightBody: 'End-to-end full-stack architecture,\nbuilt for scale and production readiness.',
        rightSpecs: [
            { key: 'Stack', val: 'React · Node · PostgreSQL' },
            { key: 'Infra', val: 'REST APIs · Microservices' },
            { key: 'Institute', val: 'Amrita Vishwa Vidyapeetham' },
        ]
    }
];

/* ═══════════════════════════════════════════════════════════
   PROGRESS TRACKER — vertical dots on right side
   ═══════════════════════════════════════════════════════════ */
function ProgressTracker({ active }: { active: number }) {
    return (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[20] flex flex-col gap-3">
            {PHASES.map((_, i) => (
                <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all duration-500"
                    style={{
                        background: i === active ? '#ffffff' : 'rgba(255,255,255,0.15)',
                        boxShadow: i === active ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
                        transform: i === active ? 'scale(1.5)' : 'scale(1)',
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT — DribbbleReplicaHero
   ═══════════════════════════════════════════════════════════ */
export default function DribbbleReplicaHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const [activePhase, setActivePhase] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const el = stickyRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setMousePos({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setMousePos({ x: 0.5, y: 0.5 });
    }, []);

    useEffect(() => {
        const el = stickyRef.current;
        if (!el) return;
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    const slideIndex = useTransform(
        scrollYProgress,
        [0, 0.24, 0.26, 0.49, 0.51, 0.74, 0.76, 1],
        [0, 0, 1, 1, 2, 2, 3, 3]
    );

    useEffect(() => {
        const unsub = slideIndex.on('change', v => setActivePhase(Math.round(v)));
        return unsub;
    }, [slideIndex]);

    // Derived tilt values
    const tiltX = (mousePos.y - 0.5) * -10; // degrees
    const tiltY = (mousePos.x - 0.5) * 10;
    const spotX = mousePos.x * 100;
    const spotY = mousePos.y * 100;

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative w-full"
            style={{ height: '400vh', background: '#050505' }}
        >
            <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden" style={{ cursor: 'none' }}>
                {/* Iron Man Scroll Frame Canvas — PRIMARY BACKGROUND */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0">
                    <VideoScrollCanvas scrollProgress={scrollYProgress} />
                </motion.div>
                {/* Cinematic overlay for text readability */}
                <div className="absolute inset-0 z-[1]" style={{
                    background: 'linear-gradient(135deg, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.5) 70%, rgba(5,5,5,0.8) 100%)'
                }} />

                {/* ══ MOUSE SPOTLIGHT GLOW ══ */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none transition-none"
                    style={{
                        background: `radial-gradient(600px circle at ${spotX}% ${spotY}%, rgba(255,40,0,0.10) 0%, rgba(255,40,0,0.04) 30%, transparent 65%)`,
                    }}
                />

                {/* ══ CUSTOM CURSOR DOT ══ */}
                <div
                    className="absolute w-3 h-3 rounded-full bg-red-500 pointer-events-none z-[100] transition-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${spotX}%`,
                        top: `${spotY}%`,
                        boxShadow: '0 0 12px 4px rgba(255,40,0,0.6)',
                        transition: 'left 0.05s linear, top 0.05s linear',
                    }}
                />
                <div
                    className="absolute w-8 h-8 rounded-full border border-red-500/50 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${spotX}%`,
                        top: `${spotY}%`,
                        transition: 'left 0.12s ease-out, top 0.12s ease-out',
                    }}
                />

                {/* ═══════ BHUVI — Advanced Magnetic Animation ═══════ */}
                <MagneticBhuvi activePhase={activePhase} />

                {/* Dashed grid lines */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}>
                    <DashedGrid />
                </motion.div>

                {/* ═══════ DRAMATIC SPLIT-COLOR HEADLINE — with 3D tilt ═══════ */}
                <div
                    className="absolute inset-0 z-[4] pointer-events-none flex flex-col justify-center px-8 md:px-14"
                    style={{
                        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                        transition: 'transform 0.15s ease-out',
                        transformOrigin: 'center center',
                    }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-x-8 md:inset-x-14 top-1/2 -translate-y-[65%] sm:-translate-y-1/2 flex flex-col justify-center pointer-events-auto"
                        >
                            {/* Top label */}
                            <div className="flex items-center gap-4 mb-6">
                                <motion.div
                                    className="h-[2px]"
                                    style={{ background: PHASES[activePhase].line2Color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                />
                                <span className="text-[10px] md:text-xs font-mono text-white/50 tracking-[0.4em] uppercase">
                                    {PHASES[activePhase].label}
                                </span>
                            </div>

                            {/* Main Headline — Line 1 */}
                            <div className="relative overflow-hidden w-fit">
                                <h1
                                    className="font-orbitron font-black text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] uppercase tracking-tight"
                                    style={{
                                        background: PHASES[activePhase].line1Color,
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.1))',
                                    }}
                                >
                                    {PHASES[activePhase].line1}
                                </h1>
                            </div>

                            {/* Main Headline — Line 2 */}
                            <div className="relative overflow-hidden w-fit">
                                <h1
                                    className="font-orbitron font-black text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] uppercase tracking-tight"
                                    style={{
                                        background: PHASES[activePhase].line2Color,
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        filter: `drop-shadow(0 4px 30px ${PHASES[activePhase].glowColor})`,
                                    }}
                                >
                                    {PHASES[activePhase].line2}
                                </h1>

                                {/* Glow pulse behind text */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none -z-10"
                                    style={{ background: PHASES[activePhase].glowBg }}
                                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>

                            {/* Description */}
                            <p className="text-white/40 text-sm md:text-base font-light max-w-md mt-6 leading-relaxed whitespace-pre-line">
                                {PHASES[activePhase].desc}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex items-center gap-6 mt-10">
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('terminal') || document.getElementById('core-values') || document.querySelector('section:nth-of-type(3)');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group flex items-center gap-3 text-white px-7 py-3.5 rounded-sm font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-80 transition-all duration-300 shadow-[0_0_30px_rgba(255,40,0,0.3)] cursor-pointer"
                                    style={{ background: '#ff2800' }}
                                >
                                    Explore Models
                                    <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('about') || document.querySelector('[id="about"]') || document.querySelector('section:nth-of-type(2)');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="flex items-center gap-3 text-white/50 hover:text-white px-5 py-3.5 font-medium uppercase tracking-[0.2em] text-[11px] transition-all duration-300 border border-white/10 hover:border-white/30 rounded-sm cursor-pointer"
                                >
                                    Our Story
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="flex gap-10 md:gap-16 mt-12 md:mt-16">
                                {PHASES[activePhase].stats.map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex flex-col"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                    >
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-3xl md:text-4xl font-black text-white/90 tracking-tight" style={{ fontFamily: 'system-ui' }}>
                                                {stat.value}
                                            </span>
                                            {stat.unit && (
                                                <span
                                                    className="text-[10px] font-mono uppercase tracking-wider"
                                                    style={{
                                                        background: PHASES[activePhase].line2Color,
                                                        WebkitBackgroundClip: 'text',
                                                        backgroundClip: 'text',
                                                        color: 'transparent'
                                                    }}
                                                >
                                                    {stat.unit}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[8px] font-mono text-white/25 tracking-[0.3em] uppercase mt-1">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* (Scroll canvas moved to z-0 background layer above) */}
                <PillNav />

                {/* Progress Tracker */}
                <ProgressTracker active={activePhase} />

                {/* ═══════ RIGHT SIDE TEXT — changes per phase ═══════ */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`right-${activePhase}`}
                        initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-14 top-1/2 -translate-y-1/2 z-[10] hidden md:flex flex-col gap-5 max-w-[200px] pointer-events-none"
                    >
                        <div>
                            <div className="w-6 h-[1px] bg-white/30 mb-3" />
                            <p className="text-[9px] font-mono text-white/30 tracking-[0.35em] uppercase mb-2">Profile</p>
                            {/* Animated per-letter title — full magnetic effect */}
                            <div
                                className="flex flex-wrap gap-[2px] font-black tracking-wider uppercase"
                                style={{ fontSize: '13px', lineHeight: 1.3, pointerEvents: 'auto' }}
                            >
                                {PHASES[activePhase].rightTitle.split('').map((char, i) =>
                                    char === ' ' ? (
                                        <span key={i} style={{ width: '6px', display: 'inline-block' }} />
                                    ) : (
                                        <BhuviLetter
                                            key={`${activePhase}-right-${i}`}
                                            char={char}
                                            index={i}
                                            maxForce={12}
                                            maxDist={80}
                                            delayBase={0.05}
                                            delayStep={0.04}
                                            gradientStyle={{
                                                background: PHASES[activePhase].line2Color,
                                                WebkitBackgroundClip: 'text',
                                                backgroundClip: 'text',
                                                color: 'transparent',
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>


                        {/* Short bio */}
                        <p className="text-[10px] text-white/35 font-light leading-relaxed whitespace-pre-line">
                            {PHASES[activePhase].rightBody}
                        </p>

                        {/* Spec rows */}
                        <div className="flex flex-col gap-3">
                            {PHASES[activePhase].rightSpecs.map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex flex-col gap-0.5"
                                >
                                    <span className="text-[8px] font-mono text-white/20 tracking-[0.3em] uppercase">{spec.key}</span>
                                    <span className="text-[11px] text-white/60 font-medium">{spec.val}</span>
                                    <div className="w-full h-[1px] bg-white/5 mt-1" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom gradient for readability */}
                <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#050505] to-transparent z-[8] pointer-events-none" />

                {/* HUD corner brackets */}
                <svg className="absolute top-20 left-6 w-5 h-5 z-[10] opacity-20" viewBox="0 0 40 40">
                    <path d="M 0 15 L 0 0 L 15 0" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                <svg className="absolute bottom-6 right-6 w-5 h-5 z-[10] opacity-20" viewBox="0 0 40 40">
                    <path d="M 25 40 L 40 40 L 40 25" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                </svg>

                {/* Scroll down indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">Scroll</span>
                    <div className="w-[1px] h-6 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}

