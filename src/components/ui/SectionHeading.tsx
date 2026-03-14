import { motion } from 'framer-motion';

interface SectionHeadingProps {
    number: string;
    title: React.ReactNode | string;
    titleHighlight?: string; // e.g., "ME", "TERMINAL", "ME"
    label?: string;
    className?: string;
}

export default function SectionHeading({ number, title, titleHighlight, label, className = '' }: SectionHeadingProps) {
    return (
        <div className={`relative flex flex-col items-center justify-center py-20 md:py-32 ${className}`}>
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Radial Spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // smooth ease-out
                className="relative z-10 flex flex-col items-center text-center"
            >
                {/* Pill Label */}
                {label && (
                    <div className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-accent uppercase">
                            {label}
                        </span>
                    </div>
                )}

                {/* Main Split-Color Title */}
                <h2 className="font-sans text-5xl md:text-7xl font-black tracking-tighter uppercase flex items-center flex-wrap justify-center">
                    <span className="text-white drop-shadow-md">{title}</span>
                    {titleHighlight && (
                        <span className="text-[#CC0000] ml-3 drop-shadow-[0_0_15px_rgba(204,0,0,0.6)]">
                            {titleHighlight}
                        </span>
                    )}
                </h2>

                {/* Decorative Line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: 100, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-px bg-gradient-to-r from-transparent via-accent to-transparent mt-8"
                />
            </motion.div>
        </div>
    );
}
