import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use the local AI-generated videos we just moved into `public/videos`
const GALLERY_VIDEOS = [
    "/videos/A_completely_black_202602252050_o9c54.mp4",
    "/videos/A_photorealistic_continuous_202602221019_hfe.mp4",
    "/videos/Convert_text_to_animation_fceb8f7695.mp4",
    "/videos/VIDEO-2026-02-22-20-51-29.mp4",
    "/videos/VIDEO-2026-03-12-23-26-55.mp4"
];

// ─────────────────────────────────────────────
// Canvas Particle Network Hook
// ─────────────────────────────────────────────
function useParticleNetwork(canvasRef: React.RefObject<HTMLCanvasElement>, mousePos: { x: number; y: number }, isHovered: boolean) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        // Settings
        const particleCount = 60;
        const connectionDistance = 120;
        const interactionDistance = 150;

        // Resize Canvas to match parent fluidly
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                initParticles();
            }
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            baseColor: string;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 1.5 + 0.5;
                // Mostly red, some white to mimic neural synapses
                this.baseColor = Math.random() > 0.8 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 40, 0, 0.8)';
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                // Mouse interaction physics
                if (isHovered) {
                    const dx = mousePos.x - this.x;
                    const dy = mousePos.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < interactionDistance) {
                        const forceDirectionX = dx / dist;
                        const forceDirectionY = dy / dist;
                        const force = (interactionDistance - dist) / interactionDistance;
                        const pushX = forceDirectionX * force * 2;
                        const pushY = forceDirectionY * force * 2;

                        // Push particles away subtly
                        this.x -= pushX;
                        this.y -= pushY;
                    }
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections between particles
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update(canvas.width, canvas.height);
                p1.draw(ctx);

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const opacity = 1 - (dist / connectionDistance);
                        // Reddish neural connection
                        ctx.strokeStyle = `rgba(255, 40, 0, ${opacity * 0.4})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Draw connection to mouse
                if (isHovered) {
                    const dx = p1.x - mousePos.x;
                    const dy = p1.y - mousePos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < interactionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mousePos.x, mousePos.y);
                        const opacity = 1 - (dist / interactionDistance);
                        // Brighter red for interactions
                        ctx.strokeStyle = `rgba(255, 40, 0, ${opacity * 0.8})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mousePos, isHovered]);
}

export default function VisionMatrixGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Init the particle network over the component
    useParticleNetwork(canvasRef, mousePos, isHovered);

    const randomizeMedia = () => {
        let nextIndex;
        // Make sure we never pick the exact same video twice in a row
        do {
            nextIndex = Math.floor(Math.random() * GALLERY_VIDEOS.length);
        } while (nextIndex === currentIndex);

        setCurrentIndex(nextIndex);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsHovered(true);
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-24 px-8 flex flex-col items-center justify-center border-t border-white/20 mt-12 md:mt-0">

            <div className="text-center mb-16 space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm tracking-[0.3em] text-red-600 font-bold uppercase"
                >
                    Visual Cortex
                </motion.h2>
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter"
                >
                    The Neural Matrix
                </motion.h3>
            </div>

            {/* Interactive Image Frame */}
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsHovered(false)}
                onClick={randomizeMedia}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative w-full max-w-5xl aspect-square md:aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-[0_0_80px_rgba(255,40,0,0.15)] border border-white/10"
            >
                {/* Dynamic Mouse Tracking Hover Border */}
                <motion.div
                    className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: isHovered
                            ? `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 40, 0, 0.15), transparent 40%)`
                            : 'transparent'
                    }}
                />

                {/* Background base */}
                <div className="absolute inset-0 bg-black z-0" />

                {/* Video Media Background (replaces Images) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, filter: "brightness(2) contrast(1.5) blur(10px) hue-rotate(-90deg)" }}
                        animate={{ opacity: 1, filter: "brightness(1) contrast(1) blur(0px) hue-rotate(0deg)" }}
                        exit={{ opacity: 0, filter: "brightness(0.5) blur(10px)" }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="absolute inset-0 w-full h-full z-10"
                    >
                        {/* We use video now instead of img */}
                        <video
                            src={GALLERY_VIDEOS[currentIndex]}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-105 opacity-60 mix-blend-screen transition-all duration-[1s]"
                            draggable={false}
                        />

                        {/* Scanline CRT overlay to make it look like tech */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay pointer-events-none" />
                    </motion.div>
                </AnimatePresence>

                {/* New Neural Network Canvas Layer */}
                <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none mix-blend-screen"
                />

                {/* UI Overlay Indicators */}
                <div className="absolute bottom-6 left-6 z-40 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(255,40,0,1)] animate-pulse" />
                    <span className="text-white font-mono text-xs tracking-[0.2em] uppercase">
                        Sequence {currentIndex + 1}/{GALLERY_VIDEOS.length}
                    </span>
                </div>

                <div className="absolute top-6 right-6 z-40 bg-red-600/20 backdrop-blur-md border border-red-600/30 px-3 py-1 rounded text-[#ff2800] font-mono text-[10px] uppercase tracking-widest">
                    Live Data
                </div>

                {/* Click Instruction Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px] transition-all duration-300"
                >
                    <span className="bg-red-600/90 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transform scale-95 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_40px_rgba(255,40,0,0.6)]">
                        Intercept Data Stream
                    </span>
                </motion.div>
            </motion.div>

        </section>
    );
}
