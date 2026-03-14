import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — Lenis-based smooth scrolling provider.
 * Gives the site the "silky", momentum-based scroll feel seen in premium designs.
 * ★ Properly syncs Lenis with GSAP ScrollTrigger so pinning works correctly.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // ★ Sync Lenis → GSAP ScrollTrigger (proper module import)
        lenis.on('scroll', ScrollTrigger.update);

        // ★ Drive Lenis from GSAP ticker for frame-perfect sync
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf as any);
        };
    }, []);

    return <div data-lenis-prevent={false}>{children}</div>;
}
