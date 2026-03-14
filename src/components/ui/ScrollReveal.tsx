import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
    children: React.ReactNode;
    /** Animation direction: 'up' | 'left' | 'right' | 'down' */
    direction?: 'up' | 'left' | 'right' | 'down';
    /** Distance to travel (px) */
    distance?: number;
    /** Animation duration (seconds) */
    duration?: number;
    /** Stagger delay for child elements (seconds) */
    stagger?: number;
    /** Delay before animation starts (seconds) */
    delay?: number;
    /** Additional class names */
    className?: string;
    /** Whether to animate children individually */
    staggerChildren?: boolean;
}

/**
 * ScrollReveal — Wraps content to fade in + slide as it enters the viewport.
 * Uses GSAP ScrollTrigger for precise, performant scroll-driven animations.
 */
export default function ScrollReveal({
    children,
    direction = 'up',
    distance = 60,
    duration = 1,
    stagger = 0.1,
    delay = 0,
    className = '',
    staggerChildren = false,
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Calculate the starting position based on direction
        const fromVars: gsap.TweenVars = {
            opacity: 0,
            ...(direction === 'up' && { y: distance }),
            ...(direction === 'down' && { y: -distance }),
            ...(direction === 'left' && { x: distance }),
            ...(direction === 'right' && { x: -distance }),
        };

        const toVars: gsap.TweenVars = {
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
            },
        };

        if (staggerChildren) {
            // Animate each direct child with stagger
            const children = el.children;
            gsap.fromTo(children, fromVars, {
                ...toVars,
                stagger,
            });
        } else {
            // Animate the container itself
            gsap.fromTo(el, fromVars, toVars);
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [direction, distance, duration, stagger, delay, staggerChildren]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
