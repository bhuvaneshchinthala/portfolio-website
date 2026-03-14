import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransitionStore } from '@/lib/store';

export default function PageTransition() {
    const { isTransitioning, targetSection, endTransition } = useTransitionStore();

    useEffect(() => {
        if (isTransitioning && targetSection) {
            // Wait for curtain to cover (0.8s animation), then scroll
            const timeout = setTimeout(() => {
                const element = document.getElementById(targetSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto' }); // Instant scroll while covered
                }
                // Small delay before lifting curtain
                setTimeout(() => {
                    endTransition();
                }, 300);
            }, 800);

            return () => clearTimeout(timeout);
        }
    }, [isTransitioning, targetSection, endTransition]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1], // Cinematic bezier
                    }}
                >
                    {/* Main Curtain Panel */}
                    <div className="absolute inset-0 bg-deep-black w-full h-full" />

                    {/* Optional: Brand / Loading Indicator if desired */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.4 } }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 font-heading text-white text-2xl tracking-widest font-bold"
                    >
                        LOADING...
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
