import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FlippingRedomediaCard() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[2.5/1] max-w-[1400px] mx-auto rounded-3xl cursor-pointer"
            style={{ perspective: 2500 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(!isHovered)}
        >
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: isHovered ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT FACE (Red Sand Dune) */}
                <div 
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40"
                    style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1542401886-65d6c61db217?q=100&w=2400&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Subtle inner shadow overlay for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                </div>

                {/* BACK FACE (Typography) */}
                <div 
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 flex flex-col items-center justify-center p-8 text-center"
                    style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {/* Background Noise on Back */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwaC0yMHYtMjB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=")'}} />
                    
                    <h2 className="relative z-10 text-[6vw] md:text-[5vw] lg:text-[4.5vw] font-serif font-medium italic tracking-tight leading-[1.1] text-white">
                        <span className="text-[#A3A3A3]">Rethink.</span> <br className="md:hidden" />
                        <span className="text-white">Reimagine.</span> <br className="md:hidden" />
                        <span className="text-[#ff2800] not-italic font-sans font-black tracking-tighter uppercase relative">
                            Redo.
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#ff2800] rounded-full" />
                        </span>
                    </h2>
                </div>
            </motion.div>
        </div>
    );
}
