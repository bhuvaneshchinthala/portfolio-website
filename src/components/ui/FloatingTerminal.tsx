import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LOG_MESSAGES = [
    "SYS > Initializing core visual matrices...",
    "SYS > Booting GL thread... [OK]",
    "NET > Establishing sub-routines...",
    "AI > Loading neural weights: [|||||||||| 100%]",
    "SYS > Memory allocation optimized.",
    "USR > Bhuvanesh initialized.",
    "NET > Secure connection established.",
    "AI > Ready for input."
];

export default function FloatingTerminal() {
    const [logs, setLogs] = useState<string[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < LOG_MESSAGES.length) {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev.slice(-3), LOG_MESSAGES[index]]); // Keep max 4 logs
                setIndex(prev => prev + 1);
            }, Math.random() * 800 + 400); // Random delay between 400-1200ms
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            className="fixed bottom-8 right-8 z-[100] w-64 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4 font-mono text-[10px] uppercase text-white/50 tracking-widest hidden lg:block cursor-move shadow-2xl"
        >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[#ff2800]">HUD.v1</span>
            </div>

            <div className="flex flex-col space-y-2 h-20 overflow-hidden justify-end">
                {logs.map((log, i) => (
                    <motion.div
                        key={`${i}-${log}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`whitespace-nowrap overflow-hidden text-ellipsis ${i === logs.length - 1 ? 'text-white/90' : 'text-white/40'}`}
                    >
                        {log}
                    </motion.div>
                ))}
                {index < LOG_MESSAGES.length && (
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-3 bg-[#ff2800] mt-1"
                    />
                )}
            </div>
        </motion.div>
    );
}
