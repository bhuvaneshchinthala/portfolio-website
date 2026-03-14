import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const images = [
    "https://img.republicworld.com/all_images/chris-bumstead-or-cbum-is-a-canadian-professional-bodybuilder-1728831196980-16_9.webp?w=1280&h=720&q=75&format=webp", // Main horizontal
    "https://m.gettywallpapers.com/wp-content/uploads/2023/10/Cool-Cbum-icon.jpg", // Portrait 1
    "https://m.media-amazon.com/images/I/41tzKqvhYYL.jpg", // Portrait 2
    "https://wallpaperbat.com/img/1432837-chris-bumstead-printable-photo.jpg", // Darker/Mood
    "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" // Gym/Details
];

// ─────────────────────────────────────────────
// Sub-Component: Holographic Image Frame
// ─────────────────────────────────────────────
const HolographicFrame = ({ src, alt, scale, className = "" }: { src: string, alt: string, scale: any, className?: string }) => {
    return (
        <div className={`relative w-full h-full p-3 group overflow-hidden bg-black/40 backdrop-blur-md cursor-grab active:cursor-grabbing ${className}`}>

            {/* Frost/Glass Bezel */}
            <div className="absolute inset-[2px] bg-gradient-to-br from-[#111] to-[#000] rounded-sm pointer-events-none border border-white/5" />

            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-30">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-left group-hover:scale-x-150 shadow-[0_0_10px_rgba(255,40,0,0)] group-hover:shadow-[0_0_10px_rgba(255,40,0,0.8)]" />
                <div className="absolute top-0 left-0 w-[2px] h-full bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-top group-hover:scale-y-150" />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-30">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-right group-hover:scale-x-150" />
                <div className="absolute top-0 right-0 w-[2px] h-full bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-top group-hover:scale-y-150" />
            </div>
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-30">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-left group-hover:scale-x-150" />
                <div className="absolute bottom-0 left-0 w-[2px] h-full bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-bottom group-hover:scale-y-150" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none z-30">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-right group-hover:scale-x-150" />
                <div className="absolute bottom-0 right-0 w-[2px] h-full bg-white/30 group-hover:bg-[#ff2800] transition-colors duration-500 origin-bottom group-hover:scale-y-150" />
            </div>

            {/* Inner Content Area */}
            <div className="relative w-full h-full z-10 overflow-hidden bg-black shadow-2xl">

                {/* 1. Base Image - Now Fully Colored & Saturated */}
                <motion.img
                    style={{ scale }}
                    src={src}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover saturate-[1.3] contrast-125 transition-all duration-[800ms] group-hover:scale-110 z-10 pointer-events-none"
                    draggable={false}
                />

                {/* 2. Holographic Glitch Layer - Red (Visible only on hover, translates out) */}
                <motion.img
                    style={{ scale, filter: "hue-rotate(290deg) saturate(3)" }}
                    src={src}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-all duration-300 z-20 mix-blend-screen pointer-events-none group-hover:translate-x-3 group-hover:-translate-y-1"
                />

                {/* 3. Holographic Glitch Layer - Cyan (Visible only on hover, translates out) */}
                <motion.img
                    style={{ scale, filter: "hue-rotate(150deg) saturate(3)" }}
                    src={src}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-all duration-300 z-20 mix-blend-screen pointer-events-none group-hover:-translate-x-3 group-hover:translate-y-2"
                />

                {/* Static TV Noise CRT overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-30"></div>
            </div>

            {/* Ambient inner glow */}
            <div className="absolute inset-3 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,1)] z-40 transition-shadow duration-700 group-hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
        </div>
    );
};

