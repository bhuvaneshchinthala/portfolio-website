import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.87, 0, 0.13, 1] as const;

export default function IntroLoader({ onDone }: { onDone: () => void }) {
    const [phase, setPhase] = useState<'loading' | 'burst' | 'exit'>('loading');
    const [count, setCount] = useState(0);
    const [techData, setTechData] = useState<string[]>([]);

    useEffect(() => {
        let start = performance.now();
        let frame: number;
        const duration = 2500; // 2.5s for counting

        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            // Strong ease out
            const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

            setCount(Math.floor(ease * 100));

            // Generate some random tech data strings
            if (Math.random() > 0.8) {
                setTechData(prev => {
                    const newArr = [...prev, `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`];
                    return newArr.slice(-5);
                });
            }

            if (p < 1) {
                frame = requestAnimationFrame(tick);
            }
        };
        frame = requestAnimationFrame(tick);

        const t1 = setTimeout(() => setPhase('burst'), 2800);
        const t2 = setTimeout(() => setPhase('exit'), 4200);
        const t3 = setTimeout(onDone, 4600);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onDone]);

    return (
        <AnimatePresence>
            {phase !== 'exit' && (
                <div
                    key="loader"
                    className="fixed inset-0 z-[99999] bg-transparent flex flex-col items-center justify-center overflow-hidden pointer-events-none"
                >
                    {/* Top Split Door */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/2 bg-[#030303] z-10 origin-top overflow-hidden"
                        initial={{ y: '0%' }}
                        animate={phase === 'burst' ? { y: '-100%' } : { y: '0%' }}
                        transition={{ duration: 1.2, ease: EASE_IN_OUT }}
                        style={{ borderBottom: '1px solid rgba(255, 40, 0, 0.2)' }}
                    >
                        {/* Background subtle grid on top door */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                backgroundPosition: 'center bottom'
                            }}
                        />
                    </motion.div>

                    {/* Bottom Split Door */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#030303] z-10 origin-bottom overflow-hidden"
                        initial={{ y: '0%' }}
                        animate={phase === 'burst' ? { y: '100%' } : { y: '0%' }}
                        transition={{ duration: 1.2, ease: EASE_IN_OUT }}
                        style={{ borderTop: '1px solid rgba(255, 40, 0, 0.2)' }}
                    >
                        {/* Background subtle grid on bottom door */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                backgroundPosition: 'center top'
                            }}
                        />
                    </motion.div>

                    {/* Center Content (Fades out when doors open) */}
                    <motion.div
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center w-full px-6 pointer-events-none"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={phase === 'loading' ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
                        transition={{ duration: 0.8, ease: EASE_OUT }}
                    >
                        {/* Main Typography & Mask Fill Update */}
                        <div className="relative mb-16 select-none flex flex-col items-center">
                            {/* Outline Text (Background) */}
                            <div className="flex flex-col items-center justify-center opacity-20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent' }}>
                                <h1 className="font-black uppercase m-0 leading-none whitespace-nowrap text-[clamp(2.5rem,8vw,6rem)] tracking-tight font-[Syne]">BHUVANESH</h1>
                                <h1 className="font-black uppercase m-0 leading-none whitespace-nowrap text-[clamp(2.5rem,8vw,6rem)] tracking-tight font-[Syne]">CHINTHALA</h1>
                            </div>

                            {/* Solid Text filling from left */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white overflow-hidden">
                                <div
                                    className="w-full flex-col flex items-center h-full whitespace-nowrap transition-all duration-75 ease-out"
                                    style={{ clipPath: `inset(0 ${100 - count}% 0 0)` }}
                                >
                                    <h1 className="font-black uppercase m-0 leading-none text-[clamp(2.5rem,8vw,6rem)] tracking-tight font-[Syne] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">BHUVANESH</h1>
                                    <h1 className="font-black uppercase m-0 leading-none text-[clamp(2.5rem,8vw,6rem)] tracking-tight font-[Syne] text-[#ff2800] drop-shadow-[0_0_20px_rgba(255,40,0,0.6)]">CHINTHALA</h1>
                                </div>

                                {/* The scanning laser that moves with the percentage */}
                                <div
                                    className="absolute top-[-20%] bottom-[-20%] w-[2px] bg-white opacity-80"
                                    style={{
                                        left: `${count}%`,
                                        boxShadow: '0 0 15px 2px #ff2800, 0 0 5px 1px white',
                                        transition: 'left 0.1s ease-out',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Progress Bar & percentage */}
                        <div className="w-full max-w-[500px] flex flex-col gap-3">
                            <div className="flex justify-between items-end font-mono text-xs text-white/50 tracking-[0.2em] uppercase">
                                <div>System Architecture</div>
                                <div className="text-xl text-white font-bold tracking-normal">{count}<span className="text-[#ff2800] ml-1">%</span></div>
                            </div>

                            {/* The sleek line bar */}
                            <div className="relative h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-[#ff2800] rounded-full"
                                    style={{ width: `${count}%`, filter: 'drop-shadow(0 0 8px #ff2800)' }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Side Info (Tech Data) */}
                    <motion.div
                        className="absolute left-8 bottom-8 z-30 font-mono text-[10px] text-white/30 hidden md:flex flex-col gap-1 items-start max-w-[200px]"
                        animate={phase === 'loading' ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[#ff2800]/80 mb-2 font-bold tracking-[0.3em]">MEMORY_ALLOC</span>
                        {techData.map((data, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="uppercase tracking-[0.2em]"
                            >
                                INDEX_{data} : SECURE
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.div
                        className="absolute right-8 bottom-8 z-30 font-mono text-[10px] text-white/30 hidden md:flex flex-col gap-1 items-end"
                        animate={phase === 'loading' ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[#ff2800]/80 mb-2 font-bold tracking-[0.3em]">INITIALIZING</span>
                        <div className="flex items-center gap-2 tracking-[0.2em]"><span>V_2.0</span><div className="w-1 h-1 bg-[#ff2800] shadow-[0_0_5px_#ff2800]"></div></div>
                        <div className="flex items-center gap-2 tracking-[0.2em]"><span>AI_CORE</span><div className="w-1 h-1 bg-[#ff2800] shadow-[0_0_5px_#ff2800]"></div></div>
                        <div className="flex items-center gap-2 tracking-[0.2em]"><span>SYNC_REQ</span><div className="w-1 h-1 bg-[#ff2800] shadow-[0_0_5px_#ff2800]"></div></div>
                    </motion.div>

                    {/* Flash effect when doors open */}
                    <AnimatePresence>
                        {phase === 'burst' && (
                            <motion.div
                                key="flash"
                                className="absolute inset-0 bg-white z-[90] pointer-events-none"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: EASE_OUT }}
                            />
                        )}
                    </AnimatePresence>

                </div>
            )}
        </AnimatePresence>
    );
}
