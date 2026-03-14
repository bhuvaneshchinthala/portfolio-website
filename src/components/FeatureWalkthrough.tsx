import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import TextMotionOverlay from '@/components/TextMotionOverlay';

interface Feature {
    id: number;
    title: string;
    description: string;
    statistic: string;
    statLabel: string;
    icon: React.ElementType;
    gradient: string;
}

const features: Feature[] = [
    {
        id: 1,
        title: "Instant Intent Analysis",
        description: "Our AI engine processes user behavior in real-time, predicting intent with 99.8% accuracy before they even click.",
        statistic: "500",
        statLabel: "% Faster Analysis",
        icon: Zap,
        gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20"
    },
    {
        id: 2,
        title: "Smart Context Awareness",
        description: "Understand the 'why' behind every action. We aggregate thousands of data points to build a comprehensive user profile instantly.",
        statistic: "2.4",
        statLabel: "x Conversion Lift",
        icon: TrendingUp,
        gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20"
    },
];

const CountUp = ({ to, suffix = "", prefix = "" }: { to: number | string, suffix?: string, prefix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-10%" });
    const numericValue = parseFloat(to.toString().replace(/,/g, ''));

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (isInView) {
            const controls = animate(0, numericValue, {
                duration: 2,
                ease: "easeOut",
                onUpdate: (value) => {
                    if (Math.floor(value) === value) {
                        node.textContent = `${prefix}${Math.floor(value).toLocaleString()}${suffix}`;
                    } else {
                        node.textContent = `${prefix}${value.toFixed(1)}${suffix}`;
                    }
                }
            });
            return () => controls.stop();
        } else {
            node.textContent = `${prefix}0${suffix}`;
        }
    }, [isInView, numericValue, prefix, suffix]);

    return <span ref={ref} className="tabular-nums">{prefix}0{suffix}</span>;
};

const FeatureCard = ({
    feature,
    progress,
    i,
    total
}: {
    feature: Feature;
    progress: any;
    i: number;
    total: number;
}) => {
    // Range logic - strictly monotonic
    const rangeStart = i * (1 / total);
    const rangeEnd = rangeStart + (1 / total);

    // Simplest possible monotonic range for debugging
    const opacity = useTransform(
        progress,
        [rangeStart, rangeEnd],
        [1, 0] // Fade out as we scroll through
    );

    return (
        <motion.div
            style={{
                opacity,
                // scale,
                // y,
                // rotateX,
                // z,
                // transformPerspective: 1000
            }}
            className="absolute top-0 w-full max-w-5xl mx-auto left-0 right-0 p-8 md:p-12"
        >
            <div className="relative rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-white/20 transition-colors duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Visual Side */}
                    <div className="flex-1 w-full order-2 md:order-1">
                        <div className="relative aspect-video rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center group/visual">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />

                            <div className="text-center z-10">
                                <div className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-2">
                                    <CountUp to={feature.statistic} suffix={feature.statLabel.includes('%') ? '%' : ''} />
                                </div>
                                <p className="text-white/50 text-sm uppercase tracking-widest font-medium">
                                    {feature.statLabel.replace('%', '')}
                                </p>
                            </div>

                            {/* Animated Grid Background */}
                            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 space-y-8 order-1 md:order-2">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur shadow-inner">
                            {React.createElement(feature.icon, { className: "w-7 h-7 text-white" })}
                        </div>

                        <div>
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                                <TextMotionOverlay
                                    text={feature.title}
                                    className="text-white"
                                />
                            </h3>
                            <p className="text-lg text-white/50 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </div>

                        <div className="h-1 w-20 bg-gradient-to-r from-white/50 to-transparent rounded-full" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProgressIndicatorItem = ({ i, total, scrollYProgress }: { i: number, total: number, scrollYProgress: any }) => {
    const scaleX = useTransform(
        scrollYProgress,
        [i * (1 / total), (i + 1) * (1 / total)],
        [0, 1]
    );

    return (
        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-white"
                style={{
                    scaleX,
                    transformOrigin: "left"
                }}
            />
        </div>
    );
};

const FeatureWalkthrough = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-deep-black w-full">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden perspective-1000">

                {/* Cinematic Background Elements */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]),
                            backgroundPosition: useTransform(scrollYProgress, [0, 1], ["0% 0%", "0% 100%"])
                        }}
                        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
                </div>

                {/* Section Title - Fades out */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
                        scale: useTransform(scrollYProgress, [0, 0.1], [1, 0.8]),
                        y: useTransform(scrollYProgress, [0, 0.1], [0, -50])
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0"
                >
                    <h2 className="text-xs font-bold tracking-[0.3em] text-indigo-400 uppercase mb-6 animate-pulse">
                        System Architecture
                    </h2>
                    <h3 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 tracking-tighter">
                        THE CORE.
                    </h3>
                </motion.div>

                {/* Cards Container */}
                <div className="relative w-full max-w-7xl h-[600px] flex items-center justify-center perspective-1000">
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                            progress={scrollYProgress}
                            i={i}
                            total={features.length}
                        />
                    ))}
                </div>

                {/* Progress Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    {features.map((_, i) => (
                        <ProgressIndicatorItem
                            key={i}
                            i={i}
                            total={features.length}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeatureWalkthrough;