export default function AboutDamnGood() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 1. Magnetic Mouse Effects (3D Tilt)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for the mouse movements
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Convert mouse position (-0.5 to 0.5) into rotation angles (-15deg to 15deg)
    const rotateX = useTransform(springY, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-20deg", "20deg"]);

    // Parallax mouse offsets
    const magneticX1 = useTransform(springX, [-0.5, 0.5], [-40, 40]);
    const magneticY1 = useTransform(springY, [-0.5, 0.5], [-40, 40]);

    const magneticX2 = useTransform(springX, [-0.5, 0.5], [60, -60]);
    const magneticY2 = useTransform(springY, [-0.5, 0.5], [60, -60]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate normalized mouse position from -0.5 (left/top) to 0.5 (right/bottom)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Parallax Logic - Heavier and more distinct speeds for "floating" effect
    // y1: Front layer, moves fastest opposed to scroll
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -350]);
    // y2: Middle layer, moves medium speed
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    // y3: Back layer, moves slowly or slightly with scroll for depth
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    // Interior Image Scaling (Deep Parallax) - Image zooms out as user scrolls down
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1.0]);

    // Mask Variant for sleek entry using clip-path
    const maskVariant: any = {
        hidden: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
        visible: {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1] }
        }
    };

    // For Banner Image Spotlight Mask
    const bannerMouseXBase = useMotionValue(0);
    const bannerMouseYBase = useMotionValue(0);
    const bannerSpotlightHovered = useMotionValue(0);

    // Ultra-smooth spring for the flashlight
    const bannerSpringConfig = { damping: 30, stiffness: 100, mass: 0.8 };
    const bannerMouseX = useSpring(bannerMouseXBase, bannerSpringConfig);
    const bannerMouseY = useSpring(bannerMouseYBase, bannerSpringConfig);
    const maskSize = useSpring(useTransform(bannerSpotlightHovered, [0, 1], [0, 400]), { damping: 25, stiffness: 120 });

    const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        bannerMouseXBase.set(e.clientX - left);
        bannerMouseYBase.set(e.clientY - top);
        bannerSpotlightHovered.set(1);
    };

    const handleBannerMouseLeave = () => {
        bannerSpotlightHovered.set(0);
    };

    // Dynamic Flashlight Radial Mask
    const flashlightMask = useMotionTemplate`radial-gradient(${maskSize}px circle at ${bannerMouseX}px ${bannerMouseY}px, black 20%, transparent 100%)`;

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative bg-deep-black text-white pt-24 pb-0 overflow-hidden font-paragraph selection:bg-red-600 selection:text-white"
        >
            {/* Top Navigation Strip Imitation */}
            <div className="px-4 md:px-8 flex flex-wrap justify-between items-center text-xs md:text-sm tracking-widest uppercase border-b border-white/10 pb-6 mb-20 text-gray-400">
                <div className="hover:text-white transition-colors cursor-pointer tracking-[0.2em]">Dashboard</div>
                <div className="text-white line-through decoration-red-600 decoration-2 tracking-[0.2em]">About</div>
                <div className="font-extrabold text-white text-xl tracking-[0.3em] mx-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">CBUM</div>
                <div className="hover:text-white transition-colors cursor-pointer tracking-[0.2em]">Hypeboard</div>
                <div className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                    <span className="tracking-[0.2em]">Let's Work</span>
                    <ArrowUpRight size={14} className="text-red-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
            </div>

            <div className="px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                {/* Left Content Area - Typography */}
                <div className="lg:col-span-7 flex flex-col justify-between relative z-10 pointer-events-none">
                    <div>
                        <div className="mb-8 cursor-default">
                            {["PURE", "AESTHETIC", "POWER"].map((word, i) => (
                                <motion.div
                                    key={i}
                                    className="overflow-hidden flex"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: { staggerChildren: 0.1, delayChildren: i * 0.3 }
                                        }
                                    }}
                                >
                                    {word.split('').map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            variants={{
                                                hidden: { y: "100%", rotateX: -90, opacity: 0, filter: "blur(10px)" },
                                                visible: { y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } }
                                            }}
                                            whileHover={{ scale: 1.1, translateY: -10, color: i === 2 ? '#ff0000' : '#ffffff', textShadow: i === 2 ? '0 0 20px rgba(255,0,0,0.8)' : '0 0 20px rgba(255,255,255,0.8)', transition: { duration: 0.2 } }}
                                            className={`text-[14vw] lg:text-[8rem] leading-[0.85] font-black tracking-tighter uppercase inline-block ${i === 2
                                                ? "text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                                : "text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
                                                }`}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                            className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl leading-relaxed space-y-6"
                        >
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }}>
                                Defining greatness through <span className="text-white font-semibold border-b-2 border-red-600 uppercase tracking-widest text-sm relative group inline-block">
                                    <span className="relative z-10 transition-colors group-hover:text-red-600">discipline</span>
                                    <span className="absolute inset-x-0 bottom-0 h-0 bg-red-600/20 transition-all duration-300 group-hover:h-full z-0"></span>
                                </span> and execution.
                            </motion.p>
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-400 text-lg">
                                We don't just participate; we dominate. Every rep, every line of code, every pixel is crafted with an obsession for perfection.
                            </motion.p>
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-400 text-lg">
                                In a world of noise, clarity is violence. We engineer intelligence that doesn't just process information—it <span className="text-white font-syne font-bold italic">commands attention</span> and <span className="text-[#ff2800] font-medium">dictates the future</span>.
                            </motion.p>
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-400 text-lg border-l-2 border-red-600/50 pl-4 mt-4">
                                "The iron doesn't lie, and neither does the compiler. You either put in the work, or you fail. Zero excuses. Absolute accountability."
                            </motion.p>
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-400 text-lg mt-4">
                                The average seek comfort. We seek the friction that forces growth. Every bottleneck is a challenge; every challenge is an opportunity to conquer.
                            </motion.p>
                            <motion.p whileHover={{ x: 10, color: "#fff" }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-400 text-lg">
                                Visuals that strike like lightning. Systems that run like a finely tuned <span className="text-white font-bold">V12 engine</span>. We build the apex.
                            </motion.p>
                        </motion.div>
                    </div>

                    <div className="mt-20 flex gap-12 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col group cursor-default"
                        >
                            <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-white group-hover:bg-red-600 transition-colors duration-500 drop-shadow-lg">5x</span>
                            <span className="text-sm text-gray-400 uppercase tracking-[0.3em] mt-4 border-t border-white/10 pt-4 inline-block group-hover:border-red-600 transition-colors duration-500 group-hover:text-white">Mr. Olympia</span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col group cursor-default"
                        >
                            <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-white group-hover:bg-red-600 transition-colors duration-500 drop-shadow-lg">100%</span>
                            <span className="text-sm text-gray-400 uppercase tracking-[0.3em] mt-4 border-t border-white/10 pt-4 inline-block group-hover:border-red-600 transition-colors duration-500 group-hover:text-white">Dedication</span>
                        </motion.div>
                    </div>
                </div>

                {/* Right Content Area - Images & Collage */}
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="lg:col-span-5 relative h-[600px] lg:h-[1000px] w-full perspective-1000 mt-12 lg:mt-0 z-50 mix-blend-normal"
                >
                    {/* Image 1 - Main Anchor (Middle Speed) */}
                    <motion.div
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.8}
                        whileDrag={{ scale: 1.1, zIndex: 999, rotate: 0 }}
                        style={{ y: y2, x: magneticX1, z: 50 }}
                        className="absolute top-20 right-0 w-[80%] aspect-[3/4] shadow-[0_50px_100px_rgba(0,0,0,0.9)] rotate-[-3deg] hover:rotate-0 transition-transform duration-[800ms]"
                        variants={maskVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <HolographicFrame src={images[1]} alt="Dominance" scale={imageScale} />
                    </motion.div>

                    {/* Image 2 - Top Left (Fastest / Front) */}
                    <motion.div
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.8}
                        whileDrag={{ scale: 1.1, zIndex: 999, rotate: 0 }}
                        style={{ y: y1, x: magneticX2, z: 120 }}
                        className="absolute top-0 -left-10 w-[60%] aspect-square shadow-[0_50px_100px_rgba(0,0,0,0.9)] rotate-[6deg] hover:rotate-0 transition-transform duration-[800ms]"
                        variants={maskVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.1 }}
                    >
                        <HolographicFrame src={images[2]} alt="Focus" scale={imageScale} />
                    </motion.div>

                    {/* Image 3 - Bottom (Slowest / Back) */}
                    <motion.div
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.8}
                        whileDrag={{ scale: 1.1, zIndex: 999, rotate: 0 }}
                        style={{ y: y3, x: magneticY1, z: 0 }}
                        className="absolute bottom-40 left-10 w-[70%] aspect-video shadow-[0_50px_100px_rgba(0,0,0,0.9)] rotate-[4deg] hover:rotate-0 transition-transform duration-[800ms]"
                        variants={maskVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                    >
                        <HolographicFrame src={images[0]} alt="Legacy" scale={imageScale} />

                        <div className="absolute -bottom-4 -right-4 text-[10px] text-white bg-red-600 px-3 py-1 font-bold tracking-[0.2em] uppercase z-50 pointer-events-none">
                            Raw Footage
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* FULL WIDTH BANNER - ADVANCED X-RAY FLASHLIGHT REVEAL */}
            <div
                className="mt-32 relative w-full h-[50vh] md:h-[80vh] overflow-hidden group cursor-none"
                onMouseMove={handleBannerMouseMove}
                onMouseLeave={handleBannerMouseLeave}
            >
                {/* --- LAYER 1: BASE (Grayscale, Dark, Outlined Text) --- */}
                {/* Dark fog fade at the top */}
                <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-transparent to-deep-black z-10 pointer-events-none opacity-80"></div>

                {/* Base Parallax Grapscale Image */}
                <motion.div style={{ y: y2, scale: imageScale }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
                    <img
                        src={images[3]}
                        alt="Bumstead Background Base"
                        className="w-full h-full object-cover object-center grayscale opacity-15"
                        draggable={false}
                    />
                </motion.div>

                {/* Base Text (Transparent Fill, White/Gray Outline) */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none select-none">
                    <div className="flex flex-col items-center justify-center w-full">
                        <motion.h3
                            initial={{ y: "50%", opacity: 0 }}
                            whileInView={{ y: "0%", opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                            className="text-[12vw] md:text-[10vw] leading-[0.8] font-black uppercase tracking-tighter text-transparent"
                            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}
                        >
                            Build your
                        </motion.h3>
                        <motion.h3
                            initial={{ y: "50%", opacity: 0 }}
                            whileInView={{ y: "0%", opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
                            className="text-[14vw] md:text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-transparent mt-[-1vw]"
                            style={{ WebkitTextStroke: '2px rgba(220,38,38,0.2)' }}
                        >
                            Legacy
                        </motion.h3>
                    </div>
                </div>


                {/* --- LAYER 2: SPOTLIGHT REVEAL (Highly Saturated, Filled Text) --- */}
                {/* This entire container is masked by a radial gradient centered on the mouse! */}
                <motion.div
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={{ WebkitMaskImage: flashlightMask, maskImage: flashlightMask }}
                >
                    {/* Saturated Image behind */}
                    <motion.div style={{ y: y2, scale: imageScale }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
                        <img
                            src={images[3]}
                            alt="Bumstead Background Color"
                            className="w-full h-full object-cover object-center saturate-[1.8] contrast-125 brightness-110"
                            draggable={false}
                        />
                        {/* Red vignette to make it ultra premium */}
                        <div className="absolute inset-0 bg-red-900/40 mix-blend-color-burn"></div>
                    </motion.div>

                    {/* Filled Solid Text Component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center w-full">
                            <h3 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                                Build your
                            </h3>
                            <h3 className="text-[14vw] md:text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-[#ff2800] drop-shadow-[0_0_40px_rgba(255,40,0,1)] mt-[-1vw]">
                                Legacy
                            </h3>
                        </div>
                    </div>
                </motion.div>

                {/* Scanline CRT overlay over the whole banner to tie it together */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 pointer-events-none mix-blend-overlay z-40"></div>

                {/* Custom glowing cursor sphere that follows the mouse inside this section only */}
                <motion.div
                    className="absolute z-50 rounded-full bg-white mix-blend-difference pointer-events-none"
                    style={{
                        width: '20px',
                        height: '20px',
                        x: bannerMouseX,
                        y: bannerMouseY,
                        translateX: "-50%",
                        translateY: "-50%",
                        opacity: bannerSpotlightHovered,
                        scale: useTransform(bannerSpotlightHovered, [0, 1], [0.5, 1])
                    }}
                />
            </div>

            {/* Ambient vignette shadow over the whole section to blend easily into footer */}
            <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-deep-black to-transparent pointer-events-none z-50"></div>
        </section>
    );
}
