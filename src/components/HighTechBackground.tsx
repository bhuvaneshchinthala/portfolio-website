import { motion, useTransform, type MotionValue } from 'framer-motion';

interface HighTechBackgroundProps {
    scrollProgress: MotionValue<number>;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

export default function HighTechBackground({ scrollProgress, mouseX, mouseY }: HighTechBackgroundProps) {
    // Parallax depth for the entire background container
    const yParallax = useTransform(scrollProgress, [0, 1], ['0%', '25%']);
    const bgOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0]);

    // Reactive mouse shifts
    const xShift = useTransform(mouseX, [0, 1], ['-2%', '2%']);
    const yShift = useTransform(mouseY, [0, 1], ['-2%', '2%']);

    return (
        <motion.div
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]"
            style={{ opacity: bgOpacity, y: yParallax }}
        >
            {/* ── Base Dark Gradient ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0000] via-[#020202] to-[#040404]" />

            {/* ── Original Studio Background Image ── */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] mix-blend-luminosity will-change-transform scale-105"
                style={{
                    backgroundImage: 'url("/images/studio-bg.png")',
                    x: xShift,
                }}
            />
            {/* Dark overlay to deepen the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] opacity-80" />

            {/* ── Digital Wind Tunnel / Speed Lines ── */}
            <motion.div
                className="absolute inset-0 opacity-60 mix-blend-screen perspective-[1000px]"
                style={{ x: xShift, y: yShift }}
            >
                {/* Horizontal high-speed streaks */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                        key={`h-streak-${i}`}
                        className="absolute h-[1px] rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `-20%`,
                            width: `${Math.random() * 40 + 10}%`,
                            background: `linear-gradient(90deg, transparent, ${Math.random() > 0.8 ? 'rgba(255, 40, 0, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                                }, transparent)`,
                            filter: 'blur(1px)'
                        }}
                        animate={{
                            x: ['-50vw', '150vw'],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </motion.div>

            {/* ── Massive Glowing Eclipse/Halo behind the car ── */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full border border-[#ff2800]/10 mix-blend-screen"
                style={{
                    boxShadow: 'inset 0 0 100px rgba(255,40,0,0.05), 0 0 150px rgba(255,40,0,0.1)',
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {/* Inner glowing ring */}
                <div className="absolute inset-4 rounded-full border border-white/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%]" />
            </motion.div>

            {/* ── Volumetric Light Core (Red/Graphite) ── */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[60vw] rounded-full mix-blend-screen"
                style={{
                    background: 'radial-gradient(ellipse, rgba(255, 40, 0, 0.12) 0%, rgba(20, 20, 25, 0.05) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    x: xShift,
                }}
                animate={{ scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* ── Geometric Tech Grid (Floor) ── */}
            <motion.div
                className="absolute bottom-0 inset-x-0 h-[40vh]"
                style={{
                    backgroundSize: '40px 40px',
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,40,0,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,40,0,0.03) 1px, transparent 1px)
                    `,
                    transform: 'perspective(500px) rotateX(75deg) scale(2) translateY(50%)',
                    transformOrigin: 'bottom'
                }}
            >
                {/* Floor fade out */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#020202]/80 to-[#020202]" />
            </motion.div>

            {/* ── Scanning Radar / HUD Lines ── */}
            <motion.div
                className="absolute w-[2px] h-[200vh] bg-gradient-to-b from-transparent via-[#ff2800]/30 to-transparent blur-[1px] mix-blend-screen"
                animate={{
                    left: ['-10%', '110%']
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* ── Grounding Shadow / Fog for the Car ── */}
            <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-[#010101] via-[#020202]/80 to-transparent blur-xl z-10" />

            {/* ── Film grain overlay for cinematic texture ── */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-20 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px 128px',
                }}
            />
        </motion.div>
    );
}
